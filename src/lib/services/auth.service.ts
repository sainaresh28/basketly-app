import { v4 as uuidv4 } from 'uuid';
import { UserRepository, type UserRecord } from '@/lib/repositories/user.repository';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createSessionToken } from '@/lib/auth/session';
import { generateResetToken, hashResetToken, safeCompareHashes, RESET_TOKEN_TTL_MS } from '@/lib/auth/reset-token';
import { ConflictError, UnauthorizedError, NotFoundError } from '@/lib/errors/app-error';
import type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  AddressInput,
  AddressUpdateInput,
} from '@/lib/validation/schemas';
import type { Address, User } from '@/types';
import { DEFAULT_USER_PREFERENCES } from '@/types';

function toPublicUser(record: UserRecord): User {
  // Never leak the password hash to the client.
  const { passwordHash: _passwordHash, ...publicUser } = record;
  return publicUser;
}

function mergePreferences(stored?: User['preferences']): NonNullable<User['preferences']> {
  return {
    theme: stored?.theme ?? DEFAULT_USER_PREFERENCES.theme,
    personalizedRecommendations: stored?.personalizedRecommendations ?? DEFAULT_USER_PREFERENCES.personalizedRecommendations,
    notifications: { ...DEFAULT_USER_PREFERENCES.notifications, ...stored?.notifications },
  };
}

export const AuthService = {
  async register(input: RegisterInput): Promise<{ user: User; token: string }> {
    const existing = await UserRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('An account with that email already exists');
    }

    const now = new Date().toISOString();
    const record: UserRecord = {
      id: uuidv4(),
      name: input.name,
      email: input.email,
      // Every self-service signup is a customer — admin accounts are never
      // created through this form; they're promoted separately (see
      // scripts/make-admin.ts) and sign in through this same page.
      role: 'customer',
      passwordHash: await hashPassword(input.password),
      addresses: [],
      createdAt: now,
      updatedAt: now,
    };

    await UserRepository.create(record);
    const token = await createSessionToken({ userId: record.id, email: record.email, name: record.name, role: record.role || 'customer' });
    return { user: toPublicUser(record), token };
  },

  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    const record = await UserRepository.findByEmail(input.email);
    if (!record) {
      throw new UnauthorizedError('Invalid email or password');
    }
    const valid = await verifyPassword(input.password, record.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }
    const token = await createSessionToken({ userId: record.id, email: record.email, name: record.name, role: record.role || 'customer' });
    return { user: toPublicUser(record), token };
  },

  /**
   * Issues a password-reset token for the given email, if an account exists.
   * Always resolves the same way regardless of whether the email is
   * registered, so the API can't be used to find out which emails have
   * accounts. The reset link is only ever returned here, not sent anywhere —
   * callers (the route handler) decide how it reaches the user.
   */
  async requestPasswordReset(email: string): Promise<{ resetUrl: string } | null> {
    const record = await UserRepository.findByEmail(email);
    if (!record) return null;

    const { rawToken, tokenHash } = generateResetToken();
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();
    await UserRepository.setResetToken(record.id, tokenHash, expiresAt);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const resetUrl = `${siteUrl}/reset-password?uid=${record.id}&token=${rawToken}`;
    return { resetUrl };
  },

  async resetPassword(uid: string, token: string, newPassword: string): Promise<void> {
    const record = await UserRepository.findById(uid);
    const tokenHash = hashResetToken(token);
    const isValid =
      !!record &&
      !!record.resetTokenHash &&
      safeCompareHashes(record.resetTokenHash, tokenHash) &&
      !!record.resetTokenExpiresAt &&
      new Date(record.resetTokenExpiresAt).getTime() > Date.now();

    if (!isValid) {
      throw new UnauthorizedError('This reset link is invalid or has expired. Request a new one.');
    }

    await UserRepository.setPassword(uid, await hashPassword(newPassword));
  },

  async getProfile(userId: string): Promise<User | null> {
    const record = await UserRepository.findById(userId);
    if (!record) return null;
    const user = toPublicUser(record);
    return { ...user, preferences: mergePreferences(user.preferences) };
  },

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    const record = await UserRepository.findById(userId);
    if (!record) throw new NotFoundError('Account not found');

    const patch: Partial<Pick<User, 'name' | 'phone' | 'preferences'>> = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.phone !== undefined) patch.phone = input.phone || undefined;
    if (input.preferences !== undefined) {
      const current = mergePreferences(record.preferences);
      patch.preferences = {
        theme: input.preferences.theme ?? current.theme,
        personalizedRecommendations: input.preferences.personalizedRecommendations ?? current.personalizedRecommendations,
        notifications: { ...current.notifications, ...input.preferences.notifications },
      };
    }

    await UserRepository.update(userId, patch);
    return { ...toPublicUser(record), ...patch };
  },

  // --- Address book -----------------------------------------------------
  async listAddresses(userId: string): Promise<Address[]> {
    const record = await UserRepository.findById(userId);
    if (!record) throw new NotFoundError('Account not found');
    return record.addresses || [];
  },

  async addAddress(userId: string, input: AddressInput): Promise<Address[]> {
    const record = await UserRepository.findById(userId);
    if (!record) throw new NotFoundError('Account not found');

    const addresses = [...(record.addresses || [])];
    const isFirst = addresses.length === 0;
    const newAddress: Address = { id: uuidv4(), ...input, isDefault: input.isDefault ?? isFirst };

    if (newAddress.isDefault) {
      addresses.forEach((a) => (a.isDefault = false));
    }
    addresses.push(newAddress);

    await UserRepository.setAddresses(userId, addresses);
    return addresses;
  },

  async updateAddress(userId: string, addressId: string, input: AddressUpdateInput): Promise<Address[]> {
    const record = await UserRepository.findById(userId);
    if (!record) throw new NotFoundError('Account not found');

    const addresses = [...(record.addresses || [])];
    const idx = addresses.findIndex((a) => a.id === addressId);
    if (idx === -1) throw new NotFoundError('Address not found');

    if (input.isDefault) {
      addresses.forEach((a) => (a.isDefault = false));
    }
    addresses[idx] = { ...addresses[idx], ...input, id: addressId };

    await UserRepository.setAddresses(userId, addresses);
    return addresses;
  },

  async deleteAddress(userId: string, addressId: string): Promise<Address[]> {
    const record = await UserRepository.findById(userId);
    if (!record) throw new NotFoundError('Account not found');

    const existing = record.addresses || [];
    if (!existing.some((a) => a.id === addressId)) throw new NotFoundError('Address not found');

    const wasDefault = existing.find((a) => a.id === addressId)?.isDefault;
    const addresses = existing.filter((a) => a.id !== addressId);
    if (wasDefault && addresses.length > 0) addresses[0].isDefault = true;

    await UserRepository.setAddresses(userId, addresses);
    return addresses;
  },
};

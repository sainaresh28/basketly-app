import { UserRepository, type UserRecord } from '@/lib/repositories/user.repository';
import { CartRepository } from '@/lib/repositories/cart.repository';
import { WishlistRepository } from '@/lib/repositories/wishlist.repository';
import { OrderRepository } from '@/lib/repositories/order.repository';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/errors/app-error';
import type { AdminUserUpdateInput } from '@/lib/validation/schemas';
import type { User } from '@/types';

/** Never leak the password hash (or reset-token internals) to the client. */
function toPublicUser(record: UserRecord): User {
  const { passwordHash: _passwordHash, resetTokenHash: _resetTokenHash, resetTokenExpiresAt: _resetTokenExpiresAt, ...publicUser } = record;
  return publicUser;
}

export interface AdminUserSummary extends User {
  createdAt: string;
  cartItemCount: number;
  wishlistItemCount: number;
  orderCount: number;
}

export const UserService = {
  async listAll(): Promise<AdminUserSummary[]> {
    const [users, cartItems, wishlistItems, orders] = await Promise.all([
      UserRepository.findAll(),
      CartRepository.findAll(),
      WishlistRepository.findAll(),
      OrderRepository.findAll(),
    ]);

    const cartCounts = new Map<string, number>();
    for (const item of cartItems) cartCounts.set(item.userId, (cartCounts.get(item.userId) ?? 0) + 1);

    const wishlistCounts = new Map<string, number>();
    for (const item of wishlistItems) wishlistCounts.set(item.userId, (wishlistCounts.get(item.userId) ?? 0) + 1);

    const orderCounts = new Map<string, number>();
    for (const order of orders) orderCounts.set(order.userId, (orderCounts.get(order.userId) ?? 0) + 1);

    return users
      .map((u) => ({
        ...toPublicUser(u),
        createdAt: u.createdAt,
        cartItemCount: cartCounts.get(u.id) ?? 0,
        wishlistItemCount: wishlistCounts.get(u.id) ?? 0,
        orderCount: orderCounts.get(u.id) ?? 0,
      }))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async getById(id: string): Promise<User & { createdAt: string }> {
    const user = await UserRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return { ...toPublicUser(user), createdAt: user.createdAt };
  },

  async update(id: string, actingAdminId: string, patch: AdminUserUpdateInput): Promise<User> {
    const existing = await UserRepository.findById(id);
    if (!existing) throw new NotFoundError('User not found');

    // Prevent an admin from demoting themselves and getting locked out.
    if (patch.role && patch.role !== 'admin' && id === actingAdminId) {
      throw new ValidationError("You can't remove your own admin access");
    }

    await UserRepository.update(id, patch);
    const updated = await UserRepository.findById(id);
    return toPublicUser(updated!);
  },

  async delete(id: string, actingAdminId: string): Promise<void> {
    if (id === actingAdminId) {
      throw new ConflictError("You can't delete your own account while signed in as it");
    }
    const existing = await UserRepository.findById(id);
    if (!existing) throw new NotFoundError('User not found');

    await Promise.all([
      CartRepository.clearForUser(id),
      UserRepository.delete(id),
      ...(await WishlistRepository.findAllForUser(id)).map((w) => WishlistRepository.removeItem(id, w.productId)),
    ]);
  },
};

import { DeleteCommand, GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES, INDEXES } from '@/lib/db/tables';
import type { Address, User } from '@/types';

/** Internal DB record — includes the password hash, never sent to the client. */
export interface UserRecord extends User {
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  /** SHA-256 hash of the active "forgot password" token, if one has been requested. */
  resetTokenHash?: string;
  /** ISO timestamp — the reset token stops working after this. */
  resetTokenExpiresAt?: string;
}

export const UserRepository = {
  async findById(id: string): Promise<UserRecord | null> {
    const res = await ddb.send(new GetCommand({ TableName: TABLES.USERS, Key: { id } }));
    return (res.Item as UserRecord) || null;
  },

  async findByEmail(email: string): Promise<UserRecord | null> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.USERS,
        IndexName: INDEXES.USERS_BY_EMAIL,
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email.toLowerCase() },
        Limit: 1,
      })
    );
    return (res.Items?.[0] as UserRecord) || null;
  },

  /**
   * Returns every user account. The user base is expected to stay small
   * enough (hundreds–low thousands) for the admin dashboard that a Scan is
   * an acceptable trade-off, mirroring the approach used for Categories.
   */
  async findAll(): Promise<UserRecord[]> {
    const items: UserRecord[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined;
    do {
      const res = await ddb.send(new ScanCommand({ TableName: TABLES.USERS, ExclusiveStartKey }));
      items.push(...((res.Items as UserRecord[]) || []));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return items;
  },

  async create(user: UserRecord): Promise<UserRecord> {
    await ddb.send(
      new PutCommand({
        TableName: TABLES.USERS,
        Item: user,
        // Guard against a race where two requests register the same id.
        ConditionExpression: 'attribute_not_exists(id)',
      })
    );
    return user;
  },

  /** Patches arbitrary top-level fields (profile edits, address book, role, etc). */
  async update(id: string, patch: Partial<Pick<User, 'name' | 'phone' | 'avatar' | 'addresses' | 'role' | 'email'>>): Promise<void> {
    const entries = Object.entries(patch).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return;
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = { ':now': new Date().toISOString() };
    const sets = entries.map(([key], i) => {
      const nameKey = `#f${i}`;
      const valueKey = `:v${i}`;
      names[nameKey] = key;
      values[valueKey] = patch[key as keyof typeof patch];
      return `${nameKey} = ${valueKey}`;
    });
    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.USERS,
        Key: { id },
        UpdateExpression: `SET ${sets.join(', ')}, updatedAt = :now`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(id)',
      })
    );
  },

  async setAddresses(id: string, addresses: Address[]): Promise<void> {
    await this.update(id, { addresses });
  },

  async delete(id: string): Promise<void> {
    await ddb.send(new DeleteCommand({ TableName: TABLES.USERS, Key: { id } }));
  },

  /** Stores a freshly-issued password-reset token hash + expiry on the user record. */
  async setResetToken(id: string, tokenHash: string, expiresAt: string): Promise<void> {
    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.USERS,
        Key: { id },
        UpdateExpression: 'SET resetTokenHash = :hash, resetTokenExpiresAt = :exp, updatedAt = :now',
        ExpressionAttributeValues: { ':hash': tokenHash, ':exp': expiresAt, ':now': new Date().toISOString() },
        ConditionExpression: 'attribute_exists(id)',
      })
    );
  },

  /** Updates the password hash and invalidates any outstanding reset token in one write. */
  async setPassword(id: string, passwordHash: string): Promise<void> {
    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.USERS,
        Key: { id },
        UpdateExpression: 'SET passwordHash = :hash, updatedAt = :now REMOVE resetTokenHash, resetTokenExpiresAt',
        ExpressionAttributeValues: { ':hash': passwordHash, ':now': new Date().toISOString() },
        ConditionExpression: 'attribute_exists(id)',
      })
    );
  },
};

import { DeleteCommand, PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES } from '@/lib/db/tables';

export interface WishlistItemRecord {
  userId: string;
  productId: string;
  addedAt: string;
}

export const WishlistRepository = {
  async findAllForUser(userId: string): Promise<WishlistItemRecord[]> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.WISHLIST,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
      })
    );
    return (res.Items as WishlistItemRecord[]) || [];
  },

  async findItem(userId: string, productId: string): Promise<WishlistItemRecord | null> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.WISHLIST,
        KeyConditionExpression: 'userId = :userId AND productId = :productId',
        ExpressionAttributeValues: { ':userId': userId, ':productId': productId },
        Limit: 1,
      })
    );
    return (res.Items?.[0] as WishlistItemRecord) || null;
  },

  async addItem(item: WishlistItemRecord): Promise<WishlistItemRecord> {
    // Duplicate prevention: only write if this (userId, productId) pair
    // doesn't already exist.
    await ddb.send(
      new PutCommand({
        TableName: TABLES.WISHLIST,
        Item: item,
        ConditionExpression: 'attribute_not_exists(userId)',
      })
    ).catch((err) => {
      if (err.name !== 'ConditionalCheckFailedException') throw err;
      // already wishlisted — no-op
    });
    return item;
  },

  async removeItem(userId: string, productId: string): Promise<void> {
    await ddb.send(new DeleteCommand({ TableName: TABLES.WISHLIST, Key: { userId, productId } }));
  },

  /** Admin-only: every wishlist entry across every user, for the admin dashboard. */
  async findAll(): Promise<WishlistItemRecord[]> {
    const items: WishlistItemRecord[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined;
    do {
      const res = await ddb.send(new ScanCommand({ TableName: TABLES.WISHLIST, ExclusiveStartKey }));
      items.push(...((res.Items as WishlistItemRecord[]) || []));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return items;
  },
};

import { DeleteCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES } from '@/lib/db/tables';

/**
 * Each cart line item is its own DynamoDB item, keyed by (userId, productId).
 * This lets us add/update/remove a single line item as one fast, atomic
 * operation instead of reading, mutating and rewriting a large "cart blob".
 */
export interface CartItemRecord {
  userId: string;
  productId: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: string;
  updatedAt: string;
}

export const CartRepository = {
  async findAllForUser(userId: string): Promise<CartItemRecord[]> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.CART,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
      })
    );
    return (res.Items as CartItemRecord[]) || [];
  },

  async findItem(userId: string, productId: string): Promise<CartItemRecord | null> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.CART,
        KeyConditionExpression: 'userId = :userId AND productId = :productId',
        ExpressionAttributeValues: { ':userId': userId, ':productId': productId },
        Limit: 1,
      })
    );
    return (res.Items?.[0] as CartItemRecord) || null;
  },

  async upsertItem(item: CartItemRecord): Promise<CartItemRecord> {
    await ddb.send(new PutCommand({ TableName: TABLES.CART, Item: item }));
    return item;
  },

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<void> {
    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.CART,
        Key: { userId, productId },
        UpdateExpression: 'SET quantity = :quantity, updatedAt = :now',
        ConditionExpression: 'attribute_exists(userId)',
        ExpressionAttributeValues: { ':quantity': quantity, ':now': new Date().toISOString() },
      })
    );
  },

  async removeItem(userId: string, productId: string): Promise<void> {
    await ddb.send(new DeleteCommand({ TableName: TABLES.CART, Key: { userId, productId } }));
  },

  async clearForUser(userId: string): Promise<void> {
    const items = await this.findAllForUser(userId);
    await Promise.all(items.map((i) => this.removeItem(userId, i.productId)));
  },
};

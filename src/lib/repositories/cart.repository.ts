import { DeleteCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES } from '@/lib/db/tables';

/**
 * Two different variant picks of the same product must land in two
 * different cart rows, not merge into one. The table's sort key is (and
 * stays) the attribute named `productId` for schema-compatibility reasons,
 * but its *value* is this composite line key when options are selected —
 * the real catalog product id is kept separately in `catalogProductId`.
 * With no options selected, the line key is just the plain product id, so
 * single-SKU products behave exactly as before.
 */
export function cartLineKey(productId: string, selectedOptions?: Record<string, string>): string {
  const entries = Object.entries(selectedOptions || {}).filter(([, v]) => v);
  if (entries.length === 0) return productId;
  const suffix = entries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join('|');
  return `${productId}::${suffix}`;
}

export interface CartItemRecord {
  userId: string;
  /** The DynamoDB sort key value — see cartLineKey() above. */
  productId: string;
  /** The real catalog product this line refers to. Optional only for rows written before variant support — use `catalogProductId || productId` when reading. */
  catalogProductId?: string;
  quantity: number;
  selectedOptions?: Record<string, string>;
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

  async findItem(userId: string, lineKey: string): Promise<CartItemRecord | null> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.CART,
        KeyConditionExpression: 'userId = :userId AND productId = :lineKey',
        ExpressionAttributeValues: { ':userId': userId, ':lineKey': lineKey },
        Limit: 1,
      })
    );
    return (res.Items?.[0] as CartItemRecord) || null;
  },

  async upsertItem(item: CartItemRecord): Promise<CartItemRecord> {
    await ddb.send(new PutCommand({ TableName: TABLES.CART, Item: item }));
    return item;
  },

  async updateQuantity(userId: string, lineKey: string, quantity: number): Promise<void> {
    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.CART,
        Key: { userId, productId: lineKey },
        UpdateExpression: 'SET quantity = :quantity, updatedAt = :now',
        ConditionExpression: 'attribute_exists(userId)',
        ExpressionAttributeValues: { ':quantity': quantity, ':now': new Date().toISOString() },
      })
    );
  },

  async removeItem(userId: string, lineKey: string): Promise<void> {
    await ddb.send(new DeleteCommand({ TableName: TABLES.CART, Key: { userId, productId: lineKey } }));
  },

  async clearForUser(userId: string): Promise<void> {
    const items = await this.findAllForUser(userId);
    await Promise.all(items.map((i) => this.removeItem(userId, i.productId)));
  },

  /** Admin-only: every cart line item across every user, for the admin dashboard. */
  async findAll(): Promise<CartItemRecord[]> {
    const items: CartItemRecord[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined;
    do {
      const res = await ddb.send(new ScanCommand({ TableName: TABLES.CART, ExclusiveStartKey }));
      items.push(...((res.Items as CartItemRecord[]) || []));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return items;
  },
};

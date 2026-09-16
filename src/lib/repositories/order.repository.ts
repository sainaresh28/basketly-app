import { GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES, INDEXES } from '@/lib/db/tables';
import type { Order, OrderStatus } from '@/types';

export const OrderRepository = {
  async create(order: Order): Promise<Order> {
    await ddb.send(new PutCommand({ TableName: TABLES.ORDERS, Item: order }));
    return order;
  },

  async findById(id: string): Promise<Order | null> {
    const res = await ddb.send(new GetCommand({ TableName: TABLES.ORDERS, Key: { id } }));
    return (res.Item as Order) || null;
  },

  async findAllForUser(userId: string): Promise<Order[]> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.ORDERS,
        IndexName: INDEXES.ORDERS_BY_USER,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
        ScanIndexForward: false, // newest first (sorted by createdAt range key)
      })
    );
    return (res.Items as Order[]) || [];
  },

  /** Admin only — full order list. A Scan is fine at this project's scale. */
  async findAll(): Promise<Order[]> {
    const items: Order[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined;
    do {
      const res = await ddb.send(new ScanCommand({ TableName: TABLES.ORDERS, ExclusiveStartKey }));
      items.push(...((res.Items as Order[]) || []));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return items;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.ORDERS,
        Key: { id },
        UpdateExpression: 'SET #status = :status, updatedAt = :now',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': status, ':now': new Date().toISOString() },
        ConditionExpression: 'attribute_exists(id)',
      })
    );
  },

  /** Patches arbitrary top-level fields — used for tracking info, cancellation, refund state, etc. */
  async patch(id: string, patch: Partial<Order>): Promise<void> {
    const entries = Object.entries(patch).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return;
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = { ':now': new Date().toISOString() };
    const sets = entries.map(([key], i) => {
      const nameKey = `#f${i}`;
      const valueKey = `:v${i}`;
      names[nameKey] = key;
      values[valueKey] = (patch as Record<string, unknown>)[key];
      return `${nameKey} = ${valueKey}`;
    });
    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.ORDERS,
        Key: { id },
        UpdateExpression: `SET ${sets.join(', ')}, updatedAt = :now`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(id)',
      })
    );
  },

  /** Restocks an order's items (used when a paid/processing order is cancelled). */
  async restockItems(order: Order): Promise<void> {
    for (const item of order.items) {
      await ddb.send(
        new UpdateCommand({
          TableName: TABLES.PRODUCTS,
          Key: { id: item.productId },
          UpdateExpression: 'SET stock = stock + :qty',
          ExpressionAttributeValues: { ':qty': item.quantity },
        })
      );
    }
  },
};

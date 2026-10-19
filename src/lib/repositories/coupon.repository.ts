import { GetCommand, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES } from '@/lib/db/tables';
import type { Coupon } from '@/types';

export const CouponRepository = {
  async findByCode(code: string): Promise<Coupon | null> {
    const res = await ddb.send(
      new GetCommand({ TableName: TABLES.COUPONS, Key: { code: code.toUpperCase() } })
    );
    return (res.Item as Coupon) || null;
  },

  async findAll(): Promise<Coupon[]> {
    const items: Coupon[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined;
    do {
      const res = await ddb.send(new ScanCommand({ TableName: TABLES.COUPONS, ExclusiveStartKey }));
      items.push(...((res.Items as Coupon[]) || []));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async put(coupon: Coupon): Promise<Coupon> {
    const item = { ...coupon, code: coupon.code.toUpperCase() };
    await ddb.send(new PutCommand({ TableName: TABLES.COUPONS, Item: item }));
    return item;
  },

  /**
   * Atomically bumps usedCount by 1, but only if it still matches
   * expectedUsedCount — an optimistic-locking guard against two concurrent
   * checkouts both redeeming the coupon's last remaining use. Throws
   * ConditionalCheckFailedException (re-exported here so callers don't need
   * to import the AWS SDK directly) when the count has moved since it was
   * last read; callers should re-fetch and retry once.
   */
  async incrementUsage(code: string, expectedUsedCount: number): Promise<void> {
    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.COUPONS,
        Key: { code: code.toUpperCase() },
        UpdateExpression: 'SET usedCount = usedCount + :one',
        ConditionExpression: 'usedCount = :expected',
        ExpressionAttributeValues: { ':one': 1, ':expected': expectedUsedCount },
      })
    );
  },
};

export { ConditionalCheckFailedException };

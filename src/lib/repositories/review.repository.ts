import { GetCommand, PutCommand, QueryCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES, INDEXES } from '@/lib/db/tables';
import type { Review } from '@/types';

/** One review per purchased line item: id is always `${orderId}#${productId}`. */
export function reviewId(orderId: string, productId: string): string {
  return `${orderId}#${productId}`;
}

export const ReviewRepository = {
  async create(review: Review): Promise<Review> {
    await ddb.send(
      new PutCommand({
        TableName: TABLES.REVIEWS,
        Item: review,
        // Guards against double-submitting a review for the same order+product.
        ConditionExpression: 'attribute_not_exists(id)',
      })
    );
    return review;
  },

  async findById(id: string): Promise<Review | null> {
    const res = await ddb.send(new GetCommand({ TableName: TABLES.REVIEWS, Key: { id } }));
    return (res.Item as Review) || null;
  },

  /** Batched existence lookup — used to mark which items in an order already have a review. */
  async findManyByIds(ids: string[]): Promise<Review[]> {
    if (ids.length === 0) return [];
    const unique = Array.from(new Set(ids));
    const chunks: string[][] = [];
    for (let i = 0; i < unique.length; i += 100) chunks.push(unique.slice(i, i + 100));

    const results: Review[] = [];
    for (const chunk of chunks) {
      const res = await ddb.send(
        new BatchGetCommand({ RequestItems: { [TABLES.REVIEWS]: { Keys: chunk.map((id) => ({ id })) } } })
      );
      results.push(...((res.Responses?.[TABLES.REVIEWS] as Review[]) || []));
    }
    return results;
  },

  async findForProduct(productId: string): Promise<Review[]> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.REVIEWS,
        IndexName: INDEXES.REVIEWS_BY_PRODUCT,
        KeyConditionExpression: 'productId = :productId',
        ExpressionAttributeValues: { ':productId': productId },
        ScanIndexForward: false, // newest first
      })
    );
    return (res.Items as Review[]) || [];
  },
};

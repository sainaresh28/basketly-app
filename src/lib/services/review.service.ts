import { v4 as uuidv4 } from 'uuid';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES } from '@/lib/db/tables';
import { ReviewRepository, reviewId } from '@/lib/repositories/review.repository';
import { OrderRepository } from '@/lib/repositories/order.repository';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { ForbiddenError, NotFoundError, ValidationError } from '@/lib/errors/app-error';
import type { CreateReviewInput } from '@/lib/validation/schemas';
import type { Review } from '@/types';

export const ReviewService = {
  async listForProduct(productId: string): Promise<Review[]> {
    return ReviewRepository.findForProduct(productId);
  },

  /** Which of this order's products already have a review — so the UI can hide "Write a Review" for them. */
  async listForOrder(orderId: string, productIds: string[]): Promise<Review[]> {
    const ids = productIds.map((productId) => reviewId(orderId, productId));
    return ReviewRepository.findManyByIds(ids);
  },

  async create(userId: string, userName: string, productId: string, input: CreateReviewInput): Promise<Review> {
    const order = await OrderRepository.findById(input.orderId);
    if (!order) throw new NotFoundError('Order not found');
    if (order.userId !== userId) throw new ForbiddenError('This is not your order');
    if (order.status !== 'delivered') {
      throw new ValidationError('You can review an item once your order has been delivered.');
    }
    const purchasedItem = order.items.find((i) => i.productId === productId);
    if (!purchasedItem) throw new ValidationError('This product was not part of that order.');

    const now = new Date().toISOString();
    const review: Review = {
      id: reviewId(input.orderId, productId),
      orderId: input.orderId,
      productId,
      userId,
      userName,
      rating: input.rating,
      comment: input.comment,
      createdAt: now,
    };

    try {
      await ReviewRepository.create(review);
    } catch (err) {
      if (err instanceof ConditionalCheckFailedException) {
        throw new ValidationError('You have already reviewed this item.');
      }
      throw err;
    }

    await this.recomputeRating(productId, input.rating);
    return review;
  },

  /**
   * Folds a new rating into the product's running average + review count.
   * DynamoDB has no built-in "average" operation, so this reads the current
   * numbers and writes back with an optimistic-lock condition on
   * reviewCount, retrying a few times if another review lands at the exact
   * same moment.
   */
  async recomputeRating(productId: string, newRating: number, attempt = 0): Promise<void> {
    const product = await ProductRepository.findById(productId);
    if (!product) return;

    const prevCount = product.reviewCount || 0;
    const prevRating = product.rating || 0;
    const nextCount = prevCount + 1;
    const nextRating = Math.round(((prevRating * prevCount + newRating) / nextCount) * 10) / 10;

    const prevDistribution = product.ratingDistribution || { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    const bucket = String(Math.min(5, Math.max(1, Math.round(newRating)))) as '1' | '2' | '3' | '4' | '5';
    const nextDistribution = { ...prevDistribution, [bucket]: (prevDistribution[bucket] || 0) + 1 };

    try {
      await ddb.send(
        new UpdateCommand({
          TableName: TABLES.PRODUCTS,
          Key: { id: productId },
          UpdateExpression: 'SET rating = :rating, reviewCount = :count, ratingDistribution = :dist',
          ConditionExpression: 'reviewCount = :prevCount',
          ExpressionAttributeValues: {
            ':rating': nextRating,
            ':count': nextCount,
            ':dist': nextDistribution,
            ':prevCount': prevCount,
          },
        })
      );
    } catch (err) {
      if (err instanceof ConditionalCheckFailedException && attempt < 3) {
        return this.recomputeRating(productId, newRating, attempt + 1);
      }
      // Non-fatal: the review itself is already saved. Worst case the
      // aggregate rating is briefly stale until the next successful write.
      console.error('[review_rating_recompute_failed]', err);
    }
  },
};

import { WishlistRepository } from '@/lib/repositories/wishlist.repository';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { NotFoundError } from '@/lib/errors/app-error';
import type { MergeWishlistInput } from '@/lib/validation/schemas';
import type { WishlistItem, Product } from '@/types';

export const WishlistService = {
  async getWishlist(userId: string): Promise<WishlistItem[]> {
    const records = await WishlistRepository.findAllForUser(userId);
    if (records.length === 0) return [];

    const products = await ProductRepository.findManyByIds(records.map((r) => r.productId));
    const productMap = new Map<string, Product>(products.map((p) => [p.id, p]));

    return records
      .filter((r) => productMap.has(r.productId))
      .map((r) => ({ productId: r.productId, product: productMap.get(r.productId)!, addedAt: r.addedAt }));
  },

  async addItem(userId: string, productId: string): Promise<WishlistItem[]> {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');

    // Duplicate prevention happens at the repository layer via a conditional
    // write (attribute_not_exists), so calling this twice is a safe no-op.
    await WishlistRepository.addItem({ userId, productId, addedAt: new Date().toISOString() });
    return this.getWishlist(userId);
  },

  async removeItem(userId: string, productId: string): Promise<WishlistItem[]> {
    await WishlistRepository.removeItem(userId, productId);
    return this.getWishlist(userId);
  },

  async mergeGuestWishlist(userId: string, input: MergeWishlistInput): Promise<WishlistItem[]> {
    for (const productId of input.productIds) {
      const existing = await WishlistRepository.findItem(userId, productId);
      if (!existing) {
        await WishlistRepository.addItem({ userId, productId, addedAt: new Date().toISOString() });
      }
    }
    return this.getWishlist(userId);
  },
};

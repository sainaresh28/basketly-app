import { WishlistRepository } from '@/lib/repositories/wishlist.repository';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { UserRepository } from '@/lib/repositories/user.repository';
import { NotFoundError } from '@/lib/errors/app-error';
import type { MergeWishlistInput } from '@/lib/validation/schemas';
import type { WishlistItem, Product } from '@/types';

export interface AdminWishlistRow {
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productImage?: string;
  productPrice: number;
  addedAt: string;
}

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

  /** Admin-only: every wishlist entry across every user, joined with user + product info. */
  async listAllForAdmin(): Promise<AdminWishlistRow[]> {
    const records = await WishlistRepository.findAll();
    if (records.length === 0) return [];

    const [products, users] = await Promise.all([
      ProductRepository.findManyByIds(records.map((r) => r.productId)),
      Promise.all(Array.from(new Set(records.map((r) => r.userId))).map((id) => UserRepository.findById(id))),
    ]);
    const productMap = new Map<string, Product>(products.map((p) => [p.id, p]));
    const userMap = new Map(users.filter(Boolean).map((u) => [u!.id, u!]));

    return records
      .map((r) => {
        const product = productMap.get(r.productId);
        const user = userMap.get(r.userId);
        return {
          userId: r.userId,
          userName: user?.name ?? 'Deleted user',
          userEmail: user?.email ?? '—',
          productId: r.productId,
          productName: product?.name ?? 'Deleted product',
          productImage: product?.images?.[0],
          productPrice: product?.price ?? 0,
          addedAt: r.addedAt,
        };
      })
      .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1));
  },
};

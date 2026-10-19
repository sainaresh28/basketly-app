import { CartRepository, cartLineKey, type CartItemRecord } from '@/lib/repositories/cart.repository';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { UserRepository } from '@/lib/repositories/user.repository';
import { ValidationError, NotFoundError } from '@/lib/errors/app-error';
import { calculateShipping } from '@/lib/config';
import type { AddToCartInput, MergeCartInput } from '@/lib/validation/schemas';
import type { Cart, CartItem, Product } from '@/types';

export interface AdminCartRow {
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  lineTotal: number;
  addedAt: string;
  updatedAt: string;
}

/**
 * Joins raw cart line items (userId, productId, quantity) with *live* product
 * data (current price/stock/name/image) so totals are always accurate, even
 * if a product's price changed since it was added to the cart.
 */
async function hydrateCart(records: CartItemRecord[]): Promise<Cart> {
  // Backward compatibility: cart rows written before variant support don't
  // have catalogProductId at all — for those, productId was (and still is)
  // the real product id, so fall back to it rather than crashing on undefined.
  const resolvedIds = records.map((r) => r.catalogProductId || r.productId);
  const products = await ProductRepository.findManyByIds(resolvedIds);
  const productMap = new Map<string, Product>(products.map((p) => [p.id, p]));

  const items: CartItem[] = records
    .map((r) => ({ record: r, catalogId: r.catalogProductId || r.productId }))
    .filter(({ catalogId }) => productMap.has(catalogId)) // silently drop items whose product was deleted
    .map(({ record: r, catalogId }) => ({
      lineId: r.productId,
      productId: catalogId,
      product: productMap.get(catalogId)!,
      quantity: r.quantity,
      selectedOptions: r.selectedOptions,
    }));

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = calculateShipping(subtotal);
  return { items, subtotal, shipping, total: subtotal + shipping };
}

export const CartService = {
  async getCart(userId: string): Promise<Cart> {
    const records = await CartRepository.findAllForUser(userId);
    return hydrateCart(records);
  },

  async addItem(userId: string, input: AddToCartInput): Promise<Cart> {
    const product = await ProductRepository.findById(input.productId);
    if (!product) throw new NotFoundError('Product not found');
    if (product.stock < 1) throw new ValidationError('This product is out of stock');

    const lineKey = cartLineKey(input.productId, input.selectedOptions);
    const existing = await CartRepository.findItem(userId, lineKey);
    const now = new Date().toISOString();

    // Prevent duplicate line items: the *same* product with the *same*
    // selected options already in the cart bumps quantity; a different
    // option combo for that product is a distinct line, not a merge.
    const nextQuantity = Math.min((existing?.quantity || 0) + input.quantity, product.stock);

    await CartRepository.upsertItem({
      userId,
      productId: lineKey,
      catalogProductId: input.productId,
      quantity: nextQuantity,
      selectedOptions: input.selectedOptions ?? existing?.selectedOptions,
      addedAt: existing?.addedAt || now,
      updatedAt: now,
    });

    return this.getCart(userId);
  },

  async updateQuantity(userId: string, lineId: string, quantity: number): Promise<Cart> {
    const existing = await CartRepository.findItem(userId, lineId);
    if (!existing) throw new NotFoundError('That item is not in your cart');

    const product = await ProductRepository.findById(existing.catalogProductId || existing.productId);
    if (!product) throw new NotFoundError('Product not found');

    if (quantity < 1) {
      await CartRepository.removeItem(userId, lineId);
      return this.getCart(userId);
    }

    const capped = Math.min(quantity, product.stock);
    await CartRepository.updateQuantity(userId, lineId, capped);
    return this.getCart(userId);
  },

  async removeItem(userId: string, lineId: string): Promise<Cart> {
    await CartRepository.removeItem(userId, lineId);
    return this.getCart(userId);
  },

  async clear(userId: string): Promise<Cart> {
    await CartRepository.clearForUser(userId);
    return this.getCart(userId);
  },

  /** Merges a guest's local-storage cart into the user's server cart at login. */
  async mergeGuestCart(userId: string, input: MergeCartInput): Promise<Cart> {
    for (const guestItem of input.items) {
      const product = await ProductRepository.findById(guestItem.productId);
      if (!product) continue; // skip products that no longer exist
      const lineKey = cartLineKey(guestItem.productId, guestItem.selectedOptions);
      const existing = await CartRepository.findItem(userId, lineKey);
      const now = new Date().toISOString();
      const quantity = Math.min((existing?.quantity || 0) + guestItem.quantity, product.stock);
      await CartRepository.upsertItem({
        userId,
        productId: lineKey,
        catalogProductId: guestItem.productId,
        quantity,
        selectedOptions: guestItem.selectedOptions ?? existing?.selectedOptions,
        addedAt: existing?.addedAt || now,
        updatedAt: now,
      });
    }
    return this.getCart(userId);
  },

  /** Admin-only: every cart line item across every user, joined with user + product info. */
  async listAllForAdmin(): Promise<AdminCartRow[]> {
    const records = await CartRepository.findAll();
    if (records.length === 0) return [];

    const [products, users] = await Promise.all([
      ProductRepository.findManyByIds(records.map((r) => r.catalogProductId || r.productId)),
      Promise.all(Array.from(new Set(records.map((r) => r.userId))).map((id) => UserRepository.findById(id))),
    ]);
    const productMap = new Map<string, Product>(products.map((p) => [p.id, p]));
    const userMap = new Map(users.filter(Boolean).map((u) => [u!.id, u!]));

    return records
      .map((r) => {
        const catalogId = r.catalogProductId || r.productId;
        const product = productMap.get(catalogId);
        const user = userMap.get(r.userId);
        return {
          userId: r.userId,
          userName: user?.name ?? 'Deleted user',
          userEmail: user?.email ?? '—',
          productId: catalogId,
          productName: product?.name ?? 'Deleted product',
          productImage: product?.images?.[0],
          quantity: r.quantity,
          lineTotal: (product?.price ?? 0) * r.quantity,
          addedAt: r.addedAt,
          updatedAt: r.updatedAt,
        };
      })
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  },
};

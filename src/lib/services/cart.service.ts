import { CartRepository, type CartItemRecord } from '@/lib/repositories/cart.repository';
import { ProductRepository } from '@/lib/repositories/product.repository';
import { ValidationError, NotFoundError } from '@/lib/errors/app-error';
import { calculateShipping } from '@/lib/config';
import type { AddToCartInput, MergeCartInput } from '@/lib/validation/schemas';
import type { Cart, CartItem, Product } from '@/types';

/**
 * Joins raw cart line items (userId, productId, quantity) with *live* product
 * data (current price/stock/name/image) so totals are always accurate, even
 * if a product's price changed since it was added to the cart.
 */
async function hydrateCart(records: CartItemRecord[]): Promise<Cart> {
  const products = await ProductRepository.findManyByIds(records.map((r) => r.productId));
  const productMap = new Map<string, Product>(products.map((p) => [p.id, p]));

  const items: CartItem[] = records
    .filter((r) => productMap.has(r.productId)) // silently drop items whose product was deleted
    .map((r) => ({
      productId: r.productId,
      product: productMap.get(r.productId)!,
      quantity: r.quantity,
      selectedSize: r.selectedSize,
      selectedColor: r.selectedColor,
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

    const existing = await CartRepository.findItem(userId, input.productId);
    const now = new Date().toISOString();

    // Prevent duplicate line items: if it's already in the cart, increase
    // quantity instead of creating a second row for the same product.
    const nextQuantity = Math.min((existing?.quantity || 0) + input.quantity, product.stock);

    await CartRepository.upsertItem({
      userId,
      productId: input.productId,
      quantity: nextQuantity,
      selectedSize: input.selectedSize ?? existing?.selectedSize,
      selectedColor: input.selectedColor ?? existing?.selectedColor,
      addedAt: existing?.addedAt || now,
      updatedAt: now,
    });

    return this.getCart(userId);
  },

  async updateQuantity(userId: string, productId: string, quantity: number): Promise<Cart> {
    const product = await ProductRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found');

    if (quantity < 1) {
      await CartRepository.removeItem(userId, productId);
      return this.getCart(userId);
    }

    const capped = Math.min(quantity, product.stock);
    const existing = await CartRepository.findItem(userId, productId);
    if (!existing) throw new NotFoundError('That item is not in your cart');

    await CartRepository.updateQuantity(userId, productId, capped);
    return this.getCart(userId);
  },

  async removeItem(userId: string, productId: string): Promise<Cart> {
    await CartRepository.removeItem(userId, productId);
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
      const existing = await CartRepository.findItem(userId, guestItem.productId);
      const now = new Date().toISOString();
      const quantity = Math.min((existing?.quantity || 0) + guestItem.quantity, product.stock);
      await CartRepository.upsertItem({
        userId,
        productId: guestItem.productId,
        quantity,
        selectedSize: guestItem.selectedSize ?? existing?.selectedSize,
        selectedColor: guestItem.selectedColor ?? existing?.selectedColor,
        addedAt: existing?.addedAt || now,
        updatedAt: now,
      });
    }
    return this.getCart(userId);
  },
};

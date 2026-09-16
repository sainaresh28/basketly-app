'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import AppIcon from '@/components/ui/AppIcon';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/utils/format';
import type { CartItem } from '@/types';

const FREE_SHIPPING_THRESHOLD = 1999;
const SHIPPING_FEE = 149;

function CartLineRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 border-b border-border py-5 sm:py-6">
      <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
        <AppImage
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          sizes="80px"
          className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-3">
          <Link href={`/product-detail?id=${item.product.id}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-2">
            {item.product.name}
          </Link>
          <button
            aria-label={`Remove ${item.product.name}`}
            onClick={() => removeItem(item.productId)}
            className="text-muted-foreground hover:text-primary transition-colors shrink-0">
            <AppIcon name="TrashIcon" size={16} />
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.product.price)}</p>
        <div className="mt-3 flex items-center border border-border rounded-full w-fit overflow-hidden">
          <button
            aria-label="Decrease quantity"
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="px-3 py-1.5 hover:bg-muted transition-colors">
            <AppIcon name="MinusIcon" size={12} />
          </button>
          <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="px-3 py-1.5 hover:bg-muted transition-colors">
            <AppIcon name="PlusIcon" size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartView() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const subtotal = getSubtotal();
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return (
    <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <span className="section-label mb-3">Basket / Ready When You Are</span>
        <h1 className="font-display font-black uppercase text-display-xl text-foreground leading-[0.88]">
          Your<br /><span className="text-primary">basket.</span>
        </h1>

        {items.length ? (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              {items.map((item) => (
                <CartLineRow key={item.productId} item={item} />
              ))}
            </div>
            <aside className="h-fit rounded-3xl border border-border p-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Order Summary</span>
              <div className="mt-5 space-y-3 border-b border-border pb-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold text-foreground">{shipping ? formatPrice(shipping) : 'Free'}</span>
                </div>
              </div>
              <div className="flex justify-between py-5 text-lg font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(subtotal + shipping)}</span>
              </div>
              <Link
                href="/checkout"
                className="btn-dark w-full justify-center py-3.5 text-xs">
                Continue To Checkout
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Free shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </p>
            </aside>
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-border bg-secondary/25 p-8 sm:p-12">
            <AppIcon name="SparklesIcon" size={26} className="text-primary" />
            <h2 className="font-display font-black uppercase text-display-md text-foreground leading-[0.9] mt-5">
              Your basket is quiet.
            </h2>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              The good stuff is waiting.
            </p>
            <Link href="/products" className="mt-6 inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
              Start browsing →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

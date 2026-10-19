'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useCartStore } from '@/lib/cart-store';
import { formatDiscount, formatPrice, formatReviewCount } from '@/utils/format';
import type { WishlistItem } from '@/types';
import AccountShell from '@/app/account/components/AccountShell';

type Tab = 'all' | 'sale' | 'inStock' | 'outOfStock';
type Sort = 'recent' | 'price-asc' | 'price-desc' | 'name';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function WishlistCard({ item }: { item: WishlistItem }) {
  const { product } = item;
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const outOfStock = product.stock <= 0;
  const onSale = !!product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-square rounded-2xl bg-muted overflow-hidden">
        {onSale && (
          <span className="absolute top-3 left-3 z-10 badge-sale">
            {formatDiscount(product.originalPrice as number, product.price)}% OFF
          </span>
        )}
        <button
          onClick={() => removeItem(product.id)}
          aria-label="Remove from wishlist"
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
        >
          <AppIcon name="HeartIcon" variant="solid" size={16} className="text-primary" />
        </button>
        {outOfStock && (
          <div className="absolute inset-0 z-10 bg-white/60 flex items-center justify-center">
            <span className="rounded-full bg-dark-surface px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Out of Stock</span>
          </div>
        )}
        <Link href={`/product-detail?id=${product.id}`} className="block h-full w-full">
          <AppImage src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
        </Link>
      </div>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{product.brand}</p>
      <Link href={`/product-detail?id=${product.id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
        {product.name}
      </Link>
      <div className="mt-1 flex items-center gap-1.5">
        <StarRating rating={product.rating} />
        <span className="text-xs text-muted-foreground">({formatReviewCount(product.reviewCount)})</span>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <span className="text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
        {onSale && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice as number)}</span>}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => { addItem(product); addToast(`${product.name} added to cart`, 'success'); }}
          disabled={outOfStock}
          className="btn-dark flex-1 py-2.5 text-[11px] inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AppIcon name="ShoppingBagIcon" size={14} /> Add to Cart
        </button>
        <button
          onClick={() => removeItem(product.id)}
          aria-label="Remove"
          className="h-10 w-10 shrink-0 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
        >
          <AppIcon name="TrashIcon" size={16} />
        </button>
      </div>
    </div>
  );
}

export default function WishlistView() {
  const items = useWishlistStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const addToast = useCartStore((s) => s.addToast);
  const [tab, setTab] = useState<Tab>('all');
  const [sort, setSort] = useState<Sort>('recent');

  const counts = useMemo(() => ({
    all: items.length,
    sale: items.filter((i) => i.product.originalPrice && i.product.originalPrice > i.product.price).length,
    inStock: items.filter((i) => i.product.stock > 0).length,
    outOfStock: items.filter((i) => i.product.stock <= 0).length,
  }), [items]);

  const filtered = useMemo(() => {
    let list = items;
    if (tab === 'sale') list = list.filter((i) => i.product.originalPrice && i.product.originalPrice > i.product.price);
    if (tab === 'inStock') list = list.filter((i) => i.product.stock > 0);
    if (tab === 'outOfStock') list = list.filter((i) => i.product.stock <= 0);

    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.product.price - b.product.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.product.price - a.product.price);
    else if (sort === 'name') sorted.sort((a, b) => a.product.name.localeCompare(b.product.name));
    else sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
    return sorted;
  }, [items, tab, sort]);

  const TABS: { key: Tab; label: string }[] = [
    { key: 'all', label: `All Items (${counts.all})` },
    { key: 'sale', label: `On Sale (${counts.sale})` },
    { key: 'inStock', label: `In Stock (${counts.inStock})` },
    { key: 'outOfStock', label: `Out of Stock (${counts.outOfStock})` },
  ];

  const moveAllToCart = () => {
    items.filter((i) => i.product.stock > 0).forEach((i) => addItem(i.product));
    if (items.length) addToast('Available items moved to your cart', 'success');
  };

  return (
    <AccountShell
      active="wishlist"
      crumb="Wishlist"
      eyebrow="Saved For Later"
      title={<>Your <span className="text-primary">Wishlist.</span></>}
      subtitle="Keep track of what you love. Prices, stock and more — all in one place."
      tagline="Good Things Ahead."
    >
      {items.length === 0 ? (
        <div className="mt-2 rounded-3xl border border-border bg-secondary/25 p-8 sm:p-12">
          <AppIcon name="SparklesIcon" size={26} className="text-primary" />
          <h2 className="font-display font-black uppercase text-display-md text-foreground leading-[0.9] mt-5">
            Nothing saved yet.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            When something stops you mid-scroll, tap the heart.
          </p>
          <Link href="/products" className="mt-6 inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
            Find your next thing →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
              <div className="flex gap-5 overflow-x-auto no-scrollbar">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`pb-3 -mb-3 shrink-0 whitespace-nowrap text-sm font-bold border-b-2 transition-colors ${
                      tab === t.key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground shrink-0">
                Sort by:
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-bold text-foreground focus:outline-none"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>

            {filtered.length === 0 ? (
              <p className="mt-8 text-sm text-muted-foreground">Nothing in this filter yet.</p>
            ) : (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-8">
                {filtered.map((item) => <WishlistCard key={item.productId} item={item} />)}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border p-6">
              <div className="h-11 w-11 rounded-full bg-secondary/30 flex items-center justify-center">
                <AppIcon name="HeartIcon" size={19} className="text-primary" />
              </div>
              <p className="mt-4 text-sm font-bold text-foreground">{items.length} Items</p>
              <p className="mt-1 text-xs text-muted-foreground leading-5">
                Your wishlist is looking great! Move items to your cart before they&apos;re gone.
              </p>
              <button onClick={moveAllToCart} className="btn-dark mt-4 w-full py-2.5 text-[11px] inline-flex items-center justify-center gap-2">
                <AppIcon name="ShoppingBagIcon" size={15} /> Move All to Cart
              </button>
            </div>

            <div className="rounded-2xl border border-border p-6">
              <h3 className="text-sm font-bold text-foreground">Need Help?</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-5">
                We&apos;re here for you. Get support for your wishlist, orders, or any other query.
              </p>
              <Link href="/support" className="btn-outline mt-4 inline-flex w-full justify-center py-2.5 text-[11px]">Contact Support</Link>
            </div>

            <div className="rounded-3xl bg-secondary/20 p-6 relative overflow-hidden min-h-[190px]">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">New Season</span>
              <h3 className="mt-2 font-display font-black uppercase text-2xl leading-[0.95] text-foreground">
                Discover<br />What&apos;s Next.
              </h3>
              <p className="mt-2 text-xs text-muted-foreground">Fresh styles. Bolder choices. Just for you.</p>
              <Link href="/new-arrivals" className="btn-dark mt-4 inline-flex py-2.5 px-5 text-[11px]">Shop New Arrivals</Link>
            </div>
          </div>
        </div>
      )}
    </AccountShell>
  );
}

'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/types';

interface NewArrivalsProps {
  products: Product[];
}

function NewArrivalCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const addToast = useCartStore(s => s.addToast);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="flex-shrink-0 w-56 sm:w-64 group">
      <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[3/4] mb-3">
        <AppImage
          src={product.images[0]}
          alt={`${product.name} — new arrival product`}
          fill
          sizes="256px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="badge-new">New</span>
        </div>
        <button
          onClick={() => {
            const added = toggleItem(product);
            addToast(added ? `${product.name} added to wishlist` : 'Removed from wishlist', added ? 'success' : 'info');
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Wishlist"
        >
          <svg className={`w-4 h-4 ${wishlisted ? 'fill-primary stroke-primary' : 'fill-transparent stroke-foreground'}`} strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">{product.brand}</p>
      <Link href={`/product-detail?id=${product.id}`}>
        <h3 className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
      </Link>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
        <button
          onClick={() => addItem(product, 1)}
          className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors"
        >
          Add +
        </button>
      </div>
    </div>
  );
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-10 bg-muted/30">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-2">Just Dropped</p>
            <h2 className="font-display font-black text-display-lg text-foreground uppercase">New Arrivals</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-white hover:border-foreground transition-all"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-white hover:border-foreground transition-all"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
        >
          {products.map(product => (
            <NewArrivalCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
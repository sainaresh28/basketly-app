'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/types';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore(s => s.addItem);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 260 : -260, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-display-md text-foreground uppercase">You May Also Like</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-white hover:border-foreground transition-all" aria-label="Scroll left">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-white hover:border-foreground transition-all" aria-label="Scroll right">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {products.map(product => (
          <div key={product.id} className="flex-shrink-0 w-52 group">
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[3/4] mb-3">
              <AppImage
                src={product.images[0]}
                alt={`${product.name} — related product`}
                fill
                sizes="208px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.discountPercent && (
                <div className="absolute top-2 left-2">
                  <span className="badge-sale">{product.discountPercent}% Off</span>
                </div>
              )}
              <button
                onClick={() => addItem(product, 1)}
                className="absolute bottom-2 left-2 right-2 py-2 bg-foreground text-white text-[10px] font-bold uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-primary"
              >
                Add to Cart
              </button>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">{product.brand}</p>
            <Link href={`/product-detail?id=${product.id}`}>
              <h3 className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">{product.name}</h3>
            </Link>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
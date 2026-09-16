'use client';
import React from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import { useWishlistStore } from '@/lib/wishlist-store';
import ProductGrid from '@/app/products/components/ProductGrid';

export default function WishlistView() {
  const items = useWishlistStore((s) => s.items);
  const products = items.map((i) => i.product);

  return (
    <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <span className="section-label mb-3">Saved For Later</span>
        <h1 className="font-display font-black uppercase text-display-xl text-foreground leading-[0.88]">
          Your<br /><span className="text-primary">shortlist.</span>
        </h1>

        {products.length ? (
          <div className="mt-10">
            <ProductGrid products={products} />
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-border bg-secondary/25 p-8 sm:p-12">
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
        )}
      </div>
    </section>
  );
}

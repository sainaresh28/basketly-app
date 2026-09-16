'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/types';

interface TrendingProductsProps {
  products: Product[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TrendingProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const addToast = useCartStore(s => s.addToast);
  const wishlisted = isWishlisted(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    const added = toggleItem(product);
    addToast(added ? `${product.name} added to wishlist` : 'Removed from wishlist', added ? 'success' : 'info');
  };

  return (
    <div className="group relative flex flex-col">
      <div className="product-image-wrap rounded-2xl bg-muted aspect-[3/4] mb-3 relative">
        <AppImage
          src={product.images[0]}
          alt={`${product.name} by ${product.brand} — ${product.categoryName}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover w-full h-full rounded-2xl"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <span className="badge-new">New</span>}
          {product.isBestSeller && <span className="badge-sale">Best Seller</span>}
          {product.discountPercent && <span className="badge-sale">{product.discountPercent}% Off</span>}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg className={`w-4 h-4 ${wishlisted ? 'fill-primary stroke-primary' : 'fill-transparent stroke-foreground'}`} strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
        </button>

        {/* Quick Add */}
        {product.stock > 0 && (
          <button
            onClick={(e) => { e.preventDefault(); addItem(product, 1); }}
            className="absolute bottom-3 left-3 right-3 py-2.5 bg-foreground text-white text-xs font-bold uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary"
          >
            Quick Add
          </button>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center rounded-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-background px-3 py-1.5 rounded-full border border-border">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">{product.brand}</p>
        <Link href={`/product-detail?id=${product.id}`}>
          <h3 className="text-sm font-semibold text-foreground leading-snug hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1.5 mt-1.5">
          <StarRating rating={product.rating} />
          <span className="text-[11px] text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-[11px] font-semibold text-primary mt-1">Only {product.stock} left</p>
        )}
      </div>
    </div>
  );
}

export default function TrendingProducts({ products }: TrendingProductsProps) {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-10 bg-muted/40">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="section-label mb-2">Trending Now</p>
            <h2 className="font-display font-black text-display-lg text-foreground uppercase">Best Sellers</h2>
          </div>
          <Link href="/products?sort=popular" className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            View All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.slice(0, 8).map(product => (
            <TrendingProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
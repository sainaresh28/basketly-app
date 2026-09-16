'use client';
import React, { useState } from 'react';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/types';

interface ProductInformationProps {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  onAddToCart: () => void;
  onWishlist: () => void;
  wishlisted: boolean;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({count.toLocaleString('en-IN')} reviews)</span>
    </div>
  );
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        className="flex items-center justify-between w-full py-4 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <svg className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pb-4 text-sm text-muted-foreground leading-relaxed">{children}</div>}
    </div>
  );
}

export default function ProductInformation({
  product, quantity, setQuantity, onAddToCart, onWishlist, wishlisted,
}: ProductInformationProps) {
  return (
    <div className="flex flex-col">
      {/* Brand + Name */}
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">{product.brand}</p>
      <h1 className="font-display font-black text-display-md text-foreground uppercase leading-tight mb-4">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="mb-5">
        <StarRating rating={product.rating} count={product.reviewCount} />
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="font-display font-black text-3xl text-foreground">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            <span className="badge-sale">{product.discountPercent}% Off</span>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

      {/* Stock */}
      <div className="mb-6">
        {product.stock === 0 ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-red-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Out of Stock
          </div>
        ) : product.stock <= 5 ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Only {product.stock} left in stock
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            In Stock
          </div>
        )}
      </div>

      {/* Quantity + Actions */}
      <div className="flex items-center gap-3 mb-4">
        {/* Quantity */}
        <div className="flex items-center border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-12 text-center text-sm font-bold text-foreground">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
            aria-label="Increase quantity"
            disabled={quantity >= product.stock}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Add to Cart */}
        <button
          onClick={onAddToCart}
          disabled={product.stock === 0}
          className={`flex-1 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all ${
            product.stock === 0
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-white hover:bg-foreground hover:shadow-lg'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>

        {/* Wishlist */}
        <button
          onClick={onWishlist}
          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${
            wishlisted ? 'border-primary bg-primary/10' : 'border-border hover:border-foreground'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={`w-5 h-5 ${wishlisted ? 'fill-primary stroke-primary' : 'fill-transparent stroke-foreground'}`}
            strokeWidth={1.75}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-3 mb-6 mt-2">
        {[
          { icon: '🚚', label: 'Free Delivery', sub: 'On orders above ₹999' },
          { icon: '↩️', label: '30-Day Returns', sub: 'Hassle-free returns' },
          { icon: '🔒', label: 'Secure Payment', sub: '100% protected' },
          { icon: '⭐', label: 'Authentic', sub: 'Genuine products only' },
        ].map(badge => (
          <div key={badge.label} className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/60 border border-border">
            <span className="text-xl">{badge.icon}</span>
            <div>
              <p className="text-xs font-semibold text-foreground leading-none">{badge.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{badge.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Accordion details */}
      <div className="border-t border-border">
        <AccordionItem title="Product Details">
          {product.specs && (
            <div className="space-y-2">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium text-foreground/70">{key}</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          )}
        </AccordionItem>
        <AccordionItem title="Shipping & Delivery">
          <p>Free standard delivery on orders above ₹999. Express delivery available at ₹199. Estimated delivery: 3–5 business days for metros, 5–7 for other locations.</p>
        </AccordionItem>
        <AccordionItem title="Returns & Exchanges">
          <p>Return within 30 days of delivery. Item must be unused, in original packaging. Initiate return from your account or contact support. Refund processed within 5–7 business days.</p>
        </AccordionItem>
      </div>
    </div>
  );
}
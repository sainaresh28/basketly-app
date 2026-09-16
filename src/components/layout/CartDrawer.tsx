'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/utils/format';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 999 ? 0 : 99;

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={closeDrawer}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-2xl flex flex-col slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display font-bold text-xl uppercase tracking-wide text-foreground">Your Cart</h2>
            {items?.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">{items?.length} item{items?.length > 1 ? 's' : ''}</p>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg uppercase text-foreground mb-2">Cart is empty</h3>
              <p className="text-sm text-muted-foreground mb-6">Add some products to get started</p>
              <button onClick={closeDrawer} className="btn-primary text-sm px-6 py-3">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items?.map(item => (
                <div key={item?.productId} className="flex gap-4 py-4 border-b border-border last:border-0">
                  <Link
                    href={`/product-detail?id=${item?.productId}`}
                    onClick={closeDrawer}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0"
                  >
                    <AppImage
                      src={item?.product?.images?.[0]}
                      alt={item?.product?.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product-detail?id=${item?.productId}`}
                      onClick={closeDrawer}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
                    >
                      {item?.product?.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{item?.product?.brand}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-border rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item?.productId, item?.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                          aria-label="Decrease"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-7 text-center text-sm font-semibold text-foreground">{item?.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item?.productId, item?.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
                          aria-label="Increase"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-sm font-bold text-foreground">{formatPrice(item?.product?.price * item?.quantity)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item?.productId)}
                    className="flex-shrink-0 self-start p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items?.length > 0 && (
          <div className="px-6 py-5 border-t border-border bg-muted/40">
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-foreground font-medium'}>
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(subtotal + shipping)}</span>
              </div>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="btn-primary w-full justify-center py-4 text-sm"
            >
              View Cart & Checkout
            </Link>
            <button
              onClick={closeDrawer}
              className="w-full mt-2 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
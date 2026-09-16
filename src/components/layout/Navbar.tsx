'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { BRAND } from '@/lib/brand';
import { formatPrice } from '@/utils/format';
import type { Product } from '@/types';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const cartCount = useCartStore(s => s.getItemCount());
  const openDrawer = useCartStore(s => s.openDrawer);
  const wishlistCount = useWishlistStore(s => s.getCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const { user } = useAuth();

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length <= 1) {
      setSearchResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}&limit=5`, {
          signal: controller.signal,
        });
        const json = await res.json();
        if (json.success) setSearchResults(json.data.products as Product[]);
      } catch {
        // ignore aborted/failed requests — search is best-effort
      }
    }, 250); // debounce so we don't hit the API on every keystroke

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-background'
        }`}
      >
        {/* Top announcement bar */}
        <div className="bg-dark-surface text-white text-center py-2 px-4">
          <p className="text-xs font-medium tracking-wide">
            Free shipping on orders over ₹999 &nbsp;·&nbsp; Use code <span className="font-bold text-amber">FIRST10</span> for 10% off
          </p>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <AppLogo size={36} />
              <span className="font-brand text-3xl sm:text-4xl tracking-tight text-foreground uppercase block">
                {BRAND.name}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {BRAND.nav.main.map(item => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2.5 rounded-full hover:bg-muted transition-colors hidden sm:flex items-center" aria-label="Wishlist">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[1.125rem] flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full leading-none px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openDrawer}
                className="relative p-2.5 rounded-full hover:bg-muted transition-colors flex items-center"
                aria-label="Cart"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[1.125rem] flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full leading-none px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <Link href="/account" className="hidden sm:flex p-2.5 rounded-full hover:bg-muted transition-colors" aria-label="Account">
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              {/* Mobile menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-full hover:bg-muted transition-colors"
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 left-0 right-0 bg-background pt-[5.5rem] pb-8 px-6 shadow-2xl animate-fade-in">
            <nav className="flex flex-col gap-1">
              {BRAND.nav.main.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-3 text-base font-semibold uppercase tracking-wider text-foreground border-b border-border"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                className="py-3 text-base font-semibold uppercase tracking-wider text-foreground border-b border-border"
                onClick={() => setMobileOpen(false)}
              >
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link
                href="/account"
                className="py-3 text-base font-semibold uppercase tracking-wider text-foreground border-b border-border"
                onClick={() => setMobileOpen(false)}
              >
                Account
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
          />
          <div className="relative w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories…"
                className="flex-1 bg-transparent text-foreground placeholder-muted-foreground text-base outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="py-2 max-h-80 overflow-y-auto">
                {searchResults.map(product => (
                  <Link
                    key={product.id}
                    href={`/product-detail?id=${product.id}`}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-muted transition-colors"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.categoryName} · {formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : searchQuery.trim().length > 1 ? (
              <div className="py-10 text-center text-muted-foreground text-sm">
                No results for "{searchQuery}"
              </div>
            ) : (
              <div className="px-5 py-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Headphones', 'Sneakers', 'Backpack', 'Watch', 'Hoodie', 'Skincare'].map(term => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1.5 text-sm bg-muted rounded-full hover:bg-border transition-colors text-foreground"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
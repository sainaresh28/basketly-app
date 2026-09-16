'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 9.5V20a1 1 0 001 1H9a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2.5a1 1 0 001-1V9.5" />
    </svg>
  );
}
function CategoriesIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" fill={active ? 'currentColor' : 'none'} />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" fill={active ? 'currentColor' : 'none'} />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" fill={active ? 'currentColor' : 'none'} />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" fill={active ? 'currentColor' : 'none'} />
    </svg>
  );
}
function NewIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.6 5.6L21 9.3l-4.6 4.2 1.2 6.2L12 16.8l-5.6 2.9 1.2-6.2L3 9.3l6.4-0.7L12 3z" />
    </svg>
  );
}
function CartIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 9h14l1 12H4L5 9z" fill={active ? 'currentColor' : 'none'} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4" />
    </svg>
  );
}
function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="8" r="3.5" fill={active ? 'currentColor' : 'none'} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 20a7 7 0 0114 0" fill={active ? 'currentColor' : 'none'} />
    </svg>
  );
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.getItemCount());

  const items = [
    { href: '/', label: 'Home', icon: HomeIcon, match: (p: string) => p === '/' },
    { href: '/products', label: 'Categories', icon: CategoriesIcon, match: (p: string) => p === '/products' },
    { href: '/new-arrivals', label: 'New', icon: NewIcon, match: (p: string) => p === '/new-arrivals' },
    { href: '/cart', label: 'Cart', icon: CartIcon, match: (p: string) => p === '/cart' },
    { href: '/account', label: 'Profile', icon: ProfileIcon, match: (p: string) => p === '/account' },
  ];

  return (
    <nav
      className="lg:hidden print:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary mobile navigation"
    >
      <div className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={label}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="relative">
                <Icon active={active} />
                {label === 'Cart' && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[1rem] h-4 px-1 flex items-center justify-center bg-primary text-white text-[9px] font-bold rounded-full leading-none">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

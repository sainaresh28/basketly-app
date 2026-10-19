'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import AppIcon from '@/components/ui/AppIcon';
import { useAuth } from '@/lib/auth-context';

export type AccountSection = 'overview' | 'orders' | 'wishlist' | 'addresses' | 'payments' | 'notifications' | 'settings';

export const NAV_ITEMS: { key: AccountSection; label: string; href: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', href: '/account', icon: 'HomeIcon' },
  { key: 'orders', label: 'My Orders', href: '/orders', icon: 'ArchiveBoxIcon' },
  { key: 'wishlist', label: 'Wishlist', href: '/wishlist', icon: 'HeartIcon' },
  { key: 'addresses', label: 'Addresses', href: '/account/addresses', icon: 'MapPinIcon' },
  { key: 'payments', label: 'Payment Methods', href: '/account/payments', icon: 'CreditCardIcon' },
  { key: 'notifications', label: 'Notifications', href: '/account/notifications', icon: 'BellIcon' },
  { key: 'settings', label: 'Settings', href: '/account/settings', icon: 'Cog6ToothIcon' },
];

const NAV_COLORS: Record<AccountSection, string> = {
  overview: 'bg-primary text-white',
  orders: 'bg-blue-accent text-white',
  wishlist: 'bg-primary text-white',
  addresses: 'bg-secondary text-foreground',
  payments: 'bg-blue-accent text-white',
  notifications: 'bg-primary text-white',
  settings: 'bg-secondary text-foreground',
};

export function MobileAccountNav({ active }: { active: AccountSection }) {
  const { logout } = useAuth();
  return (
    <nav className="lg:hidden mb-6">
      <div className="grid grid-cols-4 gap-2.5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-center transition-all ${
                isActive ? `${NAV_COLORS[item.key]} shadow-md scale-[1.02]` : 'bg-muted text-foreground'
              }`}
            >
              <span className="relative">
                <AppIcon name={item.icon} size={18} />
                {item.key === 'notifications' && (
                  <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${isActive ? 'bg-white' : 'bg-primary'}`} />
                )}
              </span>
              <span className="text-[10px] font-bold leading-tight">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => logout()}
          className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-dark-surface px-2 py-3 text-center text-white"
        >
          <AppIcon name="ArrowLeftOnRectangleIcon" size={18} />
          <span className="text-[10px] font-bold leading-tight">Log Out</span>
        </button>
      </div>
    </nav>
  );
}

export default function AccountSidebar({ active }: { active: AccountSection }) {
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">My Account</span>
        <nav className="mt-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? `${NAV_COLORS[item.key]} shadow-sm`
                    : 'text-foreground hover:bg-muted hover:text-primary'
                }`}
              >
                <span className="relative">
                  <AppIcon name={item.icon} size={18} />
                  {item.key === 'notifications' && (
                    <span className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-primary'}`} />
                  )}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 border-t border-border pt-4">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            <AppIcon name="ArrowLeftOnRectangleIcon" size={18} />
            Log Out
          </button>
        </div>

        <div className="mt-8 rounded-3xl bg-primary p-6 overflow-hidden relative">
          <h3 className="font-display font-black uppercase text-2xl leading-[0.95] text-white">
            Good Style Stays<br /><span className="text-secondary">With You.</span>
          </h3>
          <p className="mt-3 text-xs leading-5 text-white/80">
            Discover new arrivals crafted for your everyday.
          </p>
          <Link
            href="/new-arrivals"
            className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 hover:bg-secondary transition-colors"
            aria-label="Shop new arrivals"
          >
            <AppIcon name="ArrowRightIcon" size={16} />
          </Link>
          <div className="mt-5 -mx-6 -mb-6 h-36 relative">
            <AppImage
              src="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80"
              alt="New arrivals"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

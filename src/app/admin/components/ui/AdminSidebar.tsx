'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  GridIcon,
  BoxIcon,
  TagIcon,
  CartIcon,
  UsersIcon,
  HeartIcon,
  CloseIcon,
  LogoutIcon,
  ExternalLinkIcon,
} from './icons';

const NAV_SECTIONS: {
  label: string;
  links: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
}[] = [
  {
    label: 'Store',
    links: [
      { href: '/admin', label: 'Overview', icon: GridIcon },
      { href: '/admin/products', label: 'Products', icon: BoxIcon },
      { href: '/admin/categories', label: 'Categories', icon: TagIcon },
      { href: '/admin/orders', label: 'Orders', icon: CartIcon },
    ],
  },
  {
    label: 'People',
    links: [
      { href: '/admin/users', label: 'Users', icon: UsersIcon },
      { href: '/admin/cart-wishlist', label: 'Cart & Wishlist', icon: HeartIcon },
    ],
  },
];

function NavLink({
  href,
  label,
  Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-white/60 hover:bg-white/5 hover:text-white'
      }`}>
      <Icon className={active ? 'text-primary-foreground' : 'text-white/40 group-hover:text-white'} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function AdminSidebar({
  open,
  onClose,
  userName,
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 flex-col bg-dark-surface transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-2 font-display font-black uppercase text-lg text-white">
            Basketly <span className="text-primary">Admin</span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close menu">
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6 pt-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <span className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                {section.label}
              </span>
              <div className="mt-2 space-y-1">
                {section.links.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    Icon={link.icon}
                    active={isActive(link.href)}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white">
            <ExternalLinkIcon className="text-white/40" />
            View Site
          </Link>
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white">
            <LogoutIcon className="text-white/40" />
            Sign Out
          </button>
          <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-white/5 px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">{userName}</p>
              <p className="text-[11px] text-white/40">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

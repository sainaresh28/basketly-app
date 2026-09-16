'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const LINKS = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/products', label: 'Products & Inventory' },
  { href: '/admin/orders', label: 'Orders' },
];

export default function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-display font-black uppercase text-lg text-foreground">
            Basketly <span className="text-primary">Admin</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-wide transition-colors ${
                  pathname === link.href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs text-muted-foreground">Hi, {userName.split(' ')[0]}</span>
          <Link href="/" className="text-xs font-bold text-muted-foreground hover:text-foreground">View Site</Link>
          <button onClick={() => logout()} className="text-xs font-bold text-primary">Sign Out</button>
        </div>
      </div>
    </header>
  );
}

'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MenuIcon, SearchIcon, BellIcon } from './icons';

export default function AdminTopbar({
  userName,
  onMenuClick,
}: {
  userName: string;
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    router.push(term ? `/admin/products?q=${encodeURIComponent(term)}` : '/admin/products');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-foreground hover:bg-muted lg:hidden"
        aria-label="Open menu">
        <MenuIcon />
      </button>

      <form onSubmit={handleSearch} className="hidden flex-1 max-w-sm sm:flex">
        <label className="relative w-full">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width={16} height={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search products, users, orders..."
            className="w-full rounded-xl border border-border bg-muted/60 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </label>
      </form>

      <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
        <button
          type="button"
          className="relative rounded-full p-2 text-foreground hover:bg-muted"
          aria-label="Notifications">
          <BellIcon width={19} height={19} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <div className="hidden items-center gap-2.5 rounded-full border border-border py-1 pl-1 pr-3 sm:flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-black text-primary-foreground">
            {userName.charAt(0).toUpperCase()}
          </span>
          <span className="text-xs font-bold text-foreground">{userName.split(' ')[0]}</span>
        </div>
      </div>
    </header>
  );
}

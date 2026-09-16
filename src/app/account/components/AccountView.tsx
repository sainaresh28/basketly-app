'use client';
import React from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useAuth } from '@/lib/auth-context';
import EditProfileForm from './EditProfileForm';
import AddressBook from './AddressBook';

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <strong className="font-display font-black text-4xl uppercase text-foreground block mt-6">{value}</strong>
    </div>
  );
}

export default function AccountView() {
  const { user, isLoading, logout } = useAuth();
  const cartCount = useCartStore((s) => s.items.length);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [orderCount, setOrderCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!user) return;
    fetch('/api/orders')
      .then((r) => r.json())
      .then((json) => setOrderCount(json?.data?.orders?.length ?? 0))
      .catch(() => setOrderCount(0));
  }, [user]);

  if (isLoading) {
    return (
      <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto animate-pulse">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-16 w-2/3 bg-muted rounded mt-4" />
        </div>
      </section>
    );
  }

  if (user) {
    const firstName = user.name.split(' ')[0];
    return (
      <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto">
          <span className="section-label mb-3">Your Space</span>
          <h1 className="font-display font-black uppercase text-display-xl text-foreground leading-[0.88]">
            Hello,<br /><span className="text-primary">{firstName}.</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <InfoBlock label="Orders" value={orderCount === null ? '—' : String(orderCount)} />
            <InfoBlock label="Saved Pieces" value={String(wishlistCount)} />
            <InfoBlock label="Basket Status" value={cartCount ? 'Ready' : 'Quiet'} />
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/orders" className="text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
              View Order History
            </Link>
            {user.role === 'admin' && (
              <Link href="/admin" className="text-sm font-bold text-primary border-b-2 border-primary pb-1">
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <EditProfileForm user={user} />
            <AddressBook />
          </div>

          <button
            onClick={() => logout()}
            className="mt-9 text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
            Sign Out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-xl mx-auto">
        <span className="section-label mb-3">Basketly / Members</span>
        <h1 className="font-display font-black uppercase text-display-xl text-foreground leading-[0.88]">
          Keep the<br /><span className="text-primary">good stuff</span><br />close.
        </h1>
        <p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground">
          Sign in to save your finds, see your orders and pick up where you left off.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="btn-primary py-3 px-6 text-xs">Sign In</Link>
          <Link href="/register" className="btn-outline py-3 px-6 text-xs">Create Account</Link>
        </div>
      </div>
    </section>
  );
}

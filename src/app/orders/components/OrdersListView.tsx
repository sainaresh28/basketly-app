'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { formatPrice } from '@/utils/format';
import { useAuth } from '@/lib/auth-context';
import type { Order, OrderStatus, Product } from '@/types';
import AccountShell from '@/app/account/components/AccountShell';
import OrderProgressTrack from '@/app/account/components/OrderProgressTrack';
import { STATUS_BADGE_CLASSES, STATUS_LABEL, orderCode } from '@/app/account/components/orderStatus';

type Tab = 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const TABS: { key: Tab; label: string; match: (s: OrderStatus) => boolean }[] = [
  { key: 'all', label: 'All Orders', match: () => true },
  { key: 'processing', label: 'Processing', match: (s) => s === 'pending' || s === 'paid' || s === 'processing' },
  { key: 'shipped', label: 'Shipped', match: (s) => s === 'shipped' },
  { key: 'delivered', label: 'Delivered', match: (s) => s === 'delivered' },
  { key: 'cancelled', label: 'Cancelled', match: (s) => s === 'cancelled' },
];

const STATUS_ICON: Record<OrderStatus, string> = {
  pending: 'ClockIcon', paid: 'CheckCircleIcon', processing: 'ClockIcon',
  shipped: 'TruckIcon', delivered: 'CheckCircleIcon', cancelled: 'XCircleIcon',
};

function statusLine(order: Order): string {
  if (order.status === 'cancelled') return `Cancelled on ${new Date(order.cancelledAt || order.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  if (order.status === 'delivered') return `Delivered on ${new Date(order.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  if (order.status === 'shipped') return order.estimatedDelivery ? `Arriving by ${order.estimatedDelivery}` : 'On its way to you';
  return order.estimatedDelivery ? `Expected by ${order.estimatedDelivery}` : 'Being prepared for shipment';
}

function OrderRow({ order }: { order: Order }) {
  const date = new Date(order.createdAt);
  const extra = order.items.length - 2;
  return (
    <div className="rounded-2xl border border-border p-4 sm:p-5 hover:border-primary/40 transition-colors">
      <div className="flex flex-wrap items-start gap-4 sm:gap-5">
        <div className="flex items-center gap-3 sm:contents">
          <div className="text-center shrink-0 w-11">
            <p className="font-display font-black text-2xl text-foreground leading-none">{date.getDate().toString().padStart(2, '0')}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mt-0.5">{date.toLocaleString('en-IN', { month: 'short' })}</p>
            <p className="text-[10px] text-muted-foreground">{date.getFullYear()}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {order.items.slice(0, 2).map((item) => (
              <div key={item.productId} className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-muted overflow-hidden relative">
                <AppImage src={item.image} alt={item.name} fill className="object-cover" />
              </div>
            ))}
            {extra > 0 && (
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">+{extra}</div>
            )}
          </div>
        </div>

        <div className="min-w-[160px] flex-1">
          <p className="text-sm font-bold text-foreground">Order {orderCode(order)}</p>
          <span className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_BADGE_CLASSES[order.status]}`}>
            <AppIcon name={STATUS_ICON[order.status]} size={12} variant="solid" />
            {STATUS_LABEL[order.status]}
          </span>
          <p className="mt-1.5 text-xs text-muted-foreground">{statusLine(order)}</p>
        </div>

        <div className="w-full order-last lg:order-none lg:w-[240px] pt-1">
          <OrderProgressTrack status={order.status} />
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto sm:ml-auto sm:items-end shrink-0">
          <p className="text-base font-bold text-foreground sm:text-right">{formatPrice(order.total)}</p>
          <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:w-auto">
            <Link href={`/orders/${order.id}`} className="btn-dark py-2 px-4 text-[11px] whitespace-nowrap text-center">View Details</Link>
            <Link href="/products" className="btn-outline py-2 px-4 text-[11px] whitespace-nowrap text-center">Buy Again</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyRecommendations() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch('/api/products?sort=newest&limit=4')
      .then((r) => r.json())
      .then((json) => setProducts(json?.data?.products ?? []))
      .catch(() => setProducts([]));
  }, []);
  if (!products.length) return null;
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">You might like these</h3>
        <Link href="/products" className="text-xs font-bold uppercase tracking-wide text-foreground hover:text-primary transition-colors">View All</Link>
      </div>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((p) => (
          <Link key={p.id} href={`/product-detail?id=${p.id}`} className="group">
            <div className="relative aspect-square rounded-2xl bg-muted overflow-hidden">
              <AppImage src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform" />
            </div>
            <p className="mt-2 text-sm font-semibold text-foreground truncate">{p.name}</p>
            <p className="text-sm text-muted-foreground">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SideRail({ hasOrders }: { hasOrders: boolean }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-secondary/20 p-6 relative overflow-hidden min-h-[190px]">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">New Season</span>
        <h3 className="mt-2 font-display font-black uppercase text-2xl leading-[0.95] text-foreground">
          {hasOrders ? <>The Next Drop<br />Is Coming.</> : <>Discover<br />What&apos;s Next.</>}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground max-w-[180px]">
          {hasOrders ? 'Be the first to know about new arrivals, exclusive drops and special offers.' : 'Fresh styles. Bolder choices. Just for you.'}
        </p>
        <Link href="/new-arrivals" className="btn-dark mt-4 inline-flex py-2.5 px-5 text-[11px]">
          {hasOrders ? 'Notify Me' : 'Shop New Arrivals'}
        </Link>
      </div>

      <div className="rounded-2xl border border-border p-6">
        <h3 className="text-sm font-bold text-foreground">Need Help?</h3>
        <p className="mt-2 text-xs text-muted-foreground leading-5">
          We&apos;re here for you. Get support for orders, payments, or returns.
        </p>
        <Link href="/support" className="btn-outline mt-4 inline-flex w-full justify-center py-2.5 text-[11px]">Contact Support</Link>
      </div>

      <div className="rounded-2xl border border-border divide-y divide-border">
        {[
          { icon: 'TruckIcon', title: 'Track an Order', sub: 'Enter tracking ID', href: '/orders' },
          { icon: 'ArchiveBoxIcon', title: 'Return or Exchange', sub: 'Start a return', href: '/support' },
          { icon: 'HeartIcon', title: 'View Wishlist', sub: 'Your saved items', href: '/wishlist' },
          { icon: 'MapPinIcon', title: 'Manage Addresses', sub: 'Add or edit', href: '/account/addresses' },
          { icon: 'CreditCardIcon', title: 'Payment Methods', sub: 'Manage your cards', href: '/account/payments' },
        ].map((l) => (
          <Link key={l.title} href={l.href} className="flex items-center gap-3 p-4 hover:bg-muted/60 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
            <AppIcon name={l.icon} size={18} className="text-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{l.title}</p>
              <p className="text-xs text-muted-foreground truncate">{l.sub}</p>
            </div>
            <AppIcon name="ChevronRightIcon" size={15} className="ml-auto shrink-0 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function OrdersListView() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [tab, setTab] = useState<Tab>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    if (!user) return;
    fetch('/api/orders')
      .then((r) => r.json())
      .then((json) => setOrders(json?.data?.orders ?? []));
  }, [user]);

  const filtered = useMemo(() => {
    if (!orders) return [];
    const tabDef = TABS.find((t) => t.key === tab)!;
    const list = orders.filter((o) => tabDef.match(o.status));
    return [...list].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sort === 'newest' ? -diff : diff;
    });
  }, [orders, tab, sort]);

  if (authLoading || (user && orders === null)) {
    return (
      <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1500px] mx-auto animate-pulse h-64" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-xl mx-auto text-center py-16">
          <h1 className="font-display font-black uppercase text-display-md text-foreground">Sign in to see your orders</h1>
          <Link href="/login?redirect=/orders" className="btn-primary inline-flex mt-6 py-3 px-6 text-xs">Sign In</Link>
        </div>
      </section>
    );
  }

  const hasOrders = (orders?.length ?? 0) > 0;

  return (
    <AccountShell
      active="orders"
      crumb="Orders"
      title={<>Your <span className="text-primary">Orders.</span></>}
      subtitle="Track, manage and revisit your purchases."
      tagline="More Good Days Ahead."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {hasOrders && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
              <div className="flex gap-5 overflow-x-auto no-scrollbar">
                {TABS.map((t) => {
                  const count = orders!.filter((o) => t.match(o.status)).length;
                  const activeTab = tab === t.key;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`pb-3 -mb-3 shrink-0 whitespace-nowrap text-sm font-bold border-b-2 transition-colors ${
                        activeTab ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t.label} {t.key === 'all' ? `(${count})` : count ? `(${count})` : ''}
                    </button>
                  );
                })}
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground shrink-0">
                Sort by:
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-bold text-foreground focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </label>
            </div>
          )}

          {!hasOrders ? (
            <>
              <div className="mt-6 rounded-3xl border border-border p-10 sm:p-14 flex flex-col items-center text-center">
                <AppIcon name="ArchiveBoxIcon" size={56} className="text-primary/60" />
                <h2 className="mt-6 font-display font-black uppercase text-2xl text-foreground">You haven&apos;t placed any orders yet.</h2>
                <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                  Looks like your style journey is just getting started. Explore our latest collections and find your next favourite.
                </p>
                <Link href="/products" className="btn-dark mt-6 py-3 px-6 text-xs">Start Shopping</Link>
              </div>
              <EmptyRecommendations />
            </>
          ) : (
            <div className="mt-5 space-y-4">
              {filtered.map((order) => <OrderRow key={order.id} order={order} />)}
            </div>
          )}
        </div>

        <SideRail hasOrders={hasOrders} />
      </div>
    </AccountShell>
  );
}

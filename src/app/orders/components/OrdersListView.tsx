'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/utils/format';
import { useAuth } from '@/lib/auth-context';
import type { Order } from '@/types';

const STATUS_LABEL: Record<Order['status'], string> = {
  pending: 'Pending', paid: 'Paid', processing: 'Processing',
  shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function OrdersListView() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/orders')
      .then((r) => r.json())
      .then((json) => setOrders(json?.data?.orders ?? []));
  }, [user]);

  if (authLoading || (user && orders === null)) {
    return <div className="max-w-[900px] mx-auto animate-pulse h-64" />;
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="font-display font-black uppercase text-display-md text-foreground">Sign in to see your orders</h1>
        <Link href="/login?redirect=/orders" className="btn-primary inline-flex mt-6 py-3 px-6 text-xs">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto">
      <span className="section-label mb-3">Basketly / History</span>
      <h1 className="font-display font-black uppercase text-display-xl text-foreground leading-[0.88]">
        Your <span className="text-primary">orders.</span>
      </h1>

      {orders && orders.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-border bg-secondary/25 p-8 sm:p-12">
          <h2 className="font-display font-black uppercase text-display-md text-foreground leading-[0.9]">No orders yet.</h2>
          <Link href="/products" className="mt-6 inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1">Start browsing →</Link>
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {orders?.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-border p-5 hover:border-primary transition-colors">
              <div>
                <p className="text-sm font-bold text-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-foreground">{formatPrice(order.total)}</p>
                <div className="mt-1 flex items-center justify-end gap-1.5">
                  {order.paymentMethod === 'cod' && (
                    <span className="inline-block rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                      COD
                    </span>
                  )}
                  <span className="inline-block rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground">
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

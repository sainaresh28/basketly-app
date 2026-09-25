'use client';
import React, { useEffect, useState } from 'react';
import { formatPrice } from '@/utils/format';
import Pagination from './ui/Pagination';
import { usePagination } from '@/hooks/usePagination';
import type { Order, OrderStatus } from '@/types';

const STATUSES: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersView() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [trackingDraft, setTrackingDraft] = useState<{ trackingNumber: string; courier: string; estimatedDelivery: string }>({
    trackingNumber: '', courier: '', estimatedDelivery: '',
  });

  const load = () => {
    fetch('/api/admin/orders').then((r) => r.json()).then((json) => setOrders(json?.data?.orders ?? []));
  };
  useEffect(load, []);

  const updateStatus = async (order: Order, status: OrderStatus) => {
    setBusyId(order.id);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    load();
  };

  const openTrackingEditor = (order: Order) => {
    setExpandedId(expandedId === order.id ? null : order.id);
    setTrackingDraft({
      trackingNumber: order.trackingNumber || '',
      courier: order.courier || '',
      estimatedDelivery: order.estimatedDelivery || '',
    });
  };

  const saveTracking = async (order: Order) => {
    setBusyId(order.id);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: order.status, ...trackingDraft }),
    });
    setBusyId(null);
    setExpandedId(null);
    load();
  };

  const refund = async (order: Order) => {
    setBusyId(order.id);
    await fetch(`/api/admin/orders/${order.id}/refund`, { method: 'POST' });
    setBusyId(null);
    load();
  };

  const visible = orders?.filter((o) => filter === 'all' || o.status === filter) ?? [];
  const { page, setPage, totalPages, pageSize, paged, totalItems } = usePagination(visible);
  useEffect(() => setPage(1), [filter, setPage]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display font-black uppercase text-3xl text-foreground">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value as OrderStatus | 'all')}
          className="rounded-xl border border-border px-4 py-2 text-sm bg-white">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {!orders ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-muted" />
      ) : visible.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No orders match this filter.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">Order</th>
                <th className="px-4 py-3 font-bold">Date</th>
                <th className="px-4 py-3 font-bold">Items</th>
                <th className="px-4 py-3 font-bold">Total</th>
                <th className="px-4 py-3 font-bold">Payment</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Tracking</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((o) => (
                <React.Fragment key={o.id}>
                  <tr className="border-t border-border align-top">
                    <td className="px-4 py-3 font-semibold text-foreground">#{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.items.length}</td>
                    <td className="px-4 py-3 text-foreground">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {o.paymentMethod === 'cod' ? 'COD' : 'Online'}
                      <div className="text-[10px] uppercase font-bold text-muted-foreground/70">{o.paymentStatus}</div>
                      {o.paymentMethod === 'online' && (o.paymentStatus === 'refund_pending' || o.paymentStatus === 'refund_failed') && (
                        <button
                          onClick={() => refund(o)}
                          disabled={busyId === o.id}
                          className="mt-1 text-[11px] font-bold text-primary underline">
                          {busyId === o.id ? 'Refunding…' : 'Retry refund'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        disabled={busyId === o.id}
                        onChange={(e) => updateStatus(o, e.target.value as OrderStatus)}
                        className="rounded-lg border border-border px-2 py-1 text-xs bg-white">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openTrackingEditor(o)} className="text-xs font-bold text-foreground underline">
                        {o.trackingNumber ? 'Edit' : 'Add'} tracking
                      </button>
                      {o.trackingNumber && <div className="mt-1 text-[11px] text-muted-foreground">{o.courier} · {o.trackingNumber}</div>}
                    </td>
                  </tr>
                  {expandedId === o.id && (
                    <tr className="border-t border-border bg-secondary/20">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="flex flex-wrap gap-3 items-end">
                          <label className="text-xs font-bold text-muted-foreground">
                            Courier
                            <input value={trackingDraft.courier} onChange={(e) => setTrackingDraft({ ...trackingDraft, courier: e.target.value })}
                              className="mt-1 block rounded-lg border border-border px-2.5 py-1.5 text-sm" />
                          </label>
                          <label className="text-xs font-bold text-muted-foreground">
                            Tracking Number
                            <input value={trackingDraft.trackingNumber} onChange={(e) => setTrackingDraft({ ...trackingDraft, trackingNumber: e.target.value })}
                              className="mt-1 block rounded-lg border border-border px-2.5 py-1.5 text-sm" />
                          </label>
                          <label className="text-xs font-bold text-muted-foreground">
                            Estimated Delivery
                            <input value={trackingDraft.estimatedDelivery} onChange={(e) => setTrackingDraft({ ...trackingDraft, estimatedDelivery: e.target.value })}
                              placeholder="e.g. 3-5 days" className="mt-1 block rounded-lg border border-border px-2.5 py-1.5 text-sm" />
                          </label>
                          <button onClick={() => saveTracking(o)} disabled={busyId === o.id} className="btn-dark py-2 px-4 text-xs disabled:opacity-60">
                            {busyId === o.id ? 'Saving…' : 'Save'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} totalItems={totalItems} pageSize={pageSize} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

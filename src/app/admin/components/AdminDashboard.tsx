'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice } from '@/utils/format';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  lowStockProducts: { id: string; name: string; stock: number }[];
  recentOrders: { id: string; total: number; status: string; createdAt: string }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <strong className={`block mt-3 font-display font-black text-3xl ${accent ? 'text-primary' : 'text-foreground'}`}>{value}</strong>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then((json) => setStats(json?.data ?? null));
  }, []);

  if (!stats) return <div className="animate-pulse h-64" />;

  return (
    <div>
      <h1 className="font-display font-black uppercase text-3xl text-foreground">Overview</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Orders" value={String(stats.totalOrders)} />
        <StatCard label="Revenue" value={formatPrice(stats.totalRevenue)} />
        <StatCard label="Products" value={String(stats.totalProducts)} />
        <StatCard label="Low Stock" value={String(stats.lowStockCount)} accent={stats.lowStockCount > 0} />
        <StatCard label="Out of Stock" value={String(stats.outOfStockCount)} accent={stats.outOfStockCount > 0} />
      </div>

      <div className="mt-8 rounded-2xl border border-border p-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Revenue — Last 7 Days</span>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.revenueByDay}>
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => formatPrice(value)} />
              <Bar dataKey="revenue" fill="#e11d2f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Recent Orders</span>
            <Link href="/admin/orders" className="text-xs font-bold text-primary">View all →</Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats.recentOrders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
            {stats.recentOrders.map((o) => (
              <div key={o.id} className="flex justify-between text-sm">
                <span className="text-foreground">#{o.id.slice(0, 8).toUpperCase()}</span>
                <span className="text-muted-foreground">{o.status}</span>
                <span className="font-semibold text-foreground">{formatPrice(o.total)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Low Stock Alerts</span>
            <Link href="/admin/products" className="text-xs font-bold text-primary">Manage →</Link>
          </div>
          <div className="mt-4 space-y-3">
            {stats.lowStockProducts.length === 0 && <p className="text-sm text-muted-foreground">Everything's well stocked.</p>}
            {stats.lowStockProducts.map((p) => (
              <div key={p.id} className="flex justify-between text-sm">
                <span className="text-foreground line-clamp-1">{p.name}</span>
                <span className="font-semibold text-primary">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

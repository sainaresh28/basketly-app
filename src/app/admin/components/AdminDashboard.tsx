'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPrice } from '@/utils/format';
import { Card, CardHeader, ViewAllLink } from './ui/Card';
import StatCard from './ui/StatCard';
import { BoxIcon, CartIcon, HeartIcon, TagIcon, UsersIcon, AlertIcon, PlusIcon } from './ui/icons';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  cartItemCount: number;
  wishlistItemCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  lowStockProducts: { id: string; name: string; stock: number }[];
  recentOrders: { id: string; total: number; status: string; createdAt: string }[];
  recentUsers: { id: string; name: string; email: string; createdAt: string }[];
  revenueByDay: { date: string; revenue: number; orders: number }[];
  revenueTrendPercent: number;
  ordersTrendPercent: number;
  categoryDistribution: { id: string; name: string; productCount: number }[];
}

const DONUT_COLORS = ['#FF5624', '#238DFB', '#FFBA30', '#10B981', '#8B5CF6', '#EC4899', '#64748B'];

const STATUS_STYLES: Record<string, string> = {
  delivered: 'bg-emerald-500/10 text-emerald-600',
  shipped: 'bg-violet-500/10 text-violet-600',
  processing: 'bg-[#238DFB]/10 text-[#238DFB]',
  paid: 'bg-[#238DFB]/10 text-[#238DFB]',
  pending: 'bg-amber-500/10 text-amber-600',
  cancelled: 'bg-red-500/10 text-red-600',
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_STYLES[status] || 'bg-muted text-muted-foreground'}`}>
      {status}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setStats(json?.data ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats) return <DashboardSkeleton />;

  const totalCategoryProducts = stats.categoryDistribution.reduce((s, c) => s + c.productCount, 0) || 1;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-black uppercase text-3xl text-foreground">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <Link href="/admin/products/new" className="btn-dark inline-flex items-center gap-1.5 py-2.5 px-4 text-xs">
          <PlusIcon width={14} height={14} /> Add Product
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={<CartIcon />}
          tone="orange"
          trendPercent={stats.revenueTrendPercent}
          caption="vs previous 7 days"
          sparkline={stats.revenueByDay.map((d) => d.revenue)}
        />
        <StatCard
          label="Total Orders"
          value={String(stats.totalOrders)}
          icon={<TagIcon />}
          tone="blue"
          trendPercent={stats.ordersTrendPercent}
          caption="vs previous 7 days"
          sparkline={stats.revenueByDay.map((d) => d.orders)}
        />
        <StatCard label="Total Users" value={String(stats.totalUsers)} icon={<UsersIcon />} tone="purple" />
        <StatCard label="Total Products" value={String(stats.totalProducts)} icon={<BoxIcon />} tone="green" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Low Stock"
          value={String(stats.lowStockCount)}
          icon={<AlertIcon />}
          tone={stats.lowStockCount > 0 ? 'pink' : 'green'}
        />
        <StatCard
          label="Out of Stock"
          value={String(stats.outOfStockCount)}
          icon={<AlertIcon />}
          tone={stats.outOfStockCount > 0 ? 'pink' : 'green'}
        />
        <StatCard label="Cart Items" value={String(stats.cartItemCount)} icon={<CartIcon />} tone="orange" />
        <StatCard label="Wishlist Items" value={String(stats.wishlistItemCount)} icon={<HeartIcon />} tone="pink" />
      </div>

      {/* Revenue chart + category donut */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue — Last 7 Days" />
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueByDay}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF5624" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#FF5624" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip formatter={(value: number) => formatPrice(value)} contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#FF5624" strokeWidth={2} fill="url(#revenueFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Category Distribution" />
          {stats.categoryDistribution.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <>
              <div className="relative mt-2 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryDistribution}
                      dataKey="productCount"
                      nameKey="name"
                      innerRadius="65%"
                      outerRadius="100%"
                      paddingAngle={2}
                      isAnimationActive={false}>
                      {stats.categoryDistribution.map((c, i) => (
                        <Cell key={c.id} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid var(--border)', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <strong className="font-display font-black text-2xl text-foreground">{stats.totalProducts}</strong>
                  <span className="text-[11px] text-muted-foreground">Products</span>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {stats.categoryDistribution.slice(0, 5).map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                      {c.name}
                    </span>
                    <span className="font-semibold text-muted-foreground">
                      {Math.round((c.productCount / totalCategoryProducts) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Lists */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader title="Recent Orders" action={<ViewAllLink href="/admin/orders" />} />
          <div className="mt-4 space-y-3">
            {stats.recentOrders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
            {stats.recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-foreground">#{o.id.slice(0, 8).toUpperCase()}</span>
                <StatusPill status={o.status} />
                <span className="font-bold text-foreground">{formatPrice(o.total)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Low Stock Alerts" action={<ViewAllLink href="/admin/products">Manage</ViewAllLink>} />
          <div className="mt-4 space-y-3">
            {stats.lowStockProducts.length === 0 && <p className="text-sm text-muted-foreground">Everything&apos;s well stocked.</p>}
            {stats.lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="line-clamp-1 text-foreground">{p.name}</span>
                <span className="shrink-0 font-bold text-primary">{p.stock} left</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="New Signups" action={<ViewAllLink href="/admin/users" />} />
          <div className="mt-4 space-y-3">
            {stats.recentUsers.length === 0 && <p className="text-sm text-muted-foreground">No users yet.</p>}
            {stats.recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-2.5 text-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-black text-secondary-foreground">
                  {u.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

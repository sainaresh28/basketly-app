'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import Toggle from '@/components/ui/Toggle';
import AccountShell from './AccountShell';

type Category = 'orders' | 'offers' | 'account' | 'updates';
type Tab = 'all' | Category;

type Notification = {
  id: string;
  category: Category;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const NOTIFICATIONS: Notification[] = [
  { id: 'n1', category: 'orders', icon: 'ShoppingBagIcon', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', title: 'Order Delivered', body: 'Your order #35448DB6 has been delivered successfully. We hope you love it!', time: '2 hours ago', unread: true },
  { id: 'n2', category: 'orders', icon: 'CubeIcon', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', title: 'Order Shipped', body: 'Your order #35448DB6 has been shipped and is on its way.', time: '1 day ago', unread: true },
  { id: 'n3', category: 'offers', icon: 'TagIcon', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', title: 'Special Offer', body: 'Get 23% off on selected bags. Limited time only!', time: '2 days ago', unread: true },
  { id: 'n4', category: 'updates', icon: 'HeartIcon', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', title: 'Item Back in Stock', body: 'The product you added to your wishlist is back in stock!', time: '4 days ago', unread: false },
  { id: 'n5', category: 'account', icon: 'SparklesIcon', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', title: 'Welcome to Basketly!', body: 'Thanks for joining us. Start exploring the latest drops!', time: '1 week ago', unread: false },
  { id: 'n6', category: 'account', icon: 'Cog6ToothIcon', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', title: 'Account Updated', body: 'Your account details have been successfully updated.', time: '1 week ago', unread: false },
  { id: 'n7', category: 'updates', icon: 'BellIcon', iconBg: 'bg-muted', iconColor: 'text-foreground', title: 'Price Drop', body: 'An item in your wishlist is now at a lower price.', time: '1 week ago', unread: false },
  { id: 'n8', category: 'updates', icon: 'SparklesIcon', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', title: 'New Arrivals', body: 'Check out the latest collection just for you.', time: '2 weeks ago', unread: false },
];

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'orders', label: 'Orders' },
  { key: 'offers', label: 'Offers' },
  { key: 'account', label: 'Account' },
  { key: 'updates', label: 'Updates' },
];

const SETTINGS_DEFAULT: { key: string; label: string; icon: string; on: boolean }[] = [
  { key: 'orderUpdates', label: 'Order Updates', icon: 'EnvelopeIcon', on: true },
  { key: 'offers', label: 'Offers & Discounts', icon: 'TagIcon', on: true },
  { key: 'wishlistAlerts', label: 'Wishlist Alerts', icon: 'HeartIcon', on: true },
  { key: 'priceDrops', label: 'Price Drops', icon: 'ChartBarIcon', on: true },
  { key: 'accountUpdates', label: 'Account Updates', icon: 'UserIcon', on: true },
  { key: 'marketing', label: 'Marketing Emails', icon: 'EnvelopeIcon', on: false },
];

export default function NotificationsView() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [tab, setTab] = useState<Tab>('all');
  const [settings, setSettings] = useState(SETTINGS_DEFAULT);

  const filtered = useMemo(() => (tab === 'all' ? items : items.filter((n) => n.category === tab)), [items, tab]);

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const toggleSetting = (key: string) => setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, on: !s.on } : s)));

  return (
    <AccountShell
      active="notifications"
      crumb="Notifications"
      title={<>Notifi<span className="text-primary">cations.</span></>}
      subtitle="Stay updated with your orders, offers, and everything Basketly."
      tagline="Good Things Ahead."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-3">
            <div className="flex gap-5 overflow-x-auto no-scrollbar">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`pb-3 -mb-3 shrink-0 whitespace-nowrap text-sm font-bold border-b-2 transition-colors ${
                    tab === t.key ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={markAllRead} className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition-colors shrink-0">
              Mark all as read <AppIcon name="CheckIcon" size={13} />
            </button>
          </div>

          <div className="mt-2 divide-y divide-border">
            {filtered.map((n) => (
              <div key={n.id} className="flex items-start gap-4 py-4">
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${n.iconBg}`}>
                  <AppIcon name={n.icon} size={17} className={n.iconColor} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {n.unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    <p className="text-sm font-bold text-foreground truncate">{n.title}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-5">{n.body}</p>
                </div>
                <span className="hidden sm:block text-xs text-muted-foreground shrink-0 whitespace-nowrap">{n.time}</span>
              </div>
            ))}
            {filtered.length === 0 && <p className="py-8 text-sm text-muted-foreground">No notifications here yet.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-foreground">Notification Settings</h3>
            <p className="mt-1 text-xs text-muted-foreground">Choose what you want to be notified about.</p>
            <div className="mt-4 space-y-4">
              {settings.map((s) => (
                <div key={s.key} className="flex items-center gap-3">
                  <AppIcon name={s.icon} size={16} className="text-foreground shrink-0" />
                  <span className="text-xs font-semibold text-foreground flex-1">{s.label}</span>
                  <Toggle checked={s.on} onChange={() => toggleSetting(s.key)} label={s.label} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-foreground">Need Help?</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-5">
              Not getting notifications or facing any issues? We&apos;re here to help.
            </p>
            <Link href="/support" className="btn-outline mt-4 inline-flex w-full justify-center py-2.5 text-[11px]">Contact Support</Link>
          </div>

          <div className="rounded-2xl bg-secondary/20 p-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Stay Updated</span>
            <h3 className="mt-2 font-display font-black uppercase text-2xl leading-[0.95] text-foreground">Exclusive Offers Await.</h3>
            <p className="mt-2 text-xs text-muted-foreground">Turn on notifications and be the first to know about new drops, sales and more.</p>
            <button onClick={() => setSettings((prev) => prev.map((s) => ({ ...s, on: true })))} className="btn-dark mt-4 inline-flex items-center gap-2 py-2.5 px-5 text-[11px]">
              Keep Me Updated <AppIcon name="ArrowRightIcon" size={13} />
            </button>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

'use client';
import React from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';
import AccountShell from './AccountShell';
import EditProfileForm from './EditProfileForm';
import DefaultAddressCard from './DefaultAddressCard';
import { STATUS_BADGE_CLASSES, STATUS_LABEL, orderCode } from './orderStatus';
import OrderProgressTrack from './OrderProgressTrack';

const STAT_STYLES = [
  { block: 'bg-primary text-white', bars: 'bg-white/30', muted: 'text-white/75' },
  { block: 'bg-blue-accent text-white', bars: 'bg-white/30', muted: 'text-white/75' },
  { block: 'bg-secondary text-secondary-foreground', bars: 'bg-secondary-foreground/20', muted: 'text-secondary-foreground/65' },
];

function StatCard({
  icon,
  count,
  label,
  href,
  cta,
  variant = 0,
}: {
  icon: string;
  count: number;
  label: string;
  href: string;
  cta: string;
  variant?: number;
}) {
  const bars = [40, 55, 70, 90, 100];
  const style = STAT_STYLES[variant % STAT_STYLES.length];
  return (
    <div className={`rounded-2xl p-3.5 sm:p-5 ${style.block}`}>
      <div className="flex items-start justify-between">
        <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-white/20 flex items-center justify-center">
          <AppIcon name={icon} size={18} className="sm:hidden" />
          <AppIcon name={icon} size={20} className="hidden sm:block" />
        </div>
        <div className="hidden sm:flex items-end gap-1 h-8">
          {bars.map((h, i) => (
            <div key={i} className={`w-1.5 rounded-full ${style.bars}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <p className="mt-3 sm:mt-5 font-display font-black text-2xl sm:text-4xl leading-none">{count}</p>
      <p className={`mt-1 sm:mt-1.5 text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] ${style.muted}`}>{label}</p>
      <Link href={href} className="mt-2.5 sm:mt-4 inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold hover:underline transition-colors">
        <span className="truncate">{cta}</span> <AppIcon name="ArrowRightIcon" size={12} className="shrink-0" />
      </Link>
    </div>
  );
}

const QUICK_LINK_COLORS = ['bg-primary/15 text-primary', 'bg-blue-accent/20 text-blue-accent', 'bg-secondary/50 text-foreground', 'bg-primary/15 text-primary'];

function QuickLink({ icon, title, subtitle, href, variant = 0 }: { icon: string; title: string; subtitle: string; href: string; variant?: number }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-2xl border border-border p-3.5 sm:p-4 hover:border-primary transition-colors">
      <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${QUICK_LINK_COLORS[variant % QUICK_LINK_COLORS.length]}`}>
        <AppIcon name={icon} size={17} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
      <AppIcon name="ChevronRightIcon" size={16} className="ml-auto shrink-0 text-muted-foreground" />
    </Link>
  );
}

function RecentOrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-2xl border border-border p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_BADGE_CLASSES[order.status]}`}>
            <AppIcon name={order.status === 'cancelled' ? 'XCircleIcon' : 'CheckCircleIcon'} size={13} variant="solid" />
            {STATUS_LABEL[order.status]}
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">{orderCode(order)}</p>
            <p className="text-xs text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
        <p className="text-lg font-bold text-foreground">{formatPrice(order.total)}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex -space-x-3 shrink-0">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.productId} className="h-14 w-14 rounded-xl border-2 border-background bg-muted overflow-hidden relative">
              <AppImage src={item.image} alt={item.name} fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="text-sm text-foreground min-w-0">
          <p className="font-semibold">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
          {order.items.slice(0, 2).map((item) => (
            <p key={item.productId} className="text-muted-foreground truncate">{item.name} × {item.quantity}</p>
          ))}
        </div>
        <div className="sm:ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <AppIcon name="TruckIcon" size={16} />
          {order.status === 'delivered' ? `Delivered on ${new Date(order.updatedAt).toLocaleDateString()}` : 'On its way'}
        </div>
        <Link href={`/orders/${order.id}`} className="btn-dark py-2.5 px-5 text-xs w-full sm:w-auto text-center">View Order</Link>
      </div>
    </div>
  );
}

export default function AccountView() {
  const { user, isLoading } = useAuth();
  const cartCount = useCartStore((s) => s.items.length);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [orders, setOrders] = React.useState<Order[] | null>(null);

  React.useEffect(() => {
    if (!user) return;
    fetch('/api/orders')
      .then((r) => r.json())
      .then((json) => setOrders(json?.data?.orders ?? []))
      .catch(() => setOrders([]));
  }, [user]);

  if (isLoading || (user && orders === null)) {
    return (
      <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1500px] mx-auto animate-pulse">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-16 w-2/3 bg-muted rounded mt-4" />
          <div className="h-40 w-full bg-muted rounded-2xl mt-8" />
        </div>
      </section>
    );
  }

  if (!user) {
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

  const firstName = user.name.split(' ')[0];
  const hasOrders = (orders?.length ?? 0) > 0;
  const mostRecent = orders?.[0];

  return (
    <AccountShell
      active="overview"
      eyebrow="Your Space"
      title={<>Hello,<br /><span className="text-primary">{firstName}.</span></>}
      subtitle={hasOrders ? 'Good to see you back.' : 'Good to see you here. Manage your orders, wishlist and more — all in one place.'}
    >
      <div className="grid gap-2.5 sm:gap-4 grid-cols-3">
        <StatCard variant={0} icon="CubeIcon" count={orders?.length ?? 0} label="Orders" href="/orders" cta={hasOrders ? 'View orders' : 'Start shopping'} />
        <StatCard variant={1} icon="HeartIcon" count={wishlistCount} label="Saved Pieces" href="/wishlist" cta="View wishlist" />
        <StatCard variant={2} icon="ShoppingBagIcon" count={cartCount} label="In Your Basket" href="/" cta={cartCount ? 'View basket' : 'Start shopping'} />
      </div>

      {hasOrders ? (
        <>
          <div className="mt-8 rounded-3xl overflow-hidden relative bg-secondary/20 min-h-[220px] flex items-center">
            <div className="relative z-10 p-8 sm:p-10 max-w-md">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">New Season</span>
              <h2 className="mt-2 font-display font-black uppercase text-4xl sm:text-5xl leading-[0.9] text-foreground">
                Bolder <span className="text-primary">Finds.</span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">Explore the latest drops before they&apos;re gone.</p>
              <Link href="/new-arrivals" className="btn-dark mt-5 inline-flex py-3 px-6 text-xs">Shop New Arrivals</Link>
            </div>
            <div className="hidden sm:block absolute right-0 top-0 h-full w-1/2">
              <AppImage
                src="https://images.unsplash.com/photo-1516826957135-700dedea698c?w=900&q=80"
                alt="New season"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Recent Order</h3>
                <Link href="/orders" className="text-xs font-bold uppercase tracking-wide text-foreground flex items-center gap-1 hover:text-primary transition-colors">
                  View All Orders <AppIcon name="ArrowRightIcon" size={13} />
                </Link>
              </div>
              <div className="mt-4">{mostRecent && <RecentOrderCard order={mostRecent} />}</div>
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Quick Links</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <QuickLink variant={0} icon="TruckIcon" title="Track an Order" subtitle="Check your order status" href="/orders" />
                <QuickLink variant={1} icon="HeartIcon" title="View Wishlist" subtitle="See your saved items" href="/wishlist" />
                <QuickLink variant={2} icon="MapPinIcon" title="Manage Addresses" subtitle="Add or edit addresses" href="/account/addresses" />
                <QuickLink variant={3} icon="CreditCardIcon" title="Payment Methods" subtitle="Manage your cards" href="/account/payments" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-3xl border border-border p-10 flex flex-col items-center text-center justify-center">
              <div className="relative h-20 w-20">
                <AppIcon name="ArchiveBoxIcon" size={64} className="text-primary/70" />
              </div>
              <h2 className="mt-6 font-display font-black uppercase text-2xl sm:text-3xl text-foreground">You haven&apos;t placed any orders yet.</h2>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Looks like your shopping journey is just getting started. Explore our latest collections and find your next favourite.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/products" className="btn-dark py-3 px-6 text-xs">Start Shopping</Link>
                <Link href="/new-arrivals" className="btn-outline py-3 px-6 text-xs">Explore New Arrivals</Link>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl bg-secondary/20 p-6 relative overflow-hidden min-h-[190px]">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">New Season</span>
                <h3 className="mt-2 font-display font-black uppercase text-2xl leading-[0.95] text-foreground">
                  Discover<br />What&apos;s Next.
                </h3>
                <p className="mt-2 text-xs text-muted-foreground">Fresh styles. Bolder choices. Just for you.</p>
                <Link href="/new-arrivals" className="btn-dark mt-4 inline-flex py-2.5 px-5 text-[11px]">Shop New Arrivals</Link>
              </div>
              <div className="rounded-2xl border border-border p-5">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 shrink-0 rounded-full bg-secondary/30 flex items-center justify-center">
                    <AppIcon name="HeartIcon" size={19} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Build Your Wishlist</p>
                    <p className="mt-1 text-xs text-muted-foreground">Save your favourite items and shop them anytime.</p>
                    <Link href="/wishlist" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-foreground hover:text-primary transition-colors">
                      Explore Now <AppIcon name="ArrowRightIcon" size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-border p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: 'TruckIcon', title: 'Fast & Reliable Delivery', sub: 'Get your favourites, faster.' },
              { icon: 'ShieldCheckIcon', title: 'Secure Payments', sub: 'Shop with complete peace of mind.' },
              { icon: 'ArchiveBoxIcon', title: 'Easy Returns', sub: 'Hassle-free within 7 days.' },
              { icon: 'TagIcon', title: 'Exclusive Drops', sub: 'Be the first to know.' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <AppIcon name={f.icon} size={20} className="text-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <EditProfileForm user={user} />
        <DefaultAddressCard />
      </div>
    </AccountShell>
  );
}

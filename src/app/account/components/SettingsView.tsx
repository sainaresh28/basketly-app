'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import Toggle from '@/components/ui/Toggle';
import { useAuth } from '@/lib/auth-context';
import { useWishlistStore } from '@/lib/wishlist-store';
import { DEFAULT_USER_PREFERENCES, type UserPreferences } from '@/types';
import AccountShell from './AccountShell';

function Row({ icon, title, sub, right }: { icon: string; title: string; sub: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 py-3.5">
      <AppIcon name={icon} size={17} className="text-foreground shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

function SectionCard({ icon, title, sub, accent, children }: { icon: string; title: string; sub: string; accent?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${accent || 'bg-secondary/30'}`}>
          <AppIcon name={icon} size={17} className="text-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
        </div>
      </div>
      <div className="mt-4 divide-y divide-border">{children}</div>
    </div>
  );
}

export default function SettingsView() {
  const { user, refresh } = useAuth();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [addressesCount, setAddressesCount] = useState<number | null>(null);

  // --- Profile editing, done right here — no redirect to Overview ---------
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [profileStatus, setProfileStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [profileError, setProfileError] = useState('');

  // --- Preferences, backed by a real PATCH to /api/auth/me ----------------
  const [prefs, setPrefs] = useState<UserPreferences>(user?.preferences ?? DEFAULT_USER_PREFERENCES);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then((j) => setOrdersCount(j?.data?.orders?.length ?? 0)).catch(() => setOrdersCount(0));
    fetch('/api/account/addresses').then((r) => r.json()).then((j) => setAddressesCount(j?.data?.addresses?.length ?? 0)).catch(() => setAddressesCount(0));
  }, []);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setPhone(user.phone ?? '');
    setPrefs(user.preferences ?? DEFAULT_USER_PREFERENCES);
  }, [user]);

  if (!user) {
    return (
      <AccountShell active="settings" crumb="Settings" title="Settings">
        <p className="text-sm text-muted-foreground">Sign in to manage your settings.</p>
      </AccountShell>
    );
  }

  const memberTier = (ordersCount ?? 0) >= 5 ? 'Value Shopper' : (ordersCount ?? 0) > 0 ? 'Returning Customer' : 'New Member';

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus('saving');
    setProfileError('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message || 'Could not update your profile');
      await refresh();
      setProfileStatus('idle');
      setEditingProfile(false);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Could not update your profile');
      setProfileStatus('error');
    }
  };

  /** Optimistically applies a preferences patch, persists it, and rolls back on failure. */
  const savePreferences = async (key: string, patch: Record<string, unknown>, next: UserPreferences) => {
    const previous = prefs;
    setPrefs(next);
    setSavingKey(key);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: patch }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error();
      await refresh();
    } catch {
      setPrefs(previous);
    } finally {
      setSavingKey(null);
    }
  };

  const toggleTheme = () => {
    const theme = prefs.theme === 'dark' ? 'light' : 'dark';
    savePreferences('theme', { theme }, { ...prefs, theme });
  };

  const toggleNotif = (key: keyof UserPreferences['notifications'], value: boolean) => {
    const notifications = { ...prefs.notifications, [key]: value };
    savePreferences(key, { notifications: { [key]: value } }, { ...prefs, notifications });
  };

  const togglePersonalized = (value: boolean) => {
    savePreferences('personalizedRecommendations', { personalizedRecommendations: value }, { ...prefs, personalizedRecommendations: value });
  };

  return (
    <AccountShell
      active="settings"
      crumb="Settings"
      title={<>Set<span className="text-primary">tings.</span></>}
      subtitle="Personalize your account and shopping experience."
      tagline="Good Things Ahead."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {/* Profile Information — edited right here, no redirect */}
          <div className="rounded-2xl border-2 border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary flex items-center justify-center">
                  <AppIcon name="UserIcon" size={17} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Profile Information</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Keep your personal details up to date for a smoother shopping experience.</p>
                </div>
              </div>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-dark-surface px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary transition-colors shrink-0"
                >
                  <AppIcon name="PencilSquareIcon" size={13} /> Edit
                </button>
              )}
            </div>

            {editingProfile ? (
              <form onSubmit={saveProfile} className="mt-5">
                <div className="flex flex-wrap items-start gap-6">
                  <div className="relative h-16 w-16 shrink-0 rounded-full bg-muted overflow-hidden">
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-lg font-bold text-foreground">{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 flex-1 min-w-[220px]">
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Full Name
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </label>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Email Address
                      <input
                        value={user.email}
                        disabled
                        className="mt-1.5 w-full rounded-xl border border-border bg-muted px-3.5 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                      />
                    </label>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Phone Number
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Add a phone number"
                        className="mt-1.5 w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </label>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Account Type</p>
                      <p className="text-sm font-semibold text-foreground mt-2.5 capitalize">{user.role || 'Customer'}</p>
                    </div>
                  </div>
                </div>
                {profileError && <p role="alert" className="mt-3 text-xs font-semibold text-primary">{profileError}</p>}
                <div className="mt-5 flex gap-3">
                  <button type="submit" disabled={profileStatus === 'saving'} className="btn-dark py-2.5 px-5 text-xs disabled:opacity-60">
                    {profileStatus === 'saving' ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingProfile(false); setName(user.name); setPhone(user.phone ?? ''); setProfileError(''); }}
                    className="text-sm font-bold text-muted-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5 flex flex-wrap items-start gap-6">
                <div className="relative h-16 w-16 shrink-0 rounded-full bg-muted overflow-hidden">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-lg font-bold text-foreground">{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 flex-1 min-w-[220px]">
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email Address</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{user.phone || 'Not added'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Account Type</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5 capitalize">{user.role || 'Customer'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <SectionCard icon="CubeIcon" title="Shopping Preferences" sub="Customize your shopping experience." accent="bg-secondary/50">
            <Row icon="CurrencyRupeeIcon" title="Currency" sub="Prices will be shown in Indian Rupees." right={<span className="text-xs font-bold text-foreground">INR (₹)</span>} />
            <Row
              icon="SunIcon"
              title="Theme"
              sub={prefs.theme === 'dark' ? 'Dark mode is on.' : 'Choose between light or dark mode.'}
              right={
                <button
                  onClick={toggleTheme}
                  disabled={savingKey === 'theme'}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:border-foreground transition-colors disabled:opacity-60"
                >
                  <AppIcon name={prefs.theme === 'dark' ? 'MoonIcon' : 'SunIcon'} size={13} />
                  {savingKey === 'theme' ? 'Saving…' : prefs.theme === 'dark' ? 'Dark' : 'Light'}
                </button>
              }
            />
            <Row icon="ClockIcon" title="Clear Browsing History" sub="Remove your recent searches and viewed products." right={<AppIcon name="ChevronRightIcon" size={16} className="text-muted-foreground" />} />
          </SectionCard>

          <SectionCard icon="BellIcon" title="Notification Preferences" sub="Choose what you want to be notified about." accent="bg-blue-accent/20">
            <Row icon="TruckIcon" title="Order Updates" sub="Get notified about order confirmations, shipping and delivery updates."
              right={<Toggle checked={prefs.notifications.orderUpdates} onChange={(v) => toggleNotif('orderUpdates', v)} label="Order Updates" />} />
            <Row icon="TagIcon" title="Offers & Discounts" sub="Be the first to know about exclusive deals and offers."
              right={<Toggle checked={prefs.notifications.offers} onChange={(v) => toggleNotif('offers', v)} label="Offers & Discounts" />} />
            <Row icon="HeartIcon" title="Wishlist Alerts" sub="Get notified when items in your wishlist are on sale or back in stock."
              right={<Toggle checked={prefs.notifications.wishlistAlerts} onChange={(v) => toggleNotif('wishlistAlerts', v)} label="Wishlist Alerts" />} />
            <Row icon="ArrowTrendingUpIcon" title="Price Drops" sub="Alerts when the price of your saved items drops."
              right={<Toggle checked={prefs.notifications.priceDrops} onChange={(v) => toggleNotif('priceDrops', v)} label="Price Drops" />} />
          </SectionCard>

          <SectionCard icon="ShieldCheckIcon" title="Privacy & Data" sub="Manage your data and privacy settings." accent="bg-primary/15">
            <Row icon="ChartBarIcon" title="Personalized Recommendations" sub="Use my activity to show better product recommendations."
              right={<Toggle checked={prefs.personalizedRecommendations} onChange={togglePersonalized} label="Personalized Recommendations" />} />
            <Row icon="DocumentTextIcon" title="Data & Privacy" sub="View how your data is used." right={<AppIcon name="ChevronRightIcon" size={16} className="text-muted-foreground" />} />
            <Row icon="DocumentTextIcon" title="Terms & Policies" sub="Read our Terms of Service and Privacy Policy." right={<AppIcon name="ChevronRightIcon" size={16} className="text-muted-foreground" />} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-full bg-muted overflow-hidden">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-base font-bold text-foreground">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">Basketly Member</p>
              </div>
            </div>
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              <AppIcon name="StarIcon" variant="solid" size={11} /> {memberTier}
            </span>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
              <div>
                <p className="font-display font-black text-2xl text-foreground leading-none">{ordersCount ?? '—'}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">Orders</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl text-foreground leading-none">{wishlistCount}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">Wishlist</p>
              </div>
              <div>
                <p className="font-display font-black text-2xl text-foreground leading-none">{addressesCount ?? '—'}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">Addresses</p>
              </div>
            </div>
            <p className="mt-4 text-xs italic text-muted-foreground border-t border-border pt-4">&ldquo;Better choices. A brighter you.&rdquo; — Basketly</p>
          </div>

          <div className="rounded-2xl bg-primary p-6 relative overflow-hidden min-h-[170px]">
            <h3 className="font-display font-black uppercase text-2xl leading-[0.95] text-white">
              Good Style Stays<br /><span className="text-secondary">With You.</span>
            </h3>
            <p className="mt-2 text-xs text-white/80">Discover more. Shop your way.</p>
            <Link href="/new-arrivals" className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-900 hover:bg-secondary transition-colors">
              <AppIcon name="ArrowRightIcon" size={16} />
            </Link>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-foreground">Need Help?</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-5">Have questions or facing any issues? We&apos;re here to help.</p>
            <Link href="/support" className="btn-outline mt-4 inline-flex w-full justify-center items-center gap-1.5 py-2.5 text-[11px]">
              Contact Support <AppIcon name="ArrowRightIcon" size={13} />
            </Link>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
            <h3 className="text-sm font-bold text-foreground">Sign Out</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-5">Log out from your account on this device.</p>
            <SignOutButton />
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

function SignOutButton() {
  const { logout } = useAuth();
  return (
    <button onClick={() => logout()} className="btn-outline mt-4 w-full py-2.5 text-[11px] !border-primary !text-primary hover:!bg-primary/10 hover:!text-primary">
      Sign Out
    </button>
  );
}

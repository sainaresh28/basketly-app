'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import AccountShell from './AccountShell';

const ACCEPTED = ['VISA', 'Mastercard', 'RuPay', 'AMEX', 'GPay', 'Apple Pay', 'UPI'];

const SECURITY_POINTS = [
  { icon: 'LockClosedIcon', title: 'Encrypted Payments', sub: 'Your payment information is protected with industry-standard encryption.' },
  { icon: 'ShieldCheckIcon', title: 'Safe & Trusted', sub: 'We partner with leading payment providers to keep your data safe.' },
  { icon: 'CheckBadgeIcon', title: 'Easy Management', sub: 'Add, remove or update your payment methods anytime.' },
];

type Card = { id: string; brand: string; last4: string; holder: string; expiry: string; isDefault: boolean };

export default function PaymentsView() {
  const [cards, setCards] = useState<Card[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ holder: '', number: '', expiry: '', cvv: '' });

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.number || form.number.replace(/\s/g, '').length < 4) return;
    const last4 = form.number.replace(/\s/g, '').slice(-4);
    setCards((prev) => [
      ...prev,
      { id: crypto.randomUUID(), brand: 'Card', last4, holder: form.holder || 'Cardholder', expiry: form.expiry, isDefault: prev.length === 0 },
    ]);
    setForm({ holder: '', number: '', expiry: '', cvv: '' });
    setShowForm(false);
  };

  const removeCard = (id: string) => setCards((prev) => prev.filter((c) => c.id !== id));

  return (
    <AccountShell
      active="payments"
      crumb="Payment Methods"
      title={<>Payment <span className="text-primary">Methods.</span></>}
      subtitle="Manage your saved payment methods for a faster and more secure checkout experience."
      tagline="Good Things Ahead."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          {cards.length === 0 && !showForm ? (
            <div className="rounded-3xl border border-border p-10 sm:p-14 flex flex-col items-center text-center">
              <AppIcon name="CreditCardIcon" size={56} className="text-primary/60" />
              <h2 className="mt-6 font-display font-black uppercase text-2xl text-foreground">No payment methods added yet.</h2>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Add a payment method to make checkout faster, safer and more convenient.
              </p>
              <button onClick={() => setShowForm(true)} className="btn-dark mt-6 py-3 px-6 text-xs inline-flex items-center gap-2">
                <AppIcon name="PlusIcon" size={15} /> Add Payment Method
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cards.map((c) => (
                <div key={c.id} className="rounded-2xl border border-border p-5 flex items-center gap-4">
                  <div className="h-11 w-16 shrink-0 rounded-lg bg-dark-surface flex items-center justify-center text-white">
                    <AppIcon name="CreditCardIcon" size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">•••• •••• •••• {c.last4}</p>
                      {c.isDefault && <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">Default</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.holder}{c.expiry ? ` · Expires ${c.expiry}` : ''}</p>
                  </div>
                  <button onClick={() => removeCard(c.id)} className="h-9 w-9 shrink-0 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                    <AppIcon name="TrashIcon" size={15} />
                  </button>
                </div>
              ))}
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="btn-outline py-3 px-5 text-xs inline-flex items-center gap-2">
                  <AppIcon name="PlusIcon" size={15} /> Add Payment Method
                </button>
              )}
            </div>
          )}

          {showForm && (
            <form onSubmit={addCard} className="mt-6 rounded-2xl border border-border p-6">
              <h3 className="text-base font-bold text-foreground">Add Payment Method</h3>
              <p className="mt-1 text-xs text-muted-foreground">Card details are stored securely and only the last 4 digits are shown.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input required placeholder="Name on card" value={form.holder} onChange={(e) => setForm({ ...form, holder: e.target.value })}
                  className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-2" />
                <input required placeholder="Card number" inputMode="numeric" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })}
                  className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-2" />
                <input required placeholder="MM/YY" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <input required placeholder="CVV" inputMode="numeric" value={form.cvv} onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                  className="rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div className="mt-4 flex gap-3">
                <button type="submit" className="btn-dark py-2.5 px-5 text-xs">Save Card</button>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm font-bold text-muted-foreground">Cancel</button>
              </div>
            </form>
          )}

          <div className="mt-8 rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-foreground">Accepted Payment Methods</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              {ACCEPTED.map((m) => (
                <span key={m} className="rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-foreground">Your Transactions are Secure</h3>
            <div className="mt-4 space-y-4">
              {SECURITY_POINTS.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-full bg-secondary/30 flex items-center justify-center">
                    <AppIcon name={f.icon} size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-foreground">Need Help?</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-5">Facing issues with payments? Our support team is here to help.</p>
            <Link href="/support" className="btn-outline mt-4 inline-flex w-full justify-center py-2.5 text-[11px]">Contact Support</Link>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/utils/format';
import AppIcon from '@/components/ui/AppIcon';
import type { Address, ShippingAddress } from '@/types';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const emptyAddress: ShippingAddress = {
  fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
};

export default function CheckoutView() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const addToast = useCartStore((s) => s.addToast);
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [status, setStatus] = useState<'idle' | 'processing'>('idle');
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/account/addresses')
      .then((r) => r.json())
      .then((json) => {
        const addresses: Address[] = json?.data?.addresses ?? [];
        setSavedAddresses(addresses);
        const preferred = addresses.find((a) => a.isDefault) || addresses[0];
        if (preferred) {
          setAddress({
            fullName: preferred.fullName || '',
            phone: preferred.phone || '',
            line1: preferred.line1,
            line2: preferred.line2 || '',
            city: preferred.city,
            state: preferred.state,
            pincode: preferred.pincode,
          });
        }
      })
      .catch(() => {});
  }, [user]);

  const applySavedAddress = (id: string) => {
    const a = savedAddresses.find((sa) => sa.id === id);
    if (!a) return;
    setAddress({
      fullName: a.fullName || '', phone: a.phone || '', line1: a.line1,
      line2: a.line2 || '', city: a.city, state: a.state, pincode: a.pincode,
    });
  };

  const subtotal = getSubtotal();
  const shipping = subtotal === 0 || subtotal >= 1999 ? 0 : 149;
  const total = subtotal + shipping;

  const updateField = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const required: (keyof ShippingAddress)[] = ['fullName', 'phone', 'line1', 'city', 'state', 'pincode'];
    const missing = required.filter((f) => !address[f]?.trim());
    if (missing.length > 0) {
      setError('Please fill in every required field.');
      return;
    }

    if (paymentMethod === 'cod') {
      setStatus('processing');
      try {
        const res = await fetch('/api/checkout/cod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shippingAddress: address }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json?.error?.message || 'Could not place your order');
        useCartStore.setState({ items: [] });
        addToast('Order placed — pay on delivery!', 'success');
        router.push(`/orders/${json.data.order.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setStatus('idle');
      }
      return;
    }

    setStatus('processing');
    try {
      const createRes = await fetch('/api/checkout/create-order', { method: 'POST' });
      const createJson = await createRes.json();
      if (!createRes.ok || !createJson.success) {
        throw new Error(createJson?.error?.message || 'Could not start checkout');
      }
      const { razorpayOrderId, amount, currency, keyId } = createJson.data;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Could not load the payment widget. Check your connection and try again.');
      }

      const razorpay = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'Basketly',
        description: 'Order payment',
        prefill: { name: address.fullName, contact: address.phone, email: user?.email },
        theme: { color: '#e11d2f' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...response, shippingAddress: address }),
            });
            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok || !verifyJson.success) {
              throw new Error(verifyJson?.error?.message || 'Payment verification failed');
            }
            useCartStore.setState({ items: [] });
            addToast('Payment successful — order placed!', 'success');
            router.push(`/orders/${verifyJson.data.order.id}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment verification failed');
            setStatus('idle');
          }
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      });
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('idle');
    }
  };

  if (authLoading) {
    return <div className="px-4 sm:px-6 lg:px-10 max-w-[1200px] mx-auto animate-pulse h-64" />;
  }

  if (!user) {
    return (
      <section className="px-4 sm:px-6 lg:px-10 max-w-xl mx-auto text-center py-16">
        <h1 className="font-display font-black uppercase text-display-md text-foreground">Sign in to check out</h1>
        <p className="mt-3 text-sm text-muted-foreground">You need an account so we can save your order and let you track it.</p>
        <Link href="/login?redirect=/checkout" className="btn-primary inline-flex mt-6 py-3 px-6 text-xs">Sign In</Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-10 max-w-xl mx-auto text-center py-16">
        <AppIcon name="SparklesIcon" size={26} className="text-primary mx-auto" />
        <h1 className="font-display font-black uppercase text-display-md text-foreground mt-5">Your basket is empty</h1>
        <Link href="/products" className="mt-6 inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1">Start browsing →</Link>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1200px] mx-auto">
        <span className="section-label mb-3">Basketly / Checkout</span>
        <h1 className="font-display font-black uppercase text-display-xl text-foreground leading-[0.88]">
          Almost <span className="text-primary">there.</span>
        </h1>

        <form onSubmit={handlePay} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Shipping Address</span>
            {savedAddresses.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {savedAddresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => applySavedAddress(a.id)}
                    className="rounded-full border border-border px-3.5 py-1.5 text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Full name" value={address.fullName} onChange={updateField('fullName')}
                className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-1" />
              <input required placeholder="Phone number" value={address.phone} onChange={updateField('phone')}
                className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <input required placeholder="Address line 1" value={address.line1} onChange={updateField('line1')}
                className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-2" />
              <input placeholder="Address line 2 (optional)" value={address.line2} onChange={updateField('line2')}
                className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-2" />
              <input required placeholder="City" value={address.city} onChange={updateField('city')}
                className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <input required placeholder="State" value={address.state} onChange={updateField('state')}
                className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              <input required placeholder="PIN code" value={address.pincode} onChange={updateField('pincode')}
                className="rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 sm:col-span-2" />
            </div>

            <div className="rounded-2xl border border-border p-4 mt-6">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Items ({items.length})</span>
              <div className="mt-3 space-y-2">
                {items.map((i) => (
                  <div key={i.productId} className="flex justify-between text-sm">
                    <span className="text-foreground line-clamp-1">{i.product.name} × {i.quantity}</span>
                    <span className="font-semibold text-foreground shrink-0 ml-3">{formatPrice(i.product.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-border p-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Order Summary</span>
            <div className="mt-5 space-y-3 border-b border-border pb-5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold text-foreground">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-semibold text-foreground">{shipping ? formatPrice(shipping) : 'Free'}</span></div>
            </div>
            <div className="flex justify-between py-5 text-lg font-bold text-foreground">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>

            <div className="mb-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Payment Method</span>
              <div className="mt-3 space-y-2">
                <label className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <input type="radio" name="paymentMethod" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-primary" />
                  <span className="font-semibold text-foreground">Pay Online</span>
                  <span className="ml-auto text-xs text-muted-foreground">Cards, UPI, wallets</span>
                </label>
                <label className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <input type="radio" name="paymentMethod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-primary" />
                  <span className="font-semibold text-foreground">Cash on Delivery</span>
                  <span className="ml-auto text-xs text-muted-foreground">Pay when it arrives</span>
                </label>
              </div>
            </div>

            {error && (
              <p role="alert" className="mb-4 rounded-xl bg-primary/10 px-3.5 py-2.5 text-xs font-semibold text-primary">{error}</p>
            )}

            <button type="submit" disabled={status === 'processing'} className="btn-dark w-full justify-center py-3.5 text-xs disabled:opacity-60">
              {status === 'processing'
                ? (paymentMethod === 'cod' ? 'Placing order…' : 'Opening payment…')
                : (paymentMethod === 'cod' ? `Place Order · ${formatPrice(total)}` : `Pay ${formatPrice(total)}`)}
            </button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              {paymentMethod === 'cod' ? 'Pay in cash or card when your order is delivered.' : 'Test mode — card 4111 1111 1111 1111, any future date, any CVV.'}
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}

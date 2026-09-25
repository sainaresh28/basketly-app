'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import { formatPrice } from '@/utils/format';
import { CANCELLABLE_STATUSES, type Order, type OrderStatus } from '@/types';
import PrinterInvoiceModal from './PrinterInvoiceModal';

const TRACK_STEPS: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
const STEP_LABEL: Record<OrderStatus, string> = {
  pending: 'Order Placed', paid: 'Payment Confirmed', processing: 'Processing',
  shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
};

const PAYMENT_STATUS_LABEL: Record<Order['paymentStatus'], string> = {
  unpaid: 'To pay on delivery', paid: 'Paid', refund_pending: 'Refund in progress',
  refunded: 'Refunded', refund_failed: 'Refund failed — contact support',
};

function TrackingTimeline({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <div className="mt-8 rounded-3xl border border-border p-6">
        <div className="flex items-center gap-2 text-primary">
          <AppIcon name="XCircleIcon" size={20} />
          <span className="text-sm font-bold uppercase tracking-wide">Order Cancelled</span>
        </div>
        {order.cancelReason && <p className="mt-2 text-sm text-muted-foreground">Reason: {order.cancelReason}</p>}
        <p className="mt-1 text-sm text-muted-foreground">Payment status: {PAYMENT_STATUS_LABEL[order.paymentStatus]}</p>
      </div>
    );
  }

  const currentIdx = TRACK_STEPS.indexOf(order.status);

  return (
    <div className="mt-8 rounded-3xl border border-border p-6">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Order &amp; Delivery Tracking</span>
      <div className="mt-6 flex items-start justify-between gap-1">
        {TRACK_STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const event = order.statusHistory?.find((e) => e.status === step);
          return (
            <div key={step} className="flex-1 flex flex-col items-center text-center">
              <div className="flex w-full items-center">
                <div className={`h-0.5 flex-1 ${idx === 0 ? 'opacity-0' : done ? 'bg-primary' : 'bg-border'}`} />
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  done ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'
                }`}>
                  {done ? <AppIcon name="CheckIcon" size={15} className="text-white" /> : idx + 1}
                </div>
                <div className={`h-0.5 flex-1 ${idx === TRACK_STEPS.length - 1 ? 'opacity-0' : done ? 'bg-primary' : 'bg-border'}`} />
              </div>
              <span className={`mt-2 text-[10px] font-bold uppercase tracking-wide ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
                {STEP_LABEL[step]}
              </span>
              {event && <span className="mt-0.5 text-[10px] text-muted-foreground">{new Date(event.at).toLocaleDateString()}</span>}
            </div>
          );
        })}
      </div>

      {(order.trackingNumber || order.courier || order.estimatedDelivery) && (
        <div className="mt-6 grid gap-2 border-t border-border pt-4 text-sm sm:grid-cols-3">
          {order.courier && <div><span className="text-muted-foreground">Courier: </span>{order.courier}</div>}
          {order.trackingNumber && <div><span className="text-muted-foreground">Tracking #: </span>{order.trackingNumber}</div>}
          {order.estimatedDelivery && <div><span className="text-muted-foreground">Est. delivery: </span>{order.estimatedDelivery}</div>}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailView({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null | 'error'>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [reason, setReason] = useState('');
  const [showPrinter, setShowPrinter] = useState(false);

  const load = () => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((json) => setOrder(json?.success ? json.data.order : 'error'))
      .catch(() => setOrder('error'));
  };

  useEffect(load, [orderId]);

  if (order === null) return <div className="max-w-[700px] mx-auto h-64 animate-pulse rounded-2xl bg-muted" />;

  if (order === 'error') {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="font-display font-black uppercase text-display-md text-foreground">Order not found</h1>
        <Link href="/orders" className="mt-6 inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1">Back to orders</Link>
      </div>
    );
  }

  const canCancel = CANCELLABLE_STATUSES.includes(order.status);

  const submitCancel = async () => {
    setCancelling(true);
    setCancelError('');
    try {
      const res = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message || 'Could not cancel this order');
      setOrder(json.data.order);
      setShowCancelForm(false);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : 'Could not cancel this order');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-[700px] mx-auto">
      <div className="flex items-center gap-3 text-primary">
        <AppIcon name={order.status === 'cancelled' ? 'XCircleIcon' : 'CheckCircleIcon'} size={28} />
        <span className="text-xs font-bold uppercase tracking-[0.2em]">
          {order.status === 'cancelled' ? 'Order Cancelled' : 'Order Confirmed'}
        </span>
      </div>
      <h1 className="font-display font-black uppercase text-display-lg text-foreground leading-[0.9] mt-3">
        {order.status === 'cancelled' ? 'Cancelled.' : 'Thank you.'}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Order #{order.id.slice(0, 8).toUpperCase()} · placed {new Date(order.createdAt).toLocaleString()}
      </p>

      <TrackingTimeline order={order} />

      <div className="mt-6 rounded-3xl border border-border p-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Items</span>
        <div className="mt-4 space-y-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-foreground">{item.name} × {item.quantity}</span>
              <span className="font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{order.shipping ? formatPrice(order.shipping) : 'Free'}</span></div>
          <div className="flex justify-between text-base font-bold text-foreground pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">
            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'} · {PAYMENT_STATUS_LABEL[order.paymentStatus]}
          </span>
        </div>
      </div>

      <button
        onClick={() => setShowPrinter(true)}
        className="btn-dark mt-4 w-full py-4 text-sm rounded-full inline-flex items-center justify-center gap-2">
        <AppIcon name="PrinterIcon" size={17} />
        Download Invoice
      </button>

      <div className="mt-6 rounded-3xl border border-border p-6">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Shipping To</span>
        <p className="mt-3 text-sm text-foreground">
          {order.shippingAddress.fullName}<br />
          {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}<br />
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
          {order.shippingAddress.phone}
        </p>
      </div>

      {canCancel && (
        <div className="mt-6 rounded-3xl border border-border p-6">
          {!showCancelForm ? (
            <button onClick={() => setShowCancelForm(true)} className="text-sm font-bold text-primary border-b-2 border-primary pb-1">
              Cancel this order
            </button>
          ) : (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Cancel Order</span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us why (optional)"
                className="mt-3 w-full rounded-xl border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                rows={3}
              />
              {cancelError && <p role="alert" className="mt-2 text-xs font-semibold text-primary">{cancelError}</p>}
              <div className="mt-3 flex gap-3">
                <button onClick={submitCancel} disabled={cancelling} className="btn-dark py-2.5 px-5 text-xs disabled:opacity-60">
                  {cancelling ? 'Cancelling…' : 'Confirm Cancellation'}
                </button>
                <button onClick={() => setShowCancelForm(false)} className="text-sm font-bold text-muted-foreground">
                  Never mind
                </button>
              </div>
              {order.paymentMethod === 'online' && order.paymentStatus === 'paid' && (
                <p className="mt-3 text-xs text-muted-foreground">Your payment will be automatically refunded once cancelled.</p>
              )}
            </div>
          )}
        </div>
      )}

      <Link href="/products" className="mt-8 inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1">
        Continue shopping →
      </Link>

      {showPrinter && <PrinterInvoiceModal order={order} onClose={() => setShowPrinter(false)} />}
    </div>
  );
}

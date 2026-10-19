'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppIcon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { formatPrice, formatSelectedOptions } from '@/utils/format';
import { CANCELLABLE_STATUSES, type Order, type OrderStatus, type Review } from '@/types';
import AccountShell from '@/app/account/components/AccountShell';
import { STATUS_BADGE_CLASSES, STATUS_LABEL, orderCode } from '@/app/account/components/orderStatus';
import PrinterInvoiceModal from './PrinterInvoiceModal';

const TRACK_STEPS: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
const STEP_LABEL: Record<OrderStatus, string> = {
  pending: 'Order Placed', paid: 'Payment Confirmed', processing: 'Processing',
  shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
};
const STEP_NOTE: Record<OrderStatus, string> = {
  pending: 'Your order has been placed.', paid: 'Payment received successfully.', processing: 'Your items are being prepared.',
  shipped: 'Your order is on the way.', delivered: 'Order delivered successfully.', cancelled: 'Order cancelled.',
};

const PAYMENT_STATUS_LABEL: Record<Order['paymentStatus'], string> = {
  unpaid: 'To pay on delivery', paid: 'Paid', refund_pending: 'Refund in progress',
  refunded: 'Refunded', refund_failed: 'Refund failed — contact support',
};

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="p-0.5"
        >
          <AppIcon
            name="StarIcon"
            variant={(hover || value) >= n ? 'solid' : 'outline'}
            size={24}
            className={(hover || value) >= n ? 'text-secondary' : 'text-muted-foreground/40'}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ productId, orderId, onSubmitted }: { productId: string; orderId: string; onSubmitted: (review: Review) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [error, setError] = useState('');

  const submit = async () => {
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setStatus('saving');
    setError('');
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, rating, comment }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json?.error?.message || 'Could not submit your review');
      onSubmitted(json.data.review);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit your review');
      setStatus('error');
    }
  };

  return (
    <div className="mt-3 w-full rounded-2xl border border-border bg-muted/40 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-foreground mb-2">Rate this product</p>
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How was the quality, fit, and delivery?"
        rows={3}
        className="mt-3 w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      {error && <p role="alert" className="mt-2 text-xs font-semibold text-primary">{error}</p>}
      <button onClick={submit} disabled={status === 'saving'} className="btn-dark mt-3 py-2 px-5 text-xs disabled:opacity-60">
        {status === 'saving' ? 'Submitting…' : 'Submit Review'}
      </button>
    </div>
  );
}

function OrderJourney({ order }: { order: Order }) {
  if (order.status === 'cancelled') {
    return (
      <div className="rounded-3xl border border-border p-6">
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
    <div className="rounded-3xl border border-border p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-bold text-foreground">Order Journey</h3>
        {order.status === 'delivered' && (
          <span className="text-xs font-semibold text-muted-foreground">
            Delivered on {new Date(order.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
      <div className="mt-8 flex items-start justify-between gap-1 overflow-x-auto">
        {TRACK_STEPS.map((step, idx) => {
          const done = idx <= currentIdx;
          const event = order.statusHistory?.find((e) => e.status === step);
          return (
            <div key={step} className="flex-1 min-w-[84px] sm:min-w-[100px] flex flex-col items-center text-center">
              <div className="flex w-full items-center">
                <div className={`h-0.5 flex-1 ${idx === 0 ? 'opacity-0' : done ? 'bg-primary' : 'bg-border'}`} />
                <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  done ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {done ? <AppIcon name="CheckIcon" size={16} className="text-white" /> : idx + 1}
                </div>
                <div className={`h-0.5 flex-1 ${idx === TRACK_STEPS.length - 1 ? 'opacity-0' : done ? 'bg-primary' : 'bg-border'}`} />
              </div>
              <span className="mt-2.5 text-[11px] text-muted-foreground">
                {event ? new Date(event.at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
              </span>
              {event && <span className="text-[10px] text-muted-foreground">{new Date(event.at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>}
              <span className={`mt-1 text-xs font-bold ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{STEP_LABEL[step]}</span>
              <span className="mt-0.5 text-[11px] text-muted-foreground max-w-[120px]">{STEP_NOTE[step]}</span>
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
  const [reviews, setReviews] = useState<Record<string, Review>>({});
  const [openReviewFor, setOpenReviewFor] = useState<string | null>(null);

  const load = () => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((json) => setOrder(json?.success ? json.data.order : 'error'))
      .catch(() => setOrder('error'));
  };

  useEffect(load, [orderId]);

  useEffect(() => {
    fetch(`/api/orders/${orderId}/reviews`)
      .then((r) => r.json())
      .then((json) => {
        const list: Review[] = json?.data?.reviews ?? [];
        setReviews(Object.fromEntries(list.map((r) => [r.productId, r])));
      })
      .catch(() => {});
  }, [orderId]);

  if (order === null) {
    return (
      <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1500px] mx-auto h-64 animate-pulse rounded-2xl bg-muted" />
      </section>
    );
  }

  if (order === 'error') {
    return (
      <section className="pt-24 lg:pt-28 pb-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-xl mx-auto text-center py-16">
          <h1 className="font-display font-black uppercase text-display-md text-foreground">Order not found</h1>
          <Link href="/orders" className="mt-6 inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1">Back to orders</Link>
        </div>
      </section>
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
    <AccountShell
      active="orders"
      crumb={`Order ${orderCode(order)}`}
      title={<>Order <span className="text-primary">Details.</span></>}
      subtitle="Track, manage and view everything about your order."
      tagline="More Good Days Ahead."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6 min-w-0">
          <div className="rounded-2xl border border-border p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-foreground">Order {orderCode(order)}</h2>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_BADGE_CLASSES[order.status]}`}>
                  <AppIcon name={order.status === 'cancelled' ? 'XCircleIcon' : 'CheckCircleIcon'} size={13} variant="solid" />
                  {STATUS_LABEL[order.status]}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <button onClick={() => setShowPrinter(true)} className="btn-outline py-2.5 px-5 text-xs inline-flex items-center justify-center gap-2 flex-1 sm:flex-none">
                <AppIcon name="ArrowDownTrayIcon" size={15} /> Download Invoice
              </button>
              <Link href="/products" className="btn-dark py-2.5 px-5 text-xs text-center flex-1 sm:flex-none">Buy Again</Link>
            </div>
          </div>

          <OrderJourney order={order} />

          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-base font-bold text-foreground">Items ({order.items.length})</h3>
            <div className="mt-5 space-y-5">
              {order.items.map((item) => {
                const review = reviews[item.productId];
                const reviewOpen = openReviewFor === item.productId;
                return (
                  <div key={item.productId} className="border-b border-border pb-5 last:border-0 last:pb-0">
                    <div className="flex flex-wrap sm:flex-nowrap items-start gap-4">
                      <div className="h-16 w-16 shrink-0 rounded-xl bg-muted overflow-hidden relative">
                        <AppImage src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-[140px]">
                        <p className="text-sm font-bold text-foreground">{item.name}</p>
                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{formatSelectedOptions(item.selectedOptions)}</p>
                        )}
                        <p className="mt-0.5 text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="mt-1 text-sm font-bold text-foreground">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        {order.status === 'delivered' && (
                          review ? (
                            <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-2 text-[11px] font-bold text-primary w-full sm:w-auto">
                              <AppIcon name="StarIcon" variant="solid" size={13} /> You rated {review.rating}/5
                            </span>
                          ) : (
                            <button
                              onClick={() => setOpenReviewFor(reviewOpen ? null : item.productId)}
                              className="btn-outline py-2 px-4 text-[11px] whitespace-nowrap w-full sm:w-auto"
                            >
                              {reviewOpen ? 'Cancel' : 'Write a Review'}
                            </button>
                          )
                        )}
                        <Link href={`/product-detail?id=${item.productId}`} className="btn-outline py-2 px-4 text-[11px] text-center whitespace-nowrap w-full sm:w-auto">Buy Again</Link>
                      </div>
                    </div>

                    {reviewOpen && !review && (
                      <ReviewForm
                        productId={item.productId}
                        orderId={order.id}
                        onSubmitted={(review) => {
                          setReviews((prev) => ({ ...prev, [item.productId]: review }));
                          setOpenReviewFor(null);
                        }}
                      />
                    )}

                    {review && (
                      <div className="mt-3 rounded-2xl bg-muted/40 p-4">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <AppIcon key={n} name="StarIcon" variant={n <= review.rating ? 'solid' : 'outline'} size={14} className={n <= review.rating ? 'text-secondary' : 'text-muted-foreground/40'} />
                          ))}
                        </div>
                        {review.comment && <p className="mt-1.5 text-sm text-foreground/90">{review.comment}</p>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {canCancel && (
              <div className="mt-5 rounded-2xl bg-muted/60 p-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AppIcon name="ArchiveBoxIcon" size={20} className="text-foreground" />
                  <div>
                    <p className="text-sm font-bold text-foreground">Need to return or exchange an item?</p>
                    <p className="text-xs text-muted-foreground">You can request a return or exchange within 7 days of delivery.</p>
                  </div>
                </div>
                {!showCancelForm ? (
                  <button onClick={() => setShowCancelForm(true)} className="btn-outline py-2.5 px-5 text-xs inline-flex items-center gap-2 shrink-0">
                    Cancel Order <AppIcon name="ArrowRightIcon" size={13} />
                  </button>
                ) : null}
              </div>
            )}

            {showCancelForm && (
              <div className="mt-4 rounded-2xl border border-border p-5">
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
                  <button onClick={() => setShowCancelForm(false)} className="text-sm font-bold text-muted-foreground">Never mind</button>
                </div>
                {order.paymentMethod === 'online' && order.paymentStatus === 'paid' && (
                  <p className="mt-3 text-xs text-muted-foreground">Your payment will be automatically refunded once cancelled.</p>
                )}
              </div>
            )}
          </div>

          <Link href="/products" className="inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
            Continue shopping →
          </Link>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Delivery Address</h3>
              <span className="text-xs font-bold uppercase tracking-wide text-foreground border-b-2 border-foreground pb-0.5">Edit</span>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-muted flex items-center justify-center">
                <AppIcon name="MapPinIcon" size={17} className="text-foreground" />
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{order.shippingAddress.fullName}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">Default</span>
                </div>
                <p className="mt-1 text-muted-foreground leading-6">
                  {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-foreground">Payment Information</h3>
            <div className="mt-4 flex items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-muted flex items-center justify-center">
                <AppIcon name="CreditCardIcon" size={17} className="text-foreground" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-foreground">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</p>
                <p className="mt-0.5 text-muted-foreground">
                  {order.paymentMethod === 'cod'
                    ? PAYMENT_STATUS_LABEL[order.paymentStatus]
                    : `Paid on ${new Date(order.updatedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-foreground">Order Summary</h3>
            <div className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-foreground">{order.shipping ? formatPrice(order.shipping) : 'FREE'}</span></div>
              {!!order.discount && (
                <div className="flex justify-between"><span className="text-muted-foreground">Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span><span className="text-foreground">-{formatPrice(order.discount)}</span></div>
              )}
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-bold text-foreground">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
            {order.paymentStatus === 'paid' && (
              <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 flex items-center gap-2">
                <AppIcon name="CheckCircleIcon" size={16} variant="solid" />
                Paid Online via Razorpay
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border p-6">
            <h3 className="text-sm font-bold text-foreground">Need Help?</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-5">
              For any issues with your order, returns, or refunds, please contact our support team.
            </p>
            <Link href="/support" className="btn-outline mt-4 inline-flex w-full justify-center py-2.5 text-[11px]">Contact Support</Link>
          </div>
        </div>
      </div>

      {showPrinter && <PrinterInvoiceModal order={order} onClose={() => setShowPrinter(false)} />}
    </AccountShell>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/utils/format';
import { BRAND } from '@/lib/brand';
import type { Order } from '@/types';

const PAYMENT_LABEL: Record<Order['paymentMethod'], string> = {
  online: 'Paid Online (Razorpay)',
  cod: 'Cash on Delivery',
};

export default function InvoiceView({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null | 'error'>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((json) => setOrder(json?.success ? json.data.order : 'error'))
      .catch(() => setOrder('error'));
  }, [orderId]);

  if (order === null) return <div className="max-w-[800px] mx-auto p-10 animate-pulse h-64" />;

  if (order === 'error') {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="font-display font-black uppercase text-2xl text-foreground">Invoice not found</h1>
        <Link href="/orders" className="mt-6 inline-block text-sm font-bold text-foreground border-b-2 border-foreground pb-1">
          Back to orders
        </Link>
      </div>
    );
  }

  const gst = Math.round(order.subtotal * 0.18 * 100) / 100; // illustrative 18% GST breakdown, included in item price
  const invoiceNo = `INV-${order.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="max-w-[800px] mx-auto px-6 py-10 print:px-0 print:py-6">
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Link href={`/orders/${order.id}`} className="text-sm font-bold text-neutral-600 hover:text-primary">
            ← Back to order
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-wide px-5 py-2.5 hover:bg-primary transition-colors"
          >
            Print / Save as PDF
          </button>
        </div>

        <div className="mt-8 flex items-start justify-between border-b border-neutral-200 pb-6">
          <div>
            <h1 className="font-display font-black uppercase text-3xl">{BRAND.name}</h1>
            <p className="mt-1 text-xs text-neutral-500">{BRAND.address}</p>
            <p className="text-xs text-neutral-500">{BRAND.email} · {BRAND.phone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-wide">Invoice</h2>
            <p className="mt-1 text-xs text-neutral-500">{invoiceNo}</p>
            <p className="text-xs text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Billed / Shipped To</span>
            <p className="mt-2 leading-6">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
              {order.shippingAddress.phone}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Order Details</span>
            <p className="mt-2 leading-6">
              Order #{order.id.slice(0, 8).toUpperCase()}<br />
              Payment: {PAYMENT_LABEL[order.paymentMethod]}<br />
              Status: <span className="capitalize">{order.status}</span>
              {order.trackingNumber ? <>
                <br />Tracking: {order.trackingNumber}{order.courier ? ` (${order.courier})` : ''}
              </> : null}
            </p>
          </div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-neutral-900 text-left text-[11px] font-bold uppercase tracking-wide">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId} className="border-b border-neutral-200">
                <td className="py-3 pr-4">{item.name}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">{formatPrice(item.price)}</td>
                <td className="py-3 text-right font-semibold">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 ml-auto max-w-xs space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Delivery</span><span>{order.shipping ? formatPrice(order.shipping) : 'Free'}</span></div>
          <div className="flex justify-between text-[11px] text-neutral-400"><span>Incl. GST (approx.)</span><span>{formatPrice(gst)}</span></div>
          <div className="flex justify-between border-t border-neutral-900 pt-2 text-base font-bold"><span>Total</span><span>{formatPrice(order.total)}</span></div>
        </div>

        <p className="mt-12 text-center text-[11px] text-neutral-400">
          This is a computer-generated invoice from {BRAND.name} and does not require a signature.
        </p>
      </div>

      <style>{`
        @media print {
          @page { margin: 16mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}

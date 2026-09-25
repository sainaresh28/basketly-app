'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppIcon from '@/components/ui/AppIcon';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';

const SLIDE_UP_MS = 450;
const PRINT_DURATION_MS = 1600;

export default function PrinterInvoiceModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false); // card risen up into place
  const [revealed, setRevealed] = useState(false); // paper printed out of the slot
  const [ready, setReady] = useState(false); // done printing — show download button

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Let the browser paint the off-screen state first, then flip it so the
    // transitions actually animate instead of snapping straight to place.
    const mountTimer = setTimeout(() => setMounted(true), 20);
    const revealTimer = setTimeout(() => setRevealed(true), SLIDE_UP_MS + 100);
    const readyTimer = setTimeout(() => setReady(true), SLIDE_UP_MS + 100 + PRINT_DURATION_MS);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(mountTimer);
      clearTimeout(revealTimer);
      clearTimeout(readyTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  const invoiceNo = `INV-${order.id.slice(0, 8).toUpperCase()}`;

  const handleDownload = () => {
    router.push(`/orders/${order.id}/invoice`);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end justify-center sm:items-center backdrop-blur-sm p-0 sm:p-4 transition-colors duration-300 ${
        mounted ? 'bg-black/60' : 'bg-black/0'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Printing invoice">
      {/* The whole receipt card rises up into view, like it's being pushed
          up out of a printer slot at the bottom of the screen. */}
      <div
        className={`w-full max-w-sm transition-transform ease-out ${mounted ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ transitionDuration: `${SLIDE_UP_MS}ms` }}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end px-4 sm:px-0">
          <button
            onClick={onClose}
            aria-label="Close"
            className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-foreground hover:bg-white">
            <AppIcon name="XMarkIcon" size={16} />
          </button>
        </div>

        <div className="px-4 pb-4 sm:px-0 sm:pb-0">
          {/* Printer housing */}
          <div className="relative z-20 flex items-center gap-2.5 rounded-t-3xl rounded-b-xl bg-dark-surface px-5 py-4 shadow-xl">
            <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white ${!ready ? 'animate-pulse' : ''}`}>
              <AppIcon name="PrinterIcon" size={17} className="text-white" />
            </span>
            <div>
              <p className="text-sm font-bold text-white">{ready ? 'Invoice Ready' : 'Printing Invoice…'}</p>
              <p className="text-[11px] text-white/50">{invoiceNo}</p>
            </div>
            {!ready && (
              <span className="ml-auto flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" />
              </span>
            )}
            {/* Outlet slot the paper feeds through */}
            <div className="absolute inset-x-6 -bottom-1 h-2 rounded-full bg-black/70 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]" />
          </div>

          {/* Receipt paper, printed out of the slot above */}
          <div
            className="relative z-10 -mt-1 overflow-hidden transition-[max-height] ease-linear"
            style={{ maxHeight: revealed ? 2000 : 0, transitionDuration: `${PRINT_DURATION_MS}ms` }}>
            <div className="rounded-t-2xl bg-white px-6 pb-4 pt-5 font-mono text-neutral-800 shadow-2xl">
              <p className="text-center text-[11px] tracking-widest text-neutral-400">- - - - - - - - - - - - - - - - - - - -</p>
              <p className="mt-2 text-center text-xs font-bold uppercase tracking-wide">Basketly — Order Invoice</p>
              <p className="text-center text-[11px] text-neutral-500">{invoiceNo}</p>
              <p className="text-center text-[11px] text-neutral-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              <p className="mt-2 text-center text-[11px] tracking-widest text-neutral-400">- - - - - - - - - - - - - - - - - - - -</p>

              <div className="mt-4 space-y-1.5 text-xs">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-3">
                    <span className="truncate">{item.name} x{item.quantity}</span>
                    <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-[11px] tracking-widest text-neutral-300">- - - - - - - - - - - - - - - - - - - -</p>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Delivery</span>
                  <span>{order.shipping ? formatPrice(order.shipping) : 'Free'}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-neutral-300 pt-1.5 text-sm font-bold text-neutral-900">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Torn edge — the "transparent" gradient stops reveal the backdrop
                behind the paper, not another white layer, so it needs to sit
                outside the solid white block above rather than inside it. */}
            <div
              className="h-3 w-full"
              style={{
                background:
                  'linear-gradient(-45deg, white 6px, transparent 0), linear-gradient(45deg, white 6px, transparent 0)',
                backgroundSize: '12px 12px',
                backgroundPosition: 'left bottom',
                backgroundRepeat: 'repeat-x',
              }}
            />
          </div>

          {/* Action, fades in once "printed" */}
          <div
            className={`mt-4 transition-all duration-500 ${ready ? 'opacity-100 translate-y-0' : 'pointer-events-none translate-y-2 opacity-0'}`}>
            <button onClick={handleDownload} className="btn-dark w-full py-4 text-sm rounded-full inline-flex items-center justify-center gap-2">
              <AppIcon name="ArrowDownTrayIcon" size={17} />
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

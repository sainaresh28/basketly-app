'use client';
import React from 'react';
import { useCartStore } from '@/lib/cart-store';

export default function ToastContainer() {
  const toasts = useCartStore(s => s?.toasts);
  const removeToast = useCartStore(s => s?.removeToast);

  if (toasts?.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center pointer-events-none">
      {toasts?.map(toast => (
        <div
          key={toast?.id}
          className="toast-enter pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-full shadow-xl text-sm font-medium"
          style={{
            backgroundColor: toast?.type === 'success' ? 'var(--foreground)' : toast?.type === 'error' ? '#dc2626' : 'var(--muted-foreground)',
            color: '#FFFFFF',
          }}
        >
          {toast?.type === 'success' && (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast?.type === 'error' && (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{toast?.message}</span>
          <button
            onClick={() => removeToast(toast?.id)}
            className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
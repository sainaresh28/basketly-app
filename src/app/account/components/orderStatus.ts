import type { Order, OrderStatus } from '@/types';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Ordered',
  paid: 'Paid',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-amber-100 text-amber-800',
  processing: 'bg-amber-100 text-amber-800',
  shipped: 'bg-sky-100 text-sky-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export const STATUS_DOT_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-amber-500',
  paid: 'bg-amber-500',
  processing: 'bg-amber-500',
  shipped: 'bg-sky-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-500',
};

/** The 4-step progress track shown on order rows: Ordered → Paid → Shipped/Processing → Delivered. */
export const PROGRESS_STEPS: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
export const TRACK_LABELS = ['Ordered', 'Paid', 'Processing', 'Shipped', 'Delivered'];

export function progressIndex(status: OrderStatus): number {
  return PROGRESS_STEPS.indexOf(status);
}

export function orderCode(order: Order): string {
  return `#${order.id.slice(0, 8).toUpperCase()}`;
}

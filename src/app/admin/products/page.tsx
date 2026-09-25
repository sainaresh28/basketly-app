import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminProductsView from '../components/AdminProductsView';

export const metadata: Metadata = { title: 'Products & Inventory — Basketly Admin' };

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
      <AdminProductsView />
    </Suspense>
  );
}

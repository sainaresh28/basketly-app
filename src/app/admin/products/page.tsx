import React from 'react';
import type { Metadata } from 'next';
import AdminProductsView from '../components/AdminProductsView';

export const metadata: Metadata = { title: 'Products & Inventory — Basketly Admin' };

export default function AdminProductsPage() {
  return <AdminProductsView />;
}

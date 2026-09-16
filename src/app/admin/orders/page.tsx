import React from 'react';
import type { Metadata } from 'next';
import AdminOrdersView from '../components/AdminOrdersView';

export const metadata: Metadata = { title: 'Orders — Basketly Admin' };

export default function AdminOrdersPage() {
  return <AdminOrdersView />;
}

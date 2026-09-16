import React from 'react';
import type { Metadata } from 'next';
import AdminDashboard from './components/AdminDashboard';

export const metadata: Metadata = { title: 'Admin Overview — Basketly' };

export default function AdminOverviewPage() {
  return <AdminDashboard />;
}

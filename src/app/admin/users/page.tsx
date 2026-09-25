import React from 'react';
import type { Metadata } from 'next';
import AdminUsersView from '../components/AdminUsersView';

export const metadata: Metadata = { title: 'Users — Basketly Admin' };

export default function AdminUsersPage() {
  return <AdminUsersView />;
}

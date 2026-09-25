import React from 'react';
import type { Metadata } from 'next';
import AdminCategoriesView from '../components/AdminCategoriesView';

export const metadata: Metadata = { title: 'Categories — Basketly Admin' };

export default function AdminCategoriesPage() {
  return <AdminCategoriesView />;
}

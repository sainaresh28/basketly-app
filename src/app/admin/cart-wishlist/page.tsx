import React from 'react';
import type { Metadata } from 'next';
import AdminCartWishlistView from '../components/AdminCartWishlistView';

export const metadata: Metadata = { title: 'Cart & Wishlist — Basketly Admin' };

export default function AdminCartWishlistPage() {
  return <AdminCartWishlistView />;
}

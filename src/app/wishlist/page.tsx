import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import WishlistView from './components/WishlistView';

export const metadata: Metadata = {
  title: 'Your Wishlist — Basketly',
  description: 'Products you\'ve saved for later.',
};

export default function WishlistPage() {
  return (
    <>
      <Navbar />
      <main>
        <WishlistView />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

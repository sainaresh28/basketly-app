import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import CartView from './components/CartView';

export const metadata: Metadata = {
  title: 'Your Basket — Basketly',
  description: 'Review your basket and check out.',
};

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main>
        <CartView />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

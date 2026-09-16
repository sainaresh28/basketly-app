import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import CheckoutView from './components/CheckoutView';

export const metadata: Metadata = {
  title: 'Checkout — Basketly',
  description: 'Enter your shipping details and pay securely.',
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-20 min-h-screen">
        <CheckoutView />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

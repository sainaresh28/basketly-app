import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import PaymentsView from '../components/PaymentsView';

export const metadata: Metadata = {
  title: 'Payment Methods — Basketly',
  description: 'Manage your saved payment methods.',
};

export default function PaymentsPage() {
  return (
    <>
      <Navbar />
      <main>
        <PaymentsView />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

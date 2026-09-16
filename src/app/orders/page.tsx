import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import OrdersListView from './components/OrdersListView';

export const metadata: Metadata = { title: 'Your Orders — Basketly' };

export default function OrdersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-20 min-h-screen px-4 sm:px-6 lg:px-10">
        <OrdersListView />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

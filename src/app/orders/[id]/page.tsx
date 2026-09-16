import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import OrderDetailView from './components/OrderDetailView';

export const metadata: Metadata = { title: 'Order Details — Basketly' };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-28 pb-20 min-h-screen px-4 sm:px-6 lg:px-10">
        <OrderDetailView orderId={id} />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

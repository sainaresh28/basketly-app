import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import NotificationsView from '../components/NotificationsView';

export const metadata: Metadata = {
  title: 'Notifications — Basketly',
  description: 'Stay updated with your orders, offers, and everything Basketly.',
};

export default function NotificationsPage() {
  return (
    <>
      <Navbar />
      <main>
        <NotificationsView />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

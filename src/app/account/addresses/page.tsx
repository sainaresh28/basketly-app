import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import AddressesView from '../components/AddressesView';

export const metadata: Metadata = {
  title: 'Saved Addresses — Basketly',
  description: 'Manage your delivery addresses.',
};

export default function AddressesPage() {
  return (
    <>
      <Navbar />
      <main>
        <AddressesView />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

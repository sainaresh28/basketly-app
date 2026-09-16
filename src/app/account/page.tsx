import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import AccountView from './components/AccountView';

export const metadata: Metadata = {
  title: 'Your Account — Basketly',
  description: 'View your orders, saved pieces and basket status.',
};

export default function AccountPage() {
  return (
    <>
      <Navbar />
      <main>
        <AccountView />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

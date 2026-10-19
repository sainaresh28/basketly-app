import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import SettingsView from '../components/SettingsView';

export const metadata: Metadata = {
  title: 'Settings — Basketly',
  description: 'Personalize your account and shopping experience.',
};

export default function SettingsPage() {
  return (
    <>
      <Navbar />
      <main>
        <SettingsView />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

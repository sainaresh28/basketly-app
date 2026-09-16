import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import AuthForm from '../components/AuthForm';

export const metadata: Metadata = {
  title: 'Create Account — Basketly',
  description: 'Create a Basketly account to save your favourites and check out faster.',
};

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main>
        <AuthForm mode="register" />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

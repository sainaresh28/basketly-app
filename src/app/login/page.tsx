import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import AuthForm from '../components/AuthForm';

export const metadata: Metadata = {
  title: 'Sign In — Basketly',
  description: 'Sign in to your Basketly account to track orders and save your favourites.',
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main>
        <AuthForm mode="login" />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

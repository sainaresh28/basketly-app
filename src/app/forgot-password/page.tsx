import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password — Basketly',
  description: 'Reset the password for your Basketly account.',
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Navbar />
      <main>
        <ForgotPasswordForm />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

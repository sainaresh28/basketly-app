import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import ResetPasswordForm from '../components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password — Basketly',
  description: 'Choose a new password for your Basketly account.',
};

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div className="pt-24 lg:pt-28 pb-14 px-4 min-h-[400px]" />}>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

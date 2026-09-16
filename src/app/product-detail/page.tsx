import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import ProductDetailClient from './components/ProductDetailClient';
import { ProductService } from '@/lib/services/product.service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Product Detail — Basketly',
  description: 'View detailed product information, specifications, and purchase options.',
};

interface ProductDetailPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function ProductDetailPage({ searchParams }: ProductDetailPageProps) {
  const { id } = await searchParams;

  let product;
  try {
    product = id ? await ProductService.getById(id) : (await ProductService.list({ limit: 1 }))[0];
  } catch {
    product = (await ProductService.list({ limit: 1 }))[0];
  }

  const related = await ProductService.getRelated(product, 6);

  return (
    <>
      <Navbar />
      <main className="pt-[7.5rem] min-h-screen pb-20">
        <ProductDetailClient product={product} relatedProducts={related} />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}
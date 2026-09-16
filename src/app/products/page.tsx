import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import ProductsClientPage from './components/ProductsClientPage';
import { ProductService } from '@/lib/services/product.service';
import { CategoryService } from '@/lib/services/category.service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Shop All Products — Basketly',
  description: 'Browse our full collection of curated lifestyle products. Filter by category, price, brand and more.',
};

export default async function ProductsPage() {
  const [products, categories, facets] = await Promise.all([
    ProductService.list(),
    CategoryService.listAll(),
    ProductService.getFacets(),
  ]);

  return (
    <>
      <Navbar />
      <main className="pt-[7.5rem] min-h-screen">
        <Suspense fallback={null}>
          <ProductsClientPage
            initialProducts={products}
            categories={categories}
            brands={facets.brands}
            priceMin={facets.priceMin}
            priceMax={facets.priceMax}
          />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}
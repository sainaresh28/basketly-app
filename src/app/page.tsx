import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import Hero from './components/Hero';
import TrendingProducts from './components/TrendingProducts';
import PromotionalSection from './components/PromotionalSection';
import NewArrivals from './components/NewArrivals';
import PhilosophySection from './components/PhilosophySection';
import NewsletterSection from './components/NewsletterSection';
import { CategoryService } from '@/lib/services/category.service';
import { ProductService } from '@/lib/services/product.service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Basketly — Discover What\'s Next',
  description: 'Shop curated lifestyle products across fashion, electronics, home and more. Free shipping on orders over ₹999.',
};

export default async function HomePage() {
  const [categories, trending, newArrivals] = await Promise.all([
    CategoryService.listFeatured(),
    ProductService.getTrending(),
    ProductService.getNewArrivals(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero categories={categories} />
        <TrendingProducts products={trending} />
        <PromotionalSection />
        <NewArrivals products={newArrivals} />
        <PhilosophySection categories={categories} />
        <NewsletterSection />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}
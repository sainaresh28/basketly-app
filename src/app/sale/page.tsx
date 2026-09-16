import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import AppImage from '@/components/ui/AppImage';
import ProductGrid from '@/app/products/components/ProductGrid';
import { ProductService } from '@/lib/services/product.service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sale — Basketly',
  description: 'Shop discounted pieces across the Basketly catalog while stock lasts.',
};

export default async function SalePage() {
  const products = (await ProductService.getOnSale(60)).sort(
    (a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0)
  );
  const topDiscount = products.reduce((max, p) => Math.max(max, p.discountPercent ?? 0), 0);

  return (
    <>
      <Navbar />
      <main className="pt-[7.5rem] min-h-screen">
        {/* Hero banner */}
        <section className="px-4 sm:px-6 lg:px-10 pb-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-dark-surface min-h-[280px] sm:min-h-[340px] flex items-end p-8 sm:p-12">
              <AppImage
                src="https://img.rocket.new/generatedImages/rocket_gen_img_1d2462a3d-1785312006865.png"
                alt="Sale collection, moody studio lighting"
                fill
                sizes="100vw"
                priority
                className="object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-surface via-dark-surface/50 to-transparent" />
              <div className="relative z-10">
                <span className="badge-sale mb-3 inline-block">
                  {topDiscount > 0 ? `Up to ${topDiscount}% Off` : 'Limited Time'}
                </span>
                <h1 className="font-display font-black text-white text-display-xl uppercase leading-none mb-3">
                  Sale
                </h1>
                <p className="text-white/70 text-sm sm:text-base max-w-md">
                  Discounted favorites, picked over and marked down. While stock lasts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Product grid */}
        <section className="px-4 sm:px-6 lg:px-10 pb-20">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-end justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{products.length}</span>{' '}
                {products.length === 1 ? 'item' : 'items'} on sale
              </p>
              <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                Browse all products
              </Link>
            </div>

            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <h3 className="font-display font-bold text-xl uppercase text-foreground mb-2">No Sale Items Right Now</h3>
                <p className="text-sm text-muted-foreground mb-5">Check back soon — discounts rotate regularly.</p>
                <Link href="/products" className="btn-primary py-3 px-6 text-xs">Shop All Products</Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </>
  );
}

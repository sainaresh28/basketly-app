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
  title: 'New Arrivals — Basketly',
  description: 'The latest drops at Basketly. Fresh styles across fashion, footwear, electronics and home — just landed.',
};

export default async function NewArrivalsPage() {
  const products = await ProductService.getNewArrivals(60);

  return (
    <>
      <Navbar />
      <main className="pt-[7.5rem] min-h-screen">
        {/* Hero banner */}
        <section className="px-4 sm:px-6 lg:px-10 pb-8">
          <div className="max-w-[1440px] mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-foreground min-h-[280px] sm:min-h-[340px] flex items-end p-8 sm:p-12">
              <div className="absolute inset-0 lg:hidden">
                <AppImage
                  src="/reference/hero/new-arrivals-mobile.png"
                  alt="New arrivals collection"
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover opacity-70"
                />
              </div>
              <div className="absolute inset-0 hidden lg:block">
                <AppImage
                  src="/reference/hero/new-arrivals-desktop.png"
                  alt="New arrivals collection"
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover opacity-70"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
              <div className="relative z-10">
                <span className="badge-new mb-3 inline-block">Just Dropped</span>
                <h1 className="font-display font-black text-white text-display-xl uppercase leading-none mb-3">
                  New Arrivals
                </h1>
                <p className="text-white/70 text-sm sm:text-base max-w-md">
                  The newest pieces to land in the shop, updated as soon as they arrive.
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
                <span className="font-semibold text-foreground">{products.length}</span> new{' '}
                {products.length === 1 ? 'product' : 'products'}
              </p>
              <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                Browse all products
              </Link>
            </div>

            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <h3 className="font-display font-bold text-xl uppercase text-foreground mb-2">No New Arrivals Yet</h3>
                <p className="text-sm text-muted-foreground mb-5">Check back soon — new drops are on the way.</p>
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

import React, { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import ToastContainer from '@/components/layout/ToastContainer';
import ProductDetailClient from './components/ProductDetailClient';
import { ProductService } from '@/lib/services/product.service';
import { safe } from '@/lib/safe';
import type { Product } from '@/types';

/** Schema.org Product + offer/rating structured data, for rich snippets in search results. */
function productJsonLd(product: Product, siteUrl: string) {
  const url = `${siteUrl}/product-detail?id=${product.id}`;
  const availability =
    product.availability === 'Out of Stock'
      ? 'https://schema.org/OutOfStock'
      : product.availability === 'Pre Order'
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images,
    sku: product.model || product.id,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: product.price,
      availability,
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };
}

const getCachedProduct = cache((id: string) => safe(ProductService.getById(id), undefined, 'ProductService.getById'));

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  searchParams: Promise<{ id?: string }>;
}

export async function generateMetadata({ searchParams }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await searchParams;
  const product = id ? await getCachedProduct(id) : undefined;

  if (!product) {
    return {
      title: 'Product Detail — Basketly',
      description: 'View detailed product information, specifications, and purchase options.',
    };
  }

  const title = product.seo?.title || `${product.name} | Basketly`;
  const description = product.seo?.description || product.shortDescription || product.description.slice(0, 155);
  const image = product.images[0];

  return {
    title,
    description,
    keywords: product.seo?.keywords,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ searchParams }: ProductDetailPageProps) {
  const { id } = await searchParams;

  const product = await safe(
    id ? getCachedProduct(id) : ProductService.list({ limit: 1 }).then((list) => list[0]),
    undefined,
    'ProductService.getById/list'
  );

  const related = product ? await safe(ProductService.getRelated(product, 6), [], 'ProductService.getRelated') : [];

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="pt-[7.5rem] min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md text-center py-16">
            <h1 className="font-display font-black uppercase text-display-md text-foreground">Product unavailable</h1>
            <p className="mt-3 text-sm text-muted-foreground">We couldn&apos;t load this product right now. Please try again shortly.</p>
            <Link href="/products" className="btn-primary inline-flex mt-6 py-3 px-6 text-xs">Browse Products</Link>
          </div>
        </main>
        <Footer />
        <CartDrawer />
        <ToastContainer />
      </>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product, siteUrl)) }}
      />
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
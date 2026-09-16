'use client';
import React, { useState } from 'react';
import Link from 'next/link';

import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';

import type { Product } from '@/types';
import ProductGallery from './ProductGallery';
import ProductInformation from './ProductInformation';
import RelatedProducts from './RelatedProducts';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(s => s.addItem);
  const addToast = useCartStore(s => s.addToast);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addItem(product, quantity);
  };

  const handleWishlist = () => {
    const added = toggleItem(product);
    addToast(added ? `${product.name} added to wishlist` : 'Removed from wishlist', added ? 'success' : 'info');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.categoryId}`} className="hover:text-foreground transition-colors">{product.categoryName}</Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[180px]">{product.name}</span>
      </nav>

      {/* Main product layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
        {/* Gallery */}
        <ProductGallery product={product} />

        {/* Info + Purchase */}
        <ProductInformation
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          onWishlist={handleWishlist}
          wishlisted={wishlisted}
        />
      </div>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
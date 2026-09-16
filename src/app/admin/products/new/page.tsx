import React from 'react';
import type { Metadata } from 'next';
import ProductForm from '../../components/ProductForm';

export const metadata: Metadata = { title: 'Add Product — Basketly Admin' };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display font-black uppercase text-3xl text-foreground">Add Product</h1>
      <ProductForm />
    </div>
  );
}

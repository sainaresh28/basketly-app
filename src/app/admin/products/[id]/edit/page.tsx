import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductService } from '@/lib/services/product.service';
import { NotFoundError } from '@/lib/errors/app-error';
import ProductForm from '../../../components/ProductForm';

export const metadata: Metadata = { title: 'Edit Product — Basketly Admin' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await ProductService.getById(id);
    return (
      <div>
        <h1 className="font-display font-black uppercase text-3xl text-foreground">Edit Product</h1>
        <ProductForm product={product} />
      </div>
    );
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }
}

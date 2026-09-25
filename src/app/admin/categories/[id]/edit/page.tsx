import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryService } from '@/lib/services/category.service';
import { NotFoundError } from '@/lib/errors/app-error';
import CategoryForm from '../../../components/CategoryForm';

export const metadata: Metadata = { title: 'Edit Category — Basketly Admin' };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const category = await CategoryService.getById(id);
    return (
      <div>
        <h1 className="font-display font-black uppercase text-3xl text-foreground">Edit Category</h1>
        <CategoryForm category={category} />
      </div>
    );
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }
}

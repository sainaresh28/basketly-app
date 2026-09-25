import React from 'react';
import type { Metadata } from 'next';
import CategoryForm from '../../components/CategoryForm';

export const metadata: Metadata = { title: 'Add Category — Basketly Admin' };

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-display font-black uppercase text-3xl text-foreground">Add Category</h1>
      <CategoryForm />
    </div>
  );
}

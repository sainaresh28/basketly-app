import React from 'react';

interface ProductsHeaderProps {
  productCount: number;
  activeFilterCount: number;
  onOpenFilters: () => void;
}

export default function ProductsHeader({ productCount, activeFilterCount, onOpenFilters }: ProductsHeaderProps) {
  return (
    <div className="flex items-end justify-between py-6 border-b border-border">
      <div>
        <p className="section-label mb-2">Browse</p>
        <h1 className="font-display font-black text-display-md text-foreground uppercase">All Products</h1>
        <p className="text-sm text-muted-foreground mt-1">{productCount} items available</p>
      </div>
      <button
        onClick={onOpenFilters}
        className="lg:hidden flex items-center gap-2 btn-outline py-2.5 px-4 text-xs"
        aria-label="Open filters"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
      </button>
    </div>
  );
}
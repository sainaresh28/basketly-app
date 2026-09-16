'use client';
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Product, Category, FilterState, SortOption } from '@/types';
import ProductsHeader from './ProductsHeader';
import ProductFilters from './ProductFilters';
import ProductGrid from './ProductGrid';
import ProductSort from './ProductSort';

interface ProductsClientPageProps {
  initialProducts: Product[];
  categories: Category[];
  brands: string[];
  priceMin: number;
  priceMax: number;
}

export default function ProductsClientPage({
  initialProducts,
  categories,
  brands,
  priceMin,
  priceMax,
}: ProductsClientPageProps) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  const initialCategoryId = useMemo(() => {
    if (!categorySlug) return null;
    return categories.find(c => c.slug === categorySlug)?.id ?? null;
  }, [categorySlug, categories]);

  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategoryId ? [initialCategoryId] : [],
    priceMin,
    priceMax,
    brands: [],
    rating: null,
    availability: 'all',
    sort: 'featured',
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Re-apply the category filter whenever the `?category=` slug in the URL
  // changes (e.g. clicking a different category from the homepage while
  // this page is already mounted).
  const appliedSlugRef = useRef<string | null>(categorySlug);
  useEffect(() => {
    if (categorySlug === appliedSlugRef.current) return;
    appliedSlugRef.current = categorySlug;
    setFilters(prev => ({
      ...prev,
      categories: initialCategoryId ? [initialCategoryId] : [],
    }));
    setVisibleCount(12);
  }, [categorySlug, initialCategoryId]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.categoryId));
    }
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }
    result = result.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);
    if (filters.rating !== null) {
      result = result.filter(p => p.rating >= filters.rating!);
    }
    if (filters.availability === 'inStock') {
      result = result.filter(p => p.stock > 0);
    } else if (filters.availability === 'outOfStock') {
      result = result.filter(p => p.stock === 0);
    }

    switch (filters.sort) {
      case 'newest': result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'popular': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default: result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [initialProducts, filters]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setVisibleCount(12);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ categories: [], priceMin, priceMax, brands: [], rating: null, availability: 'all', sort: filters.sort });
    setVisibleCount(12);
  }, [priceMin, priceMax, filters.sort]);

  const activeFilterCount = filters.categories.length + filters.brands.length +
    (filters.rating !== null ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (filters.priceMin > priceMin || filters.priceMax < priceMax ? 1 : 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-20">
      <ProductsHeader
        productCount={filteredProducts.length}
        activeFilterCount={activeFilterCount}
        onOpenFilters={() => setFiltersOpen(true)}
      />

      <div className="flex gap-8 mt-6">
        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <ProductFilters
            categories={categories}
            brands={brands}
            priceMin={priceMin}
            priceMax={priceMax}
            filters={filters}
            onUpdateFilter={updateFilter}
            onClear={clearFilters}
            activeCount={activeFilterCount}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
            </p>
            <ProductSort
              value={filters.sort}
              onChange={(val: SortOption) => updateFilter('sort', val)}
            />
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {filters.categories.map(catId => {
                const cat = categories.find(c => c.id === catId);
                return cat ? (
                  <span key={catId} className="filter-chip gap-1.5">
                    {cat.name}
                    <button
                      onClick={() => updateFilter('categories', filters.categories.filter(c => c !== catId))}
                      aria-label={`Remove ${cat.name} filter`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ) : null;
              })}
              {filters.brands.map(brand => (
                <span key={brand} className="filter-chip gap-1.5">
                  {brand}
                  <button
                    onClick={() => updateFilter('brands', filters.brands.filter(b => b !== brand))}
                    aria-label={`Remove ${brand} filter`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-xs font-semibold text-primary hover:underline">
                Clear all
              </button>
            </div>
          )}

          <ProductGrid products={visibleProducts} />

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl uppercase text-foreground mb-2">No Products Found</h3>
              <p className="text-sm text-muted-foreground mb-5">Try adjusting your filters or search terms.</p>
              <button onClick={clearFilters} className="btn-primary py-3 px-6 text-xs">Clear Filters</button>
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount(c => c + 8)}
                className="btn-outline py-3 px-8 text-xs"
              >
                Load More ({filteredProducts.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background shadow-2xl flex flex-col slide-in-right">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-display font-bold text-lg uppercase">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-full hover:bg-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <ProductFilters
                categories={categories}
                brands={brands}
                priceMin={priceMin}
                priceMax={priceMax}
                filters={filters}
                onUpdateFilter={updateFilter}
                onClear={clearFilters}
                activeCount={activeFilterCount}
              />
            </div>
            <div className="p-5 border-t border-border">
              <button onClick={() => setFiltersOpen(false)} className="btn-primary w-full justify-center py-3.5 text-xs">
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
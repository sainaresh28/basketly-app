'use client';
import React, { useState } from 'react';
import type { Category, FilterState } from '@/types';
import { formatPrice } from '@/utils/format';

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  filters: FilterState;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClear: () => void;
  activeCount: number;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-5 mb-5 last:border-0">
      <button
        className="flex items-center justify-between w-full mb-4 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-foreground">{title}</span>
        <svg className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && children}
    </div>
  );
}

export default function ProductFilters({
  categories, brands, priceMin, priceMax, filters, onUpdateFilter, onClear, activeCount,
}: ProductFiltersProps) {
  const toggleCategory = (catId: string) => {
    const updated = filters.categories.includes(catId)
      ? filters.categories.filter(c => c !== catId)
      : [...filters.categories, catId];
    onUpdateFilter('categories', updated);
  };

  const toggleBrand = (brand: string) => {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onUpdateFilter('brands', updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">Filters</h2>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-xs font-semibold text-primary hover:underline">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <FilterSection title="Category">
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                  filters.categories.includes(cat.id)
                    ? 'bg-foreground border-foreground'
                    : 'border-border group-hover:border-foreground'
                }`}
                onClick={() => toggleCategory(cat.id)}
              >
                {filters.categories.includes(cat.id) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="sr-only"
                aria-label={cat.name}
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{cat.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">({cat.productCount})</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(filters.priceMin)}</span>
            <span>{formatPrice(filters.priceMax)}</span>
          </div>
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            value={filters.priceMax}
            onChange={e => onUpdateFilter('priceMax', Number(e.target.value))}
            className="range-thumb w-full"
            aria-label="Maximum price"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.priceMin}
              onChange={e => onUpdateFilter('priceMin', Math.max(priceMin, Number(e.target.value)))}
              className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-foreground"
              placeholder="Min"
              aria-label="Minimum price"
            />
            <input
              type="number"
              value={filters.priceMax}
              onChange={e => onUpdateFilter('priceMax', Math.min(priceMax, Number(e.target.value)))}
              className="w-full px-2 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-foreground"
              placeholder="Max"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Brand">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                  filters.brands.includes(brand)
                    ? 'bg-foreground border-foreground'
                    : 'border-border group-hover:border-foreground'
                }`}
                onClick={() => toggleBrand(brand)}
              >
                {filters.brands.includes(brand) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="sr-only"
                aria-label={brand}
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="space-y-2">
          {[4, 3, 2].map(rating => (
            <button
              key={rating}
              onClick={() => onUpdateFilter('rating', filters.rating === rating ? null : rating)}
              className={`flex items-center gap-2 w-full text-left py-1 rounded transition-colors ${
                filters.rating === rating ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <svg key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber' : 'text-border'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs">& up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Availability">
        <div className="space-y-2">
          {(['all', 'inStock', 'outOfStock'] as const).map(opt => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                  filters.availability === opt ? 'border-foreground' : 'border-border'
                }`}
                onClick={() => onUpdateFilter('availability', opt)}
              >
                {filters.availability === opt && <div className="w-2 h-2 rounded-full bg-foreground" />}
              </div>
              <input type="radio" name="availability" value={opt} checked={filters.availability === opt} onChange={() => onUpdateFilter('availability', opt)} className="sr-only" />
              <span className="text-sm text-foreground/80 capitalize">
                {opt === 'all' ? 'All Items' : opt === 'inStock' ? 'In Stock' : 'Out of Stock'}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
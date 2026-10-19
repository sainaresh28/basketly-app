'use client';
import React, { useState } from 'react';
import type { AttributeDefinition, Category, FilterState } from '@/types';
import { formatPrice } from '@/utils/format';
import { UNIVERSAL_COLORS } from '@/lib/catalog/universal-options';

interface ProductFiltersProps {
  categories: Category[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  filters: FilterState;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClear: () => void;
  activeCount: number;
  /** Filters generated from the selected category's schema — empty unless exactly one category is checked. */
  attributeFilters?: AttributeDefinition[];
  onToggleAttribute?: (attrKey: string, value: string, exclusive?: boolean) => void;
  /** Replaces an attribute's value outright — used by free-entry (number/text) filters. */
  onSetAttributeValue?: (attrKey: string, value: string) => void;
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
  categories, brands, priceMin, priceMax, filters, onUpdateFilter, onClear, activeCount, attributeFilters, onToggleAttribute, onSetAttributeValue,
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
                    ? 'bg-dark-surface border-dark-surface'
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
                    ? 'bg-dark-surface border-dark-surface'
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

      {attributeFilters && attributeFilters.length > 0 && (
        <>
          <div className="mb-4 -mt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">More filters for this category</span>
          </div>
          {attributeFilters.map((attr) => {
            const selected = filters.attributes[attr.key] || [];
            if (attr.type === 'boolean') {
              return (
                <FilterSection key={attr.key} title={attr.label}>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected.includes('true') ? 'bg-dark-surface border-dark-surface' : 'border-border group-hover:border-foreground'
                      }`}
                      onClick={() => onToggleAttribute?.(attr.key, 'true')}
                    >
                      {selected.includes('true') && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">Yes</span>
                  </label>
                </FilterSection>
              );
            }
            if (attr.type === 'checkbox') {
              return (
                <FilterSection key={attr.key} title={attr.label}>
                  <div className="space-y-2">
                    {(attr.options || []).map((opt) => {
                      const active = selected.includes(opt);
                      return (
                        <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                              active ? 'bg-dark-surface border-dark-surface' : 'border-border group-hover:border-foreground'
                            }`}
                            onClick={() => onToggleAttribute?.(attr.key, opt)}
                          >
                            {active && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </FilterSection>
              );
            }
            if (attr.type === 'size-selector') {
              return (
                <FilterSection key={attr.key} title={attr.label}>
                  <div className="flex flex-wrap gap-2">
                    {(attr.options || []).map((opt) => {
                      const active = selected.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => onToggleAttribute?.(attr.key, opt)}
                          aria-pressed={active}
                          className={`min-w-[2.5rem] h-9 px-2.5 rounded-lg border text-xs font-bold transition-colors ${
                            active ? 'bg-dark-surface border-dark-surface text-white' : 'border-border text-foreground hover:border-foreground'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>
              );
            }
            if (attr.type === 'button-group' || attr.type === 'image-swatch') {
              // Segmented single-choice control. image-swatch renders as a labelled
              // tile: the type supports per-option images, and falls back to the
              // label alone since the catalog doesn't carry swatch images yet.
              return (
                <FilterSection key={attr.key} title={attr.label}>
                  <div className="inline-flex flex-wrap rounded-xl border border-border overflow-hidden">
                    {(attr.options || []).map((opt) => {
                      const active = selected.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => onToggleAttribute?.(attr.key, opt, true)}
                          aria-pressed={active}
                          className={`px-3 py-2 text-xs font-semibold border-r border-border last:border-r-0 transition-colors ${
                            active ? 'bg-dark-surface text-white' : 'text-foreground/80 hover:bg-muted'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>
              );
            }
            if (attr.type === 'number' || attr.type === 'text') {
              return (
                <FilterSection key={attr.key} title={attr.label}>
                  <input
                    type={attr.type === 'number' ? 'number' : 'text'}
                    value={selected[0] ?? ''}
                    onChange={(e) => {
                      const v = e.target.value.trim();
                      // Stored as a single-element list; an empty box clears the filter.
                      if (!v) {
                        if (selected[0]) onToggleAttribute?.(attr.key, selected[0], true);
                        return;
                      }
                      onSetAttributeValue?.(attr.key, v);
                    }}
                    placeholder={attr.type === 'number' ? `Minimum ${attr.label.toLowerCase()}` : `Search ${attr.label.toLowerCase()}`}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </FilterSection>
              );
            }
            if (attr.type === 'color-swatch') {
              return (
                <FilterSection key={attr.key} title={attr.label}>
                  <div className="flex flex-wrap gap-2.5">
                    {(attr.options || []).map((opt) => {
                      const active = selected.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => onToggleAttribute?.(attr.key, opt)}
                          aria-label={opt}
                          aria-pressed={active}
                          title={opt}
                          className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                            active ? 'ring-2 ring-offset-2 ring-foreground' : 'ring-1 ring-border hover:ring-foreground/50'
                          }`}
                        >
                          <span className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: UNIVERSAL_COLORS[opt] || '#8A8580' }} />
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>
              );
            }
            return (
              <FilterSection key={attr.key} title={attr.label}>
                <div className="flex flex-wrap gap-2">
                  {(attr.options || []).map((opt) => {
                    const active = selected.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onToggleAttribute?.(attr.key, opt, attr.type === 'radio' || attr.type === 'select')}
                        aria-pressed={active}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          active ? 'bg-dark-surface border-dark-surface text-white' : 'border-border text-foreground/80 hover:border-foreground'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </FilterSection>
            );
          })}
        </>
      )}
    </div>
  );
}
import type { Product, ProductVariant } from '@/types';
import { CATEGORY_TAXONOMY } from './taxonomy';
import { UNIVERSAL_COLORS } from './universal-options';
import { slugify } from '../../utils/format';

/** Re-export the single universal color source instead of maintaining a second, smaller map. */
export const COLOR_HEX = UNIVERSAL_COLORS;

/** Electronics/appliances/computers plausibly carry a real manufacturer warranty; apparel/beauty/home decor typically don't. */
const WARRANTED_CATEGORIES = new Set(['cat-3', 'cat-6', 'cat-10', 'cat-12']);

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) { h = (h << 5) - h + input.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

function pick<T>(arr: T[] | undefined, seed: number, count: number): T[] {
  if (!arr || arr.length === 0) return [];
  const start = seed % arr.length;
  const out: T[] = [];
  for (let i = 0; i < Math.min(count, arr.length); i++) out.push(arr[(start + i) % arr.length]);
  return out;
}

function has(tags: string[], ...needles: string[]): boolean {
  return needles.some((n) => tags.some((t) => t.includes(n)));
}

/** Category-specific attribute extraction — reads what's already in tags/specs rather than inventing data. */
function buildAttributes(product: Product, categoryId: string): Record<string, string | number | boolean> {
  const tags = product.tags;
  const specs = product.specs || {};
  const seed = hash(product.id);

  switch (categoryId) {
    case 'cat-1': // Fashion & Apparel
      return {
        gender: has(tags, 'women', 'dress') ? 'Women' : 'Men',
        material: specs.Fabric || specs.Material || pick(['Cotton', 'Linen', 'Denim'], seed, 1)[0],
        fit: specs.Fit || pick(['Regular', 'Relaxed', 'Oversized'], seed, 1)[0],
        pattern: 'Solid',
        sleeve: has(tags, 'sleeveless') ? 'Sleeveless' : has(tags, 'full-sleeve') ? 'Full Sleeve' : pick(['Half Sleeve', 'Full Sleeve'], seed, 1)[0],
        neck: pick(['Round Neck', 'V-Neck', 'Collar'], seed + 2, 1)[0],
        occasion: has(tags, 'formal') ? 'Formal' : 'Casual',
        season: 'All Season',
      };
    case 'cat-2': // Footwear
      return {
        gender: 'Unisex',
        material: specs.Upper || specs.Outsole || pick(['Mesh', 'Leather', 'Canvas'], seed, 1)[0],
        closure: specs.Lacing || 'Lace-Up',
        shoeType: has(tags, 'trail', 'running') ? 'Running' : has(tags, 'formal') ? 'Formal' : 'Sneakers',
        width: 'Regular',
        cushioning: has(tags, 'running') ? 'Extra Cushioned' : 'Balanced',
      };
    case 'cat-3': // Electronics
      return {
        connectivity: specs.Bluetooth ? 'Bluetooth' : 'USB-C',
        batteryLife: specs.Battery || '6-24 hrs',
        waterproof: Boolean(specs.Water),
        anc: has(tags, 'anc', 'noise-cancelling', 'noise-cancellation'),
        microphone: has(tags, 'mic', 'microphone', 'calling'),
        warranty: '1 Year',
      };
    case 'cat-4': // Bags & Accessories
      return {
        material: specs.Material || 'Leather',
        capacity: specs.Capacity || specs.Dimensions || '10-20L',
        laptopCompatible: Boolean(specs.Laptop),
        occasion: has(tags, 'travel') ? 'Travel' : 'Casual',
      };
    case 'cat-5': // Home & Furniture
      return {
        material: specs.Material || specs.Base || 'Ceramic',
        style: 'Modern',
        room: has(tags, 'kitchen') ? 'Kitchen' : has(tags, 'desk') ? 'Office' : 'Living Room',
      };
    case 'cat-6': // Jewelry & Watches
      return {
        gender: 'Unisex',
        strapMaterial: specs.Leather ? 'Leather' : 'Stainless Steel',
        movement: specs.Movement || 'Quartz',
        waterResistance: specs.Water || '5 ATM',
        metal: 'Stainless Steel',
        dialSize: pick(['34mm', '38mm', '42mm', '46mm'], seed, 1)[0],
      };
    case 'cat-7': // Sports & Fitness
      return {
        sport: has(tags, 'yoga') ? 'Yoga' : has(tags, 'run') ? 'Running' : 'Gym',
        material: specs.Material || 'Polyester',
        skillLevel: 'Beginner',
      };
    case 'cat-8': // Beauty & Personal Care
      return {
        skinType: 'All',
        concern: has(tags, 'anti-aging') ? 'Aging' : has(tags, 'acne') ? 'Acne' : 'Dullness',
        size: specs.Size || '50ml',
        fragranceFree: has(tags, 'fragrance-free'),
        ingredient: has(tags, 'retinol') ? 'Retinol' : has(tags, 'vitamin-c') ? 'Vitamin C' : has(tags, 'niacinamide') ? 'Niacinamide' : 'Hyaluronic Acid',
      };
    case 'cat-9': // Kitchen & Dining
      return {
        material: specs.Material || pick(['Stainless Steel', 'Cast Iron', 'Ceramic'], seed, 1)[0],
        capacity: specs.Capacity || '1L',
        dishwasherSafe: has(tags, 'dishwasher-safe'),
        inductionCompatible: has(tags, 'induction'),
      };
    case 'cat-10': // Home Appliances
      return {
        energyRating: specs['Energy Rating'] || pick(['3 Star', '4 Star', '5 Star'], seed, 1)[0],
        smartFeatures: specs['Smart Features'] || 'Remote Control',
        capacity: specs.Capacity || 'Medium',
        installation: has(tags, 'self-install') ? 'Self Installation' : 'Free Installation',
      };
    case 'cat-11': // Toys & Baby
      return {
        ageGroup: specs['Age Group'] || pick(['1-2 Years', '3-5 Years', '6-8 Years'], seed, 1)[0],
        educational: has(tags, 'educational', 'learning'),
        batteryRequired: has(tags, 'battery'),
        material: specs.Material || pick(['Wood', 'Plastic', 'Fabric'], seed, 1)[0],
      };
    case 'cat-12': // Computers & Accessories
      return {
        ram: specs.RAM,
        storage: specs.Storage,
        operatingSystem: specs.OS,
        wireless: has(tags, 'wireless'),
        connectivity: specs.Connectivity || 'USB-C',
        color: pick(['Black', 'White', 'Grey'], seed, 1)[0],
      };
    default:
      return {};
  }
}

/** Splits a product's total stock across real, individually-tracked SKUs instead of one undifferentiated count. */
// Which of a category's attributes become purchasable, SKU-differentiating
// variant dimensions — not every attribute should (e.g. a fridge's energy
// rating isn't something you "pick" the way you pick a T-shirt's size).
// Capped at 2 dimensions per category to keep the combinatorics and the UI
// sane; the underlying ProductVariant.options is a generic Record<string,
// string> already, so adding a third dimension later needs no schema change.
const VARIANT_DIMENSIONS: Record<string, string[]> = {
  'cat-1': ['size', 'color'], // Fashion & Apparel
  'cat-2': ['size', 'color'], // Footwear
  'cat-3': ['color', 'connectivity'], // Electronics
  'cat-4': ['color'], // Bags & Accessories
  'cat-5': ['color'], // Home & Furniture
  'cat-6': ['metal', 'strapMaterial'], // Jewelry & Watches
  'cat-7': ['size'], // Sports & Fitness
  // cat-8 Beauty: package size is the product itself, not a variant — no dimensions
  'cat-9': ['capacity'], // Kitchen & Dining
  'cat-10': ['capacity'], // Home Appliances
  // cat-11 Toys & Baby: age group describes the product, not a customer choice — no dimensions
  'cat-12': ['color', 'connectivity'], // Computers & Accessories
};

function buildVariants(product: Product, categoryId: string, attrs: Record<string, string | number | boolean>): ProductVariant[] | undefined {
  const top = CATEGORY_TAXONOMY.find((c) => c.id === categoryId);
  const dimensionKeys = VARIANT_DIMENSIONS[categoryId];
  if (!top || !dimensionKeys || dimensionKeys.length === 0) return undefined;
  const seed = hash(product.id);

  // Resolve each configured dimension to its option list (skip any that
  // aren't actually defined with options on this category's schema).
  const dimensions = dimensionKeys
    .map((key, i) => {
      const def = top.attributeSchema.find((a) => a.key === key);
      if (!def?.options) return null;
      const count = key === 'size' ? (categoryId === 'cat-2' ? 4 : 3) : 2 + ((seed + i) % 2);
      return { key, values: pick(def.options, seed + i * 7, count) };
    })
    .filter((d): d is { key: string; values: string[] } => !!d && d.values.length > 0);

  if (dimensions.length === 0) return undefined;

  // Cartesian product across whichever dimensions this category has (1 or 2).
  let combos: Record<string, string>[] = [{}];
  for (const dim of dimensions) {
    combos = combos.flatMap((combo) => dim.values.map((v) => ({ ...combo, [dim.key]: v })));
  }

  const totalStock = product.stock;
  const base = Math.floor(totalStock / combos.length);
  let remainder = totalStock - base * combos.length;

  return combos.map((options, i) => {
    const qty = base + (remainder-- > 0 ? 1 : 0);
    const skuParts = [product.id, ...Object.values(options)].filter(Boolean);
    return {
      id: `${product.id}-var-${i + 1}`,
      sku: skuParts.join('-').toUpperCase().replace(/\s+/g, ''),
      options,
      inventory: {
        quantity: qty,
        reserved: 0,
        available: qty,
        lowStockThreshold: 5,
        status: qty === 0 ? 'out_of_stock' : qty <= 5 ? 'low_stock' : 'in_stock',
      },
    };
  });
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  return (match ? match[0] : text).slice(0, 140);
}

const IRREGULAR_SYNONYMS: Record<string, string> = { mice: 'mouse' };

function stem(word: string): string {
  const normalized = IRREGULAR_SYNONYMS[word] || word;
  if (/(ches|shes|xes|ses)$/.test(normalized) && normalized.length > 5) return normalized.slice(0, -2);
  return normalized.endsWith('s') && normalized.length > 4 ? normalized.slice(0, -1) : normalized;
}

const GENERIC_WORDS = new Set(['smart', 'premium', 'classic', 'essential', 'basic', 'deluxe', 'compact', 'portable']);

function pickSubcategoryIndex(raw: Product, top: (typeof CATEGORY_TAXONOMY)[number]): number {
  const haystack = `${raw.name} ${raw.tags.join(' ')}`.toLowerCase().replace(/-/g, ' ');
  const haystackWords = new Set(haystack.split(/\s+/).map(stem));
  const matchIdx = top.subcategories.findIndex((sub) => {
    const words = sub.name
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !GENERIC_WORDS.has(w));
    return words.some((w) => haystackWords.has(stem(w)) || haystack.includes(w));
  });
  return matchIdx >= 0 ? matchIdx : hash(raw.id) % top.subcategories.length;
}

/** Same keyword-matching approach as subcategory assignment, one level deeper: which specific product type (e.g. "Graphic T-Shirt") fits this product best. */
function pickProductTypeIndex(raw: Product, types: string[]): number {
  const haystack = `${raw.name} ${raw.tags.join(' ')}`.toLowerCase().replace(/-/g, ' ');
  const haystackWords = new Set(haystack.split(/\s+/).map(stem));
  const matchIdx = types.findIndex((typeName) => {
    const words = typeName
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !GENERIC_WORDS.has(w));
    return words.some((w) => haystackWords.has(stem(w)) || haystack.includes(w));
  });
  return matchIdx >= 0 ? matchIdx : hash(raw.id + ':type') % types.length;
}

function buildRatingDistribution(rating: number, reviewCount: number): Record<'1' | '2' | '3' | '4' | '5', number> {
  if (reviewCount === 0) return { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
  const weights =
    rating >= 4.5 ? [0.01, 0.03, 0.06, 0.2, 0.7]
    : rating >= 4.0 ? [0.02, 0.04, 0.09, 0.3, 0.55]
    : rating >= 3.5 ? [0.04, 0.08, 0.16, 0.32, 0.4]
    : rating >= 3.0 ? [0.08, 0.12, 0.24, 0.28, 0.28]
    : [0.2, 0.2, 0.25, 0.2, 0.15];

  const counts = weights.map((w) => Math.round(w * reviewCount));
  // Rounding can drift the total slightly off reviewCount — true it up on the largest bucket.
  const diff = reviewCount - counts.reduce((s, c) => s + c, 0);
  counts[counts.indexOf(Math.max(...counts))] += diff;

  return { '1': counts[0], '2': counts[1], '3': counts[2], '4': counts[3], '5': counts[4] };
}

/** Electronics/Computers assembled in China even under Indian brands is the realistic default; everything else is India-made. */
function countryOfOrigin(categoryId: string, seed: number): string {
  if (['cat-3', 'cat-12'].includes(categoryId)) return seed % 3 === 0 ? 'India' : 'China';
  return 'India';
}

/** A simplified but realistic Indian GST slab mapping — not tax advice, just believable catalog data. */
function gstFor(categoryId: string, price: number): { rate: number; label: string } {
  if (categoryId === 'cat-1' || categoryId === 'cat-2') {
    const rate = price <= 1000 ? 5 : 12;
    return { rate, label: `GST ${rate}%` };
  }
  if (categoryId === 'cat-9') return { rate: 12, label: 'GST 12%' }; // kitchenware
  return { rate: 18, label: 'GST 18%' }; // electronics, appliances, most general goods
}

function availabilityFor(stock: number): NonNullable<Product['availability']> {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return 'Low Stock';
  return 'In Stock';
}

export function enrichProduct(raw: Product): Product {
  const top = CATEGORY_TAXONOMY.find((c) => c.id === raw.categoryId);
  const subIdx = top ? pickSubcategoryIndex(raw, top) : 0;
  const subcategory = top?.subcategories[subIdx];
  const subcategoryId = top && subcategory ? `${top.id}-sub-${subIdx + 1}` : undefined;
  const typeIdx = subcategory && subcategory.types.length > 0 ? pickProductTypeIndex(raw, subcategory.types) : -1;
  const productTypeName = typeIdx >= 0 ? subcategory!.types[typeIdx] : undefined;
  const attributes = top ? buildAttributes(raw, top.id) : undefined;
  const variants = top && attributes ? buildVariants(raw, top.id, attributes) : undefined;

  return {
    ...raw,
    categoryName: top?.name ?? raw.categoryName,
    subcategoryId,
    subcategoryName: subcategory?.name,
    productTypeId: subcategoryId && typeIdx >= 0 ? `${subcategoryId}-type-${typeIdx + 1}` : undefined,
    productTypeName,
    shortDescription: firstSentence(raw.description),
    attributes,
    variants,
    ratingDistribution: buildRatingDistribution(raw.rating, raw.reviewCount),
    shipping: {
      weightGrams: raw.specs?.Weight ? parseInt(raw.specs.Weight, 10) || undefined : undefined,
      freeShipping: raw.price >= 999,
      estimatedMinDays: 2,
      estimatedMaxDays: 5,
      returnable: true,
      returnWindowDays: 7,
    },
    seo: {
      title: `${raw.name} | Basketly`,
      description: firstSentence(raw.description),
      keywords: [raw.name, raw.brand, ...raw.tags],
    },
    status: 'active',
    condition: 'New',
    warranty: WARRANTED_CATEGORIES.has(top?.id ?? '') ? '1 Year' : 'No Warranty',
    packSize: 1,
    model: `${raw.brand.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)}-${raw.id.toUpperCase()}`,
    barcode: `890${String(hash(raw.id)).padStart(10, '0').slice(0, 10)}`,
    manufacturer: raw.brand,
    brandId: `brand-${slugify(raw.brand)}`,
    countryOfOrigin: countryOfOrigin(raw.categoryId, hash(raw.id)),
    tax: gstFor(raw.categoryId, raw.price),
    availability: availabilityFor(raw.stock),
  };
}

export function enrichProducts(raw: Product[]): Product[] {
  return raw.map(enrichProduct);
}

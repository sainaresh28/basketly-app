/** The full universal color palette, each with a real hex value for color-swatch rendering. */
export const UNIVERSAL_COLORS: Record<string, string> = {
  Black: '#1C1008', White: '#F5EFE6', Grey: '#8A8580', Silver: '#C7C9CC', Gold: '#D4AF37',
  Red: '#B23A2E', Blue: '#2E5A9E', Navy: '#243A5E', Green: '#4A6B3E', Olive: '#6B7A4A',
  Yellow: '#E8C547', Orange: '#D97A34', Pink: '#D98A9E', Purple: '#6B4A7A', Brown: '#6B4A2E',
  Beige: '#D9CFC1', Cream: '#F3EAD8', Maroon: '#6B2130', Teal: '#2E7A6E', Multicolor: '#B23A2E',
  Transparent: '#E8E0D5', Tan: '#C9A876',
};
export const UNIVERSAL_COLOR_NAMES = Object.keys(UNIVERSAL_COLORS);

export const UNIVERSAL_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];

export const UNIVERSAL_MATERIALS = [
  'Cotton', 'Linen', 'Denim', 'Polyester', 'Nylon', 'Rayon', 'Viscose', 'Wool', 'Silk',
  'Leather', 'Synthetic Leather', 'Canvas', 'Mesh', 'Metal', 'Stainless Steel', 'Aluminum',
  'Glass', 'Ceramic', 'Plastic', 'Wood', 'Rubber', 'Silicone', 'Carbon Fiber',
];

export const PRODUCT_CONDITIONS = ['New', 'Refurbished', 'Open Box', 'Used'] as const;
export const AVAILABILITY_STATUSES = ['In Stock', 'Low Stock', 'Out of Stock', 'Pre Order', 'Coming Soon', 'Discontinued'] as const;
export const WARRANTY_OPTIONS = ['No Warranty', '6 Months', '1 Year', '2 Years', '3 Years', '5 Years', '10 Years', 'Lifetime'] as const;
export const PACK_SIZES = [1, 2, 3, 4, 6, 8, 10, 12, 24, 50, 100];

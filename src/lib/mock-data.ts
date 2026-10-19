import type { Product, Category } from '@/types';
import { buildCategoryRecords } from './catalog/taxonomy';
import { enrichProducts } from './catalog/enrich';

export const CATEGORIES: Category[] = buildCategoryRecords();

const RAW_PRODUCTS: Product[] = [
{
  id: 'p-001', name: 'Minimal Leather Backpack', slug: 'minimal-leather-backpack',
  description: 'Crafted from full-grain vegetable-tanned leather, this backpack develops a rich patina over time. Padded laptop sleeve fits up to 15", two internal compartments, and a hidden back pocket for security.',
  price: 4999, originalPrice: 6499, discountPercent: 23,
  categoryId: 'cat-4', categoryName: 'Bags',
  images: [
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80'],

  rating: 4.7, reviewCount: 234, stock: 14, brand: 'Wildcraft',
  tags: ['leather', 'backpack', 'laptop'], isNew: false, isBestSeller: true, isSale: true,
  specs: { Material: 'Full-grain leather', Capacity: '22L', Laptop: 'Up to 15"', Weight: '0.9 kg' }
},
{
  id: 'p-002', name: 'Everyday Runner Sneakers', slug: 'everyday-runner-sneakers',
  description: 'Engineered mesh upper with responsive foam midsole. Designed for all-day comfort whether you\'re commuting or hitting the trail. Available in 6 colorways.',
  price: 3499, originalPrice: undefined,
  categoryId: 'cat-2', categoryName: 'Footwear',
  images: [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80'],

  rating: 4.5, reviewCount: 412, stock: 28, brand: 'Bata',
  tags: ['sneakers', 'running', 'casual'], isNew: true,
  specs: { Upper: 'Engineered mesh', Sole: 'Responsive foam', Sizes: '6–12 UK', Weight: '280g per shoe' }
},
{
  id: 'p-003', name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-nc-headphones',
  description: 'Industry-leading active noise cancellation with 30-hour battery life. Foldable design with premium ear cushions. Pairs instantly with two devices simultaneously.',
  price: 8499, originalPrice: 11999, discountPercent: 29,
  categoryId: 'cat-3', categoryName: 'Electronics',
  images: [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'],

  rating: 4.8, reviewCount: 891, stock: 7, brand: 'boAt',
  tags: ['headphones', 'wireless', 'ANC', 'audio'], isBestSeller: true, isSale: true,
  specs: { Battery: '30 hours', ANC: 'Industry-leading', Bluetooth: '5.2', Weight: '250g' }
},
{
  id: 'p-004', name: 'Classic Chronograph Watch', slug: 'classic-chronograph-watch',
  description: 'Japanese quartz movement in a 40mm stainless steel case. Sapphire crystal glass, 5ATM water resistance. The ideal everyday watch that transitions seamlessly from desk to dinner.',
  price: 7999, originalPrice: undefined,
  categoryId: 'cat-6', categoryName: 'Watches',
  images: [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
  'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80'],

  rating: 4.6, reviewCount: 178, stock: 5, brand: 'Titan',
  tags: ['watch', 'chronograph', 'stainless'], isNew: false,
  specs: { Movement: 'Japanese quartz', Case: '40mm stainless', Glass: 'Sapphire crystal', Water: '5ATM' }
},
{
  id: 'p-005', name: 'Oversized Cotton Shirt', slug: 'oversized-cotton-shirt',
  description: '100% organic cotton in a relaxed oversized cut. Pre-washed for softness, garment-dyed in seasonal tones. Drop shoulders, chest pocket, boxy hem.',
  price: 1799, originalPrice: 2299, discountPercent: 22,
  categoryId: 'cat-1', categoryName: 'Clothing',
  images: [
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'],

  rating: 4.3, reviewCount: 567, stock: 42, brand: 'Fabindia',
  tags: ['shirt', 'cotton', 'oversized', 'casual'], isSale: true,
  specs: { Fabric: '100% organic cotton', Fit: 'Oversized', Care: 'Machine wash cold', Origin: 'India' }
},
{
  id: 'p-006', name: 'Compact Travel Organizer', slug: 'compact-travel-organizer',
  description: 'Fits inside any carry-on. Separate compartments for cables, chargers, documents and passport. Water-resistant shell with YKK zippers.',
  price: 1299, originalPrice: undefined,
  categoryId: 'cat-4', categoryName: 'Bags',
  images: [
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80'],

  rating: 4.4, reviewCount: 312, stock: 33, brand: 'Baggit',
  tags: ['organizer', 'travel', 'cables'], isNew: true,
  specs: { Material: 'Nylon shell', Zippers: 'YKK', Dimensions: '28 × 18 × 6 cm', Weight: '180g' }
},
{
  id: 'p-007', name: 'Ceramic Desk Lamp', slug: 'ceramic-desk-lamp',
  description: 'Hand-thrown ceramic base with linen shade. Touch-dimmer with 3 warmth settings. LED bulb included. Makes any workspace feel considered.',
  price: 3299, originalPrice: 3999, discountPercent: 18,
  categoryId: 'cat-5', categoryName: 'Home & Living',
  images: [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],

  rating: 4.9, reviewCount: 89, stock: 3, brand: 'Nilkamal',
  tags: ['lamp', 'ceramic', 'desk', 'home'], isBestSeller: true, isSale: true,
  specs: { Base: 'Hand-thrown ceramic', Shade: 'Linen', Dimmer: 'Touch 3-step', Bulb: 'LED included' }
},
{
  id: 'p-008', name: 'Everyday Crossbody Bag', slug: 'everyday-crossbody-bag',
  description: 'Pebbled leather crossbody with adjustable strap. Fits phone, cards, keys and a small notebook. Magnetic closure, interior zip pocket.',
  price: 2799, originalPrice: undefined,
  categoryId: 'cat-4', categoryName: 'Bags',
  images: [
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80'],

  rating: 4.6, reviewCount: 203, stock: 19, brand: 'Hidesign',
  tags: ['crossbody', 'leather', 'everyday'], isNew: true,
  specs: { Material: 'Pebbled leather', Strap: 'Adjustable 60–120cm', Closure: 'Magnetic', Pocket: 'Interior zip' }
},
{
  id: 'p-009', name: 'True Wireless Earbuds', slug: 'true-wireless-earbuds',
  description: 'Six hours of playback per charge, 24 hours with the case. IPX5 water resistance. Dual-driver audio with deep bass and clear highs.',
  price: 4499, originalPrice: 5999, discountPercent: 25,
  categoryId: 'cat-3', categoryName: 'Electronics',
  images: [
  'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80',
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],

  rating: 4.4, reviewCount: 678, stock: 21, brand: 'Noise',
  tags: ['earbuds', 'wireless', 'audio'], isSale: true,
  specs: { Battery: '6+24 hours', Water: 'IPX5', Drivers: 'Dual', Bluetooth: '5.3' }
},
{
  id: 'p-010', name: 'Slim Fit Chino Trousers', slug: 'slim-fit-chino-trousers',
  description: 'Stretch cotton blend for all-day comfort. Tapered fit from hip to ankle. Works with sneakers or loafers. Available in 5 seasonal colors.',
  price: 2199, originalPrice: undefined,
  categoryId: 'cat-1', categoryName: 'Clothing',
  images: [
  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80'],

  rating: 4.2, reviewCount: 345, stock: 38, brand: 'Allen Solly',
  tags: ['chinos', 'trousers', 'slim-fit'], isNew: false,
  specs: { Fabric: '95% cotton, 5% elastane', Fit: 'Slim tapered', Waist: '28–38 inches', Care: 'Machine wash' }
},
{
  id: 'p-011', name: 'Leather Chelsea Boots', slug: 'leather-chelsea-boots',
  description: 'Full-grain leather upper with elastic side gussets. Leather-lined for breathability. Stacked leather heel. Resoleable Goodyear welt construction.',
  price: 6499, originalPrice: 8499, discountPercent: 24,
  categoryId: 'cat-2', categoryName: 'Footwear',
  images: [
  'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],

  rating: 4.7, reviewCount: 156, stock: 8, brand: 'Woodland',
  tags: ['boots', 'chelsea', 'leather'], isBestSeller: true, isSale: true,
  specs: { Upper: 'Full-grain leather', Lining: 'Leather', Sole: 'Stacked leather', Construction: 'Goodyear welt' }
},
{
  id: 'p-012', name: 'Knit Merino Sweater', slug: 'knit-merino-sweater',
  description: 'Extra-fine 18.5-micron merino wool. Ribbed collar, cuffs and hem. Relaxed fit, mid-weight for year-round wear. Naturally odour-resistant.',
  price: 3999, originalPrice: undefined,
  categoryId: 'cat-1', categoryName: 'Clothing',
  images: [
  'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'],

  rating: 4.8, reviewCount: 289, stock: 16, brand: 'Peter England',
  tags: ['sweater', 'merino', 'knit'], isNew: true, isBestSeller: true,
  specs: { Wool: '18.5-micron merino', Fit: 'Relaxed', Weight: 'Mid-weight', Care: 'Hand wash cold' }
},
{
  id: 'p-013', name: 'Smart Fitness Tracker', slug: 'smart-fitness-tracker',
  description: 'Tracks heart rate, SpO2, sleep stages and 100+ workouts. 7-day battery, AMOLED display. Swim-proof 5ATM. Connects to iOS and Android.',
  price: 5499, originalPrice: 6999, discountPercent: 21,
  categoryId: 'cat-3', categoryName: 'Electronics',
  images: [
  'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],

  rating: 4.5, reviewCount: 523, stock: 12, brand: 'pTron',
  tags: ['fitness', 'tracker', 'wearable', 'health', 'smartwatch'], isSale: true,
  specs: { Display: 'AMOLED', Battery: '7 days', Water: '5ATM', OS: 'iOS & Android' }
},
{
  id: 'p-014', name: 'Linen Wide-Leg Pants', slug: 'linen-wide-leg-pants',
  description: 'Breathable linen blend with a high-rise wide-leg silhouette. Elasticated back waistband, two side pockets. Perfect for warm weather and travel.',
  price: 2499, originalPrice: undefined,
  categoryId: 'cat-1', categoryName: 'Clothing',
  images: [
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80'],

  rating: 4.3, reviewCount: 198, stock: 29, brand: 'Raymond',
  tags: ['linen', 'pants', 'wide-leg', 'summer'], isNew: true,
  specs: { Fabric: '55% linen, 45% viscose', Fit: 'Wide-leg high-rise', Waist: 'Elasticated back', Pockets: '2 side' }
},
{
  id: 'p-015', name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker',
  description: '360° sound with 24-hour battery. Drop and waterproof (IP67). Pair two speakers for true stereo. Charges via USB-C in 2 hours.',
  price: 3799, originalPrice: 4799, discountPercent: 21,
  categoryId: 'cat-3', categoryName: 'Electronics',
  images: [
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80',
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80'],

  rating: 4.6, reviewCount: 445, stock: 18, brand: 'Zebronics',
  tags: ['speaker', 'bluetooth', 'portable', 'outdoor'], isSale: true,
  specs: { Battery: '24 hours', Water: 'IP67', Sound: '360°', Charge: 'USB-C 2hr' }
},
{
  id: 'p-016', name: 'Canvas Tote Bag', slug: 'canvas-tote-bag',
  description: 'Heavyweight 16oz canvas with leather handles. Large interior, small internal zip pocket. Reinforced base for heavy loads. The only tote you\'ll ever need.',
  price: 1499, originalPrice: undefined,
  categoryId: 'cat-4', categoryName: 'Bags',
  images: [
  'https://images.unsplash.com/photo-1587382901831-4edc5d0a3826?w=800&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],

  rating: 4.4, reviewCount: 267, stock: 55, brand: 'Safari',
  tags: ['tote', 'canvas', 'everyday'], isNew: false,
  specs: { Canvas: '16oz cotton', Handles: 'Vegetable leather', Capacity: '15L', Base: 'Reinforced' }
},
{
  id: 'p-017', name: 'Scented Soy Candle Set', slug: 'scented-soy-candle-set',
  description: 'Set of 3 hand-poured soy wax candles. Scents: Cedarwood & Amber, White Tea & Bergamot, Sandalwood & Vetiver. 45-hour burn each. Cotton wicks.',
  price: 1999, originalPrice: 2599, discountPercent: 23,
  categoryId: 'cat-5', categoryName: 'Home & Living',
  images: [
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
  'https://images.unsplash.com/photo-1513201099705-a9746072228c?w=800&q=80'],

  rating: 4.9, reviewCount: 134, stock: 22, brand: 'Home Centre',
  tags: ['candle', 'soy', 'home', 'fragrance'], isBestSeller: true, isSale: true,
  specs: { Wax: '100% soy', Wicks: 'Cotton', Burn: '45 hours each', Set: '3 candles' }
},
{
  id: 'p-018', name: 'Slim Minimalist Wallet', slug: 'slim-minimalist-wallet',
  description: 'Holds 6 cards and cash folded once. Full-grain leather, stitched by hand. Develops character with use. Fits comfortably in a front pocket.',
  price: 1599, originalPrice: undefined,
  categoryId: 'cat-4', categoryName: 'Bags',
  images: [
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],

  rating: 4.7, reviewCount: 389, stock: 44, brand: 'Skybags',
  tags: ['wallet', 'leather', 'minimalist'], isNew: false,
  specs: { Leather: 'Full-grain', Cards: '6 slots', Stitching: 'Hand-stitched', Thickness: '6mm when full' }
},
{
  id: 'p-019', name: 'Yoga Mat Premium', slug: 'yoga-mat-premium',
  description: '6mm natural rubber mat with alignment lines. Non-slip texture on both sides. Includes carry strap. Eco-certified, free of PVC and latex.',
  price: 2899, originalPrice: 3499, discountPercent: 17,
  categoryId: 'cat-7', categoryName: 'Sports',
  images: [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80'],

  rating: 4.6, reviewCount: 223, stock: 31, brand: 'Nivia',
  tags: ['yoga', 'mat', 'fitness', 'sports'], isSale: true,
  specs: { Material: 'Natural rubber', Thickness: '6mm', Size: '183 × 61 cm', Weight: '1.5 kg' }
},
{
  id: 'p-020', name: 'Vitamin C Serum 30ml', slug: 'vitamin-c-serum',
  description: '15% L-ascorbic acid with hyaluronic acid and vitamin E. Brightens, firms and evens skin tone. Fragrance-free, dermatologist tested. Suitable for all skin types.',
  price: 1299, originalPrice: undefined,
  categoryId: 'cat-8', categoryName: 'Skincare',
  images: [
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'],

  rating: 4.5, reviewCount: 677, stock: 48, brand: 'Mamaearth',
  tags: ['serum', 'vitamin-c', 'skincare', 'brightening'], isNew: true,
  specs: { Concentration: '15% L-ascorbic acid', Size: '30ml', Skin: 'All types', Free: 'Fragrance-free' }
},
{
  id: 'p-021', name: 'Structured Denim Jacket', slug: 'structured-denim-jacket',
  description: 'Mid-weight selvedge denim, pre-distressed at the right places. Structured chest pockets, adjustable waist tabs. A jacket that looks better every year.',
  price: 4299, originalPrice: 5299, discountPercent: 19,
  categoryId: 'cat-1', categoryName: 'Clothing',
  images: [
  'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80'],

  rating: 4.4, reviewCount: 167, stock: 11, brand: 'W for Woman',
  tags: ['jacket', 'denim', 'selvedge'], isSale: true,
  specs: { Denim: 'Selvedge mid-weight', Fit: 'Regular', Pockets: '4 external', Wash: 'Pre-distressed' }
},
{
  id: 'p-022', name: 'Running Shorts 5-inch', slug: 'running-shorts-5-inch',
  description: 'Lightweight ripstop fabric with built-in liner. Reflective details for low-light visibility. Back zip pocket fits phone. 5-inch inseam.',
  price: 1199, originalPrice: undefined,
  categoryId: 'cat-7', categoryName: 'Sports',
  images: [
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'],

  rating: 4.3, reviewCount: 298, stock: 67, brand: 'Cosco',
  tags: ['shorts', 'running', 'sports', 'lightweight'],
  specs: { Fabric: 'Ripstop nylon', Liner: 'Built-in', Inseam: '5 inches', Pocket: 'Back zip' }
},
{
  id: 'p-023', name: 'Ceramic Pour-Over Coffee Set', slug: 'ceramic-pour-over-set',
  description: 'Hand-thrown ceramic dripper and server. Serves 2 cups. Includes 40 paper filters. Makes coffee ritual feel intentional.',
  price: 2199, originalPrice: 2699, discountPercent: 19,
  categoryId: 'cat-5', categoryName: 'Home & Living',
  images: [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80'],

  rating: 4.8, reviewCount: 92, stock: 17, brand: 'Wakefit',
  tags: ['coffee', 'ceramic', 'pour-over', 'kitchen'], isNew: true, isSale: true,
  specs: { Material: 'Hand-thrown ceramic', Serves: '2 cups', Filters: '40 included', Care: 'Dishwasher safe' }
},
{
  id: 'p-024', name: 'Leather Card Holder', slug: 'leather-card-holder',
  description: 'Slim vegetable-tanned leather card holder. 4 card slots, center cash slot. Compact enough to live in any pocket.',
  price: 799, originalPrice: undefined,
  categoryId: 'cat-4', categoryName: 'Bags',
  images: [
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],

  rating: 4.5, reviewCount: 445, stock: 82, brand: 'Wildcraft',
  tags: ['card-holder', 'leather', 'slim'], isNew: false,
  specs: { Leather: 'Vegetable-tanned', Cards: '4 slots', Cash: 'Center slot', Thickness: '4mm' }
},
{
  id: 'p-025', name: 'Face Moisturizer SPF 30', slug: 'face-moisturizer-spf30',
  description: 'Lightweight daily moisturizer with SPF 30. Hydrates for 24 hours, non-greasy finish. Suitable for oily and combination skin.',
  price: 899, originalPrice: 1099, discountPercent: 18,
  categoryId: 'cat-8', categoryName: 'Skincare',
  images: [
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80'],

  rating: 4.4, reviewCount: 312, stock: 56, brand: 'Biotique',
  tags: ['moisturizer', 'spf', 'skincare', 'daily'], isSale: true,
  specs: { SPF: '30', Hydration: '24 hours', Skin: 'Oily/combination', Size: '50ml' }
},
{
  id: 'p-026', name: 'White Leather Sneakers', slug: 'white-leather-sneakers',
  description: 'Clean minimalist silhouette in full-grain leather. Padded collar, cushioned insole, rubber cupsole. The sneaker that goes with everything.',
  price: 4999, originalPrice: undefined,
  categoryId: 'cat-2', categoryName: 'Footwear',
  images: [
  'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],

  rating: 4.7, reviewCount: 534, stock: 23, brand: 'Red Tape',
  tags: ['sneakers', 'leather', 'white', 'minimalist'], isBestSeller: true,
  specs: { Upper: 'Full-grain leather', Sole: 'Rubber cupsole', Sizes: '6–12 UK', Lining: 'Textile' }
},
{
  id: 'p-027', name: 'Stainless Steel Water Bottle', slug: 'stainless-water-bottle',
  description: 'Triple-wall vacuum insulation keeps drinks cold 24hr, hot 12hr. 750ml capacity. Wide-mouth lid, carry loop, powder-coated finish.',
  price: 1699, originalPrice: 1999, discountPercent: 15,
  categoryId: 'cat-7', categoryName: 'Sports',
  images: [
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'],

  rating: 4.6, reviewCount: 789, stock: 44, brand: 'Vector X',
  tags: ['bottle', 'water', 'insulated', 'sports'], isSale: true,
  specs: { Insulation: 'Triple-wall vacuum', Capacity: '750ml', Cold: '24 hours', Hot: '12 hours' }
},
{
  id: 'p-028', name: 'Niacinamide Toner 150ml', slug: 'niacinamide-toner',
  description: '10% niacinamide with zinc PCA. Minimizes pores, controls oil, reduces redness. pH-balanced formula. Use morning and evening.',
  price: 699, originalPrice: undefined,
  categoryId: 'cat-8', categoryName: 'Skincare',
  images: [
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80'],

  rating: 4.5, reviewCount: 891, stock: 73, brand: 'WOW Skin Science',
  tags: ['toner', 'niacinamide', 'skincare', 'pores'], isNew: true,
  specs: { Niacinamide: '10%', Zinc: 'PCA', Size: '150ml', Use: 'AM & PM' }
},
{
  id: 'p-029', name: 'Merino Running Socks (3-pack)', slug: 'merino-running-socks',
  description: 'Merino wool blend for natural temperature regulation and odour resistance. Reinforced heel and toe. Cushioned sole. Quarter-crew length.',
  price: 999, originalPrice: undefined,
  categoryId: 'cat-7', categoryName: 'Sports',
  images: [
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80'],

  rating: 4.4, reviewCount: 234, stock: 88, brand: 'SG',
  tags: ['socks', 'merino', 'running', 'sports'],
  specs: { Material: '60% merino, 35% nylon, 5% elastane', Pack: '3 pairs', Length: 'Quarter-crew', Sizes: 'S/M/L' }
},
{
  id: 'p-030', name: 'Linen Duvet Cover Set', slug: 'linen-duvet-cover-set',
  description: 'Pre-washed stonewashed French linen. Includes duvet cover and 2 pillowcases. Gets softer with every wash. Available in 6 earthy tones.',
  price: 5999, originalPrice: 7499, discountPercent: 20,
  categoryId: 'cat-5', categoryName: 'Home & Living',
  images: [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80'],

  rating: 4.8, reviewCount: 167, stock: 9, brand: 'Fabindia Home',
  tags: ['linen', 'bedding', 'duvet', 'home'], isBestSeller: true, isSale: true,
  specs: { Material: 'Stonewashed French linen', Set: 'Cover + 2 pillowcases', Sizes: 'Single/Double/King', Care: 'Machine wash cold' }
},
{
  id: 'p-031', name: 'Field Watch — 38mm', slug: 'field-watch-38mm',
  description: 'Swiss-made quartz movement. 38mm stainless case, mineral glass, 3ATM. Nylon strap with quick-release pins. Clean military-inspired dial.',
  price: 5499, originalPrice: undefined,
  categoryId: 'cat-6', categoryName: 'Watches',
  images: [
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],

  rating: 4.5, reviewCount: 98, stock: 14, brand: 'Fastrack',
  tags: ['watch', 'field', 'minimalist', 'swiss'], isNew: true,
  specs: { Movement: 'Swiss quartz', Case: '38mm stainless', Glass: 'Mineral', Strap: 'Nylon quick-release' }
},
{
  id: 'p-032', name: 'Insulated Lunch Bag', slug: 'insulated-lunch-bag',
  description: 'Keeps food at temperature for 6 hours. Wipe-clean interior, adjustable shoulder strap. Fits a 1L container plus snacks.',
  price: 1099, originalPrice: 1299, discountPercent: 15,
  categoryId: 'cat-4', categoryName: 'Bags',
  images: [
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80'],

  rating: 4.2, reviewCount: 178, stock: 36, brand: 'Baggit',
  tags: ['lunch', 'bag', 'insulated', 'work'], isSale: true,
  specs: { Insulation: '6 hours', Interior: 'Wipe-clean', Strap: 'Adjustable shoulder', Capacity: '1L + snacks' }
},
{
  id: 'p-033', name: 'Smart Doorbell Camera', slug: 'smart-doorbell-camera',
  description: '2K video with wide-angle lens. Motion detection, two-way audio, night vision. Works with Alexa and Google Home. Wired or battery-powered.',
  price: 6999, originalPrice: 8499, discountPercent: 18,
  categoryId: 'cat-3', categoryName: 'Electronics',
  images: [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80'],

  rating: 4.3, reviewCount: 267, stock: 6, brand: 'Portronics',
  tags: ['doorbell', 'camera', 'smart-home', 'security'], isSale: true,
  specs: { Video: '2K', Audio: 'Two-way', Night: 'Vision', Power: 'Wired or battery' }
},
{
  id: 'p-034', name: 'Relaxed Fit Hoodie', slug: 'relaxed-fit-hoodie',
  description: '380gsm French terry cotton. Garment-washed for softness. Kangaroo pocket, adjustable drawcord. The hoodie you\'ll reach for every time.',
  price: 2799, originalPrice: undefined,
  categoryId: 'cat-1', categoryName: 'Clothing',
  images: [
  'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
  'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800&q=80'],

  rating: 4.6, reviewCount: 423, stock: 33, brand: 'Biba',
  tags: ['hoodie', 'cotton', 'relaxed', 'casual'], isBestSeller: true,
  specs: { Fabric: '380gsm French terry', Wash: 'Garment-washed', Pocket: 'Kangaroo', Fit: 'Relaxed' }
},
{
  id: 'p-035', name: 'Leather Watch Strap 20mm', slug: 'leather-watch-strap-20mm',
  description: 'Vegetable-tanned calf leather strap. Quick-release spring bars. Standard 20mm lug width. Fits any watch with 20mm lug spacing.',
  price: 799, originalPrice: undefined,
  categoryId: 'cat-6', categoryName: 'Watches',
  images: [
  'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],

  rating: 4.6, reviewCount: 312, stock: 67, brand: 'Sonata',
  tags: ['strap', 'watch', 'leather', 'accessory'],
  specs: { Leather: 'Vegetable-tanned calf', Width: '20mm', Bars: 'Quick-release', Fit: 'Universal 20mm' }
},
{
  id: 'p-036', name: 'Bamboo Cutting Board', slug: 'bamboo-cutting-board',
  description: 'End-grain bamboo with juice grooves. Harder than most hardwoods, gentle on knife edges. Includes rubber feet for stability.',
  price: 1399, originalPrice: 1699, discountPercent: 18,
  categoryId: 'cat-5', categoryName: 'Home & Living',
  images: [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'],

  rating: 4.7, reviewCount: 189, stock: 28, brand: 'Nilkamal',
  tags: ['cutting-board', 'bamboo', 'kitchen', 'home'], isSale: true,
  specs: { Material: 'End-grain bamboo', Grooves: 'Juice grooves', Feet: 'Non-slip rubber', Size: '38 × 25 × 3 cm' }
},
{
  id: 'p-037', name: 'Trail Running Shoes', slug: 'trail-running-shoes',
  description: 'Aggressive lug outsole for grip on technical terrain. Protective toe cap, rock plate in midsole. Breathable mesh upper, quick-lace system.',
  price: 5499, originalPrice: 6499, discountPercent: 15,
  categoryId: 'cat-2', categoryName: 'Footwear',
  images: [
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],

  rating: 4.5, reviewCount: 178, stock: 15, brand: 'Campus',
  tags: ['trail', 'running', 'shoes', 'outdoor'], isSale: true,
  specs: { Outsole: 'Aggressive lug', Toe: 'Protective cap', Midsole: 'Rock plate', Lacing: 'Quick-lace' }
},
{
  id: 'p-038', name: 'Linen Button-Down Shirt', slug: 'linen-button-down-shirt',
  description: 'Portuguese linen in a relaxed fit. Point collar, chest pocket, curved hem. Breathable and wrinkle-friendly — the more you wear it, the better it looks.',
  price: 2199, originalPrice: undefined,
  categoryId: 'cat-1', categoryName: 'Clothing',
  images: [
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80'],

  rating: 4.5, reviewCount: 289, stock: 25, brand: 'Manyavar',
  tags: ['shirt', 'linen', 'button-down', 'summer'], isNew: false,
  specs: { Fabric: 'Portuguese linen', Fit: 'Relaxed', Collar: 'Point', Hem: 'Curved' }
},
{
  id: 'p-039', name: 'USB-C Hub 7-in-1', slug: 'usbc-hub-7in1',
  description: '7 ports: USB-C PD 100W, HDMI 4K, 3×USB-A 3.0, SD, microSD. Aluminium shell. Bus-powered, no drivers needed. Works with MacBook, iPad and PC.',
  price: 2499, originalPrice: 2999, discountPercent: 17,
  categoryId: 'cat-3', categoryName: 'Electronics',
  images: [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],

  rating: 4.3, reviewCount: 445, stock: 38, brand: 'Mivi',
  tags: ['hub', 'usbc', 'accessories', 'laptop', 'cable'], isSale: true,
  specs: { Ports: '7-in-1', HDMI: '4K', Power: 'PD 100W', Shell: 'Aluminium' }
},
{
  id: 'p-040', name: 'Retinol Night Cream 50ml', slug: 'retinol-night-cream',
  description: '0.3% encapsulated retinol with ceramides and peptides. Reduces fine lines over 4 weeks. Fragrance-free, suitable for sensitive skin when introduced gradually.',
  price: 1599, originalPrice: undefined,
  categoryId: 'cat-8', categoryName: 'Skincare',
  images: [
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
  'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80'],

  rating: 4.6, reviewCount: 234, stock: 31, brand: 'Plum',
  tags: ['retinol', 'night-cream', 'skincare', 'anti-aging'], isBestSeller: true,
  specs: { Retinol: '0.3% encapsulated', Ceramides: 'Yes', Size: '50ml', Use: 'PM only' }
},
{
  id: 'p-041', name: 'Popular Aluminium Pressure Cooker 5L', slug: 'prestige-pressure-cooker-5l',
  description: 'A kitchen staple built for everyday Indian cooking. Outer lid design with a precision-engineered safety valve, sturdy handles, and even heat distribution for perfectly cooked dals, rice and curries.',
  price: 1899, originalPrice: 2299, discountPercent: 17,
  categoryId: 'cat-9', categoryName: 'Kitchen & Dining',
  images: [
  'https://images.unsplash.com/photo-1580929753603-10519c6e480a?w=800&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
  rating: 4.6, reviewCount: 1842, stock: 62, brand: 'Prestige',
  tags: ['cookware', 'pressure-cooker', 'kitchen'], isBestSeller: true, isSale: true,
  specs: { Material: 'Aluminium', Capacity: '5L', Induction: 'No', Warranty: '2 Years' }
},
{
  id: 'p-042', name: 'Contura Hard Anodised Kadai 3L', slug: 'hawkins-hard-anodised-kadai',
  description: 'Hard-anodised for durability and even cooking, this kadai is built to handle daily tadka, deep-frying and simmering. Comes with a tight-fitting stainless steel lid.',
  price: 2299,
  categoryId: 'cat-9', categoryName: 'Kitchen & Dining',
  images: [
  'https://images.unsplash.com/photo-1580929753603-10519c6e480a?w=800&q=80',
  'https://images.unsplash.com/photo-1556911220-dabc1f02913a?w=800&q=80'],
  rating: 4.7, reviewCount: 934, stock: 41, brand: 'Hawkins',
  tags: ['cookware', 'kadai', 'kitchen', 'induction'], isNew: true,
  specs: { Material: 'Hard-anodised Aluminium', Capacity: '3L', Induction: 'Yes', Warranty: '5 Years' }
},
{
  id: 'p-043', name: 'Thermosteel Flip Lid Flask 1L', slug: 'milton-thermosteel-flask-1l',
  description: 'Double-wall vacuum insulation keeps beverages hot for 12 hours and cold for 16. Leak-proof flip lid and a rust-free stainless steel body built for daily commutes.',
  price: 799, originalPrice: 999, discountPercent: 20,
  categoryId: 'cat-9', categoryName: 'Kitchen & Dining',
  images: [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&q=80'],
  rating: 4.5, reviewCount: 2103, stock: 88, brand: 'Milton',
  tags: ['flask', 'water-bottle', 'insulated'], isBestSeller: true,
  specs: { Material: 'Stainless Steel', Capacity: '1L', Insulation: '12 hrs hot / 16 hrs cold' }
},
{
  id: 'p-044', name: 'Mixer Grinder 750W with 3 Jars', slug: 'borosil-mixer-grinder-750w',
  description: 'A powerful 750W motor with three stainless-steel jars for grinding, chutney and juicing. Overload protection and a 2-year warranty on the motor.',
  price: 3499, originalPrice: 4199, discountPercent: 17,
  categoryId: 'cat-9', categoryName: 'Kitchen & Dining',
  images: [
  'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=800&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
  rating: 4.4, reviewCount: 567, stock: 24, brand: 'Borosil',
  tags: ['mixer-grinder', 'kitchen-appliance'], isNew: true,
  specs: { Power: '750W', Jars: '3', Warranty: '2 Years motor' }
},
{
  id: 'p-045', name: 'Opalware Dinner Set, 18 Pieces', slug: 'cello-opalware-dinner-set-18pc',
  description: 'Chip-resistant opalware dinnerware in a clean, modern design. Microwave and dishwasher safe, with plates, bowls and serving dishes for a family of six.',
  price: 2999, originalPrice: 3699, discountPercent: 19,
  categoryId: 'cat-9', categoryName: 'Kitchen & Dining',
  images: [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
  'https://images.unsplash.com/photo-1580929753603-10519c6e480a?w=800&q=80'],
  rating: 4.6, reviewCount: 389, stock: 19, brand: 'Cello',
  tags: ['dinner-set', 'dinnerware', 'dishwasher-safe'], isSale: true,
  specs: { Material: 'Opalware', Pieces: '18', 'Dishwasher Safe': 'Yes', 'Microwave Safe': 'Yes' }
},
{
  id: 'p-046', name: '1.5 Ton 5 Star Split AC', slug: 'voltas-1-5-ton-split-ac',
  description: 'Copper condenser split AC with 5-star energy rating, fast cooling mode and dust filtration. Built for Indian summers with stable performance up to 52 degrees C.',
  price: 34999, originalPrice: 41999, discountPercent: 17,
  categoryId: 'cat-10', categoryName: 'Home Appliances',
  images: [
  'https://images.unsplash.com/photo-1610678751896-8aed7ac465e5?w=800&q=80',
  'https://images.unsplash.com/photo-1558317374-24793bc9f2fb?w=800&q=80'],
  rating: 4.5, reviewCount: 782, stock: 9, brand: 'Voltas',
  tags: ['air-conditioner', 'appliance', 'cooling'], isBestSeller: true, isSale: true,
  specs: { Capacity: '1.5 Ton', 'Energy Rating': '5 Star', Condenser: 'Copper', Installation: 'Free Installation' }
},
{
  id: 'p-047', name: 'Front Load Washing Machine 7kg', slug: 'havells-front-load-washer-7kg',
  description: 'Fully automatic front-load washer with 14 wash programs, an in-built heater, and a quick-wash cycle. Gentle on fabric with a high spin speed for faster drying.',
  price: 24999, originalPrice: 28999, discountPercent: 14,
  categoryId: 'cat-10', categoryName: 'Home Appliances',
  images: [
  'https://images.unsplash.com/photo-1610678751896-8aed7ac465e5?w=800&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
  rating: 4.4, reviewCount: 445, stock: 7, brand: 'Havells',
  tags: ['washing-machine', 'appliance', 'front-load'], isNew: true,
  specs: { Capacity: '7kg', 'Energy Rating': '4 Star', Programs: '14', Installation: 'Free Installation' }
},
{
  id: 'p-048', name: 'Majesty Oil Filled Room Heater', slug: 'bajaj-majesty-room-heater',
  description: 'Silent, dust-free heating for winter nights. Adjustable thermostat, tip-over safety switch, and castor wheels for easy movement between rooms.',
  price: 4499, originalPrice: 5299, discountPercent: 15,
  categoryId: 'cat-10', categoryName: 'Home Appliances',
  images: [
  'https://images.unsplash.com/photo-1547186577-a3f4fa07c2ef?w=800&q=80',
  'https://images.unsplash.com/photo-1599028274511-e02a767949a3?w=800&q=80'],
  rating: 4.3, reviewCount: 298, stock: 33, brand: 'Bajaj',
  tags: ['room-heater', 'appliance', 'winter'],
  specs: { Type: 'Oil Filled', Fins: '11', Safety: 'Tip-over switch' }
},
{
  id: 'p-049', name: 'Robot Vacuum Cleaner with Mopping', slug: 'crompton-robot-vacuum-cleaner',
  description: 'Smart navigation maps your home for efficient cleaning, with a 2-in-1 vacuum and mop function. Controlled from your phone or by voice via a companion app.',
  price: 12999, originalPrice: 15999, discountPercent: 19,
  categoryId: 'cat-10', categoryName: 'Home Appliances',
  images: [
  'https://images.unsplash.com/photo-1558317374-24793bc9f2fb?w=800&q=80',
  'https://images.unsplash.com/photo-1610678751896-8aed7ac465e5?w=800&q=80'],
  rating: 4.2, reviewCount: 156, stock: 14, brand: 'Crompton',
  tags: ['vacuum-cleaner', 'appliance', 'smart-home', 'wireless'], isNew: true,
  specs: { Type: 'Robot Vacuum', 'Smart Features': 'App Control', Battery: '150 mins runtime' }
},
{
  id: 'p-050', name: 'Digital Storage Water Heater 15L', slug: 'v-guard-water-heater-15l',
  description: 'Glass-lined tank for corrosion resistance, a digital temperature display, and multi-layer safety protection for reliable hot water through the year.',
  price: 6499, originalPrice: 7499, discountPercent: 13,
  categoryId: 'cat-10', categoryName: 'Home Appliances',
  images: [
  'https://images.unsplash.com/photo-1610678751896-8aed7ac465e5?w=800&q=80',
  'https://images.unsplash.com/photo-1558317374-24793bc9f2fb?w=800&q=80'],
  rating: 4.5, reviewCount: 512, stock: 27, brand: 'V-Guard',
  tags: ['water-heater', 'geyser', 'appliance'],
  specs: { Capacity: '15L', 'Energy Rating': '4 Star', Tank: 'Glass-lined' }
},
{
  id: 'p-051', name: 'Wooden Building Blocks Set, 80 Pieces', slug: 'funskool-wooden-blocks-80pc',
  description: 'Smooth, splinter-free wooden blocks in varied shapes and colours that encourage open-ended play, spatial reasoning and fine motor skills.',
  price: 899, originalPrice: 1099, discountPercent: 18,
  categoryId: 'cat-11', categoryName: 'Toys & Baby',
  images: [
  'https://images.unsplash.com/photo-1575364289437-fb1479d52732?w=800&q=80',
  'https://images.unsplash.com/photo-1631106256072-54c89defe828?w=800&q=80'],
  rating: 4.7, reviewCount: 623, stock: 54, brand: 'Funskool',
  tags: ['building-blocks', 'educational', 'wooden-toy'], isBestSeller: true, isSale: true,
  specs: { Material: 'Wood', Pieces: '80', 'Age Group': '3-5 Years' }
},
{
  id: 'p-052', name: 'Sail 3-Wheel Baby Stroller', slug: 'luvlap-sail-stroller',
  description: 'Lightweight, foldable stroller with a reversible handle, adjustable canopy and reclining seat for newborns through toddlers. Front wheels swivel for tight turns.',
  price: 5999, originalPrice: 7499, discountPercent: 20,
  categoryId: 'cat-11', categoryName: 'Toys & Baby',
  images: [
  'https://images.unsplash.com/photo-1578146418694-f75236d251ba?w=800&q=80'],
  rating: 4.4, reviewCount: 287, stock: 16, brand: 'LuvLap',
  tags: ['stroller', 'baby-gear'], isNew: true,
  specs: { Type: '3-Wheel', Foldable: 'Yes', 'Age Group': '0-3 Months to 3 Years' }
},
{
  id: 'p-053', name: 'Alphabet Learning Blocks', slug: 'meemee-alphabet-blocks',
  description: 'Colourful ABC blocks that turn early literacy into play. Rounded, baby-safe edges and non-toxic paint make these ideal for little hands.',
  price: 499, originalPrice: 649, discountPercent: 23,
  categoryId: 'cat-11', categoryName: 'Toys & Baby',
  images: [
  'https://images.unsplash.com/photo-1558907353-ceb54f3882ed?w=800&q=80',
  'https://images.unsplash.com/photo-1575364289437-fb1479d52732?w=800&q=80'],
  rating: 4.6, reviewCount: 445, stock: 71, brand: 'Mee Mee',
  tags: ['alphabet-blocks', 'educational', 'learning'], isSale: true,
  specs: { Material: 'Plastic', 'Age Group': '1-2 Years', Educational: 'Yes' }
},
{
  id: 'p-054', name: 'Multi-Activity Table for Toddlers', slug: 'okplay-activity-table',
  description: 'A sturdy, rounded-edge activity table with built-in puzzles, gears and a chalkboard surface, keeps toddlers engaged while building hand-eye coordination.',
  price: 2499, originalPrice: 2999, discountPercent: 17,
  categoryId: 'cat-11', categoryName: 'Toys & Baby',
  images: [
  'https://images.unsplash.com/photo-1631106256072-54c89defe828?w=800&q=80',
  'https://images.unsplash.com/photo-1558907353-ceb54f3882ed?w=800&q=80'],
  rating: 4.3, reviewCount: 198, stock: 22, brand: 'Ok Play',
  tags: ['activity-table', 'toddler', 'educational'],
  specs: { Material: 'Plastic', 'Age Group': '1-2 Years' }
},
{
  id: 'p-055', name: 'Construction Blocks Set, 120 Pieces', slug: 'funskool-construction-set-120pc',
  description: 'A brick-compatible construction set that snaps together for endless building. Comes in a reusable storage tub for easy cleanup.',
  price: 1299, originalPrice: 1599, discountPercent: 19,
  categoryId: 'cat-11', categoryName: 'Toys & Baby',
  images: [
  'https://images.unsplash.com/photo-1631106256072-54c89defe828?w=800&q=80',
  'https://images.unsplash.com/photo-1575364289437-fb1479d52732?w=800&q=80'],
  rating: 4.5, reviewCount: 356, stock: 48, brand: 'Funskool',
  tags: ['building-blocks', 'construction-set', 'educational'], isBestSeller: true,
  specs: { Material: 'Plastic', Pieces: '120', 'Age Group': '3-5 Years' }
},
{
  id: 'p-056', name: 'Zeb-Alex Wireless Mouse', slug: 'zebronics-zeb-alex-wireless-mouse',
  description: 'A plug-and-play 2.4GHz wireless mouse with a 1600 DPI optical sensor, ambidextrous design and up to 12 months of battery life on a single AA cell.',
  price: 599, originalPrice: 799, discountPercent: 25,
  categoryId: 'cat-12', categoryName: 'Computers & Accessories',
  images: [
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'],
  rating: 4.4, reviewCount: 1289, stock: 96, brand: 'Zebronics',
  tags: ['mouse', 'wireless', 'computer-accessory'], isBestSeller: true, isSale: true,
  specs: { Connectivity: 'Wireless 2.4GHz', DPI: '1600', Battery: 'Up to 12 months' }
},
{
  id: 'p-057', name: 'Wireless Keyboard & Mouse Combo', slug: 'portronics-keyboard-mouse-combo',
  description: 'A slim, spill-resistant wireless keyboard paired with a matching mouse. Single USB receiver for both, with a numeric keypad for faster data entry.',
  price: 1299, originalPrice: 1599, discountPercent: 19,
  categoryId: 'cat-12', categoryName: 'Computers & Accessories',
  images: [
  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
  rating: 4.3, reviewCount: 534, stock: 43, brand: 'Portronics',
  tags: ['keyboard', 'mouse', 'wireless', 'combo'], isNew: true,
  specs: { Connectivity: 'Wireless 2.4GHz', Layout: 'Full-size with numpad' }
},
{
  id: 'p-058', name: 'Gaming Mouse Pad XL', slug: 'ant-esports-mousepad-xl',
  description: 'An extended desk mat with a smooth micro-woven surface for precise tracking, stitched edges to prevent fraying, and a non-slip rubber base.',
  price: 799, originalPrice: 999, discountPercent: 20,
  categoryId: 'cat-12', categoryName: 'Computers & Accessories',
  images: [
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
  'https://images.unsplash.com/photo-1631106256072-54c89defe828?w=800&q=80'],
  rating: 4.6, reviewCount: 267, stock: 58, brand: 'Ant Esports',
  tags: ['mouse-pad', 'gaming', 'computer-accessory'], isSale: true,
  specs: { Size: 'XL (900x400mm)', Surface: 'Micro-woven', Base: 'Rubber' }
},
{
  id: 'p-059', name: 'Adjustable Laptop Cooling Pad', slug: 'iball-laptop-cooling-pad',
  description: 'Dual quiet fans keep laptops cool during long work sessions, with a 5-level height adjustment and a built-in USB hub for peripherals.',
  price: 1099, originalPrice: 1399, discountPercent: 21,
  categoryId: 'cat-12', categoryName: 'Computers & Accessories',
  images: [
  'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
  'https://images.unsplash.com/photo-1558907353-ceb54f3882ed?w=800&q=80'],
  rating: 4.2, reviewCount: 178, stock: 31, brand: 'iBall',
  tags: ['laptop-accessory', 'cooling-pad'],
  specs: { Fans: '2', 'Height Levels': '5', 'USB Ports': '2' }
},
{
  id: 'p-060', name: 'USB-C to HDMI Adapter', slug: 'lapcare-usbc-hdmi-adapter',
  description: 'Mirror or extend your laptop display to a monitor or TV in true 4K resolution. Compact, plug-and-play design with no drivers required.',
  price: 699, originalPrice: 899, discountPercent: 22,
  categoryId: 'cat-12', categoryName: 'Computers & Accessories',
  images: [
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
  'https://images.unsplash.com/photo-1558907353-ceb54f3882ed?w=800&q=80'],
  rating: 4.4, reviewCount: 389, stock: 67, brand: 'Lapcare',
  tags: ['adapter', 'usb-c', 'hdmi', 'computer-accessory'], isNew: true,
  specs: { Output: '4K @ 30Hz', Connector: 'USB-C to HDMI', 'Cable Required': 'No' }
}
];

export const PRODUCTS: Product[] = enrichProducts(RAW_PRODUCTS);


export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return PRODUCTS.filter((p) => p.categoryId === categoryId);
}

export function getFeaturedCategories(): Category[] {
  return CATEGORIES.filter((c) => c.featured);
}

export function getTrendingProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isBestSeller || p.rating >= 4.6).slice(0, 8);
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.isNew).slice(0, 6);
}

export function getSaleProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isSale);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter((p) =>
  p.name.toLowerCase().includes(q) ||
  p.description.toLowerCase().includes(q) ||
  p.categoryName.toLowerCase().includes(q) ||
  p.brand.toLowerCase().includes(q) ||
  p.tags.some((t) => t.includes(q))
  );
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.
  filter((p) => p.id !== product.id && p.categoryId === product.categoryId).
  slice(0, limit);
}

export const ALL_BRANDS = [...new Set(PRODUCTS.map((p) => p.brand))].sort();
export const PRICE_MIN = Math.min(...PRODUCTS.map((p) => p.price));
export const PRICE_MAX = Math.max(...PRODUCTS.map((p) => p.price));
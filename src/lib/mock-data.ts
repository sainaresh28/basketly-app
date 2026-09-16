import type { Product, Category } from '@/types';

export const CATEGORIES: Category[] = [
{ id: 'cat-1', name: 'Clothing', slug: 'clothing', description: 'Everyday essentials and statement pieces', image: "https://img.rocket.new/generatedImages/rocket_gen_img_179a18c83-1786204898560.png", productCount: 18, featured: true },
{ id: 'cat-2', name: 'Footwear', slug: 'footwear', description: 'Sneakers, boots and everything in between', image: "https://images.unsplash.com/photo-1595182170669-9a29f5e851d0", productCount: 12, featured: true },
{ id: 'cat-3', name: 'Electronics', slug: 'electronics', description: 'Audio, wearables and smart accessories', image: "https://images.unsplash.com/photo-1624333676556-76826481d45e", productCount: 14, featured: true },
{ id: 'cat-4', name: 'Bags', slug: 'bags', description: 'Backpacks, totes and everyday carry', image: "https://img.rocket.new/generatedImages/rocket_gen_img_4b02f7e84-1789212270431.png", productCount: 9, featured: true },
{ id: 'cat-5', name: 'Home & Living', slug: 'home-living', description: 'Objects that make home feel like home', image: "https://img.rocket.new/generatedImages/rocket_gen_img_15b9d2637-1770258131973.png", productCount: 11, featured: true },
{ id: 'cat-6', name: 'Watches', slug: 'watches', description: 'Timepieces for every occasion', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dfb1d20c-1786278109737.png", productCount: 7, featured: true },
{ id: 'cat-7', name: 'Sports', slug: 'sports', description: 'Gear for the active lifestyle', image: "https://img.rocket.new/generatedImages/rocket_gen_img_48673c164-1789212269247.png", productCount: 10 },
{ id: 'cat-8', name: 'Skincare', slug: 'skincare', description: 'Clean, effective skincare essentials', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c1909de7-1772073981313.png", productCount: 8 }];


export const PRODUCTS: Product[] = [
{
  id: 'p-001', name: 'Minimal Leather Backpack', slug: 'minimal-leather-backpack',
  description: 'Crafted from full-grain vegetable-tanned leather, this backpack develops a rich patina over time. Padded laptop sleeve fits up to 15", two internal compartments, and a hidden back pocket for security.',
  price: 4999, originalPrice: 6499, discountPercent: 23,
  categoryId: 'cat-4', categoryName: 'Bags',
  images: [
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80'],

  rating: 4.7, reviewCount: 234, stock: 14, brand: 'Artisan Co.',
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

  rating: 4.5, reviewCount: 412, stock: 28, brand: 'Stride Labs',
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

  rating: 4.8, reviewCount: 891, stock: 7, brand: 'SoundWave',
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

  rating: 4.6, reviewCount: 178, stock: 5, brand: 'Meridian',
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

  rating: 4.3, reviewCount: 567, stock: 42, brand: 'Thread & Grain',
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

  rating: 4.4, reviewCount: 312, stock: 33, brand: 'Wander & Co.',
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

  rating: 4.9, reviewCount: 89, stock: 3, brand: 'Atelier Home',
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

  rating: 4.6, reviewCount: 203, stock: 19, brand: 'Artisan Co.',
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

  rating: 4.4, reviewCount: 678, stock: 21, brand: 'SoundWave',
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

  rating: 4.2, reviewCount: 345, stock: 38, brand: 'Thread & Grain',
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

  rating: 4.7, reviewCount: 156, stock: 8, brand: 'Cobbler Collective',
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

  rating: 4.8, reviewCount: 289, stock: 16, brand: 'Thread & Grain',
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

  rating: 4.5, reviewCount: 523, stock: 12, brand: 'PulseKit',
  tags: ['fitness', 'tracker', 'wearable', 'health'], isSale: true,
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

  rating: 4.3, reviewCount: 198, stock: 29, brand: 'Thread & Grain',
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

  rating: 4.6, reviewCount: 445, stock: 18, brand: 'SoundWave',
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

  rating: 4.4, reviewCount: 267, stock: 55, brand: 'Wander & Co.',
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

  rating: 4.9, reviewCount: 134, stock: 22, brand: 'Atelier Home',
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

  rating: 4.7, reviewCount: 389, stock: 44, brand: 'Artisan Co.',
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

  rating: 4.6, reviewCount: 223, stock: 31, brand: 'ActiveEdge',
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

  rating: 4.5, reviewCount: 677, stock: 48, brand: 'Glow Lab',
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

  rating: 4.4, reviewCount: 167, stock: 11, brand: 'Thread & Grain',
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

  rating: 4.3, reviewCount: 298, stock: 67, brand: 'ActiveEdge',
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

  rating: 4.8, reviewCount: 92, stock: 17, brand: 'Atelier Home',
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

  rating: 4.5, reviewCount: 445, stock: 82, brand: 'Artisan Co.',
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

  rating: 4.4, reviewCount: 312, stock: 56, brand: 'Glow Lab',
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

  rating: 4.7, reviewCount: 534, stock: 23, brand: 'Cobbler Collective',
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

  rating: 4.6, reviewCount: 789, stock: 44, brand: 'ActiveEdge',
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

  rating: 4.5, reviewCount: 891, stock: 73, brand: 'Glow Lab',
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

  rating: 4.4, reviewCount: 234, stock: 88, brand: 'ActiveEdge',
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

  rating: 4.8, reviewCount: 167, stock: 9, brand: 'Atelier Home',
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

  rating: 4.5, reviewCount: 98, stock: 14, brand: 'Meridian',
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

  rating: 4.2, reviewCount: 178, stock: 36, brand: 'Wander & Co.',
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

  rating: 4.3, reviewCount: 267, stock: 6, brand: 'PulseKit',
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

  rating: 4.6, reviewCount: 423, stock: 33, brand: 'Thread & Grain',
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

  rating: 4.6, reviewCount: 312, stock: 67, brand: 'Meridian',
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

  rating: 4.7, reviewCount: 189, stock: 28, brand: 'Atelier Home',
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

  rating: 4.5, reviewCount: 178, stock: 15, brand: 'Stride Labs',
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

  rating: 4.5, reviewCount: 289, stock: 25, brand: 'Thread & Grain',
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

  rating: 4.3, reviewCount: 445, stock: 38, brand: 'PulseKit',
  tags: ['hub', 'usbc', 'accessories', 'laptop'], isSale: true,
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

  rating: 4.6, reviewCount: 234, stock: 31, brand: 'Glow Lab',
  tags: ['retinol', 'night-cream', 'skincare', 'anti-aging'], isBestSeller: true,
  specs: { Retinol: '0.3% encapsulated', Ceramides: 'Yes', Size: '50ml', Use: 'PM only' }
}];


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
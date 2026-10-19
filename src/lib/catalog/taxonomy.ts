import type { AttributeDefinition, Category } from '@/types';
import { UNIVERSAL_COLOR_NAMES, UNIVERSAL_SIZES, UNIVERSAL_MATERIALS } from './universal-options';
import { slugify } from '../../utils/format';

interface SubcategorySeed {
  slug: string;
  name: string;
  /** The specific product lines within this subcategory — e.g. "T-Shirts", "Jeans" — the taxonomy's 3rd level. */
  types: string[];
}

interface TopCategorySeed {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
  productCount: number;
  attributeSchema: AttributeDefinition[];
  subcategories: SubcategorySeed[];
}

// Attribute schemas below are a representative subset of the full spec per
// category (the spec lists 15-20 possible filters for some categories) —
// enough to drive real dynamic, category-specific filtering without a
// wall of rarely-used options for a catalog this size. Universal filters
// (Price, Brand, Rating, Discount, Availability) are handled separately in
// the products UI and layered on top of whatever a category defines here.
export const CATEGORY_TAXONOMY: TopCategorySeed[] = [
  {
    id: 'cat-1',
    slug: 'fashion-apparel',
    name: 'Fashion & Apparel',
    description: 'Everyday essentials and statement pieces',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_179a18c83-1786204898560.png',
    featured: true,
    productCount: 18,
    attributeSchema: [
      { key: 'gender', label: 'Gender', type: 'select', filterable: true, options: ['Men', 'Women', 'Boys', 'Girls', 'Unisex'] },
      { key: 'size', label: 'Size', type: 'multiselect', filterable: true, options: UNIVERSAL_SIZES.slice(0, 7) },
      { key: 'color', label: 'Color', type: 'color-swatch', filterable: true, options: UNIVERSAL_COLOR_NAMES.slice(0, 12) },
      { key: 'material', label: 'Material', type: 'select', filterable: true, options: ['Cotton', 'Linen', 'Denim', 'Polyester', 'Wool', 'Silk', 'Viscose', 'Rayon'] },
      { key: 'fit', label: 'Fit', type: 'select', filterable: true, options: ['Slim', 'Regular', 'Relaxed', 'Oversized', 'Straight', 'Bootcut'] },
      { key: 'pattern', label: 'Pattern', type: 'select', filterable: true, options: ['Solid', 'Printed', 'Striped', 'Checked', 'Floral', 'Graphic'] },
      { key: 'sleeve', label: 'Sleeve', type: 'radio', filterable: true, options: ['Sleeveless', 'Half Sleeve', 'Full Sleeve', '3/4 Sleeve'] },
      { key: 'neck', label: 'Neck', type: 'select', filterable: true, options: ['Round Neck', 'V-Neck', 'Collar', 'Mandarin Collar', 'Boat Neck'] },
      { key: 'occasion', label: 'Occasion', type: 'select', filterable: true, options: ['Casual', 'Formal', 'Party', 'Festival', 'Wedding'] },
      { key: 'season', label: 'Season', type: 'select', filterable: true, options: ['Summer', 'Winter', 'Spring', 'Monsoon', 'All Season'] },
    ],
    subcategories: [
      { slug: 'mens-tshirts', name: "Men's T-Shirts", types: ['Basic T-Shirt', 'Graphic T-Shirt', 'Polo T-Shirt', 'Oversized T-Shirt', 'Henley T-Shirt'] },
      { slug: 'mens-shirts', name: "Men's Shirts", types: ['Formal Shirt', 'Casual Shirt', 'Oxford Shirt', 'Denim Shirt', 'Checked Shirt'] },
      { slug: 'mens-jeans', name: "Men's Jeans", types: ['Skinny Jeans', 'Slim Fit Jeans', 'Straight Fit Jeans', 'Bootcut Jeans', 'Cargo Jeans'] },
      { slug: 'mens-hoodies', name: "Men's Hoodies & Sweatshirts", types: ['Pullover Hoodie', 'Zip Hoodie', 'Crewneck Sweatshirt', 'Graphic Hoodie'] },
      { slug: 'womens-tops', name: "Women's Tops", types: ['Basic Top', 'Crop Top', 'Tank Top', 'Wrap Top', 'Tunic Top'] },
      { slug: 'womens-dresses', name: "Women's Dresses", types: ['Mini Dress', 'Midi Dress', 'Maxi Dress', 'A-Line Dress', 'Bodycon Dress'] },
      { slug: 'womens-ethnic', name: "Women's Ethnic Wear", types: ['Saree', 'Kurti', 'Anarkali Suit', 'Lehenga Set', 'Salwar Suit'] },
      { slug: 'kids-clothing', name: "Kids' Clothing", types: ['Kids T-Shirt', 'Kids Dress', 'Kids Jeans', 'School Uniform'] },
    ],
  },
  {
    id: 'cat-2',
    slug: 'footwear',
    name: 'Footwear',
    description: 'Sneakers, boots and everything in between',
    image: 'https://images.unsplash.com/photo-1595182170669-9a29f5e851d0',
    featured: true,
    productCount: 12,
    attributeSchema: [
      { key: 'gender', label: 'Gender', type: 'select', filterable: true, options: ['Men', 'Women', 'Kids', 'Unisex'] },
      { key: 'size', label: 'Size (UK)', type: 'multiselect', filterable: true, options: ['6', '7', '8', '9', '10', '11'] },
      { key: 'color', label: 'Color', type: 'color-swatch', filterable: true, options: ['Black', 'White', 'Brown', 'Grey', 'Navy', 'Red', 'Beige'] },
      { key: 'material', label: 'Material', type: 'select', filterable: true, options: ['Leather', 'Canvas', 'Mesh', 'Synthetic', 'Suede'] },
      { key: 'closure', label: 'Closure', type: 'select', filterable: true, options: ['Lace-Up', 'Slip-On', 'Velcro', 'Buckle'] },
      { key: 'shoeType', label: 'Shoe Type', type: 'select', filterable: true, options: ['Sneakers', 'Running', 'Formal', 'Boots', 'Sandals'] },
      { key: 'width', label: 'Width', type: 'select', filterable: true, options: ['Narrow', 'Regular', 'Wide', 'Extra Wide'] },
      { key: 'cushioning', label: 'Cushioning', type: 'select', filterable: true, options: ['Firm', 'Balanced', 'Extra Cushioned'] },
    ],
    subcategories: [
      { slug: 'sneakers', name: 'Sneakers', types: ['Low Top Sneakers', 'High Top Sneakers', 'Chunky Sneakers', 'Canvas Sneakers'] },
      { slug: 'running-shoes', name: 'Running Shoes', types: ['Running Shoes', 'Training Shoes', 'Walking Shoes'] },
      { slug: 'formal-shoes', name: 'Formal Shoes', types: ['Oxford Shoes', 'Derby Shoes', 'Brogues', 'Loafers'] },
      { slug: 'boots', name: 'Boots', types: ['Ankle Boots', 'Chelsea Boots', 'Knee-High Boots', 'Combat Boots'] },
      { slug: 'sandals', name: 'Sandals & Flip-Flops', types: ['Flat Sandals', 'Platform Sandals', 'Slides', 'Flip-Flops'] },
      { slug: 'loafers', name: 'Loafers', types: ['Oxford Shoes', 'Derby Shoes', 'Brogues', 'Loafers'] },
    ],
  },
  {
    id: 'cat-3',
    slug: 'electronics',
    name: 'Electronics',
    description: 'Audio, wearables and smart accessories',
    image: 'https://images.unsplash.com/photo-1624333676556-76826481d45e',
    featured: true,
    productCount: 14,
    attributeSchema: [
      { key: 'connectivity', label: 'Connectivity', type: 'multiselect', filterable: true, options: ['Bluetooth', 'Wi-Fi', 'USB-C', 'NFC'] },
      { key: 'batteryLife', label: 'Battery Life', type: 'select', filterable: true, options: ['Up to 6 hrs', '6-24 hrs', '24+ hrs'] },
      { key: 'waterproof', label: 'Water Resistant', type: 'boolean', filterable: true },
      { key: 'anc', label: 'Noise Cancellation', type: 'boolean', filterable: true },
      { key: 'microphone', label: 'Built-in Microphone', type: 'boolean', filterable: true },
      { key: 'color', label: 'Color', type: 'color-swatch', filterable: true, options: ['Black', 'White', 'Silver', 'Blue'] },
      { key: 'warranty', label: 'Warranty', type: 'select', filterable: true, options: ['6 Months', '1 Year', '2 Years'] },
    ],
    subcategories: [
      { slug: 'headphones', name: 'Headphones', types: ['Wireless Headphones', 'Over-Ear Headphones', 'Noise Cancelling Headphones', 'Gaming Headset'] },
      { slug: 'earbuds', name: 'Earbuds & Earphones', types: ['TWS Earbuds', 'ANC Earbuds', 'Sports Earbuds'] },
      { slug: 'speakers', name: 'Bluetooth Speakers', types: ['Bluetooth Speaker', 'Portable Speaker', 'Party Speaker', 'Soundbar'] },
      { slug: 'smartwatches', name: 'Smartwatches', types: ['Fitness Smartwatch', 'GPS Smartwatch', 'Calling Smartwatch'] },
      { slug: 'chargers-cables', name: 'Chargers & Cables', types: ['Wall Charger', 'Fast Charger', 'USB-C Cable', 'Charging Cable'] },
      { slug: 'power-banks', name: 'Power Banks', types: ['Slim Power Bank', 'High Capacity Power Bank', 'Fast Charging Power Bank'] },
      { slug: 'smart-home-security', name: 'Smart Home & Security', types: ['Smart Doorbell', 'Security Camera', 'Smart Plug'] },
    ],
  },
  {
    id: 'cat-4',
    slug: 'bags-accessories',
    name: 'Bags & Accessories',
    description: 'Backpacks, totes and everyday carry',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_4b02f7e84-1789212270431.png',
    featured: true,
    productCount: 9,
    attributeSchema: [
      { key: 'material', label: 'Material', type: 'select', filterable: true, options: ['Leather', 'PU Leather', 'Canvas', 'Nylon', 'Polyester'] },
      { key: 'color', label: 'Color', type: 'color-swatch', filterable: true, options: ['Black', 'Brown', 'Tan', 'Navy', 'Grey'] },
      { key: 'capacity', label: 'Capacity', type: 'select', filterable: true, options: ['Under 10L', '10-20L', '20-30L', '30L+'] },
      { key: 'laptopCompatible', label: 'Laptop Compatible', type: 'boolean', filterable: true },
      { key: 'occasion', label: 'Occasion', type: 'select', filterable: true, options: ['Casual', 'Office', 'Travel', 'School'] },
    ],
    subcategories: [
      { slug: 'backpacks', name: 'Backpacks', types: ['School Backpack', 'Laptop Backpack', 'Travel Backpack', 'Anti-Theft Backpack'] },
      { slug: 'laptop-bags', name: 'Laptop Bags', types: ['Basic Top', 'Crop Top', 'Tank Top', 'Wrap Top', 'Tunic Top'] },
      { slug: 'crossbody-bags', name: 'Crossbody & Sling Bags', types: ['Sling Bag', 'Crossbody Bag', 'Messenger Bag'] },
      { slug: 'travel-bags', name: 'Travel & Duffel Bags', types: ['Duffel Bag', 'Weekender Bag', 'Travel Backpack', 'Cabin Bag'] },
      { slug: 'wallets', name: 'Wallets & Card Holders', types: ['Bi-Fold Wallet', 'Tri-Fold Wallet', 'Card Holder', 'Zip Wallet'] },
      { slug: 'organizers', name: 'Travel Organizers', types: ['Packing Cubes', 'Toiletry Organizer', 'Cable Organizer'] },
    ],
  },
  {
    id: 'cat-5',
    slug: 'home-furniture',
    name: 'Home & Furniture',
    description: 'Objects that make home feel like home',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_15b9d2637-1770258131973.png',
    featured: true,
    productCount: 11,
    attributeSchema: [
      { key: 'material', label: 'Material', type: 'select', filterable: true, options: ['Solid Wood', 'Engineered Wood', 'Metal', 'Glass', 'Ceramic', 'Bamboo'] },
      { key: 'style', label: 'Style', type: 'select', filterable: true, options: ['Modern', 'Minimalist', 'Traditional', 'Industrial', 'Scandinavian'] },
      { key: 'room', label: 'Room', type: 'select', filterable: true, options: ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Balcony'] },
      { key: 'color', label: 'Color', type: 'color-swatch', filterable: true, options: ['Natural', 'Black', 'White', 'Brown'] },
    ],
    subcategories: [
      { slug: 'home-decor', name: 'Home Decor', types: ['Wall Art', 'Wall Clock', 'Vase', 'Showpiece', 'Photo Frame'] },
      { slug: 'lighting', name: 'Lighting & Lamps', types: ['Table Lamp', 'Floor Lamp', 'String Lights', 'Ceiling Light'] },
      { slug: 'storage-organizers', name: 'Storage & Organizers', types: ['Packing Cubes', 'Toiletry Organizer', 'Cable Organizer'] },
      { slug: 'kitchen-tools', name: 'Kitchen Tools', types: ['Chef Knife', 'Chopping Board', 'Peeler', 'Whisk', 'Measuring Cups'] },
      { slug: 'living-room-furniture', name: 'Living Room Furniture', types: ['Sofa', 'Coffee Table', 'TV Unit', 'Accent Chair'] },
      { slug: 'bedroom-furniture', name: 'Bedroom Furniture', types: ['Bed', 'Wardrobe', 'Bedside Table', 'Dresser'] },
    ],
  },
  {
    id: 'cat-6',
    slug: 'jewelry-watches',
    name: 'Jewelry & Watches',
    description: 'Timepieces and fine details for every occasion',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1dfb1d20c-1786278109737.png',
    featured: true,
    productCount: 7,
    attributeSchema: [
      { key: 'gender', label: 'Gender', type: 'select', filterable: true, options: ['Men', 'Women', 'Unisex'] },
      { key: 'strapMaterial', label: 'Strap Material', type: 'select', filterable: true, options: ['Leather', 'Stainless Steel', 'Silicone', 'Fabric'] },
      { key: 'movement', label: 'Movement', type: 'select', filterable: true, options: ['Quartz', 'Automatic', 'Mechanical', 'Solar'] },
      { key: 'waterResistance', label: 'Water Resistance', type: 'select', filterable: true, options: ['3 ATM', '5 ATM', '10 ATM', '20 ATM+'] },
      { key: 'metal', label: 'Metal', type: 'select', filterable: true, options: ['Gold', 'Silver', 'Stainless Steel', 'Titanium', 'Alloy'] },
      { key: 'dialSize', label: 'Dial Size', type: 'select', filterable: true, options: ['34mm', '38mm', '42mm', '46mm'] },
    ],
    subcategories: [
      { slug: 'analog-watches', name: 'Analog Watches', types: ['Analog Watch', 'Chronograph Watch', 'Dress Watch'] },
      { slug: 'smartwatches', name: 'Smartwatches', types: ['Fitness Smartwatch', 'GPS Smartwatch', 'Calling Smartwatch'] },
      { slug: 'watch-straps', name: 'Watch Straps', types: ['Leather Strap', 'Metal Strap', 'Silicone Strap'] },
      { slug: 'rings', name: 'Rings', types: ['Engagement Ring', 'Solitaire Ring', 'Fashion Ring', 'Couple Ring'] },
      { slug: 'necklaces', name: 'Necklaces & Pendants', types: ['Chain', 'Pendant Necklace', 'Choker', 'Mangalsutra'] },
      { slug: 'earrings', name: 'Earrings', types: ['Engagement Ring', 'Solitaire Ring', 'Fashion Ring', 'Couple Ring'] },
    ],
  },
  {
    id: 'cat-7',
    slug: 'sports-fitness',
    name: 'Sports & Fitness',
    description: 'Gear for the active lifestyle',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_48673c164-1789212269247.png',
    featured: false,
    productCount: 10,
    attributeSchema: [
      { key: 'sport', label: 'Sport', type: 'select', filterable: true, options: ['Running', 'Gym', 'Yoga', 'Cricket', 'Football', 'Cycling'] },
      { key: 'size', label: 'Size', type: 'multiselect', filterable: true, options: ['S', 'M', 'L', 'XL'] },
      { key: 'material', label: 'Material', type: 'select', filterable: true, options: ['Polyester', 'Nylon', 'Rubber', 'Foam'] },
      { key: 'skillLevel', label: 'Skill Level', type: 'select', filterable: true, options: ['Beginner', 'Intermediate', 'Advanced', 'Professional'] },
    ],
    subcategories: [
      { slug: 'gym-equipment', name: 'Gym Equipment', types: ['Dumbbell', 'Resistance Band', 'Kettlebell', 'Yoga Mat', 'Bench'] },
      { slug: 'yoga', name: 'Yoga & Meditation', types: ['Yoga Mat', 'Yoga Block', 'Meditation Cushion', 'Foam Roller'] },
      { slug: 'sportswear', name: 'Sportswear', types: ['Sports T-Shirt', 'Track Pants', 'Sports Bra', 'Jersey'] },
      { slug: 'running-gear', name: 'Running Gear', types: ['Running Shoes', 'Training Shoes', 'Walking Shoes'] },
      { slug: 'outdoor-camping', name: 'Outdoor & Camping', types: ['Camping Tent', 'Sleeping Bag', 'Hiking Backpack'] },
    ],
  },
  {
    id: 'cat-8',
    slug: 'beauty-personal-care',
    name: 'Beauty & Personal Care',
    description: 'Clean, effective essentials',
    image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c1909de7-1772073981313.png',
    featured: false,
    productCount: 8,
    attributeSchema: [
      { key: 'skinType', label: 'Skin Type', type: 'select', filterable: true, options: ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'] },
      { key: 'concern', label: 'Concern', type: 'multiselect', filterable: true, options: ['Acne', 'Dryness', 'Dark Spots', 'Aging', 'Dullness'] },
      { key: 'size', label: 'Size', type: 'select', filterable: true, options: ['30ml', '50ml', '100ml', '200ml'] },
      { key: 'fragranceFree', label: 'Fragrance Free', type: 'boolean', filterable: true },
    ],
    subcategories: [
      { slug: 'skincare', name: 'Skincare', types: ['Face Wash', 'Moisturizer', 'Face Serum', 'Sunscreen', 'Face Mask'] },
      { slug: 'haircare', name: 'Haircare', types: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Serum'] },
      { slug: 'makeup', name: 'Makeup', types: ['Foundation', 'Lipstick', 'Mascara', 'Eyeliner', 'Compact Powder'] },
      { slug: 'fragrance', name: 'Fragrance', types: ['Eau de Parfum', 'Eau de Toilette', 'Body Mist', 'Deodorant'] },
      { slug: 'grooming', name: 'Grooming', types: ['Electric Shaver', 'Beard Trimmer', 'Hair Dryer', 'Hair Straightener'] },
    ],
  },
  {
    id: 'cat-9',
    slug: 'kitchen-dining',
    name: 'Kitchen & Dining',
    description: 'Cookware, tools and dining essentials',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
    productCount: 5,
    attributeSchema: [
      { key: 'material', label: 'Material', type: 'select', filterable: true, options: ['Stainless Steel', 'Cast Iron', 'Ceramic', 'Glass', 'Bamboo'] },
      { key: 'capacity', label: 'Capacity', type: 'select', filterable: true, options: ['500ml', '1L', '2L', '3L', '5L+'] },
      { key: 'dishwasherSafe', label: 'Dishwasher Safe', type: 'boolean', filterable: true },
      { key: 'inductionCompatible', label: 'Induction Compatible', type: 'boolean', filterable: true },
    ],
    subcategories: [
      { slug: 'cookware', name: 'Cookware', types: ['Frying Pan', 'Saucepan', 'Kadhai', 'Pressure Cooker', 'Dutch Oven'] },
      { slug: 'kitchen-appliances', name: 'Kitchen Appliances', types: ['Mixer Grinder', 'Air Fryer', 'Electric Kettle', 'Toaster'] },
      { slug: 'kitchen-tools', name: 'Kitchen Tools', types: ['Chef Knife', 'Chopping Board', 'Peeler', 'Whisk', 'Measuring Cups'] },
      { slug: 'dinnerware', name: 'Dinnerware & Cutlery', types: ['Dinner Set', 'Plate', 'Bowl', 'Cutlery Set'] },
      { slug: 'bakeware', name: 'Bakeware', types: ['Baking Tray', 'Cake Mould', 'Oven Dish'] },
    ],
  },
  {
    id: 'cat-10',
    slug: 'home-appliances',
    name: 'Home Appliances',
    description: 'Everyday appliances for a well-run home',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80',
    productCount: 5,
    attributeSchema: [
      { key: 'energyRating', label: 'Energy Rating', type: 'select', filterable: true, options: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'] },
      { key: 'smartFeatures', label: 'Smart Features', type: 'multiselect', filterable: true, options: ['Wi-Fi', 'App Control', 'Voice Control', 'Remote Control'] },
      { key: 'capacity', label: 'Capacity', type: 'select', filterable: true, options: ['Small', 'Medium', 'Large', 'Extra Large'] },
      { key: 'installation', label: 'Installation', type: 'select', filterable: true, options: ['Free Installation', 'Paid Installation', 'Self Installation'] },
    ],
    subcategories: [
      { slug: 'refrigerators', name: 'Refrigerators', types: ['Single Door Refrigerator', 'Double Door Refrigerator', 'Side-by-Side Refrigerator'] },
      { slug: 'washing-machines', name: 'Washing Machines', types: ['Semi Automatic Washing Machine', 'Fully Automatic Top Load', 'Fully Automatic Front Load'] },
      { slug: 'air-conditioners', name: 'Air Conditioners', types: ['Split AC', 'Window AC', 'Portable AC'] },
      { slug: 'air-purifiers', name: 'Air Purifiers', types: ['HEPA Air Purifier', 'Smart Air Purifier'] },
      { slug: 'vacuum-cleaners', name: 'Vacuum Cleaners', types: ['Handheld Vacuum', 'Robot Vacuum', 'Stick Vacuum', 'Wet & Dry Vacuum'] },
      { slug: 'heaters-geysers', name: 'Room Heaters & Geysers', types: ['Room Heater', 'Electric Geyser', 'Instant Water Heater'] },
    ],
  },
  {
    id: 'cat-11',
    slug: 'toys-baby',
    name: 'Toys & Baby',
    description: 'Toys, gear and essentials for little ones',
    image: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=800&q=80',
    productCount: 5,
    attributeSchema: [
      { key: 'ageGroup', label: 'Age Group', type: 'select', filterable: true, options: ['0-3 Months', '1-2 Years', '3-5 Years', '6-8 Years', '9-12 Years'] },
      { key: 'educational', label: 'Educational', type: 'boolean', filterable: true },
      { key: 'batteryRequired', label: 'Battery Required', type: 'boolean', filterable: true },
      { key: 'material', label: 'Material', type: 'select', filterable: true, options: ['Plastic', 'Wood', 'Fabric', 'Silicone'] },
    ],
    subcategories: [
      { slug: 'educational-toys', name: 'Educational Toys', types: ['Puzzle', 'Flash Cards', 'Science Kit', 'Learning Board'] },
      { slug: 'building-blocks', name: 'Building Blocks', types: ['Building Blocks', 'Construction Set', 'Magnetic Tiles'] },
      { slug: 'baby-gear', name: 'Baby Gear', types: ['Baby Stroller', 'Baby Car Seat', 'Baby Carrier', 'Baby High Chair'] },
      { slug: 'baby-feeding', name: 'Baby Feeding', types: ['Baby Bottle', 'Sippy Cup', 'Feeding Set', 'Bottle Sterilizer'] },
      { slug: 'outdoor-toys', name: 'Outdoor Toys', types: ['Camping Tent', 'Sleeping Bag', 'Hiking Backpack'] },
    ],
  },
  {
    id: 'cat-12',
    slug: 'computers-accessories',
    name: 'Computers & Accessories',
    description: 'Laptops, components and desk peripherals',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    productCount: 5,
    attributeSchema: [
      { key: 'ram', label: 'RAM', type: 'select', filterable: true, options: ['8GB', '16GB', '32GB', '64GB'] },
      { key: 'storage', label: 'Storage', type: 'select', filterable: true, options: ['256GB', '512GB', '1TB', '2TB'] },
      { key: 'operatingSystem', label: 'Operating System', type: 'select', filterable: true, options: ['Windows', 'macOS', 'ChromeOS', 'Linux'] },
      { key: 'wireless', label: 'Wireless', type: 'boolean', filterable: true },
      { key: 'connectivity', label: 'Connectivity', type: 'multiselect', filterable: true, options: ['USB-C', 'HDMI', 'Bluetooth', 'Wi-Fi'] },
      { key: 'color', label: 'Color', type: 'color-swatch', filterable: true, options: ['Black', 'White', 'Grey', 'Silver'] },
    ],
    subcategories: [
      { slug: 'laptops', name: 'Laptops', types: ['Basic Top', 'Crop Top', 'Tank Top', 'Wrap Top', 'Tunic Top'] },
      { slug: 'keyboards-mice', name: 'Keyboards & Mice', types: ['Wireless Mouse', 'Mechanical Keyboard', 'Wireless Keyboard', 'Gaming Mouse'] },
      { slug: 'monitors', name: 'Monitors', types: ['Office Monitor', 'Gaming Monitor', 'Curved Monitor'] },
      { slug: 'webcams-audio', name: 'Webcams & Audio', types: ['Webcam', 'USB Microphone', 'Conferencing Speaker'] },
      { slug: 'networking', name: 'Networking', types: ['Wi-Fi Router', 'Mesh Wi-Fi', 'Wi-Fi Extender'] },
    ],
  },
];

/** Flattens the taxonomy above into the Category[] shape the DB/app expects — top-level rows first, then their subcategories (each carrying parentId). */
export function buildCategoryRecords(): Category[] {
  const records: Category[] = [];
  for (const top of CATEGORY_TAXONOMY) {
    records.push({
      id: top.id,
      name: top.name,
      slug: top.slug,
      description: top.description,
      image: top.image,
      productCount: top.productCount,
      featured: top.featured,
      level: 0,
      attributeSchema: top.attributeSchema,
    });
    top.subcategories.forEach((sub, idx) => {
      const subId = `${top.id}-sub-${idx + 1}`;
      records.push({
        id: subId,
        name: sub.name,
        slug: `${top.slug}-${sub.slug}`,
        description: `${sub.name} under ${top.name}`,
        image: top.image,
        productCount: 0,
        level: 1,
        parentId: top.id,
      });
      sub.types.forEach((typeName, typeIdx) => {
        records.push({
          id: `${subId}-type-${typeIdx + 1}`,
          name: typeName,
          slug: `${top.slug}-${sub.slug}-${slugify(typeName)}`,
          description: `${typeName} — a ${sub.name} product line`,
          image: top.image,
          productCount: 0,
          level: 2,
          parentId: subId,
        });
      });
    });
  }
  return records;
}

/** The dynamic filter engine's core lookup: which attributes can this category (or its subcategory) be filtered by? */
export function getCategoryFilters(categoryId: string): AttributeDefinition[] {
  const top = CATEGORY_TAXONOMY.find((c) => c.id === categoryId || c.id === categoryId.split('-sub-')[0]);
  return top?.attributeSchema.filter((a) => a.filterable) ?? [];
}

/** Full attribute schema for a top-level category (or the parent of a subcategory id) — used by the admin product editor. */
export function getAttributeSchema(categoryId: string): AttributeDefinition[] {
  const top = CATEGORY_TAXONOMY.find((c) => c.id === categoryId || c.id === categoryId.split('-sub-')[0]);
  return top?.attributeSchema ?? [];
}

export function getSubcategories(categoryId: string): { id: string; name: string }[] {
  const top = CATEGORY_TAXONOMY.find((c) => c.id === categoryId);
  if (!top) return [];
  return top.subcategories.map((s, idx) => ({ id: `${top.id}-sub-${idx + 1}`, name: s.name }));
}

/** The 3rd taxonomy level: which product types (e.g. "T-Shirts", "Jeans") live under a given subcategory. */
export function getProductTypes(subcategoryId: string): { id: string; name: string }[] {
  for (const top of CATEGORY_TAXONOMY) {
    const subIdx = top.subcategories.findIndex((_, idx) => `${top.id}-sub-${idx + 1}` === subcategoryId);
    if (subIdx >= 0) {
      return top.subcategories[subIdx].types.map((name, typeIdx) => ({
        id: `${subcategoryId}-type-${typeIdx + 1}`,
        name,
      }));
    }
  }
  return [];
}

export function findSubcategoryId(topCategoryId: string, subcategorySlugFragment: string): string | undefined {
  const top = CATEGORY_TAXONOMY.find((c) => c.id === topCategoryId);
  const idx = top?.subcategories.findIndex((s) => s.slug === subcategorySlugFragment);
  return idx !== undefined && idx >= 0 ? `${topCategoryId}-sub-${idx + 1}` : undefined;
}

export interface AttributeDefinition {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'boolean' | 'color-swatch' | 'radio' | 'checkbox' | 'image-swatch' | 'size-selector' | 'number' | 'text' | 'button-group';
  filterable: boolean;
  options?: string[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  /** e.g. { color: 'Black', size: 'M' } — keys match the parent category's attributeSchema */
  options: Record<string, string>;
  /** Only present when this variant's price differs from the product's base pricing. */
  price?: { mrp: number; sellingPrice: number };
  inventory: {
    quantity: number;
    reserved: number;
    available: number;
    lowStockThreshold: number;
    status: 'in_stock' | 'low_stock' | 'out_of_stock';
  };
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  categoryId: string;
  categoryName: string;
  /** Leaf subcategory this product actually lives in (e.g. "Sneakers" under "Footwear"). */
  subcategoryId?: string;
  subcategoryName?: string;
  /** The specific product line within a subcategory — e.g. "T-Shirts" under "Men's Clothing". */
  productTypeId?: string;
  productTypeName?: string;
  brandId?: string;
  model?: string;
  barcode?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  tax?: { rate: number; label: string };
  /** Distinct from `stock` (the raw count) — the merchandising state shown to shoppers. */
  availability?: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Pre Order' | 'Coming Soon' | 'Discontinued';
  images: string[];
  rating: number;
  reviewCount: number;
  ratingDistribution?: Record<'1' | '2' | '3' | '4' | '5', number>;
  stock: number;
  brand: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  specs?: Record<string, string>;
  /** Dynamic, category-driven attributes (size/material/RAM/etc.) — keys match the category's attributeSchema. */
  attributes?: Record<string, string | number | boolean>;
  /** Real purchasable SKUs. When present, these — not the deterministic guesses — are the source of truth for size/color pickers. */
  variants?: ProductVariant[];
  shipping?: {
    weightGrams?: number;
    freeShipping?: boolean;
    estimatedMinDays?: number;
    estimatedMaxDays?: number;
    returnable?: boolean;
    returnWindowDays?: number;
  };
  seo?: { title?: string; description?: string; keywords?: string[] };
  status?: 'draft' | 'active' | 'inactive' | 'archived' | 'discontinued';
  condition?: 'New' | 'Refurbished' | 'Open Box' | 'Used';
  warranty?: 'No Warranty' | '6 Months' | '1 Year' | '2 Years' | '3 Years' | '5 Years' | '10 Years' | 'Lifetime';
  packSize?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  featured?: boolean;
  /** Set on subcategories/product types to point at their parent. Absent/undefined for top-level categories. */
  parentId?: string;
  /** 0 = top-level category, 1 = subcategory, 2 = product type. */
  level: 0 | 1 | 2;
  /** Only top-level categories define this — it drives the dynamic filter engine for everything under them. */
  attributeSchema?: AttributeDefinition[];
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  description?: string;
}

export interface CartItem {
  /** Unique per line — two lines can share the same productId if they're different variant combos. */
  lineId: string;
  productId: string;
  product: Product;
  quantity: number;
  /** e.g. { size: 'M', color: 'Black' } or { ram: '16GB', storage: '512GB' } — whatever the product's category varies by. */
  selectedOptions?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface NotificationPreferences {
  orderUpdates: boolean;
  offers: boolean;
  wishlistAlerts: boolean;
  priceDrops: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  personalizedRecommendations: boolean;
  notifications: NotificationPreferences;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'light',
  personalizedRecommendations: true,
  notifications: {
    orderUpdates: true,
    offers: true,
    wishlistAlerts: true,
    priceDrops: true,
  },
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: 'customer' | 'admin';
  addresses?: Address[];
  preferences?: UserPreferences;
}

export interface Address {
  id: string;
  label: string;
  fullName?: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface FilterState {
  categories: string[];
  priceMin: number;
  priceMax: number;
  brands: string[];
  rating: number | null;
  availability: 'all' | 'inStock' | 'outOfStock';
  sort: SortOption;
  /** Dynamic, category-driven filters — keyed by AttributeDefinition.key, e.g. { color: ['Black'], size: ['M'] }. */
  attributes: Record<string, string[]>;
}

export type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface SearchResult {
  products: Product[];
  total: number;
  query: string;
}

// --- Reviews ------------------------------------------------------------
export interface Review {
  /** `${orderId}#${productId}` — one review per purchased item, and a natural duplicate guard. */
  id: string;
  orderId: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}

// --- Orders / Payments ------------------------------------------------------
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'online' | 'cod';
export type PaymentStatus = 'unpaid' | 'paid' | 'refund_pending' | 'refunded' | 'refund_failed';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  at: string;
  note?: string;
}

/** Statuses a customer is still allowed to cancel from — anything past this is already out for delivery. */
export const CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'paid', 'processing'];

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
  statusHistory: OrderStatusEvent[];
  cancelReason?: string;
  cancelledAt?: string;
  refundedAt?: string;
  couponCode?: string;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

/** A promo/discount code redeemable at checkout. */
export interface Coupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  expiresAt?: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  description?: string;
  createdAt: string;
}
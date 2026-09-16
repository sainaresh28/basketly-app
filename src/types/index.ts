export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  categoryId: string;
  categoryName: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  tags: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  specs?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
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

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: 'customer' | 'admin';
  addresses?: Address[];
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
  createdAt: string;
  updatedAt: string;
}
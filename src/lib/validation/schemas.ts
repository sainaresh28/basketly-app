import { z } from 'zod';

// --- Auth ---------------------------------------------------------------
export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(72),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  uid: z.string().min(1, 'Missing reset link parameters'),
  token: z.string().min(1, 'Missing reset link parameters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(72),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const notificationPreferencesSchema = z.object({
  orderUpdates: z.boolean().optional(),
  offers: z.boolean().optional(),
  wishlistAlerts: z.boolean().optional(),
  priceDrops: z.boolean().optional(),
});

export const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  personalizedRecommendations: z.boolean().optional(),
  notifications: notificationPreferencesSchema.optional(),
});
export type PreferencesInput = z.infer<typeof preferencesSchema>;

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80).optional(),
  phone: z.string().trim().min(7).max(15).optional().or(z.literal('')),
  preferences: preferencesSchema.optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const createReviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3, 'Tell us a bit more (at least 3 characters)').max(1000),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// --- Addresses ---------------------------------------------------------------
export const addressInputSchema = z.object({
  label: z.string().trim().min(1).max(40).default('Home'),
  fullName: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().min(7).max(15).optional(),
  line1: z.string().trim().min(3).max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2).max(60),
  state: z.string().trim().min(2).max(60),
  pincode: z.string().trim().min(3).max(12),
  isDefault: z.boolean().optional(),
});
export type AddressInput = z.infer<typeof addressInputSchema>;
export const addressUpdateSchema = addressInputSchema.partial();
export type AddressUpdateInput = z.infer<typeof addressUpdateSchema>;

// --- Cart -----------------------------------------------------------------
const selectedOptionsSchema = z.record(z.string().max(40)).optional();

export const addToCartSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20).default(1),
  selectedOptions: selectedOptionsSchema,
});
export type AddToCartInput = z.infer<typeof addToCartSchema>;

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(20),
});
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

export const mergeCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
        selectedOptions: selectedOptionsSchema,
      })
    )
    .max(100),
});
export type MergeCartInput = z.infer<typeof mergeCartSchema>;

// --- Wishlist ---------------------------------------------------------------
export const addToWishlistSchema = z.object({
  productId: z.string().min(1),
});
export type AddToWishlistInput = z.infer<typeof addToWishlistSchema>;

export const mergeWishlistSchema = z.object({
  productIds: z.array(z.string().min(1)).max(200),
});
export type MergeWishlistInput = z.infer<typeof mergeWishlistSchema>;

// --- Checkout / Orders -------------------------------------------------------
export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(15),
  line1: z.string().trim().min(3).max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2).max(60),
  state: z.string().trim().min(2).max(60),
  pincode: z.string().trim().min(3).max(12),
});
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

export const createCheckoutOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  couponCode: z.string().trim().min(1).max(40).optional(),
});
export type CreateCheckoutOrderInput = z.infer<typeof createCheckoutOrderSchema>;

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  couponCode: z.string().trim().min(1).max(40).optional(),
});
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

/** Pay-on-delivery: no Razorpay round-trip, just place the order directly. */
export const codOrderSchema = z.object({
  shippingAddress: shippingAddressSchema,
  couponCode: z.string().trim().min(1).max(40).optional(),
});
export type CodOrderInput = z.infer<typeof codOrderSchema>;

// --- Coupons ------------------------------------------------------------
export const applyCouponSchema = z.object({
  code: z.string().trim().min(1).max(40),
  subtotal: z.number().nonnegative(),
});
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;

const couponCodeRegex = /^[A-Za-z0-9]+$/;

export const adminCouponSchema = z.object({
  code: z.string().trim().min(3).max(40).regex(couponCodeRegex, 'Code may only contain letters and numbers'),
  type: z.enum(['percent', 'flat']),
  value: z.number().positive(),
  minOrderValue: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().int().positive().optional(),
  active: z.boolean().default(true),
  description: z.string().trim().max(200).optional(),
});
export type AdminCouponInput = z.infer<typeof adminCouponSchema>;

export const cancelOrderSchema = z.object({
  reason: z.string().trim().max(300).optional(),
});
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().trim().max(60).optional(),
  courier: z.string().trim().max(60).optional(),
  estimatedDelivery: z.string().trim().max(60).optional(),
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// --- Admin: product management ---------------------------------------------
export const adminProductVariantSchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1),
  options: z.record(z.string()),
  inventory: z.object({
    quantity: z.number().int().min(0),
    reserved: z.number().int().min(0),
    available: z.number().int().min(0),
    lowStockThreshold: z.number().int().min(0),
    status: z.enum(['in_stock', 'low_stock', 'out_of_stock']),
  }),
});

export const adminProductSchema = z.object({
  name: z.string().trim().min(2).max(140),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only'),
  description: z.string().trim().min(10).max(4000),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  categoryId: z.string().min(1),
  categoryName: z.string().min(1),
  subcategoryId: z.string().optional(),
  subcategoryName: z.string().optional(),
  images: z.array(z.string().url()).min(1).max(8),
  stock: z.number().int().min(0),
  brand: z.string().trim().min(1).max(60),
  tags: z.array(z.string().trim().min(1)).max(20).default([]),
  isNew: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isSale: z.boolean().optional(),
  specs: z.record(z.string()).optional(),
  attributes: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  variants: z.array(adminProductVariantSchema).optional(),
});
export type AdminProductInput = z.infer<typeof adminProductSchema>;

export const adminProductUpdateSchema = adminProductSchema.partial();
export type AdminProductUpdateInput = z.infer<typeof adminProductUpdateSchema>;
export const productQuerySchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
  brands: z.string().optional(), // comma separated
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().nonnegative().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  availability: z.enum(['all', 'inStock', 'outOfStock']).optional(),
  sort: z.enum(['featured', 'newest', 'price-asc', 'price-desc', 'rating', 'popular']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
export type ProductQuery = z.infer<typeof productQuerySchema>;

// --- Admin: category management ---------------------------------------------
export const adminCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only'),
  description: z.string().trim().min(0).max(1000).default(''),
  image: z.string().trim().url('Enter a valid image URL'),
  featured: z.boolean().optional(),
});
export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;

export const adminCategoryUpdateSchema = adminCategorySchema.partial();
export type AdminCategoryUpdateInput = z.infer<typeof adminCategoryUpdateSchema>;

// --- Admin: user management ---------------------------------------------
export const adminUserUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().min(7).max(15).optional().or(z.literal('')),
  role: z.enum(['customer', 'admin']).optional(),
});
export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;

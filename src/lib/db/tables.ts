/**
 * Central place for DynamoDB table names + index names.
 * Table names are configurable via env vars so the same code can point at
 * dev / staging / prod tables without any code changes.
 */
export const TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'basketly-users',
  PRODUCTS: process.env.DYNAMODB_PRODUCTS_TABLE || 'basketly-products',
  CATEGORIES: process.env.DYNAMODB_CATEGORIES_TABLE || 'basketly-categories',
  CART: process.env.DYNAMODB_CART_TABLE || 'basketly-cart',
  WISHLIST: process.env.DYNAMODB_WISHLIST_TABLE || 'basketly-wishlist',
  ORDERS: process.env.DYNAMODB_ORDERS_TABLE || 'basketly-orders',
} as const;

export const INDEXES = {
  USERS_BY_EMAIL: 'EmailIndex',
  PRODUCTS_BY_SLUG: 'SlugIndex',
  PRODUCTS_BY_CATEGORY: 'CategoryIndex',
  CATEGORIES_BY_SLUG: 'SlugIndex',
  ORDERS_BY_USER: 'UserIndex',
} as const;

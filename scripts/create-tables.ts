/**
 * Creates the DynamoDB tables Basketly needs, with the GSIs the app relies
 * on for lookups (login by email, product/category by slug, products by
 * category). Safe to re-run — existing tables are skipped.
 *
 * Billing: every table/index below uses PROVISIONED capacity with small,
 * fixed throughput numbers. Added up across every table AND every GSI, the
 * total is 22 RCU + 15 WCU — comfortably inside AWS DynamoDB's Always Free
 * allowance of 25 RCU + 25 WCU per account/region, forever (not a 12-month
 * trial). As long as you don't change these numbers or add autoscaling,
 * this project costs $0 to run on AWS.
 *
 * Usage: npm run db:create-tables
 */
import 'dotenv/config';
import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  ResourceNotFoundException,
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

const TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'basketly-users',
  PRODUCTS: process.env.DYNAMODB_PRODUCTS_TABLE || 'basketly-products',
  CATEGORIES: process.env.DYNAMODB_CATEGORIES_TABLE || 'basketly-categories',
  CART: process.env.DYNAMODB_CART_TABLE || 'basketly-cart',
  WISHLIST: process.env.DYNAMODB_WISHLIST_TABLE || 'basketly-wishlist',
  ORDERS: process.env.DYNAMODB_ORDERS_TABLE || 'basketly-orders',
  REVIEWS: process.env.DYNAMODB_REVIEWS_TABLE || 'basketly-reviews',
  BRANDS: process.env.DYNAMODB_BRANDS_TABLE || 'basketly-brands',
  COUPONS: process.env.DYNAMODB_COUPONS_TABLE || 'basketly-coupons',
};

// Every table/GSI needs its own explicit throughput in PROVISIONED mode.
// The product table's two GSIs are trimmed to 1 RCU each (down from 2) to
// make room for the new Brands table/index while keeping the account-wide
// total at exactly 25 RCU + 25 WCU — the Always Free ceiling. The seed
// script's retry-with-backoff logic (see scripts/seed.ts) makes these
// low-throughput tables workable even under a full re-seed's write burst.
const THROUGHPUT = {
  usersTable: { ReadCapacityUnits: 2, WriteCapacityUnits: 2 },
  usersEmailIndex: { ReadCapacityUnits: 2, WriteCapacityUnits: 2 },
  categoriesTable: { ReadCapacityUnits: 1, WriteCapacityUnits: 2 },
  categoriesSlugIndex: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  productsTable: { ReadCapacityUnits: 3, WriteCapacityUnits: 2 },
  productsSlugIndex: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  productsCategoryIndex: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  cartTable: { ReadCapacityUnits: 3, WriteCapacityUnits: 3 },
  wishlistTable: { ReadCapacityUnits: 2, WriteCapacityUnits: 2 },
  ordersTable: { ReadCapacityUnits: 2, WriteCapacityUnits: 2 },
  ordersUserIndex: { ReadCapacityUnits: 2, WriteCapacityUnits: 2 },
  reviewsTable: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  reviewsProductIndex: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  brandsTable: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  brandsSlugIndex: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
  couponsTable: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
};
// Total: 25 RCU + 25 WCU across the whole account — at the free-tier ceiling.

async function tableExists(name: string): Promise<boolean> {
  try {
    await client.send(new DescribeTableCommand({ TableName: name }));
    return true;
  } catch (err) {
    if (err instanceof ResourceNotFoundException) return false;
    throw err;
  }
}

async function createIfMissing(name: string, command: CreateTableCommand) {
  if (await tableExists(name)) {
    console.log(`✓ ${name} already exists — skipping`);
    return;
  }
  await client.send(command);
  console.log(`✓ created ${name}`);
}

async function main() {
  await createIfMissing(
    TABLES.USERS,
    new CreateTableCommand({
      TableName: TABLES.USERS,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: THROUGHPUT.usersTable,
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' },
      ],
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'EmailIndex',
          KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: THROUGHPUT.usersEmailIndex,
        },
      ],
    })
  );

  await createIfMissing(
    TABLES.CATEGORIES,
    new CreateTableCommand({
      TableName: TABLES.CATEGORIES,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: THROUGHPUT.categoriesTable,
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'slug', AttributeType: 'S' },
      ],
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'SlugIndex',
          KeySchema: [{ AttributeName: 'slug', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: THROUGHPUT.categoriesSlugIndex,
        },
      ],
    })
  );

  await createIfMissing(
    TABLES.PRODUCTS,
    new CreateTableCommand({
      TableName: TABLES.PRODUCTS,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: THROUGHPUT.productsTable,
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'slug', AttributeType: 'S' },
        { AttributeName: 'categoryId', AttributeType: 'S' },
        { AttributeName: 'name', AttributeType: 'S' },
      ],
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'SlugIndex',
          KeySchema: [{ AttributeName: 'slug', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: THROUGHPUT.productsSlugIndex,
        },
        {
          IndexName: 'CategoryIndex',
          KeySchema: [
            { AttributeName: 'categoryId', KeyType: 'HASH' },
            { AttributeName: 'name', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: THROUGHPUT.productsCategoryIndex,
        },
      ],
    })
  );

  await createIfMissing(
    TABLES.CART,
    new CreateTableCommand({
      TableName: TABLES.CART,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: THROUGHPUT.cartTable,
      AttributeDefinitions: [
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'productId', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },
        { AttributeName: 'productId', KeyType: 'RANGE' },
      ],
    })
  );

  await createIfMissing(
    TABLES.WISHLIST,
    new CreateTableCommand({
      TableName: TABLES.WISHLIST,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: THROUGHPUT.wishlistTable,
      AttributeDefinitions: [
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'productId', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' },
        { AttributeName: 'productId', KeyType: 'RANGE' },
      ],
    })
  );

  await createIfMissing(
    TABLES.ORDERS,
    new CreateTableCommand({
      TableName: TABLES.ORDERS,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: THROUGHPUT.ordersTable,
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'S' },
      ],
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'UserIndex',
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' },
            { AttributeName: 'createdAt', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: THROUGHPUT.ordersUserIndex,
        },
      ],
    })
  );

  await createIfMissing(
    TABLES.REVIEWS,
    new CreateTableCommand({
      TableName: TABLES.REVIEWS,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: THROUGHPUT.reviewsTable,
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'productId', AttributeType: 'S' },
        { AttributeName: 'createdAt', AttributeType: 'S' },
      ],
      // id = `${orderId}#${productId}` — doubles as a natural one-review-per-purchased-item guard.
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'ProductIndex',
          KeySchema: [
            { AttributeName: 'productId', KeyType: 'HASH' },
            { AttributeName: 'createdAt', KeyType: 'RANGE' },
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: THROUGHPUT.reviewsProductIndex,
        },
      ],
    })
  );

  await createIfMissing(
    TABLES.BRANDS,
    new CreateTableCommand({
      TableName: TABLES.BRANDS,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: THROUGHPUT.brandsTable,
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' },
        { AttributeName: 'slug', AttributeType: 'S' },
      ],
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'SlugIndex',
          KeySchema: [{ AttributeName: 'slug', KeyType: 'HASH' }],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: THROUGHPUT.brandsSlugIndex,
        },
      ],
    })
  );

  await createIfMissing(
    TABLES.COUPONS,
    new CreateTableCommand({
      TableName: TABLES.COUPONS,
      BillingMode: 'PROVISIONED',
      ProvisionedThroughput: THROUGHPUT.couponsTable,
      AttributeDefinitions: [{ AttributeName: 'code', AttributeType: 'S' }],
      KeySchema: [{ AttributeName: 'code', KeyType: 'HASH' }],
    })
  );

  console.log('\nAll tables ready — using free-tier provisioned capacity (25 RCU + 25 WCU total).');
}

main().catch((err) => {
  console.error('Failed to create tables:', err);
  process.exit(1);
});

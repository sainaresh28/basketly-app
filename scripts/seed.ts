/**
 * Seeds Categories + Products into DynamoDB from the original mock catalog,
 * so the app has real data to read from on first run.
 *
 * Usage: npm run db:seed
 */
import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { CATEGORIES, PRODUCTS } from '../src/lib/mock-data';
import { buildBrandRecords } from '../src/lib/catalog/brands';

const raw = new DynamoDBClient({
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
const ddb = DynamoDBDocumentClient.from(raw, { marshallOptions: { removeUndefinedValues: true } });

const TABLES = {
  PRODUCTS: process.env.DYNAMODB_PRODUCTS_TABLE || 'basketly-products',
  CATEGORIES: process.env.DYNAMODB_CATEGORIES_TABLE || 'basketly-categories',
  BRANDS: process.env.DYNAMODB_BRANDS_TABLE || 'basketly-brands',
  COUPONS: process.env.DYNAMODB_COUPONS_TABLE || 'basketly-coupons',
};

/**
 * Starter coupons so the storefront's own promo banner ("Use code FIRST10
 * for 10% off") actually works out of the box, instead of advertising a
 * code nothing backs. Seeding is upsert-by-code (see batchWrite), so
 * re-running this is safe and won't reset usedCount on a coupon that's
 * already been redeemed by a real customer — it will, however, overwrite
 * any other field you've since changed via the admin API. Edit the values
 * below (or just create more via POST /api/admin/coupons) as needed.
 */
const COUPONS: Record<string, unknown>[] = [
  {
    code: 'FIRST10',
    type: 'percent',
    value: 10,
    minOrderValue: 0,
    usedCount: 0,
    active: true,
    description: '10% off your first order',
  },
  {
    code: 'FLAT150',
    type: 'flat',
    value: 150,
    minOrderValue: 999,
    usedCount: 0,
    active: true,
    description: '₹150 off orders over ₹999',
  },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function batchWrite(tableName: string, items: Record<string, unknown>[]) {
  const now = new Date().toISOString();
  const withTimestamps = items.map((item) => ({ ...item, createdAt: now, updatedAt: now }));

  // BatchWriteItem caps at 25 items per request. Small hobby-tier tables
  // (provisioned at 1-2 WCU to stay in the AWS free tier) can't absorb 25
  // writes in a single burst, so this retries throttled requests and any
  // UnprocessedItems DynamoDB hands back, backing off between attempts
  // instead of giving up after the SDK's built-in retries are exhausted.
  for (let i = 0; i < withTimestamps.length; i += 25) {
    const chunk = withTimestamps.slice(i, i + 25);
    let pending: Record<string, unknown>[] = chunk;
    let attempt = 0;

    while (pending.length > 0) {
      try {
        const res = await ddb.send(
          new BatchWriteCommand({
            RequestItems: { [tableName]: pending.map((Item) => ({ PutRequest: { Item } })) },
          })
        );
        const unprocessed = res.UnprocessedItems?.[tableName];
        if (unprocessed && unprocessed.length > 0) {
          pending = unprocessed.map((r) => r.PutRequest!.Item as Record<string, unknown>);
          attempt++;
          await sleep(Math.min(1000 * 2 ** attempt, 8000));
        } else {
          pending = [];
        }
      } catch (err) {
        const isThrottling =
          err instanceof Error && /ProvisionedThroughputExceeded|ThrottlingException/.test(err.name || err.message);
        if (!isThrottling || attempt >= 10) throw err;
        attempt++;
        const wait = Math.min(1000 * 2 ** attempt, 8000);
        console.log(`  throttled on ${tableName}, retrying in ${wait}ms (attempt ${attempt})...`);
        await sleep(wait);
      }
    }

    console.log(`  wrote ${Math.min(i + 25, withTimestamps.length)}/${withTimestamps.length} to ${tableName}`);
    await sleep(250); // brief pause between chunks so low-WCU tables can keep up
  }
}

async function main() {
  // Product types (level 2) are stored on every product and served from
  // src/lib/catalog/taxonomy.ts. Persisting them as rows would ~4x the size of
  // the categories table, and CategoryRepository does full Scans — on a
  // free-tier table with a couple of read units that starts throttling the
  // homepage. Opt in with SEED_PRODUCT_TYPES=1 if your table has the capacity.
  const includeTypes = process.env.SEED_PRODUCT_TYPES === '1';
  const categoryRows = CATEGORIES.filter((c) => includeTypes || c.level <= 1);
  console.log(`Seeding ${categoryRows.length} categories${includeTypes ? ' (including product types)' : ''}...`);
  await batchWrite(TABLES.CATEGORIES, categoryRows as unknown as Record<string, unknown>[]);

  const brands = buildBrandRecords(PRODUCTS);
  console.log(`Seeding ${brands.length} brands...`);
  await batchWrite(TABLES.BRANDS, brands as unknown as Record<string, unknown>[]);

  console.log(`Seeding ${PRODUCTS.length} products...`);
  await batchWrite(TABLES.PRODUCTS, PRODUCTS as unknown as Record<string, unknown>[]);

  // Coupons are seeded create-only (skip any code that already exists)
  // rather than upserted, so re-running this script never resets a real
  // coupon's usedCount or clobbers edits made since via the admin API.
  console.log(`Seeding starter coupons...`);
  const newCoupons: Record<string, unknown>[] = [];
  for (const coupon of COUPONS) {
    const existing = await ddb.send(new GetCommand({ TableName: TABLES.COUPONS, Key: { code: coupon.code } }));
    if (existing.Item) {
      console.log(`  ${coupon.code} already exists — skipping`);
    } else {
      newCoupons.push(coupon);
    }
  }
  if (newCoupons.length > 0) {
    await batchWrite(TABLES.COUPONS, newCoupons);
  }

  console.log('\nSeed complete.');
}

main().catch((err) => {
  console.error('Failed to seed data:', err);
  process.exit(1);
});

/**
 * Seeds Categories + Products into DynamoDB from the original mock catalog,
 * so the app has real data to read from on first run.
 *
 * Usage: npm run db:seed
 */
import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { CATEGORIES, PRODUCTS } from '../src/lib/mock-data';

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
};

async function batchWrite(tableName: string, items: Record<string, unknown>[]) {
  const now = new Date().toISOString();
  const withTimestamps = items.map((item) => ({ ...item, createdAt: now, updatedAt: now }));

  // BatchWriteItem caps at 25 items per request.
  for (let i = 0; i < withTimestamps.length; i += 25) {
    const chunk = withTimestamps.slice(i, i + 25);
    await ddb.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: chunk.map((Item) => ({ PutRequest: { Item } })),
        },
      })
    );
    console.log(`  wrote ${Math.min(i + 25, withTimestamps.length)}/${withTimestamps.length} to ${tableName}`);
  }
}

async function main() {
  console.log(`Seeding ${CATEGORIES.length} categories...`);
  await batchWrite(TABLES.CATEGORIES, CATEGORIES as unknown as Record<string, unknown>[]);

  console.log(`Seeding ${PRODUCTS.length} products...`);
  await batchWrite(TABLES.PRODUCTS, PRODUCTS as unknown as Record<string, unknown>[]);

  console.log('\nSeed complete.');
}

main().catch((err) => {
  console.error('Failed to seed data:', err);
  process.exit(1);
});

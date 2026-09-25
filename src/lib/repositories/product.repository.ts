import { GetCommand, PutCommand, QueryCommand, ScanCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES, INDEXES } from '@/lib/db/tables';
import { cached, invalidateCache } from '@/lib/cache/memory-cache';
import type { Product } from '@/types';

const ALL_PRODUCTS_KEY = 'products:all';
// The whole catalog is scanned on nearly every page (home, products,
// new-arrivals, sale, product detail's related products, cart, checkout,
// admin). A short cache turns "every page load re-scans the table" into
// "at most one Scan every 20s", which is the single biggest real (not just
// perceived) latency win available without moving to a search index.
const PRODUCTS_TTL_MS = 20_000;

export const ProductRepository = {
  /**
   * Returns the full catalog. For a catalog of this size a Scan is fine.
   * At real e-commerce scale, listing/search/filtering would move to a
   * dedicated search index (OpenSearch/Algolia) fed by DynamoDB Streams,
   * with DynamoDB remaining the source of truth for a single product's data.
   */
  async findAll(): Promise<Product[]> {
    return cached(ALL_PRODUCTS_KEY, PRODUCTS_TTL_MS, async () => {
      const items: Product[] = [];
      let ExclusiveStartKey: Record<string, unknown> | undefined;
      do {
        const res = await ddb.send(
          new ScanCommand({ TableName: TABLES.PRODUCTS, ExclusiveStartKey })
        );
        items.push(...((res.Items as Product[]) || []));
        ExclusiveStartKey = res.LastEvaluatedKey;
      } while (ExclusiveStartKey);
      return items;
    });
  },

  async findById(id: string): Promise<Product | null> {
    const res = await ddb.send(new GetCommand({ TableName: TABLES.PRODUCTS, Key: { id } }));
    return (res.Item as Product) || null;
  },

  async findManyByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const unique = Array.from(new Set(ids));
    // BatchGetItem caps at 100 keys per request.
    const chunks: string[][] = [];
    for (let i = 0; i < unique.length; i += 100) chunks.push(unique.slice(i, i + 100));

    const results: Product[] = [];
    for (const chunk of chunks) {
      const res = await ddb.send(
        new BatchGetCommand({
          RequestItems: {
            [TABLES.PRODUCTS]: { Keys: chunk.map((id) => ({ id })) },
          },
        })
      );
      results.push(...((res.Responses?.[TABLES.PRODUCTS] as Product[]) || []));
    }
    return results;
  },

  async findBySlug(slug: string): Promise<Product | null> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.PRODUCTS,
        IndexName: INDEXES.PRODUCTS_BY_SLUG,
        KeyConditionExpression: 'slug = :slug',
        ExpressionAttributeValues: { ':slug': slug },
        Limit: 1,
      })
    );
    return (res.Items?.[0] as Product) || null;
  },

  async findByCategory(categoryId: string): Promise<Product[]> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.PRODUCTS,
        IndexName: INDEXES.PRODUCTS_BY_CATEGORY,
        KeyConditionExpression: 'categoryId = :categoryId',
        ExpressionAttributeValues: { ':categoryId': categoryId },
      })
    );
    return (res.Items as Product[]) || [];
  },

  async put(product: Product): Promise<Product> {
    await ddb.send(new PutCommand({ TableName: TABLES.PRODUCTS, Item: product }));
    invalidateCache(ALL_PRODUCTS_KEY);
    return product;
  },

  async update(id: string, patch: Partial<Product>): Promise<Product> {
    const fields = Object.keys(patch).filter((k) => k !== 'id');
    if (fields.length === 0) {
      const existing = await this.findById(id);
      if (!existing) throw new Error('Product not found');
      return existing;
    }
    const { UpdateCommand } = await import('@aws-sdk/lib-dynamodb');
    const res = await ddb.send(
      new UpdateCommand({
        TableName: TABLES.PRODUCTS,
        Key: { id },
        UpdateExpression: 'SET ' + fields.map((f, i) => `#f${i} = :v${i}`).join(', '),
        ExpressionAttributeNames: Object.fromEntries(fields.map((f, i) => [`#f${i}`, f])),
        ExpressionAttributeValues: Object.fromEntries(
          fields.map((f, i) => [`:v${i}`, (patch as Record<string, unknown>)[f]])
        ),
        ConditionExpression: 'attribute_exists(id)',
        ReturnValues: 'ALL_NEW',
      })
    );
    invalidateCache(ALL_PRODUCTS_KEY);
    return res.Attributes as Product;
  },

  async delete(id: string): Promise<void> {
    const { DeleteCommand } = await import('@aws-sdk/lib-dynamodb');
    await ddb.send(new DeleteCommand({ TableName: TABLES.PRODUCTS, Key: { id } }));
    invalidateCache(ALL_PRODUCTS_KEY);
  },

  /** Atomically decrement stock; throws (condition fails) if not enough stock. */
  async decrementStock(id: string, amount: number) {
    const { UpdateCommand } = await import('@aws-sdk/lib-dynamodb');
    await ddb.send(
      new UpdateCommand({
        TableName: TABLES.PRODUCTS,
        Key: { id },
        UpdateExpression: 'SET stock = stock - :amount',
        ConditionExpression: 'stock >= :amount',
        ExpressionAttributeValues: { ':amount': amount },
      })
    );
    invalidateCache(ALL_PRODUCTS_KEY);
  },
};

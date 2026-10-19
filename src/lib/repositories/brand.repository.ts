import { GetCommand, PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES, INDEXES } from '@/lib/db/tables';
import type { Brand } from '@/types';

export const BrandRepository = {
  async findAll(): Promise<Brand[]> {
    const items: Brand[] = [];
    let ExclusiveStartKey: Record<string, unknown> | undefined;
    do {
      const res = await ddb.send(new ScanCommand({ TableName: TABLES.BRANDS, ExclusiveStartKey }));
      items.push(...((res.Items as Brand[]) || []));
      ExclusiveStartKey = res.LastEvaluatedKey;
    } while (ExclusiveStartKey);
    return items.sort((a, b) => a.name.localeCompare(b.name));
  },

  async findById(id: string): Promise<Brand | null> {
    const res = await ddb.send(new GetCommand({ TableName: TABLES.BRANDS, Key: { id } }));
    return (res.Item as Brand) || null;
  },

  async findBySlug(slug: string): Promise<Brand | null> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.BRANDS,
        IndexName: INDEXES.BRANDS_BY_SLUG,
        KeyConditionExpression: 'slug = :slug',
        ExpressionAttributeValues: { ':slug': slug },
        Limit: 1,
      })
    );
    return (res.Items?.[0] as Brand) || null;
  },

  async put(brand: Brand): Promise<Brand> {
    await ddb.send(new PutCommand({ TableName: TABLES.BRANDS, Item: brand }));
    return brand;
  },
};

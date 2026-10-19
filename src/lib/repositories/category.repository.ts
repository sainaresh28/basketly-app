import { DeleteCommand, GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '@/lib/db/client';
import { TABLES, INDEXES } from '@/lib/db/tables';
import type { Category } from '@/types';

export const CategoryRepository = {
  async findAll(): Promise<Category[]> {
    // Category catalog is small (single-digit thousands at most) so a Scan
    // is acceptable here; a paginated Query pattern is used for Products.
    const res = await ddb.send(new ScanCommand({ TableName: TABLES.CATEGORIES }));
    return (res.Items as Category[]) || [];
  },

  async findById(id: string): Promise<Category | null> {
    const res = await ddb.send(new GetCommand({ TableName: TABLES.CATEGORIES, Key: { id } }));
    return (res.Item as Category) || null;
  },

  async findBySlug(slug: string): Promise<Category | null> {
    const res = await ddb.send(
      new QueryCommand({
        TableName: TABLES.CATEGORIES,
        IndexName: INDEXES.CATEGORIES_BY_SLUG,
        KeyConditionExpression: 'slug = :slug',
        ExpressionAttributeValues: { ':slug': slug },
        Limit: 1,
      })
    );
    return (res.Items?.[0] as Category) || null;
  },

  async put(category: Category): Promise<Category> {
    await ddb.send(new PutCommand({ TableName: TABLES.CATEGORIES, Item: category }));
    return category;
  },

  async update(id: string, patch: Partial<Category>): Promise<Category> {
    const fields = Object.keys(patch).filter((k) => k !== 'id');
    if (fields.length === 0) {
      const existing = await this.findById(id);
      if (!existing) throw new Error('Category not found');
      return existing;
    }
    const res = await ddb.send(
      new UpdateCommand({
        TableName: TABLES.CATEGORIES,
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
    return res.Attributes as Category;
  },

  async delete(id: string): Promise<void> {
    await ddb.send(new DeleteCommand({ TableName: TABLES.CATEGORIES, Key: { id } }));
  },
};

import type { MetadataRoute } from 'next';
import { ProductService } from '@/lib/services/product.service';
import { CategoryService } from '@/lib/services/category.service';

// Generate on-demand rather than at build time — the catalog lives in
// DynamoDB and changes independently of deploys.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [products, categories] = await Promise.all([
    ProductService.list(),
    CategoryService.listAll(),
  ]);

  const productUrls = products.map(p => ({
    url: `${base}/product-detail?id=${p.id}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  const categoryUrls = categories.map(c => ({
    url: `${base}/products?category=${c.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), priority: 1.0 },
    { url: `${base}/products`, lastModified: new Date(), priority: 0.9 },
    ...productUrls,
    ...categoryUrls,
  ];
}

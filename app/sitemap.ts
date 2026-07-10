import type { MetadataRoute } from 'next';
import { business } from '@/content/business';
import { getBrands, getModels, getProducts } from '@/sanity/lib/data';
import { brandHref, itemHref, modelHref } from '@/lib/catalogue/slugs';

// Re-checked at most once an hour so newly published Sanity brands, models
// and work items appear here — and therefore get discovered by Google —
// without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: business.siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${business.siteUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${business.siteUrl}/catalogue`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${business.siteUrl}/book`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${business.siteUrl}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${business.siteUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ];

  const [brands, models, products] = await Promise.all([
    getBrands(),
    getModels(),
    getProducts(),
  ]);

  const brandRoutes: MetadataRoute.Sitemap = brands.map((b) => ({
    url: `${business.siteUrl}${brandHref(b.slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const modelRoutes: MetadataRoute.Sitemap = models
    .filter((m) => m.brandSlug)
    .map((m) => ({
      url: `${business.siteUrl}${modelHref(m.brandSlug, m.slug)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.brandSlug && p.modelSlug)
    .map((p) => ({
      url: `${business.siteUrl}${itemHref(p.brandSlug as string, p.modelSlug as string, p.id)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }));

  return [...staticRoutes, ...brandRoutes, ...modelRoutes, ...productRoutes];
}

import type { MetadataRoute } from 'next';
import { business } from '@/content/business';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/services', '/catalogue', '/book', '/about', '/contact'];
  const now = new Date();

  return routes.map((route) => ({
    url: `${business.siteUrl}${route}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}

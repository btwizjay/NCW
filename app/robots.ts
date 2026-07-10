import type { MetadataRoute } from 'next';
import { business } from '@/content/business';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Studio is the CMS admin panel, /api is server-only, and manage
        // links carry a per-booking secret token — none of these are
        // pages a search engine should crawl or index.
        disallow: ['/studio', '/api', '/book/manage'],
      },
    ],
    sitemap: `${business.siteUrl}/sitemap.xml`,
  };
}

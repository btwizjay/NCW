import type { Metadata } from 'next';
import { business } from '@/content/business';

export const baseMetadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: `${business.name} | ${business.tagline}`,
    template: `%s · ${business.name}`,
  },
  description: business.description,
  applicationName: business.name,
  keywords: [
    'vehicle cushion work Sri Lanka',
    'Japanese seat sets',
    'van interior Pasyala',
    'car upholstery Sri Lanka',
    'leather re-trim',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    title: business.name,
    description: business.description,
    siteName: business.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: business.name,
    description: business.description,
  },
  robots: { index: true, follow: true },
};

export const pageMetadata = (title: string, description?: string): Metadata => ({
  title,
  description: description ?? business.description,
  openGraph: { title, description: description ?? business.description },
});

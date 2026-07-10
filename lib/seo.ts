import type { Metadata } from 'next';
import { business } from '@/content/business';

// Default social-share image, used whenever a page doesn't have a more
// specific photo (a catalogue item's own photo, a brand's cover, etc.).
const DEFAULT_OG_IMAGE = '/images/og-default.jpg';

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
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    url: business.siteUrl,
    title: business.name,
    description: business.description,
    siteName: business.name,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: business.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: business.name,
    description: business.description,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

// `path` sets the canonical URL and og:url for this page (e.g. `/services`,
// or a dynamic catalogue route). `image` overrides the default social-share
// photo — pass a real product/brand photo where one exists.
export const pageMetadata = (
  title: string,
  description?: string,
  opts?: { path?: string; image?: string },
): Metadata => {
  const desc = description ?? business.description;
  const image = opts?.image ?? DEFAULT_OG_IMAGE;
  return {
    title,
    description: desc,
    alternates: opts?.path ? { canonical: opts.path } : undefined,
    openGraph: {
      title,
      description: desc,
      url: opts?.path,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [image],
    },
  };
};

// BreadcrumbList JSON-LD for the catalogue hierarchy. `path` is omitted for
// the current (last) crumb since it has no outbound link.
export function breadcrumbJsonLd(items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${business.siteUrl}${item.path}` } : {}),
    })),
  };
}

// Product JSON-LD for a single catalogued work item.
export function productJsonLd(product: {
  name: string;
  summary?: string;
  image: string;
  brand: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.summary || business.description,
    image: product.image,
    url: `${business.siteUrl}${product.path}`,
    brand: { '@type': 'Brand', name: product.brand },
  };
}

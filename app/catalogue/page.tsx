import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { BrandsView } from '@/components/catalogue/CatalogueBrowser';
import { pageMetadata } from '@/lib/seo';
import { getBrands, getProducts, isSanityConfigured } from '@/sanity/lib/data';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';
import {
  brandHref,
  itemHref,
  modelHref,
  resolveBrandSlugFromQuery,
  resolveItemLocationFromQuery,
  resolveModelSlugFromQuery,
} from '@/lib/catalogue/slugs';

export const metadata: Metadata = pageMetadata(
  'Product Catalogue',
  'Japanese seat sets, custom cushions, leather re-trims and interior parts, grouped by vehicle brand.',
  { path: '/catalogue' },
);

type SearchParams = {
  brand?: string | string[];
  model?: string | string[];
  item?: string | string[];
};

function pickFirst(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const brandParam = pickFirst(params.brand);
  const modelParam = pickFirst(params.model);
  const itemParam = pickFirst(params.item);

  // ── Back-compat: redirect old /catalogue?brand=…&model=…&item=… URLs.
  if (brandParam || modelParam || itemParam) {
    // Try to resolve an item param first (it may carry full location).
    if (itemParam) {
      const itemLoc = await resolveItemLocationFromQuery(itemParam);
      if (itemLoc) {
        redirect(
          itemHref(itemLoc.brandSlug, itemLoc.modelSlug, itemLoc.slug),
        );
      }
    }

    const brandSlug = await resolveBrandSlugFromQuery(brandParam);

    if (brandSlug && modelParam && itemParam) {
      const modelSlug = await resolveModelSlugFromQuery(brandSlug, modelParam);
      if (modelSlug) {
        // Assume the item param is already a slug; the dynamic route falls
        // back to the WorkItemNotFound view if it doesn't resolve.
        redirect(itemHref(brandSlug, modelSlug, itemParam));
      }
    }

    if (brandSlug && modelParam) {
      const modelSlug = await resolveModelSlugFromQuery(brandSlug, modelParam);
      if (modelSlug) {
        redirect(modelHref(brandSlug, modelSlug));
      }
    }

    if (brandSlug) {
      redirect(brandHref(brandSlug));
    }
    // If we couldn't resolve the old URL, fall through to the brand grid
    // rather than crashing.
  }

  return (
    <>
      <PageHero
        image="/images/workshop/3.jpeg"
        imageAlt="Catalogued seat sets and interior work"
        eyebrow="Product catalogue"
        title="Browse Our Work"
        subtitle="A growing catalogue of seat sets, cushions, panels and trim work. Tap any item to enquire about your specific model."
      >

      <Section tone="transparent" size="wide" className="!pt-8 sm:!pt-12">
        <Suspense fallback={<CatalogueLoading />}>
          <CatalogueData />
        </Suspense>
      </Section>

      </PageHero>

      <HomepageBackdrop />
    </>
  );
}

async function CatalogueData() {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  return (
    <BrandsView
      sanityBrands={brands}
      products={products}
      showLocalFallback={!isSanityConfigured}
    />
  );
}

function CatalogueLoading() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[6/7] animate-pulse rounded-3xl bg-ink/20 ring-1 ring-hairline"
        />
      ))}
    </div>
  );
}

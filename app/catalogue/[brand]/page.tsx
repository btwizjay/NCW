import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';
import { BrandNotFound, ModelsView } from '@/components/catalogue/CatalogueBrowser';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import {
  getBrandBySlug,
  getModelsForBrandSlug,
  getProductsForBrandSlug,
} from '@/sanity/lib/data';
import {
  brands as localBrands,
  brandHeroImages,
  brandPopularModels,
} from '@/content/brands';
import { brandHref, slugify } from '@/lib/catalogue/slugs';
import type { CatalogueBrand } from '@/sanity/lib/adapters';

type Params = { brand: string };

async function loadBrand(brandSlug: string): Promise<CatalogueBrand | null> {
  const fromSanity = await getBrandBySlug(brandSlug);
  if (fromSanity) return fromSanity;

  // Local-data fallback (Sanity offline or unconfigured).
  const localMatch = localBrands.find((b) => slugify(b) === brandSlug);
  if (!localMatch) return null;
  return {
    id: localMatch,
    name: localMatch,
    slug: slugify(localMatch),
    coverImage: brandHeroImages[localMatch],
    popularModels: brandPopularModels[localMatch] ?? [],
    modelCount: 0,
    workItemCount: 0,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = await loadBrand(brandSlug);
  if (!brand) {
    return pageMetadata('Brand not found');
  }
  return pageMetadata(
    `${brand.name} Vehicle Interior Work`,
    `Japanese seat sets, cushions, leather re-trims and trim work for ${brand.name} vehicles.`,
    { path: brandHref(brand.slug), image: brand.coverImage },
  );
}

export default async function BrandPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { brand: brandSlug } = await params;
  const brand = await loadBrand(brandSlug);

  return (
    <>
      {brand && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              breadcrumbJsonLd([
                { name: 'Catalogue', path: '/catalogue' },
                { name: brand.name },
              ]),
            ),
          }}
        />
      )}
      <PageHero
        image="/images/workshop/3.jpeg"
        imageAlt="Catalogued vehicle interior work"
        eyebrow={brand ? brand.name : 'Catalogue'}
        title={brand ? `${brand.name} models we work on.` : 'Brand not found.'}
        subtitle={
          brand
            ? 'Pick the model to see catalogued seat sets, cushions and trim work for that platform.'
            : 'The brand link you followed does not match any active brand in our catalogue.'
        }
      >

      <Section tone="transparent" size="wide" className="!pt-8 sm:!pt-12">
        {brand ? (
          <BrandContent brandSlug={brandSlug} brand={brand} />
        ) : (
          <BrandNotFound slug={brandSlug} />
        )}
      </Section>

      </PageHero>

      <HomepageBackdrop />
    </>
  );
}

async function BrandContent({
  brandSlug,
  brand,
}: {
  brandSlug: string;
  brand: CatalogueBrand;
}) {
  const [models, products] = await Promise.all([
    getModelsForBrandSlug(brandSlug),
    getProductsForBrandSlug(brandSlug),
  ]);

  const totalCount =
    brand.workItemCount > 0 ? brand.workItemCount : products.length;

  return <ModelsView brand={brand} models={models} totalCount={totalCount} />;
}

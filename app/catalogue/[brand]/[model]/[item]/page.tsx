import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';
import {
  BrandNotFound,
  ModelNotFound,
  WorkItemNotFound,
} from '@/components/catalogue/CatalogueBrowser';
import { WorkItemDetailView } from '@/components/catalogue/WorkItemDetailView';
import { pageMetadata } from '@/lib/seo';
import {
  getBrandBySlug,
  getModelBySlug,
  getProductBySlug,
} from '@/sanity/lib/data';
import {
  brands as localBrands,
  brandHeroImages,
  brandPopularModels,
} from '@/content/brands';
import { slugify } from '@/lib/catalogue/slugs';
import type { CatalogueBrand } from '@/sanity/lib/adapters';

type Params = { brand: string; model: string; item: string };

async function loadBrand(brandSlug: string): Promise<CatalogueBrand | null> {
  const fromSanity = await getBrandBySlug(brandSlug);
  if (fromSanity) return fromSanity;

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
  const { brand: brandSlug, model: modelSlug, item: itemSlug } = await params;
  const product = await getProductBySlug(brandSlug, modelSlug, itemSlug);
  if (!product) {
    return pageMetadata('Work item not found');
  }
  return pageMetadata(
    product.name,
    product.summary ||
      `${product.brand}${product.vehicleModel ? ' ' + product.vehicleModel : ''} ${product.category}`,
  );
}

export default async function WorkItemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { brand: brandSlug, model: modelSlug, item: itemSlug } = await params;

  const [brand, model, product] = await Promise.all([
    loadBrand(brandSlug),
    getModelBySlug(brandSlug, modelSlug),
    getProductBySlug(brandSlug, modelSlug, itemSlug),
  ]);

  return (
    <>
      <PageHero
        image="/images/workshop/3.jpeg"
        imageAlt="Catalogued vehicle interior work"
        eyebrow={`${brand ? brand.name : 'Catalogue'}${model ? ` · ${model.name}` : ''}`}
        title={
          product
            ? product.name
            : brand && !model
              ? 'Vehicle model not found.'
              : !brand
                ? 'Brand not found.'
                : 'Work item not found.'
        }
      >

      <Section tone="transparent" size="wide" className="!pt-8 sm:!pt-12">
        {!brand ? (
          <BrandNotFound slug={brandSlug} />
        ) : !model ? (
          <ModelNotFound
            brandName={brand.name}
            brandSlug={brand.slug}
            modelSlug={modelSlug}
          />
        ) : !product ? (
          <WorkItemNotFound
            brandName={brand.name}
            brandSlug={brand.slug}
            modelName={model.name}
            modelSlug={model.slug}
            itemSlug={itemSlug}
          />
        ) : (
          <WorkItemDetailView
            product={product}
            brandName={brand.name}
            brandSlug={brand.slug}
            modelName={model.name}
            modelSlug={model.slug}
          />
        )}
      </Section>

      </PageHero>

      <HomepageBackdrop />
    </>
  );
}

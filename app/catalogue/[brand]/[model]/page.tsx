import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';
import {
  BrandNotFound,
  ModelNotFound,
  ProductsView,
} from '@/components/catalogue/CatalogueBrowser';
import { pageMetadata } from '@/lib/seo';
import {
  getBrandBySlug,
  getModelBySlug,
  getProductsForBrandModelSlug,
  getProductsForBrandSlug,
} from '@/sanity/lib/data';
import {
  brands as localBrands,
  brandHeroImages,
  brandPopularModels,
} from '@/content/brands';
import { ALL_MODELS_SLUG, slugify } from '@/lib/catalogue/slugs';
import type { CatalogueBrand } from '@/sanity/lib/adapters';

type Params = { brand: string; model: string };

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
  const { brand: brandSlug, model: modelSlug } = await params;
  const brand = await loadBrand(brandSlug);
  if (!brand) return pageMetadata('Brand not found');

  if (modelSlug === ALL_MODELS_SLUG) {
    return pageMetadata(
      `All ${brand.name} Interior Work`,
      `Every catalogued ${brand.name} work item, across all models.`,
    );
  }

  const model = await getModelBySlug(brandSlug, modelSlug);
  if (!model) {
    return pageMetadata(`${brand.name} model not found`);
  }
  return pageMetadata(
    `${brand.name} ${model.name} Interior Work`,
    `${brand.name} ${model.name} seat sets, cushions and trim work.`,
  );
}

export default async function ModelPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { brand: brandSlug, model: modelSlug } = await params;
  const brand = await loadBrand(brandSlug);

  return (
    <>
      <PageHero
        image="/images/workshop/3.jpeg"
        imageAlt="Catalogued vehicle interior work"
        eyebrow="Product catalogue"
        title={brand ? `${brand.name} work, fitted in our workshop.` : 'Brand not found.'}
        subtitle={
          brand
            ? 'Tap any item to see photos and enquire about availability for your specific vehicle.'
            : 'The brand link you followed does not match any active brand in our catalogue.'
        }
      >

      <Section tone="transparent" size="wide" className="!pt-8 sm:!pt-12">
        {brand ? (
          <ModelContent
            brand={brand}
            brandSlug={brandSlug}
            modelSlug={modelSlug}
          />
        ) : (
          <BrandNotFound slug={brandSlug} />
        )}
      </Section>

      </PageHero>

      <HomepageBackdrop />
    </>
  );
}

async function ModelContent({
  brand,
  brandSlug,
  modelSlug,
}: {
  brand: CatalogueBrand;
  brandSlug: string;
  modelSlug: string;
}) {
  if (modelSlug === ALL_MODELS_SLUG) {
    const products = await getProductsForBrandSlug(brandSlug);
    return (
      <ProductsView
        brand={brand}
        modelSlug={ALL_MODELS_SLUG}
        products={products}
      />
    );
  }

  const [model, products] = await Promise.all([
    getModelBySlug(brandSlug, modelSlug),
    getProductsForBrandModelSlug(brandSlug, modelSlug),
  ]);

  if (!model) {
    return (
      <ModelNotFound
        brandName={brand.name}
        brandSlug={brandSlug}
        modelSlug={modelSlug}
      />
    );
  }

  return (
    <ProductsView
      brand={brand}
      modelSlug={model.slug}
      modelName={model.name}
      products={products}
    />
  );
}

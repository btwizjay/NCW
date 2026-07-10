// Public data layer. Components import only from here so the underlying
// source (Sanity ↔ local TS data) can change without touching consumers.

import { products as localProducts, type Product } from '@/content/products';
import { sanityClient } from './client';
import {
  brandsQuery,
  brandBySlugQuery,
  brandSlugByNameQuery,
  allModelsQuery,
  modelsForBrandSlugQuery,
  modelBySlugQuery,
  modelSlugByNameQuery,
  productsQuery,
  productsForBrandSlugQuery,
  productsForBrandModelSlugQuery,
  productBySlugQuery,
  productSlugByTitleQuery,
  featuredProductsQuery,
} from './queries';
import {
  adaptProduct,
  adaptBrand,
  adaptModel,
  type CatalogueBrand,
  type CatalogueModel,
} from './adapters';

const REVALIDATE = { next: { revalidate: 10 } } as const;

// True only when no Sanity project is wired up at all (local dev without
// env vars, or a build missing the client). Once a project is configured,
// an empty result set means "no content yet" and must be shown honestly —
// never masked with local placeholder data.
export const isSanityConfigured = Boolean(sanityClient);

// ── Brands ────────────────────────────────────────────────────

export async function getBrands(): Promise<CatalogueBrand[]> {
  if (!sanityClient) return [];
  try {
    const docs = await sanityClient.fetch<Parameters<typeof adaptBrand>[0][]>(
      brandsQuery,
      {},
      REVALIDATE,
    );
    console.log(`[sanity] getBrands: ${docs?.length ?? 0} docs`);
    if (!docs || docs.length === 0) return [];
    return docs.map(adaptBrand);
  } catch (err) {
    console.warn('[sanity] getBrands failed:', err);
    return [];
  }
}

export async function getBrandBySlug(
  brandSlug: string,
): Promise<CatalogueBrand | null> {
  if (!sanityClient) return null;
  try {
    const doc = await sanityClient.fetch<Parameters<typeof adaptBrand>[0] | null>(
      brandBySlugQuery,
      { brandSlug },
      REVALIDATE,
    );
    return doc ? adaptBrand(doc) : null;
  } catch (err) {
    console.warn('[sanity] getBrandBySlug failed:', err);
    return null;
  }
}

// Used by the back-compat redirect to map an old `?brand=Toyota` URL to a slug.
export async function resolveBrandSlugFromName(
  brandName: string,
): Promise<string | null> {
  if (!sanityClient) return null;
  try {
    const slug = await sanityClient.fetch<string | null>(
      brandSlugByNameQuery,
      { brandName },
      REVALIDATE,
    );
    return slug ?? null;
  } catch (err) {
    console.warn('[sanity] resolveBrandSlugFromName failed:', err);
    return null;
  }
}

// ── Vehicle Models ────────────────────────────────────────────

export async function getModels(): Promise<CatalogueModel[]> {
  if (!sanityClient) return [];
  try {
    const docs = await sanityClient.fetch<Parameters<typeof adaptModel>[0][]>(
      allModelsQuery,
      {},
      REVALIDATE,
    );
    console.log(`[sanity] getModels: ${docs?.length ?? 0} docs`);
    if (!docs || docs.length === 0) return [];
    return docs.map(adaptModel);
  } catch (err) {
    console.warn('[sanity] getModels failed:', err);
    return [];
  }
}

export async function getModelsForBrandSlug(
  brandSlug: string,
): Promise<CatalogueModel[]> {
  if (!sanityClient) return [];
  try {
    const docs = await sanityClient.fetch<Parameters<typeof adaptModel>[0][]>(
      modelsForBrandSlugQuery,
      { brandSlug },
      REVALIDATE,
    );
    return (docs ?? []).map(adaptModel);
  } catch (err) {
    console.warn('[sanity] getModelsForBrandSlug failed:', err);
    return [];
  }
}

export async function getModelBySlug(
  brandSlug: string,
  modelSlug: string,
): Promise<CatalogueModel | null> {
  if (!sanityClient) return null;
  try {
    const doc = await sanityClient.fetch<Parameters<typeof adaptModel>[0] | null>(
      modelBySlugQuery,
      { brandSlug, modelSlug },
      REVALIDATE,
    );
    return doc ? adaptModel(doc) : null;
  } catch (err) {
    console.warn('[sanity] getModelBySlug failed:', err);
    return null;
  }
}

export async function resolveModelSlugFromName(
  brandSlug: string,
  modelName: string,
): Promise<string | null> {
  if (!sanityClient) return null;
  try {
    const slug = await sanityClient.fetch<string | null>(
      modelSlugByNameQuery,
      { brandSlug, modelName },
      REVALIDATE,
    );
    return slug ?? null;
  } catch (err) {
    console.warn('[sanity] resolveModelSlugFromName failed:', err);
    return null;
  }
}

// ── Products / Work Items ─────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  if (!sanityClient) return localProducts;
  try {
    const docs = await sanityClient.fetch<Parameters<typeof adaptProduct>[0][]>(
      productsQuery,
      {},
      REVALIDATE,
    );
    console.log(`[sanity] getProducts: ${docs?.length ?? 0} docs`);
    return (docs ?? []).map(adaptProduct);
  } catch (err) {
    console.warn('[sanity] getProducts fell back to local data:', err);
    return localProducts;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!sanityClient) return [];
  try {
    const docs = await sanityClient.fetch<Parameters<typeof adaptProduct>[0][]>(
      featuredProductsQuery,
      {},
      REVALIDATE,
    );
    if (!docs || docs.length === 0) return [];
    return docs.map(adaptProduct);
  } catch (err) {
    console.warn('[sanity] getFeaturedProducts failed:', err);
    return [];
  }
}

export async function getProductsForBrandSlug(
  brandSlug: string,
): Promise<Product[]> {
  if (!sanityClient) return [];
  try {
    const docs = await sanityClient.fetch<Parameters<typeof adaptProduct>[0][]>(
      productsForBrandSlugQuery,
      { brandSlug },
      REVALIDATE,
    );
    return (docs ?? []).map(adaptProduct);
  } catch (err) {
    console.warn('[sanity] getProductsForBrandSlug failed:', err);
    return [];
  }
}

export async function getProductsForBrandModelSlug(
  brandSlug: string,
  modelSlug: string,
): Promise<Product[]> {
  if (!sanityClient) return [];
  try {
    const docs = await sanityClient.fetch<Parameters<typeof adaptProduct>[0][]>(
      productsForBrandModelSlugQuery,
      { brandSlug, modelSlug },
      REVALIDATE,
    );
    return (docs ?? []).map(adaptProduct);
  } catch (err) {
    console.warn('[sanity] getProductsForBrandModelSlug failed:', err);
    return [];
  }
}

export async function getProductBySlug(
  brandSlug: string,
  modelSlug: string,
  itemSlug: string,
): Promise<Product | null> {
  if (!sanityClient) return null;
  try {
    const doc = await sanityClient.fetch<Parameters<typeof adaptProduct>[0] | null>(
      productBySlugQuery,
      { brandSlug, modelSlug, itemSlug },
      REVALIDATE,
    );
    return doc ? adaptProduct(doc) : null;
  } catch (err) {
    console.warn('[sanity] getProductBySlug failed:', err);
    return null;
  }
}

// Used by the back-compat redirect: try to recover brand/model/item slugs from
// an old `?item=...` value. The query first matches against the work item's
// title (display name); callers should also try the value as-is in case it is
// already a slug.
export async function resolveProductLocationByTitle(
  itemTitle: string,
): Promise<{ slug: string; brandSlug: string; modelSlug: string } | null> {
  if (!sanityClient) return null;
  try {
    const doc = await sanityClient.fetch<{
      slug?: string;
      brandSlug?: string;
      modelSlug?: string;
    } | null>(productSlugByTitleQuery, { itemTitle }, REVALIDATE);
    if (!doc?.slug || !doc.brandSlug || !doc.modelSlug) return null;
    return {
      slug: doc.slug,
      brandSlug: doc.brandSlug,
      modelSlug: doc.modelSlug,
    };
  } catch (err) {
    console.warn('[sanity] resolveProductLocationByTitle failed:', err);
    return null;
  }
}

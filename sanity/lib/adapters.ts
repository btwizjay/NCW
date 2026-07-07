import type { Product } from '@/content/products';
import type { Brand } from '@/content/brands';
import { urlForImage } from './image';

// ── Brand adapter ─────────────────────────────────────────────

export type CatalogueBrand = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  popularModels: string[];
  modelCount: number;
  workItemCount: number;
};

type SanityBrand = {
  _id: string;
  name: string;
  slug?: string;
  logo?: unknown;
  coverImage?: unknown;
  popularModels?: string[];
  order?: number;
  modelCount?: number;
  workItemCount?: number;
};

export function adaptBrand(doc: SanityBrand): CatalogueBrand {
  return {
    id: doc._id,
    name: doc.name,
    slug: doc.slug ?? doc.name.toLowerCase().replace(/\s+/g, '-'),
    logo: urlForImage(doc.logo)?.width(200).format('webp').url() ?? undefined,
    coverImage:
      urlForImage(doc.coverImage)?.width(800).format('webp').url() ?? undefined,
    popularModels: doc.popularModels ?? [],
    modelCount: doc.modelCount ?? 0,
    workItemCount: doc.workItemCount ?? 0,
  };
}

// ── Vehicle Model adapter ─────────────────────────────────────

export type CatalogueModel = {
  id: string;
  name: string;
  slug: string;
  coverImage?: string;
  shortNote?: string;
  brandName: string;
  brandSlug: string;
  workItemCount: number;
};

type SanityModel = {
  _id: string;
  name: string;
  slug?: string;
  coverImage?: unknown;
  shortNote?: string;
  brandName?: string;
  brandSlug?: string;
  workItemCount?: number;
};

export function adaptModel(doc: SanityModel): CatalogueModel {
  return {
    id: doc._id,
    name: doc.name,
    slug: doc.slug ?? doc.name.toLowerCase().replace(/\s+/g, '-'),
    coverImage:
      urlForImage(doc.coverImage)?.width(800).format('webp').url() ?? undefined,
    shortNote: doc.shortNote,
    brandName: doc.brandName ?? '',
    brandSlug:
      doc.brandSlug ?? (doc.brandName ?? '').toLowerCase().replace(/\s+/g, '-'),
    workItemCount: doc.workItemCount ?? 0,
  };
}

// ── Work Item (Product) adapter ───────────────────────────────

type SanityProduct = {
  _id: string;
  title: string;
  slug?: string;
  brandName?: string;
  brandSlug?: string;
  modelName?: string;
  modelSlug?: string;
  category?: Product['category'];
  summary?: string;
  longDescription?: string;
  image?: unknown;
  gallery?: unknown[];
  order?: number;
  featured?: boolean;
  whatsappMessage?: string;
};

// Stable placeholder used when a work item has no uploaded image.
const WORK_ITEM_PLACEHOLDER = 'https://picsum.photos/seed/ncw-placeholder/1200/900';

export function adaptProduct(doc: SanityProduct): Product {
  const cardImage =
    urlForImage(doc.image)?.width(1200).format('webp').url() ||
    WORK_ITEM_PLACEHOLDER;

  const gallery = (doc.gallery ?? [])
    .map((src) =>
      urlForImage(src)?.width(1600).format('webp').url() ?? null,
    )
    .filter((url): url is string => Boolean(url));

  return {
    id: doc.slug ?? doc._id,
    brand: (doc.brandName ?? '') as Brand,
    brandSlug:
      doc.brandSlug ?? (doc.brandName ?? '').toLowerCase().replace(/\s+/g, '-'),
    name: doc.title ?? 'Untitled',
    category: doc.category ?? 'Seat Set',
    summary: doc.summary ?? '',
    image: cardImage,
    featured: doc.featured ?? false,
    vehicleModel: doc.modelName,
    modelSlug:
      doc.modelSlug ?? (doc.modelName ?? '').toLowerCase().replace(/\s+/g, '-'),
    whatsappMessage: doc.whatsappMessage,
    gallery: gallery.length > 0 ? gallery : undefined,
    longDescription: doc.longDescription?.trim() || undefined,
  };
}

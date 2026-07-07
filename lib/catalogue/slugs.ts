// Helpers used by the catalogue routes and the back-compat redirect at
// /catalogue?brand=…&model=…&item=… → /catalogue/<brand>/<model>/<item>.
// Old query-param URLs used display names; new URLs use Sanity slugs.
import { brands as localBrands } from '@/content/brands';
import {
  resolveBrandSlugFromName,
  resolveModelSlugFromName,
  resolveProductLocationByTitle,
} from '@/sanity/lib/data';

export const ALL_MODELS_SLUG = 'all';

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function catalogueIndexHref(): string {
  return '/catalogue';
}

export function brandHref(brandSlug: string): string {
  return `/catalogue/${encodeURIComponent(brandSlug)}`;
}

export function modelHref(brandSlug: string, modelSlug: string): string {
  return `/catalogue/${encodeURIComponent(brandSlug)}/${encodeURIComponent(modelSlug)}`;
}

export function itemHref(
  brandSlug: string,
  modelSlug: string,
  itemSlug: string,
): string {
  return `/catalogue/${encodeURIComponent(brandSlug)}/${encodeURIComponent(
    modelSlug,
  )}/${encodeURIComponent(itemSlug)}`;
}

// Resolve a brand value from an old query param (`?brand=Toyota` or
// `?brand=toyota`) to the canonical Sanity slug. Falls back to a slugified
// local brand name so the redirect still works when Sanity is offline.
export async function resolveBrandSlugFromQuery(
  raw: string | null | undefined,
): Promise<string | null> {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;

  const fromSanity = await resolveBrandSlugFromName(value);
  if (fromSanity) return fromSanity;

  const localMatch = localBrands.find(
    (b) => b.toLowerCase() === value.toLowerCase(),
  );
  if (localMatch) return slugify(localMatch);

  // The value already looks slug-like (e.g. `toyota`) — preserve it as-is.
  return slugify(value);
}

export async function resolveModelSlugFromQuery(
  brandSlug: string,
  raw: string | null | undefined,
): Promise<string | null> {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;

  // Special sentinel from the old client routing: "__all__" meant
  // "everything under this brand".
  if (value === '__all__') return ALL_MODELS_SLUG;

  const fromSanity = await resolveModelSlugFromName(brandSlug, value);
  if (fromSanity) return fromSanity;

  return slugify(value);
}

export async function resolveItemLocationFromQuery(
  raw: string | null | undefined,
): Promise<{ slug: string; brandSlug: string; modelSlug: string } | null> {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;

  // Old item param was already a slug (Sanity slug.current). Try resolving by
  // title first in case any old links used the display name.
  const byTitle = await resolveProductLocationByTitle(value);
  if (byTitle) return byTitle;

  return null;
}

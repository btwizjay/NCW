import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

/**
 * Build a Sanity CDN URL for an image source.
 * Returns null when Sanity isn't configured or the source is missing.
 * The source type is widened to `any` — image objects come from
 * untrusted GROQ responses and the underlying builder accepts both
 * asset references and full image documents.
 */
export function urlForImage(source: unknown) {
  if (!builder || !source) return null;
  return builder.image(source as never);
}

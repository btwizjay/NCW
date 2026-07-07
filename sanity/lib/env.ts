// Centralised env access for Sanity. The site falls back to local TS content
// when Sanity isn't configured, so these can all be undefined safely.

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

/** True when the site has enough config to talk to Sanity. */
export const isSanityConfigured = Boolean(sanityProjectId);

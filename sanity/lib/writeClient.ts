import { createClient } from 'next-sanity';
import { sanityProjectId, sanityDataset, sanityApiVersion } from './env';

// Server-only Sanity client with write access, used by the booking API to
// persist appointments. Requires SANITY_API_WRITE_TOKEN (an Editor token from
// sanity.io/manage → API → Tokens). Never import this into client components.
//
// Null when the project or token isn't configured, so callers must null-check.
const token = process.env.SANITY_API_WRITE_TOKEN;

export const sanityWriteClient =
  sanityProjectId && token
    ? createClient({
        projectId: sanityProjectId,
        dataset: sanityDataset,
        apiVersion: sanityApiVersion,
        token,
        useCdn: false,
        // Bookings need accurate freshness, never stale CDN reads.
        perspective: 'published',
      })
    : null;

export const isBookingPersistenceConfigured = Boolean(sanityWriteClient);

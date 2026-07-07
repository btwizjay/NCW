import { createClient } from 'next-sanity';
import {
  sanityProjectId,
  sanityDataset,
  sanityApiVersion,
} from './env';

// Returns a configured Sanity client when env vars are present, otherwise null.
// Consumers (data layer / image helper) must null-check before using.
// Dev: bypass CDN so Studio publishes appear immediately on the website.
// Production: use CDN for fast page loads (updates appear within ~10s via
// the revalidate window in data.ts).
export const sanityClient = sanityProjectId
  ? createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: process.env.NODE_ENV === 'production',
    })
  : null;

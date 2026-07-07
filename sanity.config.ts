import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { structure } from './sanity/studioStructure';
import {
  confirmBookingAction,
  completeBookingAction,
  whatsappReminderAction,
  cancelBookingAction,
} from './sanity/actions/bookingActions';

// Studio configuration. Reads project + dataset from env so the same config
// works locally, in preview deploys, and in production. `placeholder` keeps
// the build green when env vars aren't set yet — the Studio simply won't
// load at runtime until real values are provided.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

export default defineConfig({
  name: 'default',
  title: 'Nilantha Cushion Works',
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: { types: schemaTypes },
  document: {
    // Surface the booking workflow actions (confirm / complete / WhatsApp
    // reminder / cancel) ahead of the default Studio actions, for bookings only.
    actions: (prev, context) =>
      context.schemaType === 'booking'
        ? [
            confirmBookingAction,
            completeBookingAction,
            whatsappReminderAction,
            cancelBookingAction,
            ...prev,
          ]
        : prev,
  },
});

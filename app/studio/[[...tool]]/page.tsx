/**
 * Sanity Studio mount point. Visiting /studio loads the full editing UI.
 * Sanity handles auth — visitors who aren't logged into the project see a
 * login screen.
 *
 * The page itself is a server component (so it can export `metadata` and
 * `viewport`), and delegates rendering to the client-only `Studio`
 * component which contains the NextStudio embed.
 */

import { Studio } from './Studio';

export const dynamic = 'force-static';

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <Studio />;
}

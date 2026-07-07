// The page background is intentionally ONE uniform colour: the white from
// <body> (bg-surface) flows continuously behind every section and behind the
// footer — no gradient, tint or band — so there is no seam or shade change
// anywhere above the floating footer card. The card lifts off this shared white
// purely via its own soft drop shadow (see Footer.tsx), never via a different
// background colour on the surrounding area.
//
// Kept as a no-op render so the existing per-page imports stay valid; there is
// deliberately no decorative backdrop layer.
export function HomepageBackdrop() {
  return null;
}

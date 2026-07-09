'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const EASE_SOFT = [0.22, 0.61, 0.36, 1] as const;

// Wraps every route's content so navigating between pages reads as a soft
// cut instead of a hard swap — a brief fade + lift on the way out, fade + settle
// on the way in. Kept short (well under half a second total) so it never feels
// like it's holding up the tap; on mobile, where every nav is a tap-and-wait,
// this is the single biggest lever for making the site feel considered rather
// than static.
//
// `mode="wait"` (exit fully finishes before enter starts) is deliberate: pages
// here rely on scroll-linked measurements (PageHero's sticky reveal, the
// scroll-driven showcase) that need a clean, un-overlapped mount rather than
// the two pages sharing the viewport mid-transition.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_SOFT } }}
        exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: EASE_SOFT } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

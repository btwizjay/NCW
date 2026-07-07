'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { frame, cancelFrame } from 'framer-motion';
import { setLenis } from '@/lib/lenis';

// Site-wide momentum smooth scrolling. Lenis is driven from framer-motion's own
// frame loop so it stays perfectly in sync with the hero parallax (no jitter),
// and it's disabled entirely under prefers-reduced-motion.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenis(lenis);

    const update = (data: { timestamp: number }) => lenis.raf(data.timestamp);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}

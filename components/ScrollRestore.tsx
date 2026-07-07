'use client';

import { useEffect } from 'react';
import { getLenis } from '@/lib/lenis';

const KEY = '__ncw_scrollY';

export function ScrollRestore() {
  useEffect(() => {
    const nav = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming | undefined;

    if (nav?.type === 'reload') {
      try {
        const raw = sessionStorage.getItem(KEY);
        if (raw) {
          const { y, path } = JSON.parse(raw);
          if (path === window.location.pathname + window.location.search) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                // Go through Lenis when it's active so it doesn't snap back.
                const lenis = getLenis();
                if (lenis) lenis.scrollTo(y, { immediate: true });
                else window.scrollTo({ top: y, behavior: 'instant' });
              });
            });
          }
        }
      } catch {}
    }

    try {
      sessionStorage.removeItem(KEY);
    } catch {}

    const onBeforeUnload = () => {
      try {
        sessionStorage.setItem(
          KEY,
          JSON.stringify({
            y: window.scrollY,
            path: window.location.pathname + window.location.search,
          }),
        );
      } catch {}
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  return null;
}

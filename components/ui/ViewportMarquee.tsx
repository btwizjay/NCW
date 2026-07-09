'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

// Wraps a CSS-driven marquee track (.marquee-track / .marquee-track-right in
// globals.css) so the infinite scroll animation pauses via IntersectionObserver
// once it's off-screen, instead of running forever regardless of scroll
// position. Renders the track element itself (ref + pause class live on the
// same node) — drop-in replacement for a plain `<div className="marquee-track ...">`.
export function ViewportMarquee({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), {
      rootMargin: '200px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn(className, paused && '[animation-play-state:paused]')}>
      {children}
    </div>
  );
}

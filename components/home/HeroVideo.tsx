'use client';

import { useEffect, useRef } from 'react';

// The hero's looping background video: only starts once it's actually
// on-screen, pauses again once scrolled past (IntersectionObserver), and
// never plays at all under prefers-reduced-motion or a metered/data-saver
// connection — the poster frame carries the shot in that case. Playback is
// driven entirely from an effect (no `autoPlay` attribute), so server and
// client render identical markup and there's no hydration mismatch.
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let allowed = true;
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) allowed = false;
      const conn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
      if (conn?.saveData) allowed = false;
    } catch {}
    if (!allowed) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
      poster="/videos/hero-poster.jpg"
      aria-hidden="true"
    >
      <source src="/videos/hero-workshop.mp4" type="video/mp4" />
    </video>
  );
}

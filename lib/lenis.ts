import type Lenis from 'lenis';

// Holds the single Lenis instance created by <SmoothScroll>, so other client
// components (ScrollRestore, the mobile menu) can cooperate with smooth
// scrolling instead of fighting it. Null when Lenis is inactive
// (server, before mount, or prefers-reduced-motion).
let instance: Lenis | null = null;

export function setLenis(value: Lenis | null) {
  instance = value;
}

export function getLenis(): Lenis | null {
  return instance;
}

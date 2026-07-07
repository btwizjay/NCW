// A single, page-spanning ambient layer. Rendered once per page as a sibling of
// the page content. Because <main> is not positioned, this absolute element is
// laid out against <body> (which is position: relative) and therefore covers
// the FULL document height — so the soft gradient flows continuously behind
// every section with no per-section clipping or seams.
//
// Subtle & airy by design: pale washes drifting behind mostly-white space,
// sitting behind all content at -z-10. Motion is gated by prefers-reduced-motion
// via the .animate-aurora utility.
export function PageAtmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Faint dotted grid — confined to the top of the page, fading downward. */}
      <div
        className="absolute inset-x-0 top-0 h-[60rem] bg-grid-faint opacity-60"
        style={{
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
        }}
      />

      {/* Drifting aurora washes, distributed down the whole document so the
          field reads as one continuous atmosphere rather than a header glow. */}
      <div className="absolute -top-24 right-[-10%] h-[34rem] w-[34rem] rounded-full bg-accent-soft opacity-70 blur-3xl animate-aurora" />
      <div
        className="absolute left-[-12%] top-[26%] h-[30rem] w-[30rem] rounded-full opacity-60 blur-3xl animate-aurora"
        style={{ background: 'rgba(169,25,22,0.06)', animationDelay: '-6s' }}
      />
      <div
        className="absolute right-[-10%] top-[55%] h-[32rem] w-[32rem] rounded-full bg-accent-soft opacity-50 blur-3xl animate-aurora"
        style={{ animationDelay: '-10s' }}
      />
      <div
        className="absolute left-[-8%] top-[82%] h-[26rem] w-[26rem] rounded-full opacity-50 blur-3xl animate-aurora"
        style={{ background: 'rgba(36,56,139,0.05)', animationDelay: '-3s' }}
      />
    </div>
  );
}

// Studio-specific layout. Hides the site's Header / Footer / WhatsApp FAB
// so Sanity Studio gets the full viewport. Adds a small "← Back to website"
// link in the bottom-left corner so the user can navigate home.

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Hide site shell elements rendered by the root layout. The selectors
          target the root layout's direct-child <header>, <footer>, the
          skip-to-content link, and the WhatsApp FAB. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body > header,
            body > footer,
            body > a[href="#main"],
            body > a[aria-label="Chat with us on WhatsApp"] {
              display: none !important;
            }
            #main {
              padding: 0;
              margin: 0;
            }
          `,
        }}
      />

      {children}

      <a
        href="/"
        className="fixed bottom-5 left-5 z-[200] inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-[13px] font-medium text-ink shadow-soft ring-1 ring-hairline transition-colors hover:bg-surface-alt"
      >
        ← Back to website
      </a>
    </>
  );
}

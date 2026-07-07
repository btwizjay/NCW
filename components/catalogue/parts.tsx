import Link from 'next/link';

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 text-[13px]"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-ink-muted transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-ink">{item.label}</span>
            )}
            {!isLast && <span className="text-ink-subtle">/</span>}
          </span>
        );
      })}
    </nav>
  );
}

export function ViewHeader({
  eyebrow,
  title,
  meta,
  topSpacing = false,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
  topSpacing?: boolean;
}) {
  return (
    <div
      className={`mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6 ${
        topSpacing ? 'mt-6' : ''
      }`}
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-balance text-[20px] tracking-tight sm:text-[24px] md:text-[30px] leading-[1.15]">
          {title}
        </h2>
      </div>
      {meta && (
        <p className="text-[13px] text-ink-subtle sm:text-right">{meta}</p>
      )}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl bg-surface p-10 text-center ring-1 ring-hairline sm:p-14">
      <h3 className="text-[15px] tracking-tight sm:text-[16px] leading-[1.2]">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-ink-muted">
        {body}
      </p>
    </div>
  );
}

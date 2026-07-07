import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { waLink, waMessage } from '@/lib/whatsapp';

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-ink-subtle transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
            {!isLast && <span className="text-hairline">/</span>}
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
      className={`mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 ${
        topSpacing ? 'mt-6' : ''
      }`}
    >
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-balance text-[20px] tracking-tight sm:text-[24px] md:text-[30px] leading-[1.15]">
          {title}
        </h2>
      </div>
      {meta && (
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {meta.split('·').map((part) => (
            <span
              key={part.trim()}
              className="rounded-full px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted ring-1 ring-hairline"
            >
              {part.trim()}
            </span>
          ))}
        </div>
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
      <div className="mt-7 flex justify-center">
        <Button
          href={waLink(waMessage('I would like a quote for my vehicle interior.', 'catalogue'))}
          external
          variant="whatsapp"
          size="sm"
          iconLeft={<WhatsAppIcon className="h-4 w-4" />}
        >
          Send a photo on WhatsApp
        </Button>
      </div>
    </div>
  );
}

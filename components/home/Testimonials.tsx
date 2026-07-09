'use client';

import { SectionHeader } from '@/components/ui/Section';
import { QuoteIcon, StarIcon } from '@/components/ui/Icons';
import { ViewportMarquee } from '@/components/ui/ViewportMarquee';
import { testimonials, type Testimonial } from '@/content/testimonials';
import { cn } from '@/lib/cn';

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[340px] flex-shrink-0 rounded-2xl bg-surface-alt p-6 ring-1 ring-hairline sm:w-[380px]">
      <QuoteIcon className="h-6 w-6 text-accent/40" aria-hidden="true" />

      <blockquote className="mt-4 text-pretty text-[15px] leading-[1.6] tracking-tight text-ink">
        {t.quote}
      </blockquote>

      <div className="mt-5 flex items-center gap-1 text-accent" aria-label="Five out of five stars">
        {Array.from({ length: 5 }).map((_, k) => (
          <StarIcon key={k} className="h-3 w-3" />
        ))}
      </div>

      <figcaption className="mt-4 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-semibold tracking-tight text-white"
        >
          {t.name
            .replace(/\./g, '')
            .split(/\s+/)
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()}
        </span>
        <div className="min-w-0">
          <span className="block text-[13px] font-semibold tracking-tight text-ink">
            {t.name}
          </span>
          <span className="block text-[12px] text-ink-subtle">
            {t.vehicle}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}

function MarqueeRow({
  items,
  direction,
  slow,
}: {
  items: Testimonial[];
  direction: 'left' | 'right';
  slow?: boolean;
}) {
  const looped = [...items, ...items];
  const trackClass = direction === 'left' ? 'marquee-track' : 'marquee-track-right';

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 4rem, black calc(100% - 4rem), transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 4rem, black calc(100% - 4rem), transparent)',
      }}
    >
      <ViewportMarquee
        className={cn('flex w-max select-none items-stretch gap-5', trackClass, slow && 'marquee-track-slow')}
      >
        {looped.map((t, i) => (
          <div key={`${t.name}-${i}`} aria-hidden={i >= items.length || undefined}>
            <TestimonialCard t={t} />
          </div>
        ))}
      </ViewportMarquee>
    </div>
  );
}

export function Testimonials() {
  const reversed = [...testimonials].reverse();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="From our customers"
          title="Plain words from drivers we've worked with."
          align="center"
        />
      </div>

      <div className="mt-14 flex flex-col gap-5">
        <MarqueeRow items={testimonials} direction="left" />
        <MarqueeRow items={reversed} direction="right" slow />
      </div>
    </section>
  );
}

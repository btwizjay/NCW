import Image from 'next/image';
import Link from 'next/link';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { services, type Service } from '@/content/services';
import { cn } from '@/lib/cn';

// One editorial card in the preview mosaic. The whole card is a deep link to
// its service on the services page. Affordances are persistent (numbered chip
// + arrow button) so touch users see them too; hover adds the reveal polish.
function ServiceCard({
  service,
  index,
  feature = false,
  sizes,
  className,
}: {
  service: Service;
  index: number;
  feature?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <Link
      href={`/services#${service.slug}`}
      className={cn(
        'group relative flex flex-col justify-end overflow-hidden rounded-3xl bg-surface-alt ring-1 ring-hairline transition-shadow duration-300 hover:shadow-lift',
        className,
      )}
    >
      <Image
        src={service.image}
        alt={service.title}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
      />

      {/* Legibility wash — short and soft, deepening slightly on hover so the
          photo stays the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
      />

      {/* Index chip. */}
      <span className="absolute left-4 top-4 z-10 rounded-full bg-black/35 px-3 py-1.5 font-pirulen text-[10px] leading-none text-white/85 ring-1 ring-white/20 backdrop-blur-sm sm:left-5 sm:top-5">
        0{index + 1}
      </span>

      {/* Arrow affordance — always visible, warms up on hover. */}
      <span
        aria-hidden="true"
        className="absolute bottom-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-sm transition-all duration-300 ease-soft group-hover:bg-white group-hover:ring-white sm:bottom-5 sm:right-5"
      >
        <ArrowRightIcon className="h-4 w-4 -rotate-45 text-white transition-all duration-300 ease-soft group-hover:rotate-0 group-hover:text-ink" />
      </span>

      <div className="relative z-10 p-5 pr-16 sm:p-6 sm:pr-20">
        <h3
          className={cn(
            'tracking-tight !text-white leading-[1.15]',
            feature ? 'text-[19px] sm:text-[23px]' : 'text-[16px] sm:text-[18px]',
          )}
        >
          {service.title}
        </h3>
        <p
          className={cn(
            'mt-2 leading-snug text-white/75',
            feature ? 'max-w-md text-[14px] sm:text-[15px]' : 'text-[13.5px] line-clamp-2',
          )}
        >
          {service.summary}
        </p>
      </div>
    </Link>
  );
}

export function ServicesPreview() {
  const [feature, ...rest] = services.slice(0, 3);
  const more = services.slice(3);

  return (
    <Section tone="transparent" size="wide" spacing="tight" className="!pt-16 sm:!pt-24 !pb-10 sm:!pb-12">
      {/* Header row — count + CTA anchored to the title baseline. */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="What we do"
          title="Cabin work, done with patience."
          description="From a single cushion to a complete interior, every job is finished by hand and signed off in person."
        />
        <div className="flex shrink-0 items-center gap-5 md:pb-1">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
            {String(services.length).padStart(2, '0')} services
          </span>
          <Button
            href="/services"
            variant="secondary"
            size="sm"
            iconRight={<ArrowRightIcon className="h-3.5 w-3.5" />}
          >
            See all
          </Button>
        </div>
      </div>

      {/* Editorial mosaic — one feature card, two supporting cards. */}
      <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:grid-rows-2">
        <ServiceCard
          service={feature}
          index={0}
          feature
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="aspect-[4/3] sm:aspect-[16/9] lg:col-span-7 lg:row-span-2 lg:aspect-auto"
        />
        {rest.map((service, i) => (
          <ServiceCard
            key={service.slug}
            service={service}
            index={i + 1}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="aspect-[16/9] lg:col-span-5 lg:aspect-auto lg:min-h-[15rem]"
          />
        ))}
      </div>

      {/* The rest of the catalogue, one hairline row deep. */}
      {more.length > 0 && (
        <div className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-2.5">
          <span className="mr-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
            Also
          </span>
          {more.map((service) => (
            <Link
              key={service.slug}
              href={`/services#${service.slug}`}
              className="group inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-ink-muted ring-1 ring-hairline transition-all duration-200 hover:text-ink hover:ring-ink/30"
            >
              {service.title}
              <ArrowRightIcon className="h-3 w-3 text-ink-subtle transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}

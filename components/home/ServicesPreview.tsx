import Image from 'next/image';
import Link from 'next/link';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { services } from '@/content/services';

export function ServicesPreview() {
  const featured = services.slice(0, 3);

  return (
    <Section tone="transparent" size="wide" spacing="tight" className="!pt-16 sm:!pt-24 !pb-10 sm:!pb-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="What we do"
          title="Cabin work, done with patience."
          description="From a single cushion to a complete interior — every job is finished by hand and signed off in person."
        />
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-[15px] font-medium text-ink hover:text-accent"
        >
          See all services
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((service) => (
          <Link
            key={service.slug}
            href="/services"
            className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-surface-alt ring-1 ring-hairline transition-shadow duration-300 hover:shadow-lift"
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent"
            />
            <div className="relative z-10 p-6">
              <h3 className="text-[15px] tracking-tight !text-white sm:text-[16px] leading-[1.2]">{service.title}</h3>
              <p className="mt-2 text-[14px] leading-snug text-white/70">{service.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

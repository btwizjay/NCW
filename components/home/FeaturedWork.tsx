import Image from 'next/image';
import Link from 'next/link';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ArrowRightIcon } from '@/components/ui/Icons';
import type { Product } from '@/content/products';
import { itemHref, slugify } from '@/lib/catalogue/slugs';

type Props = {
  products: Product[];
};

export function FeaturedWork({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <Section tone="transparent" size="wide" spacing="tight" className="!pt-10 sm:!pt-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Featured work"
          title="A small selection from the workshop."
          titleClassName="md:whitespace-nowrap"
          description="Recent jobs across vans, jeeps and family cars. The full catalogue is grouped by brand."
        />
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-[15px] font-medium text-ink hover:text-accent"
        >
          Browse full catalogue
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const brandSlug = p.brandSlug ?? slugify(p.brand);
          const modelSlug =
            p.modelSlug ?? (p.vehicleModel ? slugify(p.vehicleModel) : 'all');
          const href = itemHref(brandSlug, modelSlug, p.id);

          return (
          <Link
            key={p.id}
            href={href}
            className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-ink ring-1 ring-hairline transition-shadow duration-300 hover:shadow-lift"
          >
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.04]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/65 to-transparent"
            />
            <div className="relative z-10 p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/80">
                {p.brand}
              </p>
              <h3 className="mt-1.5 text-[15px] tracking-tight text-white sm:text-[16px] leading-[1.2]">
                {p.name}
              </h3>
            </div>
          </Link>
          );
        })}
      </div>
    </Section>
  );
}

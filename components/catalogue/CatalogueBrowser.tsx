import Image from 'next/image';
import Link from 'next/link';
import {
  brands as localBrands,
  brandHeroImages,
  brandColorLogos,
  brandPopularModels,
  type Brand,
} from '@/content/brands';
import type { Product } from '@/content/products';
import type { CatalogueBrand, CatalogueModel } from '@/sanity/lib/adapters';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { waLink, waMessage } from '@/lib/whatsapp';
import {
  ALL_MODELS_SLUG,
  brandHref,
  catalogueIndexHref,
  itemHref,
  modelHref,
  slugify,
} from '@/lib/catalogue/slugs';
import { Breadcrumbs, EmptyState, ViewHeader } from './parts';

/* ─── Brands view ──────────────────────────────────────────────── */

type BrandsViewProps = {
  sanityBrands?: CatalogueBrand[];
  products: Product[];
};

export function BrandsView({ sanityBrands = [], products }: BrandsViewProps) {
  const brands: CatalogueBrand[] =
    sanityBrands.length > 0
      ? sanityBrands
      : localBrands.map((b) => {
          const count = products.filter((p) => p.brand === b).length;
          return {
            id: b,
            name: b,
            slug: slugify(b),
            coverImage: brandHeroImages[b],
            popularModels: brandPopularModels[b] ?? [],
            modelCount: 0,
            workItemCount: count,
          };
        });

  if (brands.length === 0) {
    return (
      <EmptyState
        title="Catalogue coming soon"
        body="We're loading our latest work into this page. In the meantime, send us a photo of your vehicle on WhatsApp and we'll guide you directly."
      />
    );
  }

  const totalWorks = brands.reduce((a, b) => a + b.workItemCount, 0);
  const totalModels = brands.reduce((a, b) => a + b.modelCount, 0);

  return (
    <div>
      <ViewHeader
        eyebrow="Browse by brand"
        title="Choose your vehicle brand"
        meta={`${brands.length} brands · ${totalModels} models · ${totalWorks} work examples`}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b, i) => {
          // First row (first 3 cards) uses a colored logo when one exists,
          // overriding the monochrome Sanity cover; later rows are unchanged.
          const colorLogo = i < 3 ? brandColorLogos[b.name] : undefined;
          const imageSrc =
            colorLogo ??
            b.coverImage ??
            brandHeroImages[b.name as Brand] ??
            `https://picsum.photos/seed/ncw-${b.slug}/800/960`;

          return (
            <Link
              key={b.id}
              href={brandHref(b.slug)}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-ink text-left ring-1 ring-hairline transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-lift"
            >
              <Image
                src={imageSrc}
                alt={b.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/65 to-transparent"
              />
              <div className="relative z-10 p-6">
                <h3 className="text-[15px] tracking-tight text-white sm:text-[16px] leading-[1.2]">
                  {b.name}
                </h3>
                <p className="mt-1 text-[12px] text-white/70">
                  {b.workItemCount > 0
                    ? `${b.modelCount} ${b.modelCount === 1 ? 'model' : 'models'} · ${b.workItemCount} work ${b.workItemCount === 1 ? 'example' : 'examples'}`
                    : 'Models available'}
                </p>
                {b.popularModels.length > 0 && (
                  <p className="mt-2 text-[12px] text-white/55">
                    Popular: {b.popularModels.slice(0, 3).join(' · ')}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-white">
                  Browse {b.name} models
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Models view ──────────────────────────────────────────────── */

type ModelsViewProps = {
  brand: CatalogueBrand;
  models: CatalogueModel[];
  totalCount: number;
};

export function ModelsView({ brand, models, totalCount }: ModelsViewProps) {
  const brandCoverImage =
    brand.coverImage ??
    brandHeroImages[brand.name as Brand] ??
    `https://picsum.photos/seed/ncw-${brand.slug}-all/800/960`;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Catalogue', href: catalogueIndexHref() },
          { label: brand.name },
        ]}
      />
      <ViewHeader
        eyebrow={brand.name}
        title="Choose a model"
        meta={`${totalCount} ${totalCount === 1 ? 'item' : 'items'}`}
        topSpacing
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ImageCard
          href={modelHref(brand.slug, ALL_MODELS_SLUG)}
          imageSrc={brandCoverImage}
          title={`All ${brand.name} items`}
          subtitle={`${totalCount} ${totalCount === 1 ? 'item' : 'items'} across all models`}
          cta="View all"
        />

        {models.map((m) => {
          const imageSrc =
            m.coverImage ??
            `https://picsum.photos/seed/ncw-${brand.slug}-${m.slug}/800/960`;
          return (
            <ImageCard
              key={m.id}
              href={modelHref(brand.slug, m.slug)}
              imageSrc={imageSrc}
              title={m.name}
              subtitle={`${m.workItemCount} ${m.workItemCount === 1 ? 'item' : 'items'}`}
              cta="View items"
            />
          );
        })}
      </div>
    </div>
  );
}

/* ─── Products / Work Items view ───────────────────────────────── */

type ProductsViewProps = {
  brand: CatalogueBrand;
  modelSlug: string;
  modelName?: string;
  products: Product[];
};

export function ProductsView({
  brand,
  modelSlug,
  modelName,
  products,
}: ProductsViewProps) {
  const isAll = modelSlug === ALL_MODELS_SLUG;
  const displayModel = isAll ? `All ${brand.name}` : modelName ?? modelSlug;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Catalogue', href: catalogueIndexHref() },
          { label: brand.name, href: brandHref(brand.slug) },
          { label: displayModel },
        ]}
      />
      <ViewHeader
        eyebrow={brand.name}
        title={isAll ? `Everything ${brand.name}` : `${brand.name} ${displayModel}`}
        meta={`${products.length} ${products.length === 1 ? 'item' : 'items'}`}
        topSpacing
      />

      {products.length === 0 ? (
        <EmptyState
          title="No items in this section yet"
          body={`We've worked on ${brand.name} ${isAll ? 'vehicles' : displayModel + 's'} but haven't catalogued these jobs. Send us a photo on WhatsApp and we'll quote.`}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const msg =
              p.whatsappMessage?.trim() ||
              `I'm interested in: ${p.name} (${p.brand}${p.vehicleModel ? ' ' + p.vehicleModel : ''}).`;
            const productBrandSlug = p.brandSlug ?? brand.slug;
            const productModelSlug =
              p.modelSlug ??
              (p.vehicleModel ? slugify(p.vehicleModel) : modelSlug);
            const detailHref = itemHref(
              productBrandSlug,
              productModelSlug,
              p.id,
            );
            return (
              <article
                key={p.id}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-ink ring-1 ring-hairline transition-shadow duration-300 hover:shadow-lift"
              >
                <Link
                  href={detailHref}
                  aria-label={`View details for ${p.name}`}
                  className="absolute inset-0 z-[1] rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                />

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
                  {p.vehicleModel && (
                    <p className="mt-1 text-[12px] text-white/60">
                      {p.vehicleModel}
                    </p>
                  )}
                  <div className="relative z-[2] mt-4">
                    <Button
                      href={waLink(waMessage(msg))}
                      external
                      variant="secondary"
                      size="sm"
                      iconLeft={<WhatsAppIcon className="h-4 w-4" />}
                      className="!bg-white/10 !text-white !border-white/25 hover:!bg-white/15 hover:!border-white/40 backdrop-blur-md"
                    >
                      Enquire
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Not-found views ──────────────────────────────────────────── */

export function BrandNotFound({ slug }: { slug: string }) {
  return (
    <NotFoundView
      label="Brand not found"
      slug={slug}
      message="We couldn't find a brand at this address."
      backHref={catalogueIndexHref()}
      backLabel="Back to catalogue"
    />
  );
}

export function ModelNotFound({
  brandName,
  brandSlug,
  modelSlug,
}: {
  brandName: string;
  brandSlug: string;
  modelSlug: string;
}) {
  return (
    <NotFoundView
      label="Vehicle model not found"
      slug={modelSlug}
      message={`We couldn't find a ${brandName} model at this address.`}
      backHref={brandHref(brandSlug)}
      backLabel={`Back to ${brandName} models`}
    />
  );
}

export function WorkItemNotFound({
  brandName,
  brandSlug,
  modelName,
  modelSlug,
  itemSlug,
}: {
  brandName: string;
  brandSlug: string;
  modelName: string;
  modelSlug: string;
  itemSlug: string;
}) {
  return (
    <NotFoundView
      label="Work item not found"
      slug={itemSlug}
      message={`We couldn't find a ${brandName} ${modelName} work item at this address. It may have been removed or renamed.`}
      backHref={modelHref(brandSlug, modelSlug)}
      backLabel={`Back to ${modelName} items`}
    />
  );
}

function NotFoundView({
  label,
  slug,
  message,
  backHref,
  backLabel,
}: {
  label: string;
  slug: string;
  message: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div>
      <div className="rounded-3xl bg-surface p-10 text-center ring-1 ring-hairline sm:p-14">
        <span className="inline-flex items-center rounded-full bg-surface-alt px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">
          Not found
        </span>
        <h3 className="mt-5 text-[15px] tracking-tight sm:text-[16px] leading-[1.2]">
          {label}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-ink-muted">
          {message}
          {slug ? (
            <>
              {' '}
              <span className="ml-1 inline-block rounded bg-surface-alt px-1.5 py-0.5 font-mono text-[12px] text-ink">
                {slug}
              </span>
            </>
          ) : null}
        </p>
        <div className="mt-7 flex justify-center">
          <Button href={backHref} variant="secondary">
            {backLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared building blocks ───────────────────────────────────── */

function ImageCard({
  href,
  imageSrc,
  title,
  subtitle,
  cta,
}: {
  href: string;
  imageSrc: string;
  title: string;
  subtitle: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-ink text-left ring-1 ring-hairline transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-lift"
    >
      <Image
        src={imageSrc}
        alt={title}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.04]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/65 to-transparent"
      />
      <div className="relative z-10 p-6">
        <h3 className="text-[15px] tracking-tight text-white sm:text-[16px] leading-[1.2]">
          {title}
        </h3>
        <p className="mt-1 text-[12px] text-white/70">{subtitle}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-white">
          {cta}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}


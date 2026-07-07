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
import { cn } from '@/lib/cn';
import {
  ALL_MODELS_SLUG,
  brandHref,
  catalogueIndexHref,
  itemHref,
  modelHref,
  slugify,
} from '@/lib/catalogue/slugs';
import { Breadcrumbs, EmptyState, ViewHeader } from './parts';

/* ─── Shared micro-parts ───────────────────────────────────────── */

// Diagonal-arrow affordance shared by every card level — the same language
// as the homepage services mosaic. `frosted` sits on photos; the default
// sits on light card chrome.
function ArrowBadge({ frosted = false }: { frosted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-soft',
        frosted
          ? 'bg-white/15 ring-1 ring-white/30 backdrop-blur-sm group-hover:bg-white'
          : 'bg-surface-alt ring-1 ring-hairline group-hover:bg-ink',
      )}
    >
      <ArrowRightIcon
        className={cn(
          'h-4 w-4 -rotate-45 transition-all duration-300 ease-soft group-hover:rotate-0',
          frosted ? 'text-white group-hover:text-ink' : 'text-ink group-hover:text-white',
        )}
      />
    </span>
  );
}

// Frosted mono chip used for counts on photos.
function CountChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute right-4 top-4 z-10 rounded-full bg-black/35 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] leading-none text-white/85 ring-1 ring-white/20 backdrop-blur-sm">
      {children}
    </span>
  );
}

// Mount-stagger for card grids (CSS `reveal` keyframes from globals.css).
function stagger(i: number): React.CSSProperties {
  return { animationDelay: `${Math.min(i, 8) * 60}ms` };
}

/* ─── Brands view — the garage index ───────────────────────────── */

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

  // Recent work teaser — real photos before any drilling down. Only products
  // that can resolve to a detail URL make the strip.
  const recentWork = products
    .filter((p) => (p.brandSlug || p.brand) && (p.modelSlug || p.vehicleModel))
    .slice(0, 8);

  return (
    <div>
      <ViewHeader
        eyebrow="Browse by brand"
        title="Choose your vehicle brand"
        meta={`${brands.length} brands · ${totalModels} models · ${totalWorks} work examples`}
      />

      {/* ── Brand plates ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b, i) => {
          const colorLogo = brandColorLogos[b.name];
          const photo =
            b.coverImage ?? brandHeroImages[b.name as Brand] ?? null;
          const imageSrc =
            colorLogo ??
            photo ??
            `https://picsum.photos/seed/ncw-${b.slug}/800/960`;
          const isPlate = Boolean(colorLogo);

          return (
            <Link
              key={b.id}
              href={brandHref(b.slug)}
              style={stagger(i)}
              className="group reveal flex flex-col overflow-hidden rounded-3xl bg-surface ring-1 ring-hairline transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-lift"
            >
              {/* Logo plate (white field) or brand photo. */}
              <div
                className={cn(
                  'relative aspect-[16/9] w-full overflow-hidden',
                  isPlate ? 'bg-white' : 'bg-ink',
                )}
              >
                <Image
                  src={imageSrc}
                  alt={b.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className={cn(
                    'object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]',
                    isPlate && 'object-top',
                  )}
                />
                {b.workItemCount > 0 && (
                  <CountChip>
                    {b.workItemCount} {b.workItemCount === 1 ? 'work' : 'works'}
                  </CountChip>
                )}
              </div>

              {/* Card chrome. */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-[16px] tracking-tight leading-[1.2]">{b.name}</h3>
                    <p className="mt-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                      {b.modelCount > 0
                        ? `${b.modelCount} ${b.modelCount === 1 ? 'model' : 'models'}`
                        : 'Models available'}
                    </p>
                  </div>
                  <ArrowBadge />
                </div>
                {b.popularModels.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {b.popularModels.slice(0, 3).map((m) => (
                      <span
                        key={m}
                        className="rounded-full bg-surface-alt px-2.5 py-1 text-[11px] font-medium text-ink-muted"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Fresh from the workshop — real work, zero clicks deep ── */}
      {recentWork.length > 0 && (
        <div className="mt-16 sm:mt-20">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Fresh from the workshop
              </p>
              <h2 className="mt-3 text-balance text-[18px] tracking-tight sm:text-[21px] leading-[1.15]">
                Recent work, straight off the bench.
              </h2>
            </div>
            <span className="hidden shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle sm:block">
              Scroll →
            </span>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recentWork.map((p) => {
              const bSlug = p.brandSlug ?? slugify(p.brand);
              const mSlug =
                p.modelSlug ??
                (p.vehicleModel ? slugify(p.vehicleModel) : ALL_MODELS_SLUG);
              return (
                <Link
                  key={p.id}
                  href={itemHref(bSlug, mSlug, p.id)}
                  className="group relative aspect-[4/5] w-52 shrink-0 snap-start overflow-hidden rounded-2xl bg-ink ring-1 ring-hairline transition-shadow duration-300 hover:shadow-lift sm:w-60"
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="240px"
                    className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                    <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70">
                      {p.brand}
                      {p.vehicleModel ? ` · ${p.vehicleModel}` : ''}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-[13.5px] tracking-tight !text-white leading-[1.25]">
                      {p.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Models view — choose the vehicle ─────────────────────────── */

type ModelsViewProps = {
  brand: CatalogueBrand;
  models: CatalogueModel[];
  totalCount: number;
};

export function ModelsView({ brand, models, totalCount }: ModelsViewProps) {
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
        meta={`${models.length} ${models.length === 1 ? 'model' : 'models'} · ${totalCount} ${totalCount === 1 ? 'item' : 'items'}`}
        topSpacing
      />

      {/* Everything-at-once shortcut — a dark banner above the model grid. */}
      <Link
        href={modelHref(brand.slug, ALL_MODELS_SLUG)}
        className="group relative mb-6 flex items-center justify-between gap-6 overflow-hidden rounded-3xl bg-ink p-6 text-white ring-1 ring-black/5 transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-lift sm:p-7"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-[10%] -top-[120%] h-[22rem] w-[22rem] rounded-full bg-accent/30 blur-3xl"
        />
        <div className="relative">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
            {brand.name}
          </p>
          <h3 className="mt-1.5 text-[16px] tracking-tight !text-white leading-[1.2] sm:text-[17px]">
            Browse every {brand.name} item
          </h3>
          <p className="mt-1 text-[13px] text-white/60">
            {totalCount} {totalCount === 1 ? 'item' : 'items'} across all models
          </p>
        </div>
        <ArrowBadge frosted />
      </Link>

      {/* Model banners — wide cards so this level reads differently from the
          brand plates above it. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {models.map((m, i) => {
          const imageSrc =
            m.coverImage ??
            `https://picsum.photos/seed/ncw-${brand.slug}-${m.slug}/1200/750`;
          return (
            <Link
              key={m.id}
              href={modelHref(brand.slug, m.slug)}
              style={stagger(i)}
              className="group reveal relative flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-3xl bg-ink ring-1 ring-hairline transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-lift"
            >
              <Image
                src={imageSrc}
                alt={m.name}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/35 to-transparent"
              />
              <CountChip>
                {m.workItemCount} {m.workItemCount === 1 ? 'item' : 'items'}
              </CountChip>
              <div className="relative z-10 flex items-end justify-between gap-4 p-5 sm:p-6">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                    {brand.name}
                  </p>
                  <h3 className="mt-1 text-[17px] tracking-tight !text-white leading-[1.2]">
                    {m.name}
                  </h3>
                </div>
                <ArrowBadge frosted />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Products / Work Items view — the work itself ─────────────── */

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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
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
                style={stagger(i)}
                className="group reveal relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-3xl bg-ink ring-1 ring-hairline transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-lift"
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
                  className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
                />

                {/* Detail affordance. */}
                <span className="absolute right-4 top-4 z-10">
                  <ArrowBadge frosted />
                </span>

                <div className="relative z-10 p-5 sm:p-6">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                    {p.brand}
                    {p.vehicleModel ? ` · ${p.vehicleModel}` : ''}
                  </p>
                  <h3 className="mt-1.5 text-[16px] tracking-tight !text-white leading-[1.2] sm:text-[17px]">
                    {p.name}
                  </h3>
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
        <span className="inline-flex items-center rounded-full bg-surface-alt px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
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

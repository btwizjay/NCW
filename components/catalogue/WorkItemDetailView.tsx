'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import type { Product } from '@/content/products';
import { Button } from '@/components/ui/Button';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { telLink, waLink, waMessage } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';
import {
  brandHref,
  catalogueIndexHref,
  modelHref,
} from '@/lib/catalogue/slugs';
import { Breadcrumbs } from './parts';

type Props = {
  product: Product;
  brandName: string;
  brandSlug: string;
  modelName?: string;
  modelSlug?: string;
};

export function WorkItemDetailView({
  product,
  brandName,
  brandSlug,
  modelName,
  modelSlug,
}: Props) {
  const images = useMemo(() => {
    const list = [product.image, ...(product.gallery ?? [])].filter(
      (src): src is string => Boolean(src),
    );
    return Array.from(new Set(list));
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(images.length - 1, 0));
  const activeImage = images[safeIndex] ?? null;

  const enquiryIntent =
    product.whatsappMessage?.trim() ||
    `I would like to enquire about ${product.brand}${
      product.vehicleModel ? ' ' + product.vehicleModel : ''
    } ${product.name} shown on your website.`;
  const enquiryHref = waLink(waMessage(enquiryIntent));

  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: 'Catalogue', href: catalogueIndexHref() },
    { label: brandName, href: brandHref(brandSlug) },
  ];
  if (modelName && modelSlug) {
    breadcrumbItems.push({
      label: modelName,
      href: modelHref(brandSlug, modelSlug),
    });
  }
  breadcrumbItems.push({ label: product.name });

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        {/* Gallery */}
        <div className="min-w-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-surface-alt ring-1 ring-hairline">
            {activeImage ? (
              <Image
                key={activeImage}
                src={activeImage}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <ImagePlaceholder label={product.name} />
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Show image ${i + 1} of ${images.length}`}
                  aria-pressed={i === safeIndex}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-2xl ring-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40',
                    i === safeIndex
                      ? 'ring-2 ring-ink'
                      : 'ring-hairline hover:ring-ink/40',
                  )}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 lg:pt-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            {product.brand}
            {product.vehicleModel ? ` · ${product.vehicleModel}` : ''}
          </p>
          <h1 className="mt-3 break-words text-balance text-[22px] tracking-tight sm:text-[28px] md:text-[34px] leading-[1.15]">
            {product.name}
          </h1>

          {product.summary && (
            <p className="mt-5 break-words text-pretty text-[15px] leading-relaxed text-ink-muted">
              {product.summary}
            </p>
          )}

          {product.longDescription && (
            <div className="mt-5 whitespace-pre-line break-words text-pretty text-[14.5px] leading-relaxed text-ink-muted">
              {product.longDescription}
            </div>
          )}

          <dl className="mt-8 space-y-2.5 text-[14px]">
            <DetailRow label="Brand" value={product.brand} />
            {product.vehicleModel && (
              <DetailRow label="Vehicle Model" value={product.vehicleModel} />
            )}
            <DetailRow label="Category" value={product.category} />
            {product.vehicleModel && (
              <DetailRow label="Fits" value={product.vehicleModel} />
            )}
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href={enquiryHref}
              external
              variant="whatsapp"
              iconLeft={<WhatsAppIcon className="h-4 w-4" />}
            >
              Enquire on WhatsApp
            </Button>
            <Button
              href={telLink}
              variant="secondary"
              iconLeft={<PhoneIcon className="h-4 w-4" />}
            >
              Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 pb-2.5">
      <dt className="text-ink-subtle">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-alt to-surface text-ink-subtle">
      <div className="rounded-full bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ring-1 ring-hairline">
        No image
      </div>
      <p className="px-4 text-center text-[13px]">{label}</p>
    </div>
  );
}

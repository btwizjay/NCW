// Premium horizontal marquee of vehicle brands serviced.
// Logos are pulled from cdn.simpleicons.org as a monochrome SVG, tinted to
// `text-ink-subtle` (#86868B). Animation defined in app/globals.css via
// `.marquee-track` / `.marquee-host` so it always ends up in the output CSS.

import { Container } from '@/components/ui/Container';

type Brand = {
  name: string;
  /** simpleicons.org slug — lowercase, no spaces or hyphens */
  slug: string;
  /** Optional local SVG override (e.g. when the brand isn't on the CDN). */
  localSrc?: string;
};

const brands: Brand[] = [
  { name: 'Toyota', slug: 'toyota' },
  { name: 'Honda', slug: 'honda' },
  { name: 'Suzuki', slug: 'suzuki' },
  { name: 'Mitsubishi', slug: 'mitsubishi' },
  { name: 'Nissan', slug: 'nissan' },
  { name: 'Mazda', slug: 'mazda' },
  { name: 'Hyundai', slug: 'hyundai' },
  { name: 'Kia', slug: 'kia' },
  { name: 'BMW', slug: 'bmw' },
  { name: 'Mercedes-Benz', slug: 'mercedes', localSrc: '/brands/mercedes.svg' },
  { name: 'Audi', slug: 'audi' },
];

const iconColor = '86868B'; // matches text-ink-subtle

export function BrandsMarquee() {
  const looped = [...brands, ...brands];

  return (
    <section
      aria-label="Vehicle brands we service"
    >
      <div className="py-12 sm:py-14">
        <Container size="wide">
          <div
            className="relative overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 6rem, black calc(100% - 6rem), transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 6rem, black calc(100% - 6rem), transparent)',
            }}
          >

            {/* Right-to-left infinite scroll. `mr-*` per item (instead of flex
                gap) makes the period equal to exactly 50% of the track width,
                so the loop is pixel-perfect seamless. */}
            <div className="marquee-track flex w-max select-none items-center">
              {looped.map((b, i) => (
                <div
                  key={`${b.slug}-${i}`}
                  className="mr-24 flex shrink-0 items-center gap-4 sm:mr-28"
                  aria-hidden={i >= brands.length || undefined}
                >
                  <img
                    src={b.localSrc ?? `https://cdn.simpleicons.org/${b.slug}/${iconColor}`}
                    alt={i < brands.length ? `${b.name} logo` : ''}
                    width={36}
                    height={36}
                    loading="lazy"
                    draggable={false}
                    className="h-8 w-8 select-none opacity-90 sm:h-9 sm:w-9"
                  />
                  <span className="text-[18px] font-medium tracking-tight text-ink-subtle sm:text-[19px]">
                    {b.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Image from 'next/image';
import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { QuoteIcon } from '@/components/ui/Icons';
import { OpenStatus } from '@/components/ui/OpenStatus';
import { CtaBanner } from '@/components/home/CtaBanner';
import { business } from '@/content/business';
import { pageMetadata } from '@/lib/seo';
import { cn } from '@/lib/cn';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';

export const metadata: Metadata = pageMetadata(
  'About',
  `The story of ${business.name}, founded by Nilantha Edirisinghe and serving Sri Lankan drivers from Pasyala since ${business.established}.`,
);

// The journey from a borrowed sewing machine to today's workshop.
const milestones = [
  {
    era: 'Late 1990s',
    title: 'The craft is learned',
    body: 'A young Nilantha Edirisinghe spends his days behind a sewing machine, learning cushion work stitch by stitch under craftsmen who accepted nothing less than perfect.',
  },
  {
    era: `${business.established}`,
    title: 'A name above the door',
    body: 'A signboard, a tarpaulin and a row of hand-built seat sets on the Kandy Road verge. Nilantha Cushion Works opens in Pasyala.',
  },
  {
    era: 'Today',
    title: 'Pasyala’s trusted name',
    body: 'A full workshop serving drivers from across the island, with every job still finished by hand, exactly as it was on day one.',
  },
];

const stats = [
  { value: `${new Date().getFullYear() - business.established}+`, label: 'Years in Pasyala' },
  { value: `Est. ${business.established}`, label: 'Family founded' },
  { value: '6', label: 'Days a week' },
  { value: '100%', label: 'Done in-house' },
];

// Archival photograph presented as a mounted album print: white mat, soft
// lift, scrapbook tape at the corners, and a hand-placed tilt that
// straightens on hover. Caption + era chip sit on the mat like a label.
function ArchivalPrint({
  src,
  alt,
  caption,
  chip,
  aspect,
  tilt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  caption: string;
  chip: string;
  aspect: string;
  tilt: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={cn(
        'relative transition-transform duration-500 ease-soft hover:rotate-0 hover:scale-[1.015]',
        tilt,
      )}
    >
      {/* Scrapbook tape across the top corners. */}
      <span
        aria-hidden="true"
        className="absolute -top-2.5 left-6 z-10 h-5 w-16 rotate-[-8deg] rounded-[2px] bg-gradient-to-b from-white/70 to-white/40 shadow-sm ring-1 ring-black/5 backdrop-blur-[1px]"
      />
      <span
        aria-hidden="true"
        className="absolute -top-2.5 right-6 z-10 h-5 w-16 rotate-[7deg] rounded-[2px] bg-gradient-to-b from-white/70 to-white/40 shadow-sm ring-1 ring-black/5 backdrop-blur-[1px]"
      />
      <div className="rounded-2xl bg-white p-3 shadow-lift ring-1 ring-hairline sm:p-4">
        <div className={cn('relative w-full overflow-hidden rounded-xl bg-surface-alt', aspect)}>
          <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
          {/* Faint inner line so the aged print reads as mounted, not floating. */}
          <div aria-hidden="true" className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
        </div>
        <figcaption className="mt-3 flex items-start justify-between gap-4 px-1 pb-1">
          <span className="text-[13px] leading-snug text-ink-muted">{caption}</span>
          <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
            {chip}
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

// Mosaic tiles for "the workshop today" — spans chosen so the grid reads as a
// composed contact sheet rather than a uniform gallery.
const galleryTiles = [
  {
    src: '/images/workshop/1.jpeg',
    label: 'The workshop floor',
    span: 'col-span-2 row-span-2',
    sizes: '(min-width: 1024px) 50vw, 100vw',
  },
  {
    src: '/images/workshop/2.JPG',
    label: 'Hand finishing',
    span: '',
    sizes: '(min-width: 1024px) 25vw, 50vw',
  },
  {
    src: '/images/services/seat-covers.jpeg',
    label: 'Tailored seat covers',
    span: '',
    sizes: '(min-width: 1024px) 25vw, 50vw',
  },
  {
    src: '/images/services/japanese-seat-sets.jpeg',
    label: 'Japanese seat sets',
    span: 'col-span-2',
    sizes: '(min-width: 1024px) 50vw, 100vw',
  },
];

export default function AboutPage() {
  const founderPhotoExists = existsSync(
    join(process.cwd(), 'public/images/about/founder.jpg'),
  );

  return (
    <>
      <PageHero
        image="/images/workshop/3.jpeg"
        imageAlt={`Inside the ${business.name} workshop`}
        eyebrow="Our story"
        title="About Us"
        subtitle="Begin Your Journey to True Restoration"
      >

      {/* ── Introduction — the opening statement ────────────────────────────
          Sets the vibe for the whole page: an editorial statement about what
          this workshop is and where it came from, beside a tape-mounted
          "workshop record" card that previews the archival language of the
          history band below. */}
      <Section tone="transparent" size="wide" className="!pb-4 !pt-14 sm:!pb-6 sm:!pt-20">
        <div className="relative">
          {/* Faint dotted texture behind the statement, fading out rightward. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-4 -inset-y-8 bg-grid-faint [mask-image:linear-gradient(115deg,black,transparent_70%)]"
          />

          <div className="relative grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-7">
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                About {business.name}
              </p>
              <h2 className="text-balance text-[24px] tracking-tighter sm:text-[30px] md:text-[36px] leading-[1.12]">
                A name built one seam at a time.
              </h2>
              <div className="mt-6 max-w-xl space-y-4 text-[16px] leading-relaxed text-ink-muted">
                <p>
                  In {business.established}, a young craftsman named Nilantha Edirisinghe
                  set out a row of hand-built seat sets on the Kandy Road verge in Pasyala.
                  Two decades later, that roadside stall has become one of the region’s
                  most trusted names in vehicle interiors. It is still family-run, and
                  every cabin is still finished by hand.
                </p>
                <p>
                  This is the story of that journey: where it began, the man whose name is
                  above the door, and the workshop that keeps his standard today.
                </p>
              </div>
              <a
                href="#history"
                className="group mt-9 inline-flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle transition-colors hover:text-accent"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-hairline transition-all group-hover:translate-y-0.5 group-hover:ring-accent/40">
                  ↓
                </span>
                Read the full story
              </a>
            </div>

            {/* The workshop record — an index card from the archive. */}
            <div className="mx-auto w-full max-w-sm lg:col-span-5">
              <div className="relative rotate-[1.2deg] transition-transform duration-500 ease-soft hover:rotate-0">
                <span
                  aria-hidden="true"
                  className="absolute -top-2.5 left-8 z-10 h-5 w-16 rotate-[-8deg] rounded-[2px] bg-gradient-to-b from-white/80 to-white/50 shadow-sm ring-1 ring-black/5"
                />
                <span
                  aria-hidden="true"
                  className="absolute -top-2.5 right-8 z-10 h-5 w-16 rotate-[7deg] rounded-[2px] bg-gradient-to-b from-white/80 to-white/50 shadow-sm ring-1 ring-black/5"
                />
                <div className="rounded-2xl bg-white p-7 shadow-lift ring-1 ring-hairline sm:p-8">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-subtle">
                    Workshop record
                  </p>
                  <dl className="mt-5 divide-y divide-hairline">
                    {[
                      ['Established', `${business.established}`],
                      ['Founder', 'Nilantha Edirisinghe'],
                      ['Workshop', 'Kandy Road, Pasyala'],
                      ['Craft', 'Vehicle interiors & cushion work'],
                      ['Serving', 'Drivers island-wide'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-baseline justify-between gap-6 py-3">
                        <dt className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                          {label}
                        </dt>
                        <dd className="text-right text-[13.5px] font-medium tracking-tight text-ink">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-5 flex justify-end">
                    <OpenStatus />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── History — dark heritage band ─────────────────────────────────
          The organisation's story told as an album spread: the earliest
          surviving photograph beside the workshop today, joined by a
          then→now connector, with the milestones beneath. Echoes the dark
          rounded panel language of the homepage process band. */}
      <div id="history" className="scroll-mt-6 px-2 py-14 sm:px-2.5 sm:py-20 lg:px-3">
        <div className="relative isolate overflow-hidden rounded-[16px] bg-ink text-white shadow-lift ring-1 ring-black/5">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-[5%] -top-[30%] h-[28rem] w-[28rem] rounded-full bg-accent/40 blur-3xl animate-aurora" />
            <div
              className="absolute -bottom-[40%] right-[-5%] h-[26rem] w-[26rem] rounded-full blur-3xl animate-aurora"
              style={{ background: 'rgba(169,25,22,0.30)', animationDelay: '-8s' }}
            />
          </div>

          <Container size="wide" className="py-16 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Our history
              </p>
              <h2 className="text-balance text-[22px] leading-[1.15] tracking-tighter !text-white sm:text-[26px] md:text-[32px]">
                From one sewing machine to Pasyala’s trusted name.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-[16px] leading-relaxed text-white/70">
                {business.name} didn’t begin as a business. It began as a craft, learned one
                seam at a time, and a promise to do the work properly or not at all.
              </p>
            </div>

            {/* The album spread — both surviving photographs from the early
                days, mounted side by side. */}
            <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.45fr_auto_1fr] lg:gap-8">
              <ArchivalPrint
                src="/images/about/first-workshop.jpg"
                alt="The original Nilantha Cushion Works with hand-built seat sets lined up outside the first roadside workshop"
                caption={`The very first look of ${business.name}: hand-built seat sets on the Kandy Road verge.`}
                chip="The beginning"
                aspect="aspect-[3/2]"
                tilt="rotate-[-1.4deg]"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />

              {/* Connector — a stitched seam joining the two prints. */}
              <div aria-hidden="true" className="hidden flex-col items-center gap-3 self-stretch py-10 lg:flex">
                <span className="w-px flex-1 border-l border-dashed border-white/25" />
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
                  Where it began
                </span>
                <span className="w-px flex-1 border-l border-dashed border-white/25" />
              </div>

              <div className="mx-auto w-full max-w-sm lg:max-w-none">
                <ArchivalPrint
                  src="/images/about/founder-1990s.jpg"
                  alt="Mr. Nilantha Edirisinghe at a sewing machine, learning to sew cushions in the late 1990s"
                  caption="Mr. Nilantha Edirisinghe learning to sew cushions in the late 1990s."
                  chip="Late 1990s"
                  aspect="aspect-[7/10]"
                  tilt="rotate-[1.4deg]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 384px, 100vw"
                />
              </div>
            </div>

            {/* Milestones. */}
            <div className="mt-16 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {milestones.map((m) => (
                <div
                  key={m.era}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.07]"
                >
                  <span className="font-pirulen text-[20px] leading-none tracking-tight text-white/25">
                    {m.era}
                  </span>
                  <h3 className="mt-5 text-[16px] leading-[1.2] tracking-tight !text-white">
                    {m.title}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-white/70">
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </div>

      {/* ── The founder ──────────────────────────────────────────────────
          Mr. Nilantha Edirisinghe — the archival photo of him learning the
          craft, beside who he is and how he still runs the workshop. */}
      <Section tone="transparent" size="wide" className="relative !pb-10 !pt-10 sm:!pb-14 sm:!pt-14">
        {/* Watermark — quiet type behind the feature. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-6 select-none font-pirulen text-[15vw] leading-none text-ink/[0.03] lg:text-[11rem]"
        >
          {business.established}
        </span>

        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
            {/* Offset colour field behind the print. */}
            <div
              aria-hidden="true"
              className="absolute -inset-3 -rotate-2 rounded-[2rem] bg-accent-soft sm:-inset-4"
            />
            {/* Drop the founder's portrait at public/images/about/founder.jpg
                and this frame picks it up automatically; until then it renders
                a placeholder mat instead of a broken image. */}
            {founderPhotoExists ? (
              <ArchivalPrint
                src="/images/about/founder.jpg"
                alt="Mr. Nilantha Edirisinghe, founder of Nilantha Cushion Works"
                caption={`Mr. Nilantha Edirisinghe at the ${business.name} workshop, Pasyala.`}
                chip="The founder"
                aspect="aspect-[4/5]"
                tilt="rotate-[1deg]"
                sizes="(min-width: 1024px) 38vw, (min-width: 640px) 384px, 100vw"
              />
            ) : (
              <figure className="relative rotate-[1deg] transition-transform duration-500 ease-soft hover:rotate-0">
                <div className="rounded-2xl bg-white p-3 shadow-lift ring-1 ring-hairline sm:p-4">
                  <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-surface-alt">
                    <span className="font-pirulen text-[28px] tracking-tight text-ink/15">NCW</span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                      Portrait coming soon
                    </span>
                    <div aria-hidden="true" className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
                  </div>
                  <figcaption className="mt-3 flex items-start justify-between gap-4 px-1 pb-1">
                    <span className="text-[13px] leading-snug text-ink-muted">
                      Mr. Nilantha Edirisinghe at the {business.name} workshop, Pasyala.
                    </span>
                    <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                      The founder
                    </span>
                  </figcaption>
                </div>
              </figure>
            )}
          </div>

          <div className="lg:col-span-7">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              The founder
            </p>
            <h2 className="text-balance text-[22px] tracking-tighter sm:text-[26px] md:text-[32px] leading-[1.15]">
              Mr. Nilantha Edirisinghe
            </h2>
            <p className="mt-2 text-[14px] font-medium text-accent">
              Founder &amp; Master Craftsman
            </p>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink-muted">
              <p>
                Before there was a workshop, there was a young man at a sewing machine. In
                the late 1990s, Nilantha Edirisinghe learned cushion work the only way it
                can truly be learned: by hand, seam after seam.
              </p>
              <p>
                In {business.established} he put his own name above the door in Pasyala. It
                was a modest beginning, but the standard was set from the first stitch:
                make it comfortable, make it last, and stand behind every job.
              </p>
              <p>
                Two decades on, he is still on the workshop floor, leading every major job
                and personally checking each vehicle before it is handed back.
              </p>
            </div>

            <figure className="mt-10 rounded-2xl bg-surface-alt p-6 ring-1 ring-hairline sm:p-7">
              <QuoteIcon className="h-6 w-6 text-accent/40" aria-hidden="true" />
              <blockquote className="mt-4 text-pretty text-[17px] leading-[1.6] tracking-tight text-ink sm:text-[18px]">
                Every seat that leaves this workshop carries my name. That is why every seam
                matters.
              </blockquote>
              <figcaption className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                Nilantha Edirisinghe, Founder
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>

      {/* ── Numbers ──────────────────────────────────────────────────────── */}
      <Section tone="transparent" size="wide" className="!pb-10 !pt-14 sm:!pb-14 sm:!pt-20">
        <div className="grid grid-cols-2 gap-y-10 rounded-4xl bg-surface py-10 ring-1 ring-hairline sm:py-12 lg:grid-cols-4 lg:divide-x lg:divide-hairline">
          {stats.map((s) => (
            <div key={s.label} className="px-6 text-center">
              <p className="font-pirulen text-[22px] leading-none tracking-tight text-ink sm:text-[28px]">
                {s.value}
              </p>
              <p className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── The workshop today — mosaic ──────────────────────────────────── */}
      <Section tone="transparent" size="wide" className="!pt-14 sm:!pt-20">
        <SectionHeader
          align="center"
          eyebrow="The workshop today"
          title="Where the work still happens, every day."
          description="Real photographs from the Pasyala floor: the same bench, the same standard, a few more grey hairs."
        />
        <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] sm:gap-5 lg:grid-cols-4">
          {galleryTiles.map((tile) => (
            <div
              key={tile.src}
              className={cn(
                'group relative overflow-hidden rounded-3xl bg-surface-alt ring-1 ring-hairline',
                tile.span,
              )}
            >
              <Image
                src={tile.src}
                alt={tile.label}
                fill
                sizes={tile.sizes}
                className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
              />
              {/* Legibility wash + label are always present (so touch devices
                  see the caption without needing a hover state); hovering just
                  deepens the wash a touch for emphasis on pointer devices. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent transition-opacity duration-300 group-hover:from-black/70" />
              <span className="absolute bottom-4 left-5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                {tile.label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <CtaBanner />
      </PageHero>

      <HomepageBackdrop />
    </>
  );
}

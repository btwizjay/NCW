'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { CheckIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { services } from '@/content/services';
import { waLink, waMessage } from '@/lib/whatsapp';
import { getLenis } from '@/lib/lenis';
import { cn } from '@/lib/cn';

// Matches the articles' scroll-mt-28 (7rem = 112px under the floating header).
const HEADER_OFFSET = -112;

const EASE_SOFT = [0.22, 0.61, 0.36, 1] as const;

// Glide to a chapter through Lenis when it's running; fall back to native
// smooth scrolling (or an instant jump under reduced motion).
function glideTo(slug: string, reduce: boolean) {
  const el = document.getElementById(slug);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: HEADER_OFFSET, duration: 1.15 });
  } else {
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
}

// True from lg: up. Used to skip the numeral-watermark parallax computation
// entirely on mobile/tablet, where that element never renders (hidden lg:block)
// — defaults to false so it matches the server render and there's no
// hydration mismatch, then syncs after mount.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isDesktop;
}

// Staggered text reveal shared by every chapter's copy column.
const textContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

function textItem(reduce: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_SOFT } },
  };
}

function Chapter({
  service,
  idx,
  reduce,
}: {
  service: (typeof services)[number];
  idx: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const flipped = idx % 2 !== 0;
  const isDesktop = useIsDesktop();

  // One scroll progress per chapter drives the image parallax (live at every
  // breakpoint — this is the piece that should reach mobile) and the
  // counter-drifting numeral watermark (desktop-only element, so its motion
  // is held constant below lg: rather than computed for nothing).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%']);
  const numY = useTransform(scrollYProgress, [0, 1], reduce || !isDesktop ? [0, 0] : [36, -36]);

  const item = textItem(reduce);

  return (
    <article
      ref={ref}
      id={service.slug}
      className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-12 lg:gap-14"
    >
      <motion.div
        initial={{ opacity: 0, x: reduce ? 0 : flipped ? 36 : -36 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={{ duration: 0.7, ease: EASE_SOFT }}
        className={cn('relative lg:col-span-7', flipped && 'lg:order-2')}
      >
        <div className="group relative aspect-[5/4] w-full overflow-hidden rounded-4xl bg-surface-alt shadow-soft ring-1 ring-hairline">
          {/* Parallax layer — oversized so the drift never exposes edges. */}
          <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110 will-change-transform">
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 ease-soft group-hover:scale-[1.03]"
            />
          </motion.div>
          {/* Index chip — same frosted language as the home mosaic. */}
          <span className="absolute left-5 top-5 rounded-full bg-black/35 px-3 py-1.5 font-pirulen text-[10px] leading-none text-white/85 ring-1 ring-white/20 backdrop-blur-sm">
            0{idx + 1}
          </span>
        </div>
      </motion.div>

      <motion.div
        variants={textContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-12% 0px' }}
        className={cn(
          'relative flex flex-col justify-center lg:col-span-5',
          flipped && 'lg:order-1',
        )}
      >
        {/* Numeral watermark drifting against the scroll. */}
        <motion.span
          aria-hidden="true"
          style={{ y: numY }}
          className="pointer-events-none absolute -top-12 right-0 hidden select-none font-pirulen text-[110px] leading-none text-ink/[0.04] will-change-transform lg:block"
        >
          0{idx + 1}
        </motion.span>

        <motion.p
          variants={item}
          className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent"
        >
          0{idx + 1} · {service.shortTitle}
        </motion.p>
        <motion.h2
          variants={item}
          className="text-balance text-[20px] tracking-tighter sm:text-[24px] md:text-[30px] leading-[1.15]"
        >
          {service.title}
        </motion.h2>
        <motion.p
          variants={item}
          className="mt-5 text-pretty text-[16px] leading-relaxed text-ink-muted sm:text-[17px]"
        >
          {service.description}
        </motion.p>
        <ul className="mt-7 space-y-3">
          {service.highlights.map((h) => (
            <motion.li
              key={h}
              variants={item}
              className="flex items-start gap-3 text-[15px] text-ink"
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <CheckIcon className="h-3 w-3" />
              </span>
              {h}
            </motion.li>
          ))}
        </ul>
        <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            href={waLink(waMessage(`I'd like to enquire about ${service.title}.`))}
            external
            variant="whatsapp"
            size="md"
            iconLeft={<WhatsAppIcon className="h-4 w-4" />}
          >
            Enquire on WhatsApp
          </Button>
          <Button href="/book" variant="secondary" size="md">
            Book a visit
          </Button>
        </motion.div>
      </motion.div>
    </article>
  );
}

// The interactive body of the services page: quick-index chips, a scrollspy
// page-map rail, and the six animated chapters. Anchor navigation glides
// through Lenis so the whole page reads as one continuous, immersive surface.
export function ServicesChapters() {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(0);

  // Scrollspy — the chapter crossing the upper-middle of the viewport owns
  // the rail. A narrow rootMargin band keeps exactly one chapter active.
  useEffect(() => {
    const indexBySlug = new Map(services.map((s, i) => [s.slug, i]));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = indexBySlug.get(entry.target.id);
            if (i !== undefined) setActive(i);
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    for (const s of services) {
      const el = document.getElementById(s.slug);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  const onJump = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    glideTo(slug, reduce);
  };

  return (
    <>
      {/* ── Quick index ─────────────────────────────────────────────────── */}
      <Section tone="transparent" size="wide" className="!pb-0 !pt-10 sm:!pt-14">
        <motion.div
          variants={textContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap items-center gap-2.5"
        >
          <motion.span
            variants={textItem(reduce)}
            className="mr-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle"
          >
            {String(services.length).padStart(2, '0')} services
          </motion.span>
          {services.map((s, i) => (
            <motion.a
              key={s.slug}
              variants={textItem(reduce)}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              href={`#${s.slug}`}
              onClick={(e) => onJump(e, s.slug)}
              className={cn(
                'group inline-flex items-center gap-2.5 rounded-full bg-surface px-4 py-2 text-[13px] font-medium ring-1 transition-colors duration-200',
                active === i
                  ? 'text-ink ring-ink/30'
                  : 'text-ink-muted ring-hairline hover:text-ink hover:ring-ink/30',
              )}
            >
              <span className="font-pirulen text-[9px] leading-none text-accent">
                0{i + 1}
              </span>
              {s.shortTitle}
            </motion.a>
          ))}
        </motion.div>
      </Section>

      {/* ── Chapters + page-map rail ────────────────────────────────────── */}
      <Section tone="transparent" size="wide" className="!pt-14 sm:!pt-20">
        <div className="xl:grid xl:grid-cols-[190px_minmax(0,1fr)] xl:gap-14">
          <nav aria-label="Services on this page" className="hidden xl:block">
            <div className="sticky top-28">
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                On this page
              </p>
              <ol className="border-l border-hairline">
                {services.map((s, i) => (
                  <li key={s.slug} className="relative">
                    {/* Sliding accent indicator — one shared element that
                        animates between rail items as chapters change. */}
                    {active === i && (
                      <motion.span
                        layoutId="service-rail-indicator"
                        transition={{ duration: 0.45, ease: EASE_SOFT }}
                        className="absolute -left-px top-1 bottom-1 w-[2px] rounded-full bg-accent"
                      />
                    )}
                    <a
                      href={`#${s.slug}`}
                      onClick={(e) => onJump(e, s.slug)}
                      className={cn(
                        'group flex items-baseline gap-3 py-1.5 pl-4 text-[13px] transition-colors duration-200',
                        active === i ? 'text-ink' : 'text-ink-muted hover:text-ink',
                      )}
                    >
                      <span
                        className={cn(
                          'font-pirulen text-[9px] leading-none transition-colors duration-200',
                          active === i ? 'text-accent' : 'text-ink-subtle group-hover:text-accent',
                        )}
                      >
                        0{i + 1}
                      </span>
                      {s.shortTitle}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          {/* Compact progress rail — the mobile/tablet equivalent of the
              desktop "On this page" nav (which is xl:-only). Sticks just
              below the floating header and reads off the same scrollspy
              state, so wayfinding survives on every screen smaller than xl:. */}
          <div className="sticky top-24 z-20 mb-8 rounded-2xl bg-surface/95 p-4 shadow-soft ring-1 ring-hairline backdrop-blur-md xl:hidden">
            <div className="flex items-center justify-between gap-4">
              <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-ink">
                <span className="shrink-0 font-pirulen text-[10px] text-accent">
                  0{active + 1}
                </span>
                <span className="truncate">{services[active].shortTitle}</span>
              </span>
              <span className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                {active + 1} / {services.length}
              </span>
            </div>
            <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-hairline">
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${((active + 1) / services.length) * 100}%` }}
                transition={{ duration: reduce ? 0 : 0.4, ease: EASE_SOFT }}
              />
            </div>
          </div>

          <div className="space-y-24 lg:space-y-28">
            {services.map((service, idx) => (
              <Chapter key={service.slug} service={service} idx={idx} reduce={reduce} />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

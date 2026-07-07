'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/cn';

type Props = {
  /** Full-bleed background photo for the header. */
  image: string;
  imageAlt?: string;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Set false for below-the-fold heroes (e.g. deep catalogue pages). */
  priority?: boolean;
  /** Fade the bottom edge of the white sheet into the page so short pages don't
      show a hard line where the sheet meets the ambient backdrop. */
  softBottom?: boolean;
  /** The page content — rendered inside the curved sheet that rises over the
      pinned header during the reveal. */
  children?: React.ReactNode;
};

// Shared page header for every page except home and book.
//
// Pinned 3D reveal: the photo header is sticky (locked to the viewport) while
// the white curved content sheet scrolls up and over it — so the content reads
// as rushing up much faster than the frozen header and "grabbing" the screen.
// As it does, the header photo recedes into 3D space: it scales down, darkens
// and rounds into a card sinking behind the rising sheet, and the title fades
// back with it. All of it is disabled under prefers-reduced-motion.
export function PageHero({
  image,
  imageAlt = '',
  eyebrow,
  title,
  subtitle,
  priority = true,
  softBottom = false,
  children,
}: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Progress 0 → 1 as the sheet's top rises from the bottom of the viewport to
  // the top — i.e. across the reveal. Measured on the (normally-scrolling)
  // sheet, because the pinned header can't measure its own scroll.
  const { scrollYProgress } = useScroll({
    target: sheetRef,
    offset: ['start end', 'start start'],
  });

  // The sheet sits higher at rest (it peeks up over the hero), so the reveal
  // progress is already non-zero on load. Start the recede a touch in so the
  // header still looks pristine until the user actually begins scrolling.
  const REVEAL_START = 0.34;

  // Header recedes: photo scales down + rounds + darkens; title fades/scales back.
  const cardScale = useTransform(scrollYProgress, [REVEAL_START, 1], reduce ? [1, 1] : [1.15, 0.9]);
  const cardRadius = useTransform(scrollYProgress, [REVEAL_START, 1], reduce ? ['0px', '0px'] : ['0px', '28px']);
  const dim = useTransform(scrollYProgress, [REVEAL_START, 1], reduce ? [0, 0] : [0, 0.45]);
  const textOpacity = useTransform(scrollYProgress, [REVEAL_START, 0.6], reduce ? [1, 1] : [1, 0]);
  const textScale = useTransform(scrollYProgress, [REVEAL_START, 0.6], reduce ? [1, 1] : [1, 0.95]);

  return (
    <>
      <section className="sticky top-0 z-0 isolate flex h-[100svh] items-center justify-center overflow-hidden bg-ink px-6 pb-[24vh] text-center sm:pb-[34vh]">
        {/* Receding photo "card" — image + its washes scale, round and dim
            together so it reads as one surface sinking back into the frame. */}
        <motion.div
          style={{ scale: cardScale, borderRadius: cardRadius }}
          aria-hidden="true"
          className="absolute inset-0 -z-10 overflow-hidden will-change-transform"
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover"
          />
          {/* Legibility wash + soft vignette. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/65" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 38%, transparent 40%, rgba(0,0,0,0.4) 100%)',
            }}
          />
          {/* Extra darkening that deepens as the header recedes. */}
          <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black" />
        </motion.div>

        <Container size="wide" className="relative z-10">
          <motion.div
            style={{ opacity: textOpacity, scale: textScale }}
            className="mx-auto max-w-3xl will-change-transform"
          >
            {eyebrow && (
              <span className="inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white ring-1 ring-white/25 backdrop-blur-sm">
                {eyebrow}
              </span>
            )}
            <h1 className="mt-6 text-balance text-[30px] leading-[1.08] tracking-tightest !text-white sm:text-[38px] md:text-[47px]">
              {title}
            </h1>
            {subtitle && (
              // Reserve two lines of height so a short, one-line subtitle still
              // occupies the same space as the longer subtitles on other pages.
              // The hero block is vertically centered, so without this a shorter
              // subtitle shrinks the block and drops the eyebrow pill lower —
              // making the pill sit at a different height page-to-page.
              <p className="mx-auto mt-5 min-h-[3.25rem] max-w-xl text-pretty text-[16px] leading-relaxed text-white/80 sm:min-h-[3.625rem] sm:text-lg">
                {subtitle}
              </p>
            )}
          </motion.div>
        </Container>
      </section>

      {/* The white curved sheet. The pinned header sits behind it (lower z), so
          as the page scrolls this rushes up and over the receding header.

          The reveal lift (the dark shadow where the white sheet rises over the
          hero photo) is wanted only at the TOP edge, and it must follow the
          sheet's rounded top corners — a full-width gradient RECTANGLE can't, so
          its straight bottom edge left the curve reading as a hard, unblended
          seam against the photo. A box-shadow respects border-radius, so the
          lift hugs (wraps) the rounded corners. The NEGATIVE spread is what
          makes this safe: it pulls the blur inward on the sides/bottom while the
          negative Y offset pushes the shadow up onto the hero — so there's no
          bottom-edge hairline in the white space above the footer. */}
      <div
        ref={sheetRef}
        className={cn(
          "relative z-10 -mt-[24vh] rounded-t-[3.5rem] bg-surface shadow-[0_-22px_48px_-22px_rgba(0,0,0,0.45)] sm:-mt-[34vh] sm:rounded-t-[6rem]",
          // Soft tail below the sheet: white fades out over the gap above the
          // footer, so the sheet's bottom edge never reads as a hard line where
          // the ambient backdrop shows through on short pages.
          softBottom &&
            "after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-44 after:bg-gradient-to-b after:from-surface after:to-transparent after:content-['']",
        )}
      >
        {children}
      </div>
    </>
  );
}

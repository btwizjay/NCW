"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { CheckIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

const workshopSlides = [
  {
    image: "/images/workshop/1.jpeg",
    eyebrow: "The Workshop",
    title: "Two decades of patient cabin work.",
    description:
      "Nilantha began by re-trimming a single van seat in 2003. Today, our workshop in Pasyala handles full interiors for vans, jeeps, cars and commercial vehicles — with the same patient eye for detail.",
    highlights: [
      "Genuine Japanese seat sets, sourced and inspected by us",
      "High-density foam suited to the Sri Lankan climate",
    ],
  },
  {
    image: "/images/workshop/2.JPG",
    eyebrow: "Craftsmanship",
    title: "Hand-stitched leather and fabric finishes.",
    description:
      "Every stitch is placed by hand using industrial-grade thread and needles. Our finishes are built to withstand years of daily use in the Sri Lankan climate.",
    highlights: [
      "Hand-stitched leather and fabric work",
      "Premium materials selected for durability",
    ],
  },
  {
    image: "/images/workshop/3.jpeg",
    eyebrow: "Materials",
    title: "Built for our climate.",
    description:
      "We select every foam, fabric and adhesive for the heat and humidity of Sri Lanka. Our work stays tight, clean and comfortable — year after year.",
    highlights: [
      "Climate-resistant adhesives and fabrics",
      "Foam profiles tuned for heat and humidity",
    ],
  },
  {
    image: "/images/workshop/4.jpeg",
    eyebrow: "Service",
    title: "Workshop pickup across the region.",
    description:
      "We make the process easy — from consultation to finished fit, every detail is handled with care. Pickup service available across the greater Colombo region.",
    highlights: [
      "Workshop pickup across the greater Colombo region",
      "Consultation to finished fit in one place",
    ],
  },
];

function StickyImageCard({
  imgUrl,
  cardRef,
  isLast,
}: {
  imgUrl: string;
  cardRef: (el: HTMLDivElement | null) => void;
  isLast: boolean;
}) {
  const vertMargin = 15;
  const container = useRef<HTMLDivElement | null>(null);
  const [maxScrollY, setMaxScrollY] = useState(Infinity);

  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  const negateRotate = useTransform(rotate, (v) => -v);

  const { scrollY } = useScroll();

  const isInView = useInView(container, {
    margin: `0px 0px -${100 - vertMargin}% 0px`,
    once: true,
  });

  useEffect(() => {
    if (isLast) return;
    const unsubscribe = scrollY.on("change", (latest) => {
      if (latest <= maxScrollY) {
        scale.set(1);
        rotate.set(0);
        return;
      }
      const progress = Math.max(0, 1 - (latest - maxScrollY) / 10000);
      scale.set(progress);
      rotate.set((1 - progress) * 100);
    });
    return unsubscribe;
  }, [isLast, maxScrollY, scale, rotate, scrollY]);

  useEffect(() => {
    if (isInView) {
      setMaxScrollY(scrollY.get());
    }
  }, [isInView, scrollY]);

  return (
    <motion.div
      ref={(el) => {
        container.current = el;
        cardRef(el);
      }}
      className="sticky w-full overflow-hidden rounded-3xl bg-surface-alt shadow-soft"
      style={{
        scale,
        rotate,
        height: `${100 - 2 * vertMargin}vh`,
        top: `${vertMargin}vh`,
      }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ rotate: negateRotate }}
      >
        <Image
          src={imgUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="scale-125 object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

export function Showcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let idx = 0;
      cardEls.current.forEach((el, i) => {
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (mid >= top) idx = i;
        }
      });
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActiveIndex(idx);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const slide = workshopSlides[activeIndex];

  return (
    <section className="relative py-16 sm:py-24">
      <Container size="wide">
        <div className="grid lg:grid-cols-12 lg:gap-16">
          {/* Left — scrolling sticky images */}
          <div className="flex flex-col gap-[10vh] lg:col-span-7">
            {workshopSlides.map((s, idx) => (
              <StickyImageCard
                key={idx}
                imgUrl={s.image}
                isLast={idx === workshopSlides.length - 1}
                cardRef={(el) => {
                  cardEls.current[idx] = el;
                }}
              />
            ))}
          </div>

          {/* Right — sticky text panel (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[15vh] flex h-[70vh] items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full"
                >
                  <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {slide.eyebrow}
                  </p>
                  <h2 className="text-balance text-[20px] tracking-tighter sm:text-[24px] md:text-[30px] leading-[1.15]">
                    {slide.title}
                  </h2>
                  <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-muted">
                    {slide.description}
                  </p>
                  <ul className="mt-8 space-y-4">
                    {slide.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-3 text-[15px] text-ink"
                      >
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <Button href="/about" variant="primary" size="md">
                      Read our story
                    </Button>
                    <Button href="/services" variant="secondary" size="md">
                      Browse services
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile — static text below the scroll cards */}
        <div className="mt-12 lg:hidden">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {workshopSlides[0].eyebrow}
          </p>
          <h2 className="text-balance text-[20px] tracking-tighter sm:text-[24px] leading-[1.15]">
            {workshopSlides[0].title}
          </h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-muted">
            {workshopSlides[0].description}
          </p>
          <ul className="mt-8 space-y-4">
            {workshopSlides[0].highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-3 text-[15px] text-ink"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <CheckIcon className="h-3 w-3" />
                </span>
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/about" variant="primary" size="md">
              Read our story
            </Button>
            <Button href="/services" variant="secondary" size="md">
              Browse services
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

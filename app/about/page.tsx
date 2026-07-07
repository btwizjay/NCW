import Image from 'next/image';
import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { Section, SectionHeader } from '@/components/ui/Section';
import { CheckIcon } from '@/components/ui/Icons';
import { Armchair, Award, Scissors } from 'lucide-react';
import { business } from '@/content/business';
import { pageMetadata } from '@/lib/seo';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';

export const metadata: Metadata = pageMetadata(
  'About',
  `Family-run vehicle cushion workshop in Pasyala. ${business.name} has been serving Sri Lankan drivers since ${business.established}.`,
);

const highlights = [
  {
    icon: Armchair,
    title: `Crafting Interiors Since ${business.established}`,
    body: 'Two decades of hand-finished cushion work, seat sets and full interior restoration.',
  },
  {
    icon: Award,
    title: 'Trusted by Drivers Island-Wide',
    body: 'Private owners, school vans, tour operators and fleets — most arrive on a recommendation.',
  },
  {
    icon: Scissors,
    title: 'Your Comfort, Our Craft',
    body: 'Every cabin is built to last through Sri Lankan heat, dust and long days on the road.',
  },
];

const values = [
  {
    title: 'Hand-finished work',
    body: 'Every cushion, panel and trim is checked by hand. No corners, no shortcuts.',
  },
  {
    title: 'Honest timelines',
    body: 'We tell you when your vehicle will be ready — and we keep to that date.',
  },
  {
    title: 'Climate-aware materials',
    body: 'Adhesives, foams and fabrics chosen for Sri Lankan heat and humidity.',
  },
  {
    title: 'Workshop-based',
    body: 'All work is done in-house at our Pasyala workshop, never sub-contracted.',
  },
];

const team = [
  {
    name: 'Kasun Perera',
    role: 'Senior Cushion Craftsman',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sahan Silva',
    role: 'Seat & Foam Specialist',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ruwan Jayasuriya',
    role: 'Trim & Finishing Lead',
    image:
      'https://images.unsplash.com/photo-1542178243-bc20204b769f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dinesh Bandara',
    role: 'Leather & Vinyl Specialist',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image="/images/workshop/3.jpeg"
        imageAlt={`Inside the ${business.name} workshop`}
        eyebrow="Our story"
        title="About Us"
        subtitle="Begin Your Journey to True Restoration"
      >

      <Section tone="transparent" size="wide" className="!pb-0 !pt-12 sm:!pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Welcome to {business.name}
          </p>
          <h2 className="text-balance text-[22px] tracking-tighter sm:text-[26px] md:text-[32px] leading-[1.15]">
            Thank you for stopping by.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-[16px] leading-relaxed text-ink-muted">
            For over two decades, {business.name} has treated every vehicle that comes
            through our Pasyala workshop as if it were our own. Take a look around — we’re
            glad you’re here.
          </p>
        </div>

        <div className="mt-16 grid gap-10 sm:mt-24 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, title, body }) => (
            <div key={title} className="px-6 text-center">
              <span className="mx-auto flex items-center justify-center text-accent">
                <Icon className="h-8 w-8" strokeWidth={1.5} />
              </span>
              <h3 className="mt-5 text-[17px] tracking-tight sm:text-[19px] leading-[1.2]">{title}</h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="transparent" size="wide" className="!pb-10 !pt-24 sm:!pb-14 sm:!pt-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-4xl bg-surface-alt shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?auto=format&fit=crop&w=1600&q=80"
                alt="Workshop floor"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="text-balance text-[20px] tracking-tighter sm:text-[24px] md:text-[30px] leading-[1.15]">
              The work speaks before we do.
            </h2>
            <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-ink-muted">
              <p>
                Most drivers find us the same way — a friend’s re-trimmed seat, a relative’s
                restored cabin, a quiet word passed along after a job done right. That trust
                took years to earn, and we protect it on every vehicle that rolls in.
              </p>
              <p>
                From private cars and family school vans to tour operators and full commercial
                fleets, the brief never changes: make it comfortable, make it last, and make
                it look like it was never touched — one cabin at a time.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="transparent" size="wide" className="!pb-10 !pt-10 sm:!pb-14 sm:!pt-14">
        <SectionHeader
          align="center"
          eyebrow="What we stand for"
          title="The four things we never compromise on."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-3xl bg-surface p-7 ring-1 ring-hairline">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                <CheckIcon className="h-4 w-4" />
              </span>
              <h3 className="mt-5 text-[15px] tracking-tight sm:text-[16px] leading-[1.2]">{v.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="transparent" size="wide" className="!pt-10 sm:!pt-14">
        <SectionHeader
          align="center"
          eyebrow="Our team"
          title="Meet the hands behind the work."
          description="Skilled, steady and proud of every cabin — the people who make your interior feel new again."
        />
        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface-alt">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-5 text-[17px] tracking-tight sm:text-[19px] leading-[1.2]">{member.name}</h3>
              <p className="mt-1.5 text-[14px] font-medium text-accent">{member.role}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="transparent" size="wide">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {[
            'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1583267746897-2cf66319ef97?auto=format&fit=crop&w=1000&q=80',
          ].map((src, i) => (
            <div key={i} className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-surface-alt">
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Section>
      </PageHero>

      <HomepageBackdrop />
    </>
  );
}

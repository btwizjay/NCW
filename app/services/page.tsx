import Image from 'next/image';
import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { CheckIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { services } from '@/content/services';
import { pageMetadata } from '@/lib/seo';
import { waLink, waMessage } from '@/lib/whatsapp';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';

export const metadata: Metadata = pageMetadata(
  'Services',
  'Vehicle cushion work, Japanese seat sets, leather upholstery and full interior restoration in Pasyala, Sri Lanka.',
);

export default function ServicesPage() {
  return (
    <>
      <PageHero
        image="/images/workshop/3.jpeg"
        imageAlt="Vehicle interior work in the workshop"
        eyebrow="Our services"
        title="What We Provide"
        subtitle="Each service is finished by hand and signed off in person. Tap any service to enquire about your vehicle."
      >

      <Section tone="transparent" size="wide" className="!pt-8 sm:!pt-12">
        <div className="space-y-24 lg:space-y-32">
          {services.map((service, idx) => (
            <article
              key={service.slug}
              id={service.slug}
              className="grid scroll-mt-28 gap-10 lg:grid-cols-12 lg:gap-16"
            >
              <div className={`relative lg:col-span-7 ${idx % 2 ? 'lg:order-2' : ''}`}>
                <div className="relative aspect-[5/4] w-full overflow-hidden rounded-4xl bg-surface-alt shadow-soft">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className={`flex flex-col justify-center lg:col-span-5 ${idx % 2 ? 'lg:order-1' : ''}`}>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-accent">
                  0{idx + 1} · {service.shortTitle}
                </p>
                <h2 className="text-balance text-[20px] tracking-tighter sm:text-[24px] md:text-[30px] leading-[1.15]">
                  {service.title}
                </h2>
                <p className="mt-5 text-pretty text-[17px] leading-relaxed text-ink-muted">
                  {service.description}
                </p>
                <ul className="mt-7 space-y-3">
                  {service.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-[15px] text-ink">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button
                    href={waLink(waMessage(`I'd like to enquire about ${service.title}.`))}
                    external
                    variant="whatsapp"
                    size="md"
                    iconLeft={<WhatsAppIcon className="h-4 w-4" />}
                  >
                    Enquire on WhatsApp
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      </PageHero>

      <HomepageBackdrop />
    </>
  );
}

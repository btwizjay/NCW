import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { CtaBanner } from '@/components/home/CtaBanner';
import { ServicesChapters } from '@/components/services/ServicesChapters';
import { pageMetadata } from '@/lib/seo';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';

export const metadata: Metadata = pageMetadata(
  'Services',
  'Vehicle cushion work, Japanese seat sets, leather upholstery and full interior restoration in Pasyala, Sri Lanka.',
  { path: '/services' },
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
        <ServicesChapters />
        <CtaBanner />
      </PageHero>

      <HomepageBackdrop />
    </>
  );
}

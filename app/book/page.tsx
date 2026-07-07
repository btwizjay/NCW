import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { Container } from '@/components/ui/Container';
import { BookingScheduler } from '@/components/book/BookingScheduler';
import { PageAtmosphere } from '@/components/ui/PageAtmosphere';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';
import { business } from '@/content/business';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata(
  'Book an Appointment',
  'Schedule a workshop visit for cushion work, Japanese seat fitting, leather re-trim or full interior restoration — pick a date and time online.',
);

export default function BookPage() {
  return (
    <>
      <PageAtmosphere />

      <PageHero
        image="/images/workshop/3.jpeg"
        imageAlt={`Inside the ${business.name} workshop`}
        eyebrow="Book"
        title="Book an Appointment"
        softBottom
        subtitle="Choose a service, then pick a day and time that suits you. We’ll confirm by phone or WhatsApp and share a written quote before any work starts."
      >
        <section className="pt-12 pb-24 sm:pt-16 sm:pb-32">
          <Container size="wide">
            <BookingScheduler />
          </Container>
        </section>
      </PageHero>

      <HomepageBackdrop />
    </>
  );
}

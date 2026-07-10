import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { ContactContent } from '@/components/contact/ContactContent';
import { PageAtmosphere } from '@/components/ui/PageAtmosphere';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';
import { business } from '@/content/business';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata(
  'Contact',
  `Visit our workshop in Pasyala, call ${business.phone.display} or message us on WhatsApp.`,
  { path: '/contact' },
);

export default function ContactPage() {
  return (
    <>
      <PageAtmosphere />
      <PageHero
        image="/images/workshop/3.jpeg"
        imageAlt={`The ${business.name} workshop`}
        eyebrow="Contact"
        title="Contact Us"
        subtitle="Message us, call, or send a few details, and we’ll reply with honest advice and a clear quote."
      >
        <ContactContent />
      </PageHero>
      <HomepageBackdrop />
    </>
  );
}

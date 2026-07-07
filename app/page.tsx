import { Suspense } from 'react';
import { Hero } from '@/components/home/Hero';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { Showcase } from '@/components/home/Showcase';
import { HowItWorks } from '@/components/home/HowItWorks';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { Testimonials } from '@/components/home/Testimonials';
import { LocationTeaser } from '@/components/home/LocationTeaser';
import { CtaBanner } from '@/components/home/CtaBanner';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';
import { PageLoader } from '@/components/PageLoader';
import { getFeaturedProducts } from '@/sanity/lib/data';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      {/* Stream the Featured Work section so the Hero + Marquee + Services
          paint without waiting on the Sanity fetch. */}
      <Suspense fallback={null}>
        <FeaturedWorkSection />
      </Suspense>
      <Showcase />
      <HowItWorks />
      <Testimonials />
      <LocationTeaser />
      <CtaBanner />
      <HomepageBackdrop />
      <PageLoader />
    </>
  );
}

async function FeaturedWorkSection() {
  const featuredProducts = await getFeaturedProducts();
  return <FeaturedWork products={featuredProducts} />;
}

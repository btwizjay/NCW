import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';

export default function NotFound() {
  return (
    <>
      <PageHero
        image="/images/workshop/3.jpeg"
        imageAlt="Inside the workshop"
        eyebrow="404"
        title="We couldn’t find that page."
        subtitle="It may have moved, or the link could be incorrect. Try one of the pages below."
      >

      <Container size="narrow" className="pb-24 pt-4 text-center sm:pb-32">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" variant="primary">Back to home</Button>
          <Button href="/contact" variant="secondary">Contact us</Button>
        </div>
      </Container>
      </PageHero>
      <HomepageBackdrop />
    </>
  );
}

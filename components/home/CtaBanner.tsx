import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { PhoneIcon } from '@/components/ui/Icons';
import { telLink } from '@/lib/whatsapp';
import { business } from '@/content/business';

export function CtaBanner() {
  return (
    <Section
      tone="transparent"
      size="wide"
      spacing="tight"
      className="!pt-12 sm:!pt-16 !pb-12 sm:!pb-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-[20px] tracking-tighter !text-ink sm:text-[24px] md:text-[30px] leading-[1.15]">
          Ready to refresh your vehicle’s interior?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-pretty text-[15px] leading-relaxed text-ink-muted sm:text-base">
          Send a photo of what you’d like done — we’ll come back with an honest quote and a clear timeline.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/book" variant="primary" size="md">
            Book Appointment
          </Button>
          <Button
            href={telLink}
            variant="secondary"
            size="md"
            iconLeft={<PhoneIcon className="h-4 w-4" />}
          >
            Call {business.phone.display}
          </Button>
        </div>
      </div>
    </Section>
  );
}

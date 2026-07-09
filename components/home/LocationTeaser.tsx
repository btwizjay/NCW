import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import {
  PinIcon,
  PhoneIcon,
  ClockIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons';
import { business } from '@/content/business';
import { telLink } from '@/lib/whatsapp';

export function LocationTeaser() {
  return (
    <Section tone="transparent" size="wide" spacing="tight">
      <p className="mb-8 text-center font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Find us
      </p>
      <div className="space-y-4 sm:relative sm:space-y-0 sm:overflow-hidden sm:rounded-3xl sm:ring-1 sm:ring-hairline sm:shadow-soft">
        {/* Map. Below sm: this is its own full-height card — the info panel
            moves into normal flow underneath it instead of floating on top,
            so the map is never hidden behind a taller-than-the-map overlay
            on narrow screens. From sm: up there's enough width for the
            floating frosted panel to sit in a corner without covering it. */}
        <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl ring-1 ring-hairline shadow-soft sm:aspect-[16/10] sm:rounded-none sm:ring-0 sm:shadow-none lg:aspect-[16/7]">
          <iframe
            src={business.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full"
            title={`${business.name} workshop location in ${business.address.city}`}
          />
        </div>

        {/* Info panel — a plain standalone card on mobile; a floating
            frosted-glass panel over the map from sm: up. */}
        <div className="sm:absolute sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-md lg:bottom-6 lg:left-6">
          <div className="rounded-2xl bg-white p-5 shadow-lift ring-1 ring-hairline sm:bg-white/80 sm:backdrop-blur-xl sm:p-6">
            <h2 className="text-[18px] tracking-tighter leading-[1.2] sm:text-[20px]">
              Our workshop in Pasyala.
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <PinIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-muted" />
                <p className="text-[13px] leading-snug text-ink-muted">
                  {business.address.formatted}
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <ClockIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-muted" />
                <div className="text-[13px] leading-snug text-ink-muted">
                  {business.hours.map((h) => (
                    <p key={h.day}>
                      <span className="text-ink">{h.day}</span>{' '}
                      {h.open}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              <Button
                href={business.mapLinkUrl}
                external
                variant="primary"
                size="sm"
                iconRight={<ArrowRightIcon className="h-3.5 w-3.5" />}
              >
                Get Directions
              </Button>
              <Button
                href={telLink}
                variant="secondary"
                size="sm"
                iconLeft={<PhoneIcon className="h-3.5 w-3.5" />}
              >
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { OpenStatus } from '@/components/ui/OpenStatus';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { MessageCircle, ClipboardCheck, CarFront } from 'lucide-react';
import { business } from '@/content/business';
import { telLink, waLink, waMessage } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

const steps = [
  {
    k: '01',
    icon: MessageCircle,
    meta: 'Takes two minutes',
    title: 'Tell us about it',
    body: 'Share your vehicle, the work you want done, and a day that suits you, here or on WhatsApp.',
    // How far this tag hangs below the thread, and its resting tilt.
    hang: 'lg:h-8',
    tilt: 'lg:rotate-[-1.2deg]',
  },
  {
    k: '02',
    icon: ClipboardCheck,
    meta: 'Within one working day',
    title: 'We confirm & quote',
    body: 'We call to confirm the slot and send a clear written quote. No surprises later.',
    hang: 'lg:h-16',
    tilt: 'lg:rotate-[1.2deg]',
  },
  {
    k: '03',
    icon: CarFront,
    meta: 'At the Pasyala workshop',
    title: 'Bring it in',
    body: 'Drop the vehicle with us. We finish by hand and sign it off with you in person.',
    hang: 'lg:h-11',
    tilt: 'lg:rotate-[-0.8deg]',
  },
];

// Dark, immersive process band — a rounded panel that echoes the home hero
// card. The three steps hang like fabric swing tags from a stitched thread
// that slowly sews across the band: each tag has a punched hole, its own
// thread, and a slight swing that settles on hover. Everything here is plain
// CSS (no scroll listeners, no sticky), so it cannot interfere with the
// scroll-driven showcase above.
export function HowItWorks() {
  return (
    <section className="px-2 py-10 sm:px-2.5 sm:py-14 lg:px-3">
      <div className="relative isolate overflow-hidden rounded-[16px] bg-ink text-white shadow-lift ring-1 ring-black/5">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-[5%] -top-[30%] h-[28rem] w-[28rem] rounded-full bg-accent/40 blur-3xl animate-aurora" />
          <div
            className="absolute -bottom-[40%] right-[-5%] h-[26rem] w-[26rem] rounded-full blur-3xl animate-aurora"
            style={{ background: 'rgba(169,25,22,0.30)', animationDelay: '-8s' }}
          />
          {/* NCW logo watermark — the brand mark painted in a blue→red wash
              through a CSS mask, receding into the panel's right side. */}
          <div
            className="absolute -right-16 top-1/2 hidden aspect-[1875/1350] h-[120%] -translate-y-1/2 opacity-[0.07] sm:block"
            style={{
              background:
                'linear-gradient(135deg, #E8EBF7 0%, #24388b 45%, #a91916 100%)',
              WebkitMaskImage: "url('/images/ncw.svg')",
              maskImage: "url('/images/ncw.svg')",
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
          />
        </div>

        <Container size="wide" className="py-10 sm:py-14">
          {/* Header row — title left, a grounding line right. */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                How it works
              </p>
              <h2 className="text-balance text-[19px] leading-[1.15] tracking-tighter !text-white sm:text-[22px] md:text-[26px]">
                Three steps from enquiry to a finished cabin.
              </h2>
            </div>
            <p className="max-w-xs text-[14px] leading-relaxed text-white/60 lg:pb-1 lg:text-right">
              No deposit to enquire, no jargon in the quote. From first message to
              hand-back, you always know what happens next.
            </p>
          </div>

          {/* The clothesline — a stitched thread with three tags hanging at
              different depths. On mobile the tags stack, joined by short
              vertical threads. */}
          <div className="relative mt-10 lg:mt-14">
            {/* Horizontal thread (desktop). */}
            <div
              aria-hidden="true"
              className="stitch-thread absolute inset-x-2 top-0 hidden rounded-full lg:block"
            />

            <ol className="grid gap-0 lg:grid-cols-3 lg:gap-6">
              {steps.map(({ k, icon: Icon, meta, title, body, hang, tilt }, i) => (
                <li key={k} className="relative flex flex-col items-center">
                  {/* Rivet on the thread. */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-[11px] z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-ink lg:flex"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-soft/70" />
                  </span>

                  {/* This tag's own hanging thread. */}
                  <span
                    aria-hidden="true"
                    className={cn('hidden w-px border-l border-dashed border-white/25 lg:block', hang)}
                  />

                  {/* The swing tag. */}
                  <div
                    className={cn(
                      'group relative w-full rounded-3xl border border-white/10 bg-white/[0.04] p-5 pt-8 backdrop-blur-sm transition-all duration-500 ease-soft hover:border-white/20 hover:bg-white/[0.07] lg:hover:rotate-0',
                      tilt,
                    )}
                  >
                    {/* Punched hole the thread passes through. */}
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-ink ring-2 ring-white/25"
                    />
                    {/* Numeral watermark. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-6 select-none font-pirulen text-[30px] leading-none tracking-tight text-white/[0.08] transition-colors duration-300 group-hover:text-white/[0.15]"
                    >
                      {k}
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white ring-1 ring-white/15">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <p className="mt-4 font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/50">
                      {meta}
                    </p>
                    <h3 className="mt-1.5 text-[14px] leading-[1.2] tracking-tight !text-white sm:text-[15px]">
                      {title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-white/70">
                      {body}
                    </p>
                  </div>

                  {/* Mobile connector down to the next tag. */}
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="h-7 w-px border-l border-dashed border-white/25 lg:hidden"
                    />
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* CTA row — actions left, live workshop status right. */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href={waLink(waMessage('I would like to book an appointment.', 'home'))}
                external
                variant="whatsapp"
                size="sm"
                iconLeft={<WhatsAppIcon className="h-4 w-4" />}
              >
                Book on WhatsApp
              </Button>
              <Button
                href={telLink}
                variant="secondary"
                size="sm"
                iconLeft={<PhoneIcon className="h-4 w-4" />}
                className="!bg-white/10 !text-white !border-white/30 hover:!bg-white/20 hover:!border-white/50 backdrop-blur-md"
              >
                Call {business.phone.display}
              </Button>
            </div>
            <OpenStatus tone="dark" />
          </div>
        </Container>
      </div>
    </section>
  );
}

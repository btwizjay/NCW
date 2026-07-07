import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PhoneIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { business } from '@/content/business';
import { telLink, waLink, waMessage } from '@/lib/whatsapp';

const steps = [
  {
    k: '01',
    title: 'Tell us about it',
    body: 'Share your vehicle, the work you want done, and a day that suits you — here or on WhatsApp.',
  },
  {
    k: '02',
    title: 'We confirm & quote',
    body: 'Within one working day we call to confirm the slot and send a clear written quote.',
  },
  {
    k: '03',
    title: 'Bring it in',
    body: 'Drop the vehicle at our Pasyala workshop. We finish by hand and sign it off in person.',
  },
];

// Dark, immersive process band — a rounded panel that echoes the home hero
// card. Lives on the homepage between the craftsmanship showcase and the
// testimonials.
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
        </div>

        <Container size="wide" className="py-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              How it works
            </p>
            <h2 className="text-balance text-[22px] leading-[1.15] tracking-tighter !text-white sm:text-[26px] md:text-[32px]">
              Three steps from enquiry to a finished cabin.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3 sm:gap-5">
            {steps.map((s) => (
              <div
                key={s.k}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.07]"
              >
                <span className="font-pirulen text-[28px] leading-none tracking-tight text-white/25">
                  {s.k}
                </span>
                <h3 className="mt-5 text-[16px] leading-[1.2] tracking-tight !text-white">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-white/70">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              href={waLink(waMessage('I would like to book an appointment.', 'home'))}
              external
              variant="whatsapp"
              size="md"
              iconLeft={<WhatsAppIcon className="h-4 w-4" />}
            >
              Book on WhatsApp
            </Button>
            <Button
              href={telLink}
              variant="secondary"
              size="md"
              iconLeft={<PhoneIcon className="h-4 w-4" />}
              className="!bg-white/10 !text-white !border-white/30 hover:!bg-white/20 hover:!border-white/50 backdrop-blur-md"
            >
              Call {business.phone.display}
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
}

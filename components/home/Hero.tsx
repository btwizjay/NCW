import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { ViewportMarquee } from '@/components/ui/ViewportMarquee';
import { HeroVideo } from '@/components/home/HeroVideo';
import { waLink, waMessage } from '@/lib/whatsapp';
import { business } from '@/content/business';

type Brand = {
  name: string;
  slug: string;
  localSrc?: string;
};

const brands: Brand[] = [
  { name: 'Toyota', slug: 'toyota' },
  { name: 'Honda', slug: 'honda' },
  { name: 'Suzuki', slug: 'suzuki' },
  { name: 'Mitsubishi', slug: 'mitsubishi' },
  { name: 'Nissan', slug: 'nissan' },
  { name: 'Mazda', slug: 'mazda' },
  { name: 'Hyundai', slug: 'hyundai' },
  { name: 'Kia', slug: 'kia' },
  { name: 'BMW', slug: 'bmw' },
  { name: 'Mercedes-Benz', slug: 'mercedes', localSrc: '/brands/mercedes.svg' },
  { name: 'Audi', slug: 'audi' },
];

const heroIconColor = 'FFFFFF';

export function Hero() {
  const looped = [...brands, ...brands];

  return (
    <section className="flex h-[100svh] w-full flex-col p-1.5 sm:p-2">
      <div className="relative isolate mx-auto flex flex-1 flex-col w-full overflow-hidden rounded-[12px] bg-ink text-white shadow-lift ring-1 ring-black/5 lg:rounded-[16px]">
        <HeroVideo />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-tr from-black/80 via-black/40 to-black/5"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/15 to-transparent"
        />

        <Container
          size="wide"
          className="relative z-10 flex w-full flex-1 flex-col justify-center pb-8 pt-28 sm:pb-10 lg:pb-12 lg:pt-36"
        >
          <div className="max-w-3xl">
            <h1 className="reveal" style={{ textTransform: 'none' }}>
              <span
                className="block text-[36px] leading-[1.3] sm:text-[46px] md:text-[56px] lg:text-[66px]"
                style={{ fontFamily: "'THARU DIGITAL MAHEE', sans-serif", color: '#f0d302' }}
              >
                jdyk iqjmyiqlrKfha
              </span>
              <span
                className="-mt-2 block text-[52px] leading-[1.1] text-white sm:-mt-3 sm:text-[72px] md:-mt-4 md:text-[90px] lg:-mt-5 lg:text-[110px]"
                style={{ fontFamily: "'THARU DIGITAL NIKINI', sans-serif" }}
              >
                .=ref.or
              </span>
            </h1>

            <p className="reveal reveal-delay-2 mt-6 max-w-xl text-pretty text-[14px] leading-relaxed text-white/80 sm:text-[15px] lg:text-[16px]">
              Vehicle cushion work, upholstery, Japanese seat sets and full interior services
              for vans, jeeps, cars, buses and trucks across Sri Lanka.
            </p>

            <div className="reveal reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href="/book"
                variant="primary"
                size="md"
                className="!bg-accent-dark hover:!bg-[#0A1652] !shadow-lift"
              >
                Book Appointment
              </Button>
              <Button
                href={waLink(waMessage('I would like to enquire about your services.', 'hero'))}
                external
                variant="secondary"
                size="md"
                iconLeft={<WhatsAppIcon className="h-5 w-5 text-whatsapp" />}
                className="!bg-white/10 !text-white !border-white/30 hover:!bg-white/20 hover:!border-white/50 backdrop-blur-md"
              >
                WhatsApp Enquiry
              </Button>
            </div>
          </div>
        </Container>

        {/* Brand marquee — inside hero card */}
        <div
          className="relative z-10 pb-6 pt-6 sm:pb-8 sm:pt-8"
          aria-label="Vehicle brands we service"
        >
          <Container size="wide">
            <div
              className="relative overflow-hidden"
              style={{
                maskImage:
                  'linear-gradient(to right, transparent, black 4rem, black calc(100% - 4rem), transparent)',
                WebkitMaskImage:
                  'linear-gradient(to right, transparent, black 4rem, black calc(100% - 4rem), transparent)',
              }}
            >
              <ViewportMarquee className="marquee-track flex w-max select-none items-center">
                {looped.map((b, i) => (
                  <div
                    key={`${b.slug}-${i}`}
                    className="mr-20 flex shrink-0 items-center gap-3.5 sm:mr-24"
                    aria-hidden={i >= brands.length || undefined}
                  >
                    <img
                      src={
                        b.localSrc ??
                        `https://cdn.simpleicons.org/${b.slug}/${heroIconColor}`
                      }
                      alt={i < brands.length ? `${b.name} logo` : ''}
                      width={32}
                      height={32}
                      loading="eager"
                      draggable={false}
                      className="h-8 w-8 select-none opacity-70 brightness-0 invert sm:h-9 sm:w-9"
                    />
                    <span className="text-[17px] font-medium tracking-tight text-white/60 sm:text-[18px]">
                      {b.name}
                    </span>
                  </div>
                ))}
              </ViewportMarquee>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}

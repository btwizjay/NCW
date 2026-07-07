import Image from 'next/image';
import Link from 'next/link';
import { navItems } from './nav-items';
import { business } from '@/content/business';
import { services } from '@/content/services';
import {
  ArrowRightIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from '@/components/ui/Icons';
import { telLink } from '@/lib/whatsapp';

export function Footer() {
  return (
    <footer className="relative isolate px-4 pb-6 pt-16 sm:px-6 sm:pb-8 sm:pt-24 lg:px-8 lg:pt-32">
      {/* Bottom-blue backdrop — the brand dark blue (accent #24388b) fading up
          from the foot of the page to roughly where the floating card starts,
          so the card reads as rising out of a deep-blue base. The floor is the
          solid colour (not a semi-transparent tint); only the upper stops fade,
          which is what keeps the top edge transparent. It's pinned to the footer
          and begins at the card's top edge (top offset matches the footer
          padding-top), so it never reaches up into the white content — no seam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 top-16 -z-10 sm:top-24 lg:top-32"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, rgba(36,56,139,0) 0%, rgba(36,56,139,0.14) 22%, rgba(36,56,139,0.45) 50%, rgba(36,56,139,0.80) 76%, rgb(36,56,139) 100%)',
        }}
      />
      <div className="mx-auto w-full max-w-[1320px]">
        {/* Floating card — sits on the uniform white page. It reads as raised
            via (a) a deep but soft, large-blur low-opacity drop shadow and
            (b) the hairline ring that defines its edge. No surrounding
            background change, so the page stays seamless. */}
        <div className="flex flex-col rounded-[28px] bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.07),0_40px_72px_-12px_rgba(0,0,0,0.16)] ring-1 ring-hairline lg:min-h-[578px]">
          {/* CTA Banner */}
          <div className="flex items-center justify-between px-7 py-5 sm:px-10 sm:py-6 lg:px-12 lg:py-7">
            <div>
              <h2 className="max-w-xl text-[18px] leading-[1.2] sm:text-[22px] lg:text-[26px]">
                Ready to transform your vehicle&rsquo;s interior?
              </h2>
              <Link
                href="/book"
                className="group mt-3 inline-flex items-center gap-2 rounded-full border border-ink/80 px-5 py-2 font-sans text-[12px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-white"
              >
                Book now
                <ArrowRightIcon className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="hidden sm:block" aria-hidden="true">
              <Image
                src="/images/ncw.svg"
                alt=""
                width={120}
                height={120}
                className="h-20 w-20 scale-125 object-contain lg:h-32 lg:w-32"
              />
            </div>
          </div>

          <div className="mx-7 h-px bg-hairline sm:mx-10 lg:mx-12" />

          {/* Main footer columns */}
          <div className="grid grid-cols-1 gap-6 px-7 py-5 sm:grid-cols-2 sm:gap-5 sm:px-10 sm:py-6 lg:grid-cols-12 lg:gap-5 lg:px-12 lg:py-6">
            {/* Newsletter */}
            <div className="sm:col-span-2 lg:col-span-5">
              <h4 className="font-sans text-[10px] font-normal uppercase tracking-[0.18em] text-ink-subtle">
                Subscribe for our newsletter
              </h4>
              <div className="mt-2.5 flex items-center border-b border-ink-subtle/40 pb-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-transparent font-sans text-[14px] text-ink placeholder:text-ink-subtle/60 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Subscribe"
                  className="ml-3 flex-shrink-0"
                >
                  <ArrowRightIcon className="h-4 w-4 text-ink transition-colors hover:text-accent" />
                </button>
              </div>
              <p className="mt-1.5 font-sans text-[10px] text-accent">
                Your information is never disclosed to third parties.
              </p>
            </div>

            {/* Main pages */}
            <FooterColumn
              heading="Main Pages"
              className="lg:col-span-2 lg:col-start-6"
            >
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            {/* Services */}
            <FooterColumn heading="Services" className="lg:col-span-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href="/services"
                    className="transition-colors hover:text-ink"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            {/* Hours & Contact */}
            <div className="lg:col-span-3">
              <h4 className="font-sans text-[10px] font-normal uppercase tracking-[0.18em] text-ink-subtle">
                Hours & Contact
              </h4>
              <ul className="mt-2 space-y-1 font-sans text-[12px] text-ink-muted">
                {business.hours.map((h) => (
                  <li key={h.day}>
                    <span className="text-[10px] text-ink-subtle">{h.day}</span>
                    <span className="ml-1.5 text-ink">{h.open}</span>
                  </li>
                ))}
                <li className="pt-0.5">
                  <a
                    href={telLink}
                    className="transition-colors hover:text-ink"
                  >
                    {business.phone.display}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${business.email}`}
                    className="break-all transition-colors hover:text-ink"
                  >
                    {business.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-auto mx-7 h-px bg-hairline sm:mx-10 lg:mx-12" />

          {/* Bottom bar */}
          <div className="flex flex-col items-start gap-3 px-7 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-10 sm:py-4 lg:px-12">
            <div className="flex items-center gap-2">
              <SocialLink
                href={business.social.facebook}
                label={`${business.name} on Facebook`}
              >
                <FacebookIcon className="h-4 w-4" />
              </SocialLink>
              <SocialLink
                href={business.social.instagram}
                label={`${business.name} on Instagram`}
              >
                <InstagramIcon className="h-4 w-4" />
              </SocialLink>
              <SocialLink
                href={business.social.tiktok}
                label={`${business.name} on TikTok`}
              >
                <TikTokIcon className="h-4 w-4" />
              </SocialLink>
            </div>

            <p className="font-sans text-[11px] text-ink-subtle">
              &copy; {new Date().getFullYear()} {business.name}. All Rights
              Reserved.
            </p>

            <p className="font-sans text-[11px] text-ink-subtle">
              Project by{' '}
              <a
                href="https://www.ascendit.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ink"
              >
                Ascendit Media
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  children,
  className,
}: {
  heading: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className="font-sans text-[10px] font-normal uppercase tracking-[0.18em] text-ink-subtle">
        {heading}
      </h4>
      <ul className="mt-2 space-y-1 font-sans text-[12px] text-ink-muted">
        {children}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full text-ink transition-colors hover:text-accent"
    >
      {children}
    </a>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { OpenStatus } from '@/components/ui/OpenStatus';
import {
  WhatsAppIcon,
  PhoneIcon,
  MailIcon,
  PinIcon,
  ArrowRightIcon,
  AlertIcon,
} from '@/components/ui/Icons';
import { business } from '@/content/business';
import { telLink, waLink, waMessage } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Channel = {
  label: string;
  value: string;
  sub: string;
  href: string;
  icon: IconType;
  ariaLabel: string;
  external?: boolean;
  whatsapp?: boolean;
  emphasizeSub?: boolean;
};

// The one greeting reused for every WhatsApp entry point on this page.
const waHref = waLink(
  waMessage('I would like to enquire about your services.', 'contact'),
);

// Cubic-bezier used for the curtain reveal.
const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

// How long the success takeover stays up before returning to the form.
const SUCCESS_HOLD_MS = 10000;

// Abbreviate weekday names (Monday → Mon) for the compact card on the photo.
// Sunday is intentionally left in full.
const shortDays = (day: string) =>
  day.replace(
    /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday/g,
    (d) => d.slice(0, 3),
  );

// Lowercase the AM/PM markers (8:30 AM → 8:30 am) for the compact card.
const shortTime = (open: string) =>
  open.replace(/AM/g, 'am').replace(/PM/g, 'pm');

// Each way to reach us, listed exactly once.
const channels: Channel[] = [
  {
    label: 'Visit',
    value: business.address.formatted,
    sub: '',
    href: business.mapLinkUrl,
    external: true,
    emphasizeSub: true,
    icon: PinIcon,
    ariaLabel: `Get directions to our workshop in ${business.address.city} on Google Maps`,
  },
  {
    label: 'WhatsApp',
    value: business.whatsapp.display,
    sub: '',
    href: waHref,
    external: true,
    whatsapp: true,
    icon: WhatsAppIcon,
    ariaLabel: `Message us on WhatsApp at ${business.whatsapp.display}`,
  },
  {
    label: 'Call',
    value: business.phone.display,
    sub: '',
    href: telLink,
    icon: PhoneIcon,
    ariaLabel: `Call us at ${business.phone.display}`,
  },
  {
    label: 'Email',
    value: business.email,
    sub: '',
    href: `mailto:${business.email}`,
    icon: MailIcon,
    ariaLabel: `Email us at ${business.email}`,
  },
];

// Contact page laid out like a warm "let's talk" booking page: a centered
// intro, then a two-column block pairing a workshop visual with a guided
// enquiry form, and finally every contact channel listed once underneath.
export function ContactContent() {
  const reduce = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] } },
  };
  const inView = {
    initial: 'hidden',
    whileInView: 'show',
    viewport: { once: true, margin: '-80px' },
  } as const;

  return (
    <>
      {/* Every way to reach us — listed exactly once, up top */}
      <section className="pt-12 pb-12 sm:pt-16 sm:pb-16">
        <Container size="wide">
          <motion.div variants={fadeUp} {...inView}>
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
              {channels.map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target={c.external ? '_blank' : undefined}
                      rel={c.external ? 'noopener noreferrer' : undefined}
                      aria-label={c.ariaLabel}
                      className="group flex h-full flex-col items-center gap-4 rounded-2xl px-2 py-4 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/20"
                    >
                      <span
                        className={cn(
                          'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full transition-colors',
                          c.whatsapp
                            ? 'bg-whatsapp/10 text-whatsapp group-hover:bg-whatsapp group-hover:text-white'
                            : 'bg-surface-alt text-ink-muted group-hover:bg-accent-soft group-hover:text-accent',
                        )}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <span className="flex min-w-0 flex-col items-center">
                        <span className="block font-pirulen text-[12px] uppercase tracking-[0.16em] text-ink">
                          {c.label}
                        </span>
                        <span className="mt-1.5 block break-words text-[13px] leading-snug text-ink-muted">
                          {c.value}
                        </span>
                        {c.sub && (
                          <span
                            className={cn(
                              'mt-1 block text-[13px] leading-snug',
                              c.emphasizeSub ? 'font-medium text-accent' : 'text-ink-muted',
                            )}
                          >
                            {c.sub}
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </Container>
      </section>

      {/* Two-column — workshop visual + guided enquiry form */}
      <section className="pb-24 sm:pb-32">
        <Container size="wide">
          <motion.div variants={fadeUp} {...inView}>
            <ContactCard reduce={reduce} />
          </motion.div>

          {/* Map — workshop location */}
          <motion.div
            variants={fadeUp}
            {...inView}
            className="mt-20 overflow-hidden rounded-4xl shadow-lift sm:mt-28"
          >
            <div className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[16/8]">
              <iframe
                src={business.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full"
                title={`${business.name} workshop location in ${business.address.city}`}
              />
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Contact card — the workshop photo + guided enquiry form. On a successful
   send the photo curtains out to the right and the form fades, exposing a
   full-card success takeover (drawn tick + thank-you) behind. It auto-returns
   to the form after SUCCESS_HOLD_MS so the same visitor can enquire again.
   ────────────────────────────────────────────────────────────────────────── */

type Status = 'idle' | 'submitting' | 'success' | 'error';

function ContactCard({ reduce }: { reduce: boolean | null }) {
  const [status, setStatus] = useState<Status>('idle');
  // Field name → error message for any field that failed validation. Flagged
  // fields render with a red outline + inline message instead of the browser's
  // native "please fill out this field" popup.
  const [errors, setErrors] = useState<Record<string, string>>({});
  const success = status === 'success';

  // Clear a field's red state the moment the visitor starts correcting it.
  function clearError(name: string) {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  // Return to the form a few seconds after a successful send.
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setStatus('idle'), SUCCESS_HOLD_MS);
    return () => clearTimeout(t);
  }, [success]);

  // The photo is half the card width on lg (two columns) and full width below
  // it, so the curtain must travel a different distance to fully clear the card:
  // 200% of its own width on desktop, 100% on mobile.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Capture the form node before the await — React nulls e.currentTarget once
    // the handler returns, so reading it afterwards would throw.
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;

    // Validate before sending: first name + a phone number are required, and
    // the phone must be a 10-digit local number (not fewer, not more). Invalid
    // fields are flagged red and the submit is held back — no native popup.
    const nextErrors: Record<string, string> = {};
    if (!payload.firstName?.trim()) {
      nextErrors.firstName = 'First name is required';
    }
    const phoneDigits = (payload.phone ?? '').replace(/\D/g, '');
    if (!payload.phone?.trim()) {
      nextErrors.phone = 'Phone number is required';
    } else if (phoneDigits.length !== 10) {
      nextErrors.phone = 'Enter a valid 10-digit phone number';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    setStatus('submitting');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    // Fixed height on the two-column (lg+) layout so the card never resizes
    // when content changes — the form, the success takeover and any copy edits
    // all live inside this constant box. Below lg the card stacks and sizes
    // naturally (a fixed height there would risk clipping the taller form).
    <div className="relative overflow-hidden rounded-4xl shadow-lift lg:h-[670px]">
      {/* Success takeover — sits behind the two columns and is revealed as the
          photo curtain slides away, then fills the whole card. */}
      <AnimatePresence>
        {success && <SuccessReveal key="success" reduce={reduce} />}
      </AnimatePresence>

      {/* The two columns. Kept mounted so the card never changes height; on
          success the grid goes click-through (pointer-events-none) so the
          takeover behind it stays interactive. */}
      <div
        className={cn(
          'relative z-10 grid items-stretch lg:h-full lg:grid-cols-2',
          success && 'pointer-events-none',
        )}
      >
        {/* Left — workshop photo. Acts as the curtain: slides out to the right. */}
        <motion.div
          aria-hidden={success}
          animate={
            reduce
              ? { opacity: success ? 0 : 1 }
              : { x: success ? (isDesktop ? '200%' : '100%') : '0%' }
          }
          transition={{
            x: { duration: 0.7, ease: CURTAIN_EASE },
            opacity: { duration: 0.4 },
          }}
          className="relative isolate z-20 flex min-h-[460px] flex-col justify-end overflow-hidden bg-ink p-4 text-white sm:p-5 lg:min-h-full"
        >
          <Image
            src="/images/workshop/1.jpeg"
            alt="Inside the Nilantha Cushion Works workshop"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="-z-20 object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/15"
          />

          {/* Live workshop open/closed status — pinned to the top centre of the
              photo (same pill as the booking page hero). */}
          <div className="absolute inset-x-0 top-4 z-10 flex justify-center sm:top-5">
            <OpenStatus tone="dark" />
          </div>

          {/* Contact details, overlaid on the workshop photo */}
          <div className="rounded-3xl bg-black/40 p-6 ring-1 ring-white/15 backdrop-blur-md sm:p-7">
            {/* Phone — the headline way to reach us */}
            <div className="relative flex items-center gap-4">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-ink">
                <PhoneIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-pirulen text-[11px] uppercase tracking-[0.18em] text-white/65">
                  Phone
                </p>
                <a
                  href={telLink}
                  className="mt-1 block text-[20px] tracking-tight text-white transition-colors hover:text-white/80"
                >
                  {business.phone.display}
                </a>
              </div>

              {/* Brand mark — vertically centered on the phone row, absolutely
                  placed so its size never grows the card */}
              <Image
                src="/images/ncw.svg"
                alt=""
                aria-hidden="true"
                width={140}
                height={140}
                className="pointer-events-none absolute right-0 top-1/2 h-16 w-16 -translate-y-1/2 object-contain opacity-90 sm:h-20 sm:w-20"
              />
            </div>

            <div className="my-5 h-px bg-white/15" />

            {/* Address + opening hours */}
            <div className="grid grid-cols-2 gap-5">
              <div className="min-w-0">
                <p className="font-pirulen text-[11px] uppercase tracking-[0.18em] text-white/65">
                  Address
                </p>
                <p className="mt-1.5 text-[13px] leading-snug text-white/85">
                  {business.address.formatted}
                </p>
              </div>
              <div className="min-w-0">
                <p className="font-pirulen text-[11px] uppercase tracking-[0.18em] text-white/65">
                  Office Hours
                </p>
                <div className="mt-1.5 space-y-0.5 text-[13px] leading-snug text-white/85">
                  {business.hours.map((h) => (
                    <p key={h.day}>
                      {shortDays(h.day)}: {shortTime(h.open)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right — guided enquiry form on a soft tinted panel. Fades out on
            success to expose the takeover behind. */}
        <motion.div
          animate={{ opacity: success ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 bg-surface p-4 sm:p-5 lg:p-9"
        >
          <ContactForm
            status={status}
            onSubmit={handleSubmit}
            errors={errors}
            onClearError={clearError}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Success takeover — fills the whole card with a drawn-tick mark and a
   thank-you, staggered in once the curtain has cleared.
   ────────────────────────────────────────────────────────────────────────── */

function SuccessReveal({ reduce }: { reduce: boolean | null }) {
  // Hold the content back until the photo curtain has mostly slid away.
  const base = reduce ? 0 : 0.5;
  const line = (i: number) => (reduce ? 0 : base + 0.6 + i * 0.09);

  const rise = {
    initial: { opacity: 0, y: reduce ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-accent to-accent-dark px-6 text-center"
    >
      {/* Soft light glow behind the mark, on the deep-blue field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[40%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl"
      />

      <AnimatedTick reduce={reduce} delay={base} />

      <motion.p
        {...rise}
        transition={{ delay: line(0), duration: 0.5 }}
        className="relative mt-8 font-pirulen text-[11px] uppercase tracking-[0.2em] text-white/70"
      >
        Enquiry received
      </motion.p>
      <motion.h2
        {...rise}
        transition={{ delay: line(1), duration: 0.5 }}
        className="relative mt-2.5 text-[30px] leading-[1.05] tracking-tighter text-white sm:text-[40px]"
      >
        Thank you.
      </motion.h2>
      <motion.p
        {...rise}
        transition={{ delay: line(2), duration: 0.5 }}
        className="relative mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/70"
      >
        We&rsquo;ve got your details and will be in touch with honest advice and
        a clear quote.
      </motion.p>

      <motion.div
        {...rise}
        transition={{ delay: line(3), duration: 0.5 }}
        className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
      >
        <Button
          href={waHref}
          external
          variant="whatsapp"
          size="md"
          iconLeft={<WhatsAppIcon className="h-4 w-4" aria-hidden="true" />}
        >
          Message us now
        </Button>
        <Button
          href={telLink}
          variant="secondary"
          size="md"
          iconLeft={<PhoneIcon className="h-4 w-4" aria-hidden="true" />}
        >
          Call instead
        </Button>
      </motion.div>
    </motion.div>
  );
}

// A deep-blue check that draws itself: the ring strokes in, the tick follows,
// and a soft ripple pulses out — a custom SVG, not a static icon.
function AnimatedTick({ reduce, delay }: { reduce: boolean | null; delay: number }) {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-white/20"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.6, opacity: [0, 0.5, 0] }}
          transition={{ delay: delay + 0.55, duration: 1, ease: 'easeOut' }}
        />
      )}
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        className="relative"
        aria-hidden="true"
      >
        <motion.circle
          cx="48"
          cy="48"
          r="44"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={reduce ? { duration: 0 } : { delay, duration: 0.6, ease: 'easeInOut' }}
        />
        <motion.path
          d="M30 49 l12 12 l24 -27"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={reduce ? { duration: 0 } : { delay: delay + 0.5, duration: 0.35, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Guided enquiry form — name, contact and a note. Posts to /api/enquiry.
   Controlled by ContactCard, which owns the submit + success choreography.
   ────────────────────────────────────────────────────────────────────────── */

function ContactForm({
  status,
  onSubmit,
  errors,
  onClearError,
}: {
  status: Status;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  errors: Record<string, string>;
  onClearError: (name: string) => void;
}) {
  return (
    // Full-height flex column. On lg the panel is taller than its contents, so
    // justify-between shares the leftover height equally between every row —
    // spreading the fields evenly from the heading down to the button (gap-7
    // acts as the minimum spacing). Below lg the column just sizes to content.
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-7 lg:h-full lg:justify-between"
    >
      {/* Heading + subtitle as one flex item. The panel's even padding now
          provides the inset on every side, so no extra top margin is needed. */}
      <div>
        <h2 className="text-[26px] leading-tight tracking-tight sm:text-[30px]">
          Send Us a Message
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
          A few quick details help us give you the right advice.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="First name"
          name="firstName"
          placeholder="Saman"
          required
          error={errors.firstName}
          onClearError={onClearError}
        />
        <TextField label="Last name" name="lastName" placeholder="Perera" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="you@email.com"
        />
        <TextField
          label="Phone number"
          name="phone"
          type="tel"
          placeholder={business.phone.display}
          required
          error={errors.phone}
          onClearError={onClearError}
        />
      </div>

      <MessageField />

      {/* Sits at the bottom of the panel on lg via the form's justify-between
          (the panel's even padding sets the edge gap); sits right after the
          form on mobile. */}
      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full !bg-accent-dark hover:!bg-accent"
          disabled={status === 'submitting'}
          iconRight={<ArrowRightIcon className="h-4 w-4" aria-hidden="true" />}
        >
          {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </Button>

        {status === 'error' && (
          <p className="text-center text-[14px] text-accent">
            Couldn’t send. Please try WhatsApp or give us a call.
          </p>
        )}
      </div>
    </form>
  );
}

// The "Tell us more" message box. Lenis (smooth scroll) is told to ignore wheel
// events inside it via data-lenis-prevent — but only while its content actually
// overflows. When it's empty/short there's nothing to scroll, so we drop the
// attribute and let the wheel scroll the page instead of getting trapped here.
function MessageField() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [scrollable, setScrollable] = useState(false);

  function sync() {
    const el = ref.current;
    if (el) setScrollable(el.scrollHeight > el.clientHeight + 1);
  }

  useEffect(() => {
    sync();
    // form.reset() (after a successful send) clears the box without firing an
    // input event, so re-check once the reset has applied.
    const form = ref.current?.form;
    if (!form) return;
    const onReset = () => requestAnimationFrame(sync);
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, []);

  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-normal text-ink">
        Tell us more
      </span>
      <textarea
        ref={ref}
        name="message"
        rows={5}
        placeholder="Your vehicle, the year, and what you’re after…"
        onInput={sync}
        data-lenis-prevent={scrollable ? '' : undefined}
        className="w-full resize-none rounded-2xl border border-hairline bg-surface px-4 py-3 text-[15px] text-ink placeholder:text-ink-subtle outline-none transition-colors [scrollbar-width:none] focus:border-accent/50 focus:bg-surface focus:ring-2 focus:ring-accent/15 [&::-webkit-scrollbar]:hidden"
      />
    </label>
  );
}

function TextField({
  label,
  name,
  required,
  error,
  onClearError,
  ...rest
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  onClearError?: (name: string) => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="relative block">
      <span className="mb-2 block text-[13px] font-normal text-ink">
        {label}
      </span>
      <input
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        onInput={error ? () => onClearError?.(name) : undefined}
        className={cn(
          'w-full rounded-full border px-5 py-3 text-[15px] text-ink outline-none transition-[color,background-color,border-color,box-shadow] duration-200',
          error
            ? 'border-red-400 bg-red-50 placeholder:text-red-400/60 ring-4 ring-red-500/10 focus:border-red-500 focus:ring-red-500/25'
            : 'border-hairline bg-surface placeholder:text-ink-subtle focus:border-accent/50 focus:ring-2 focus:ring-accent/15',
        )}
        {...rest}
      />

      {/* Premium inline error — a soft red message that fades in just under the
          field. Absolutely positioned so it overlays the gap below instead of
          adding height and pushing the rest of the form down. */}
      <AnimatePresence initial={false}>
        {error && (
          <motion.span
            key="error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute left-0 top-full mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-red-500"
          >
            <AlertIcon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

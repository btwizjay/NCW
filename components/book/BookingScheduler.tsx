'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Field, TextAreaField } from '@/components/forms/Field';
import {
  CheckIcon,
  ChevronLeftIcon,
  CalendarIcon,
  ClockIcon,
  CarIcon,
  PinIcon,
  WhatsAppIcon,
  ArrowRightIcon,
} from '@/components/ui/Icons';
import { DateTimePicker } from '@/components/book/DateTimePicker';
import { services } from '@/content/services';
import { business } from '@/content/business';
import { waLink, waMessage } from '@/lib/whatsapp';
import { formatSlotLabel, formatDateLong, type SlotView } from '@/lib/booking/slots';
import { cn } from '@/lib/cn';

type Step = 1 | 2 | 3;

const serviceOptions = [...services.map((s) => s.title), 'Other / not sure'];

function buildIcsUrl(date: string, time: string, service: string) {
  const [y, mo, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  // Sri Lanka is a fixed UTC+5:30 (no DST), so convert local → UTC by -330 min.
  const startUtc = new Date(Date.UTC(y, mo - 1, d, hh, mm) - 330 * 60000);
  const endUtc = new Date(startUtc.getTime() + 60 * 60000);
  const stamp = (dt: Date) => dt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nilantha Cushion Works//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${date}-${time}-${Math.random().toString(36).slice(2)}@nilanthacushionworks.lk`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(startUtc)}`,
    `DTEND:${stamp(endUtc)}`,
    `SUMMARY:${service} at ${business.name}`,
    `LOCATION:${business.address.formatted}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `data:text/calendar;charset=utf8,${encodeURIComponent(lines.join('\r\n'))}`;
}

export function BookingScheduler() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<Step>(1);
  const [service, setService] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [slots, setSlots] = useState<SlotView[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const [details, setDetails] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleMake: '',
    vehicleModel: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [emailedTo, setEmailedTo] = useState<string | null>(null);

  async function loadAvailability(key: string) {
    setLoadingSlots(true);
    setSlotError(null);
    try {
      const res = await fetch(`/api/booking/availability?date=${key}`);
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error();
      setSlots(json.slots as SlotView[]);
    } catch {
      setSlots([]);
      setSlotError('Couldn’t load times. Please try again.');
    } finally {
      setLoadingSlots(false);
    }
  }

  function selectDate(key: string) {
    setSelectedDate(key);
    setSelectedTime(null);
    loadAvailability(key);
  }

  const detailsValid =
    details.name.trim() &&
    details.phone.trim() &&
    details.vehicleMake.trim() &&
    details.vehicleModel.trim();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !service) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service, date: selectedDate, time: selectedTime, ...details }),
      });
      const json = await res.json();
      if (res.status === 409) {
        setFormError('Sorry, that slot was just taken. Please choose another time.');
        setStep(1);
        setSelectedTime(null);
        loadAvailability(selectedDate);
        return;
      }
      if (json?.error === 'not_configured') {
        setFormError('Online booking isn’t switched on yet. Please book on WhatsApp and we’ll sort your slot.');
        return;
      }
      if (!res.ok || !json.ok) throw new Error();
      setReference(json.reference);
      setEmailedTo(json.emailed ? details.email.trim() : null);
      setStep(3);
    } catch {
      setFormError('Something went wrong. Please try again, or book on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  }

  const canContinue = Boolean(service && selectedDate && selectedTime);

  return (
    <div className="overflow-hidden rounded-4xl bg-surface shadow-soft ring-1 ring-hairline">
      {/* Header band — brand identity + progress, full width */}
      <div className="flex items-center justify-between gap-4 border-b border-hairline bg-surface-alt/40 px-6 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[12px] font-semibold text-white">
            NCW
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-medium text-ink">{business.name}</p>
            <p className="font-pirulen text-[10px] uppercase tracking-[0.16em] text-accent">
              Workshop visit
            </p>
          </div>
        </div>
        <Stepper step={step} />
      </div>

      {/* Step body */}
      <div className="p-6 sm:p-8 lg:p-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
            transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {step === 1 && (
              <ScheduleStep
                service={service}
                onService={setService}
                selectedDate={selectedDate}
                onSelectDate={selectDate}
                slots={slots}
                loadingSlots={loadingSlots}
                slotError={slotError}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                canContinue={canContinue}
                onContinue={() => setStep(2)}
              />
            )}

            {step === 2 && selectedDate && selectedTime && (
              <DetailsStep
                service={service}
                dateLabel={formatDateLong(selectedDate)}
                timeLabel={formatSlotLabel(selectedTime)}
                details={details}
                setDetails={setDetails}
                valid={Boolean(detailsValid)}
                submitting={submitting}
                error={formError}
                onBack={() => setStep(1)}
                onSubmit={submit}
              />
            )}

            {step === 3 && selectedDate && selectedTime && reference && (
              <ConfirmationStep
                reference={reference}
                service={service}
                date={selectedDate}
                time={selectedTime}
                dateLabel={formatDateLong(selectedDate)}
                timeLabel={formatSlotLabel(selectedTime)}
                emailedTo={emailedTo}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = ['Schedule', 'Your details', 'Confirmed'];
  return (
    <div className="flex items-center gap-2">
      {items.map((label, i) => {
        const index = (i + 1) as Step;
        const active = step === index;
        const done = step > index;
        return (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-200',
                done
                  ? 'bg-accent text-white ring-1 ring-accent'
                  : active
                    ? 'bg-accent-soft text-accent ring-2 ring-accent/40 shadow-soft'
                    : 'bg-surface text-ink-subtle ring-1 ring-hairline',
              )}
            >
              {done ? <CheckIcon className="h-3 w-3" /> : index}
            </span>
            <span
              className={cn(
                'hidden font-pirulen text-[10px] uppercase tracking-[0.12em] sm:inline',
                active ? 'text-ink' : 'text-ink-subtle',
              )}
            >
              {label}
            </span>
            {i < items.length - 1 && (
              <span className={cn('mx-1 h-px w-5 transition-colors duration-300 sm:w-8', done ? 'bg-accent' : 'bg-hairline')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Section heading inside a step — a clear title with a soft supporting line,
// replacing the old numbered "wizard" markers for a calmer, editorial feel.
function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <h3 className="text-[16px] font-semibold tracking-tight text-ink sm:text-[17px]">{title}</h3>
      {hint && <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{hint}</p>}
    </div>
  );
}

function ScheduleStep(props: {
  service: string;
  onService: (s: string) => void;
  selectedDate: string | null;
  onSelectDate: (key: string) => void;
  slots: SlotView[];
  loadingSlots: boolean;
  slotError: string | null;
  selectedTime: string | null;
  onSelectTime: (t: string) => void;
  canContinue: boolean;
  onContinue: () => void;
}) {
  const {
    service, onService, selectedDate, onSelectDate, slots, loadingSlots,
    slotError, selectedTime, onSelectTime, canContinue, onContinue,
  } = props;

  const dateLabel = selectedDate ? formatDateLong(selectedDate) : null;
  const timeLabel = selectedTime ? formatSlotLabel(selectedTime) : null;

  return (
    <div className="space-y-9">
      {/* Service — selectable cards */}
      <div>
        <SectionTitle
          title="What can we help with?"
          hint="Choose a service. We’ll confirm and share a written quote before any work starts."
        />
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {serviceOptions.map((opt) => {
            const active = service === opt;
            return (
              <button
                key={opt}
                type="button"
                // Block the browser's own focus-scroll-into-view on pointer
                // taps: with Lenis's virtual scroll running, that native
                // scroll reads as the page abruptly jumping/re-centering on
                // whatever was just tapped. Keyboard focus (Tab) is unaffected.
                onMouseDown={(e) => e.preventDefault()}
                onTouchStart={(e) => e.preventDefault()}
                onClick={() => onService(opt)}
                aria-pressed={active}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[14px] font-medium transition-all duration-200',
                  active
                    ? 'border-accent bg-accent-soft/60 text-accent-dark shadow-soft'
                    : 'border-hairline bg-surface text-ink hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-soft',
                )}
              >
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                    active
                      ? 'border-accent bg-accent text-white'
                      : 'border-ink-subtle/40 bg-surface text-transparent group-hover:border-accent/50',
                  )}
                >
                  <CheckIcon className="h-3 w-3" />
                </span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date + time — two soft panels */}
      <div>
        <SectionTitle title="Pick a date & time" hint="Times are shown in Sri Lanka time." />
        <div className="mt-4">
          <DateTimePicker
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={onSelectDate}
            onSelectTime={onSelectTime}
            slots={slots}
            loadingSlots={loadingSlots}
            slotError={slotError}
          />
        </div>
      </div>

      {/* Live recap + advance */}
      <div className="flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
        <RecapChips service={service} dateLabel={dateLabel} timeLabel={timeLabel} />
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full !bg-accent-dark hover:!bg-accent sm:w-auto"
          iconRight={<ArrowRightIcon className="h-4 w-4" />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

// Compact running summary of the three choices — each chip lights up in accent
// once chosen, so the visitor always sees where they are.
function RecapChips({
  service,
  dateLabel,
  timeLabel,
}: {
  service: string;
  dateLabel: string | null;
  timeLabel: string | null;
}) {
  const items = [
    { icon: <CarIcon className="h-3.5 w-3.5" />, value: service || 'Service', on: Boolean(service) },
    { icon: <CalendarIcon className="h-3.5 w-3.5" />, value: dateLabel || 'Date', on: Boolean(dateLabel) },
    { icon: <ClockIcon className="h-3.5 w-3.5" />, value: timeLabel || 'Time', on: Boolean(timeLabel) },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((it, i) => (
        <span
          key={i}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium ring-1 transition-colors',
            it.on
              ? 'bg-accent-soft text-accent-dark ring-accent/20'
              : 'bg-surface-alt text-ink-subtle ring-hairline',
          )}
        >
          {it.icon}
          {it.value}
        </span>
      ))}
    </div>
  );
}

function DetailsStep(props: {
  service: string;
  dateLabel: string;
  timeLabel: string;
  details: { name: string; phone: string; email: string; vehicleMake: string; vehicleModel: string; notes: string };
  setDetails: React.Dispatch<
    React.SetStateAction<{ name: string; phone: string; email: string; vehicleMake: string; vehicleModel: string; notes: string }>
  >;
  valid: boolean;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { service, dateLabel, timeLabel, details, setDetails, valid, submitting, error, onBack, onSubmit } = props;
  const set = (k: keyof typeof details) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDetails((d) => ({ ...d, [k]: e.target.value }));

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
      <div>
        <SectionTitle title="Your details" hint="A few details so we can confirm and prepare for your visit." />
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-surface-alt/70 px-4 py-3 text-[13px] text-ink ring-1 ring-hairline">
        <span className="inline-flex items-center gap-1.5">
          <CarIcon className="h-4 w-4 text-accent" /> {service}
        </span>
        <span className="text-hairline">·</span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarIcon className="h-4 w-4 text-accent" /> {dateLabel}
        </span>
        <span className="text-hairline">·</span>
        <span className="inline-flex items-center gap-1.5">
          <ClockIcon className="h-4 w-4 text-accent" /> {timeLabel}
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" placeholder="W. Nilantha" value={details.name} onChange={set('name')} required />
        <Field label="Phone number" name="phone" type="tel" placeholder={business.phone.display} value={details.phone} onChange={set('phone')} required />
      </div>
      <Field
        label="Email (optional)"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={details.email}
        onChange={set('email')}
        hint="For your confirmation and reschedule link."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Vehicle make" name="vehicleMake" placeholder="Toyota" value={details.vehicleMake} onChange={set('vehicleMake')} required />
        <Field label="Vehicle model" name="vehicleModel" placeholder="Hiace KDH" value={details.vehicleModel} onChange={set('vehicleModel')} required />
      </div>
      <TextAreaField
        label="Anything we should know?"
        name="notes"
        placeholder="The issue, photos sent on WhatsApp, parking needs, etc."
        value={details.notes}
        onChange={set('notes')}
      />

      {error && <p className="text-[14px] text-accent">{error}</p>}

      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="secondary" size="md" onClick={onBack} iconLeft={<ChevronLeftIcon className="h-4 w-4" />}>
          Back
        </Button>
        <Button type="submit" variant="primary" size="md" disabled={!valid || submitting} className="!bg-accent-dark hover:!bg-accent">
          {submitting ? 'Booking…' : 'Confirm booking'}
        </Button>
      </div>
    </form>
  );
}

function ConfirmationStep(props: {
  reference: string;
  service: string;
  date: string;
  time: string;
  dateLabel: string;
  timeLabel: string;
  emailedTo?: string | null;
}) {
  const { reference, service, date, time, dateLabel, timeLabel, emailedTo } = props;
  return (
    <div className="mx-auto max-w-md py-4 text-center">
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-accent to-accent-dark text-white shadow-soft">
        <CheckIcon className="h-7 w-7" />
      </div>
      <p className="mt-6 font-pirulen text-[11px] uppercase tracking-[0.2em] text-accent">Booking requested</p>
      <h3 className="mt-2 text-[22px] leading-[1.15] tracking-tight">You’re on the list.</h3>
      <p className="mt-2 text-[15px] text-ink-muted">
        Reference <span className="font-medium text-ink">{reference}</span>. We’ll
        confirm by phone or WhatsApp within one working day.
      </p>
      {emailedTo && (
        <p className="mt-1 text-[14px] text-ink-muted">
          A confirmation has been sent to <span className="font-medium text-ink">{emailedTo}</span>.
        </p>
      )}

      <dl className="mx-auto mt-7 space-y-1 rounded-2xl bg-surface-alt/70 text-left ring-1 ring-hairline">
        <Row label="Service" value={service} icon={<CarIcon className="h-4 w-4" />} />
        <Row label="Date" value={dateLabel} icon={<CalendarIcon className="h-4 w-4" />} />
        <Row label="Time" value={timeLabel} icon={<ClockIcon className="h-4 w-4" />} />
        <Row label="Where" value={business.address.formatted} icon={<PinIcon className="h-4 w-4" />} />
      </dl>

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href={buildIcsUrl(date, time, service)} variant="secondary" size="md" iconLeft={<CalendarIcon className="h-4 w-4" />}>
          Add to calendar
        </Button>
        <Button
          href={waLink(
            waMessage(
              `I just booked an appointment (${reference}) for ${dateLabel} at ${timeLabel}.`,
            ),
          )}
          external
          variant="whatsapp"
          size="md"
          iconLeft={<WhatsAppIcon className="h-4 w-4" />}
        >
          Confirm on WhatsApp
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-hairline px-4 py-3 last:border-b-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="font-pirulen text-[10px] uppercase tracking-[0.14em] text-ink-subtle">{label}</dt>
        <dd className="mt-0.5 text-[13.5px] font-medium text-ink">{value}</dd>
      </div>
    </div>
  );
}

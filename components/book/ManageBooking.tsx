'use client';

import { useState } from 'react';
import { DateTimePicker } from '@/components/book/DateTimePicker';
import { Button } from '@/components/ui/Button';
import {
  CheckIcon,
  CalendarIcon,
  ClockIcon,
  CarIcon,
  ChevronLeftIcon,
  WhatsAppIcon,
} from '@/components/ui/Icons';
import { formatDateLong, formatSlotLabel, type SlotView } from '@/lib/booking/slots';
import { business } from '@/content/business';
import { waLink, waMessage } from '@/lib/whatsapp';
import { cn } from '@/lib/cn';

type Mode = 'view' | 'reschedule' | 'cancel';

export function ManageBooking(props: {
  token: string;
  reference: string;
  status: string;
  service: string;
  name: string;
  date: string;
  time: string;
}) {
  const [status, setStatus] = useState(props.status);
  const [date, setDate] = useState(props.date);
  const [time, setTime] = useState(props.time);
  const [mode, setMode] = useState<Mode>('view');

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<SlotView[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const cancelled = status === 'cancelled';

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

  function startReschedule() {
    setMode('reschedule');
    setError(null);
    setNotice(null);
    setSelectedDate(null);
    setSelectedTime(null);
  }

  async function doReschedule() {
    if (!selectedDate || !selectedTime) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/booking/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: props.token,
          action: 'reschedule',
          date: selectedDate,
          time: selectedTime,
        }),
      });
      const json = await res.json();
      if (res.status === 409 && json.error === 'slot_full') {
        setError('That slot was just taken. Please choose another time.');
        loadAvailability(selectedDate);
        return;
      }
      if (json.error === 'already_cancelled') {
        setStatus('cancelled');
        setMode('view');
        setError('This booking has been cancelled.');
        return;
      }
      if (json.error === 'not_configured') {
        setError('We can’t change this online right now. Please WhatsApp us.');
        return;
      }
      if (!res.ok || !json.ok) throw new Error();
      setDate(selectedDate);
      setTime(selectedTime);
      setMode('view');
      setNotice('Your appointment has been moved. A confirmation email is on its way.');
    } catch {
      setError('Something went wrong. Please try again, or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  }

  async function doCancel() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/booking/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: props.token, action: 'cancel' }),
      });
      const json = await res.json();
      if (json.error === 'not_configured') {
        setError('We can’t cancel online right now. Please WhatsApp us.');
        return;
      }
      if (json.error === 'already_cancelled') {
        setStatus('cancelled');
        setMode('view');
        return;
      }
      if (!res.ok || !json.ok) throw new Error();
      setStatus('cancelled');
      setMode('view');
      setNotice('Your appointment has been cancelled.');
    } catch {
      setError('Something went wrong. Please try again, or WhatsApp us.');
    } finally {
      setSubmitting(false);
    }
  }

  const waHref = waLink(
    waMessage(`I'd like to change my appointment (${props.reference}).`, 'manage'),
  );

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-5 font-pirulen text-[11px] uppercase tracking-[0.18em] text-accent">
        Manage your booking
      </p>

      <div className="overflow-hidden rounded-4xl bg-surface shadow-lift ring-1 ring-hairline">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-surface-alt/50 px-6 py-5 sm:px-8">
          <div>
            <p className="font-pirulen text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
              Reference
            </p>
            <p className="text-[16px] font-medium text-ink">{props.reference}</p>
          </div>
          <StatusBadge cancelled={cancelled} />
        </div>

        <div className="p-6 sm:p-8">
          {notice && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl bg-accent-soft p-4 text-accent-dark">
              <CheckIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <p className="text-[14px]">{notice}</p>
            </div>
          )}
          {error && <p className="mb-6 text-[14px] text-accent">{error}</p>}

          {/* Current details */}
          <dl className="space-y-3 rounded-2xl bg-surface-alt/60 p-5">
            <Row icon={<CarIcon className="h-4 w-4" />} label="Service" value={props.service} />
            <Row icon={<CalendarIcon className="h-4 w-4" />} label="Date" value={formatDateLong(date)} />
            <Row icon={<ClockIcon className="h-4 w-4" />} label="Time" value={formatSlotLabel(time)} />
          </dl>

          {/* Actions */}
          {cancelled ? (
            <div className="mt-6 text-center">
              <p className="text-[15px] text-ink-muted">
                This appointment is cancelled. You can book again any time.
              </p>
              <div className="mt-5">
                <Button href="/book" variant="primary" size="md" className="!bg-accent-dark hover:!bg-accent">
                  Book again
                </Button>
              </div>
            </div>
          ) : mode === 'view' ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="primary" size="md" onClick={startReschedule} className="!bg-accent-dark hover:!bg-accent" iconLeft={<CalendarIcon className="h-4 w-4" />}>
                Reschedule
              </Button>
              <Button type="button" variant="secondary" size="md" onClick={() => { setMode('cancel'); setError(null); setNotice(null); }}>
                Cancel appointment
              </Button>
            </div>
          ) : mode === 'cancel' ? (
            <div className="mt-6 rounded-2xl border border-hairline p-5">
              <p className="text-[15px] font-medium text-ink">Cancel this appointment?</p>
              <p className="mt-1 text-[14px] text-ink-muted">
                This frees up your slot. You can always book again later.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="secondary" size="md" onClick={() => setMode('view')}>
                  Keep appointment
                </Button>
                <Button type="button" variant="primary" size="md" onClick={doCancel} disabled={submitting} className="!bg-[#a91916] hover:!bg-[#8e1512]">
                  {submitting ? 'Cancelling…' : 'Yes, cancel'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <p className="mb-4 text-[14px] font-medium text-ink">Pick a new date &amp; time</p>
              <DateTimePicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectDate={selectDate}
                onSelectTime={setSelectedTime}
                slots={slots}
                loadingSlots={loadingSlots}
                slotError={slotError}
              />
              <div className="mt-6 flex flex-col-reverse items-stretch gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="secondary" size="md" onClick={() => setMode('view')} iconLeft={<ChevronLeftIcon className="h-4 w-4" />}>
                  Back
                </Button>
                <Button type="button" variant="primary" size="md" onClick={doReschedule} disabled={!selectedDate || !selectedTime || submitting} className="!bg-accent-dark hover:!bg-accent">
                  {submitting ? 'Saving…' : 'Confirm new time'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp fallback */}
        <div className="border-t border-hairline px-6 py-4 sm:px-8">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-whatsapp hover:underline"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Prefer to message us? Change it on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ cancelled }: { cancelled: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium',
        cancelled ? 'bg-surface-alt text-ink-muted ring-1 ring-hairline' : 'bg-accent-soft text-accent',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', cancelled ? 'bg-ink-subtle' : 'bg-accent')} />
      {cancelled ? 'Cancelled' : 'Active'}
    </span>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div>
        <dt className="font-pirulen text-[10px] uppercase tracking-[0.14em] text-ink-subtle">{label}</dt>
        <dd className="text-[14px] font-medium text-ink">{value}</dd>
      </div>
    </div>
  );
}

import { NextResponse } from 'next/server';
import { dayStatus, isSlotTime, slotAvailable } from '@/lib/booking/slots';
import {
  countsByDate,
  createBooking,
  setGoogleEventId,
  SlotFullError,
  BookingConfigError,
} from '@/lib/booking/store';
import { sendEmail } from '@/lib/email/resend';
import { customerBookingEmail, workshopBookingEmail } from '@/lib/email/bookingEmails';
import { createBookingEvent } from '@/lib/google/calendar';
import { business } from '@/content/business';

export const dynamic = 'force-dynamic';

const REQUIRED = [
  'service',
  'date',
  'time',
  'name',
  'phone',
  'vehicleMake',
  'vehicleModel',
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/booking — validate, confirm the slot is genuinely free, persist to
// Sanity, then fire confirmation/notification emails (best-effort).
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const get = (key: string) => String(data[key] ?? '').trim();

  for (const field of REQUIRED) {
    if (!get(field)) {
      return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
    }
  }

  const date = get('date');
  const time = get('time');
  const email = get('email');

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isSlotTime(time)) {
    return NextResponse.json({ ok: false, error: 'invalid_slot' }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }
  if (dayStatus(date) !== 'open') {
    return NextResponse.json({ ok: false, error: 'not_bookable' }, { status: 400 });
  }

  const counts = await countsByDate(date);
  if (!slotAvailable(date, time, counts[time] ?? 0)) {
    return NextResponse.json({ ok: false, error: 'slot_full' }, { status: 409 });
  }

  try {
    const booking = await createBooking({
      service: get('service'),
      date,
      time,
      name: get('name'),
      phone: get('phone'),
      email: email || undefined,
      vehicleMake: get('vehicleMake'),
      vehicleModel: get('vehicleModel'),
      notes: get('notes') || undefined,
    });

    console.log('[booking]', new Date().toISOString(), booking.reference, date, time);

    // Best-effort notifications — never block the confirmation on email.
    // `emailed` reflects whether the customer email actually sent (not merely
    // that an address was given), so the UI never claims a confirmation that
    // didn't go out (e.g. when Resend isn't configured yet).
    const notify = process.env.BOOKING_NOTIFICATION_EMAIL || business.email;
    let emailed = false;
    const jobs: Promise<unknown>[] = [
      sendEmail({ to: notify, replyTo: booking.email, ...workshopBookingEmail(booking) }),
      // Push to Google Calendar and record the event id on the booking.
      createBookingEvent(booking).then((eventId) =>
        eventId ? setGoogleEventId(booking.id, eventId) : undefined,
      ),
    ];
    if (booking.email) {
      jobs.push(
        sendEmail({ to: booking.email, replyTo: notify, ...customerBookingEmail(booking) }).then(
          (sent) => {
            emailed = sent;
          },
        ),
      );
    }
    await Promise.allSettled(jobs);

    return NextResponse.json({ ok: true, reference: booking.reference, date, time, emailed });
  } catch (err) {
    if (err instanceof SlotFullError) {
      return NextResponse.json({ ok: false, error: 'slot_full' }, { status: 409 });
    }
    if (err instanceof BookingConfigError) {
      console.error('[booking] persistence not configured (SANITY_API_WRITE_TOKEN missing)');
      return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
    }
    console.error('[booking] create failed:', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}

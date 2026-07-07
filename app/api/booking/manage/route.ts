import { NextResponse } from 'next/server';
import { dayStatus, isSlotTime, slotAvailable } from '@/lib/booking/slots';
import {
  getBookingByToken,
  rescheduleBooking,
  cancelBooking,
  countsByDate,
  SlotFullError,
  BookingConfigError,
  type ManagedBooking,
} from '@/lib/booking/store';
import { updateBookingEvent, deleteBookingEvent } from '@/lib/google/calendar';
import { sendEmail } from '@/lib/email/resend';
import { rescheduledEmail, cancelledEmail, workshopUpdateEmail } from '@/lib/email/bookingEmails';
import { business } from '@/content/business';

export const dynamic = 'force-dynamic';

// Best-effort notifications for a self-service change.
async function notify(booking: ManagedBooking, kind: 'rescheduled' | 'cancelled') {
  const to = process.env.BOOKING_NOTIFICATION_EMAIL || business.email;
  const jobs: Promise<unknown>[] = [
    sendEmail({ to, replyTo: booking.email, ...workshopUpdateEmail(booking, kind) }),
  ];
  if (booking.email) {
    const mail = kind === 'cancelled' ? cancelledEmail(booking) : rescheduledEmail(booking);
    jobs.push(sendEmail({ to: booking.email, replyTo: to, ...mail }));
  }
  await Promise.allSettled(jobs);
}

// POST /api/booking/manage — self-service reschedule or cancel, authorised by
// the booking's manage token. Keeps the Google Calendar event in sync.
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const token = String(data.token ?? '').trim();
  const action = String(data.action ?? '').trim();
  if (!token) return NextResponse.json({ ok: false, error: 'missing_token' }, { status: 400 });

  const booking = await getBookingByToken(token);
  if (!booking) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  if (booking.status === 'cancelled') {
    return NextResponse.json({ ok: false, error: 'already_cancelled' }, { status: 409 });
  }

  if (action === 'cancel') {
    try {
      await cancelBooking(booking.id);
    } catch (err) {
      if (err instanceof BookingConfigError) {
        return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
      }
      return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
    }
    if (booking.googleEventId) await deleteBookingEvent(booking.googleEventId);
    await notify(booking, 'cancelled');
    return NextResponse.json({ ok: true, action: 'cancel' });
  }

  if (action === 'reschedule') {
    const date = String(data.date ?? '').trim();
    const time = String(data.time ?? '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isSlotTime(time)) {
      return NextResponse.json({ ok: false, error: 'invalid_slot' }, { status: 400 });
    }
    if (date === booking.date && time === booking.time) {
      return NextResponse.json({ ok: false, error: 'unchanged' }, { status: 400 });
    }
    if (dayStatus(date) !== 'open') {
      return NextResponse.json({ ok: false, error: 'not_bookable' }, { status: 400 });
    }
    const counts = await countsByDate(date);
    if (!slotAvailable(date, time, counts[time] ?? 0)) {
      return NextResponse.json({ ok: false, error: 'slot_full' }, { status: 409 });
    }

    try {
      await rescheduleBooking(booking.id, date, time);
    } catch (err) {
      if (err instanceof SlotFullError) {
        return NextResponse.json({ ok: false, error: 'slot_full' }, { status: 409 });
      }
      if (err instanceof BookingConfigError) {
        return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
      }
      return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
    }

    const updated: ManagedBooking = { ...booking, date, time };
    if (booking.googleEventId) await updateBookingEvent(booking.googleEventId, updated);
    await notify(updated, 'rescheduled');
    return NextResponse.json({ ok: true, action: 'reschedule', date, time });
  }

  return NextResponse.json({ ok: false, error: 'invalid_action' }, { status: 400 });
}

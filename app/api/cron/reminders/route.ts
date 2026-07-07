import { NextResponse } from 'next/server';
import { colomboNow, colomboTodayKey, addDaysKey } from '@/lib/booking/slots';
import { listDueReminders, markReminded } from '@/lib/booking/store';
import { sendEmail } from '@/lib/email/resend';
import { reminderEmail } from '@/lib/email/bookingEmails';

export const dynamic = 'force-dynamic';

// GET /api/cron/reminders — sends a one-time reminder email to customers whose
// appointment is today or tomorrow. Idempotent: bookings are marked reminded
// only after a successful send, so re-runs (or a flaky email) never double-send.
//
// Scheduled by vercel.json. Protected by CRON_SECRET: Vercel sends it as a
// Bearer token automatically; when the secret is unset (local dev) the endpoint
// is open so it can be triggered by hand.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
  }

  const now = colomboNow();
  const today = colomboTodayKey();
  const tomorrow = addDaysKey(today, 1);

  const due = await listDueReminders([today, tomorrow]);

  let sent = 0;
  let skippedNoEmail = 0;
  let skippedPast = 0;
  let failed = 0;

  for (const booking of due) {
    // Don't remind for a slot that has already started today.
    if (booking.date === today) {
      const [h, m] = booking.time.split(':').map(Number);
      if (h * 60 + m <= now.minutes) {
        skippedPast++;
        continue;
      }
    }
    if (!booking.email) {
      skippedNoEmail++;
      continue;
    }

    const whenLabel = booking.date === today ? 'today' : 'tomorrow';
    const ok = await sendEmail({ to: booking.email, ...reminderEmail(booking, whenLabel) });
    if (ok) {
      await markReminded(booking.id);
      sent++;
    } else {
      failed++;
    }
  }

  const summary = { ok: true, due: due.length, sent, skippedNoEmail, skippedPast, failed };
  console.log('[cron/reminders]', JSON.stringify(summary));
  return NextResponse.json(summary);
}

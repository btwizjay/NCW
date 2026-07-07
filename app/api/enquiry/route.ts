import { NextResponse } from 'next/server';
import { sendEmail, isEmailConfigured } from '@/lib/email/resend';
import { enquiryEmail } from '@/lib/email/enquiryEmail';
import { business } from '@/content/business';

export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/enquiry — emails a website contact-form submission to the workshop.
// There is no other persistence, so the email IS the delivery: if it can't go
// out we return an error and the form points the customer to WhatsApp/phone.
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const get = (key: string) => String(data[key] ?? '').trim();
  const firstName = get('firstName');
  const phone = get('phone');
  const email = get('email');

  // The form requires a first name and a phone number; mirror that server-side.
  if (!firstName || !phone) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  if (!isEmailConfigured()) {
    console.error('[enquiry] RESEND_API_KEY not set — cannot deliver enquiry');
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  // Where new-enquiry alerts land. Falls back to the booking recipient, then to
  // the business email, so a single env var configures both flows by default.
  const to =
    process.env.ENQUIRY_NOTIFICATION_EMAIL ||
    process.env.BOOKING_NOTIFICATION_EMAIL ||
    business.email;

  const sent = await sendEmail({
    to,
    replyTo: email || undefined,
    ...enquiryEmail({
      firstName,
      lastName: get('lastName'),
      email,
      phone,
      message: get('message'),
    }),
  });

  if (!sent) {
    console.error('[enquiry] email send failed for', firstName, phone);
    return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
  }

  console.log('[enquiry]', new Date().toISOString(), 'delivered to', to, '·', firstName, phone);
  return NextResponse.json({ ok: true });
}

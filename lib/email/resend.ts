// Minimal Resend client via its REST API — no SDK dependency, works on
// serverless/edge. Configure RESEND_API_KEY and BOOKING_EMAIL_FROM (a sender on
// a domain you've verified in Resend). Sends are best-effort: failures are
// logged, never thrown, so a booking is never lost because email hiccupped.

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const FROM =
  process.env.BOOKING_EMAIL_FROM ??
  'Nilantha Cushion Works <bookings@nilanthacushionworks.lk>';

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(RESEND_API_KEY);
}

export async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping send:', subject);
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.warn('[email] Resend responded', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[email] send threw:', err);
    return false;
  }
}

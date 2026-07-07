import { business } from '@/content/business';
import { formatSlotLabel } from '@/lib/booking/slots';
import type { Booking } from '@/lib/booking/store';

// Plain, on-brand HTML emails for a new booking. Kept inline-styled for broad
// email-client support. Two recipients: the customer (a friendly confirmation)
// and the workshop (an at-a-glance notification with reply-to set to the
// customer).

const INK = '#1A1A1A';
const MUTED = '#5A5A5F';
const ACCENT = '#24388b';
const HAIRLINE = '#E5E5E7';

function formatDateLong(dateKey: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateKey}T12:00:00Z`));
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:6px 0;color:${MUTED};font-size:13px;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:${INK};font-size:14px;font-weight:600;">${value}</td>
    </tr>`;
}

function manageUrl(booking: Booking): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || business.siteUrl).replace(/\/$/, '');
  return `${base}/book/manage/${booking.manageToken}`;
}

function manageButton(booking: Booking): string {
  return `
        <a href="${manageUrl(booking)}" style="display:inline-block;margin-bottom:20px;padding:11px 20px;background:${ACCENT};color:#ffffff;text-decoration:none;border-radius:999px;font-size:13px;font-weight:600;">
          Reschedule or cancel
        </a>`;
}

function shell(
  title: string,
  intro: string,
  booking: Booking,
  footer: string,
  opts: { showManage?: boolean } = {},
): string {
  const when = `${formatDateLong(booking.date)} · ${formatSlotLabel(booking.time)}`;
  return `
  <div style="background:#F7F7F8;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid ${HAIRLINE};border-radius:16px;overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid ${HAIRLINE};">
        <div style="font-size:13px;font-weight:700;letter-spacing:0.5px;color:${ACCENT};">${business.name.toUpperCase()}</div>
      </div>
      <div style="padding:24px 28px;">
        <h1 style="margin:0 0 8px;font-size:20px;color:${INK};">${title}</h1>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${MUTED};">${intro}</p>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid ${HAIRLINE};border-bottom:1px solid ${HAIRLINE};margin-bottom:20px;">
          ${row('Reference', booking.reference)}
          ${row('When', when)}
          ${row('Service', booking.service)}
          ${row('Vehicle', `${booking.vehicleMake} ${booking.vehicleModel}`)}
          ${row('Name', booking.name)}
          ${row('Phone', booking.phone)}
          ${booking.email ? row('Email', booking.email) : ''}
          ${booking.notes ? row('Notes', booking.notes) : ''}
        </table>
        ${opts.showManage ? manageButton(booking) : ''}
        <p style="margin:0;font-size:13px;line-height:1.6;color:${MUTED};">${footer}</p>
      </div>
      <div style="padding:16px 28px;border-top:1px solid ${HAIRLINE};font-size:12px;color:#86868B;">
        ${business.address.formatted}<br/>
        ${business.phone.display} · ${business.email}
      </div>
    </div>
  </div>`;
}

export function customerBookingEmail(booking: Booking): { subject: string; html: string } {
  return {
    subject: `Your booking request — ${business.name} (${booking.reference})`,
    html: shell(
      'Booking request received',
      `Thanks, ${booking.name.split(' ')[0]}. We’ve received your request and will confirm by phone or WhatsApp within one working day. Nothing is charged until we agree a quote.`,
      booking,
      `Need to change something? Use the button above, reply to this email, or message us on WhatsApp at ${business.whatsapp.display}.`,
      { showManage: true },
    ),
  };
}

export function reminderEmail(
  booking: Booking,
  whenLabel: string,
): { subject: string; html: string } {
  return {
    subject: `Reminder: your appointment ${whenLabel} — ${business.name}`,
    html: shell(
      `Appointment reminder`,
      `Hi ${booking.name.split(' ')[0]}, a friendly reminder about your upcoming visit ${whenLabel}. If anything's changed, you can reschedule or cancel below.`,
      booking,
      `See you soon at the workshop. To get here, search the address below in Google Maps.`,
      { showManage: true },
    ),
  };
}

export function rescheduledEmail(booking: Booking): { subject: string; html: string } {
  return {
    subject: `Appointment updated — ${business.name} (${booking.reference})`,
    html: shell(
      'Your appointment was updated',
      `Hi ${booking.name.split(' ')[0]}, your appointment has been moved to the new time shown below. If this wasn't you, contact us right away.`,
      booking,
      `Need to change it again? Use the button above or reply to this email.`,
      { showManage: true },
    ),
  };
}

export function cancelledEmail(booking: Booking): { subject: string; html: string } {
  return {
    subject: `Appointment cancelled — ${business.name} (${booking.reference})`,
    html: shell(
      'Your appointment was cancelled',
      `Hi ${booking.name.split(' ')[0]}, your appointment below has been cancelled. We hope to see you another time — book again whenever you're ready.`,
      booking,
      `Changed your mind? Just book again at ${(process.env.NEXT_PUBLIC_SITE_URL || business.siteUrl).replace(/\/$/, '')}/book.`,
    ),
  };
}

export function workshopUpdateEmail(
  booking: Booking,
  kind: 'rescheduled' | 'cancelled',
): { subject: string; html: string } {
  const verb = kind === 'cancelled' ? 'cancelled' : 'rescheduled';
  return {
    subject: `Booking ${verb} · ${booking.date} ${formatSlotLabel(booking.time)} · ${booking.name}`,
    html: shell(
      `Booking ${verb}`,
      `A customer ${verb} their appointment through the website. ${kind === 'cancelled' ? 'The calendar event has been removed.' : 'The calendar event has been moved to the new time below.'}`,
      booking,
      `Reply to this email to reach ${booking.name}.`,
    ),
  };
}

export function workshopBookingEmail(booking: Booking): { subject: string; html: string } {
  return {
    subject: `New booking · ${booking.date} ${formatSlotLabel(booking.time)} · ${booking.name}`,
    html: shell(
      'New booking request',
      `A new appointment was requested through the website. Confirm it with the customer, then mark it Confirmed in the Studio.`,
      booking,
      `Reply to this email to reach ${booking.name} directly${booking.email ? '' : ' (no email provided — call or WhatsApp the phone number above)'}.`,
    ),
  };
}

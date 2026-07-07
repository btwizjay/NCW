import { business } from '@/content/business';

// On-brand HTML for a website contact-form enquiry, emailed to the workshop.
// Inline-styled for broad email-client support and mirrors the booking emails
// (lib/email/bookingEmails.ts). Reply-to is set to the customer (when they left
// an email) so hitting "Reply" reaches them directly.

const INK = '#1A1A1A';
const MUTED = '#5A5A5F';
const ACCENT = '#24388b';
const HAIRLINE = '#E5E5E7';

export type Enquiry = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

// Escape user-supplied text before interpolating into the HTML email.
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:6px 0;color:${MUTED};font-size:13px;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:${INK};font-size:14px;font-weight:600;">${value}</td>
    </tr>`;
}

export function enquiryEmail(e: Enquiry): { subject: string; html: string } {
  const name =
    [e.firstName, e.lastName].filter(Boolean).join(' ').trim() || 'Website visitor';
  const messageHtml = e.message
    ? esc(e.message).replace(/\n/g, '<br/>')
    : '<span style="color:#86868B;">(no message)</span>';

  return {
    subject: `New enquiry · ${name}${e.phone ? ` · ${e.phone}` : ''}`,
    html: `
  <div style="background:#F7F7F8;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid ${HAIRLINE};border-radius:16px;overflow:hidden;">
      <div style="padding:24px 28px;border-bottom:1px solid ${HAIRLINE};">
        <div style="font-size:13px;font-weight:700;letter-spacing:0.5px;color:${ACCENT};">${business.name.toUpperCase()}</div>
      </div>
      <div style="padding:24px 28px;">
        <h1 style="margin:0 0 8px;font-size:20px;color:${INK};">New contact enquiry</h1>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:${MUTED};">Someone sent an enquiry through the website contact form.</p>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid ${HAIRLINE};border-bottom:1px solid ${HAIRLINE};margin-bottom:20px;">
          ${row('Name', esc(name))}
          ${row('Phone', e.phone ? esc(e.phone) : '—')}
          ${e.email ? row('Email', esc(e.email)) : ''}
          ${row('Message', messageHtml)}
        </table>
        <p style="margin:0;font-size:13px;line-height:1.6;color:${MUTED};">${
          e.email
            ? 'Reply to this email to reach them directly.'
            : 'No email provided. Call or WhatsApp the phone number above.'
        }</p>
      </div>
      <div style="padding:16px 28px;border-top:1px solid ${HAIRLINE};font-size:12px;color:#86868B;">
        ${business.address.formatted}<br/>
        ${business.phone.display} · ${business.email}
      </div>
    </div>
  </div>`,
  };
}

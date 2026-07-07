import crypto from 'crypto';
import { business } from '@/content/business';
import { formatSlotLabel } from '@/lib/booking/slots';
import type { Booking } from '@/lib/booking/store';

// One-way push of bookings into the workshop's Google Calendar.
//
// Auth is a service-account JWT signed with Node's crypto (RS256) and exchanged
// for an access token — no googleapis SDK, so the serverless bundle stays small.
// Everything is best-effort: if creds are missing or Google errors, we return
// null and the booking proceeds regardless.
//
// Setup: create a service account + JSON key, enable the Calendar API, and
// share the target calendar with the service account email ("Make changes to
// events"). Then set GOOGLE_SERVICE_ACCOUNT_EMAIL,
// GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY (with literal \n) and GOOGLE_CALENDAR_ID.

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/calendar.events';

export function isCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID,
  );
}

// Normalizes the service-account PEM regardless of how it's stored in env:
// strips a leading/trailing quote (some loaders keep them, sometimes only on
// one side) and converts literal "\n" sequences to real newlines (real
// newlines are left as-is).
function normalizePrivateKey(raw: string): string {
  return raw.replace(/^["']|["']$/g, '').replace(/\\n/g, '\n').trim() + '\n';
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken(email: string, privateKey: string): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({
      iss: email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signingInput = `${header}.${claim}`;
  const signature = base64url(
    crypto.createSign('RSA-SHA256').update(signingInput).sign(privateKey),
  );
  const assertion = `${signingInput}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!res.ok) {
    console.warn('[gcal] token exchange failed', res.status, await res.text());
    return null;
  }
  const json = (await res.json()) as { access_token?: string };
  return json.access_token ?? null;
}

function addHour(time: string): string {
  const [h, m] = time.split(':').map(Number);
  return `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function eventDescription(booking: Booking): string {
  return [
    `Reference: ${booking.reference}`,
    `Status: requested — confirm with the customer`,
    `Service: ${booking.service}`,
    `Vehicle: ${booking.vehicleMake} ${booking.vehicleModel}`,
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    booking.email ? `Email: ${booking.email}` : null,
    booking.notes ? `Notes: ${booking.notes}` : null,
    '',
    'Booked via the website.',
  ]
    .filter(Boolean)
    .join('\n');
}

// Resolves an access token + the target calendar id, or null if not configured.
async function getAuth(): Promise<{ token: string; calendarId: string } | null> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!email || !rawKey || !calendarId) return null;
  try {
    const token = await getAccessToken(email, normalizePrivateKey(rawKey));
    return token ? { token, calendarId } : null;
  } catch (err) {
    console.warn('[gcal] auth threw:', err);
    return null;
  }
}

function eventBody(booking: Booking) {
  return {
    summary: `${booking.name} — ${booking.service}`,
    description: eventDescription(booking),
    location: business.address.formatted,
    start: { dateTime: `${booking.date}T${booking.time}:00`, timeZone: 'Asia/Colombo' },
    end: { dateTime: `${booking.date}T${addHour(booking.time)}:00`, timeZone: 'Asia/Colombo' },
  };
}

function eventsUrl(calendarId: string, eventId?: string) {
  const base = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
  return eventId ? `${base}/${encodeURIComponent(eventId)}` : base;
}

/** Creates a calendar event for a booking; returns the Google event id or null. */
export async function createBookingEvent(booking: Booking): Promise<string | null> {
  const auth = await getAuth();
  if (!auth) return null;
  try {
    const res = await fetch(eventsUrl(auth.calendarId), {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(eventBody(booking)),
    });
    if (!res.ok) {
      console.warn('[gcal] event create failed', res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { id?: string };
    console.log('[gcal] event created', json.id, 'for', booking.reference, `(${formatSlotLabel(booking.time)})`);
    return json.id ?? null;
  } catch (err) {
    console.warn('[gcal] create threw:', err);
    return null;
  }
}

/** Updates an existing event to a booking's (new) date/time. */
export async function updateBookingEvent(eventId: string, booking: Booking): Promise<boolean> {
  const auth = await getAuth();
  if (!auth) return false;
  try {
    const res = await fetch(eventsUrl(auth.calendarId, eventId), {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(eventBody(booking)),
    });
    if (!res.ok) {
      console.warn('[gcal] event update failed', res.status, await res.text());
      return false;
    }
    console.log('[gcal] event updated', eventId, 'for', booking.reference);
    return true;
  } catch (err) {
    console.warn('[gcal] update threw:', err);
    return false;
  }
}

/** Deletes an event (e.g. on cancellation). 404/410 are treated as success. */
export async function deleteBookingEvent(eventId: string): Promise<boolean> {
  const auth = await getAuth();
  if (!auth) return false;
  try {
    const res = await fetch(eventsUrl(auth.calendarId, eventId), {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (!res.ok && res.status !== 404 && res.status !== 410) {
      console.warn('[gcal] event delete failed', res.status, await res.text());
      return false;
    }
    console.log('[gcal] event deleted', eventId);
    return true;
  } catch (err) {
    console.warn('[gcal] delete threw:', err);
    return false;
  }
}

import { randomUUID } from 'crypto';
import { sanityClient } from '@/sanity/lib/client';
import { sanityWriteClient } from '@/sanity/lib/writeClient';
import { SLOT_CAPACITY } from './config';

// Persistent booking store backed by Sanity.
//
// Reads use an authenticated, CDN-bypassing client when a write token is
// present (fresh, accurate counts); writes require the token. Because Sanity
// has no conditional insert, capacity is enforced with a fresh re-check
// immediately before creating — adequate for this workshop's low volume.

export type Booking = {
  id: string; // Sanity document _id
  reference: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  service: string;
  name: string;
  phone: string;
  email?: string;
  vehicleMake: string;
  vehicleModel: string;
  notes?: string;
  manageToken: string;
  createdAt: string;
};

export type BookingInput = Omit<Booking, 'id' | 'reference' | 'manageToken' | 'createdAt'>;

// Prefer the write client (authenticated, fresh) for reads; fall back to a
// CDN-bypassing public client so availability still works without a token.
const reader = sanityWriteClient ?? sanityClient?.withConfig({ useCdn: false }) ?? null;

export class SlotFullError extends Error {
  constructor() {
    super('slot_full');
    this.name = 'SlotFullError';
  }
}

export class BookingConfigError extends Error {
  constructor() {
    super('not_configured');
    this.name = 'BookingConfigError';
  }
}

const COUNTS_QUERY =
  '*[_type == "booking" && date == $date && status != "cancelled"]{ time }';

/** Booking counts keyed by slot time for a given date (excludes cancelled). */
export async function countsByDate(date: string): Promise<Record<string, number>> {
  if (!reader) return {};
  try {
    const rows = await reader.fetch<{ time: string }[]>(COUNTS_QUERY, { date });
    const counts: Record<string, number> = {};
    for (const r of rows) {
      if (r?.time) counts[r.time] = (counts[r.time] ?? 0) + 1;
    }
    return counts;
  } catch (err) {
    // Fail open to "available"; createBooking re-checks before committing.
    console.warn('[booking] countsByDate failed:', err);
    return {};
  }
}

function makeReference(): string {
  return `NCW-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  if (!sanityWriteClient) throw new BookingConfigError();

  const counts = await countsByDate(input.date);
  if ((counts[input.time] ?? 0) >= SLOT_CAPACITY) throw new SlotFullError();

  const reference = makeReference();
  const manageToken = randomUUID();

  let created;
  try {
    created = await sanityWriteClient.create({
      _type: 'booking',
      status: 'requested',
      reference,
      manageToken,
      date: input.date,
      time: input.time,
      service: input.service,
      name: input.name,
      phone: input.phone,
      ...(input.email ? { email: input.email } : {}),
      vehicleMake: input.vehicleMake,
      vehicleModel: input.vehicleModel,
      ...(input.notes ? { notes: input.notes } : {}),
    });
  } catch (err) {
    // A mis-scoped token (read-only / org-level) authenticates but can't write.
    // Treat auth failures as "not configured" so the UI degrades to WhatsApp
    // rather than showing a hard error.
    const status = (err as { statusCode?: number })?.statusCode;
    if (status === 401 || status === 403) throw new BookingConfigError();
    throw err;
  }

  return {
    ...input,
    id: created._id,
    reference,
    manageToken,
    createdAt: created._createdAt,
  };
}

/** Records the Google Calendar event id on a booking (best-effort). */
export async function setGoogleEventId(id: string, googleEventId: string): Promise<void> {
  if (!sanityWriteClient) return;
  try {
    await sanityWriteClient.patch(id).set({ googleEventId }).commit();
  } catch (err) {
    console.warn('[booking] setGoogleEventId failed:', err);
  }
}

const REMINDER_PROJECTION = `{
  "id": _id, reference, date, time, service, name, phone, email,
  vehicleMake, vehicleModel, notes, manageToken, "createdAt": _createdAt
}`;

/**
 * Bookings that still need a reminder: dated on one of the given days (today /
 * tomorrow), not cancelled, and not already reminded.
 */
export async function listDueReminders(dates: string[]): Promise<Booking[]> {
  if (!reader) return [];
  try {
    return await reader.fetch<Booking[]>(
      `*[_type == "booking" && status != "cancelled" && !defined(reminderSentAt) && date in $dates] | order(date asc, time asc) ${REMINDER_PROJECTION}`,
      { dates },
    );
  } catch (err) {
    console.warn('[booking] listDueReminders failed:', err);
    return [];
  }
}

/** Marks a booking as reminded so it isn't reminded again. */
export async function markReminded(id: string): Promise<void> {
  if (!sanityWriteClient) return;
  try {
    await sanityWriteClient.patch(id).set({ reminderSentAt: new Date().toISOString() }).commit();
  } catch (err) {
    console.warn('[booking] markReminded failed:', err);
  }
}

export type ManagedBooking = Booking & { status: string; googleEventId?: string };

const MANAGE_PROJECTION = `{
  "id": _id, reference, status, date, time, service, name, phone, email,
  vehicleMake, vehicleModel, notes, manageToken, googleEventId, "createdAt": _createdAt
}`;

/** Loads a booking by its self-service manage token, or null. */
export async function getBookingByToken(token: string): Promise<ManagedBooking | null> {
  if (!reader || !token) return null;
  try {
    // Cast the client (not the bound method) around Sanity's typed-fetch
    // overloads, which reject this dynamically-built query string. Casting
    // `reader.fetch` to a variable would drop its `this` binding.
    const r = reader as unknown as {
      fetch: (q: string, p: Record<string, unknown>) => Promise<ManagedBooking[]>;
    };
    const docs = await r.fetch(
      `*[_type == "booking" && manageToken == $token] ${MANAGE_PROJECTION}`,
      { token },
    );
    return docs?.[0] ?? null;
  } catch (err) {
    console.warn('[booking] getBookingByToken failed:', err);
    return null;
  }
}

/** Moves a booking to a new slot (re-checks capacity); clears any prior reminder. */
export async function rescheduleBooking(id: string, date: string, time: string): Promise<void> {
  if (!sanityWriteClient) throw new BookingConfigError();
  const counts = await countsByDate(date);
  if ((counts[time] ?? 0) >= SLOT_CAPACITY) throw new SlotFullError();
  await sanityWriteClient.patch(id).set({ date, time }).unset(['reminderSentAt']).commit();
}

/** Marks a booking cancelled. */
export async function cancelBooking(id: string): Promise<void> {
  if (!sanityWriteClient) throw new BookingConfigError();
  await sanityWriteClient.patch(id).set({ status: 'cancelled' }).commit();
}

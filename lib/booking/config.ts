// Booking configuration — the single source of truth for slot times, capacity,
// closed days and how far ahead customers may book. Pure data + no Node APIs,
// so it is safe to import from both server routes and client components.

export const WORKSHOP_TZ = 'Asia/Colombo';

// Bookable drop-off / consultation times within the Mon–Sat 8:30–18:00 workshop
// hours (the midday hour is left out as a lunch gap).
export const SLOT_TIMES = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
] as const;

export type SlotTime = (typeof SLOT_TIMES)[number];

// How many vehicles the workshop can take in for the same time slot.
export const SLOT_CAPACITY = 2;

// Days the workshop is closed (0 = Sunday … 6 = Saturday).
export const CLOSED_WEEKDAYS = [0];

// How many days into the future a customer may book.
export const BOOKING_WINDOW_DAYS = 60;

// A same-day slot must be at least this many minutes ahead to be bookable.
export const LEAD_MINUTES = 30;

import {
  SLOT_TIMES,
  SLOT_CAPACITY,
  CLOSED_WEEKDAYS,
  BOOKING_WINDOW_DAYS,
  LEAD_MINUTES,
  WORKSHOP_TZ,
} from './config';

// Availability logic shared by the API and the scheduler UI. No Node APIs here,
// so this module is safe to import on the client. All "now" reasoning is done
// in the workshop's timezone (Asia/Colombo) regardless of where the visitor is.

export function formatSlotLabel(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const meridiem = h >= 12 ? 'PM' : 'AM';
  const hour = ((h + 11) % 12) + 1;
  return `${hour}:${m.toString().padStart(2, '0')} ${meridiem}`;
}

/** Human date from a 'YYYY-MM-DD' key, e.g. "Fri, 6 Jun 2026". */
export function formatDateLong(dateKey: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${dateKey}T12:00:00Z`));
}

type ColomboNow = { dateKey: string; weekday: number; minutes: number };

export function colomboNow(now: Date = new Date()): ColomboNow {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: WORKSHOP_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const dateKey = `${get('year')}-${get('month')}-${get('day')}`;
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const weekday = weekdayMap[get('weekday')] ?? 0;
  const minutes = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
  return { dateKey, weekday, minutes };
}

export function colomboTodayKey(now: Date = new Date()): string {
  return colomboNow(now).dateKey;
}

/** Weekday (0=Sun..6=Sat) for a 'YYYY-MM-DD' key, evaluated at UTC noon. */
export function weekdayOf(dateKey: string): number {
  return new Date(`${dateKey}T12:00:00Z`).getUTCDay();
}

/** Add days to a 'YYYY-MM-DD' key. */
export function addDaysKey(dateKey: string, days: number): string {
  const d = new Date(`${dateKey}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type DayStatus = 'open' | 'closed' | 'past' | 'beyond';

export function dayStatus(dateKey: string, now: Date = new Date()): DayStatus {
  const today = colomboTodayKey(now);
  if (dateKey < today) return 'past';
  if (dateKey > addDaysKey(today, BOOKING_WINDOW_DAYS)) return 'beyond';
  if (CLOSED_WEEKDAYS.includes(weekdayOf(dateKey))) return 'closed';
  return 'open';
}

function slotMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function slotAvailable(
  dateKey: string,
  time: string,
  count: number,
  now: Date = new Date(),
): boolean {
  if (count >= SLOT_CAPACITY) return false;
  const c = colomboNow(now);
  // Same-day slots must be comfortably ahead of the current time.
  if (dateKey === c.dateKey && slotMinutes(time) <= c.minutes + LEAD_MINUTES) {
    return false;
  }
  return true;
}

export type SlotView = { time: string; label: string; available: boolean };

export function getDayAvailability(
  dateKey: string,
  counts: Record<string, number>,
  now: Date = new Date(),
): { date: string; status: DayStatus; slots: SlotView[] } {
  const status = dayStatus(dateKey, now);
  if (status !== 'open') return { date: dateKey, status, slots: [] };
  const slots = SLOT_TIMES.map((time) => ({
    time,
    label: formatSlotLabel(time),
    available: slotAvailable(dateKey, time, counts[time] ?? 0, now),
  }));
  return { date: dateKey, status, slots };
}

export function isSlotTime(value: string): boolean {
  return (SLOT_TIMES as readonly string[]).includes(value);
}

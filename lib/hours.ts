import { business } from '@/content/business';

// Derives a live "open now / closed" state from the human-readable
// `business.hours` table, evaluated in the workshop's own timezone
// (Asia/Colombo) so it's correct regardless of the visitor's location.
//
// The parser understands the formats currently used in business.ts, e.g.
//   { day: 'Monday – Saturday', open: '8:30 AM – 6:00 PM' }
//   { day: 'Sunday', open: 'Closed' }
// and degrades gracefully (returns null) if the data ever changes shape.

const WORKSHOP_TZ = 'Asia/Colombo';

const DAY_INDEX: Record<string, number> = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tuesday: 2,
  wed: 3, wednesday: 3,
  thu: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6,
};

const DAY_LABEL = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

type Interval = { start: number; end: number }; // minutes from midnight
type Schedule = (Interval | null)[]; // length 7, indexed Sun..Sat

function parseTime(raw: string): number | null {
  const m = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?$/);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minute = m[2] ? parseInt(m[2], 10) : 0;
  const meridiem = m[3]?.toLowerCase();
  if (meridiem === 'pm' && hour !== 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
}

function expandDays(label: string): number[] {
  const parts = label.split(/[–—-]/).map((p) => p.trim().toLowerCase());
  if (parts.length === 2 && DAY_INDEX[parts[0]] != null && DAY_INDEX[parts[1]] != null) {
    const from = DAY_INDEX[parts[0]];
    const to = DAY_INDEX[parts[1]];
    const out: number[] = [];
    for (let i = from; ; i = (i + 1) % 7) {
      out.push(i);
      if (i === to || out.length > 7) break;
    }
    return out;
  }
  const single = DAY_INDEX[label.trim().toLowerCase()];
  return single != null ? [single] : [];
}

function buildSchedule(): Schedule {
  const schedule: Schedule = [null, null, null, null, null, null, null];
  for (const entry of business.hours) {
    if (/closed/i.test(entry.open)) continue;
    const [startStr, endStr] = entry.open.split(/[–—-]/).map((s) => s.trim());
    const start = parseTime(startStr ?? '');
    const end = parseTime(endStr ?? '');
    if (start == null || end == null) continue;
    for (const day of expandDays(entry.day)) schedule[day] = { start, end };
  }
  return schedule;
}

function formatMinutes(total: number): string {
  let hour = Math.floor(total / 60);
  const minute = total % 60;
  const meridiem = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute.toString().padStart(2, '0')} ${meridiem}`;
}

export type OpenState = {
  open: boolean;
  /** Weekday in the workshop timezone, e.g. "Friday". */
  todayLabel: string;
  /** Short human message, e.g. "Open now · until 6:00 PM". */
  message: string;
};

export function getOpenState(now: Date = new Date()): OpenState | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: WORKSHOP_TZ,
      hour12: false,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).formatToParts(now);

    const weekday = parts.find((p) => p.type === 'weekday')?.value ?? '';
    const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '', 10);
    const minute = parseInt(parts.find((p) => p.type === 'minute')?.value ?? '', 10);
    const day = DAY_INDEX[weekday.toLowerCase()];
    if (day == null || Number.isNaN(hour) || Number.isNaN(minute)) return null;

    const nowMinutes = (hour % 24) * 60 + minute;
    const schedule = buildSchedule();
    const today = schedule[day];

    if (today && nowMinutes >= today.start && nowMinutes < today.end) {
      return {
        open: true,
        todayLabel: DAY_LABEL[day],
        message: `Open now · until ${formatMinutes(today.end)}`,
      };
    }

    if (today && nowMinutes < today.start) {
      return {
        open: false,
        todayLabel: DAY_LABEL[day],
        message: `Opens today at ${formatMinutes(today.start)}`,
      };
    }

    // Look ahead up to a week for the next opening.
    for (let i = 1; i <= 7; i++) {
      const next = schedule[(day + i) % 7];
      if (!next) continue;
      const when = i === 1 ? 'tomorrow' : DAY_LABEL[(day + i) % 7];
      return {
        open: false,
        todayLabel: DAY_LABEL[day],
        message: `Closed · opens ${when} ${formatMinutes(next.start)}`,
      };
    }

    return { open: false, todayLabel: DAY_LABEL[day], message: 'Closed' };
  } catch {
    return null;
  }
}

/**
 * Index into `business.hours` whose day (or day-range) includes the given
 * weekday, or -1. Lets the UI highlight "today" in the hours list.
 */
export function hoursEntryIndexForDay(day: number): number {
  return business.hours.findIndex((entry) => expandDays(entry.day).includes(day));
}

/** Weekday index (Sun=0..Sat=6) in the workshop timezone, or null. */
export function getWorkshopDay(now: Date = new Date()): number | null {
  try {
    const weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: WORKSHOP_TZ,
      weekday: 'short',
    })
      .format(now)
      .toLowerCase();
    const day = DAY_INDEX[weekday];
    return day == null ? null : day;
  } catch {
    return null;
  }
}

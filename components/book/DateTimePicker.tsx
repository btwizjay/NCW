'use client';

import { useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@/components/ui/Icons';
import {
  colomboTodayKey,
  addDaysKey,
  weekdayOf,
  formatDateLong,
  type SlotView,
} from '@/lib/booking/slots';
import { CLOSED_WEEKDAYS, BOOKING_WINDOW_DAYS } from '@/lib/booking/config';
import { cn } from '@/lib/cn';

// Month calendar + time-slot grid, shared by the booking scheduler and the
// self-service manage/reschedule page. Owns its own month view; the parent owns
// the selected date/time and the availability fetch (passed in as `slots`).

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type Cell = { key: string; date: Date; inMonth: boolean; disabled: boolean };

function keyOf(d: Date) {
  return d.toISOString().slice(0, 10);
}

function buildMonth(year: number, month: number, todayKey: string, maxKey: string): Cell[] {
  const first = new Date(Date.UTC(year, month, 1, 12));
  const offset = (first.getUTCDay() + 6) % 7; // days since Monday
  const start = new Date(first);
  start.setUTCDate(first.getUTCDate() - offset);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + i);
    const key = keyOf(date);
    const disabled =
      key < todayKey || key > maxKey || CLOSED_WEEKDAYS.includes(weekdayOf(key));
    return { key, date, inMonth: date.getUTCMonth() === month, disabled };
  });
}

export function DateTimePicker({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  slots,
  loadingSlots,
  slotError,
}: {
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectDate: (key: string) => void;
  onSelectTime: (time: string) => void;
  slots: SlotView[];
  loadingSlots: boolean;
  slotError: string | null;
}) {
  const todayKey = useMemo(() => colomboTodayKey(), []);
  const maxKey = useMemo(() => addDaysKey(todayKey, BOOKING_WINDOW_DAYS), [todayKey]);
  const [view, setView] = useState(() => {
    const [y, m] = todayKey.split('-').map(Number);
    return { year: y, month: m - 1 };
  });

  const cells = useMemo(
    () => buildMonth(view.year, view.month, todayKey, maxKey),
    [view, todayKey, maxKey],
  );
  const viewKey = `${view.year}-${String(view.month + 1).padStart(2, '0')}`;
  const canGoPrev = viewKey > todayKey.slice(0, 7);
  const canGoNext = viewKey < maxKey.slice(0, 7);

  function shiftMonth(dir: -1 | 1) {
    setView((v) => {
      const m = v.month + dir;
      if (m < 0) return { year: v.year - 1, month: 11 };
      if (m > 11) return { year: v.year + 1, month: 0 };
      return { year: v.year, month: m };
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Calendar */}
      <div className="rounded-2xl bg-surface-alt/40 p-4 ring-1 ring-hairline sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            {MONTHS[view.month]} {view.year}
          </span>
          <div className="flex items-center gap-1">
            <CalNav disabled={!canGoPrev} onClick={() => shiftMonth(-1)} label="Previous month">
              <ChevronLeftIcon className="h-4 w-4" />
            </CalNav>
            <CalNav disabled={!canGoNext} onClick={() => shiftMonth(1)} label="Next month">
              <ChevronRightIcon className="h-4 w-4" />
            </CalNav>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-[11px] font-medium uppercase tracking-wide text-ink-subtle">
              {d}
            </div>
          ))}
          {cells.map((c) => {
            const selected = c.key === selectedDate;
            const isToday = c.key === todayKey;
            return (
              <button
                key={c.key}
                type="button"
                disabled={c.disabled}
                onClick={() => onSelectDate(c.key)}
                className={cn(
                  'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-all duration-200 sm:h-9 sm:w-9',
                  !c.inMonth && 'opacity-40',
                  c.disabled
                    ? 'cursor-not-allowed text-ink-subtle/50'
                    : selected
                      ? 'bg-accent font-semibold text-white shadow-soft ring-2 ring-accent/20'
                      : 'font-medium text-ink hover:-translate-y-0.5 hover:bg-accent-soft hover:text-accent',
                  isToday && !selected && 'font-semibold text-accent ring-1 ring-inset ring-accent/40',
                )}
              >
                {c.date.getUTCDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div className="rounded-2xl bg-surface-alt/40 p-4 ring-1 ring-hairline sm:p-5">
        {!selectedDate ? (
          <div className="flex h-full min-h-[12rem] flex-col items-center justify-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <CalendarIcon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-[13px] text-ink-muted">
              Select a date to see available times.
            </p>
          </div>
        ) : loadingSlots ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-11 animate-pulse rounded-xl bg-surface-alt" />
            ))}
          </div>
        ) : slotError ? (
          <p className="text-[13px] text-accent">{slotError}</p>
        ) : slots.length === 0 ? (
          <p className="text-[13px] text-ink-muted">No times available on this day.</p>
        ) : (
          <>
            <p className="mb-3 font-pirulen text-[10px] uppercase tracking-[0.14em] text-ink-subtle">
              {formatDateLong(selectedDate)}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {slots.map((s) => {
                const active = selectedTime === s.time;
                return (
                  <button
                    key={s.time}
                    type="button"
                    disabled={!s.available}
                    onClick={() => onSelectTime(s.time)}
                    className={cn(
                      'h-11 rounded-xl border text-[13px] font-medium transition-all duration-200',
                      !s.available
                        ? 'cursor-not-allowed border-hairline bg-surface-alt text-ink-subtle/60 line-through'
                        : active
                          ? 'border-accent bg-accent text-white shadow-soft'
                          : 'border-hairline bg-surface text-ink hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-soft',
                    )}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[12px] text-ink-subtle">
              Times shown in Sri Lanka time. Crossed-out slots are full.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function CalNav({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-hairline transition-colors',
        disabled ? 'cursor-not-allowed text-ink-subtle/40' : 'text-ink hover:bg-surface-alt',
      )}
    >
      {children}
    </button>
  );
}

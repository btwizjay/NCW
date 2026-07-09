'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
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

const EASE_SOFT = [0.22, 0.61, 0.36, 1] as const;

// Tapping a day or a time button on a touch device can trigger the browser's
// own "scroll the newly-focused control into view" behaviour, which — with
// Lenis's virtual scroll running underneath — reads as the page abruptly
// jumping/re-centering on whatever was just tapped. Blocking focus on pointer
// interaction (mousedown/touchstart fires before the browser's focus-scroll
// heuristic) stops it, while keyboard users tabbing to the control are
// unaffected since that doesn't go through mousedown at all.
const preventFocusScroll = (e: React.MouseEvent | React.TouchEvent) => e.preventDefault();

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
  const reduce = useReducedMotion();
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

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.03 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_SOFT } },
  };

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
                onMouseDown={preventFocusScroll}
                onTouchStart={preventFocusScroll}
                onClick={() => onSelectDate(c.key)}
                className={cn(
                  'mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13px] transition-all duration-200 sm:h-10 sm:w-10',
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

      {/* Time slots — height animates smoothly as content swaps (placeholder /
          loading / error / empty / populated), and the panel's own reveal is a
          contained fade + stagger, not a page-level scroll, so choosing a date
          draws the eye here without moving the viewport. */}
      <motion.div layout="size" transition={{ duration: reduce ? 0 : 0.35, ease: EASE_SOFT }} className="overflow-hidden rounded-2xl bg-surface-alt/40 p-4 ring-1 ring-hairline sm:p-5">
        <AnimatePresence mode="wait" initial={false}>
          {!selectedDate ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-full min-h-[12rem] flex-col items-center justify-center text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <CalendarIcon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-[13px] text-ink-muted">
                Select a date to see available times.
              </p>
            </motion.div>
          ) : loadingSlots ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-2"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-11 animate-pulse rounded-xl bg-surface-alt" />
              ))}
            </motion.div>
          ) : slotError ? (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[13px] text-accent"
            >
              {slotError}
            </motion.p>
          ) : slots.length === 0 ? (
            <motion.p
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[13px] text-ink-muted"
            >
              No times available on this day.
            </motion.p>
          ) : (
            <motion.div
              key={`slots-${selectedDate}`}
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <motion.p
                variants={item}
                className="mb-3 font-pirulen text-[10px] uppercase tracking-[0.14em] text-ink-subtle"
              >
                {formatDateLong(selectedDate)}
              </motion.p>
              <div className="grid grid-cols-2 gap-2">
                {slots.map((s) => {
                  const active = selectedTime === s.time;
                  return (
                    <motion.button
                      key={s.time}
                      variants={item}
                      type="button"
                      disabled={!s.available}
                      onMouseDown={preventFocusScroll}
                      onTouchStart={preventFocusScroll}
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
                    </motion.button>
                  );
                })}
              </div>
              <p className="mt-3 text-[12px] text-ink-subtle">
                Times shown in Sri Lanka time. Crossed-out slots are full.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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
      onMouseDown={preventFocusScroll}
      onTouchStart={preventFocusScroll}
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

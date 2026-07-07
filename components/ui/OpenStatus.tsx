'use client';

import { useEffect, useState } from 'react';
import { getOpenState, type OpenState } from '@/lib/hours';
import { cn } from '@/lib/cn';

type Tone = 'light' | 'dark' | 'plain';

// Live workshop status pill with a pulsing presence dot. Computed on the
// client after mount (and refreshed each minute) to stay accurate without
// risking a server/client hydration mismatch on the time.
export function OpenStatus({
  className,
  tone = 'light',
}: {
  className?: string;
  tone?: Tone;
}) {
  const [state, setState] = useState<OpenState | null>(null);

  useEffect(() => {
    const update = () => setState(getOpenState(new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const open = state?.open ?? false;

  const toneClasses: Record<Tone, string> = {
    light: 'bg-surface/80 text-ink ring-1 ring-hairline backdrop-blur-md',
    dark: 'bg-white/10 text-white ring-1 ring-white/20 backdrop-blur-md',
    plain: 'text-ink-muted',
  };

  const dotColor = open ? 'bg-whatsapp' : 'bg-ink-subtle';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium',
        toneClasses[tone],
        className,
      )}
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp/70" />
        )}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', dotColor)} />
      </span>
      <span className="whitespace-nowrap">
        {state ? state.message : 'Checking hours…'}
      </span>
    </span>
  );
}

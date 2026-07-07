import { NextResponse } from 'next/server';
import { getDayAvailability } from '@/lib/booking/slots';
import { countsByDate } from '@/lib/booking/store';

export const dynamic = 'force-dynamic';

// GET /api/booking/availability?date=YYYY-MM-DD
// Returns the day's status (open/closed/past/beyond) and each slot with a live
// `available` flag, so the scheduler can grey out full or past times.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') ?? '';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: 'invalid_date' }, { status: 400 });
  }

  const counts = await countsByDate(date);
  const availability = getDayAvailability(date, counts);
  return NextResponse.json({ ok: true, ...availability });
}

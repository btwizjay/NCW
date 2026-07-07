import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { getBookingByToken } from '@/lib/booking/store';
import { ManageBooking } from '@/components/book/ManageBooking';
import { PageAtmosphere } from '@/components/ui/PageAtmosphere';
import { HomepageBackdrop } from '@/components/home/HomepageBackdrop';

export const metadata: Metadata = {
  title: 'Manage your booking',
  robots: { index: false, follow: false },
};

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const booking = await getBookingByToken(token);

  return (
    <>
      <PageAtmosphere />

      <Section
        tone="transparent"
        size="wide"
        className="!pt-32 sm:!pt-40 !pb-24 sm:!pb-32"
      >
        {booking ? (
          <ManageBooking
            token={token}
            reference={booking.reference}
            status={booking.status}
            service={booking.service}
            name={booking.name}
            date={booking.date}
            time={booking.time}
          />
        ) : (
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-[22px] tracking-tightest sm:text-[26px] leading-[1.15]">
              Booking not found
            </h1>
            <p className="mt-4 text-pretty text-[15px] leading-relaxed text-ink-muted">
              This link is invalid or has expired. If you need to change an
              appointment, message us on WhatsApp or make a new booking.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/book" variant="primary" size="md">
                Book an appointment
              </Button>
              <Button href="/contact" variant="secondary" size="md">
                Contact us
              </Button>
            </div>
          </div>
        )}
      </Section>

      <HomepageBackdrop />
    </>
  );
}

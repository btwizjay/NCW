import { useClient, type DocumentActionComponent, type DocumentActionProps } from 'sanity';
import {
  CheckmarkCircleIcon,
  DoubleChevronRightIcon,
  CloseCircleIcon,
  CommentIcon,
} from '@sanity/icons';
import { formatDateLong, formatSlotLabel } from '@/lib/booking/slots';
import { business } from '@/content/business';

// Custom Studio document actions for bookings, giving the workshop a one-click
// status workflow plus a one-tap WhatsApp reminder (vital for phone-only
// customers who never get an email reminder). Registered for the `booking`
// type in sanity.config.ts.

const API_VERSION = '2024-10-01';

type BookingDoc = {
  status?: string;
  phone?: string;
  name?: string;
  date?: string;
  time?: string;
  manageToken?: string;
  reference?: string;
};

function currentDoc(props: DocumentActionProps): BookingDoc | null {
  return (props.draft ?? props.published) as BookingDoc | null;
}

function publishedId(id: string): string {
  return id.replace(/^drafts\./, '');
}

// Build a wa.me link to the *customer's* number with a prefilled reminder.
function customerReminderUrl(doc: BookingDoc): string {
  const digits = (doc.phone ?? '').replace(/\D/g, '');
  const intl = digits.startsWith('0') ? `94${digits.slice(1)}` : digits;
  const first = (doc.name ?? '').split(' ')[0] || 'there';
  const when = doc.date
    ? `${formatDateLong(doc.date)}${doc.time ? ` at ${formatSlotLabel(doc.time)}` : ''}`
    : 'your upcoming appointment';
  const message = `Hi ${first}, a friendly reminder of your appointment at ${business.name} on ${when}. Reply here if you need to change it. See you then!`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}

export const confirmBookingAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: API_VERSION });
  const doc = currentDoc(props);
  if (!doc || doc.status !== 'requested') return null;
  return {
    label: 'Confirm booking',
    icon: CheckmarkCircleIcon,
    tone: 'positive',
    onHandle: async () => {
      await client.patch(publishedId(props.id)).set({ status: 'confirmed' }).commit();
      props.onComplete();
    },
  };
};

export const completeBookingAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: API_VERSION });
  const doc = currentDoc(props);
  if (!doc || (doc.status !== 'confirmed' && doc.status !== 'requested')) return null;
  return {
    label: 'Mark completed',
    icon: DoubleChevronRightIcon,
    onHandle: async () => {
      await client.patch(publishedId(props.id)).set({ status: 'completed' }).commit();
      props.onComplete();
    },
  };
};

export const whatsappReminderAction: DocumentActionComponent = (props) => {
  const doc = currentDoc(props);
  if (!doc?.phone || doc.status === 'cancelled') return null;
  return {
    label: 'WhatsApp reminder',
    icon: CommentIcon,
    onHandle: () => {
      if (typeof window !== 'undefined') {
        window.open(customerReminderUrl(doc), '_blank', 'noopener,noreferrer');
      }
      props.onComplete();
    },
  };
};

export const cancelBookingAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: API_VERSION });
  const doc = currentDoc(props);
  if (!doc || doc.status === 'cancelled') return null;
  return {
    label: 'Cancel booking',
    icon: CloseCircleIcon,
    tone: 'critical',
    onHandle: async () => {
      // Prefer the manage API so the Google Calendar event is removed and the
      // customer is emailed; fall back to a plain status patch if it's offline.
      let handled = false;
      if (doc.manageToken) {
        try {
          const res = await fetch('/api/booking/manage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: doc.manageToken, action: 'cancel' }),
          });
          handled = res.ok;
        } catch {
          handled = false;
        }
      }
      if (!handled) {
        await client.patch(publishedId(props.id)).set({ status: 'cancelled' }).commit();
      }
      props.onComplete();
    },
  };
};

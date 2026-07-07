import { defineField, defineType } from 'sanity';

const STATUSES = [
  { title: 'Requested', value: 'requested' },
  { title: 'Confirmed', value: 'confirmed' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' },
] as const;

// Appointment booked through the website scheduler. Created by the booking API
// (server, with a write token); the workshop manages status from the Studio.
export const bookingType = defineType({
  name: 'booking',
  title: 'Booking',
  type: 'document',
  // Bookings are created via the API, not authored by hand in the Studio.
  readOnly: false,
  fields: [
    defineField({
      name: 'reference',
      title: 'Reference',
      type: 'string',
      readOnly: true,
      description: 'Auto-generated booking reference (e.g. NCW-AB12C).',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: STATUSES.map((s) => ({ title: s.title, value: s.value })), layout: 'radio' },
      initialValue: 'requested',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: { dateFormat: 'ddd, D MMM YYYY' },
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      readOnly: true,
      description: '24-hour slot start, e.g. 09:00.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'service',
      title: 'Service',
      type: 'string',
      readOnly: true,
    }),
    defineField({ name: 'name', title: 'Customer name', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'vehicleMake', title: 'Vehicle make', type: 'string', readOnly: true }),
    defineField({ name: 'vehicleModel', title: 'Vehicle model', type: 'string', readOnly: true }),
    defineField({ name: 'notes', title: 'Notes', type: 'text', rows: 3, readOnly: true }),

    // Forward-compatible fields used by later phases (calendar sync / self-serve
    // reschedule / reminders). Hidden from the editor; written by the server.
    defineField({ name: 'manageToken', title: 'Manage token', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'googleEventId', title: 'Google event id', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'reminderSentAt', title: 'Reminder sent at', type: 'datetime', readOnly: true, hidden: true }),
  ],
  orderings: [
    {
      title: 'Appointment date',
      name: 'dateAsc',
      by: [
        { field: 'date', direction: 'asc' },
        { field: 'time', direction: 'asc' },
      ],
    },
    {
      title: 'Recently booked',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      reference: 'reference',
      name: 'name',
      date: 'date',
      time: 'time',
      service: 'service',
      status: 'status',
    },
    prepare({ reference, name, date, time, service, status }) {
      const flag =
        status === 'confirmed' ? '✓ ' : status === 'cancelled' ? '✕ ' : status === 'completed' ? '● ' : '• ';
      const when = [date, time].filter(Boolean).join(' · ');
      return {
        title: `${flag}${name ?? 'Booking'}${reference ? ` (${reference})` : ''}`,
        subtitle: [when, service].filter(Boolean).join('  —  '),
      };
    },
  },
});

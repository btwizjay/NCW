// Single source of truth for business contact info.
// Update values here and the rest of the site picks them up automatically.

const fullAddress =
  'No.257/5, Situwara Asapuwa, Kandy Road, Pasyala 11890, Sri Lanka';
const mapsQuery = encodeURIComponent(fullAddress);

export const business = {
  name: 'Nilantha Cushion Works',
  shortName: 'Nilantha',
  tagline: 'Premium vehicle interiors, crafted in Pasyala.',
  description:
    'Two decades of meticulous cushion work, Japanese seat sets and full interior restoration for Sri Lanka’s drivers.',
  established: 2003,
  siteUrl: 'https://nilanthacushionworks.lk',

  phone: {
    e164: '+94777771949',
    display: '077 777 1949',
  },
  whatsapp: {
    e164: '94770130672',
    display: '077 013 0672',
  },
  email: 'nilanthacushionworke@gmail.com',

  address: {
    line1: 'No.257/5, Situwara Asapuwa',
    line2: 'Kandy Road',
    city: 'Pasyala',
    district: 'Gampaha',
    country: 'Sri Lanka',
    postal: '11890',
    // Pre-formatted single-line address for UI display.
    formatted: fullAddress,
  },

  hours: [
    { day: 'Monday – Saturday', open: '8:30 AM – 6:00 PM' },
    { day: 'Sunday', open: 'Closed' },
  ],

  // Maps URLs derived from the exact address above. When the address changes,
  // these stay in sync.
  mapEmbedUrl: `https://www.google.com/maps?q=${mapsQuery}&output=embed`,
  mapLinkUrl: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,

  social: {
    facebook: 'https://web.facebook.com/nilanthacushionwork/',
    instagram: 'https://www.instagram.com/nilanthacushionworks/',
    tiktok: 'https://www.tiktok.com/@nilanthacushionworks',
  },
} as const;

export type Business = typeof business;

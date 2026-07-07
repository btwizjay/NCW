export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  image: string;
  highlights: string[];
};

// Image URLs are placeholders from Unsplash. Replace with real photography
// by dropping files into /public/images/services and updating the `image` path.
export const services: Service[] = [
  {
    slug: 'japanese-seat-sets',
    title: 'Japanese Seat Sets',
    shortTitle: 'Seat Sets',
    summary:
      'Authentic Japanese seat sets fitted to factory standards for vans, jeeps and SUVs.',
    description:
      'We supply and fit imported Japanese seat sets for popular vans, jeeps and SUVs. Every fitting is finished to factory tolerances, with proper rail alignment, belt routing and trim work.',
    image:
      '/images/services/japanese-seat-sets.jpeg',
    highlights: ['Hiace, Caravan, Noah, KDH', 'Rail and belt fitment', 'Trim restored to OEM look'],
  },
  {
    slug: 'seat-covers',
    title: 'Seat Covers',
    shortTitle: 'Seat Covers',
    summary:
      'Custom-fitted seat covers crafted for style, comfort and lasting protection.',
    description:
      "We design and fit seat covers tailored to your vehicle's exact seat dimensions. Choose from a wide range of fabrics, colours and finishes to match your interior perfectly.",
    image:
      '/images/services/seat-covers.jpeg',
    highlights: ['Perfect fit for any vehicle', 'Wide fabric selection', 'Durable and easy to maintain'],
  },
  {
    slug: '3d-carpets',
    title: '3D Carpets',
    shortTitle: '3D Carpets',
    summary:
      'Precision-moulded 3D carpets that fit every contour of your vehicle floor.',
    description:
      "Our 3D carpets are custom-moulded to match your vehicle's exact floor shape, providing complete coverage and protection against dirt, water and wear.",
    image:
      '/images/services/3d-carpets.jpg',
    highlights: ['Custom-moulded fit', 'Waterproof and durable', 'Easy to clean'],
  },
  {
    slug: 'seat-repairing',
    title: 'Seat Repairing',
    shortTitle: 'Seat Repairing',
    summary:
      'Expert seat repairs including foam rebuilds, frame fixes and re-stitching.',
    description:
      'From torn upholstery and collapsed foam to broken frames and worn-out springs, we restore damaged seats to like-new condition with quality materials and skilled craftsmanship.',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80',
    highlights: ['Foam core rebuilds', 'Frame and spring repair', 'Re-stitching and patching'],
  },
  {
    slug: 'door-upholstery',
    title: 'Door Upholstery',
    shortTitle: 'Door Upholstery',
    summary:
      'Complete door panel re-trimming and upholstery for a refreshed cabin look.',
    description:
      'Worn or damaged door panels drag down your entire interior. We re-upholster door cards with matched fabrics and materials, restoring them to a clean factory finish.',
    image:
      'https://images.unsplash.com/photo-1583267746897-2cf66319ef97?auto=format&fit=crop&w=1600&q=80',
    highlights: ['Matched fabrics and colours', 'Armrest and pocket restoration', 'Factory-finish quality'],
  },
  {
    slug: 'hood-lining-and-boards',
    title: 'Hood Lining & Boards',
    shortTitle: 'Hood Lining',
    summary:
      'Sagging or worn hood linings and boards replaced with quality materials.',
    description:
      "We replace and refit hood linings and ceiling boards using climate-resistant adhesives and matched fabrics, bringing your vehicle's roof interior back to a clean, tight finish.",
    image:
      'https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?auto=format&fit=crop&w=1600&q=80',
    highlights: ['Climate-resistant adhesives', 'Matched ceiling fabrics', 'Clean factory finish'],
  },
];

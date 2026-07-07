export const brands = [
  'Toyota',
  'Nissan',
  'Suzuki',
  'Mitsubishi',
  'Honda',
  'Mazda',
  'Isuzu',
  'Daihatsu',
  'Volkswagen',
] as const;

export type Brand = (typeof brands)[number];

// Optional hero photo per brand, used as the top image on the catalogue
// brand card. Drop a 4:3 (or wider) image at the path below and the card
// switches from the monochrome SimpleIcons logo to the photo automatically.
//   public/brands/toyota.jpg
//   public/brands/nissan.jpg
//   …
// Colored brand logos for the catalogue brand grid. The default brand covers
// (in Sanity) are monochrome; these colored versions are composited onto a
// white 1500x1800 canvas with the logo centered up top so they match the cover
// framing and drop straight into the cards (object-cover). Keyed by brand name
// (Sanity brand names, not the local Brand union). A brand without an entry here
// simply falls back to its Sanity cover. Source files live in
// public/brands/color/ (see scripts/composite-all.mjs).
export const brandColorLogos: Record<string, string> = {
  BMW: '/brands/color/bmw.png',
  Daihatsu: '/brands/color/daihatsu.png',
  Ford: '/brands/color/ford.png',
  Honda: '/brands/color/honda.png',
  Isuzu: '/brands/color/isuzu.png',
  Jac: '/brands/color/jac.png',
  Mahindra: '/brands/color/mahindra.png',
  Mazda: '/brands/color/mazda.png',
  Mercedes: '/brands/color/mercedes.png',
  Mitsubishi: '/brands/color/mitsubishi.png',
  Nissan: '/brands/color/nissan.png',
  Suzuki: '/brands/color/suzuki.png',
  Toyota: '/brands/color/toyota.png',
};

export const brandHeroImages: Partial<Record<Brand, string>> = {
  Toyota: '/brands/toyota.jpg',
  Nissan: '/brands/nissan.jpg',
  Suzuki: '/brands/suzuki.jpg',
  Mitsubishi: '/brands/mitsubishi.jpg',
  Honda: '/brands/honda.jpg',
  Mazda: '/brands/mazda.jpg',
  Isuzu: '/brands/isuzu.jpg',
  // Daihatsu — drop /brands/daihatsu.jpg in to enable
  Volkswagen: '/brands/volkswagen.jpg',
};

// Optional per-model hero photo, keyed by Brand → vehicleModel (matches the
// `vehicleModel` value used in Sanity). Drop files at
//   public/brands/models/{brand-slug}/{model-slug}.jpg
// and reference them here. The catalogue model card uses the value here if
// present, otherwise a stable picsum placeholder. It must never fall back to
// a work/item product image.
export const modelHeroImages: Partial<Record<Brand, Record<string, string>>> = {
  // Toyota: {
  //   'Hiace KDH 200': '/brands/models/toyota/hiace-kdh-200.jpg',
  //   'Aqua': '/brands/models/toyota/aqua.jpg',
  // },
};

// Editorial "popular models" hint shown on each brand card in the catalogue.
// These are not used to filter products — they're a teaser to help drivers
// quickly recognise which brand their vehicle belongs to. Replace freely as
// the workshop's focus evolves.
export const brandPopularModels: Record<Brand, string[]> = {
  Toyota: ['Aqua', 'Prius', 'Hiace'],
  Nissan: ['Caravan', 'X-Trail', 'Sunny'],
  Suzuki: ['Alto', 'Wagon R', 'Every'],
  Mitsubishi: ['Lancer', 'Delica', 'Outlander'],
  Honda: ['Fit', 'Vezel', 'Civic'],
  Mazda: ['Axela', 'Bongo', 'Demio'],
  Isuzu: ['Elf', 'D-Max', 'NPR'],
  Daihatsu: ['Hijet', 'Mira', 'Move'],
  Volkswagen: ['Golf', 'Polo', 'Tiguan'],
};

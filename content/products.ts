import type { Brand } from './brands';

export type Product = {
  id: string;
  brand: Brand;
  brandSlug?: string;
  name: string;
  category: 'Seat Set' | 'Cushion' | 'Door Panel' | 'Roof Lining' | 'Carpet';
  summary: string;
  image: string;
  // Optional CMS-only fields. Local fallback products leave these undefined;
  // Sanity-backed products populate them as appropriate.
  featured?: boolean;
  vehicleModel?: string;
  modelSlug?: string;
  whatsappMessage?: string;
  gallery?: string[];
  longDescription?: string;
};

// Placeholder catalogue. Replace `image` with files from /public/images/products
// once real photography is available.
const seed = (id: number) =>
  `https://picsum.photos/seed/ncw-${id}/1200/900`;

export const products: Product[] = [
  // Toyota
  { id: 'toyota-hiace-kdh', brand: 'Toyota', name: 'Hiace KDH Seat Set', category: 'Seat Set', summary: 'Full cabin Japanese set for Hiace KDH series.', image: seed(11) },
  { id: 'toyota-noah-set', brand: 'Toyota', name: 'Noah / Voxy Seat Set', category: 'Seat Set', summary: 'Three-row Japanese set fitted to factory rails.', image: seed(12) },
  { id: 'toyota-aqua-cushion', brand: 'Toyota', name: 'Aqua Foam Rebuild', category: 'Cushion', summary: 'Driver and passenger foam rebuild with bolster reinforcement.', image: seed(13) },
  { id: 'toyota-prius-leather', brand: 'Toyota', name: 'Prius Leather Re-trim', category: 'Cushion', summary: 'Premium synthetic leather re-trim with perforation.', image: seed(14) },

  // Nissan
  { id: 'nissan-caravan-set', brand: 'Nissan', name: 'Caravan E25 Seat Set', category: 'Seat Set', summary: 'Imported set with belt and rail fitment for Caravan E25.', image: seed(21) },
  { id: 'nissan-vanette-roof', brand: 'Nissan', name: 'Vanette Roof Lining', category: 'Roof Lining', summary: 'Re-skinned headliner with climate-grade adhesive.', image: seed(22) },
  { id: 'nissan-leaf-cushion', brand: 'Nissan', name: 'Leaf Cushion Refresh', category: 'Cushion', summary: 'Foam refresh and seat cover replacement.', image: seed(23) },

  // Suzuki
  { id: 'suzuki-every-set', brand: 'Suzuki', name: 'Every Wagon Seat Set', category: 'Seat Set', summary: 'Compact van set with rear bench restoration.', image: seed(31) },
  { id: 'suzuki-wagonr-cushion', brand: 'Suzuki', name: 'Wagon R Cushion Set', category: 'Cushion', summary: 'Driver bolster and base foam rebuild.', image: seed(32) },
  { id: 'suzuki-alto-carpet', brand: 'Suzuki', name: 'Alto Floor Carpet', category: 'Carpet', summary: 'Cut-to-fit carpet with sound underlay.', image: seed(33) },

  // Mitsubishi
  { id: 'mitsubishi-delica-set', brand: 'Mitsubishi', name: 'Delica Seat Set', category: 'Seat Set', summary: 'Off-road grade Delica set with reinforced stitching.', image: seed(41) },
  { id: 'mitsubishi-lancer-leather', brand: 'Mitsubishi', name: 'Lancer Leather Re-trim', category: 'Cushion', summary: 'Two-tone leather re-trim with contrast stitch.', image: seed(42) },

  // Honda
  { id: 'honda-vezel-cushion', brand: 'Honda', name: 'Vezel Cushion Rebuild', category: 'Cushion', summary: 'Front cushion and bolster rebuild.', image: seed(51) },
  { id: 'honda-fit-door', brand: 'Honda', name: 'Fit Door Panel Re-skin', category: 'Door Panel', summary: 'Re-skinned door cards in factory texture.', image: seed(52) },
  { id: 'honda-stepwgn-set', brand: 'Honda', name: 'StepWGN Seat Set', category: 'Seat Set', summary: 'Three-row family van set, fully fitted.', image: seed(53) },

  // Mazda
  { id: 'mazda-bongo-set', brand: 'Mazda', name: 'Bongo Seat Set', category: 'Seat Set', summary: 'Workhorse van set with hard-wearing fabric.', image: seed(61) },
  { id: 'mazda-axela-leather', brand: 'Mazda', name: 'Axela Leather Re-trim', category: 'Cushion', summary: 'Premium leather re-trim with edge binding.', image: seed(62) },

  // Isuzu
  { id: 'isuzu-elf-cushion', brand: 'Isuzu', name: 'Elf Driver Cushion', category: 'Cushion', summary: 'Heavy-duty driver cushion for goods truck use.', image: seed(71) },
  { id: 'isuzu-elf-bench', brand: 'Isuzu', name: 'Elf Crew Bench Re-trim', category: 'Cushion', summary: 'Crew bench re-trim with reinforced stitching.', image: seed(72) },

  // Daihatsu
  { id: 'daihatsu-hijet-set', brand: 'Daihatsu', name: 'Hijet Seat Set', category: 'Seat Set', summary: 'Compact van set with bench refresh.', image: seed(81) },
  { id: 'daihatsu-mira-cushion', brand: 'Daihatsu', name: 'Mira Cushion Refresh', category: 'Cushion', summary: 'Foam and cover refresh for daily city driving.', image: seed(82) },
];

export const productsByBrand = (brand: Brand) =>
  products.filter((p) => p.brand === brand);

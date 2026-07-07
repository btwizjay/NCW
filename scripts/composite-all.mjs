// One-off: composite every colored brand logo onto a white 1500x1800 canvas,
// logo centered in the upper third, matching the existing Sanity cover framing
// so they drop into the catalogue cards via object-cover. Safe to delete.
import sharp from 'sharp';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const TMP = join(process.env.TEMP ?? process.env.TMP ?? '/tmp', 'ncw-color-logos');
const OUT = join(process.cwd(), 'public', 'brands', 'color');

const CW = 1500, CH = 1800, CENTER_Y = Math.round(CH * 0.32);
const MAX_W = 920, MAX_H = 540;

// out filename (matches brandColorLogos paths) -> source file in TMP
const jobs = [
  { out: 'daihatsu',  src: 'ds-daihatsu.png' },
  { out: 'honda',     src: 'ds-honda.png' },
  { out: 'isuzu',     src: 'ds-isuzu.png' },
  { out: 'jac',       src: 'ds-jac.png' },
  { out: 'mahindra',  src: 'ds-mahindra.png' },
  { out: 'mazda',     src: 'ds-mazda.png' },
  { out: 'mercedes',  src: 'ds-mercedes-benz.png' },
  { out: 'mitsubishi',src: 'ds-mitsubishi.png' },
  { out: 'nissan',    src: 'ds-nissan.png' },
  { out: 'suzuki',    src: 'ds-suzuki.png' },
  { out: 'toyota',    src: 'toyota.svg' },
];

for (const j of jobs) {
  const src = join(TMP, j.src);
  if (!existsSync(src)) { console.log(`skip ${j.out} (no ${j.src})`); continue; }
  const isSvg = j.src.endsWith('.svg');
  const logo = await sharp(src, isSvg ? { density: 384 } : {})
    .resize({ width: MAX_W, height: MAX_H, fit: 'inside' })
    .png()
    .toBuffer();
  const m = await sharp(logo).metadata();
  const left = Math.round((CW - m.width) / 2);
  const top = Math.round(CENTER_Y - m.height / 2);
  await sharp({ create: { width: CW, height: CH, channels: 4, background: '#ffffff' } })
    .composite([{ input: logo, left, top }])
    .png()
    .toFile(join(OUT, `${j.out}.png`));
  console.log(`saved ${j.out}.png  ${m.width}x${m.height}`);
}

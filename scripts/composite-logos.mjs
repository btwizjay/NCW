// One-off helper: rasterize the colored brand SVGs (downloaded to TEMP) and
// composite each onto a white 1500x1800 canvas with the logo centered in the
// upper third — matching the framing of the existing Sanity brand cover images
// so they drop straight into the catalogue cards (object-cover). Safe to delete.
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const TMP = join(process.env.TEMP ?? process.env.TMP ?? '/tmp', 'ncw-color-logos');
const OUT = join(process.cwd(), 'public', 'brands', 'color');

const CANVAS_W = 1500;
const CANVAS_H = 1800;
const CENTER_Y = Math.round(CANVAS_H * 0.32);

const logos = [
  { name: 'bmw', maxW: 560, maxH: 560 },
  { name: 'daihatsu', maxW: 920, maxH: 520 },
  { name: 'ford', maxW: 820, maxH: 560 },
];

for (const l of logos) {
  const src = join(TMP, `${l.name}.svg`);
  if (!existsSync(src)) {
    console.log(`skip ${l.name} (no ${src})`);
    continue;
  }
  const logo = await sharp(src, { density: 384 })
    .resize({ width: l.maxW, height: l.maxH, fit: 'inside' })
    .png()
    .toBuffer();
  const meta = await sharp(logo).metadata();
  const left = Math.round((CANVAS_W - meta.width) / 2);
  const top = Math.round(CENTER_Y - meta.height / 2);

  await sharp({
    create: { width: CANVAS_W, height: CANVAS_H, channels: 4, background: '#ffffff' },
  })
    .composite([{ input: logo, left, top }])
    .png()
    .toFile(join(OUT, `${l.name}.png`));

  console.log(`saved ${l.name}.png  ${meta.width}x${meta.height} at ${left},${top}`);
}

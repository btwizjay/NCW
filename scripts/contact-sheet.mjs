// Temp: build a contact sheet of downloaded dataset logos to eyeball them.
import sharp from 'sharp';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

const TMP = join(process.env.TEMP ?? process.env.TMP ?? '/tmp', 'ncw-color-logos');
const slugs = ['daihatsu','honda','isuzu','jac','mahindra','mazda','mercedes-benz','mitsubishi','nissan','suzuki','toyota'];

const COLS = 4;
const TW = 360, TH = 240;
const rows = Math.ceil(slugs.length / COLS);
const W = COLS * TW, H = rows * TH;

const composites = [];
for (let i = 0; i < slugs.length; i++) {
  const p = join(TMP, `ds-${slugs[i]}.png`);
  if (!existsSync(p)) continue;
  const logo = await sharp(p).resize({ width: TW - 60, height: TH - 60, fit: 'inside' }).png().toBuffer();
  const m = await sharp(logo).metadata();
  const col = i % COLS, row = Math.floor(i / COLS);
  const left = col * TW + Math.round((TW - m.width) / 2);
  const top = row * TH + Math.round((TH - m.height) / 2);
  composites.push({ input: logo, left, top });
}

await sharp({ create: { width: W, height: H, channels: 4, background: '#c8c8c8' } })
  .composite(composites)
  .png()
  .toFile(join(TMP, 'contact-sheet.png'));

console.log('order:', slugs.join(', '));
console.log('sheet:', join(TMP, 'contact-sheet.png'));

// One-shot script. Run: `node scripts/compress-brand-images.mjs`
// Resizes every jpg in /public/brands to a max 1200px width and re-encodes
// with mozjpeg quality 82. Writes to a temp file then renames to avoid
// Windows file-locking issues with the source.

import sharp from 'sharp';
import { readdirSync, statSync, renameSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'public/brands';
const files = readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;

for (const f of files) {
  const src = join(dir, f);
  const tmp = join(dir, `.${f}.tmp`);
  const before = statSync(src).size;
  totalBefore += before;

  await sharp(src)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(tmp);

  const after = statSync(tmp).size;
  unlinkSync(src);
  renameSync(tmp, src);
  totalAfter += after;

  console.log(
    `${f.padEnd(20)} ${(before / 1024).toFixed(0).padStart(5)} KB → ${(after / 1024).toFixed(0).padStart(5)} KB`,
  );
}

console.log(
  `${'TOTAL'.padEnd(20)} ${(totalBefore / 1024).toFixed(0).padStart(5)} KB → ${(totalAfter / 1024).toFixed(0).padStart(5)} KB (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}% smaller)`,
);

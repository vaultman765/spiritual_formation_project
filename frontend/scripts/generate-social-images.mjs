// Generate padded 1200x630 JPEGs for social sharing
// Input folders (existing): public/images/arc_days, public/images/arc_whole
// Output folders: public/social/arc_days, public/social/arc_whole

import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../');

const SRC_DAYS   = path.join(ROOT, 'public/images/arc_days');
const SRC_ARCS   = path.join(ROOT, 'public/images/arc_whole');
const OUT_DAYS   = path.join(ROOT, 'public/images/social/arc_days');
const OUT_ARCS   = path.join(ROOT, 'public/images/social/arc_whole');

const WIDTH = 1200;
const HEIGHT = 630;
// pick background that fits your site; white tends to look clean on X
const BACKGROUND = { r: 255, g: 255, b: 255, alpha: 1 };

// ensure dirs
for (const d of [OUT_DAYS, OUT_ARCS]) fs.mkdirSync(d, { recursive: true });

async function processOne(srcFile, outFile) {
  try {
    const img = sharp(srcFile).rotate(); // auto-orient
    const resized = await img
      .resize(WIDTH, HEIGHT, { fit: 'contain', background: BACKGROUND })
      .jpeg({ quality: 85, chromaSubsampling: '4:4:4' })
      .toBuffer();
    await fs.promises.writeFile(outFile, resized);
    console.log('✓', path.relative(ROOT, outFile));
  } catch (e) {
    console.warn('✗', srcFile, e.message);
  }
}

async function run() {
  // arc_days: keep same filenames (e.g., arc_id_day_01.jpg)
  const dayFiles = await glob('**/*.{jpg,jpeg,png,webp}', { cwd: SRC_DAYS, nodir: true });
  for (const f of dayFiles) {
    const src = path.join(SRC_DAYS, f);
    const out = path.join(OUT_DAYS, path.basename(f).replace(/\.(png|webp)$/i, '.jpg'));
    await processOne(src, out);
  }

  // arc_whole: keep same filenames (e.g., arc_id.jpg)
  const arcFiles = await glob('**/*.{jpg,jpeg,png,webp}', { cwd: SRC_ARCS, nodir: true });
  for (const f of arcFiles) {
    const src = path.join(SRC_ARCS, f);
    const out = path.join(OUT_ARCS, path.basename(f).replace(/\.(png|webp)$/i, '.jpg'));
    await processOne(src, out);
  }
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});

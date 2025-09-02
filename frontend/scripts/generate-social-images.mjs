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

for (const d of [OUT_DAYS, OUT_ARCS]) fs.mkdirSync(d, { recursive: true });

async function processOne(srcFile, outFile) {
  try {
    const input = sharp(srcFile).rotate(); // auto-orient

    // Background = blurred + darkened cover
    const background = await input
      .clone()
      .resize(WIDTH, HEIGHT, { fit: 'cover' })
      .blur(50)
      .modulate({ brightness: 0.6 }) // darken slightly
      .toBuffer();

    // Foreground = fit inside with transparent padding
    const foreground = await input
      .clone()
      .resize(WIDTH, HEIGHT, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    // Composite
    await sharp(background)
      .composite([{ input: foreground, gravity: 'center' }])
      .jpeg({ quality: 85, chromaSubsampling: '4:4:4' })
      .toFile(outFile);

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

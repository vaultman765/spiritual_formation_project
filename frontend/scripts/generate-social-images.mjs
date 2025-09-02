// Generate consistent 1200x630 social images WITHOUT black bars.
// Strategy: blur the *interior crop* (ignores edge mats), then overlay a sharp "contain" image with a small white border.

import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.resolve(__dirname, '../');

const SRC_DAYS = path.join(ROOT, 'public/images/arc_days');
const SRC_ARCS = path.join(ROOT, 'public/images/arc_whole');

const OUT_DAYS = path.join(ROOT, 'public/images/social/arc_days');
const OUT_ARCS = path.join(ROOT, 'public/images/social/arc_whole');

const WIDTH  = 1200;
const HEIGHT = 630;

// overlay sizing (keep some canvas breathing room)
const FG_MAX_W = Math.round(WIDTH  * 0.92);
const FG_MAX_H = Math.round(HEIGHT * 0.92);

// thin white border around the foreground image
const BORDER = 14;

// how much of the edges to crop away before making the blurred bg (removes letterboxing/mats)
const EDGE_CROP_FRACTION = 0.07; // 7% each side
const BLUR_SIGMA = 45;

// ensure output dirs
for (const d of [OUT_DAYS, OUT_ARCS]) fs.mkdirSync(d, { recursive: true });

// util: write JPEG with good quality and no subsampling smear on text/edges
function toJpeg(bufOrSharp, q = 85) {
  return sharp(bufOrSharp).jpeg({ quality: q, chromaSubsampling: '4:4:4' }).toBuffer();
}

async function processOne(srcFile, outFile) {
  try {
    const base = sharp(srcFile).rotate(); // respect EXIF orientation
    const meta = await base.metadata();

    // If it's already 1200x630 JPEG without alpha, just copy through
    if (meta.width === WIDTH && meta.height === HEIGHT && !meta.hasAlpha && /\.jpe?g$/i.test(srcFile)) {
      await fs.promises.copyFile(srcFile, outFile);
      console.log('• passthrough', path.relative(ROOT, outFile));
      return;
    }

    // ---- BACKGROUND (blurred interior "cover") ----
    const left   = Math.max(0, Math.floor((meta.width  ?? 0)  * EDGE_CROP_FRACTION));
    const top    = Math.max(0, Math.floor((meta.height ?? 0)  * EDGE_CROP_FRACTION));
    const width  = Math.max(1, (meta.width  ?? 1) - left * 2);
    const height = Math.max(1, (meta.height ?? 1) - top * 2);

    const interior = base.clone().extract({ left, top, width, height });

    const bg = await interior
      .resize(WIDTH, HEIGHT, { fit: 'cover' }) // always fills the canvas
      .blur(BLUR_SIGMA)                        // heavy blur
      .modulate({ saturation: 1.08, brightness: 1.02 }) // tiny pop so it doesn’t look muddy
      .jpeg({ quality: 82 })                   // background can be slightly lower quality
      .toBuffer();

    // ---- FOREGROUND (crisp "contain" + white border) ----
    const fg = await base
      .clone()
      .resize(FG_MAX_W, FG_MAX_H, { fit: 'inside', withoutEnlargement: true })
      .extend({ top: BORDER, bottom: BORDER, left: BORDER, right: BORDER, background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .toBuffer();

    // ---- COMPOSITE ----
    const out = await sharp(bg)
      .composite([{ input: await toJpeg(fg, 90), gravity: 'center' }])
      .jpeg({ quality: 86, chromaSubsampling: '4:4:4' })
      .toBuffer();

    await fs.promises.writeFile(outFile, out);
    console.log('✓', path.relative(ROOT, outFile));
  } catch (e) {
    console.warn('✗', path.relative(ROOT, srcFile), e.message);
  }
}

async function runGroup(srcDir, outDir) {
  const files = await glob('**/*.{jpg,jpeg,png,webp}', { cwd: srcDir, nodir: true });
  for (const f of files) {
    const src = path.join(srcDir, f);
    const out = path.join(outDir, path.basename(f).replace(/\.(png|webp)$/i, '.jpg'));
    await processOne(src, out);
  }
}

async function run() {
  await runGroup(SRC_DAYS, OUT_DAYS);
  await runGroup(SRC_ARCS, OUT_ARCS);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

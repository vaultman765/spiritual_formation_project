// Optimize site images for performance (WebP + AVIF + resized JPG fallback)

import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../");

// Source folders (originals)
const SRC_FOLDERS = [
  path.join(ROOT, "public/images/arc_days"),
  path.join(ROOT, "public/images/arc_whole"),
];

// Output folder (optimized versions)
const OUT_DIR = path.join(ROOT, "public/images/site_images");

// Target widths for responsive images
const WIDTHS = [400, 800, 1200];

// Ensure output dir exists
fs.mkdirSync(OUT_DIR, { recursive: true });

async function optimizeImage(srcFile, relPath) {
  const baseName = path.basename(relPath, path.extname(relPath));
  const outDir = path.join(OUT_DIR, path.dirname(relPath));
  fs.mkdirSync(outDir, { recursive: true });

  const buffer = sharp(srcFile).rotate();

  for (const width of WIDTHS) {
    // WebP
    await buffer
      .resize(width, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(outDir, `${baseName}-${width}.webp`));

    // AVIF
    await buffer
      .resize(width, null, { fit: "inside", withoutEnlargement: true })
      .avif({ quality: 50 }) // lower quality for super compression
      .toFile(path.join(outDir, `${baseName}-${width}.avif`));

    // Optimized JPEG fallback
    await buffer
      .resize(width, null, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, chromaSubsampling: "4:4:4" })
      .toFile(path.join(outDir, `${baseName}-${width}.jpg`));
  }

  console.log("✓ optimized", relPath);
}

async function run() {
  for (const folder of SRC_FOLDERS) {
    const files = await glob("**/*.{jpg,jpeg,png}", { cwd: folder, nodir: true });

    for (const file of files) {
      const src = path.join(folder, file);
      const rel = path.relative(path.join(ROOT, "public/images"), src);
      await optimizeImage(src, rel);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

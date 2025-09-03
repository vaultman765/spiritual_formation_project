// Optimize site images for performance (WebP + AVIF + resized JPG fallback)
// Only reprocess if the source image changed (checksum-based cache)

import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";
import sharp from "sharp";
import crypto from "node:crypto";
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

// Cache file
const CACHE_FILE = path.join(ROOT, ".image-cache.json");

// Load existing cache
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  } catch {
    cache = {};
  }
}

// Ensure output dir exists
fs.mkdirSync(OUT_DIR, { recursive: true });

// Utility: compute checksum of a file
function fileChecksum(file) {
  const data = fs.readFileSync(file);
  return crypto.createHash("md5").update(data).digest("hex");
}

async function optimizeImage(srcFile, relPath) {
  const baseName = path.basename(relPath, path.extname(relPath));
  const outDir = path.join(OUT_DIR, path.dirname(relPath));
  fs.mkdirSync(outDir, { recursive: true });

  const checksum = fileChecksum(srcFile);

  // Skip if checksum matches cache
  if (cache[relPath] === checksum) {
    console.log("↷ skip (unchanged)", relPath);
    return;
  }

  // Otherwise, reprocess
  for (const width of WIDTHS) {
    // WebP
    await sharp(srcFile)
      .rotate()
      .resize(width, null, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(outDir, `${baseName}-${width}.webp`));

    // AVIF
    await sharp(srcFile)
      .rotate()
      .resize(width, null, { fit: "inside", withoutEnlargement: true })
      .avif({ quality: 50 })
      .toFile(path.join(outDir, `${baseName}-${width}.avif`));

    // JPEG fallback
    await sharp(srcFile)
      .rotate()
      .resize(width, null, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, chromaSubsampling: "4:4:4" })
      .toFile(path.join(outDir, `${baseName}-${width}.jpg`));
  }

  console.log("✓ optimized", relPath);

  // Update cache
  cache[relPath] = checksum;
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

  // Save updated cache
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

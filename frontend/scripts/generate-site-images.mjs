// Optimize site images for performance (WebP + AVIF + resized JPG fallback)

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

// Cache file in public/ so it always goes into dist + S3
const CACHE_FILE = path.join(ROOT, "public/.image-cache.json");

// Target widths for responsive images
const WIDTHS = [400, 800, 1200];

// Load cache if exists
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
  } catch {
    console.warn("⚠️ Failed to parse existing cache, starting fresh.");
  }
}

// Ensure output dir exists
fs.mkdirSync(OUT_DIR, { recursive: true });

function fileChecksum(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(fileBuffer).digest("hex");
}

async function optimizeImage(srcFile, relPath) {
  const baseName = path.basename(relPath, path.extname(relPath));
  const outDir = path.join(OUT_DIR, path.dirname(relPath));
  fs.mkdirSync(outDir, { recursive: true });

  const checksum = fileChecksum(srcFile);

  // Skip if checksum matches
  if (cache[relPath] === checksum) {
    console.log("• skipped (no change)", relPath);
    return;
  }

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
      .avif({ quality: 50 })
      .toFile(path.join(outDir, `${baseName}-${width}.avif`));

    // JPEG fallback
    await buffer
      .resize(width, null, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, progressive: true, chromaSubsampling: "4:4:4" })
      .toFile(path.join(outDir, `${baseName}-${width}.jpg`));
  }

  cache[relPath] = checksum;
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

  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  console.log("✓ wrote cache file", CACHE_FILE);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

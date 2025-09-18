import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import { readdir } from 'node:fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://www.catholicmentalprayer.com';
const API_URL = process.env.VITE_API_URL || 'https://api.catholicmentalprayer.com';


/**
 * Static routes that should always be indexed
 */
const STATIC_ROUTES = [
  { url: '/',                     changefreq: 'daily',   priority: 1.0 },
  { url: '/home',                 changefreq: 'daily',   priority: 0.9 },
  { url: '/explore',              changefreq: 'daily',   priority: 0.8 },
  { url: '/how-to-pray',          changefreq: 'monthly', priority: 0.7 },
  { url: '/how-to-pray/guide',    changefreq: 'monthly', priority: 0.7 },
  { url: '/start-journey',        changefreq: 'monthly', priority: 0.6 },
  { url: '/auth/login',           changefreq: 'yearly',  priority: 0.3 },
  { url: '/auth/register',        changefreq: 'yearly',  priority: 0.3 },
];

/**
 * Controls whether to fetch dynamic routes from the API
 */
const ENABLE_DYNAMIC = true;

async function fetchDynamicRoutes() {
  if (!ENABLE_DYNAMIC) return [];
  
  try {
    // Fetch all arcs for /arcs/:arcId routes
    const arcsResponse = await axios.get(`${API_URL}/api/arcs/`, { timeout: 15000 });
    const arcRoutes = arcsResponse.data.map(arc => ({
      url: `/arcs/${arc.arc_id}`,
      changefreq: 'weekly',
      priority: 0.7,
    }));

    // Fetch all arc days for /days/:arcId/:arcDayNumber routes
    const allDayRoutes = [];
    for (const arc of arcsResponse.data) {
      for (let day = 1; day <= arc.day_count; day++) {
        allDayRoutes.push({
          url: `/days/${arc.arc_id}/${day}`,
          changefreq: 'monthly',
          priority: 0.6,
        });
      }
    }

    return [...arcRoutes, ...allDayRoutes];
  } catch (err) {
    console.error('[sitemap] dynamic fetch failed:', err?.message || err);
    return [];
  }
}

async function getPublicAssetRoutes() {
  const docsDir = path.resolve(__dirname, '../public/docs');
  const arcWholeDir = path.resolve(__dirname, '../public/images/arc_whole');
  const arcDaysDir = path.resolve(__dirname, '../public/images/arc_days');

  const pdfs = (await readdir(docsDir)).filter(f => f.endsWith('.pdf')).map(file => ({
    url: `/docs/readings/${file}`,
    changefreq: 'weekly',
    priority: 0.3
  }));

  const arcImages = (await readdir(arcWholeDir)).filter(f => /\.(png|jpe?g)$/.test(f)).map(file => ({
    url: `/images/arc_whole/${file}`,
    changefreq: 'weekly',
    priority: 0.3
  }));

  const dayImages = (await readdir(arcDaysDir)).filter(f => /\.(png|jpe?g)$/.test(f)).map(file => ({
    url: `/images/arc_days/${file}`,
    changefreq: 'weekly',
    priority: 0.3
  }));

  return [...pdfs, ...arcImages, ...dayImages];
}

async function run() {
  const outPath = path.resolve(__dirname, '../dist/sitemap.xml');
  const smStream = new SitemapStream({ hostname: SITE_URL });
  const writeStream = createWriteStream(outPath);
  smStream.pipe(writeStream);

  // Add static routes
  for (const route of STATIC_ROUTES) {
    smStream.write(route);
  }

  // Add dynamic routes
  const dynamicRoutes = await fetchDynamicRoutes();
  for (const route of dynamicRoutes) {
    smStream.write(route);
  }

  // Add Public (docs and images) routes
  const assetRoutes = await getPublicAssetRoutes();
  for (const route of assetRoutes) {
    smStream.write(route);
  }

  smStream.end();
  await streamToPromise(smStream);

  console.log(`[sitemap] wrote ${outPath} with ${STATIC_ROUTES.length + dynamicRoutes.length + assetRoutes.length} URLs`);
}

run().catch(e => {
  console.error('[sitemap] fatal:', e);
  process.exit(1);
});

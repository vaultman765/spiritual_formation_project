import fs from "fs";
import path from "path";

const OUT_ROOT = path.join(process.cwd(), "public");
const cards = JSON.parse(fs.readFileSync("scripts/cards.config.json", "utf8"));

const tpl = ({ type, title, description, canonicalUrl, image, twitterHandle = "@RCMentalPrayer" }) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex,follow" />
<meta name="description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${canonicalUrl}" />

<meta property="og:type" content="${type}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${image}" />
<meta property="og:url" content="${canonicalUrl}" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="${twitterHandle}" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${image}" />
<meta name="twitter:url" content="${canonicalUrl}" />

<script>
(function () {
  var ua = (navigator.userAgent||"").toLowerCase();
  var isBot = /bot|facebookexternalhit|slackbot|twitterbot|linkedinbot|pinterest|embedly|quora|discordbot|whatsapp|telegram/i.test(ua);
  if (!isBot) { window.location.replace("${new URL(canonicalUrl).pathname}"); }
})();
</script>
<noscript><meta http-equiv="refresh" content="0; url=${canonicalUrl}" /></noscript>
<style>
  body{display:flex;min-height:100vh;align-items:center;justify-content:center;background:#2e1a49;color:#f5d7a4;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,sans-serif}
  a{color:#f5d7a4}
</style>
</head>
<body>
  <a href="${canonicalUrl}">Continue to ${escapeHtml(title)} →</a>
</body></html>`;

function escapeHtml(s){return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

for (const c of cards) {
  const dir = path.join(OUT_ROOT, c.slug.replace(/^\/+/,'').replace(/\/$/,'') , "card");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), tpl(c), "utf8");
  console.log("✓ wrote", path.join(dir, "index.html"));
}
console.log(`Done. Generated ${cards.length} card pages.`);

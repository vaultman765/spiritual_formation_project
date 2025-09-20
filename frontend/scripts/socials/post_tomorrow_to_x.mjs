// scripts/post_tomorrow_to_x.mjs
import "dotenv/config";
import { TwitterApi } from "twitter-api-v2";

// ----- Config (kept simple & environment-driven) -----
const SITE_URL = process.env.SITE_URL || "https://www.catholicmentalprayer.com";
const API_URL = process.env.API_URL || "https://api.catholicmentalprayer.com";
const UTM = "utm_source=x&utm_medium=social&utm_campaign=tomorrow_meditation";
const TZ = process.env.POST_TIMEZONE || "America/New_York";

// Build the same endpoints your frontend helpers call
const ENDPOINTS = {
  today: `${API_URL}/api/days/homepage/today/`,
  tomorrow: `${API_URL}/api/days/homepage/tomorrow/`,
};

function buildDayUrl(arc_id, arc_day_number) {
  return `${SITE_URL}/days/${arc_id}/${arc_day_number}`;
}

const INVITATIONS = [
  "🕯️ Quiet your heart. Open the Scriptures.",
  "📿 Begin tomorrow in silence and prayer.",
  "🌿 Let your soul rest in His Word.",
  "🙏 Set time aside for tomorrow’s reflection.",
  "🕊️ Let Scripture lead you into His presence.",
];

const invitation = INVITATIONS[Math.floor(Math.random() * INVITATIONS.length)];

// Keep to 280 characters (X limit)
function composeStatus({ day_title, arc_title, primary_reading_title, url }) {
  const text = `
Prepare for tomorrow’s featured meditation:
${day_title}
- from the meditation series: ${arc_title}

📖 Primary Reading:
${primary_reading_title}

${invitation}

${url}

#CatholicMeditation #MentalPrayer #CatholicFaith #DailyPrayer #CatholicTwitter
`;
  return text.trim();
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${url} => ${res.status}`);
  return res.json();
}

async function getTomorrowOrFallback() {
  try {
    const t = await fetchJson(ENDPOINTS.tomorrow);
    return { data: t, source: "tomorrow" };
  } catch (e) {
    console.warn("[autopost] tomorrow failed, falling back to today:", String(e));
    const t = await fetchJson(ENDPOINTS.today);
    return { data: t, source: "today" };
  }
}

async function postToX(text) {
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
  });
  const r = await client.v2.tweet(text);
  return r?.data?.id;
}

async function run() {
  console.log(`[autopost] start ${new Date().toLocaleString("en-US", { timeZone: TZ })} (${TZ})`);
  const { data, source } = await getTomorrowOrFallback();

  // Your API shape (from screenshot): arc_id, arc_day_number, arc_title, day_title, primary_reading (object or array)
  const url = buildDayUrl(data.arc_id, data.arc_day_number);
  const primaryTitle =
    Array.isArray(data.primary_reading) && data.primary_reading.length
      ? data.primary_reading[0]?.title || ""
      : typeof data.primary_reading === "object"
      ? data.primary_reading?.title || ""
      : "";

  const status = composeStatus({
    day_title: data.day_title,
    arc_title: data.arc_title,
    primary_reading_title: primaryTitle,
    url,
  });

  if (process.env.DRY_RUN === "1") {
    console.log(`[autopost] DRY_RUN on — source=${source} would post:\n${status}`);
    return;
  }

  const id = await postToX(status);
  console.log(`[autopost] posted (${source}) tweet id:`, id);
}

run().catch((e) => {
  console.error("[autopost] fatal:", e);
  process.exit(1);
});

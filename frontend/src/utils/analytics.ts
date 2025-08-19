// Minimal pageview tracker that POSTs to your Django API.
// - Anonymous visitorId persisted in localStorage
// - Optional userId if you have it (you can pass it in from your auth context)
// - Uses VITE_API_BASE_URL if set, else relative "/api"
import { PageviewPayload } from "@/utils/types"
import { getCSRFToken } from "@/utils/auth/tokens";

const csrfToken = getCSRFToken();

const headers = {
    "X-CSRFToken": csrfToken || "",
    "Content-Type": "application/json",
  };

const API_BASE = import.meta.env.VITE_API_URL;

function getOrCreateVisitorId(): string {
  const KEY = "sf_visitor_id";
  let vid = localStorage.getItem(KEY);
  if (!vid) {
    // lightweight uuid-ish
    vid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem(KEY, vid);
  }
  return vid;
}

export async function trackPageview(path: string, opts?: { title?: string; userId?: string | number | null }) {
  try {
    // Basic bot guard
    const ua = navigator.userAgent || "";
    if (/bot|crawler|spider|crawling/i.test(ua)) return;

    const payload: PageviewPayload = {
      type: "pageview",
      path,
      title: opts?.title ?? document.title,
      referrer: document.referrer || undefined,
      visitorId: getOrCreateVisitorId(),
      userId: opts?.userId ?? null,
      screen: { w: window.screen.width, h: window.screen.height },
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Use keepalive so it doesn’t get cancelled on navigation
    await fetch(`${API_BASE}/api/user-analytics/`, {
      method: "POST",
      headers: headers,
      credentials: "include",
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (error) {
    // swallow errors – analytics should never break the app
    console.error("Error tracking pageview:", error);
  }
}

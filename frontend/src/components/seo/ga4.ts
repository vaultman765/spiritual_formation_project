declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function loadGA4(measurementId: string) {
  if (!measurementId || typeof window === "undefined") return;

  if (typeof window.gtag === "function") return;

  // Inject GA4 script
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;

  // Attach config after script is loaded
  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: true, // ✅ let Google send the initial page view
    });

    console.log("[GA4] Loaded and configured");
  };

  document.head.appendChild(script);
}

// Optional helper for manual page tracking
export function trackPageviews(url: string, measurementId: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", measurementId, {
      page_path: url,
    });
  }
}

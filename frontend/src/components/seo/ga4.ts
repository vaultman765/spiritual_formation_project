// Add type declarations for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Load the GA4 script
export function loadGA4(measurementId: string) {
  if (!measurementId) return;

  if (typeof window !== "undefined") {
    // Add GA script tag
    const scriptTag = document.createElement("script");
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    scriptTag.async = true;
    document.head.appendChild(scriptTag);

    // Init window.gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }

    gtag("js", new Date());
    gtag("config", measurementId);
  }
}

// Track pageview manually
export function trackPageviews(url: string, measurementId: string) {
  if (!measurementId || typeof window.gtag !== "function") return;
  window.gtag("config", measurementId, {
    page_path: url,
  });
}
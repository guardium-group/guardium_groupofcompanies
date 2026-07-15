export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guardiumgroup.com";

// localStorage key recording the visitor's cookie-consent choice. Shared
// between the root layout's inline gtag bootstrap script and the
// CookieConsent component so both agree on the same key.
export const CONSENT_STORAGE_KEY = "ggc-cookie-consent";

// Communities served, as already listed on the About page. Shared by
// structured data (Organization/Service areaServed) so it can't drift from
// what's actually displayed.
export const SERVICE_AREA_CITIES = [
  "Edmonton",
  "Sherwood Park",
  "Spruce Grove",
  "Beaumont",
  "Devon",
  "Morinville",
  "Leduc",
];

// Fixed reference date for content that doesn't have real per-page change
// tracking (e.g. sitemap lastModified). Using a fixed date instead of
// `new Date()` avoids every route reporting an ever-changing "just modified"
// timestamp on every build, which crawlers learn to discount as noise.
// Update this when a meaningful, site-wide content change actually ships.
export const CONTENT_LAST_MODIFIED = new Date("2026-07-14");

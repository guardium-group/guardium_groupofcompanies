import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// PostHog: API host from env (e.g. https://us.i.posthog.com) plus its static
// assets host (https://us-assets.i.posthog.com) for the recorder/heatmap scripts.
function postHogHosts(): string[] {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST?.replace(/\/+$/, "");
  if (!host) return [];
  try {
    const url = new URL(host);
    const hosts = [url.origin];
    if (url.hostname.endsWith(".i.posthog.com")) {
      const region = url.hostname.split(".")[0];
      hosts.push(`https://${region}-assets.i.posthog.com`);
    }
    return hosts;
  } catch {
    return [];
  }
}

const posthog = postHogHosts();

const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' is needed for Next.js's inline bootstrap scripts on
  // statically generated pages (nonces would force dynamic rendering).
  // The host allowlist still blocks scripts from anywhere else.
  [
    "script-src 'self' 'unsafe-inline'",
    isDev ? "'unsafe-eval'" : "",
    "https://www.googletagmanager.com",
    "https://challenges.cloudflare.com",
    ...posthog,
  ].filter(Boolean).join(" "),
  [
    "connect-src 'self'",
    isDev ? "ws: wss:" : "",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://www.googletagmanager.com",
    "https://challenges.cloudflare.com",
    ...posthog,
  ].filter(Boolean).join(" "),
  "img-src 'self' data: blob: https://images.unsplash.com https://i.ytimg.com https://*.google-analytics.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "frame-src https://maps.google.com https://www.google.com https://challenges.cloudflare.com https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          // Starts short on purpose; raise to 31536000+ (and consider
          // includeSubDomains) once HTTPS is confirmed on every subdomain.
          { key: "Strict-Transport-Security", value: "max-age=86400" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

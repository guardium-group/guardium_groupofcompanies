"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

function initGtag(gaId: string): void {
  if (typeof window.gtag === "function") return;
  window.dataLayer = window.dataLayer || [];
  // gtag.js expects the real `arguments` object, not an array.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  // Page views are sent below on every route change, so turn off the
  // automatic one to avoid double-counting.
  window.gtag("config", gaId, { send_page_view: false });
}

/**
 * Loads Google Analytics only after the visitor accepts analytics cookies.
 * Nothing is requested from Google before that (or after a rejection).
 */
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const consent = useConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accepted = consent === "accepted";

  // Withdrawn after GA already loaded on this page: stop analytics storage.
  useEffect(() => {
    if (consent === "rejected" && typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "denied" });
    }
  }, [consent]);

  useEffect(() => {
    if (!accepted || !pathname) return;
    initGtag(gaId);
    window.gtag?.("consent", "update", { analytics_storage: "granted" });

    const search = searchParams.toString();
    window.gtag?.("event", "page_view", {
      page_path: search ? `${pathname}?${search}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [accepted, gaId, pathname, searchParams]);

  if (!accepted) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
      strategy="afterInteractive"
    />
  );
}

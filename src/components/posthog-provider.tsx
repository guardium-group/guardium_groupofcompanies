"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { CONSENT_CHANGE_EVENT, readConsent, type ConsentValue } from "@/lib/consent";

/**
 * PostHog is only initialised once the visitor accepts analytics cookies, so
 * no request reaches PostHog before consent (or after a rejection).
 */
function startPostHog(): void {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;

  if (!posthog.__loaded) {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false, // page views are captured manually (PostHogPageView)
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
      },
      capture_heatmaps: true,
    });
    // PostHogPageView skips views while PostHog isn't loaded, so record the
    // page the visitor accepted on.
    posthog.capture("$pageview", { $current_url: window.location.href });
  }
  posthog.opt_in_capturing();
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (readConsent() === "accepted") startPostHog();

    const onChange = (event: Event) => {
      const value = (event as CustomEvent<ConsentValue | null>).detail ?? null;
      if (value === "accepted") {
        startPostHog();
      } else if (posthog.__loaded) {
        posthog.opt_out_capturing();
      }
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

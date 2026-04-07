"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false, // we capture pageviews manually
      disable_session_recording: false,
      session_recording: {
        maskAllInputs: true,
      },
      capture_heatmaps: true,
      opt_out_capturing_by_default: true, // respect consent — opt in only after user accepts
    });

    // Restore consent for returning visitors who already accepted
    if (localStorage.getItem("ggc-cookie-consent") === "accepted") {
      posthog.opt_in_capturing();
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

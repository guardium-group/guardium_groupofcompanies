"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    // PostHog is only initialised after cookie consent (see PostHogProvider).
    if (pathname && posthog && posthog.__loaded) {
      let url = window.origin + pathname;
      const search = searchParams.toString();
      if (search) {
        url += `?${search}`;
      }
      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}

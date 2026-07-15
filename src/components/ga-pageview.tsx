"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// GA is initialized with `send_page_view: false` (see layout.tsx) so this is
// the ONLY thing that sends page_view events — without it, GA would only
// ever see each visitor's first page, since client-side route changes don't
// reload the gtag config script.
export function GAPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || typeof window.gtag !== "function") return;

    const search = searchParams.toString();
    const page_path = search ? `${pathname}?${search}` : pathname;

    window.gtag("event", "page_view", {
      page_path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

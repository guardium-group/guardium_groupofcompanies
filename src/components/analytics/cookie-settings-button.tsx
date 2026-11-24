"use client";

import { openConsentBanner } from "@/lib/consent";

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentBanner} className={className}>
      Cookie Settings
    </button>
  );
}

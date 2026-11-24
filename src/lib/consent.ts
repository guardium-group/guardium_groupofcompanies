import { useSyncExternalStore } from "react";
import { CONSENT_STORAGE_KEY } from "@/lib/site-config";

export type ConsentValue = "accepted" | "rejected";

/** Fired on window whenever the visitor's choice changes (detail: ConsentValue | null). */
export const CONSENT_CHANGE_EVENT = "ggc-consent-change";
/** Fired on window to reopen the cookie banner (e.g. from "Cookie settings"). */
export const CONSENT_OPEN_EVENT = "ggc-consent-open";

// localStorage can throw (blocked cookies, some private modes, sandboxed
// iframes), so every access is guarded. If it can't be written, the choice
// is kept in memory for the rest of this visit.
let memoryConsent: ConsentValue | null = null;

export function readConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "accepted" || value === "rejected") return value;
  } catch {
    // fall through to the in-memory value
  }
  return memoryConsent;
}

export function writeConsent(value: ConsentValue): void {
  memoryConsent = value;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Kept in memory for this visit.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }));
}

function subscribeConsent(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) callback();
  };
  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

/** Current consent choice; null on the server and before the visitor chooses. */
export function useConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribeConsent, readConsent, () => null);
}

export function openConsentBanner(): void {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

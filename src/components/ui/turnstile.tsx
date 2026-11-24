"use client";

import { useEffect, useRef } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: unknown) => void;
  onExpire?: () => void;
  /** Change this value to reset the widget and get a fresh token. */
  resetSignal?: number;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: (error: unknown) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Turnstile"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  resetSignal,
  theme = "light",
  size = "flexible",
  className,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Keep the latest callbacks without re-rendering the widget when the
  // parent passes new function identities.
  const callbacksRef = useRef({ onVerify, onError, onExpire });
  useEffect(() => {
    callbacksRef.current = { onVerify, onError, onExpire };
  });

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) {
          return;
        }
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => callbacksRef.current.onVerify(token),
          "error-callback": (error) => callbacksRef.current.onError?.(error),
          "expired-callback": () => callbacksRef.current.onExpire?.(),
          theme,
          size,
        });
      })
      .catch((error) => {
        if (!cancelled) callbacksRef.current.onError?.(error);
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore cleanup errors
        }
      }
      widgetIdRef.current = null;
    };
  }, [siteKey, theme, size]);

  useEffect(() => {
    if (resetSignal === undefined || !widgetIdRef.current || !window.turnstile) return;
    try {
      window.turnstile.reset(widgetIdRef.current);
    } catch {
      // Ignore reset errors; the widget will be re-rendered on next mount
    }
  }, [resetSignal]);

  if (!siteKey) {
    return null;
  }

  return <div ref={containerRef} className={className} />;
}

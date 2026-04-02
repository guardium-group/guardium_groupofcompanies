"use client";

import { useEffect, useRef, useCallback } from "react";

interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: Error) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
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
          "error-callback"?: (error: Error) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

export function Turnstile({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = "light",
  size = "normal",
  className,
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const scriptLoadedRef = useRef(false);

  const renderWidget = useCallback(() => {
    if (!containerRef.current || !window.turnstile || widgetIdRef.current) {
      return;
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onVerify,
        "error-callback": onError,
        "expired-callback": onExpire,
        theme,
        size,
      });
    } catch (error) {
      console.error("Turnstile render error:", error);
      onError?.(error instanceof Error ? error : new Error("Failed to render Turnstile"));
    }
  }, [siteKey, onVerify, onError, onExpire, theme, size]);

  useEffect(() => {
    // Skip if no site key (development mode)
    if (!siteKey) {
      console.warn("Turnstile: No site key provided");
      return;
    }

    // Check if script already loaded
    if (window.turnstile) {
      renderWidget();
      return;
    }

    // Check if script is loading
    const existingScript = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile"]'
    );

    if (existingScript) {
      // Wait for existing script to load
      window.onTurnstileLoad = renderWidget;
      return;
    }

    // Load the script
    if (!scriptLoadedRef.current) {
      scriptLoadedRef.current = true;

      window.onTurnstileLoad = renderWidget;

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore cleanup errors
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, renderWidget]);

  // If no site key, render nothing (allows form to work in dev)
  if (!siteKey) {
    return null;
  }

  return <div ref={containerRef} className={className} />;
}

/**
 * Verify Turnstile token on the server
 */
export async function verifyTurnstileToken(token: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.warn("Turnstile: No secret key configured, skipping verification");
    return { success: true };
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: data["error-codes"]?.join(", ") || "Verification failed",
    };
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return {
      success: false,
      error: "Verification service unavailable",
    };
  }
}

"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

/**
 * Auto-advancing index for carousels/rotators that respects WCAG 2.2.2:
 * - pauses while focus is inside the region, and (unless pauseOnHover is
 *   false) while the pointer is over it,
 * - can be paused/resumed by the user (`userPaused` / `toggleUserPaused`),
 * - pauses while the tab is hidden,
 * - doesn't autoplay at all for prefers-reduced-motion users,
 * - restarts the timer after any manual change, so a click isn't followed by
 *   an immediate jump.
 *
 * Spread `pauseHandlers` onto the rotating region's root element.
 */
export function useAutoplay(
  count: number,
  intervalMs: number,
  { pauseOnHover = true }: { pauseOnHover?: boolean } = {},
) {
  const [index, setIndexState] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [focused, setFocused] = useState(false);

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    () => document.hidden,
    () => false,
  );

  const paused = (pauseOnHover && hovered) || focused || hidden || reducedMotion || userPaused;
  const safeIndex = count > 0 ? index % count : 0;

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = window.setTimeout(() => {
      setIndexState((prev) => (prev + 1) % count);
    }, intervalMs);
    // Depends on safeIndex so every change (automatic or manual) starts a
    // fresh full interval.
    return () => window.clearTimeout(timer);
  }, [paused, count, intervalMs, safeIndex]);

  const setIndex = useCallback(
    (next: number | ((prev: number) => number)) => {
      setIndexState((prev) => {
        const value = typeof next === "function" ? next(prev) : next;
        return count > 0 ? ((value % count) + count) % count : 0;
      });
    },
    [count],
  );

  const pauseHandlers = {
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    // Only keyboard focus pauses: a mouse click on a dot also focuses it, and
    // shouldn't freeze the slideshow until the user clicks elsewhere.
    onFocusCapture: (event: React.FocusEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      try {
        if (target.matches(":focus-visible")) setFocused(true);
      } catch {
        setFocused(true);
      }
    },
    onBlurCapture: (event: React.FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        setFocused(false);
      }
    },
  };

  const toggleUserPaused = useCallback(() => setUserPaused((p) => !p), []);

  return {
    index: safeIndex,
    setIndex,
    paused,
    userPaused,
    reducedMotion,
    toggleUserPaused,
    pauseHandlers,
  };
}

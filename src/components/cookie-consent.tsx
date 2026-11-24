"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { Cookie } from "lucide-react";
import Link from "next/link";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";
import { CONSENT_OPEN_EVENT, readConsent, writeConsent } from "@/lib/consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const open = () => setVisible(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);

    let frame = 0;
    if (!readConsent()) {
      frame = requestAnimationFrame(open);
    }
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, open);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Google Analytics and PostHog listen for the change event and start/stop themselves.
  function accept() {
    writeConsent("accepted");
    setVisible(false);
  }

  function reject() {
    writeConsent("rejected");
    setVisible(false);
  }

  return (
    <LazyMotionProvider>
      <AnimatePresence>
        {visible && (
          <m.div
          role="dialog"
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          className="fixed bottom-4 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 bg-[#511010]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <Cookie className="h-4 w-4 text-[#511010]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">We use cookies</p>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                We use analytics cookies to improve your experience and understand site traffic.{" "}
                <Link href="/cookies" className="text-[#511010] hover:underline">
                  Cookie details
                </Link>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={reject}
              className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Reject Analytics
            </button>
            <button
              onClick={accept}
              className="flex-1 px-3 py-2 text-xs font-medium text-white bg-[#511010] rounded-lg hover:bg-[#6b1515] transition-colors cursor-pointer"
            >
              Accept All
            </button>
          </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotionProvider>
  );
}

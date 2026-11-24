"use client";

import * as m from "framer-motion/m";
import { usePathname } from "next/navigation";
import { LazyMotionProvider } from "@/components/motion/lazy-motion-provider";

export function MapSection() {
  const pathname = usePathname();

  // Edmonton office location - Guardium Group headquarters (14360 Yellowhead Trail, Edmonton, AB T5L 3C2)
  const mapEmbedUrl = "https://maps.google.com/maps?q=14360+Yellowhead+Trail,+Edmonton,+AB+T5L+3C2&output=embed";

  // The contact page already renders its own inline copy of this exact map —
  // skip the global one there to avoid showing it twice.
  if (pathname === "/contact") {
    return null;
  }

  return (
    <LazyMotionProvider>
      <m.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full"
        style={{ height: "450px" }}
      >
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Guardium Group Office Location"
          className="w-full h-full transition-all duration-500"
        />
      </m.section>
    </LazyMotionProvider>
  );
}

"use client";

import type { PropsWithChildren } from "react";
import { LazyMotion, MotionConfig } from "framer-motion";

const loadFeatures = () =>
  import("@/lib/motion-features").then(({ default: features }) => features);

export function LazyMotionProvider({ children }: PropsWithChildren) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

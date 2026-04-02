"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CTASlide {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
  ctaType?: "link" | "phone";
}

interface CTACarouselProps {
  slides?: CTASlide[];
  autoplayInterval?: number;
}

const defaultSlides: CTASlide[] = [
  {
    headline: "Need Immediate Assistance?",
    subtext: "Our team is available 24/7 to help you with any service inquiry.",
    ctaText: "Call Now",
    ctaLink: "tel:+17808097860",
    ctaType: "phone",
  },
  {
    headline: "Get a Free Quote Today",
    subtext: "No obligations. Quick response. Competitive pricing across all services.",
    ctaText: "Request Quote",
    ctaLink: "/contact",
    ctaType: "link",
  },
  {
    headline: "Partner With Industry Leaders",
    subtext: "Join thousands of satisfied customers who trust Guardium Group.",
    ctaText: "Get Started",
    ctaLink: "/contact",
    ctaType: "link",
  },
  {
    headline: "Explore Career Opportunities",
    subtext: "Join our growing team and build your future with us.",
    ctaText: "View Careers",
    ctaLink: "/careers",
    ctaType: "link",
  },
];

export function CTACarousel({
  slides = defaultSlides,
  autoplayInterval = 5000,
}: CTACarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [slides.length, autoplayInterval]);

  const currentSlide = slides[currentIndex];

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
        />
        {/* Dark blur overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black via-black/60 to-gray-900/70 backdrop-blur-xs" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-2 sm:space-y-2"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white tracking-tight">
                {currentSlide.headline}
              </h2>
              <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto">
                {currentSlide.subtext}
              </p>
              <div className="pt-2">
                {currentSlide.ctaType === "phone" ? (
                  <Button
                    size="lg"
                    className="rounded-full bg-blue-600 text-white hover:bg-white/90"
                    asChild
                  >
                    <a href={currentSlide.ctaLink}>
                      <Phone className="mr-2 h-4 w-4" />
                      {currentSlide.ctaText}
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="rounded-full bg-blue-600 text-white hover:bg-white/90"
                    asChild
                  >
                    <Link href={currentSlide.ctaLink}>
                      {currentSlide.ctaText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

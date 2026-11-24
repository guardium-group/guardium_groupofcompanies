"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import * as m from "framer-motion/m";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface Company {
  icon: LucideIcon;
  name: string;
  slug: string;
  description: string;
  href: string;
  color: string;
  image?: string;
}

interface CompaniesCarouselProps {
  companies: Company[];
  title?: string;
  highlightText?: string;
  subtitle?: string;
}

function getVisibleCards() {
  if (typeof window === "undefined") return 4;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 4;
}

function subscribeToViewport(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

export function CompaniesCarousel({
  companies,
  title = "Discover Our Diverse",
  highlightText = " Portfolio of Companies",
  subtitle = "Each company in the Guardium Group operates with the same commitment to excellence, integrity, and customer satisfaction across all industries",
}: CompaniesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const visibleCards = useSyncExternalStore(
    subscribeToViewport,
    getVisibleCards,
    () => 4,
  );

  const maxIndex = Math.max(0, companies.length - visibleCards);
  const renderedIndex = Math.min(currentIndex, maxIndex);

  useEffect(() => {
    surfaceRef.current?.setAttribute("data-hydrated", "true");
  }, []);

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, renderedIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(maxIndex, renderedIndex + 1));
  };

  // Calculate card width percentage based on visible cards
  const cardWidthPercent = 100 / visibleCards;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 text-gray-900 tracking-tight">
            {title} <span className="text-[#ce0000]">{highlightText}</span>
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto text-sm sm:text-[15px] leading-relaxed px-4">
            {subtitle}
          </p>
        </div>

        {/* Carousel */}
        <div
          ref={surfaceRef}
          data-testid="company-carousel-surface"
          data-current-index={renderedIndex}
          className="relative"
        >
          <div
            data-testid="company-carousel-swipe-region"
            className="overflow-hidden touch-pan-y"
            onPointerDown={(event) => {
              suppressClick.current = false;
              pointerStartX.current = event.clientX;
              // Don't capture yet: capturing on pointerdown retargets the
              // following click to this region, so taps/clicks on the
              // "Explore" links would never reach the <a>.
            }}
            onPointerMove={(event) => {
              const startX = pointerStartX.current;
              if (startX === null) return;
              if (
                Math.abs(event.clientX - startX) > 10 &&
                !event.currentTarget.hasPointerCapture(event.pointerId)
              ) {
                // A real horizontal drag: keep receiving events even if the
                // pointer leaves the carousel.
                event.currentTarget.setPointerCapture(event.pointerId);
              }
            }}
            onPointerUp={(event) => {
              const startX = pointerStartX.current;
              pointerStartX.current = null;
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              if (startX === null) return;
              const offset = event.clientX - startX;
              if (Math.abs(offset) <= 50) return;
              suppressClick.current = true;
              if (offset < 0) handleNext();
              else handlePrev();
            }}
            onPointerCancel={() => {
              pointerStartX.current = null;
            }}
            onClickCapture={(event) => {
              if (!suppressClick.current) return;
              event.preventDefault();
              event.stopPropagation();
              suppressClick.current = false;
            }}
          >
            <m.div
              data-testid="company-carousel-track"
              className="flex"
              animate={{ x: `-${renderedIndex * cardWidthPercent}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {companies.map((company) => (
                <div
                  key={company.name}
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${cardWidthPercent}%` }}
                >
                  <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-6">
                      {company.image ? (
                        <Image
                          src={company.image}
                          alt={company.name}
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full ${company.color} flex items-center justify-center`}>
                          <company.icon className="w-10 h-10 sm:w-12 sm:h-12 text-white/90" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-base sm:text-[17px] font-bold tracking-tight text-gray-900 mb-2">
                      {company.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed mb-4 flex-grow">
                      {company.description}
                    </p>

                    <Button asChild variant="default" size="sm" className="w-full group rounded-full text-sm">
                      <Link href={`/companies/${company.slug}`}>
                        Explore {company.name}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </m.div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-3 mt-8 sm:mt-10">
            <button
              onClick={handlePrev}
              disabled={renderedIndex === 0}
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>

            {/* Dots indicator for mobile */}
            <div className="flex items-center sm:hidden">
              {Array.from({ length: companies.length }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(Math.min(idx, maxIndex))}
                  className="p-2.5 flex items-center justify-center"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span
                    className={`block w-2 h-2 rounded-full transition-all ${
                      idx === renderedIndex ? "bg-primary w-4" : "bg-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={renderedIndex >= maxIndex}
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border border-primary bg-primary flex items-center justify-center text-white hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

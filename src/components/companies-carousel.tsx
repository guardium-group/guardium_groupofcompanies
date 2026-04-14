"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
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

export function CompaniesCarousel({
  companies,
  title = "Discover Our Diverse",
  highlightText = " Portfolio of Companies",
  subtitle = "Each company in the Guardium Group operates with the same commitment to excellence, integrity, and customer satisfaction across all industries",
}: CompaniesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  // Update visible cards based on screen size
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2); // Tablet: 2 cards
      } else {
        setVisibleCards(4); // Desktop: 4 cards
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  // Reset currentIndex when visibleCards changes to prevent overflow
  useEffect(() => {
    const maxIndex = Math.max(0, companies.length - visibleCards);
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [visibleCards, companies.length, currentIndex]);

  const maxIndex = Math.max(0, companies.length - visibleCards);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
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
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * cardWidthPercent}%` }}
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

                    {/* Learn More Button */}
                    <Button asChild variant="default" size="sm" className="w-full group rounded-full text-sm">
                      <Link href={`/companies/${company.slug}`}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-3 mt-8 sm:mt-10">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>

            {/* Dots indicator for mobile */}
            <div className="flex items-center gap-1.5 sm:hidden">
              {Array.from({ length: companies.length }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(Math.min(idx, maxIndex))}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? "bg-primary w-4" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
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

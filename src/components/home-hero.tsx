"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, Phone, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface HeroSlide {
  image: string;
  title: string;
  highlight: string;
  description: string;
}

interface HomeHeroProps {
  slides: HeroSlide[];
  intervalMs?: number;
  youtubeUrl?: string;
}

function GlassmorphicYouTubePlayer({ youtubeUrl }: { youtubeUrl: string }) {
  // Convert YouTube watch URL to embed URL
  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      const listId = urlObj.searchParams.get("list");

      let embedUrl = `https://www.youtube.com/embed/${videoId}`;
      const params = new URLSearchParams();

      if (listId) {
        params.set("list", listId);
      }
      params.set("rel", "0");
      params.set("modestbranding", "1");

      return `${embedUrl}?${params.toString()}`;
    } catch {
      return url;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" as const }}
      className="absolute bottom-8 right-8 z-20 hidden lg:block"
    >
      {/* Glassmorphism Container */}
      <div className="relative rounded-xl overflow-hidden backdrop-blur-xl bg-white/10 border border-gray-500/10 shadow-3xl">
        {/* YouTube Embed Container */}
        <div className="relative lg:w-100 xl:h-50 w-80 h-40 overflow-hidden rounded-t-xl">
          <iframe
            src={getEmbedUrl(youtubeUrl)}
            title="Guardium Group YouTube Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0 text-sm"
          />
        </div>

        {/* Label Bar */}
        <div className="px-4 py-3 flex items-center justify-between bg-black">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-white" fill="white" />
            <span className="text-xs text-white/80 font-sm">
              Featured Playlist
            </span>
          </div>
          <div className="text-xs text-white/80 font-sm">Guardium Group</div>
        </div>

        {/* iOS-style Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-26 h-1 rounded-full bg-white/30" />
      </div>
    </motion.div>
  );
}

export function HomeHero({
  slides,
  intervalMs = 5500,
  youtubeUrl,
}: HomeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [slides.length, intervalMs]);

  if (!slides.length) return null;
  const current = slides[activeIndex];

  return (
    <section className="relative min-h-[100svh] sm:min-h-[700px] md:min-h-[750px] xl:h-[775px] overflow-hidden text-white">
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <motion.div
            key={slide.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === activeIndex ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-black via-black/30 to-gray-900/20" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 h-full min-h-[100svh] sm:min-h-[650px] md:min-h-[700px] flex items-center">
        <div className="flex h-full w-full items-center pb-16 sm:pb-20 pt-24 sm:pt-28">
          <div className="max-w-7xl border-l-2 sm:border-l pl-4 sm:pl-8 border-white/50 pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.image}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              >
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[80px] font-display font-bold mb-2 sm:mb-1 leading-tight tracking-tight text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  {current.title}{" "}
                  <span className="text-white">{current.highlight}</span>
                </motion.h1>

                <motion.p
                  className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 max-w-4xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {current.description}
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Button
                    size="lg"
                    variant="default"
                    asChild
                    className="text-white hover:bg-white hover:text-primary font-medium w-full sm:w-auto rounded-full text-sm sm:text-base"
                  >
                    <Link href="/contact">
                      Discover All Industries{" "}
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white/40 bg-white/20 text-white hover:bg-white hover:text-gray-900 rounded-full backdrop-blur-sm text-sm sm:text-base"
                    asChild
                  >
                    <a href="tel:+17808097860">
                      <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      +1 780-809-7860
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Glassmorphic YouTube Player */}
      {youtubeUrl && <GlassmorphicYouTubePlayer youtubeUrl={youtubeUrl} />}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-20 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "w-8 sm:w-10 bg-white"
                  : "w-2 bg-white/30 hover:bg-white/50",
              )}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          className="w-5 h-7 rounded-full border border-white/80 flex items-start justify-center p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1 h-2 rounded-full bg-white/80" />
        </motion.div>
        <span className="text-xs text-white/70 font-medium tracking-widest">
          Scroll
        </span>
      </motion.div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Pause, Phone, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import * as m from "framer-motion/m";
import { useAutoplay } from "@/components/motion/use-autoplay";

function getYouTubeVideoId(url: string): string | null {
  try {
    return new URL(url).searchParams.get("v");
  } catch {
    return null;
  }
}

export interface HeroSlide {
  image: string;
  title: string;
  highlight: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  ctaExternal?: boolean;
}

interface HomeHeroProps {
  slides: HeroSlide[];
  intervalMs?: number;
  youtubeUrl?: string;
}

function GlassmorphicYouTubePlayer({ youtubeUrl }: { youtubeUrl: string }) {
  // Facade pattern: show a static thumbnail + play button and only load the
  // real YouTube iframe (and its ~1MB of player JS/CSS) once someone actually
  // asks to watch it, instead of eagerly loading it for every visitor.
  const [activated, setActivated] = useState(false);
  const videoId = getYouTubeVideoId(youtubeUrl);

  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const listId = urlObj.searchParams.get("list");

      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
      const params = new URLSearchParams();

      if (listId) {
        params.set("list", listId);
      }
      params.set("rel", "0");
      params.set("modestbranding", "1");
      params.set("autoplay", "1");

      return `${embedUrl}?${params.toString()}`;
    } catch {
      return url;
    }
  };

  // Without a video id there is nothing to embed (it would load /embed/null).
  if (!videoId) return null;

  return (
    <m.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" as const }}
      className="absolute bottom-8 right-8 z-20 hidden lg:block"
    >
      {/* Glassmorphism Container */}
      <div className="relative rounded-xl overflow-hidden backdrop-blur-xl bg-white/10 border border-gray-500/10 shadow-3xl">
        {/* YouTube Embed Container */}
        <div className="relative lg:w-100 xl:h-56 w-80 h-40 overflow-hidden rounded-t-xl">
          {activated ? (
            <iframe
              src={getEmbedUrl(youtubeUrl)}
              title="Guardium Group YouTube Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 text-sm"
            />
          ) : (
            <button
              type="button"
              onClick={() => setActivated(true)}
              aria-label="Play Guardium Group video"
              className="group relative w-full h-full"
            >
              <Image
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt=""
                fill
                sizes="400px"
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-primary ml-0.5" fill="currentColor" />
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </m.div>
  );
}

export function HomeHero({
  slides,
  intervalMs = 5500,
  youtubeUrl,
}: HomeHeroProps) {
  const {
    index: activeIndex,
    setIndex: setActiveIndex,
    pauseHandlers,
    userPaused,
    reducedMotion,
    toggleUserPaused,
  } = useAutoplay(slides.length, intervalMs, { pauseOnHover: false });

  if (!slides.length) return null;
  const current = slides[activeIndex];
  const ctaText = current.ctaText ?? "Discover All Industries";
  const ctaLink = current.ctaLink ?? "/contact";
  const ctaExternal = current.ctaExternal ?? false;

  return (
    <section
      className="relative min-h-svh sm:min-h-[700px] md:min-h-[750px] xl:h-[825px] overflow-hidden text-white"
      aria-roledescription="carousel"
      {...pauseHandlers}
    >
      {/* Background Images with Crossfade */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <m.div
            key={slide.image}
            // initial={false}: server-render the first slide already visible
            // instead of waiting for the motion bundle to fade it in (LCP).
            initial={false}
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
          </m.div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-black via-black/40 to-gray-900/20" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 h-full min-h-svh sm:min-h-[650px] md:min-h-[700px] flex items-center">
        <div className="flex h-full w-full items-center pb-16 sm:pb-20 pt-24 sm:pt-28">
          <div className="max-w-7xl border-l-2 sm:border-l pl-4 sm:pl-8 border-white/50 pb-4">
            {/* initial={false}: the first headline is visible on first paint;
                later slides still animate in. */}
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={current.image}
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" as const }}
              >
                <m.h1
                  className="text-5xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-[70px] font-display font-bold mb-4  leading-none tracking-tight text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  {current.title}{" "}
                  <span className="text-white">{current.highlight}</span>
                </m.h1>

                <m.p
                  className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 max-w-4xl font-medium leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {current.description}
                </m.p>

                <m.div
                  data-hero-cta="true"
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Button
                    size="lg"
                    variant="default"
                    asChild
                    className="bg-primary text-primary-foreground hover:bg-[#511010] hover:text-primary-foreground font-medium w-full sm:w-auto rounded-full text-sm sm:text-base"
                  >
                    {ctaExternal ? (
                      <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                        {ctaText}{" "}
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </a>
                    ) : (
                      <Link href={ctaLink}>
                        {ctaText}{" "}
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                      </Link>
                    )}
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
                </m.div>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Glassmorphic YouTube Player */}
      {youtubeUrl && <GlassmorphicYouTubePlayer youtubeUrl={youtubeUrl} />}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-20 flex items-center">
          {!reducedMotion && (
            <button
              type="button"
              onClick={toggleUserPaused}
              aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
              aria-pressed={userPaused}
              className="p-2.5 mr-1 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              {userPaused ? (
                <Play className="h-3.5 w-3.5" fill="currentColor" />
              ) : (
                <Pause className="h-3.5 w-3.5" fill="currentColor" />
              )}
            </button>
          )}
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              className="group p-2.5 flex items-center justify-center"
            >
              <span
                className={cn(
                  "h-1 rounded-full transition-all duration-300 block",
                  index === activeIndex
                    ? "w-8 sm:w-10 bg-white"
                    : "w-2 bg-white/30 group-hover:bg-white/50",
                )}
              />
            </button>
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <m.div
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <m.div
          className="w-5 h-7 rounded-full border border-white/90 flex items-start justify-center p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1 h-2 rounded-full bg-white/90" />
        </m.div>
        <span className="text-xs text-white/90 font-bold tracking-widest">
          Scroll
        </span>
      </m.div>
    </section>
  );
}

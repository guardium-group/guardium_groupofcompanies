"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SITE_URL } from "@/lib/site-config";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbHeroProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  image?: string;
}

export function BreadcrumbHero({
  title,
  breadcrumbs,
  image = "/images/hero/heroBg2.png",
}: BreadcrumbHeroProps) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
    <script type="application/ld+json">
      {JSON.stringify(breadcrumbJsonLd)}
    </script>
    <section className="relative h-[280px] sm:h-[300px] md:h-[340px] lg:h-[380px] overflow-hidden mt-28">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover scale-105"
          priority
        />
        {/* Gradient Overlay - dark at top for navbar blend, fades down */}
        <div className="absolute inset-0 bg-linear-to-br backdrop-blur-md from-black/70  to-black/60" />
      </div>

      {/* Content Container - Bottom Left Stack */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 sm:px-10 md:px-16 lg:px-20 pb-10 sm:pb-10 md:pb-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-2 sm:mb-3 "
        >
          <ol className="flex items-center gap-2 text-xs sm:text-xs  max-w-fit">
            {breadcrumbs.map((item, index) => (
              <li key={item.label} className="flex items-center gap-2 ">
                {index > 0 && (
                  <svg
                    className="w-3.5 h-3.5 text-white/20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-white/90 hover:text-white transition-colors duration-200 uppercase tracking-widest font-light"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-white uppercase tracking-widest font-medium">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </motion.nav>

        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-display font-bold text-white tracking-normal"
        >
          {title}
        </motion.h1>


      </div>
    </section>
    </>
  );
}

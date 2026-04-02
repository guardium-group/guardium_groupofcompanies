"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeaturedCompanyProps {
  backgroundImage: string;
  logo?: string;
  sectionLabel?: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  features: Feature[];
  reversed?: boolean;
  tagline?: string;
}

export function FeaturedCompany({
  backgroundImage,
  sectionLabel = "Who we are",
  heading,
  description,
  ctaText,
  ctaLink,
  features,
  reversed = false,
  tagline,
}: FeaturedCompanyProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Main Card Container */}
        <div className="bg-white rounded-[32px] py-4 px-4 sm:py-6 sm:px-10 lg:py-10 lg:px-14 ">
          <div className={`flex flex-col ${reversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-16 lg:gap-16 items-stretch`}>

            {/* Left Content */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center">
              {/* Section Label */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className=" bg-orange-500/20 text-orange-500 font-semibold text-sm mb-3 rounded-full py-2 px-4 w-fit text-center"
              >
                {sectionLabel}
              </motion.p>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[28px] sm:text-[36px] lg:text-[42px] font-bold text-gray-900 leading-[1.15] tracking-tight mb-8 lg:mb-10"
              >
                {heading}
              </motion.h2>

              {/* Feature Cards */}
              <div className="space-y-3">
                {features.slice(0, 3).map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + index * 0.1 }}
                    className="bg-[#f7f7f7]/30 rounded-2xl border border-orange-200/50 p-3 sm:p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="shrink-0">
                        <feature.icon
                          className="w-6 h-6 sm:w-6 sm:h-6 text-orange-500"
                          strokeWidth={1.5}
                        />
                      </div>
                      <p className="text-gray-700 text-sm sm:text-[15px] leading-snug font-medium">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-[50%] relative"
            >
              {/* Image */}
              <div className="relative h-[350px] sm:h-[450px]  lg:h-full lg:min-h-[480px] rounded-2xl lg:rounded-3xl overflow-hidden">
                <Image
                  src={backgroundImage}
                  alt={heading}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-4 right-4 sm:bottom-6 sm:right-6 lg:-bottom-6 lg:right-8 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg w-[220px] sm:w-[250px]"
                >
                  {/* CTA Button */}
                  <a
                    href={ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-gray-800 text-white pl-4 pr-1.5 py-1.5 rounded-full text-sm font-medium transition-colors mb-3"
                  >
                    Visit Website
                    <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5 text-orange-600" />
                    </span>
                  </a>

                  {/* Tagline */}
                  <p className="text-gray-500 text-[13px] leading-relaxed">
                    {tagline || description}
                  </p>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

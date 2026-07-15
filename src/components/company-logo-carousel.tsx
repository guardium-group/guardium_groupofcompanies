"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Company {
  name: string;
  logo?: string;
  href?: string;
}

interface CompanyLogoCarouselProps {
  companies: Company[];
  title?: string;
  speed?: number;
}

function CompanyLogo({ company }: { company: Company }) {
  const [imgError, setImgError] = useState(false);

  const content =
    !company.logo || imgError ? (
      <div className="h-12 md:h-14 px-4 flex items-center justify-center">
        <span className="text-sm md:text-base font-semibold text-gray-700 whitespace-nowrap">
          {company.name}
        </span>
      </div>
    ) : (
      <Image
        src={company.logo}
        alt={company.name}
        width={160}
        height={48}
        className="h-10 md:h-14 w-auto object-contain"
        style={{ width: "auto" }}
        onError={() => setImgError(true)}
      />
    );

  if (company.href) {
    return (
      <Link
        href={company.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:scale-105 transition-transform duration-300"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export function CompanyLogoCarousel({
  companies,
  title = "Our Portfolio of Companies",
}: CompanyLogoCarouselProps) {
  // Double the companies for seamless infinite scroll
  const doubledCompanies = [...companies, ...companies];

  return (
    <section className="py-20 bg-white  overflow-hidden">
      <div className="container mx-auto px-4">
        {title && (
          <p className="text-center text-xs text-[#ce0000] mb-8 uppercase tracking-wider font-medium">
            {title}
          </p>
        )}
        <div className="relative overflow-hidden">
          {/* Gradient masks for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex animate-scroll hover:[animation-play-state:paused]">
            {doubledCompanies.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center px-8 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <CompanyLogo company={company} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu as MenuIcon,
  X,
  Megaphone,
  ArrowRight,
  Phone,
  Tag,
  Newspaper,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import { feedItems, type FeedItemType } from "@/lib/feed-items";
import { motion, AnimatePresence } from "framer-motion";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";

const FEED_ROTATE_INTERVAL_MS = 5000;

function getFeedIcon(type: FeedItemType) {
  switch (type) {
    case "announcement":
      return Megaphone;
    case "blog":
      return Newspaper;
    case "deal":
      return Tag;
    default:
      return Megaphone;
  }
}

function AnnouncementFeed() {
  const [index, setIndex] = useState(0);
  const item = feedItems[index];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % feedItems.length);
    }, FEED_ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const Icon = getFeedIcon(item.type);
  const isExternal = item.href.startsWith("tel:") || item.href.startsWith("http");
  const ctaLabel =
    item.type === "announcement"
      ? "Read announcement"
      : item.type === "blog"
        ? "Read article"
        : "View offer";

  const linkClass =
    "hidden sm:inline-flex drop-shadow-md items-center gap-1 font-medium text-gray-300 hover:text-white transition-colors";

  return (
    <div className="flex min-w-0 items-center lg:gap-2 gap-2">
      <Icon className="h-3.5 w-3.5 text-gray-300 shrink-0" />
      <AnimatePresence mode="wait">
        <motion.span
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="truncate tracking-tighter drop-shadow-2xl text-[12px] sm:text-sm  font-medium text-white"
        >
          {item.label}
        </motion.span>
      </AnimatePresence>
      {isExternal ? (
        <a href={item.href} className={linkClass}>
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      ) : (
        <Link href={item.href} className={linkClass}>
          {ctaLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

const companies = [
  { name: "Guardium Towing", href: "https://guardiumtowing.com", description: "24/7 Towing & Recovery" },
  { name: "Guardium Security", href: "https://guardiumsecurity.com", description: "Security Services" },
  { name: "Guardium Logistics", href: "https://guardiumlogistics.com", description: "Freight & Logistics" },
  { name: "Guardium Courier", href: "https://guardiumcourier.com", description: "Delivery Services" },
  { name: "Guardium Technologies", href: "https://guardiumtech.com", description: "Technology Solutions" },
  { name: "Guardium Property Services", href: "https://guardiumgc.com", description: "Property Management" },
  { name: "Guardium Staffing", href: "https://guardiumstaffing.com", description: "Staffing Solutions" },
  { name: "Guardium Consulting", href: "https://guardiumconsulting.com", description: "Business Consulting" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCompaniesOpen, setMobileCompaniesOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed announcement bar */}
      <div className="fixed top-0 inset-x-0 z-60 bg-linear-to-r from-blue-500 to-blue-600 backdrop-blur-2xl shadow-xs border-b border-blue-500 px-2">
        <div className="container mx-auto px-2 py-2 flex items-center justify-between gap-3 font-mono text-xs">
          <AnnouncementFeed />

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="https://www.facebook.com/guardiumgroup"
              target="_blank"
              rel="noreferrer"
              aria-label="Guardium Group on Facebook"
              className="text-white hover:text-primary transition-colors"
            >
              <FacebookIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.instagram.com/guardiumgroup"
              target="_blank"
              rel="noreferrer"
              aria-label="Guardium Group on Instagram"
              className="text-white hover:text-primary transition-colors"
            >
              <InstagramIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://x.com/guardiumgroup"
              target="_blank"
              rel="noreferrer"
              aria-label="Guardium Group on X"
              className="text-white hover:text-primary transition-colors"
            >
              <TwitterIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/company/guardium-group-of-companies/"
              target="_blank"
              rel="noreferrer"
              aria-label="Guardium Group on LinkedIn"
              className="text-white hover:text-primary transition-colors"
            >
              <LinkedinIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://youtube.com/@GuardiumGroup"
              target="_blank"
              rel="noreferrer"
              aria-label="Guardium Group on YouTube"
              className="text-white hover:text-primary transition-colors"
            >
              <YoutubeIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <motion.header
        className="fixed top-8 inset-x-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
      >
        <div className="container mx-auto px-4 py-4">
          <motion.div
            className={cn(
              "flex items-center justify-between border bg-white/95 backdrop-blur-xl rounded-full py-1.5 px-4 transition-all duration-300",
              scrolled ? "border-gray-200 shadow-lg" : "border-gray-100 shadow-sm"
            )}
          >
            {/* Logo */}
            <Link href="/" className="z-50">
              <Image
                src="/images/ggc_logo.png"
                alt="Guardium Group"
                width={140}
                height={50}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation - Aceternity Navbar */}
            <div className="hidden lg:block bg-none">
              <Menu setActive={setActive}>
                <Link href="/" className="text-gray-900 hover:text-primary font-medium transition-colors">
                  Home
                </Link>

                <Link href="/about" className="text-gray-900 hover:text-primary font-medium transition-colors">
                  About-Us
                </Link>

                <MenuItem setActive={setActive} active={active} item="Companies">
                  <div className="flex flex-col space-y-4 text-gray-900 font-mono text-sm">
                    <HoveredLink href="/companies">
                      <div className="flex flex-col pb-3 border-b border-gray-200">
                        <span className="font-bold text-primary">View All Companies</span>
                        <span className="text-xs text-gray-500">Explore our portfolio</span>
                      </div>
                    </HoveredLink>
                    {companies.map((company) => (
                      <HoveredLink key={company.href} href={company.href}>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 hover:text-primary">{company.name}</span>
                          <span className="text-xs text-gray-500">{company.description}</span>
                        </div>
                      </HoveredLink>
                    ))}
                  </div>
                </MenuItem>

                <Link href="/careers" className="text-gray-900 hover:text-primary font-medium transition-colors">
                  Careers
                </Link>

                <MenuItem setActive={setActive} active={active} item="Resources">
                  <div className="grid grid-cols-2 gap-12 text-sm text-gray-800 p-2">
                    <div className="flex flex-col space-y-2">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Company</p>
                      <HoveredLink href="/about">
                        <div className="flex items-center text-gray-700 gap-2">
                          <span className="hover:text-primary transition-colors">About Us</span>
                        </div>
                      </HoveredLink>
                      <HoveredLink href="/careers">
                        <div className="flex items-center text-gray-700 gap-2">
                          <span>Careers</span>
                        </div>
                      </HoveredLink>
                      <HoveredLink href="/contact">
                        <div className="flex items-center text-gray-700 gap-2">
                          <span>Contact</span>
                        </div>
                      </HoveredLink>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Featured</p>
                      <HoveredLink href="https://guardiumtowing.com">
                        <div className="flex items-center text-gray-700 gap-2">
                          <span>Guardium Towing</span>
                        </div>
                      </HoveredLink>
                      <HoveredLink href="https://guardiumsecurity.com">
                        <div className="flex items-center text-gray-700 gap-2">
                          <span>Guardium Security</span>
                        </div>
                      </HoveredLink>
                      <HoveredLink href="https://guardiumtech.com">
                        <div className="flex items-center text-gray-700 gap-2">
                          <span>Guardium Tech</span>
                        </div>
                      </HoveredLink>
                    </div>
                  </div>
                </MenuItem>
              </Menu>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="tel:+17808097860" className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Phone className="h-4 w-4" />
                +1 780-809-7860
              </a>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <MenuIcon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto"
            >
              <div className="container mx-auto px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
                <Link
                  href="/"
                  className="block py-2 text-gray-800 hover:text-primary font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="block py-2 text-gray-800 hover:text-primary font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>

                <div className="space-y-2">
                  <button
                    className="flex items-center justify-between w-full text-sm font-bold text-gray-500 uppercase tracking-wider py-1"
                    onClick={() => setMobileCompaniesOpen((v) => !v)}
                  >
                    Our Companies
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-200 ${mobileCompaniesOpen ? "rotate-90" : ""}`}
                    />
                  </button>
                  {mobileCompaniesOpen && (
                    <>
                      <Link
                        href="/companies"
                        className="block py-2 pl-4 text-primary font-semibold hover:text-primary/80 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        View All Companies
                      </Link>
                      {companies.map((company) => (
                        <a
                          key={company.name}
                          href={company.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block py-2 pl-4 text-gray-600 hover:text-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {company.name}
                        </a>
                      ))}
                    </>
                  )}
                </div>

                <Link
                  href="/careers"
                  className="block py-2 text-gray-800 hover:text-primary font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Careers
                </Link>

                <Link
                  href="/contact"
                  className="block py-2 text-gray-800 hover:text-primary font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <a href="tel:+17808097860" className="flex items-center gap-2 text-primary font-semibold">
                    <Phone className="h-5 w-5" />
                    +1 780-809-7860
                  </a>
                  <Button asChild className="w-full rounded-full">
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                      Get in Touch
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

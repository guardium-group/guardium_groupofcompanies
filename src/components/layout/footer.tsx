import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/ui/social-icons";

const companies = [
  { name: "Towing", href: "/companies/towing" },
  { name: "Security", href: "/companies/security" },
  { name: "Logistics", href: "/companies/logistics" },
  { name: "Courier", href: "/companies/courier" },
  { name: "Technologies", href: "/companies/technologies" },
  { name: "Property Services", href: "/companies/property-services" },
  { name: "Staffing", href: "/companies/staffing" },
  { name: "Consulting", href: "/companies/consulting" },
];

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/guardiumgroup", icon: FacebookIcon },
  { name: "Instagram", href: "https://www.instagram.com/guardium.group/", icon: InstagramIcon },
  { name: "Twitter", href: "https://x.com/group_guardium", icon: TwitterIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/guardium-group-of-companies/", icon: LinkedinIcon },
  { name: "YouTube", href: "https://youtube.com/@GuardiumGroup", icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="bg-[#511010] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 pt-10 sm:pt-12 md:pt-16 pb-8 sm:pb-10 md:pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6 text-center lg:text-left">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/ggc_logo.png"
                  alt="Guardium Group of Companies"
                  width={200}
                  height={70}
                  className="h-12 sm:h-14 w-auto brightness-0 invert mx-auto lg:mx-0"
                />
              </Link>

              <p className="text-white/70 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
                A diversified conglomerate delivering excellence across multiple industries.
                Building success together across Western Canada since 2009.
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-white hover:text-[#511010] transition-all duration-200"
                  >
                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                {/* Our Companies */}
                <div className="col-span-2">
                  <h4 className="text-white font-semibold mb-4 sm:mb-5 text-sm">
                    Our Companies
                  </h4>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-y-2.5">
                    {companies.map((company) => (
                      <li key={company.name}>
                        <Link
                          href={company.href}
                          className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group"
                        >
                          {company.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-white font-semibold mb-4 sm:mb-5 text-sm">
                    Company
                  </h4>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {quickLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white/60 hover:text-white text-sm transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="text-white font-semibold mb-4 sm:mb-5 text-sm">
                    Legal
                  </h4>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {legalLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-white/60 hover:text-white text-sm transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-5 sm:py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-10">
              <a
                href="tel:+17808097860"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+1 780-809-7860</span>
              </a>
              <a
                href="mailto:info@guardiumgroup.com"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>info@guardiumgroup.com</span>
              </a>
              <span className="flex items-center gap-2 text-white/60 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Unit 206, 4918 Roper Rd NW, Edmonton, AB T6B3T7</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-xs text-white/40 text-center sm:text-left">
              <p>
                &copy; {new Date().getFullYear()} Guardium Group of Companies. All rights reserved.
              </p>
              <p>
                Built by{" "}
                <Link
                  href="/companies/technologies"
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Guardium Technologies
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

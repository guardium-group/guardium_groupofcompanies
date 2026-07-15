"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Truck,
  Shield,
  Package,
  Cpu,
  Users,
  Briefcase,
  HardHat,
  ArrowRight,
  CheckCircle,
  Globe,
  Handshake,
} from "lucide-react";
import { motion } from "framer-motion";
import { HomeHero } from "@/components/home-hero";
import { CompanyLogoCarousel } from "@/components/company-logo-carousel";
import { CompaniesCarousel } from "@/components/companies-carousel";
import { FeaturedCompany } from "@/components/featured-company";
import { CTACarousel } from "@/components/cta-carousel";
import { Clock, Zap, Timer, Navigation, ShieldCheck } from "lucide-react";
import { companiesData } from "@/lib/companies-data";

const heroSlides = [
  {
    image: "/images/hero/cliffs-towing-edmonton-heroBg.jpg",
    title: "Big or Small,",
    highlight: "We Tow Them All",
    description:
      "For over 70 years, Cliff's Towing has been Edmonton's cornerstone of transport, recovery, and roadside assistance — fast, reliable, and available around the clock.",
    ctaText: "Visit Cliff's Towing",
    ctaLink: "https://cliffstowing.ca",
    ctaExternal: true,
  },
  {
    image: "/images/hero/cliffs-towing-heavyduty-edmonton-heroBg.jpg",
    title: "Heavy-Duty Recovery,",
    highlight: "Handled Right",
    description:
      "From tractor-trailers to industrial equipment, our heavy-duty fleet and experienced operators get Edmonton's biggest vehicles back on the road safely.",
    ctaText: "Visit Cliff's Towing",
    ctaLink: "https://cliffstowing.ca",
    ctaExternal: true,
  },
  {
    image: "/images/hero/guardium-security-edmonton-heroBg.jpg",
    title: "Protecting What",
    highlight: "Matters Most",
    description:
      "Guardium Security Services delivers professional guards, patrols, and surveillance solutions that keep your people, property, and assets safe.",
    ctaText: "Visit Guardium Security",
    ctaLink: "https://guardiumsecurity.com",
    ctaExternal: true,
  },
  {
    image: "/images/hero/guardium-property-services-mgt-edmonton-heroBg.jpg",
    title: "Property Management,",
    highlight: "Done Right",
    description:
      "Guardium Property Services offers comprehensive property management and general contracting, keeping your properties running smoothly and looking their best.",
    ctaText: "Visit Guardium Property Services",
    ctaLink: "https://guardiumgc.com",
    ctaExternal: true,
  },
  {
    image: "/images/hero/guardium-logistics-warehousing-edmonton-heroBg.jpg",
    title: "Logistics That",
    highlight: "Move Your Business",
    description:
      "Guardium Logistics delivers comprehensive warehousing and supply chain solutions, helping businesses of all sizes move product efficiently and reliably.",
    ctaText: "Visit Guardium Logistics",
    ctaLink: "https://guardiumlogistics.com",
    ctaExternal: true,
  },
];

// Per-file presentation only (icon/color aren't tracked in companies-data.ts,
// and differ intentionally from the shade used on the detail pages).
// name/description/href/image are derived from companies-data.ts below so
// this list can't drift from the canonical company info again.
const COMPANY_DISPLAY = [
  { slug: "towing", icon: Truck, color: "bg-red-500" },
  { slug: "security", icon: Shield, color: "bg-blue-500" },
  { slug: "logistics", icon: Package, color: "bg-green-500" },
  { slug: "courier", icon: Truck, color: "bg-orange-500" },
  { slug: "technologies", icon: Cpu, color: "bg-purple-500" },
  { slug: "property-services", icon: HardHat, color: "bg-yellow-500" },
  { slug: "staffing", icon: Users, color: "bg-teal-500" },
  { slug: "consulting", icon: Briefcase, color: "bg-indigo-500" },
] as const;

const companies = COMPANY_DISPLAY.map(({ slug, icon, color }) => ({
  icon,
  slug,
  color,
  name: companiesData[slug].name,
  description: companiesData[slug].description,
  href: companiesData[slug].href,
  image: companiesData[slug].image,
}));

const faqs = [
  {
    question: "What companies are part of Guardium Group?",
    answer: "Guardium Group includes Guardium Towing, Guardium Security, Guardium Logistics, Guardium Courier, Guardium Technologies, Guardium Property Services, Guardium Staffing, and Guardium Consulting.",
  },
  {
    question: "Where is Guardium Group located?",
    answer: "Guardium Group is headquartered in Edmonton, Alberta, Canada. Our various subsidiaries serve customers throughout Alberta and beyond.",
  },
  {
    question: "How can I work with Guardium Group?",
    answer: "You can contact us through our website or call us directly. We'll connect you with the appropriate subsidiary based on your needs.",
  },
  {
    question: "Are there career opportunities with Guardium Group?",
    answer: "Yes! We're always looking for talented individuals to join our team. Visit our Careers page to see current openings across all our companies.",
  },
  {
    question: "What makes Guardium Group different?",
    answer: "Our diversified approach allows us to offer integrated solutions across multiple industries. Our commitment to excellence, innovation, and customer service sets us apart.",
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export function HomeClient() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(faqJsonLd)}
      </script>
      {/* Hero Section */}
      <HomeHero
        slides={heroSlides}
        youtubeUrl="https://www.youtube.com/watch?v=k0UgtYF4Pow&list=PL2v8OoHhGVwDns-h15rEIyhAH1Yp8R8NX"
      />

      {/* Company Logo Carousel */}
      <CompanyLogoCarousel
        companies={[
          { name: "Guardium Towing", href: "https://guardiumtowing.com" },
          { name: "Guardium Security", logo: "/images/partners/security_logo.png", href: "https://guardiumsecurity.com" },
          { name: "Guardium Logistics", logo: "/images/partners/logistics_logo.png", href: "https://guardiumlogistics.com" },
          { name: "Guardium Courier", logo: "/images/partners/courier_logo.png", href: "https://guardiumcourier.com" },
          { name: "Guardium Technologies", logo: "/images/partners/tech_logo.png", href: "https://guardiumtech.com" },
          { name: "Guardium Property Services", logo: "/images/partners/gc_logo.png", href: "https://guardiumgc.com" },
          { name: "Guardium Staffing", href: "https://guardiumstaffing.com" },
          { name: "Guardium Consulting", href: "https://guardiumconsulting.com" },
        ]}
      />

      {/* Companies Carousel Section */}
      <CompaniesCarousel companies={companies} />

      {/* Why Choose Us */}
      <section className="py-20 lg:py-20 bg-[#511010] relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-10 lg:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {/* <span className="inline-block text-primary font-semibold text-sm mb-4 tracking-wide">
              Why Choose Us
            </span> */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-white mb-3">
              The Guardium Advantage
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Experience the difference of working with a trusted industry leader
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { icon: CheckCircle, title: "Proven Track Record", desc: "Years of excellence across all industries" },
              { icon: Users, title: "Expert Teams", desc: "Skilled professionals in every company" },
              { icon: Globe, title: "Local Presence", desc: "Deep roots in Alberta communities" },
              { icon: Handshake, title: "Customer Focus", desc: "Your success is our priority" },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeInUp} className="group bg-white/10 shadow-sm rounded-3xl py-8 px-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mt-0.5 group-hover:bg-white/30 transition-colors duration-300">
                    <item.icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Company - Cliff's Towing */}
      <FeaturedCompany
        backgroundImage="/images/hero-1.jpg"
        logo="/cliffs_logo.png"
        sectionLabel="Cliff's Towing"
        heading="Big or Small, We Tow them all"
        description="When the unexpected happens, count on us to tow you through. For over 70 years, Cliffs has been Edmonton’s cornerstone of transport, recovery, and towing services."
        tagline="Trusted towing partner serving the Edmonton area with fast, reliable service 24/7."
        ctaText="Contact Us"
        ctaLink="https://cliffstowing.ca"
        features={[
          {
            icon: Clock,
            title: "24/7 Availability",
            description: "Round-the-clock towing services whenever you need us, day or night.",
          },
          {
            icon: Zap,
            title: "Fast Response",
            description: "Quick dispatch and rapid arrival to get you moving again.",
          },
          {
            icon: Truck,
            title: "All Vehicle Types",
            description: "From motorcycles to heavy-duty trucks, we handle it all.",
          },
        ]}
      />



      {/* Featured Company - YEG Courier */}
      <FeaturedCompany
        backgroundImage="/images/featured/courier.png"
        sectionLabel="YEG Courier"
        heading="Edmonton's Go To Courier & Delivery Service"
        description="From urgent documents to large packages, we ensure your items arrive safely and on time."
        tagline="Premium courier and delivery services throughout the Edmonton area."
        ctaText="Contact Us"
        ctaLink="https://yegcourier.com"
        features={[
          {
            icon: Timer,
            title: "Same-Day Delivery",
            description: "Get your packages delivered the same day with our express service.",
          },
          {
            icon: Navigation,
            title: "Real-Time Tracking",
            description: "Track your delivery in real-time from pickup to drop-off.",
          },
          {
            icon: ShieldCheck,
            title: "Secure Handling",
            description: "Your packages are handled with care and fully insured.",
          },
        ]}
        reversed
      />




      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Badge variant="accent" className="mb-4">
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Got questions? We&apos;ve got answers. Contact us for anything else.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-gray-200">
                    <AccordionTrigger className="text-left text-gray-900 hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>

     {/* CTA Carousel */}
     <CTACarousel />
    </>
  );
}

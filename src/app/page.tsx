"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
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
  Building2,
  Star,
  CheckCircle,
  Globe,
  Award,
  TrendingUp,
  Handshake,
} from "lucide-react";
import { motion } from "framer-motion";
import { HomeHero } from "@/components/home-hero";
import { CompanyLogoCarousel } from "@/components/company-logo-carousel";
import { CompaniesCarousel } from "@/components/companies-carousel";
import { FeaturedCompany } from "@/components/featured-company";
import { CTACarousel } from "@/components/cta-carousel";
import { Clock, Zap, Timer, Navigation, ShieldCheck } from "lucide-react";

const heroSlides = [
  {
    image: "/images/hero/heroBg1.png",
    title: "Building Success",
    highlight: "Together",
    description:
      "Guardium Group is a diversified conglomerate delivering excellence across towing, security, logistics, technology, and more. Your trusted partner for integrated business solutions.",
  },
  {
    image: "/images/hero/heroBg2.png",
    title: "Diversified",
    highlight: "Excellence",
    description:
      "From emergency towing to enterprise technology solutions, our family of companies delivers exceptional service across multiple industries.",
  },
  {
    image: "/images/hero/heroBg3.png",
    title: "Your Partner in",
    highlight: "Growth",
    description:
      "With 8+ companies and 500+ employees, we provide comprehensive solutions tailored to your business needs across Western Canada.",
  },
];

const companies = [
  {
    icon: Truck,
    name: "Guardium Towing Ltd",
    slug: "towing",
    description: "24/7 towing and roadside assistance services across Edmonton and surrounding areas.",
    href: "https://guardiumtowing.com",
    color: "bg-red-500",
    image: "/companies/towing.png",
  },
  {
    icon: Shield,
    name: "Guardium Security Services",
    slug: "security",
    description: "Professional security services including guards, patrols, and surveillance solutions.",
    href: "https://guardiumsecurity.com",
    color: "bg-blue-500",
    image: "/companies/security.png",
  },
  {
    icon: Package,
    name: "Guardium Logistics",
    slug: "logistics",
    description: "Comprehensive warehousing and logistics solutions for businesses of all sizes.",
    href: "https://guardiumlogistics.com",
    color: "bg-green-500",
    image: "/companies/logistics.png",
  },
  {
    icon: Truck,
    name: "Guardium Courier Services",
    slug: "courier",
    description: "Fast and reliable courier and delivery services throughout Alberta.",
    href: "https://guardiumcourier.com",
    color: "bg-orange-500",
    image: "/companies/courier.png",
  },
  {
    icon: Cpu,
    name: "Guardium Technologies Ltd",
    slug: "technologies",
    description: "Innovative technology solutions including web development and IT services.",
    href: "https://guardiumtech.com",
    color: "bg-purple-500",
    image: "/companies/tech.png",
  },
  {
    icon: HardHat,
    name: "Guardium Property Services",
    slug: "property-services",
    description: "Property management and general contracting services.",
    href: "https://guardiumgc.com",
    color: "bg-yellow-500",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
  },
  {
    icon: Users,
    name: "Guardium Staffing Solutions",
    slug: "staffing",
    description: "Staffing solutions connecting businesses with qualified professionals.",
    href: "https://guardiumstaffing.com",
    color: "bg-teal-500",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80",
  },
  {
    icon: Briefcase,
    name: "Guardium Consulting Services",
    slug: "consulting",
    description: "Strategic business consulting to help companies grow and succeed.",
    href: "https://guardiumconsulting.com",
    color: "bg-indigo-500",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
  },
];

const values = [
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every service we provide, setting high standards across all our companies.",
  },
  {
    icon: Handshake,
    title: "Integrity",
    description: "We conduct business with honesty and transparency, building trust with our clients and partners.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We continuously innovate and adapt to meet the evolving needs of our customers and industries.",
  },
  {
    icon: Globe,
    title: "Community",
    description: "We are committed to giving back and making a positive impact in the communities we serve.",
  },
];

const testimonials = [
  {
    name: "James T.",
    company: "Local Business Owner",
    rating: 5,
    text: "Working with Guardium Group has been exceptional. Their professionalism across all their services is unmatched.",
  },
  {
    name: "Sarah M.",
    company: "Property Manager",
    rating: 5,
    text: "We use multiple Guardium services and the quality is consistently excellent. Highly recommend!",
  },
  {
    name: "Michael R.",
    company: "Logistics Company",
    rating: 5,
    text: "Guardium has been a reliable partner for years. Their diverse service offerings make them our go-to choice.",
  },
];

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

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HomeHero
        slides={heroSlides}
        youtubeUrl="https://www.youtube.com/watch?v=k0UgtYF4Pow&list=PL2v8OoHhGVwDns-h15rEIyhAH1Yp8R8NX"
      />

      {/* Company Logo Carousel */}
      <CompanyLogoCarousel
        companies={[
          // { name: "Guardium Towing", href: "https://guardiumtowing.com" },
          { name: "Guardium Security", logo: "/images/partners/security_logo.png", href: "https://guardiumsecurity.com" },
          { name: "Guardium Logistics", logo: "/images/partners/logistics_logo.png", href: "https://guardiumlogistics.com" },
          { name: "Guardium Courier", logo: "/images/partners/courier_logo.png", href: "https://guardiumcourier.com" },
          { name: "Guardium Technologies", logo: "/images/partners/tech_logo.png", href: "https://guardiumtech.com" },
          { name: "Guardium Property Services", logo: "/images/partners/gc_logo.png", href: "https://guardiumgc.com" },
          // { name: "Guardium Staffing", href: "https://guardiumstaffing.com" },
          // { name: "Guardium Consulting", href: "https://guardiumconsulting.com" },
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

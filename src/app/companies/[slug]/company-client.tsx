"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Quote,
  AlertTriangle,
  Anchor,
  Bike,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  Car,
  BarChart3,
  Clipboard,
  Clock,
  Cloud,
  Code2,
  Cpu,
  DollarSign,
  Eye,
  File,
  FileText,
  Globe,
  Hammer,
  Handshake,
  Heart,
  Home,
  Key,
  Link2,
  Map as MapIcon,
  Paintbrush,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  ShoppingBag,
  Smartphone,
  Store,
  Target,
  Thermometer,
  TrendingUp,
  Truck,
  User,
  UserPlus,
  Users,
  Warehouse,
  Weight,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BreadcrumbHero } from "@/components/breadcrumb-hero";
import { companiesData, allCompanySlugs } from "@/lib/companies-data";
import { SITE_URL, SERVICE_AREA_CITIES } from "@/lib/site-config";

// Maps the `icon` string on each service in companies-data.ts to its lucide
// component. Falls back to Zap for any name not listed here.
const SERVICE_ICONS: Record<string, LucideIcon> = {
  alert: AlertTriangle,
  anchor: Anchor,
  bike: Bike,
  briefcase: Briefcase,
  building: Building2,
  calendar: Calendar,
  camera: Camera,
  car: Car,
  chart: BarChart3,
  "check-circle": CheckCircle,
  clipboard: Clipboard,
  clock: Clock,
  cloud: Cloud,
  code: Code2,
  cpu: Cpu,
  dollar: DollarSign,
  eye: Eye,
  file: File,
  "file-text": FileText,
  globe: Globe,
  hammer: Hammer,
  handshake: Handshake,
  heart: Heart,
  home: Home,
  key: Key,
  link: Link2,
  map: MapIcon,
  paintbrush: Paintbrush,
  refresh: RefreshCw,
  search: Search,
  server: Server,
  settings: Settings,
  shield: Shield,
  shopping: ShoppingBag,
  smartphone: Smartphone,
  star: Star,
  store: Store,
  target: Target,
  thermometer: Thermometer,
  "trending-up": TrendingUp,
  truck: Truck,
  user: User,
  "user-plus": UserPlus,
  users: Users,
  warehouse: Warehouse,
  weight: Weight,
  wrench: Wrench,
  zap: Zap,
};

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export function CompanyClient({ slug }: { slug: string }) {
  const company = companiesData[slug];

  if (!company) {
    notFound();
  }

  // Related companies: rotate through the full list starting right after the
  // current one (wrapping around) rather than always taking a fixed prefix,
  // so every company eventually surfaces as a cross-sell somewhere on the site.
  const currentIndex = allCompanySlugs.indexOf(slug);
  const relatedCompanies = Array.from(
    { length: allCompanySlugs.length - 1 },
    (_, i) => allCompanySlugs[(currentIndex + 1 + i) % allCompanySlugs.length]
  )
    .slice(0, 4)
    .map((s) => ({ slug: s, ...companiesData[s] }));

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: company.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const servicesJsonLd = company.services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: service.title,
    description: service.description,
    url: `${SITE_URL}/companies/${slug}#services`,
    provider: {
      "@type": "Organization",
      name: company.name,
      url: company.href,
    },
    areaServed: SERVICE_AREA_CITIES.map((city) => ({ "@type": "City", name: city })),
  }));

  return (
    <main className="overflow-hidden">
      <script type="application/ld+json">
        {JSON.stringify(faqJsonLd)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(servicesJsonLd)}
      </script>
      {/* Breadcrumb Hero */}
      <BreadcrumbHero
        title={company.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Companies", href: "/companies" },
          { label: company.name },
        ]}
      />

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${company.colorLight} ${company.color.replace('bg-', 'text-')} mb-4`}>
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Solutions for Your Needs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a full range of services designed to meet your specific requirements and exceed your expectations.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {company.services.map((service, index) => {
              const ServiceIcon = SERVICE_ICONS[service.icon] ?? Zap;
              return (
              <motion.div key={service.title} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 border-gray-500 ">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 ${company.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <ServiceIcon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works / Process Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${company.colorLight} ${company.color.replace('bg-', 'text-')} mb-4`}>
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Simple Process, Exceptional Results
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Getting started is easy. Here&apos;s how we work together.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-6xl mx-auto">
            {company.process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className={`bg-white rounded-2xl p-6 h-full border-l-4 ${company.color.replace('bg-', 'border-')} shadow-sm hover:shadow-md transition-shadow`}>
                  {/* Step Number Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${company.colorLight} ${company.color.replace('bg-', 'text-')} font-bold text-lg`}>
                      {step.step}
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Benefits */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${company.colorLight} ${company.color.replace('bg-', 'text-')} mb-4`}>
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The {company.name.split(' ').slice(1).join(' ')} Difference
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                As part of the Guardium Group of Companies, we combine the strength of a diversified conglomerate with specialized expertise to deliver unmatched value.
              </p>

              <div className="space-y-6">
                {company.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className={`w-12 h-12 ${company.colorLight} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle className={`w-6 h-6 ${company.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={company.heroImage}
                  alt={company.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Floating Stats Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {company.stats.slice(0, 3).map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className={`text-2xl font-bold ${company.color.replace('bg-', 'text-')}`}>
                          {stat.value}{stat.suffix}
                        </div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-24 ${company.color}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-white/20 text-white mb-4">
              Customer Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about working with us.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {company.testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/10 backdrop-blur border-white/20 text-white">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-10 h-10 text-white/30 mb-4" />
                    <p className="text-white/90 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-white/70">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${company.colorLight} ${company.color.replace('bg-', 'text-')} mb-4`}>
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions? We've got answers. If you don't see what you're looking for, feel free to contact us directly.
              </p>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="font-semibold text-gray-900 mb-4">Still have questions?</h3>
                <p className="text-gray-600 mb-6">
                  Our team is here to help. Reach out and we'll get back to you as soon as possible.
                </p>
                <div className="space-y-3">
                  <a href={`tel:${company.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors">
                    <Phone className="w-5 h-5" />
                    {company.phone}
                  </a>
                  <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                    {company.email}
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {company.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="bg-gray-50 rounded-xl px-6 border-0">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src={company.heroImage} alt="" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Contact us today to learn how {company.name} can help you achieve your goals. Our team is standing by to answer your questions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className={`${company.color} hover:opacity-90 text-lg px-8`} asChild>
                <a href={`tel:${company.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  {company.phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8" asChild>
                <a href={company.href} target="_blank" rel="noreferrer">
                  Visit Website
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Companies / Cross-Sell */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              Guardium Group
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Other Companies
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {company.name} is part of the Guardium Group family. Discover our other trusted brands and services.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCompanies.map((related, index) => (
              <motion.div
                key={related.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/companies/${related.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold">{related.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {related.description}
                      </p>
                      <div className="mt-3 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Learn More <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/companies">
                View All Companies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

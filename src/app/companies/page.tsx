"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Truck,
  Shield,
  Package,
  Cpu,
  Users,
  Briefcase,
  HardHat,
  Building2,
  ExternalLink,
  Mail,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import { BreadcrumbHero } from "@/components/breadcrumb-hero";

const companies = [
  {
    icon: Truck,
    name: "Guardium Towing",
    tagline: "24/7 Towing & Roadside Assistance",
    description:
      "Providing reliable towing and roadside assistance services across Edmonton and surrounding areas. From light-duty to heavy-duty towing, we've got you covered around the clock.",
    services: ["Light-Duty Towing", "Heavy-Duty Towing", "Roadside Assistance", "Accident Recovery"],
    href: "https://guardiumtowing.com",
    color: "bg-red-500",
    gradientFrom: "from-red-500/20",
  },
  {
    icon: Shield,
    name: "Guardium Security",
    tagline: "Professional Security Solutions",
    description:
      "Comprehensive security services including trained security guards, mobile patrols, and surveillance solutions for businesses and events throughout Alberta.",
    services: ["Security Guards", "Mobile Patrols", "Event Security", "Surveillance"],
    href: "https://guardiumsecurity.com",
    color: "bg-blue-500",
    gradientFrom: "from-blue-500/20",
  },
  {
    icon: Package,
    name: "Guardium Logistics",
    tagline: "Freight & Supply Chain Solutions",
    description:
      "End-to-end logistics and freight solutions for businesses of all sizes. We handle your supply chain needs with precision and reliability.",
    services: ["Freight Transport", "Warehousing", "Supply Chain", "Distribution"],
    href: "https://guardiumlogistics.com",
    color: "bg-green-500",
    gradientFrom: "from-green-500/20",
  },
  {
    icon: Truck,
    name: "Guardium Courier",
    tagline: "Fast & Reliable Delivery",
    description:
      "Quick and dependable courier services for packages of all sizes. Same-day delivery available throughout the Edmonton metropolitan area.",
    services: ["Same-Day Delivery", "Express Shipping", "Package Handling", "Route Delivery"],
    href: "https://guardiumcourier.com",
    color: "bg-orange-500",
    gradientFrom: "from-orange-500/20",
  },
  {
    icon: Cpu,
    name: "Guardium Technologies",
    tagline: "Innovative Tech Solutions",
    description:
      "Cutting-edge technology solutions including web development, software engineering, and IT consulting to help businesses thrive in the digital age.",
    services: ["Web Development", "Software Solutions", "IT Consulting", "Digital Strategy"],
    href: "https://guardiumtech.com",
    color: "bg-purple-500",
    gradientFrom: "from-purple-500/20",
  },
  {
    icon: HardHat,
    name: "Guardium Property Services",
    tagline: "Property Management & Contracting",
    description:
      "Full-service property management and general contracting services for residential and commercial properties across Alberta.",
    services: ["Property Management", "General Contracting", "Maintenance", "Renovations"],
    href: "https://guardiumgc.com",
    color: "bg-yellow-500",
    gradientFrom: "from-yellow-500/20",
  },
  {
    icon: Users,
    name: "Guardium Staffing",
    tagline: "Workforce Solutions",
    description:
      "Connecting businesses with qualified professionals across various industries. From temporary placements to permanent hires, we find the right fit.",
    services: ["Temporary Staffing", "Permanent Placement", "Executive Search", "HR Consulting"],
    href: "https://guardiumstaffing.com",
    color: "bg-teal-500",
    gradientFrom: "from-teal-500/20",
  },
  {
    icon: Briefcase,
    name: "Guardium Consulting",
    tagline: "Strategic Business Advisory",
    description:
      "Expert business consulting services to help companies optimize operations, develop strategies, and achieve sustainable growth.",
    services: ["Business Strategy", "Operations Consulting", "Market Analysis", "Growth Planning"],
    href: "https://guardiumconsulting.com",
    color: "bg-indigo-500",
    gradientFrom: "from-indigo-500/20",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function CompaniesPage() {
  return (
    <>
      {/* Breadcrumb Hero */}
      <BreadcrumbHero
        title="Our Companies"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Companies" },
        ]}
      />

      {/* Stats Bar */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-wrap justify-center gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {[
              { value: "8+", label: "Companies" },
              { value: "500+", label: "Employees" },
              { value: "15+", label: "Years Combined Experience" },
              { value: "10K+", label: "Customers Served" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Companies Grid */}
      <section id="companies" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge variant="accent" className="mb-4">
              Portfolio
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900">
              Our Companies
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each company operates independently while benefiting from the shared
              resources and values of the Guardium Group.
            </p>
          </motion.div>

          <motion.div
            className="grid lg:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {companies.map((company) => (
              <motion.div key={company.name} variants={fadeInUp}>
                <Card className="h-full bg-white border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Icon Section */}
                      <div className={`${company.color} p-8 flex items-center justify-center md:w-40`}>
                        <company.icon className="h-12 w-12 text-white" />
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {company.name}
                            </h3>
                            <p className="text-sm text-primary font-medium">
                              {company.tagline}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                          {company.description}
                        </p>

                        {/* Services Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {company.services.map((service) => (
                            <span
                              key={service}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        {/* Action Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                          asChild
                        >
                          <a href={company.href} target="_blank" rel="noreferrer">
                            Visit Website
                            <ExternalLink className="ml-2 h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <Badge variant="accent" className="mb-4">
                Work With Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-gray-900">
                Partnership Opportunities
              </h2>
              <p className="text-gray-600 mb-6">
                Looking to partner with one or more of our companies? We&apos;re always
                open to exploring new business relationships and opportunities for
                collaboration.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Vendor and supplier partnerships",
                  "Strategic business alliances",
                  "Service integration opportunities",
                  "Joint venture possibilities",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-600">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/contact">
                  Discuss Partnership
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Quick Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href="tel:+17808097860"
                      className="font-medium text-gray-900 hover:text-primary transition-colors"
                    >
                      +1 780-809-7860
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href="mailto:partnerships@guardiumgroup.com"
                      className="font-medium text-gray-900 hover:text-primary transition-colors"
                    >
                      partnerships@guardiumgroup.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
              Join the Guardium Family
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              We&apos;re always looking for talented individuals to join our growing
              team across all our companies.
            </p>
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/careers">
                Explore Careers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}

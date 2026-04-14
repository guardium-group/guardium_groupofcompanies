"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Building2,
  Target,
  Eye,
  Heart,
  Users,
  Award,
  TrendingUp,
  Globe,
  Shield,
  Truck,
  Package,
  Cpu,
  Briefcase,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { BreadcrumbHero } from "@/components/breadcrumb-hero";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We pursue excellence in everything we do, setting high standards across all our companies.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We conduct business with honesty, transparency, and ethical practices.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We continuously seek new ways to improve and adapt to changing market needs.",
  },
  {
    icon: Globe,
    title: "Community",
    description: "We are committed to making a positive impact in the communities we serve.",
  },
  {
    icon: Users,
    title: "Teamwork",
    description: "We believe in collaboration and supporting each other to achieve common goals.",
  },
  {
    icon: Award,
    title: "Quality",
    description: "We deliver high-quality services that exceed customer expectations.",
  },
];

const stats = [
  { value: "8+", label: "Companies", description: "Under our umbrella" },
  { value: "500+", label: "Employees", description: "Across all divisions" },
  { value: "15+", label: "Years", description: "Of experience" },
  { value: "10K+", label: "Customers", description: "Served annually" },
];

const industries = [
  { icon: Shield, name: "Security", description: "Professional security services and solutions" },
  { icon: Package, name: "Logistics & Warehousing", description: "End-to-end supply chain solutions" },
  { icon: Truck, name: "Towing & Recovery", description: "24/7 roadside assistance and towing" },
  { icon: Cpu, name: "Technology & Robotics", description: "CCTV, access control, and IT solutions" },
  { icon: Users, name: "Staffing Solutions", description: "Connecting talent with opportunity" },
  { icon: Briefcase, name: "Consulting", description: "Strategic business advisory services" },
];

const serviceAreas = {
  local: ["Edmonton", "Sherwood Park", "Spruce Grove", "Beaumont", "Devon", "Morinville", "Leduc"],
  global: ["Canada", "United States", "United Kingdom", "India"],
};

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

export default function AboutPage() {
  return (
    <>
      {/* Breadcrumb Hero */}
      <BreadcrumbHero
        title="About Us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      {/* Who We Are Section */}
      {/* <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <span className="text-[#22c55e] font-semibold text-sm mb-3 block">
                Who We Are
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                A Diversified Group Building Success Together
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Guardium Group of Companies is a diversified conglomerate headquartered in Edmonton, Alberta.
                Since our founding, we have grown into a family of 8+ companies serving thousands of customers
                across multiple industries.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                From security services to logistics, from towing to technology solutions, we deliver
                excellence across every sector we operate in. Our commitment to quality, innovation,
                and customer satisfaction has made us a trusted partner for businesses and individuals alike.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/companies">
                    Explore Our Companies
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="Guardium Group Team"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      {/* <section className="py-16 bg-[#511010]">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white font-medium mb-1">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.description}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Mission & Vision */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            <motion.div
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To build a portfolio of exceptional companies that deliver outstanding
                value to customers, create meaningful opportunities for employees, and
                contribute positively to the communities we serve. We aim to be the
                partner of choice across every industry we enter.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To be Western Canada&apos;s leading diversified group of companies,
                recognized for excellence, innovation, and integrity. We envision
                a future where Guardium Group companies are the first choice for
                quality services across all our sectors.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-[#22c55e] font-semibold text-sm mb-3 block">
              Industries We Serve
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-gray-900">
              Diverse Expertise Across Sectors
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our portfolio spans multiple industries, allowing us to provide comprehensive
              solutions for businesses and individuals.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {industries.map((industry) => (
              <motion.div
                key={industry.name}
                variants={fadeInUp}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-[#f7f7f7] rounded-xl flex items-center justify-center mb-4">
                      <industry.icon className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{industry.name}</h3>
                    <p className="text-gray-600 text-sm">{industry.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge variant="accent" className="mb-4">
              Our Values
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-gray-900">
              What We Stand For
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide every decision we make and define who we are
              as a company.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-[#22c55e] font-semibold text-sm mb-3 block">
              Where We Operate
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-gray-900">
              Serving Local & Global Markets
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From our Edmonton headquarters, we serve customers locally and internationally.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gray-50 rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Local Coverage</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.local.map((area) => (
                  <span
                    key={area}
                    className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 border border-gray-200"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gray-50 rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Global Presence</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.global.map((area) => (
                  <span
                    key={area}
                    className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 border border-gray-200"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
     

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
              Ready to Partner With Us?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              Whether you&apos;re looking for services or career opportunities,
              we&apos;d love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="rounded-full" asChild>
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/careers">View Careers</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

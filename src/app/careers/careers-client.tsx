"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  Users,
  Heart,
  TrendingUp,
  Award,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { BreadcrumbHero } from "@/components/breadcrumb-hero";

const benefits = [
  {
    icon: Heart,
    title: "Health Benefits",
    description: "Comprehensive health, dental, and vision coverage for you and your family.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Clear paths for advancement with training and development programs.",
  },
  {
    icon: Users,
    title: "Team Culture",
    description: "Work with talented professionals in a supportive, collaborative environment.",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Performance bonuses and recognition programs that celebrate your achievements.",
  },
];

const openings = [
  {
    title: "Tow Truck Driver",
    company: "Guardium Towing",
    location: "Edmonton, AB",
    type: "Full-time",
    description: "Looking for experienced tow truck drivers to join our 24/7 team.",
  },
  {
    title: "Security Guard",
    company: "Guardium Security",
    location: "Edmonton, AB",
    type: "Full-time / Part-time",
    description: "Licensed security guards needed for various sites across the city.",
  },
  {
    title: "Logistics Coordinator",
    company: "Guardium Logistics",
    location: "Edmonton, AB",
    type: "Full-time",
    description: "Coordinate freight movements and optimize delivery schedules.",
  },
  {
    title: "Software Developer",
    company: "Guardium Technologies",
    location: "Remote / Edmonton",
    type: "Full-time",
    description: "Build innovative solutions for our growing tech company.",
  },
  {
    title: "Business Consultant",
    company: "Guardium Consulting",
    location: "Edmonton, AB",
    type: "Full-time",
    description: "Help businesses grow with strategic advice and solutions.",
  },
  {
    title: "Property Manager",
    company: "Guardium Property Services",
    location: "Edmonton, AB",
    type: "Full-time",
    description: "Manage residential and commercial properties in the Edmonton area.",
  },
];

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

export function CareersClient() {
  return (
    <>
      {/* Breadcrumb Hero */}
      <BreadcrumbHero
        title="Careers"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers" },
        ]}
      />

      {/* Why Work With Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge variant="accent" className="mb-4">
              Why Join Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900">
              Benefits of Working at Guardium
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We invest in our people because they are the foundation of our success.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Badge variant="accent" className="mb-4">
              Open Positions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900">
              Current Opportunities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our open positions across all Guardium Group companies.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {openings.map((job, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {job.company}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </span>
                    </div>
                    <Button variant="outline" className="w-full rounded-full" asChild>
                      <Link href="/contact">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
              Don&apos;t See the Right Position?
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8">
              We&apos;re always looking for talented individuals. Send us your resume
              and we&apos;ll keep you in mind for future opportunities.
            </p>
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/contact">
                Submit Your Resume
                <Briefcase className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}

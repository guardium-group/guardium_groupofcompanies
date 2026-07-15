"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BreadcrumbHero } from "@/components/breadcrumb-hero";
import { companiesData } from "@/lib/companies-data";
import type { BlogPost } from "@/lib/blog";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function BlogPostClient({ post }: { post: BlogPost }) {
  const relatedCompany = post.relatedCompanySlug ? companiesData[post.relatedCompanySlug] : undefined;

  return (
    <>
      <BreadcrumbHero
        title={post.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Guides & Articles", href: "/blog" },
          { label: post.title },
        ]}
      />

      <article className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-8"
          >
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime}
              </span>
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority
                className="object-cover"
              />
            </div>
          </motion.div>

          <div className="space-y-10">
            {post.sections.map((section) => (
              <motion.div
                key={section.heading}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.list && (
                  <ul className="mt-4 space-y-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Key takeaway</h3>
            <p className="text-gray-600 leading-relaxed">{post.takeaway}</p>
          </motion.div>

          {relatedCompany && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-8"
            >
              <p className="text-gray-600">
                Need this handled? {relatedCompany.name} can help.
              </p>
              <Button asChild className="rounded-full">
                <a href={relatedCompany.href} target="_blank" rel="noopener noreferrer">
                  Visit {relatedCompany.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          )}

          <div className="mt-8">
            <Link href="/blog" className="text-primary hover:underline text-sm font-medium">
              ← Back to all articles
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

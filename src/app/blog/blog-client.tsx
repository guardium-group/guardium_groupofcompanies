"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbHero } from "@/components/breadcrumb-hero";
import type { BlogPost } from "@/lib/blog";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function BlogClient({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      <BreadcrumbHero
        title="Guides & Articles"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Guides & Articles" },
        ]}
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <motion.div
              className="max-w-lg mx-auto text-center py-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Guides & articles are coming soon
              </h2>
              <p className="text-gray-600 mb-8">
                We&apos;re putting together practical advice across towing, security,
                logistics, and our other services. Check back soon, or contact us
                directly with a question in the meantime.
              </p>
              <Button asChild className="rounded-full">
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className="rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <Badge variant="secondary" className="w-fit mb-3">
                        {post.category}
                      </Badge>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      <span className="text-xs text-gray-400">{post.readingTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

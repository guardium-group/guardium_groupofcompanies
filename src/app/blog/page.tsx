import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-config";
import { BlogClient } from "./blog-client";

// Remove this `robots` override once the first real post is published — an
// empty listing page shouldn't be indexed, but there's no reason to hide a
// populated one.
export const metadata: Metadata = {
  title: "Guides & Articles | Guardium Group of Companies",
  description:
    "Practical guides and articles from Guardium Group of Companies, covering towing, security, logistics, and our other services.",
  alternates: {
    canonical: "/blog",
  },
  robots: blogPosts.length === 0 ? { index: false, follow: true } : { index: true, follow: true },
  openGraph: {
    title: "Guides & Articles | Guardium Group of Companies",
    description:
      "Practical guides and articles from Guardium Group of Companies, covering towing, security, logistics, and our other services.",
    url: `${SITE_URL}/blog`,
    siteName: "Guardium Group",
    type: "website",
    locale: "en_CA",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: "Guardium Group of Companies" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@group_guardium",
    title: "Guides & Articles | Guardium Group of Companies",
    description:
      "Practical guides and articles from Guardium Group of Companies, covering towing, security, logistics, and our other services.",
    images: ["/images/og-default.png"],
  },
};

export default function BlogPage() {
  return <BlogClient posts={blogPosts} />;
}

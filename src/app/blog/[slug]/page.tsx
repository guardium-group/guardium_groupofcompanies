import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogSlugs } from "@/lib/blog";
import { SITE_URL } from "@/lib/site-config";
import { BlogPostClient } from "./blog-post-client";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Article Not Found | Guardium Group" };
  }

  const url = `${SITE_URL}/blog/${slug}`;

  return {
    title: `${post.title} | Guardium Group of Companies`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "Guardium Group",
      type: "article",
      locale: "en_CA",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@group_guardium",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${slug}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${slug}`,
    },
    headline: post.title,
    description: post.description,
    image: [`${SITE_URL}${post.image}`],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: "Guardium Group of Companies",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Guardium Group of Companies",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/ggc_logo.png`,
      },
    },
    articleSection: post.category,
    keywords: post.keywords.join(", "),
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(blogPostingJsonLd)}
      </script>
      <BlogPostClient post={post} />
    </>
  );
}

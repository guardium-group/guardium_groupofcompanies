export interface BlogSection {
  heading: string;
  body: string[];
  list?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  publishedAt: string; // YYYY-MM-DD
  updatedAt: string; // YYYY-MM-DD
  readingTime: string; // e.g. "5 min read"
  image: string;
  imageAlt: string;
  keywords: string[];
  sections: BlogSection[];
  takeaway: string;
  // Slug into companies-data.ts, if this post is specific to one subsidiary
  relatedCompanySlug?: string;
}

// No posts yet. Add entries here once real content is ready — each post is a
// plain object matching the BlogPost shape above (see the git history of this
// file, or ../../builds/cliffs_towing/src/lib/blog.ts in the sibling project,
// for a fully worked real-world example of the same shape in production).
//
// Once you add the first post: remove the `robots: { index: false }` override
// in src/app/blog/page.tsx, and add /blog to src/app/sitemap.ts.
export const blogPosts: BlogPost[] = [];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getFeaturedBlogPosts(limit = 3): BlogPost[] {
  return blogPosts.slice(0, limit);
}

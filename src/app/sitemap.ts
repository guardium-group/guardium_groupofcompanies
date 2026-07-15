import type { MetadataRoute } from "next";
import { allCompanySlugs } from "@/lib/companies-data";
import { SITE_URL, CONTENT_LAST_MODIFIED } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: SITE_URL, priority: 1.0 },
    { url: `${SITE_URL}/about`, priority: 0.8 },
    { url: `${SITE_URL}/companies`, priority: 0.9 },
    { url: `${SITE_URL}/careers`, priority: 0.7 },
    { url: `${SITE_URL}/contact`, priority: 0.7 },
  ].map((route) => ({
    ...route,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: "monthly" as const,
  }));

  const companyRoutes = allCompanySlugs.map((slug) => ({
    url: `${SITE_URL}/companies/${slug}`,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...companyRoutes];
}

import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guardiumgroup.com";

const companySlugs = [
  "towing",
  "security",
  "logistics",
  "courier",
  "technologies",
  "property-services",
  "staffing",
  "consulting",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE_URL, priority: 1.0 },
    { url: `${BASE_URL}/about`, priority: 0.8 },
    { url: `${BASE_URL}/companies`, priority: 0.9 },
    { url: `${BASE_URL}/careers`, priority: 0.7 },
    { url: `${BASE_URL}/contact`, priority: 0.7 },
  ].map((route) => ({
    ...route,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
  }));

  const companyRoutes = companySlugs.map((slug) => ({
    url: `${BASE_URL}/companies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...companyRoutes];
}

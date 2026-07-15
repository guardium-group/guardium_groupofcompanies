import type { Metadata } from "next";
import { CompaniesClient } from "./companies-client";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Companies | Guardium Group of Companies",
  description:
    "Explore Guardium Group's family of companies — towing, security, logistics, courier, technology, property services, staffing, and consulting — serving Edmonton and Alberta.",
  alternates: {
    canonical: "/companies",
  },
  openGraph: {
    title: "Our Companies | Guardium Group",
    description:
      "Explore Guardium Group's family of companies serving Edmonton and Alberta across multiple industries.",
    url: `${SITE_URL}/companies`,
    siteName: "Guardium Group",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/images/hero/heroBg2.png",
        alt: "Guardium Group of Companies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@group_guardium",
    title: "Our Companies | Guardium Group",
    description:
      "Explore Guardium Group's family of companies serving Edmonton and Alberta across multiple industries.",
    images: ["/images/hero/heroBg2.png"],
  },
};

export default function CompaniesPage() {
  return <CompaniesClient />;
}

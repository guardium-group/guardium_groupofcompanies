import type { Metadata } from "next";
import { CareersClient } from "./careers-client";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Careers | Guardium Group of Companies",
  description:
    "Join Guardium Group of Companies — explore open positions across towing, security, logistics, technology, property services, and consulting in Edmonton, Alberta.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Careers at Guardium Group of Companies",
    description:
      "Explore open positions across Guardium Group's family of companies in Edmonton, Alberta.",
    url: `${SITE_URL}/careers`,
    siteName: "Guardium Group",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/images/hero/heroBg2.png",
        alt: "Careers at Guardium Group of Companies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@group_guardium",
    title: "Careers at Guardium Group of Companies",
    description:
      "Explore open positions across Guardium Group's family of companies in Edmonton, Alberta.",
    images: ["/images/hero/heroBg2.png"],
  },
};

export default function CareersPage() {
  return <CareersClient />;
}

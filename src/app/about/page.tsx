import type { Metadata } from "next";
import { AboutClient } from "./about-client";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us | Guardium Group of Companies",
  description:
    "A diversified conglomerate headquartered in Edmonton, Alberta — 8+ companies, 500+ employees, delivering excellence across towing, security, logistics, and technology.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Guardium Group of Companies",
    description:
      "A diversified conglomerate headquartered in Edmonton, Alberta — 8+ companies, 500+ employees, serving Western Canada across multiple industries.",
    url: `${SITE_URL}/about`,
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
    title: "About Guardium Group of Companies",
    description:
      "A diversified conglomerate headquartered in Edmonton, Alberta — 8+ companies, 500+ employees, serving Western Canada across multiple industries.",
    images: ["/images/hero/heroBg2.png"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}

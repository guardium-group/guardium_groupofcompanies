import type { Metadata } from "next";
import { HomeClient } from "./home-client";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Guardium Group of Companies | Building Success Through Excellence",
  description:
    "A diversified conglomerate with subsidiaries in towing, security, logistics, technology, staffing, and more — building success across Edmonton, Alberta.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Guardium Group of Companies",
    description:
      "A diversified group of companies dedicated to excellence across multiple industries.",
    url: SITE_URL,
    siteName: "Guardium Group",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "Guardium Group of Companies — diversified conglomerate across Edmonton, Alberta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@group_guardium",
    title: "Guardium Group of Companies",
    description:
      "A diversified group of companies dedicated to excellence across multiple industries.",
    images: ["/images/og-default.png"],
  },
};

export default function Page() {
  return <HomeClient />;
}

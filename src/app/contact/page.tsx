import type { Metadata } from "next";
import { ContactClient } from "./contact-client";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us | Guardium Group of Companies",
  description:
    "Get in touch with Guardium Group of Companies. Reach our sales or support team, or visit our Edmonton, Alberta office.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Guardium Group of Companies",
    description:
      "Get in touch with Guardium Group of Companies — sales, support, or visit our Edmonton, Alberta office.",
    url: `${SITE_URL}/contact`,
    siteName: "Guardium Group",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/images/hero/heroBg2.png",
        alt: "Contact Guardium Group of Companies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@group_guardium",
    title: "Contact Guardium Group of Companies",
    description:
      "Get in touch with Guardium Group of Companies — sales, support, or visit our Edmonton, Alberta office.",
    images: ["/images/hero/heroBg2.png"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

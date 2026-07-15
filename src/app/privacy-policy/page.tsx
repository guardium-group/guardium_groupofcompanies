import type { Metadata } from "next";
import { BreadcrumbHero } from "@/components/breadcrumb-hero";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy | Guardium Group of Companies",
  description:
    "How Guardium Group of Companies collects, uses, and protects your information.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Guardium Group of Companies",
    description:
      "How Guardium Group of Companies collects, uses, and protects your information.",
    url: `${SITE_URL}/privacy-policy`,
    siteName: "Guardium Group",
    type: "website",
    locale: "en_CA",
    images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: "Guardium Group of Companies" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@group_guardium",
    title: "Privacy Policy | Guardium Group of Companies",
    description:
      "How Guardium Group of Companies collects, uses, and protects your information.",
    images: ["/images/og-default.png"],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbHero
        title="Privacy Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-gray-50 rounded-2xl p-8 text-gray-600 text-sm leading-relaxed">
            <p>
              This page is being updated. Please check back soon or contact us at{" "}
              <a
                href="mailto:info@guardiumgroup.com"
                className="text-[#511010] hover:underline"
              >
                info@guardiumgroup.com
              </a>{" "}
              with any privacy-related inquiries.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

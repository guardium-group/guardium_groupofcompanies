import type { Metadata } from "next";
import { Barlow, Mulish, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MapSection } from "@/components/layout/map-section";
import { PostHogProvider } from "@/components/posthog-provider";
import { PostHogPageView } from "@/components/posthog-pageview";
import { Suspense } from "react";
import { SITE_URL, CONSENT_STORAGE_KEY, SERVICE_AREA_CITIES } from "@/lib/site-config";
import { companiesData, allCompanySlugs } from "@/lib/companies-data";
import { GAPageView } from "@/components/ga-pageview";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Guardium Group of Companies | Building Success Through Excellence",
  description:
    "Guardium Group is a diversified conglomerate with subsidiaries in towing, security, logistics, technology, staffing, and more. Building success through excellence across multiple industries.",
  keywords: [
    "Guardium Group",
    "Edmonton businesses",
    "towing services",
    "security services",
    "logistics",
    "technology solutions",
    "staffing solutions",
    "Alberta companies",
  ],
  authors: [{ name: "Guardium Group of Companies" }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Populate NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION with the code Search
  // Console gives you under Settings > Ownership verification > HTML tag
  // (just the content value, not the full <meta> tag) — no code changes
  // needed beyond that.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    title: "Guardium Group of Companies",
    description:
      "A diversified group of companies dedicated to excellence across multiple industries.",
    url: SITE_URL,
    siteName: "Guardium Group",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    site: "@group_guardium",
    title: "Guardium Group of Companies",
    description:
      "A diversified group of companies dedicated to excellence across multiple industries.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Guardium Group of Companies",
  url: SITE_URL,
  logo: `${SITE_URL}/images/ggc_logo.png`,
  telephone: "+1-780-809-7860",
  email: "info@guardiumgroup.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit 206, 4918 Roper Rd NW",
    addressLocality: "Edmonton",
    addressRegion: "AB",
    postalCode: "T6B 3T7",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 53.5461,
    longitude: -113.4938,
  },
  areaServed: SERVICE_AREA_CITIES.map((city) => ({ "@type": "City", name: city })),
  sameAs: [
    "https://www.facebook.com/guardiumgroup",
    "https://www.instagram.com/guardium.group/",
    "https://x.com/group_guardium",
    "https://www.linkedin.com/company/guardium-group-of-companies/",
    "https://youtube.com/@GuardiumGroup",
  ],
  subOrganization: allCompanySlugs.map((slug) => ({
    "@type": "Organization",
    name: companiesData[slug].name,
    url: `${SITE_URL}/companies/${slug}`,
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en-CA">
      <script type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </script>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              var ggcConsent = typeof localStorage !== 'undefined' && localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'accepted';
              gtag('consent', 'default', {
                analytics_storage: ggcConsent ? 'granted' : 'denied',
                ad_storage: ggcConsent ? 'granted' : 'denied'
              });
              gtag('js', new Date());
              gtag('config', '${gaId}', { send_page_view: false });
            `}
          </Script>
        </>
      )}
      <body
        className={`${barlow.variable} ${mulish.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
            {gaId && <GAPageView />}
          </Suspense>
          <CookieConsent />
          <Header />
          <main>{children}</main>
          <MapSection />
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}

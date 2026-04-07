import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MapSection } from "@/components/layout/map-section";
import { PostHogProvider } from "@/components/posthog-provider";
import { PostHogPageView } from "@/components/posthog-pageview";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
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
  openGraph: {
    title: "Guardium Group of Companies",
    description:
      "A diversified group of companies dedicated to excellence across multiple industries.",
    url: "https://guardiumgroup.com",
    siteName: "Guardium Group",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
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
              gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' });
              gtag('js', new Date());
              gtag('config', '${gaId}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MapSection } from "@/components/layout/map-section";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <MapSection />
        <Footer />
      </body>
    </html>
  );
}

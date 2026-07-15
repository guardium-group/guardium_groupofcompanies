import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { companiesData, allCompanySlugs } from "@/lib/companies-data";
import { SITE_URL } from "@/lib/site-config";
import { CompanyClient } from "./company-client";

export function generateStaticParams() {
  return allCompanySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const company = companiesData[slug];

  if (!company) {
    return { title: "Company Not Found | Guardium Group" };
  }

  const url = `${SITE_URL}/companies/${slug}`;

  return {
    title: `${company.name} | Guardium Group of Companies`,
    description: company.description,
    alternates: {
      canonical: `/companies/${slug}`,
    },
    openGraph: {
      title: company.name,
      description: company.description,
      url,
      siteName: "Guardium Group",
      type: "website",
      locale: "en_CA",
      images: [{ url: company.heroImage, alt: company.name }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@group_guardium",
      title: company.name,
      description: company.description,
      images: [company.heroImage],
    },
  };
}

export default async function CompanyPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!companiesData[slug]) {
    notFound();
  }

  return <CompanyClient slug={slug} />;
}

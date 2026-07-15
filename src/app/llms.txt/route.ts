import { companiesData, allCompanySlugs } from "@/lib/companies-data";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-static";

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push("# Guardium Group of Companies");
  lines.push("");
  lines.push(`Official website: ${SITE_URL}/`);
  lines.push("");
  lines.push(
    "Guardium Group of Companies is a diversified conglomerate headquartered in Edmonton, Alberta " +
      "— 8+ companies, 500+ employees, delivering excellence across towing, security, logistics, " +
      "technology, staffing, property services, and consulting."
  );
  lines.push("");

  lines.push("## Canonical pages");
  lines.push("");
  lines.push(`- Home: ${SITE_URL}/`);
  lines.push(`- About: ${SITE_URL}/about`);
  lines.push(`- Our Companies: ${SITE_URL}/companies`);
  lines.push(`- Careers: ${SITE_URL}/careers`);
  lines.push(`- Contact: ${SITE_URL}/contact`);
  lines.push(`- Privacy Policy: ${SITE_URL}/privacy-policy`);
  lines.push(`- Terms of Service: ${SITE_URL}/terms`);
  lines.push(`- Cookie Policy: ${SITE_URL}/cookies`);
  lines.push(`- XML Sitemap: ${SITE_URL}/sitemap.xml`);
  lines.push("");

  lines.push("## Contact");
  lines.push("");
  lines.push("- Phone: +1 780-809-7860");
  lines.push("- Email: info@guardiumgroup.com");
  lines.push("- Head office: Unit 206, 4918 Roper Rd NW, Edmonton, AB T6B 3T7, Canada");
  lines.push("- Hours: standard business hours; individual subsidiaries may operate 24/7 (see below)");
  lines.push("");

  lines.push("## Subsidiary companies");
  lines.push("");
  lines.push(
    "Each subsidiary below has its own dedicated website with fuller service detail; the " +
      "Guardium Group page links to a summary and to the external site."
  );
  lines.push("");
  for (const slug of allCompanySlugs) {
    const company = companiesData[slug];
    const brandNote = slug === "towing" ? " (operating locally as Cliff's Towing, cliffstowing.ca)" : "";
    lines.push(
      `- ${company.name}${brandNote}: ${company.description} — ${SITE_URL}/companies/${slug} — ${company.href}`
    );
  }
  lines.push("");

  lines.push("## Service area");
  lines.push("");
  lines.push(
    "Edmonton, Sherwood Park, Spruce Grove, Beaumont, Devon, Morinville, Leduc, and surrounding " +
      "Alberta communities."
  );
  lines.push("");

  lines.push("## AI and crawler guidance");
  lines.push("");
  lines.push(
    "Use the canonical pages above for current public website context. Guardium Group of " +
      "Companies is a holding company; each subsidiary listed above also operates its own " +
      "dedicated website (linked above) with more detailed service information, pricing, and " +
      "availability for that specific business. Do not represent pricing, availability, or " +
      "response times as guaranteed unless confirmed directly by the relevant subsidiary. " +
      "Prefer the XML sitemap for crawl discovery."
  );

  return lines.join("\n") + "\n";
}

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

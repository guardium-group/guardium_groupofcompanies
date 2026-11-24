import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const failures = [];

const companyLinkFiles = [
  "src/components/companies-carousel.tsx",
  "src/app/companies/companies-client.tsx",
];

for (const path of companyLinkFiles) {
  const source = read(path);
  if (source.includes("Learn More")) {
    failures.push(`${path} still contains a generic Learn More link`);
  }
  if (!source.includes("Explore {company.name}")) {
    failures.push(`${path} is missing visible destination-specific company link copy`);
  }
}

const remainingGenericCopy = [
  "src/components/cookie-consent.tsx",
  "src/app/companies/[slug]/company-client.tsx",
];
for (const path of remainingGenericCopy) {
  if (/learn more/i.test(read(path))) {
    failures.push(`${path} still contains generic learn-more copy`);
  }
}

const carouselSource = read("src/components/companies-carousel.tsx");
if (!carouselSource.includes("onClickCapture") || !carouselSource.includes("preventDefault")) {
  failures.push("the native swipe carousel does not suppress link clicks after a drag gesture");
}

const lightweightMotionFiles = [
  "src/app/home-client.tsx",
  "src/components/home-hero.tsx",
  "src/components/companies-carousel.tsx",
  "src/components/featured-company.tsx",
  "src/components/cta-carousel.tsx",
  "src/components/layout/header.tsx",
  "src/components/layout/map-section.tsx",
  "src/components/ui/navbar-menu.tsx",
  "src/components/cookie-consent.tsx",
];

for (const path of lightweightMotionFiles) {
  const source = read(path);
  if (/import\s*\{[^}]*\bmotion\b[^}]*\}\s*from\s*["']framer-motion["']/.test(source)) {
    failures.push(`${path} imports the full motion proxy`);
  }
  if (/<\/?motion\./.test(source)) {
    failures.push(`${path} still renders a full motion element`);
  }
}

const homeSource = read("src/app/home-client.tsx");
if (!homeSource.includes("<LazyMotionProvider>")) {
  failures.push("the homepage is missing its shared LazyMotionProvider boundary");
}

let providerSource = "";
try {
  providerSource = read("src/components/motion/lazy-motion-provider.tsx");
} catch {
  failures.push("the reusable LazyMotionProvider does not exist");
}
if (providerSource && !/<LazyMotion[^>]*features=\{loadFeatures\}[^>]*strict/.test(providerSource)) {
  failures.push("LazyMotionProvider is not asynchronously loaded in strict mode");
}

const heroSource = read("src/components/home-hero.tsx");
if (!heroSource.includes('data-hero-cta="true"')) {
  failures.push("the hero CTA does not expose its contrast-stability regression marker");
}
if (!heroSource.includes("bg-primary text-primary-foreground hover:bg-[#511010]")) {
  failures.push("the hero primary CTA is missing its opaque contrast-safe color contract");
}

if (failures.length) {
  console.error(`Homepage quality verification failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Homepage quality verification passed.");

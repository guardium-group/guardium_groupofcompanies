import { BreadcrumbHero } from "@/components/breadcrumb-hero";

export const metadata = {
  title: "Cookie Policy | Guardium Group of Companies",
};

export default function CookiesPage() {
  return (
    <>
      <BreadcrumbHero
        title="Cookie Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cookie Policy" },
        ]}
      />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-gray-50 rounded-2xl p-8 space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              <strong className="text-gray-900">What cookies do we use?</strong>
            </p>
            <p>
              We use analytics cookies to help us understand how visitors interact with our website.
              Specifically, we use <strong>PostHog</strong> for session recordings and heatmaps,
              and <strong>Google Analytics (GA4)</strong> for traffic analysis.
            </p>
            <p>
              <strong className="text-gray-900">Your choices</strong>
            </p>
            <p>
              When you first visit our site, you can choose to accept or reject analytics cookies
              using the consent banner. You can change your preference at any time by clearing
              your browser&apos;s local storage for this site.
            </p>
            <p>
              <strong className="text-gray-900">Contact us</strong>
            </p>
            <p>
              For any cookie-related questions, contact us at{" "}
              <a
                href="mailto:info@guardiumgroup.com"
                className="text-[#511010] hover:underline"
              >
                info@guardiumgroup.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

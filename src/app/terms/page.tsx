import { BreadcrumbHero } from "@/components/breadcrumb-hero";

export const metadata = {
  title: "Terms of Service | Guardium Group of Companies",
};

export default function TermsPage() {
  return (
    <>
      <BreadcrumbHero
        title="Terms of Service"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms of Service" },
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
              with any questions regarding our terms of service.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

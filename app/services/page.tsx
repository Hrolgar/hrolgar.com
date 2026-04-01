import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getContact, getPageContent, getServices, getSettings } from "@/sanity/lib/queries";
import type { Service } from "@/sanity/types";

export const revalidate = 3600;

const iconMap: Record<string, string> = {
  api: "⟷",
  backend: "⚙",
  automation: "▶",
};

function getServiceIcon(service: Service) {
  if (!service.icon) return "•";
  return iconMap[service.icon] || service.icon;
}

export default async function ServicesPage() {
  const [services, contact, pageContent, settings] = await Promise.all([
    getServices(),
    getContact(),
    getPageContent(),
    getSettings(),
  ]);

  const servicesHeading = pageContent?.servicesHeading || "What I Do";
  const servicesIntro =
    pageContent?.servicesIntro ||
    "I help clients design, integrate, and ship backend systems that are reliable under real production load. My focus is practical architecture, API delivery, and automation that removes manual work.";
  const servicesCta = pageContent?.servicesCta || "Ready to start a project?";
  const servicesCtaDescription =
    pageContent?.servicesCtaDescription ||
    "If you need help untangling integrations, building a solid API surface, or automating a fragile workflow, let's talk.";

  return (
    <>
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} />
      <main id="main-content" className="px-6 pb-16 pt-24 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <section className="border-b border-border pb-12 md:pb-16">
            <p className="mb-5 text-sm uppercase tracking-[0.24em] text-primary">
              Services
            </p>
            <h1 className="max-w-[10ch] font-[family-name:var(--font-serif)] text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl">
              {servicesHeading}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {servicesIntro}
            </p>
          </section>

          <section className="py-12 md:py-16">
            {services.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <article
                    key={service._id}
                    className="flex min-h-full flex-col rounded-[calc(var(--radius)*2)] border border-border bg-surface p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-primary"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-xl text-accent">
                      {getServiceIcon(service)}
                    </div>
                    <h2 className="mt-6 font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground">
                      {service.title}
                    </h2>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted md:text-base">
                      {service.summary || "Details coming soon."}
                    </p>
                    {service.slug?.current && (
                      <a
                        href={`/services/${service.slug.current}`}
                        className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-primary transition-colors hover:text-secondary"
                      >
                        Learn more
                      </a>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[calc(var(--radius)*2)] border border-dashed border-border bg-surface/70 p-8 text-center">
                <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground">
                  Services are being updated
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  The service catalog is in progress. Reach out directly if you want to discuss integrations, APIs, or automation work.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-[calc(var(--radius)*2)] border border-border bg-[color:color-mix(in_srgb,var(--color-surface)_80%,black)] px-8 py-10 md:px-10 md:py-12">
            <p className="text-sm uppercase tracking-[0.24em] text-accent">
              Start a project
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground md:text-4xl">
              {servicesCta}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              {servicesCtaDescription}
            </p>
            <a
              href="/contact"
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-accent px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Get in touch
            </a>
          </section>
        </div>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} />
    </>
  );
}

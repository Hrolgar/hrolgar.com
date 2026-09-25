import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { portableTextComponents } from "@/lib/portableText";
import { getContact, getPageContent, getServiceBySlug, getServiceSlugs, getSettings } from "@/sanity/lib/queries";
import { absoluteUrl, breadcrumbJsonLd, buildSeoMetadata, jsonLdScript, personJsonLd, withAlternates } from "@/lib/seo";
import { t } from "@/lib/ui";
import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE, localeHref, withLocale } from "@/sanity/locale";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const iconMap: Record<string, string> = {
  api: "⟷",
  backend: "⚙",
  automation: "▶",
};

function getServiceIcon(icon?: string) {
  if (!icon) return "•";
  return iconMap[icon] || icon;
}

export async function generateStaticParams() {
  const services = await getServiceSlugs();
  return services
    .filter((service) => service.slug?.current)
    .map((service) => ({ slug: service.slug.current }));
}

/** Title, description, canonical and the en/nb pair for one service page in one language. */
export async function serviceMetadata(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Metadata> {
  const service = await getServiceBySlug(slug, locale);

  if (!service) {
    return { title: "Service Not Found", robots: { index: false, follow: false } };
  }

  const meta = await buildSeoMetadata({
    title: `${service.title}, ${t("serviceByline", locale)}`,
    description: service.summary || service.title,
    path: withLocale(`/services/${slug}`, locale),
  });
  return withAlternates(meta, `/services/${slug}`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return serviceMetadata(slug);
}

export async function ServiceBody({ slug, locale = DEFAULT_LOCALE }: { slug: string; locale?: Locale }) {
  const [service, contact, pageContent, settings] = await Promise.all([
    getServiceBySlug(slug, locale),
    getContact(locale),
    getPageContent(locale),
    getSettings(),
  ]);

  if (!service) {
    notFound();
  }

  const path = withLocale(`/services/${slug}`, locale);
  const description = service.summary || service.title;
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description,
    provider: personJsonLd,
    areaServed: "Worldwide",
    url: absoluteUrl(path),
    inLanguage: locale === "nb" ? "nb-NO" : "en",
  };

  return (
    <>
      {jsonLdScript(serviceJsonLd)}
      {jsonLdScript(breadcrumbJsonLd([
        { name: t("navHome", locale), path: localeHref("/", locale) },
        { name: t("navServices", locale), path: localeHref("/services", locale) },
        { name: service.title, path },
      ]))}
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} locale={locale} />
      <main id="main-content" className="px-6 pb-16 pt-24">
        <article className="mx-auto max-w-3xl">
          <a
            href={localeHref("/services", locale)}
            className="mb-8 inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-primary"
          >
            ← {t("backToServices", locale)}
          </a>

          <div className="border-b border-border pb-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius)] border border-accent/20 bg-accent/10 text-2xl text-accent">
                {getServiceIcon(service.icon)}
              </div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">{t("serviceLabel", locale)}</p>
            </div>

            <h1 className="font-[family-name:var(--font-serif)] text-4xl font-bold text-foreground md:text-5xl">
              {service.title}
            </h1>

            {service.summary && (
              <p className="mt-6 text-lg leading-relaxed text-muted">
                {service.summary}
              </p>
            )}
          </div>

          {service.description && (
            <div className="prose-editorial mt-10 text-base leading-relaxed">
              <PortableText value={service.description} components={portableTextComponents} />
            </div>
          )}

          {service.caseStudies && service.caseStudies.length > 0 && (
            <section className="mt-16">
              <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground mb-6">
                {pageContent?.serviceCaseStudiesHeading || t("caseStudies", locale)}
              </h2>
              <ul className="grid gap-4 md:grid-cols-2">
                {service.caseStudies.filter((p) => p?.slug?.current).map((p) => (
                  <li key={p._id}>
                    <a
                      href={`/projects/${p.slug.current}`}
                      className="block h-full rounded-[var(--radius)] border border-border bg-surface p-5 transition-colors hover:border-primary"
                    >
                      <p className="font-semibold text-foreground">{p.title}</p>
                      {p.summary && <p className="mt-2 text-sm leading-relaxed text-muted">{p.summary}</p>}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-16 rounded-[calc(var(--radius)*2)] border border-border bg-surface p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.24em] text-accent">{t("nextStep", locale)}</p>
            <h2 className="mt-4 font-[family-name:var(--font-serif)] text-2xl font-bold text-foreground">
              {pageContent?.serviceDetailCtaHeading || t("serviceCtaHeading", locale)}
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted">
              {pageContent?.serviceDetailCtaDescription || t("serviceCtaDescription", locale)}
            </p>
            <a
              href={localeHref("/contact", locale)}
              data-umami-event="contact-cta-click"
            data-umami-event-source="service-page"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-accent px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {pageContent?.serviceDetailCtaButtonText || t("serviceCtaButton", locale)}
            </a>
          </section>
        </article>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} locale={locale} />
    </>
  );
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  return <ServiceBody slug={slug} />;
}

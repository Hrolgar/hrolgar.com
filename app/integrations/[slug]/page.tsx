import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ServiceInquiry from "@/components/ServiceInquiry";
import { portableTextComponents } from "@/lib/portableText";
import { absoluteUrl, breadcrumbJsonLd, buildSeoMetadata, jsonLdScript, personJsonLd, withAlternates } from "@/lib/seo";
import { t } from "@/lib/ui";
import {
  getContact,
  getContactFormBySlug,
  getIntegrationBySlug,
  getIntegrationSlugs,
  getPageContent,
  getPrivacyPage,
  getSettings,
} from "@/sanity/lib/queries";
import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE, localeHref, withLocale } from "@/sanity/locale";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const integrations = await getIntegrationSlugs();
  return integrations.map((i) => ({ slug: i.slug.current }));
}

/** Title, description, canonical and the en/nb pair for one integration page in one language. */
export async function integrationMetadata(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Metadata> {
  const integration = await getIntegrationBySlug(slug, locale);
  if (!integration) {
    return { title: "Integration Not Found", robots: { index: false, follow: false } };
  }
  const meta = await buildSeoMetadata({
    title: integration.seoTitle || `${integration.title}, ${t("serviceByline", locale)}`,
    description: integration.summary || integration.title,
    path: withLocale(`/integrations/${slug}`, locale),
  });
  return withAlternates(meta, `/integrations/${slug}`);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return integrationMetadata(slug);
}

export async function IntegrationBody({ slug, locale = DEFAULT_LOCALE }: { slug: string; locale?: Locale }) {
  const [integration, contact, pageContent, settings, inquiryForm, privacy] = await Promise.all([
    getIntegrationBySlug(slug, locale),
    getContact(locale),
    getPageContent(locale),
    getSettings(),
    getContactFormBySlug(locale === DEFAULT_LOCALE ? "service-inquiry" : `service-inquiry-${locale}`),
    getPrivacyPage(locale),
  ]);

  if (!integration) notFound();

  const path = withLocale(`/integrations/${slug}`, locale);
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: integration.title,
    serviceType: `${integration.system} integration`,
    description: integration.summary || integration.title,
    provider: personJsonLd,
    areaServed: locale === "nb" ? "NO" : "Worldwide",
    url: absoluteUrl(path),
    inLanguage: locale === "nb" ? "nb-NO" : "en",
  };

  const faqs = (integration.faqs || []).filter((f) => f.question && f.answer);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      {jsonLdScript(serviceJsonLd)}
      {faqs.length > 0 && jsonLdScript(faqJsonLd)}
      {jsonLdScript(breadcrumbJsonLd([
        { name: t("navHome", locale), path: localeHref("/", locale) },
        { name: t("integrationsLabel", locale), path: localeHref("/integrations", locale) },
        { name: integration.system, path },
      ]))}
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} locale={locale} />
      <main id="main-content" className="px-6 pb-16 pt-24">
        <article className="mx-auto max-w-3xl">
          <a
            href={localeHref("/integrations", locale)}
            className="mb-8 inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-primary"
          >
            ← {t("backToIntegrations", locale)}
          </a>

          <div className="border-b border-border pb-10">
            <p className="mb-6 text-sm uppercase tracking-[0.24em] text-primary">{t("integrationLabel", locale)}</p>
            <h1 className="font-[family-name:var(--font-serif)] text-4xl font-bold text-foreground md:text-5xl">
              {integration.title}
            </h1>
            {integration.summary && (
              <p className="mt-6 text-lg leading-relaxed text-muted">{integration.summary}</p>
            )}
          </div>

          {integration.description && (
            <div className="prose-editorial mt-10 text-base leading-relaxed">
              <PortableText value={integration.description} components={portableTextComponents} />
            </div>
          )}

          {faqs.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground">
                {t("faqHeading", locale)}
              </h2>
              <dl className="divide-y divide-border border-y border-border">
                {faqs.map((f) => (
                  <div key={f._key} className="py-5">
                    <dt className="font-semibold text-foreground">{f.question}</dt>
                    <dd className="mt-2 leading-relaxed text-muted">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {inquiryForm && (
            <section id="inquiry" className="mt-16">
              <ServiceInquiry form={inquiryForm} locale={locale} privacyNote={privacy?.formNote} service={integration.title} />
              <p className="mt-4 text-sm text-muted">
                <a href={localeHref("/contact", locale)} className="underline underline-offset-4 hover:text-primary">
                  {t("fullProjectForm", locale)}
                </a>
              </p>
            </section>
          )}
        </article>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} locale={locale} />
    </>
  );
}

export default async function IntegrationPage({ params }: PageProps) {
  const { slug } = await params;
  return <IntegrationBody slug={slug} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getContact, getIntegrations, getPageContent, getSettings } from "@/sanity/lib/queries";
import { breadcrumbJsonLd, buildSeoMetadata, jsonLdScript, withAlternates } from "@/lib/seo";
import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE, localeHref } from "@/sanity/locale";
import { t } from "@/lib/ui";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Integrations: Fiken, Tripletex, Dynamics 365, BankID and more",
    description:
      "Integrations with the systems businesses already run on: accounting, banking, BankID, public registers, Dynamics 365 and payments.",
    path: "/integrations",
  });
  return withAlternates(meta, "/integrations");
}

export async function IntegrationsPageBody({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const [integrations, contact, pageContent, settings] = await Promise.all([
    getIntegrations(locale),
    getContact(locale),
    getPageContent(locale),
    getSettings(),
  ]);

  // Nothing published yet: a real 404 rather than an empty page Google could index.
  if (integrations.length === 0) notFound();

  return (
    <>
      {jsonLdScript(breadcrumbJsonLd([
        { name: t("navHome", locale), path: localeHref("/", locale) },
        { name: t("integrationsLabel", locale), path: localeHref("/integrations", locale) },
      ]))}
      <Navbar navItems={pageContent?.navItems} buttonText={pageContent?.navButtonText} siteName={settings?.siteName} showBlog={settings?.showBlog} locale={locale} />
      <main id="main-content" className="px-6 pb-16 pt-24 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <section className="border-b border-border pb-12 md:pb-16">
            <p className="mb-5 text-sm uppercase tracking-[0.24em] text-primary">
              {t("integrationsLabel", locale)}
            </p>
            <h1 className="max-w-[16ch] font-[family-name:var(--font-serif)] text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              {t("integrationsHeading", locale)}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {t("integrationsIntro", locale)}
            </p>
          </section>

          <section className="py-12 md:py-16">
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {integrations.map((integration) => (
                <li key={integration._id}>
                  <a
                    href={localeHref(`/integrations/${integration.slug.current}`, locale)}
                    className="flex h-full flex-col rounded-[calc(var(--radius)*2)] border border-border bg-surface p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-primary"
                  >
                    <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground">
                      {integration.system}
                    </h2>
                    {integration.summary && (
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted md:text-base">
                        {integration.summary}
                      </p>
                    )}
                    <span className="mt-6 text-sm font-semibold text-primary">{t("learnMore", locale)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} locale={locale} />
    </>
  );
}

export default async function IntegrationsPage() {
  return <IntegrationsPageBody locale="en" />;
}

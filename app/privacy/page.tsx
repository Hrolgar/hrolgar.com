import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContact, getPageContent, getPrivacyPage, getSettings } from "@/sanity/lib/queries";
import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE } from "@/sanity/locale";
import { breadcrumbJsonLd, buildSeoMetadata, jsonLdScript, withAlternates } from "@/lib/seo";
import { formatDate } from "@/lib/dates";
import { portableTextComponents } from "@/lib/portableText";
import { t } from "@/lib/ui";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Privacy",
    description: "What hrolgar.com collects, why, how long it is kept and how to get it deleted.",
    path: "/privacy",
  });
  return withAlternates(meta, "/privacy");
}

export async function PrivacyBody({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const [privacy, contact, pageContent, settings] = await Promise.all([
    getPrivacyPage(locale),
    getContact(locale),
    getPageContent(locale),
    getSettings(),
  ]);
  if (!privacy) notFound();
  const title = privacy.title || t("privacy", locale);

  return (
    <>
      {jsonLdScript(breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: title, path: "/privacy" },
      ]))}
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} locale={locale} />
      <main id="main-content" className="pt-24 pb-16 px-6 md:pb-24">
        <article className="max-w-3xl mx-auto">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground mb-4">
            {title}
          </h1>
          {privacy.lastUpdated && (
            <p className="text-xs uppercase tracking-[0.18em] text-muted mb-8">
              {t("lastUpdated", locale)}: {formatDate(privacy.lastUpdated, locale)}
            </p>
          )}
          {privacy.intro && (
            <p className="text-base text-foreground leading-relaxed mb-12">{privacy.intro}</p>
          )}
          {privacy.body && (
            <div className="prose-editorial text-base leading-relaxed">
              <PortableText value={privacy.body} components={portableTextComponents} />
            </div>
          )}
        </article>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} locale={locale} />
    </>
  );
}

export default async function PrivacyPage() {
  return <PrivacyBody locale="en" />;
}

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContact, getPageContent, getSettings } from "@/sanity/lib/queries";
import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE } from "@/sanity/locale";
import { breadcrumbJsonLd, buildSeoMetadata, jsonLdScript, withAlternates } from "@/lib/seo";
import { formatDate } from "@/lib/dates";
import { PRIVACY_LAST_MODIFIED, privacyContent, type PrivacySegment } from "@/lib/privacy";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Privacy",
    description: "What hrolgar.com collects, why, how long it is kept and how to get it deleted.",
    path: "/privacy",
  });
  return withAlternates(meta, "/privacy");
}

function Segment({ segment }: { segment: PrivacySegment }) {
  if (typeof segment === "string") return <>{segment}</>;
  const external = segment.href.startsWith("http");
  return (
    <a
      href={segment.href}
      className="text-primary underline underline-offset-4 hover:opacity-80"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {segment.label}
    </a>
  );
}

export async function PrivacyBody({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const [contact, pageContent, settings] = await Promise.all([
    getContact(locale),
    getPageContent(locale),
    getSettings(),
  ]);
  const content = privacyContent[locale];

  return (
    <>
      {jsonLdScript(breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: content.title, path: "/privacy" },
      ]))}
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} locale={locale} />
      <main id="main-content" className="pt-24 pb-16 px-6 md:pb-24">
        <article className="max-w-3xl mx-auto">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground mb-4">
            {content.title}
          </h1>
          <p className="text-xs uppercase tracking-[0.18em] text-muted mb-8">
            {content.updated}: {formatDate(PRIVACY_LAST_MODIFIED.toISOString(), locale)}
          </p>
          <p className="text-base text-foreground leading-relaxed mb-12">{content.intro}</p>
          {content.sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2 className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground mb-4">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-muted leading-relaxed mb-4">
                  {paragraph.map((segment, j) => <Segment key={j} segment={segment} />)}
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} locale={locale} />
    </>
  );
}

export default async function PrivacyPage() {
  return <PrivacyBody locale="en" />;
}

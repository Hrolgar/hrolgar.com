import { getProjects, getProjectCategories, getContact, getPageContent, getSettings } from "@/sanity/lib/queries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ProjectsFilter from "@/components/ProjectsFilter";
import type { Metadata } from "next";
import type { Locale } from "@/sanity/locale";
import { t } from "@/lib/ui";
import { DEFAULT_LOCALE } from "@/sanity/locale";
import { breadcrumbJsonLd, buildSeoMetadata, jsonLdScript , withAlternates} from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Projects - Backend, Automation & Homelab Work",
    description: "A practical look at the backend systems, automation tools, and self-hosted infrastructure projects I have built for clients and myself.",
    path: "/projects",
  });
  return withAlternates(meta, "/projects");
}

export async function ProjectsBody({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const [allProjects, projectCategories, contact, pageContent, settings] = await Promise.all([
    getProjects(locale),
    getProjectCategories(locale),
    getContact(locale),
    getPageContent(locale),
    getSettings(),
  ]);

  return (
    <>
      {jsonLdScript(breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
      ]))}
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} locale={locale} />
      <main id="main-content" className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="mb-12">
              <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground mb-4">
                {pageContent?.projectsPageHeading || t("projectsPageHeading", locale)}
              </h1>
              <p className="text-muted text-base">
                {pageContent?.projectsPageSubtitle || t("projectsPageSubtitle", locale)}
              </p>
            </div>
          </ScrollReveal>

          {allProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-base">{t("noProjects", locale)}</p>
            </div>
          ) : (
            <ProjectsFilter projects={allProjects} projectCategories={projectCategories} locale={locale} />
          )}
        </div>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} locale={locale} />
    </>
  );
}

export default async function ProjectsPage() {
  return <ProjectsBody locale="en" />;
}

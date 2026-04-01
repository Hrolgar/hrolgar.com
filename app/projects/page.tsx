import { getProjects, getProjectCategories, getContact, getPageContent, getSettings } from "@/sanity/lib/queries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ProjectsFilter from "@/components/ProjectsFilter";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getPageContent();
  const heading = pageContent?.projectsPageHeading || "Projects";
  const subtitle = pageContent?.projectsPageSubtitle || "A collection of personal and freelance work";
  return {
    title: heading,
    description: subtitle,
    openGraph: { title: heading, description: subtitle },
  };
}

export default async function ProjectsPage() {
  const [allProjects, projectCategories, contact, pageContent, settings] = await Promise.all([
    getProjects(),
    getProjectCategories(),
    getContact(),
    getPageContent(),
    getSettings(),
  ]);

  return (
    <>
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} />
      <main id="main-content" className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="mb-12">
              <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground mb-4">
                {pageContent?.projectsPageHeading || "Projects"}
              </h1>
              <p className="text-muted text-base">
                {pageContent?.projectsPageSubtitle || "A collection of personal and freelance work"}
              </p>
            </div>
          </ScrollReveal>

          {allProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted text-base">No projects yet. Check back soon.</p>
            </div>
          ) : (
            <ProjectsFilter projects={allProjects} projectCategories={projectCategories} />
          )}
        </div>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} />
    </>
  );
}

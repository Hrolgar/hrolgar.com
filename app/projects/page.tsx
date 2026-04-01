import { getProjects, getContact, getPageContent, getSettings } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import type { Metadata } from "next";
import type { Project } from "@/sanity/types";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getPageContent();
  const heading = pageContent?.projectsPageHeading || "Projects";
  const subtitle = pageContent?.projectsPageSubtitle || "A collection of personal and freelance work";
  return {
    title: heading,
    description: subtitle,
    openGraph: {
      title: heading,
      description: subtitle,
    },
  };
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={`/projects/${project.slug.current}`}
      className="group block bg-surface rounded overflow-hidden border border-border hover:border-primary hover:bg-surface-hover transition-all"
      aria-label={`View project: ${project.title}`}
    >
      {project.image && (
        <div className="overflow-hidden aspect-video">
          <Image
            src={urlFor(project.image).width(480).height(270).url()}
            alt={project.title}
            width={480}
            height={270}
            className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-[family-name:var(--font-serif)] text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          {project.clientName && (
            <span className="text-[10px] bg-accent/15 text-accent px-2 py-0.5 rounded font-medium whitespace-nowrap flex-shrink-0 mt-0.5">
              {project.clientName}
            </span>
          )}
        </div>
        {project.summary && (
          <p className="text-muted text-sm line-clamp-3 mb-3">{project.summary}</p>
        )}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech._id}
                className="text-[10px] text-muted bg-bg px-2 py-0.5 rounded border border-border"
              >
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[10px] text-muted px-1">+{project.technologies.length - 4}</span>
            )}
          </div>
        )}
        <span className="text-sm text-primary font-medium">View →</span>
      </div>
    </a>
  );
}

function ProjectsSection({ heading, projects }: { heading: string; projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <section className="mb-16">
      <ScrollReveal>
        <h2 className="font-[family-name:var(--font-serif)] text-2xl md:text-3xl font-bold text-foreground mb-8">
          {heading}
        </h2>
      </ScrollReveal>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ScrollReveal key={project._id} delay={index * 60}>
            <ProjectCard project={project} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default async function ProjectsPage() {
  const [allProjects, contact, pageContent, settings] = await Promise.all([
    getProjects(),
    getContact(),
    getPageContent(),
    getSettings(),
  ]);

  const personalProjects = allProjects.filter(
    (p) => !p.projectType || p.projectType === "personal"
  );
  const freelanceProjects = allProjects.filter((p) => p.projectType === "freelance");

  return (
    <>
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} />
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
            <>
              <ProjectsSection heading="Personal Projects" projects={personalProjects} />
              <ProjectsSection heading="Freelance Work" projects={freelanceProjects} />
            </>
          )}
        </div>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} />
    </>
  );
}

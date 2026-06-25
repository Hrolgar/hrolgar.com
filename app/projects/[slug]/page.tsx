import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableText";
import Image from "next/image";
import { getContact, getPageContent, getProjectBySlug, getProjectSlugs, getSettings } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { breadcrumbJsonLd, buildSeoMetadata, jsonLdScript } from "@/lib/seo";
import type { Project } from "@/sanity/types";

export const revalidate = 3600;
const titleSuffix = " | hrolgar.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function cleanText(value?: string): string | undefined {
  const cleaned = value?.replace(/\s+/g, " ").trim();
  return cleaned || undefined;
}

function shortenDescription(value: string): string {
  if (value.length <= 160) return value;
  const trimmed = value.slice(0, 157);
  const lastSpace = trimmed.lastIndexOf(" ");
  return `${trimmed.slice(0, lastSpace > 110 ? lastSpace : 157).trim()}...`;
}

function firstPortableTextParagraph(blocks?: Project["description"]): string | undefined {
  const block = blocks?.find((item) => item._type === "block");
  const text = block?.children
    ?.map((child) => "text" in child ? child.text : "")
    .join(" ");
  return cleanText(text);
}

function projectDescriptor(project: Project): string {
  return (
    project.categories?.[0]?.title ||
    project.technologies?.[0]?.name ||
    (project.projectType ? `${project.projectType[0].toUpperCase()}${project.projectType.slice(1)} Project` : "Project")
  );
}

function projectMetadataTitle(project: Project): string {
  if (`${project.title}${titleSuffix}`.length >= 30) return project.title;
  return `${project.title} - ${projectDescriptor(project)}`;
}

function projectMetadataDescription(project: Project): string {
  const description = cleanText(project.summary) ||
    firstPortableTextParagraph(project.description) ||
    cleanText(project.problem) ||
    cleanText(project.approach) ||
    cleanText(project.outcome);

  if (description) return shortenDescription(description);

  return `Read about ${project.title}, a ${projectDescriptor(project).toLowerCase()} from Helgi Skjortnes covering the problem, approach, and what shipped.`;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((s) => ({ slug: s.slug.current }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found", alternates: { canonical: `/projects/${slug}` } };
  const title = projectMetadataTitle(project);
  const description = projectMetadataDescription(project);
  return buildSeoMetadata({
    title,
    description,
    path: `/projects/${slug}`,
    image: project.image,
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const [project, contact, pageContent, settings] = await Promise.all([getProjectBySlug(slug), getContact(), getPageContent(), getSettings()]);
  if (!project) notFound();

  return (
    <>
      {jsonLdScript(breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
        { name: project.title, path: `/projects/${slug}` },
      ]))}
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} />
      <main id="main-content" className="pt-24 pb-16 px-6">
        <article className="max-w-5xl mx-auto">
          {/* Back link */}
          <a
            href="/projects"
            className="text-sm text-muted hover:text-primary transition-colors mb-8 inline-block"
          >
            ← Back to projects
          </a>

          {/* Header */}
          <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {project.title}
          </h1>

          {project.summary && (
            <p className="text-lg text-muted mb-6">{project.summary}</p>
          )}

          {/* Links */}
          <div className="flex gap-4 mb-8">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-surface border border-border rounded text-sm text-muted hover:text-foreground hover:border-primary transition-all"
              >
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary text-white rounded text-sm hover:opacity-90 transition-opacity"
              >
                Live Demo
              </a>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((tech) => (
                <span
                  key={tech._id}
                  className="text-xs bg-surface px-3 py-1.5 rounded text-accent border border-border"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          )}

          {/* Cover image */}
          {project.image && (
            <div className="mb-10 rounded overflow-hidden border border-border">
              <Image
                src={urlFor(project.image).width(1200).height(630).url()}
                alt={project.title}
                width={1200}
                height={630}
                className="w-full object-cover"
                priority
              />
            </div>
          )}

          {/* Body */}
          {project.description && (
            <div className="prose-editorial max-w-3xl text-lg leading-relaxed">
              <PortableText value={project.description} components={portableTextComponents} />
            </div>
          )}

          {(project.problem || project.approach || project.outcome) && (
            <div className="mt-16 max-w-3xl">
              <h2 className="mb-10 font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground">
                Case Study
              </h2>
              <div className="space-y-10">
                {project.problem && (
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                      The Problem
                    </h3>
                    <p className="leading-relaxed text-muted">{project.problem}</p>
                  </div>
                )}
                {project.approach && (
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                      The Approach
                    </h3>
                    <p className="leading-relaxed text-muted">{project.approach}</p>
                  </div>
                )}
                {project.outcome && (
                  <div>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                      The Outcome
                    </h3>
                    <p className="leading-relaxed text-muted">{project.outcome}</p>
                  </div>
                )}
              </div>

              {project.testimonial && (
                <blockquote className="mt-10 border-l-2 border-accent pl-6">
                  <p className="leading-relaxed text-foreground italic">
                    &ldquo;{project.testimonial}&rdquo;
                  </p>
                  {project.clientName && (
                    <cite className="mt-3 block text-sm text-muted not-italic">
                      — {project.clientName}
                    </cite>
                  )}
                </blockquote>
              )}
            </div>
          )}
        </article>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} />
    </>
  );
}

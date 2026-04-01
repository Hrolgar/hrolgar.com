import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableText";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import {
  getAbout,
  getExperience,
  getContact,
  getPageContent,
  getSettings,
} from "@/sanity/lib/queries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Experience | Hrolgar",
    description: "Professional background — roles, responsibilities, and technologies across my career.",
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

function duration(start: string, end?: string): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  if (years === 0) return `${remaining}mo`;
  if (remaining === 0) return `${years}yr`;
  return `${years}yr ${remaining}mo`;
}

export default async function ExperiencePage() {
  const [about, experience, contact, pageContent, settings] = await Promise.all([
    getAbout(),
    getExperience(),
    getContact(),
    getPageContent(),
    getSettings(),
  ]);

  const resumeUrl = about?.resumeFile?.asset?.url;

  return (
    <>
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} />
      <main id="main-content" className="pt-24 pb-16 px-6 md:pb-24">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="mb-12">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Experience
                  </h1>
                  <p className="text-muted text-base max-w-2xl">
                    Professional background across backend development, infrastructure, and software engineering.
                  </p>
                </div>
                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-2 bg-surface border border-border rounded px-4 py-2 text-sm text-muted hover:text-foreground hover:border-primary transition-all"
                  >
                    Download resume ↓
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>

          {experience.length === 0 ? (
            <p className="text-muted py-20 text-center">No experience entries yet.</p>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[11px] top-4 bottom-4 w-px bg-border hidden md:block" />

              {experience.map((exp, index) => (
                <ScrollReveal key={exp._id} delay={index * 80}>
                  <div className="relative md:pl-10 py-8 border-b border-border last:border-b-0">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-10 w-[23px] h-[23px] rounded-full border-2 border-primary bg-bg hidden md:flex items-center justify-center">
                      <div className={`w-2 h-2 rounded-full ${!exp.endDate ? 'bg-primary' : 'bg-border'}`} />
                    </div>

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h2 className="font-[family-name:var(--font-serif)] text-xl font-semibold text-foreground">
                          {exp.role}
                        </h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted">
                          {exp.companyLogo && (
                            <Image
                              src={urlFor(exp.companyLogo).width(20).height(20).url()}
                              alt={exp.company}
                              width={20}
                              height={20}
                              className="rounded"
                            />
                          )}
                          <span className="font-medium text-foreground">{exp.company}</span>
                          {exp.location && <span>· {exp.location}</span>}
                        </div>
                      </div>
                      <div className="text-sm text-muted whitespace-nowrap flex-shrink-0">
                        <span>{formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}</span>
                        <span className="text-muted/50 ml-2">({duration(exp.startDate, exp.endDate)})</span>
                      </div>
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <div className="text-muted text-sm leading-relaxed prose-editorial mt-2">
                        <PortableText value={exp.description} components={portableTextComponents} />
                      </div>
                    )}

                    {/* Technologies */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech._id}
                            className="text-[10px] text-muted bg-surface px-2 py-0.5 rounded border border-border"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} siteName={settings?.siteName} navItems={pageContent?.navItems} showBlog={settings?.showBlog} />
    </>
  );
}

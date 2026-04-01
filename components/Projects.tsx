import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import type { Project } from "@/sanity/types";

interface Props {
  projects: Project[];
  heading?: string | null;
  intro?: string | null;
}

export default function Projects({ projects, heading, intro }: Props) {
  if (!projects?.length) return null;

  // Show up to 3: featured first, fill with non-featured if needed
  const featuredProjects = projects.filter((p) => p.featured);
  const nonFeatured = projects.filter((p) => !p.featured);
  const display = [...featuredProjects, ...nonFeatured].slice(0, 3);
  const [featured, ...rest] = display;

  return (
    <section id="projects" className="section-surface bg-surface py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="mb-12">
            <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground mb-3">{heading || 'Projects'}</h2>
            {intro && (
              <p className="text-muted text-base max-w-2xl">{intro}</p>
            )}
          </div>
        </ScrollReveal>

        {/* Featured project — big layout */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {featured.image && (
              <div className="md:w-3/5 overflow-hidden rounded transition-transform duration-300 hover:scale-[1.02]">
                <Image
                  src={urlFor(featured.image).width(720).height(420).url()}
                  alt={featured.title}
                  width={720}
                  height={420}
                  className="w-full object-cover"
                />
              </div>
            )}
            <div className={featured.image ? "md:w-2/5" : "w-full"}>
              <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground">
                {featured.title}
              </h3>
              {featured.summary && (
                <p className="text-muted text-sm mt-3">{featured.summary}</p>
              )}
              {featured.technologies && featured.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {featured.technologies.map((tech) => (
                    <span
                      key={tech._id}
                      className="text-xs bg-surface px-2.5 py-1 rounded text-muted border border-border"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-4 mt-4">
                {featured.slug?.current && (
                  <a
                    href={`/projects/${featured.slug.current}`}
                    className="text-sm text-primary hover:text-secondary transition-colors font-medium"
                  >
                    Read More →
                  </a>
                )}
                {featured.githubUrl && (
                  <a
                    href={featured.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {featured.liveUrl && (
                  <a
                    href={featured.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    Live
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Remaining projects — compact list */}
        {rest.length > 0 && (
          <div>
            {rest.map((project, index) => (
              <ScrollReveal key={project._id} delay={index * 30}>
                <div className="py-4 border-b border-border flex items-baseline justify-between gap-4 hover:bg-surface-hover rounded-lg px-3 -mx-3 transition-colors">
                  <div className="min-w-0">
                    <span className="font-semibold text-foreground">{project.title}</span>
                    {project.summary && (
                      <span className="text-muted text-sm ml-3">{project.summary}</span>
                    )}
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    {project.slug?.current && (
                      <a
                        href={`/projects/${project.slug.current}`}
                        className="text-sm text-primary hover:text-secondary transition-colors whitespace-nowrap"
                      >
                        View →
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted hover:text-foreground transition-colors whitespace-nowrap"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal delay={200}>
          <div className="mt-8 text-right">
            <a
              href="/projects"
              className="text-sm text-primary hover:text-secondary transition-colors font-medium"
            >
              View all projects →
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

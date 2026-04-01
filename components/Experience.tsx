import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import type { Experience as ExperienceType } from "@/sanity/types";

interface Props {
  experience: ExperienceType[];
  heading?: string | null;
  resumeUrl?: string | null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default function Experience({ experience, heading, resumeUrl }: Props) {
  if (!experience?.length) return null;

  // Show up to 4 most recent
  const display = experience.slice(0, 4);

  return (
    <section id="experience" className="section-surface bg-surface py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground">{heading || 'Experience'}</h2>
            <a
              href="/experience"
              className="text-sm text-primary hover:text-secondary transition-colors font-medium"
            >
              View full experience →
            </a>
          </div>
        </ScrollReveal>

        <div>
          {display.map((exp, index) => (
            <ScrollReveal key={exp._id} delay={index * 60}>
              <div className="py-4 border-b border-border last:border-b-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {exp.companyLogo && (
                    <Image
                      src={urlFor(exp.companyLogo).width(24).height(24).url()}
                      alt={exp.company}
                      width={24}
                      height={24}
                      className="rounded flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="font-semibold text-foreground">{exp.role}</span>
                    <span className="text-muted text-sm ml-2">{exp.company}</span>
                  </div>
                </div>
                <span className="text-sm text-muted whitespace-nowrap flex-shrink-0">
                  {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {resumeUrl && (
          <ScrollReveal delay={200}>
            <div className="mt-8 pt-6 border-t border-border">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors font-medium"
              >
                Download resume ↓
              </a>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableText";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import type { Experience as ExperienceType } from "@/sanity/types";

interface Props {
  experience: ExperienceType[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export default function Experience({ experience }: Props) {
  if (!experience?.length) return null;

  return (
    <section id="experience" className="section-surface bg-surface py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground mb-12">Experience</h2>
        </ScrollReveal>

        <div>
          {experience.map((exp, index) => (
            <ScrollReveal key={exp._id} delay={index * 80}>
              <div className="py-6 border-b border-border last:border-b-0">
                <h3 className="font-[family-name:var(--font-serif)] text-xl font-semibold text-foreground">
                  {exp.role}
                </h3>
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
                  <span>{exp.company}</span>
                  {exp.location && <span>· {exp.location}</span>}
                  <span>· {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}</span>
                </div>

                {exp.description && (
                  <div className="text-muted text-sm leading-relaxed prose-editorial mt-3">
                    <PortableText value={exp.description} components={portableTextComponents} />
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

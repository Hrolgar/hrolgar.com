import ScrollReveal from "./ScrollReveal";
import type { Skill } from "@/sanity/types";

interface Props {
  skills: Skill[];
  heading?: string | null;
}

export default function Skills({ skills, heading }: Props) {
  if (!skills?.length) return null;

  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" data-label="Technologies" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground mb-12">
          {heading || 'Technologies'}
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {Object.entries(groupedSkills).map(([category, items], index) => (
            <ScrollReveal key={category} delay={index * 40}>
              <div>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {items.map((skill) => (
                    <span
                      key={skill._id}
                      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground transition-all duration-150 hover:scale-105 hover:border-primary hover:text-primary"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

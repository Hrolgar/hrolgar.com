import ScrollReveal from "./ScrollReveal";
import type { HomelabService, HomelabStat } from "@/sanity/types";

const categoryLabels: Record<string, string> = {
  virtualization: "Virtualization",
  networking: "Networking",
  storage: "Storage",
  media: "Media",
  security: "Security",
  monitoring: "Monitoring",
  development: "Development",
  identity: "Identity",
  automation: "Automation",
  other: "Other",
};

interface Props {
  services: HomelabService[];
  heading?: string | null;
  subtitle?: string | null;
  stats?: HomelabStat[];
}

export default function Homelab({ services, heading, subtitle, stats }: Props) {
  if (!services?.length) return null;

  const preview = services.slice(0, 8);

  return (
    <section id="homelab" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-2">
          <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground">
            {heading || "Homelab"}
          </h2>
          <a
            href="/homelab"
            className="text-sm text-primary hover:text-secondary transition-colors font-medium"
          >
            Explore my homelab →
          </a>
        </div>
        <p className="text-muted text-sm mb-8 font-[family-name:var(--font-sans)]">
          {subtitle || "Self-hosted infrastructure and services"}
        </p>

        {/* Stats bar */}
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-10">
            {stats.map((stat) => (
              <div key={stat._key} className="flex items-baseline gap-2">
                <span className="text-primary font-bold text-lg">{stat.value}</span>
                <span className="text-muted text-xs uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Preview grid — flat list of first 8 services */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {preview.map((svc) => (
              <div
                key={svc._id}
                className="bg-surface border border-border rounded px-3 py-2 text-sm"
              >
                <div className="text-foreground font-medium truncate">{svc.name}</div>
                <div className="text-muted text-xs mt-0.5">
                  {categoryLabels[svc.category || "other"] || svc.category || "Other"}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

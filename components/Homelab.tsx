import ScrollReveal from "./ScrollReveal";
import ShaderBackground from "./ShaderBackground";
import type { HomelabStat } from "@/sanity/types";

interface Props {
  heading?: string | null;
  subtitle?: string | null;
  stats?: HomelabStat[];
}

export default function Homelab({ heading, subtitle, stats }: Props) {
  return (
    <section id="homelab" className="relative py-20 md:py-28 px-6 overflow-hidden">
      {/* Shader on the left side */}
      <ShaderBackground
        src="/shaders/kinetic-grid.html"
        className="hidden md:block !right-auto !left-0 !w-[50%]"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-start md:gap-16">
            {/* Left spacer — shader occupies this space on desktop */}
            <div className="hidden md:block md:w-1/2 flex-shrink-0" />

            {/* Right side — content */}
            <div className="md:w-1/2">
              <p className="text-xs uppercase tracking-[0.24em] text-primary mb-4">
                Self-Hosted Infrastructure
              </p>
              <h2 className="font-[family-name:var(--font-serif)] text-3xl md:text-4xl font-bold text-foreground mb-4">
                {heading || "Homelab"}
              </h2>
              <p className="text-muted text-base leading-relaxed mb-6">
                {subtitle || "Proxmox virtualization, Docker containers, ZFS storage, and 30+ self-hosted services — all managed with Infrastructure as Code."}
              </p>

              {/* Stats */}
              {stats && stats.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  {stats.map((stat) => (
                    <div key={stat._key}>
                      <span className="text-xl font-bold text-primary">{stat.value}</span>
                      <span className="text-xs text-muted uppercase tracking-wider ml-1.5">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <a
                href="/homelab"
                className="inline-flex items-center gap-2 text-primary hover:text-secondary text-sm font-medium transition-colors"
              >
                Explore my homelab
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

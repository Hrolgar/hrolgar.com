import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import type { HomelabService } from "@/sanity/types";

interface Props {
  services: HomelabService[];
}

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

export default function Homelab({ services }: Props) {
  if (!services?.length) return null;

  const categories = services.reduce<Record<string, HomelabService[]>>((acc, svc) => {
    const cat = svc.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {});

  return (
    <section id="homelab" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-[family-name:var(--font-serif)] text-4xl md:text-5xl font-bold text-foreground mb-2">Homelab</h2>
        <p className="text-muted text-sm mb-12 font-[family-name:var(--font-sans)]">Self-hosted infrastructure and services</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
          {Object.entries(categories).map(([category, items], index) => (
            <ScrollReveal key={category} delay={index * 80}>
              <div className="border-l-2 border-primary pl-4">
                <h3 className="text-xs uppercase tracking-wider text-primary mb-3">
                  {categoryLabels[category] || category}
                </h3>
                <div className="space-y-1.5">
                  {items.map((svc) => (
                    <div key={svc._id} className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        {svc.icon && (
                          <Image
                            src={urlFor(svc.icon).width(16).height(16).url()}
                            alt=""
                            width={16}
                            height={16}
                            className="rounded opacity-70"
                          />
                        )}
                        {svc.url ? (
                          <a
                            href={svc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:text-primary transition-colors truncate"
                          >
                            {svc.name}
                          </a>
                        ) : (
                          <span className="text-foreground truncate">{svc.name}</span>
                        )}
                      </div>
                      {svc.selfHosted && (
                        <span className="text-[10px] text-primary whitespace-nowrap">self-hosted</span>
                      )}
                    </div>
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

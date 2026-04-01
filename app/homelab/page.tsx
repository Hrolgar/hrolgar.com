import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/lib/portableText";
import {
  getHomelabPage,
  getHomelabServices,
  getContact,
  getPageContent,
  getSettings,
} from "@/sanity/lib/queries";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { HomelabService } from "@/sanity/types";

export const revalidate = 3600;

export async function generateMetadata() {
  return {
    title: "Homelab | Hrolgar",
    description:
      "A look inside my self-hosted infrastructure — Proxmox virtualization, Docker, ZFS storage, and 30+ services managed with Infrastructure as Code.",
  };
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

export default async function HomelabDetailPage() {
  const [homelabPage, homelabServices, contact, pageContent, settings] =
    await Promise.all([
      getHomelabPage(),
      getHomelabServices(),
      getContact(),
      getPageContent(),
      getSettings(),
    ]);

  const heading = pageContent?.homelabPageHeading || "My Homelab";

  const categories = homelabServices.reduce<Record<string, HomelabService[]>>(
    (acc, svc) => {
      const cat = svc.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(svc);
      return acc;
    },
    {}
  );

  const hasContent = homelabPage?.intro || homelabPage?.hardware?.length || homelabPage?.architecture;

  return (
    <>
      <Navbar navItems={pageContent?.navItems} siteName={settings?.siteName} showBlog={settings?.showBlog} />
      <main id="main-content" className="px-6 pb-16 pt-24 md:pb-24">
        <div className="mx-auto max-w-5xl">

          {/* Page header */}
          <section className="pb-12 md:pb-16">
            <p className="mb-5 text-sm uppercase tracking-[0.24em] text-primary">
              Infrastructure
            </p>
            <h1 className="font-[family-name:var(--font-serif)] text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              {heading}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              A self-hosted environment running on enterprise hardware at home — Proxmox
              virtualization, Docker containers, ZFS storage pools, and everything managed
              through Infrastructure as Code.
            </p>
          </section>

          {/* Stats bar */}
          {homelabPage?.stats && homelabPage.stats.length > 0 && (
            <ScrollReveal>
              <section className="py-8 border-y border-border">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {homelabPage.stats.map((stat) => (
                    <div key={stat._key} className="text-center">
                      <div className="text-3xl font-bold text-primary font-[family-name:var(--font-serif)]">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted uppercase tracking-wider mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}

          {/* Intro / Philosophy */}
          {homelabPage?.intro && (
            <ScrollReveal>
              <section className="mt-16 max-w-3xl">
                <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground mb-6">
                  Why Self-Host?
                </h2>
                <div className="prose-editorial text-lg leading-relaxed">
                  <PortableText
                    value={homelabPage.intro}
                    components={portableTextComponents}
                  />
                </div>
              </section>
            </ScrollReveal>
          )}

          {/* Hardware */}
          {homelabPage?.hardware && homelabPage.hardware.length > 0 && (
            <section className="mt-20">
              <ScrollReveal>
                <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground mb-3">
                  Hardware
                </h2>
                <p className="text-muted text-base mb-8">The physical machines running everything.</p>
              </ScrollReveal>
              <div className="grid md:grid-cols-2 gap-6">
                {homelabPage.hardware.map((hw, index) => (
                  <ScrollReveal key={hw._key} delay={index * 80}>
                    <div className="bg-surface rounded-lg border border-border p-6 h-full">
                      {hw.image && (
                        <div className="mb-4 rounded overflow-hidden">
                          <Image
                            src={urlFor(hw.image).width(400).height(225).url()}
                            alt={hw.name}
                            width={400}
                            height={225}
                            className="w-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-foreground">{hw.name}</h3>
                      {hw.description && (
                        <p className="text-muted text-sm mt-1">{hw.description}</p>
                      )}
                      {hw.specs && (
                        <pre className="font-[family-name:var(--font-mono)] text-xs text-muted bg-bg p-3 rounded mt-3 whitespace-pre-line border border-border">
                          {hw.specs}
                        </pre>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}

          {/* Architecture */}
          {homelabPage?.architecture && (
            <ScrollReveal>
              <section className="mt-20 max-w-3xl">
                <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground mb-6">
                  Architecture
                </h2>
                <div className="prose-editorial text-lg leading-relaxed">
                  <PortableText
                    value={homelabPage.architecture}
                    components={portableTextComponents}
                  />
                </div>
              </section>
            </ScrollReveal>
          )}

          {/* Services grid — always shows since we have homelabService data */}
          {homelabServices.length > 0 && (
            <section className={hasContent ? "mt-20" : "mt-8"}>
              <ScrollReveal>
                <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-foreground mb-3">
                  Services
                </h2>
                <p className="text-muted text-base mb-8">
                  {homelabServices.length} services across {Object.keys(categories).length} categories, all self-hosted and self-managed.
                </p>
              </ScrollReveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
                {Object.entries(categories).map(([category, items], index) => (
                  <ScrollReveal key={category} delay={index * 80}>
                    <div className="border-l-2 border-primary pl-4">
                      <h3 className="text-xs uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
                        {categoryLabels[category] || category}
                        <span className="text-muted/50">({items.length})</span>
                      </h3>
                      <div className="space-y-1.5">
                        {items.map((svc) => (
                          <div
                            key={svc._id}
                            className="flex items-center justify-between gap-2 text-sm"
                          >
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
                                <span className="text-foreground truncate">
                                  {svc.name}
                                </span>
                              )}
                            </div>
                            {svc.selfHosted && (
                              <span className="text-[10px] text-primary whitespace-nowrap">
                                self-hosted
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer
        contact={contact}
        footerTagline={pageContent?.footerTagline}
        siteName={settings?.siteName}
        navItems={pageContent?.navItems}
        showBlog={settings?.showBlog}
      />
    </>
  );
}

import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { portableTextComponents } from "@/lib/portableText";
import { getContact, getPageContent, getServiceBySlug, getServiceSlugs } from "@/sanity/lib/queries";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const iconMap: Record<string, string> = {
  api: "⟷",
  backend: "⚙",
  automation: "▶",
};

function getServiceIcon(icon?: string) {
  if (!icon) return "•";
  return iconMap[icon] || icon;
}

export async function generateStaticParams() {
  const services = await getServiceSlugs();
  return services
    .filter((service) => service.slug?.current)
    .map((service) => ({ slug: service.slug.current }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: `${service.title} — Ullrhome`,
    description: service.summary || `${service.title} — professional service by Hrolgar`,
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const [service, contact, pageContent] = await Promise.all([getServiceBySlug(slug), getContact(), getPageContent()]);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar navItems={pageContent?.navItems} />
      <main id="main-content" className="px-6 pb-16 pt-24">
        <article className="mx-auto max-w-3xl">
          <a
            href="/services"
            className="mb-8 inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-primary"
          >
            ← Back to services
          </a>

          <div className="border-b border-border pb-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius)] border border-accent/20 bg-accent/10 text-2xl text-accent">
                {getServiceIcon(service.icon)}
              </div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">Service</p>
            </div>

            <h1 className="font-[family-name:var(--font-serif)] text-4xl font-bold text-foreground md:text-5xl">
              {service.title}
            </h1>

            {service.summary && (
              <p className="mt-6 text-lg leading-relaxed text-muted">
                {service.summary}
              </p>
            )}
          </div>

          {service.description && (
            <div className="prose-editorial mt-10 text-base leading-relaxed">
              <PortableText value={service.description} components={portableTextComponents} />
            </div>
          )}

          <section className="mt-16 rounded-[calc(var(--radius)*2)] border border-border bg-surface p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.24em] text-accent">Next step</p>
            <h2 className="mt-4 font-[family-name:var(--font-serif)] text-2xl font-bold text-foreground">
              {pageContent?.serviceDetailCtaHeading || 'Interested in this service?'}
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted">
              {pageContent?.serviceDetailCtaDescription || "Let\u2019s discuss your project, the constraints you\u2019re working with, and what a practical delivery plan could look like."}
            </p>
            <a
              href="/contact"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-accent px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-accent)_88%,white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {pageContent?.serviceDetailCtaButtonText || 'Start a conversation'}
            </a>
          </section>
        </article>
      </main>
      <Footer contact={contact} footerTagline={pageContent?.footerTagline} />
    </>
  );
}

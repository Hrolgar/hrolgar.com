import type { Metadata } from "next";
import { getSettings } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hrolgar.com";

export const personJsonLd = {
  "@type": "Person",
  "@id": "https://hrolgar.com/#person",
  name: "Helgi Skjortnes",
  url: SITE_URL,
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function jsonLdHtml(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function jsonLdScript(data: unknown) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }}
    />
  );
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** FAQPage node built from the CMS faq documents. Returns null when there is nothing
 *  to describe, so a page never emits an empty FAQPage. */
export function faqPageJsonLd(faqs: Array<{ question?: string; answer?: string }>) {
  const entries = faqs.filter((f) => f.question && f.answer);
  if (entries.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Review node for a project that carries a client testimonial. No rating is emitted:
 *  the CMS stores the quote and the client name, not a score, and inventing one would
 *  be a fabricated rich result. */
export function projectReviewJsonLd(project: {
  title?: string;
  slug?: { current: string };
  testimonial?: string;
  clientName?: string;
}) {
  if (!project.testimonial || !project.clientName || !project.slug?.current) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    reviewBody: project.testimonial,
    author: { "@type": "Person", name: project.clientName },
    itemReviewed: {
      "@type": "CreativeWork",
      name: project.title,
      url: absoluteUrl(`/projects/${project.slug.current}`),
    },
  };
}

export async function getDefaultOgImage(): Promise<string | undefined> {
  const settings = await getSettings();
  return settings?.ogImage ? urlFor(settings.ogImage).width(1200).height(630).url() : undefined;
}

export async function getOgImage(image?: SanityImage): Promise<string | undefined> {
  if (image) return urlFor(image).width(1200).height(630).url();
  return getDefaultOgImage();
}

export async function buildSeoMetadata({
  title,
  description,
  path,
  image,
  imageUrl,
  ogTitle,
  openGraphType = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string | Metadata["title"];
  description: string;
  path: string;
  image?: SanityImage;
  imageUrl?: string;
  ogTitle?: string;
  openGraphType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Promise<Metadata> {
  const resolvedImage = imageUrl || await getOgImage(image);
  const images = resolvedImage ? [{ url: resolvedImage }] : undefined;
  const resolvedTitle = ogTitle || (typeof title === "string" ? title : undefined);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: openGraphType,
      title: resolvedTitle,
      description,
      url: path,
      images,
      ...(openGraphType === "article" && {
        publishedTime,
        modifiedTime,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: resolvedImage ? [resolvedImage] : undefined,
    },
  };
}

import type { Metadata } from "next";
import { getSettings } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/types";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hrolgar.com";

export const personJsonLd = {
  "@type": "Person",
  name: "Helgi Skjortnes",
  url: SITE_URL,
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function jsonLdScript(data: unknown) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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

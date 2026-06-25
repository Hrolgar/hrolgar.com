import type { MetadataRoute } from "next";
import { getProjectSlugs, getPostSlugs, getCategories, getServiceSlugs } from "@/sanity/lib/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hrolgar.com";
const staticLastModified = new Date("2026-06-20T00:00:00.000Z");

function lastModifiedFrom(value?: string): Date {
  return value ? new Date(value) : staticLastModified;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs, categories, serviceSlugs] = await Promise.all([
    getProjectSlugs(),
    getPostSlugs(),
    getCategories(),
    getServiceSlugs(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: staticLastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/projects`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/experience`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/homelab`, lastModified: staticLastModified, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectPages: MetadataRoute.Sitemap = projectSlugs.map((s) => ({
    url: `${baseUrl}/projects/${s.slug.current}`,
    lastModified: lastModifiedFrom(s._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = postSlugs.map((s) => ({
    url: `${baseUrl}/blog/${s.slug.current}`,
    lastModified: lastModifiedFrom(s._updatedAt || s.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/blog/category/${c.slug.current}`,
    lastModified: lastModifiedFrom(c._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((s) => ({
    url: `${baseUrl}/services/${s.slug.current}`,
    lastModified: lastModifiedFrom(s._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages, ...postPages, ...categoryPages, ...servicePages];
}

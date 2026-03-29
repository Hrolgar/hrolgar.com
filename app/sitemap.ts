import type { MetadataRoute } from "next";
import { getProjectSlugs, getPostSlugs, getCategories } from "@/sanity/lib/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ullrhome.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs, categories] = await Promise.all([
    getProjectSlugs(),
    getPostSlugs(),
    getCategories(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const projectPages: MetadataRoute.Sitemap = projectSlugs.map((s) => ({
    url: `${baseUrl}/projects/${s.slug.current}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = postSlugs.map((s) => ({
    url: `${baseUrl}/blog/${s.slug.current}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/blog/category/${c.slug.current}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...projectPages, ...postPages, ...categoryPages];
}

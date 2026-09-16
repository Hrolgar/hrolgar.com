import type { MetadataRoute } from "next";
import { getProjectSlugs, getPostSlugs, getCategories, getServiceSlugs } from "@/sanity/lib/queries";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hrolgar.com";

// Regenerate hourly. Without this the sitemap is built once and never sees new CMS
// content: it sat at 32 URLs while the site had ~50 pages. The Sanity webhook also
// revalidates /sitemap.xml directly (app/api/revalidate/route.ts), so a publish shows
// up immediately; this is the backstop for anything that misses the webhook.
export const revalidate = 3600;

// Fallback only. Every static page derives its lastmod from the newest content it
// actually lists, so the date means something rather than being the day it was typed.
const FALLBACK_LAST_MODIFIED = new Date("2026-06-20T00:00:00.000Z");

function lastModifiedFrom(value?: string): Date {
  return value ? new Date(value) : FALLBACK_LAST_MODIFIED;
}

/** Newest _updatedAt in a set of documents, or the fallback when the set is empty. */
function newestOf(docs: { _updatedAt?: string; publishedAt?: string }[]): Date {
  const times = docs
    .map((d) => d._updatedAt || d.publishedAt)
    .filter((t): t is string => Boolean(t))
    .map((t) => new Date(t).getTime())
    .filter((t) => !Number.isNaN(t));
  return times.length > 0 ? new Date(Math.max(...times)) : FALLBACK_LAST_MODIFIED;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectSlugs, postSlugs, categories, serviceSlugs] = await Promise.all([
    getProjectSlugs(),
    getPostSlugs(),
    getCategories(),
    getServiceSlugs(),
  ]);

  const projectsUpdated = newestOf(projectSlugs);
  const postsUpdated = newestOf(postSlugs);
  const servicesUpdated = newestOf(serviceSlugs);
  const siteUpdated = new Date(
    Math.max(projectsUpdated.getTime(), postsUpdated.getTime(), servicesUpdated.getTime()),
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: siteUpdated, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/projects`, lastModified: projectsUpdated, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: servicesUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: postsUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: FALLBACK_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/experience`, lastModified: FALLBACK_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/homelab`, lastModified: FALLBACK_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
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

  // A category page that lists nothing is a thin page. Submitting four of them was
  // actively unhelpful while every post sat in draft, so only categories that a
  // published post actually references get into the sitemap.
  const usedCategoryIds = new Set(
    postSlugs.flatMap((p) => (p.categories || []).map((c) => c._ref).filter(Boolean)),
  );
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((c) => usedCategoryIds.has(c._id))
    .map((c) => ({
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

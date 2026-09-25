import type { MetadataRoute } from "next";
import { getProjectSlugs, getPostSlugs, getServiceSlugs, getPrivacyPage } from "@/sanity/lib/queries";
import { withLocale } from "@/sanity/locale";

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
  const [projectSlugs, postSlugs, serviceSlugs, privacy] = await Promise.all([
    getProjectSlugs(),
    getPostSlugs(),
    getServiceSlugs(),
    getPrivacyPage(),
  ]);

  const projectsUpdated = newestOf(projectSlugs);
  const postsUpdated = newestOf(postSlugs);
  const servicesUpdated = newestOf(serviceSlugs);
  const siteUpdated = new Date(
    Math.max(projectsUpdated.getTime(), postsUpdated.getTime(), servicesUpdated.getTime()),
  );

  // Every page that exists in both languages is listed TWICE, once per language, each
  // carrying the hreflang pair. Listing only the English URL is what kept /no out of the
  // index entirely: the Norwegian pages are linked from nothing Google crawls, so the
  // sitemap is their only way in, and an hreflang annotation on one side only is ignored.
  const bilingual: { path: string; lastModified: Date; changeFrequency: "weekly" | "monthly"; priority: number }[] = [
    { path: "", lastModified: siteUpdated, changeFrequency: "weekly", priority: 1 },
    { path: "/projects", lastModified: projectsUpdated, changeFrequency: "weekly", priority: 0.9 },
    { path: "/services", lastModified: servicesUpdated, changeFrequency: "monthly", priority: 0.9 },
    { path: "/blog", lastModified: postsUpdated, changeFrequency: "weekly", priority: 0.8 },
    { path: "/contact", lastModified: FALLBACK_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { path: "/experience", lastModified: FALLBACK_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { path: "/homelab", lastModified: FALLBACK_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", lastModified: lastModifiedFrom(privacy?.lastUpdated), changeFrequency: "monthly", priority: 0.2 },
  ];

  const staticPages: MetadataRoute.Sitemap = bilingual.flatMap((page) => {
    const en = `${baseUrl}${page.path}`;
    const nb = `${baseUrl}${withLocale(page.path, "nb")}`;
    const languages = { en, "nb-NO": nb, "x-default": en };
    const shared = {
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      alternates: { languages },
    };
    return [
      { url: en, ...shared, priority: page.priority },
      // The Norwegian pages rank for a smaller market and are a translation of the
      // English ones, so they sit a notch below their English twin rather than
      // competing with it.
      { url: nb, ...shared, priority: Math.round((page.priority - 0.1) * 10) / 10 },
    ];
  });

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

  // Category pages are noindex (see app/blog/category/[slug]/page.tsx), so they stay out of the
  // sitemap: listing a URL that asks not to be indexed is a contradiction Search Console flags.
  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((s) => ({
    url: `${baseUrl}/services/${s.slug.current}`,
    lastModified: lastModifiedFrom(s._updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages, ...postPages, ...servicePages];
}

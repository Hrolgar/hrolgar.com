import { cache } from "react";
import { client } from "./client";
import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE } from "@/sanity/locale";
import { resolveLocale } from "@/sanity/lib/resolveLocale";
import type {
  SiteSettings,
  About,
  Skill,
  Experience,
  Project,
  ProjectCategory,
  ContactInfo,
  Post,
  Category,
  Certification,
  HomelabService,
  HomelabPage,
  Service,
  FAQ,
  PageContent,
  ContactForm,
} from "@/sanity/types";

/**
 * Fetch, then collapse translatable fields to one language.
 *
 * There is one document per thing, so the queries carry no language filter at all and read
 * the same as they did before translation existed. Everything language-aware happens in
 * `resolveLocale`, which is why adding a language does not touch this file.
 */
async function localised<T>(
  query: string,
  locale: Locale,
  params: Record<string, unknown> = {},
): Promise<T> {
  return resolveLocale<T>(await client.fetch(query, params), locale);
}

// --- Singletons ---

export const getSettings = cache(async function getSettings(): Promise<SiteSettings | null> {
  return client.fetch(`*[_type == "siteSettings"][0]`);
});

export async function getAbout(locale: Locale = DEFAULT_LOCALE): Promise<About | null> {
  return localised(`*[_type == "about"][0]{
    ...,
    "resumeFile": resumeFile{asset->{url}}
  }`, locale);
}

export const getContact = cache(async function getContact(): Promise<ContactInfo | null> {
  return client.fetch(`*[_type == "contactInfo"][0]`);
});

// --- Collections ---

export async function getSkills(): Promise<Skill[]> {
  return (await client.fetch(
    `*[_type == "skill"] | order(category asc, order asc)`
  )) || [];
}

export async function getExperience(locale: Locale = DEFAULT_LOCALE): Promise<Experience[]> {
  return (await localised(
    `*[_type == "experience"] | order(startDate desc) { ..., technologies[]-> }`, locale
  )) || [];
}

export async function getProjects(locale: Locale = DEFAULT_LOCALE): Promise<Project[]> {
  return (await localised(
    `*[_type == "project"] | order(featured desc, order asc) { ..., technologies[]->, categories[]-> }`, locale
  )) || [];
}

export async function getProjectBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Project | null> {
  return localised(
    `*[_type == "project" && slug.current == $slug][0] { ..., technologies[]->, categories[]-> }`, locale,
    { slug }
  );
}

export async function getProjectSlugs(): Promise<{ slug: { current: string }; _updatedAt?: string }[]> {
  return (await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ slug, _updatedAt }`
  )) || [];
}

// --- Blog ---

export async function getPosts(limit?: number, locale: Locale = DEFAULT_LOCALE): Promise<Post[]> {
  const limitClause = limit ? `[0...${limit}]` : "";
  return (await localised(
    `*[_type == "post" && status == "published"] | order(publishedAt desc) ${limitClause} {
      ...,
      categories[]->,
    }`, locale
  )) || [];
}

export async function getFeaturedPosts(locale: Locale = DEFAULT_LOCALE): Promise<Post[]> {
  return (await localised(
    `*[_type == "post" && featured == true && status == "published"] | order(publishedAt desc) [0...3] {
      ...,
      categories[]->,
    }`, locale
  )) || [];
}

export async function getPostBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Post | null> {
  return localised(
    `*[_type == "post" && slug.current == $slug && status == "published"][0] {
      ...,
      _updatedAt,
      title,
      publishedAt,
      coverImage,
      categories[]->,
    }`, locale,
    { slug }
  );
}

export async function getPostSlugs(): Promise<{
  slug: { current: string };
  _updatedAt?: string;
  publishedAt?: string;
  categories?: { _ref: string }[];
}[]> {
  // categories come back as raw references so the sitemap can tell which category
  // pages would actually list something.
  return (await client.fetch(
    `*[_type == "post" && defined(slug.current) && status == "published"]{ slug, _updatedAt, publishedAt, categories }`
  )) || [];
}

export async function getCategories(locale: Locale = DEFAULT_LOCALE): Promise<Category[]> {
  return (await localised(
    // Ordered by the default language: the running order of a list must not change
    // depending on which language a visitor is reading it in.
    `*[_type == "category"] | order(title.${DEFAULT_LOCALE} asc) { ..., _updatedAt }`, locale
  )) || [];
}

export async function getPostsByCategory(categorySlug: string, locale: Locale = DEFAULT_LOCALE): Promise<Post[]> {
  return (await localised(
    `*[_type == "post" && $categorySlug in categories[]->slug.current && status == "published"] | order(publishedAt desc) {
      ...,
      categories[]->,
    }`, locale,
    { categorySlug }
  )) || [];
}

// --- Certifications ---

export async function getCertifications(): Promise<Certification[]> {
  return (await client.fetch(
    `*[_type == "certification"] | order(order asc, issueDate desc)`
  )) || [];
}

// --- Homelab ---

export async function getHomelabServices(): Promise<HomelabService[]> {
  return (await client.fetch(
    `*[_type == "homelabService"] | order(category asc, order asc)`
  )) || [];
}

export async function getHomelabPage(locale: Locale = DEFAULT_LOCALE): Promise<HomelabPage | null> {
  return localised(`*[_type == "homelabPage"][0]`, locale);
}

// --- Project Categories ---

export async function getProjectCategories(locale: Locale = DEFAULT_LOCALE): Promise<ProjectCategory[]> {
  return (await localised(
    `*[_type == "projectCategory"] | order(order asc, title.${DEFAULT_LOCALE} asc) {...}`, locale
  )) || [];
}

// --- Project filters ---

export async function getProjectsByType(type: string, locale: Locale = DEFAULT_LOCALE): Promise<Project[]> {
  return (await localised(
    `*[_type == "project" && projectType == $type] | order(featured desc, order asc) { ..., technologies[]-> }`, locale,
    { type }
  )) || [];
}

export async function getFeaturedProjects(limit = 4, locale: Locale = DEFAULT_LOCALE): Promise<Project[]> {
  return (await localised(
    `*[_type == "project" && featured == true] | order(order asc) [0...$limit] { ..., technologies[]-> }`, locale,
    { limit }
  )) || [];
}

// --- Services ---

export async function getServices(locale: Locale = DEFAULT_LOCALE): Promise<Service[]> {
  return (await localised(
    `*[_type == "service"] | order(featured desc, order asc) {...}`, locale
  )) || [];
}

export async function getServiceBySlug(slug: string, locale: Locale = DEFAULT_LOCALE): Promise<Service | null> {
  return localised(
    `*[_type == "service" && slug.current == $slug][0]{
      ...,
      _updatedAt,
      title
    }`, locale,
    { slug }
  );
}

export async function getServiceSlugs(): Promise<{ slug: { current: string }; _updatedAt?: string }[]> {
  return (await client.fetch(
    `*[_type == "service" && defined(slug.current)]{ slug, _updatedAt }`
  )) || [];
}

// --- FAQ ---

export async function getFAQs(locale: Locale = DEFAULT_LOCALE): Promise<FAQ[]> {
  return (await localised(
    `*[_type == "faq"] | order(order asc) {...}`, locale
  )) || [];
}

// --- Page Content ---

export const getPageContent = cache(async function getPageContent(
  locale: Locale = DEFAULT_LOCALE,
): Promise<PageContent | null> {
  return localised(`*[_type == "pageContent"][0]`, locale);
});

// --- Contact Forms ---

export async function getContactForms(): Promise<ContactForm[]> {
  return (await client.fetch(
    `*[_type == "contactForm"] | order(_createdAt asc)`
  )) || [];
}

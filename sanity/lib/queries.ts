import { cache } from "react";
import { client } from "./client";
import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE } from "@/sanity/locale";
import { langFilter, listWithFallback } from "@/sanity/lib/localeQuery";

/** Singletons (about, pageContent, homelabPage) have no slug: match on type + language,
 *  falling back to the English document when no translation exists. */
function bySlugOrSingleton(type: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return `*[_type == "${type}" && ${langFilter(locale)}][0]`;
  return `coalesce(*[_type == "${type}" && language == "${locale}"][0], *[_type == "${type}" && ${langFilter(DEFAULT_LOCALE)}][0])`;
}
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

// --- Singletons ---

export const getSettings = cache(async function getSettings(): Promise<SiteSettings | null> {
  return client.fetch(`*[_type == "siteSettings"][0]`);
});

export async function getAbout(locale: Locale = DEFAULT_LOCALE): Promise<About | null> {
  return client.fetch(`${bySlugOrSingleton("about", locale)}{
    ...,
    "resumeFile": resumeFile{asset->{url}}
  }`);
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
  return (await client.fetch(
    listWithFallback("experience", locale, "{ ..., technologies[]-> }", " | order(startDate desc)")
  )) || [];
}

export async function getProjects(locale: Locale = DEFAULT_LOCALE): Promise<Project[]> {
  return (await client.fetch(
    listWithFallback("project", locale, "{ ..., technologies[]->, categories[]-> }", " | order(featured desc, order asc)")
  )) || [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] { ..., technologies[]->, categories[]-> }`,
    { slug }
  );
}

export async function getProjectSlugs(): Promise<{ slug: { current: string }; _updatedAt?: string }[]> {
  return (await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ slug, _updatedAt }`
  )) || [];
}

// --- Blog ---

export async function getPosts(limit?: number): Promise<Post[]> {
  const limitClause = limit ? `[0...${limit}]` : "";
  return (await client.fetch(
    `*[_type == "post" && status == "published"] | order(publishedAt desc) ${limitClause} {
      ...,
      categories[]->,
    }`
  )) || [];
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return (await client.fetch(
    `*[_type == "post" && featured == true && status == "published"] | order(publishedAt desc) [0...3] {
      ...,
      categories[]->,
    }`
  )) || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug && status == "published"][0] {
      ...,
      _updatedAt,
      title,
      publishedAt,
      coverImage,
      categories[]->,
    }`,
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
  return (await client.fetch(
    listWithFallback("category", locale, "{ ..., _updatedAt }", " | order(title asc)")
  )) || [];
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return (await client.fetch(
    `*[_type == "post" && $categorySlug in categories[]->slug.current && status == "published"] | order(publishedAt desc) {
      ...,
      categories[]->,
    }`,
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

export async function getHomelabPage(): Promise<HomelabPage | null> {
  return client.fetch(`*[_type == "homelabPage"][0]`);
}

// --- Project Categories ---

export async function getProjectCategories(locale: Locale = DEFAULT_LOCALE): Promise<ProjectCategory[]> {
  return (await client.fetch(
    listWithFallback("projectCategory", locale, "{...}", " | order(order asc, title asc)")
  )) || [];
}

// --- Project filters ---

export async function getProjectsByType(type: string): Promise<Project[]> {
  return (await client.fetch(
    `*[_type == "project" && projectType == $type] | order(featured desc, order asc) { ..., technologies[]-> }`,
    { type }
  )) || [];
}

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  return (await client.fetch(
    `*[_type == "project" && featured == true] | order(order asc) [0...$limit] { ..., technologies[]-> }`,
    { limit }
  )) || [];
}

// --- Services ---

export async function getServices(locale: Locale = DEFAULT_LOCALE): Promise<Service[]> {
  return (await client.fetch(
    listWithFallback("service", locale, "{...}", " | order(featured desc, order asc)")
  )) || [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return client.fetch(
    `*[_type == "service" && slug.current == $slug][0]{
      ...,
      _updatedAt,
      title
    }`,
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
  return (await client.fetch(
    listWithFallback("faq", locale, "{...}", " | order(order asc)")
  )) || [];
}

// --- Page Content ---

export const getPageContent = cache(async function getPageContent(
  locale: Locale = DEFAULT_LOCALE,
): Promise<PageContent | null> {
  return client.fetch(bySlugOrSingleton("pageContent", locale));
});

// --- Contact Forms ---

export async function getContactForms(): Promise<ContactForm[]> {
  return (await client.fetch(
    `*[_type == "contactForm"] | order(_createdAt asc)`
  )) || [];
}

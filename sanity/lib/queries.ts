import { client } from "./client";
import type {
  SiteSettings,
  About,
  Skill,
  Experience,
  Project,
  ContactInfo,
  Post,
  Category,
  Certification,
  HomelabService,
  Service,
  FAQ,
  PageContent,
  ContactForm,
} from "@/sanity/types";

// --- Singletons ---

export async function getSettings(): Promise<SiteSettings | null> {
  return client.fetch(`*[_type == "siteSettings"][0]`);
}

export async function getAbout(): Promise<About | null> {
  return client.fetch(`*[_type == "about"][0]{
    ...,
    "resumeFile": resumeFile{asset->{url}}
  }`);
}

export async function getContact(): Promise<ContactInfo | null> {
  return client.fetch(`*[_type == "contactInfo"][0]`);
}

// --- Collections ---

export async function getSkills(): Promise<Skill[]> {
  return (await client.fetch(
    `*[_type == "skill"] | order(category asc, order asc)`
  )) || [];
}

export async function getExperience(): Promise<Experience[]> {
  return (await client.fetch(
    `*[_type == "experience"] | order(startDate desc) { ..., technologies[]-> }`
  )) || [];
}

export async function getProjects(): Promise<Project[]> {
  return (await client.fetch(
    `*[_type == "project"] | order(featured desc, order asc) { ..., technologies[]-> }`
  )) || [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug][0] { ..., technologies[]-> }`,
    { slug }
  );
}

export async function getProjectSlugs(): Promise<{ slug: { current: string } }[]> {
  return (await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ slug }`
  )) || [];
}

// --- Blog ---

export async function getPosts(limit?: number): Promise<Post[]> {
  const limitClause = limit ? `[0...${limit}]` : "";
  return (await client.fetch(
    `*[_type == "post"] | order(publishedAt desc) ${limitClause} {
      ...,
      categories[]->,
    }`
  )) || [];
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return (await client.fetch(
    `*[_type == "post" && featured == true] | order(publishedAt desc) [0...3] {
      ...,
      categories[]->,
    }`
  )) || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      ...,
      categories[]->,
    }`,
    { slug }
  );
}

export async function getPostSlugs(): Promise<{ slug: { current: string } }[]> {
  return (await client.fetch(
    `*[_type == "post" && defined(slug.current)]{ slug }`
  )) || [];
}

export async function getCategories(): Promise<Category[]> {
  return (await client.fetch(
    `*[_type == "category"] | order(title asc)`
  )) || [];
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  return (await client.fetch(
    `*[_type == "post" && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
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

// --- Services ---

export async function getServices(): Promise<Service[]> {
  return (await client.fetch(
    `*[_type == "service"] | order(featured desc, order asc)`
  )) || [];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return client.fetch(
    `*[_type == "service" && slug.current == $slug][0]`,
    { slug }
  );
}

export async function getServiceSlugs(): Promise<{ slug: { current: string } }[]> {
  return (await client.fetch(
    `*[_type == "service" && defined(slug.current)]{ slug }`
  )) || [];
}

// --- FAQ ---

export async function getFAQs(): Promise<FAQ[]> {
  return (await client.fetch(
    `*[_type == "faq"] | order(order asc)`
  )) || [];
}

// --- Page Content ---

export async function getPageContent(): Promise<PageContent | null> {
  return client.fetch(`*[_type == "pageContent"][0]`);
}

// --- Contact Forms ---

export async function getContactForms(): Promise<ContactForm[]> {
  return (await client.fetch(
    `*[_type == "contactForm"] | order(_createdAt asc)`
  )) || [];
}

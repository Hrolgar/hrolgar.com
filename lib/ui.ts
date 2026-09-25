import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE } from "@/sanity/locale";

/**
 * Interface strings that live in components rather than the CMS.
 *
 * These are the labels an editor would never think to translate because they are not
 * content: "View", "Featured", "Present", the skip link. Left hardcoded they turn a
 * Norwegian page into a half-English one, which is exactly what the first pass produced.
 *
 * Content still belongs in Sanity. This is only for chrome that has no document behind it.
 */
const STRINGS = {
  en: {
    skipToContent: "Skip to content",
    hireMe: "Hire Me",
    featured: "Featured",
    featuredServices: "Featured services",
    view: "View",
    readMore: "Read More",
    learnMore: "Learn more",
    viewAllPosts: "View all posts",
    viewAllProjects: "View all projects",
    allProjects: "All Projects",
    personalProjects: "Personal Projects",
    freelanceWork: "Freelance Work",
    type: "Type",
    categories: "Categories",
    all: "All",
    personal: "Personal",
    freelance: "Freelance",
    present: "Present",
    downloadResume: "Download resume",
    backToBlog: "Back to blog",
    minRead: "min read",
    navigate: "Navigate",
    servicesLabel: "Services",
    social: "Social",
    privacy: "Privacy",
    lastUpdated: "Last updated",
    hireFlow: "Hire flow",
    generalContact: "General contact",
    experienceTitle: "Experience",
    experienceIntro:
      "Professional background across backend development, infrastructure, and software engineering.",
    noExperience: "No experience entries yet.",
    noProjects: "No projects yet. Check back soon.",
    noProjectsInCategory: "No projects in this category yet.",
    noPosts: "No posts yet. Check back soon.",
    infrastructure: "Infrastructure",
    homelabIntro:
      "A self-hosted environment running on enterprise hardware at home. Proxmox virtualization, Docker containers, ZFS storage pools, and everything managed through Infrastructure as Code.",
    hardware: "Hardware",
    hardwareIntro: "The physical machines running everything.",
    architecture: "Architecture",
    homelabServicesIntro:
      "{count} services across {categories} categories, all self-hosted and self-managed.",
    detailsComingSoon: "Details coming soon.",
    servicesUpdating: "Services are being updated",
    servicesUpdatingBody:
      "The service catalog is in progress. Reach out directly if you want to discuss integrations, APIs, or automation work.",
    startAProject: "Start a project",
    getInTouch: "Get in touch",
    availableForWork: "Available for freelance work",
    exploreHomelab: "Explore my homelab",
    selfHostedInfrastructure: "Self-Hosted Infrastructure",
    viewFullExperience: "View full experience",
    contactTitle: "Contact",
    whatICanHelpWith: "What I can help with",
    findMeElsewhere: "Find me elsewhere",
    profile: "Profile",
    commonQuestions: "Common Questions",
    invalidEmail: "Please provide a valid email address.",
    fixHighlightedFields: "Please correct the highlighted fields and try again.",
    submitFailed: "Something went wrong. Please try again or email directly.",
    selectOption: "Select an option",
    collapseForm: "Collapse contact form",
    closeForm: "Close contact form",
    close: "Close",
    sending: "Sending...",
    sendMessage: "Send Message",
    messageSent: "Message sent",
    thanksReply: "Thanks! I'll get back to you soon.",
    navHome: "Home",
    navProjects: "Projects",
    navExperience: "Experience",
    navServices: "Services",
    navHomelab: "Homelab",
    navBlog: "Blog",
    navContact: "Contact",
    language: "Language",
    projectsPageHeading: "Projects",
    projectsPageSubtitle: "A collection of personal and freelance work",
  },
  nb: {
    skipToContent: "Hopp til innhold",
    hireMe: "Lei meg",
    featured: "Utvalgt",
    featuredServices: "Utvalgte tjenester",
    view: "Se mer",
    readMore: "Les mer",
    learnMore: "Les mer",
    viewAllPosts: "Se alle innlegg",
    viewAllProjects: "Se alle prosjekter",
    allProjects: "Alle prosjekter",
    personalProjects: "Egne prosjekter",
    freelanceWork: "Kundeoppdrag",
    type: "Type",
    categories: "Kategorier",
    all: "Alle",
    personal: "Egne",
    freelance: "Kunde",
    present: "Nå",
    downloadResume: "Last ned CV",
    backToBlog: "Tilbake til bloggen",
    minRead: "min lesing",
    navigate: "Meny",
    servicesLabel: "Tjenester",
    social: "Sosialt",
    privacy: "Personvern",
    lastUpdated: "Sist oppdatert",
    hireFlow: "Slik jobber vi",
    generalContact: "Generell kontakt",
    experienceTitle: "Erfaring",
    experienceIntro:
      "Yrkesbakgrunn fra backendutvikling, infrastruktur og programvareutvikling.",
    noExperience: "Ingen oppføringer ennå.",
    noProjects: "Ingen prosjekter ennå. Kom tilbake snart.",
    noProjectsInCategory: "Ingen prosjekter i denne kategorien ennå.",
    noPosts: "Ingen innlegg ennå. Kom tilbake snart.",
    infrastructure: "Infrastruktur",
    homelabIntro:
      "Et selvhostet miljø som kjører på utstyr av serverklasse hjemme. Proxmox-virtualisering, Docker-containere, ZFS-lagring, og alt styrt som kode.",
    hardware: "Maskinvare",
    hardwareIntro: "Maskinene som kjører alt.",
    architecture: "Arkitektur",
    homelabServicesIntro:
      "{count} tjenester fordelt på {categories} kategorier, alle selvhostet og driftet selv.",
    detailsComingSoon: "Detaljer kommer.",
    servicesUpdating: "Tjenestene oppdateres",
    servicesUpdatingBody:
      "Tjenestekatalogen er under arbeid. Ta kontakt direkte hvis du vil snakke om integrasjoner, API-er eller automatisering.",
    startAProject: "Start et prosjekt",
    getInTouch: "Ta kontakt",
    availableForWork: "Ledig for oppdrag",
    exploreHomelab: "Se hjemmelabben",
    selfHostedInfrastructure: "Selvhostet infrastruktur",
    viewFullExperience: "Se hele erfaringen",
    contactTitle: "Kontakt",
    whatICanHelpWith: "Dette kan jeg hjelpe med",
    findMeElsewhere: "Finn meg andre steder",
    profile: "Profil",
    commonQuestions: "Vanlige spørsmål",
    invalidEmail: "Oppgi en gyldig e-postadresse.",
    fixHighlightedFields: "Rett opp feltene som er merket, og prøv igjen.",
    submitFailed: "Noe gikk galt. Prøv igjen, eller send en e-post direkte.",
    selectOption: "Velg et alternativ",
    collapseForm: "Lukk skjemaet",
    closeForm: "Lukk kontaktskjemaet",
    close: "Lukk",
    sending: "Sender ...",
    sendMessage: "Send melding",
    messageSent: "Meldingen er sendt",
    thanksReply: "Takk! Jeg svarer så snart jeg kan.",
    navHome: "Hjem",
    navProjects: "Prosjekter",
    navExperience: "Erfaring",
    navServices: "Tjenester",
    navHomelab: "Hjemmelab",
    navBlog: "Blogg",
    navContact: "Kontakt",
    language: "Språk",
    projectsPageHeading: "Prosjekter",
    projectsPageSubtitle: "Egne prosjekter og kundeoppdrag",
  },
} as const;

export type UiKey = keyof (typeof STRINGS)["en"];

export function t(key: UiKey, locale: Locale = DEFAULT_LOCALE): string {
  return STRINGS[locale]?.[key] ?? STRINGS[DEFAULT_LOCALE][key];
}

/** Same as `t`, with `{name}` placeholders filled in. */
export function tf(
  key: UiKey,
  locale: Locale = DEFAULT_LOCALE,
  vars: Record<string, string | number> = {},
): string {
  return t(key, locale).replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

/** Default site navigation, for when the CMS has no `navItems` for this locale. */
export function defaultNav(locale: Locale = DEFAULT_LOCALE): { label: string; href: string }[] {
  return [
    { label: t("navHome", locale), href: "/" },
    { label: t("navProjects", locale), href: "/projects" },
    { label: t("navExperience", locale), href: "/experience" },
    { label: t("navServices", locale), href: "/services" },
    { label: t("navHomelab", locale), href: "/homelab" },
    { label: t("navBlog", locale), href: "/blog" },
    { label: t("navContact", locale), href: "/contact" },
  ];
}

/**
 * Display names for the `skill.category` enum.
 *
 * The raw values are lowercase slugs, and the Skills section printed them as-is, so both
 * languages showed headings like "database". They are a fixed list in the schema rather
 * than editable content, so they belong here and not in Sanity.
 */
const SKILL_CATEGORIES: Record<string, { en: string; nb: string }> = {
  language: { en: "Languages", nb: "Språk" },
  framework: { en: "Frameworks", nb: "Rammeverk" },
  tool: { en: "Tools", nb: "Verktøy" },
  platform: { en: "Platforms", nb: "Plattformer" },
  database: { en: "Databases", nb: "Databaser" },
  devops: { en: "DevOps", nb: "DevOps" },
  other: { en: "Other", nb: "Annet" },
};

export function skillCategory(value: string, locale: Locale = DEFAULT_LOCALE): string {
  const entry = SKILL_CATEGORIES[value?.toLowerCase()];
  return entry ? entry[locale] ?? entry.en : value;
}

/**
 * The three services linked from the footer. A curated shortlist, not the whole catalogue,
 * and the hrefs stay on the English detail pages because those are the only ones that exist.
 */
export function footerServices(locale: Locale = DEFAULT_LOCALE): { label: string; href: string }[] {
  const labels =
    locale === "nb"
      ? ["API- og integrasjonsutvikling", "Backend-systemer og .NET", "Infrastruktur og automatisering"]
      : ["API & Integration Development", "Backend Systems & .NET", "Infrastructure & Automation"];
  const hrefs = ["/services/api-integration", "/services/backend-dotnet", "/services/infrastructure-automation"];
  return labels.map((label, i) => ({ label, href: hrefs[i] }));
}

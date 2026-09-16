/**
 * Locales for hrolgar.com.
 *
 * English is the default and lives at the root (`/services`). Norwegian lives under `/no`
 * with the SAME English slug (`/no/services`). The English URLs must not move: they are
 * the site's only indexed search presence, and putting everything behind `/en` would
 * discard it. Translated slugs were considered and rejected, because they double the
 * route tree for no gain when the pages render from one component either way.
 */
export const LOCALES = ["en", "nb"] as const;
export type Locale = (typeof LOCALES)[number];

// `satisfies` rather than `: Locale`, so the type is the literal "en" and not the whole
// union. Types like `Exclude<Locale, typeof DEFAULT_LOCALE>` — "every language that needs a
// translation" — collapse to `never` otherwise, and silently stop checking anything.
export const DEFAULT_LOCALE = "en" satisfies Locale;

/** URL prefix for a locale. English has none, by design. */
export const localePrefix: Record<Locale, string> = { en: "", nb: "/no" };

/** `lang` attribute and hreflang value. */
export const localeHtmlLang: Record<Locale, string> = { en: "en", nb: "nb-NO" };

export const localeLabel: Record<Locale, string> = { en: "English", nb: "Norsk" };

/**
 * Two-letter code for the language toggle. Matches the URL segment, so "NO" and not "NB":
 * the address bar says /no, and a visitor comparing the two should see the same thing.
 * The full name is still what a screen reader announces.
 */
export const localeShort: Record<Locale, string> = { en: "EN", nb: "NO" };

/**
 * The URL segment for a locale: "no" for Norwegian, because the prefix is `/no`.
 *
 * Derived rather than listed, so the segment and the prefix cannot disagree. Note the
 * segment is NOT the locale code: the language is `nb`, the URL says `no`, and Norwegians
 * type /no.
 */
export const localeSegment: Record<Locale, string> = Object.fromEntries(
  LOCALES.map((locale) => [locale, localePrefix[locale].replace(/^\//, "")]),
) as Record<Locale, string>;

/** Locales that live under a URL prefix, i.e. everything except the default. */
export const PREFIXED_LOCALES = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

/** The locale a URL segment belongs to, or null when the segment is not a language. */
export function localeFromSegment(segment: string): Locale | null {
  return PREFIXED_LOCALES.find((locale) => localeSegment[locale] === segment) ?? null;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Localised path for an English path. Slugs stay English in both languages
 * (`/services` and `/no/services`), so the two route trees mirror each other exactly and
 * a localised path is just the prefix plus the English one.
 */
export function withLocale(path: string, locale: Locale): string {
  return `${localePrefix[locale]}${path}`;
}

/**
 * Pages that exist in both languages. Case studies, blog posts, service detail pages and
 * blog categories are English-only, so a link to one from a Norwegian page has to stay on
 * the English URL: prefixing it would point at a route that does not exist.
 */
const LOCALISED_PATHS = new Set([
  "/",
  "/projects",
  "/services",
  "/contact",
  "/experience",
  "/homelab",
  "/blog",
]);

/**
 * Rewrite an internal link for the current locale.
 *
 * Every hardcoded `href="/contact"` in a shared component sends a Norwegian visitor back
 * to the English site, which is how the first pass ended up with `/no` pages you could
 * not stay inside. Run internal links through this instead.
 */
export function localeHref(href: string, locale: Locale = DEFAULT_LOCALE): string {
  if (locale === DEFAULT_LOCALE || !href.startsWith("/")) return href;
  const cut = href.search(/[#?]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const rest = cut === -1 ? "" : href.slice(cut);
  if (!LOCALISED_PATHS.has(path)) return href;
  return `${localePrefix[locale]}${path === "/" ? "" : path}${rest}` || "/";
}

/** Is this English path available in every language? */
export function hasTranslation(path: string): boolean {
  return LOCALISED_PATHS.has(path);
}

/** Drop any locale prefix, giving the English path. `/no/services` -> `/services`. */
export function stripLocale(path: string): string {
  for (const locale of PREFIXED_LOCALES) {
    const prefix = localePrefix[locale];
    if (path === prefix) return "/";
    if (path.startsWith(`${prefix}/`)) return path.slice(prefix.length);
  }
  return path;
}

/**
 * The same page in another language, for the language switcher.
 *
 * Case studies, blog posts and service detail pages exist in English only, so there is no
 * counterpart to send anyone to. Those fall back to that language's home page rather than
 * to a URL that would 404, which is the one thing a language switcher must never do.
 */
export function counterpartPath(path: string, locale: Locale): string {
  const english = stripLocale(path.split(/[?#]/)[0]);
  const target = hasTranslation(english) ? english : "/";
  return withLocale(target === "/" ? "" : target, locale) || "/";
}

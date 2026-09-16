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

export const DEFAULT_LOCALE: Locale = "en";

/** URL prefix for a locale. English has none, by design. */
export const localePrefix: Record<Locale, string> = { en: "", nb: "/no" };

/** `lang` attribute and hreflang value. */
export const localeHtmlLang: Record<Locale, string> = { en: "en", nb: "nb-NO" };

export const localeLabel: Record<Locale, string> = { en: "English", nb: "Norsk" };

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

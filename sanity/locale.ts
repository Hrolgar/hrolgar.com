/**
 * Locales for hrolgar.com.
 *
 * English is the default and lives at the root (`/services`). Norwegian lives under `/no`
 * (`/no/tjenester`). The English URLs must not move: they are the site's only indexed
 * search presence, and putting everything behind `/en` would discard it.
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
 * Localised path for a route that is already an English path.
 * Norwegian slugs are deliberately NOT derived here; they come from the CMS per document,
 * because "tjenester" is not something you can compute from "services".
 */
export function withLocale(path: string, locale: Locale): string {
  return `${localePrefix[locale]}${path}`;
}

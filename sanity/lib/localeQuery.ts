import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE } from "@/sanity/locale";

/**
 * GROQ fragments for document-level translation.
 *
 * The rule everywhere: a locale gets its own document when one exists, and the English
 * document otherwise. Translation can therefore be partial and progressive, which is the
 * whole reason for choosing document-level over field-level. A page with no Norwegian
 * version serves English rather than 404ing or rendering blank.
 *
 * Documents created before this existed have no `language` at all, so every filter treats
 * a missing value as English. Without that, the entire existing site would vanish from
 * every query the moment this shipped.
 */

/** Matches documents in `locale`, treating a missing language as English. */
export function langFilter(locale: Locale): string {
  return locale === DEFAULT_LOCALE
    ? `(!defined(language) || language == "en")`
    : `language == "${locale}"`;
}

/**
 * Single document by slug with fallback: the localised one if it exists, else English.
 * `coalesce` picks the first non-null, so the fallback costs nothing when a translation
 * is present.
 */
export function bySlugWithFallback(type: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) {
    return `*[_type == "${type}" && slug.current == $slug && ${langFilter(locale)}][0]`;
  }
  // Norwegian document matched on its own slug, else the English document for that slug.
  return `coalesce(
    *[_type == "${type}" && slug.current == $slug && language == "${locale}"][0],
    *[_type == "${type}" && slug.current == $slug && ${langFilter(DEFAULT_LOCALE)}][0]
  )`;
}

/**
 * List of documents for a locale, falling back per item.
 *
 * Returns every English document, replaced by its translation where one points at it. Doing
 * it this way rather than "all Norwegian docs, then top up with English" keeps the English
 * ordering and count authoritative, so a half-translated site lists the same things in the
 * same order in both languages.
 */
export function listWithFallback(type: string, locale: Locale, projection = "{...}", order = ""): string {
  const en = `*[_type == "${type}" && ${langFilter(DEFAULT_LOCALE)}]${order}`;
  if (locale === DEFAULT_LOCALE) return `${en} ${projection}`;
  return `${en} {
    "_localised": *[_type == "${type}" && language == "${locale}" && translationOf._ref == ^._id][0],
    ...
  } {
    ...coalesce(_localised, @),
    "_id": _id
  } ${projection}`;
}

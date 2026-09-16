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
 * Single document by slug: the English document, with the translation's fields laid over it.
 *
 * The merge is per FIELD, not per document. A translator who fills in the title and leaves
 * the body for later should get a Norwegian title over the English body, not a page with no
 * body at all. Document-level replacement is what emptied the About section on `/no`:
 * `about-nb` has no `body`, and swapping the whole document swapped the bio away with it.
 * Unset fields are absent in Sanity rather than null, so the spread simply does not
 * override them.
 */
export function bySlugWithFallback(type: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) {
    return `*[_type == "${type}" && slug.current == $slug && ${langFilter(locale)}][0]`;
  }
  return `*[_type == "${type}" && slug.current == $slug && ${langFilter(DEFAULT_LOCALE)}][0] {
    "_localised": *[_type == "${type}" && slug.current == $slug && language == "${locale}"][0],
    ...
  } {
    ...,
    ..._localised,
    "_id": _id,
    "_localised": null
  }`;
}

/**
 * List of documents for a locale, falling back per FIELD.
 *
 * Returns every English document with its translation's fields laid over it. Doing it this
 * way rather than "all Norwegian docs, then top up with English" keeps the English ordering
 * and count authoritative, so a half-translated site lists the same things in the same order
 * in both languages, and a half-translated DOCUMENT shows English for what is still missing
 * instead of a gap.
 */
export function listWithFallback(type: string, locale: Locale, projection = "{...}", order = ""): string {
  const en = `*[_type == "${type}" && ${langFilter(DEFAULT_LOCALE)}]${order}`;
  if (locale === DEFAULT_LOCALE) return `${en} ${projection}`;
  return `${en} {
    "_localised": *[_type == "${type}" && language == "${locale}" && translationOf._ref == ^._id][0],
    ...
  } {
    ...,
    ..._localised,
    "_id": _id,
    "_localised": null
  } ${projection}`;
}

import type {Locale} from "@/sanity/locale";
import {DEFAULT_LOCALE} from "@/sanity/locale";

/**
 * Collapse translatable fields down to one language, after fetching.
 *
 * A translatable field arrives from Sanity as `{_type: "localeString", en: "...", nb: "..."}`.
 * Every component wants a plain string. Doing that in GROQ would mean a `coalesce(...)` on
 * every field in every one of the thirty-odd projections, and a new language would mean
 * editing all of them again. Doing it once here means the queries and the components never
 * learn that translation exists.
 *
 * Falls back to English per FIELD, not per document: a half-translated project shows
 * Norwegian where Norwegian was written and English everywhere else, rather than reverting
 * the whole document or rendering gaps.
 */

const LOCALE_TYPES = new Set([
  "localeString",
  "localeText",
  "localeBlock",
  "localeStringList",
]);

function isLocaleField(value: Record<string, unknown>): boolean {
  return typeof value._type === "string" && LOCALE_TYPES.has(value._type);
}

function walk(value: unknown, locale: Locale): unknown {
  if (Array.isArray(value)) return value.map((item) => walk(item, locale));
  if (value === null || typeof value !== "object") return value;

  const record = value as Record<string, unknown>;

  if (isLocaleField(record)) {
    const chosen = record[locale];
    const filled = Array.isArray(chosen) ? chosen.length > 0 : chosen !== undefined && chosen !== null && chosen !== "";
    // An empty Norwegian box is not a translation, it is an untranslated field.
    return walk(filled ? chosen : record[DEFAULT_LOCALE] ?? null, locale);
  }

  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(record)) out[key] = walk(item, locale);
  return out;
}

export function resolveLocale<T>(value: unknown, locale: Locale = DEFAULT_LOCALE): T {
  return walk(value, locale) as T;
}

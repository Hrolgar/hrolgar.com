import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE, localeHtmlLang } from "@/sanity/locale";

/**
 * Date formatting for both locales.
 *
 * Six components each carried their own `toLocaleDateString("en-US", …)`, so every
 * Norwegian page printed "March 10, 2026" under a Norwegian headline. One place, one
 * locale tag, and nothing to keep in step by hand.
 */

/** Full date: "March 10, 2026" / "10. mars 2026". */
export function formatDate(dateStr: string, locale: Locale = DEFAULT_LOCALE): string {
  return new Date(dateStr).toLocaleDateString(localeHtmlLang[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Month and year, for the experience timeline: "Aug 2023" / "aug. 2023". */
export function formatMonthYear(dateStr: string, locale: Locale = DEFAULT_LOCALE): string {
  return new Date(dateStr).toLocaleDateString(localeHtmlLang[locale], {
    year: "numeric",
    month: "short",
  });
}

/** How long a role lasted: "2yr 1mo" / "2 år 1 mnd". */
export function duration(start: string, end?: string, locale: Locale = DEFAULT_LOCALE): string {
  const s = new Date(start);
  const e = end ? new Date(end) : new Date();
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  const yr = locale === "nb" ? " år" : "yr";
  const mo = locale === "nb" ? " mnd" : "mo";
  if (years === 0) return `${remaining}${mo}`;
  if (remaining === 0) return `${years}${yr}`;
  return `${years}${yr} ${remaining}${mo}`;
}

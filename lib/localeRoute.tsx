import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/sanity/locale";
import {
  DEFAULT_LOCALE,
  PREFIXED_LOCALES,
  localeFromSegment,
  localeSegment,
  withLocale,
} from "@/sanity/locale";
import { buildSeoMetadata, withAlternates } from "@/lib/seo";
import { pageMeta, pagePath, type PageKey } from "@/lib/pageMeta";

/**
 * The plumbing shared by every translated route.
 *
 * There used to be one hand-written file per page per language under `app/no/`. Seven files
 * that said the same thing, and seven more for the next language. These routes live under
 * `app/[locale]/` instead and read the language list, so adding a language adds no files.
 */

export type LocaleParams = { params: Promise<{ locale: string }> };

/** Which language segments get built. English is not one: it lives at the root. */
export function localeStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale: localeSegment[locale] }));
}

/** The locale for a URL segment. A segment that is not a language is a 404, not English. */
export async function localeFromParams(params: LocaleParams["params"]): Promise<Locale> {
  const { locale } = await params;
  const resolved = localeFromSegment(locale);
  if (!resolved) notFound();
  return resolved;
}

/** Title, description, canonical and the hreflang set for one translated page. */
export async function localePageMetadata(
  params: LocaleParams["params"],
  page: PageKey,
): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const english = pagePath[page];
  const meta = await buildSeoMetadata({
    ...pageMeta[locale as Exclude<Locale, typeof DEFAULT_LOCALE>][page],
    path: withLocale(english === "/" ? "" : english, locale),
  });
  return withAlternates(meta, english);
}

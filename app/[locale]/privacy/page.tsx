import type { Metadata } from "next";
import { PrivacyBody } from "@/app/privacy/page";
import HtmlLang from "@/components/HtmlLang";
import {
  localeFromParams,
  localePageMetadata,
  localeStaticParams,
  type LocaleParams,
} from "@/lib/localeRoute";

export const revalidate = 3600;
// Only the languages in LOCALES exist. `dynamicParams = false` makes anything else a 404 at
// the ROUTER, which is the only way to get a real 404 status: relying on notFound() inside
// the page instead gave /xx the 404 page with an HTTP 200, a soft 404 that Google indexes.
// The webhook must therefore revalidate this route by its PATTERN, not by concrete path —
// see app/api/revalidate/route.ts.
export const dynamicParams = false;
export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return localePageMetadata(params, "privacy");
}

export default async function Page({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  return (
    <>
      <HtmlLang locale={locale} />
      <PrivacyBody locale={locale} />
    </>
  );
}

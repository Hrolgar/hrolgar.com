import type { Metadata } from "next";
import { ProjectsBody } from "@/app/projects/page";
import HtmlLang from "@/components/HtmlLang";
import {
  localeFromParams,
  localePageMetadata,
  localeStaticParams,
  type LocaleParams,
} from "@/lib/localeRoute";

export const revalidate = 3600;
// Only the languages in LOCALES are built. Anything else under this segment is a 404
// rather than a silent copy of the English page.
export const dynamicParams = false;
export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return localePageMetadata(params, "projects");
}

export default async function Page({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  return (
    <>
      <HtmlLang locale={locale} />
      <ProjectsBody locale={locale} />
    </>
  );
}

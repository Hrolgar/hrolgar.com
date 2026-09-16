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
// The languages in LOCALES are prerendered. `dynamicParams` stays TRUE so the page can be
// regenerated on demand: with it false, `revalidatePath("/no/contact")` drops the prebuilt
// entry and nothing is allowed to rebuild it, which took every /no page to a 404 the first
// time the Sanity webhook fired. Unknown segments are still a 404, because
// `localeFromParams` calls notFound() for anything that is not a language.
export const dynamicParams = true;
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

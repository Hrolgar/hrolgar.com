import type { Metadata } from "next";
import { IntegrationsPageBody } from "@/app/integrations/page";
import HtmlLang from "@/components/HtmlLang";
import {
  localeFromParams,
  localePageMetadata,
  localeStaticParams,
  type LocaleParams,
} from "@/lib/localeRoute";

export const revalidate = 3600;
// Same as the other translated list pages: unknown languages are a 404 at the router.
export const dynamicParams = false;
export const generateStaticParams = localeStaticParams;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  return localePageMetadata(params, "integrations");
}

export default async function Page({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  return (
    <>
      <HtmlLang locale={locale} />
      <IntegrationsPageBody locale={locale} />
    </>
  );
}

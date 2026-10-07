import type { Metadata } from "next";
import { IntegrationBody, integrationMetadata } from "@/app/integrations/[slug]/page";
import HtmlLang from "@/components/HtmlLang";
import { localeFromParams, localeStaticParams } from "@/lib/localeRoute";
import { getIntegrationSlugs } from "@/sanity/lib/queries";

export const revalidate = 3600;
// dynamicParams = true for the same reason as services/[slug]: a newly published
// integration gets its Norwegian page without a deploy, and notFound() is a real 404.
export const dynamicParams = true;

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const integrations = await getIntegrationSlugs();
  return localeStaticParams().flatMap(({ locale }) =>
    integrations.map((i) => ({ locale, slug: i.slug.current })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const { slug } = await params;
  return integrationMetadata(slug, locale);
}

export default async function Page({ params }: Params) {
  const locale = await localeFromParams(params);
  const { slug } = await params;
  return (
    <>
      <HtmlLang locale={locale} />
      <IntegrationBody slug={slug} locale={locale} />
    </>
  );
}

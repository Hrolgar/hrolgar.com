import type { Metadata } from "next";
import { ServiceBody, serviceMetadata } from "@/app/services/[slug]/page";
import HtmlLang from "@/components/HtmlLang";
import { localeFromParams, localeStaticParams } from "@/lib/localeRoute";
import { getServiceSlugs } from "@/sanity/lib/queries";

export const revalidate = 3600;
// Unlike the other translated pages this one is dynamicParams = true, so a service added in
// the CMS gets its Norwegian page without a deploy. That used to be unsafe: with the root
// loading.tsx an unknown segment rendered the 404 page with HTTP 200. That file is gone, so
// notFound() below (unknown language or unknown slug) now answers a real 404.
export const dynamicParams = true;

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const services = await getServiceSlugs();
  return localeStaticParams().flatMap(({ locale }) =>
    services.filter((s) => s.slug?.current).map((s) => ({ locale, slug: s.slug.current })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const locale = await localeFromParams(params);
  const { slug } = await params;
  return serviceMetadata(slug, locale);
}

export default async function Page({ params }: Params) {
  const locale = await localeFromParams(params);
  const { slug } = await params;
  return (
    <>
      <HtmlLang locale={locale} />
      <ServiceBody slug={slug} locale={locale} />
    </>
  );
}

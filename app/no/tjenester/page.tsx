import type { Metadata } from "next";
import { ServicesPageBody } from "@/app/services/page";
import { buildSeoMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Tjenester: backend, integrasjoner og dataplattformer",
    description:
      "Frilans systemutvikler i Ålesund. Backend og API-er i .NET, systemintegrasjoner, dataplattformer og infrastrukturen som holder dem i drift.",
    path: "/no/tjenester",
  });
  // hreflang: without these Google reads the two pages as duplicates rather than as the
  // same page in two languages, and picks one to show. x-default points at English.
  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      languages: {
        en: "/services",
        "nb-NO": "/no/tjenester",
        "x-default": "/services",
      },
    },
  };
}

export default async function TjenesterPage() {
  return <ServicesPageBody locale="nb" />;
}

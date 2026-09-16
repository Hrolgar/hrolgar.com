import type { Metadata } from "next";
import { ServicesPageBody } from "@/app/services/page";
import { buildSeoMetadata, withAlternates } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Tjenester: backend, integrasjoner og dataplattformer",
    description:
      "Frilans systemutvikler i Ålesund. Backend og API-er i .NET, systemintegrasjoner, dataplattformer og infrastrukturen som holder dem i drift.",
    path: "/no/services",
  });
  return withAlternates(meta, "/services");
}

export default async function ServicesPageNb() {
  return <ServicesPageBody locale="nb" />;
}

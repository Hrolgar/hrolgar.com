import type { Metadata } from "next";
import { HomeBody } from "@/app/page";
import { buildSeoMetadata, withAlternates } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Helgi Skjortnes: frilans .NET- og integrasjonsutvikler",
    description:
      "Frilans systemutvikler i Ålesund. Backend, API-er og integrasjoner i .NET, dataplattformer og infrastrukturen som holder dem i drift.",
    path: "/no",
  });
  return withAlternates(meta, "/");
}

export default async function Page() {
  return <HomeBody locale="nb" />;
}

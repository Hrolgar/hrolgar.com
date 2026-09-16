import type { Metadata } from "next";
import { ExperienceBody } from "@/app/experience/page";
import { buildSeoMetadata, withAlternates } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Erfaring: backend, .NET og infrastruktur",
    description:
      "Bakgrunn fra backend-utvikling, .NET, systemintegrasjon og infrastruktur, både i produktteam og som frilanser.",
    path: "/no/experience",
  });
  return withAlternates(meta, "/experience");
}

export default async function Page() {
  return <ExperienceBody locale="nb" />;
}

import type { Metadata } from "next";
import { ProjectsBody } from "@/app/projects/page";
import { buildSeoMetadata, withAlternates } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Prosjekter: backend, automatisering og infrastruktur",
    description:
      "Et utvalg av systemene jeg har bygget for kunder og meg selv. Hvert prosjekt sier hva problemet var og hva som faktisk ble levert.",
    path: "/no/projects",
  });
  return withAlternates(meta, "/projects");
}

export default async function Page() {
  return <ProjectsBody locale="nb" />;
}

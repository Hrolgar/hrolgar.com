import type { Metadata } from "next";
import { ContactBody } from "@/app/contact/page";
import { buildSeoMetadata, withAlternates } from "@/lib/seo";
import HtmlLang from "@/components/HtmlLang";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Kontakt: backend, integrasjoner og dataplattformer",
    description:
      "Ta kontakt om backend-utvikling, .NET-API-er, systemintegrasjon, dataplattformer eller et system som har vokst seg uoversiktlig.",
    path: "/no/contact",
  });
  return withAlternates(meta, "/contact");
}

export default async function Page() {
  return (
    <>
      <HtmlLang locale="nb" />
      <ContactBody locale="nb" />
    </>
  );
}

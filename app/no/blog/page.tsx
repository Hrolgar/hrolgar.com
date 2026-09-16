import type { Metadata } from "next";
import { BlogBody } from "@/app/blog/page";
import { buildSeoMetadata, withAlternates } from "@/lib/seo";
import HtmlLang from "@/components/HtmlLang";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Blogg: notater fra backend, drift og selvhosting",
    description:
      "Notater fra ekte bygg: backend, integrasjoner, hjemmelab og de bitene av infrastruktur som var verdt å skrive ned.",
    path: "/no/blog",
  });
  return withAlternates(meta, "/blog");
}

export default async function Page() {
  return (
    <>
      <HtmlLang locale="nb" />
      <BlogBody locale="nb" />
    </>
  );
}

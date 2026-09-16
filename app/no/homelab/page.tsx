import type { Metadata } from "next";
import { HomelabBody } from "@/app/homelab/page";
import { buildSeoMetadata, withAlternates } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await buildSeoMetadata({
    title: "Hjemmelab: Proxmox, Docker og infrastruktur som kode",
    description:
      "En titt inn i min egen selvhostede infrastruktur: Proxmox, Docker, ZFS-lagring og rundt femti tjenester styrt som kode.",
    path: "/no/homelab",
  });
  return withAlternates(meta, "/homelab");
}

export default async function Page() {
  return <HomelabBody locale="nb" />;
}

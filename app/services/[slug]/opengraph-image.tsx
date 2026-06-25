import { client } from "@/sanity/lib/client";
import { makeOgImage, ogSize } from "@/lib/og-image";

export const revalidate = 3600;
export const contentType = "image/png";
export const size = ogSize;

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const service = await client.fetch<{ title?: string } | null>(
    `*[_type == "service" && slug.current == $slug][0]{ title }`,
    { slug }
  );
  return makeOgImage(service?.title || "Service", "Services");
}

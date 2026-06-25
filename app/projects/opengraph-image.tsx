import { makeOgImage, ogSize } from "@/lib/og-image";

export const revalidate = 3600;
export const contentType = "image/png";
export const size = ogSize;

export default function OpenGraphImage() {
  return makeOgImage("Projects", "Work");
}

import { ImageResponse } from "next/og";
import { client } from "@/sanity/lib/client";

export const revalidate = 3600;
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

interface ImageProps {
  params: Promise<{ slug: string }>;
}

async function loadFraunces() {
  try {
    const response = await fetch(new URL("../../../public/fonts/Fraunces-700.ttf", import.meta.url));
    if (!response.ok) return [];
    return [
      {
        name: "Fraunces",
        data: await response.arrayBuffer(),
        style: "normal" as const,
        weight: 700 as const,
      },
    ];
  } catch {
    return [];
  }
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const post = await client.fetch<{ title?: string; category?: string } | null>(
    `*[_type == "post" && slug.current == $slug && status == "published"][0]{
      title,
      "category": categories[0]->title
    }`,
    { slug }
  );
  const title = post?.title || "Hrolgar Blog";
  const label = post?.category || "Blog";
  const fonts = await loadFraunces();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111116",
          color: "#e8e4e0",
          padding: "72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "10px",
            background: "#5eaba8",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
              color: "#e07a5f",
              fontSize: 26,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: "54px", height: "2px", background: "#e07a5f" }} />
            {label}
          </div>
          <div
            style={{
              maxWidth: "980px",
              fontFamily: fonts.length > 0 ? "Fraunces" : "serif",
              fontSize: title.length > 72 ? 68 : 82,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(94, 171, 168, 0.45)",
            paddingTop: "28px",
            color: "#b8b1aa",
            fontSize: 28,
          }}
        >
          <span>Helgi Skjortnes</span>
          <span style={{ color: "#5eaba8" }}>hrolgar.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}

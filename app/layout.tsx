import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSettings } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { settingsToCssVars } from "@/lib/theme";

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], display: "swap", variable: "--font-serif" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });

export const viewport: Viewport = {
  themeColor: "#111116",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings?.siteName || "Ullrhome";
  const description = settings?.siteDescription || "Personal portfolio and blog";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ullrhome.com"),
    icons: {
      icon: "/icon.svg",
    },
    openGraph: {
      type: "website",
      siteName,
      title: siteName,
      description,
      ...(settings?.ogImage && {
        images: [{ url: urlFor(settings.ogImage).width(1200).height(630).url() }],
      }),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const cssVars = settingsToCssVars(settings);

  return (
    <html lang="en" style={cssVars} className={`${dmSans.variable} ${fraunces.variable} ${jetbrainsMono.variable} antialiased`}>
      <head>
        <Script
          src="https://umami.hrolgar.com/script.js"
          data-website-id="PLACEHOLDER_ID"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-[family-name:var(--font-sans)] bg-bg text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}

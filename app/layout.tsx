import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getSettings, getContact, getAbout, getServices } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { settingsToCssVars } from "@/lib/theme";
import { jsonLdHtml } from "@/lib/seo";
import type { About, ContactInfo, Service } from "@/sanity/types";
import WebVitals from "@/components/WebVitals";

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
  const siteName = settings?.siteName || "Hrolgar";
  const description = settings?.siteDescription || "Personal portfolio and blog";
  const defaultOgImage = settings?.ogImage ? urlFor(settings.ogImage).width(1200).height(630).url() : undefined;

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hrolgar.com"),
    icons: {
      icon: "/icon.svg",
    },
    verification: {
      google: "TRC0IuDgcZvuu18ms2Mn-_SZ5tSgpBXxCFFoiP_K8Uw",
    },
    openGraph: {
      type: "website",
      siteName,
      title: siteName,
      description,
      ...(defaultOgImage && { images: [{ url: defaultOgImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      ...(defaultOgImage && { images: [defaultOgImage] }),
    },
  };
}

const SITE = "https://hrolgar.com";

// The knowledge-graph nodes are built from the CMS rather than hardcoded, so that
// changing the contact address or adding a service updates the structured data too.
// Everything is spread conditionally: a missing CMS field must omit the property
// rather than emit null, which Google treats as malformed.
function buildJsonLd(
  contact: ContactInfo | null,
  about: About | null,
  services: Service[],
) {
  const profileImage = about?.profileImage
    ? urlFor(about.profileImage).width(800).url()
    : undefined;

  // contactInfo.location is a single free-text string ("Ålesund, Norway").
  const [locality, ...restOfLocation] = (contact?.location || "").split(",").map((x) => x.trim());
  const country = restOfLocation.join(", ") || undefined;
  const address = locality
    ? {
        "@type": "PostalAddress",
        addressLocality: locality,
        ...(country && { addressCountry: country }),
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE}/#person`,
        name: "Helgi Skjortnes",
        url: SITE,
        jobTitle: "Senior .NET & Integrations Engineer",
        ...(contact?.email && { email: contact.email }),
        ...(profileImage && { image: profileImage }),
        ...(address && { address }),
        sameAs: [
          "https://github.com/Hrolgar",
          "https://www.linkedin.com/in/helgi-skaftason-skjortnes-65aba499",
        ],
        knowsAbout: ["C#", ".NET", "ASP.NET Core", "System Integration", "API Development", "PostgreSQL", "Docker", "Infrastructure Automation"],
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE}/#service`,
        name: "Helgi Skjortnes, Freelance .NET & Integrations Engineer",
        url: SITE,
        description:
          "Freelance engineering for backend systems, integrations, data platforms and the infrastructure to run them.",
        provider: { "@id": `${SITE}/#person` },
        ...(address && { address }),
        areaServed: [
          { "@type": "Country", name: "Norway" },
          { "@type": "Place", name: "Worldwide (remote)" },
        ],
        ...(services.length > 0 && {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Services",
            itemListElement: services.map((service) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: service.title,
                ...(service.summary && { description: service.summary }),
                ...(service.slug?.current && { url: `${SITE}/services/${service.slug.current}` }),
              },
            })),
          },
        }),
      },
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, contact, about, services] = await Promise.all([
    getSettings(),
    getContact(),
    getAbout(),
    getServices(),
  ]);
  const cssVars = settingsToCssVars(settings);
  const jsonLd = buildJsonLd(contact, about, services);

  return (
    <html lang="en" style={cssVars} className={`${dmSans.variable} ${fraunces.variable} ${jetbrainsMono.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
        />
      </head>
      <body className="font-[family-name:var(--font-sans)] bg-bg text-foreground min-h-screen">
        <Script
          src="https://umami.hrolgar.com/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || "4c80368f-5246-4407-9733-abca5084b9e6"}
          strategy="afterInteractive"
        />
        <WebVitals />
        {children}
      </body>
    </html>
  );
}

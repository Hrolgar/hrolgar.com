import type { Locale } from "@/sanity/locale";
import { DEFAULT_LOCALE } from "@/sanity/locale";

/**
 * Page titles and descriptions for the translated routes.
 *
 * English lives on the English page files, because those titles are tuned against Search
 * Console and are not a translation of anything. This table is the other languages.
 *
 * The type is keyed on every locale EXCEPT the default, so adding a language to `LOCALES`
 * makes this file stop compiling until its pages have titles. That is deliberate: a language
 * that ships with the English title on every page is worse than no language at all, because
 * Google sees two URLs competing for the same query.
 */
export const PAGE_KEYS = [
  "home",
  "projects",
  "services",
  "contact",
  "experience",
  "homelab",
  "blog",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

/** The English path a page key lives at. The locale prefix is added at render time. */
export const pagePath: Record<PageKey, string> = {
  home: "/",
  projects: "/projects",
  services: "/services",
  contact: "/contact",
  experience: "/experience",
  homelab: "/homelab",
  blog: "/blog",
};

type Meta = { title: string; description: string };

export const pageMeta: Record<Exclude<Locale, typeof DEFAULT_LOCALE>, Record<PageKey, Meta>> = {
  nb: {
    home: {
      title: "Helgi Skjortnes: frilans .NET- og integrasjonsutvikler",
      description:
        "Frilans systemutvikler i Ålesund. Backend, API-er og integrasjoner i .NET, dataplattformer og infrastrukturen som holder dem i drift.",
    },
    projects: {
      title: "Prosjekter: backend, automatisering og infrastruktur",
      description:
        "Et utvalg av systemene jeg har bygget for kunder og meg selv. Hvert prosjekt sier hva problemet var og hva som faktisk ble levert.",
    },
    services: {
      title: "Tjenester: backend, integrasjoner og dataplattformer",
      description:
        "Frilans systemutvikler i Ålesund. Backend og API-er i .NET, systemintegrasjoner, dataplattformer og infrastrukturen som holder dem i drift.",
    },
    contact: {
      title: "Kontakt: backend, integrasjoner og dataplattformer",
      description:
        "Ta kontakt om backend-utvikling, .NET-API-er, systemintegrasjon, dataplattformer eller et system som har vokst seg uoversiktlig.",
    },
    experience: {
      title: "Erfaring: backend, .NET og infrastruktur",
      description:
        "Bakgrunn fra backend-utvikling, .NET, systemintegrasjon og infrastruktur, både i produktteam og som frilanser.",
    },
    homelab: {
      title: "Hjemmelab: Proxmox, Docker og infrastruktur som kode",
      description:
        "En titt inn i min egen selvhostede infrastruktur: Proxmox, Docker, ZFS-lagring og rundt femti tjenester styrt som kode.",
    },
    blog: {
      title: "Blogg: notater fra backend, drift og selvhosting",
      description:
        "Notater fra ekte bygg: backend, integrasjoner, hjemmelab og de bitene av infrastruktur som var verdt å skrive ned.",
    },
  },
};

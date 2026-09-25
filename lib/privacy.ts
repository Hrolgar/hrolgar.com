import type { Locale } from "@/sanity/locale";

/**
 * The privacy notice, in code rather than Sanity.
 *
 * This is a statement about what the code does, so it lives next to the code and changes in
 * the same commit when the code does. If the contact route gains a destination or analytics
 * changes, this file is the one to update. Bump PRIVACY_LAST_MODIFIED when the text changes:
 * it is both the date shown on the page and the sitemap lastmod.
 */
export const PRIVACY_LAST_MODIFIED = new Date("2026-09-25T00:00:00.000Z");

export const PRIVACY_CONTACT_EMAIL = "contact@skjortnes.dev";

/** A paragraph is plain text with the odd link in it. */
export type PrivacySegment = string | { href: string; label: string };
export type PrivacySection = { heading: string; paragraphs: PrivacySegment[][] };
export type PrivacyContent = {
  title: string;
  intro: string;
  updated: string;
  sections: PrivacySection[];
};

const mail = { href: `mailto:${PRIVACY_CONTACT_EMAIL}`, label: PRIVACY_CONTACT_EMAIL };
const optOut = { href: "/?stats=off", label: "hrolgar.com/?stats=off" };
const datatilsynet = { href: "https://www.datatilsynet.no", label: "Datatilsynet" };

export const privacyContent: Record<Locale, PrivacyContent> = {
  en: {
    title: "Privacy",
    intro:
      "This is a one-person site, so the short version is short. I collect what you type into the contact form so I can answer you, and I count page views without cookies. Nothing is sold, and there are no ads or tracking pixels.",
    updated: "Last updated",
    sections: [
      {
        heading: "Who is responsible",
        paragraphs: [
          [
            "Helgi Skjortnes, Ålesund, Norway, is responsible for the personal data handled on hrolgar.com. Questions about any of this go to ",
            mail,
            ".",
          ],
        ],
      },
      {
        heading: "The contact form",
        paragraphs: [
          [
            "When you send the form I get your name, your email address and whatever you wrote, including things like budget or timeline if you put them in. I use it to reply to you and, if it turns into work, to talk about that work. The legal basis is taking steps at your request before a possible contract, and my legitimate interest in answering people who write to me.",
          ],
          [
            "The message lands in my email inbox, which is hosted by Google, and I get a notification in a private Discord channel. Both are US companies covered by the EU-US Data Privacy Framework. The server also keeps your IP address in memory for ten minutes to stop the form being spammed. It is never written to disk.",
          ],
          [
            "If nothing comes of the conversation I delete it within a year. If it becomes paid work, what belongs to the invoicing is kept for as long as Norwegian bookkeeping rules require.",
          ],
        ],
      },
      {
        heading: "Analytics",
        paragraphs: [
          [
            "I run Umami on my own server in Norway to see which pages get read. It sets no cookies and does not follow you to other sites. It records the page, where you came from, your browser and device type and your country. The country is worked out from your IP address when the page loads, and the address itself is not stored.",
          ],
          [
            "If you would rather not be counted at all, open ",
            optOut,
            " once and this browser stops sending anything.",
          ],
        ],
      },
      {
        heading: "Hosting and images",
        paragraphs: [
          [
            "The site runs on my own hardware in Norway. Like any web server it sees your IP address to be able to answer the request. Fonts are served from the site itself. Images come from Sanity's CDN, which sees the same connection details any web server would.",
          ],
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          [
            "You can ask to see what I have about you, have it corrected or deleted, or object to how it is used. Email ",
            mail,
            " and I will sort it out. If you think I have handled your data wrongly you can complain to ",
            datatilsynet,
            ", the Norwegian data protection authority.",
          ],
        ],
      },
    ],
  },
  nb: {
    title: "Personvern",
    intro:
      "Dette er en enmannsside, så kortversjonen er kort. Jeg samler inn det du skriver i kontaktskjemaet så jeg kan svare deg, og jeg teller sidevisninger uten informasjonskapsler. Ingenting blir solgt, og det er ingen annonser eller sporingspiksler her.",
    updated: "Sist oppdatert",
    sections: [
      {
        heading: "Hvem er ansvarlig",
        paragraphs: [
          [
            "Helgi Skjortnes, Ålesund, er behandlingsansvarlig for personopplysningene på hrolgar.com. Spørsmål om noe av dette sendes til ",
            mail,
            ".",
          ],
        ],
      },
      {
        heading: "Kontaktskjemaet",
        paragraphs: [
          [
            "Når du sender skjemaet får jeg navnet ditt, e-postadressen din og det du skrev, også ting som budsjett eller tidsramme hvis du tok det med. Jeg bruker det til å svare deg og, hvis det blir et oppdrag, til å snakke om oppdraget. Behandlingsgrunnlaget er tiltak du ber om før en mulig avtale, og min berettigede interesse i å svare folk som tar kontakt.",
          ],
          [
            "Meldingen havner i e-postinnboksen min, som driftes av Google, og jeg får et varsel i en privat Discord-kanal. Begge er amerikanske selskaper som er omfattet av EU-US Data Privacy Framework. Serveren holder også IP-adressen din i minnet i ti minutter for å hindre spam. Den blir aldri skrevet til disk.",
          ],
          [
            "Hvis samtalen ikke fører til noe, sletter jeg den innen et år. Blir det et betalt oppdrag, oppbevares det som hører til faktureringen så lenge bokføringsreglene krever.",
          ],
        ],
      },
      {
        heading: "Besøksstatistikk",
        paragraphs: [
          [
            "Jeg kjører Umami på min egen server i Norge for å se hvilke sider som blir lest. Den setter ingen informasjonskapsler og følger deg ikke til andre nettsider. Den registrerer siden, hvor du kom fra, nettleser, enhetstype og land. Landet utledes fra IP-adressen når siden lastes, og selve adressen lagres ikke.",
          ],
          [
            "Vil du ikke telles i det hele tatt, åpner du ",
            optOut,
            " én gang, så slutter denne nettleseren å sende noe.",
          ],
        ],
      },
      {
        heading: "Drift og bilder",
        paragraphs: [
          [
            "Nettsiden kjører på min egen maskinvare i Norge. Som enhver webserver ser den IP-adressen din for å kunne svare. Skrifttypene leveres fra nettsiden selv. Bildene kommer fra Sanitys CDN, som ser de samme tilkoblingsdetaljene som en hvilken som helst webserver.",
          ],
        ],
      },
      {
        heading: "Dine rettigheter",
        paragraphs: [
          [
            "Du kan be om innsyn i hva jeg har om deg, få det rettet eller slettet, eller protestere mot hvordan det brukes. Send en e-post til ",
            mail,
            ", så ordner jeg det. Mener du at jeg har behandlet opplysningene dine feil, kan du klage til ",
            datatilsynet,
            ".",
          ],
        ],
      },
    ],
  },
};

"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/sanity/locale";
import {
  DEFAULT_LOCALE,
  LOCALES,
  counterpartPath,
  localeHtmlLang,
  localeLabel,
} from "@/sanity/locale";

/**
 * Links to the same page in the other language(s).
 *
 * Without this, nothing on the site links to /no at all: the only ways in were Google and
 * typing the URL. hreflang tells a search engine which version to show, it does nothing for
 * a person already reading the wrong one.
 *
 * Deliberately plain anchors rather than a dropdown or a client-side locale swap. A crawler
 * has to be able to follow them, and Google's guidance is a visible switcher plus hreflang,
 * never an automatic redirect on browser language — that traps anyone who wants the English
 * page and interferes with crawling.
 *
 * It renders every language except the one being read, so a third language needs no change
 * here. Two languages is one link; more would want a dropdown, and that is the point to
 * build one.
 */
export default function LanguageSwitcher({
  locale = DEFAULT_LOCALE,
  className = "",
}: {
  locale?: Locale;
  className?: string;
}) {
  const pathname = usePathname() || "/";
  const others = LOCALES.filter((candidate) => candidate !== locale);
  if (others.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {others.map((other) => (
        <a
          key={other}
          href={counterpartPath(pathname, other)}
          lang={localeHtmlLang[other]}
          hrefLang={localeHtmlLang[other]}
          data-umami-event="language-switch"
          data-umami-event-to={other}
          className="text-sm font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {localeLabel[other]}
        </a>
      ))}
    </div>
  );
}

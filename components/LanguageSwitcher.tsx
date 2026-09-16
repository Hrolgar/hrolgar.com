"use client";

import { usePathname } from "next/navigation";
import { t } from "@/lib/ui";
import type { Locale } from "@/sanity/locale";
import {
  DEFAULT_LOCALE,
  LOCALES,
  counterpartPath,
  localeHtmlLang,
  localeLabel,
  localeShort,
} from "@/sanity/locale";

/**
 * A segmented toggle between the languages, showing both with the current one marked.
 *
 * The first version was a single link styled like the nav ("Norsk", same size, weight and
 * colour as Projects and Services), and it read as a seventh menu item rather than a switch.
 * Showing both options in a bordered pill is what makes it obviously a control: you can see
 * the state you are in and the state you would be in.
 *
 * NOT flags. A flag is a country, not a language, and English has no flag that is not wrong
 * for most of the people reading this site. They are also poor tap targets and meaningless
 * to a screen reader.
 *
 * Plain anchors, so a crawler can follow them, and no redirect on browser language: that
 * traps anyone who wants the English page. Google's guidance is a visible switcher plus
 * hreflang, which is what this is.
 *
 * Renders every language in LOCALES, so a third needs no change here.
 */
export default function LanguageSwitcher({
  locale = DEFAULT_LOCALE,
  className = "",
}: {
  locale?: Locale;
  className?: string;
}) {
  const pathname = usePathname() || "/";
  if (LOCALES.length < 2) return null;

  return (
    <div
      role="group"
      aria-label={t("language", locale)}
      className={`inline-flex items-center overflow-hidden rounded-full border border-border bg-surface ${className}`}
    >
      {LOCALES.map((candidate) => {
        const active = candidate === locale;
        const shared =
          "px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors";

        // The language you are already reading is state, not a destination.
        if (active) {
          return (
            <span
              key={candidate}
              aria-current="true"
              className={`${shared} bg-surface-hover text-foreground`}
            >
              {localeShort[candidate]}
            </span>
          );
        }

        return (
          <a
            key={candidate}
            href={counterpartPath(pathname, candidate)}
            lang={localeHtmlLang[candidate]}
            hrefLang={localeHtmlLang[candidate]}
            aria-label={localeLabel[candidate]}
            data-umami-event="language-switch"
            data-umami-event-to={candidate}
            className={`${shared} text-muted hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
          >
            {localeShort[candidate]}
          </a>
        );
      })}
    </div>
  );
}

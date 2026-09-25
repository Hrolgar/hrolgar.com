"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { counterpartPath, hasTranslation, stripLocale } from "@/sanity/locale";
import { t } from "@/lib/ui";

const DISMISSED = "hrolgar.langHint.dismissed";

/**
 * A quiet "this page exists in Norwegian" pointer for visitors whose browser prefers Norwegian
 * and who landed on an English page that has a Norwegian twin.
 *
 * Deliberately a suggestion, never a redirect: Google advises against redirecting by language,
 * partly because Googlebot crawls from the US without Accept-Language, and an English reader on
 * a Norwegian machine should keep the page they chose. Dismissal is remembered per browser.
 */
export default function LanguageHint() {
  const pathname = usePathname() || "/";
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISSED)) return;
    } catch {
      // storage blocked: show the hint, just without remembering a dismissal
    }
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    const prefersNorwegian = langs.some((l) => /^(nb|nn|no)\b/i.test(l || ""));
    const onEnglish = stripLocale(pathname) === pathname;
    if (prefersNorwegian && onEnglish && hasTranslation(pathname)) {
      setTarget(counterpartPath(pathname, "nb"));
    } else {
      setTarget(null);
    }
  }, [pathname]);

  if (!target) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED, "1");
    } catch {}
    setTarget(null);
  };

  return (
    <div
      lang="nb"
      className="fixed left-1/2 top-20 z-40 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-surface/95 py-2 pl-4 pr-2 text-sm text-foreground shadow-lg backdrop-blur"
    >
      <a
        href={target}
        hrefLang="nb-NO"
        data-umami-event="language-hint-click"
        className="whitespace-nowrap font-medium text-primary hover:underline"
      >
        {t("languageHint", "nb")} →
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Lukk"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted hover:text-foreground"
      >
        ×
      </button>
    </div>
  );
}

import { localeHtmlLang, type Locale } from "@/sanity/locale";

/**
 * Sets `<html lang>` for a page whose locale is not the root layout's.
 *
 * `<html>` lives in the single root layout, and a nested layout cannot replace it. The
 * supported way to vary it is multiple root layouts behind route groups, which means
 * moving every route into a group and duplicating the root `not-found`, `error` and
 * `loading` boundaries. That is a large structural change for one attribute, so this
 * inline script does it instead: it runs while the document is parsing, before hydration
 * and before a screen reader starts reading, which is what the attribute is actually for.
 * Google states it ignores `lang` entirely and reads the hreflang annotations, which are
 * server-rendered in the head and in the sitemap.
 *
 * If the routes ever move into groups, delete this and set `lang` in the group's layout.
 */
export default function HtmlLang({ locale }: { locale: Locale }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(localeHtmlLang[locale])}`,
      }}
    />
  );
}

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { localeHref, withLocale, LOCALES, counterpartPath, stripLocale } from "@/sanity/locale";
import { defaultNav, footerServices, skillCategory, t, tf } from "@/lib/ui";
import { duration, formatDate, formatMonthYear } from "@/lib/dates";
import { resolveLocale } from "@/sanity/lib/resolveLocale";

describe("localeHref", () => {
  it("leaves English alone", () => {
    expect(localeHref("/contact", "en")).toBe("/contact");
    expect(localeHref("/", "en")).toBe("/");
  });

  it("prefixes pages that exist in both languages", () => {
    expect(localeHref("/contact", "nb")).toBe("/no/contact");
    expect(localeHref("/projects", "nb")).toBe("/no/projects");
    expect(localeHref("/", "nb")).toBe("/no");
  });

  it("leaves English-only detail pages on their English URL", () => {
    // There is no /no/blog/<slug>; prefixing one of these would 404.
    expect(localeHref("/blog/why-i-self-host-everything", "nb")).toBe("/blog/why-i-self-host-everything");
    expect(localeHref("/projects/refinarr", "nb")).toBe("/projects/refinarr");
    expect(localeHref("/services/backend-dotnet", "nb")).toBe("/services/backend-dotnet");
    expect(localeHref("/blog/category/homelab", "nb")).toBe("/blog/category/homelab");
  });

  it("keeps hashes and query strings", () => {
    expect(localeHref("/#contact", "nb")).toBe("/no#contact");
    expect(localeHref("/blog?page=2", "nb")).toBe("/no/blog?page=2");
  });

  it("does not touch external or protocol links", () => {
    expect(localeHref("https://github.com/hrolgar", "nb")).toBe("https://github.com/hrolgar");
    expect(localeHref("mailto:helgi@hrolgar.com", "nb")).toBe("mailto:helgi@hrolgar.com");
    expect(localeHref("tel:+4712345678", "nb")).toBe("tel:+4712345678");
  });

  it("agrees with withLocale on the pages that exist in both", () => {
    for (const path of ["/projects", "/services", "/contact", "/experience", "/homelab", "/blog"]) {
      expect(localeHref(path, "nb")).toBe(withLocale(path, "nb"));
    }
  });
});

describe("ui strings", () => {
  // The leak this guards: a key added to `en` and forgotten in `nb` silently renders
  // English on a Norwegian page, which is exactly how the first pass shipped.
  it("has every key in every locale", () => {
    const keys = Object.keys(defaultNav("en")).length; // touch the module
    expect(keys).toBeGreaterThan(0);
    const sample = ["skipToContent", "getInTouch", "startAProject", "navContact", "close"] as const;
    for (const locale of LOCALES) {
      for (const key of sample) {
        expect(t(key, locale)).toBeTruthy();
      }
    }
    // Norwegian must actually differ from English for real words, not just fall through.
    expect(t("getInTouch", "nb")).not.toBe(t("getInTouch", "en"));
    expect(t("startAProject", "nb")).not.toBe(t("startAProject", "en"));
  });

  it("fills placeholders", () => {
    expect(tf("homelabServicesIntro", "en", { count: 15, categories: 6 })).toContain("15 services across 6 categories");
    expect(tf("homelabServicesIntro", "nb", { count: 15, categories: 6 })).toContain("15 tjenester");
  });

  it("gives every nav item a localised label and an unprefixed href", () => {
    const nb = defaultNav("nb");
    expect(nb.map((i) => i.label)).toContain("Hjem");
    // The prefix is added by localeHref at render time, never baked into the table.
    expect(nb.every((i) => !i.href.startsWith("/no"))).toBe(true);
  });

  it("localises the footer service shortlist but keeps the English detail URLs", () => {
    const nb = footerServices("nb");
    expect(nb[0].label).not.toBe(footerServices("en")[0].label);
    expect(nb.map((s) => s.href)).toEqual(footerServices("en").map((s) => s.href));
  });

  it("turns skill category slugs into display names", () => {
    expect(skillCategory("database", "en")).toBe("Databases");
    expect(skillCategory("database", "nb")).toBe("Databaser");
    expect(skillCategory("devops", "nb")).toBe("DevOps");
    // Unknown values pass through rather than rendering blank.
    expect(skillCategory("quantum", "en")).toBe("quantum");
  });
});

describe("dates", () => {
  it("formats in the page's own language", () => {
    expect(formatDate("2026-03-10", "en")).toBe("March 10, 2026");
    expect(formatDate("2026-03-10", "nb")).toMatch(/mars/);
    expect(formatMonthYear("2023-08-01", "en")).toMatch(/Aug/);
    expect(formatMonthYear("2023-08-01", "nb")).toMatch(/aug/);
  });

  it("says how long a role lasted in the page's own language", () => {
    expect(duration("2023-08-01", "2025-11-01", "en")).toBe("2yr 3mo");
    expect(duration("2023-08-01", "2025-11-01", "nb")).toBe("2 år 3 mnd");
    expect(duration("2025-01-01", "2025-10-01", "en")).toBe("9mo");
    expect(duration("2023-08-01", "2025-08-01", "en")).toBe("2yr");
  });
});

describe("resolveLocale", () => {
  const doc = {
    _id: "project-x",
    slug: { current: "refinarr" },
    order: 3,
    title: { _type: "localeString", en: "Refinarr", nb: "Refinarr NO" },
    summary: { _type: "localeText", en: "English summary", nb: "" },
    tags: { _type: "localeStringList", en: ["a", "b"], nb: [] },
    body: {
      _type: "localeBlock",
      en: [{ _type: "block", children: [{ text: "hello" }] }],
      nb: [{ _type: "block", children: [{ text: "hallo" }] }],
    },
    image: { _type: "image", asset: { _ref: "image-1" } },
  };

  it("picks the requested language", () => {
    const out = resolveLocale<Record<string, unknown>>(doc, "nb");
    expect(out.title).toBe("Refinarr NO");
    expect((out.body as { children: { text: string }[] }[])[0].children[0].text).toBe("hallo");
  });

  it("falls back per field, not per document", () => {
    const out = resolveLocale<Record<string, unknown>>(doc, "nb");
    // Title was translated, summary was not. The document must not revert wholesale.
    expect(out.title).toBe("Refinarr NO");
    expect(out.summary).toBe("English summary");
  });

  it("treats an empty box as untranslated, not as an empty value", () => {
    const out = resolveLocale<Record<string, unknown>>(doc, "nb");
    expect(out.summary).toBe("English summary");
    expect(out.tags).toEqual(["a", "b"]);
  });

  it("leaves language-neutral fields exactly as they are", () => {
    const out = resolveLocale<Record<string, unknown>>(doc, "nb");
    expect(out.slug).toEqual({ current: "refinarr" });
    expect(out.order).toBe(3);
    expect(out.image).toEqual({ _type: "image", asset: { _ref: "image-1" } });
    expect(out._id).toBe("project-x");
  });

  it("does not touch an ordinary object that happens to have en/nb keys", () => {
    const notALocaleField = { _type: "someOtherThing", en: 1, nb: 2 };
    expect(resolveLocale(notALocaleField, "nb")).toEqual(notALocaleField);
  });

  it("walks arrays and nested objects", () => {
    const nested = {
      items: [
        { label: { _type: "localeString", en: "One", nb: "En" } },
        { label: { _type: "localeString", en: "Two" } },
      ],
    };
    const out = resolveLocale<{ items: { label: string }[] }>(nested, "nb");
    expect(out.items.map((i) => i.label)).toEqual(["En", "Two"]);
  });

  it("returns null for a field with no value in any language", () => {
    const out = resolveLocale<{ x: unknown }>({ x: { _type: "localeString" } }, "nb");
    expect(out.x).toBeNull();
  });

  it("is a no-op for English", () => {
    const out = resolveLocale<Record<string, unknown>>(doc, "en");
    expect(out.title).toBe("Refinarr");
    expect(out.summary).toBe("English summary");
  });
});

describe("revalidation covers every language", () => {
  // The webhook used to list English paths only, so a Norwegian edit refreshed the English
  // page and left /no on the hour-long ISR window. Keep this derived from LOCALES.
  it("builds a path for each locale", () => {
    const paths = LOCALES.flatMap((locale) =>
      ["/", "/projects", "/services"].map((p) => withLocale(p === "/" ? "" : p, locale) || "/"),
    );
    expect(paths).toContain("/");
    expect(paths).toContain("/services");
    expect(paths).toContain("/no");
    expect(paths).toContain("/no/services");
  });
});

describe("revalidation must not name the locale route", () => {
  // Naming it either way — the concrete path or the route pattern — drops the prebuilt
  // Norwegian pages, and dynamicParams = false then forbids rebuilding them, so every /no
  // URL answers 404 until the next deploy. Measured against a production build twice.
  // If instant Norwegian revalidation is wanted, tag the Sanity fetches and use
  // revalidateTag; do not put these paths back.
  it("revalidatePath is never called on a /no or [locale] path", () => {
    const source = readFileSync("app/api/revalidate/route.ts", "utf8");
    const calls = [...source.matchAll(/revalidatePath\(\s*(`[^`]*`|"[^"]*")/g)].map((m) => m[1]);
    expect(calls.length).toBeGreaterThan(0);
    for (const call of calls) {
      expect(call).not.toContain("[locale]");
      expect(call).not.toContain("/no");
    }
  });

  it("every locale page refuses unknown segments at the router", () => {
    for (const file of [
      "app/[locale]/page.tsx",
      "app/[locale]/services/page.tsx",
      "app/[locale]/blog/page.tsx",
    ]) {
      const source = readFileSync(file, "utf8");
      // dynamicParams = true makes /xx render the 404 page with an HTTP 200.
      expect(source).toContain("export const dynamicParams = false;");
    }
  });
});

describe("language switcher paths", () => {
  it("swaps a page for its counterpart", () => {
    expect(counterpartPath("/services", "nb")).toBe("/no/services");
    expect(counterpartPath("/no/services", "en")).toBe("/services");
    expect(counterpartPath("/", "nb")).toBe("/no");
    expect(counterpartPath("/no", "en")).toBe("/");
  });

  it("never points at a URL that does not exist", () => {
    // Case studies, posts and service detail pages are English only. Sending a visitor to
    // /no/blog/why-i-self-host-everything would 404, which is the one thing a language
    // switcher must not do, so those fall back to that language's home page.
    expect(counterpartPath("/blog/why-i-self-host-everything", "nb")).toBe("/no");
    expect(counterpartPath("/projects/refinarr", "nb")).toBe("/no");
    expect(counterpartPath("/services/backend-dotnet", "nb")).toBe("/no");
    expect(counterpartPath("/blog/category/homelab", "nb")).toBe("/no");
  });

  it("ignores query strings and hashes", () => {
    expect(counterpartPath("/blog?page=2", "nb")).toBe("/no/blog");
    expect(counterpartPath("/no/contact#form", "en")).toBe("/contact");
  });

  it("strips a locale prefix back to the English path", () => {
    expect(stripLocale("/no/services")).toBe("/services");
    expect(stripLocale("/no")).toBe("/");
    expect(stripLocale("/services")).toBe("/services");
    // Not a prefix, just a path that happens to start with the same letters.
    expect(stripLocale("/nothing-here")).toBe("/nothing-here");
  });
});

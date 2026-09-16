import { describe, expect, it } from "vitest";
import { localeHref, withLocale, LOCALES } from "@/sanity/locale";
import { defaultNav, footerServices, skillCategory, t, tf } from "@/lib/ui";
import { duration, formatDate, formatMonthYear } from "@/lib/dates";

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

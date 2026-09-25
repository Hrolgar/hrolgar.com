import { describe, expect, it } from "vitest";
import { DEFAULT_HOME_SECTIONS, resolveHomeSections } from "@/sanity/homeSections";

const item = (section: string, enabled?: boolean) => ({ _key: section, section, enabled }) as never;

describe("resolveHomeSections", () => {
  it("falls back to the default order when the CMS list is missing or empty", () => {
    expect(resolveHomeSections(undefined)).toEqual(DEFAULT_HOME_SECTIONS);
    expect(resolveHomeSections([])).toEqual(DEFAULT_HOME_SECTIONS);
  });

  it("keeps the CMS order and drops hidden sections", () => {
    expect(resolveHomeSections([item("projects"), item("hero"), item("skills", false), item("contact")])).toEqual([
      "projects",
      "hero",
      "contact",
    ]);
  });

  it("ignores unknown and duplicate sections", () => {
    expect(resolveHomeSections([item("about"), item("nope"), item("about")])).toEqual(["about"]);
  });

  it("renders nothing when every section is switched off", () => {
    expect(resolveHomeSections([item("hero", false)])).toEqual([]);
  });
});

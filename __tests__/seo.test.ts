import { describe, expect, it, vi, beforeEach } from "vitest";
import sitemap from "@/app/sitemap";
import { generateMetadata as generateBlogMetadata } from "@/app/blog/page";

const mocks = vi.hoisted(() => ({
  getSettings: vi.fn(),
  getProjectSlugs: vi.fn(),
  getPostSlugs: vi.fn(),
  getCategories: vi.fn(),
  getPageContent: vi.fn(),
  getPosts: vi.fn(),
}));

vi.mock("@/sanity/lib/queries", () => ({
  getSettings: mocks.getSettings,
  getProjectSlugs: mocks.getProjectSlugs,
  getPostSlugs: mocks.getPostSlugs,
  getCategories: mocks.getCategories,
  getPageContent: mocks.getPageContent,
  getPosts: mocks.getPosts,
}));

vi.mock("@/sanity/lib/image", () => ({
  urlFor: () => ({
    width() {
      return this;
    },
    height() {
      return this;
    },
    url() {
      return "https://cdn.sanity.io/default-og.png";
    },
  }),
}));

describe("SEO metadata", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSettings.mockResolvedValue({
      ogImage: { _type: "image", asset: { _type: "reference", _ref: "image-default" } },
    });
  });

  it("adds canonical and social image metadata to the blog page", async () => {
    const metadata = await generateBlogMetadata();

    expect(metadata.alternates).toEqual({ canonical: "/blog" });
    expect(metadata.openGraph).toMatchObject({
      images: [{ url: "https://cdn.sanity.io/default-og.png" }],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: ["https://cdn.sanity.io/default-og.png"],
    });
  });
});

describe("sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getProjectSlugs.mockResolvedValue([
      { slug: { current: "project-one" }, _updatedAt: "2026-01-02T03:04:05.000Z" },
    ]);
    mocks.getPostSlugs.mockResolvedValue([
      { slug: { current: "post-one" }, _updatedAt: "2026-02-03T04:05:06.000Z" },
    ]);
    mocks.getCategories.mockResolvedValue([]);
  });

  it("includes missing static routes and uses document timestamps for dynamic entries", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toEqual(expect.arrayContaining([
      "https://hrolgar.com/projects",
      "https://hrolgar.com/contact",
      "https://hrolgar.com/experience",
      "https://hrolgar.com/homelab",
    ]));
    expect(entries.find((entry) => entry.url.endsWith("/projects/project-one"))?.lastModified).toEqual(
      new Date("2026-01-02T03:04:05.000Z")
    );
    expect(entries.find((entry) => entry.url.endsWith("/blog/post-one"))?.lastModified).toEqual(
      new Date("2026-02-03T04:05:06.000Z")
    );
  });
});

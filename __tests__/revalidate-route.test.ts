import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  clientFetch: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/sanity/lib/client", () => ({ client: { fetch: mocks.clientFetch } }));

import { POST } from "@/app/api/revalidate/route";

const SECRET = "test-secret";

function webhook(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://hrolgar.com/api/revalidate", {
    method: "POST",
    headers: { "content-type": "application/json", "x-sanity-webhook-secret": SECRET, ...headers },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0];
}

describe("POST /api/revalidate", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    process.env.SANITY_REVALIDATE_SECRET = SECRET;
    mocks.revalidatePath.mockReset();
    mocks.clientFetch.mockReset();
    fetchSpy = vi.fn(async () => new Response(null, { status: 202 }));
    vi.stubGlobal("fetch", fetchSpy);
  });

  it("rejects a call without the right secret and pings nothing", async () => {
    const res = await POST(webhook({}, { "x-sanity-webhook-secret": "wrong-secret" }));
    expect(res.status).toBe(401);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("submits the published page named by the sanity-document-id header when the body is empty", async () => {
    mocks.clientFetch.mockResolvedValue([{ _type: "post", slug: "fresh-post", status: "published" }]);
    const res = await POST(webhook({}, { "sanity-document-id": "post-fresh" }));
    expect(res.status).toBe(200);
    expect(mocks.clientFetch).toHaveBeenCalledWith(expect.any(String), { ids: ["post-fresh"] });
    const sent = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string);
    expect(sent.urlList).toEqual([
      "https://hrolgar.com",
      "https://hrolgar.com/blog",
      "https://hrolgar.com/blog/fresh-post",
    ]);
  });

  it("revalidates the privacy page with the rest", async () => {
    mocks.clientFetch.mockResolvedValue([]);
    await POST(webhook({}, { "sanity-document-id": "privacyPage" }));
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/privacy");
  });

  it("still answers 200 when IndexNow fails", async () => {
    mocks.clientFetch.mockResolvedValue([]);
    fetchSpy.mockRejectedValue(new Error("network down"));
    const res = await POST(webhook({}, { "sanity-document-id": "post-x" }));
    expect(res.status).toBe(200);
  });
});

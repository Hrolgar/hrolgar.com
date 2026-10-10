import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "@/sanity/env";

function buildClient() {
  if (!projectId) {
    // Return a stub that resolves empty results during build without a configured project
    return {
      fetch: async () => null,
      config: () => ({ projectId: "", dataset }),
    } as unknown as ReturnType<typeof createClient>;
  }

  // Dev-only draft preview: with SANITY_PREVIEW_TOKEN set (never in production), unpublished drafts
  // render in place of the published documents, so a new page can be looked at before it goes live.
  const previewToken = process.env.SANITY_PREVIEW_TOKEN;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    ...(previewToken ? { token: previewToken, perspective: "drafts" as const } : {}),
  });
}

export const client = buildClient();

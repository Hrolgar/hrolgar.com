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

  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
  });
}

export const client = buildClient();

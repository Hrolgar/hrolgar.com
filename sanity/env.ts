export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

if (typeof window !== "undefined" && !projectId) {
  console.warn("Missing NEXT_PUBLIC_SANITY_PROJECT_ID — set it in .env.local");
}

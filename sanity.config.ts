import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";
import { createNorwegianVersion } from "@/sanity/translateAction";
import { projectId, dataset } from "@/sanity/env";

export default defineConfig({
  name: "hrolgar",
  title: "Hrolgar",
  projectId,
  dataset,
  plugins: [structureTool({ structure, name: "studio", title: "Studio" }), visionTool(), codeInput()],
  schema: {
    types: schemaTypes,
  },
  document: {
    // Appended rather than replacing the defaults, so publish/delete/duplicate stay.
    actions: (prev) => [...prev, createNorwegianVersion],
  },
});

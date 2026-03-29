import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";
import { projectId, dataset } from "@/sanity/env";

export default defineConfig({
  name: "ullrhome",
  title: "Ullrhome",
  projectId,
  dataset,
  plugins: [structureTool({ structure, name: "studio", title: "Studio" }), visionTool(), colorInput(), codeInput()],
  schema: {
    types: schemaTypes,
  },
});

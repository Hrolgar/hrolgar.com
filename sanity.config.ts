import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { codeInput } from "@sanity/code-input";
import { schemaTypes } from "@/sanity/schemas";
import { structure } from "@/sanity/structure";
import { projectId, dataset } from "@/sanity/env";

export default defineConfig({
  name: "hrolgar",
  title: "Hrolgar",
  projectId,
  dataset,
  plugins: [structureTool({ structure, name: "studio", title: "Studio" }), visionTool(), codeInput()],
  // Email and password is the only way in, so skip the "choose login provider" screen,
  // and keep the session token in localStorage. The default ("dual") leans on a cookie
  // for api.sanity.io, which the browser treats as third-party on hrolgar.com and drops,
  // hence the repeated logins.
  auth: {
    loginMethod: "token",
    redirectOnSingle: true,
    providers: (prev) => prev.filter((p) => p.name === "sanity"),
  },
  schema: {
    types: schemaTypes,
  },
});

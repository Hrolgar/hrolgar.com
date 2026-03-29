import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Singletons
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("About / Hero")
        .id("about")
        .child(S.document().schemaType("about").documentId("about")),
      S.listItem()
        .title("Contact Info")
        .id("contactInfo")
        .child(S.document().schemaType("contactInfo").documentId("contactInfo")),

      S.divider(),

      // Collections
      S.listItem()
        .title("Experience")
        .schemaType("experience")
        .child(S.documentTypeList("experience").title("Experience")),
      S.listItem()
        .title("Projects")
        .schemaType("project")
        .child(S.documentTypeList("project").title("Projects")),
      S.listItem()
        .title("Skills")
        .schemaType("skill")
        .child(S.documentTypeList("skill").title("Skills")),
      S.listItem()
        .title("Certifications")
        .schemaType("certification")
        .child(S.documentTypeList("certification").title("Certifications")),

      S.divider(),

      // Blog
      S.listItem()
        .title("Blog Posts")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Blog Posts")),
      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Categories")),

      S.divider(),

      // Homelab
      S.listItem()
        .title("Homelab Services")
        .schemaType("homelabService")
        .child(S.documentTypeList("homelabService").title("Homelab Services")),
    ]);

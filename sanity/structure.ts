import type { StructureResolver, StructureBuilder } from "sanity/structure";

/**
 * Split a translatable type into English and Norwegian lists.
 *
 * Without this every Norwegian document sits in the same list as its English original and
 * the list doubles in length, which is how document-level translation normally becomes
 * unusable to edit. Documents created before translation existed have no `language` at
 * all, so English deliberately matches "en" OR missing.
 *
 * `initialValueTemplates` is emptied on the Norwegian list so "create new" from there
 * cannot make an untagged document that then shows up as English.
 */
function byLanguage(S: StructureBuilder, type: string, title: string) {
  return S.listItem()
    .title(title)
    .child(
      S.list()
        .title(title)
        .items([
          S.listItem()
            .title("English")
            .child(
              S.documentTypeList(type)
                .title(`${title} (English)`)
                .filter('_type == $type && (!defined(language) || language == "en")')
                .params({ type }),
            ),
          S.listItem()
            .title("Norsk")
            .child(
              S.documentTypeList(type)
                .title(`${title} (Norsk)`)
                .filter('_type == $type && language == "nb"')
                .params({ type })
                .initialValueTemplates([]),
            ),
        ]),
    );
}


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
      byLanguage(S, "experience", "Experience"),
      byLanguage(S, "project", "Projects"),
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
      byLanguage(S, "post", "Blog Posts"),
      byLanguage(S, "category", "Categories"),

      S.divider(),

      // Homelab
      S.listItem()
        .title("Homelab Services")
        .schemaType("homelabService")
        .child(S.documentTypeList("homelabService").title("Homelab Services")),

      S.divider(),

      // Services & FAQ
      byLanguage(S, "service", "Services"),
      byLanguage(S, "faq", "FAQ"),

      S.divider(),

      // Forms
      S.listItem()
        .title("Contact Forms")
        .schemaType("contactForm")
        .child(S.documentTypeList("contactForm").title("Contact Forms")),

      S.divider(),

      // Settings
      S.listItem()
        .title("Page Content")
        .id("pageContent")
        .child(S.document().schemaType("pageContent").documentId("pageContent")),
    ]);

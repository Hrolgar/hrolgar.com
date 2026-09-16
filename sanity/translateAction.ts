import { useClient } from "sanity";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";

/** Types that carry `language` + `translationOf`. */
const TRANSLATABLE = new Set([
  "project", "post", "service", "about", "pageContent",
  "faq", "category", "projectCategory", "homelabPage", "experience",
]);

/**
 * "Create Norwegian version" on any English document.
 *
 * Copies the English document, tags it `nb` and points `translationOf` back at the
 * original, so the editor starts from the real content and translates over it rather than
 * rebuilding the document from an empty form. The slug is carried across unchanged: both
 * languages use the same slugs and the front end distinguishes them by the /no prefix.
 *
 * Doing this by hand is where document-level translation usually goes wrong: a missing
 * translationOf means the page never replaces its English counterpart and silently does
 * nothing on the site.
 */
export const createNorwegianVersion: DocumentActionComponent = (props: DocumentActionProps) => {
  const { draft, published, type, onComplete } = props;
  // Hooks must run before any early return, so the client is taken unconditionally.
  const client = useClient({ apiVersion: "2024-01-01" });
  const doc = draft || published;

  if (!TRANSLATABLE.has(type) || !doc) return null;
  // Only offered on the English original, never on a translation.
  if ((doc as { language?: string }).language === "nb") return null;

  return {
    label: "Create Norwegian version",
    onHandle: async () => {
      const { _id, _rev, _createdAt, _updatedAt, ...rest } = doc as Record<string, unknown> & { _id: string };
      const source = _id.replace(/^drafts\./, "");
      await client.create({
        ...rest,
        _type: type,
        _id: `${source}-nb`,
        language: "nb",
        translationOf: { _type: "reference", _ref: source },
      });
      onComplete();
    },
  };
};

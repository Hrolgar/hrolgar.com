#!/usr/bin/env node
/**
 * One-off: move from a document per language to a field per language.
 *
 * Before, a Norwegian page was a second document (`service-api-integration-nb`) carrying a
 * copy of everything, including the slug, the image and the sort order that were never
 * language-specific to begin with. This folds each Norwegian document back into its English
 * parent as field values and deletes it.
 *
 *   title: "Backend Systems"          ->  title: {_type: "localeString",
 *   title: "Backend-systemer" (twin)         en: "Backend Systems", nb: "Backend-systemer"}
 *
 * Run with no arguments for a dry run, which prints every change and writes nothing:
 *
 *   node scripts/migrate-field-locales.mjs
 *   node scripts/migrate-field-locales.mjs --inspect service-api-integration
 *   node scripts/migrate-field-locales.mjs --apply
 *
 * ORDER MATTERS: deploy the new code FIRST, then run this.
 *
 * New code against old data is harmless — a plain string passes through the resolver
 * untouched, so English is perfect and the only blemish is that the leftover Norwegian
 * documents show up as duplicate rows in lists until this runs. Old code against migrated
 * data is NOT harmless: every title is suddenly an object and React refuses to render it.
 *
 * Needs SANITY_API_TOKEN for --apply (and to see drafts at all; an anonymous read returns
 * published documents only, so a dry run without a token is blind to unpublished edits).
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "2q4vx2j6";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = process.env.SANITY_API_TOKEN || "";
const API = `https://${PROJECT}.api.sanity.io/v2024-05-23`;
const APPLY = process.argv.includes("--apply");
const INSPECT = process.argv[process.argv.indexOf("--inspect") + 1];

const STR = "localeString";
const TXT = "localeText";
const BLK = "localeBlock";
const LST = "localeStringList";

/** Exactly the fields the schemas now declare translatable. Anything absent here is shared. */
const FIELDS = {
  about: { heading: STR, tagline: TXT, roles: LST, heroCta1Text: STR, heroCta2Text: STR, body: BLK },
  category: { title: STR },
  contactInfo: { location: STR },
  experience: { company: STR, role: STR, location: STR, description: BLK },
  faq: { question: STR, answer: TXT },
  homelabPage: { intro: BLK, architecture: BLK },
  pageContent: {
    contactHeading: STR, contactIntro: TXT, hireHeading: STR, hireDescription: TXT,
    hireBullets: LST, hireButtonText: STR, responseTime: STR, helloHeading: STR,
    helloDescription: TXT, helloButtonText: STR, servicesHeading: STR, servicesIntro: TXT,
    servicesCta: STR, servicesCtaDescription: TXT, serviceDetailCtaHeading: STR,
    serviceDetailCtaDescription: STR, serviceDetailCtaButtonText: STR, footerTagline: STR,
    aboutHeading: STR, experienceHeading: STR, projectsHeading: STR, projectsIntro: TXT,
    skillsHeading: STR, homelabHeading: STR, homelabSubtitle: STR, certificationsHeading: STR,
    blogPreviewHeading: STR, contactSectionHeading: STR, contactSectionTagline: STR,
    floatingCtaText: STR, blogPageHeading: STR, blogPageSubtitle: STR,
    projectsPageHeading: STR, projectsPageSubtitle: STR, homelabPageHeading: STR,
  },
  post: { title: STR, excerpt: TXT, body: BLK, tags: LST },
  project: {
    title: STR, summary: TXT, description: BLK, problem: TXT, approach: TXT,
    outcome: TXT, testimonial: TXT,
  },
  projectCategory: { title: STR },
  service: { title: STR, summary: TXT, description: BLK },
};

/** Translatable fields that live inside an array of objects, matched on `_key`. */
const NESTED = {
  pageContent: { navItems: { label: STR } },
  homelabPage: { hardware: { name: STR, description: TXT, specs: TXT }, stats: { label: STR } },
};

const TYPES = Object.keys(FIELDS);

async function query(groq) {
  const res = await fetch(`${API}/data/query/${DATASET}?query=${encodeURIComponent(groq)}`, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  });
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(`query failed: ${JSON.stringify(body).slice(0, 300)}`);
  return body.result;
}

function isEmpty(value) {
  if (value === undefined || value === null || value === "") return true;
  return Array.isArray(value) && value.length === 0;
}

/** True when a value has already been through this migration. */
function alreadyMigrated(value, type) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) && value._type === type;
}

/** `{_type, en, nb}` from an English value and its Norwegian counterpart. */
function localeValue(type, en, nb) {
  const out = { _type: type };
  if (!isEmpty(en)) out.en = en;
  if (!isEmpty(nb)) out.nb = nb;
  return Object.keys(out).length > 1 ? out : null;
}

function mergeNested(enArray, nbArray, fieldTypes) {
  if (!Array.isArray(enArray)) return undefined;
  const byKey = new Map((nbArray || []).map((item, i) => [item?._key ?? `#${i}`, item]));
  return enArray.map((item, i) => {
    const twin = byKey.get(item?._key ?? `#${i}`) || {};
    const next = { ...item };
    for (const [field, type] of Object.entries(fieldTypes)) {
      // Re-running must not wrap an already-wrapped value: {en: {en: "Home", nb: "Hjem"}}
      // renders as nothing and is invisible until someone looks at the nav.
      if (alreadyMigrated(item?.[field], type)) continue;
      const value = localeValue(type, item?.[field], twin?.[field]);
      if (value) next[field] = value;
      else delete next[field];
    }
    return next;
  });
}

function buildPatch(doc, twin) {
  const set = {};
  for (const [field, type] of Object.entries(FIELDS[doc._type] || {})) {
    // Already migrated? Leave it alone so the script can be re-run safely.
    if (alreadyMigrated(doc[field], type)) continue;
    const value = localeValue(type, doc[field], twin?.[field]);
    if (value) set[field] = value;
  }
  for (const [arrayField, fieldTypes] of Object.entries(NESTED[doc._type] || {})) {
    const merged = mergeNested(doc[arrayField], twin?.[arrayField], fieldTypes);
    // Only write it back if it actually differs, so a re-run reports honestly instead of
    // listing every nested array as "translated" when nothing changed.
    if (merged && JSON.stringify(merged) !== JSON.stringify(doc[arrayField])) set[arrayField] = merged;
  }
  return set;
}

async function mutate(mutations) {
  const res = await fetch(`${API}/data/mutate/${DATASET}?returnIds=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  });
  const body = await res.json();
  if (!res.ok || body.error) throw new Error(`mutate failed: ${JSON.stringify(body).slice(0, 500)}`);
  return body;
}

async function main() {
  if (APPLY && !TOKEN) throw new Error("--apply needs SANITY_API_TOKEN");
  if (!TOKEN) console.log("! No token: reading published documents only, drafts are invisible.\n");

  const docs = await query(`*[_type in ${JSON.stringify(TYPES)}]`);
  const twinOf = new Map();
  const norwegian = [];
  for (const doc of docs) {
    if (doc.language !== "nb") continue;
    norwegian.push(doc);
    const parent = doc.translationOf?._ref;
    if (parent) twinOf.set(parent, doc);
  }

  // Back up everything this touches, before it is touched.
  mkdirSync("_backup", { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 16);
  writeFileSync(`_backup/pre-field-locales-${stamp}.json`, JSON.stringify(docs, null, 2));

  const mutations = [];
  let changed = 0;
  for (const doc of docs) {
    if (doc.language === "nb") continue;
    const twin = twinOf.get(doc._id.replace(/^drafts\./, "")) || twinOf.get(doc._id);
    const set = buildPatch(doc, twin);
    const unset = ["language", "translationOf"].filter((f) => doc[f] !== undefined);
    if (!Object.keys(set).length && !unset.length) continue;
    changed++;
    const fields = Object.keys(set);
    console.log(
      `${doc._id}\n  translated: ${fields.length ? fields.join(", ") : "(none)"}` +
        `${twin ? `\n  merged from: ${twin._id}` : "\n  no Norwegian twin, English only"}`,
    );
    if (INSPECT && doc._id === INSPECT) {
      console.log(JSON.stringify(set, null, 2));
    }
    mutations.push({ patch: { id: doc._id, set, unset } });
  }

  for (const doc of norwegian) {
    console.log(`delete ${doc._id}`);
    mutations.push({ delete: { id: doc._id } });
  }

  console.log(
    `\n${changed} document(s) to migrate, ${norwegian.length} Norwegian document(s) to delete.`,
  );
  if (!APPLY) {
    console.log("Dry run. Nothing written. Re-run with --apply to commit.");
    return;
  }
  // One transaction: either the whole site is migrated or none of it is.
  const result = await mutate(mutations);
  console.log(`Applied. ${result.results?.length ?? 0} mutation(s) committed.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

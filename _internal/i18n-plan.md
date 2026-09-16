# Norwegian on hrolgar.com — plan

Goal (Hrolgar, 2026-09-16): every page available in Norwegian, every field translatable,
English stays the default.

## The fork: field-level vs document-level

**Field-level** turns every string into `{en, nb}`. One document holds both languages.
It means migrating ~117 fields across 113 documents and changing every read in the front
end. Good when only a handful of fields differ; here it rewrites the whole content layer.

**Document-level** (chosen) keeps the schema as it is and adds two fields: `language` and
`translationOf`. An English document stays exactly as it is today. A Norwegian version is a
NEW document pointing back at the English one.

Chosen because:
- No migration of existing content shape. Existing docs are tagged `en` and nothing else moves.
- Translation can be partial and progressive. Translate services first, projects later; any
  page without a Norwegian version simply serves English. Nothing breaks half-way.
- The front-end change is a filter and a fallback, not a rewrite of every field access.
- It is reversible: delete the Norwegian documents and the site is exactly as it was.

Cost: shared values (images, dates, technology references) are duplicated per language. For
a site this size that is cheaper than the alternative.

## URLs
English stays at the root. Norwegian lives under `/no/`.

    /services            ->  /no/tjenester
    /projects            ->  /no/prosjekter
    /contact             ->  /no/kontakt

English URLs MUST NOT move: 18 of them are indexed and they are the only search presence
the site has. Adding a locale segment to everything (`/en/services`) would throw that away.

Each page pair declares `hreflang` (`en`, `nb-NO`) plus `x-default` pointing at English, or
Google treats them as duplicates rather than translations.

**A language dropdown that swaps text at the same URL is worthless for search.** Google
indexes one version per URL; the Norwegian content would never be seen. Separate URLs are
the whole point.

## Which types get translated
Translate: project, post, service, about, pageContent, faq, category, projectCategory,
homelabPage, experience (role only, company names are proper nouns).

Do NOT translate: skill (37 docs of "C#", "Docker", "PostgreSQL"), contactInfo (addresses and
URLs), siteSettings colours. `homelabService` is borderline and can follow later.

## Stages
1. Schema + query layer. Add `language` and `translationOf`, make every query take a locale
   and fall back to English when a translation is missing. No visible change. **(this stage)**
2. The `/no` route tree, hreflang, and a "Norsk" link in the nav.
3. Writing the Norwegian content. This is translation work, not code, and it is the part that
   actually takes time. Written properly for search, not machine-translated: "systemutvikler
   Ålesund" and "frilans .NET utvikler" are the terms worth ranking for.

## Open question for stage 3
Whether the blog is translated at all. Its queries are English technical terms and the only
things currently ranking are English homelab searches. Hrolgar has asked for everything, so
the schema supports it; whether it earns the effort is a stage-3 call per post.

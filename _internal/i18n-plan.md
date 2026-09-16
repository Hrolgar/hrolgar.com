# Norwegian on hrolgar.com — plan

Goal (Hrolgar, 2026-09-16): every page available in Norwegian, every field translatable,
English stays the default.

## The fork: field-level vs document-level

**Document-level was chosen first and REVERSED the same evening.** Both are recorded here
because the reversal is the useful part.

**Document-level** adds `language` and `translationOf` to each schema; a Norwegian page is a
NEW document pointing back at the English one. It was chosen to avoid migrating ~117 fields
across 113 documents, and because translation could then be partial: a page with no Norwegian
document simply serves English.

**What it actually cost, measured after building it:** between three and seven fields per
type have nothing to do with language — slug, image, dates, sort order, GitHub URL — and were
copied into the twin anyway. They drift. They had already drifted: `about-nb` was missing
`profileImage` and `resumeFile`, which is why the Norwegian About page rendered with no
portrait and no CV link. And the editing cost is permanent, not one-off: every new project,
post or service has to be created twice and kept in sync by hand forever.

Hrolgar's objection, which settled it: *"I would have to make 2 out of every new thing. It is
not scaleable at all."*

**Field-level** (chosen, built 2026-09-16) puts the languages on the FIELD. One document per
thing. `title` holds `{en, nb}`; `slug`, `image` and `order` hold one value each because they
were never language-specific, so they cannot drift. A missing Norwegian value falls back to
English per field, so partial translation still works — the property that document-level was
picked for in the first place is kept.

The migration cost that ruled it out the first time was real but one-off:
`scripts/migrate-field-locales.mjs`, run once, 57 documents patched and 25 twins deleted.

**The thing that makes it scale**, and the reason to prefer it over the plugin versions of
the same idea: the translatable field types are GENERATED from `LOCALES` with `.map()`, and
the routes live at `app/[locale]/*` reading the same list. No schema and no route file names
a language. A third language is one entry in `sanity/locale.ts` plus the translations.

## URLs
English stays at the root. Norwegian lives under `/no/`.

    /services            ->  /no/services
    /projects            ->  /no/projects
    /contact             ->  /no/contact

Translated slugs (`/no/tjenester`) were the first plan and were dropped: they double the route
tree for no gain when both languages render from the same component, and Hrolgar rejected
maintaining two sets of page files for one page.

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
1. ~~Schema + query layer~~ **done**, then rebuilt field-level (see the fork above). Queries
   carry no language filter at all now; `resolveLocale` collapses the fields after the fetch.
2. ~~The `/no` route tree and hreflang~~ **done**, as `app/[locale]/*`. Both URLs are in the
   sitemap with the hreflang pair, which is how Google finds `/no` at all: nothing on the
   English site links to it. A "Norsk" link in the nav is still open.
3. Writing the Norwegian content. This is translation work, not code, and it is the part that
   actually takes time. Written properly for search, not machine-translated: "systemutvikler
   Ålesund" and "frilans .NET utvikler" are the terms worth ranking for.

## Open question for stage 3
Whether the blog is translated at all. Its queries are English technical terms and the only
things currently ranking are English homelab searches. Hrolgar has asked for everything, so
the schema supports it; whether it earns the effort is a stage-3 call per post.

## Deploy order, learned the hard way (2026-09-16)

**Deploy the code first, migrate the content second.** New code against old data is harmless:
a plain string passes through the resolver untouched. Old code against migrated data is not:
every title becomes an object and React refuses to render one, so the English site returns 500
on every page. That is what happened here, for a few minutes, because the migration ran while
the old build was still live.

## Still English, on purpose

The 19 case studies and 12 blog posts. That is roughly 18,000 words and a decision about
whether Norwegian technical writing is worth ranking for, not an oversight. They now fall back
to English per field, so they render correctly on `/no` either way.

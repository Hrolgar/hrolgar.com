import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { client } from "@/sanity/lib/client";

const INDEXNOW_KEY = '89367e5b474265a644c2c41429045b83';

const TYPE_LIST_PATHS: Record<string, string> = {
  post: '/blog',
  project: '/projects',
  service: '/services',
  category: '/blog',
  blogCategory: '/blog',
  privacyPage: '/privacy',
};

// Category pages are noindex, so they are never submitted as items.
const TYPE_ITEM_PATHS: Record<string, string> = {
  post: '/blog',
  project: '/projects',
  service: '/services',
};

export function buildIndexNowUrls(body: unknown): string[] {
  const urls: string[] = ['https://hrolgar.com'];

  let docType: string | undefined;
  let slug: string | undefined;

  if (body && typeof body === 'object') {
    const b = body as Record<string, unknown>;
    const doc = (b.document && typeof b.document === 'object' ? b.document : b) as Record<string, unknown>;

    docType = typeof doc._type === 'string' ? doc._type : undefined;

    const rawSlug = doc.slug;
    if (rawSlug && typeof rawSlug === 'object') {
      const slugObj = rawSlug as Record<string, unknown>;
      slug = typeof slugObj.current === 'string' ? slugObj.current : undefined;
    } else if (typeof rawSlug === 'string') {
      slug = rawSlug;
    }
  }

  if (docType && TYPE_LIST_PATHS[docType]) {
    const listUrl = `https://hrolgar.com${TYPE_LIST_PATHS[docType]}`;
    if (!urls.includes(listUrl)) urls.push(listUrl);
  }

  if (docType && slug && TYPE_ITEM_PATHS[docType]) {
    const itemUrl = `https://hrolgar.com${TYPE_ITEM_PATHS[docType]}/${slug}`;
    if (!urls.includes(itemUrl)) urls.push(itemUrl);
  }

  return urls;
}

type DocRef = { _type?: string; slug?: string; status?: string };

/** Document ids named by a webhook body, whatever shape it arrived in, without the drafts. prefix. */
export function webhookDocIds(body: unknown): string[] {
  if (!body || typeof body !== 'object') return [];
  const b = body as Record<string, unknown>;
  const ids: string[] = [];
  const doc = (b.document && typeof b.document === 'object' ? b.document : b) as Record<string, unknown>;
  if (typeof doc._id === 'string') ids.push(doc._id);
  // Legacy-style webhooks send only { ids: { created, updated, deleted } }.
  const idGroups = b.ids && typeof b.ids === 'object' ? (b.ids as Record<string, unknown>) : undefined;
  for (const group of ['created', 'updated']) {
    const list = idGroups?.[group];
    if (Array.isArray(list)) ids.push(...list.filter((x): x is string => typeof x === 'string'));
  }
  return [...new Set(ids.map((id) => id.replace(/^drafts\./, '')))];
}

/**
 * The URLs to send to IndexNow for one webhook call.
 *
 * The Sanity webhook body is empty, so the document is identified by id (the
 * sanity-document-id header, merged in by POST, or _id / ids in the body) and looked up. Whenever
 * an id is available the lookup is the source of truth, so a post's status is always checked
 * and a draft's 404 URL is never submitted. Only when there is no id at all does the body's own
 * _type/slug get used.
 */
export async function resolveIndexNowUrls(
  body: unknown,
  fetchDocs: (ids: string[]) => Promise<DocRef[]> = (ids) =>
    client.fetch(`*[_id in $ids]{_type, "slug": slug.current, status}`, { ids }),
): Promise<string[]> {
  const ids = webhookDocIds(body);
  if (ids.length === 0) return buildIndexNowUrls(body);
  const urls = ['https://hrolgar.com'];
  let docs: DocRef[] = [];
  try {
    docs = (await fetchDocs(ids)) || [];
  } catch (err) {
    console.error('[IndexNow] document lookup failed:', err);
  }
  for (const doc of docs) {
    if (doc._type === 'post' && doc.status !== 'published') continue;
    for (const url of buildIndexNowUrls({ _type: doc._type, slug: doc.slug })) {
      if (!urls.includes(url)) urls.push(url);
    }
  }
  return urls;
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sanity-webhook-secret");
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret || !expectedSecret) {
    return NextResponse.json({ message: "Missing secret" }, { status: 401 });
  }

  const secretBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expectedSecret);

  if (
    secretBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(secretBuffer, expectedBuffer)
  ) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  for (const path of ["/", "/projects", "/experience", "/homelab", "/services", "/blog", "/contact", "/privacy"]) {
    revalidatePath(path);
  }
  // The translated pages under app/[locale] are DELIBERATELY not revalidated here, and this
  // is the one place the two languages behave differently.
  //
  // Measured against a production build, both ways of naming them destroy the page: the
  // concrete path ("/no/contact") and the route pattern ("/[locale]/contact", "page") each
  // drop the prebuilt entry, and `dynamicParams = false` then forbids rebuilding it, so
  // every Norwegian page answers 404 until the next deploy. Setting dynamicParams = true
  // does let them rebuild, but then an unknown segment like /xx renders the 404 page with
  // an HTTP 200 — a soft 404, which is worse than a slow page because Google indexes it.
  //
  // So they ride their own `revalidate = 3600`: a Norwegian edit is live within the hour
  // rather than instantly. The real fix is tagging the Sanity fetches and using
  // revalidateTag, which sidesteps path invalidation entirely. Worth doing when Norwegian
  // content is edited often enough for the hour to matter.
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath("/services/[slug]", "page");
  // The sitemap and robots are their own routes; without these a publish reaches every
  // page but leaves the sitemap advertising the old set of URLs.
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");

  let body: unknown = undefined;
  try {
    body = await req.json();
  } catch {
    // body may be empty or non-JSON (e.g. manual pings)
  }

  try {
    // Sanity's webhook body carries none of the fields above (the live one arrives without
    // _type, slug or _id), but every GROQ webhook names its document in this header.
    const headerId = req.headers.get('sanity-document-id');
    const shaped =
      headerId && webhookDocIds(body).length === 0
        ? { ...(body && typeof body === 'object' ? (body as Record<string, unknown>) : {}), _id: headerId }
        : body;
    if (body && typeof body === 'object') console.log('[IndexNow] webhook body keys', Object.keys(body), 'header id', headerId);
    const urlList = await resolveIndexNowUrls(shaped);
    console.log('[IndexNow] submitting', urlList);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      // A hung IndexNow must not hold the webhook open: Sanity would retry and revalidate again.
      signal: AbortSignal.timeout(5000),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'hrolgar.com',
        key: INDEXNOW_KEY,
        keyLocation: 'https://hrolgar.com/89367e5b474265a644c2c41429045b83.txt',
        urlList,
      }),
    });
    // 200/202 = accepted. Anything else (403 key mismatch, 422 URL not on host) used to vanish.
    console.log('[IndexNow] response', res.status);
  } catch (err) {
    console.error('[IndexNow] ping failed:', err);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

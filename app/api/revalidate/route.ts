import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const INDEXNOW_KEY = '89367e5b474265a644c2c41429045b83';

const TYPE_LIST_PATHS: Record<string, string> = {
  post: '/blog',
  project: '/projects',
  service: '/services',
  category: '/blog',
  blogCategory: '/blog',
};

const TYPE_ITEM_PATHS: Record<string, string> = {
  post: '/blog',
  project: '/projects',
  service: '/services',
  category: '/blog/category',
  blogCategory: '/blog/category',
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

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/experience");
  revalidatePath("/homelab");
  revalidatePath("/services");
  revalidatePath("/blog");
  revalidatePath("/contact");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/blog/category/[slug]", "page");
  revalidatePath("/services/[slug]", "page");

  let body: unknown = undefined;
  try {
    body = await req.json();
  } catch {
    // body may be empty or non-JSON (e.g. manual pings)
  }

  try {
    const urlList = buildIndexNowUrls(body);
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'hrolgar.com',
        key: INDEXNOW_KEY,
        keyLocation: 'https://hrolgar.com/89367e5b474265a644c2c41429045b83.txt',
        urlList,
      }),
    });
  } catch (err) {
    console.error('[IndexNow] ping failed:', err);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

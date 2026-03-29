import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

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

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

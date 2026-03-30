import { NextResponse } from "next/server";

const DISCORD_WEBHOOK = process.env.DISCORD_CONTACT_WEBHOOK;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formName, fields } = body;

    if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    for (const [key, value] of Object.entries(fields)) {
      if (key === "email" && typeof value === "string" && value.trim() && !emailRegex.test(value.trim())) {
        return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
      }
    }

    const fieldLines = Object.entries(fields)
      .filter(([, value]) => typeof value === "string" && value.trim())
      .map(([key, value]) => `**${key}**: ${value}`)
      .join("\n");

    const embed = {
      title: `New ${formName || "Contact"} Submission`,
      description: fieldLines || "No fields submitted",
      color: 0xe07a5f,
      timestamp: new Date().toISOString(),
    };

    if (DISCORD_WEBHOOK) {
      const response = await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });

      if (!response.ok) {
        return NextResponse.json({ error: "Failed to deliver message" }, { status: 502 });
      }
    } else {
      console.log("Contact form submission:", { formName, fields });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

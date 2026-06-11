import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getContact } from "@/sanity/lib/queries";

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

    // Email notification — best-effort; failure does not affect the response
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (smtpUser && smtpPass) {
      try {
        const contact = await getContact();
        const notificationEmail = contact?.formNotificationEmail;
        if (notificationEmail) {
          const smtpHost = process.env.SMTP_HOST ?? "smtp.gmail.com";
          const smtpPort = parseInt(process.env.SMTP_PORT ?? "465", 10);
          const smtpFrom = process.env.SMTP_FROM ?? "Hrolgar.com Contact <helgi@skjortnes.dev>";

          const transport = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465,
            auth: { user: smtpUser, pass: smtpPass },
          });

          const submitterEmail =
            typeof fields.email === "string" && emailRegex.test(fields.email.trim())
              ? fields.email.trim()
              : undefined;

          const htmlBody = fieldLines
            .replace(/\*\*([^*]+)\*\*:/g, "<strong>$1</strong>:")
            .replace(/\n/g, "<br/>");

          await transport.sendMail({
            from: smtpFrom,
            to: notificationEmail,
            ...(submitterEmail ? { replyTo: submitterEmail } : {}),
            subject: `New ${formName || "Contact"} submission`,
            text: fieldLines || "No fields submitted",
            html: htmlBody || "No fields submitted",
          });
        }
      } catch (emailErr) {
        console.error("Email notification failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

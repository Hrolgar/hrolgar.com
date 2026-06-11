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

          const escapeHtml = (value: string) =>
            value
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;");

          const formatLabel = (key: string) =>
            key
              .replace(/[_-]+/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .toUpperCase();

          const emailFields = Object.entries(fields)
            .filter(([, value]) => typeof value === "string" && value.trim())
            .map(([key, value]) => ({
              label: formatLabel(key),
              value: (value as string).trim(),
              isMessage: key.toLowerCase() === "message",
            }));

          const htmlRows = emailFields
            .map(({ label, value, isMessage }) => {
              const escapedLabel = escapeHtml(label);
              const escapedValue = escapeHtml(value);
              const renderedValue = isMessage ? escapedValue.replace(/\n/g, "<br/>") : escapedValue;
              const valueStyle = isMessage
                ? "margin:0;padding:16px;background:#fafafa;border:1px solid #e4e4e7;border-radius:6px;color:#18181b;font:16px/1.6 Georgia,'Times New Roman',serif;"
                : "margin:0;color:#18181b;font:17px/1.55 Georgia,'Times New Roman',serif;";

              return `
                    <tr>
                      <td style="padding:0 24px 22px 24px;">
                        <div style="margin:0 0 7px 0;color:#71717a;font:700 11px/1.3 Arial,Helvetica,sans-serif;letter-spacing:0.08em;text-transform:uppercase;">${escapedLabel}</div>
                        <div style="${valueStyle}">${renderedValue}</div>
                      </td>
                    </tr>`;
            })
            .join("");

          const htmlBody = `<!doctype html>
<html>
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
  <body style="margin:0;padding:0;background:#f4f4f5;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f4f4f5;margin:0;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-collapse:separate;border-spacing:0;border:1px solid #e4e4e7;">
            <tr>
              <td style="background:#e07a5f;padding:22px 24px;">
                <h1 style="margin:0;color:#ffffff;font:700 22px/1.3 Georgia,'Times New Roman',serif;">New contact form submission</h1>
              </td>
            </tr>
            <tr>
              <td style="height:24px;line-height:24px;font-size:24px;">&nbsp;</td>
            </tr>
${htmlRows || `
                    <tr>
                      <td style="padding:0 24px 22px 24px;">
                        <div style="margin:0;color:#18181b;font:17px/1.55 Georgia,'Times New Roman',serif;">No fields submitted</div>
                      </td>
                    </tr>`}
            <tr>
              <td style="padding:18px 24px 22px 24px;border-top:1px solid #e4e4e7;color:#71717a;font:13px/1.5 Arial,Helvetica,sans-serif;">Sent from the hrolgar.com contact form</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

          const text = emailFields.length
            ? emailFields.map(({ label, value }) => `${label}: ${value}`).join("\n")
            : "No fields submitted";

          await transport.sendMail({
            from: smtpFrom,
            to: notificationEmail,
            ...(submitterEmail ? { replyTo: submitterEmail } : {}),
            subject: `New ${formName || "Contact"} submission`,
            text,
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

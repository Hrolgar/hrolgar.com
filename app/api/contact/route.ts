import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import MailComposer from "nodemailer/lib/mail-composer";
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

    let discordOk = false;
    if (DISCORD_WEBHOOK) {
      try {
        const response = await fetch(DISCORD_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ embeds: [embed] }),
        });

        discordOk = response.ok;
      } catch (discordErr) {
        console.error("Discord notification failed:", discordErr);
      }
    } else {
      console.log("Contact form submission:", { formName, fields });
    }

    // Email notification via IMAP append — best-effort; failure does not affect the response
    const imapUser = process.env.IMAP_USER;
    const imapPass = process.env.IMAP_PASS;
    let imapOk = false;
    if (imapUser && imapPass) {
      try {
        const imapHost = process.env.IMAP_HOST ?? "imap.gmail.com";
        const imapPort = parseInt(process.env.IMAP_PORT ?? "993", 10);
        const imapFolder = process.env.IMAP_FOLDER ?? "INBOX";
        const imapLabel = process.env.IMAP_LABEL ?? "Contact Form";
        const imapFrom = process.env.IMAP_FROM ?? '"Hrolgar.com Contact" <contact@skjortnes.dev>';

        const contact = await getContact();
        const toEmail = contact?.formNotificationEmail ?? imapUser;

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
              ? "margin:0;padding:16px;background:#24242e;border:1px solid #2e2e38;border-radius:8px;color:#e8e4e0;font:16px/1.6 'Fraunces',Georgia,'Times New Roman',serif;"
              : "margin:0;color:#e8e4e0;font:17px/1.55 'Fraunces',Georgia,'Times New Roman',serif;";

            return `
                    <tr>
                      <td style="padding:0 24px 22px 24px;">
                        <div style="margin:0 0 7px 0;color:#9a9590;font:700 11px/1.3 'DM Sans',Helvetica,Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;">${escapedLabel}</div>
                        <div style="${valueStyle}">${renderedValue}</div>
                      </td>
                    </tr>`;
          })
          .join("");

        const htmlBody = `<!doctype html>
<html>
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
  <body style="margin:0;padding:0;background:#111116;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#111116;margin:0;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#1a1a22;border-collapse:separate;border-spacing:0;border:1px solid #2e2e38;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="height:4px;line-height:4px;font-size:4px;background:#5eaba8;padding:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:22px 24px 20px 24px;">
                <h1 style="margin:0;color:#e8e4e0;font:700 22px/1.3 'Fraunces',Georgia,'Times New Roman',serif;">New contact form submission</h1>
                <div style="width:44px;height:2px;line-height:2px;font-size:2px;background:#e07a5f;margin:12px 0 0 0;">&nbsp;</div>
              </td>
            </tr>
${htmlRows || `
                    <tr>
                      <td style="padding:0 24px 22px 24px;">
                        <div style="margin:0;color:#e8e4e0;font:17px/1.55 'Fraunces',Georgia,'Times New Roman',serif;">No fields submitted</div>
                      </td>
                    </tr>`}
            <tr>
              <td style="padding:18px 24px 22px 24px;border-top:1px solid #2e2e38;color:#9a9590;font:13px/1.5 'DM Sans',Helvetica,Arial,sans-serif;">Sent from the hrolgar.com contact form</td>
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

        const name = typeof fields.name === "string" ? fields.name.trim() : "";
        const email = typeof fields.email === "string" ? fields.email.trim() : "";
        const subject = `New contact from ${name || email || "website"}`;

        const rawMessage = await new MailComposer({
          from: imapFrom,
          to: toEmail,
          ...(submitterEmail ? { replyTo: submitterEmail } : {}),
          subject,
          text,
          html: htmlBody,
        })
          .compile()
          .build();

        const client = new ImapFlow({
          host: imapHost,
          port: imapPort,
          secure: true,
          auth: { user: imapUser, pass: imapPass },
          logger: false,
        });

        await client.connect();
        try {
          const lock = await client.getMailboxLock(imapFolder);
          try {
            const appendResult = await client.append(imapFolder, rawMessage, []);
            const labelRange =
              appendResult !== false
                ? appendResult.uid
                  ? { range: String(appendResult.uid), uid: true }
                  : appendResult.seq
                    ? { range: String(appendResult.seq), uid: false }
                    : undefined
                : undefined;

            if (labelRange && imapLabel) {
              await client.messageFlagsAdd(labelRange.range, [imapLabel], {
                useLabels: true,
                uid: labelRange.uid,
              });
            }
          } finally {
            lock.release();
          }
        } finally {
          await client.logout();
        }
        imapOk = true;
      } catch (imapErr) {
        console.error("IMAP notification failed:", imapErr);
      }
    }

    const hasDiscordChannel = Boolean(DISCORD_WEBHOOK);
    const hasImapChannel = Boolean(imapUser && imapPass);
    const hasConfiguredChannel = hasDiscordChannel || hasImapChannel;

    if (!hasConfiguredChannel || discordOk || imapOk) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Failed to deliver message" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

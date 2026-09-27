import "server-only";
import { Resend } from "resend";
import type { ContactInput } from "./contact-schema";

/**
 * Email delivery is OFF until all of these are set on the server:
 *   CONTACT_DELIVERY_ENABLED=true
 *   RESEND_API_KEY=re_...
 *   CONTACT_TO_EMAIL=inbox@your-domain.com
 *   CONTACT_FROM_EMAIL="Different Website <website@your-verified-domain.com>"
 * Until then the form tells visitors plainly that nothing was sent.
 */
export function deliveryConfigured(): boolean {
  return (
    process.env.CONTACT_DELIVERY_ENABLED === "true" &&
    Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL)
  );
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendContactEmail(data: ContactInput, locale: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const rows: [string, string | undefined][] = [
    ["Name", data.name],
    ["Company", data.company],
    ["Email", data.email],
    ["Phone", data.phone || undefined],
    ["Service of interest", data.service || undefined],
    ["Site language", locale],
  ];
  const text = [...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), "", data.message].join("\n");
  const html = `
    <table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px">
      ${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="color:#5f6664">${k}</td><td><strong>${escape(v!)}</strong></td></tr>`)
        .join("")}
    </table>
    <p style="font-family:system-ui,sans-serif;font-size:15px;white-space:pre-wrap">${escape(data.message)}</p>`;

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: process.env.CONTACT_TO_EMAIL!.split(",").map((s) => s.trim()),
    replyTo: data.email,
    subject: `New inquiry: ${data.company} (${data.name})`,
    text,
    html,
  });
  if (error) throw new Error(`Resend: ${error.name}: ${error.message}`);
}

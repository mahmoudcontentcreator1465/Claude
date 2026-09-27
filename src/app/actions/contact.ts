"use server";

import { headers } from "next/headers";
import { contactSchema, fieldErrors, type ContactState } from "@/lib/contact-schema";
import { deliveryConfigured, sendContactEmail } from "@/lib/contact-delivery";
import { rateLimit } from "@/lib/rate-limit";

const MIN_FILL_MS = 3000;

async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile is optional; honeypot + timing + rate limit still apply.
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const json = (await res.json()) as { success?: boolean };
  return json.success === true;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";

  // 1. Honeypot: a hidden field that people never fill in.
  if (String(formData.get("website") ?? "").length > 0) return { status: "spam" };

  // 2. Timing: bots tend to submit instantly.
  const started = Number(formData.get("startedAt"));
  if (!Number.isFinite(started) || Date.now() - started < MIN_FILL_MS) return { status: "spam" };

  // 3. Validate.
  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    company: formData.get("company") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    service: formData.get("service") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) return { status: "invalid", errors: fieldErrors(parsed.error) };

  // 4. Rate limit per IP.
  if (!rateLimit(ip)) return { status: "rate-limited" };

  // 5. Optional Cloudflare Turnstile.
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response") as string | null, ip))) return { status: "spam" };

  // 6. Deliver, or say honestly that delivery isn't connected.
  if (!deliveryConfigured()) return { status: "not-configured" };
  try {
    await sendContactEmail(parsed.data, String(formData.get("locale") ?? ""));
    return { status: "success" };
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return { status: "error" };
  }
}

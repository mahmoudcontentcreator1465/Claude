import { z } from "zod";

/**
 * Shared by the browser (instant feedback) and the server (the real check).
 * Error messages are translation keys under `contact.errors`.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name").max(120, "name"),
  company: z.string().trim().min(1, "company").max(160, "company"),
  email: z.string().trim().max(200, "email").pipe(z.email("email")),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-().]{7,22}$/, "phone")
    .or(z.literal(""))
    .optional(),
  service: z.string().trim().max(80).optional(),
  message: z.string().trim().min(20, "message").max(3000, "messageLong"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: Partial<Record<ContactField, string>> }
  | { status: "success" }
  | { status: "not-configured" }
  | { status: "rate-limited" }
  | { status: "spam" }
  | { status: "error" };

export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

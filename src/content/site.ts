/**
 * Contact details and social links.
 * Anything with `placeholder: true` is NOT real yet: it renders with a "TBC" marker and
 * no working link. Replace the value and delete `placeholder` to make it live.
 */
export interface ContactPoint {
  value: string;
  href?: string;
  placeholder?: true;
}

export const site = {
  name: "Different",
  email: { value: "hello@your-domain.com", placeholder: true } as ContactPoint,
  /** International format without "+" or spaces, e.g. "201001234567". */
  whatsapp: { value: "+20 XXX XXX XXXX", placeholder: true } as ContactPoint & { number?: string },
  socials: [
    { id: "instagram", label: "Instagram", value: "", placeholder: true },
    { id: "facebook", label: "Facebook", value: "", placeholder: true },
    { id: "tiktok", label: "TikTok", value: "", placeholder: true },
    { id: "linkedin", label: "LinkedIn", value: "", placeholder: true },
    { id: "behance", label: "Behance", value: "", placeholder: true },
  ] as ({ id: string; label: string } & ContactPoint)[],
};

export function whatsappHref(): string | undefined {
  const w = site.whatsapp;
  if (w.placeholder || !w.number) return undefined;
  return `https://wa.me/${w.number}`;
}

export function emailHref(): string | undefined {
  return site.email.placeholder ? undefined : `mailto:${site.email.value}`;
}

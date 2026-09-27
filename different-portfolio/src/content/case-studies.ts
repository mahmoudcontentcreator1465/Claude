import type { CaseStudy } from "./types";

/**
 * Case studies. The three entries below are PLACEHOLDER TEMPLATES, not real projects:
 * they have no client and contain no claims. Replace their text and visuals with real
 * material, set `clientId`, then change `status` to "published".
 *
 * `results` stays empty until verified figures are supplied; the results section
 * is not rendered without them.
 */
const placeholder = {
  en: "Placeholder. Real project copy will go here once the brief and materials are supplied.",
  ar: "نص مؤقت. هيتحط هنا الكلام الحقيقي عن المشروع أول ما البريف والمواد توصل.",
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "draft-coastal-campaign",
    status: "draft",
    clientId: null,
    order: 1,
    featured: true,
    title: { en: "Case study one", ar: "دراسة حالة رقم واحد" },
    projectType: { en: "Seasonal campaign (example format)", ar: "حملة موسمية (شكل مقترح)" },
    services: ["creative-campaigns", "content-creation"],
    summary: placeholder,
    cover: { kind: "art", variant: "coast" },
    overview: placeholder,
    challenge: placeholder,
    approach: placeholder,
    deliverables: { en: ["To be supplied"], ar: ["هيتحدد لاحقًا"] },
    gallery: [
      { visual: { kind: "art", variant: "coast" }, size: "full" },
      { visual: { kind: "art", variant: "route" }, size: "tall" },
      { visual: { kind: "art", variant: "oasis" }, size: "tall" },
      { visual: { kind: "art", variant: "city" }, size: "wide" },
    ],
    missing: ["client", "title", "overview", "challenge", "approach", "deliverables", "visuals", "results (optional, verified only)"],
  },
  {
    slug: "draft-destination-content",
    status: "draft",
    clientId: null,
    order: 2,
    featured: true,
    title: { en: "Case study two", ar: "دراسة حالة رقم اتنين" },
    projectType: { en: "Always-on social content (example format)", ar: "محتوى سوشيال مستمر (شكل مقترح)" },
    services: ["social-media-management", "photo-video-production"],
    summary: placeholder,
    cover: { kind: "art", variant: "desert" },
    overview: placeholder,
    challenge: placeholder,
    approach: placeholder,
    deliverables: { en: ["To be supplied"], ar: ["هيتحدد لاحقًا"] },
    gallery: [
      { visual: { kind: "art", variant: "desert" }, size: "wide" },
      { visual: { kind: "art", variant: "oasis" }, size: "square" },
      { visual: { kind: "art", variant: "route" }, size: "square" },
    ],
    missing: ["client", "title", "overview", "challenge", "approach", "deliverables", "visuals"],
  },
  {
    slug: "draft-brand-identity",
    status: "draft",
    clientId: null,
    order: 3,
    featured: false,
    title: { en: "Case study three", ar: "دراسة حالة رقم تلاتة" },
    projectType: { en: "Brand identity (example format)", ar: "هوية بصرية (شكل مقترح)" },
    services: ["branding-identity"],
    summary: placeholder,
    cover: { kind: "art", variant: "city" },
    overview: placeholder,
    challenge: placeholder,
    approach: placeholder,
    deliverables: { en: ["To be supplied"], ar: ["هيتحدد لاحقًا"] },
    gallery: [
      { visual: { kind: "art", variant: "city" }, size: "full" },
      { visual: { kind: "art", variant: "coast" }, size: "square" },
      { visual: { kind: "art", variant: "desert" }, size: "square" },
    ],
    missing: ["client", "title", "overview", "challenge", "approach", "deliverables", "visuals"],
  },
];

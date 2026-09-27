import type { Service } from "./types";

/**
 * Proposed services. All are `draft` until Different confirms which ones it offers.
 * To publish one, change its status to "published".
 */
export const services: Service[] = [
  {
    id: "social-media-management",
    order: 1,
    status: "draft",
    title: { en: "Social Media Management", ar: "إدارة السوشيال ميديا" },
    description: {
      en: "An always-on presence with a point of view: planning, publishing and community care that keeps your brand in the conversation.",
      ar: "حضور مستمر وله شخصية: تخطيط ونشر ومتابعة مع جمهورك، عشان البراند بتاعك يفضل جوّه الكلام.",
    },
  },
  {
    id: "content-creation",
    order: 2,
    status: "draft",
    title: { en: "Content Creation", ar: "صناعة المحتوى" },
    description: {
      en: "Reels, stories, posts and copy shaped around how travellers actually scroll, save and share.",
      ar: "ريلز وستوريز وبوستات وكلام مكتوب على مقاس المسافر: إزاي بيقلّب، وإيه اللي بيحفظه، وإيه اللي بيشاركه.",
    },
  },
  {
    id: "creative-campaigns",
    order: 3,
    status: "draft",
    title: { en: "Creative Campaigns", ar: "الحملات الإبداعية" },
    description: {
      en: "Big ideas for seasons, launches and destinations, built to travel across every channel.",
      ar: "أفكار كبيرة للمواسم والإطلاقات والوجهات، معمولة عشان تتنقّل بسهولة بين كل القنوات.",
    },
  },
  {
    id: "photo-video-production",
    order: 4,
    status: "draft",
    title: { en: "Photography & Video Production", ar: "التصوير وإنتاج الفيديو" },
    description: {
      en: "On-location shoots that capture the light, texture and pace of a place.",
      ar: "تصوير في قلب المكان، بيلقط نوره وتفاصيله وإيقاعه الحقيقي.",
    },
  },
  {
    id: "branding-identity",
    order: 5,
    status: "draft",
    title: { en: "Branding & Visual Identity", ar: "البراندنج والهوية البصرية" },
    description: {
      en: "Names, logos and visual systems for travel brands that want to be remembered.",
      ar: "أسامي ولوجوهات وأنظمة بصرية لبراندات سفر عايزة تتفتكر.",
    },
  },
  {
    id: "performance-marketing",
    order: 6,
    status: "draft",
    title: { en: "Performance Marketing", ar: "التسويق بالأداء" },
    description: {
      en: "Paid media planned around the booking journey, measured and refined while it runs.",
      ar: "إعلانات ممولة متخططة على رحلة الحجز، بنقيسها ونطوّرها وهي شغالة.",
    },
  },
  {
    id: "digital-strategy",
    order: 7,
    status: "draft",
    title: { en: "Digital Strategy", ar: "الاستراتيجية الرقمية" },
    description: {
      en: "Clear priorities for where to show up, what to say and how to grow.",
      ar: "أولويات واضحة: تظهر فين، تقول إيه، وتكبر إزاي.",
    },
  },
  {
    id: "travel-tourism-marketing",
    order: 8,
    status: "draft",
    title: { en: "Travel & Tourism Marketing", ar: "تسويق السفر والسياحة" },
    description: {
      en: "Marketing thinking shaped by how people dream about, plan and book their trips.",
      ar: "تفكير تسويقي مبني على إزاي الناس بتحلم برحلتها، وبتخطط لها، وبتحجزها.",
    },
  },
];

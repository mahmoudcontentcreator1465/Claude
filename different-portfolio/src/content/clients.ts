import type { Client } from "./types";

// Batch 1: the four files saved from the chat upload (kept as received).
import whiteskyLogo from "@/assets/clients/batch-1/upload-2.jpg";
import charmLightLogo from "@/assets/clients/batch-1/upload-3.jpg";
import bosatLogo from "@/assets/clients/batch-1/upload-4.jpg";
import sobekLogo from "@/assets/clients/batch-1/upload-5.jpg";

// Batch 2: Archive.zip, original filenames preserved.
import megaStarLogo from "@/assets/clients/batch-2/469187836_122249857022008944_7182244215854711483_n.jpg";
import megaStarStackedLogo from "@/assets/clients/batch-2/Layer 1 c.png";
import abouSamraLogo from "@/assets/clients/batch-2/553573056_1101946915357509_7878353599495716863_n.jpg";
import tropicLogo from "@/assets/clients/batch-2/788453780_929179123589121_7888605478370868974_n.jpg";
import iStarLogo from "@/assets/clients/batch-2/631060198_17843882436687912_5694206642705520466_n.jpg";
import tropitelLogo from "@/assets/clients/batch-2/656134369_1264364512549420_2233866556029060380_n.avif";
import sisiMohandessinLogo from "@/assets/clients/batch-2/سيسي ترافيل فرع المهندسين.png";
import sisiNasrCityLogo from "@/assets/clients/batch-2/سيسي ترافيل مدينة نصر.png";
import utopiaLogo from "@/assets/clients/batch-2/شنمىسيرنم.png";
import newAgeLogo from "@/assets/clients/batch-2/WhatsApp Image 2026-02-10 at 10.36.16 AM copy 4.png";
import nefertaryLogo from "@/assets/clients/batch-2/Group 9.png";
import marbyaLogo from "@/assets/clients/batch-2/Layer 2c.png";
import kyrelloLogo from "@/assets/clients/batch-2/Kyrello-Vector-Smart-Object.png";
import funnyToursLogo from "@/assets/clients/batch-2/Layer 2.png";
import babAlOmraLogo from "@/assets/clients/batch-2/logo1.png";
import worldGateLogo from "@/assets/clients/batch-2/world gate logo-01.png";
import oneTouchLogo from "@/assets/clients/batch-2/Group 1.png";
import safeWayLogo from "@/assets/clients/batch-2/logo (1).png";
import newJerseyLogo from "@/assets/clients/batch-2/Layer 0.png";
import linesLogo from "@/assets/clients/batch-2/logo.png";
import gtaOtelLogo from "@/assets/clients/batch-2/29abb490-1d57-40ed-a508-e7518726c3b9.png";
import exodusLogo from "@/assets/clients/batch-2/Exodus Logo 02.png";

/**
 * Client list. NOT FINAL. Every entry stays `pending` (hidden on the live site, shown with a
 * "Pending" badge in previews) until Different confirms that all logos have been received and
 * answers the open questions. Names are copied from each logo exactly; where a logo has no
 * English (or no Arabic) name, that language is left out rather than invented.
 * See src/assets/clients/INVENTORY.md.
 *
 * To add a client: put the file in src/assets/clients/, import it above, add an entry.
 * To reorder: change `order`. To publish: set status to "published".
 */
export const clients: Client[] = [
  {
    id: "whitesky-travel",
    slug: "whitesky-travel",
    name: { en: "WhiteSky Travel", ar: "وايت سكاي للسياحة" },
    logo: { image: whiteskyLogo, treatment: "artwork" },
    services: [],
    featured: true,
    order: 10,
    caseStudies: [],
    status: "pending",
    source: "batch-1/upload-2.jpg (= batch-2/23348187_548069678865739_8144084035686105088_n.jpg)",
  },
  {
    id: "charm-light-tourism",
    slug: "charm-light-tourism",
    name: { en: "Charm Light Tourism", ar: "شارم لايت للسياحة" },
    openQuestion: 'English logo reads "CHARM", Arabic reads "شارم" (Sharm). Which spelling should be displayed?',
    logo: { image: charmLightLogo, treatment: "artwork" },
    services: [],
    featured: true,
    order: 20,
    caseStudies: [],
    status: "pending",
    source: "batch-1/upload-3.jpg (= batch-2/736371989_17970675153075962_6293164190197210827_n.jpg)",
  },
  {
    id: "bosat",
    slug: "bosat",
    name: { en: "Bosat", ar: "بساط" },
    logo: { image: bosatLogo, treatment: "artwork" },
    services: [],
    featured: true,
    order: 30,
    caseStudies: [],
    status: "pending",
    source: "batch-1/upload-4.jpg (= batch-2/445104408_855292479949293_6195387118907394115_n.jpg)",
  },
  {
    id: "sobek-travel",
    slug: "sobek-travel",
    name: { en: "Sobek Travel" },
    logo: { image: sobekLogo, treatment: "artwork" },
    services: [],
    featured: true,
    order: 40,
    caseStudies: [],
    status: "pending",
    source: "batch-1/upload-5.jpg (= batch-2/671134384_955492216872985_935924990703332078_n.jpg)",
  },
  {
    id: "mega-star-tours",
    slug: "mega-star-tours",
    name: { en: "Mega Star Tours", ar: "ميجا ستار تورز" },
    openQuestion: "Two logo versions supplied; the square one is used as main, the stacked one as alternative. Confirm.",
    logo: { image: megaStarLogo, treatment: "artwork" },
    logoAlt: { image: megaStarStackedLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 50,
    caseStudies: [],
    status: "pending",
    source: "batch-2/469187836_122249857022008944_7182244215854711483_n.jpg + batch-2/Layer 1 c.png",
  },
  {
    id: "abousamra-travel",
    slug: "abousamra-travel",
    name: { en: "AbouSamra Travel" },
    logo: { image: abouSamraLogo, treatment: "artwork" },
    services: [],
    featured: true,
    order: 60,
    caseStudies: [],
    status: "pending",
    source: "batch-2/553573056_1101946915357509_7878353599495716863_n.jpg",
  },
  {
    id: "tropic-travel",
    slug: "tropic-travel",
    name: { en: "Tropic Travel", ar: "ترويبك للسياحة" },
    logo: { image: tropicLogo, treatment: "artwork" },
    services: [],
    featured: true,
    order: 70,
    caseStudies: [],
    status: "pending",
    source: "batch-2/788453780_929179123589121_7888605478370868974_n.jpg",
  },
  {
    id: "i-star-eg",
    slug: "i-star-eg",
    name: { en: "I Star EG" },
    logo: { image: iStarLogo, treatment: "artwork" },
    services: [],
    featured: true,
    order: 80,
    caseStudies: [],
    status: "pending",
    source: "batch-2/631060198_17843882436687912_5694206642705520466_n.jpg",
  },
  {
    id: "tropitel-valley-tours",
    slug: "tropitel-valley-tours",
    name: { en: "Tropitel Valley Tours", ar: "تروبيتل فالي للسياحة" },
    openQuestion: "New in the ZIP (was not among the chat images). Confirm it belongs on the client wall.",
    logo: { image: tropitelLogo, treatment: "artwork" },
    services: [],
    featured: true,
    order: 90,
    caseStudies: [],
    status: "pending",
    source: "batch-2/656134369_1264364512549420_2233866556029060380_n.avif",
  },
  {
    id: "sisi-travel",
    slug: "sisi-travel",
    name: { en: "Sisi Travel", ar: "سيسي ترافيل" },
    openQuestion:
      "Two files: 'فرع المهندسين' (maroon, no branch line in the artwork) and 'مدينة نصر' (orange, shows the Nasr City branch). One client with two branch logos, or two entries?",
    logo: { image: sisiMohandessinLogo, treatment: "transparent-on-light", zoom: 1.7 },
    logoAlt: { image: sisiNasrCityLogo, treatment: "transparent-on-light", zoom: 2 },
    services: [],
    featured: true,
    order: 100,
    caseStudies: [],
    status: "pending",
    source: "batch-2/سيسي ترافيل فرع المهندسين.png + batch-2/سيسي ترافيل مدينة نصر.png",
  },
  {
    id: "utopia-travel",
    slug: "utopia-travel",
    name: { en: "Utopia Travel" },
    logo: { image: utopiaLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 110,
    caseStudies: [],
    status: "pending",
    source: "batch-2/شنمىسيرنم.png",
  },
  {
    id: "new-age-tourism",
    slug: "new-age-tourism",
    name: { en: "New Age Tourism", ar: "نيوايدج" },
    logo: { image: newAgeLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 120,
    caseStudies: [],
    status: "pending",
    source: "batch-2/WhatsApp Image 2026-02-10 at 10.36.16 AM copy 4.png",
  },
  {
    id: "nefertary-travel",
    slug: "nefertary-travel",
    name: { en: "Nefertary Travel", ar: "نفرتارى للسياحة" },
    logo: { image: nefertaryLogo, treatment: "transparent-on-dark" },
    services: [],
    featured: true,
    order: 130,
    caseStudies: [],
    status: "pending",
    source: "batch-2/Group 9.png",
  },
  {
    id: "marbya-tours",
    slug: "marbya-tours",
    name: { en: "Marbya Tours" },
    openQuestion: 'Spelling as read from the script logo ("Marbya"). Confirm.',
    logo: { image: marbyaLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 140,
    caseStudies: [],
    status: "pending",
    source: "batch-2/Layer 2c.png",
  },
  {
    id: "kyrello-tours",
    slug: "kyrello-tours",
    name: { en: "Kyrello Tours" },
    logo: { image: kyrelloLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 150,
    caseStudies: [],
    status: "pending",
    source: "batch-2/Kyrello-Vector-Smart-Object.png",
  },
  {
    id: "funny-tours",
    slug: "funny-tours",
    name: { en: "Funny Tours" },
    logo: { image: funnyToursLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 160,
    caseStudies: [],
    status: "pending",
    source: "batch-2/Layer 2.png",
  },
  {
    id: "bab-al-omra",
    slug: "bab-al-omra",
    // The logo is Arabic calligraphy only; no English name is supplied, so none is invented.
    name: { ar: "باب العمرة" },
    openQuestion: "Logo has no English name. Should the English site show it in Arabic, or is there an official English name?",
    logo: { image: babAlOmraLogo, treatment: "transparent-on-dark" },
    services: [],
    featured: true,
    order: 170,
    caseStudies: [],
    status: "pending",
    source: "batch-2/logo1.png",
  },
  {
    id: "world-gate",
    slug: "world-gate",
    name: { en: "World Gate" },
    logo: { image: worldGateLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 180,
    caseStudies: [],
    status: "pending",
    source: "batch-2/world gate logo-01.png",
  },
  {
    id: "1-touch",
    slug: "1-touch",
    name: { en: "1 Touch" },
    openQuestion: "Car cleaning & service centre (مركز صيانة متكامل), not a travel brand. Include on this travel-focused site?",
    logo: { image: oneTouchLogo, treatment: "transparent-on-light" },
    services: [],
    featured: false,
    order: 190,
    caseStudies: [],
    status: "pending",
    source: "batch-2/Group 1.png",
  },
  {
    id: "safe-way-travel",
    slug: "safe-way-travel",
    name: { en: "Safe Way Travel", ar: "سيف واي" },
    logo: { image: safeWayLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 200,
    caseStudies: [],
    status: "pending",
    source: "batch-2/logo (1).png",
  },
  {
    id: "new-jersey-tours",
    slug: "new-jersey-tours",
    name: { en: "New Jersey Tours", ar: "نيو جيرسي للسياحة" },
    logo: { image: newJerseyLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 210,
    caseStudies: [],
    status: "pending",
    source: "batch-2/Layer 0.png",
  },
  {
    id: "lines-travel",
    slug: "lines-travel",
    name: { en: "Lines Travel" },
    logo: { image: linesLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 220,
    caseStudies: [],
    status: "pending",
    source: "batch-2/logo.png",
  },
  {
    id: "gtaotel",
    slug: "gtaotel",
    name: { en: "GtaOtel" },
    openQuestion: 'Spelling/capitalisation as on the logo ("GtaOtel"). Confirm.',
    logo: { image: gtaOtelLogo, treatment: "transparent-on-light" },
    services: [],
    featured: true,
    order: 230,
    caseStudies: [],
    status: "pending",
    source: "batch-2/29abb490-1d57-40ed-a508-e7518726c3b9.png",
  },
  {
    id: "exodus-travel",
    slug: "exodus-travel",
    name: { en: "Exodus Travel" },
    logo: { image: exodusLogo, treatment: "transparent-on-dark" },
    services: [],
    featured: true,
    order: 240,
    caseStudies: [],
    status: "pending",
    source: "batch-2/Exodus Logo 02.png",
  },
];

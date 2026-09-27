import type { Client } from "./types";

import whiteskyLogo from "@/assets/clients/batch-1/upload-2.jpg";
import charmLightLogo from "@/assets/clients/batch-1/upload-3.jpg";
import bosatLogo from "@/assets/clients/batch-1/upload-4.jpg";
import sobekLogo from "@/assets/clients/batch-1/upload-5.jpg";

/**
 * Client list. NOT FINAL: waiting for confirmation that both logo batches are complete.
 * Every entry stays `pending` (hidden in production) until then.
 * See src/assets/clients/INVENTORY.md for the full asset inventory and open questions.
 *
 * To add a client: drop the file in src/assets/clients/, import it above, add an entry.
 * To reorder: change `order`. To hide: set status to "draft".
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
    source: "batch-1/upload-2.jpg",
  },
  {
    id: "charm-light-tourism",
    slug: "charm-light-tourism",
    // Open question: the English logo reads "Charm", the Arabic reads "شارم" (Sharm).
    name: { en: "Charm Light Tourism", ar: "شارم لايت للسياحة" },
    logo: { image: charmLightLogo, treatment: "artwork" },
    services: [],
    featured: true,
    order: 20,
    caseStudies: [],
    status: "pending",
    source: "batch-1/upload-3.jpg",
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
    source: "batch-1/upload-4.jpg",
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
    source: "batch-1/upload-5.jpg",
  },
];

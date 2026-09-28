import { Alexandria, IBM_Plex_Sans_Arabic, Plus_Jakarta_Sans } from "next/font/google";

export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Arabic faces only load on pages that contain Arabic glyphs (unicode-range),
// so they're not preloaded on English pages.
export const alexandria = Alexandria({
  subsets: ["arabic"],
  weight: ["500", "600"],
  variable: "--font-alexandria",
  display: "swap",
  preload: false,
});

export const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-plex-ar",
  display: "swap",
  preload: false,
});

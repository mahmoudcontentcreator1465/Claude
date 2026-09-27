/**
 * Renders the Open Graph share images (1200×630) for each language with
 * headless Chromium, so Arabic text is shaped correctly.
 *   node scripts/generate-og.mjs
 * Requires playwright-core and a Chromium binary (CHROMIUM_PATH or the default below).
 */
import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const logo = readFileSync(path.join(root, "public/brand/different-logo-dark.png")).toString("base64");
const mark = readFileSync(path.join(root, "public/brand/different-mark-white.png")).toString("base64");
const messages = {
  en: JSON.parse(readFileSync(path.join(root, "src/messages/en.json"), "utf8")),
  ar: JSON.parse(readFileSync(path.join(root, "src/messages/ar.json"), "utf8")),
};

// Fonts are embedded (scripts/og-fonts) so rendering never depends on the network.
const font = (file) => readFileSync(path.join(root, "scripts/og-fonts", file)).toString("base64");
const faces = [
  ["Jakarta", 800, "jakarta-800.woff2"],
  ["Jakarta", 500, "jakarta-500.woff2"],
  ["Alexandria", 800, "alexandria-800.woff2"],
  ["PlexAr", 500, "plexar-500.woff2"],
]
  .map(([f, w, file]) => `@font-face{font-family:${f};font-weight:${w};src:url(data:font/woff2;base64,${font(file)}) format("woff2")}`)
  .join("");

const html = (locale) => {
  const m = messages[locale];
  const lines = m.hero.lines;
  const ar = locale === "ar";
  return `<!doctype html><html lang="${locale}" dir="${ar ? "rtl" : "ltr"}"><head><meta charset="utf-8">
<style>${faces}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#F5F7F6;font-family:${ar ? "PlexAr" : "Jakarta"},sans-serif;color:#111;position:relative;overflow:hidden}
.logo{position:absolute;top:56px;${ar ? "right" : "left"}:64px;height:58px}
h1{position:absolute;${ar ? "right" : "left"}:64px;bottom:120px;font-family:${ar ? "Alexandria" : "Jakarta"};font-weight:800;font-size:${ar ? 86 : 96}px;line-height:${ar ? 1.18 : 0.92};letter-spacing:${ar ? 0 : "-0.05em"};max-width:760px}
h1 span{display:block}h1 .t{color:#1ABC9C}
p{position:absolute;${ar ? "right" : "left"}:64px;bottom:56px;font-size:24px;color:#3b3f3e}
.panel{position:absolute;top:0;bottom:0;${ar ? "left" : "right"}:0;width:330px;background:#111;display:grid;place-items:center}
.panel img{width:190px}
svg{position:absolute;inset:0}
</style></head><body>
<img class="logo" src="data:image/png;base64,${logo}">
<h1>${lines.map((l, i) => `<span class="${i === 2 ? "t" : ""}">${l}</span>`).join("")}</h1>
<p>${m.hero.eyebrow}</p>
<div class="panel"><img src="data:image/png;base64,${mark}"></div>
</body></html>`;
};

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const locale of ["en", "ar"]) {
  await page.setContent(html(locale), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, `public/og/og-${locale}.png`) });
  console.log(`public/og/og-${locale}.png`);
}
await browser.close();

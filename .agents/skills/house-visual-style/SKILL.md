---
name: house-visual-style
description: The user's saved signature visual style for videos, reels, motion graphics, thumbnails and social posts — bone-paper backgrounds with a faint engineering grid, near-black type mixing heavy sans with italic serif accents, a single saturated accent color per piece, and matte 3D objects floating on long soft shadows. Use this whenever creating or art-directing any visual output for the user: a Remotion composition, a Motion MCP brief, an Instagram/TikTok reel, a YouTube thumbnail, a static post, a slide, or an HTML artifact meant to look like their brand. Also use when the user says "بنفس الاستايل", "الاستايل بتاعنا", "زي اللي حفظناه", "our style", "house style", or asks to match their saved look.
---

# House Visual Style

This is the user's saved look, captured from four Pinterest boards they curated
(`references/boards/board-01..04.webp` — read them when you need to see it, not
just read about it). Every rule below was derived from what actually repeats
across those boards.

The one-line summary: **a clean bone-paper studio with a faint blueprint grid,
where one bold idea is stated in mixed-weight type and one physical object
floats above the page on a long soft shadow, in a single saturated accent
color.**

## Non-negotiables

These five carry the style. If a piece has all five it reads as house style; if
it drops two or more it stops looking like the user's work.

1. **Bone paper, never pure white.** The base is `#F2F1ED`. Pure white is a
   highlight, not a background.
2. **A faint engineering grid** on most frames — 1px lines at 5–7% black. It
   should be felt, not read. If a viewer notices the grid as a design element,
   it is too strong.
3. **One accent color per piece.** Everything else is paper, ink, and grey. Two
   accents is the single most common way this style gets broken.
4. **Mixed-register type**: a heavy tight sans for the statement, an italic
   serif for the one emotional word inside it.
5. **Long soft shadows.** Objects sit *above* the page, lit from upper-left,
   casting a 20–40° shadow that is large, soft, and low-contrast.

## Color

```
--paper        #F2F1ED   base background (bone)
--paper-lift   #FAF9F6   raised cards, inset panels
--white        #FFFFFF   highlights, blown-out radial centers
--ink          #111111   headlines and body — never #000
--ink-soft     #6B6B6B   secondary lines, captions, credits
--grid         rgba(0,0,0,0.06)
```

Accent — **pick exactly one per piece**:

```
--red          #E8112D   urgency, money, "the truth", hooks
--indigo       #4A47E5   tech, tools, software, product
--green        #00A550   growth, finance, go/positive
--yellow       #F2E205   highlighter marks, tags, callouts
--teal         #00BFA6   calm, SaaS, explainers
--navy         #1B2A6B   authority, "brand" and strategy topics
```

Dark variants exist but are the exception: a near-black field (`#0B0B0F`) with
the accent glowing on it, used for tech/product beats. Even then the grid stays,
now at `rgba(255,255,255,0.07)`.

## Typography

- **Statement**: heavy tight grotesk — Inter Tight, Neue Haas Grotesk Display,
  Archivo, or Helvetica Now. Weight 700–900, tracking `-0.02em` to `-0.03em`,
  line-height `0.95`–`1.05`. Set it big; the headline is the composition.
- **Emotional word**: italic serif — Instrument Serif, Playfair Display, or EB
  Garamond, italic, often a touch larger than the sans around it and sometimes
  in the accent color. One or two words only. This is the signature move
  ("built a *lifestyle*", "Here is the *truth*", "*Editing*").
- **Support**: Inter 400–500 at roughly 38% of the statement size, in
  `--ink-soft`.
- Headlines are sentence case or title case, never all-caps — *except* for
  short punch words (STRATEGY, UNDERSTANDING) where all-caps is the point.
- Arabic: use IBM Plex Sans Arabic or Almarai for the heavy role and Amiri
  italic-substitute for the accent role, since Arabic has no true italic —
  swap the italic-serif move for a weight-and-color shift instead.

## Composition

- **9:16 (1080×1920) is the default.** 16:9 and 1:1 exist but the boards are
  overwhelmingly vertical.
- Generous margins: keep content inside a 7–9% safe inset on all sides.
- One idea per frame. The boards never show two competing focal points.
- Common layouts, in rough order of frequency:
  - **Statement over object** — headline upper third, object floating lower two
    thirds, shadow anchoring it.
  - **Diagonal ribbon** — a wide black or accent band sweeping across the frame
    at 15–30°, with the subject sitting on or under it.
  - **Before / after split** — vertical split, labeled with small accent dots
    and thin type.
  - **Pinned collage** — torn paper, polaroid frames, paperclips, pushpins,
    tape and barcodes scattered on the grid with individual shadows.
  - **Radial blow-out** — a soft white glow at center with shapes intruding
    from corners.

## Objects and texture

The recurring props are everyday physical things rendered matte, not glossy:
alarm clocks, brains, cash stacks, briefcases, light bulbs, coffee cups, CRT
televisions, framed engravings, soda cans. They are either matte 3D renders or
cut-out photographs with the background cleanly removed.

- Lighting: single soft key from upper-left, gentle ambient fill, no hard specular.
- Shadow: `0 24px 48px rgba(0,0,0,0.12)` for the float, plus a tighter
  `0 2px 6px rgba(0,0,0,0.10)` contact shadow where the object nears the page.
- Objects are frequently rotated 6–15° off-axis. Nothing sits perfectly straight
  except the type.
- Paper texture, halftone dots, and subtle grain (2–4% noise) keep it from
  looking sterile.

## Motion

Durations on the boards run **4 to 45 seconds**, clustering at **8–20s**. Build
for loops.

- **Easing is everything.** Default to `cubic-bezier(0.22, 1, 0.36, 1)`
  (easeOutQuint) or a Remotion spring with `damping: 200, stiffness: 100`.
  Nothing linear, nothing bouncy-cartoonish.
- **Entrance**: opacity `0→1`, `translateY 24px→0`, `scale 0.94→1` over 18–24
  frames at 30fps.
- **Kinetic type**: reveal word by word with a 3–4 frame stagger, or mask-wipe
  a line upward from behind an invisible baseline.
- **Object float**: continuous sine on Y, amplitude 6–10px over ~90 frames. The
  shadow scales and softens inversely — bigger and lighter as the object rises.
- **Camera**: slow continuous push-in of 1.0→1.06 scale across the whole shot.
  It is almost always on.
- **Cuts**: hard cuts on the beat for hooks, soft 8-frame cross-dissolves for
  explainer sections.
- **The accent enters last.** Paper, then grid, then type, then object, then the
  accent color lands — it is the punctuation.

## Writing and hooks

The boards are as much a copy style as a visual one. Headlines are short,
second-person, and set up a gap:

- "This is how Starbucks built a *lifestyle*"
- "Here is the *truth*"
- "A brand is not a ... you finish project"
- "Ideas aren't *just* created"
- "You're making 1 MILLION dollar"

Pattern: **a confident claim that withholds its payoff.** 4–9 words. Often a
negation ("is NOT", "aren't", "without"). Avoid questions as hooks; the boards
use statements.

## Implementation

- `references/tokens.ts` — drop-in TypeScript tokens for Remotion compositions,
  including the grid background, shadow presets and spring configs.
- `references/checklist.md` — run through it before calling any piece done.
- `references/boards/` — the four source boards. Look at them.

When building in Remotion, load `remotion-best-practices` for the engineering
side and use this skill purely for art direction. When briefing Motion MCP,
paste the non-negotiables and the accent choice into the brief rather than
describing shots.

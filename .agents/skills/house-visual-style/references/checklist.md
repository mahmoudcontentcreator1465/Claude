# House style checklist

Run this before calling any piece done. The first five are the ones that decide
whether it reads as the user's work.

## The five that matter

- [ ] Background is bone `#F2F1ED`, not pure white and not grey-blue.
- [ ] The engineering grid is present and **faint** — felt, not read. If it
      reads as a design element, drop its opacity.
- [ ] Exactly **one** accent color in the whole piece. Count them.
- [ ] The statement mixes a heavy tight sans with an italic serif on one or two
      emotional words.
- [ ] Objects float on a long soft shadow, lit from upper-left, with a tighter
      contact shadow underneath.

## Composition

- [ ] One focal point. No second idea competing for the eye.
- [ ] Content sits inside a 7–9% safe inset.
- [ ] Objects rotated 6–15° off-axis; type stays straight.
- [ ] Vertical 1080×1920 unless there is a reason not to be.

## Type

- [ ] Statement tracking is negative (`-0.02em` to `-0.03em`), line-height near 1.0.
- [ ] Headline is 4–9 words and withholds its payoff.
- [ ] Support text is roughly 38% of statement size, in `#6B6B6B`.
- [ ] Ink is `#111111`, never `#000000`.
- [ ] No all-caps headlines, except a single short punch word.

## Motion

- [ ] Nothing eases linearly. `cubic-bezier(0.22, 1, 0.36, 1)` or a
      `damping: 200` spring.
- [ ] Entrances are opacity + 24px rise + `0.94→1` scale over ~21 frames.
- [ ] Kinetic type staggers 3–4 frames per word.
- [ ] Object float is a slow sine, 6–10px, with the shadow softening as it rises.
- [ ] Slow camera push (1.0→1.06) runs across the shot.
- [ ] The accent color lands **last** in the build order.
- [ ] Total duration is 8–20s and it loops cleanly.

## Finish

- [ ] 2–4% grain over the whole frame.
- [ ] Shadows are low-contrast and large — no hard dark edges.
- [ ] No glossy specular highlights on objects; matte only.
- [ ] Arabic text uses the weight-and-color emphasis, not a faked italic.

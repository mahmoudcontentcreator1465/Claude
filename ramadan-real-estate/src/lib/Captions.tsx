import { parseSrt } from "@remotion/captions";
import type { Caption } from "@remotion/captions";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import { EASE, font, ink, red } from "../theme";

/** A card holds one or more cues; the spoken one carries the marker. */
type Page = { startMs: number; endMs: number; cues: Caption[] };

/** Longest a card may get before it is split. Keeps every card to two lines. */
const MAX_CHARS = 36;
/** Cues closer together than this share a card. */
const MAX_GAP_MS = 320;
/** How long a card lingers after its last cue, when nothing follows. */
const HOLD_MS = 600;

/**
 * `createTikTokStyleCaptions` chains every cue of an .srt into one page, since
 * each cue starts within the combine window of the last. These are already
 * well-timed lines, so pair them up by length and silence instead.
 */
const buildPages = (captions: Caption[]): Page[] => {
  const pages: Page[] = [];

  for (const cue of captions) {
    const current = pages[pages.length - 1];
    const previous = current?.cues[current.cues.length - 1];
    const merged = current
      ? current.cues.reduce((n, c) => n + c.text.length + 1, 0) +
        cue.text.length
      : Infinity;

    if (
      current &&
      previous &&
      cue.startMs - previous.endMs <= MAX_GAP_MS &&
      merged <= MAX_CHARS
    ) {
      current.cues.push(cue);
      current.endMs = cue.endMs;
    } else {
      pages.push({ startMs: cue.startMs, endMs: cue.endMs, cues: [cue] });
    }
  }

  return pages;
};

/**
 * One caption card. The cue being spoken is full ink under a red highlighter
 * mark; the rest of the card sits back. Red stays punctuation, never body text.
 */
const CaptionCard: React.FC<{ page: Page }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;

  return (
    <div
      dir="rtl"
      style={{
        fontFamily: font.ar,
        fontWeight: 700,
        fontSize: 52,
        lineHeight: 1.5,
        textAlign: "center",
        maxWidth: 880,
        opacity: interpolate(frame, [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EASE),
        }),
        translate: interpolate(frame, [0, 11], ["0px 16px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EASE),
        }),
      }}
    >
      {page.cues.map((cue, i) => {
        const isActive = cue.startMs <= nowMs && cue.endMs > nowMs;

        return (
          <span
            key={`${cue.startMs}-${i}`}
            style={{
              color: ink.full,
              opacity: isActive ? 1 : 0.25,
              padding: "0 6px",
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              backgroundImage: isActive
                ? `linear-gradient(to top, ${red.marker} 0 38%, transparent 38%)`
                : "none",
            }}
          >
            {cue.text.trim()}{" "}
          </span>
        );
      })}
    </div>
  );
};

/** Reads the .srt from public/ and lays the cards on the timeline. */
export const Captions: React.FC<{ src: string }> = ({ src }) => {
  const { fps } = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile(src));
      const text = await response.text();
      const { captions: parsed } = parseSrt({ input: text });
      setCaptions(parsed);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [src, handle, continueRender, cancelRender]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  const pages = useMemo(
    () => (captions ? buildPages(captions) : []),
    [captions],
  );

  if (!captions) {
    return null;
  }

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const next = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        /* Hold the card until the next one is due, so cards never flicker. */
        const endMs = Math.min(
          next ? next.startMs : Infinity,
          page.endMs + HOLD_MS,
        );
        const durationInFrames = Math.round((endMs / 1000) * fps) - startFrame;

        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={durationInFrames}
            layout="none"
            name={page.cues.map((c) => c.text).join(" ")}
          >
            <AbsoluteFill
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <CaptionCard page={page} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

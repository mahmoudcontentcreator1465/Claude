import { AbsoluteFill } from "remotion";
import { font, gridLine, ink, paper, red } from "../theme";
import { progress, travel } from "./motion";

/**
 * Shared pieces for the green-screen lower-third overlays.
 *
 * Keying rules: everything outside the card is flat chroma green. No outer
 * shadows, glows, grain or opacity fades on the card's edge — it moves by
 * translate and clip only, so it keys cleanly. Add a drop shadow after keying.
 */
export const CHROMA = "#00FF00";

/** Card geometry, canvas px — the lower third of a 1080×1920 frame. */
export const CARD = { left: 60, top: 1270, width: 960, height: 470 };

export type Part = {
  text: string;
  at: number;
  latin?: boolean;
  accent?: boolean;
};

export type Slide = { at: number; parts: Part[] };

/**
 * Slides stacked in a clipped window: the current one wipes up in, the
 * previous one wipes up out. No opacity, so nothing half-transparent.
 */
export const SlideStack: React.FC<{
  frame: number;
  slides: Slide[];
  height: number;
  renderPart: (p: Part, shown: number) => React.ReactNode;
  justify?: "flex-start" | "center";
}> = ({ frame, slides, height, renderPart, justify = "flex-start" }) => (
  <div style={{ position: "relative", height, overflow: "hidden" }}>
    {slides.map((s, i) => {
      const next = slides[i + 1];
      const enter = progress(frame, s.at, s.at + 12);
      const leave = next ? progress(frame, next.at, next.at + 10) : 0;
      if (frame < s.at || leave >= 1) return null;

      return (
        <div
          key={s.at}
          dir="rtl"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: justify,
            gap: "0.28em",
            translate: `0px ${(1 - enter) * height - leave * height}px`,
          }}
        >
          {s.parts.map((p) =>
            frame >= p.at ? (
              <span
                key={p.text + p.at}
                style={{ flexShrink: 0, whiteSpace: "nowrap" }}
              >
                {renderPart(p, progress(frame, p.at, p.at + 10))}
              </span>
            ) : null,
          )}
        </div>
      );
    })}
  </div>
);

/** Kinetic headline: Arabic in the display face, numbers in Inter Tight. */
export const Headline: React.FC<{ frame: number; slides: Slide[] }> = ({
  frame,
  slides,
}) => (
  <SlideStack
    frame={frame}
    slides={slides}
    height={120}
    renderPart={(p, shown) => (
      <span
        style={{
          display: "inline-block",
          fontFamily: p.latin ? font.display : font.arDisplay,
          fontWeight: p.latin ? 800 : undefined,
          letterSpacing: p.latin ? "-0.03em" : undefined,
          fontSize: p.latin ? 74 : 66,
          lineHeight: 1,
          color: p.accent ? red.base : ink.full,
          translate: `0px ${(1 - shown) * 50}px`,
          clipPath: `inset(0 0 ${(1 - shown) * 100}% 0)`,
        }}
      >
        {p.text}
      </span>
    )}
  />
);

/**
 * The bone-paper card on chroma green, with the red tab naming the current
 * beat. It slides up in over the first frames and drops out from `outFrom`.
 */
export const GreenCard: React.FC<{
  frame: number;
  tabs: Slide[];
  outFrom: number;
  outTo: number;
  children: React.ReactNode;
}> = ({ frame, tabs, outFrom, outTo, children }) => {
  const inT = progress(frame, 0, 16);
  const outT = progress(frame, outFrom, outTo, travel);
  const slide = (1 - inT) * 120 + outT * 700;
  const tabIn = progress(frame, 6, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: CHROMA }}>
      <div
        style={{
          position: "absolute",
          left: CARD.left,
          top: CARD.top,
          width: CARD.width,
          height: CARD.height,
          translate: `0px ${slide}px`,
          clipPath: `inset(${(1 - inT) * 100}% 0 0 0 round 36px)`,
        }}
      >
        {/* Card: bone paper with the faint grid. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 36,
            backgroundColor: paper.base,
            backgroundImage: `linear-gradient(${gridLine} 1px, transparent 1px), linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {children}
      </div>

      {/* Red tab riding the card's top edge. */}
      <div
        style={{
          position: "absolute",
          right: CARD.left + 40,
          top: CARD.top - 36,
          height: 72,
          width: 230,
          borderRadius: 20,
          backgroundColor: red.base,
          translate: `0px ${slide}px`,
          clipPath: `inset(0 0 0 ${(1 - tabIn) * 100}% round 20px)`,
        }}
      >
        <SlideStack
          frame={frame}
          slides={tabs}
          height={72}
          justify="center"
          renderPart={(p) => (
            <span
              style={{
                fontFamily: font.arDisplay,
                fontSize: 40,
                lineHeight: 1,
                color: paper.white,
              }}
            >
              {p.text}
            </span>
          )}
        />
      </div>
    </AbsoluteFill>
  );
};

/**
 * A layer that wipes up into the strip at `from` and up out of it at `to`.
 * Translate and clip only — nothing half-transparent.
 */
export const Layer: React.FC<{
  frame: number;
  from: number;
  to?: number;
  children: React.ReactNode;
}> = ({ frame, from, to, children }) => {
  if (frame < from) return null;
  const enter = progress(frame, from, from + 14);
  const leave = to === undefined ? 0 : progress(frame, to, to + 10, travel);
  if (leave >= 1) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        translate: `0px ${(1 - enter) * 80 - leave * 80}px`,
        clipPath: `inset(${leave * 100}% 0 ${(1 - enter) * 100}% 0)`,
      }}
    >
      {children}
    </div>
  );
};

import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CARD, CHROMA, SlideStack, type Slide } from "../lib/greenscreen";
import { progress, rise, travel } from "../lib/motion";
import { accent, font, ink, paper, starTile, tan } from "./theme";

/**
 * The Hajj reel's own look: warm sand paper, a star pattern in place of the
 * grid, a framed card and an arch-topped tab. Keying rules still hold on the
 * green-screen card: flat chroma outside, translate and clip only.
 */

export { Layer } from "../lib/greenscreen";

/** Eight-point star outline. */
export const Star: React.FC<{
  size: number;
  color?: string;
  stroke?: number;
  style?: React.CSSProperties;
}> = ({ size, color = tan.base, stroke = 2, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <g fill="none" stroke={color} strokeWidth={stroke}>
      <rect x="18" y="18" width="64" height="64" />
      <rect
        x="18"
        y="18"
        width="64"
        height="64"
        transform="rotate(45 50 50)"
      />
      <circle cx="50" cy="50" r="14" />
    </g>
  </svg>
);

/** Kinetic headline: Arabic display face, brown accent words. */
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
          color: p.accent ? accent.base : ink.full,
          translate: `${(1 - shown) * -40}px 0px`,
          clipPath: `inset(0 0 0 ${(1 - shown) * 100}%)`,
        }}
      >
        {p.text}
      </span>
    )}
  />
);

/**
 * Sand card on chroma green with a thin inner frame, the star pattern, and an
 * espresso arch tab centred on its top edge naming the current beat.
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
  const tabIn = progress(frame, 6, 20);
  const frameIn = progress(frame, 8, 30);
  const tabW = 250;

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
          clipPath: `inset(${(1 - inT) * 100}% 0 0 0 round 22px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            backgroundColor: paper.base,
            backgroundImage: starTile(72, 0.13),
            backgroundSize: "72px 72px",
          }}
        />
        {/* Inner frame drawn around from the top centre. */}
        <div
          style={{
            position: "absolute",
            inset: 14,
            borderRadius: 14,
            border: `2px solid ${tan.base}`,
            clipPath: `inset(0 ${(1 - frameIn) * 50}% 0 ${(1 - frameIn) * 50}%)`,
          }}
        />
        {children}
      </div>

      {/* Arch tab riding the card's top edge. */}
      <div
        style={{
          position: "absolute",
          left: CARD.left + CARD.width / 2 - tabW / 2,
          top: CARD.top - 58,
          width: tabW,
          height: 78,
          borderRadius: `${tabW / 2}px ${tabW / 2}px 0 0 / 60px 60px 0 0`,
          backgroundColor: ink.full,
          translate: `0px ${slide}px`,
          clipPath: `inset(${(1 - tabIn) * 100}% 0 0 0)`,
        }}
      >
        <div style={{ paddingTop: 8 }}>
          <SlideStack
            frame={frame}
            slides={tabs}
            height={66}
            justify="center"
            renderPart={(p) => (
              <span
                style={{
                  fontFamily: font.arDisplay,
                  fontSize: 38,
                  lineHeight: 1,
                  color: paper.lift,
                }}
              >
                {p.text}
              </span>
            )}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Warm grain over the full-frame scenes. */
const Grain: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.05, mixBlendMode: "multiply" }}>
    <svg width="100%" height="100%">
      <filter id="hajjgrain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves={3}
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#hajjgrain)" />
    </svg>
  </AbsoluteFill>
);

/**
 * Full-frame background: cream-to-sand gradient, the star pattern, a thin
 * arch outline framing the frame, and two big slow-turning stars at the edges.
 */
export const Backdrop: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();
  const turn = interpolate(frame, [0, 600], [0, 30]);
  const arch = progress(frame, 0, 30);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${paper.lift} 0%, ${paper.base} 55%, ${tan.fill} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: starTile(90, 0.09),
          backgroundSize: "90px 90px",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(60% 40% at 50% 42%, rgba(255,250,241,0.9) 0%, rgba(255,250,241,0) 75%)",
        }}
      />

      <Star
        size={520}
        stroke={1.2}
        color={accent.light}
        style={{
          position: "absolute",
          top: -170,
          right: -190,
          opacity: 0.35,
          rotate: `${turn}deg`,
        }}
      />
      <Star
        size={420}
        stroke={1.4}
        color={accent.light}
        style={{
          position: "absolute",
          bottom: -130,
          left: -150,
          opacity: 0.3,
          rotate: `${-turn}deg`,
        }}
      />

      {/* Arch outline framing the scene, drawn up from the bottom. */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 60,
          bottom: 60,
          border: `2px solid ${tan.line}`,
          borderRadius: "500px 500px 24px 24px / 300px 300px 24px 24px",
          clipPath: `inset(${(1 - arch) * 100}% 0 0 0)`,
        }}
      />

      {children}
      <Grain />
    </AbsoluteFill>
  );
};

/** Small label flanked by a diamond and a short brown rule. */
export const Kicker: React.FC<{
  frame: number;
  start?: number;
  children: string;
}> = ({ frame, start = 0, children }) => (
  <div
    dir="rtl"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      ...rise(frame, start, 16),
    }}
  >
    <div
      style={{
        width: 14,
        height: 14,
        rotate: "45deg",
        backgroundColor: accent.base,
      }}
    />
    <span style={{ fontFamily: font.arDisplay, fontSize: 44, color: ink.soft }}>
      {children}
    </span>
    <div style={{ width: 40, height: 2, backgroundColor: tan.base }} />
  </div>
);

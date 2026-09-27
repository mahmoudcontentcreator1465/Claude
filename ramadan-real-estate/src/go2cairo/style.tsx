import { AbsoluteFill } from "remotion";
import { CARD, CHROMA, SlideStack, type Slide } from "../lib/greenscreen";
import { Icon } from "../lib/Icon";
import { progress, travel } from "../lib/motion";
import { C, accent, dots, font, ink, paper } from "./theme";

/**
 * Go2Cairo green-screen pieces: a night-navy card with the dot pattern and a
 * low sun, a sun-orange tab, sand headline with orange accents. Keying rules
 * hold: flat chroma outside, translate and clip only.
 */

export { Layer } from "../lib/greenscreen";

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
          color: p.accent ? C.sun : C.sand,
          translate: `0px ${(1 - shown) * 50}px`,
          clipPath: `inset(0 0 ${(1 - shown) * 100}% 0)`,
        }}
      >
        {p.text}
      </span>
    )}
  />
);

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
  const sun = progress(frame, 4, 40);

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
          clipPath: `inset(${(1 - inT) * 100}% 0 0 0 round 34px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 34,
            overflow: "hidden",
            background: `${dots()}, linear-gradient(165deg, ${C.night} 0%, ${C.night2} 100%)`,
          }}
        >
          {/* Low sun rising in the corner. */}
          <div
            style={{
              position: "absolute",
              left: -90,
              bottom: -150 - (1 - sun) * 80,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,106,43,0.55) 0%, rgba(255,106,43,0.18) 45%, rgba(255,106,43,0) 70%)`,
            }}
          />
        </div>
        {children}
      </div>

      <div
        style={{
          position: "absolute",
          right: CARD.left + 40,
          top: CARD.top - 34,
          height: 68,
          width: 240,
          borderRadius: 34,
          backgroundColor: C.sun,
          translate: `0px ${slide}px`,
          clipPath: `inset(0 0 0 ${(1 - tabIn) * 100}% round 34px)`,
        }}
      >
        <SlideStack
          frame={frame}
          slides={tabs}
          height={68}
          justify="center"
          renderPart={(p) => (
            <span
              style={{
                fontFamily: font.arDisplay,
                fontSize: 38,
                lineHeight: 1,
                color: C.navy,
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

/** Sand chip with a navy icon and label; orange when it's the point. */
export const Chip: React.FC<{
  frame: number;
  at: number;
  icon: React.ReactNode;
  label: string;
  width?: number;
  accent?: boolean;
}> = ({ frame, at, icon, label, width = 250, accent: on }) => {
  const shown = progress(frame, at, at + 12);
  return (
    <div
      dir="rtl"
      style={{
        width,
        height: 170,
        borderRadius: 28,
        backgroundColor: paper.white,
        border: `${on ? 5 : 0}px solid ${accent.base}`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        translate: `0px ${(1 - shown) * 40}px`,
        clipPath: `inset(${(1 - shown) * 100}% -10px -10px -10px round 28px)`,
      }}
    >
      <Icon size={62} color={on ? accent.base : ink.full}>
        {icon}
      </Icon>
      <div
        style={{
          fontFamily: font.arDisplay,
          fontSize: 40,
          color: on ? accent.base : ink.full,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

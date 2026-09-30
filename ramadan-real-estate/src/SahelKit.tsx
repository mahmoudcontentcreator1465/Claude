import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { SfxTrack, type Sfx } from "./hajj/sfx";
import {
  CARD,
  CHROMA,
  GreenCard,
  Headline,
  type Slide,
} from "./lib/greenscreen";
import { Icon, paths } from "./lib/Icon";
import { Kicker } from "./lib/Kicker";
import { clamp, progress } from "./lib/motion";
import { Paper } from "./lib/Paper";
import { Strip, Top } from "./MarketNews";
import { font, ink, paper, red } from "./theme";

/**
 * Building blocks for the one-file reels that alternate green-screen lower
 * thirds and full-frame inserts (house style). Every segment runs in its own
 * <Sequence>, so frames inside are local to the segment.
 */

/**
 * Size and height of the green-screen card in these reels: a bit smaller than
 * the standard lower third and lifted off the bottom (user's request).
 */
const CARD_SCALE = 0.82;
const CARD_LIFT = 190;

/** Green-screen segment: card in, headline slides, graphic strip, card out. */
export const GreenSeg: React.FC<{
  len: number;
  tabs: Slide[];
  slides: Slide[];
  sfx?: Sfx[];
  children: (frame: number) => React.ReactNode;
}> = ({ len, tabs, slides, sfx = [], children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: CHROMA }}>
      <AbsoluteFill
        style={{
          transformOrigin: `50% ${CARD.top + CARD.height / 2}px`,
          scale: String(CARD_SCALE),
          translate: `0px ${-CARD_LIFT}px`,
        }}
      >
        <GreenCard frame={frame} tabs={tabs} outFrom={len - 16} outTo={len - 1}>
          <Top>
            <Headline frame={frame} slides={slides} />
          </Top>
          <Strip>{children(frame)}</Strip>
          <SfxTrack
            cues={[
              { at: 0, name: "whoosh", volume: 0.6 },
              ...sfx,
              { at: len - 16, name: "whoosh", volume: 0.45 },
            ]}
          />
        </GreenCard>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Full-frame segment on paper, with the slow push-in. */
export const FullSeg: React.FC<{
  len: number;
  kicker: string;
  top?: number;
  sfx?: Sfx[];
  children: (frame: number) => React.ReactNode;
}> = ({ len, kicker, top = 300, sfx = [], children }) => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, len], [1, 1.05], clamp);
  return (
    <Paper>
      <AbsoluteFill
        style={{ scale: String(push), alignItems: "center", paddingTop: top }}
      >
        <Kicker frame={frame}>{kicker}</Kicker>
        {children(frame)}
      </AbsoluteFill>
      <SfxTrack cues={[{ at: 0, name: "whoosh", volume: 0.5 }, ...sfx]} />
    </Paper>
  );
};

/** A red strike that wipes across its parent. */
export const Strike: React.FC<{ frame: number; at: number; top?: string }> = ({
  frame,
  at,
  top = "50%",
}) => (
  <div
    style={{
      position: "absolute",
      left: -12,
      right: -12,
      top,
      height: 10,
      borderRadius: 5,
      backgroundColor: red.base,
      rotate: "-6deg",
      transformOrigin: "right center",
      scale: `${progress(frame, at, at + 10)} 1`,
    }}
  />
);

export const exitIcon = (
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </>
);

/** Presenter name card for the green strip. */
export const NameCard: React.FC<{
  frame: number;
  at: number;
  line2At: number;
}> = ({ frame, at, line2At }) => {
  const shown = progress(frame, at, at + 14);
  const line2 = progress(frame, line2At, line2At + 12);
  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "40px 30px 0",
      }}
    >
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          backgroundColor: ink.full,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          scale: `${shown}`,
        }}
      >
        <Icon size={76} color={paper.white}>
          {paths.user}
        </Icon>
      </div>
      <div>
        <div
          style={{
            fontFamily: font.arDisplay,
            fontSize: 60,
            color: ink.full,
            whiteSpace: "nowrap",
            clipPath: `inset(0 0 0 ${(1 - shown) * 100}%)`,
          }}
        >
          معتصم عبد العظيم
        </div>
        <div
          style={{
            marginTop: 14,
            width: 380 * line2,
            height: 8,
            borderRadius: 4,
            backgroundColor: red.base,
          }}
        />
      </div>
    </div>
  );
};

/** Numbered question card for the full-frame inserts. */
export const QCard: React.FC<{
  frame: number;
  at: number;
  n: string;
  icon: React.ReactNode;
  head: string;
  body: string;
  bodyAt: number;
  hot?: boolean;
}> = ({ frame, at, n, icon, head, body, bodyAt, hot }) => {
  const shown = progress(frame, at, at + 16);
  const b = progress(frame, bodyAt, bodyAt + 12);
  return (
    <div
      dir="rtl"
      style={{
        width: 920,
        borderRadius: 44,
        backgroundColor: paper.lift,
        boxShadow:
          "0 30px 60px rgba(20,16,15,0.12), 0 4px 12px rgba(20,16,15,0.08)",
        border: hot ? `6px solid ${red.base}` : "6px solid transparent",
        boxSizing: "border-box",
        padding: "40px 50px",
        opacity: shown,
        translate: `0px ${(1 - shown) * 60}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            backgroundColor: hot ? red.base : ink.full,
            color: paper.white,
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {n}
        </div>
        <Icon size={60} color={hot ? red.base : ink.full}>
          {icon}
        </Icon>
        <div
          style={{
            fontFamily: font.arDisplay,
            fontSize: 60,
            color: ink.full,
            whiteSpace: "nowrap",
          }}
        >
          {head}
        </div>
      </div>
      <div
        style={{
          marginTop: 22,
          marginRight: 116,
          fontFamily: font.arDisplay,
          fontSize: 50,
          color: hot ? red.base : ink.soft,
          whiteSpace: "nowrap",
          opacity: b,
          translate: `0px ${(1 - b) * 20}px`,
        }}
      >
        {body}
      </div>
    </div>
  );
};

import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import "./fonts";
import { GreenCard, Headline, Layer, type Slide } from "./lib/greenscreen";
import { progress, sec, travel } from "./lib/motion";
import { font, ink, paper, red } from "./theme";

/**
 * Green-screen lower third for the fractional-ownership hook:
 *   "سواء سنك كبير أو صغير… دلوقتي تقدر تدخل الاستثمار العقاري
 *    من غير ما تشتري وحدة كاملة"
 *
 * Timed against SRT cues 1–6 (file 91), so frame 0 is 00:00:00,000.
 * Keying rules live in lib/greenscreen.tsx.
 */
const CUE = {
  age: sec(0),
  bigSmall: sec(0.6),
  canEnter: sec(1.566),
  realEstate: sec(2.566),
  without: sec(3.533),
  fullUnit: sec(4.4),
  end: sec(4.9),
};

const OUT_FROM = CUE.end + 10;
export const FRACTIONAL_HOOK_GREEN_DURATION = OUT_FROM + 18;

const HEADLINES: Slide[] = [
  {
    at: CUE.age,
    parts: [
      { text: "سواء سنك", at: CUE.age },
      { text: "كبير أو صغير", at: CUE.bigSmall },
    ],
  },
  {
    at: CUE.canEnter,
    parts: [{ text: "دلوقتي تقدر تدخل", at: CUE.canEnter }],
  },
  {
    at: CUE.realEstate,
    parts: [{ text: "الاستثمار العقاري", at: CUE.realEstate, accent: true }],
  },
  {
    at: CUE.without,
    parts: [{ text: "من غير ما تشتري", at: CUE.without }],
  },
];

const TABS: Slide[] = [{ at: 0, parts: [{ text: "استثمار", at: 0 }] }];

/* Graphic strip inside the card. */
const G = { left: 56, top: 186, width: 848, height: 250 };

/** Beat 1 — the age slider sweeping young → old. */
const AgeTrack: React.FC<{ frame: number }> = ({ frame }) => {
  const sweep = progress(frame, CUE.bigSmall, CUE.canEnter - 4, travel);
  // RTL: young on the right, older on the left.
  const left = 70;
  const right = G.width - 70;
  const y = 150;
  const knobX = interpolate(sweep, [0, 1], [right, left]);
  const bubbleX = Math.min(Math.max(knobX, 150), G.width - 150);
  const age = Math.round(interpolate(sweep, [0, 1], [18, 65]));

  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          width: right - left,
          top: y - 7,
          height: 14,
          borderRadius: 7,
          backgroundColor: "#D9D5D0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: knobX,
          width: right - knobX,
          top: y - 7,
          height: 14,
          borderRadius: 7,
          backgroundColor: red.base,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: knobX,
          top: y,
          width: 54,
          height: 54,
          translate: "-50% -50%",
          borderRadius: "50%",
          backgroundColor: paper.white,
          border: `7px solid ${red.base}`,
        }}
      />
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: bubbleX,
          top: y - 44,
          translate: "-50% -100%",
          padding: "10px 28px 8px",
          borderRadius: 24,
          backgroundColor: paper.white,
          border: "2px solid rgba(20,16,15,0.10)",
          display: "flex",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 72,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: ink.full,
          }}
        >
          {age}
        </span>
        <span
          style={{ fontFamily: font.arDisplay, fontSize: 34, color: ink.soft }}
        >
          سنة
        </span>
      </div>
      {[
        { x: right, label: "صغير" },
        { x: left, label: "كبير" },
      ].map(({ x, label }) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: x,
            top: y + 36,
            translate: "-50% 0",
            fontFamily: font.arDisplay,
            fontSize: 40,
            color: ink.soft,
          }}
        >
          {label}
        </div>
      ))}
    </>
  );
};

/** Beat 2 — a building rising out of the ground line. */
const Building: React.FC<{ frame: number }> = ({ frame }) => {
  const start = CUE.canEnter + 4;
  const grow = progress(frame, start, start + 26);
  const W = 560;
  const H = 200;
  const base = 236;
  const cols = 6;
  const rows = 2;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: base,
          height: 4,
          borderRadius: 2,
          backgroundColor: ink.faint,
          scale: `${progress(frame, start - 4, start + 16)} 1`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: (G.width - W) / 2,
          top: base - H,
          width: W,
          height: H,
          clipPath: `inset(${(1 - grow) * 100}% 0 0 0)`,
          borderRadius: "12px 12px 0 0",
          background: `linear-gradient(100deg, ${paper.white} 0%, ${paper.lift} 55%, #E7E3DE 100%)`,
          border: "2px solid rgba(20,16,15,0.10)",
          borderBottom: "none",
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: 16,
          padding: "24px 26px",
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => {
          const row = Math.floor(i / cols);
          const on = progress(
            frame,
            start + 10 + (rows - row) * 4,
            start + 22 + (rows - row) * 4,
          );
          return (
            <div
              key={i}
              style={{
                borderRadius: 8,
                backgroundColor: `rgba(20,16,15,${0.05 + on * 0.07})`,
              }}
            />
          );
        })}
      </div>
    </>
  );
};

/** Beat 3 — "وحدة كاملة", struck through in red, then split into shares. */
const UnitSplit: React.FC<{ frame: number }> = ({ frame }) => {
  const strike = progress(frame, CUE.fullUnit, CUE.fullUnit + 10);
  const split = progress(frame, CUE.fullUnit + 8, CUE.fullUnit + 20);
  const share = progress(frame, CUE.fullUnit + 14, CUE.fullUnit + 26);
  const tag = progress(frame, CUE.fullUnit + 20, CUE.fullUnit + 30);
  const top = 110;
  const h = 110;

  return (
    <>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top,
          height: h,
          display: "flex",
          gap: split * 10,
          borderRadius: 22,
          outline: `2px solid rgba(20,16,15,${0.12 * (1 - split)})`,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const isShare = i === 6;
          const r = split * 12;
          const right = i === 0 ? 22 : r;
          const left = i === 9 ? 22 : r;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                flex: 1,
                borderTopRightRadius: right,
                borderBottomRightRadius: right,
                borderTopLeftRadius: left,
                borderBottomLeftRadius: left,
                backgroundColor: isShare
                  ? interpolateColors(share, [0, 1], [paper.white, red.base])
                  : paper.white,
                border: `2px solid rgba(20,16,15,${0.1 * split})`,
                translate: isShare ? `0px ${share * -18}px` : undefined,
              }}
            >
              {isShare ? (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: -18,
                    translate: "-50% -100%",
                    scale: String(tag),
                    padding: "8px 22px 4px",
                    borderRadius: 999,
                    backgroundColor: ink.full,
                    color: paper.white,
                    fontFamily: font.arDisplay,
                    fontSize: 36,
                    whiteSpace: "nowrap",
                  }}
                >
                  حصة
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* The whole-unit label, struck through, then gone as the unit splits. */}
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top,
          height: h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          clipPath: `inset(0 0 ${split * 100}% 0)`,
        }}
      >
        <span
          style={{
            position: "relative",
            fontFamily: font.arDisplay,
            fontSize: 64,
            color: ink.full,
          }}
        >
          وحدة كاملة
          <span
            style={{
              position: "absolute",
              left: -14,
              right: -14,
              top: "52%",
              height: 10,
              borderRadius: 5,
              backgroundColor: red.base,
              transformOrigin: "right center",
              scale: `${strike} 1`,
              rotate: "-4deg",
            }}
          />
        </span>
      </div>
    </>
  );
};

export const FractionalHookGreen: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <GreenCard
      frame={frame}
      tabs={TABS}
      outFrom={OUT_FROM}
      outTo={FRACTIONAL_HOOK_GREEN_DURATION - 2}
    >
      <div style={{ position: "absolute", left: 56, right: 56, top: 50 }}>
        <Headline frame={frame} slides={HEADLINES} />
      </div>

      <div
        style={{
          position: "absolute",
          left: G.left,
          top: G.top,
          width: G.width,
          height: G.height,
          overflow: "hidden",
        }}
      >
        <Layer frame={frame} from={2} to={CUE.canEnter}>
          <AgeTrack frame={frame} />
        </Layer>
        <Layer frame={frame} from={CUE.canEnter + 2} to={CUE.without}>
          <Building frame={frame} />
        </Layer>
        <Layer frame={frame} from={CUE.without + 2}>
          <UnitSplit frame={frame} />
        </Layer>
      </div>
    </GreenCard>
  );
};

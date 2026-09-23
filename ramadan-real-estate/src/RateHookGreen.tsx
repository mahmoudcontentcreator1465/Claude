import { interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { GreenCard, Headline, Layer, type Slide } from "./lib/greenscreen";
import { Icon, paths } from "./lib/Icon";
import { progress, sec } from "./lib/motion";
import { font, ink, paper, red } from "./theme";

/**
 * Green-screen lower third for the interest-rate hook:
 *   "لو مستني الفايدة تقل عشان تشتري عقار، القرار الأخير ممكن يغيّر حساباتك"
 *
 * Timed against SRT cues 1–4 (file 93), so frame 0 is 00:00:00,000.
 * Keying rules live in lib/greenscreen.tsx.
 */
const CUE = {
  waiting: sec(0),
  toBuy: sec(1.533),
  decision: sec(2.4),
  changes: sec(3.733),
  end: sec(4.933),
};

const OUT_FROM = CUE.end + 10;
export const RATE_HOOK_GREEN_DURATION = OUT_FROM + 18;

const HEADLINES: Slide[] = [
  {
    at: CUE.waiting,
    parts: [{ text: "لو مستني الفايدة تقل", at: CUE.waiting }],
  },
  { at: CUE.toBuy, parts: [{ text: "عشان تشتري عقار", at: CUE.toBuy }] },
  {
    at: CUE.decision,
    parts: [{ text: "القرار اللي لسه نازل", at: CUE.decision }],
  },
  {
    at: CUE.changes,
    parts: [
      { text: "ممكن يغيّر كل", at: CUE.changes },
      { text: "حساباتك", at: CUE.changes + 6, accent: true },
    ],
  },
];

const TABS: Slide[] = [{ at: 0, parts: [{ text: "الفايدة", at: 0 }] }];

const G = { left: 56, top: 186, width: 848, height: 250 };

/** Beats 1–2 — the rate the viewer is waiting on, sliding down toward a house. */
const WaitingChart: React.FC<{ frame: number }> = ({ frame }) => {
  const draw = progress(frame, 4, CUE.toBuy);
  const house = progress(frame, CUE.toBuy, CUE.toBuy + 14);
  // Right (now, high) → left (later, low): the hoped-for drop.
  const x0 = G.width - 150;
  const y0 = 50;
  const x1 = 190;
  const y1 = 190;
  const d = `M ${x0} ${y0} C ${x0 - 200} ${y0}, ${x1 + 220} ${y1}, ${x1} ${y1}`;

  return (
    <>
      <svg
        width={G.width}
        height={G.height}
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d={d}
          fill="none"
          stroke={red.base}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray="4 18"
          pathLength={1}
          style={{ strokeDasharray: "0.012 0.03" }}
          clipPath="url(#reveal)"
        />
        <defs>
          <clipPath id="reveal">
            <rect
              x={x1 - 40 + (1 - draw) * (x0 - x1 + 80)}
              y={0}
              width={G.width}
              height={G.height}
            />
          </clipPath>
        </defs>
      </svg>

      {/* The rate chip at "now". */}
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 0,
          top: y0 - 44,
          width: 150,
          height: 88,
          borderRadius: 24,
          backgroundColor: paper.white,
          border: "2px solid rgba(20,16,15,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Icon size={44} color={red.base} stroke={2.6}>
          {paths.percent}
        </Icon>
        <svg width={30} height={44} viewBox="0 0 30 44">
          <path
            d="M15 4 V38 M4 27 L15 38 L26 27"
            fill="none"
            stroke={ink.full}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* The house waiting at the bottom of the hoped-for curve. */}
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: 0,
          top: y1 - 60,
          width: 170,
          height: 120,
          borderRadius: 26,
          backgroundColor: paper.white,
          border: "2px solid rgba(20,16,15,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          translate: `0px ${(1 - house) * 30}px`,
          clipPath: `inset(${(1 - house) * 100}% -10px -10px -10px round 26px)`,
        }}
      >
        <Icon size={70}>{paths.house}</Icon>
      </div>
    </>
  );
};

/** Deterministic scramble so every render shows the same "numbers". */
const scramble = (frame: number, i: number) =>
  Math.floor(Math.abs(Math.sin(frame * 12.9898 + i * 78.233) * 43758.5453)) %
  10;

/** Beats 3–4 — the new decision drops in, then the viewer's maths scrambles. */
const DecisionAndMaths: React.FC<{ frame: number }> = ({ frame }) => {
  const decision = progress(frame, CUE.decision, CUE.decision + 14);
  const calc = progress(frame, CUE.changes, CUE.changes + 12);
  const settle = frame >= CUE.end - 4;
  const digits = "3,250,000".split("");

  return (
    <>
      {/* The decision: a document with a red "new" badge. */}
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 0,
          top: 40,
          width: 330,
          height: 170,
          borderRadius: 30,
          backgroundColor: paper.white,
          border: "2px solid rgba(20,16,15,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          rotate: `${interpolate(decision, [0, 1], [-10, -3])}deg`,
          translate: `0px ${(1 - decision) * -60}px`,
          scale: String(interpolate(decision, [0, 1], [1.2, 1])),
        }}
      >
        <Icon size={70}>{paths.file}</Icon>
        <div
          style={{ fontFamily: font.arDisplay, fontSize: 56, color: ink.full }}
        >
          قرار
        </div>
        <div
          style={{
            position: "absolute",
            top: -22,
            left: 20,
            padding: "6px 18px 2px",
            borderRadius: 999,
            backgroundColor: red.base,
            color: paper.white,
            fontFamily: font.arDisplay,
            fontSize: 30,
          }}
        >
          جديد
        </div>
      </div>

      {/* The viewer's calculation, scrambling. */}
      {frame >= CUE.changes ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 60,
            width: 470,
            height: 140,
            borderRadius: 26,
            backgroundColor: ink.full,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            translate: `0px ${(1 - calc) * 40}px`,
            clipPath: `inset(${(1 - calc) * 100}% 0 0 0 round 26px)`,
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 66,
            letterSpacing: "-0.02em",
            color: settle ? red.base : paper.white,
          }}
        >
          {settle
            ? "?,???,???"
            : digits.map((ch, i) =>
                ch === "," ? ch : String(scramble(Math.floor(frame / 2), i)),
              )}
        </div>
      ) : null}
    </>
  );
};

export const RateHookGreen: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <GreenCard
      frame={frame}
      tabs={TABS}
      outFrom={OUT_FROM}
      outTo={RATE_HOOK_GREEN_DURATION - 2}
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
        <Layer frame={frame} from={2} to={CUE.decision}>
          <WaitingChart frame={frame} />
        </Layer>
        <Layer frame={frame} from={CUE.decision}>
          <DecisionAndMaths frame={frame} />
        </Layer>
      </div>
    </GreenCard>
  );
};

import { useCurrentFrame } from "remotion";
import "./fonts";
import { GreenCard, Headline, Layer, type Slide } from "./lib/greenscreen";
import { Icon, paths } from "./lib/Icon";
import { progress, sec } from "./lib/motion";
import { font, ink, paper, red } from "./theme";

/**
 * Green-screen lower third for the interest-rate reel:
 *   "بس قرار شراء العقار مايتبنيش على الفايدة لوحدها؛
 *    لازم تحسب سعر الوحدة، خطة السداد، والمشروع نفسه"
 *
 * Timed against SRT cues 12–17 (file 93): frame 0 is 00:00:16,300.
 * Keying rules live in lib/greenscreen.tsx.
 */
const T0 = 16.3;
const at = (srt: number) => sec(srt - T0);

const CUE = {
  decision: at(16.3),
  notRate: at(17.7),
  mustCalc: at(18.733),
  price: at(19.3),
  plan: at(20.0),
  project: at(20.533),
  end: at(21.3),
};

const OUT_FROM = CUE.end + 12;
export const RATE_FACTORS_GREEN_DURATION = OUT_FROM + 18;

const HEADLINES: Slide[] = [
  {
    at: CUE.decision,
    parts: [{ text: "بس قرار شراء العقار", at: CUE.decision }],
  },
  {
    at: CUE.notRate,
    parts: [
      { text: "مش على الفايدة", at: CUE.notRate },
      { text: "لوحدها", at: CUE.notRate + 6, accent: true },
    ],
  },
  { at: CUE.mustCalc, parts: [{ text: "لازم تحسب", at: CUE.mustCalc }] },
];

const TABS: Slide[] = [{ at: 0, parts: [{ text: "قبل ما تشتري", at: 0 }] }];

const G = { left: 56, top: 186, width: 848, height: 250 };

/** Beats 1–2 — the rate on its own, then crossed out as the only factor. */
const RateAlone: React.FC<{ frame: number }> = ({ frame }) => {
  const slash = progress(frame, CUE.notRate + 4, CUE.notRate + 16);

  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 170,
          height: 170,
          borderRadius: "50%",
          backgroundColor: paper.white,
          border: "2px solid rgba(20,16,15,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={96}>{paths.percent}</Icon>
        <div
          style={{
            position: "absolute",
            left: -20,
            right: -20,
            top: "50%",
            height: 12,
            borderRadius: 6,
            backgroundColor: red.base,
            rotate: "-35deg",
            scale: `${slash} 1`,
          }}
        />
      </div>
      <div
        style={{ fontFamily: font.arDisplay, fontSize: 64, color: ink.full }}
      >
        الفايدة
      </div>
    </div>
  );
};

const FACTORS = [
  { at: CUE.price, label: "سعر الوحدة", icon: paths.tag },
  { at: CUE.plan, label: "خطة السداد", icon: paths.calendar },
  { at: CUE.project, label: "المشروع", icon: paths.building },
];

/** Beats 3–6 — the rate joined by the three things that actually decide it. */
const Factors: React.FC<{ frame: number }> = ({ frame }) => {
  const chip = (
    key: string,
    label: string,
    icon: React.ReactNode,
    shown: number,
    active: boolean,
    dim: boolean,
  ) => (
    <div
      key={key}
      style={{
        width: 196,
        height: 210,
        borderRadius: 28,
        backgroundColor: dim ? paper.base : paper.white,
        border: `${active ? 5 : 2}px solid ${active ? red.base : "rgba(20,16,15,0.10)"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        translate: `0px ${(1 - shown) * 40}px`,
        clipPath: `inset(${(1 - shown) * 100}% -10px -10px -10px round 28px)`,
      }}
    >
      <Icon size={72} color={dim ? ink.soft : ink.full}>
        {icon}
      </Icon>
      <div
        style={{
          fontFamily: font.arDisplay,
          fontSize: 38,
          color: dim ? ink.soft : ink.full,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {chip("rate", "الفايدة", paths.percent, 1, false, true)}
      {FACTORS.map((f, i) => {
        const next = FACTORS[i + 1];
        const shown = progress(frame, f.at, f.at + 12);
        const active = frame >= f.at && (!next || frame < next.at);
        return chip(f.label, f.label, f.icon, shown, active, false);
      })}
    </div>
  );
};

export const RateFactorsGreen: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <GreenCard
      frame={frame}
      tabs={TABS}
      outFrom={OUT_FROM}
      outTo={RATE_FACTORS_GREEN_DURATION - 2}
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
        <Layer frame={frame} from={2} to={CUE.mustCalc}>
          <RateAlone frame={frame} />
        </Layer>
        <Layer frame={frame} from={CUE.mustCalc}>
          <Factors frame={frame} />
        </Layer>
      </div>
    </GreenCard>
  );
};

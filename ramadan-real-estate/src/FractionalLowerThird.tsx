import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import "./fonts";
import { progress, sec, travel } from "./lib/motion";
import { font, gridLine, ink, paper, red } from "./theme";

/**
 * Lower-third overlay on green screen for the explainer section:
 *   "الفكرة إن الوحدة بتتقسم لـ 10 حصص، وكل حصة بتمثل 10% من الوحدة،
 *    وتقدر تدخل بنظام سداد مرن يمتد لحد 8 سنين، وخلال فترة السداد
 *    ممكن الوحدة تدخل التشغيل وتحقق عائد حسب أداء التشغيل وشروط البرنامج،
 *    وفيه كمان إمكانية للتخارج بعد سنتين حسب شروط البرنامج"
 *
 * Timed against SRT cues 14–29: frame 0 is 00:00:11,500 in the full video.
 *
 * Keying rules: everything outside the card is flat chroma green. No outer
 * shadows, glows, grain or opacity fades on the card's edge — it moves by
 * translate and clip only, so it keys cleanly. Add a drop shadow after keying.
 */
const T0 = 11.5;
const at = (srt: number) => sec(srt - T0);

const CUE = {
  idea: at(11.5),
  tenShares: at(13.166),
  eachShare: at(13.766),
  tenPercent: at(15.133),
  canEnter: at(16.033),
  plan: at(16.8),
  eightYears: at(17.666),
  during: at(18.966),
  operates: at(20.233),
  returns: at(21.233),
  performance: at(22.333),
  exit: at(24.566),
  twoYears: at(26.2),
  terms: at(27.4),
  end: at(28.466),
};

export const LOWER_THIRD_DURATION = CUE.end + 18;

export const CHROMA = "#00FF00";

/* Card geometry, canvas px. */
const CARD = { left: 60, top: 1270, width: 960, height: 470 };
/* Graphic strip inside the card. */
const G = { left: 56, top: 186, width: 848, height: 170 };
const AXIS_Y = 118;

/** Timeline x for year k (0 = now, on the right; 8 on the left). */
const yearX = (k: number) => G.width - k * (G.width / 8);

type Part = {
  text: string;
  at: number;
  latin?: boolean;
  accent?: boolean;
};

type Slide = { at: number; parts: Part[] };

/** Headline slides. Each part pops in on its own cue inside the slide. */
const HEADLINES: Slide[] = [
  {
    at: CUE.idea,
    parts: [
      { text: "الوحدة بتتقسم", at: CUE.idea },
      { text: "لـ", at: CUE.tenShares },
      { text: "10", at: CUE.tenShares, latin: true },
      { text: "حصص", at: CUE.tenShares + 3 },
    ],
  },
  {
    at: CUE.eachShare,
    parts: [
      { text: "كل حصة بتمثل", at: CUE.eachShare },
      { text: "10%", at: CUE.tenPercent, latin: true, accent: true },
      { text: "من الوحدة", at: CUE.tenPercent + 6 },
    ],
  },
  {
    at: CUE.canEnter,
    parts: [
      { text: "سداد مرن", at: CUE.canEnter + 4 },
      { text: "لحد", at: CUE.eightYears },
      { text: "8", at: CUE.eightYears, latin: true, accent: true },
      { text: "سنين", at: CUE.eightYears + 3 },
    ],
  },
  {
    at: CUE.during,
    parts: [{ text: "خلال فترة السداد", at: CUE.during }],
  },
  {
    at: CUE.operates,
    parts: [
      { text: "الوحدة تشتغل", at: CUE.operates },
      { text: "وتحقق", at: CUE.returns },
      { text: "عائد", at: CUE.returns + 4, accent: true },
    ],
  },
  {
    at: CUE.exit,
    parts: [
      { text: "إمكانية للتخارج", at: CUE.exit },
      { text: "بعد", at: CUE.twoYears },
      { text: "سنتين", at: CUE.twoYears, accent: true },
    ],
  },
];

const TABS: Slide[] = [
  { at: CUE.idea, parts: [{ text: "الفكرة", at: CUE.idea }] },
  { at: CUE.eachShare, parts: [{ text: "الحصة", at: CUE.eachShare }] },
  { at: CUE.canEnter, parts: [{ text: "السداد", at: CUE.canEnter }] },
  { at: CUE.during, parts: [{ text: "العائد", at: CUE.during }] },
  { at: CUE.exit, parts: [{ text: "التخارج", at: CUE.exit }] },
];

const FOOTNOTES = [
  {
    from: CUE.performance,
    to: CUE.exit,
    text: "* حسب أداء التشغيل وشروط البرنامج",
  },
  {
    from: CUE.terms,
    to: LOWER_THIRD_DURATION + 1,
    text: "* حسب شروط البرنامج",
  },
];

/**
 * Slides stacked in a clipped window: the current one wipes up in, the
 * previous one wipes up out. No opacity, so nothing half-transparent.
 */
const SlideStack: React.FC<{
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

const Headline: React.FC<{ frame: number }> = ({ frame }) => (
  <SlideStack
    frame={frame}
    slides={HEADLINES}
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

/** Beats 1–2: the unit bar that splits into ten shares, then collapses into the axis. */
const UnitBar: React.FC<{ frame: number }> = ({ frame }) => {
  const split = progress(frame, CUE.tenShares, CUE.tenShares + 14);
  const share = progress(frame, CUE.tenPercent, CUE.tenPercent + 12);
  const collapse = progress(frame, CUE.canEnter, CUE.canEnter + 16, travel);
  if (collapse >= 1) return null;

  const gap = split * 10 * (1 - collapse);
  const h = interpolate(collapse, [0, 1], [100, 8]);
  const top = interpolate(collapse, [0, 1], [18, AXIS_Y - 4]);

  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        height: h,
        display: "flex",
        gap,
        // One outline for the whole unit until it splits.
        borderRadius: 22,
        outline: `2px solid rgba(20,16,15,${0.1 * (1 - split)})`,
      }}
    >
      {Array.from({ length: 10 }).map((_, i) => {
        const isShare = i === 0;
        const r = interpolate(split, [0, 1], [0, 12]) * (1 - collapse);
        // dir=rtl: index 0 sits on the right edge, index 9 on the left.
        const outer = 18 * (1 - collapse) + 4;
        const right = i === 0 ? outer : r;
        const left = i === 9 ? outer : r;
        const base = isShare
          ? interpolateColors(share, [0, 1], [paper.white, red.base])
          : paper.white;

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
              backgroundColor: interpolateColors(
                collapse,
                [0, 1],
                [base, "#D9D5D0"],
              ),
              border:
                collapse > 0.5
                  ? "none"
                  : `2px solid rgba(20,16,15,${0.1 * split})`,
              translate: isShare
                ? `0px ${share * -14 * (1 - collapse)}px`
                : undefined,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: font.display,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: "-0.02em",
              color: paper.white,
            }}
          >
            {isShare && share > 0.6 && collapse < 0.3 ? "10%" : null}
          </div>
        );
      })}

      {/* The whole-unit label, before it splits. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: font.arDisplay,
          fontSize: 44,
          color: ink.soft,
          clipPath: `inset(0 0 ${split * 100}% 0)`,
        }}
      >
        وحدة فندقية واحدة
      </div>
    </div>
  );
};

const ExitIcon: React.FC = () => (
  <svg
    width={34}
    height={34}
    viewBox="0 0 24 24"
    fill="none"
    stroke={paper.white}
    strokeWidth={2.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

/** Returns per year, drawn once the unit starts operating. Year 1 is fit-out. */
const RETURNS = [0, 34, 48, 56, 64, 72, 80, 88];

/** Beats 3–5: the 8-year payment timeline, returns, and the exit marker. */
const Timeline: React.FC<{ frame: number }> = ({ frame }) => {
  const appear = CUE.canEnter + 12;
  if (frame < appear) return null;

  const fill = progress(frame, CUE.plan, CUE.eightYears + 20, travel);
  const recede = progress(frame, CUE.exit, CUE.exit + 14);
  const exitRun = progress(frame, CUE.twoYears, CUE.twoYears + 14);
  const marker = progress(frame, CUE.twoYears + 6, CUE.twoYears + 18);

  return (
    <>
      {/* Track. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: AXIS_Y - 4,
          height: 8,
          borderRadius: 4,
          backgroundColor: "#D9D5D0",
        }}
      />
      {/* Payment fill, now → year 8. */}
      <div
        style={{
          position: "absolute",
          right: 0,
          width: fill * G.width,
          top: AXIS_Y - 4,
          height: 8,
          borderRadius: 4,
          backgroundColor: ink.full,
        }}
      />
      {/* Exit window, now → year 2, in the accent. */}
      <div
        style={{
          position: "absolute",
          right: 0,
          width: exitRun * (G.width - yearX(2)),
          top: AXIS_Y - 7,
          height: 14,
          borderRadius: 7,
          backgroundColor: red.base,
        }}
      />

      {Array.from({ length: 8 }).map((_, i) => {
        const k = i + 1;
        const x = yearX(k);
        const pop = progress(frame, appear + i * 2, appear + i * 2 + 10);
        const reached = fill >= k / 8;
        const bar = progress(
          frame,
          CUE.returns + i * 3,
          CUE.returns + i * 3 + 14,
        );

        return (
          <div key={k}>
            {/* Return bar. */}
            {RETURNS[i] > 0 ? (
              <div
                style={{
                  position: "absolute",
                  left: x + (k === 8 ? 10 : 0),
                  top: AXIS_Y - 12,
                  width: 30,
                  height: RETURNS[i],
                  translate: "-50% -100%",
                  borderRadius: "8px 8px 2px 2px",
                  backgroundColor: interpolateColors(
                    recede,
                    [0, 1],
                    [ink.full, "#D9D5D0"],
                  ),
                  scale: `1 ${bar * interpolate(recede, [0, 1], [1, 0.45])}`,
                  transformOrigin: "bottom",
                }}
              />
            ) : null}
            {/* Year tick. */}
            <div
              style={{
                position: "absolute",
                left: x + (k === 8 ? 10 : 0),
                top: AXIS_Y,
                width: 20,
                height: 20,
                translate: "-50% -50%",
                borderRadius: "50%",
                backgroundColor: reached ? ink.full : paper.white,
                border: `4px solid ${reached ? ink.full : "#BDB8B2"}`,
                scale: String(pop),
              }}
            />
            {/* Year label. */}
            <div
              style={{
                position: "absolute",
                left: x + (k === 8 ? 10 : 0),
                top: AXIS_Y + 38,
                translate: "-50% 0",
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: k === 8 || k === 2 ? 34 : 28,
                color:
                  (k === 2 && exitRun > 0.5) || (k === 8 && fill > 0.95)
                    ? k === 2
                      ? red.base
                      : ink.full
                    : ink.soft,
                clipPath: `inset(${(1 - pop) * 100}% 0 0 0)`,
              }}
            >
              {k}
            </div>
          </div>
        );
      })}

      {/* "Now" label at the start of the line. */}
      <div
        style={{
          position: "absolute",
          right: -6,
          top: AXIS_Y + 40,
          fontFamily: font.arDisplay,
          fontSize: 28,
          color: ink.soft,
        }}
      >
        دلوقتي
      </div>

      {/* Exit marker at year 2. */}
      <div
        style={{
          position: "absolute",
          left: yearX(2),
          top: AXIS_Y,
          width: 70,
          height: 70,
          translate: "-50% -50%",
          borderRadius: "50%",
          backgroundColor: red.base,
          border: `5px solid ${paper.white}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: String(marker),
        }}
      >
        <ExitIcon />
      </div>
    </>
  );
};

export const FractionalLowerThird: React.FC = () => {
  const frame = useCurrentFrame();

  const inT = progress(frame, 0, 16);
  const outT = progress(frame, CUE.end, LOWER_THIRD_DURATION - 2, travel);
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

        {/* Headline. */}
        <div style={{ position: "absolute", left: 56, right: 56, top: 50 }}>
          <Headline frame={frame} />
        </div>

        {/* Graphic strip. */}
        <div
          style={{
            position: "absolute",
            left: G.left,
            top: G.top,
            width: G.width,
            height: G.height,
          }}
        >
          <UnitBar frame={frame} />
          <Timeline frame={frame} />
        </div>

        {/* Footnotes — the program's conditions. */}
        {FOOTNOTES.map((f) => {
          if (frame < f.from || frame >= f.to) return null;
          const shown = progress(frame, f.from, f.from + 10);
          return (
            <div
              key={f.text}
              dir="rtl"
              style={{
                position: "absolute",
                right: 56,
                bottom: 20,
                fontFamily: font.arDisplay,
                fontSize: 32,
                color: ink.soft,
                clipPath: `inset(0 0 0 ${(1 - shown) * 100}%)`,
              }}
            >
              {f.text}
            </div>
          );
        })}
      </div>

      {/* Red tab naming the current beat, riding the card's top edge. */}
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
          slides={TABS}
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

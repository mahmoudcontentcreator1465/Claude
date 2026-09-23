import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { Dissolve } from "./lib/Dissolve";
import { Icon, paths } from "./lib/Icon";
import { Kicker } from "./lib/Kicker";
import { clamp, float, progress, rise, sec } from "./lib/motion";
import { Paper } from "./lib/Paper";
import { font, ink, paper, red, shadow } from "./theme";

/**
 * Full-frame insert for the interest-rate reel:
 *   "وفي شركة BTS بنساعدك تقارن الفرص العقارية وتاخد قرارك على أرقام،
 *    مش على كلام مبيعات"
 *
 * Timed against SRT cues 18–22 (file 93): frame 0 is 00:00:21,300.
 * The scores on the board are illustrative and labelled as such.
 */
const T0 = 21.3;
const at = (srt: number) => sec(srt - T0);

const CUE = {
  role: at(21.3),
  help: at(22.466),
  compare: at(23.2),
  numbers: at(24.366),
  notSales: at(25.866),
  end: at(26.933),
};

const DISSOLVE = 8;
export const BTS_COMPARE_DURATION = CUE.end + 30;

/* ------------------------------------------------------------------------ */
/* Beat 1 — "وده دورنا في BTS… إن إحنا نساعدك"                                */
/* ------------------------------------------------------------------------ */

const RoleBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { y, lift } = float(frame);

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 360 }}>
      <Kicker frame={frame}>وده دورنا</Kicker>

      <div
        style={{ position: "relative", marginTop: 110, ...rise(frame, 4, 50) }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 48,
            backgroundColor: ink.full,
            opacity: 0.1 - lift * 0.03,
            filter: `blur(${34 + lift * 10}px)`,
            transform: `translate(${44 + lift * 8}px, ${70 + lift * 12}px) rotate(-5deg)`,
          }}
        />
        <div
          style={{
            position: "relative",
            width: 760,
            height: 420,
            borderRadius: 48,
            backgroundColor: paper.lift,
            boxShadow: shadow.contact,
            transform: `translateY(${y}px) rotate(-5deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 250,
            letterSpacing: "-0.05em",
            color: ink.full,
          }}
        >
          BTS
          <span style={{ color: red.base }}>.</span>
        </div>
      </div>

      <div
        dir="rtl"
        style={{
          marginTop: 170,
          fontFamily: font.arDisplay,
          fontSize: 120,
          color: ink.full,
          ...rise(frame, CUE.help - CUE.role, 36),
        }}
      >
        إحنا نساعدك
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* Beat 2 — "تقارن الفرص العقارية وتاخد قرارك على أرقام، مش كلام مبيعات"    */
/* ------------------------------------------------------------------------ */

const METRICS = [
  { label: "السعر", icon: paths.tag },
  { label: "السداد", icon: paths.calendar },
  { label: "المشروع", icon: paths.building },
];

/** Illustrative scores, 0–10, per opportunity and metric. */
const OPTIONS = [
  { name: "1", bars: [6.5, 8, 7], score: "7.2" },
  { name: "2", bars: [8.5, 9, 8.3], score: "8.6", best: true },
  { name: "3", bars: [7, 5.5, 6.7], score: "6.4" },
];

const OptionColumn: React.FC<{
  frame: number;
  i: number;
  start: number;
  numbersAt: number;
}> = ({ frame, i, start, numbersAt }) => {
  const o = OPTIONS[i];
  const shown = progress(frame, start + i * 5, start + i * 5 + 18);
  const num = progress(frame, numbersAt + i * 3, numbersAt + i * 3 + 12);
  const best = o.best ? progress(frame, numbersAt + 14, numbersAt + 26) : 0;

  return (
    <div
      dir="rtl"
      style={{
        position: "relative",
        width: 290,
        padding: "34px 26px 30px",
        borderRadius: 36,
        backgroundColor: paper.lift,
        boxShadow: shadow.card,
        outline: `${best * 6}px solid ${red.base}`,
        opacity: shown,
        translate: `0px ${(1 - shown) * 60 - best * 14}px`,
        display: "flex",
        flexDirection: "column",
        gap: 26,
      }}
    >
      {o.best ? (
        <div
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            translate: "-50% 0",
            padding: "8px 26px 4px",
            borderRadius: 999,
            backgroundColor: red.base,
            color: paper.white,
            fontFamily: font.arDisplay,
            fontSize: 36,
            whiteSpace: "nowrap",
            scale: String(best),
          }}
        >
          الأنسب
        </div>
      ) : null}
      <div
        style={{
          fontFamily: font.arDisplay,
          fontSize: 52,
          color: ink.full,
          textAlign: "center",
        }}
      >
        فرصة{" "}
        <span style={{ fontFamily: font.display, fontWeight: 800 }}>
          {o.name}
        </span>
      </div>

      {METRICS.map((m, k) => {
        const grow = progress(
          frame,
          start + 10 + i * 5 + k * 4,
          start + 34 + i * 5 + k * 4,
        );
        return (
          <div
            key={m.label}
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <Icon size={40} color={ink.soft}>
              {m.icon}
            </Icon>
            <div
              style={{
                flex: 1,
                height: 22,
                borderRadius: 11,
                backgroundColor: "rgba(20,16,15,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(o.bars[k] / 10) * 100 * grow}%`,
                  height: "100%",
                  borderRadius: 11,
                  backgroundColor: o.best && best > 0.5 ? red.base : ink.full,
                  marginInlineStart: 0,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* The score: the decision on numbers. */}
      <div
        style={{
          textAlign: "center",
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: o.best ? red.base : ink.full,
          opacity: num,
          translate: `0px ${(1 - num) * 20}px`,
        }}
      >
        {o.score}
      </div>
    </div>
  );
};

const CompareBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (cue: number) => cue - CUE.compare;
  const bubble = progress(frame, c(CUE.notSales), c(CUE.notSales) + 14);
  const strike = progress(frame, c(CUE.notSales) + 10, c(CUE.notSales) + 22);

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
      <div
        dir="rtl"
        style={{
          textAlign: "center",
          fontFamily: font.arDisplay,
          lineHeight: 1.25,
        }}
      >
        <div style={{ fontSize: 100, color: ink.full, ...rise(frame, 0, 30) }}>
          تقارن الفرص العقارية
        </div>
        <div
          style={{
            fontSize: 76,
            color: ink.soft,
            ...rise(frame, c(CUE.numbers)),
          }}
        >
          وتاخد قرارك على <span style={{ color: red.base }}>أرقام</span>
        </div>
      </div>

      <div
        dir="rtl"
        style={{
          marginTop: 120,
          display: "flex",
          gap: 25,
          alignItems: "flex-end",
        }}
      >
        {OPTIONS.map((_, i) => (
          <OptionColumn
            key={i}
            frame={frame}
            i={i}
            start={6}
            numbersAt={c(CUE.numbers)}
          />
        ))}
      </div>

      {/* "Not sales talk" — a speech bubble, struck through. */}
      <div
        dir="rtl"
        style={{
          position: "relative",
          marginTop: 120,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "22px 44px 18px",
          borderRadius: 999,
          backgroundColor: paper.white,
          boxShadow: shadow.card,
          opacity: bubble,
          scale: String(interpolate(bubble, [0, 1], [0.85, 1])),
          rotate: "-2deg",
        }}
      >
        <Icon size={60} color={ink.soft}>
          {paths.bubble}
        </Icon>
        <span
          style={{ fontFamily: font.arDisplay, fontSize: 64, color: ink.soft }}
        >
          كلام مبيعات
        </span>
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: "52%",
            height: 10,
            borderRadius: 5,
            backgroundColor: red.base,
            transformOrigin: "right center",
            scale: `${strike} 1`,
          }}
        />
      </div>

      <div
        dir="rtl"
        style={{
          position: "absolute",
          bottom: 150,
          fontFamily: font.arDisplay,
          fontSize: 30,
          color: ink.soft,
          opacity: progress(frame, 20, 34),
        }}
      >
        * أرقام توضيحية
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */

const BEATS = [
  { from: CUE.role, to: CUE.compare, name: "Role", C: RoleBeat },
  {
    from: CUE.compare,
    to: BTS_COMPARE_DURATION,
    name: "Compare",
    C: CompareBeat,
  },
];

export const BtsCompare: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, BTS_COMPARE_DURATION], [1, 1.05], clamp);

  return (
    <Paper>
      <AbsoluteFill style={{ scale: String(push) }}>
        {BEATS.map(({ from, to, name, C }, i) => {
          const last = i === BEATS.length - 1;
          const duration = to - from + (last ? 0 : DISSOLVE);
          return (
            <Sequence
              key={name}
              from={from}
              durationInFrames={duration}
              name={name}
            >
              <Dissolve
                durationInFrames={duration}
                inFrames={i === 0 ? 0 : DISSOLVE}
                outFrames={last ? 0 : DISSOLVE}
              >
                <C />
              </Dissolve>
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </Paper>
  );
};

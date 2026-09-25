import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { Icon, paths } from "./lib/Icon";
import { Backdrop, Kicker } from "./hajj/style";
import { clamp, float, progress, rise, sec, travel } from "./lib/motion";
import { accent as brown, font, ink, paper, shadow, tan } from "./hajj/theme";
import { SfxTrack } from "./hajj/sfx";

/**
 * Full-frame inserts for the Hajj & Umrah agency reel (Different), in the
 * house style. Timed against the supplied SRT; each composition's frame 0 is
 * noted so it can be dropped on the timeline at that second.
 */

const push = (frame: number, duration: number) =>
  String(interpolate(frame, [0, duration], [1, 1.05], clamp));

/* ======================================================================== */
/* A — "لأن العميل ممكن يلاقي قدامه مئات البرامج… فنادق… أسعار… شركات…       */
/*      بتقول إن هي الأفضل"          Frame 0 = 00:00:04,433                   */
/* ======================================================================== */

const TA = 4.433;
const A = {
  because: sec(0),
  hundreds: sec(6.1 - TA),
  hotels: sec(7.1 - TA),
  prices: sec(7.966 - TA),
  companies: sec(8.8 - TA),
  best: sec(9.866 - TA),
  end: sec(10.866 - TA),
};
export const HAJJ_CHOICES_DURATION = A.end + 20;

/** Illustrative prices on the look-alike program cards. */
const PRICES = [
  "38,500",
  "42,000",
  "29,900",
  "55,000",
  "47,250",
  "33,800",
  "61,000",
  "39,900",
  "44,500",
  "36,000",
  "52,700",
  "41,300",
];

const ProgramCard: React.FC<{ frame: number; i: number }> = ({ frame, i }) => {
  const shown = progress(frame, A.hundreds + i * 2, A.hundreds + i * 2 + 12);
  const hotel = progress(frame, A.hotels + i, A.hotels + i + 8);
  const price = progress(frame, A.prices + i, A.prices + i + 8);
  const company = progress(frame, A.companies + i, A.companies + i + 8);
  const best = progress(frame, A.best + i * 1.5, A.best + i * 1.5 + 8);
  const tilt = ((i * 37) % 7) - 3;

  return (
    <div
      dir="rtl"
      style={{
        position: "relative",
        width: 300,
        height: 226,
        borderRadius: 26,
        backgroundColor: paper.lift,
        boxShadow: shadow.card,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        opacity: shown,
        scale: String(interpolate(shown, [0, 1], [0.8, 1])),
        rotate: `${tilt}deg`,
      }}
    >
      <div
        style={{
          height: 84,
          borderRadius: 14,
          backgroundColor: tan.fill,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ opacity: 0.35 + hotel * 0.65 }}>
          <Icon size={48} color={ink.soft}>
            {paths.building}
          </Icon>
        </div>
      </div>
      {/* Company name, as a bar. */}
      <div
        style={{
          height: 14,
          width: `${40 + company * 45}%`,
          borderRadius: 7,
          backgroundColor: company > 0.5 ? ink.full : "rgba(58,39,24,0.12)",
        }}
      />
      <div
        style={{
          height: 12,
          width: "70%",
          borderRadius: 6,
          backgroundColor: "rgba(58,39,24,0.08)",
        }}
      />
      <div
        style={{
          alignSelf: "flex-start",
          padding: "4px 14px",
          borderRadius: 999,
          backgroundColor: ink.full,
          color: paper.white,
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 26,
          opacity: price,
        }}
      >
        {PRICES[i]}
      </div>
      {/* Everyone says they're the best. */}
      <div
        style={{
          position: "absolute",
          top: -18,
          left: -14,
          padding: "6px 18px 2px",
          borderRadius: 12,
          backgroundColor: brown.base,
          color: paper.white,
          fontFamily: font.arDisplay,
          fontSize: 32,
          rotate: "-10deg",
          opacity: best,
          scale: String(interpolate(best, [0, 1], [1.8, 1])),
        }}
      >
        الأفضل
      </div>
    </div>
  );
};

export const HajjChoices: React.FC = () => {
  const frame = useCurrentFrame();
  const chip = (at: number, label: string, icon: React.ReactNode) => {
    const shown = progress(frame, at, at + 10);
    return (
      <div
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 26px 10px",
          borderRadius: 999,
          backgroundColor: paper.lift,
          boxShadow: shadow.card,
          fontFamily: font.arDisplay,
          fontSize: 44,
          color: ink.full,
          opacity: shown,
          scale: String(interpolate(shown, [0, 1], [0.8, 1])),
        }}
      >
        <Icon size={40}>{icon}</Icon>
        {label}
      </div>
    );
  };
  // Hundreds counter.
  const count = Math.round(
    interpolate(progress(frame, A.hundreds, A.hundreds + 24), [0, 1], [0, 100]),
  );

  return (
    <Backdrop>
      <AbsoluteFill
        style={{
          scale: push(frame, HAJJ_CHOICES_DURATION),
          alignItems: "center",
          paddingTop: 200,
        }}
      >
        <div
          dir="rtl"
          style={{
            textAlign: "center",
            fontFamily: font.arDisplay,
            lineHeight: 1.25,
          }}
        >
          <div style={{ fontSize: 64, color: ink.soft, ...rise(frame, 0) }}>
            العميل ممكن يلاقي قدامه
          </div>
          <div
            style={{
              fontSize: 112,
              color: ink.full,
              ...rise(frame, A.hundreds, 30),
            }}
          >
            مئات البرامج{" "}
            <span
              style={{
                fontFamily: font.display,
                fontWeight: 800,
                color: brown.base,
                direction: "ltr",
                display: "inline-block",
              }}
            >
              +{count}
            </span>
          </div>
        </div>

        <div dir="rtl" style={{ display: "flex", gap: 18, marginTop: 36 }}>
          {chip(A.hotels, "فنادق مختلفة", paths.building)}
          {chip(A.prices, "أسعار كتير", paths.tag)}
          {chip(A.companies, "شركات كتير", paths.star)}
        </div>

        <div
          dir="rtl"
          style={{
            marginTop: 60,
            display: "grid",
            gridTemplateColumns: "repeat(3, 300px)",
            gap: 24,
            // The wall shudders when every card claims to be the best.
            translate: `${Math.sin(frame * 1.7) * 6 * progress(frame, A.best, A.best + 6) * (1 - progress(frame, A.best + 20, A.best + 30))}px 0px`,
          }}
        >
          {PRICES.map((_, i) => (
            <ProgramCard key={i} frame={frame} i={i} />
          ))}
        </div>
      </AbsoluteFill>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.7 },
          { at: A.hundreds, name: "whoosh", volume: 0.7 },
          { at: A.hundreds, name: "tick", volume: 0.6 },
          { at: A.hundreds + 3, name: "tick", volume: 0.6 },
          { at: A.hundreds + 6, name: "tick", volume: 0.6 },
          { at: A.hundreds + 9, name: "tick", volume: 0.6 },
          { at: A.hundreds + 12, name: "tick", volume: 0.6 },
          { at: A.hundreds + 15, name: "tick", volume: 0.6 },
          { at: A.hundreds + 18, name: "tick", volume: 0.6 },
          { at: A.hundreds + 21, name: "tick", volume: 0.6 },
          { at: A.hundreds + 24, name: "tick", volume: 0.6 },
          { at: A.hotels, name: "pop" },
          { at: A.prices, name: "pop" },
          { at: A.companies, name: "pop" },
          { at: A.best, name: "stamp" },
          { at: A.best + 9, name: "stamp", volume: 0.5 },
        ]}
      />
    </Backdrop>
  );
};

/* ======================================================================== */
/* B — "مين الشركة… التنظيم… الإقامة والمواصلات… ولو احتاج حاجة هناك مين     */
/*      هيكون معاه"                  Frame 0 = 00:00:13,633                   */
/* ======================================================================== */

const TB = 13.633;
const B = {
  q1: sec(0),
  q2: sec(15.1 - TB),
  q3: sec(16.566 - TB),
  q4: sec(18.4 - TB),
  q4b: sec(19.6 - TB),
  end: sec(20.333 - TB),
};
export const HAJJ_QUESTIONS_DURATION = B.end + 20;

const QUESTIONS = [
  {
    at: B.q1,
    text: "مين الشركة اللي هسافر معاها؟",
    icon: paths.building,
    side: "right",
  },
  {
    at: B.q2,
    text: "التنظيم هيكون عامل إزاي؟",
    icon: paths.calendar,
    side: "left",
  },
  {
    at: B.q3,
    text: "الإقامة والمواصلات تفاصيلها إيه؟",
    icon: paths.bus,
    side: "right",
  },
  { at: B.q4, text: "ولو احتجت حاجة هناك", icon: paths.phone, side: "left" },
] as const;

export const HajjQuestions: React.FC = () => {
  const frame = useCurrentFrame();
  const { y } = float(frame);

  return (
    <Backdrop>
      <AbsoluteFill
        style={{
          scale: push(frame, HAJJ_QUESTIONS_DURATION),
          alignItems: "center",
          paddingTop: 190,
        }}
      >
        <Kicker frame={frame}>العميل بيسأل نفسه</Kicker>

        {/* The customer. */}
        <div style={{ marginTop: 30, ...rise(frame, 2, 30) }}>
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              backgroundColor: paper.lift,
              boxShadow: shadow.float,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              translate: `0px ${y}px`,
            }}
          >
            <Icon size={84}>{paths.user}</Icon>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            width: 960,
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          {QUESTIONS.map((q, i) => {
            const next = QUESTIONS[i + 1];
            const shown = progress(frame, q.at, q.at + 12);
            const back = next ? progress(frame, next.at, next.at + 10) : 0;
            const who = i === 3 ? progress(frame, B.q4b, B.q4b + 10) : 0;
            return (
              <div
                key={i}
                dir="rtl"
                style={{
                  alignSelf: q.side === "right" ? "flex-start" : "flex-end",
                  maxWidth: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "26px 36px 22px",
                  borderRadius: 40,
                  [q.side === "right"
                    ? "borderTopRightRadius"
                    : "borderTopLeftRadius"]: 10,
                  backgroundColor: paper.lift,
                  boxShadow: back > 0.5 ? shadow.card : shadow.float,
                  opacity: shown * interpolate(back, [0, 1], [1, 0.55]),
                  scale: String(
                    interpolate(shown, [0, 1], [0.8, 1]) *
                      interpolate(back, [0, 1], [1, 0.96]),
                  ),
                  transformOrigin:
                    q.side === "right" ? "right top" : "left top",
                  rotate: `${q.side === "right" ? -1.5 : 1.5}deg`,
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 76,
                    flexShrink: 0,
                    borderRadius: 20,
                    backgroundColor: back > 0.5 ? tan.fill : brown.base,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    size={46}
                    color={back > 0.5 ? ink.soft : paper.white}
                    stroke={2.2}
                  >
                    {q.icon}
                  </Icon>
                </div>
                <div
                  style={{
                    fontFamily: font.arDisplay,
                    fontSize: 56,
                    lineHeight: 1.3,
                    color: ink.full,
                  }}
                >
                  {q.text}
                  {i === 3 ? (
                    <div
                      style={{
                        color: brown.base,
                        opacity: who,
                        translate: `0px ${(1 - who) * 16}px`,
                      }}
                    >
                      مين هيكون معايا؟
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <SfxTrack
        cues={[
          { at: 0, name: "swipe" },
          { at: 4, name: "pop" },
          { at: B.q2, name: "pop" },
          { at: B.q3, name: "pop" },
          { at: B.q4, name: "pop" },
          { at: B.q4b, name: "chime", volume: 0.7 },
        ]}
      />
    </Backdrop>
  );
};

/* ======================================================================== */
/* C — "وساعدناهم يزوّدوا حجوزاتهم… بنسبة 400%"   Frame 0 = 00:00:32,400      */
/* ======================================================================== */

const TC = 32.4;
const Cc = { helped: sec(0), pct: sec(33.833 - TC), end: sec(35.0 - TC) };
export const HAJJ_PROOF_DURATION = Cc.end + 22;

export const HajjProof: React.FC = () => {
  const frame = useCurrentFrame();
  const before = progress(frame, 6, 22);
  const after = progress(frame, Cc.pct - 4, Cc.pct + 22, travel);
  const pct = Math.round(interpolate(after, [0, 1], [0, 400]));
  const { y, lift } = float(frame);

  const bar = (label: string, h: number, grow: number, accent: boolean) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div style={{ height: 680, display: "flex", alignItems: "flex-end" }}>
        <div
          style={{
            width: 220,
            height: h * grow,
            borderRadius: "26px 26px 8px 8px",
            backgroundColor: accent ? brown.base : tan.fillDeep,
            boxShadow: accent ? `0 30px 60px ${brown.glow}` : shadow.card,
          }}
        />
      </div>
      <div
        dir="rtl"
        style={{
          fontFamily: font.arDisplay,
          fontSize: 56,
          color: accent ? ink.full : ink.soft,
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <Backdrop>
      <AbsoluteFill
        style={{
          scale: push(frame, HAJJ_PROOF_DURATION),
          alignItems: "center",
          paddingTop: 200,
        }}
      >
        <Kicker frame={frame}>النتيجة</Kicker>
        <div
          dir="rtl"
          style={{
            marginTop: 30,
            fontFamily: font.arDisplay,
            fontSize: 92,
            lineHeight: 1.25,
            color: ink.full,
            textAlign: "center",
            ...rise(frame, 2, 30),
          }}
        >
          ساعدناهم يزوّدوا حجوزاتهم
        </div>

        {/* The number, floating above the chart. */}
        <div
          style={{
            position: "relative",
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 20,
            translate: `0px ${y}px`,
            opacity: progress(frame, Cc.pct - 4, Cc.pct + 6),
          }}
        >
          <div
            style={{
              fontFamily: font.display,
              fontWeight: 800,
              fontSize: 220,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: brown.base,
              textShadow: `24px ${40 + lift * 10}px 60px rgba(156,91,46,0.22)`,
            }}
          >
            {pct}%
          </div>
          <Icon size={120} color={brown.base} stroke={2.4}>
            {paths.trend}
          </Icon>
        </div>

        <div
          dir="rtl"
          style={{
            marginTop: 30,
            display: "flex",
            gap: 120,
            alignItems: "flex-end",
          }}
        >
          {bar("قبل", 130, before, false)}
          {bar("بعد", 650, after, true)}
        </div>
      </AbsoluteFill>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.7 },
          { at: 6, name: "pop" },
          { at: Cc.pct - 4, name: "riser" },
          { at: Cc.pct + 22, name: "impact", volume: 0.8 },
        ]}
      />
    </Backdrop>
  );
};

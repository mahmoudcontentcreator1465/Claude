import { AbsoluteFill, Sequence } from "remotion";
import "./fonts";
import { CHROMA, Layer, type Slide } from "./lib/greenscreen";
import { Icon, paths } from "./lib/Icon";
import { progress, rise, sec, travel } from "./lib/motion";
import { Badge, FloatCard, Tile, Title } from "./MarketNews";
import { FullSeg, GreenSeg, NameCard, exitIcon } from "./SahelKit";
import { font, ink, paper, red } from "./theme";

/**
 * Reel 95nnn — "258 مليار جنيه مبيعات في 3 مشاريع في الساحل" as ONE video
 * covering the whole clip, alternating green-screen lower thirds and
 * full-frame inserts (first one green). Wording follows the user's script,
 * timing follows the SRT. Frame 0 = 00:00:00,000.
 */

const SEG = [0, 5.666, 13.766, 17.9, 22.1, 26.466, 31.566, 35.6] as const;
const TAIL = 30;
export const SAHEL_SALES_DURATION = sec(SEG[7]) + TAIL;
const LAST = SEG.length - 2;

const len = (i: number) =>
  i === LAST
    ? sec(SEG[i + 1]) + TAIL - sec(SEG[i])
    : sec(SEG[i + 1]) - sec(SEG[i]);

const L = (i: number) => (t: number) => sec(t) - sec(SEG[i]);

type P = [string, number, boolean?, boolean?];
const sl = (i: number, at: number, ...parts: P[]): Slide => ({
  at: L(i)(at),
  parts: parts.map(([text, t, accent, latin]) => ({
    text,
    at: L(i)(t),
    accent,
    latin,
  })),
});

/** 0 → 258 counter in Inter (the Arabic face has no Latin digits). */
const Count: React.FC<{
  frame: number;
  from: number;
  to?: number;
  size: number;
  color?: string;
}> = ({ frame, from, to = from + 30, size, color = red.base }) => (
  <span
    style={{
      fontFamily: font.display,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "-0.05em",
      lineHeight: 1,
      color,
    }}
  >
    {Math.round(258 * progress(frame, from, to, travel))}
  </span>
);

/* 1 — green: the number + who's talking -------------------------------- */
const Seg1: React.FC = () => {
  const l = L(0);
  const slides = [
    sl(0, 0, ["258", 0, true, true], ["مليار جنيه", 0.9]),
    sl(0, 1.6, ["مبيعات", 1.6, true]),
    sl(
      0,
      1.966,
      ["في", 1.966],
      ["3", 2.1, true, true],
      ["مشاريع في", 2.3],
      ["الساحل", 2.9, true],
    ),
    sl(0, 4.766, ["وتعالى أفهمك", 4.766], ["الصح", 5.1, true]),
  ];
  const tabs = [
    { at: 0, parts: [{ text: "الساحل", at: 0 }] },
    { at: l(3.633), parts: [{ text: "معتصم", at: l(3.633) }] },
  ];
  return (
    <GreenSeg
      len={len(0)}
      tabs={tabs}
      slides={slides}
      sfx={[
        ...[0, 4, 8, 12, 16, 20, 24].map((k) => ({
          at: 2 + k,
          name: "tick" as const,
          volume: 0.5,
        })),
        { at: l(1.966), name: "pop" },
        { at: l(2.1), name: "pop" },
        { at: l(2.3), name: "pop" },
        { at: l(3.633), name: "swipe", volume: 0.5 },
        { at: l(4.766), name: "chime", volume: 0.5 },
      ]}
    >
      {(f) => (
        <>
          <Layer frame={f} from={2} to={l(3.633)}>
            <div
              dir="rtl"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "30px 10px 0",
              }}
            >
              <div style={{ display: "flex", gap: 14 }}>
                {[0, 1, 2].map((i) => (
                  <Tile
                    key={i}
                    frame={f}
                    at={l(1.966) + i * 5}
                    icon={paths.building}
                    w={140}
                    h={170}
                  />
                ))}
              </div>
              <div
                dir="rtl"
                style={{ display: "flex", alignItems: "baseline", gap: 14 }}
              >
                <Count frame={f} from={2} size={150} />
                <span
                  style={{
                    fontFamily: font.arDisplay,
                    fontSize: 44,
                    color: ink.full,
                  }}
                >
                  مليار
                </span>
              </div>
            </div>
          </Layer>
          <Layer frame={f} from={l(3.633)}>
            <NameCard frame={f} at={l(3.633) + 2} line2At={l(4.766)} />
          </Layer>
        </>
      )}
    </GreenSeg>
  );
};

/* 2 — full: the three projects + the figure ---------------------------- */
const PROJECTS = [
  { at: 5.8, name: "Hacienda Ras El Hekma" },
  { at: 6.9, name: "SouthMED" },
  { at: 7.7, name: "Wadi Yemm" },
];

const Seg2: React.FC = () => {
  const l = L(1);
  return (
    <FullSeg
      len={len(1)}
      kicker="الساحل الشمالي"
      top={210}
      sfx={[
        ...PROJECTS.map((p) => ({ at: l(p.at) - 4, name: "pop" as const })),
        ...[0, 5, 10, 15, 20, 25].map((k) => ({
          at: l(9.466) + k,
          name: "tick" as const,
          volume: 0.5,
        })),
        { at: l(9.466) + 30, name: "stamp", volume: 0.6 },
        { at: l(11.0), name: "swipe", volume: 0.5 },
      ]}
    >
      {(f) => (
        <>
          <div
            dir="rtl"
            style={{
              marginTop: 30,
              display: "flex",
              alignItems: "baseline",
              gap: 20,
              ...rise(f, 2, 40),
            }}
          >
            <span
              style={{
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: 110,
                color: red.base,
              }}
            >
              3
            </span>
            <span
              style={{
                fontFamily: font.arDisplay,
                fontSize: 90,
                color: ink.full,
              }}
            >
              مشاريع
            </span>
          </div>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "column",
              gap: 30,
            }}
          >
            {PROJECTS.map((p, i) => (
              <FloatCard
                key={p.name}
                frame={f}
                at={l(p.at) - 4}
                phase={i * 0.8}
                tilt={i === 1 ? 1.2 : -1.2}
                width={860}
                height={140}
              >
                <div
                  dir="ltr"
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 26,
                    padding: "0 50px",
                  }}
                >
                  <Icon size={56} color={red.base}>
                    {paths.building}
                  </Icon>
                  <span
                    style={{
                      fontFamily: font.display,
                      fontWeight: 800,
                      fontSize: 54,
                      letterSpacing: "-0.03em",
                      color: ink.full,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.name}
                  </span>
                </div>
              </FloatCard>
            ))}
          </div>

          {/* The figure. */}
          <div
            dir="rtl"
            style={{
              marginTop: 70,
              display: "flex",
              alignItems: "baseline",
              gap: 22,
              ...rise(f, l(8.3), 40),
            }}
          >
            <span
              style={{
                fontFamily: font.arDisplay,
                fontSize: 56,
                color: ink.soft,
              }}
            >
              حوالي
            </span>
            <Count frame={f} from={l(9.466)} to={l(9.466) + 30} size={200} />
            <span
              style={{
                fontFamily: font.arDisplay,
                fontSize: 64,
                color: ink.full,
              }}
            >
              مليار جنيه
            </span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: font.arDisplay,
              fontSize: 56,
              color: ink.full,
              ...rise(f, l(10.2), 24),
            }}
          >
            مبيعات
          </div>
          <div
            dir="rtl"
            style={{
              marginTop: 40,
              height: 84,
              padding: "0 36px",
              borderRadius: 42,
              backgroundColor: ink.full,
              color: paper.white,
              display: "flex",
              alignItems: "center",
              gap: 16,
              ...rise(f, l(11.0), 24),
            }}
          >
            <Icon size={42} color={paper.white}>
              {paths.calendar}
            </Icon>
            <span style={{ fontFamily: font.arDisplay, fontSize: 42 }}>
              خلال
            </span>
            <span
              style={{
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: 42,
              }}
            >
              2026
            </span>
            <span style={{ fontFamily: font.arDisplay, fontSize: 42 }}>
              لحد نص أغسطس
            </span>
          </div>
        </>
      )}
    </FullSeg>
  );
};

/* 3 — green: strong demand on certain brands --------------------------- */
const BARS = [0.45, 0.9, 0.55, 0.4, 0.95, 0.5];
const HOT = [1, 4];

const Seg3: React.FC = () => {
  const l = L(2);
  const slides = [
    sl(2, 13.766, ["الرقم ده بيأكد إن فيه", 13.766]),
    sl(2, 15.5, ["طلب", 15.5], ["قوي جداً", 15.6, true]),
    sl(2, 15.9, ["على مشاريع وبراندات", 15.9], ["معينة", 17.2, true]),
  ];
  return (
    <GreenSeg
      len={len(2)}
      tabs={[{ at: 0, parts: [{ text: "الطلب", at: 0 }] }]}
      slides={slides}
      sfx={[
        { at: l(14.2), name: "slide" },
        { at: l(15.5), name: "swipe", volume: 0.5 },
        { at: l(17.2), name: "ding", volume: 0.6 },
      ]}
    >
      {(f) => {
        const lit = f >= l(17.2);
        return (
          <div
            style={{
              height: 250,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 34,
              paddingBottom: 14,
              boxSizing: "border-box",
            }}
          >
            {BARS.map((h, i) => {
              const grow = progress(
                f,
                l(14.0) + i * 3,
                l(14.0) + i * 3 + 20,
                travel,
              );
              const hot = HOT.includes(i);
              return (
                <div
                  key={i}
                  style={{
                    width: 96,
                    height: 210 * h * grow,
                    borderRadius: "18px 18px 6px 6px",
                    backgroundColor: lit
                      ? hot
                        ? red.base
                        : "#D9D5D0"
                      : ink.full,
                  }}
                />
              );
            })}
          </div>
        );
      }}
    </GreenSeg>
  );
};

/* 4 — full: strong sales ≠ every unit is a deal ------------------------ */
const Seg4: React.FC = () => {
  const l = L(3);
  const units = Array.from({ length: 12 }, (_, i) => i);
  const good = [2, 7];
  return (
    <FullSeg
      len={len(3)}
      kicker="بس خد بالك"
      top={260}
      sfx={[
        { at: l(18.666) - 4, name: "pop" },
        { at: l(19.966), name: "swipe", volume: 0.5 },
        { at: l(21.266), name: "chime", volume: 0.5 },
      ]}
    >
      {(f) => {
        const judge = progress(f, l(21.266), l(21.266) + 10);
        return (
          <>
            <div style={{ marginTop: 30 }}>
              <Title frame={f} at={l(18.666) - 6} size={86}>
                قوة مبيعات المشروع
              </Title>
            </div>
            <div style={{ marginTop: 60 }}>
              <FloatCard
                frame={f}
                at={l(18.666)}
                phase={0.6}
                tilt={-1.5}
                width={720}
                height={620}
              >
                <div
                  style={{
                    padding: 50,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 26,
                  }}
                >
                  {units.map((u) => {
                    const isGood = good.includes(u);
                    const on = judge > 0.5;
                    return (
                      <div
                        key={u}
                        style={{
                          position: "relative",
                          height: 110,
                          borderRadius: 18,
                          backgroundColor: on
                            ? isGood
                              ? paper.white
                              : "#ECE8E2"
                            : paper.white,
                          border: `${on && isGood ? 5 : 2}px solid ${on && isGood ? red.base : "rgba(20,16,15,0.10)"}`,
                          boxSizing: "border-box",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          size={44}
                          color={
                            on ? (isGood ? red.base : "#C9C3BC") : ink.full
                          }
                        >
                          {paths.house}
                        </Icon>
                        {isGood ? (
                          <Badge
                            shown={judge}
                            icon={paths.check}
                            size={44}
                            style={{ top: -12, left: -12 }}
                          />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </FloatCard>
            </div>
            <div
              style={{
                marginTop: 70,
                fontFamily: font.arDisplay,
                fontSize: 60,
                color: ink.full,
                textAlign: "center",
                ...rise(f, l(19.966)),
              }}
            >
              مش معناها إن أي وحدة جواه
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: font.arDisplay,
                fontSize: 70,
                color: red.base,
                ...rise(f, l(21.266)),
              }}
            >
              تعتبر فرصة
            </div>
          </>
        );
      }}
    </FullSeg>
  );
};

/* 5 — green: define your goal ----------------------------------------- */
const GOALS = [
  { at: 23.9, icon: paths.waves, label: "مصيف" },
  { at: 24.866, icon: paths.trend, label: "استثمار" },
  { at: 25.6, icon: paths.tag, label: "إعادة بيع" },
];

const Seg5: React.FC = () => {
  const l = L(4);
  const slides = [
    sl(4, 22.1, ["الأول حدد", 22.1], ["هدفك", 22.8, true], ["من الشراء", 23.2]),
    sl(4, 23.9, ["هل هو", 23.9], ["مصيف؟", 24.1, true]),
    sl(4, 24.866, ["استثمار؟ ولا", 24.866], ["إعادة بيع؟", 25.6, true]),
  ];
  return (
    <GreenSeg
      len={len(4)}
      tabs={[{ at: 0, parts: [{ text: "هدفك", at: 0 }] }]}
      slides={slides}
      sfx={GOALS.map((g) => ({ at: l(g.at), name: "pop" as const }))}
    >
      {(f) => {
        const current = GOALS.reduce(
          (acc, g, i) => (f >= l(g.at) ? i : acc),
          -1,
        );
        return (
          <div
            dir="rtl"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 30,
              paddingTop: 36,
            }}
          >
            {GOALS.map((g, i) => (
              <Tile
                key={g.label}
                frame={f}
                at={l(g.at) - 2}
                icon={g.icon}
                label={g.label}
                w={240}
                on={i === current}
              />
            ))}
          </div>
        );
      }}
    </GreenSeg>
  );
};

/* 6 — full: then evaluate --------------------------------------------- */
const CHECKS = [
  { at: 27.1, icon: paths.tag, text: "سعر دخولك" },
  { at: 28.333, icon: paths.pin, text: "مكان الوحدة" },
  { at: 28.966, icon: paths.coins, text: "نظام السداد" },
  { at: 29.9, icon: exitIcon, text: "فرصة خروجك منها بعدين", hot: true },
];

const Seg6: React.FC = () => {
  const l = L(5);
  return (
    <FullSeg
      len={len(5)}
      kicker="وبعدها"
      top={320}
      sfx={CHECKS.map((c) => ({ at: l(c.at) + 6, name: "tick" as const }))}
    >
      {(f) => (
        <>
          <div style={{ marginTop: 30 }}>
            <Title frame={f} at={l(27.1) - 10} size={100}>
              <span style={{ color: red.base }}>قيّم</span>
            </Title>
          </div>
          <div style={{ marginTop: 60 }}>
            <FloatCard
              frame={f}
              at={4}
              phase={0.2}
              tilt={1}
              width={900}
              height={720}
            >
              <div
                style={{
                  padding: "50px 56px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 34,
                }}
              >
                {CHECKS.map((c) => {
                  const shown = progress(f, l(c.at), l(c.at) + 12);
                  const tick = progress(f, l(c.at) + 6, l(c.at) + 12);
                  return (
                    <div
                      key={c.text}
                      style={{
                        height: 130,
                        borderRadius: 26,
                        backgroundColor:
                          c.hot && tick > 0.5 ? red.wash : paper.white,
                        border: `${c.hot && tick > 0.5 ? 5 : 2}px solid ${c.hot && tick > 0.5 ? red.base : "rgba(20,16,15,0.10)"}`,
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        gap: 26,
                        padding: "0 34px",
                        opacity: shown,
                        translate: `${(1 - shown) * -40}px 0px`,
                      }}
                    >
                      <div
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: 14,
                          backgroundColor:
                            tick > 0.5 ? red.base : "transparent",
                          border: `4px solid ${tick > 0.5 ? red.base : "#D9D5D0"}`,
                          boxSizing: "border-box",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={34} color={paper.white} stroke={3.4}>
                          <g style={{ opacity: tick }}>{paths.check}</g>
                        </Icon>
                      </div>
                      <Icon size={56} color={c.hot ? red.base : ink.full}>
                        {c.icon}
                      </Icon>
                      <div
                        style={{
                          fontFamily: font.arDisplay,
                          fontSize: 54,
                          color: ink.full,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </FloatCard>
          </div>
        </>
      )}
    </FullSeg>
  );
};

/* 7 — green: the CTA --------------------------------------------------- */
const Seg7: React.FC = () => {
  const l = L(6);
  const slides = [
    sl(6, 31.566, ["ولو محتار بين", 31.566], ["أكتر من مشروع", 32.333, true]),
    sl(6, 33.333, ["ابعتلنا", 33.333, true], ["ونبعتلك", 33.8]),
    sl(6, 34.533, ["تفاصيل", 34.533], ["الاستشارات", 34.9, true]),
  ];
  return (
    <GreenSeg
      len={len(6)}
      tabs={[{ at: 0, parts: [{ text: "استشارة", at: 0 }] }]}
      slides={slides}
      sfx={[
        { at: l(32.333), name: "pop" },
        { at: l(33.333), name: "send" },
        { at: l(34.533), name: "ding", volume: 0.6 },
      ]}
    >
      {(f) => (
        <>
          <Layer frame={f} from={4} to={l(33.333)}>
            <div
              dir="rtl"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 26,
                paddingTop: 36,
              }}
            >
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ position: "relative" }}>
                  <Tile
                    frame={f}
                    at={l(32.333) - 6 + i * 4}
                    icon={paths.building}
                    w={200}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: -12,
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      backgroundColor: ink.full,
                      color: paper.white,
                      fontFamily: font.display,
                      fontWeight: 800,
                      fontSize: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      scale: `${progress(f, l(32.333) + i * 4, l(32.333) + i * 4 + 8)}`,
                    }}
                  >
                    ?
                  </div>
                </div>
              ))}
            </div>
          </Layer>
          <Layer frame={f} from={l(33.333)}>
            <div
              dir="rtl"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 26,
                paddingTop: 46,
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  backgroundColor: red.base,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: `${progress(f, l(33.333), l(33.333) + 10)}`,
                }}
              >
                <Icon size={56} color={paper.white} stroke={2.6}>
                  {paths.send}
                </Icon>
              </div>
              <div
                dir="rtl"
                style={{
                  height: 110,
                  padding: "0 34px",
                  borderRadius: 55,
                  backgroundColor: paper.white,
                  border: "2px solid rgba(20,16,15,0.10)",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  clipPath: `inset(0 0 0 ${(1 - progress(f, l(33.333) + 4, l(33.333) + 16)) * 100}% round 55px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: font.display,
                    fontWeight: 800,
                    fontSize: 46,
                    color: red.base,
                  }}
                >
                  BTS
                </span>
                <span
                  style={{
                    fontFamily: font.arDisplay,
                    fontSize: 40,
                    color: ink.full,
                  }}
                >
                  اللينك في البايو
                </span>
              </div>
            </div>
          </Layer>
        </>
      )}
    </GreenSeg>
  );
};

const SEGMENTS = [Seg1, Seg2, Seg3, Seg4, Seg5, Seg6, Seg7];

export const SahelSales: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CHROMA }}>
    {SEGMENTS.map((S, i) => (
      <Sequence key={i} from={sec(SEG[i])} durationInFrames={len(i)}>
        <S />
      </Sequence>
    ))}
  </AbsoluteFill>
);

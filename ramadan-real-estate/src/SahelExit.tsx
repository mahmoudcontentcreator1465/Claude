import { AbsoluteFill, Sequence } from "remotion";
import "./fonts";
import { CHROMA, Layer, type Slide } from "./lib/greenscreen";
import { Icon, paths } from "./lib/Icon";
import { progress, rise, sec, travel } from "./lib/motion";
import { Badge, FloatCard, Tile, Title } from "./MarketNews";
import {
  FullSeg,
  GreenSeg,
  NameCard,
  QCard,
  Strike,
  exitIcon,
} from "./SahelKit";
import { font, ink, paper, red } from "./theme";

/**
 * Reel 96 — "لو بتشتري في الساحل على أمل تبيع بعد سنة…" as ONE video that
 * covers the whole clip. Segments alternate green-screen lower thirds and
 * full-frame inserts (first one green). Wording follows the user's script,
 * timing follows SRT 96. Frame 0 = 00:00:00,000.
 */

/** Segment boundaries, seconds on the SRT clock. */
const SEG = [0, 7.333, 15.466, 21.0, 27.333, 32.4] as const;
const TAIL = 30;
export const SAHEL_EXIT_DURATION = sec(SEG[5]) + TAIL;

const len = (i: number) =>
  i === 4 ? sec(SEG[5]) + TAIL - sec(SEG[4]) : sec(SEG[i + 1]) - sec(SEG[i]);

/** Local frame of an SRT time inside segment i. */
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

/* 1 — green: the hook + who's talking ------------------------------------ */
const Seg1: React.FC = () => {
  const l = L(0);
  const slides = [
    sl(0, 0, ["لو بتشتري في", 0], ["الساحل", 0.7, true]),
    sl(0, 1.1, ["على أمل تبيع بعد سنة", 1.1]),
    sl(0, 2.2, ["وتكسب", 2.2, true]),
    sl(0, 2.7, ["ماتحسبش المكسب", 2.7]),
    sl(0, 3.8, ["قبل ما تعرف", 3.8], ["هتخرج إزاي", 4.4, true]),
    sl(0, 6.766, ["وتعالى أفهمك", 6.766], ["الصح", 7.0, true]),
  ];
  const tabs = [
    { at: 0, parts: [{ text: "الساحل", at: 0 }] },
    { at: l(5.166), parts: [{ text: "معتصم", at: l(5.166) }] },
  ];
  return (
    <GreenSeg
      len={len(0)}
      tabs={tabs}
      slides={slides}
      sfx={[
        { at: l(0.7), name: "pop" },
        { at: l(1.566), name: "pop" },
        { at: l(2.2), name: "pop" },
        { at: l(2.9), name: "strike" },
        { at: l(4.4), name: "stamp", volume: 0.6 },
        { at: l(5.166), name: "swipe", volume: 0.5 },
        { at: l(6.766), name: "chime", volume: 0.5 },
      ]}
    >
      {(f) => (
        <>
          <Layer frame={f} from={4} to={l(5.166)}>
            <div
              dir="rtl"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                paddingTop: 36,
              }}
            >
              <Tile
                frame={f}
                at={l(0.7)}
                icon={paths.waves}
                label="الساحل"
                w={200}
              />
              <Tile
                frame={f}
                at={l(1.566)}
                icon={paths.calendar}
                label="سنة"
                w={180}
              />
              <div style={{ position: "relative" }}>
                <Tile
                  frame={f}
                  at={l(2.2)}
                  icon={paths.trend}
                  label="مكسب"
                  w={200}
                />
                <Strike frame={f} at={l(2.9)} />
              </div>
              <Tile
                frame={f}
                at={l(3.8)}
                icon={exitIcon}
                label="الخروج؟"
                w={200}
                on={f >= l(4.4)}
              />
            </div>
          </Layer>
          <Layer frame={f} from={l(5.166)}>
            <NameCard frame={f} at={l(5.166) + 2} line2At={l(6.766)} />
          </Layer>
        </>
      )}
    </GreenSeg>
  );
};

/* 2 — full: developers now compete ------------------------------------- */
const COMPETE = [
  { at: 9.266, icon: paths.house, text: "مساحات أصغر" },
  { at: 10.166, icon: paths.calendar, text: "تقسيط أطول" },
  { at: 11.066, icon: paths.bus, text: "تسليم أسرع" },
];

const Seg2: React.FC = () => {
  const l = L(1);
  return (
    <FullSeg
      len={len(1)}
      kicker="دلوقتي"
      top={230}
      sfx={[
        ...COMPETE.map((c) => ({ at: l(c.at) - 4, name: "pop" as const })),
        { at: l(13.933), name: "ding", volume: 0.6 },
      ]}
    >
      {(f) => (
        <>
          <div style={{ marginTop: 30 }}>
            <Title frame={f} at={l(7.8)} size={82}>
              مطورين كتير بقوا ينافسوا بـ
            </Title>
          </div>
          <div
            style={{
              marginTop: 60,
              display: "flex",
              flexDirection: "column",
              gap: 36,
            }}
          >
            {COMPETE.map((c, i) => {
              const bar = progress(f, l(c.at), l(c.at) + 24, travel);
              return (
                <FloatCard
                  key={c.text}
                  frame={f}
                  at={l(c.at) - 4}
                  phase={i * 0.9}
                  tilt={i === 1 ? 1.5 : -1.5}
                  width={880}
                  height={190}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 30,
                      padding: "0 54px",
                    }}
                  >
                    <Icon size={70} color={red.base}>
                      {c.icon}
                    </Icon>
                    <div
                      style={{
                        fontFamily: font.arDisplay,
                        fontSize: 66,
                        color: ink.full,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.text}
                    </div>
                    <div style={{ flex: 1 }} />
                    {/* Tiny visual per perk. */}
                    <div
                      style={{
                        width: 200,
                        height: 18,
                        borderRadius: 9,
                        backgroundColor: "#E4E0DA",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          bottom: 0,
                          borderRadius: 9,
                          backgroundColor: ink.full,
                          width: `${(i === 1 ? 0.3 + bar * 0.7 : 1 - bar * 0.55) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </FloatCard>
              );
            })}
          </div>
          <div
            dir="rtl"
            style={{
              marginTop: 90,
              display: "flex",
              alignItems: "center",
              gap: 26,
              ...rise(f, l(12.566)),
            }}
          >
            <Icon size={80}>{paths.user}</Icon>
            <div
              style={{
                fontFamily: font.arDisplay,
                fontSize: 62,
                color: ink.full,
                whiteSpace: "nowrap",
              }}
            >
              المشتري قدامه{" "}
              <span
                style={{
                  color: red.base,
                  opacity: progress(f, l(13.933), l(13.933) + 10),
                }}
              >
                اختيارات أكتر
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: font.arDisplay,
              fontSize: 48,
              color: ink.soft,
              ...rise(f, l(14.4)),
            }}
          >
            بكتير من زمان
          </div>
        </>
      )}
    </FullSeg>
  );
};

/* 3 — green: resale vs. the developer ---------------------------------- */
const Seg3: React.FC = () => {
  const l = L(2);
  const slides = [
    sl(2, 15.466, ["فلو إنت حاجز", 15.466]),
    sl(
      2,
      16.4,
      ["بس عشان تعمل", 16.4],
      ["Resale", 17.3, true, true],
      ["سريع", 17.6, true],
    ),
    sl(2, 18.1, ["ممكن تلاقي نفسك بتنافس", 18.1]),
    sl(2, 19.3, ["المطور", 19.3, true], ["وهو لسه بيبيع", 20.2]),
  ];
  return (
    <GreenSeg
      len={len(2)}
      tabs={[{ at: 0, parts: [{ text: "خد بالك", at: 0 }] }]}
      slides={slides}
      sfx={[
        { at: 6, name: "pop" },
        { at: l(17.3), name: "tick" },
        { at: l(18.1), name: "swipe", volume: 0.5 },
        { at: l(19.3), name: "stamp", volume: 0.6 },
        { at: l(20.2), name: "pop" },
      ]}
    >
      {(f) => {
        const vs = progress(f, l(18.1) + 6, l(18.1) + 16);
        return (
          <>
            <Layer frame={f} from={4} to={l(18.1)}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: 36,
                }}
              >
                <div style={{ position: "relative" }}>
                  <Tile
                    frame={f}
                    at={6}
                    icon={paths.house}
                    label="وحدتك"
                    w={260}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      left: -40,
                      height: 56,
                      padding: "0 20px",
                      borderRadius: 28,
                      backgroundColor: red.base,
                      color: paper.white,
                      fontFamily: font.display,
                      fontWeight: 800,
                      fontSize: 28,
                      display: "flex",
                      alignItems: "center",
                      scale: `${progress(f, l(17.3), l(17.3) + 8)}`,
                    }}
                  >
                    Resale
                  </div>
                </div>
              </div>
            </Layer>
            <Layer frame={f} from={l(18.1)}>
              <div
                dir="rtl"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 36,
                  paddingTop: 36,
                }}
              >
                <Tile
                  frame={f}
                  at={l(18.1)}
                  icon={paths.user}
                  label="إنت"
                  w={240}
                />
                <div
                  style={{
                    fontFamily: font.display,
                    fontWeight: 800,
                    fontSize: 64,
                    color: red.base,
                    scale: `${vs}`,
                  }}
                >
                  VS
                </div>
                <Tile
                  frame={f}
                  at={l(19.3) - 4}
                  icon={paths.building}
                  label="المطور"
                  w={240}
                  on={f >= l(20.2)}
                />
              </div>
            </Layer>
          </>
        );
      }}
    </GreenSeg>
  );
};

/* 4 — full: the two questions ------------------------------------------ */
const Seg4: React.FC = () => {
  const l = L(3);
  return (
    <FullSeg
      len={len(3)}
      kicker="قبل ما تشتري"
      top={330}
      sfx={[
        { at: l(22.433) - 4, name: "pop" },
        { at: l(23.5), name: "tick" },
        { at: l(24.966) - 4, name: "pop" },
        { at: l(26.1), name: "ding", volume: 0.6 },
      ]}
    >
      {(f) => (
        <>
          <div style={{ marginTop: 30 }}>
            <Title frame={f} at={2} size={100}>
              <span style={{ color: red.base }}>اسأل</span> نفسك
            </Title>
          </div>
          <div
            style={{
              marginTop: 80,
              display: "flex",
              flexDirection: "column",
              gap: 50,
            }}
          >
            <QCard
              frame={f}
              at={l(22.433) - 4}
              n="1"
              icon={paths.trend}
              head="لو السعر زاد"
              body="هل فعلاً في حد هيشتري منك؟"
              bodyAt={l(23.5)}
            />
            <QCard
              frame={f}
              at={l(24.966) - 4}
              n="2"
              icon={paths.calendar}
              head="ولو البيع اتأخر"
              body="هل هتقدر تكمّل الأقساط؟"
              bodyAt={l(26.1)}
              hot={f >= l(26.1)}
            />
          </div>
        </>
      )}
    </FullSeg>
  );
};

/* 5 — green: paper profit vs. real exit -------------------------------- */
const Seg5: React.FC = () => {
  const l = L(4);
  const slides = [
    sl(4, 27.333, ["لأن المكسب", 27.333], ["على الورق", 28.2, true]),
    sl(4, 29.033, ["مش مكسب", 29.033, true]),
    sl(4, 29.566, ["المكسب الحقيقي", 29.566]),
    sl(4, 30.466, ["لما تعرف", 30.466], ["تخرج من الصفقة", 31.1, true]),
  ];
  return (
    <GreenSeg
      len={len(4)}
      tabs={[{ at: 0, parts: [{ text: "الخلاصة", at: 0 }] }]}
      slides={slides}
      sfx={[
        { at: 6, name: "pop" },
        { at: l(29.033), name: "strike" },
        { at: l(29.566), name: "swipe", volume: 0.5 },
        { at: l(31.1), name: "ding", volume: 0.7 },
      ]}
    >
      {(f) => (
        <>
          <Layer frame={f} from={4} to={l(29.566)}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 36,
              }}
            >
              <div style={{ position: "relative" }}>
                <Tile
                  frame={f}
                  at={6}
                  icon={paths.file}
                  label="مكسب على الورق"
                  w={340}
                />
                <Strike frame={f} at={l(29.033)} />
              </div>
            </div>
          </Layer>
          <Layer frame={f} from={l(29.566)}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 36,
              }}
            >
              <div style={{ position: "relative" }}>
                <Tile
                  frame={f}
                  at={l(29.566) + 2}
                  icon={exitIcon}
                  label="تعرف تخرج"
                  w={320}
                  on={f >= l(31.1)}
                />
                <Badge
                  shown={progress(f, l(31.1), l(31.1) + 8)}
                  icon={paths.check}
                  style={{ top: -14, left: -14 }}
                />
              </div>
            </div>
          </Layer>
        </>
      )}
    </GreenSeg>
  );
};

const SEGMENTS = [Seg1, Seg2, Seg3, Seg4, Seg5];

export const SahelExit: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CHROMA }}>
    {SEGMENTS.map((S, i) => (
      <Sequence key={i} from={sec(SEG[i])} durationInFrames={len(i)}>
        <S />
      </Sequence>
    ))}
  </AbsoluteFill>
);

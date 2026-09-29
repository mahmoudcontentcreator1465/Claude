import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { SfxTrack } from "./hajj/sfx";
import { GreenCard, Headline, Layer, type Slide } from "./lib/greenscreen";
import { Icon, paths } from "./lib/Icon";
import { Kicker } from "./lib/Kicker";
import { clamp, float, progress, rise, sec, travel } from "./lib/motion";
import { Paper } from "./lib/Paper";
import { font, ink, paper, red, shadow } from "./theme";

/**
 * Market-regulation news reel (SRT 95), house style. The clip is covered end
 * to end, alternating green-screen lower thirds and full-frame inserts:
 *
 *   1 NewsHookGreen   green  00:00.000  "في أخبار مهمة… هتغيّر السوق العقاري كله"
 *   2 DirectivesFull  full   00:02.933  "بعد توجيهات الرئيس… تحركات فعلية لتنظيم السوق"
 *   3 LawGreen        green  00:09.200  "وزارة الإسكان بتجهز مشروع قانون… المطور الملتزم"
 *   4 BankDataFull    full   00:15.600  "البنك المركزي طلب من البنوك بيانات…"
 *   5 SortGreen       green  00:21.233  "وده معناه إن الفترة الجاية… فرز حقيقي للسوق"
 *   6 AskFirstFull    full   00:24.600  "قبل ما تسأل المتر بكام… يكمل ويسلّم؟"
 */

const border = "rgba(20,16,15,0.10)";

/* ------------------------------------------------------------------------ */
/* Green-screen helpers                                                     */
/* ------------------------------------------------------------------------ */

const G = { left: 56, top: 186, width: 848, height: 250 };

const Top: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 56, right: 56, top: 50 }}>
    {children}
  </div>
);

const Strip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
    {children}
  </div>
);

/** White tile with an icon and optional label; red border when it's the point. */
const Tile: React.FC<{
  frame: number;
  at: number;
  icon: React.ReactNode;
  label?: string;
  w?: number;
  h?: number;
  on?: boolean;
  style?: React.CSSProperties;
}> = ({ frame, at, icon, label, w = 180, h = 170, on, style }) => {
  const shown = progress(frame, at, at + 12);
  return (
    <div
      dir="rtl"
      style={{
        width: w,
        height: h,
        flexShrink: 0,
        borderRadius: 26,
        backgroundColor: paper.white,
        border: `${on ? 5 : 2}px solid ${on ? red.base : border}`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        translate: `0px ${(1 - shown) * 40}px`,
        clipPath: `inset(${(1 - shown) * 100}% -10px -10px -10px round 26px)`,
        ...style,
      }}
    >
      <Icon size={58} color={on ? red.base : ink.full}>
        {icon}
      </Icon>
      {label ? (
        <div
          style={{
            fontFamily: font.arDisplay,
            fontSize: 34,
            color: on ? red.base : ink.full,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Short grey text lines, like a document's body. */
const Lines: React.FC<{ widths: number[]; draw?: number }> = ({
  widths,
  draw = 1,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {widths.map((w, i) => (
      <div
        key={i}
        style={{
          width: w * clamp01(draw * widths.length - i),
          height: 12,
          borderRadius: 6,
          backgroundColor: "#E4E0DA",
        }}
      />
    ))}
  </div>
);

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Small red round badge with an icon (check, alert…). */
const Badge: React.FC<{
  shown: number;
  icon: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ shown, icon, size = 58, style }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: red.base,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      scale: `${shown}`,
      ...style,
    }}
  >
    <Icon size={size * 0.58} color={paper.white} stroke={3}>
      {icon}
    </Icon>
  </div>
);

const alert = (
  <>
    <path d="M12 7v6" />
    <path d="M12 17h.01" />
  </>
);

/* ======================================================================== */
/* 1 — NewsHookGreen (00:00.000)                                            */
/* ======================================================================== */

const A = {
  news: sec(0),
  important: sec(0.4),
  days: sec(0.866),
  market: sec(1.8),
  all: sec(2.666),
  end: sec(2.933),
};
const A_OUT = A.end + 8;
export const NEWS_HOOK_GREEN_DURATION = A_OUT + 18;

export const NewsHookGreen: React.FC = () => {
  const frame = useCurrentFrame();
  const slides: Slide[] = [
    {
      at: A.news,
      parts: [
        { text: "في أخبار", at: A.news },
        { text: "مهمة", at: A.important, accent: true },
      ],
    },
    { at: A.days, parts: [{ text: "اليومين دول هتغيّر", at: A.days }] },
    {
      at: A.market,
      parts: [
        { text: "السوق العقاري", at: A.market },
        { text: "كله", at: A.all, accent: true },
      ],
    },
  ];
  const all = frame >= A.all;
  const shake = all
    ? Math.sin(frame * 2.2) * 5 * (1 - progress(frame, A.all + 2, A.all + 12))
    : 0;

  return (
    <GreenCard
      frame={frame}
      tabs={[{ at: 0, parts: [{ text: "عاجل", at: 0 }] }]}
      outFrom={A_OUT}
      outTo={NEWS_HOOK_GREEN_DURATION - 2}
    >
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        {/* Three news items stacking in. */}
        <Layer frame={frame} from={2} to={A.market}>
          <div
            dir="rtl"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 24,
              paddingTop: 30,
            }}
          >
            {[0, 1, 2].map((i) => {
              const shown = progress(frame, 4 + i * 6, 16 + i * 6);
              return (
                <div
                  key={i}
                  dir="rtl"
                  style={{
                    position: "relative",
                    width: 250,
                    height: 180,
                    borderRadius: 26,
                    backgroundColor: paper.white,
                    border: `2px solid ${border}`,
                    boxSizing: "border-box",
                    padding: "26px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    translate: `0px ${(1 - shown) * 40}px`,
                    clipPath: `inset(${(1 - shown) * 100}% -10px -10px -10px round 26px)`,
                  }}
                >
                  <Icon size={46} color={i === 0 ? red.base : ink.full}>
                    {paths.file}
                  </Icon>
                  <Lines
                    widths={[180, 140, 160]}
                    draw={progress(frame, 8 + i * 6, 30 + i * 6)}
                  />
                  {i === 0 ? (
                    <Badge
                      shown={progress(frame, A.important, A.important + 8)}
                      icon={alert}
                      size={52}
                      style={{ top: -8, left: -8 }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        </Layer>
        {/* The whole market, shaken. */}
        <Layer frame={frame} from={A.market}>
          <div
            dir="rtl"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 22,
              paddingTop: 34,
              translate: `${shake}px 0px`,
            }}
          >
            {[paths.building, paths.house, paths.building, paths.house].map(
              (icon, i) => (
                <Tile
                  key={i}
                  frame={frame}
                  at={A.market + i * 3}
                  icon={icon}
                  w={180}
                  h={170}
                  on={all}
                />
              ),
            )}
          </div>
        </Layer>
      </Strip>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.7 },
          { at: 4, name: "pop", volume: 0.6 },
          { at: 10, name: "pop", volume: 0.6 },
          { at: 16, name: "pop", volume: 0.6 },
          { at: A.important, name: "tick" },
          { at: A.days, name: "swipe", volume: 0.5 },
          { at: A.market, name: "swipe", volume: 0.5 },
          { at: A.all, name: "stamp", volume: 0.7 },
          { at: A_OUT, name: "whoosh", volume: 0.5 },
        ]}
      />
    </GreenCard>
  );
};

/* ======================================================================== */
/* 2 — DirectivesFull (00:02.933)                                           */
/* ======================================================================== */

const TB = 2.933;
const B = {
  directive: sec(0),
  follow: sec(4.733 - TB),
  late: sec(5.333 - TB),
  units: sec(6.733 - TB),
  moves: sec(7.066 - TB),
  organize: sec(8.0 - TB),
  end: sec(9.2 - TB),
};
export const DIRECTIVES_FULL_DURATION = B.end;

/** Floating paper card with the house's long soft shadow. */
const FloatCard: React.FC<{
  frame: number;
  at: number;
  phase: number;
  tilt?: number;
  width: number;
  height: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ frame, at, phase, tilt = 0, width, height, children, style }) => {
  const shown = progress(frame, at, at + 18);
  const { y, lift } = float(frame, phase);
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        opacity: shown,
        translate: `0px ${(1 - shown) * 70}px`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 44,
          backgroundColor: ink.full,
          opacity: 0.1 - lift * 0.03,
          filter: `blur(${32 + lift * 10}px)`,
          transform: `translate(${36 + lift * 8}px, ${56 + lift * 12}px) rotate(${tilt}deg)`,
        }}
      />
      <div
        dir="rtl"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 44,
          backgroundColor: paper.lift,
          boxShadow: shadow.contact,
          transform: `translateY(${y}px) rotate(${tilt}deg)`,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Title: React.FC<{
  frame: number;
  at: number;
  size?: number;
  color?: string;
  children: React.ReactNode;
}> = ({ frame, at, size = 96, color = ink.full, children }) => (
  <div
    dir="rtl"
    style={{
      fontFamily: font.arDisplay,
      fontSize: size,
      lineHeight: 1.2,
      color,
      textAlign: "center",
      ...rise(frame, at, 40),
    }}
  >
    {children}
  </div>
);

export const DirectivesFull: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(
    frame,
    [0, DIRECTIVES_FULL_DURATION],
    [1, 1.05],
    clamp,
  );
  // Delivery bar: stuck and flagged late, then moving once regulation starts.
  const stuck = progress(frame, B.late, B.late + 20, travel) * 0.55;
  const moving = progress(frame, B.organize, B.organize + 26, travel) * 0.45;
  const lateFlag = progress(frame, B.units, B.units + 8);
  const stamp = progress(frame, B.moves, B.moves + 8);

  return (
    <Paper>
      <AbsoluteFill
        style={{ scale: String(push), alignItems: "center", paddingTop: 400 }}
      >
        <Kicker frame={frame}>بعد توجيهات</Kicker>
        <div style={{ marginTop: 34 }}>
          <Title frame={frame} at={2} size={92}>
            الرئيس عبد الفتاح السيسي
          </Title>
        </div>

        <div style={{ marginTop: 90 }}>
          <FloatCard
            frame={frame}
            at={B.follow - 4}
            phase={0.4}
            tilt={-2}
            width={900}
            height={420}
          >
            <div style={{ padding: "54px 64px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <Icon size={70}>{paths.building}</Icon>
                <div
                  style={{
                    fontFamily: font.arDisplay,
                    fontSize: 60,
                    color: ink.full,
                    whiteSpace: "nowrap",
                  }}
                >
                  متابعة الشركات{" "}
                  <span style={{ color: red.base }}>المتأخرة</span>
                </div>
              </div>
              <div
                style={{
                  marginTop: 30,
                  fontFamily: font.arDisplay,
                  fontSize: 44,
                  color: ink.soft,
                  ...rise(frame, B.late, 24),
                }}
              >
                في تسليم الوحدات
              </div>
              {/* Delivery progress. */}
              <div
                style={{
                  position: "relative",
                  marginTop: 50,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: "#E4E0DA",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: `${(stuck + moving) * 100}%`,
                    borderRadius: 13,
                    backgroundColor: moving > 0.01 ? ink.full : red.base,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: -70,
                    height: 56,
                    padding: "0 22px",
                    borderRadius: 28,
                    backgroundColor: red.base,
                    color: paper.white,
                    fontFamily: font.arDisplay,
                    fontSize: 32,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    opacity:
                      lateFlag *
                      (1 - progress(frame, B.organize, B.organize + 8)),
                    scale: `${interpolate(lateFlag, [0, 1], [1.4, 1])}`,
                  }}
                >
                  <Icon size={30} color={paper.white} stroke={2.6}>
                    {paths.calendar}
                  </Icon>
                  متأخر
                </div>
              </div>
            </div>
          </FloatCard>
        </div>

        {/* Real moves to organise the market. */}
        <div
          dir="rtl"
          style={{
            marginTop: 100,
            display: "flex",
            alignItems: "center",
            gap: 26,
          }}
        >
          <div
            style={{
              height: 96,
              padding: "0 40px",
              borderRadius: 48,
              backgroundColor: red.base,
              color: paper.white,
              fontFamily: font.arDisplay,
              fontSize: 54,
              display: "flex",
              alignItems: "center",
              opacity: stamp,
              scale: `${interpolate(stamp, [0, 1], [1.5, 1])}`,
              rotate: "-3deg",
            }}
          >
            تحركات فعلية
          </div>
          <div
            style={{
              fontFamily: font.arDisplay,
              fontSize: 58,
              color: ink.full,
              ...rise(frame, B.organize, 24),
            }}
          >
            لتنظيم السوق
          </div>
        </div>
      </AbsoluteFill>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.6 },
          { at: B.follow - 4, name: "pop" },
          { at: B.units, name: "stamp", volume: 0.6 },
          { at: B.moves, name: "stamp", volume: 0.8 },
          { at: B.organize, name: "slide" },
        ]}
      />
    </Paper>
  );
};

/* ======================================================================== */
/* 3 — LawGreen (00:09.200)                                                 */
/* ======================================================================== */

const TC = 9.2;
const C = {
  ministry: sec(0),
  bill: sec(10.2 - TC),
  union: sec(11.4 - TC),
  realEstate: sec(12.7 - TC),
  criteria: sec(13.166 - TC),
  committed: sec(15.166 - TC),
  end: sec(15.6 - TC),
};
const C_OUT = C.end + 10;
export const LAW_GREEN_DURATION = C_OUT + 18;

export const LawGreen: React.FC = () => {
  const frame = useCurrentFrame();
  const slides: Slide[] = [
    {
      at: C.ministry,
      parts: [
        { text: "وزارة الإسكان بتجهّز", at: C.ministry },
        { text: "قانون", at: C.bill, accent: true },
      ],
    },
    {
      at: C.union,
      parts: [
        { text: "لاتحاد", at: C.union },
        { text: "المطورين العقاريين", at: C.realEstate - 20, accent: true },
      ],
    },
    {
      at: C.criteria,
      parts: [{ text: "بمعايير أوضح بتحدد", at: C.criteria }],
    },
    {
      at: C.committed - 22,
      parts: [
        { text: "المطور", at: C.committed - 22 },
        { text: "الملتزم", at: C.committed, accent: true },
      ],
    },
  ];
  const write = progress(frame, C.bill - 6, C.union - 4);
  const bracket = progress(frame, C.realEstate - 10, C.realEstate + 10, travel);
  const tick = (i: number) =>
    progress(frame, C.criteria + 8 + i * 10, C.criteria + 14 + i * 10);
  const pick = progress(frame, C.committed, C.committed + 10);

  return (
    <GreenCard
      frame={frame}
      tabs={[{ at: 0, parts: [{ text: "قانون جديد", at: 0 }] }]}
      outFrom={C_OUT}
      outTo={LAW_GREEN_DURATION - 2}
    >
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        {/* Ministry → a bill being drafted. */}
        <Layer frame={frame} from={4} to={C.union}>
          <div
            dir="rtl"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 30,
              paddingTop: 30,
            }}
          >
            <Tile
              frame={frame}
              at={6}
              icon={paths.landmark}
              label="الإسكان"
              w={220}
            />
            <svg width={90} height={40}>
              <path
                d="M84 20 H10 M26 6 L10 20 L26 34"
                fill="none"
                stroke={ink.full}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={progress(frame, C.bill - 10, C.bill)}
              />
            </svg>
            <div
              dir="rtl"
              style={{
                position: "relative",
                width: 360,
                height: 190,
                borderRadius: 26,
                backgroundColor: paper.white,
                border: `5px solid ${red.base}`,
                boxSizing: "border-box",
                padding: "24px 30px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                translate: `0px ${(1 - progress(frame, C.bill - 6, C.bill + 6)) * 40}px`,
                clipPath: `inset(${(1 - progress(frame, C.bill - 6, C.bill + 6)) * 100}% -10px -10px -10px round 26px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Icon size={42} color={red.base}>
                  {paths.file}
                </Icon>
                <span
                  style={{
                    fontFamily: font.arDisplay,
                    fontSize: 36,
                    color: red.base,
                    whiteSpace: "nowrap",
                  }}
                >
                  مشروع قانون
                </span>
              </div>
              <Lines widths={[280, 230, 250]} draw={write} />
            </div>
          </div>
        </Layer>

        {/* Developers joined into one union. */}
        <Layer frame={frame} from={C.union} to={C.criteria}>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              gap: 20,
              paddingTop: 70,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <Tile
                key={i}
                frame={frame}
                at={C.union + i * 3}
                icon={paths.building}
                w={170}
                h={150}
              />
            ))}
            {/* Red bracket over them. */}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: "50%",
                width: 740,
                marginLeft: -370,
                height: 34,
                borderTop: `6px solid ${red.base}`,
                borderLeft: `6px solid ${red.base}`,
                borderRight: `6px solid ${red.base}`,
                borderRadius: "18px 18px 0 0",
                clipPath: `inset(0 ${(1 - bracket) * 50}% 0 ${(1 - bracket) * 50}%)`,
              }}
            />
          </div>
        </Layer>

        {/* Clearer criteria → the committed developer. */}
        <Layer frame={frame} from={C.criteria}>
          <div
            dir="rtl"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 40,
              paddingTop: 24,
            }}
          >
            <div
              style={{
                width: 420,
                height: 200,
                borderRadius: 26,
                backgroundColor: paper.white,
                border: `2px solid ${border}`,
                boxSizing: "border-box",
                padding: "28px 34px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 18 }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      border: `3px solid ${tick(i) > 0.5 ? red.base : "#D9D5D0"}`,
                      backgroundColor: tick(i) > 0.5 ? red.base : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={26} color={paper.white} stroke={3.4}>
                      <g style={{ opacity: tick(i) }}>{paths.check}</g>
                    </Icon>
                  </div>
                  <div
                    style={{
                      width: [260, 210, 240][i],
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "#E4E0DA",
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{ position: "relative" }}>
              <Tile
                frame={frame}
                at={C.criteria + 6}
                icon={paths.building}
                label="مطور"
                w={220}
                h={190}
                on={pick > 0.5}
              />
              <Badge
                shown={pick}
                icon={paths.check}
                style={{ top: -14, left: -14 }}
              />
            </div>
          </div>
        </Layer>
      </Strip>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.7 },
          { at: 6, name: "pop", volume: 0.7 },
          { at: C.bill - 6, name: "pop" },
          { at: C.bill, name: "key", volume: 0.8 },
          { at: C.bill + 6, name: "key", volume: 0.8 },
          { at: C.union, name: "swipe", volume: 0.5 },
          { at: C.realEstate - 10, name: "slide" },
          { at: C.criteria, name: "swipe", volume: 0.5 },
          { at: C.criteria + 8, name: "tick" },
          { at: C.criteria + 18, name: "tick" },
          { at: C.criteria + 28, name: "tick" },
          { at: C.committed, name: "ding", volume: 0.7 },
          { at: C_OUT, name: "whoosh", volume: 0.5 },
        ]}
      />
    </GreenCard>
  );
};

/* ======================================================================== */
/* 4 — BankDataFull (00:15.600)                                             */
/* ======================================================================== */

const TD = 15.6;
const D = {
  bank: sec(0),
  data: sec(17.466 - TD),
  projects: sec(18.4 - TD),
  troubled: sec(19.3 - TD),
  irregular: sec(20.1 - TD),
  end: sec(21.233 - TD),
};
export const BANK_DATA_FULL_DURATION = D.end;

const ROWS = [
  { flag: null },
  { flag: "troubled" },
  { flag: null },
  { flag: "irregular" },
  { flag: null },
] as const;

export const BankDataFull: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(
    frame,
    [0, BANK_DATA_FULL_DURATION],
    [1, 1.05],
    clamp,
  );

  return (
    <Paper>
      <AbsoluteFill
        style={{ scale: String(push), alignItems: "center", paddingTop: 300 }}
      >
        <Kicker frame={frame}>القرار</Kicker>
        <div
          dir="rtl"
          style={{
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            gap: 28,
            ...rise(frame, 2, 40),
          }}
        >
          <Icon size={96}>{paths.landmark}</Icon>
          <div
            style={{
              fontFamily: font.arDisplay,
              fontSize: 96,
              color: ink.full,
            }}
          >
            البنك المركزي
          </div>
        </div>
        <Title frame={frame} at={16} size={66} color={ink.soft}>
          طلب من البنوك بيانات
        </Title>

        <div style={{ marginTop: 80 }}>
          <FloatCard
            frame={frame}
            at={D.data - 6}
            phase={1.1}
            tilt={1.5}
            width={900}
            height={720}
          >
            <div style={{ padding: "50px 60px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <Icon size={60}>{paths.coins}</Icon>
                <div
                  style={{
                    fontFamily: font.arDisplay,
                    fontSize: 56,
                    color: ink.full,
                    whiteSpace: "nowrap",
                  }}
                >
                  قروض المشروعات العقارية
                </div>
              </div>
              <div
                style={{
                  marginTop: 40,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                }}
              >
                {ROWS.map((r, i) => {
                  const shown = progress(
                    frame,
                    D.projects + i * 4,
                    D.projects + i * 4 + 10,
                  );
                  const flagAt =
                    r.flag === "troubled"
                      ? D.troubled
                      : r.flag === "irregular"
                        ? D.irregular
                        : 1e6;
                  const flag = progress(frame, flagAt, flagAt + 8);
                  const lit = flag > 0.5;
                  return (
                    <div
                      key={i}
                      style={{
                        height: 86,
                        borderRadius: 22,
                        backgroundColor: lit ? red.wash : paper.white,
                        border: `${lit ? 4 : 2}px solid ${lit ? red.base : border}`,
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        gap: 24,
                        padding: "0 28px",
                        opacity: shown,
                        translate: `${(1 - shown) * -40}px 0px`,
                      }}
                    >
                      <Icon size={44} color={lit ? red.base : ink.soft}>
                        {paths.building}
                      </Icon>
                      <div
                        style={{
                          width: [300, 250, 280, 230, 260][i],
                          height: 14,
                          borderRadius: 7,
                          backgroundColor: "#E4E0DA",
                        }}
                      />
                      <div style={{ flex: 1 }} />
                      {r.flag ? (
                        <div
                          style={{
                            height: 54,
                            padding: "0 20px",
                            borderRadius: 27,
                            backgroundColor: red.base,
                            color: paper.white,
                            fontFamily: font.arDisplay,
                            fontSize: 30,
                            display: "flex",
                            alignItems: "center",
                            whiteSpace: "nowrap",
                            opacity: flag,
                            scale: `${interpolate(flag, [0, 1], [1.4, 1])}`,
                          }}
                        >
                          {r.flag === "troubled"
                            ? "متعثرة"
                            : "مش منتظمة في السداد"}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </FloatCard>
        </div>
      </AbsoluteFill>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.6 },
          { at: D.data - 6, name: "pop" },
          ...[0, 1, 2, 3, 4].map((i) => ({
            at: D.projects + i * 4,
            name: "tick" as const,
            volume: 0.6,
          })),
          { at: D.troubled, name: "stamp", volume: 0.7 },
          { at: D.irregular, name: "stamp", volume: 0.7 },
        ]}
      />
    </Paper>
  );
};

/* ======================================================================== */
/* 5 — SortGreen (00:21.233)                                                */
/* ======================================================================== */

const TE = 21.233;
const E = {
  means: sec(0),
  witness: sec(22.7 - TE),
  sort: sec(23.4 - TE),
  market: sec(24.2 - TE),
  end: sec(24.6 - TE),
};
const E_OUT = E.end + 10;
export const SORT_GREEN_DURATION = E_OUT + 18;

/** Which developers fall through the sieve. */
const FALLS = [false, true, false, true, true, false];

export const SortGreen: React.FC = () => {
  const frame = useCurrentFrame();
  const slides: Slide[] = [
    {
      at: E.means,
      parts: [{ text: "وده معناه إن الفترة الجاية", at: E.means }],
    },
    {
      at: E.witness,
      parts: [
        { text: "ممكن تشهد", at: E.witness },
        { text: "فرز حقيقي", at: E.sort, accent: true },
      ],
    },
    {
      at: E.market,
      parts: [
        { text: "فرز حقيقي", at: E.market, accent: true },
        { text: "للسوق", at: E.market + 3 },
      ],
    },
  ];
  const sweep = progress(frame, E.sort - 4, E.sort + 14, travel);
  const drop = progress(frame, E.sort + 8, E.sort + 22, travel);

  return (
    <GreenCard
      frame={frame}
      tabs={[{ at: 0, parts: [{ text: "يعني إيه؟", at: 0 }] }]}
      outFrom={E_OUT}
      outTo={SORT_GREEN_DURATION - 2}
    >
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            gap: 16,
            paddingTop: 40,
          }}
        >
          {FALLS.map((falls, i) => {
            const out = falls ? drop : 0;
            const kept = !falls && drop > 0.6;
            return (
              <Tile
                key={i}
                frame={frame}
                at={4 + i * 3}
                icon={paths.building}
                w={124}
                h={150}
                on={kept}
                style={{
                  translate: `0px ${out * 260}px`,
                  rotate: `${out * (i % 2 ? 14 : -14)}deg`,
                }}
              />
            );
          })}
          {/* The sieve line sweeping across. */}
          <div
            style={{
              position: "absolute",
              top: 22,
              bottom: 22,
              right: `${sweep * 100}%`,
              width: 8,
              borderRadius: 4,
              backgroundColor: red.base,
              opacity: sweep > 0 && sweep < 1 ? 1 : 0,
            }}
          />
        </div>
      </Strip>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.7 },
          { at: 4, name: "pop", volume: 0.5 },
          { at: 10, name: "pop", volume: 0.5 },
          { at: 16, name: "pop", volume: 0.5 },
          { at: E.witness, name: "swipe", volume: 0.5 },
          { at: E.sort - 4, name: "whoosh", volume: 0.6 },
          { at: E.sort + 10, name: "strike" },
          { at: E.sort + 20, name: "chime", volume: 0.5 },
          { at: E_OUT, name: "whoosh", volume: 0.5 },
        ]}
      />
    </GreenCard>
  );
};

/* ======================================================================== */
/* 6 — AskFirstFull (00:24.600)                                             */
/* ======================================================================== */

const TF = 24.6;
const F = {
  before: sec(0),
  price: sec(25.4 - TF),
  askFirst: sec(26.366 - TF),
  who: sec(27.133 - TF),
  able: sec(27.8 - TF),
  deliver: sec(28.9 - TF),
  end: sec(29.933 - TF),
};
export const ASK_FIRST_FULL_DURATION = F.end + 40;

const Question: React.FC<{
  frame: number;
  at: number;
  n: string;
  icon: React.ReactNode;
  text: string;
  accent?: boolean;
  phase: number;
}> = ({ frame, at, n, icon, text, accent, phase }) => (
  <FloatCard frame={frame} at={at} phase={phase} width={900} height={200}>
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "0 50px",
        border: accent ? `6px solid ${red.base}` : undefined,
        borderRadius: 44,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          backgroundColor: accent ? red.base : ink.full,
          color: paper.white,
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <Icon size={62} color={accent ? red.base : ink.full}>
        {icon}
      </Icon>
      <div
        style={{
          fontFamily: font.arDisplay,
          fontSize: 58,
          color: ink.full,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  </FloatCard>
);

export const AskFirstFull: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(
    frame,
    [0, ASK_FIRST_FULL_DURATION],
    [1, 1.05],
    clamp,
  );
  const strike = progress(frame, F.askFirst, F.askFirst + 10);
  const shrink = progress(frame, F.askFirst + 4, F.askFirst + 20, travel);

  return (
    <Paper>
      <AbsoluteFill
        style={{ scale: String(push), alignItems: "center", paddingTop: 420 }}
      >
        <Kicker frame={frame}>قبل ما تشتري</Kicker>

        {/* The usual question, set aside. */}
        <div style={{ marginTop: 40, ...rise(frame, F.before, 40) }}>
          <div
            dir="rtl"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 24,
              scale: `${1 - shrink * 0.3}`,
            }}
          >
            <Icon size={90} color={ink.soft}>
              {paths.tag}
            </Icon>
            <div
              style={{
                fontFamily: font.arDisplay,
                fontSize: 90,
                color: ink.soft,
              }}
            >
              المتر بكام؟
            </div>
            <div
              style={{
                position: "absolute",
                left: -20,
                right: -20,
                top: "52%",
                height: 12,
                borderRadius: 6,
                backgroundColor: red.base,
                rotate: "-4deg",
                transformOrigin: "right center",
                scale: `${strike} 1`,
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 50 }}>
          <Title frame={frame} at={F.askFirst} size={100}>
            اسأل <span style={{ color: red.base }}>الأول</span>
          </Title>
        </div>

        <div
          style={{
            marginTop: 70,
            display: "flex",
            flexDirection: "column",
            gap: 50,
          }}
        >
          <Question
            frame={frame}
            at={F.who - 4}
            n="1"
            icon={paths.building}
            text="مين المطور؟"
            phase={0.3}
          />
          <Question
            frame={frame}
            at={F.able - 4}
            n="2"
            icon={paths.house}
            text="يقدر يكمّل ويسلّم؟"
            accent={frame >= F.deliver}
            phase={1.4}
          />
        </div>
      </AbsoluteFill>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.6 },
          { at: F.askFirst, name: "strike" },
          { at: F.askFirst + 4, name: "swipe", volume: 0.5 },
          { at: F.who - 4, name: "pop" },
          { at: F.able - 4, name: "pop" },
          { at: F.deliver, name: "chime", volume: 0.6 },
        ]}
      />
    </Paper>
  );
};

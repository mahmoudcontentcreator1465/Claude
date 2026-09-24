import { interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { type Slide } from "./lib/greenscreen";
import { GreenCard, Headline, Layer } from "./hajj/style";
import { Icon, paths } from "./lib/Icon";
import { float, progress, sec, travel } from "./lib/motion";
import { accent as brown, font, ink, paper, tan } from "./hajj/theme";

/**
 * Green-screen lower thirds for the Hajj & Umrah agency reel (Different).
 * Timed against the supplied SRT; each composition's frame 0 is noted, so
 * drop it on the timeline at that second. Keying rules live in
 * lib/greenscreen.tsx.
 */

/** Graphic strip inside the card. */
const G = { left: 56, top: 186, width: 848, height: 250 };

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

const Top: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 56, right: 56, top: 50 }}>
    {children}
  </div>
);

/** A white chip with an icon and a label, popping up from a baseline clip. */
const Chip: React.FC<{
  frame: number;
  at: number;
  icon: React.ReactNode;
  label: string;
  width?: number;
  accent?: boolean;
  style?: React.CSSProperties;
}> = ({ frame, at, icon, label, width = 250, accent, style }) => {
  const shown = progress(frame, at, at + 12);
  return (
    <div
      dir="rtl"
      style={{
        width,
        height: 170,
        borderRadius: 28,
        backgroundColor: paper.white,
        border: `${accent ? 5 : 2}px solid ${accent ? brown.base : "rgba(58,39,24,0.10)"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        translate: `0px ${(1 - shown) * 40}px`,
        clipPath: `inset(${(1 - shown) * 100}% -10px -10px -10px round 28px)`,
        ...style,
      }}
    >
      <Icon size={62} color={accent ? brown.base : ink.full}>
        {icon}
      </Icon>
      <div
        style={{
          fontFamily: font.arDisplay,
          fontSize: 40,
          color: accent ? brown.base : ink.full,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/** A brown strike that wipes across its parent. */
const Strike: React.FC<{ frame: number; at: number; top?: string }> = ({
  frame,
  at,
  top = "50%",
}) => (
  <div
    style={{
      position: "absolute",
      left: -10,
      right: -10,
      top,
      height: 10,
      borderRadius: 5,
      backgroundColor: brown.base,
      rotate: "-6deg",
      transformOrigin: "right center",
      scale: `${progress(frame, at, at + 10)} 1`,
    }}
  />
);

/* ======================================================================== */
/* 1 — "لو شركتك بتقدم برامج حج وعمرة، فانت مش بتبيع رحلة وبس، انت بتبيع ثقة" */
/*     Frame 0 = 00:00:00,000                                               */
/* ======================================================================== */

const H1 = {
  company: sec(0),
  hajj: sec(1.366),
  notTrip: sec(2.1),
  trust: sec(3.5),
  end: sec(4.433),
};
const H1_OUT = H1.end + 10;
export const HAJJ_HOOK_GREEN_DURATION = H1_OUT + 18;

export const HajjHookGreen: React.FC = () => {
  const frame = useCurrentFrame();
  const slides: Slide[] = [
    {
      at: H1.company,
      parts: [
        { text: "لو شركتك بتقدم برامج", at: H1.company },
        { text: "حج وعمرة", at: H1.hajj, accent: true },
      ],
    },
    {
      at: H1.notTrip,
      parts: [{ text: "انت مش بتبيع رحلة وبس", at: H1.notTrip }],
    },
    {
      at: H1.trust,
      parts: [
        { text: "انت بتبيع", at: H1.trust },
        { text: "ثقة", at: H1.trust + 4, accent: true },
      ],
    },
  ];
  const arrow = progress(frame, H1.trust - 6, H1.trust + 4);

  return (
    <GreenCard
      frame={frame}
      tabs={[{ at: 0, parts: [{ text: "حج وعمرة", at: 0 }] }]}
      outFrom={H1_OUT}
      outTo={HAJJ_HOOK_GREEN_DURATION - 2}
    >
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        {/* The program, as a ticket. */}
        <Layer frame={frame} from={4} to={H1.notTrip}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 30,
            }}
          >
            <Chip
              frame={frame}
              at={6}
              icon={paths.plane}
              label="برنامج"
              width={330}
            />
            <div style={{ width: 30 }} />
            <Chip
              frame={frame}
              at={H1.hajj}
              icon={paths.star}
              label="حج وعمرة"
              width={330}
              accent
            />
          </div>
        </Layer>
        {/* A trip, crossed out → trust. */}
        <Layer frame={frame} from={H1.notTrip}>
          <div
            dir="rtl"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "30px 20px 0",
            }}
          >
            <div style={{ position: "relative" }}>
              <Chip
                frame={frame}
                at={H1.notTrip + 2}
                icon={paths.plane}
                label="رحلة وبس"
                width={300}
              />
              <Strike frame={frame} at={H1.notTrip + 16} />
            </div>
            <svg width={140} height={60} style={{ opacity: arrow }}>
              <path
                d="M130 30 H14 M34 12 L12 30 L34 48"
                fill="none"
                stroke={ink.full}
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - arrow}
              />
            </svg>
            <Chip
              frame={frame}
              at={H1.trust + 2}
              icon={paths.shieldCheck}
              label="ثقة"
              width={300}
              accent
            />
          </div>
        </Layer>
      </Strip>
    </GreenCard>
  );
};

/* ======================================================================== */
/* 2 — "بس في الحج والعمرة بالذات، العميل محتاج يطمن"                         */
/*     Frame 0 = 00:00:10,866                                               */
/* ======================================================================== */

const T2 = 10.866;
const H2 = {
  specially: sec(0),
  reassure: sec(12.4 - T2),
  end: sec(13.633 - T2),
};
const H2_OUT = H2.end + 12;
export const HAJJ_REASSURE_GREEN_DURATION = H2_OUT + 18;

export const HajjReassureGreen: React.FC = () => {
  const frame = useCurrentFrame();
  const slides: Slide[] = [
    {
      at: H2.specially,
      parts: [{ text: "بس في الحج والعمرة بالذات", at: H2.specially }],
    },
    {
      at: H2.reassure,
      parts: [
        { text: "العميل محتاج", at: H2.reassure },
        { text: "يطمن", at: H2.reassure + 4, accent: true },
      ],
    },
  ];
  // RTL: anxious on the right, reassured on the left.
  const left = 150;
  const right = G.width - 150;
  const calm = progress(frame, H2.reassure, H2.reassure + 26, travel);
  const knob = interpolate(calm, [0, 1], [right, left]);
  const y = 110;
  const shield = progress(frame, H2.reassure + 20, H2.reassure + 32);

  return (
    <GreenCard
      frame={frame}
      tabs={[{ at: 0, parts: [{ text: "الأهم", at: 0 }] }]}
      outFrom={H2_OUT}
      outTo={HAJJ_REASSURE_GREEN_DURATION - 2}
    >
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        <Layer frame={frame} from={4}>
          <div
            style={{
              position: "absolute",
              left,
              width: right - left,
              top: y - 8,
              height: 16,
              borderRadius: 8,
              backgroundColor: tan.fillDeep,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: knob,
              width: right - knob,
              top: y - 8,
              height: 16,
              borderRadius: 8,
              backgroundColor: brown.base,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: knob,
              top: y,
              width: 60,
              height: 60,
              translate: "-50% -50%",
              borderRadius: "50%",
              backgroundColor: paper.white,
              border: `7px solid ${brown.base}`,
            }}
          />
          {/* End labels. */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: y + 50,
              width: 300,
              textAlign: "center",
              fontFamily: font.arDisplay,
              fontSize: 42,
              color: ink.soft,
            }}
          >
            قلقان
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: y + 50,
              width: 300,
              textAlign: "center",
              fontFamily: font.arDisplay,
              fontSize: 42,
              color: calm > 0.9 ? brown.base : ink.soft,
            }}
          >
            مطمن
          </div>
          <div
            style={{
              position: "absolute",
              left: 30,
              top: y - 60,
              opacity: shield,
              scale: String(interpolate(shield, [0, 1], [0.6, 1])),
            }}
          >
            <Icon size={100} color={brown.base} stroke={2.2}>
              {paths.shieldCheck}
            </Icon>
          </div>
        </Layer>
      </Strip>
    </GreenCard>
  );
};

/* ======================================================================== */
/* 3 — "وعشان كده، الإعلان عبارة عن صورة وسعر… مش كفاية"                      */
/*     Frame 0 = 00:00:20,333                                               */
/* ======================================================================== */

const T3 = 20.333;
const H3 = {
  so: sec(0),
  ad: sec(21.3 - T3),
  notEnough: sec(23.133 - T3),
  end: sec(23.5 - T3),
};
const H3_OUT = H3.end + 22;
export const HAJJ_AD_GREEN_DURATION = H3_OUT + 18;

export const HajjAdGreen: React.FC = () => {
  const frame = useCurrentFrame();
  const slides: Slide[] = [
    { at: H3.so, parts: [{ text: "وعشان كده", at: H3.so }] },
    {
      at: H3.ad,
      parts: [
        { text: "إعلان صورة وسعر", at: H3.ad },
        { text: "مش كفاية", at: H3.notEnough, accent: true },
      ],
    },
  ];
  const card = progress(frame, H3.ad - 4, H3.ad + 12);
  const stamp = progress(frame, H3.notEnough, H3.notEnough + 8);

  return (
    <GreenCard
      frame={frame}
      tabs={[{ at: 0, parts: [{ text: "الإعلان", at: 0 }] }]}
      outFrom={H3_OUT}
      outTo={HAJJ_AD_GREEN_DURATION - 2}
    >
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        {/* A generic ad: a photo and a price, nothing else. */}
        <div
          dir="rtl"
          style={{
            position: "absolute",
            left: 150,
            right: 150,
            top: 20,
            height: 200,
            borderRadius: 28,
            backgroundColor: paper.white,
            border: "2px solid rgba(58,39,24,0.10)",
            display: "flex",
            alignItems: "center",
            gap: 30,
            padding: "0 26px",
            translate: `0px ${(1 - card) * 60}px`,
            clipPath: `inset(${(1 - card) * 100}% -20px -20px -20px round 28px)`,
          }}
        >
          <div
            style={{
              width: 200,
              height: 150,
              borderRadius: 18,
              backgroundColor: tan.fill,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={80} color={ink.soft}>
              {paths.image}
            </Icon>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                fontFamily: font.arDisplay,
                fontSize: 44,
                color: ink.full,
              }}
            >
              برنامج عمرة
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                padding: "6px 22px 4px",
                borderRadius: 999,
                backgroundColor: ink.full,
                color: paper.white,
                fontFamily: font.arDisplay,
                fontSize: 36,
              }}
            >
              السعر
            </div>
          </div>
        </div>
        {/* "Not enough" — stamped over the ad. */}
        {frame >= H3.notEnough ? (
          <div
            dir="rtl"
            style={{
              position: "absolute",
              left: "50%",
              top: 120,
              translate: "-50% -50%",
              rotate: "-8deg",
              scale: String(interpolate(stamp, [0, 1], [1.8, 1])),
              opacity: stamp,
              padding: "14px 36px 8px",
              border: `8px solid ${brown.base}`,
              borderRadius: 20,
              backgroundColor: "rgba(241,230,211,0.94)",
              fontFamily: font.arDisplay,
              fontSize: 70,
              color: brown.base,
              whiteSpace: "nowrap",
            }}
          >
            مش كفاية
          </div>
        ) : null}
      </Strip>
    </GreenCard>
  );
};

/* ======================================================================== */
/* 4 — "وعشان كده في Different… نساعدك… عملاء كتير في مجال السياحة"          */
/*     Frame 0 = 00:00:23,500                                               */
/* ======================================================================== */

const T4 = 23.5;
const H4 = {
  brand: sec(0),
  help: sec(24.533 - T4),
  see: sec(25.466 - T4),
  convinced: sec(27.266 - T4),
  proof: sec(28.866 - T4),
  clients: sec(30.066 - T4),
  tourism: sec(31.4 - T4),
  end: sec(32.4 - T4),
};
const H4_OUT = H4.end + 8;
export const DIFFERENT_GREEN_DURATION = H4_OUT + 18;

export const DifferentGreen: React.FC = () => {
  const frame = useCurrentFrame();
  const slides: Slide[] = [
    {
      at: H4.brand,
      parts: [
        { text: "وعشان كده في", at: H4.brand },
        { text: "Different", at: H4.brand + 8, latin: true, accent: true },
      ],
    },
    { at: H4.help, parts: [{ text: "إحنا بنساعدك", at: H4.help }] },
    {
      at: H4.see,
      parts: [
        { text: "العميل يشوف", at: H4.see },
        { text: "مستوى الخدمة", at: H4.see + 12, accent: true },
      ],
    },
    {
      at: H4.convinced,
      parts: [{ text: "ويقتنع قبل ما يحجز", at: H4.convinced }],
    },
    { at: H4.proof, parts: [{ text: "وأكبر دليل على ده", at: H4.proof }] },
    {
      at: H4.clients,
      parts: [
        { text: "عملاء كتير في", at: H4.clients },
        { text: "السياحة", at: H4.tourism, accent: true },
      ],
    },
  ];
  const book = progress(frame, H4.convinced + 6, H4.convinced + 16);
  const { y } = float(frame);

  return (
    <GreenCard
      frame={frame}
      tabs={[
        { at: 0, parts: [{ text: "إحنا مين", at: 0 }] },
        { at: H4.see, parts: [{ text: "بنعمل إيه", at: H4.see }] },
        { at: H4.proof, parts: [{ text: "الدليل", at: H4.proof }] },
      ]}
      outFrom={H4_OUT}
      outTo={DIFFERENT_GREEN_DURATION - 2}
    >
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        {/* The name. */}
        <Layer frame={frame} from={4} to={H4.see}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "20px 60px",
                borderRadius: 32,
                backgroundColor: paper.white,
                border: "2px solid rgba(58,39,24,0.10)",
                rotate: "-3deg",
                translate: `0px ${y}px`,
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: 130,
                letterSpacing: "-0.05em",
                color: ink.full,
              }}
            >
              Different<span style={{ color: brown.base }}>.</span>
            </div>
          </div>
        </Layer>

        {/* The service, shown before booking — and the booking button. */}
        <Layer frame={frame} from={H4.see} to={H4.proof}>
          <div
            dir="rtl"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 36,
            }}
          >
            <Chip
              frame={frame}
              at={H4.see + 4}
              icon={paths.building}
              label="الفندق"
              width={200}
            />
            <Chip
              frame={frame}
              at={H4.see + 12}
              icon={paths.bus}
              label="المواصلات"
              width={200}
            />
            <Chip
              frame={frame}
              at={H4.see + 20}
              icon={paths.calendar}
              label="التنظيم"
              width={200}
            />
            <div
              style={{
                width: 190,
                height: 170,
                borderRadius: 28,
                backgroundColor: book > 0.5 ? brown.base : paper.white,
                border: `5px solid ${brown.base}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                scale: String(interpolate(book, [0, 0.5, 1], [1, 0.9, 1])),
                opacity: progress(frame, H4.convinced - 4, H4.convinced + 6),
              }}
            >
              <Icon
                size={60}
                color={book > 0.5 ? paper.white : brown.base}
                stroke={2.6}
              >
                {paths.check}
              </Icon>
              <div
                style={{
                  fontFamily: font.arDisplay,
                  fontSize: 42,
                  color: book > 0.5 ? paper.white : brown.base,
                }}
              >
                احجز
              </div>
            </div>
          </div>
        </Layer>

        {/* Proof: tourism clients. */}
        <Layer frame={frame} from={H4.proof}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 26,
              paddingTop: 50,
            }}
          >
            {[
              paths.plane,
              paths.building,
              paths.bus,
              paths.star,
              paths.pin,
            ].map((ic, i) => {
              const shown = progress(
                frame,
                H4.clients + i * 4,
                H4.clients + i * 4 + 12,
              );
              const lit = frame >= H4.tourism;
              return (
                <div
                  key={i}
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    backgroundColor: paper.white,
                    border: `${lit ? 5 : 2}px solid ${lit ? brown.base : "rgba(58,39,24,0.12)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    scale: String(shown),
                  }}
                >
                  <Icon size={64} color={lit ? brown.base : ink.full}>
                    {ic}
                  </Icon>
                </div>
              );
            })}
          </div>
        </Layer>
      </Strip>
    </GreenCard>
  );
};

/* ======================================================================== */
/* 5 — "لو بتقدم برنامج حج وعمرة… ابعتلنا رسالة دلوقتي وهنرد عليك"            */
/*     Frame 0 = 00:00:35,000                                               */
/* ======================================================================== */

const T5 = 35.0;
const H5 = {
  ifYou: sec(0),
  how: sec(36.7 - T5),
  message: sec(38.533 - T5),
  reply: sec(39.866 - T5),
  end: sec(41.4 - T5),
};
const H5_OUT = H5.end + 20;
export const HAJJ_CTA_GREEN_DURATION = H5_OUT + 18;

const Bubble: React.FC<{
  frame: number;
  at: number;
  side: "right" | "left";
  children: React.ReactNode;
  dark?: boolean;
}> = ({ frame, at, side, children, dark }) => {
  const shown = progress(frame, at, at + 10);
  return (
    <div
      dir="rtl"
      style={{
        alignSelf: side === "right" ? "flex-start" : "flex-end",
        maxWidth: 560,
        padding: "16px 28px 12px",
        borderRadius: 30,
        [side === "right" ? "borderTopRightRadius" : "borderTopLeftRadius"]: 8,
        backgroundColor: dark ? ink.full : paper.white,
        border: dark ? "none" : "2px solid rgba(58,39,24,0.10)",
        color: dark ? paper.white : ink.full,
        fontFamily: font.arDisplay,
        fontSize: 40,
        lineHeight: 1.3,
        scale: String(interpolate(shown, [0, 1], [0.7, 1])),
        opacity: shown,
        transformOrigin: side === "right" ? "right top" : "left top",
      }}
    >
      {children}
    </div>
  );
};

export const HajjCtaGreen: React.FC = () => {
  const frame = useCurrentFrame();
  const slides: Slide[] = [
    {
      at: H5.ifYou,
      parts: [{ text: "لو بتقدم برنامج حج وعمرة", at: H5.ifYou }],
    },
    { at: H5.how, parts: [{ text: "وعايز تعرف نساعدك إزاي", at: H5.how }] },
    {
      at: H5.message,
      parts: [
        { text: "ابعتلنا", at: H5.message },
        { text: "رسالة", at: H5.message + 4, accent: true },
        { text: "دلوقتي", at: H5.message + 10 },
      ],
    },
    {
      at: H5.reply,
      parts: [{ text: "وهنرد عليك بكل التفاصيل", at: H5.reply }],
    },
  ];
  // Typing dots before our reply lands.
  const typing = frame >= H5.reply && frame < H5.reply + 18;
  const dots = [0, 1, 2].map(
    (i) => 0.3 + 0.7 * Math.abs(Math.sin((frame + i * 5) / 5)),
  );

  return (
    <GreenCard
      frame={frame}
      tabs={[{ at: 0, parts: [{ text: "ابعتلنا", at: 0 }] }]}
      outFrom={H5_OUT}
      outTo={HAJJ_CTA_GREEN_DURATION - 2}
    >
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        {/* Before the message: a send button waiting. */}
        <Layer frame={frame} from={4} to={H5.message}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
            }}
          >
            <div
              dir="rtl"
              style={{
                width: 560,
                height: 96,
                borderRadius: 999,
                backgroundColor: paper.white,
                border: "2px solid rgba(58,39,24,0.10)",
                display: "flex",
                alignItems: "center",
                padding: "0 34px",
                fontFamily: font.arDisplay,
                fontSize: 38,
                color: ink.soft,
              }}
            >
              اكتب رسالتك
            </div>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                backgroundColor: brown.base,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={48} color={paper.white} stroke={2.4}>
                {paths.send}
              </Icon>
            </div>
          </div>
        </Layer>
        {/* The conversation. */}
        <Layer frame={frame} from={H5.message}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: "16px 10px 0",
            }}
          >
            <Bubble frame={frame} at={H5.message + 4} side="right">
              عندي برنامج حج وعمرة، ممكن تساعدوني؟
            </Bubble>
            {typing ? (
              <div
                style={{
                  alignSelf: "flex-end",
                  display: "flex",
                  gap: 10,
                  padding: "22px 28px",
                  borderRadius: 30,
                  backgroundColor: ink.full,
                }}
              >
                {dots.map((o, i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      backgroundColor: paper.white,
                      opacity: o,
                    }}
                  />
                ))}
              </div>
            ) : null}
            {frame >= H5.reply + 18 ? (
              <Bubble frame={frame} at={H5.reply + 18} side="left" dark>
                أكيد! دي كل التفاصيل
              </Bubble>
            ) : null}
          </div>
        </Layer>
      </Strip>
    </GreenCard>
  );
};

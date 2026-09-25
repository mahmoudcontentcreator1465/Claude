import { interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { Chip, Strip, Top } from "./HajjGreen";
import { type Slide } from "./lib/greenscreen";
import { GreenCard, Headline, Layer } from "./hajj/style";
import { SfxTrack } from "./hajj/sfx";
import { accent as brown, font, ink, paper, tan } from "./hajj/theme";
import { Icon, paths } from "./lib/Icon";
import { progress, sec, travel } from "./lib/motion";

/**
 * Green-screen lower third for the outbound-travel reel (Different), same
 * beige/brown look as the Hajj reel. Frame 0 = 00:00:00,000 of the SRT; it
 * runs through "نفس الرحلة، فنادق كلها قريبة من بعض" (10.266 s).
 */

const S = {
  company: sec(0),
  outbound: sec(0.966),
  sees: sec(1.833),
  program: sec(2.733),
  goes: sec(3.633),
  sameTrip: sec(4.333),
  other: sec(4.8),
  why: sec(5.9),
  because: sec(6.233),
  choices: sec(7.366),
  same: sec(8.133),
  hotels: sec(8.866),
  end: sec(10.266),
};
const OUT = S.end + 10;
export const TRAVEL_HOOK_GREEN_DURATION = OUT + 18;

const border = "rgba(58,39,24,0.10)";

/** Round avatar token for the client. */
const Client: React.FC<{ size?: number; style?: React.CSSProperties }> = ({
  size = 110,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: ink.full,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      ...style,
    }}
  >
    <Icon size={size * 0.5} color={paper.lift}>
      {paths.user}
    </Icon>
  </div>
);

/** A company's trip card: plane, "نفس الرحلة" line, and its name. */
const TripCard: React.FC<{
  frame: number;
  at: number;
  name: string;
  sameAt: number;
  booked?: number;
}> = ({ frame, at, name, sameAt, booked = 0 }) => {
  const shown = progress(frame, at, at + 12);
  const same = progress(frame, sameAt, sameAt + 10);
  const lit = booked > 0.5;
  return (
    <div
      dir="rtl"
      style={{
        position: "relative",
        width: 290,
        height: 190,
        borderRadius: 26,
        backgroundColor: paper.white,
        border: `${lit ? 5 : 2}px solid ${lit ? brown.base : border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        translate: `0px ${(1 - shown) * 40}px`,
        clipPath: `inset(${(1 - shown) * 100}% -10px -10px -10px round 26px)`,
      }}
    >
      <Icon size={52} color={lit ? brown.base : ink.full}>
        {paths.plane}
      </Icon>
      <div
        style={{
          fontFamily: font.arDisplay,
          fontSize: 38,
          color: lit ? brown.base : ink.full,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
      <div
        style={{
          height: 38,
          padding: "0 16px",
          borderRadius: 19,
          backgroundColor: tan.fill,
          display: "flex",
          alignItems: "center",
          fontFamily: font.arDisplay,
          fontSize: 26,
          color: ink.soft,
          clipPath: `inset(0 0 0 ${(1 - same) * 100}% round 19px)`,
        }}
      >
        نفس الرحلة
      </div>
      {/* Booked badge. */}
      <div
        style={{
          position: "absolute",
          top: -4,
          left: -4,
          width: 58,
          height: 58,
          borderRadius: "50%",
          backgroundColor: brown.base,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: `${booked}`,
        }}
      >
        <Icon size={34} color={paper.lift} stroke={3}>
          {paths.check}
        </Icon>
      </div>
    </div>
  );
};

/** One of the look-alike options: plane, hotel, price line. */
const Option: React.FC<{ frame: number; i: number }> = ({ frame, i }) => {
  const shown = progress(frame, S.choices + i * 3, S.choices + i * 3 + 12);
  const hotel = progress(frame, S.hotels + i * 2, S.hotels + i * 2 + 8);
  return (
    <div
      style={{
        width: 138,
        height: 200,
        borderRadius: 22,
        backgroundColor: paper.white,
        border: `2px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        flexShrink: 0,
        rotate: `${(i - 2) * 2.5 * (1 - progress(frame, S.same, S.same + 12))}deg`,
        translate: `0px ${(1 - shown) * 50}px`,
        clipPath: `inset(${(1 - shown) * 100}% -10px -10px -10px round 22px)`,
      }}
    >
      <Icon size={44}>{paths.plane}</Icon>
      <Icon
        size={44}
        color={hotel > 0.5 ? brown.base : ink.soft}
        stroke={hotel > 0.5 ? 2.4 : 2}
      >
        {paths.building}
      </Icon>
      <div
        style={{
          width: 80,
          height: 12,
          borderRadius: 6,
          backgroundColor: tan.fillDeep,
        }}
      />
    </div>
  );
};

export const TravelHookGreen: React.FC = () => {
  const frame = useCurrentFrame();

  const slides: Slide[] = [
    { at: S.company, parts: [{ text: "لو شركتك شغالة في", at: S.company }] },
    {
      at: S.outbound,
      parts: [{ text: "السياحة الخارجية", at: S.outbound, accent: true }],
    },
    { at: S.sees, parts: [{ text: "العميل ممكن يشوف", at: S.sees }] },
    {
      at: S.program,
      parts: [
        { text: "برنامج الرحلة", at: S.program, accent: true },
        { text: "عندك", at: S.program + 6 },
      ],
    },
    { at: S.goes, parts: [{ text: "العميل بيروح يحجز", at: S.goes }] },
    {
      at: S.sameTrip,
      parts: [{ text: "نفس الرحلة", at: S.sameTrip, accent: true }],
    },
    {
      at: S.other,
      parts: [
        { text: "بس في", at: S.other },
        { text: "شركة تانية", at: S.other + 3, accent: true },
      ],
    },
    {
      at: S.why,
      parts: [
        { text: "طب", at: S.why },
        { text: "ليه؟", at: S.why + 2, accent: true },
      ],
    },
    { at: S.because, parts: [{ text: "لأن العميل قدامه", at: S.because }] },
    {
      at: S.choices,
      parts: [{ text: "اختيارات كتير", at: S.choices, accent: true }],
    },
    {
      at: S.same,
      parts: [{ text: "نفس الرحلة", at: S.same }],
    },
    {
      at: S.hotels,
      parts: [
        { text: "فنادق", at: S.hotels, accent: true },
        { text: "قريبة من بعض", at: S.hotels + 5 },
      ],
    },
  ];

  const tabs: Slide[] = [
    { at: 0, parts: [{ text: "سياحة خارجية", at: 0 }] },
    { at: S.goes, parts: [{ text: "المشكلة", at: S.goes }] },
    { at: S.why, parts: [{ text: "ليه؟", at: S.why }] },
  ];

  // Scene 2: the client looks at your program.
  const look = progress(frame, S.program - 4, S.program + 12);
  // Scene 3: the client walks over to the other company.
  const walk = progress(frame, S.goes + 6, S.other + 4, travel);
  const booked = progress(frame, S.other + 4, S.other + 12);
  // Scene 4: the question mark.
  const q = progress(frame, S.why, S.why + 10);
  // Scene 5: the options squeeze together once the hotels line up.
  const squeeze = progress(frame, S.hotels + 6, S.hotels + 24, travel);
  const sameBar = progress(frame, S.same, S.same + 10);

  return (
    <GreenCard
      frame={frame}
      tabs={tabs}
      outFrom={OUT}
      outTo={TRAVEL_HOOK_GREEN_DURATION - 2}
    >
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        {/* 1 — your company, outbound travel. */}
        <Layer frame={frame} from={4} to={S.sees}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 30,
              paddingTop: 30,
            }}
          >
            <Chip
              frame={frame}
              at={6}
              icon={paths.building}
              label="شركتك"
              width={300}
            />
            <Chip
              frame={frame}
              at={S.outbound}
              icon={paths.plane}
              label="سياحة خارجية"
              width={380}
              accent
            />
          </div>
        </Layer>

        {/* 2 — the client sees your program. */}
        <Layer frame={frame} from={S.sees} to={S.goes}>
          <div
            dir="rtl"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              paddingTop: 30,
            }}
          >
            <Client size={130} />
            <svg width={120} height={40}>
              <path
                d="M110 20 H10"
                fill="none"
                stroke={tan.base}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray="4 14"
                pathLength={1}
                style={{ opacity: look }}
              />
              <path
                d="M24 6 L8 20 L24 34"
                fill="none"
                stroke={tan.base}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: look }}
              />
            </svg>
            <div
              dir="rtl"
              style={{
                width: 420,
                height: 190,
                borderRadius: 26,
                backgroundColor: paper.white,
                border: `5px solid ${brown.base}`,
                padding: "22px 28px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                translate: `0px ${(1 - look) * 40}px`,
                clipPath: `inset(${(1 - look) * 100}% -10px -10px -10px round 26px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Icon size={48} color={brown.base}>
                  {paths.plane}
                </Icon>
                <span
                  style={{
                    fontFamily: font.arDisplay,
                    fontSize: 38,
                    color: brown.base,
                    whiteSpace: "nowrap",
                  }}
                >
                  برنامج الرحلة
                </span>
              </div>
              {[300, 240, 180].map((w) => (
                <div
                  key={w}
                  style={{
                    width: w,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: tan.fill,
                  }}
                />
              ))}
            </div>
          </div>
        </Layer>

        {/* 3 — same trip, booked elsewhere. */}
        <Layer frame={frame} from={S.goes} to={S.why}>
          <div
            dir="rtl"
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              padding: "40px 10px 0",
            }}
          >
            <TripCard
              frame={frame}
              at={S.goes}
              name="شركتك"
              sameAt={S.sameTrip}
            />
            <TripCard
              frame={frame}
              at={S.goes + 4}
              name="شركة تانية"
              sameAt={S.sameTrip + 3}
              booked={booked}
            />
            {/* The client walks from yours (right) to theirs (left). */}
            <Client
              size={96}
              style={{
                position: "absolute",
                top: 86,
                left: 376,
                translate: `${interpolate(walk, [0, 1], [70, -70])}px ${-Math.sin(walk * Math.PI) * 30}px`,
                scale: `${progress(frame, S.goes + 2, S.goes + 12)}`,
              }}
            />
          </div>
        </Layer>

        {/* 4 — why? */}
        <Layer frame={frame} from={S.why} to={S.choices}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 30,
              paddingTop: 34,
            }}
          >
            <Client size={150} />
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                backgroundColor: brown.base,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: font.arDisplay,
                fontSize: 110,
                lineHeight: 1,
                color: paper.lift,
                scale: `${q}`,
                rotate: `${(1 - q) * -30}deg`,
              }}
            >
              ؟
            </div>
          </div>
        </Layer>

        {/* 5 — many options, same trip, hotels close together. */}
        <Layer frame={frame} from={S.choices}>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              gap: interpolate(squeeze, [0, 1], [26, 6]),
              paddingTop: 48,
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <Option key={i} frame={frame} i={i} />
            ))}
            {/* "Same trip" band across all of them. */}
            <div
              dir="rtl"
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                translate: "-50% 0px",
                height: 50,
                padding: "0 26px",
                borderRadius: 25,
                backgroundColor: ink.full,
                display: "flex",
                alignItems: "center",
                gap: 12,
                clipPath: `inset(0 ${(1 - sameBar) * 50}% 0 ${(1 - sameBar) * 50}% round 25px)`,
              }}
            >
              <Icon size={30} color={paper.lift}>
                {paths.plane}
              </Icon>
              <span
                style={{
                  fontFamily: font.arDisplay,
                  fontSize: 30,
                  color: paper.lift,
                  whiteSpace: "nowrap",
                }}
              >
                نفس الرحلة
              </span>
            </div>
          </div>
        </Layer>
      </Strip>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.8 },
          { at: 6, name: "pop" },
          { at: S.outbound, name: "swipe" },
          { at: S.outbound + 2, name: "pop" },
          { at: S.sees, name: "swipe" },
          { at: S.sees + 2, name: "pop", volume: 0.7 },
          { at: S.program - 4, name: "pop" },
          { at: S.goes, name: "swipe" },
          { at: S.goes + 2, name: "pop", volume: 0.7 },
          { at: S.goes + 6, name: "pop", volume: 0.7 },
          { at: S.sameTrip, name: "tick" },
          { at: S.sameTrip + 3, name: "tick" },
          { at: S.goes + 6, name: "whoosh", volume: 0.5 },
          { at: S.other + 4, name: "ding" },
          { at: S.why, name: "stamp", volume: 0.8 },
          { at: S.because, name: "swipe" },
          { at: S.choices, name: "swipe" },
          { at: S.choices, name: "pop", volume: 0.5 },
          { at: S.choices + 3, name: "pop", volume: 0.5 },
          { at: S.choices + 6, name: "pop", volume: 0.5 },
          { at: S.choices + 9, name: "pop", volume: 0.5 },
          { at: S.choices + 12, name: "pop", volume: 0.5 },
          { at: S.same, name: "swipe" },
          { at: S.hotels, name: "tick", volume: 0.6 },
          { at: S.hotels + 2, name: "tick", volume: 0.6 },
          { at: S.hotels + 4, name: "tick", volume: 0.6 },
          { at: S.hotels + 6, name: "slide" },
          { at: OUT, name: "whoosh", volume: 0.6 },
        ]}
      />
    </GreenCard>
  );
};

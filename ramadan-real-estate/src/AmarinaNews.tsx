import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { Dissolve } from "./lib/Dissolve";
import { Icon, paths } from "./lib/Icon";
import { clamp, float, progress, rise, sec } from "./lib/motion";
import { Paper } from "./lib/Paper";
import { font, ink, paper, red, shadow } from "./theme";

/**
 * Full-frame insert for the Amarina reel:
 *   "Amarina Group أعلنت دخول التطوير العقاري بخمسة مشاريع في البحر الأحمر
 *    والعاصمة الإدارية، والملفت إن المشاريع هتشتغل بنموذج Hotel-operated"
 *
 * Timed against SRT cues 7–14: frame 0 is 00:00:05,666 in the full video.
 */
const T0 = 5.666;
const at = (srt: number) => sec(srt - T0);

const CUE = {
  amarina: at(5.666),
  announced: at(6.6),
  development: at(7.766),
  five: at(8.5),
  redSea: at(9.866),
  capital: at(10.533),
  notable: at(11.3),
  hotelOperated: at(13.0),
  end: at(14.133),
};

const DISSOLVE = 8;
export const AMARINA_NEWS_DURATION = CUE.end + 24;

const Kicker: React.FC<{ frame: number; children: string }> = ({
  frame,
  children,
}) => (
  <div
    dir="rtl"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      ...rise(frame, 0, 16),
    }}
  >
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: red.base,
      }}
    />
    <span style={{ fontFamily: font.arDisplay, fontSize: 44, color: ink.soft }}>
      {children}
    </span>
  </div>
);

/* ------------------------------------------------------------------------ */
/* Beat 1 — "Amarina Group أعلنت دخولها مجال تطوير العقار"                    */
/* ------------------------------------------------------------------------ */

const AnnounceBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { y, lift } = float(frame);
  const c = (cue: number) => cue - CUE.amarina;

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
      <Kicker frame={frame}>خبر جديد</Kicker>

      {/* The name on a floating card. */}
      <div
        style={{ position: "relative", marginTop: 120, ...rise(frame, 4, 50) }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 44,
            backgroundColor: ink.full,
            opacity: 0.1 - lift * 0.03,
            filter: `blur(${34 + lift * 10}px)`,
            transform: `translate(${44 + lift * 8}px, ${70 + lift * 12}px) rotate(-6deg)`,
          }}
        />
        <div
          style={{
            position: "relative",
            width: 820,
            height: 420,
            borderRadius: 44,
            backgroundColor: paper.lift,
            boxShadow: shadow.contact,
            transform: `translateY(${y}px) rotate(-6deg)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: font.display,
              fontWeight: 800,
              fontSize: 150,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: ink.full,
            }}
          >
            Amarina
          </div>
          <div
            style={{
              fontFamily: font.serif,
              fontStyle: "italic",
              fontSize: 130,
              lineHeight: 1,
              color: ink.soft,
              ...rise(frame, 12),
            }}
          >
            Group
          </div>
        </div>
      </div>

      <div dir="rtl" style={{ marginTop: 170, textAlign: "center" }}>
        <div
          style={{
            fontFamily: font.arDisplay,
            fontSize: 64,
            color: ink.soft,
            lineHeight: 1.3,
            ...rise(frame, c(CUE.announced)),
          }}
        >
          أعلنت دخولها مجال
        </div>
        <div
          style={{
            fontFamily: font.arDisplay,
            fontSize: 118,
            color: red.base,
            lineHeight: 1.3,
            ...rise(frame, c(CUE.development), 34),
          }}
        >
          التطوير العقاري
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* Beat 2 — "وده بخمس مشاريع في البحر الأحمر والعاصمة الإدارية"             */
/* ------------------------------------------------------------------------ */

const TOWERS = [
  { h: 300, w: 120 },
  { h: 420, w: 140 },
  { h: 520, w: 150 },
  { h: 380, w: 130 },
  { h: 280, w: 120 },
];

const Tower: React.FC<{
  frame: number;
  i: number;
  h: number;
  w: number;
}> = ({ frame, i, h, w }) => {
  const grow = progress(frame, 6 + i * 4, 30 + i * 4);
  const rows = Math.floor((h - 50) / 58);

  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        clipPath: `inset(${(1 - grow) * 100}% -30px 0 -30px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "10px 10px 0 0",
          background: `linear-gradient(100deg, ${paper.white} 0%, ${paper.lift} 55%, #E7E3DE 100%)`,
          boxShadow: shadow.card,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridAutoRows: 40,
          gap: 18,
          padding: "26px 22px 0",
        }}
      >
        {Array.from({ length: rows * 2 }).map((_, k) => (
          <div
            key={k}
            style={{ borderRadius: 5, backgroundColor: "rgba(20,16,15,0.09)" }}
          />
        ))}
      </div>
    </div>
  );
};

const PlaceCard: React.FC<{
  frame: number;
  start: number;
  label: string;
  icon: React.ReactNode;
  tilt: number;
}> = ({ frame, start, label, icon, tilt }) => {
  const shown = progress(frame, start, start + 18);
  const pin = progress(frame, start + 10, start + 22);

  return (
    <div
      dir="rtl"
      style={{
        position: "relative",
        width: 440,
        height: 210,
        borderRadius: 34,
        backgroundColor: paper.lift,
        boxShadow: shadow.float,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity: shown,
        translate: `0px ${(1 - shown) * 60}px`,
        rotate: `${tilt}deg`,
      }}
    >
      {/* Red map pin dropping onto the card — the accent lands last. */}
      <div
        style={{
          position: "absolute",
          top: -96,
          left: "50%",
          translate: `-50% ${(1 - pin) * -40}px`,
          opacity: pin,
        }}
      >
        <Icon size={84} color={red.base} stroke={2.4}>
          {paths.pin}
        </Icon>
      </div>
      {icon}
      <div
        style={{ fontFamily: font.arDisplay, fontSize: 60, color: ink.full }}
      >
        {label}
      </div>
    </div>
  );
};

const ProjectsBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (cue: number) => cue - CUE.five;

  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <div
        dir="rtl"
        style={{
          marginTop: 250,
          display: "flex",
          alignItems: "baseline",
          gap: 28,
          ...rise(frame, 0),
        }}
      >
        <span
          style={{ fontFamily: font.arDisplay, fontSize: 110, color: ink.full }}
        >
          بـ
        </span>
        <span
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 220,
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            color: red.base,
          }}
        >
          5
        </span>
        <span
          style={{ fontFamily: font.arDisplay, fontSize: 110, color: ink.full }}
        >
          مشاريع
        </span>
      </div>

      {/* Five towers rising on a ground line. */}
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 620,
          height: 540,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        {TOWERS.map((t, i) => (
          <Tower key={i} frame={frame} i={i} h={t.h} w={t.w} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1160,
          height: 4,
          borderRadius: 2,
          backgroundColor: ink.faint,
          scale: `${progress(frame, 0, 20)} 1`,
        }}
      />

      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: 1330,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 60,
        }}
      >
        <PlaceCard
          frame={frame}
          start={c(CUE.redSea)}
          label="البحر الأحمر"
          icon={<Icon size={70}>{paths.waves}</Icon>}
          tilt={-3}
        />
        <PlaceCard
          frame={frame}
          start={c(CUE.capital)}
          label="العاصمة الإدارية"
          icon={<Icon size={70}>{paths.landmark}</Icon>}
          tilt={3}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* Beat 3 — "والملفت إن المشاريع هتشتغل بسيستم Hotel-Operated"               */
/* ------------------------------------------------------------------------ */

/** A matte concierge bell, drawn flat, floating on a long soft shadow. */
const Bell: React.FC<{ frame: number; start: number }> = ({ frame, start }) => {
  const { y, lift } = float(frame, 20);
  const shown = progress(frame, start, start + 20);
  // A small ring: the bell dips once as it lands.
  const ding = interpolate(
    frame,
    [start + 14, start + 20, start + 28],
    [0, 10, 0],
    clamp,
  );

  return (
    <div
      style={{
        position: "relative",
        width: 360,
        height: 300,
        opacity: shown,
        translate: `0px ${(1 - shown) * 80}px`,
      }}
    >
      {/* Cast shadow, lower-right, softening as the bell rises. */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: -80,
          bottom: -34,
          height: 70,
          borderRadius: "50%",
          backgroundColor: ink.full,
          opacity: 0.12 - lift * 0.04,
          filter: `blur(${22 + lift * 8}px)`,
        }}
      />
      <svg
        width={360}
        height={300}
        viewBox="0 0 360 300"
        style={{
          position: "absolute",
          inset: 0,
          translate: `0px ${y + ding}px`,
          rotate: "-8deg",
        }}
      >
        <defs>
          <linearGradient id="dome" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.6" stopColor="#F1EEEA" />
            <stop offset="1" stopColor="#D9D4CE" />
          </linearGradient>
        </defs>
        {/* Button. */}
        <rect x="165" y="40" width="30" height="40" rx="8" fill={ink.full} />
        <rect x="150" y="30" width="60" height="18" rx="9" fill={red.base} />
        {/* Dome. */}
        <path
          d="M40 230 A140 140 0 0 1 320 230 Z"
          fill="url(#dome)"
          stroke="rgba(20,16,15,0.18)"
          strokeWidth={3}
        />
        {/* Base. */}
        <rect x="20" y="226" width="320" height="44" rx="14" fill={ink.full} />
      </svg>
    </div>
  );
};

const HotelBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (cue: number) => cue - CUE.notable;
  const hotelAt = c(CUE.hotelOperated);

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
      <Kicker frame={frame}>والملفت</Kicker>

      <div
        dir="rtl"
        style={{
          marginTop: 60,
          fontFamily: font.arDisplay,
          fontSize: 84,
          color: ink.soft,
          lineHeight: 1.3,
          ...rise(frame, 4),
        }}
      >
        المشاريع هتشتغل بنظام
      </div>

      <div style={{ marginTop: 50, textAlign: "center" }}>
        <div
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 200,
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
            color: ink.full,
            ...rise(frame, hotelAt, 40),
          }}
        >
          Hotel-
        </div>
        {/* The signature move: the one word that matters, italic serif, in red. */}
        <div
          style={{
            fontFamily: font.serif,
            fontStyle: "italic",
            fontSize: 240,
            lineHeight: 1,
            color: red.base,
            ...rise(frame, hotelAt + 6, 40),
          }}
        >
          operated
        </div>
      </div>

      <div style={{ marginTop: 110 }}>
        <Bell frame={frame} start={hotelAt + 10} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */

const BEATS = [
  { from: CUE.amarina, to: CUE.five, name: "Announce", C: AnnounceBeat },
  { from: CUE.five, to: CUE.notable, name: "Projects", C: ProjectsBeat },
  { from: CUE.notable, to: AMARINA_NEWS_DURATION, name: "Hotel", C: HotelBeat },
];

export const AmarinaNews: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [0, AMARINA_NEWS_DURATION], [1, 1.06], clamp);

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

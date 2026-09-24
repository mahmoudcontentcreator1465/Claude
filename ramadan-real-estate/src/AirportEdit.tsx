import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "./fonts";
import { Icon } from "./lib/Icon";
import { clamp, ease, float, progress } from "./lib/motion";
import { Paper } from "./lib/Paper";
import { font, ink, paper, red, shadow } from "./theme";

/**
 * Full edit of the airport testimonial (IMG_9277): guests from the US on
 * their driver, Bando.
 *
 * Source: public/airport/master.mp4 — the enhanced master (1080×1920, 30fps,
 * denoised, sharpened, graded, loudness-normalised to -14 LUFS). It stays
 * local; rebuild it with the ffmpeg command in HANDOFF.md.
 *
 * All times below are in source seconds from the supplied SRT.
 */
const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/** The kept parts of the take. Cut: the pre-roll, "um you know", "and yeah it's just so". */
const SEGMENTS = [
  { from: 8.8, to: 13.633, zoom: [1.0, 1.05] },
  { from: 14.366, to: 31.666, zoom: [1.12, 1.18] },
  { from: 33.3, to: 37.433, zoom: [1.04, 1.1] },
] as const;

/** Output start (frames) of each segment. */
const SEG_START = SEGMENTS.reduce<number[]>((acc, s, i) => {
  const prev =
    i === 0 ? 0 : acc[i - 1] + f(SEGMENTS[i - 1].to - SEGMENTS[i - 1].from);
  return [...acc, prev];
}, []);
const FOOTAGE_END =
  SEG_START[SEGMENTS.length - 1] +
  f(SEGMENTS[SEGMENTS.length - 1].to - SEGMENTS[SEGMENTS.length - 1].from);

const END_CARD = 75;
export const AIRPORT_EDIT_DURATION = FOOTAGE_END + END_CARD;

/** Maps a source time (seconds) to an output frame. */
const out = (src: number) => {
  for (let i = 0; i < SEGMENTS.length; i++) {
    const s = SEGMENTS[i];
    if (src >= s.from && src <= s.to) return SEG_START[i] + f(src - s.from);
  }
  // Inside a cut: snap to the start of the next kept segment.
  const next = SEGMENTS.findIndex((s) => s.from > src);
  return next === -1 ? FOOTAGE_END : SEG_START[next];
};

/* ------------------------------------------------------------------------ */
/* Footage                                                                  */
/* ------------------------------------------------------------------------ */

/** Short punch-ins on the lines that matter, on top of each segment's push. */
const PUNCHES = [
  { at: 10.2, amount: 0.07 }, // "Bando is an amazing driver"
  { at: 22.233, amount: 0.05 }, // "keep us safe"
  { at: 34.5, amount: 0.06 }, // "we had so much fun"
];

const Footage: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: ink.full }}>
      {SEGMENTS.map((s, i) => {
        const start = SEG_START[i];
        const len = f(s.to - s.from);
        const local = frame - start;
        // Alternating base zoom hides each jump cut; a slow push keeps it alive.
        const base = interpolate(
          local,
          [0, len],
          [s.zoom[0], s.zoom[1]],
          clamp,
        );
        const punch = PUNCHES.reduce((acc, p) => {
          const pf = out(p.at);
          if (pf < start || pf >= start + len) return acc;
          return (
            acc +
            interpolate(
              frame,
              [pf - 2, pf + 6, pf + 40, pf + 60],
              [0, p.amount, p.amount, 0],
              {
                ...clamp,
                easing: ease,
              },
            )
          );
        }, 0);

        return (
          <Sequence
            key={i}
            from={start}
            durationInFrames={len}
            name={`Take ${i + 1}`}
          >
            <AbsoluteFill
              style={{
                scale: String(base + punch),
                transformOrigin: "55% 38%",
              }}
            >
              <OffthreadVideo
                src={staticFile("airport/master.mp4")}
                trimBefore={f(s.from)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </AbsoluteFill>
          </Sequence>
        );
      })}
      {/* Soft top and bottom falloff so the graphics sit on calm ground. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,16,15,0.28) 0%, rgba(20,16,15,0) 22%, rgba(20,16,15,0) 62%, rgba(20,16,15,0.38) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* Captions — English as spoken, Arabic underneath                          */
/* ------------------------------------------------------------------------ */

type Cue = { from: number; to: number; en: string; ar: string; key?: string };

const CUES: Cue[] = [
  { from: 8.8, to: 10.2, en: "We're from the US", ar: "إحنا من أمريكا" },
  {
    from: 10.2,
    to: 11.833,
    en: "Bando is an amazing driver",
    ar: "باندو سواق رائع",
    key: "amazing",
  },
  {
    from: 11.833,
    to: 13.633,
    en: "We're very fortunate to have him",
    ar: "إحنا محظوظين جدًا بيه",
    key: "fortunate",
  },
  {
    from: 14.366,
    to: 16.233,
    en: "Anywhere you go, the culture is different",
    ar: "في أي مكان تروحه الثقافة بتختلف",
    key: "culture",
  },
  {
    from: 16.233,
    to: 18.066,
    en: "Food, driving especially",
    ar: "الأكل، والسواقة بالذات",
    key: "driving",
  },
  {
    from: 18.266,
    to: 20.2,
    en: "It was exceptional to have someone",
    ar: "كان شيء استثنائي إن يبقى معانا حد",
    key: "exceptional",
  },
  { from: 20.2, to: 22.233, en: "who knows what to do", ar: "عارف يعمل إيه" },
  {
    from: 22.233,
    to: 24.5,
    en: "and knows how to keep us safe",
    ar: "وعارف يحافظ على أماننا",
    key: "safe",
  },
  {
    from: 24.5,
    to: 26.7,
    en: "and not sick in the car",
    ar: "ومن غير ما نتعب في العربية",
  },
  {
    from: 26.7,
    to: 28.8,
    en: "and knows where to go",
    ar: "وعارف يروح فين",
    key: "where",
  },
  {
    from: 28.9,
    to: 31.666,
    en: "very comfortable stopping at different spots",
    ar: "ومرتاح يقف في أماكن مختلفة",
    key: "comfortable",
  },
  {
    from: 33.3,
    to: 34.5,
    en: "So fortunate to have him",
    ar: "محظوظين جدًا بيه",
    key: "fortunate",
  },
  {
    from: 34.5,
    to: 35.866,
    en: "We had so much fun here",
    ar: "واتبسطنا جدًا هنا",
    key: "fun",
  },
  {
    from: 35.866,
    to: 37.433,
    en: "Thank you, thank you!",
    ar: "شكرًا، شكرًا!",
  },
];

const CaptionLine: React.FC<{ cue: Cue }> = ({ cue }) => {
  const frame = useCurrentFrame();
  const len = out(cue.to) - out(cue.from);
  const words = cue.en.split(" ");
  const step = Math.max(2, Math.floor((len * 0.7) / words.length));
  const pop = progress(frame, 0, 6);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 330,
      }}
    >
      <div
        style={{
          maxWidth: 940,
          padding: "22px 34px 20px",
          borderRadius: 30,
          backgroundColor: "rgba(245,243,240,0.96)",
          boxShadow: shadow.card,
          textAlign: "center",
          scale: String(interpolate(pop, [0, 1], [0.94, 1])),
          opacity: pop,
        }}
      >
        <div
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 60,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            color: ink.full,
          }}
        >
          {words.map((w, i) => {
            const on = frame >= i * step;
            const isKey = cue.key && w.toLowerCase().startsWith(cue.key);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginInline: "0.14em",
                  color: isKey ? red.base : ink.full,
                  opacity: on ? 1 : 0.18,
                  translate: `0px ${on ? 0 : 6}px`,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div
          dir="rtl"
          style={{
            marginTop: 8,
            fontFamily: font.arDisplay,
            fontSize: 40,
            lineHeight: 1.3,
            color: ink.soft,
          }}
        >
          {cue.ar}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Captions: React.FC = () => (
  <>
    {CUES.map((c) => (
      <Sequence
        key={c.from}
        from={out(c.from)}
        durationInFrames={Math.max(1, out(c.to) - out(c.from))}
        name={`Cap ${c.en.slice(0, 18)}`}
        layout="none"
      >
        <CaptionLine cue={c} />
      </Sequence>
    ))}
  </>
);

/* ------------------------------------------------------------------------ */
/* Graphics                                                                 */
/* ------------------------------------------------------------------------ */

const utensils = (
  <>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </>
);
const car = (
  <>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </>
);
const shield = (
  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
);
const check = <path d="M20 6 9 17l-5-5" />;

/** A paper pill that pops in at `start` and drops out at `end`. */
const Pill: React.FC<{
  start: number;
  end: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, end, children, style }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) return null;
  const inT = progress(frame, start, start + 10);
  const outT = progress(frame, end - 8, end);

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 28px",
        borderRadius: 999,
        backgroundColor: paper.base,
        boxShadow: shadow.float,
        opacity: inT * (1 - outT),
        scale: String(interpolate(inT, [0, 1], [0.7, 1]) - outT * 0.1),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Beat 1 — the hook: the headline quote, with the mixed sans / serif move. */
const HookTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const start = out(10.2);
  const end = out(13.633) - 4;
  if (frame > end + 10) return null;
  const inT = progress(frame, 2, 14);
  const word = progress(frame, start, start + 10);
  const outT = progress(frame, end, end + 10);

  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: 70,
        right: 70,
        padding: "34px 40px 30px",
        borderRadius: 40,
        backgroundColor: paper.base,
        boxShadow: shadow.float,
        rotate: "-2deg",
        opacity: inT * (1 - outT),
        translate: `0px ${(1 - inT) * -40 - outT * 30}px`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: "0.18em",
          color: ink.soft,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: red.base,
          }}
        />
        GUESTS FROM THE US
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 92,
          letterSpacing: "-0.035em",
          lineHeight: 1,
          color: ink.full,
        }}
      >
        “An{" "}
        <span
          style={{
            fontFamily: font.serif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 112,
            letterSpacing: 0,
            color: red.base,
            opacity: word,
          }}
        >
          amazing
        </span>{" "}
        driver”
      </div>
    </div>
  );
};

/** Name tag for Bando, low on the frame, while he is introduced. */
const NameTag: React.FC = () => (
  <Pill start={out(10.2)} end={out(13.633)} style={{ right: 70, bottom: 620 }}>
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: red.base,
      }}
    />
    <span
      style={{
        fontFamily: font.display,
        fontWeight: 800,
        fontSize: 44,
        color: ink.full,
      }}
    >
      Bando
    </span>
    <span
      style={{
        fontFamily: font.serif,
        fontStyle: "italic",
        fontSize: 44,
        color: ink.soft,
      }}
    >
      the driver
    </span>
  </Pill>
);

const QUALITIES = [
  { at: 20.2, label: "Knows what to do", icon: check },
  { at: 22.233, label: "Keeps you safe", icon: shield },
  { at: 24.5, label: "Smooth ride", icon: car },
];

/** Beat 3 — what made him great, ticked off as she says it. */
const Checklist: React.FC = () => {
  const frame = useCurrentFrame();
  const start = out(18.266);
  // Ends where the map cutaway takes over.
  const end = out(26.7) - 10;
  if (frame < start || frame > end + 10) return null;
  const inT = progress(frame, start, start + 12);
  const outT = progress(frame, end, end + 10);
  const { y } = float(frame);

  return (
    <div
      style={{
        position: "absolute",
        top: 160,
        left: 60,
        width: 600,
        padding: "28px 30px",
        borderRadius: 36,
        backgroundColor: paper.base,
        boxShadow: shadow.float,
        rotate: "-2deg",
        opacity: inT * (1 - outT),
        translate: `${(1 - inT) * -60}px ${y}px`,
      }}
    >
      <div
        style={{
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: "0.16em",
          color: ink.soft,
          marginBottom: 14,
        }}
      >
        WHY BANDO
      </div>
      {QUALITIES.map((q) => {
        const on = progress(frame, out(q.at), out(q.at) + 12);
        return (
          <div
            key={q.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "10px 0",
              opacity: 0.25 + on * 0.75,
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                flexShrink: 0,
                borderRadius: 14,
                backgroundColor: on > 0.5 ? red.base : "transparent",
                border: `4px solid ${on > 0.5 ? red.base : ink.faint}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={34} color={paper.white} stroke={3}>
                {check}
              </Icon>
            </div>
            <span
              style={{
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: 44,
                color: ink.full,
                letterSpacing: "-0.02em",
              }}
            >
              {q.label}
            </span>
            <div style={{ marginLeft: "auto", opacity: 0.6 }}>
              <Icon size={40}>{q.icon}</Icon>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Beat 4 — "so much fun", a tilted sticker. */
const FunSticker: React.FC = () => {
  const frame = useCurrentFrame();
  const start = out(34.5);
  const end = FOOTAGE_END;
  if (frame < start) return null;
  const inT = progress(frame, start, start + 10);
  const outT = progress(frame, end - 8, end);

  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity: 1 - outT,
      }}
    >
      <div
        style={{
          padding: "26px 50px 30px",
          borderRadius: 40,
          backgroundColor: paper.base,
          boxShadow: shadow.float,
          rotate: `${interpolate(inT, [0, 1], [-14, -5])}deg`,
          scale: String(interpolate(inT, [0, 1], [1.5, 1])),
          opacity: inT,
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: "-0.035em",
          color: ink.full,
          whiteSpace: "nowrap",
        }}
      >
        So much{" "}
        <span
          style={{
            fontFamily: font.serif,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 124,
            letterSpacing: 0,
            color: red.base,
          }}
        >
          fun
        </span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------ */
/* Full-frame cutaways — the house paper, voice carries on underneath       */
/* ------------------------------------------------------------------------ */

/** Wipes a full-frame cutaway in from the bottom and out to the top. */
const Cutaway: React.FC<{
  from: number;
  to: number;
  name: string;
  children: React.ReactNode;
}> = ({ from, to, name, children }) => (
  <Sequence from={from} durationInFrames={to - from} name={name}>
    <CutawayWipe len={to - from}>{children}</CutawayWipe>
  </Sequence>
);

const CutawayWipe: React.FC<{ len: number; children: React.ReactNode }> = ({
  len,
  children,
}) => {
  const frame = useCurrentFrame();
  const inT = progress(frame, 0, 9);
  const outT = progress(frame, len - 9, len);
  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(${outT * 100}% 0 ${(1 - inT) * 100}% 0 round ${40 * (1 - inT) + 40 * outT}px)`,
      }}
    >
      <Paper>{children}</Paper>
    </AbsoluteFill>
  );
};

const CutKicker: React.FC<{ children: string }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontFamily: font.display,
        fontWeight: 800,
        fontSize: 32,
        letterSpacing: "0.18em",
        color: ink.soft,
        opacity: progress(frame, 4, 14),
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: red.base,
        }}
      />
      {children}
    </div>
  );
};

/** A matte card floating on a long soft shadow, holding an icon and a word. */
const FloatCard: React.FC<{
  at: number;
  icon: React.ReactNode;
  label: string;
  tilt: number;
  accent?: boolean;
  phase: number;
}> = ({ at, icon, label, tilt, accent, phase }) => {
  const frame = useCurrentFrame();
  const shown = progress(frame, at, at + 14);
  const { y, lift } = float(frame, phase);

  return (
    <div
      style={{
        position: "relative",
        width: 380,
        height: 400,
        opacity: shown,
        translate: `0px ${(1 - shown) * 80}px`,
        scale: String(interpolate(shown, [0, 1], [0.9, 1])),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 44,
          backgroundColor: ink.full,
          opacity: 0.11 - lift * 0.03,
          filter: `blur(${30 + lift * 10}px)`,
          transform: `translate(${36 + lift * 8}px, ${60 + lift * 12}px) rotate(${tilt}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 44,
          backgroundColor: paper.lift,
          boxShadow: shadow.contact,
          transform: `translateY(${y}px) rotate(${tilt}deg)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
        }}
      >
        <Icon size={150} color={accent ? red.base : ink.full} stroke={1.6}>
          {icon}
        </Icon>
        <div
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 70,
            letterSpacing: "-0.03em",
            color: accent ? red.base : ink.full,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

/** Cutaway 1 — "Anywhere you go, the culture is different: food, driving especially". */
const CultureInsert: React.FC = () => {
  const from = out(14.366);
  const to = out(18.066) + 6;
  const rel = (src: number) => out(src) - from;

  const Body: React.FC = () => {
    const frame = useCurrentFrame();
    const diff = progress(frame, rel(15.4), rel(15.4) + 12);
    return (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 260 }}>
        <CutKicker>THE CULTURE</CutKicker>
        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 104,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: ink.full,
            opacity: progress(frame, 2, 14),
          }}
        >
          Anywhere you go,
          <br />
          it&apos;s{" "}
          <span
            style={{
              fontFamily: font.serif,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 132,
              letterSpacing: 0,
              color: red.base,
              opacity: diff,
            }}
          >
            different
          </span>
        </div>
        <div style={{ marginTop: 110, display: "flex", gap: 60 }}>
          <FloatCard
            at={rel(16.233)}
            icon={utensils}
            label="Food"
            tilt={-7}
            phase={0}
          />
          <FloatCard
            at={rel(16.9)}
            icon={car}
            label="Driving"
            tilt={6}
            accent
            phase={30}
          />
        </div>
      </AbsoluteFill>
    );
  };

  return (
    <Cutaway from={from} to={to} name="Cutaway: culture">
      <Body />
    </Cutaway>
  );
};

/** Cutaway 2 — "knows where to go… stopping at different spots": a route with stops. */
const STOPS = [
  { x: 190, y: 560, at: 28.9 },
  { x: 560, y: 330, at: 29.8 },
  { x: 740, y: 640, at: 30.7 },
];
const ROUTE =
  "M 90 700 C 150 640, 170 600, 190 560 S 380 300, 560 330 S 700 520, 740 640 S 820 720, 830 700";

const MapInsert: React.FC = () => {
  const from = out(26.7);
  const to = out(31.666);
  const rel = (src: number) => out(src) - from;

  const Body: React.FC = () => {
    const frame = useCurrentFrame();
    const draw = progress(frame, 8, to - from - 12);
    const go = progress(frame, 8, 20);
    const { y, lift } = float(frame);

    return (
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
        <CutKicker>ON THE ROAD</CutKicker>
        <div
          style={{
            marginTop: 40,
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 104,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: ink.full,
            opacity: progress(frame, 2, 14),
          }}
        >
          Knows where to{" "}
          <span
            style={{
              fontFamily: font.serif,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 132,
              letterSpacing: 0,
              color: red.base,
              opacity: go,
            }}
          >
            go
          </span>
        </div>

        {/* The map: a floating paper sheet with faint streets and a red route. */}
        <div style={{ position: "relative", marginTop: 90 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 48,
              backgroundColor: ink.full,
              opacity: 0.1 - lift * 0.03,
              filter: `blur(${34 + lift * 10}px)`,
              transform: `translate(${40 + lift * 8}px, ${64 + lift * 12}px) rotate(-3deg)`,
            }}
          />
          <div
            style={{
              position: "relative",
              width: 920,
              height: 820,
              borderRadius: 48,
              backgroundColor: paper.lift,
              boxShadow: shadow.contact,
              transform: `translateY(${y}px) rotate(-3deg)`,
              overflow: "hidden",
            }}
          >
            <svg
              width={920}
              height={820}
              style={{ position: "absolute", inset: 0 }}
            >
              {/* Streets. */}
              {[
                "M -20 200 L 940 260",
                "M -20 470 L 940 420",
                "M 300 -20 L 260 840",
                "M 650 -20 L 700 840",
                "M -20 760 L 940 690",
              ].map((d) => (
                <path
                  key={d}
                  d={d}
                  stroke="rgba(20,16,15,0.07)"
                  strokeWidth={34}
                  fill="none"
                  strokeLinecap="round"
                />
              ))}
              {/* Route. */}
              <path
                d={ROUTE}
                fill="none"
                stroke={red.base}
                strokeWidth={12}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - draw}
              />
            </svg>
            {STOPS.map((st, i) => {
              const pin = progress(frame, rel(st.at), rel(st.at) + 12);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: st.x,
                    top: st.y,
                    translate: `-50% ${-100 + (1 - pin) * -30}%`,
                    opacity: pin,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 92,
                      height: 92,
                      borderRadius: "50% 50% 50% 0",
                      rotate: "-45deg",
                      backgroundColor: ink.full,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: shadow.card,
                    }}
                  >
                    <span
                      style={{
                        rotate: "45deg",
                        fontFamily: font.display,
                        fontWeight: 800,
                        fontSize: 46,
                        color: paper.white,
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>
                </div>
              );
            })}
            {/* The car at the start of the route. */}
            <div style={{ position: "absolute", left: 40, top: 660 }}>
              <Icon size={90} color={red.base} stroke={1.8}>
                {car}
              </Icon>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    );
  };

  return (
    <Cutaway from={from} to={to} name="Cutaway: map">
      <Body />
    </Cutaway>
  );
};

/** The last beat: a thank-you card on the house paper. */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { y, lift } = float(frame);
  const inT = progress(frame, 0, 16);
  const name = progress(frame, 8, 22);

  return (
    <Paper>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: progress(frame, 0, 8),
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 48,
              backgroundColor: ink.full,
              opacity: 0.1 - lift * 0.03,
              filter: `blur(${34 + lift * 10}px)`,
              transform: `translate(${44 + lift * 8}px, ${70 + lift * 12}px) rotate(-4deg)`,
            }}
          />
          <div
            style={{
              position: "relative",
              width: 860,
              padding: "70px 60px",
              borderRadius: 48,
              backgroundColor: paper.lift,
              boxShadow: shadow.contact,
              transform: `translateY(${y + (1 - inT) * 60}px) rotate(-4deg)`,
              opacity: inT,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: 120,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: ink.full,
              }}
            >
              Thank you,
            </div>
            <div
              style={{
                fontFamily: font.serif,
                fontStyle: "italic",
                fontSize: 170,
                lineHeight: 1.05,
                color: red.base,
                opacity: name,
                translate: `0px ${(1 - name) * 20}px`,
              }}
            >
              Bando
            </div>
            <div
              dir="rtl"
              style={{
                marginTop: 20,
                fontFamily: font.arDisplay,
                fontSize: 60,
                color: ink.soft,
                opacity: name,
              }}
            >
              شكرًا يا باندو
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

export const AirportEdit: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: ink.full }}>
    <Sequence durationInFrames={FOOTAGE_END} name="Footage">
      <Footage />
    </Sequence>
    <Sequence durationInFrames={FOOTAGE_END} name="Graphics" layout="none">
      <HookTitle />
      <NameTag />
      <Checklist />
      <FunSticker />
    </Sequence>
    <CultureInsert />
    <MapInsert />
    <Captions />
    <Sequence from={FOOTAGE_END} durationInFrames={END_CARD} name="End card">
      <EndCard />
    </Sequence>
  </AbsoluteFill>
);

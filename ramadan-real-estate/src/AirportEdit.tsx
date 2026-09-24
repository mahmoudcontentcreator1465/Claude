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
import { Audio } from "@remotion/media";
import { font } from "./theme";

/**
 * This edit has its own look, on purpose — not the house paper/red style:
 * deep Nile blue, warm sand cards, a sunset-orange accent.
 */
const C = {
  night: "#0A2A43",
  night2: "#11446A",
  sand: "#F6E8CB",
  sandDeep: "#E8D2A4",
  navy: "#0A1F33",
  muted: "#6E5C43",
  faint: "rgba(10,31,51,0.28)",
  sun: "#FF6A2B",
  white: "#FFFFFF",
} as const;

const shadow = {
  float: "0 36px 70px rgba(4,16,28,0.35), 0 6px 16px rgba(4,16,28,0.2)",
  card: "0 18px 40px rgba(4,16,28,0.28)",
  contact: "0 2px 8px rgba(4,16,28,0.2)",
} as const;

/** The cutaway backdrop: Nile-blue gradient, a dot pattern and a low sun. */
const NightBackdrop: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(165deg, ${C.night} 0%, ${C.night2} 100%)`,
    }}
  >
    <AbsoluteFill
      style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.07) 2px, transparent 2.5px)",
        backgroundSize: "34px 34px",
      }}
    />
    <div
      style={{
        position: "absolute",
        right: -220,
        top: -160,
        width: 720,
        height: 720,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,106,43,0.55) 0%, rgba(255,106,43,0) 65%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: -260,
        bottom: -300,
        width: 760,
        height: 760,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(246,232,203,0.14) 0%, rgba(246,232,203,0) 65%)",
      }}
    />
    {children}
  </AbsoluteFill>
);

/**
 * Full edit of the airport testimonial (IMG_9277): guests from the US on
 * their Go2Cairo driver. At the user's request the driver is named only as
 * "Go2Cairo Driver" on screen.
 *
 * Source: public/airport/master.mp4 — the enhanced master (1080×1920, 30fps,
 * denoised, sharpened, graded, loudness-normalised to -14 LUFS). It stays
 * local; rebuild it with the ffmpeg command in HANDOFF.md.
 *
 * All times below are in source seconds from the supplied SRT. The edit
 * opens on her "hi" (8.18s, found from the audio envelope).
 */
const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/** The kept parts of the take. Cut: the pre-roll, "um you know", "and yeah it's just so". */
const SEGMENTS = [
  { from: 8.18, to: 13.633, zoom: [1.0, 1.06] },
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
  { at: 10.2, amount: 0.07 }, // "…is an amazing driver"
  { at: 22.233, amount: 0.05 }, // "keep us safe"
  { at: 34.5, amount: 0.06 }, // "we had so much fun"
];

const Footage: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: C.navy }}>
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
  { from: 8.18, to: 8.8, en: "Hi!", ar: "هاي!" },
  { from: 8.8, to: 10.2, en: "We're from the US", ar: "إحنا من أمريكا" },
  {
    from: 10.2,
    to: 11.833,
    en: "The Go2Cairo Driver is amazing",
    ar: "سواق Go2Cairo رائع",
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
          backgroundColor: "rgba(10,31,51,0.9)",
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
            color: C.white,
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
                  color: isKey ? C.sun : C.white,
                  opacity: on ? 1 : 0.28,
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
            color: C.sandDeep,
          }}
        >
          {cue.ar.split(/(Go2Cairo)/).map((part, i) =>
            part === "Go2Cairo" ? (
              <span
                key={i}
                style={{
                  fontFamily: font.display,
                  fontWeight: 800,
                  fontSize: 34,
                }}
              >
                {part}
              </span>
            ) : (
              part
            ),
          )}
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
        backgroundColor: C.sand,
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
  const inT = progress(frame, out(8.8), out(8.8) + 12);
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
        backgroundColor: C.sand,
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
          color: C.muted,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: C.sun,
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
          color: C.navy,
        }}
      >
        “An{" "}
        <span
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 91,
            textDecoration: "underline",
            textDecorationThickness: 8,
            textUnderlineOffset: 10,
            color: C.sun,
            opacity: 0.45 + 0.55 * word,
          }}
        >
          amazing
        </span>{" "}
        driver”
      </div>
    </div>
  );
};

/** Name tag for the Go2Cairo driver, low on the frame, while he is introduced. */
const NameTag: React.FC = () => (
  <Pill start={out(10.2)} end={out(13.633)} style={{ right: 70, bottom: 620 }}>
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: C.sun,
      }}
    />
    <span
      style={{
        fontFamily: font.display,
        fontWeight: 800,
        fontSize: 44,
        color: C.navy,
      }}
    >
      Go2Cairo
    </span>
    <span
      style={{
        fontFamily: font.display,
        fontWeight: 800,
        fontSize: 30,
        letterSpacing: "0.14em",
        color: C.muted,
      }}
    >
      DRIVER
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
        backgroundColor: C.sand,
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
          color: C.muted,
          marginBottom: 14,
        }}
      >
        WHY GO2CAIRO
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
                backgroundColor: on > 0.5 ? C.sun : "transparent",
                border: `4px solid ${on > 0.5 ? C.sun : C.faint}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={34} color={C.white} stroke={3}>
                {check}
              </Icon>
            </div>
            <span
              style={{
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: 44,
                color: C.navy,
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
          backgroundColor: C.sand,
          boxShadow: shadow.float,
          rotate: `${interpolate(inT, [0, 1], [-14, -5])}deg`,
          scale: String(interpolate(inT, [0, 1], [1.5, 1])),
          opacity: inT,
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: "-0.035em",
          color: C.navy,
          whiteSpace: "nowrap",
        }}
      >
        So much{" "}
        <span
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 101,
            textDecoration: "underline",
            textDecorationThickness: 8,
            textUnderlineOffset: 10,
            color: C.sun,
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
      <NightBackdrop>{children}</NightBackdrop>
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
        color: C.sandDeep,
        opacity: progress(frame, 4, 14),
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: C.sun,
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
          backgroundColor: C.navy,
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
          backgroundColor: C.sand,
          boxShadow: shadow.contact,
          transform: `translateY(${y}px) rotate(${tilt}deg)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
        }}
      >
        <Icon size={150} color={accent ? C.sun : C.navy} stroke={1.6}>
          {icon}
        </Icon>
        <div
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 70,
            letterSpacing: "-0.03em",
            color: accent ? C.sun : C.navy,
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
            color: C.sand,
            opacity: progress(frame, 2, 14),
          }}
        >
          Anywhere you go,
          <br />
          it&apos;s{" "}
          <span
            style={{
              fontFamily: font.display,
              fontWeight: 800,
              fontSize: 108,
              textDecoration: "underline",
              textDecorationThickness: 8,
              textUnderlineOffset: 10,
              color: C.sun,
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
            color: C.sand,
            opacity: progress(frame, 2, 14),
          }}
        >
          Knows where to{" "}
          <span
            style={{
              fontFamily: font.display,
              fontWeight: 800,
              fontSize: 108,
              textDecoration: "underline",
              textDecorationThickness: 8,
              textUnderlineOffset: 10,
              color: C.sun,
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
              backgroundColor: C.navy,
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
              backgroundColor: C.sand,
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
                stroke={C.sun}
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
                      backgroundColor: C.navy,
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
                        color: C.white,
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
              <Icon size={90} color={C.sun} stroke={1.8}>
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

/** The last beat: a thank-you card on the Nile-blue backdrop. */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { y, lift } = float(frame);
  const inT = progress(frame, 0, 16);
  const name = progress(frame, 8, 22);

  return (
    <NightBackdrop>
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
              backgroundColor: C.navy,
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
              backgroundColor: C.sand,
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
                color: C.navy,
              }}
            >
              Thanks,
            </div>
            <div
              style={{
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: 140,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: C.sun,
                opacity: name,
                translate: `0px ${(1 - name) * 20}px`,
              }}
            >
              Go2Cairo
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </NightBackdrop>
  );
};

/** Music bed: low under the voice, lifting for the end card, out at the end. */
const musicVolume = (frame: number) =>
  interpolate(
    frame,
    [
      0,
      12,
      FOOTAGE_END - 6,
      FOOTAGE_END + 10,
      AIRPORT_EDIT_DURATION - 24,
      AIRPORT_EDIT_DURATION,
    ],
    [0, 0.14, 0.14, 0.5, 0.5, 0],
    clamp,
  );

export const AirportEdit: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.navy }}>
    <Audio src={staticFile("airport/music.wav")} volume={musicVolume} />
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

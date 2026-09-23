import {
  AbsoluteFill,
  Interactive,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import "./fonts";
import { Dissolve } from "./lib/Dissolve";
import { clamp, ease, float, rise, travel } from "./lib/motion";
import { Paper } from "./lib/Paper";
import { font, ink, paper, red, shadow } from "./theme";

/**
 * Motion graphic for the script beat:
 *   "والملفت هنا إن MR1 هو البراند بتاع محمد رمضان نفسه.
 *    يعني الراجل بيحوّل شهرته من أغاني وإعلانات لأصل عقاري يحمل اسمه.
 *    وده درس مهم في الـPersonal Branding"
 *
 * One beat per sentence. Beats overlap by DISSOLVE frames so every hand-off
 * is a soft cross-dissolve. Shift the *_START constants to re-time against
 * the voice-over.
 */

const DISSOLVE = 8;

const BRAND_START = 0;
const BRAND_DURATION = 128;

const ASSET_START = BRAND_START + BRAND_DURATION - DISSOLVE;
const ASSET_DURATION = 200;

const LESSON_START = ASSET_START + ASSET_DURATION - DISSOLVE;
const LESSON_DURATION = 132;

export const BRAND_TO_ASSET_DURATION = LESSON_START + LESSON_DURATION;

const Kicker: React.FC<{ frame: number; start: number; children: string }> = ({
  frame,
  start,
  children,
}) => (
  <div
    dir="rtl"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      ...rise(frame, start, 16),
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
    <span
      style={{
        fontFamily: font.arDisplay,
        fontSize: 36,
        color: ink.soft,
      }}
    >
      {children}
    </span>
  </div>
);

/* ------------------------------------------------------------------------ */
/* Beat 1 — "MR1 هو البراند بتاع محمد رمضان نفسه"                            */
/* ------------------------------------------------------------------------ */

const BrandBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { y, lift } = float(frame);

  // The registered mark is the accent punctuation — it lands last.
  const markIn = interpolate(frame, [52, 66], [0, 1], {
    ...clamp,
    easing: ease,
  });

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 250, gap: 0 }}>
      <Kicker frame={frame} start={0}>
        الملفت هنا
      </Kicker>

      {/* The wordmark, on a raised card floating over the page. */}
      <Interactive.Div
        name="MR1 card"
        style={{
          position: "relative",
          marginTop: 110,
          ...rise(frame, 6, 40),
        }}
      >
        {/* Long soft shadow, lower-right, softening as the card rises. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 44,
            backgroundColor: "rgba(20,16,15,1)",
            opacity: 0.1 - lift * 0.03,
            filter: `blur(${34 + lift * 10}px)`,
            transform: `translate(${46 + lift * 8}px, ${70 + lift * 12}px) rotate(-8deg)`,
          }}
        />
        <div
          style={{
            position: "relative",
            width: 760,
            height: 520,
            borderRadius: 44,
            backgroundColor: paper.lift,
            boxShadow: shadow.contact,
            transform: `translateY(${y}px) rotate(-8deg)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              fontFamily: font.display,
              fontWeight: 800,
              fontSize: 300,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              color: ink.full,
            }}
          >
            MR1
            <span
              style={{
                position: "absolute",
                top: 18,
                right: -58,
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: `5px solid ${red.base}`,
                color: red.base,
                fontFamily: font.display,
                fontSize: 30,
                letterSpacing: 0,
                lineHeight: "46px",
                textAlign: "center",
                opacity: markIn,
                scale: String(interpolate(markIn, [0, 1], [1.6, 1])),
              }}
            >
              R
            </span>
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: font.display,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: "0.32em",
              color: ink.soft,
              opacity: interpolate(frame, [22, 40], [0, 1], {
                ...clamp,
                easing: ease,
              }),
            }}
          >
            THE BRAND
          </div>
        </div>
      </Interactive.Div>

      <div dir="rtl" style={{ marginTop: 150, textAlign: "center" }}>
        <Interactive.Div
          name="Owner label"
          style={{
            fontFamily: font.arDisplay,
            fontSize: 50,
            color: ink.soft,
            lineHeight: 1.3,
            ...rise(frame, 26),
          }}
        >
          هو البراند بتاع
        </Interactive.Div>
        <Interactive.Div
          name="Owner"
          style={{
            fontFamily: font.arDisplay,
            fontSize: 104,
            color: ink.full,
            lineHeight: 1.3,
            ...rise(frame, 34),
          }}
        >
          محمد رمضان{" "}
          <span
            style={{
              color: red.base,
              opacity: interpolate(frame, [48, 60], [0, 1], {
                ...clamp,
                easing: ease,
              }),
            }}
          >
            نفسه
          </span>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* Beat 2 — "بيحوّل شهرته من أغاني وإعلانات لأصل عقاري يحمل اسمه"          */
/* ------------------------------------------------------------------------ */

const MusicIcon: React.FC = () => (
  <svg
    width={64}
    height={64}
    viewBox="0 0 24 24"
    fill="none"
    stroke={ink.full}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const MegaphoneIcon: React.FC = () => (
  <svg
    width={64}
    height={64}
    viewBox="0 0 24 24"
    fill="none"
    stroke={ink.full}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

/** Where the chips fly to: the tower's crown. */
const TOWER_X = 540;
const TOWER_BASE = 1420;
const TOWER_W = 330;
const TOWER_H = 560;
const CROWN_W = 220;
const CROWN_H = 170;
const TOWER_TOP = TOWER_BASE - TOWER_H - CROWN_H;

const CHIP_IN = 18;
const CHIP_FLY = 70;
const CHIP_FLY_END = 102;

const Chip: React.FC<{
  frame: number;
  label: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  tilt: number;
  delay: number;
}> = ({ frame, label, icon, x, y, tilt, delay }) => {
  const f = float(frame, delay * 7);
  const fly = interpolate(
    frame,
    [CHIP_FLY + delay, CHIP_FLY_END + delay],
    [0, 1],
    { ...clamp, easing: travel },
  );

  const cx = interpolate(fly, [0, 1], [x, TOWER_X]);
  const cy = interpolate(fly, [0, 1], [y, TOWER_TOP + 80]);

  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy + f.y * (1 - fly),
        translate: "-50% -50%",
        rotate: `${tilt * (1 - fly)}deg`,
        scale: String(interpolate(fly, [0, 1], [1, 0.18])),
        opacity: interpolate(fly, [0.75, 1], [1, 0], clamp),
      }}
    >
      <div style={rise(frame, CHIP_IN + delay, 30)}>
        <div
          dir="rtl"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "30px 44px",
            borderRadius: 30,
            backgroundColor: paper.lift,
            boxShadow: `0 ${30 + f.lift * 10}px ${60 + f.lift * 16}px rgba(20,16,15,${0.13 - f.lift * 0.03}), ${shadow.contact}`,
            fontFamily: font.arDisplay,
            fontSize: 56,
            color: ink.full,
            whiteSpace: "nowrap",
          }}
        >
          {icon}
          {label}
        </div>
      </div>
    </div>
  );
};

const Tower: React.FC<{ frame: number }> = ({ frame }) => {
  const grow = interpolate(frame, [84, 128], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const crownGrow = interpolate(frame, [110, 138], [0, 1], {
    ...clamp,
    easing: ease,
  });
  // The red sign is the accent punctuation of this beat — it lands last.
  const sign = interpolate(frame, [134, 150], [0, 1], {
    ...clamp,
    easing: ease,
  });

  const cols = 4;
  const rows = 7;

  return (
    <>
      {/* Long soft cast shadow, falling lower-right from the base. */}
      <div
        style={{
          position: "absolute",
          left: TOWER_X - TOWER_W / 2 + 40,
          top: TOWER_BASE - 30,
          width: TOWER_W + 260,
          height: 110,
          borderRadius: 60,
          backgroundColor: "rgba(20,16,15,1)",
          opacity: 0.1 * grow,
          filter: "blur(30px)",
          transform: "skewX(-38deg)",
          transformOrigin: "left top",
        }}
      />

      {/* Ground line. */}
      <div
        style={{
          position: "absolute",
          left: 150,
          right: 150,
          top: TOWER_BASE,
          height: 3,
          borderRadius: 2,
          backgroundColor: ink.faint,
          scale: `${interpolate(frame, [70, 96], [0, 1], { ...clamp, easing: ease })} 1`,
        }}
      />

      {/* Body. Revealed bottom-up so it reads as rising out of the page. */}
      <div
        style={{
          position: "absolute",
          left: TOWER_X - TOWER_W / 2,
          top: TOWER_BASE - TOWER_H,
          width: TOWER_W,
          height: TOWER_H,
          clipPath: `inset(${(1 - grow) * 100}% -40px 0 -40px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "10px 10px 0 0",
            background: `linear-gradient(100deg, ${paper.white} 0%, ${paper.lift} 55%, #E9E5E0 100%)`,
            boxShadow: shadow.float,
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: 18,
            padding: "34px 30px 0",
          }}
        >
          {Array.from({ length: cols * rows }).map((_, i) => {
            const row = rows - 1 - Math.floor(i / cols);
            const on = interpolate(
              frame,
              [96 + row * 4, 108 + row * 4],
              [0, 1],
              {
                ...clamp,
                easing: ease,
              },
            );
            return (
              <div
                key={i}
                style={{
                  borderRadius: 6,
                  backgroundColor: `rgba(20,16,15,${0.05 + on * 0.07})`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Crown — the setback top tier. */}
      <div
        style={{
          position: "absolute",
          left: TOWER_X - CROWN_W / 2,
          top: TOWER_TOP,
          width: CROWN_W,
          height: CROWN_H,
          clipPath: `inset(${(1 - crownGrow) * 100}% -40px 0 -40px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "10px 10px 0 0",
            background: `linear-gradient(100deg, ${paper.white} 0%, ${paper.lift} 55%, #E9E5E0 100%)`,
            boxShadow: shadow.card,
          }}
        />
      </div>

      {/* The name on the building. */}
      <div
        style={{
          position: "absolute",
          left: TOWER_X,
          top: TOWER_TOP + CROWN_H / 2,
          translate: "-50% -50%",
          padding: "14px 30px",
          borderRadius: 14,
          backgroundColor: red.base,
          boxShadow: `0 16px 36px ${red.glow}`,
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 64,
          letterSpacing: "-0.03em",
          color: paper.white,
          opacity: sign,
          scale: String(interpolate(sign, [0, 1], [0.7, 1])),
        }}
      >
        MR1
      </div>
    </>
  );
};

const AssetBeat: React.FC = () => {
  const frame = useCurrentFrame();

  // Chip start positions (canvas px).
  const songs = { x: 250, y: 640 };
  const ads = { x: 830, y: 760 };
  const target = { x: TOWER_X, y: TOWER_TOP + 80 };

  const trail = (from: { x: number; y: number }, bend: number) =>
    `M ${from.x} ${from.y + 80} Q ${(from.x + target.x) / 2 + bend} ${target.y + 40} ${target.x} ${target.y}`;

  const drawSongs = interpolate(frame, [40, 72], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const drawAds = interpolate(frame, [46, 78], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const fadeTrails = interpolate(
    frame,
    [CHIP_FLY_END - 4, CHIP_FLY_END + 14],
    [1, 0],
    clamp,
  );

  return (
    <AbsoluteFill>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Headline"
          style={{
            fontFamily: font.arDisplay,
            fontSize: 92,
            color: ink.full,
            lineHeight: 1.25,
            ...rise(frame, 0),
          }}
        >
          بيحوّل شهرته
        </Interactive.Div>
        <Interactive.Div
          name="From"
          style={{
            fontFamily: font.arDisplay,
            fontSize: 48,
            color: ink.soft,
            marginTop: 8,
            ...rise(frame, 8),
          }}
        >
          من أغاني وإعلانات
        </Interactive.Div>
      </div>

      {/* Trails drawing from each source to the crown. */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0, opacity: fadeTrails }}
      >
        {[
          { d: trail(songs, -60), draw: drawSongs },
          { d: trail(ads, 60), draw: drawAds },
        ].map(({ d, draw }) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={ink.faint}
            strokeWidth={4}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - draw}
          />
        ))}
      </svg>

      <Tower frame={frame} />

      <Chip
        frame={frame}
        label="أغاني"
        icon={<MusicIcon />}
        x={songs.x}
        y={songs.y}
        tilt={-9}
        delay={0}
      />
      <Chip
        frame={frame}
        label="إعلانات"
        icon={<MegaphoneIcon />}
        x={ads.x}
        y={ads.y}
        tilt={8}
        delay={6}
      />

      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: TOWER_BASE + 90,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Payoff"
          style={{
            fontFamily: font.arDisplay,
            fontSize: 84,
            color: ink.full,
            lineHeight: 1.3,
            ...rise(frame, 118),
          }}
        >
          لأصل عقاري{" "}
          <span
            style={{
              color: red.base,
              opacity: interpolate(frame, [136, 148], [0, 1], {
                ...clamp,
                easing: ease,
              }),
            }}
          >
            يحمل اسمه
          </span>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* Beat 3 — "وده درس مهم في الـPersonal Branding"                            */
/* ------------------------------------------------------------------------ */

const LessonBeat: React.FC = () => {
  const frame = useCurrentFrame();

  // Word-by-word, 4-frame stagger.
  const words = ["وده", "درس", "مهم", "في"];

  const highlight = interpolate(frame, [46, 66], [0, 1], {
    ...clamp,
    easing: ease,
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ marginTop: -120, textAlign: "center" }}>
        <Kicker frame={frame} start={0}>
          الدرس
        </Kicker>

        <div
          dir="rtl"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 22,
            marginTop: 60,
            fontFamily: font.arDisplay,
            fontSize: 96,
            color: ink.full,
            lineHeight: 1.25,
          }}
        >
          {words.map((w, i) => (
            <span
              key={w}
              style={{ display: "inline-block", ...rise(frame, 4 + i * 4) }}
            >
              {w}
            </span>
          ))}
        </div>

        <Interactive.Div
          name="Personal"
          style={{
            marginTop: 70,
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 190,
            letterSpacing: "-0.035em",
            lineHeight: 0.95,
            color: ink.full,
            ...rise(frame, 24, 40),
          }}
        >
          Personal
        </Interactive.Div>

        {/* The emotional word — italic serif, in the accent. Lands last. */}
        <Interactive.Div
          name="Branding"
          style={{
            position: "relative",
            display: "inline-block",
            marginTop: 4,
            fontFamily: font.serif,
            fontStyle: "italic",
            fontSize: 240,
            lineHeight: 1,
            color: red.base,
            ...rise(frame, 36, 40),
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -14,
              right: -14,
              bottom: 34,
              height: 54,
              borderRadius: 8,
              backgroundColor: red.marker,
              transformOrigin: "left center",
              scale: `${highlight} 1`,
              zIndex: -1,
            }}
          />
          Branding
        </Interactive.Div>

        {/* The formula underneath: fame → assets. */}
        <div
          dir="rtl"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
            marginTop: 110,
            fontFamily: font.arDisplay,
            fontSize: 56,
          }}
        >
          <div
            style={{
              padding: "18px 40px",
              borderRadius: 999,
              backgroundColor: paper.lift,
              boxShadow: shadow.card,
              color: ink.soft,
              ...rise(frame, 56),
            }}
          >
            شهرة
          </div>
          <svg
            width={90}
            height={40}
            viewBox="0 0 90 40"
            style={{ ...rise(frame, 62), scale: "-1 1" }}
          >
            <path
              d="M4 20 H80 M64 6 L82 20 L64 34"
              fill="none"
              stroke={ink.full}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            style={{
              padding: "18px 40px",
              borderRadius: 999,
              backgroundColor: ink.full,
              boxShadow: shadow.float,
              color: paper.white,
              ...rise(frame, 68),
            }}
          >
            أصول
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */

export const BrandToAsset: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow continuous push-in across the whole piece.
  const push = interpolate(
    frame,
    [0, BRAND_TO_ASSET_DURATION],
    [1, 1.06],
    clamp,
  );

  return (
    <Paper>
      <AbsoluteFill style={{ scale: String(push) }}>
        <Sequence
          from={BRAND_START}
          durationInFrames={BRAND_DURATION}
          name="Brand"
        >
          <Dissolve durationInFrames={BRAND_DURATION} outFrames={DISSOLVE}>
            <BrandBeat />
          </Dissolve>
        </Sequence>

        <Sequence
          from={ASSET_START}
          durationInFrames={ASSET_DURATION}
          name="Asset"
        >
          <Dissolve
            durationInFrames={ASSET_DURATION}
            inFrames={DISSOLVE}
            outFrames={DISSOLVE}
          >
            <AssetBeat />
          </Dissolve>
        </Sequence>

        <Sequence
          from={LESSON_START}
          durationInFrames={LESSON_DURATION}
          name="Lesson"
        >
          <Dissolve durationInFrames={LESSON_DURATION} inFrames={DISSOLVE}>
            <LessonBeat />
          </Dissolve>
        </Sequence>
      </AbsoluteFill>
    </Paper>
  );
};

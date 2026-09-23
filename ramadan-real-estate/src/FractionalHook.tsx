import {
  AbsoluteFill,
  Interactive,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import "./fonts";
import { clamp, float, progress, rise, sec, travel } from "./lib/motion";
import { Paper } from "./lib/Paper";
import { font, ink, paper, red, shadow } from "./theme";

/**
 * Hook for the fractional-ownership reel:
 *   "سواء سنك كبير أو صغير… دلوقتي تقدر تدخل الاستثمار العقاري
 *    من غير ما تشتري وحدة كاملة"
 *
 * Timed against the supplied SRT (cues 1–6), so frame 0 is 00:00:00,000.
 */
const CUE = {
  age: sec(0),
  bigSmall: sec(0.6),
  canEnter: sec(1.566),
  realEstate: sec(2.566),
  without: sec(3.533),
  fullUnit: sec(4.4),
  end: sec(4.9),
};

export const FRACTIONAL_HOOK_DURATION = CUE.end + 20;

/* Building geometry, canvas px. */
const B_W = 520;
const B_H = 600;
const B_LEFT = 540 - B_W / 2;
const B_BASE = 1580;
const B_TOP = B_BASE - B_H;
const PAD = 28;
const GAP = 16;
const COLS = 4;
const ROWS = 6;
const CELL_W = (B_W - PAD * 2 - GAP * (COLS - 1)) / COLS;
const CELL_H = (B_H - PAD * 2 - GAP * (ROWS - 1)) / ROWS;

/** The unit that gets pulled out of the building. */
const PICK = { col: 1, row: 3 };
const PICK_X = B_LEFT + PAD + PICK.col * (CELL_W + GAP) + CELL_W / 2;
const PICK_Y = B_TOP + PAD + PICK.row * (CELL_H + GAP) + CELL_H / 2;

/* The pulled-out unit, at full size. */
const UNIT_W = 640;
const UNIT_H = 420;
const UNIT_X = 540;
const UNIT_Y = 960;
const SHARES = 10;
const RED_SHARE = 6;

/** Two stacked lines that rise in on their cues and drop out at `out`. */
const Lines: React.FC<{
  frame: number;
  out: number;
  top: React.ReactNode;
  topAt: number;
  bottom: React.ReactNode;
  bottomAt: number;
}> = ({ frame, out, top, topAt, bottom, bottomAt }) => {
  const leave = interpolate(frame, [out - 5, out], [1, 0], clamp);
  if (frame < topAt || frame > out) return null;

  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        top: 210,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: font.arDisplay,
        lineHeight: 1.25,
        opacity: leave,
      }}
    >
      <div style={{ fontSize: 76, color: ink.soft, ...rise(frame, topAt) }}>
        {top}
      </div>
      <div
        style={{
          fontSize: 124,
          color: ink.full,
          marginTop: 6,
          ...rise(frame, bottomAt, 30),
        }}
      >
        {bottom}
      </div>
    </div>
  );
};

const AgeSlider: React.FC<{ frame: number }> = ({ frame }) => {
  const sweep = progress(frame, CUE.bigSmall, CUE.canEnter - 4, travel);
  const leave = interpolate(
    frame,
    [CUE.canEnter - 2, CUE.canEnter + 6],
    [1, 0],
    clamp,
  );
  if (leave <= 0) return null;

  // RTL reading: young on the right, older on the left.
  const trackLeft = 150;
  const trackRight = 930;
  const knobX = interpolate(sweep, [0, 1], [trackRight, trackLeft]);
  const age = Math.round(interpolate(sweep, [0, 1], [18, 65]));
  const y = 1150;

  return (
    <AbsoluteFill
      style={{
        ...rise(frame, 2, 40),
        opacity: leave * rise(frame, 2, 40).opacity,
      }}
    >
      {/* Track. */}
      <div
        style={{
          position: "absolute",
          left: trackLeft,
          width: trackRight - trackLeft,
          top: y - 8,
          height: 16,
          borderRadius: 8,
          backgroundColor: "rgba(20,16,15,0.08)",
        }}
      />
      {/* Fill — the accent, trailing the knob. */}
      <div
        style={{
          position: "absolute",
          left: knobX,
          width: trackRight - knobX,
          top: y - 8,
          height: 16,
          borderRadius: 8,
          backgroundColor: red.base,
        }}
      />
      {/* Knob. */}
      <div
        style={{
          position: "absolute",
          left: knobX,
          top: y,
          width: 64,
          height: 64,
          translate: "-50% -50%",
          borderRadius: "50%",
          backgroundColor: paper.white,
          border: `7px solid ${red.base}`,
          boxShadow: shadow.card,
        }}
      />
      {/* Age bubble riding the knob. */}
      <div
        style={{
          position: "absolute",
          // The bubble follows the knob but stays inside the safe inset.
          left: Math.min(Math.max(knobX, 250), 830),
          top: y - 70,
          translate: "-50% -100%",
          padding: "18px 36px 14px",
          borderRadius: 30,
          backgroundColor: paper.lift,
          boxShadow: shadow.float,
          display: "flex",
          alignItems: "baseline",
          gap: 14,
          direction: "rtl",
        }}
      >
        <span
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 110,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: ink.full,
          }}
        >
          {age}
        </span>
        <span
          style={{ fontFamily: font.arDisplay, fontSize: 40, color: ink.soft }}
        >
          سنة
        </span>
      </div>
      {/* End labels. */}
      {[
        { x: trackRight, label: "صغير" },
        { x: trackLeft, label: "كبير" },
      ].map(({ x, label }) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: x,
            top: y + 64,
            translate: "-50% 0",
            fontFamily: font.arDisplay,
            fontSize: 50,
            color: ink.soft,
          }}
        >
          {label}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Building: React.FC<{ frame: number }> = ({ frame }) => {
  const start = CUE.canEnter + 2;
  const grow = progress(frame, start, start + 30);
  const pick = progress(frame, CUE.without, CUE.without + 8);
  const recede = progress(frame, CUE.without + 4, CUE.without + 22);

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(recede, [0, 1], [1, 0.16]),
        scale: String(interpolate(recede, [0, 1], [1, 0.95])),
        transformOrigin: `540px ${B_BASE}px`,
      }}
    >
      {/* Long soft cast shadow, lower-right. */}
      <div
        style={{
          position: "absolute",
          left: B_LEFT + 40,
          top: B_BASE - 34,
          width: B_W + 300,
          height: 120,
          borderRadius: 60,
          backgroundColor: ink.full,
          opacity: 0.1 * grow,
          filter: "blur(32px)",
          transform: "skewX(-38deg)",
          transformOrigin: "left top",
        }}
      />
      {/* Ground line. */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: B_BASE,
          height: 3,
          borderRadius: 2,
          backgroundColor: ink.faint,
          scale: `${progress(frame, start - 4, start + 18)} 1`,
        }}
      />
      {/* Body, revealed bottom-up. */}
      <div
        style={{
          position: "absolute",
          left: B_LEFT,
          top: B_TOP,
          width: B_W,
          height: B_H,
          clipPath: `inset(${(1 - grow) * 100}% -60px 0 -60px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "12px 12px 0 0",
            background: `linear-gradient(100deg, ${paper.white} 0%, ${paper.lift} 55%, #E9E5E0 100%)`,
            boxShadow: shadow.float,
          }}
        />
        {Array.from({ length: ROWS * COLS }).map((_, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          const fromBottom = ROWS - 1 - row;
          const on = progress(
            frame,
            start + 8 + fromBottom * 3,
            start + 18 + fromBottom * 3,
          );
          const isPick = col === PICK.col && row === PICK.row;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: PAD + col * (CELL_W + GAP),
                top: PAD + row * (CELL_H + GAP),
                width: CELL_W,
                height: CELL_H,
                borderRadius: 8,
                backgroundColor: isPick
                  ? `rgba(224,26,43,${0.05 + on * 0.07 + pick * 0.1})`
                  : `rgba(20,16,15,${0.04 + on * 0.07})`,
                outline: isPick ? `${pick * 5}px solid ${red.base}` : "none",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** The unit pulled out of the building, then split into ten shares. */
const Unit: React.FC<{ frame: number }> = ({ frame }) => {
  const fly = progress(frame, CUE.without + 4, CUE.fullUnit - 2, travel);
  const split = progress(frame, CUE.fullUnit, CUE.fullUnit + 12);
  const share = progress(frame, CUE.fullUnit + 8, CUE.fullUnit + 22);
  const tag = progress(frame, CUE.fullUnit + 16, CUE.fullUnit + 28);
  const { y: bob } = float(frame);

  if (frame < CUE.without + 4) return null;

  const x = interpolate(fly, [0, 1], [PICK_X, UNIT_X]);
  const y = interpolate(fly, [0, 1], [PICK_Y, UNIT_Y]) + bob * fly;
  const sx = interpolate(fly, [0, 1], [CELL_W / UNIT_W, 1]);
  const sy = interpolate(fly, [0, 1], [CELL_H / UNIT_H, 1]);
  const gap = split * 14;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: UNIT_W,
        height: UNIT_H,
        translate: "-50% -50%",
        scale: `${sx} ${sy}`,
        rotate: `${interpolate(fly, [0, 1], [0, -6])}deg`,
        display: "flex",
        gap,
      }}
    >
      {Array.from({ length: SHARES }).map((_, i) => {
        const isShare = i === RED_SHARE;
        const first = i === 0;
        const last = i === SHARES - 1;
        const r = interpolate(split, [0, 1], [0, 12]);

        return (
          <div
            key={i}
            style={{
              position: "relative",
              flex: 1,
              borderTopLeftRadius: first ? 26 : r,
              borderBottomLeftRadius: first ? 26 : r,
              borderTopRightRadius: last ? 26 : r,
              borderBottomRightRadius: last ? 26 : r,
              backgroundColor: isShare
                ? interpolateColors(share, [0, 1], [paper.lift, red.base])
                : paper.lift,
              borderLeft:
                first || split > 0.2
                  ? "none"
                  : `2px dashed rgba(20,16,15,${0.12 * (1 - split)})`,
              boxShadow: isShare
                ? `0 ${20 + share * 30}px ${40 + share * 30}px rgba(20,16,15,0.16)`
                : shadow.card,
              translate: isShare ? `0px ${share * -90}px` : undefined,
            }}
          >
            {isShare ? (
              <div
                dir="rtl"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: -26,
                  translate: "-50% -100%",
                  padding: "10px 26px 6px",
                  borderRadius: 999,
                  backgroundColor: ink.full,
                  color: paper.white,
                  fontFamily: font.arDisplay,
                  fontSize: 44,
                  whiteSpace: "nowrap",
                  opacity: tag,
                  scale: String(interpolate(tag, [0, 1], [0.8, 1])),
                }}
              >
                حصة
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export const FractionalHook: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(
    frame,
    [0, FRACTIONAL_HOOK_DURATION],
    [1, 1.06],
    clamp,
  );
  const strike = progress(frame, CUE.fullUnit + 6, CUE.fullUnit + 18);

  return (
    <Paper>
      <AbsoluteFill style={{ scale: String(push) }}>
        <Interactive.Div
          name="Age slider"
          style={{ position: "absolute", inset: 0 }}
        >
          <AgeSlider frame={frame} />
        </Interactive.Div>
        {frame >= CUE.canEnter ? <Building frame={frame} /> : null}
        <Unit frame={frame} />

        <Lines
          frame={frame}
          out={CUE.canEnter}
          top="سواء سنك"
          topAt={CUE.age}
          bottom="كبير أو صغير"
          bottomAt={CUE.bigSmall}
        />
        <Lines
          frame={frame}
          out={CUE.without}
          top="دلوقتي تقدر تدخل"
          topAt={CUE.canEnter}
          bottom={<span style={{ color: red.base }}>الاستثمار العقاري</span>}
          bottomAt={CUE.realEstate}
        />
        <Lines
          frame={frame}
          out={FRACTIONAL_HOOK_DURATION + 1}
          top="من غير ما تشتري"
          topAt={CUE.without}
          bottom={
            <span style={{ position: "relative", display: "inline-block" }}>
              وحدة كاملة
              {/* The red strike — you don't buy the whole thing. */}
              <span
                style={{
                  position: "absolute",
                  left: -12,
                  right: -12,
                  top: "54%",
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: red.base,
                  transformOrigin: "right center",
                  scale: `${strike} 1`,
                  rotate: "-4deg",
                }}
              />
            </span>
          }
          bottomAt={CUE.fullUnit}
        />
      </AbsoluteFill>
    </Paper>
  );
};

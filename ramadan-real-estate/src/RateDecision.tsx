import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { Icon, paths } from "./lib/Icon";
import { Kicker } from "./lib/Kicker";
import { clamp, float, progress, rise, sec } from "./lib/motion";
import { Paper } from "./lib/Paper";
import { font, ink, paper, red, shadow } from "./theme";

/**
 * Full-frame insert for the interest-rate reel:
 *   "البنك المركزي ثبّت فائدة الإيداع عند 19% والإقراض عند 20%"
 *
 * Timed against SRT cues 7–9 (file 93): frame 0 is 00:00:07,066.
 */
const T0 = 7.066;
const at = (srt: number) => sec(srt - T0);

const CUE = {
  bank: at(7.066),
  deposit: at(8.0),
  lending: at(10.0),
  end: at(12.166),
};

export const RATE_DECISION_DURATION = CUE.end + 30;

/** One rate on a floating card: label, counter, and a red "held" lock. */
const RateCard: React.FC<{
  frame: number;
  start: number;
  label: string;
  value: number;
  tilt: number;
  phase: number;
}> = ({ frame, start, label, value, tilt, phase }) => {
  const shown = progress(frame, start, start + 18);
  const count = progress(frame, start + 4, start + 30);
  const lock = progress(frame, start + 30, start + 42);
  const { y, lift } = float(frame, phase);
  // The card settles with a small jolt when the lock lands.
  const jolt = interpolate(
    frame,
    [start + 38, start + 41, start + 48],
    [0, 8, 0],
    clamp,
  );

  return (
    <div
      style={{
        position: "relative",
        width: 900,
        height: 400,
        opacity: shown,
        translate: `0px ${(1 - shown) * 70}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 48,
          backgroundColor: ink.full,
          opacity: 0.1 - lift * 0.03,
          filter: `blur(${34 + lift * 10}px)`,
          transform: `translate(${40 + lift * 8}px, ${60 + lift * 12}px) rotate(${tilt}deg)`,
        }}
      />
      <div
        dir="rtl"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 48,
          backgroundColor: paper.lift,
          boxShadow: shadow.contact,
          transform: `translateY(${y + jolt}px) rotate(${tilt}deg)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontFamily: font.arDisplay,
            fontSize: 78,
            lineHeight: 1.25,
            color: ink.full,
          }}
        >
          فائدة
          <br />
          <span style={{ color: ink.soft }}>{label}</span>
        </div>
        <div
          style={{
            position: "relative",
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 230,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            color: ink.full,
            direction: "ltr",
          }}
        >
          {Math.round(count * value)}
          <span style={{ fontSize: 130 }}>%</span>

          {/* Red lock: the rate is held, not cut. */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -60,
              width: 110,
              height: 110,
              borderRadius: "50%",
              backgroundColor: red.base,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: lock,
              scale: String(interpolate(lock, [0, 1], [1.8, 1])),
              rotate: "12deg",
            }}
          >
            <Icon size={58} color={paper.white} stroke={2.6}>
              {paths.lock}
            </Icon>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RateDecision: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(
    frame,
    [0, RATE_DECISION_DURATION],
    [1, 1.05],
    clamp,
  );
  const held = progress(frame, CUE.lending + 44, CUE.lending + 58);

  return (
    <Paper>
      <AbsoluteFill
        style={{ scale: String(push), alignItems: "center", paddingTop: 230 }}
      >
        <Kicker frame={frame}>القرار</Kicker>

        {/* The central bank, as a header. */}
        <div
          dir="rtl"
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 30,
            ...rise(frame, 4, 40),
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
        <div
          dir="rtl"
          style={{
            marginTop: 10,
            fontFamily: font.arDisplay,
            fontSize: 70,
            color: ink.soft,
            ...rise(frame, CUE.deposit - 6),
          }}
        >
          ثبّت أسعار الفايدة
        </div>

        <div
          style={{
            marginTop: 70,
            display: "flex",
            flexDirection: "column",
            gap: 60,
          }}
        >
          <RateCard
            frame={frame}
            start={CUE.deposit}
            label="الإيداع"
            value={19}
            tilt={-2}
            phase={0}
          />
          <RateCard
            frame={frame}
            start={CUE.lending}
            label="الإقراض"
            value={20}
            tilt={2}
            phase={30}
          />
        </div>

        {/* The takeaway lands last, in red. */}
        <div
          dir="rtl"
          style={{
            marginTop: 70,
            fontFamily: font.arDisplay,
            fontSize: 64,
            color: red.base,
            opacity: held,
            translate: `0px ${(1 - held) * 20}px`,
          }}
        >
          من غير تغيير
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

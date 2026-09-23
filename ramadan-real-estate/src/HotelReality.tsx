import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { Dissolve } from "./lib/Dissolve";
import { Icon, paths } from "./lib/Icon";
import { clamp, float, progress, rise, sec } from "./lib/motion";
import { Paper } from "./lib/Paper";
import { font, ink, paper, red, shadow } from "./theme";

/**
 * Full-frame insert for the Amarina reel:
 *   "بس كلمة فندقي لوحدها مش ضمان للعائد. اسأل مين المشغّل، التكلفة كام،
 *    والعائد الحقيقي بعد المصاريف. انت شايف خطوة زي دي نقلة حقيقية ولا لا؟"
 *
 * Timed against SRT cues 22–29: frame 0 is 00:00:20,566 in the full video.
 * On-screen wording follows what is said in the SRT.
 */
const T0 = 20.566;
const at = (srt: number) => sec(srt - T0);

const CUE = {
  word: at(20.566),
  notGuarantee: at(22.166),
  who: at(22.966),
  cost: at(24.1),
  realReturn: at(24.9),
  afterCosts: at(26.1),
  you: at(26.866),
  realMove: at(28.133),
  end: at(29.366),
};

const DISSOLVE = 8;
export const HOTEL_REALITY_DURATION = CUE.end + 30;

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
/* Beat 1 — "بس كلمة فندقي لوحدها مش ضمان للعائد"                             */
/* ------------------------------------------------------------------------ */

const WordBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { y, lift } = float(frame);
  const stampAt = CUE.notGuarantee - CUE.word;
  const stamp = progress(frame, stampAt, stampAt + 8);
  // The tag jolts when the stamp hits.
  const hit = interpolate(
    frame,
    [stampAt + 6, stampAt + 9, stampAt + 16],
    [0, 12, 0],
    clamp,
  );

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 260 }}>
      <div dir="rtl" style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: font.arDisplay,
            fontSize: 76,
            color: ink.soft,
            lineHeight: 1.3,
            ...rise(frame, 0),
          }}
        >
          بس كلمة
        </div>
        <div
          style={{
            fontFamily: font.arDisplay,
            fontSize: 124,
            color: ink.full,
            lineHeight: 1.3,
            ...rise(frame, 6, 34),
          }}
        >
          فندقي لوحدها
        </div>
      </div>

      {/* A hotel key tag floating over the page. */}
      <div
        style={{
          position: "relative",
          marginTop: 140,
          ...rise(frame, 10, 60),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "60px 60px 200px 200px",
            backgroundColor: ink.full,
            opacity: 0.11 - lift * 0.03,
            filter: `blur(${30 + lift * 10}px)`,
            transform: `translate(${50 + lift * 8}px, ${70 + lift * 12}px) rotate(-12deg)`,
          }}
        />
        <div
          style={{
            position: "relative",
            width: 420,
            height: 640,
            borderRadius: "60px 60px 210px 210px",
            backgroundColor: paper.lift,
            boxShadow: shadow.contact,
            transform: `translateY(${y + hit}px) rotate(-12deg)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 60,
          }}
        >
          {/* Key-ring hole. */}
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              backgroundColor: paper.base,
              boxShadow: "inset 0 4px 10px rgba(20,16,15,0.18)",
            }}
          />
          <div
            style={{
              marginTop: 70,
              fontFamily: font.display,
              fontWeight: 800,
              fontSize: 34,
              letterSpacing: "0.4em",
              color: ink.soft,
            }}
          >
            HOTEL
          </div>
          <div
            style={{
              marginTop: 20,
              fontFamily: font.arDisplay,
              fontSize: 120,
              color: ink.full,
            }}
          >
            فندقي
          </div>
        </div>

        {/* The red stamp slams on — the accent lands last. */}
        {frame >= stampAt ? (
          <div
            dir="rtl"
            style={{
              position: "absolute",
              left: "50%",
              top: "80%",
              translate: "-50% -50%",
              rotate: "8deg",
              scale: String(interpolate(stamp, [0, 1], [1.8, 1])),
              opacity: stamp,
              padding: "22px 40px 16px",
              border: `9px solid ${red.base}`,
              borderRadius: 22,
              backgroundColor: "rgba(245,243,240,0.9)",
              fontFamily: font.arDisplay,
              fontSize: 82,
              color: red.base,
              whiteSpace: "nowrap",
            }}
          >
            مش ضمان للعائد
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* Beat 2 — "اسأل مين اللي هيدير، والتكلفة كام، والعائد الحقيقي بعد المصاريف" */
/* ------------------------------------------------------------------------ */

const Row: React.FC<{
  frame: number;
  start: number;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ frame, start, active, icon, children }) => {
  const shown = progress(frame, start, start + 16);
  const on = active ? 1 : 0;

  return (
    <div
      dir="rtl"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "40px 46px",
        borderRadius: 30,
        backgroundColor: active ? paper.white : "transparent",
        boxShadow: active ? shadow.card : "none",
        opacity: shown * (active ? 1 : 0.55),
        translate: `${(1 - shown) * -60}px 0px`,
      }}
    >
      {/* Red bar marks the question being asked. */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 24,
          bottom: 24,
          width: 10,
          borderRadius: 5,
          backgroundColor: red.base,
          scale: `1 ${on}`,
        }}
      />
      {/* Empty checkbox — these are still open questions. */}
      <div
        style={{
          width: 64,
          height: 64,
          flexShrink: 0,
          borderRadius: 14,
          border: `6px solid ${active ? ink.full : ink.faint}`,
        }}
      />
      <div
        style={{
          flex: 1,
          fontFamily: font.arDisplay,
          fontSize: 70,
          lineHeight: 1.25,
          color: ink.full,
        }}
      >
        {children}
      </div>
      <div style={{ opacity: active ? 1 : 0.5 }}>{icon}</div>
    </div>
  );
};

const AskBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const c = (cue: number) => cue - CUE.who;
  const cost = c(CUE.cost);
  const real = c(CUE.realReturn);
  const after = c(CUE.afterCosts);

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 300 }}>
      <Kicker frame={frame}>قبل ما تدخل</Kicker>
      <div
        style={{
          marginTop: 30,
          fontFamily: font.arDisplay,
          fontSize: 150,
          color: ink.full,
          lineHeight: 1.2,
          ...rise(frame, 2, 40),
        }}
      >
        اسأل
      </div>

      {/* The checklist, on a raised paper sheet. */}
      <div
        style={{
          marginTop: 70,
          width: 920,
          padding: 30,
          borderRadius: 44,
          backgroundColor: paper.lift,
          boxShadow: shadow.float,
          rotate: "-1.5deg",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          ...rise(frame, 4, 50),
        }}
      >
        <Row
          frame={frame}
          start={6}
          active={frame < cost}
          icon={<Icon size={74}>{paths.user}</Icon>}
        >
          مين اللي هيدير<span style={{ color: red.base }}>؟</span>
        </Row>
        <Row
          frame={frame}
          start={cost}
          active={frame >= cost && frame < real}
          icon={<Icon size={74}>{paths.coins}</Icon>}
        >
          التكلفة كام<span style={{ color: red.base }}>؟</span>
        </Row>
        <Row
          frame={frame}
          start={real}
          active={frame >= real}
          icon={<Icon size={74}>{paths.trend}</Icon>}
        >
          العائد الحقيقي
          <br />
          <span
            style={{
              display: "inline-block",
              color: red.base,
              ...rise(frame, after, 20),
            }}
          >
            بعد المصاريف؟
          </span>
        </Row>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */
/* Beat 3 — "انت شايف خطوة زي دي نقلة حقيقية ولا لا؟"                         */
/* ------------------------------------------------------------------------ */

const PollBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const pollAt = CUE.realMove - CUE.you;
  const { y } = float(frame);

  const option = (i: number) =>
    progress(frame, pollAt + i * 6, pollAt + i * 6 + 16);

  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
      <Kicker frame={frame}>رأيك إيه؟</Kicker>
      <div
        dir="rtl"
        style={{
          marginTop: 50,
          textAlign: "center",
          fontFamily: font.arDisplay,
          lineHeight: 1.25,
        }}
      >
        <div style={{ fontSize: 84, color: ink.soft, ...rise(frame, 2) }}>
          انت شايف
        </div>
        <div style={{ fontSize: 130, color: ink.full, ...rise(frame, 8, 36) }}>
          خطوة زي دي
        </div>
      </div>

      {/* Poll card. */}
      <div
        dir="rtl"
        style={{
          marginTop: 110,
          width: 860,
          padding: 44,
          borderRadius: 48,
          backgroundColor: paper.lift,
          boxShadow: shadow.float,
          display: "flex",
          flexDirection: "column",
          gap: 30,
          translate: `0px ${y}px`,
          rotate: "-2deg",
          opacity: option(0),
        }}
      >
        <div
          style={{
            height: 160,
            borderRadius: 999,
            backgroundColor: ink.full,
            color: paper.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: font.arDisplay,
            fontSize: 80,
            opacity: option(0),
            scale: String(interpolate(option(0), [0, 1], [0.9, 1])),
          }}
        >
          نقلة حقيقية
        </div>
        <div
          style={{
            height: 160,
            borderRadius: 999,
            border: `7px solid ${red.base}`,
            color: red.base,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: font.arDisplay,
            fontSize: 80,
            opacity: option(1),
            scale: String(interpolate(option(1), [0, 1], [0.9, 1])),
          }}
        >
          ولا لأ؟
        </div>
      </div>

      <div
        dir="rtl"
        style={{
          marginTop: 90,
          fontFamily: font.arDisplay,
          fontSize: 56,
          color: ink.soft,
          ...rise(frame, pollAt + 18),
        }}
      >
        قولّي رأيك في الكومنتات
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------------ */

const BEATS = [
  { from: CUE.word, to: CUE.who, name: "Word", C: WordBeat },
  { from: CUE.who, to: CUE.you, name: "Ask", C: AskBeat },
  { from: CUE.you, to: HOTEL_REALITY_DURATION, name: "Poll", C: PollBeat },
];

export const HotelReality: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(
    frame,
    [0, HOTEL_REALITY_DURATION],
    [1, 1.06],
    clamp,
  );

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

import {
  AbsoluteFill,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import "./fonts";
import { clamp, float, progress, rise, sec, travel } from "./lib/motion";
import { Paper } from "./lib/Paper";
import { font, ink, paper, red, shadow } from "./theme";

/**
 * Second insert for the fractional-ownership reel:
 *   "بس قبل ما تتحمس للفكرة، فيه 3 حاجات لازم تفهمهم
 *    العائد بيتحسب إزاي؟ ملكية حصتك متسجلة إزاي؟
 *    وهتبيع حصتك لمين لو حبيت تتخارج؟"
 *
 * Timed against SRT cues 30–35. Frame 0 is 00:00:28,466 in the full video,
 * so drop this clip on the timeline there.
 */
const T0 = 28.466;
const at = (srt: number) => sec(srt - T0);

const CUE = {
  before: at(28.466),
  three: at(30.033),
  understand: at(30.766),
  q1: at(31.966),
  q2: at(33.5),
  q3: at(35.2),
  end: at(37.233),
};

export const THREE_QUESTIONS_DURATION = CUE.end + 24;

/** The big 3 travels from centre stage into the header before card one lands. */
const MOVE_FROM = CUE.q1 - 18;
const MOVE_TO = CUE.q1;

const PercentIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width={84}
    height={84}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" x2="5" y1="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const DeedIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width={84}
    height={84}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="m9 15 2 2 4-4" />
  </svg>
);

const ExitIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg
    width={84}
    height={84}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const QUESTIONS = [
  {
    at: CUE.q1,
    n: "01",
    text: "العائد بيتحسب إزاي",
    Icon: PercentIcon,
    tilt: -2,
  },
  {
    at: CUE.q2,
    n: "02",
    text: "ملكية حصتك متسجلة إزاي",
    Icon: DeedIcon,
    tilt: 1.5,
  },
  {
    at: CUE.q3,
    n: "03",
    text: "هتبيع حصتك لمين لو حبيت تتخارج",
    Icon: ExitIcon,
    tilt: -1.5,
  },
] as const;

const CARD_TOP = 540;
const CARD_H = 300;
const CARD_GAP = 44;

const QuestionCard: React.FC<{
  frame: number;
  index: number;
}> = ({ frame, index }) => {
  const q = QUESTIONS[index];
  const next = QUESTIONS[index + 1];
  if (frame < q.at) return null;

  const enter = progress(frame, q.at, q.at + 20);
  // Once the next question lands, this one steps back.
  const back = next ? progress(frame, next.at, next.at + 12) : 0;
  const active = 1 - back;
  const { y: bob } = float(frame, index * 30);

  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: CARD_TOP + index * (CARD_H + CARD_GAP),
        height: CARD_H,
        opacity: enter * interpolate(back, [0, 1], [1, 0.5]),
        translate: `0px ${interpolate(enter, [0, 1], [60, 0]) + bob * active}px`,
        rotate: `${interpolate(enter, [0, 1], [q.tilt * 3, q.tilt])}deg`,
        scale: String(interpolate(back, [0, 1], [1, 0.96])),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 40,
          backgroundColor: paper.lift,
          boxShadow: `0 ${24 + active * 20}px ${50 + active * 30}px rgba(20,16,15,${0.08 + active * 0.06}), ${shadow.contact}`,
          display: "flex",
          alignItems: "center",
          gap: 40,
          padding: "0 50px",
        }}
      >
        {/* Number disc — fills red while this is the question on screen. */}
        <div
          style={{
            flexShrink: 0,
            width: 130,
            height: 130,
            borderRadius: "50%",
            border: `5px solid ${active > 0.5 ? red.base : ink.faint}`,
            backgroundColor: `rgba(224,26,43,${active})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 54,
            letterSpacing: "-0.03em",
            color: active > 0.5 ? paper.white : ink.soft,
          }}
        >
          {q.n}
        </div>
        <div
          style={{
            flex: 1,
            fontFamily: font.arDisplay,
            fontSize: index === 2 ? 64 : 76,
            lineHeight: 1.3,
            color: ink.full,
          }}
        >
          {q.text}
          <span style={{ color: red.base }}>؟</span>
        </div>
        <div style={{ flexShrink: 0, opacity: 0.85 }}>
          <q.Icon color={ink.full} />
        </div>
      </div>
    </div>
  );
};

export const ThreeQuestions: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(
    frame,
    [0, THREE_QUESTIONS_DURATION],
    [1, 1.06],
    clamp,
  );

  // Phase 1 — "بس قبل ما تتحمس للفكرة".
  const introOut = interpolate(
    frame,
    [CUE.three - 6, CUE.three + 2],
    [1, 0],
    clamp,
  );

  // Phase 2 — the big 3, then it travels into the header.
  const move = progress(frame, MOVE_FROM, MOVE_TO, travel);
  const threeX = interpolate(move, [0, 1], [540, 880]);
  const threeY = interpolate(move, [0, 1], [760, 330]);
  const threeScale = interpolate(move, [0, 1], [1, 0.3]);
  const { y: bob } = float(frame);
  const phase2TextOut = interpolate(
    frame,
    [MOVE_FROM - 4, MOVE_FROM + 6],
    [1, 0],
    clamp,
  );

  return (
    <Paper>
      <AbsoluteFill style={{ scale: String(push) }}>
        {/* Phase 1. */}
        {frame < CUE.three + 2 ? (
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              opacity: introOut,
              translate: `0px ${interpolate(introOut, [0, 1], [-40, 0])}px`,
            }}
          >
            <div dir="rtl" style={{ textAlign: "center", marginTop: -80 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  marginBottom: 40,
                  ...rise(frame, 0, 16),
                }}
              >
                {/* Pause mark — the brakes before the hype. */}
                <div style={{ display: "flex", gap: 10 }}>
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 16,
                        height: 50,
                        borderRadius: 5,
                        backgroundColor: red.base,
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: font.arDisplay,
                    fontSize: 48,
                    color: ink.soft,
                  }}
                >
                  استنى
                </span>
              </div>
              <Interactive.Div
                name="Before"
                style={{
                  fontFamily: font.arDisplay,
                  fontSize: 84,
                  color: ink.soft,
                  lineHeight: 1.3,
                  ...rise(frame, 2),
                }}
              >
                بس قبل ما
              </Interactive.Div>
              <Interactive.Div
                name="Hype"
                style={{
                  fontFamily: font.arDisplay,
                  fontSize: 140,
                  color: ink.full,
                  lineHeight: 1.3,
                  ...rise(frame, 10, 36),
                }}
              >
                تتحمس للفكرة
              </Interactive.Div>
            </div>
          </AbsoluteFill>
        ) : null}

        {/* Phase 2 — the big 3. */}
        {frame >= CUE.three ? (
          <>
            <div
              style={{
                position: "absolute",
                left: threeX,
                top: threeY + bob * (1 - move),
                translate: "-50% -50%",
                scale: String(threeScale),
              }}
            >
              <div
                style={{
                  fontFamily: font.display,
                  fontWeight: 800,
                  fontSize: 640,
                  lineHeight: 0.8,
                  letterSpacing: "-0.05em",
                  color: ink.full,
                  textShadow: "30px 50px 60px rgba(20,16,15,0.12)",
                  ...rise(frame, CUE.three, 80),
                }}
              >
                3
              </div>
            </div>

            <div
              dir="rtl"
              style={{
                position: "absolute",
                top: 1080,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: font.arDisplay,
                lineHeight: 1.3,
                opacity: phase2TextOut,
              }}
            >
              <div
                style={{
                  fontSize: 110,
                  color: ink.full,
                  ...rise(frame, CUE.three + 4),
                }}
              >
                حاجات
              </div>
              <div
                style={{
                  fontSize: 76,
                  color: ink.soft,
                  marginTop: 10,
                  ...rise(frame, CUE.understand),
                }}
              >
                لازم تكون فاهمهم{" "}
                <span
                  style={{
                    color: red.base,
                    opacity: progress(
                      frame,
                      CUE.understand + 10,
                      CUE.understand + 20,
                    ),
                  }}
                >
                  الأول
                </span>
              </div>
            </div>

            {/* Header text beside the docked 3. */}
            <div
              dir="rtl"
              style={{
                position: "absolute",
                top: 262,
                right: 290,
                fontFamily: font.arDisplay,
                lineHeight: 1.2,
                opacity: progress(frame, MOVE_TO - 6, MOVE_TO + 8),
                translate: `${interpolate(progress(frame, MOVE_TO - 6, MOVE_TO + 12), [0, 1], [30, 0])}px 0px`,
              }}
            >
              <div style={{ fontSize: 64, color: ink.full }}>حاجات لازم</div>
              <div style={{ fontSize: 64, color: ink.soft }}>
                تفهمهم <span style={{ color: red.base }}>الأول</span>
              </div>
            </div>
          </>
        ) : null}

        {QUESTIONS.map((_, i) => (
          <QuestionCard key={i} frame={frame} index={i} />
        ))}
      </AbsoluteFill>
    </Paper>
  );
};

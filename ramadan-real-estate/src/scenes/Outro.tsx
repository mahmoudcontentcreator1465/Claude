import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Paper } from "../lib/Paper";
import { EASE, font, ink, red } from "../theme";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const rise = (start: number) => ({
    opacity: interpolate(frame, [start, start + 18], [0, 1], {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
      easing: Easing.bezier(...EASE),
    }),
    translate: interpolate(
      frame,
      [start, start + 22],
      ["0px 26px", "0px 0px"],
      {
        extrapolateLeft: "clamp" as const,
        extrapolateRight: "clamp" as const,
        easing: Easing.bezier(...EASE),
      },
    ),
  });

  return (
    <Paper>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", padding: 96 }}
      >
        <div dir="rtl" style={{ textAlign: "center" }}>
          <Interactive.Div
            name="Kicker"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              marginBottom: 38,
              ...rise(0),
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
                fontFamily: font.ar,
                fontWeight: 600,
                fontSize: 32,
                color: ink.soft,
              }}
            >
              الخلاصة
            </span>
          </Interactive.Div>

          <Interactive.Div
            name="Claim"
            style={{
              fontFamily: font.ar,
              fontWeight: 700,
              fontSize: 96,
              color: ink.full,
              lineHeight: 1.2,
              ...rise(8),
            }}
          >
            أقوى براند
          </Interactive.Div>

          <Interactive.Div
            name="Negation"
            style={{
              fontFamily: font.ar,
              fontWeight: 600,
              fontSize: 56,
              color: ink.soft,
              lineHeight: 1.35,
              marginTop: 26,
              ...rise(18),
            }}
          >
            مش اللي الناس تعرفه
          </Interactive.Div>

          <Interactive.Div
            name="Payoff"
            style={{
              fontFamily: font.ar,
              fontWeight: 700,
              fontSize: 72,
              color: red.base,
              lineHeight: 1.3,
              marginTop: 32,
              ...rise(30),
            }}
          >
            ده اللي بيحوّل الشهرة لأصول
          </Interactive.Div>

          <div
            style={{
              height: 5,
              marginTop: 52,
              marginBottom: 46,
              marginInline: "auto",
              borderRadius: 3,
              backgroundColor: red.base,
              width: interpolate(frame, [40, 62], [0, 300], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE),
              }),
            }}
          />

          <Interactive.Div
            name="Question"
            style={{
              fontFamily: font.ar,
              fontWeight: 600,
              fontSize: 42,
              color: ink.full,
              lineHeight: 1.4,
              ...rise(46),
            }}
          >
            تفتكر دي قيمة حقيقية ولا اسم وبس؟
          </Interactive.Div>

          <Interactive.Div
            name="Signature"
            style={{
              fontFamily: font.ar,
              fontWeight: 400,
              fontSize: 28,
              color: ink.soft,
              marginTop: 30,
              letterSpacing: "0.04em",
              ...rise(56),
            }}
          >
            معتصم عبد العظيم
          </Interactive.Div>
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

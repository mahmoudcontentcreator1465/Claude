import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Paper } from "../lib/Paper";
import { EASE, font, ink, red, timing } from "../theme";

/** Lines rise in sequence; the red payoff lands last. */
const LINES = [
  { text: "مش نمبر ون في الفن بس", size: 74, color: ink.full, weight: 700 },
  { text: "دخل العقارات كمان", size: 92, color: red.base, weight: 700 },
] as const;

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Paper>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 96,
        }}
      >
        <div dir="rtl" style={{ textAlign: "center" }}>
          {/* Kicker */}
          <Interactive.Div
            name="Kicker"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              marginBottom: 34,
              opacity: interpolate(frame, [0, 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE),
              }),
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
                fontSize: 34,
                color: ink.soft,
              }}
            >
              درس في البراندينج
            </span>
          </Interactive.Div>

          {/* Name */}
          <Interactive.Div
            name="Name"
            style={{
              fontFamily: font.ar,
              fontWeight: 700,
              fontSize: 116,
              color: ink.full,
              lineHeight: 1.15,
              marginBottom: 44,
              opacity: interpolate(frame, [6, 24], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE),
              }),
              translate: interpolate(frame, [6, 28], ["0px 30px", "0px 0px"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE),
              }),
            }}
          >
            محمد رمضان
          </Interactive.Div>

          {LINES.map((line, i) => {
            const start = 18 + i * timing.stagger * 3;

            return (
              <Interactive.Div
                key={line.text}
                name={`Line ${i + 1}`}
                style={{
                  fontFamily: font.ar,
                  fontWeight: line.weight,
                  fontSize: line.size,
                  color: line.color,
                  lineHeight: 1.35,
                  opacity: interpolate(frame, [start, start + 18], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(...EASE),
                  }),
                  translate: interpolate(
                    frame,
                    [start, start + 22],
                    ["0px 26px", "0px 0px"],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(...EASE),
                    },
                  ),
                }}
              >
                {line.text}
              </Interactive.Div>
            );
          })}

          {/* The rule wipes in under the payoff. */}
          <div
            style={{
              height: 5,
              marginTop: 40,
              marginInline: "auto",
              borderRadius: 3,
              backgroundColor: red.base,
              width: interpolate(frame, [34, 58], [0, 260], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...EASE),
              }),
            }}
          />
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

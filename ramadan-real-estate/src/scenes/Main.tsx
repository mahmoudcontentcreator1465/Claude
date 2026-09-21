import { Video } from "@remotion/media";
import {
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Captions } from "../lib/Captions";
import { Paper } from "../lib/Paper";
import { EASE, font, ink, inset, paper, red, shadow } from "../theme";

/** The source is 480x854; the card keeps that aspect so nothing is cropped. */
const CARD_W = 680;
const CARD_H = 1210;
const CARD_TOP = 208;

export const Main: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  return (
    <Paper>
      {/* Brand bar */}
      <Interactive.Div
        name="Brand bar"
        style={{
          position: "absolute",
          top: 96,
          left: inset,
          right: inset,
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: interpolate(frame, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE),
          }),
        }}
      >
        <div
          dir="rtl"
          style={{ display: "flex", alignItems: "center", gap: 14 }}
        >
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              backgroundColor: red.base,
              scale: interpolate(
                Math.sin((frame / fps) * Math.PI * 1.1),
                [-1, 1],
                [0.82, 1.12],
              ),
            }}
          />
          <span
            style={{
              fontFamily: font.ar,
              fontWeight: 600,
              fontSize: 31,
              color: ink.full,
            }}
          >
            معتصم عبد العظيم
          </span>
        </div>

        <div
          dir="rtl"
          style={{
            fontFamily: font.ar,
            fontWeight: 600,
            fontSize: 23,
            color: red.deep,
            border: `1.5px solid ${red.base}`,
            borderRadius: 999,
            padding: "7px 20px",
            backgroundColor: red.wash,
          }}
        >
          براندينج
        </div>
      </Interactive.Div>

      {/* Paper card peeking out behind the footage — the collage move. */}
      <div
        style={{
          position: "absolute",
          top: CARD_TOP - 16,
          left: (width - CARD_W) / 2 + 22,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 36,
          backgroundColor: paper.lift,
          boxShadow: shadow.card,
          rotate: "2.6deg",
        }}
      />

      {/* The footage, floating on its shadow */}
      <Interactive.Div
        name="Footage card"
        style={{
          position: "absolute",
          top: CARD_TOP,
          left: (width - CARD_W) / 2,
          width: CARD_W,
          height: CARD_H,
          borderRadius: 36,
          overflow: "hidden",
          backgroundColor: ink.full,
          boxShadow: shadow.float,
          rotate: "-1.1deg",
          scale: interpolate(frame, [0, 24], [0.965, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE),
          }),
        }}
      >
        <Video
          src={staticFile("source.mp4")}
          durationInFrames={durationInFrames}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            /* Slow continuous push — always on in this style. */
            scale: interpolate(frame, [0, durationInFrames], [1, 1.06], {
              extrapolateRight: "clamp",
            }),
          }}
        />
      </Interactive.Div>

      {/* Captions sit on the paper below the card, not over the footage. */}
      <div
        style={{
          position: "absolute",
          top: CARD_TOP + CARD_H + 30,
          left: inset,
          width: 1080 - inset * 2,
          height: 250,
        }}
      >
        <Captions src="captions.srt" />
      </div>

      {/* Tags + progress */}
      <div
        dir="rtl"
        style={{
          position: "absolute",
          bottom: 116,
          left: inset,
          right: inset,
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          fontFamily: font.ar,
          fontWeight: 400,
          fontSize: 22,
          color: ink.soft,
          letterSpacing: "0.04em",
        }}
      >
        <span>براندينج · عقارات</span>
        <span dir="ltr" style={{ fontFamily: font.display, fontWeight: 800 }}>
          {String(Math.floor(frame / fps)).padStart(2, "0")}
          {" / "}
          {String(Math.floor(durationInFrames / fps)).padStart(2, "0")}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 86,
          left: inset,
          width: 1080 - inset * 2,
          height: 4,
          borderRadius: 2,
          backgroundColor: "rgba(20,16,15,0.10)",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            backgroundColor: red.base,
            width: `${interpolate(frame, [0, durationInFrames], [0, 100], {
              extrapolateRight: "clamp",
            })}%`,
          }}
        />
      </div>
    </Paper>
  );
};

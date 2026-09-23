import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../theme";

/** Fades a scene in over its first frames, and out over its last. */
export const Dissolve: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  inFrames?: number;
  outFrames?: number;
}> = ({ children, durationInFrames, inFrames = 0, outFrames = 0 }) => {
  const frame = useCurrentFrame();

  const fadeIn =
    inFrames > 0
      ? interpolate(frame, [0, inFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...EASE),
        })
      : 1;

  const fadeOut =
    outFrames > 0
      ? interpolate(
          frame,
          [durationInFrames - outFrames, durationInFrames],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE),
          },
        )
      : 1;

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      {children}
    </AbsoluteFill>
  );
};

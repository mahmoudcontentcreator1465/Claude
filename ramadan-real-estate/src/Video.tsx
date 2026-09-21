import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import "./fonts";
import { Intro } from "./scenes/Intro";
import { Main } from "./scenes/Main";
import { Outro } from "./scenes/Outro";
import { EASE, paper } from "./theme";

export const FPS = 30;

/** Source footage is 39.63s at 30fps. */
export const MAIN_DURATION = 1189;

const INTRO_DURATION = 95;
/** Scenes overlap so each hand-off is a cross-dissolve, not a cut. */
const MAIN_START = 87;
const OUTRO_START = MAIN_START + MAIN_DURATION - 8;
const OUTRO_DURATION = 135;

export const TOTAL_DURATION = OUTRO_START + OUTRO_DURATION;

/** Fades a scene in over its first frames, and out over its last. */
const Dissolve: React.FC<{
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
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>{children}</AbsoluteFill>
  );
};

export const HouseVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: paper.base }}>
      <Sequence from={0} durationInFrames={INTRO_DURATION} name="Intro">
        <Dissolve durationInFrames={INTRO_DURATION} outFrames={8}>
          <Intro />
        </Dissolve>
      </Sequence>

      <Sequence from={MAIN_START} durationInFrames={MAIN_DURATION} name="Main">
        <Dissolve durationInFrames={MAIN_DURATION} inFrames={8}>
          <Main durationInFrames={MAIN_DURATION} />
        </Dissolve>
      </Sequence>

      <Sequence
        from={OUTRO_START}
        durationInFrames={OUTRO_DURATION}
        name="Outro"
      >
        <Dissolve durationInFrames={OUTRO_DURATION} inFrames={10}>
          <Outro />
        </Dissolve>
      </Sequence>
    </AbsoluteFill>
  );
};

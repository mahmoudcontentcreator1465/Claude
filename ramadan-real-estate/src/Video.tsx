import { AbsoluteFill, Sequence } from "remotion";
import "./fonts";
import { Dissolve } from "./lib/Dissolve";
import { Intro } from "./scenes/Intro";
import { Main } from "./scenes/Main";
import { Outro } from "./scenes/Outro";
import { paper } from "./theme";

export const FPS = 30;

/** Source footage is 39.63s at 30fps. */
export const MAIN_DURATION = 1189;

const INTRO_DURATION = 95;
/** Scenes overlap so each hand-off is a cross-dissolve, not a cut. */
const MAIN_START = 87;
const OUTRO_START = MAIN_START + MAIN_DURATION - 8;
const OUTRO_DURATION = 135;

export const TOTAL_DURATION = OUTRO_START + OUTRO_DURATION;

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

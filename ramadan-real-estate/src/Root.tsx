import { Composition, Folder } from "remotion";
import "./index.css";
import {
  FPS,
  HouseVideo,
  MAIN_DURATION,
  TOTAL_DURATION,
} from "./Video";
import { Intro } from "./scenes/Intro";
import { Main } from "./scenes/Main";
import { Outro } from "./scenes/Outro";
import { canvas } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HouseVideo"
        component={HouseVideo}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={canvas.width}
        height={canvas.height}
      />
      <Folder name="Scenes">
        <Composition
          id="Intro"
          component={Intro}
          durationInFrames={95}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
        <Composition
          id="Main"
          component={Main}
          durationInFrames={MAIN_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
          defaultProps={{ durationInFrames: MAIN_DURATION }}
        />
        <Composition
          id="Outro"
          component={Outro}
          durationInFrames={135}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
      </Folder>
    </>
  );
};

import { Composition, Folder } from "remotion";
import "./index.css";
import { FPS, HouseVideo, MAIN_DURATION, TOTAL_DURATION } from "./Video";
import { BRAND_TO_ASSET_DURATION, BrandToAsset } from "./BrandToAsset";
import { FRACTIONAL_HOOK_DURATION, FractionalHook } from "./FractionalHook";
import {
  FractionalLowerThird,
  LOWER_THIRD_DURATION,
} from "./FractionalLowerThird";
import { AMARINA_NEWS_DURATION, AmarinaNews } from "./AmarinaNews";
import { HOTEL_HOOK_DURATION, HotelHook } from "./HotelHook";
import { HOTEL_REALITY_DURATION, HotelReality } from "./HotelReality";
import { Intro } from "./scenes/Intro";
import { Main } from "./scenes/Main";
import { Outro } from "./scenes/Outro";
import { THREE_QUESTIONS_DURATION, ThreeQuestions } from "./ThreeQuestions";
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
      <Composition
        id="BrandToAsset"
        component={BrandToAsset}
        durationInFrames={BRAND_TO_ASSET_DURATION}
        fps={FPS}
        width={canvas.width}
        height={canvas.height}
      />
      <Folder name="Fractional">
        <Composition
          id="FractionalHook"
          component={FractionalHook}
          durationInFrames={FRACTIONAL_HOOK_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
        <Composition
          id="FractionalLowerThird"
          component={FractionalLowerThird}
          durationInFrames={LOWER_THIRD_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
        <Composition
          id="ThreeQuestions"
          component={ThreeQuestions}
          durationInFrames={THREE_QUESTIONS_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
      </Folder>
      <Folder name="Amarina">
        <Composition
          id="HotelHook"
          component={HotelHook}
          durationInFrames={HOTEL_HOOK_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
        <Composition
          id="AmarinaNews"
          component={AmarinaNews}
          durationInFrames={AMARINA_NEWS_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
        <Composition
          id="HotelReality"
          component={HotelReality}
          durationInFrames={HOTEL_REALITY_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
      </Folder>
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

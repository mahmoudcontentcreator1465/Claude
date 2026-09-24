import { Composition, Folder } from "remotion";
import "./index.css";
import { FPS, HouseVideo, MAIN_DURATION, TOTAL_DURATION } from "./Video";
import { BRAND_TO_ASSET_DURATION, BrandToAsset } from "./BrandToAsset";
import { FRACTIONAL_HOOK_DURATION, FractionalHook } from "./FractionalHook";
import {
  FRACTIONAL_HOOK_GREEN_DURATION,
  FractionalHookGreen,
} from "./FractionalHookGreen";
import {
  FractionalLowerThird,
  LOWER_THIRD_DURATION,
} from "./FractionalLowerThird";
import { AMARINA_NEWS_DURATION, AmarinaNews } from "./AmarinaNews";
import { HOTEL_HOOK_DURATION, HotelHook } from "./HotelHook";
import { HOTEL_REALITY_DURATION, HotelReality } from "./HotelReality";
import { BTS_COMPARE_DURATION, BtsCompare } from "./BtsCompare";
import { RATE_DECISION_DURATION, RateDecision } from "./RateDecision";
import {
  RATE_FACTORS_GREEN_DURATION,
  RateFactorsGreen,
} from "./RateFactorsGreen";
import { RATE_HOOK_GREEN_DURATION, RateHookGreen } from "./RateHookGreen";
import { AIRPORT_EDIT_DURATION, AirportEdit } from "./AirportEdit";
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
          id="FractionalHookGreen"
          component={FractionalHookGreen}
          durationInFrames={FRACTIONAL_HOOK_GREEN_DURATION}
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
      <Folder name="Rates">
        <Composition
          id="RateHookGreen"
          component={RateHookGreen}
          durationInFrames={RATE_HOOK_GREEN_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
        <Composition
          id="RateDecision"
          component={RateDecision}
          durationInFrames={RATE_DECISION_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
        <Composition
          id="RateFactorsGreen"
          component={RateFactorsGreen}
          durationInFrames={RATE_FACTORS_GREEN_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
        <Composition
          id="BtsCompare"
          component={BtsCompare}
          durationInFrames={BTS_COMPARE_DURATION}
          fps={FPS}
          width={canvas.width}
          height={canvas.height}
        />
      </Folder>
      <Composition
        id="AirportEdit"
        component={AirportEdit}
        durationInFrames={AIRPORT_EDIT_DURATION}
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

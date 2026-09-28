import { AbsoluteFill, useCurrentFrame } from "remotion";
import "./fonts";
import { CHROMA, SlideStack, type Slide } from "./lib/greenscreen";
import { sec } from "./lib/motion";
import { font } from "./theme";

/**
 * Future Life — برادات السبيل. Very simple bilingual captions straight on
 * chroma green, no box behind them: Arabic on top (white, key words in the
 * brand teal) and the English line under it (white). Frame 0 =
 * 00:00:00,000 of the SRT (09283). Text is solid colour only, so it keys
 * cleanly; add any shadow in the edit after keying.
 */

const FL = {
  purple: "#361953",
  teal: "#5A9AB3",
  white: "#FFFFFF",
} as const;

const s = (x: number) => sec(x);

type Cap = {
  at: number;
  ar: [string, number, boolean?][];
  en: string;
};

const CAPS: Cap[] = [
  {
    at: 0.466,
    ar: [
      ["حين يكون", 0.466],
      ["وراء المشروع", 1.2],
    ],
    en: "When behind a project",
  },
  { at: 2.333, ar: [["هدف نبيل", 2.333, true]], en: "stands a noble purpose" },
  {
    at: 4.0,
    ar: [
      ["تصبح كل تفصيلة", 4.0],
      ["مهمة", 5.3, true],
    ],
    en: "every detail matters",
  },
  {
    at: 7.166,
    ar: [
      ["سعدنا في", 7.166],
      ["فيوتشر لايف", 7.8, true],
    ],
    en: "At Future Life, we were delighted",
  },
  { at: 9.133, ar: [["بالتعاون مع مؤسسة", 9.133]], en: "to work with" },
  {
    at: 10.666,
    ar: [["رواق عوشة بنت حسين الثقافي", 10.666, true]],
    en: "Rewaq Ousha Bint Hussain Cultural Centre",
  },
  {
    at: 13.4,
    ar: [
      ["وبالتعاون مع", 13.4],
      ["جلف نيوز ميديا", 14.3, true],
    ],
    en: "and Gulf News Media",
  },
  { at: 16.0, ar: [["في تنفيذ مشروع", 16.0]], en: "on delivering the project" },
  {
    at: 17.466,
    ar: [["برادات السبيل", 17.466, true]],
    en: "Sabeel Water Coolers",
  },
  {
    at: 19.466,
    ar: [["حرصنا على أن نكون شركاء", 19.466]],
    en: "We made sure to be partners",
  },
  { at: 21.4, ar: [["في النجاح", 21.4, true]], en: "in its success" },
  {
    at: 22.5,
    ar: [
      ["فعملنا بدقة", 22.5],
      ["واهتمام", 23.866, true],
    ],
    en: "working with precision and care",
  },
  {
    at: 24.9,
    ar: [["وبذلنا أقصى جهودنا", 24.9]],
    en: "and giving it our very best",
  },
  {
    at: 27.266,
    ar: [["حتى يخرج المشروع", 27.266]],
    en: "so the project would come out",
  },
  {
    at: 28.533,
    ar: [["بالصورة التي أرادوها", 28.533, true]],
    en: "exactly as they envisioned",
  },
  { at: 31.066, ar: [["كل تفصيلة", 31.066, true]], en: "Every detail" },
  { at: 32.166, ar: [["كانت محل اهتمام", 32.166]], en: "was given attention" },
  { at: 34.166, ar: [["وكل خطوة", 34.166, true]], en: "and every step" },
  { at: 35.2, ar: [["كان هدفها واحدا", 35.2]], en: "had one goal" },
  {
    at: 37.2,
    ar: [
      ["أن نقدم", 37.2],
      ["عملا يليق", 38.1],
    ],
    en: "to deliver work worthy",
  },
  { at: 39.4, ar: [["بهذا المشروع", 39.4, true]], en: "of this project" },
  {
    at: 41.2,
    ar: [
      ["نفخر بهذه", 41.2],
      ["الشراكة", 42.0, true],
    ],
    en: "We are proud of this partnership",
  },
  {
    at: 43.366,
    ar: [
      ["ونسعد بأن", 43.366],
      ["يكون لنا دور", 44.366],
    ],
    en: "and glad to have played a part",
  },
  {
    at: 45.366,
    ar: [
      ["في عمل يحمل", 45.366],
      ["هذا الأثر", 46.6, true],
    ],
    en: "in work that carries such impact",
  },
  {
    at: 48.566,
    ar: [
      ["نسأل الله", 48.566],
      ["القبول", 49.2, true],
    ],
    en: "We ask God to accept it",
  },
  {
    at: 50.566,
    ar: [["وأن يجعل هذا العمل خيرا", 50.566]],
    en: "and make this work a good",
  },
  { at: 52.5, ar: [["ممتدا للجميع", 52.5, true]], en: "that reaches everyone" },
  {
    at: 54.666,
    ar: [
      ["ساهم في صناعة", 54.666],
      ["أثر يبقى", 55.9, true],
    ],
    en: "Help create an impact that lasts",
  },
  {
    at: 57.533,
    ar: [
      ["فالعطاء حين يمتد", 57.533],
      ["يبقى أثره", 59.0, true],
    ],
    en: "Giving that reaches far leaves a lasting mark",
  },
];

const AR: Slide[] = CAPS.map((c) => ({
  at: s(c.at),
  parts: c.ar.map(([text, at, accent]) => ({ text, at: s(at), accent })),
}));

const EN: Slide[] = CAPS.map((c) => ({
  at: s(c.at),
  parts: [{ text: c.en, at: s(c.at) + 4 }],
}));

const END = s(60.7);
export const FUTURE_LIFE_CAPTIONS_DURATION = END + 20;

/** Both lines clear out together once the last caption has been read. */
const Out: React.FC<{ frame: number; children: React.ReactNode }> = ({
  frame,
  children,
}) => (frame < END + 6 ? <>{children}</> : null);

export const FutureLifeCaptions: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: CHROMA }}>
      <Out frame={frame}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 1470 }}>
          <SlideStack
            frame={frame}
            slides={AR}
            height={100}
            justify="center"
            renderPart={(p, shown) => (
              <span
                style={{
                  display: "inline-block",
                  fontFamily: font.arDisplay,
                  fontSize: 62,
                  lineHeight: 1,
                  color: p.accent ? FL.teal : FL.white,
                  translate: `0px ${(1 - shown) * 34}px`,
                  clipPath: `inset(0 0 ${(1 - shown) * 100}% 0)`,
                }}
              >
                {p.text}
              </span>
            )}
          />
        </div>
        <div
          dir="ltr"
          style={{ position: "absolute", left: 60, right: 60, top: 1574 }}
        >
          <SlideStack
            frame={frame}
            slides={EN}
            height={60}
            justify="center"
            renderPart={(p, shown) => (
              <span
                style={{
                  display: "inline-block",
                  fontFamily: font.display,
                  fontWeight: 700,
                  fontSize: 38,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  color: FL.white,
                  translate: `0px ${(1 - shown) * 24}px`,
                  clipPath: `inset(0 0 ${(1 - shown) * 100}% 0)`,
                }}
              >
                {p.text}
              </span>
            )}
          />
        </div>
      </Out>
    </AbsoluteFill>
  );
};

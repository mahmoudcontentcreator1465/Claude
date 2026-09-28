import { AbsoluteFill, useCurrentFrame } from "remotion";
import "./fonts";
import { progress, sec } from "./lib/motion";
import { font } from "./theme";

/**
 * Future Life — برادات السبيل. Very simple bilingual captions on a
 * transparent background (render with alpha): Arabic on top in white, key
 * words in a light brand teal, English under it in white, all with a soft
 * teal/purple glow so they read over any shot. Frame 0 = 00:00:00,000 of the
 * SRT (09283).
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

const END = s(60.7);
export const FUTURE_LIFE_CAPTIONS_DURATION = END + 20;

/** Light teal for the accent words, so they still glow on dark shots. */
const TEAL_LIGHT = "#7DB8CE";

const glow = (color: string) =>
  `0 0 3px rgba(54,25,83,0.7), 0 0 12px ${color}, 0 0 30px ${color}, 0 0 60px rgba(54,25,83,0.55)`;

const TEAL_GLOW = "rgba(90,154,179,0.85)";

/** Which caption is on screen, and how far it has come in / gone out. */
const useCaption = (frame: number) => {
  let i = -1;
  for (let k = 0; k < CAPS.length; k++) if (frame >= s(CAPS[k].at)) i = k;
  if (i < 0) return null;
  const cap = CAPS[i];
  const next = CAPS[i + 1];
  const outAt = next ? s(next.at) : END + 6;
  const out = progress(frame, outAt - 5, outAt);
  return { cap, out };
};

export const FutureLifeCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const cur = useCaption(frame);
  if (!cur) return <AbsoluteFill />;
  const { cap, out } = cur;
  const enIn = progress(frame, s(cap.at) + 4, s(cap.at) + 16);

  return (
    <AbsoluteFill>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 1480,
          display: "flex",
          justifyContent: "center",
          gap: "0.28em",
          opacity: 1 - out,
          translate: `0px ${-out * 16}px`,
        }}
      >
        {cap.ar.map(([text, at, accent]) => {
          const shown = progress(frame, s(at), s(at) + 12);
          if (frame < s(at)) return null;
          return (
            <span
              key={text}
              style={{
                fontFamily: font.arDisplay,
                fontSize: 64,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                color: accent ? TEAL_LIGHT : FL.white,
                textShadow: glow(TEAL_GLOW),
                opacity: shown,
                translate: `0px ${(1 - shown) * 26}px`,
                filter: `blur(${(1 - shown) * 6}px)`,
              }}
            >
              {text}
            </span>
          );
        })}
      </div>
      <div
        dir="ltr"
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 1586,
          textAlign: "center",
          fontFamily: font.display,
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          color: FL.white,
          textShadow: glow(TEAL_GLOW),
          opacity: enIn * (1 - out),
          translate: `0px ${(1 - enIn) * 18 - out * 16}px`,
          filter: `blur(${(1 - enIn) * 5}px)`,
        }}
      >
        {cap.en}
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import "./fonts";
import { CHROMA, SlideStack, type Slide } from "./lib/greenscreen";
import { progress, sec, travel } from "./lib/motion";
import { font } from "./theme";

/**
 * Future Life — برادات السبيل. Simple green-screen caption bar in the brand
 * colours sampled from the logo: purple #361953 and teal #5A9AB3. White
 * capsule, purple words, teal key words, and a purple tag carrying the white
 * logo. Frame 0 = 00:00:00,000 of the SRT (09283).
 */

const FL = {
  purple: "#361953",
  teal: "#5A9AB3",
  white: "#FFFFFF",
} as const;

const s = (x: number) => sec(x);

type Word = { t: string; at: number; accent?: boolean; latin?: boolean };
const line = (at: number, ...words: Word[]): Slide => ({
  at: s(at),
  parts: words.map((w) => ({
    text: w.t,
    at: s(w.at),
    accent: w.accent,
    latin: w.latin,
  })),
});
const w = (t: string, at: number, accent?: boolean, latin?: boolean): Word => ({
  t,
  at,
  accent,
  latin,
});

const SLIDES: Slide[] = [
  line(0.466, w("حين يكون", 0.466), w("وراء المشروع", 1.2)),
  line(2.333, w("هدف نبيل", 2.333, true)),
  line(4.0, w("تصبح كل تفصيلة", 4.0), w("مهمة", 5.3, true)),
  line(7.166, w("سعدنا في", 7.166), w("Future Life", 7.8, true, true)),
  line(9.133, w("بالتعاون مع مؤسسة", 9.133)),
  line(10.666, w("رواق عوشة بنت حسين الثقافي", 10.666, true)),
  line(13.4, w("وبالتعاون مع", 13.4), w("Gulf News Media", 14.3, true, true)),
  line(16.0, w("في تنفيذ مشروع", 16.0)),
  line(17.466, w("برادات السبيل", 17.466, true)),
  line(19.466, w("حرصنا على أن نكون شركاء", 19.466)),
  line(21.4, w("في النجاح", 21.4, true)),
  line(22.5, w("فعملنا بدقة", 22.5), w("واهتمام", 23.866, true)),
  line(24.9, w("وبذلنا أقصى جهودنا", 24.9)),
  line(27.266, w("حتى يخرج المشروع", 27.266)),
  line(28.533, w("بالصورة التي أرادوها", 28.533, true)),
  line(31.066, w("كل تفصيلة", 31.066, true)),
  line(32.166, w("كانت محل اهتمام", 32.166)),
  line(34.166, w("وكل خطوة", 34.166, true)),
  line(35.2, w("كان هدفها واحدا", 35.2)),
  line(37.2, w("أن نقدم", 37.2), w("عملا يليق", 38.1)),
  line(39.4, w("بهذا المشروع", 39.4, true)),
  line(41.2, w("نفخر بهذه", 41.2), w("الشراكة", 42.0, true)),
  line(43.366, w("ونسعد بأن", 43.366), w("يكون لنا دور", 44.366)),
  line(45.366, w("في عمل يحمل", 45.366), w("هذا الأثر", 46.6, true)),
  line(48.566, w("نسأل الله", 48.566), w("القبول", 49.2, true)),
  line(50.566, w("وأن يجعل هذا العمل خيرا", 50.566)),
  line(52.5, w("ممتدا للجميع", 52.5, true)),
  line(54.666, w("ساهم في صناعة", 54.666), w("أثر يبقى", 55.9, true)),
  line(57.533, w("فالعطاء حين يمتد", 57.533), w("يبقى أثره", 59.0, true)),
];

const END = s(60.7);
export const FUTURE_LIFE_CAPTIONS_DURATION = END + 24;

const BAR = { left: 60, top: 1500, width: 960, height: 170 };

export const FutureLifeCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const open =
    progress(frame, 0, 14) * (1 - progress(frame, END + 8, END + 20, travel));
  const tag =
    progress(frame, 8, 20) * (1 - progress(frame, END + 4, END + 12, travel));
  const rule = progress(frame, 10, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: CHROMA }}>
      <div
        style={{
          position: "absolute",
          ...BAR,
          borderRadius: 28,
          backgroundColor: FL.white,
          clipPath: `inset(0 ${(1 - open) * 50}% 0 ${(1 - open) * 50}% round 28px)`,
        }}
      >
        {/* Teal rule on the reading edge. */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 14,
            backgroundColor: FL.teal,
            clipPath: `inset(${(1 - rule) * 100}% 0 0 0)`,
          }}
        />
        <div style={{ position: "absolute", left: 50, right: 60, top: 32 }}>
          <SlideStack
            frame={frame}
            slides={SLIDES}
            height={106}
            justify="center"
            renderPart={(p, shown) => (
              <span
                style={{
                  display: "inline-block",
                  fontFamily: p.latin ? font.display : font.arDisplay,
                  fontWeight: p.latin ? 800 : undefined,
                  letterSpacing: p.latin ? "-0.02em" : undefined,
                  fontSize: p.latin ? 58 : 60,
                  lineHeight: 1,
                  color: p.accent ? FL.teal : FL.purple,
                  translate: `0px ${(1 - shown) * 34}px`,
                  clipPath: `inset(0 0 ${(1 - shown) * 100}% 0)`,
                }}
              >
                {p.text}
              </span>
            )}
          />
        </div>
      </div>

      {/* Purple tag with the white logo, riding the bar's top edge. */}
      <div
        style={{
          position: "absolute",
          right: BAR.left + 50,
          top: BAR.top - 44,
          height: 76,
          padding: "0 26px",
          borderRadius: 20,
          backgroundColor: FL.purple,
          display: "flex",
          alignItems: "center",
          clipPath: `inset(${(1 - tag) * 100}% 0 0 0 round 20px)`,
          translate: `0px ${(1 - tag) * 24}px`,
        }}
      >
        <Img
          src={staticFile("futurelife/logo-white.png")}
          style={{ height: 46, display: "block" }}
        />
      </div>
    </AbsoluteFill>
  );
};

import { AbsoluteFill, useCurrentFrame } from "remotion";
import "./fonts";
import { CHROMA, SlideStack, type Slide } from "./lib/greenscreen";
import { progress, sec, travel } from "./lib/motion";
import { SfxTrack } from "./hajj/sfx";
import { C, font } from "./go2cairo/theme";

/**
 * "رحلتك في القاهرة مع أبو خالد" — a deliberately simple green-screen caption
 * bar in the Go2Cairo look: navy capsule, sand words, sun-orange accents and
 * a small Go2Cairo tag. Frame 0 = 00:00:00,000 of the SRT (09271).
 */

const s = (x: number) => sec(x);

const P = (text: string, at: number, accent?: boolean) => ({
  text,
  at: s(at),
  accent,
});

const SLIDES: Slide[] = [
  { at: s(0.133), parts: [P("رحلتك في", 0.133), P("القاهرة", 0.5, true)] },
  { at: s(1.1), parts: [P("مع أبو خالد", 1.1, true)] },
  { at: s(1.9), parts: [P("يبقى تبدأ يومك بفطار", 1.9)] },
  { at: s(3.533), parts: [P("شعبي أصيل", 3.533, true)] },
  {
    at: s(4.666),
    parts: [
      P("فول،", 4.666, true),
      P("طعمية،", 5.033, true),
      P("بتنجان", 5.6, true),
    ],
  },
  { at: s(6.366), parts: [P("بابا غنوج", 6.366, true)] },
  { at: s(7.266), parts: [P("يلا بينا", 7.266)] },
  {
    at: s(7.733),
    parts: [P("وطبعاً مع بداية", 7.733), P("كل رحلة", 8.933, true)],
  },
  { at: s(9.9), parts: [P("لازم زي ما انتو شايفين", 9.9)] },
  { at: s(11.2), parts: [P("كده نغسل", 11.2), P("السيارة", 11.8, true)] },
  {
    at: s(12.4),
    parts: [P("ونعقّمها", 12.4, true), P("وننضّفها", 13.433, true)],
  },
  { at: s(14.7), parts: [P("عشان تكون راكب", 14.7)] },
  { at: s(15.7), parts: [P("وانت مرتاح", 15.7, true)] },
  { at: s(16.5), parts: [P("وده بيحصل بس عند مين؟", 16.5)] },
  { at: s(17.966), parts: [P("عند", 17.966), P("أبو خالد", 18.1, true)] },
  {
    at: s(18.733),
    parts: [P("رحلتك مميزة", 18.733, true), P("في القاهرة", 19.6)],
  },
  { at: s(20.433), parts: [P("وكده نكون جاهزين نبدأ", 20.433)] },
  { at: s(22.1), parts: [P("رحلتنا مع", 22.1), P("أبو خالد", 22.6, true)] },
];

const END = s(23.366);
export const ABU_KHALED_GREEN_DURATION = END + 24;

const BAR = { left: 70, top: 1500, width: 940, height: 170 };

export const AbuKhaledGreen: React.FC = () => {
  const frame = useCurrentFrame();
  const open =
    progress(frame, 0, 12) * (1 - progress(frame, END + 8, END + 20, travel));
  const tag =
    progress(frame, 8, 18) * (1 - progress(frame, END + 4, END + 12, travel));

  return (
    <AbsoluteFill style={{ backgroundColor: CHROMA }}>
      {/* Go2Cairo tag riding the bar's top-left corner. */}
      <div
        style={{
          position: "absolute",
          left: BAR.left + 36,
          top: BAR.top - 30,
          height: 56,
          padding: "0 24px",
          borderRadius: 28,
          backgroundColor: C.sun,
          display: "flex",
          alignItems: "center",
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: "-0.02em",
          color: C.navy,
          zIndex: 1,
          clipPath: `inset(${(1 - tag) * 100}% 0 0 0 round 28px)`,
          translate: `0px ${(1 - tag) * 20}px`,
        }}
      >
        Go2Cairo
      </div>

      <div
        style={{
          position: "absolute",
          ...BAR,
          borderRadius: BAR.height / 2,
          background: `linear-gradient(165deg, ${C.night} 0%, ${C.night2} 100%)`,
          clipPath: `inset(0 ${(1 - open) * 50}% 0 ${(1 - open) * 50}% round ${BAR.height / 2}px)`,
        }}
      >
        <div style={{ position: "absolute", left: 50, right: 50, top: 30 }}>
          <SlideStack
            frame={frame}
            slides={SLIDES}
            height={110}
            justify="center"
            renderPart={(p, shown) => (
              <span
                style={{
                  display: "inline-block",
                  fontFamily: font.arDisplay,
                  fontSize: 62,
                  lineHeight: 1,
                  color: p.accent ? C.sun : C.sand,
                  translate: `0px ${(1 - shown) * 36}px`,
                  clipPath: `inset(0 0 ${(1 - shown) * 100}% 0)`,
                }}
              >
                {p.text}
              </span>
            )}
          />
        </div>
      </div>

      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.6 },
          ...SLIDES.slice(1).map((sl) => ({
            at: sl.at,
            name: "swipe" as const,
            volume: 0.35,
          })),
          { at: s(7.266), name: "pop", volume: 0.6 },
          { at: s(13.433), name: "tick", volume: 0.7 },
          { at: s(18.1), name: "chime", volume: 0.5 },
          { at: s(22.6), name: "ding", volume: 0.6 },
          { at: END + 8, name: "whoosh", volume: 0.5 },
        ]}
      />
    </AbsoluteFill>
  );
};

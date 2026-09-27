import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import "./fonts";
import { Strip, Top } from "./HajjGreen";
import { CHROMA, SlideStack, type Slide } from "./lib/greenscreen";
import { Chip, GreenCard, Headline, Layer } from "./go2cairo/style";
import { SfxTrack } from "./hajj/sfx";
import { accent as brown, font, ink, paper, tan } from "./go2cairo/theme";
import { Icon, paths } from "./lib/Icon";
import { progress, sec, travel } from "./lib/motion";

/**
 * "أهم 3 حاجات مع رحلتك" — the whole clip as one green-screen overlay, in the
 * Go2Cairo look (navy, sand, sun orange). Frame 0 = 00:00:00,000 of the SRT (0927).
 *
 * Mixed on purpose: tips 1 and 3 are motion-graphic cards, tip 2 and the
 * "third thing" line are a simple kinetic text bar.
 */

const at = (s: number) => sec(s);

const CUE = {
  top3: at(0.1),
  mind: at(1.166),
  trip: at(2.4),
  abuKhaled: at(2.9),
  passport: at(3.666),
  hotel: at(4.2),
  photo: at(5.166),
  keep: at(6.266),
  currency: at(6.966),
  change: at(8.0),
  exchange: at(9.5),
  anywhere: at(10.466),
  official: at(11.166),
  officialOnly: at(12.0),
  third: at(13.3),
  organize: at(14.666),
  schedule: at(15.666),
  today: at(16.466),
  tour: at(17.266),
  stops: at(18.9),
  so: at(20.233),
  end: at(21.7),
};

/** Segment boundaries: card 1 → text bar → card 2. */
const CARD1_END = CUE.currency;
const BAR_END = CUE.organize;
export const TOURIST_TIPS_GREEN_DURATION = CUE.end + 30;

/* Local icons. */
const passportIcon = (
  <>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <circle cx="12" cy="10" r="4" />
    <path d="M8 10h8M12 6c1.6 1.3 1.6 6.7 0 8M12 6c-1.6 1.3-1.6 6.7 0 8M9 17.5h6" />
  </>
);

const border = "rgba(10,31,51,0.10)";

/* ======================================================================== */
/* Card 1 — "أهم 3 حاجات… مع أبو خالد" then tip 1, the passport.            */
/* ======================================================================== */

const Slot: React.FC<{
  frame: number;
  at: number;
  n: string;
  icon: React.ReactNode;
}> = ({ frame, at: from, n, icon }) => {
  const shown = progress(frame, from, from + 12);
  return (
    <div
      style={{
        position: "relative",
        width: 220,
        height: 180,
        borderRadius: 28,
        backgroundColor: paper.white,
        border: `2px solid ${border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        translate: `0px ${(1 - shown) * 40}px`,
        clipPath: `inset(${(1 - shown) * 100}% -20px -20px -20px round 28px)`,
      }}
    >
      <Icon size={72}>{icon}</Icon>
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          width: 50,
          height: 50,
          borderRadius: "50%",
          backgroundColor: brown.base,
          color: paper.lift,
          fontFamily: font.display,
          fontWeight: 800,
          fontSize: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </div>
    </div>
  );
};

const CardOne: React.FC = () => {
  const frame = useCurrentFrame();
  const slides: Slide[] = [
    {
      at: CUE.top3,
      parts: [
        { text: "أهم", at: CUE.top3 },
        { text: "3", at: CUE.top3 + 3, latin: true, accent: true },
        { text: "حاجات", at: CUE.top3 + 6 },
      ],
    },
    { at: CUE.mind, parts: [{ text: "تاخد بالك منهم", at: CUE.mind }] },
    {
      at: CUE.trip,
      parts: [
        { text: "مع رحلتك", at: CUE.trip },
        { text: "مع أبو خالد", at: CUE.abuKhaled, accent: true },
      ],
    },
    {
      at: CUE.passport,
      parts: [{ text: "باسبورك", at: CUE.passport, accent: true }],
    },
    { at: CUE.hotel, parts: [{ text: "تسيبه في الفندق", at: CUE.hotel }] },
    {
      at: CUE.photo,
      parts: [
        { text: "تصوّره على", at: CUE.photo },
        { text: "الموبايل", at: CUE.photo + 6, accent: true },
      ],
    },
    {
      at: CUE.keep,
      parts: [
        { text: "وتخليه", at: CUE.keep },
        { text: "معاك", at: CUE.keep + 4, accent: true },
      ],
    },
  ];
  const tabs: Slide[] = [
    { at: 0, parts: [{ text: "نصايح رحلتك", at: 0 }] },
    { at: CUE.passport, parts: [{ text: "أولاً", at: CUE.passport }] },
  ];

  // Passport walks into the hotel, then a copy lands on the phone.
  const toHotel = progress(frame, CUE.hotel, CUE.hotel + 16, travel);
  const phoneIn = progress(frame, CUE.photo - 4, CUE.photo + 10);
  const flash =
    progress(frame, CUE.photo + 8, CUE.photo + 11) *
    (1 - progress(frame, CUE.photo + 11, CUE.photo + 20));
  const copy = progress(frame, CUE.photo + 10, CUE.photo + 18);
  const kept = progress(frame, CUE.keep + 2, CUE.keep + 12);
  const hotelLit = progress(frame, CUE.hotel + 12, CUE.hotel + 18);

  return (
    <GreenCard
      frame={frame}
      tabs={tabs}
      outFrom={CARD1_END - 16}
      outTo={CARD1_END}
    >
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        {/* The three things, as numbered slots. */}
        <Layer frame={frame} from={CUE.mind - 6} to={CUE.passport}>
          <div
            dir="rtl"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 36,
              paddingTop: 36,
            }}
          >
            <Slot frame={frame} at={CUE.mind} n="1" icon={passportIcon} />
            <Slot frame={frame} at={CUE.mind + 5} n="2" icon={paths.coins} />
            <Slot
              frame={frame}
              at={CUE.mind + 10}
              n="3"
              icon={paths.calendar}
            />
          </div>
        </Layer>

        {/* Tip 1: hotel ← passport → phone. */}
        <Layer frame={frame} from={CUE.passport}>
          <div
            dir="rtl"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "36px 20px 0",
              height: 250,
              boxSizing: "border-box",
            }}
          >
            {/* Hotel, right. */}
            <div style={{ position: "relative" }}>
              <Chip
                frame={frame}
                at={CUE.hotel - 4}
                icon={paths.building}
                label="الفندق"
                width={240}
                accent={hotelLit > 0.5}
              />
            </div>

            {/* Passport, centre → slides into the hotel. */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 46,
                width: 150,
                height: 190,
                marginLeft: -75,
                borderRadius: 18,
                backgroundColor: brown.base,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                translate: `${toHotel * 250}px ${(1 - progress(frame, CUE.passport, CUE.passport + 12)) * 60}px`,
                scale: `${1 - toHotel * 0.55}`,
                clipPath: `inset(${(1 - progress(frame, CUE.passport, CUE.passport + 12)) * 100}% 0 0 0 round 18px)`,
                opacity: toHotel > 0.98 ? 0 : 1,
              }}
            >
              <Icon size={96} color={paper.lift} stroke={1.6}>
                {passportIcon}
              </Icon>
            </div>

            {/* Phone, left, with the photographed copy. */}
            <div
              style={{
                position: "relative",
                width: 150,
                height: 220,
                borderRadius: 30,
                backgroundColor: tan.base,
                padding: 10,
                boxSizing: "border-box",
                translate: `0px ${(1 - phoneIn) * 60}px`,
                clipPath: `inset(${(1 - phoneIn) * 100}% -20px -20px -20px round 30px)`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 22,
                  backgroundColor: paper.lift,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: 76,
                    height: 100,
                    borderRadius: 10,
                    backgroundColor: brown.base,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    scale: `${copy}`,
                  }}
                >
                  <Icon size={52} color={paper.lift} stroke={1.8}>
                    {passportIcon}
                  </Icon>
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: paper.white,
                    opacity: flash,
                  }}
                />
              </div>
              {/* "With you" check. */}
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: -12,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: brown.base,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: `${kept}`,
                }}
              >
                <Icon size={34} color={paper.lift} stroke={3}>
                  {paths.check}
                </Icon>
              </div>
            </div>
          </div>
        </Layer>
      </Strip>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.8 },
          { at: CUE.top3 + 3, name: "pop" },
          { at: CUE.mind, name: "swipe" },
          { at: CUE.mind, name: "pop", volume: 0.6 },
          { at: CUE.mind + 5, name: "pop", volume: 0.6 },
          { at: CUE.mind + 10, name: "pop", volume: 0.6 },
          { at: CUE.trip, name: "swipe" },
          { at: CUE.abuKhaled, name: "chime", volume: 0.6 },
          { at: CUE.passport, name: "swipe" },
          { at: CUE.passport, name: "pop" },
          { at: CUE.hotel, name: "whoosh", volume: 0.6 },
          { at: CUE.hotel + 14, name: "tick" },
          { at: CUE.photo - 4, name: "pop" },
          { at: CUE.photo + 8, name: "key", volume: 0.9 },
          { at: CUE.photo + 9, name: "tick" },
          { at: CUE.keep + 2, name: "ding", volume: 0.8 },
          { at: CARD1_END - 16, name: "whoosh", volume: 0.6 },
        ]}
      />
    </GreenCard>
  );
};

/* ======================================================================== */
/* Text bar — tip 2 (currency) and "the third thing, the most important".   */
/* ======================================================================== */

const BAR = { left: 70, top: 1480, width: 940, height: 190 };

const TextBar: React.FC = () => {
  const frame = useCurrentFrame();
  const o = CUE.currency; // this sequence starts at the currency cue
  const f = (s: number) => s - o;
  const slides: Slide[] = [
    {
      at: f(CUE.currency),
      parts: [
        { text: "معاك", at: f(CUE.currency) },
        { text: "عملة", at: f(CUE.currency) + 4, accent: true },
      ],
    },
    {
      at: f(CUE.change),
      parts: [
        { text: "تغيّرها", at: f(CUE.change) },
        { text: "change", at: f(CUE.change) + 10, latin: true, accent: true },
      ],
    },
    {
      at: f(CUE.exchange),
      parts: [
        { text: "في أي", at: f(CUE.exchange) },
        { text: "صرافة", at: f(CUE.exchange) + 4, accent: true },
      ],
    },
    {
      at: f(CUE.anywhere),
      parts: [{ text: "أو أي مكان بيصرف", at: f(CUE.anywhere) }],
    },
    {
      at: f(CUE.official),
      parts: [
        { text: "من الأماكن", at: f(CUE.official) },
        { text: "الرسمية بس", at: f(CUE.officialOnly), accent: true },
      ],
    },
    {
      at: f(CUE.third),
      parts: [
        { text: "ثالث حاجة", at: f(CUE.third) },
        { text: "وده الأهم", at: f(CUE.third) + 14, accent: true },
      ],
    },
  ];
  const badge = frame < f(CUE.third) ? "2" : "3";
  const len = BAR_END - o;
  const inT = progress(frame, 0, 12);
  const outT = progress(frame, len - 10, len, travel);
  const open = inT * (1 - outT);
  const badgeSwap = progress(frame, f(CUE.third), f(CUE.third) + 10);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          ...BAR,
          borderRadius: 32,
          backgroundColor: ink.full,
          clipPath: `inset(0 ${(1 - open) * 50}% 0 ${(1 - open) * 50}% round 32px)`,
        }}
      >
        {/* Number badge. */}
        <div
          style={{
            position: "absolute",
            right: 28,
            top: 45,
            width: 100,
            height: 100,
            borderRadius: "50%",
            backgroundColor: brown.base,
            color: paper.lift,
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            rotate: `${badgeSwap * 360}deg`,
          }}
        >
          {badge}
        </div>
        <div style={{ position: "absolute", left: 40, right: 156, top: 35 }}>
          <SlideStack
            frame={frame}
            slides={slides}
            height={120}
            renderPart={(p, shown) => (
              <span
                style={{
                  display: "inline-block",
                  fontFamily: p.latin ? font.display : font.arDisplay,
                  fontWeight: p.latin ? 800 : undefined,
                  fontSize: p.latin ? 70 : 64,
                  lineHeight: 1,
                  color: p.accent ? brown.light : paper.lift,
                  translate: `0px ${(1 - shown) * 40}px`,
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
          { at: 0, name: "whoosh", volume: 0.7 },
          { at: f(CUE.change), name: "swipe" },
          { at: f(CUE.exchange), name: "swipe" },
          { at: f(CUE.anywhere), name: "swipe" },
          { at: f(CUE.official), name: "swipe" },
          { at: f(CUE.officialOnly), name: "tick" },
          { at: f(CUE.third), name: "swipe" },
          { at: f(CUE.third) + 2, name: "pop" },
          { at: f(CUE.third) + 14, name: "chime", volume: 0.6 },
          { at: len - 10, name: "whoosh", volume: 0.6 },
        ]}
      />
    </AbsoluteFill>
  );
};

/* ======================================================================== */
/* Card 2 — tip 3: organise the trip, today's schedule.                     */
/* ======================================================================== */

const CardTwo: React.FC = () => {
  const frame = useCurrentFrame();
  const o = CUE.organize;
  const f = (s: number) => s - o;
  const end = TOURIST_TIPS_GREEN_DURATION - o;
  const slides: Slide[] = [
    {
      at: f(CUE.organize),
      parts: [
        { text: "تنظّم", at: f(CUE.organize) },
        { text: "رحلتك", at: f(CUE.organize) + 5, accent: true },
      ],
    },
    {
      at: f(CUE.schedule),
      parts: [
        { text: "تعرف", at: f(CUE.schedule) },
        { text: "جدولك", at: f(CUE.schedule) + 5, accent: true },
      ],
    },
    { at: f(CUE.today), parts: [{ text: "النهارده عندك", at: f(CUE.today) }] },
    {
      at: f(CUE.tour),
      parts: [{ text: "جولة القاهرة الجديدة", at: f(CUE.tour), accent: true }],
    },
    {
      at: f(CUE.stops),
      parts: [{ text: "فيها كذا وكذا وكذا", at: f(CUE.stops) }],
    },
    {
      at: f(CUE.so),
      parts: [
        { text: "عشان تبقى رحلتك", at: f(CUE.so) },
        { text: "صغيرة", at: f(CUE.so) + 18, accent: true },
      ],
    },
  ];
  const tabs: Slide[] = [{ at: 0, parts: [{ text: "ثالثاً", at: 0 }] }];

  const rows = [0, 1, 2];
  const route = progress(frame, f(CUE.stops), f(CUE.so) + 10, travel);
  const done = progress(frame, f(CUE.so) + 8, f(CUE.so) + 18);

  return (
    <GreenCard frame={frame} tabs={tabs} outFrom={end - 20} outTo={end - 2}>
      <Top>
        <Headline frame={frame} slides={slides} />
      </Top>
      <Strip>
        {/* Organise: a checklist ticking itself off. */}
        <Layer frame={frame} from={4} to={f(CUE.schedule)}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 20,
            }}
          >
            <div
              dir="rtl"
              style={{
                width: 520,
                height: 210,
                borderRadius: 26,
                backgroundColor: paper.white,
                border: `2px solid ${border}`,
                padding: "26px 34px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {rows.map((i) => {
                const tick = progress(frame, 8 + i * 6, 14 + i * 6);
                return (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: 20 }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        border: `3px solid ${tick > 0.5 ? brown.base : tan.base}`,
                        backgroundColor:
                          tick > 0.5 ? brown.base : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={28} color={paper.lift} stroke={3.4}>
                        <g style={{ opacity: tick }}>{paths.check}</g>
                      </Icon>
                    </div>
                    <div
                      style={{
                        width: [320, 260, 290][i],
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: tan.fill,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Layer>

        {/* Schedule: today → the New Cairo tour → its stops. */}
        <Layer frame={frame} from={f(CUE.schedule)}>
          <div
            dir="rtl"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "34px 10px 0",
            }}
          >
            <Chip
              frame={frame}
              at={f(CUE.schedule) + 2}
              icon={paths.calendar}
              label={frame >= f(CUE.today) ? "النهارده" : "جدولك"}
              width={240}
              accent={frame >= f(CUE.today)}
            />
            <div
              dir="rtl"
              style={{
                position: "relative",
                width: 560,
                height: 190,
                borderRadius: 26,
                backgroundColor: paper.white,
                border: `${done > 0.5 ? 5 : 2}px solid ${done > 0.5 ? brown.base : border}`,
                padding: "24px 30px",
                boxSizing: "border-box",
                translate: `0px ${(1 - progress(frame, f(CUE.tour) - 4, f(CUE.tour) + 10)) * 40}px`,
                clipPath: `inset(${(1 - progress(frame, f(CUE.tour) - 4, f(CUE.tour) + 10)) * 100}% -20px -20px -20px round 26px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Icon size={46} color={brown.base}>
                  {paths.pin}
                </Icon>
                <span
                  style={{
                    fontFamily: font.arDisplay,
                    fontSize: 38,
                    color: ink.full,
                    whiteSpace: "nowrap",
                  }}
                >
                  جولة القاهرة الجديدة
                </span>
              </div>
              {/* Route with three stops. */}
              <div style={{ position: "relative", height: 60, marginTop: 30 }}>
                <div
                  style={{
                    position: "absolute",
                    top: 26,
                    left: 20,
                    right: 20,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: tan.fill,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 26,
                    right: 20,
                    width: `calc((100% - 40px) * ${route})`,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: brown.base,
                  }}
                />
                {[0, 1, 2].map((i) => {
                  const pop = progress(
                    frame,
                    f(CUE.stops) + i * 9,
                    f(CUE.stops) + i * 9 + 8,
                  );
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: `calc(20px + (100% - 40px) * ${i / 2} - 20px)`,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor:
                          route >= i / 2 - 0.01 ? brown.base : paper.white,
                        border: `4px solid ${brown.base}`,
                        boxSizing: "border-box",
                        scale: `${pop}`,
                      }}
                    />
                  );
                })}
              </div>
              {/* Done check. */}
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  left: -14,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  backgroundColor: brown.base,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: `${done}`,
                }}
              >
                <Icon size={34} color={paper.lift} stroke={3}>
                  {paths.check}
                </Icon>
              </div>
            </div>
          </div>
        </Layer>
      </Strip>
      <SfxTrack
        cues={[
          { at: 0, name: "whoosh", volume: 0.8 },
          { at: 8, name: "tick" },
          { at: 14, name: "tick" },
          { at: 20, name: "tick" },
          { at: f(CUE.schedule), name: "swipe" },
          { at: f(CUE.schedule) + 2, name: "pop" },
          { at: f(CUE.today), name: "swipe" },
          { at: f(CUE.tour) - 4, name: "pop" },
          { at: f(CUE.tour), name: "chime", volume: 0.5 },
          { at: f(CUE.stops), name: "pop", volume: 0.6 },
          { at: f(CUE.stops) + 9, name: "pop", volume: 0.6 },
          { at: f(CUE.stops) + 18, name: "pop", volume: 0.6 },
          { at: f(CUE.so), name: "swipe" },
          { at: f(CUE.so) + 8, name: "ding", volume: 0.8 },
          { at: end - 20, name: "whoosh", volume: 0.6 },
        ]}
      />
    </GreenCard>
  );
};

export const TouristTipsGreen: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CHROMA }}>
    <Sequence durationInFrames={CARD1_END}>
      <CardOne />
    </Sequence>
    <Sequence from={CUE.currency} durationInFrames={BAR_END - CUE.currency}>
      <TextBar />
    </Sequence>
    <Sequence from={CUE.organize}>
      <CardTwo />
    </Sequence>
  </AbsoluteFill>
);

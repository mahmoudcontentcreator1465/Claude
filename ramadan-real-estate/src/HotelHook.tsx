import { interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { GreenCard, Headline, type Slide } from "./lib/greenscreen";
import { progress, sec } from "./lib/motion";
import { font, ink, paper, red } from "./theme";

/**
 * Green-screen lower third for the Amarina hook:
 *   "إيه اللي يخلي شركة فنادق تدخل العقارات بـ10 مليار جنيه؟"
 *
 * Timed against SRT cues 1–4, so frame 0 is 00:00:00,000.
 */
const CUE = {
  what: sec(0),
  hotels: sec(0.733),
  realEstate: sec(1.7),
  billions: sec(2.566),
  end: sec(3.466),
};

export const HOTEL_HOOK_DURATION = CUE.end + 18;

const HEADLINES: Slide[] = [
  {
    at: CUE.what,
    parts: [
      { text: "إيه اللي يخلي", at: CUE.what },
      { text: "شركة فنادق", at: CUE.hotels },
      { text: "تدخل", at: CUE.hotels + 16 },
    ],
  },
  {
    at: CUE.realEstate,
    parts: [{ text: "مجال العقارات", at: CUE.realEstate }],
  },
  {
    at: CUE.billions,
    parts: [
      { text: "بـ", at: CUE.billions },
      { text: "10", at: CUE.billions, latin: true, accent: true },
      { text: "مليار جنيه", at: CUE.billions + 3 },
      { text: "؟", at: CUE.billions + 8, accent: true },
    ],
  },
];

const TABS: Slide[] = [{ at: 0, parts: [{ text: "السؤال", at: 0 }] }];

/* Graphic strip inside the card. */
const G = { left: 56, top: 186, width: 848, height: 250 };
const ROW_Y = 160;
const CHIP_W = 280;

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    width={60}
    height={60}
    viewBox="0 0 24 24"
    fill="none"
    stroke={ink.full}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    {children}
  </svg>
);

const BellIcon = () => (
  <Icon>
    <path d="M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z" />
    <path d="M20 16a8 8 0 1 0-16 0" />
    <path d="M12 4v4" />
    <path d="M10 4h4" />
  </Icon>
);

const BuildingIcon = () => (
  <Icon>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </Icon>
);

/** A labelled chip that pops up from a baseline clip. */
const Chip: React.FC<{
  frame: number;
  at: number;
  side: "left" | "right";
  label: string;
  icon: React.ReactNode;
}> = ({ frame, at, side, label, icon }) => {
  const shown = progress(frame, at, at + 14);

  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        [side]: 0,
        top: ROW_Y,
        width: CHIP_W,
        height: 110,
        translate: `0px ${-55 + (1 - shown) * 40}px`,
        clipPath: `inset(${(1 - shown) * 100}% -10px -10px -10px round 28px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        borderRadius: 28,
        backgroundColor: paper.white,
        border: "2px solid rgba(20,16,15,0.10)",
        fontFamily: font.arDisplay,
        fontSize: 52,
        color: ink.full,
      }}
    >
      {icon}
      {label}
    </div>
  );
};

/** 0 → 10,000,000,000 with thousands separators. */
const formatBillions = (t: number) =>
  Math.round(t * 10_000_000_000).toLocaleString("en-US");

export const HotelHook: React.FC = () => {
  const frame = useCurrentFrame();

  // The arrow runs right → left: from hotels into real estate.
  const arrowFrom = G.width - CHIP_W - 16;
  const arrowTo = CHIP_W + 16;
  const draw = progress(frame, CUE.realEstate - 8, CUE.realEstate + 10);
  const tip = interpolate(draw, [0, 1], [arrowFrom, arrowTo]);

  const tag = progress(frame, CUE.billions, CUE.billions + 12);
  const count = progress(frame, CUE.billions + 4, CUE.end - 4);

  return (
    <GreenCard
      frame={frame}
      tabs={TABS}
      outFrom={CUE.end}
      outTo={HOTEL_HOOK_DURATION - 2}
    >
      <div style={{ position: "absolute", left: 56, right: 56, top: 50 }}>
        <Headline frame={frame} slides={HEADLINES} />
      </div>

      <div
        style={{
          position: "absolute",
          left: G.left,
          top: G.top,
          width: G.width,
          height: G.height,
        }}
      >
        {/* Arrow: hotels → real estate. */}
        {draw > 0 ? (
          <svg
            width={G.width}
            height={G.height}
            style={{ position: "absolute", inset: 0 }}
          >
            <line
              x1={arrowFrom}
              y1={ROW_Y}
              x2={tip}
              y2={ROW_Y}
              stroke={ink.full}
              strokeWidth={8}
              strokeLinecap="round"
            />
            <path
              d={`M ${tip + 26} ${ROW_Y - 24} L ${tip} ${ROW_Y} L ${tip + 26} ${ROW_Y + 24}`}
              fill="none"
              stroke={ink.full}
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}

        <Chip
          frame={frame}
          at={CUE.hotels}
          side="right"
          label="فنادق"
          icon={<BellIcon />}
        />
        <Chip
          frame={frame}
          at={CUE.realEstate}
          side="left"
          label="عقارات"
          icon={<BuildingIcon />}
        />

        {/* The price tag drops onto the arrow — the accent lands last. */}
        {frame >= CUE.billions ? (
          <div
            style={{
              position: "absolute",
              left: G.width / 2,
              top: ROW_Y - 70,
              translate: `-50% ${-100 + (1 - tag) * -60}%`,
              rotate: `${interpolate(tag, [0, 1], [-14, -4])}deg`,
              scale: String(interpolate(tag, [0, 1], [0.7, 1])),
              padding: "14px 26px 12px",
              borderRadius: 18,
              backgroundColor: red.base,
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              fontFamily: font.display,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: paper.white,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 26, opacity: 0.85 }}>EGP</span>
            <span style={{ fontSize: 46 }}>{formatBillions(count)}</span>
          </div>
        ) : null}
      </div>
    </GreenCard>
  );
};

import type { ArtVariant } from "@/content/types";

/**
 * Flat, editorial destination illustrations used as art direction and as clearly
 * labelled stand-ins until real project visuals are supplied. They're pure SVG:
 * no network requests, sharp at any size, and they fill any aspect ratio.
 */
export function DestinationArt({
  variant,
  className,
  label,
}: {
  variant: ArtVariant;
  className?: string;
  /** Accessible description. Omit to hide from assistive tech. */
  label?: string;
}) {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={className} {...a11y}>
      {scenes[variant]}
    </svg>
  );
}

const ink = "#111111";
const teal = "#1ABC9C";
const sun = "#F2B544";
const sea = "#7CC9D8";

const scenes: Record<ArtVariant, React.ReactNode> = {
  coast: (
    <>
      <rect width="400" height="500" fill="#EAF4F1" />
      <circle cx="250" cy="250" r="92" fill={sun} />
      <rect y="262" width="400" height="238" fill={sea} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M-20 ${300 + i * 34} q 30 -12 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0`}
          stroke={i % 2 ? "#fff" : teal}
          strokeWidth={i === 2 ? 5 : 2.5}
          fill="none"
          opacity={i === 2 ? 1 : 0.7}
        />
      ))}
      <path d="M92 250 l0 -74 l40 74z" fill={ink} />
      <path d="M86 256h56l-8 12H96z" fill={ink} />
      <rect y="258" width="400" height="4" fill={ink} opacity=".9" />
    </>
  ),
  desert: (
    <>
      <rect width="400" height="500" fill="#F4ECDD" />
      <circle cx="120" cy="150" r="54" fill={teal} />
      <path d="M180 300 L250 190 L320 300z" fill={ink} />
      <path d="M250 190 L320 300 L286 300z" fill="#3b3f3e" />
      <path d="M300 300 L340 240 L380 300z" fill={ink} opacity=".85" />
      <path d="M0 330 C 90 270 170 300 240 318 S 360 300 400 290 V500 H0z" fill="#E4D2B0" />
      <path d="M0 390 C 110 350 190 360 260 388 S 360 400 400 380 V500 H0z" fill="#D9BE8E" />
      <path d="M0 450 C 120 420 220 430 400 460 V500 H0z" fill="#C9A66B" />
      <path d="M40 470 C 140 400 250 420 360 360" stroke={ink} strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" fill="none" />
    </>
  ),
  city: (
    <>
      <rect width="400" height="500" fill="#F5F7F6" />
      <circle cx="300" cy="120" r="40" fill="none" stroke={ink} strokeWidth="2.5" />
      <circle cx="300" cy="120" r="14" fill={sun} />
      <g fill={ink}>
        <rect x="20" y="300" width="60" height="200" />
        <rect x="90" y="250" width="44" height="250" />
        <path d="M150 330 a45 45 0 0 1 90 0 V500 h-90z" />
        <rect x="192" y="196" width="6" height="40" />
        <rect x="250" y="220" width="22" height="280" />
        <path d="M250 220 l11 -40 l11 40z" />
        <rect x="286" y="290" width="92" height="210" />
      </g>
      <g fill={teal}>
        {[0, 1, 2, 3, 4].map((r) => [0, 1].map((c) => <rect key={`${r}-${c}`} x={100 + c * 16} y={272 + r * 34} width="8" height="14" />))}
        <rect x="300" y="312" width="64" height="8" />
        <rect x="300" y="340" width="40" height="8" />
      </g>
      <rect x="0" y="470" width="400" height="30" fill={teal} />
    </>
  ),
  route: (
    <>
      <rect width="400" height="500" fill="#FFFFFF" />
      <g fill="#111111" opacity=".16">
        {Array.from({ length: 11 }).map((_, r) =>
          Array.from({ length: 9 }).map((__, c) => <circle key={`${r}-${c}`} cx={20 + c * 45} cy={25 + r * 45} r="1.6" />),
        )}
      </g>
      <path d="M60 430 C 120 360 90 300 170 270 S 260 170 320 90" stroke={ink} strokeWidth="2.5" fill="none" strokeDasharray="8 10" strokeLinecap="round" />
      <path d="M170 270 C 230 280 300 300 350 260" stroke={teal} strokeWidth="4" fill="none" strokeLinecap="round" />
      {[[60, 430], [170, 270], [320, 90], [350, 260]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="13" fill={i === 1 ? teal : "#fff"} stroke={ink} strokeWidth="2.5" />
          <circle r="4" fill={ink} />
        </g>
      ))}
      <g transform="translate(335 440)" stroke={ink} strokeWidth="2" fill="none">
        <circle r="26" />
        <path d="M0 -18 L6 0 L0 18 L-6 0z" fill={ink} />
      </g>
    </>
  ),
  oasis: (
    <>
      <rect width="400" height="500" fill={teal} />
      <circle cx="290" cy="130" r="58" fill="#F5F7F6" />
      <path d="M0 360 C 100 330 300 330 400 360 V500 H0z" fill="#F4ECDD" />
      <ellipse cx="200" cy="420" rx="120" ry="22" fill={sea} />
      <ellipse cx="200" cy="420" rx="120" ry="22" fill="none" stroke={ink} strokeWidth="2" />
      <g stroke={ink} strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M130 400 C 138 330 150 280 166 230" />
      </g>
      <g fill={ink}>
        <path d="M166 230 C 120 210 90 226 72 250 C 110 232 140 234 166 232z" />
        <path d="M166 230 C 200 196 240 196 266 214 C 230 206 198 214 166 234z" />
        <path d="M166 230 C 150 186 120 170 96 172 C 128 186 148 206 164 234z" />
        <path d="M166 230 C 196 250 214 280 214 306 C 200 280 184 260 164 236z" />
        <path d="M166 230 C 176 186 206 164 232 160 C 206 178 186 204 168 234z" />
      </g>
    </>
  ),
};

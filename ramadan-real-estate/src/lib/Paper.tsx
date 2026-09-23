import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { EASE, gridBackground, radialGlow, red } from "../theme";

/**
 * 2-3% grain over the frame. Keeps the paper from reading as flat digital white.
 */
const Grain: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.032, mixBlendMode: "multiply" }}>
    <svg width="100%" height="100%">
      <filter id="housegrain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={3}
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#housegrain)" />
    </svg>
  </AbsoluteFill>
);

/** A four-point sparkle — the recurring intruding corner shape, in red. */
export const Sparkle: React.FC<{
  size: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ size, color = red.base, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path
      d="M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0 Z"
      fill={color}
    />
  </svg>
);

/**
 * The house background: bone-white paper, faint engineering grid, a soft white
 * blow-out at the focal point, red shapes intruding from the corners, grain on top.
 */
export const Paper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={gridBackground(40)}>
      <AbsoluteFill style={{ background: radialGlow }} />

      {/* Red corner accents — intruding, soft, never fully in frame. */}
      <Sparkle
        size={230}
        color={red.base}
        style={{
          position: "absolute",
          top: -64,
          left: -52,
          opacity: 0.16,
          filter: "blur(1px)",
          rotate: interpolate(frame, [0, 900], ["0deg", "26deg"], {
            extrapolateRight: "clamp",
          }),
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -120,
          bottom: 210,
          width: 340,
          height: 340,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${red.glow} 0%, rgba(224,26,43,0) 68%)`,
          opacity: interpolate(frame, [0, 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...EASE),
          }),
        }}
      />
      <Sparkle
        size={130}
        color={red.deep}
        style={{
          position: "absolute",
          right: 62,
          top: 470,
          opacity: 0.13,
          translate: interpolate(frame, [0, 300], ["0px 0px", "0px -26px"], {
            extrapolateRight: "clamp",
          }),
        }}
      />

      {children}
      <Grain />
    </AbsoluteFill>
  );
};

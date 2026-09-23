import { Easing, interpolate } from "remotion";
import { EASE } from "../theme";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const ease = Easing.bezier(...EASE);
/** For things travelling between two points — eases both ends. */
export const travel = Easing.bezier(0.65, 0, 0.35, 1);

/** The house entrance: opacity, a 24px rise and 0.94→1 scale over ~21 frames. */
export const rise = (frame: number, start: number, distance = 24) => ({
  opacity: interpolate(frame, [start, start + 18], [0, 1], {
    ...clamp,
    easing: ease,
  }),
  translate: `0px ${interpolate(frame, [start, start + 21], [distance, 0], {
    ...clamp,
    easing: ease,
  })}px`,
  scale: String(
    interpolate(frame, [start, start + 21], [0.94, 1], {
      ...clamp,
      easing: ease,
    }),
  ),
});

/** Slow sine float, 8px over ~90 frames. Returns 0..1 lift for the shadow. */
export const float = (frame: number, phase = 0) => {
  const s = Math.sin(((frame + phase) / 90) * Math.PI * 2);
  return { y: s * -8, lift: (s + 1) / 2 };
};

/** 0→1 eased progress between two frames. */
export const progress = (
  frame: number,
  from: number,
  to: number,
  easing = ease,
) => interpolate(frame, [from, to], [0, 1], { ...clamp, easing });

/** Converts an SRT timestamp in seconds to a frame at 30fps. */
export const sec = (s: number) => Math.round(s * 30);

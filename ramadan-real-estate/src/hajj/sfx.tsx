import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

/**
 * Sound-effect layer for the Hajj reel. The kit is synthesized by
 * scripts/hajj_sfx.py into public/hajj/sfx; each cue fires one file at a frame.
 */
export type SfxName =
  | "swipe"
  | "whoosh"
  | "pop"
  | "tick"
  | "key"
  | "stamp"
  | "chime"
  | "ding"
  | "strike"
  | "send"
  | "riser"
  | "impact"
  | "slide";

export type Sfx = { at: number; name: SfxName; volume?: number };

export const SfxTrack: React.FC<{ cues: Sfx[] }> = ({ cues }) => (
  <>
    {cues.map((c, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(c.at))} layout="none">
        <Audio
          src={staticFile(`hajj/sfx/${c.name}.wav`)}
          volume={() => c.volume ?? 1}
        />
      </Sequence>
    ))}
  </>
);

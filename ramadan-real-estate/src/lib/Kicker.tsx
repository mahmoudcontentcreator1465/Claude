import { font, ink, red } from "../theme";
import { rise } from "./motion";

/** Small label with a red dot, sitting above a headline. */
export const Kicker: React.FC<{
  frame: number;
  start?: number;
  children: string;
}> = ({ frame, start = 0, children }) => (
  <div
    dir="rtl"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      ...rise(frame, start, 16),
    }}
  >
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: red.base,
      }}
    />
    <span style={{ fontFamily: font.arDisplay, fontSize: 44, color: ink.soft }}>
      {children}
    </span>
  </div>
);

import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { font } from "./theme";

await Promise.all([
  loadFont({
    family: font.ar,
    url: staticFile("fonts/PlexArabic-Regular.ttf"),
    weight: "400",
  }),
  loadFont({
    family: font.ar,
    url: staticFile("fonts/PlexArabic-SemiBold.ttf"),
    weight: "600",
  }),
  loadFont({
    family: font.ar,
    url: staticFile("fonts/PlexArabic-Bold.ttf"),
    weight: "700",
  }),
  loadFont({
    family: font.arDisplay,
    url: staticFile("fonts/Liftaswash-Regular.otf"),
    weight: "400",
  }),
  loadFont({
    family: font.display,
    url: staticFile("fonts/InterTight-ExtraBold.ttf"),
    weight: "800",
  }),
  loadFont({
    family: font.serif,
    url: staticFile("fonts/InstrumentSerif-Italic.ttf"),
    weight: "400",
    style: "italic",
  }),
]);

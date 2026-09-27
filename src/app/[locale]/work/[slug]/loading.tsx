import Image from "next/image";
import mark from "@/../public/brand/different-mark-dark.png";

export default function Loading() {
  return (
    <div className="grid min-h-[80svh] place-items-center" role="status" aria-live="polite">
      <Image src={mark} alt="" className="h-14 w-14 motion-safe:animate-pulse" sizes="56px" priority />
      <span className="sr-only">Loading… · بيحمّل…</span>
    </div>
  );
}

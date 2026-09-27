import Image from "next/image";
import type { Client } from "@/content/types";

/** Continuous logo strip. Pauses on hover/focus and stops under reduced motion. */
function Row({ clients, names, hidden }: { clients: Client[]; names: Record<string, string>; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-4 pe-4 md:gap-6 md:pe-6">
      {clients.map((c) => (
        <li key={c.id} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-line md:h-32 md:w-32">
          <Image src={c.logo.image} alt={hidden ? "" : `${names[c.id]} logo`} fill sizes="128px" className={`object-contain ${c.logo.treatment === "artwork" ? "" : "p-4"}`} />
        </li>
      ))}
    </ul>
  );
}

export function LogoMarquee({ clients, names, label }: { clients: Client[]; names: Record<string, string>; label: string }) {
  return (
    <section aria-label={label} className="marquee overflow-hidden border-y hairline bg-paper py-8 md:py-10" style={{ ["--marquee-duration" as string]: `${Math.max(30, clients.length * 4)}s` }}>
      <div className="marquee-track flex w-max">
        <Row clients={clients} names={names} />
        <Row clients={clients} names={names} hidden />
      </div>
    </section>
  );
}

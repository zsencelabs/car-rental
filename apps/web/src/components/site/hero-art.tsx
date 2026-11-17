import { MapPinIcon } from "lucide-react";
import { CarIllustration } from "./car-illustration";

/** Decorative hero illustration: arched panel, sun, car and a caption chip. */
export function HeroArt() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="relative overflow-hidden rounded-[50%_48%_22px_22px] bg-[#e8ece2]">
        <div className="absolute inset-0 opacity-75 [background:linear-gradient(140deg,transparent_36%,#d8e1d4_36.3%_37%,transparent_37.3%),linear-gradient(35deg,transparent_62%,#d4ded1_62.4%_63%,transparent_63.4%)]" />
        <div className="absolute top-[12%] right-[14%] size-20 rounded-full bg-[#f0d9a0] sm:size-24" />
        <CarIllustration category="hatchback" tint="sage" className="h-64 bg-transparent sm:h-72" />
        <p className="absolute bottom-4 left-5 hidden text-[0.65rem] font-semibold tracking-[0.15em] text-[#718074] uppercase sm:block">
          Go where life takes you
        </p>
      </div>
      <div className="absolute right-3 -bottom-5 flex items-center gap-3 rounded-xl border border-white bg-card px-4 py-3 shadow-[0_14px_30px_-18px_rgba(38,60,50,0.5)] sm:right-4">
        <span className="grid size-8 place-items-center rounded-lg bg-secondary">
          <MapPinIcon className="size-4 text-primary" />
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-semibold text-brand-ink">Your journey, your way</span>
          <span className="text-xs text-muted-foreground">Pick the keys or pick a driver</span>
        </span>
      </div>
    </div>
  );
}

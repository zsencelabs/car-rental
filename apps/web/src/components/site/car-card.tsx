import Image from "next/image";
import Link from "next/link";
import { CogIcon, FuelIcon, StarIcon, UsersIcon } from "lucide-react";
import { formatMoney } from "@/lib/catalog/money";
import { CATEGORY_LABELS, type RentalMode, type Vehicle } from "@/lib/catalog/types";
import { modeLabel } from "@/lib/search-schema";
import { capitalize, cn } from "@/lib/utils";

interface CarCardProps {
  vehicle: Vehicle;
  /** Carried into the details link so the chosen mode is preselected. */
  mode?: RentalMode;
  priority?: boolean;
  className?: string;
}

export function CarCard({ vehicle, mode, priority = false, className }: CarCardProps) {
  const href = mode ? `/cars/${vehicle.id}?mode=${mode}` : `/cars/${vehicle.id}`;
  const cover = vehicle.images[0];

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[16px] border border-[#e7eae3] bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(38,60,50,0.55)]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {vehicle.allowedModes.map((allowed) => (
            <span
              key={allowed}
              className="rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-semibold text-[#3f5146] shadow-sm"
            >
              {modeLabel(allowed)}
            </span>
          ))}
        </div>
        <p className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          <StarIcon aria-hidden="true" className="size-3.5 fill-[#f0c96b] text-[#f0c96b]" />
          {vehicle.rating.toFixed(1)}
          <span className="font-normal text-white/80">({vehicle.reviewCount})</span>
          <span className="sr-only">out of 5 from {vehicle.reviewCount} reviews</span>
        </p>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div>
          <h3 className="text-base font-bold text-[#2c3f34]">
            <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {vehicle.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {vehicle.year} · {CATEGORY_LABELS[vehicle.category]}
          </p>
        </div>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-y border-[#f0f1ee] py-3 text-xs text-muted-foreground">
          <li className="inline-flex items-center gap-1.5">
            <UsersIcon aria-hidden="true" className="size-3.5" />
            {vehicle.seats} seats
          </li>
          <li className="inline-flex items-center gap-1.5">
            <CogIcon aria-hidden="true" className="size-3.5" />
            {capitalize(vehicle.transmission)}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <FuelIcon aria-hidden="true" className="size-3.5" />
            {capitalize(vehicle.fuel)}
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="text-sm text-muted-foreground">
            From{" "}
            <span className="text-lg font-bold text-brand-ink">
              {formatMoney(vehicle.dailyRate, { compact: true })}
            </span>{" "}
            / day
          </p>
          <span className="text-sm font-semibold text-primary transition-transform group-hover:translate-x-0.5">
            View details →
          </span>
        </div>
      </div>
    </article>
  );
}

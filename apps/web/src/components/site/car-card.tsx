import Link from "next/link";
import { CogIcon, FuelIcon, StarIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/catalog/money";
import { CATEGORY_LABELS, type RentalMode, type Vehicle } from "@/lib/catalog/types";
import { modeLabel } from "@/lib/search-schema";
import { CarIllustration } from "./car-illustration";
import { capitalize } from "@/lib/utils";

interface CarCardProps {
  vehicle: Vehicle;
  /** Carried into the details link so the chosen mode is preselected. */
  mode?: RentalMode;
}

export function CarCard({ vehicle, mode }: CarCardProps) {
  const href = mode ? `/cars/${vehicle.id}?mode=${mode}` : `/cars/${vehicle.id}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[13px] border border-[#e7eae3] bg-card transition-shadow hover:shadow-[0_12px_30px_-18px_rgba(38,60,50,0.45)]">
      <div className="relative">
        <CarIllustration category={vehicle.category} tint={vehicle.tint} className="h-40" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {vehicle.allowedModes.map((allowed) => (
            <Badge key={allowed} variant="outline" className="border-white/70 bg-white/90 text-[#58695d]">
              {modeLabel(allowed)}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#35473b]">
              <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
                {vehicle.name}
              </Link>
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {vehicle.year} · {CATEGORY_LABELS[vehicle.category]}
            </p>
          </div>
          <p className="flex items-center gap-1 text-sm font-semibold text-[#35473b]">
            <StarIcon aria-hidden="true" className="size-3.5 fill-[#c9a45c] text-[#c9a45c]" />
            {vehicle.rating.toFixed(1)}
            <span className="sr-only">out of 5 from {vehicle.reviewCount} reviews</span>
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
            <span className="text-lg font-bold text-brand-ink">
              {formatMoney(vehicle.dailyRate, { compact: true })}
            </span>{" "}
            / day
          </p>
          <span className="text-sm font-semibold text-primary group-hover:underline">View details</span>
        </div>
      </div>
    </article>
  );
}

import Image from "next/image";
import Link from "next/link";
import { BriefcaseIcon, FuelIcon, GaugeIcon, UsersRoundIcon } from "lucide-react";
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
  const transmission = vehicle.transmission === "automatic" ? "Auto" : "Manual";
  const specs = [
    { Icon: UsersRoundIcon, label: String(vehicle.seats), srLabel: `${vehicle.seats} seats` },
    { Icon: BriefcaseIcon, label: String(vehicle.bags), srLabel: `${vehicle.bags} large bags` },
    { Icon: GaugeIcon, label: transmission, srLabel: `${capitalize(vehicle.transmission)} transmission` },
    { Icon: FuelIcon, label: capitalize(vehicle.fuel), srLabel: `${capitalize(vehicle.fuel)} fuel` },
  ];

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[16px] border border-border bg-card transition-shadow duration-300 hover:shadow-[0_18px_40px_-28px_rgba(18,36,27,0.45)] has-[a:focus-visible]:ring-3 has-[a:focus-visible]:ring-ring/50",
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
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
        <span className="absolute top-2.5 left-2.5 rounded-full bg-[rgba(18,36,27,0.72)] px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
          {CATEGORY_LABELS[vehicle.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-[18px] pt-5 pb-5">
        <h3 className="text-[17px] font-semibold text-brand-ink">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {vehicle.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-[13px] text-muted-foreground">{vehicle.summary}</p>

        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
          {specs.map(({ Icon, label, srLabel }) => (
            <li key={srLabel} className="inline-flex items-center gap-1.5">
              <Icon aria-hidden="true" strokeWidth={1.75} className="size-4" />
              <span aria-hidden="true">{label}</span>
              <span className="sr-only">{srLabel}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">{vehicle.allowedModes.map(modeLabel).join(" · ")}</p>
            <p className="shrink-0 text-right">
              <span className="sr-only">From </span>
              <span className="text-lg font-bold text-brand-ink">
                {formatMoney(vehicle.dailyRate, { compact: true })}
              </span>
              <span className="text-xs text-muted-foreground">/day</span>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

import { BadgeCheckIcon, LanguagesIcon, MapPinIcon, StarIcon } from "lucide-react";
import { formatMoney } from "@/lib/catalog/money";
import type { DriverProfile } from "@/lib/catalog/types";

/** Public driver profile (SRS §5.2). Shows license category only, never the number or documents. */
export function DriverCard({ driver, rank }: { driver: DriverProfile; rank: number }) {
  const stats = [
    { label: "Trips", value: String(driver.completedTrips) },
    { label: "Acceptance", value: `${driver.acceptanceRate}%` },
    { label: "Cancellation", value: `${driver.cancellationRate}%` },
    { label: "Score", value: String(driver.performanceScore) },
  ];

  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex gap-3.5">
        <div
          aria-hidden="true"
          className="grid size-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,#3e7054,#63866c)] text-sm font-bold text-white"
        >
          {driver.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h4 className="flex items-center gap-1.5 font-semibold text-brand-ink">
                {driver.name}
                <BadgeCheckIcon aria-label="Verified driver" className="size-4 text-primary" />
              </h4>
              <p className="text-xs text-muted-foreground">
                #{rank} match · {driver.yearsExperience} yrs · License {driver.licenseCategory}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-brand-ink">{formatMoney(driver.dailyRate, { compact: true })}</span> / day
            </p>
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <StarIcon aria-hidden="true" className="size-3.5 fill-[#c9a45c] text-[#c9a45c]" />
              {driver.rating.toFixed(1)} ({driver.reviewCount} reviews)
            </span>
            <span className="flex items-center gap-1 font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary" /> {driver.available ? "Available" : "Unavailable"}
            </span>
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{driver.bio}</p>
      <dl className="mt-3 grid grid-cols-4 gap-1.5 text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-muted px-1 py-1.5">
            <dt className="text-[0.65rem] text-muted-foreground">{stat.label}</dt>
            <dd className="text-sm font-semibold text-brand-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <LanguagesIcon aria-hidden="true" className="size-3.5" /> {driver.languages.join(", ")}
        </span>
        <span className="flex items-center gap-1">
          <MapPinIcon aria-hidden="true" className="size-3.5" /> {driver.serviceCities.join(", ")}
        </span>
      </p>
    </article>
  );
}

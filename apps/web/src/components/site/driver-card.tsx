import { BadgeCheckIcon, LanguagesIcon, StarIcon } from "lucide-react";
import { formatMoney } from "@/lib/catalog/money";
import type { DriverProfile } from "@/lib/catalog/types";

/** Public driver profile card. Shows license category only, never the number (SRS §5.2). */
export function DriverCard({ driver, rank }: { driver: DriverProfile; rank: number }) {
  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <div
        aria-hidden="true"
        className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground"
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
              #{rank} match · {driver.yearsExperience} yrs experience · License {driver.licenseCategory}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-brand-ink">{formatMoney(driver.dailyRate, { compact: true })}</span> /
            day
          </p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{driver.bio}</p>
        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1">
            <StarIcon aria-hidden="true" className="size-3.5 fill-[#c9a45c] text-[#c9a45c]" />
            <dt className="sr-only">Rating</dt>
            <dd>
              {driver.rating.toFixed(1)} ({driver.reviewCount} reviews)
            </dd>
          </div>
          <div>
            <dt className="inline">Trips: </dt>
            <dd className="inline">{driver.completedTrips}</dd>
          </div>
          <div>
            <dt className="inline">Acceptance: </dt>
            <dd className="inline">{driver.acceptanceRate}%</dd>
          </div>
          <div className="inline-flex items-center gap-1">
            <LanguagesIcon aria-hidden="true" className="size-3.5" />
            <dt className="sr-only">Languages</dt>
            <dd>{driver.languages.join(", ")}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

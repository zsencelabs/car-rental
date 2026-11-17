import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FUEL_TYPES,
  RENTAL_MODES,
  TRANSMISSIONS,
  VEHICLE_CATEGORIES,
  CATEGORY_LABELS,
  type Location,
} from "@/lib/catalog/types";
import { modeLabel, type SearchParams } from "@/lib/search-schema";
import { capitalize, cn } from "@/lib/utils";

const selectClass =
  "mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

interface CarFiltersProps {
  params: SearchParams;
  locations: Location[];
  /** Keeps input ids unique when the form is rendered twice (mobile + desktop). */
  idPrefix: string;
  className?: string;
}

/**
 * Plain GET form: works without JavaScript and keeps every filter in the URL,
 * so results are shareable and the back button behaves as expected.
 */
export function CarFilters({ params, locations, idPrefix, className }: CarFiltersProps) {
  const id = (name: string) => `${idPrefix}-${name}`;
  return (
    <form method="get" action="/cars" aria-label="Filter cars" className={cn("rounded-[13px] border border-[#e7eae3] bg-card p-5", className)}>
      {params.pickupAt ? <input type="hidden" name="pickupAt" value={params.pickupAt} /> : null}
      {params.returnAt ? <input type="hidden" name="returnAt" value={params.returnAt} /> : null}

      <fieldset>
        <legend className="text-sm font-semibold text-brand-ink">Rental type</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {RENTAL_MODES.map((mode) => (
            <label
              key={mode}
              className="flex cursor-pointer items-center justify-center rounded-lg border border-border px-2 py-2 text-xs font-semibold text-muted-foreground has-[:checked]:border-primary has-[:checked]:bg-secondary has-[:checked]:text-secondary-foreground has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
            >
              <input
                type="radio"
                name="mode"
                value={mode}
                defaultChecked={params.mode === mode}
                className="sr-only"
              />
              {modeLabel(mode)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor={id("location")} className="text-xs">Pickup location</Label>
          <select id={id("location")} name="location" defaultValue={params.location ?? ""} className={selectClass}>
            <option value="">Any location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor={id("category")} className="text-xs">Category</Label>
          <select id={id("category")} name="category" defaultValue={params.category ?? ""} className={selectClass}>
            <option value="">Any category</option>
            {VEHICLE_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={id("transmission")} className="text-xs">Transmission</Label>
            <select
              id={id("transmission")}
              name="transmission"
              defaultValue={params.transmission ?? ""}
              className={selectClass}
            >
              <option value="">Any</option>
              {TRANSMISSIONS.map((value) => (
                <option key={value} value={value}>
                  {capitalize(value)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor={id("fuel")} className="text-xs">Fuel</Label>
            <select id={id("fuel")} name="fuel" defaultValue={params.fuel ?? ""} className={selectClass}>
              <option value="">Any</option>
              {FUEL_TYPES.map((value) => (
                <option key={value} value={value}>
                  {capitalize(value)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={id("seats")} className="text-xs">Min. seats</Label>
            <select id={id("seats")} name="minSeats" defaultValue={params.minSeats?.toString() ?? ""} className={selectClass}>
              <option value="">Any</option>
              {[2, 4, 5, 7, 9].map((seats) => (
                <option key={seats} value={seats}>
                  {seats}+
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor={id("price")} className="text-xs">Max. per day</Label>
            <select
              id={id("price")}
              name="maxDailyRate"
              defaultValue={params.maxDailyRate?.toString() ?? ""}
              className={selectClass}
            >
              <option value="">Any</option>
              {[40, 60, 90, 120, 160].map((price) => (
                <option key={price} value={price}>
                  {price}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor={id("sort")} className="text-xs">Sort by</Label>
          <select id={id("sort")} name="sort" defaultValue={params.sort} className={selectClass}>
            <option value="recommended">Recommended</option>
            <option value="price-asc">Lowest price</option>
            <option value="price-desc">Highest price</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Button type="submit" className="flex-1">Apply filters</Button>
        <Button asChild variant="ghost">
          <Link href={`/cars?mode=${params.mode}`}>Reset</Link>
        </Button>
      </div>
    </form>
  );
}

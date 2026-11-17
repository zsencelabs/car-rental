import type { DateRange } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** "YYYY-MM-DD" for a UTC date. */
function isoDay(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10);
}

function isBooked(day: string, ranges: DateRange[]): boolean {
  return ranges.some((range) => day >= range.start && day <= range.end);
}

function Month({ year, month, ranges }: { year: number; month: number; ranges: DateRange[] }) {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const leading = (first.getUTCDay() + 6) % 7; // Monday-first
  const title = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);

  return (
    <div>
      <p className="text-sm font-semibold text-brand-ink">{title}</p>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="pb-1 font-medium text-muted-foreground">
            {weekday}
          </span>
        ))}
        {Array.from({ length: leading }, (_, index) => (
          <span key={`blank-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const booked = isBooked(isoDay(year, month, day), ranges);
          return (
            <span
              key={day}
              className={cn(
                "grid aspect-square place-items-center rounded-lg",
                booked ? "bg-[#e9e4d6] text-[#a39a82] line-through" : "bg-secondary/60 text-brand-ink",
              )}
            >
              {day}
              <span className="sr-only">{booked ? " booked" : " available"}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Indicative two-month calendar built from sample booked ranges.
 * Real availability is checked server-side at booking time.
 */
export function AvailabilityCalendar({ ranges }: { ranges: DateRange[] }) {
  const anchor = ranges[0]?.start ?? "2026-12-01";
  const [year, month] = anchor.split("-").map(Number);
  const second = new Date(Date.UTC(year, month, 1));

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Month year={year} month={month - 1} ranges={ranges} />
        <Month year={second.getUTCFullYear()} month={second.getUTCMonth()} ranges={ranges} />
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-secondary" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-[#e9e4d6]" /> Booked
        </span>
        <span>Indicative sample calendar. Availability is confirmed when you book.</span>
      </p>
    </div>
  );
}

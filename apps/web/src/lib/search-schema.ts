import { z } from "zod";
import {
  FUEL_TYPES,
  RENTAL_MODES,
  TRANSMISSIONS,
  VEHICLE_CATEGORIES,
  type RentalMode,
} from "@/lib/catalog/types";

/** Combined date-time format used in URLs: YYYY-MM-DDTHH:mm */
const DATETIME_LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const dateTimeField = z
  .string()
  .regex(DATETIME_LOCAL, "Choose a date and time");

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}$/;

/** Pick-up / return time slots offered in the search form (every 30 minutes, 07:00–21:00). */
export const TIME_SLOTS: string[] = Array.from({ length: 29 }, (_, index) => {
  const minutes = 7 * 60 + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

export const DEFAULT_TIME = "10:00";

/** Joins a date and a time into the `YYYY-MM-DDTHH:mm` form used in URLs. */
export function joinDateTime(date: string, time: string): string {
  return `${date}T${time}`;
}

/**
 * Validation for the home-page rental search form.
 * `now` is injectable so the rules can be tested deterministically.
 */
export function createSearchFormSchema(now: () => Date = () => new Date()) {
  return z
    .object({
      mode: z.enum(RENTAL_MODES),
      pickupLocation: z.string().min(1, "Choose where to collect the car"),
      sameReturn: z.boolean(),
      returnLocation: z.string(),
      pickupDate: z.string().regex(DATE, "Choose a pick-up date"),
      pickupTime: z.string().regex(TIME, "Choose a time"),
      returnDate: z.string().regex(DATE, "Choose a return date"),
      returnTime: z.string().regex(TIME, "Choose a time"),
    })
    .superRefine((value, ctx) => {
      if (!value.sameReturn && value.returnLocation.length === 0) {
        ctx.addIssue({ code: "custom", path: ["returnLocation"], message: "Choose where to return the car" });
      }
      if (!DATE.test(value.pickupDate) || !DATE.test(value.returnDate)) return;
      const pickup = new Date(joinDateTime(value.pickupDate, value.pickupTime));
      const dropoff = new Date(joinDateTime(value.returnDate, value.returnTime));
      if (pickup.getTime() < now().getTime()) {
        ctx.addIssue({ code: "custom", path: ["pickupDate"], message: "Pick-up can't be in the past" });
      }
      if (dropoff.getTime() <= pickup.getTime()) {
        ctx.addIssue({ code: "custom", path: ["returnDate"], message: "Return must be after pick-up" });
      }
    });
}

export type SearchFormValues = z.infer<ReturnType<typeof createSearchFormSchema>>;

/**
 * Human-readable rental length, e.g. "3 days", "1 day 4 hours", "6 hours".
 * Display only; billing rules are decided server-side. Returns undefined when
 * the inputs are incomplete or return is not after pick-up.
 */
export function formatRentalLength(pickupAt: string, returnAt: string): string | undefined {
  const start = new Date(pickupAt).getTime();
  const end = new Date(returnAt).getTime();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return undefined;
  const totalMinutes = Math.round((end - start) / 60_000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days} ${days === 1 ? "day" : "days"}`);
  if (hours) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (!days && minutes) parts.push(`${minutes} min`);
  return parts.join(" ");
}

/**
 * Lenient parser for the /cars URL. Bad or missing values fall back to
 * "no filter" instead of failing the page, because URLs can be hand-edited.
 */
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values).optional().catch(undefined);

const optionalPositiveInt = z.coerce.number().int().positive().optional().catch(undefined);

export const searchParamsSchema = z.object({
  mode: z.enum(RENTAL_MODES).catch("SELF_DRIVE"),
  location: z.string().min(1).optional().catch(undefined),
  /** Return location when different from pick-up. Kept for the booking step; not a search filter. */
  returnLocation: z.string().min(1).optional().catch(undefined),
  pickupAt: dateTimeField.optional().catch(undefined),
  returnAt: dateTimeField.optional().catch(undefined),
  category: optionalEnum(VEHICLE_CATEGORIES),
  transmission: optionalEnum(TRANSMISSIONS),
  fuel: optionalEnum(FUEL_TYPES),
  minSeats: optionalPositiveInt,
  maxDailyRate: optionalPositiveInt,
  brand: z.string().trim().min(1).max(40).optional().catch(undefined),
  minRating: z.coerce.number().min(1).max(5).optional().catch(undefined),
  sort: z.enum(["recommended", "popular", "price-asc", "price-desc", "rating"]).catch("recommended"),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseSearchParams(raw: RawSearchParams): SearchParams {
  const flat = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
  return searchParamsSchema.parse(flat);
}

export function modeLabel(mode: RentalMode): string {
  return mode === "SELF_DRIVE" ? "Self-drive" : "With a driver";
}

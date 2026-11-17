import { z } from "zod";
import {
  FUEL_TYPES,
  RENTAL_MODES,
  TRANSMISSIONS,
  VEHICLE_CATEGORIES,
  type RentalMode,
} from "@/lib/catalog/types";

/** `datetime-local` input format: YYYY-MM-DDTHH:mm */
const DATETIME_LOCAL = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const dateTimeField = z
  .string()
  .regex(DATETIME_LOCAL, "Choose a date and time");

/**
 * Validation for the home-page search form.
 * `now` is injectable so the rules can be tested deterministically.
 */
export function createSearchFormSchema(now: () => Date = () => new Date()) {
  return z
    .object({
      mode: z.enum(RENTAL_MODES),
      pickupLocation: z.string().min(1, "Choose a pickup location"),
      dropoffLocation: z.string().min(1, "Choose a drop-off location"),
      pickupAt: dateTimeField,
      returnAt: dateTimeField,
    })
    .superRefine((value, ctx) => {
      const pickup = new Date(value.pickupAt);
      const dropoff = new Date(value.returnAt);
      if (pickup.getTime() < now().getTime()) {
        ctx.addIssue({ code: "custom", path: ["pickupAt"], message: "Pickup can't be in the past" });
      }
      if (dropoff.getTime() <= pickup.getTime()) {
        ctx.addIssue({ code: "custom", path: ["returnAt"], message: "Return must be after pickup" });
      }
    });
}

export type SearchFormValues = z.infer<ReturnType<typeof createSearchFormSchema>>;

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
  pickupAt: dateTimeField.optional().catch(undefined),
  returnAt: dateTimeField.optional().catch(undefined),
  category: optionalEnum(VEHICLE_CATEGORIES),
  transmission: optionalEnum(TRANSMISSIONS),
  fuel: optionalEnum(FUEL_TYPES),
  minSeats: optionalPositiveInt,
  maxDailyRate: optionalPositiveInt,
  sort: z.enum(["recommended", "price-asc", "price-desc", "rating"]).catch("recommended"),
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

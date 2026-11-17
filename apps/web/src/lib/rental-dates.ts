/**
 * Pure calendar-date helpers for the rental search picker.
 * Dates are local calendar days ("YYYY-MM-DD"); no time zones or money here.
 */

export function toIsoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses "YYYY-MM-DD" as a local date (midnight). Returns undefined for anything else. */
export function fromIsoDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export type QuickDuration = "1-day" | "weekend" | "1-week" | "1-month";

export const QUICK_DURATIONS: { id: QuickDuration; label: string }[] = [
  { id: "1-day", label: "1 day" },
  { id: "weekend", label: "Weekend" },
  { id: "1-week", label: "1 week" },
  { id: "1-month", label: "1 month" },
];

/**
 * Range for a quick-duration chip.
 * Uses the chosen pick-up date when there is one, otherwise tomorrow.
 * "Weekend" is always the next Saturday (after today) to Monday.
 */
export function quickRange(kind: QuickDuration, today: Date, from?: Date): { from: Date; to: Date } {
  const base = from ?? addDays(today, 1);
  switch (kind) {
    case "1-day":
      return { from: base, to: addDays(base, 1) };
    case "1-week":
      return { from: base, to: addDays(base, 7) };
    case "1-month":
      return { from: base, to: addDays(base, 30) };
    case "weekend": {
      const daysToSaturday = ((6 - today.getDay() + 7) % 7) || 7;
      const saturday = addDays(today, daysToSaturday);
      return { from: saturday, to: addDays(saturday, 2) };
    }
  }
}

/** "Thu, 21 Nov" */
export function formatShortDate(date: Date): string {
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date);
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date);
  return `${weekday}, ${date.getDate()} ${month}`;
}

import type { Money } from "./types";

const DECIMAL_PATTERN = /^\d+(\.\d{1,2})?$/;

/**
 * Converts a decimal string ("65.5", "65.50") into integer minor units (6550n).
 * Used for comparisons so money is never handled as a floating-point number.
 */
export function toMinorUnits(amount: string): bigint {
  if (!DECIMAL_PATTERN.test(amount)) {
    throw new Error(`Invalid money amount: "${amount}"`);
  }
  const [whole, fraction = ""] = amount.split(".");
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
}

export function compareMoney(a: Money, b: Money): number {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot compare ${a.currency} with ${b.currency}`);
  }
  const diff = toMinorUnits(a.amount) - toMinorUnits(b.amount);
  return diff === 0n ? 0 : diff < 0n ? -1 : 1;
}

/** Display-only formatting. Never use the formatted string for calculations. */
export function formatMoney(money: Money, options: { compact?: boolean } = {}): string {
  const isWhole = money.amount.endsWith(".00") || !money.amount.includes(".");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: options.compact && isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number(money.amount));
}

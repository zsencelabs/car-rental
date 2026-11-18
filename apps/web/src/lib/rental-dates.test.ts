import { describe, expect, it } from "vitest";
import { addDays, formatShortDate, fromIsoDate, quickRange, toIsoDate } from "./rental-dates";

describe("rental date helpers", () => {
  it("round-trips local ISO dates", () => {
    const date = new Date(2026, 10, 21);
    expect(toIsoDate(date)).toBe("2026-11-21");
    expect(toIsoDate(fromIsoDate("2026-11-21")!)).toBe("2026-11-21");
    expect(fromIsoDate("21/11/2026")).toBeUndefined();
    expect(fromIsoDate("")).toBeUndefined();
  });

  it("adds days across month and year boundaries", () => {
    expect(toIsoDate(addDays(new Date(2026, 11, 30), 3))).toBe("2027-01-02");
    expect(toIsoDate(addDays(new Date(2026, 1, 27), 2))).toBe("2026-03-01");
  });

  it("builds quick ranges from the chosen pick-up date, or tomorrow", () => {
    const today = new Date(2026, 10, 18); // Wednesday
    expect(quickRange("1-week", today)).toEqual({ from: new Date(2026, 10, 19), to: new Date(2026, 10, 26) });
    const from = new Date(2026, 11, 1);
    expect(quickRange("1-day", today, from)).toEqual({ from, to: new Date(2026, 11, 2) });
    expect(toIsoDate(quickRange("1-month", today, from).to)).toBe("2026-12-31");
  });

  it("picks the next Saturday to Monday for the weekend", () => {
    expect(quickRange("weekend", new Date(2026, 10, 18))).toEqual({
      from: new Date(2026, 10, 21),
      to: new Date(2026, 10, 23),
    });
    // On a Saturday, "weekend" means the following one.
    expect(toIsoDate(quickRange("weekend", new Date(2026, 10, 21)).from)).toBe("2026-11-28");
  });

  it("formats short trigger dates", () => {
    expect(formatShortDate(new Date(2026, 10, 21))).toBe("Sat, 21 Nov");
  });
});

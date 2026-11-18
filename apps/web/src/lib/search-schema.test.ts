import { describe, expect, it } from "vitest";
import { createSearchFormSchema, formatRentalLength, parseSearchParams } from "./search-schema";

const NOW = new Date("2026-12-01T09:00");
const schema = createSearchFormSchema(() => NOW);

const valid = {
  mode: "SELF_DRIVE",
  pickupLocation: "loc-downtown",
  pickupDate: "2026-12-02",
  pickupTime: "10:00",
  returnDate: "2026-12-05",
  returnTime: "10:00",
};

function issuePaths(input: unknown): string[] {
  const result = schema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
}

describe("rental search form schema", () => {
  it("accepts a valid future rental", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("accepts the with-driver mode", () => {
    expect(schema.safeParse({ ...valid, mode: "WITH_DRIVER" }).success).toBe(true);
  });

  it("rejects an unknown rental mode", () => {
    expect(issuePaths({ ...valid, mode: "CHAUFFEUR" })).toContain("mode");
  });

  it("rejects a pick-up in the past", () => {
    expect(issuePaths({ ...valid, pickupDate: "2026-11-30" })).toContain("pickupDate");
  });

  it("rejects a return before or equal to pick-up, using the times", () => {
    expect(issuePaths({ ...valid, returnDate: "2026-12-02", returnTime: "09:30" })).toContain("returnDate");
    expect(issuePaths({ ...valid, returnDate: "2026-12-02", returnTime: "10:00" })).toContain("returnDate");
    expect(schema.safeParse({ ...valid, returnDate: "2026-12-02", returnTime: "18:00" }).success).toBe(true);
  });

  it("requires a location and dates", () => {
    const paths = issuePaths({ ...valid, pickupLocation: "", pickupDate: "", returnDate: "" });
    expect(paths).toEqual(expect.arrayContaining(["pickupLocation", "pickupDate", "returnDate"]));
  });
});

describe("formatRentalLength", () => {
  it("formats whole days", () => {
    expect(formatRentalLength("2026-12-02T10:00", "2026-12-05T10:00")).toBe("3 days");
    expect(formatRentalLength("2026-12-02T10:00", "2026-12-03T10:00")).toBe("1 day");
  });

  it("formats days with hours and short rentals", () => {
    expect(formatRentalLength("2026-12-02T10:00", "2026-12-03T14:00")).toBe("1 day 4 hours");
    expect(formatRentalLength("2026-12-02T10:00", "2026-12-02T16:30")).toBe("6 hours 30 min");
  });

  it("returns undefined for invalid or reversed ranges", () => {
    expect(formatRentalLength("2026-12-05T10:00", "2026-12-02T10:00")).toBeUndefined();
    expect(formatRentalLength("", "2026-12-02T10:00")).toBeUndefined();
  });
});

describe("parseSearchParams", () => {
  it("defaults to self-drive and recommended sort", () => {
    const params = parseSearchParams({});
    expect(params.mode).toBe("SELF_DRIVE");
    expect(params.sort).toBe("recommended");
  });

  it("drops invalid values instead of failing", () => {
    const params = parseSearchParams({
      mode: "HELICOPTER",
      category: "spaceship",
      minSeats: "-3",
      maxDailyRate: "abc",
      pickupAt: "tomorrow",
      sort: "random",
    });
    expect(params).toMatchObject({ mode: "SELF_DRIVE", sort: "recommended" });
    expect(params.category).toBeUndefined();
    expect(params.minSeats).toBeUndefined();
    expect(params.maxDailyRate).toBeUndefined();
    expect(params.pickupAt).toBeUndefined();
  });

  it("uses the first value when a param is repeated", () => {
    expect(parseSearchParams({ mode: ["WITH_DRIVER", "SELF_DRIVE"] }).mode).toBe("WITH_DRIVER");
  });

  it("accepts brand, rating and the popular sort; drops an out-of-range rating", () => {
    const params = parseSearchParams({ brand: "Volvo", minRating: "4.5", sort: "popular" });
    expect(params).toMatchObject({ brand: "Volvo", minRating: 4.5, sort: "popular" });
    expect(parseSearchParams({ minRating: "9" }).minRating).toBeUndefined();
  });

  it("coerces numeric filters", () => {
    const params = parseSearchParams({ minSeats: "7", maxDailyRate: "90" });
    expect(params.minSeats).toBe(7);
    expect(params.maxDailyRate).toBe(90);
  });
});

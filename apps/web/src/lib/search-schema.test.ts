import { describe, expect, it } from "vitest";
import { createSearchFormSchema, parseSearchParams } from "./search-schema";

const NOW = new Date("2026-12-01T09:00");
const schema = createSearchFormSchema(() => NOW);

const valid = {
  mode: "SELF_DRIVE",
  pickupLocation: "loc-downtown",
  dropoffLocation: "loc-airport",
  pickupAt: "2026-12-02T10:00",
  returnAt: "2026-12-05T10:00",
};

function issuePaths(input: unknown): string[] {
  const result = schema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.path.join("."));
}

describe("search form schema", () => {
  it("accepts a valid future search", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("accepts the with-driver mode", () => {
    expect(schema.safeParse({ ...valid, mode: "WITH_DRIVER" }).success).toBe(true);
  });

  it("rejects an unknown rental mode", () => {
    expect(issuePaths({ ...valid, mode: "CHAUFFEUR" })).toContain("mode");
  });

  it("rejects a pickup in the past", () => {
    expect(issuePaths({ ...valid, pickupAt: "2026-11-30T10:00" })).toContain("pickupAt");
  });

  it("rejects a return before pickup", () => {
    expect(issuePaths({ ...valid, returnAt: "2026-12-02T09:00" })).toContain("returnAt");
  });

  it("rejects a return equal to pickup", () => {
    expect(issuePaths({ ...valid, returnAt: valid.pickupAt })).toContain("returnAt");
  });

  it("requires locations and dates", () => {
    const paths = issuePaths({ mode: "SELF_DRIVE", pickupLocation: "", dropoffLocation: "", pickupAt: "", returnAt: "" });
    expect(paths).toEqual(expect.arrayContaining(["pickupLocation", "dropoffLocation", "pickupAt", "returnAt"]));
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

  it("coerces numeric filters", () => {
    const params = parseSearchParams({ minSeats: "7", maxDailyRate: "90" });
    expect(params.minSeats).toBe(7);
    expect(params.maxDailyRate).toBe(90);
  });
});

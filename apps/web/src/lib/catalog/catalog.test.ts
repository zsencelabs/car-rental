import { describe, expect, it } from "vitest";
import { parseSearchParams } from "@/lib/search-schema";
import { drivers, vehicles } from "./mock-data";
import { compareMoney, toMinorUnits } from "./money";
import { filterAndSortVehicles, getRecommendedDrivers, getVehicle, rankDriversForCity } from "./queries";

describe("money helpers", () => {
  it("converts decimal strings to minor units without floats", () => {
    expect(toMinorUnits("65")).toBe(6500n);
    expect(toMinorUnits("65.5")).toBe(6550n);
    expect(toMinorUnits("0.35")).toBe(35n);
    expect(toMinorUnits("0.1")).toBe(10n);
  });

  it("rejects malformed amounts", () => {
    expect(() => toMinorUnits("1.234")).toThrow();
    expect(() => toMinorUnits("-5")).toThrow();
    expect(() => toMinorUnits("abc")).toThrow();
  });

  it("refuses to compare different currencies", () => {
    expect(() => compareMoney({ amount: "1", currency: "USD" }, { amount: "1", currency: "EUR" })).toThrow();
  });
});

describe("filterAndSortVehicles", () => {
  const search = (raw: Record<string, string>) => filterAndSortVehicles(vehicles, parseSearchParams(raw));

  it("only returns vehicles that allow the chosen rental mode", () => {
    const withDriver = search({ mode: "WITH_DRIVER" });
    expect(withDriver.length).toBeGreaterThan(0);
    expect(withDriver.every((v) => v.allowedModes.includes("WITH_DRIVER"))).toBe(true);

    const selfDrive = search({ mode: "SELF_DRIVE" });
    expect(selfDrive.every((v) => v.allowedModes.includes("SELF_DRIVE"))).toBe(true);
    expect(selfDrive.map((v) => v.id)).not.toContain("toyota-hiace");
  });

  it("filters by location, category, transmission, fuel and seats", () => {
    expect(search({ location: "loc-downtown" }).every((v) => v.locationId === "loc-downtown")).toBe(true);
    expect(search({ category: "suv" }).every((v) => v.category === "suv")).toBe(true);
    expect(search({ transmission: "manual" }).every((v) => v.transmission === "manual")).toBe(true);
    expect(search({ fuel: "electric" }).map((v) => v.id)).toEqual(["tesla-model-3"]);
    expect(search({ mode: "WITH_DRIVER", minSeats: "7" }).map((v) => v.id)).toEqual(["toyota-hiace"]);
  });

  it("filters by maximum daily rate, inclusive", () => {
    const results = search({ maxDailyRate: "45" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((v) => toMinorUnits(v.dailyRate.amount) <= 4500n)).toBe(true);
    expect(results.map((v) => v.id)).toContain("toyota-corolla");
  });

  it("sorts by price in both directions", () => {
    const asc = search({ sort: "price-asc" }).map((v) => toMinorUnits(v.dailyRate.amount));
    expect(asc).toEqual([...asc].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)));

    const desc = search({ sort: "price-desc" }).map((v) => toMinorUnits(v.dailyRate.amount));
    expect(desc).toEqual([...desc].sort((a, b) => (a > b ? -1 : a < b ? 1 : 0)));
  });

  it("puts featured vehicles first when sorting by recommended", () => {
    const results = search({ sort: "recommended" });
    const firstNonFeatured = results.findIndex((v) => !v.featured);
    expect(results.slice(firstNonFeatured).every((v) => !v.featured)).toBe(true);
  });

  it("returns an empty list when nothing matches", () => {
    expect(search({ mode: "WITH_DRIVER", fuel: "electric" })).toEqual([]);
  });
});

describe("driver recommendations (preview)", () => {
  it("excludes unavailable drivers and drivers outside the city", () => {
    const ranked = rankDriversForCity(drivers, "Airport");
    expect(ranked.every((d) => d.available && d.serviceCities.includes("Airport"))).toBe(true);
    expect(ranked.map((d) => d.id)).not.toContain("drv-yusuf");
  });

  it("returns no drivers for a self-drive-only vehicle", async () => {
    const vehicle = await getVehicle("honda-fit");
    expect(vehicle).toBeDefined();
    expect(await getRecommendedDrivers(vehicle!)).toEqual([]);
  });

  it("returns ranked drivers for a with-driver vehicle", async () => {
    const vehicle = await getVehicle("volvo-xc60");
    const recommended = await getRecommendedDrivers(vehicle!);
    expect(recommended.length).toBeGreaterThan(0);
  });

  it("never exposes license numbers in public driver profiles", () => {
    for (const driver of drivers) {
      expect(Object.keys(driver)).not.toContain("licenseNumber");
    }
  });
});

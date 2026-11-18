import { describe, expect, it } from "vitest";
import { parseSearchParams } from "@/lib/search-schema";
import { drivers, vehicles } from "./mock-data";
import { compareMoney, toMinorUnits } from "./money";
import {
  filterAndSortVehicles,
  getBestWeeklySaving,
  getRecommendedDrivers,
  getVehicle,
  listFeaturedDrivers,
  rankDriversForCity,
  summarizeCategoryLink,
} from "./queries";

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

  it("filters by brand and minimum rating", () => {
    expect(search({ brand: "Toyota" }).every((v) => v.brand === "Toyota")).toBe(true);
    expect(search({ brand: "Toyota" }).length).toBeGreaterThan(0);
    expect(search({ minRating: "4.8" }).every((v) => v.rating >= 4.8)).toBe(true);
  });

  it("sorts by popularity (review count)", () => {
    const counts = search({ sort: "popular" }).map((v) => v.reviewCount);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
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

describe("weekly saving promo", () => {
  it("computes the saving from rates without floating-point money", async () => {
    const saving = await getBestWeeklySaving();
    expect(saving).toBeDefined();
    const daily = toMinorUnits(saving!.vehicle.dailyRate.amount) * 7n;
    const weekly = toMinorUnits(saving!.vehicle.weeklyRate.amount);
    expect(saving!.percent).toBe(Number(((daily - weekly) * 100n) / daily));
    expect(saving!.percent).toBeGreaterThan(0);
  });
});

describe("catalog data integrity", () => {
  it("gives every vehicle at least one exterior photo and a non-empty alt text", () => {
    for (const vehicle of vehicles) {
      expect(vehicle.images.some((image) => image.kind === "exterior")).toBe(true);
      expect(vehicle.images.every((image) => image.alt.length > 0)).toBe(true);
    }
  });

  it("uses valid, ordered sample booked ranges", () => {
    for (const vehicle of vehicles) {
      for (const range of vehicle.bookedRanges) {
        expect(range.start <= range.end).toBe(true);
      }
    }
  });

  it("only features available drivers, best performance first", async () => {
    const featured = await listFeaturedDrivers(4);
    expect(featured.every((driver) => driver.available)).toBe(true);
    const scores = featured.map((driver) => driver.performanceScore);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});

describe("category link summaries", () => {
  const lowestRate = (list: typeof vehicles) =>
    [...list].sort((a, b) => compareMoney(a.dailyRate, b.dailyRate))[0]?.dailyRate;

  it("counts self-drive listings in a category and finds the lowest daily rate", () => {
    const expected = vehicles.filter((v) => v.category === "suv" && v.allowedModes.includes("SELF_DRIVE"));
    const summary = summarizeCategoryLink(vehicles, "/cars?category=suv");
    expect(summary.count).toBe(expected.length);
    expect(summary.count).toBeGreaterThan(0);
    expect(summary.fromRate).toEqual(lowestRate(expected));
  });

  it("applies fuel and mode filters from the link", () => {
    const electric = vehicles.filter((v) => v.fuel === "electric" && v.allowedModes.includes("SELF_DRIVE"));
    expect(summarizeCategoryLink(vehicles, "/cars?fuel=electric").count).toBe(electric.length);
    const vans = vehicles.filter((v) => v.category === "van" && v.allowedModes.includes("WITH_DRIVER"));
    expect(summarizeCategoryLink(vehicles, "/cars?category=van&mode=WITH_DRIVER").count).toBe(vans.length);
  });

  it("returns zero and no rate when nothing matches", () => {
    const summary = summarizeCategoryLink([], "/cars?category=suv");
    expect(summary).toEqual({ href: "/cars?category=suv", count: 0, fromRate: undefined });
  });
});

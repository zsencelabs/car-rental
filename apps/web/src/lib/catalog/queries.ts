/**
 * Catalog data access for the public site.
 *
 * This is the ONLY module that reads mock data. When the API exists, replace
 * these functions with API calls (and TanStack Query on the client) without
 * touching the pages.
 *
 * Note: ranking here is for display only. The real driver recommendation and
 * any eligibility/availability decisions must happen server-side and be
 * revalidated at booking confirmation (CLAUDE.md, .claude/rules/domain.md).
 */
import { categoryLinks } from "@/lib/site-config";
import { parseSearchParams, type SearchParams } from "@/lib/search-schema";
import { compareMoney, toMinorUnits } from "./money";
import { drivers, locations, providers, sampleReviews, vehicles } from "./mock-data";
import type { DriverProfile, Location, Money, Provider, SampleReview, Vehicle } from "./types";

export async function listLocations(): Promise<Location[]> {
  return locations;
}

export async function getLocation(id: string): Promise<Location | undefined> {
  return locations.find((location) => location.id === id);
}

export async function getProvider(id: string): Promise<Provider | undefined> {
  return providers.find((provider) => provider.id === id);
}

export async function listFeaturedVehicles(): Promise<Vehicle[]> {
  return vehicles.filter((vehicle) => vehicle.featured);
}

export async function listVehicleIds(): Promise<string[]> {
  return vehicles.map((vehicle) => vehicle.id);
}

export async function getVehicle(id: string): Promise<Vehicle | undefined> {
  return vehicles.find((vehicle) => vehicle.id === id);
}

type VehicleFilters = Omit<SearchParams, "pickupAt" | "returnAt">;

export function filterAndSortVehicles(all: Vehicle[], params: VehicleFilters): Vehicle[] {
  const matches = all.filter((vehicle) => {
    if (!vehicle.allowedModes.includes(params.mode)) return false;
    if (params.location && vehicle.locationId !== params.location) return false;
    if (params.category && vehicle.category !== params.category) return false;
    if (params.transmission && vehicle.transmission !== params.transmission) return false;
    if (params.fuel && vehicle.fuel !== params.fuel) return false;
    if (params.minSeats && vehicle.seats < params.minSeats) return false;
    if (params.brand && vehicle.brand !== params.brand) return false;
    if (params.minRating && vehicle.rating < params.minRating) return false;
    if (
      params.maxDailyRate &&
      toMinorUnits(vehicle.dailyRate.amount) > BigInt(params.maxDailyRate) * 100n
    ) {
      return false;
    }
    return true;
  });

  const sorted = [...matches];
  switch (params.sort) {
    case "price-asc":
      sorted.sort((a, b) => compareMoney(a.dailyRate, b.dailyRate));
      break;
    case "price-desc":
      sorted.sort((a, b) => compareMoney(b.dailyRate, a.dailyRate));
      break;
    case "popular":
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case "recommended":
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
      break;
  }
  return sorted;
}

export interface CategorySummary {
  href: string;
  count: number;
  /** Lowest daily rate among the matching listings; undefined when nothing matches. */
  fromRate?: Money;
}

/**
 * What a category link on the home page leads to: how many listings it shows and
 * the lowest daily rate. Uses the same URL parsing and filters as the /cars page.
 */
export function summarizeCategoryLink(all: Vehicle[], href: string): CategorySummary {
  const query = new URLSearchParams(href.split("?")[1] ?? "");
  const matches = filterAndSortVehicles(all, parseSearchParams(Object.fromEntries(query)));
  const fromRate = matches.reduce<Money | undefined>(
    (lowest, vehicle) => (!lowest || compareMoney(vehicle.dailyRate, lowest) < 0 ? vehicle.dailyRate : lowest),
    undefined,
  );
  return { href, count: matches.length, fromRate };
}

export async function listCategorySummaries(): Promise<CategorySummary[]> {
  return categoryLinks.map((link) => summarizeCategoryLink(vehicles, link.href));
}

/**
 * Availability for the requested dates is NOT checked here: there is no
 * booking data yet. Results show listings that match the filters only.
 */
export async function searchVehicles(params: SearchParams): Promise<Vehicle[]> {
  return filterAndSortVehicles(vehicles, params);
}

/** Display-only ranking score for the preview. Not the production algorithm. */
function previewDriverScore(driver: DriverProfile): number {
  return (
    driver.rating * 20 +
    Math.min(driver.completedTrips, 500) / 25 +
    driver.acceptanceRate / 10 -
    driver.cancellationRate * 2
  );
}

export function rankDriversForCity(all: DriverProfile[], city: string): DriverProfile[] {
  return all
    .filter((driver) => driver.available && driver.serviceCities.includes(city))
    .sort((a, b) => previewDriverScore(b) - previewDriverScore(a));
}

export async function getRecommendedDrivers(vehicle: Vehicle): Promise<DriverProfile[]> {
  if (!vehicle.allowedModes.includes("WITH_DRIVER")) return [];
  const location = await getLocation(vehicle.locationId);
  if (!location) return [];
  return rankDriversForCity(drivers, location.city);
}

export async function listBrands(): Promise<string[]> {
  return [...new Set(vehicles.map((vehicle) => vehicle.brand))].sort();
}

/** All listings; used to pick a representative photo for each category tile. */
export async function listAllVehicles(): Promise<Vehicle[]> {
  return vehicles;
}

export async function listSampleReviews(vehicleId?: string): Promise<SampleReview[]> {
  return vehicleId ? sampleReviews.filter((review) => review.vehicleId === vehicleId) : sampleReviews;
}

/** Top available drivers for the home page showcase (display-only ranking). */
export async function listFeaturedDrivers(limit = 4): Promise<DriverProfile[]> {
  return drivers
    .filter((driver) => driver.available)
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, limit);
}

export interface WeeklySaving {
  vehicle: Vehicle;
  /** Whole-percent saving of the weekly rate versus 7 × the daily rate (rounded down). */
  percent: number;
}

/** Largest weekly-vs-daily saving across listings, computed in integer minor units. */
export async function getBestWeeklySaving(): Promise<WeeklySaving | undefined> {
  let best: WeeklySaving | undefined;
  for (const vehicle of vehicles) {
    const sevenDays = toMinorUnits(vehicle.dailyRate.amount) * 7n;
    const weekly = toMinorUnits(vehicle.weeklyRate.amount);
    if (weekly >= sevenDays) continue;
    const percent = Number(((sevenDays - weekly) * 100n) / sevenDays);
    if (!best || percent > best.percent) best = { vehicle, percent };
  }
  return best;
}

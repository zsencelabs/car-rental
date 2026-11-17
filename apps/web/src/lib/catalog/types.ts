/**
 * Catalog types for the public website.
 *
 * These mirror the domain language in CLAUDE.md and the SRS. They are UI-facing
 * shapes only; the real API contracts will be defined when the backend exists.
 */

export const RENTAL_MODES = ["SELF_DRIVE", "WITH_DRIVER"] as const;
export type RentalMode = (typeof RENTAL_MODES)[number];

export const VEHICLE_CATEGORIES = ["sedan", "suv", "hatchback", "van", "luxury"] as const;
export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number];

export const TRANSMISSIONS = ["automatic", "manual"] as const;
export type Transmission = (typeof TRANSMISSIONS)[number];

export const FUEL_TYPES = ["petrol", "diesel", "hybrid", "electric"] as const;
export type FuelType = (typeof FUEL_TYPES)[number];

/**
 * Money is a decimal string (e.g. "65.00") plus an ISO currency code.
 * Never store or compute money as a JS number (CLAUDE.md: decimal-safe money).
 */
export interface Money {
  amount: string;
  currency: string;
}

export type ProviderType = "RENTAL_COMPANY" | "INDIVIDUAL_OWNER";

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  rating: number;
  reviewCount: number;
}

export interface Location {
  id: string;
  name: string;
  city: string;
}

export type VehicleTint = "sand" | "sage" | "mist";

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  transmission: Transmission;
  fuel: FuelType;
  seats: number;
  features: string[];
  /** Which rental modes the provider allows for this vehicle (SRS §6.2). */
  allowedModes: RentalMode[];
  dailyRate: Money;
  weeklyRate: Money;
  monthlyRate: Money;
  /** Refundable; shown separately and never counted as rental revenue (SRS §9.3). */
  securityDeposit: Money;
  includedKmPerDay: number;
  extraKmCharge: Money;
  fuelPolicy: string;
  cancellationSummary: string;
  locationId: string;
  providerId: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  tint: VehicleTint;
  summary: string;
}

/** Public driver profile. Never includes license numbers or documents (SRS §5.2, §18.6). */
export interface DriverProfile {
  id: string;
  name: string;
  initials: string;
  yearsExperience: number;
  licenseCategory: string;
  languages: string[];
  serviceCities: string[];
  completedTrips: number;
  rating: number;
  reviewCount: number;
  acceptanceRate: number;
  cancellationRate: number;
  dailyRate: Money;
  available: boolean;
  bio: string;
}

export type SortOption = "recommended" | "price-asc" | "price-desc" | "rating";

export const CATEGORY_LABELS: Record<VehicleCategory, string> = {
  sedan: "Sedan",
  suv: "SUV",
  hatchback: "Hatchback",
  van: "Van",
  luxury: "Luxury",
};

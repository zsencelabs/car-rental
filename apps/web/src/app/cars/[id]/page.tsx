import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  BuildingIcon,
  CheckIcon,
  IdCardIcon,
  MapPinIcon,
  RouteIcon,
  ShieldCheckIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AvailabilityCalendar } from "@/components/site/availability-calendar";
import { VehicleGallery } from "@/components/site/vehicle-gallery";
import { DriverCard } from "@/components/site/driver-card";
import { PageContainer } from "@/components/site/page-intro";
import { RentalOptions, RentalOptionsTabs } from "@/components/site/rental-options";
import { formatMoney } from "@/lib/catalog/money";
import {
  getLocation,
  getProvider,
  getRecommendedDrivers,
  getVehicle,
  listSampleReviews,
  listVehicleIds,
} from "@/lib/catalog/queries";
import { CATEGORY_LABELS, type DriverProfile, type Vehicle } from "@/lib/catalog/types";
import { capitalize } from "@/lib/utils";

export async function generateStaticParams() {
  const ids = await listVehicleIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps<"/cars/[id]">): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  return vehicle ? { title: vehicle.name, description: vehicle.summary } : { title: "Car not found" };
}

function PriceRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="text-sm text-muted-foreground">
        {label}
        {note ? <span className="block text-xs">{note}</span> : null}
      </dt>
      <dd className="font-semibold text-brand-ink">{value}</dd>
    </div>
  );
}

function BookingCta() {
  return (
    <div className="mt-5">
      <Button size="lg" className="h-11 w-full" disabled>
        Online booking opens soon
      </Button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Final prices, taxes and fees will be confirmed at checkout before you pay.
      </p>
    </div>
  );
}

function SelfDrivePanel({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div>
      <h3 className="font-semibold text-brand-ink">You&apos;ll need</h3>
      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
        {[
          "A valid driving license",
          "Identity verification before your booking is confirmed",
          `A refundable security deposit of ${formatMoney(vehicle.securityDeposit, { compact: true })}`,
          `Minimum driver age: ${vehicle.minimumAge}`,
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>
      <BookingCta />
    </div>
  );
}

function WithDriverPanel({ drivers }: { drivers: DriverProfile[] }) {
  return (
    <div>
      <h3 className="font-semibold text-brand-ink">Recommended drivers</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Independent, verified drivers who serve this pickup area. You choose who drives. Driver charges are
        added separately to the vehicle price.
      </p>
      {drivers.length > 0 ? (
        <div className="mt-4 space-y-3">
          {drivers.map((driver, index) => (
            <DriverCard key={driver.id} driver={driver} rank={index + 1} />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          No drivers are currently available for this area. Try self-drive or another car.
        </p>
      )}
      <BookingCta />
    </div>
  );
}

export default async function CarDetailPage({ params }: PageProps<"/cars/[id]">) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();

  const [provider, location, drivers, reviews] = await Promise.all([
    getProvider(vehicle.providerId),
    getLocation(vehicle.locationId),
    getRecommendedDrivers(vehicle),
    listSampleReviews(vehicle.id),
  ]);

  const tabsProps = {
    allowedModes: vehicle.allowedModes,
    selfDrive: <SelfDrivePanel vehicle={vehicle} />,
    withDriver: <WithDriverPanel drivers={drivers} />,
  };

  return (
    <PageContainer>
      <Link
        href="/cars"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        Back to all cars
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <VehicleGallery images={vehicle.images} name={vehicle.name} />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="section-title">{vehicle.name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>{vehicle.year}</span>·<span>{CATEGORY_LABELS[vehicle.category]}</span>·
                <span className="inline-flex items-center gap-1">
                  <StarIcon aria-hidden="true" className="size-3.5 fill-[#c9a45c] text-[#c9a45c]" />
                  {vehicle.rating.toFixed(1)} ({vehicle.reviewCount} reviews)
                </span>
              </p>
            </div>
            {location ? (
              <Badge variant="secondary" className="gap-1">
                <MapPinIcon aria-hidden="true" className="size-3.5" />
                {location.name}
              </Badge>
            ) : null}
          </div>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{vehicle.summary}</p>

          <h2 className="mt-8 text-lg font-semibold text-brand-ink">Specifications</h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              ["Seats", String(vehicle.seats)],
              ["Luggage", `${vehicle.bags} large bags`],
              ["Transmission", capitalize(vehicle.transmission)],
              ["Fuel", capitalize(vehicle.fuel)],
              ["Included", `${vehicle.includedKmPerDay} km/day`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border bg-card p-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-semibold text-brand-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 text-lg font-semibold text-brand-ink">Features</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {vehicle.features.map((feature) => (
              <li key={feature}>
                <Badge variant="outline" className="h-7 px-3">
                  {feature}
                </Badge>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-lg font-semibold text-brand-ink">Policies</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="font-medium text-brand-ink">Fuel</dt>
              <dd className="text-muted-foreground">{vehicle.fuelPolicy}</dd>
            </div>
            <div>
              <dt className="font-medium text-brand-ink">Cancellation</dt>
              <dd className="text-muted-foreground">{vehicle.cancellationSummary}</dd>
            </div>
            <div>
              <dt className="font-medium text-brand-ink">Extra distance</dt>
              <dd className="text-muted-foreground">
                {formatMoney(vehicle.extraKmCharge)} per km beyond {vehicle.includedKmPerDay} km/day
              </dd>
            </div>
          </dl>

          <h2 className="mt-8 text-lg font-semibold text-brand-ink">Rental requirements</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { Icon: IdCardIcon, title: "Self-drive", body: `Valid license, ID verification, age ${vehicle.minimumAge}+.` },
              { Icon: UserIcon, title: "With a driver", body: "Choose a verified independent driver. No license needed." },
              { Icon: ShieldCheckIcon, title: "Insurance", body: vehicle.insurance },
              { Icon: RouteIcon, title: "Pickup & drop-off", body: `${location?.name ?? "Provider location"}. Drop-off: ${vehicle.dropoffOptions.join(" or ")}.` },
            ].map(({ Icon, title, body }) => (
              <li key={title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-brand-ink">{title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 text-lg font-semibold text-brand-ink">Availability</h2>
          <div className="mt-3 rounded-2xl border border-border bg-card p-5">
            <AvailabilityCalendar ranges={vehicle.bookedRanges} />
          </div>

          {provider ? (
            <div className="mt-8 flex items-center gap-4 rounded-[13px] border border-[#e7eae3] bg-card p-4">
              <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                {provider.type === "RENTAL_COMPANY" ? (
                  <BuildingIcon aria-hidden="true" className="size-5" />
                ) : (
                  <UserIcon aria-hidden="true" className="size-5" />
                )}
              </span>
              <div>
                <p className="font-semibold text-brand-ink">{provider.name}</p>
                <p className="text-sm text-muted-foreground">
                  {provider.type === "RENTAL_COMPANY" ? "Rental company" : "Individual owner"} ·{" "}
                  {provider.rating.toFixed(1)} rating ({provider.reviewCount} reviews)
                </p>
              </div>
            </div>
          ) : null}

          {reviews.length > 0 ? (
            <section aria-labelledby="car-reviews" className="mt-8">
              <h2 id="car-reviews" className="text-lg font-semibold text-brand-ink">
                Reviews <span className="text-sm font-normal text-muted-foreground">(sample)</span>
              </h2>
              <ul className="mt-3 space-y-3">
                {reviews.map((review) => (
                  <li key={review.id} className="rounded-xl border border-border bg-card p-4">
                    <p className="flex items-center gap-1 text-sm font-semibold text-brand-ink">
                      <StarIcon aria-hidden="true" className="size-3.5 fill-[#c9a45c] text-[#c9a45c]" />
                      {review.rating}/5 · {review.title}
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{review.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{review.author}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[18px] border border-[#e5eae3] bg-card p-5 shadow-[0_24px_60px_-40px_rgba(38,60,50,0.55)] sm:p-6">
            <h2 className="text-lg font-semibold text-brand-ink">Vehicle rates</h2>
            <dl className="mt-2">
              <PriceRow label="Daily" value={formatMoney(vehicle.dailyRate)} />
              <PriceRow label="Weekly" value={formatMoney(vehicle.weeklyRate)} />
              <PriceRow label="Monthly" value={formatMoney(vehicle.monthlyRate)} />
            </dl>
            <Separator className="my-3" />
            <dl>
              <PriceRow
                label="Security deposit"
                note="Refundable. Held separately, not part of the rental price."
                value={formatMoney(vehicle.securityDeposit)}
              />
            </dl>
            <Separator className="my-4" />
            <Suspense fallback={<RentalOptionsTabs defaultMode={vehicle.allowedModes[0]} {...tabsProps} />}>
              <RentalOptions {...tabsProps} />
            </Suspense>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}

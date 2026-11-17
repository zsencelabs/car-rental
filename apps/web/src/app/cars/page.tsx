import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDownIcon, SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/site/car-card";
import { CarFilters } from "@/components/site/car-filters";
import { PageContainer, PreviewNotice } from "@/components/site/page-intro";
import { getLocation, listBrands, listLocations, searchVehicles } from "@/lib/catalog/queries";
import { modeLabel, parseSearchParams } from "@/lib/search-schema";

export const metadata: Metadata = {
  title: "Browse cars",
  description: "Compare cars for self-drive or with an independent professional driver.",
};

function formatWhen(value: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

async function CarResults({ searchParams }: { searchParams: PageProps<"/cars">["searchParams"] }) {
  const params = parseSearchParams(await searchParams);
  const [locations, brands, results, location] = await Promise.all([
    listLocations(),
    listBrands(),
    searchVehicles(params),
    params.location ? getLocation(params.location) : Promise.resolve(undefined),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside>
        <details className="group rounded-[13px] border border-[#e7eae3] bg-card lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold text-brand-ink">
            Filters &amp; sort
            <ChevronDownIcon aria-hidden="true" className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <CarFilters params={params} locations={locations} brands={brands} idPrefix="m" className="rounded-t-none border-0 border-t" />
        </details>
        <CarFilters params={params} locations={locations} brands={brands} idPrefix="d" className="hidden lg:block" />
      </aside>

      <section aria-labelledby="results-heading">
        <h2 id="results-heading" className="text-sm text-muted-foreground" aria-live="polite">
          <span className="font-semibold text-brand-ink">{results.length}</span>{" "}
          {results.length === 1 ? "car" : "cars"} for{" "}
          <span className="font-semibold text-brand-ink">{modeLabel(params.mode).toLowerCase()}</span>
          {location ? ` from ${location.name}` : ""}
          {params.pickupAt && params.returnAt
            ? `, ${formatWhen(params.pickupAt)} to ${formatWhen(params.returnAt)}`
            : ""}
        </h2>

        {results.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((vehicle, index) => (
              <CarCard key={vehicle.id} vehicle={vehicle} mode={params.mode} priority={index < 3} />
            ))}
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-center rounded-[13px] border border-dashed border-border bg-card px-6 py-16 text-center">
            <SearchXIcon aria-hidden="true" className="size-8 text-muted-foreground" />
            <p className="mt-3 font-semibold text-brand-ink">No cars match these filters</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try another location or category, or switch rental type.
            </p>
            <Button asChild variant="outline" className="mt-5">
              <Link href={`/cars?mode=${params.mode}`}>Clear filters</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]" aria-busy="true" aria-label="Loading cars">
      <div className="h-[520px] animate-pulse rounded-[13px] bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-[13px] bg-muted" />
        ))}
      </div>
    </div>
  );
}

export default function CarsPage({ searchParams }: PageProps<"/cars">) {
  return (
    <PageContainer>
      <p className="eyebrow">Browse</p>
      <h1 className="section-title mt-2">Find your car</h1>
      <div className="mt-5 max-w-3xl">
        <PreviewNotice>
          Preview: date availability isn&apos;t checked yet, and online booking opens soon. All listings are
          sample data.
        </PreviewNotice>
      </div>
      <div className="mt-8">
        <Suspense fallback={<ResultsSkeleton />}>
          <CarResults searchParams={searchParams} />
        </Suspense>
      </div>
    </PageContainer>
  );
}

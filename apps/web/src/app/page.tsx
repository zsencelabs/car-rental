import Link from "next/link";
import { ArrowRightIcon, ShieldCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/site/car-card";
import { HeroArt } from "@/components/site/hero-art";
import { HowItWorksSteps } from "@/components/site/how-it-works-steps";
import { PartnerCards } from "@/components/site/partner-cards";
import { SearchForm } from "@/components/site/search-form";
import { listFeaturedVehicles, listLocations } from "@/lib/catalog/queries";

export default async function HomePage() {
  const [locations, featured] = await Promise.all([listLocations(), listFeaturedVehicles()]);

  return (
    <>
      <section className="mx-auto w-full max-w-[1180px] px-4 pt-12 pb-16 sm:px-6 md:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div className="max-w-[540px]">
            <p className="eyebrow flex items-center gap-2.5">
              <span aria-hidden="true" className="size-[7px] rounded-full bg-[#82a687] shadow-[0_0_0_4px_#e9efe7]" />
              Your next journey starts here
            </p>
            <h1 className="display-title mt-5">
              Find your way.
              <br />
              <em className="heading-accent">We&apos;ll find the car.</em>
            </h1>
            <p className="mt-5 max-w-[475px] text-[0.95rem] leading-[1.8] text-[#5f6e64]">
              Thoughtful car hire, on your terms. Choose a car that fits your plans, and go your own way, or
              let a professional driver take the wheel.
            </p>
            <p className="mt-6 flex items-center gap-2.5 text-sm text-[#5b6a60]">
              <span className="grid size-8 place-items-center rounded-full bg-secondary">
                <ShieldCheckIcon aria-hidden="true" className="size-4 text-primary" />
              </span>
              Trusted vehicles. Clear pricing. Support when you need it.
            </p>
          </div>

          <HeroArt />
        </div>

        <div className="mt-12">
          <SearchForm locations={locations} />
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="mx-auto w-full max-w-[1180px] px-4 pb-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Featured</p>
            <h2 id="featured-heading" className="section-title mt-2">
              A car for every kind of day
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/cars">
              Browse all cars <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((vehicle) => (
            <CarCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
              Pick your car. <em className="font-[family-name:var(--font-accent)] font-normal text-[#cfe0d2]">Pick your pace.</em>
            </h2>
            <p className="mt-3 max-w-xl text-primary-foreground/80">
              Drive yourself, or add an independent driver you choose from rated, verified professionals.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary">
            <Link href="/how-it-works">Explore your options</Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="mx-auto w-full max-w-[1180px] px-4 py-20 sm:px-6">
        <p className="eyebrow">How it works</p>
        <h2 id="how-heading" className="section-title mt-2">
          Three steps to the road
        </h2>
        <HowItWorksSteps className="mt-8" />
      </section>

      <section aria-labelledby="partners-heading" className="border-t border-border bg-muted/60">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-20 sm:px-6">
          <p className="eyebrow">Work with us</p>
          <h2 id="partners-heading" className="section-title mt-2">
            Rental partners
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Vehicle ownership and driving services stay independent. Providers bring the cars, and drivers
            bring their skills.
          </p>
          <div className="mt-8">
            <PartnerCards />
          </div>
        </div>
      </section>
    </>
  );
}

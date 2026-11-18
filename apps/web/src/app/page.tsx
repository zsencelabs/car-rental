import { CarCard } from "@/components/site/car-card";
import { HomeHero } from "@/components/site/home-hero";
import {
  CategoryGrid,
  Destinations,
  DriverShowcase,
  PartnerCta,
  PromoBanner,
  ReviewsGrid,
  SectionHeading,
  TwoWaysToRent,
  ValueStrip,
} from "@/components/site/home-sections";
import { HowItWorksStory } from "@/components/site/how-it-works-story";
import { Reveal } from "@/components/motion/reveal";
import {
  getBestWeeklySaving,
  listCategorySummaries,
  listFeaturedDrivers,
  listFeaturedVehicles,
  listLocations,
  listSampleReviews,
} from "@/lib/catalog/queries";

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`mx-auto w-full max-w-[1240px] px-4 sm:px-6 ${className}`}>{children}</section>;
}

export default async function HomePage() {
  const [locations, featured, drivers, reviews, saving, categorySummaries] = await Promise.all([
    listLocations(),
    listFeaturedVehicles(),
    listFeaturedDrivers(4),
    listSampleReviews(),
    getBestWeeklySaving(),
    listCategorySummaries(),
  ]);

  return (
    <>
      <HomeHero locations={locations} />

      <Section className="pt-14 md:pt-16">
        <ValueStrip />
      </Section>

      <Section className="pt-14 pb-20 md:pt-16">
        <SectionHeading
          eyebrow="Browse by category"
          title="The right car"
          accent="for the trip."
          action={{ href: "/cars", label: "All cars" }}
        />
        <div className="mt-10">
          <CategoryGrid summaries={categorySummaries} />
        </div>
      </Section>

      <Section className="pb-24">
        <SectionHeading
          eyebrow="Recommended"
          title="Popular right now"
          description="Hand-picked cars from rental companies and local owners, all verified before listing."
          action={{ href: "/cars?sort=popular", label: "See more" }}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((vehicle, index) => (
            <Reveal key={vehicle.id} delay={index * 0.08}>
              <CarCard vehicle={vehicle} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Section>

      <section aria-labelledby="story-heading" className="border-y border-border bg-[#f3f1e8]">
        <div className="mx-auto w-full max-w-[1240px] px-4 pt-20 pb-12 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How KAIYA works</p>
            <h2 id="story-heading" className="section-title mt-3">
              One booking, <em className="heading-accent">two independent services.</em>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Cars come from rental companies and local owners. Drivers are independent professionals. We
              bring them together, check both, and confirm only when everything lines up.
            </p>
          </Reveal>
          <div className="mt-10">
            <HowItWorksStory />
          </div>
        </div>
      </section>

      <Section className="py-24">
        <SectionHeading eyebrow="Two ways to rent" title="Drive yourself," accent="or be driven." />
        <div className="mt-10">
          <TwoWaysToRent />
        </div>
      </Section>

      <Section className="pb-24">
        <SectionHeading
          eyebrow="Independent drivers"
          title="Meet some of our drivers"
          description="Sample profiles. Every driver is verified and ranked by performance, not just ratings. You always choose."
          action={{ href: "/work-with-us/drivers", label: "Become a driver" }}
        />
        <div className="mt-10">
          <DriverShowcase drivers={drivers} />
        </div>
      </Section>

      <Section className="pb-24">
        <SectionHeading
          eyebrow="Popular destinations"
          title="Pick up where"
          accent="you land."
          description="Collect your car, or meet your driver, at the places you arrive."
        />
        <div className="mt-10">
          <Destinations locations={locations} />
        </div>
      </Section>

      <Section className="pb-24">
        <PromoBanner saving={saving} />
      </Section>

      <Section className="pb-24">
        <SectionHeading
          eyebrow="Customer reviews"
          title="What renters say"
          description="Sample reviews for this preview. Reviews will only come from completed bookings."
        />
        <div className="mt-10">
          <ReviewsGrid reviews={reviews} />
        </div>
      </Section>

      <Section className="pb-24">
        <PartnerCta />
      </Section>
    </>
  );
}

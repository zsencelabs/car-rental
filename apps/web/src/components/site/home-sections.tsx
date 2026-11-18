import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CarFrontIcon,
  CheckIcon,
  HandCoinsIcon,
  LanguagesIcon,
  QuoteIcon,
  ReceiptTextIcon,
  ShieldCheckIcon,
  StarIcon,
  UserRoundCheckIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/catalog/money";
import type { CategorySummary, WeeklySaving } from "@/lib/catalog/queries";
import type { DriverProfile, Location, SampleReview } from "@/lib/catalog/types";
import { categoryLinks } from "@/lib/site-config";

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <Reveal className="flex flex-wrap items-end justify-between gap-5">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title mt-3">
          {title} {accent ? <em className="heading-accent">{accent}</em> : null}
        </h2>
        {description ? <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {action ? (
        <Button asChild variant="outline" className="h-10">
          <Link href={action.href}>
            {action.label} <ArrowRightIcon aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </Reveal>
  );
}

const VALUES = [
  { Icon: BadgeCheckIcon, title: "Verified providers", body: "Companies, owners and every car are checked before listing." },
  { Icon: UserRoundCheckIcon, title: "Independent drivers", body: "Vetted professionals you choose yourself." },
  { Icon: ReceiptTextIcon, title: "No hidden fees", body: "Every charge is shown before you pay." },
  { Icon: ShieldCheckIcon, title: "Deposit kept separate", body: "Refundable, and never counted as rental price." },
];

/** Hairline dividers for a 1-column (phone), 2×2 (sm) and 4-column (lg) grid. */
const VALUE_DIVIDERS = [
  "",
  "border-t sm:border-t-0 sm:border-l",
  "border-t lg:border-t-0 lg:border-l",
  "border-t sm:border-l lg:border-t-0",
];

export function ValueStrip() {
  return (
    <ul className="grid overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(18,36,27,0.04)] sm:grid-cols-2 lg:grid-cols-4">
      {VALUES.map(({ Icon, title, body }, index) => (
        <Reveal
          as="li"
          key={title}
          delay={index * 0.08}
          className={`border-border p-6 lg:p-7 ${VALUE_DIVIDERS[index] ?? ""}`}
        >
          <p className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-brand-ink">
            <Icon aria-hidden="true" strokeWidth={1.75} className="size-[18px] shrink-0 text-primary" />
            {title}
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-pretty text-muted-foreground">
            {body}
          </p>
        </Reveal>
      ))}
    </ul>
  );
}

function categorySubtitle(summary: CategorySummary | undefined): string {
  if (!summary?.fromRate || summary.count === 0) return "Coming soon";
  const models = `${summary.count} ${summary.count === 1 ? "model" : "models"}`;
  return `${models} · from ${formatMoney(summary.fromRate, { compact: true })}/day`;
}

export function CategoryGrid({ summaries }: { summaries: CategorySummary[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
      {categoryLinks.map((category, index) => (
        <Reveal as="li" key={category.href} delay={index * 0.05}>
          <Link
            href={category.href}
            className="group relative block aspect-[9/10] overflow-hidden rounded-2xl bg-secondary outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
          >
            <Image
              src={category.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 200px, (min-width: 768px) 33vw, 50vw"
              style={"imagePosition" in category ? { objectPosition: category.imagePosition } : undefined}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[rgba(18,36,27,0.92)] via-[rgba(18,36,27,0.45)] to-transparent" />
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5 ring-inset" />
            <span className="absolute inset-x-0 bottom-0 p-4">
              <span className="block text-lg leading-tight font-semibold tracking-tight text-white">
                {category.label}
              </span>
              <span className="mt-0.5 block truncate text-[11px] text-white/80 sm:text-xs">
                {categorySubtitle(summaries.find((summary) => summary.href === category.href))}
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

const WAYS = [
  {
    title: "Self-drive",
    image: "/images/story/self-drive-road.jpg",
    alt: "View through a windscreen of a mountain road",
    body: "Take the wheel yourself. Ideal for road trips, errands and flexible plans.",
    needs: ["Valid driving license", "Identity verification", "Refundable security deposit"],
    href: "/cars?mode=SELF_DRIVE",
    cta: "Browse self-drive cars",
  },
  {
    title: "With a driver",
    image: "/images/story/with-driver-backseat.jpg",
    alt: "A passenger's view of a driver from the back seat",
    body: "Sit back while an independent professional drives. You choose who, from a ranked list.",
    needs: ["Pick a verified driver", "Compare ratings, trips and languages", "Driver fee shown separately"],
    href: "/cars?mode=WITH_DRIVER",
    cta: "Browse cars with a driver",
  },
];

export function TwoWaysToRent() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {WAYS.map((way, index) => (
        <Reveal key={way.title} delay={index * 0.12}>
          <article className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-[24px] p-7 text-white sm:p-9">
            <Image
              src={way.image}
              alt={way.alt}
              fill
              sizes="(min-width: 1024px) 600px, 100vw"
              className="-z-10 object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[rgba(15,30,22,0.92)] via-[rgba(15,30,22,0.45)] to-[rgba(15,30,22,0.1)]" />
            <h3 className="text-3xl font-semibold tracking-[-0.03em]">{way.title}</h3>
            <p className="mt-3 max-w-md text-white/85">{way.body}</p>
            <ul className="mt-5 space-y-2">
              {way.needs.map((need) => (
                <li key={need} className="flex items-center gap-2 text-sm text-white/90">
                  <span className="grid size-5 place-items-center rounded-full bg-white/20">
                    <CheckIcon aria-hidden="true" className="size-3" />
                  </span>
                  {need}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7 h-11 w-fit bg-white px-5 text-brand-ink hover:bg-white/90">
              <Link href={way.href}>
                {way.cta} <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function DriverShowcase({ drivers }: { drivers: DriverProfile[] }) {
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {drivers.map((driver, index) => (
        <Reveal as="li" key={driver.id} delay={index * 0.08} className="w-[78%] shrink-0 snap-start sm:w-auto">
          <article className="h-full rounded-[18px] border border-[#e7eae3] bg-card p-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-14 place-items-center rounded-2xl bg-[linear-gradient(135deg,#3e7054,#63866c)] text-lg font-bold text-white"
              >
                {driver.initials}
              </span>
              <div>
                <h3 className="flex items-center gap-1.5 font-semibold text-brand-ink">
                  {driver.name}
                  <BadgeCheckIcon aria-label="Verified driver" className="size-4 text-primary" />
                </h3>
                <p className="text-xs text-muted-foreground">
                  {driver.yearsExperience} yrs · License {driver.licenseCategory}
                </p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-muted py-2">
                <dt className="text-[0.68rem] text-muted-foreground">Rating</dt>
                <dd className="flex items-center justify-center gap-1 font-semibold text-brand-ink">
                  <StarIcon aria-hidden="true" className="size-3.5 fill-[#c9a45c] text-[#c9a45c]" />
                  {driver.rating.toFixed(1)}
                </dd>
              </div>
              <div className="rounded-xl bg-muted py-2">
                <dt className="text-[0.68rem] text-muted-foreground">Trips</dt>
                <dd className="font-semibold text-brand-ink">{driver.completedTrips}</dd>
              </div>
              <div className="rounded-xl bg-muted py-2">
                <dt className="text-[0.68rem] text-muted-foreground">Score</dt>
                <dd className="font-semibold text-brand-ink">{driver.performanceScore}</dd>
              </div>
            </dl>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <LanguagesIcon aria-hidden="true" className="size-3.5" />
              {driver.languages.join(", ")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              From <span className="font-semibold text-brand-ink">{formatMoney(driver.dailyRate, { compact: true })}</span>{" "}
              / day
            </p>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}

export function Destinations({ locations }: { locations: Location[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {locations.map((location, index) => (
        <Reveal as="li" key={location.id} delay={index * 0.08}>
          <Link
            href={`/cars?location=${location.id}`}
            className="group relative block aspect-[3/4] overflow-hidden rounded-[20px] bg-secondary sm:aspect-[4/5]"
          >
            <Image
              src={location.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[rgba(15,30,22,0.88)] via-transparent to-transparent" />
            <span className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="block text-xl font-semibold">{location.name}</span>
              <span className="mt-1 block text-sm text-white/80">{location.description}</span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                See cars here <ArrowRightIcon aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

export function PromoBanner({ saving }: { saving: WeeklySaving | undefined }) {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-[24px] bg-primary px-7 py-10 text-primary-foreground sm:px-12 sm:py-12">
        <div aria-hidden="true" className="absolute -top-20 -right-16 size-72 rounded-full bg-white/10" />
        <div aria-hidden="true" className="absolute -bottom-24 right-40 size-56 rounded-full bg-white/5" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[#cfe0d2] uppercase">
              <HandCoinsIcon aria-hidden="true" className="size-4" /> Longer trips, better rates
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Weekly and monthly rates on every car.
            </h2>
            {saving ? (
              <p className="mt-3 text-primary-foreground/80">
                For example, the {saving.vehicle.name} is {formatMoney(saving.vehicle.weeklyRate, { compact: true })} a
                week, {saving.percent}% less than seven daily rentals.
              </p>
            ) : null}
          </div>
          <Button asChild size="lg" className="h-12 w-fit bg-white px-6 text-brand-ink hover:bg-white/90">
            <Link href="/cars?sort=price-asc">
              Compare rates <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export function ReviewsGrid({ reviews }: { reviews: SampleReview[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {reviews.slice(0, 3).map((review, index) => (
        <Reveal as="li" key={review.id} delay={index * 0.1}>
          <figure className="flex h-full flex-col rounded-[18px] border border-[#e7eae3] bg-card p-6">
            <QuoteIcon aria-hidden="true" className="size-7 text-[#c3d4c7]" />
            <div className="mt-3 flex gap-0.5" aria-label={`${review.rating} out of 5`}>
              {Array.from({ length: 5 }, (_, star) => (
                <StarIcon
                  key={star}
                  aria-hidden="true"
                  className={star < review.rating ? "size-4 fill-[#c9a45c] text-[#c9a45c]" : "size-4 text-[#d9ddd6]"}
                />
              ))}
            </div>
            <blockquote className="mt-3 flex-1">
              <p className="font-semibold text-brand-ink">{review.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
            </blockquote>
            <figcaption className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <span>{review.author}</span>
              <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 font-medium text-secondary-foreground">
                <CarFrontIcon aria-hidden="true" className="size-3" />
                {review.mode === "SELF_DRIVE" ? "Self-drive" : "With a driver"}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}

export function PartnerCta() {
  return (
    <Reveal>
      <div className="relative isolate overflow-hidden rounded-[24px] px-7 py-14 text-white sm:px-12">
        <Image
          src="/images/story/hands-on-wheel.jpg"
          alt=""
          fill
          sizes="(min-width: 1240px) 1200px, 100vw"
          className="-z-10 object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,30,22,0.92)_0%,rgba(15,30,22,0.72)_50%,rgba(15,30,22,0.2)_100%)]" />
        <p className="text-xs font-semibold tracking-[0.16em] text-[#cfe0d2] uppercase">Work with us</p>
        <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Own a car or love to drive? Earn with KAIYA.
        </h2>
        <p className="mt-3 max-w-lg text-white/80">
          Rental companies and owners list vehicles. Independent drivers offer their services. Each is paid
          separately for their part of every trip.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-11 bg-white px-5 text-brand-ink hover:bg-white/90">
            <Link href="/work-with-us/providers">List your vehicle</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-11 border-white/50 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/work-with-us/drivers">Drive with us</Link>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRightIcon, BadgeCheckIcon, MapPinIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/catalog/money";
import type { DriverProfile } from "@/lib/catalog/types";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const CARD_WIDTH = "w-[290px] sm:w-[310px]";
/** Pinning needs room for the heading and a full card below the sticky header. */
const TALL_ENOUGH_QUERY = "(min-height: 700px)";

function DriverProfileCard({ driver }: { driver: DriverProfile }) {
  const stats = [
    {
      label: "Rating",
      value: (
        <span className="inline-flex items-center gap-1">
          <StarIcon aria-hidden="true" className="size-3.5 fill-[#f0c96b] text-[#f0c96b]" />
          {driver.rating.toFixed(1)}
        </span>
      ),
    },
    { label: "Trips", value: driver.completedTrips },
    { label: "Score", value: driver.performanceScore },
  ];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_1px_2px_rgba(18,36,27,0.04),0_18px_40px_-28px_rgba(18,36,27,0.35)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,#3e7054,#63866c)]">
        {driver.photo ? (
          <Image
            src={driver.photo}
            alt={`Sample photo for ${driver.name}`}
            fill
            sizes="310px"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-4xl font-semibold text-white">
            {driver.initials}
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[rgba(18,36,27,0.85)] to-transparent" />
        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand-ink shadow-sm">
          <span className="size-1.5 rounded-full bg-[#3fae6b]" /> Available
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="flex items-center gap-1.5 text-lg font-semibold tracking-tight">
            {driver.name}
            <BadgeCheckIcon aria-label="Verified driver" className="size-4 text-[#bfe3c9]" />
          </h3>
          <p className="text-xs text-white/80">
            {driver.yearsExperience} yrs · License {driver.licenseCategory}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <dl className="grid grid-cols-3 divide-x divide-border text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="px-1">
              <dt className="text-[11px] text-muted-foreground">{stat.label}</dt>
              <dd className="mt-0.5 text-base font-semibold text-brand-ink">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Languages">
          {driver.languages.map((language) => (
            <li key={language} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
              {language}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-3 border-t border-border pt-3.5">
            <p className="text-xs text-muted-foreground">
              From{" "}
              <span className="text-base font-semibold text-brand-ink">
                {formatMoney(driver.dailyRate, { compact: true })}
              </span>
              /day
            </p>
            {driver.serviceCities[0] ? (
              <p className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                <MapPinIcon aria-hidden="true" className="size-3.5 shrink-0" />
                <span className="truncate">{driver.serviceCities[0]}</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function BecomeDriverCard() {
  return (
    <article className="flex h-full flex-col justify-between overflow-hidden rounded-[20px] bg-[linear-gradient(160deg,#21452f,#315c44)] p-6 text-white">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-white/60 uppercase">Drive with KAIYA</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight">Your skills, your schedule.</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          Register independently, get verified, and take trips that fit your calendar. Earnings are paid
          separately from the car.
        </p>
      </div>
      <Button asChild className="mt-6 h-11 w-fit bg-white px-5 text-brand-ink hover:bg-white/90">
        <Link href="/work-with-us/drivers">
          Become a driver <ArrowRightIcon aria-hidden="true" />
        </Link>
      </Button>
    </article>
  );
}

/**
 * Featured drivers. On large, tall screens the row is pinned and moves sideways as the page scrolls
 * (down = left, up = right); elsewhere, or with reduced motion, it is a normal swipeable row.
 */
export function DriverScroller({ drivers, heading }: { drivers: DriverProfile[]; heading: ReactNode }) {
  const wrapperRef = useRef<HTMLElement>(null);
  // Callback refs, so measuring starts as soon as both elements are attached.
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [track, setTrack] = useState<HTMLUListElement | null>(null);
  const [overflow, setOverflow] = useState(0);
  const [current, setCurrent] = useState(0);

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const tallEnough = useMediaQuery(TALL_ENOUGH_QUERY);
  const reduceMotion = useReducedMotion();
  const pinned = isDesktop && tallEnough && !reduceMotion && overflow > 0;
  const itemCount = drivers.length + 1;

  useLayoutEffect(() => {
    if (!viewport || !track) return;
    const measure = () => setOverflow(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    return () => observer.disconnect();
  }, [viewport, track]);

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const rawX = useTransform(scrollYProgress, (progress) => -progress * overflow);
  const x = useSpring(rawX, { stiffness: 260, damping: 40, mass: 0.35 });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setCurrent(Math.min(itemCount - 1, Math.round(progress * (itemCount - 1))));
  });

  return (
    <section
      ref={wrapperRef}
      aria-label="Featured drivers"
      className="relative"
      style={pinned ? { height: `calc(100vh + ${overflow}px)` } : undefined}
    >
      <div className={cn(pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16" : "pb-24")}>
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
          {heading}

          <div
            ref={setViewport}
            className={cn(
              "mt-8",
              pinned ? "overflow-visible" : "-mx-4 snap-x snap-mandatory overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6",
            )}
          >
            <motion.ul ref={setTrack} style={pinned ? { x } : undefined} className="flex w-max gap-5" aria-label="Drivers">
              {drivers.map((driver, index) => (
                <motion.li
                  key={driver.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, ease: EASE, delay: Math.min(index, 4) * 0.07 }}
                  className={cn(CARD_WIDTH, "shrink-0 snap-start")}
                >
                  <DriverProfileCard driver={driver} />
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
                className={cn(CARD_WIDTH, "shrink-0 snap-start")}
              >
                <BecomeDriverCard />
              </motion.li>
            </motion.ul>
          </div>

          {pinned ? (
            <div aria-hidden="true" className="mt-8 flex items-center gap-4">
              <span className="w-14 text-xs font-medium text-muted-foreground tabular-nums">
                {String(current + 1).padStart(2, "0")} / {String(itemCount).padStart(2, "0")}
              </span>
              <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                <motion.span
                  className="absolute inset-0 origin-left rounded-full bg-primary"
                  style={{ scaleX: scrollYProgress }}
                />
              </span>
              <span className="text-xs text-muted-foreground">Scroll to explore</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

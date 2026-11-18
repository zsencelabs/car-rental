"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { BadgeCheckIcon, ShieldCheckIcon } from "lucide-react";
import type { Location } from "@/lib/catalog/types";
import { SearchForm } from "./search-form";

const EASE = [0.22, 1, 0.36, 1] as const;

const line = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
});

export function HomeHero({ locations }: { locations: Location[] }) {
  return (
    <section className="relative isolate flex min-h-[600px] flex-col overflow-hidden md:min-h-[100svh]">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 14, ease: "easeOut" }}
      >
        <Image
          src="/images/hero/sunset-suv.jpg"
          alt="An SUV parked on an open field at sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(18,36,27,0.55)_0%,rgba(22,44,33,0.7)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[rgba(18,36,27,0.65)] to-transparent" />

      {/* Text takes the free space; the booking box always ends inside the banner, at its bottom. */}
      <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center justify-center px-4 text-center pt-28 pb-8 sm:px-6 md:pt-32 [@media(max-height:760px)]:pt-24 [@media(max-height:760px)]:pb-5">
        <motion.p
          {...line(0.05)}
          className="flex items-center gap-4 text-[11px] font-medium tracking-[0.24em] text-white/70 uppercase sm:text-xs"
        >
          <span aria-hidden="true" className="hidden h-px w-10 bg-white/35 sm:block" />
          Car rental marketplace · self-drive or with a driver
          <span aria-hidden="true" className="hidden h-px w-10 bg-white/35 sm:block" />
        </motion.p>
        <h1 className="mx-auto mt-7 max-w-3xl text-[clamp(2.5rem,min(5.4vw,7.5vh),4.5rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-white [@media(max-height:760px)]:mt-5">
          <motion.span {...line(0.12)} className="block">
            Find your way.
          </motion.span>
          <motion.em
            {...line(0.24)}
            className="mt-1 block font-[family-name:var(--font-accent)] leading-[1.1] font-normal text-[#cfe0d2]"
          >
            We&apos;ll find the car.
          </motion.em>
        </h1>
        <motion.p
          {...line(0.36)}
          className="mx-auto mt-7 max-w-[46rem] text-base leading-[1.75] text-balance text-white/80 md:text-lg [@media(max-height:760px)]:mt-5"
        >
          Rent from trusted rental companies and local owners. Drive yourself, or choose an independent,
          verified professional driver for your trip.
        </motion.p>
        <motion.ul
          {...line(0.46)}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] text-white/75 [@media(max-height:760px)]:hidden"
        >
          <li className="flex items-center gap-2">
            <BadgeCheckIcon aria-hidden="true" className="size-4 text-[#9fd0ad]" /> Rent by the day, week or month
          </li>
          <li aria-hidden="true" className="hidden size-1 rounded-full bg-white/30 sm:block" />
          <li className="flex items-center gap-2">
            <ShieldCheckIcon aria-hidden="true" className="size-4 text-[#9fd0ad]" /> Deposit shown separately
          </li>
        </motion.ul>
      </div>

      <motion.div
        data-hero-search
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
        className="relative z-10 mx-auto w-full max-w-[1240px] px-4 pb-10 sm:px-6 md:pb-20 [@media(max-height:760px)]:pb-12"
      >
        <SearchForm locations={locations} />
      </motion.div>
    </section>
  );
}

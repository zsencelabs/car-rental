"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { animate, AnimatePresence, motion, useInView, useReducedMotion, useScroll, useSpring } from "motion/react";
import {
  ArrowUpDownIcon,
  BadgeCheckIcon,
  CalendarDaysIcon,
  CarFrontIcon,
  CheckIcon,
  KeyRoundIcon,
  LockIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
  UserRoundIcon,
  UsersRoundIcon,
  WalletIcon,
} from "lucide-react";
import { DESKTOP_QUERY, useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Step {
  /** One-word label shown in the illustration panel header. */
  short: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  Scene: () => ReactNode;
}

/* ---------- Scene building blocks ---------- */

/** Shared look of the illustration panel: flat sage with a fine dot grid and a hairline border. */
const PANEL_CLASS =
  "relative overflow-hidden rounded-[24px] border border-[#dde5d9] bg-[#edf1ea] bg-[radial-gradient(circle,rgba(49,92,68,0.10)_1px,transparent_1px)] [background-size:18px_18px] shadow-[0_30px_60px_-45px_rgba(18,36,27,0.35)]";

function SceneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(PANEL_CLASS, "flex min-h-[380px] w-full items-center justify-center p-6 sm:min-h-[420px] sm:p-8")}
    >
      <div aria-hidden="true" className="relative w-full max-w-[420px]">
        {children}
      </div>
    </div>
  );
}

const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 18, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.55, ease: EASE, delay },
});

function SearchScene() {
  const fields = [
    { Icon: MapPinIcon, label: "Pick-up location", value: "Airport Terminal" },
    { Icon: CalendarDaysIcon, label: "Rental dates", value: "12 Dec 10:00 → 15 Dec 10:00 · 3 days" },
  ];
  return (
    <motion.div {...pop()} className="rounded-2xl bg-white p-5 border border-[#e3e9df] shadow-[0_1px_2px_rgba(18,36,27,0.05),0_14px_32px_-18px_rgba(18,36,27,0.22)]">
      <p className="text-[15px] font-semibold tracking-tight text-brand-ink">Where are you headed?</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-medium">
        <span className="flex h-9 items-center justify-center gap-1.5 rounded-full border border-border bg-white text-[#3f5146]">
          <KeyRoundIcon className="size-3.5" /> Self-drive
        </span>
        <span className="relative flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-border text-[#3f5146]">
          <motion.span
            className="absolute inset-0 origin-left rounded-full bg-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.5 }}
          />
          <motion.span
            className="relative flex items-center gap-1.5"
            initial={{ color: "#3f5146" }}
            animate={{ color: "#ffffff" }}
            transition={{ duration: 0.3, delay: 0.75 }}
          >
            <UsersRoundIcon className="size-3.5" /> With a driver
          </motion.span>
        </span>
      </div>
      <div className="mt-3 space-y-2.5">
        {fields.map(({ Icon, label, value }, index) => (
          <motion.div
            key={label}
            {...pop(0.2 + index * 0.18)}
            className="flex items-center gap-3 rounded-xl border border-input bg-background px-3.5 py-3"
          >
            <Icon className="size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">{label}</p>
              <motion.p
                className="truncate text-sm font-medium text-brand-ink"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.45 + index * 0.25 }}
              >
                {value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        {...pop(0.9)}
        className="relative mt-4 flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary text-sm font-semibold text-primary-foreground"
      >
        <SearchIcon className="size-4" /> Find cars
        <motion.span
          className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          initial={{ x: "0%" }}
          animate={{ x: "450%" }}
          transition={{ duration: 1.1, ease: "easeInOut", delay: 1.4 }}
        />
      </motion.div>
    </motion.div>
  );
}

/** Counts a whole number up from 0 once, after an optional delay (instant with reduced motion). */
function useCountUp(target: number, delay: number): number {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(0, target, {
      duration: 0.8,
      delay,
      ease: "easeOut",
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [target, delay, reduceMotion]);
  return reduceMotion ? target : value;
}

/** Sample values match the catalog listings (volvo-xc60, toyota-corolla, hyundai-tucson). */
const COMPARE_CARS = [
  { name: "Volvo XC60", category: "SUV", by: "Rental company", rating: "4.9", price: 89, image: "/images/cars/volvo-xc60/front.jpg" },
  { name: "Toyota Corolla", category: "Sedan", by: "Rental company", rating: "4.7", price: 45, image: "/images/cars/toyota-corolla/front.jpg" },
  { name: "Hyundai Tucson", category: "SUV", by: "Local owner", rating: "4.7", price: 68, image: "/images/cars/hyundai-tucson/front.jpg" },
];

function ComparePrice({ price, delay }: { price: number; delay: number }) {
  const value = useCountUp(price, delay);
  return (
    <p className="shrink-0 text-right leading-tight">
      <span className="block text-[15px] font-bold text-brand-ink tabular-nums">${value}</span>
      <span className="text-[11px] text-muted-foreground">/day</span>
    </p>
  );
}

function CompareScene() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-3 flex items-center justify-between"
      >
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-brand-ink">3 cars</span> · Airport Terminal
        </p>
        <span className="flex items-center gap-1 rounded-full border border-[#dde5d9] bg-white px-2.5 py-1 text-[11px] font-medium text-[#3f5146]">
          <ArrowUpDownIcon className="size-3" /> Recommended
        </span>
      </motion.div>
      <div className="space-y-2.5">
        {COMPARE_CARS.map((car, index) => (
          <motion.div
            key={car.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 + index * 0.12 }}
            className="relative flex items-center gap-3 rounded-2xl border border-[#e3e9df] bg-white p-2.5 pr-3.5 shadow-[0_1px_2px_rgba(18,36,27,0.05),0_14px_32px_-18px_rgba(18,36,27,0.22)]"
          >
            {index === 0 ? (
              <>
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-2xl bg-secondary/40 ring-2 ring-primary"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.8 }}
                />
                <motion.span
                  className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-sm"
                  initial={{ opacity: 0, scale: 0.6, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20, delay: 1.05 }}
                >
                  Best match
                </motion.span>
              </>
            ) : null}
            <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
              <Image src={car.image} alt="" fill sizes="80px" className="object-cover" />
            </span>
            <div className="relative min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
                <span className="truncate">{car.name}</span>
                <BadgeCheckIcon className="size-3.5 shrink-0 text-primary" />
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="flex shrink-0 items-center gap-0.5 font-medium text-brand-ink">
                  <StarIcon className="size-3 fill-[#f0c96b] text-[#f0c96b]" /> {car.rating}
                </span>
                <span className="truncate">
                  <span className="hidden sm:inline">{car.category} · </span>
                  {car.by}
                </span>
              </p>
            </div>
            <div className="relative">
              <ComparePrice price={car.price} delay={0.35 + index * 0.12} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Overlay that marks an option as selected without changing its size. */
function SelectedRing({ delay, rounded }: { delay: number; rounded: string }) {
  return (
    <motion.span
      className={cn("pointer-events-none absolute inset-0 bg-secondary/40 ring-2 ring-primary", rounded)}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
    />
  );
}

function ChooseScene() {
  const drivers = [
    { initials: "KA", name: "Karim A.", rating: "4.9", trips: 418, image: "/images/drivers/karim.jpg" },
    { initials: "PS", name: "Priya S.", rating: "4.9", trips: 154, image: "/images/drivers/priya-2.jpg" },
  ];
  const branches = [
    { d: "M220 6 V18 C220 40 110 30 110 52", end: 110, delay: 0 },
    { d: "M220 6 V18 C220 40 330 30 330 52", end: 330, delay: 0.1 },
  ];
  return (
    <div className="relative">
      <svg viewBox="0 0 440 60" className="mb-1 h-14 w-full" fill="none">
        <motion.circle
          cx="220"
          cy="6"
          r="4"
          fill="var(--brand-accent)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        {branches.map((branch) => (
          <g key={branch.end}>
            <motion.path
              d={branch.d}
              stroke="var(--brand-accent)"
              strokeOpacity="0.6"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: EASE, delay: branch.delay }}
            />
            <motion.circle
              cx={branch.end}
              cy="54"
              r="3.5"
              fill="var(--brand-accent)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.75 + branch.delay }}
            />
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-2 items-stretch gap-3">
        <motion.div {...pop(0.5)} className="rounded-2xl p-3 sm:p-4 border border-[#e3e9df] bg-white shadow-[0_1px_2px_rgba(18,36,27,0.05),0_14px_32px_-18px_rgba(18,36,27,0.22)]">
          <p className="flex items-center gap-2 text-[13px] font-semibold whitespace-nowrap text-brand-ink sm:text-sm">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
              <CarFrontIcon className="size-4" />
            </span>
            Self-drive
          </p>
          <ul className="mt-3 space-y-2 text-[11px] text-[#3f5146]">
            {["Driving license", "Identity check", "Deposit shown"].map((item, index) => (
              <li key={item} className="flex items-center gap-1.5">
                <motion.span
                  className="grid size-4 shrink-0 place-items-center rounded-full bg-primary text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.8 + index * 0.15 }}
                >
                  <CheckIcon className="size-2.5" strokeWidth={3} />
                </motion.span>
                <motion.span
                  className="truncate"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.8 + index * 0.15 }}
                >
                  {item}
                </motion.span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...pop(0.6)} className="rounded-2xl p-3 sm:p-4 border border-[#e3e9df] bg-white shadow-[0_1px_2px_rgba(18,36,27,0.05),0_14px_32px_-18px_rgba(18,36,27,0.22)]">
          <p className="flex items-center gap-2 text-[13px] font-semibold whitespace-nowrap text-brand-ink sm:text-sm">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
              <UserRoundIcon className="size-4" />
            </span>
            With a driver
          </p>
          <div className="mt-3 space-y-2">
            {drivers.map((driver, index) => (
              <motion.div
                key={driver.name}
                {...pop(0.9 + index * 0.18)}
                className="relative flex items-center gap-2 rounded-xl border border-[#e3e9df] bg-white p-1.5"
              >
                {index === 0 ? <SelectedRing delay={1.45} rounded="rounded-xl" /> : null}
                <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-[linear-gradient(135deg,#3e7054,#63866c)] ring-2 ring-white shadow-[0_1px_3px_rgba(18,36,27,0.25)]">
                  <Image src={driver.image} alt="" fill sizes="32px" className="object-cover" />
                </span>
                <span className="relative min-w-0 text-[11px] leading-tight">
                  <span className="block truncate font-semibold text-brand-ink">{driver.name}</span>
                  <span className="flex items-center gap-0.5 text-muted-foreground">
                    <StarIcon className="size-2.5 fill-[#f0c96b] text-[#f0c96b]" />
                    {driver.rating}
                    <span className="hidden sm:inline"> · {driver.trips} trips</span>
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/** 11–17 Dec 2026 (Fri → Thu); the trip is the 12th to the 15th. */
const CONFIRM_DAYS = [
  { weekday: "F", date: 11 },
  { weekday: "S", date: 12 },
  { weekday: "S", date: 13 },
  { weekday: "M", date: 14 },
  { weekday: "T", date: 15 },
  { weekday: "W", date: 16 },
  { weekday: "T", date: 17 },
];
const TRIP_START = 1;
const TRIP_END = 4;

function ConfirmScene() {
  const rows = [
    { title: "Volvo XC60", subtitle: "Greenline Rentals", busy: 6, avatar: null },
    { title: "Karim A.", subtitle: "Driver", busy: 0, avatar: "/images/drivers/karim.jpg" },
  ];
  return (
    <div className="space-y-3">
      {rows.map((row, rowIndex) => (
        <motion.div
          key={row.title}
          {...pop(rowIndex * 0.15)}
          className="rounded-2xl p-3.5 sm:p-4 border border-[#e3e9df] bg-white shadow-[0_1px_2px_rgba(18,36,27,0.05),0_14px_32px_-18px_rgba(18,36,27,0.22)]"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              {row.avatar ? (
                <span className="relative size-7 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-[0_1px_3px_rgba(18,36,27,0.25)]">
                  <Image src={row.avatar} alt="" fill sizes="28px" className="object-cover" />
                </span>
              ) : (
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                  <CarFrontIcon className="size-4" />
                </span>
              )}
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-semibold text-brand-ink">{row.title}</span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {row.subtitle}
                  <span className="hidden sm:inline"> · 12 → 15 Dec</span>
                </span>
              </span>
            </div>
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 20, delay: 1.1 + rowIndex * 0.15 }}
              className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[11px] font-semibold text-primary"
            >
              <LockIcon className="size-3" /> Held for you
            </motion.span>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1">
            {/* One continuous band for the trip, sweeping left to right behind the trip days. */}
            <motion.span
              className="rounded-lg bg-primary"
              style={{ gridRow: 1, gridColumn: `${TRIP_START + 1} / ${TRIP_END + 2}`, originX: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.6 + rowIndex * 0.15 }}
            />
            {CONFIRM_DAYS.map((day, index) => {
              const inTrip = index >= TRIP_START && index <= TRIP_END;
              const busy = index === row.busy;
              return (
                <motion.div
                  key={day.date}
                  style={{ gridRow: 1, gridColumn: index + 1 }}
                  initial={busy ? { opacity: 0 } : false}
                  animate={busy ? { opacity: 1 } : undefined}
                  transition={busy ? { duration: 0.4, delay: 0.4 } : undefined}
                  className={cn(
                    "relative grid h-11 place-items-center rounded-lg text-center leading-none",
                    inTrip
                      ? "text-white"
                      : busy
                        ? "bg-[repeating-linear-gradient(135deg,#ebe8de_0_3px,#f6f4ee_3px_7px)] text-muted-foreground/60"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  <span>
                    <span className={cn("block text-[9px] font-medium", inTrip ? "text-white/70" : "opacity-70")}>
                      {day.weekday}
                    </span>
                    <span className={cn("mt-0.5 block text-xs font-semibold", busy && "line-through")}>{day.date}</span>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ))}

      <div className="relative mx-auto w-fit">
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full ring-2 ring-primary"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0, 0.6, 0], scale: [1, 1, 1.25] }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.6 }}
        />
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.5 }}
          className="relative flex items-center gap-2 rounded-full bg-primary py-2 pr-4 pl-2 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-12px_rgba(18,36,27,0.6)]"
        >
          <span className="grid size-5 place-items-center rounded-full bg-white/20">
            <CheckIcon className="size-3" strokeWidth={3} />
          </span>
          Car and driver confirmed together
        </motion.div>
      </div>
    </div>
  );
}

function GoScene() {
  const splits = [
    { label: "Vehicle provider", share: 0.62, Icon: CarFrontIcon },
    { label: "Driver", share: 0.38, Icon: UserRoundIcon },
  ];
  return (
    <div className="space-y-3">
      <motion.div {...pop()} className="relative h-44 overflow-hidden rounded-2xl border border-[#e3e9df] shadow-[0_1px_2px_rgba(18,36,27,0.05),0_14px_32px_-18px_rgba(18,36,27,0.22)]">
        <Image src="/images/story/key-handover.jpg" alt="" fill sizes="440px" className="object-cover" />
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
          {["Condition photos", "Mileage recorded", "Fuel level"].map((chip, index) => (
            <motion.span
              key={chip}
              {...pop(0.4 + index * 0.15)}
              className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[0.7rem] font-semibold text-brand-ink"
            >
              <CheckIcon className="size-3 text-primary" /> {chip}
            </motion.span>
          ))}
        </div>
      </motion.div>
      <motion.div {...pop(0.6)} className="rounded-2xl bg-white p-4 border border-[#e3e9df] shadow-[0_1px_2px_rgba(18,36,27,0.05),0_14px_32px_-18px_rgba(18,36,27,0.22)]">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
          <WalletIcon className="size-4 text-primary" /> Earnings paid separately
        </p>
        <div className="mt-3 space-y-2.5">
          {splits.map(({ label, share, Icon }, index) => (
            <div key={label}>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="size-3.5" /> {label}
              </p>
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${share * 100}%` }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.9 + index * 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const STEPS: Step[] = [
  {
    eyebrow: "Step 1",
    short: "Search",
    title: "Tell us where and when",
    body: "Choose where to collect the car, how long you need it (a day, a week or more), and whether you'll drive or want a driver.",
    points: ["Airport, city and station pickups", "Self-drive or with a driver"],
    Scene: SearchScene,
  },
  {
    eyebrow: "Step 2",
    short: "Compare",
    title: "Compare verified cars",
    body: "Cars come from rental companies and local owners. Every listing is checked before it goes live.",
    points: ["Clear daily, weekly and monthly prices", "Ratings and reviews from completed trips"],
    Scene: CompareScene,
  },
  {
    eyebrow: "Step 3",
    short: "Choose",
    title: "Choose your way",
    body: "Drive yourself after a quick license and ID check, or pick an independent professional driver from a ranked list.",
    points: ["You choose the driver, not us", "Compare ratings, experience and languages"],
    Scene: ChooseScene,
  },
  {
    eyebrow: "Step 4",
    short: "Confirm",
    title: "Car and driver confirmed together",
    body: "We check the car's calendar and your driver's calendar separately, and confirm only when both are free for your whole trip.",
    points: ["No double bookings", "Every charge shown before you pay, deposit kept separate"],
    Scene: ConfirmScene,
  },
  {
    eyebrow: "Step 5",
    short: "Go",
    title: "Pick up and go",
    body: "A digital handover records the car's condition. Afterwards, the vehicle provider and the driver are each paid for their part.",
    points: ["Condition photos at pickup and return", "Rate your car and your driver"],
    Scene: GoScene,
  },
];

/** On small screens each scene sits under its step and only mounts (and animates) once it scrolls into view. */
function MobileScene({ Scene, label }: { Scene: () => ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref}>
      <SceneFrame label={label}>{seen ? <Scene /> : <div className="h-64" />}</SceneFrame>
    </div>
  );
}

function StoryStep({
  step,
  index,
  active,
}: {
  step: Step;
  index: number;
  active: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const { Scene } = step;
  const dimmed = isDesktop && !active && !reduceMotion;

  return (
    <div data-story-step={index + 1} className="relative flex flex-col justify-center py-6 lg:min-h-[44vh] lg:last:min-h-[min(calc(100vh-8rem),540px)]">
      <div className="relative">
        {/* Timeline marker on the progress rail (desktop), level with the step number. */}
        <span
          aria-hidden="true"
          data-story-marker
          className={cn(
            "absolute top-4 -left-6 hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-500 lg:block",
            active ? "scale-125 border-primary bg-primary" : "border-[#cfd9cc] bg-[#f3f1e8]",
          )}
        />
        <motion.div
          animate={{ opacity: dimmed ? 0.35 : 1, x: dimmed ? 6 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-8 place-items-center rounded-full border text-xs font-semibold tabular-nums transition-colors duration-500",
                active || !isDesktop ? "border-primary bg-primary text-primary-foreground" : "border-[#cfd9cc] text-primary",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="h-px w-6 bg-border" />
            <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {step.eyebrow} of {STEPS.length}
            </p>
          </div>
          <h3 className="mt-4 text-3xl leading-tight font-semibold tracking-[-0.035em] text-brand-ink sm:text-[2rem]">{step.title}</h3>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">{step.body}</p>
          <ul className="mt-5 space-y-2">
            {step.points.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm font-medium text-[#3f5146]">
                <span className="grid size-5 place-items-center rounded-full bg-secondary text-primary">
                  <CheckIcon aria-hidden="true" className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
      <div className="mt-8 lg:hidden">
        <MobileScene Scene={Scene} label={`Illustration: ${step.title}`} />
      </div>
    </div>
  );
}

export function HowItWorksStory() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  // Fill runs from the first dot to the last as each reaches the middle of the viewport.
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start center", "end center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const ActiveScene = STEPS[active].Scene;

  const columnRef = useRef<HTMLDivElement>(null);
  const [rail, setRail] = useState<{ top: number; height: number } | null>(null);

  // The active step is the one whose centre is nearest the middle of the viewport.
  useEffect(() => {
    const column = columnRef.current;
    if (!column) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      column.querySelectorAll<HTMLElement>("[data-story-step]").forEach((step, index) => {
        const box = step.getBoundingClientRect();
        const distance = Math.abs(box.top + box.height / 2 - middle);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });
      setActive(nearest);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Run the timeline rail from the first step's dot to the last one's, re-measuring on resize.
  useLayoutEffect(() => {
    const column = columnRef.current;
    if (!column) return;
    const measure = () => {
      const markers = column.querySelectorAll<HTMLElement>("[data-story-marker]");
      const first = markers[0];
      const last = markers[markers.length - 1];
      if (!first || !last || first === last) return;
      const base = column.getBoundingClientRect().top;
      const centre = (el: HTMLElement) => {
        const box = el.getBoundingClientRect();
        return box.top + box.height / 2 - base;
      };
      const top = centre(first);
      setRail({ top, height: Math.max(0, centre(last) - top) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    return () => observer.disconnect();
  }, []);
  const reduceMotion = useReducedMotion();
  const goToStep = (index: number) => {
    containerRef.current
      ?.querySelector(`[data-story-step="${index + 1}"]`)
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  };

  return (
    <div ref={containerRef} className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <div className="sticky top-24 hidden h-[calc(100vh-8rem)] max-h-[540px] items-center lg:flex">
        <div className={cn(PANEL_CLASS, "flex h-[460px] w-full flex-col")}>
          <div className="flex items-center justify-between border-b border-[#dde5d9] bg-white/55 px-5 py-3 backdrop-blur-sm">
            <span aria-hidden="true" className="flex gap-1.5">
              {["#d9e0d5", "#cfd9cc", "#c3cfbf"].map((tone) => (
                <span key={tone} className="size-2.5 rounded-full" style={{ backgroundColor: tone }} />
              ))}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="rounded-full border border-[#dde5d9] bg-white px-2.5 py-1 text-[11px] font-medium tabular-nums"
              >
                <span className="text-primary">{String(active + 1).padStart(2, "0")}</span>
                <span className="text-muted-foreground"> · {STEPS[active].short}</span>
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Stacked cross-fade: never waits on an exit animation, so fast scrolling can't leave it blank. */}
          <div className="relative flex-1">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                role="img"
                aria-label={`Illustration: ${STEPS[active].title}`}
                className="absolute inset-0 flex items-center justify-center px-10"
                initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <div aria-hidden="true" className="w-full max-w-[420px]">
                  <ActiveScene />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <ol className="flex justify-center gap-2 pb-4" aria-label="Story progress">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <button
                  type="button"
                  aria-current={index === active ? "step" : undefined}
                  aria-label={`Go to step ${index + 1}: ${step.title}`}
                  onClick={() => goToStep(index)}
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-500 hover:bg-primary/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    index === active ? "w-8 bg-primary" : "w-3 bg-[#cfd9cc]",
                  )}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div ref={columnRef} className="relative min-w-0">
        <div
          ref={railRef}
          aria-hidden="true"
          className="absolute -left-6 hidden w-px bg-border lg:block"
          style={rail ? { top: rail.top, height: rail.height } : { top: 0, bottom: 0 }}
        >
          <motion.div className="h-full w-full origin-top bg-primary" style={{ scaleY: progress }} />
        </div>
        {STEPS.map((step, index) => (
          <StoryStep key={step.title} step={step} index={index} active={index === active} />
        ))}
      </div>
    </div>
  );
}


"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useScroll, useSpring } from "motion/react";
import {
  BadgeCheckIcon,
  CalendarDaysIcon,
  CarFrontIcon,
  CheckIcon,
  LockIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
  UserRoundIcon,
  WalletIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Step {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  Scene: () => ReactNode;
}

/* ---------- Scene building blocks ---------- */

function SceneFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative flex h-full min-h-[380px] w-full items-center justify-center overflow-hidden rounded-[22px] bg-[radial-gradient(120%_90%_at_10%_0%,#eef3ea_0%,#e2eadf_45%,#d6e1d3_100%)] p-6 sm:min-h-[420px] sm:p-8"
    >
      <div aria-hidden="true" className="absolute -top-24 -right-24 size-72 rounded-full bg-white/40 blur-2xl" />
      <div aria-hidden="true" className="relative w-full max-w-[440px]">
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
    <motion.div {...pop()} className="rounded-2xl bg-white p-5 shadow-[0_30px_60px_-35px_rgba(38,60,50,0.6)]">
      <p className="text-sm font-semibold text-brand-ink">Where are you headed?</p>
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 text-sm font-semibold">
        <span className="relative rounded-lg py-2 text-center text-muted-foreground">Self-drive</span>
        <span className="relative rounded-lg py-2 text-center text-brand-ink">
          <motion.span
            layoutId="story-mode"
            className="absolute inset-0 rounded-lg bg-white shadow-sm"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          />
          <span className="relative">With a driver</span>
        </span>
      </div>
      <div className="mt-4 space-y-2.5">
        {fields.map(({ Icon, label, value }, index) => (
          <motion.div
            key={label}
            {...pop(0.2 + index * 0.18)}
            className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5"
          >
            <Icon className="size-4 text-primary" />
            <div className="min-w-0">
              <p className="text-[0.7rem] text-muted-foreground">{label}</p>
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
        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
      >
        <SearchIcon className="size-4" /> Find cars
      </motion.div>
    </motion.div>
  );
}

function CompareScene() {
  const cars = [
    { name: "Volvo XC60", by: "Rental company", price: "$89", image: "/images/cars/volvo-xc60/front.jpg" },
    { name: "Toyota Corolla", by: "Rental company", price: "$45", image: "/images/cars/toyota-corolla/front.jpg" },
    { name: "Hyundai Tucson", by: "Local owner", price: "$68", image: "/images/cars/hyundai-tucson/front.jpg" },
  ];
  return (
    <div className="space-y-3">
      {cars.map((car, index) => (
        <motion.div
          key={car.name}
          initial={{ opacity: 0, x: index % 2 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0, scale: index === 0 ? [1, 1, 1.03] : 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: index * 0.15 }}
          className={cn(
            "flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-[0_20px_40px_-30px_rgba(38,60,50,0.6)]",
            index === 0 && "ring-2 ring-primary",
          )}
        >
          <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary">
            <Image src={car.image} alt="" fill sizes="96px" className="object-cover" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-brand-ink">{car.name}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <BadgeCheckIcon className="size-3.5 text-primary" /> Verified · {car.by}
            </p>
          </div>
          <p className="pr-2 text-sm font-bold text-brand-ink">
            {car.price}
            <span className="font-normal text-muted-foreground">/day</span>
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function ChooseScene() {
  const drivers = [
    { initials: "KA", name: "Karim A.", rating: "4.9", trips: 418 },
    { initials: "PS", name: "Priya S.", rating: "4.9", trips: 154 },
  ];
  return (
    <div className="relative">
      <svg viewBox="0 0 440 60" className="mb-1 h-14 w-full" fill="none">
        <motion.path
          d="M220 0 V18 C220 40 110 30 110 58"
          stroke="var(--brand-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
        <motion.path
          d="M220 0 V18 C220 40 330 30 330 58"
          stroke="var(--brand-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        />
      </svg>
      <div className="grid grid-cols-2 gap-3">
        <motion.div {...pop(0.5)} className="rounded-2xl bg-white p-4 shadow-[0_20px_40px_-30px_rgba(38,60,50,0.6)]">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
            <CarFrontIcon className="size-4 text-primary" /> Self-drive
          </p>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
            {["Driving license", "Identity check", "Deposit shown"].map((item, index) => (
              <motion.li
                key={item}
                {...pop(0.8 + index * 0.15)}
                className="flex items-center gap-1.5"
              >
                <span className="grid size-4 place-items-center rounded-full bg-primary text-white">
                  <CheckIcon className="size-3" />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...pop(0.6)} className="rounded-2xl bg-white p-4 shadow-[0_20px_40px_-30px_rgba(38,60,50,0.6)]">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
            <UserRoundIcon className="size-4 text-primary" /> With a driver
          </p>
          <div className="mt-3 space-y-2">
            {drivers.map((driver, index) => (
              <motion.div
                key={driver.name}
                {...pop(0.9 + index * 0.18)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-border p-1.5",
                  index === 0 && "border-primary bg-secondary",
                )}
              >
                <span className="grid size-7 place-items-center rounded-full bg-primary text-[0.65rem] font-bold text-white">
                  {driver.initials}
                </span>
                <span className="min-w-0 text-[0.7rem] leading-tight">
                  <span className="block truncate font-semibold text-brand-ink">{driver.name}</span>
                  <span className="flex items-center gap-0.5 text-muted-foreground">
                    <StarIcon className="size-2.5 fill-[#c9a45c] text-[#c9a45c]" />
                    {driver.rating} · {driver.trips} trips
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

function ConfirmScene() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const booked = [2, 3, 4];
  const rows = [
    { label: "Volvo XC60", Icon: CarFrontIcon },
    { label: "Driver: Karim A.", Icon: UserRoundIcon },
  ];
  return (
    <div className="space-y-3">
      {rows.map(({ label, Icon }, row) => (
        <motion.div
          key={label}
          {...pop(row * 0.2)}
          className="rounded-2xl bg-white p-4 shadow-[0_20px_40px_-30px_rgba(38,60,50,0.6)]"
        >
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
              <Icon className="size-4 text-primary" /> {label}
            </p>
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.1 + row * 0.15 }}
              className="flex items-center gap-1 text-xs font-semibold text-primary"
            >
              <LockIcon className="size-3.5" /> Held for you
            </motion.span>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {days.map((day, index) => (
              <div key={`${row}-${index}`} className="relative grid h-9 place-items-center rounded-lg bg-muted text-xs text-muted-foreground">
                {booked.includes(index) ? (
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-primary"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.35, ease: EASE, delay: 0.5 + (index - 2) * 0.12 + row * 0.1 }}
                  />
                ) : null}
                <span className={cn("relative", booked.includes(index) && "font-semibold text-white")}>{day}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 1.5 }}
        className="mx-auto flex w-fit items-center gap-2 rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-white"
      >
        <BadgeCheckIcon className="size-4" /> Car and driver confirmed together
      </motion.div>
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
      <motion.div {...pop()} className="relative h-44 overflow-hidden rounded-2xl shadow-[0_20px_40px_-30px_rgba(38,60,50,0.6)]">
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
      <motion.div {...pop(0.6)} className="rounded-2xl bg-white p-4 shadow-[0_20px_40px_-30px_rgba(38,60,50,0.6)]">
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
    title: "Tell us where and when",
    body: "Choose where to collect the car, how long you need it (a day, a week or more), and whether you'll drive or want a driver.",
    points: ["Airport, city and station pickups", "Self-drive or with a driver"],
    Scene: SearchScene,
  },
  {
    eyebrow: "Step 2",
    title: "Compare verified cars",
    body: "Cars come from rental companies and local owners. Every listing is checked before it goes live.",
    points: ["Clear daily, weekly and monthly prices", "Ratings and reviews from completed trips"],
    Scene: CompareScene,
  },
  {
    eyebrow: "Step 3",
    title: "Choose your way",
    body: "Drive yourself after a quick license and ID check, or pick an independent professional driver from a ranked list.",
    points: ["You choose the driver, not us", "Compare ratings, experience and languages"],
    Scene: ChooseScene,
  },
  {
    eyebrow: "Step 4",
    title: "Car and driver confirmed together",
    body: "We check the car's calendar and your driver's calendar separately, and confirm only when both are free for your whole trip.",
    points: ["No double bookings", "Every charge shown before you pay, deposit kept separate"],
    Scene: ConfirmScene,
  },
  {
    eyebrow: "Step 5",
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

function StoryStep({ step, index, onActive }: { step: Step; index: number; onActive: (index: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  const { Scene } = step;

  return (
    <div ref={ref} data-story-step={index + 1} className="flex flex-col justify-center py-10 lg:min-h-[64vh]">
      <p className="eyebrow">{step.eyebrow}</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-brand-ink sm:text-4xl">{step.title}</h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">{step.body}</p>
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
      <div className="mt-8 lg:hidden">
        <MobileScene Scene={Scene} label={`Illustration: ${step.title}`} />
      </div>
    </div>
  );
}

export function HowItWorksStory() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const ActiveScene = STEPS[active].Scene;

  const handleActive = setActive;

  return (
    <div ref={containerRef} className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      <div className="sticky top-28 hidden h-[calc(100vh-9rem)] max-h-[560px] items-center lg:flex">
        <div className="relative w-full">
          {/* Stacked cross-fade: never waits on an exit animation, so fast scrolling can't leave it blank. */}
          <div className="relative h-[460px]">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <SceneFrame label={`Illustration: ${STEPS[active].title}`}>
                  <ActiveScene />
                </SceneFrame>
              </motion.div>
            </AnimatePresence>
          </div>
          <ol className="mt-5 flex justify-center gap-2" aria-label="Story progress">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                aria-current={index === active ? "step" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  index === active ? "w-8 bg-primary" : "w-3 bg-[#cfd9cc]",
                )}
              >
                <span className="sr-only">{step.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="relative">
        <div aria-hidden="true" className="absolute top-0 bottom-0 -left-6 hidden w-px bg-border lg:block">
          <motion.div className="h-full w-full origin-top bg-primary" style={{ scaleY: progress }} />
        </div>
        {STEPS.map((step, index) => (
          <StoryStep key={step.title} step={step} index={index} onActive={handleActive} />
        ))}
      </div>
    </div>
  );
}


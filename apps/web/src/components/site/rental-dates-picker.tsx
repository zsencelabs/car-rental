"use client";

import { useState, useSyncExternalStore } from "react";
import type { DateRange } from "react-day-picker";
import { CalendarDaysIcon, ClockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatShortDate,
  fromIsoDate,
  startOfDay,
  toIsoDate,
} from "@/lib/rental-dates";
import { TIME_SLOTS } from "@/lib/search-schema";
import { cn } from "@/lib/utils";

export interface RentalDatesValue {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
}

interface RentalDatesPickerProps {
  value: RentalDatesValue;
  onChange: (next: Partial<RentalDatesValue>) => void;
  pickupError?: string;
  returnError?: string;
  /** Extra classes for the two-field grid, so the parent can place it in its own layout. */
  className?: string;
}

type End = "pickup" | "return";

function subscribeToWidth(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

/** Two months side by side on wide screens, one month otherwise. */
function useMonthsToShow(): number {
  return useSyncExternalStore(
    subscribeToWidth,
    () => (window.innerWidth >= 1100 ? 2 : 1),
    () => 2,
  );
}

/** Phones get a bottom sheet instead of an anchored popover. */
function useIsPhone(): boolean {
  return useSyncExternalStore(
    subscribeToWidth,
    () => window.innerWidth < 640,
    () => false,
  );
}

function TimeSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        aria-label={label}
        className="w-full justify-start bg-background data-[size=default]:h-12 *:data-[slot=select-value]:flex-1 *:data-[slot=select-value]:text-left"
      >
        <ClockIcon aria-hidden="true" className="size-4 text-primary" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" className="max-h-64">
        {TIME_SLOTS.map((slot) => (
          <SelectItem key={slot} value={slot} className="py-2">
            {slot}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** One end of the rental: a date button that opens the picker, with its own time list beside it. */
function DateTimeField({
  id,
  label,
  timeLabel,
  date,
  time,
  onTimeChange,
  error,
  active,
  onOpen,
}: {
  id: string;
  label: string;
  timeLabel: string;
  date: Date | undefined;
  time: string;
  onTimeChange: (time: string) => void;
  error?: string;
  active: boolean;
  onOpen: () => void;
}) {
  const timeId = id.replace("Date", "Time");
  return (
    <div className="min-w-0">
      <Label htmlFor={id} className="text-xs font-medium text-[#526257]">
        {label}
      </Label>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2">
        <button
          id={id}
          type="button"
          onClick={onOpen}
          aria-haspopup="dialog"
          aria-expanded={active}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "flex h-12 w-full items-center gap-2.5 rounded-lg border bg-background px-3 text-left transition-colors outline-none hover:border-[#c9d6cc] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            active ? "border-primary ring-3 ring-primary/15" : "border-input",
            error && "border-destructive",
          )}
        >
          <CalendarDaysIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
          {date ? (
            <span className="min-w-0 truncate text-sm font-medium text-brand-ink">{formatShortDate(date)}</span>
          ) : (
            <span className="truncate text-sm text-muted-foreground">Add date</span>
          )}
        </button>
        <TimeSelect id={timeId} label={timeLabel} value={time} onChange={onTimeChange} />
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Pick-up and return date/time fields sharing one branded popover:
 * range calendar, quick durations, time lists and a live rental length.
 */
export function RentalDatesPicker({ value, onChange, pickupError, returnError, className }: RentalDatesPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeEnd, setActiveEnd] = useState<End>("pickup");
  const months = useMonthsToShow();
  const isPhone = useIsPhone();

  const from = fromIsoDate(value.pickupDate);
  const to = fromIsoDate(value.returnDate);

  const openAt = (end: End) => {
    setActiveEnd(end);
    setOpen(true);
  };


  return (
    <>
    <Popover open={open && !isPhone} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn("grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2", className)}>
          <DateTimeField
            id="pickupDate"
            label="Pick-up date & time"
            timeLabel="Pick-up time"
            date={from}
            time={value.pickupTime}
            onTimeChange={(pickupTime) => onChange({ pickupTime })}
            error={pickupError}
            active={open && activeEnd === "pickup"}
            onOpen={() => openAt("pickup")}
          />
          <DateTimeField
            id="returnDate"
            label="Return date & time"
            timeLabel="Return time"
            date={to}
            time={value.returnTime}
            onTimeChange={(returnTime) => onChange({ returnTime })}
            error={returnError}
            active={open && activeEnd === "return"}
            onOpen={() => openAt("return")}
          />
        </div>
      </PopoverAnchor>

      <PopoverContent
        align="start"
        sideOffset={10}
        collisionPadding={16}
        aria-labelledby="rental-dates-title"
        className="w-auto max-w-[min(860px,calc(100vw-2rem))] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-[20px] border border-[#e5eae3] bg-card p-0 shadow-[0_30px_70px_-30px_rgba(18,36,27,0.55)] sm:w-auto"
      >
        <PickerPanel
          onChange={onChange}
          from={from}
          to={to}
          months={months}
          setActiveEnd={setActiveEnd}
          onDone={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
    <Sheet open={open && isPhone} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        className="max-h-[92svh] gap-0 overflow-y-auto rounded-t-[22px] border-0 bg-card p-0 [&>button.absolute]:hidden"
      >
        <SheetTitle className="sr-only">Select your rental dates</SheetTitle>
        <SheetDescription className="sr-only">Choose pick-up and return dates and times</SheetDescription>
        <div aria-hidden="true" className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-border" />
          <PickerPanel
          onChange={onChange}
          from={from}
          to={to}
          months={months}
          setActiveEnd={setActiveEnd}
          onDone={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
    </>
  );
}

interface PickerPanelProps {
  onChange: (next: Partial<RentalDatesValue>) => void;
  from: Date | undefined;
  to: Date | undefined;
  months: number;
  setActiveEnd: (end: End) => void;
  onDone: () => void;
}

/** Popover body: just the calendar, Clear and Done. Mounted only while open, so "today" is read in the browser. */
function PickerPanel({ onChange, from, to, months, setActiveEnd, onDone }: PickerPanelProps) {
  const [today] = useState(() => startOfDay(new Date()));
  const selected: DateRange | undefined = from ? { from, to } : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    onChange({
      pickupDate: range?.from ? toIsoDate(range.from) : "",
      returnDate: range?.to ? toIsoDate(range.to) : "",
    });
    setActiveEnd(range?.from && !range.to ? "return" : "pickup");
  };

  return (
    <>
      <h3 id="rental-dates-title" className="sr-only">
        Select your rental dates
      </h3>
      <div className="px-5 pt-5 pb-4 sm:px-6 [@media(max-height:820px)]:pt-3 [@media(max-height:820px)]:pb-2">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          resetOnSelect
          showOutsideDays={false}
          numberOfMonths={months}
          defaultMonth={from ?? today}
          disabled={{ before: today }}
          weekStartsOn={1}
          className="mx-auto bg-transparent p-0 [--cell-radius:9999px] [--cell-size:--spacing(10)] [@media(max-height:820px)]:[--cell-size:--spacing(8)] [&_button:not(:focus-visible)]:!ring-0 [&_button[data-range-middle=true]]:!bg-secondary/60"
          classNames={{
            months: "relative flex flex-col gap-10 md:flex-row",
            month_caption: "flex h-10 w-full items-center justify-center px-10",
            caption_label: "text-sm font-medium text-brand-ink",
            weekday: "flex-1 pb-2 text-[11px] font-normal text-muted-foreground/70 select-none",
            week: "mt-0.5 flex w-full",
            range_start:
              "relative isolate z-0 rounded-l-full bg-secondary/60 after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-secondary/60",
            range_middle: "rounded-none",
            range_end:
              "relative isolate z-0 rounded-r-full bg-secondary/60 after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-secondary/60",
            today: "font-semibold",
            disabled: "text-muted-foreground opacity-30",
          }}
        />
      </div>

      <div className="sticky bottom-0 flex items-center justify-between border-t border-border/70 bg-card px-5 py-3 sm:px-6 [@media(max-height:820px)]:py-2">
        <button
          type="button"
          aria-label="Clear dates"
          onClick={() => {
            onChange({ pickupDate: "", returnDate: "" });
            setActiveEnd("pickup");
          }}
          className="rounded-md px-1 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-brand-ink hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Clear
        </button>
        <Button type="button" size="sm" className="h-9 px-5" onClick={onDone}>
          Done
        </Button>
      </div>
    </>
  );
}

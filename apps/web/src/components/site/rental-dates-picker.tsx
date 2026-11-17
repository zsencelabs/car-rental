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
  QUICK_DURATIONS,
  quickRange,
  startOfDay,
  toIsoDate,
} from "@/lib/rental-dates";
import { formatRentalLength, joinDateTime, TIME_SLOTS } from "@/lib/search-schema";
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
    <div>
      <Label htmlFor={id} className="text-xs text-[#526257]">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="mt-2 w-full justify-start bg-background data-[size=default]:h-11 *:data-[slot=select-value]:flex-1 *:data-[slot=select-value]:text-left"
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
    </div>
  );
}

function Trigger({
  id,
  label,
  date,
  time,
  error,
  active,
  onOpen,
}: {
  id: string;
  label: string;
  date: Date | undefined;
  time: string;
  error?: string;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <div className="min-w-0">
      <Label htmlFor={id} className="text-xs text-[#526257]">
        {label}
      </Label>
      <button
        id={id}
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-expanded={active}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "mt-2 flex h-12 w-full items-center gap-3 rounded-lg border bg-background px-3 text-left transition-colors outline-none hover:border-[#c9d6cc] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          active ? "border-primary ring-3 ring-primary/15" : "border-input",
          error && "border-destructive",
        )}
      >
        <CalendarDaysIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
        {date ? (
          <span className="min-w-0 truncate text-sm font-medium text-brand-ink">
            {formatShortDate(date)}
            <span className="font-normal text-muted-foreground"> · {time}</span>
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Add date</span>
        )}
      </button>
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
export function RentalDatesPicker({ value, onChange, pickupError, returnError }: RentalDatesPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeEnd, setActiveEnd] = useState<End>("pickup");
  const months = useMonthsToShow();
  const isPhone = useIsPhone();

  const from = fromIsoDate(value.pickupDate);
  const to = fromIsoDate(value.returnDate);

  const rentalLength =
    value.pickupDate && value.returnDate
      ? formatRentalLength(
          joinDateTime(value.pickupDate, value.pickupTime),
          joinDateTime(value.returnDate, value.returnTime),
        )
      : undefined;

  const openAt = (end: End) => {
    setActiveEnd(end);
    setOpen(true);
  };


  return (
    <>
    <Popover open={open && !isPhone} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <Trigger
            id="pickupDate"
            label="Pick-up"
            date={from}
            time={value.pickupTime}
            error={pickupError}
            active={open && activeEnd === "pickup"}
            onOpen={() => openAt("pickup")}
          />
          <Trigger
            id="returnDate"
            label="Return"
            date={to}
            time={value.returnTime}
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
          value={value}
          onChange={onChange}
          from={from}
          to={to}
          months={months}
          activeEnd={activeEnd}
          setActiveEnd={setActiveEnd}
          rentalLength={rentalLength}
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
          value={value}
          onChange={onChange}
          from={from}
          to={to}
          months={months}
          activeEnd={activeEnd}
          setActiveEnd={setActiveEnd}
          rentalLength={rentalLength}
          onDone={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
    </>
  );
}

interface PickerPanelProps {
  value: RentalDatesValue;
  onChange: (next: Partial<RentalDatesValue>) => void;
  from: Date | undefined;
  to: Date | undefined;
  months: number;
  activeEnd: End;
  setActiveEnd: (end: End) => void;
  rentalLength: string | undefined;
  onDone: () => void;
}

/** Popover body. Mounted only while open, so "today" is read in the browser, never during prerender. */
function PickerPanel({
  value,
  onChange,
  from,
  to,
  months,
  activeEnd,
  setActiveEnd,
  rentalLength,
  onDone,
}: PickerPanelProps) {
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 [@media(max-height:760px)]:py-3">
          <div>
            <h3 id="rental-dates-title" className="text-base font-semibold text-brand-ink">
              Select your rental dates
            </h3>
            <p className="text-xs text-muted-foreground">
              {from && to
                ? "Adjust times or tap Done"
                : activeEnd === "pickup" || !from
                  ? "Choose your pick-up day"
                  : "Now choose your return day"}
            </p>
          </div>
          <p
            aria-live="polite"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              rentalLength ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            <CalendarDaysIcon aria-hidden="true" className="size-3.5" />
            {rentalLength ? `Rental length: ${rentalLength}` : "No dates selected"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="px-3 pt-3 pb-1 sm:px-5 sm:pt-4 [@media(max-height:760px)]:pt-2">
            <Calendar
              mode="range"
              selected={selected}
              onSelect={handleSelect}
              resetOnSelect
              numberOfMonths={months}
              defaultMonth={from ?? today}
              disabled={{ before: today }}
              weekStartsOn={1}
              className="mx-auto bg-transparent p-0 [--cell-radius:10px] [--cell-size:--spacing(10)] [@media(max-height:760px)]:[--cell-size:--spacing(8)]"
              classNames={{
                months: "relative flex flex-col gap-6 md:flex-row",
                month_caption: "flex h-10 w-full items-center justify-center px-10",
                caption_label: "text-sm font-semibold text-brand-ink",
                weekday: "flex-1 text-[0.72rem] font-medium tracking-wide text-muted-foreground uppercase select-none",
                week: "mt-1.5 flex w-full",
                today: "rounded-(--cell-radius) font-semibold text-primary ring-1 ring-primary/30 ring-inset data-[selected=true]:ring-0",
                disabled: "text-muted-foreground opacity-35",
              }}
            />
          </div>

          <div className="flex flex-col gap-5 border-t border-border p-5 md:w-60 md:border-t-0 md:border-l [@media(max-height:760px)]:gap-3 [@media(max-height:760px)]:py-3">
            <div>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Quick picks</p>
              <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
                {QUICK_DURATIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      const range = quickRange(option.id, today, option.id === "weekend" ? undefined : from);
                      onChange({ pickupDate: toIsoDate(range.from), returnDate: toIsoDate(range.to) });
                      setActiveEnd("pickup");
                    }}
                    className="shrink-0 rounded-full border border-border bg-background px-3.5 py-1.5 text-sm font-medium text-[#3f5146] transition-colors hover:border-primary hover:bg-secondary hover:text-brand-ink focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
              <TimeSelect
                id="pickupTime"
                label="Pick-up time"
                value={value.pickupTime}
                onChange={(pickupTime) => onChange({ pickupTime })}
              />
              <TimeSelect
                id="returnTime"
                label="Return time"
                value={value.returnTime}
                onChange={(returnTime) => onChange({ returnTime })}
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-border bg-card px-5 py-3.5 [@media(max-height:760px)]:py-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onChange({ pickupDate: "", returnDate: "" });
              setActiveEnd("pickup");
            }}
          >
            Clear dates
          </Button>
          <Button type="button" className="h-10 px-6" onClick={onDone}>
            Done
          </Button>
        </div>
    </>
  );
}

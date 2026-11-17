"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import {
  CalendarDaysIcon,
  CheckIcon,
  KeyRoundIcon,
  MapPinIcon,
  SearchIcon,
  UsersRoundIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Location } from "@/lib/catalog/types";
import {
  createSearchFormSchema,
  DEFAULT_TIME,
  formatRentalLength,
  joinDateTime,
  type SearchFormValues,
} from "@/lib/search-schema";
import { cn } from "@/lib/utils";
import { RentalDatesPicker } from "./rental-dates-picker";

const MODE_OPTIONS = [
  { value: "SELF_DRIVE", label: "Self-drive", hint: "You drive", Icon: KeyRoundIcon },
  { value: "WITH_DRIVER", label: "With a driver", hint: "We match a pro", Icon: UsersRoundIcon },
] as const;

const TRUST_POINTS = ["No hidden fees", "Deposit shown separately"] as const;


function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

function LocationSelect({
  id,
  value,
  onChange,
  locations,
  placeholder,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  locations: Location[];
  placeholder: string;
  invalid: boolean;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        className="mt-2 w-full justify-start bg-background data-[size=default]:h-12 *:data-[slot=select-value]:flex-1 *:data-[slot=select-value]:text-left"
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
      >
        <MapPinIcon aria-hidden="true" className="size-4 text-primary" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" className="p-1.5">
        {locations.map((location) => (
          <SelectItem key={location.id} value={location.id} className="gap-2.5 py-2.5 pr-8 pl-2.5">
            <MapPinIcon aria-hidden="true" className="size-4 text-muted-foreground" />
            {location.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SearchForm({ locations }: { locations: Location[] }) {
  const router = useRouter();
  const schema = useMemo(() => createSearchFormSchema(), []);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mode: "SELF_DRIVE",
      pickupLocation: "",
      sameReturn: true,
      returnLocation: "",
      pickupDate: "",
      pickupTime: DEFAULT_TIME,
      returnDate: "",
      returnTime: DEFAULT_TIME,
    },
  });

  const [sameReturn, pickupDate, pickupTime, returnDate, returnTime] = useWatch({
    control,
    name: ["sameReturn", "pickupDate", "pickupTime", "returnDate", "returnTime"],
  });
  const rentalLength =
    pickupDate && returnDate
      ? formatRentalLength(joinDateTime(pickupDate, pickupTime), joinDateTime(returnDate, returnTime))
      : undefined;

  const onSubmit = (values: SearchFormValues) => {
    const params = new URLSearchParams({
      mode: values.mode,
      location: values.pickupLocation,
      pickupAt: joinDateTime(values.pickupDate, values.pickupTime),
      returnAt: joinDateTime(values.returnDate, values.returnTime),
    });
    if (!values.sameReturn && values.returnLocation) params.set("returnLocation", values.returnLocation);
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="search-heading"
      className="rounded-[20px] border border-white/70 bg-card p-5 shadow-[0_40px_80px_-40px_rgba(18,36,27,0.55)] sm:p-6 [@media(max-height:760px)]:py-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="md:shrink-0">
          <h2 id="search-heading" className="text-xl font-semibold tracking-tight text-brand-ink">
            Rent a car for your dates
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Daily, weekly and monthly rates · self-drive or with a driver
          </p>
        </div>

        <Controller
          control={control}
          name="mode"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              aria-label="Rental type"
              className="grid w-full grid-cols-2 gap-1 rounded-xl border border-border bg-muted p-1 md:w-auto"
            >
              {MODE_OPTIONS.map(({ value, label, hint, Icon }) => (
                <Label
                  key={value}
                  htmlFor={`mode-${value}`}
                  className={cn(
                    "relative flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 whitespace-nowrap transition-colors sm:px-4 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                    field.value === value ? "text-brand-ink" : "text-muted-foreground hover:text-brand-ink",
                  )}
                >
                  {field.value === value ? (
                    <motion.span
                      layoutId="search-mode-indicator"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg bg-card shadow-sm"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <RadioGroupItem id={`mode-${value}`} value={value} className="sr-only" />
                  <Icon aria-hidden="true" className="relative size-4 shrink-0" />
                  <span className="relative flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="hidden text-[0.7rem] font-normal text-muted-foreground sm:block">{hint}</span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          )}
        />
      </div>

      <div className="mt-5 grid items-start gap-4 lg:grid-cols-[1fr_2.1fr_auto] [@media(max-height:760px)]:mt-4">
        <div>
          <Label htmlFor="pickupLocation" className="text-xs text-[#526257]">
            Pick-up location
          </Label>
          <Controller
            control={control}
            name="pickupLocation"
            render={({ field }) => (
              <LocationSelect
                id="pickupLocation"
                value={field.value}
                onChange={field.onChange}
                locations={locations}
                placeholder="Where you'll collect the car"
                invalid={Boolean(errors.pickupLocation)}
              />
            )}
          />
          <FieldError id="pickupLocation-error" message={errors.pickupLocation?.message} />
        </div>

        <RentalDatesPicker
          value={{ pickupDate, pickupTime, returnDate, returnTime }}
          onChange={(next) => {
            for (const [key, fieldValue] of Object.entries(next) as [keyof typeof next, string][]) {
              setValue(key, fieldValue, { shouldDirty: true, shouldValidate: isSubmitted });
            }
          }}
          pickupError={errors.pickupDate?.message}
          returnError={errors.returnDate?.message}
        />

        <div className="lg:pt-6">
          <Button type="submit" size="lg" className="h-12 w-full px-7 text-base" disabled={isSubmitting}>
            <SearchIcon aria-hidden="true" />
            Find cars
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {sameReturn ? null : (
          <motion.div
            key="return-location"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4 lg:w-[calc((100%-2rem)*0.32)]">
              <Label htmlFor="returnLocation" className="text-xs text-[#526257]">
                Return location
              </Label>
              <Controller
                control={control}
                name="returnLocation"
                render={({ field }) => (
                  <LocationSelect
                    id="returnLocation"
                    value={field.value}
                    onChange={field.onChange}
                    locations={locations}
                    placeholder="Where you'll return the car"
                    invalid={Boolean(errors.returnLocation)}
                  />
                )}
              />
              <FieldError id="returnLocation-error" message={errors.returnLocation?.message} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2.5">
        <Controller
          control={control}
          name="sameReturn"
          render={({ field }) => (
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#3f5146]">
              <input
                type="checkbox"
                className="size-4 cursor-pointer accent-[var(--primary)]"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
              Return to the same location
            </label>
          )}
        />
        <p
          aria-live="polite"
          data-rental-length
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            rentalLength ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          <CalendarDaysIcon aria-hidden="true" className="size-3.5" />
          {rentalLength ? `Rental length: ${rentalLength}` : "Choose dates to see rental length"}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground lg:ml-auto [@media(max-height:760px)]:hidden">
          {TRUST_POINTS.map((point) => (
            <li key={point} className="inline-flex items-center gap-1.5">
              <CheckIcon aria-hidden="true" className="size-3.5 text-primary" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </form>
  );
}

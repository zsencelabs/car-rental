"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDaysIcon, KeyRoundIcon, MapPinIcon, SearchIcon, UsersRoundIcon } from "lucide-react";
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
  { value: "SELF_DRIVE", label: "Self-drive", Icon: KeyRoundIcon },
  { value: "WITH_DRIVER", label: "With a driver", Icon: UsersRoundIcon },
] as const;

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
          <SelectItem key={location.id} value={location.id} className="py-2.5 pr-8 pl-3">
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
      pickupDate: "",
      pickupTime: DEFAULT_TIME,
      returnDate: "",
      returnTime: DEFAULT_TIME,
    },
  });

  const [pickupDate, pickupTime, returnDate, returnTime] = useWatch({
    control,
    name: ["pickupDate", "pickupTime", "returnDate", "returnTime"],
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
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="search-heading"
      className="rounded-[20px] border border-white/70 bg-card p-5 shadow-[0_40px_80px_-40px_rgba(18,36,27,0.55)] sm:p-6 [@media(max-height:760px)]:py-4"
    >
      <h2 id="search-heading" className="sr-only">
        Where are you headed?
      </h2>

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.3fr)] lg:gap-5">
        <div className="min-w-0">
          <Label htmlFor="pickupLocation" className="text-xs font-medium text-[#526257]">
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
                placeholder="City, airport or station"
                invalid={Boolean(errors.pickupLocation)}
              />
            )}
          />
          <FieldError id="pickupLocation-error" message={errors.pickupLocation?.message} />
        </div>

        <RentalDatesPicker
          className="lg:gap-5"
          value={{ pickupDate, pickupTime, returnDate, returnTime }}
          onChange={(next) => {
            for (const [key, fieldValue] of Object.entries(next) as [keyof typeof next, string][]) {
              setValue(key, fieldValue, { shouldDirty: true, shouldValidate: isSubmitted });
            }
          }}
          pickupError={errors.pickupDate?.message}
          returnError={errors.returnDate?.message}
        />
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-border pt-5 md:flex-row md:items-center [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:pt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span aria-hidden="true" className="text-xs font-medium whitespace-nowrap text-[#526257]">
            Rental type
          </span>
          <Controller
            control={control}
            name="mode"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                aria-label="Rental type"
                className="grid grid-cols-2 gap-2 sm:flex"
              >
                {MODE_OPTIONS.map(({ value, label, Icon }) => {
                  const selected = field.value === value;
                  return (
                    <Label
                      key={value}
                      htmlFor={`mode-${value}`}
                      className={cn(
                        "flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-white text-[#3f5146] hover:border-primary/50 hover:text-brand-ink",
                      )}
                    >
                      <RadioGroupItem id={`mode-${value}`} value={value} className="sr-only" />
                      <Icon aria-hidden="true" className="size-4 shrink-0" />
                      {label}
                    </Label>
                  );
                })}
              </RadioGroup>
            )}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:ml-auto">
          <p
            aria-live="polite"
            data-rental-length
            className={cn(
              "inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold sm:self-auto",
              rentalLength ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            <CalendarDaysIcon aria-hidden="true" className="size-3.5" />
            {rentalLength ? `Rental length: ${rentalLength}` : "Choose dates to see rental length"}
          </p>
          <Button type="submit" size="lg" className="h-11 w-full px-7 text-base sm:w-auto" disabled={isSubmitting}>
            <SearchIcon aria-hidden="true" />
            Find cars
          </Button>
        </div>
      </div>
    </form>
  );
}

"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, KeyRoundIcon, SearchIcon, UsersRoundIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { createSearchFormSchema, type SearchFormValues } from "@/lib/search-schema";
import { cn } from "@/lib/utils";

const MODE_OPTIONS = [
  { value: "SELF_DRIVE", label: "Self-drive", Icon: KeyRoundIcon },
  { value: "WITH_DRIVER", label: "With a driver", Icon: UsersRoundIcon },
] as const;

const TRUST_POINTS = ["No hidden fees", "Deposit shown separately", "Verified providers and drivers"] as const;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

export function SearchForm({ locations }: { locations: Location[] }) {
  const router = useRouter();
  const schema = useMemo(() => createSearchFormSchema(), []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mode: "SELF_DRIVE",
      pickupLocation: "",
      dropoffLocation: "",
      pickupAt: "",
      returnAt: "",
    },
  });

  const onSubmit = (values: SearchFormValues) => {
    const params = new URLSearchParams({
      mode: values.mode,
      location: values.pickupLocation,
      pickupAt: values.pickupAt,
      returnAt: values.returnAt,
    });
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-labelledby="search-heading"
      className="rounded-[18px] border border-[#e5eae3] bg-card p-5 shadow-[0_24px_60px_-40px_rgba(38,60,50,0.55)] sm:p-7"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="md:shrink-0">
          <p className="eyebrow">A better way to get there</p>
          <h2 id="search-heading" className="mt-2 text-xl font-semibold tracking-tight text-brand-ink">
            Where are you headed?
          </h2>
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
            {MODE_OPTIONS.map(({ value, label, Icon }) => (
              <Label
                key={value}
                htmlFor={`mode-${value}`}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                  field.value === value
                    ? "bg-card text-brand-ink shadow-sm"
                    : "text-muted-foreground hover:text-brand-ink",
                )}
              >
                <RadioGroupItem id={`mode-${value}`} value={value} className="sr-only" />
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {label}
              </Label>
            ))}
          </RadioGroup>
        )}
      />
      </div>

      <div className="mt-6 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        {(["pickupLocation", "dropoffLocation"] as const).map((name) => (
          <div key={name}>
            <Label htmlFor={name} className="text-xs text-[#526257]">
              {name === "pickupLocation" ? "Pickup location" : "Drop-off location"}
            </Label>
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={name}
                    className="mt-1.5 w-full bg-background data-[size=default]:h-11"
                    aria-invalid={Boolean(errors[name])}
                    aria-describedby={errors[name] ? `${name}-error` : undefined}
                  >
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id={`${name}-error`} message={errors[name]?.message} />
          </div>
        ))}

        {(["pickupAt", "returnAt"] as const).map((name) => (
          <div key={name}>
            <Label htmlFor={name} className="text-xs text-[#526257]">
              {name === "pickupAt" ? "Pickup date & time" : "Return date & time"}
            </Label>
            <Input
              id={name}
              type="datetime-local"
              className="mt-1.5 h-11 bg-background"
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
              {...register(name)}
            />
            <FieldError id={`${name}-error`} message={errors[name]?.message} />
          </div>
        ))}

        <div className="sm:col-span-2 lg:col-span-1 lg:pt-[1.375rem]">
          <Button type="submit" size="lg" className="h-11 w-full px-6" disabled={isSubmitting}>
            <SearchIcon aria-hidden="true" />
            Search cars
          </Button>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        {TRUST_POINTS.map((point) => (
          <li key={point} className="inline-flex items-center gap-1.5">
            <CheckIcon aria-hidden="true" className="size-3.5 text-primary" />
            {point}
          </li>
        ))}
      </ul>
    </form>
  );
}

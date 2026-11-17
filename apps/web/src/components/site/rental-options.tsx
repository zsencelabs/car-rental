"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RENTAL_MODES, type RentalMode } from "@/lib/catalog/types";
import { modeLabel } from "@/lib/search-schema";

interface RentalOptionsProps {
  allowedModes: RentalMode[];
  selfDrive: ReactNode;
  withDriver: ReactNode;
}

function isRentalMode(value: string | null): value is RentalMode {
  return value !== null && (RENTAL_MODES as readonly string[]).includes(value);
}

/** Self-drive / with-driver tabs. Preselects the mode from `?mode=` when allowed. */
export function RentalOptions({ allowedModes, selfDrive, withDriver }: RentalOptionsProps) {
  const requested = useSearchParams().get("mode");
  const defaultMode =
    isRentalMode(requested) && allowedModes.includes(requested) ? requested : allowedModes[0];

  return <RentalOptionsTabs defaultMode={defaultMode} {...{ allowedModes, selfDrive, withDriver }} />;
}

export function RentalOptionsTabs({
  allowedModes,
  selfDrive,
  withDriver,
  defaultMode,
}: RentalOptionsProps & { defaultMode: RentalMode }) {
  return (
    <Tabs defaultValue={defaultMode} className="w-full">
      <TabsList className="grid h-11 w-full grid-cols-2">
        {RENTAL_MODES.map((mode) => (
          <TabsTrigger key={mode} value={mode} disabled={!allowedModes.includes(mode)}>
            {modeLabel(mode)}
            {!allowedModes.includes(mode) ? <span className="sr-only"> (not offered for this car)</span> : null}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="SELF_DRIVE" className="mt-5">
        {selfDrive}
      </TabsContent>
      <TabsContent value="WITH_DRIVER" className="mt-5">
        {withDriver}
      </TabsContent>
    </Tabs>
  );
}

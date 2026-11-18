"use client";

import { useSyncExternalStore } from "react";

/** Live result of a CSS media query; `false` during server rendering. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", callback);
      return () => list.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Tailwind's `lg` breakpoint. */
export const DESKTOP_QUERY = "(min-width: 1024px)";

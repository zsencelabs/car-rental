import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

/** Original mark: a winding route that ends at a destination dot. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-8 shrink-0", className)}>
      <rect width="32" height="32" rx="10" fill="var(--brand-mark)" />
      <path
        d="M8 24c0-6 9-5 9-11 0-3.2 2.6-5.2 6.4-5.2"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="24" r="2.1" fill="#fff" />
      <circle cx="24.2" cy="7.8" r="2.6" fill="#cfe0d2" />
    </svg>
  );
}

export function Brand({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 text-[1.4rem] font-bold tracking-[-0.045em] whitespace-nowrap transition-colors",
        inverted ? "text-white" : "text-brand-ink",
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      <BrandMark />
      <span>
        KAIYA{" "}
        <span className={cn("font-semibold", inverted ? "text-white/80" : "text-brand-accent")}>Rentals</span>
      </span>
    </Link>
  );
}

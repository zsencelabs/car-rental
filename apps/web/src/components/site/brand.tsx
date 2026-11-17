import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 text-[1.45rem] font-bold tracking-[-0.05em] whitespace-nowrap text-brand-ink",
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-[10px_10px_10px_4px] bg-brand-mark text-base font-extrabold tracking-normal text-white"
      >
        K
      </span>
      <span>
        KAIYA <span className="font-semibold text-brand-accent">Rentals</span>
      </span>
    </Link>
  );
}

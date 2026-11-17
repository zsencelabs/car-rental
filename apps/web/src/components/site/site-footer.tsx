import Link from "next/link";
import { footerNav, siteConfig } from "@/lib/site-config";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card text-muted-foreground">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Brand className="text-xl" />
          <p className="mt-3 text-sm leading-relaxed">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3">
          {footerNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border/60">
        <p className="mx-auto max-w-[1180px] px-4 py-4 text-xs sm:px-6">
          {siteConfig.name} · Preview site. Listings, prices and drivers shown are sample data and
          online booking is not yet available.
        </p>
      </div>
    </footer>
  );
}

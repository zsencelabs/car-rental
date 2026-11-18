import Link from "next/link";
import { MailIcon, MapPinIcon } from "lucide-react";
import { footerColumns, siteConfig } from "@/lib/site-config";
import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#1f3329] text-[#c9d6cd]">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-sm">
          <Brand inverted className="text-xl" />
          <p className="mt-4 text-sm leading-relaxed text-[#a9bcb0]">{siteConfig.tagline}</p>
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MailIcon aria-hidden="true" className="size-4 text-[#8fb39a]" />
              {siteConfig.supportEmail}
            </li>
            <li className="flex items-center gap-2">
              <MapPinIcon aria-hidden="true" className="size-4 text-[#8fb39a]" />
              Office address to be announced
            </li>
          </ul>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-semibold tracking-[0.14em] text-white uppercase">{column.title}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#b5c6bb] transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-4 py-5 text-xs text-[#93a99b] sm:flex-row sm:justify-between sm:px-6">
          <p>© {siteConfig.name}. Preview site: listings, prices, drivers and reviews are sample data.</p>
          <p>Online booking opens soon.</p>
        </div>
      </div>
    </footer>
  );
}

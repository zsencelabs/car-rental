"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDownIcon, LifeBuoyIcon, MenuIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  categoryLinks,
  partnerLinks,
  registerLinks,
  rentLinks,
  siteConfig,
} from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Brand } from "./brand";

const HEADER_HEIGHT = "h-[4.5rem]";
const SCROLL_THRESHOLD = 24;

function isActive(pathname: string, href: string): boolean {
  const path = href.split("?")[0];
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const overlaysHero = pathname === "/";
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > SCROLL_THRESHOLD));

  const transparent = overlaysHero && !scrolled && !mobileOpen;

  const linkTone = transparent
    ? "text-white/90 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-open:bg-white/15 data-open:text-white data-popup-open:bg-white/15 data-popup-open:text-white data-open:hover:bg-white/20 data-open:focus:bg-white/20"
    : "text-[#3f5146] hover:bg-secondary hover:text-brand-ink focus:bg-secondary data-open:bg-secondary data-popup-open:bg-secondary data-open:hover:bg-secondary data-open:focus:bg-secondary";

  return (
    <>
      <header
        data-transparent={transparent}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
          transparent
            ? "border-b border-transparent bg-transparent"
            : "border-b border-border/70 bg-background/90 shadow-[0_8px_30px_-22px_rgba(38,60,50,0.45)] backdrop-blur-md supports-[backdrop-filter]:bg-background/80",
        )}
      >
        <div className={cn("mx-auto flex max-w-[1240px] items-center gap-6 px-4 sm:px-6", HEADER_HEIGHT)}>
          <Brand inverted={transparent} />

          <NavigationMenu viewport={false} className="ml-6 hidden lg:flex" aria-label="Main">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn("bg-transparent", linkTone, isActive(pathname, "/cars") && "font-semibold")}
                >
                  Rent a car
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[640px] grid-cols-[1fr_1.2fr] gap-2 p-2">
                    <ul className="flex flex-col gap-1">
                      {rentLinks.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link href={item.href} className="flex-col items-start gap-0.5 p-3">
                              <span className="font-semibold text-brand-ink">{item.title}</span>
                              <span className="text-xs leading-snug text-muted-foreground">
                                {item.description}
                              </span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-lg bg-muted p-2">
                      <p className="px-2 pt-1 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Browse by category
                      </p>
                      <ul className="grid grid-cols-2 gap-1">
                        {categoryLinks.map((category) => (
                          <li key={category.href}>
                            <NavigationMenuLink asChild>
                              <Link href={category.href} className="gap-2.5 p-1.5">
                                <span className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                                  <Image src={category.image} alt="" fill sizes="48px" className="object-cover" />
                                </span>
                                <span className="text-sm font-medium text-brand-ink">{category.label}</span>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild active={isActive(pathname, "/how-it-works")}>
                  <Link
                    href="/how-it-works"
                    className={cn("h-9 px-3 font-medium", linkTone, "data-active:font-semibold")}
                  >
                    How it works
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn("bg-transparent", linkTone, isActive(pathname, "/work-with-us") && "font-semibold")}
                >
                  Work with us
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="flex w-[340px] flex-col gap-1 p-2">
                    {partnerLinks.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href} className="flex-col items-start gap-0.5 p-3">
                            <span className="font-semibold text-brand-ink">{item.title}</span>
                            <span className="text-xs leading-snug text-muted-foreground">{item.description}</span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild active={isActive(pathname, "/help")}>
                  <Link href="/help" className={cn("h-9 px-3 font-medium", linkTone, "data-active:font-semibold")}>
                    Help
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <Button
              asChild
              variant="ghost"
              className={cn("h-10 px-4", transparent ? "text-white hover:bg-white/10 hover:text-white" : "")}
            >
              <Link href="/login">Log in</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={cn(
                    "h-10 gap-1.5 px-5",
                    transparent && "bg-white text-brand-ink hover:bg-white/90",
                  )}
                >
                  Register <ChevronDownIcon aria-hidden="true" className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Create an account as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {registerLinks.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex flex-col items-start gap-0">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "ml-auto size-10 lg:hidden",
                  transparent && "border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white",
                )}
                aria-label="Open menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
              <SheetHeader className="border-b border-border px-5 py-4">
                <SheetTitle asChild>
                  <div>
                    <Brand className="text-xl" />
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-2">
                <Accordion type="multiple" defaultValue={["rent"]}>
                  <AccordionItem value="rent">
                    <AccordionTrigger className="text-base font-semibold">Rent a car</AccordionTrigger>
                    <AccordionContent className="[&_a]:no-underline">
                      <ul className="flex flex-col gap-1">
                        {rentLinks.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-lg px-3 py-2.5 hover:bg-muted"
                            >
                              <span className="block font-medium text-brand-ink">{item.title}</span>
                              <span className="block text-xs text-muted-foreground">{item.description}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <ul className="mt-2 grid grid-cols-3 gap-2">
                        {categoryLinks.map((category) => (
                          <li key={category.href}>
                            <Link
                              href={category.href}
                              onClick={() => setMobileOpen(false)}
                              className="block overflow-hidden rounded-lg border border-border"
                            >
                              <span className="relative block aspect-[4/3] bg-secondary">
                                <Image src={category.image} alt="" fill sizes="110px" className="object-cover" />
                              </span>
                              <span className="block px-2 py-1.5 text-xs font-medium text-brand-ink">
                                {category.label}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="partners">
                    <AccordionTrigger className="text-base font-semibold">Work with us</AccordionTrigger>
                    <AccordionContent className="[&_a]:no-underline">
                      <ul className="flex flex-col gap-1">
                        {partnerLinks.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-lg px-3 py-2.5 hover:bg-muted"
                            >
                              <span className="block font-medium text-brand-ink">{item.title}</span>
                              <span className="block text-xs text-muted-foreground">{item.description}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <ul className="mt-2 flex flex-col">
                  {[
                    { href: "/how-it-works", label: "How it works" },
                    { href: "/help", label: "Help" },
                    { href: "/about", label: "About" },
                    { href: "/contact", label: "Contact" },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive(pathname, item.href) ? "page" : undefined}
                        className="block border-b border-border py-3.5 text-base font-semibold text-brand-ink aria-[current=page]:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-border bg-muted/60 px-5 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" className="h-11">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild className="h-11">
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <LifeBuoyIcon aria-hidden="true" className="size-3.5" />
                  Need help? {siteConfig.supportEmail}
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      {/* Pages without a full-bleed hero need space for the fixed header. */}
      {overlaysHero ? null : <div aria-hidden="true" className={HEADER_HEIGHT} />}
    </>
  );
}

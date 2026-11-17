import Link from "next/link";
import { ArrowRightIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav } from "@/lib/site-config";
import { Brand } from "./brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-[4.5rem] max-w-[1180px] items-center justify-between gap-8 px-4 sm:px-6">
        <Brand />

        <nav aria-label="Main" className="ml-auto hidden items-center gap-7 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/sign-in">
              Portal sign in <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild className="h-10 px-5">
            <Link href="/cars">Find a car</Link>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(20rem,85vw)]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-accent"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/sign-in"
                className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-accent"
              >
                Portal sign in
              </Link>
              <Button asChild className="mt-3">
                <Link href="/cars">Find a car</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

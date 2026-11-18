import Link from "next/link";
import { ArrowRightIcon, BriefcaseIcon, CarIcon, IdCardIcon } from "lucide-react";

const PARTNERS = [
  {
    href: "/work-with-us/providers",
    eyebrow: "Vehicle providers",
    title: "Bring your vehicles.",
    body: "Rental companies and individual owners list their cars, set prices and manage reservations.",
    cta: "List your fleet",
    Icon: CarIcon,
  },
  {
    href: "/work-with-us/partners",
    eyebrow: "Business partners",
    title: "Bring your customers.",
    body: "Hotels, agencies and travel businesses arranging rentals for their guests. Coming soon.",
    cta: "Register interest",
    Icon: BriefcaseIcon,
  },
  {
    href: "/work-with-us/drivers",
    eyebrow: "Drivers",
    title: "Make the drive matter.",
    body: "Independent professional drivers offer their services on a schedule that works for them.",
    cta: "Drive with us",
    Icon: IdCardIcon,
  },
] as const;

export function PartnerCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PARTNERS.map(({ href, eyebrow, title, body, cta, Icon }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-col rounded-[13px] border border-[#e7eae3] bg-card p-6 transition-shadow hover:shadow-[0_12px_30px_-18px_rgba(38,60,50,0.45)]"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span className="eyebrow mt-5">{eyebrow}</span>
          <span className="mt-2 text-xl font-semibold tracking-tight text-brand-ink">{title}</span>
          <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</span>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            {cta}
            <ArrowRightIcon aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}

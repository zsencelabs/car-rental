import { CalendarCheckIcon, SearchIcon, UserRoundCheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Search and compare",
    body: "Choose where and when, then compare cars from rental companies and local owners side by side.",
    Icon: SearchIcon,
  },
  {
    title: "Drive yourself or add a driver",
    body: "Pick self-drive, or browse recommended independent drivers and choose the one that suits your trip.",
    Icon: UserRoundCheckIcon,
  },
  {
    title: "Confirm and go",
    body: "See every charge up front, with the refundable deposit shown separately, then pick up and enjoy the road.",
    Icon: CalendarCheckIcon,
  },
] as const;

export function HowItWorksSteps({ className }: { className?: string }) {
  return (
    <ol className={cn("grid gap-4 md:grid-cols-3", className)}>
      {STEPS.map(({ title, body, Icon }, index) => (
        <li key={title} className="rounded-[13px] border border-[#e7eae3] bg-card p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-secondary text-secondary-foreground">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="text-sm font-semibold text-muted-foreground">Step {index + 1}</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold tracking-tight text-brand-ink">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
        </li>
      ))}
    </ol>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { CarFrontIcon, CheckIcon, IdCardIcon, UserRoundIcon } from "lucide-react";
import { PageContainer, PageIntro, PreviewNotice } from "@/components/site/page-intro";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Register as a customer, vehicle provider or independent driver.",
};

const ROLES = [
  {
    id: "customer",
    title: "Customer",
    Icon: UserRoundIcon,
    summary: "Rent cars for self-drive or with a driver.",
    needs: ["Name, email and phone", "Driving license and ID for self-drive", "Payment method at checkout"],
  },
  {
    id: "provider",
    title: "Vehicle provider",
    Icon: CarFrontIcon,
    summary: "Rental companies and individual owners listing vehicles.",
    needs: ["Business or identity documents", "Vehicle registration, insurance and ownership", "Payout account for earnings"],
  },
  {
    id: "driver",
    title: "Independent driver",
    Icon: IdCardIcon,
    summary: "Professional drivers offering their services. No car needed.",
    needs: ["Driving license, category and expiry", "National ID and profile photo", "Service areas, schedule and rates"],
  },
] as const;

function RoleCards({ selected }: { selected?: string }) {
  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-3">
      {ROLES.map(({ id, title, Icon, summary, needs }) => (
        <li
          key={id}
          id={id}
          aria-current={selected === id ? "true" : undefined}
          className={cn(
            "rounded-[18px] border bg-card p-6 transition-shadow",
            selected === id ? "border-primary shadow-[0_20px_40px_-28px_rgba(38,60,50,0.6)] ring-2 ring-primary/20" : "border-[#e7eae3]",
          )}
        >
          <span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-brand-ink">{title}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{summary}</p>
          <p className="mt-5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">You&apos;ll need</p>
          <ul className="mt-2 space-y-2">
            {needs.map((need) => (
              <li key={need} className="flex gap-2 text-sm text-[#3f5146]">
                <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                {need}
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled
            className="mt-6 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground opacity-60"
          >
            Registration opens soon
          </button>
        </li>
      ))}
    </ul>
  );
}

async function SelectedRoleCards({ searchParams }: { searchParams: PageProps<"/register">["searchParams"] }) {
  const role = (await searchParams).role;
  return <RoleCards selected={typeof role === "string" ? role : undefined} />;
}

export default function RegisterPage({ searchParams }: PageProps<"/register">) {
  return (
    <PageContainer>
      <PageIntro eyebrow="Join KAIYA" title="Create an account">
        <p>Choose how you&apos;ll use KAIYA. Every account is verified before it can book, list or drive.</p>
      </PageIntro>
      <Suspense fallback={<RoleCards />}>
        <SelectedRoleCards searchParams={searchParams} />
      </Suspense>
      <div className="mt-8 max-w-3xl">
        <PreviewNotice>Registration isn&apos;t open in this preview. Documents will be stored privately and never shown publicly.</PreviewNotice>
      </div>
    </PageContainer>
  );
}

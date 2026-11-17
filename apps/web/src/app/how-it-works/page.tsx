import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HowItWorksStory } from "@/components/site/how-it-works-story";
import { PageContainer, PageIntro } from "@/components/site/page-intro";

export const metadata: Metadata = {
  title: "How it works",
  description: "Rent a car and drive yourself, or add an independent professional driver.",
};

const MODES = [
  {
    title: "Self-drive",
    points: [
      "Rent a car and drive it yourself",
      "Bring a valid driving license and complete identity verification",
      "A refundable security deposit applies, shown separately from the price",
    ],
  },
  {
    title: "With a driver",
    points: [
      "Rent a car and choose an independent professional driver",
      "Compare recommended drivers by rating, experience and languages",
      "The car and your chosen driver are both confirmed before your booking is",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <PageContainer>
      <PageIntro eyebrow="How it works" title={<>Your car, <em className="heading-accent">your way.</em></>}>
        <p>Every booking is either self-drive or with a driver. Here&apos;s what each one means.</p>
      </PageIntro>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {MODES.map((mode) => (
          <section key={mode.title} className="rounded-[13px] border border-[#e7eae3] bg-card p-6">
            <h2 className="text-xl font-semibold tracking-tight text-brand-ink">{mode.title}</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {mode.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <h2 className="section-title mt-20 text-3xl">From search to the open road</h2>
      <div className="mt-4">
        <HowItWorksStory />
      </div>

      <Button asChild size="lg" className="mt-10">
        <Link href="/cars">Find a car</Link>
      </Button>
    </PageContainer>
  );
}

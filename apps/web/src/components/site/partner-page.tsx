import Link from "next/link";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageIntro, PreviewNotice } from "./page-intro";

interface PartnerPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  benefits: string[];
  requirements: string[];
  notice: string;
}

export function PartnerPage({ eyebrow, title, intro, benefits, requirements, notice }: PartnerPageProps) {
  return (
    <PageContainer>
      <PageIntro eyebrow={eyebrow} title={title}>
        <p>{intro}</p>
      </PageIntro>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {[
          { heading: "What you get", items: benefits },
          { heading: "What you'll need", items: requirements },
        ].map(({ heading, items }) => (
          <section key={heading} className="rounded-[13px] border border-[#e7eae3] bg-card p-6">
            <h2 className="text-lg font-semibold text-brand-ink">{heading}</h2>
            <ul className="mt-4 space-y-2.5">
              {items.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                  <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 max-w-3xl">
        <PreviewNotice>{notice}</PreviewNotice>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/contact">Contact us</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/work-with-us">All partner options</Link>
        </Button>
      </div>
    </PageContainer>
  );
}

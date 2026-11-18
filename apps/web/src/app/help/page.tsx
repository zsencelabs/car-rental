import type { Metadata } from "next";
import { PageContainer, PageIntro } from "@/components/site/page-intro";

export const metadata: Metadata = { title: "Help" };

const FAQS = [
  {
    q: "What's the difference between self-drive and with a driver?",
    a: "Self-drive means you drive the car yourself and need a valid license. With a driver means you also choose an independent professional driver, and driver charges are added separately.",
  },
  {
    q: "Is the security deposit part of the price?",
    a: "No. The deposit is refundable and shown separately from the rental price.",
  },
  {
    q: "Can I book online now?",
    a: "Not yet. This is a preview of the site, and online booking opens soon.",
  },
  {
    q: "Who provides the cars?",
    a: "Rental companies and individual owners, each verified before their vehicles are published.",
  },
];

export default function HelpPage() {
  return (
    <PageContainer>
      <PageIntro eyebrow="Customer support" title="Help">
        <p>Answers to common questions. For anything else, see the contact page.</p>
      </PageIntro>
      <div className="mt-10 max-w-3xl divide-y divide-border rounded-[13px] border border-[#e7eae3] bg-card">
        {FAQS.map(({ q, a }) => (
          <details key={q} className="group p-5">
            <summary className="cursor-pointer list-none font-semibold text-brand-ink marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {q}
                <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
    </PageContainer>
  );
}

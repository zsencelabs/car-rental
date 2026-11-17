import type { Metadata } from "next";
import Image from "next/image";
import { PageContainer, PageIntro } from "@/components/site/page-intro";
import { imageCredits } from "@/lib/image-credits";

export const metadata: Metadata = {
  title: "Photo credits",
  description: "Sources, authors and licenses for photos used on this site.",
};

export default function CreditsPage() {
  return (
    <PageContainer>
      <PageIntro eyebrow="Legal" title="Photo credits">
        <p>
          Car photos come from Wikimedia Commons and are used under the Creative Commons licenses shown, resized but
          otherwise unmodified. Lifestyle and destination photos come from rawpixel under CC0.
        </p>
      </PageIntro>
      <ul className="mt-10 grid gap-3 md:grid-cols-2">
        {imageCredits.map((credit) => (
          <li key={credit.file} className="flex gap-4 rounded-xl border border-border bg-card p-3">
            <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
              <Image src={credit.file} alt="" fill sizes="96px" className="object-cover" />
            </span>
            <div className="min-w-0 text-sm">
              <p className="truncate font-medium text-brand-ink">
                <a href={credit.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {credit.title}
                </a>
              </p>
              <p className="text-muted-foreground">
                by {credit.creator} · {credit.source}
              </p>
              <p className="text-muted-foreground">
                {credit.licenseUrl ? (
                  <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    {credit.license}
                  </a>
                ) : (
                  credit.license
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}

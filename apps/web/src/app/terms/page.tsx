import type { Metadata } from "next";
import { PageContainer, PageIntro, PreviewNotice } from "@/components/site/page-intro";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <PageContainer>
      <PageIntro eyebrow="Booking information" title="Terms" />
      <div className="mt-8 max-w-3xl">
        <PreviewNotice>
          Placeholder. The final rental terms will be
          published here before launch, after legal review.
        </PreviewNotice>
      </div>
    </PageContainer>
  );
}

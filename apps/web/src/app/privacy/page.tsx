import type { Metadata } from "next";
import { PageContainer, PageIntro, PreviewNotice } from "@/components/site/page-intro";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <PageContainer>
      <PageIntro eyebrow="Your information" title="Privacy policy" />
      <div className="mt-8 max-w-3xl">
        <PreviewNotice>
          Placeholder. The final privacy policy will be
          published here before launch, after legal review.
        </PreviewNotice>
      </div>
    </PageContainer>
  );
}

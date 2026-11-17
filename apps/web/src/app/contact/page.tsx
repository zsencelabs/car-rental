import type { Metadata } from "next";
import { PageContainer, PageIntro, PreviewNotice } from "@/components/site/page-intro";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageContainer>
      <PageIntro eyebrow="Get in touch" title="Contact">
        <p>
          Questions about a vehicle, a driver or working with us? Our support contact details will be listed
          here.
        </p>
      </PageIntro>
      <div className="mt-8 max-w-3xl">
        <PreviewNotice>Contact details will be published before launch.</PreviewNotice>
      </div>
    </PageContainer>
  );
}

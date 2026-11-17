import type { Metadata } from "next";
import { PageContainer, PageIntro } from "@/components/site/page-intro";
import { PartnerCards } from "@/components/site/partner-cards";

export const metadata: Metadata = {
  title: "Work with us",
  description: "List your vehicles or offer your services as an independent professional driver.",
};

export default function WorkWithUsPage() {
  return (
    <PageContainer>
      <PageIntro eyebrow="Work with us" title="Rental partners">
        <p>
          KAIYA Rentals keeps vehicle supply and driving services independent. Rental companies and owners
          provide the cars. Independent drivers provide the driving, and customers choose them directly.
        </p>
      </PageIntro>
      <div className="mt-10">
        <PartnerCards />
      </div>
    </PageContainer>
  );
}

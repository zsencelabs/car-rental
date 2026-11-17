import type { Metadata } from "next";
import { PageContainer, PageIntro } from "@/components/site/page-intro";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageContainer>
      <PageIntro eyebrow="About us" title="About KAIYA Rentals">
        <p>
          KAIYA Rentals brings customers, vehicle providers and professional drivers together in one place.
          Rental companies and local owners list their cars. Independent drivers offer their services. You
          choose the car, and whether you drive or are driven.
        </p>
        <p className="mt-4">
          We keep vehicles and driving services independent, show every charge before you pay, and verify
          the providers, vehicles and drivers on the platform.
        </p>
      </PageIntro>
    </PageContainer>
  );
}

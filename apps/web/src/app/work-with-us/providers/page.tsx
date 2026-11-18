import type { Metadata } from "next";
import { PartnerPage } from "@/components/site/partner-page";

export const metadata: Metadata = {
  title: "Vehicle providers",
  description: "List your fleet or your own car on KAIYA Rentals.",
};

export default function ProvidersPage() {
  return (
    <PartnerPage
      eyebrow="Vehicle providers"
      title="Bring your vehicles."
      intro="Rental companies manage whole fleets, and individual owners can list a personal car. You provide the vehicle. You never need to supply a driver."
      benefits={[
        "Set daily, weekly and monthly rates and a refundable security deposit",
        "Manage availability with a calendar, including maintenance and personal-use blocks",
        "Choose instant booking or approve each request",
        "See bookings, earnings and payouts in one place",
      ]}
      requirements={[
        "Business or identity verification documents",
        "Vehicle registration, insurance and ownership documents",
        "Clear photos and accurate vehicle details",
        "Admin approval before a vehicle is published",
      ]}
      notice="Provider registration opens with the provider portal. Contact us to be notified when it launches."
    />
  );
}

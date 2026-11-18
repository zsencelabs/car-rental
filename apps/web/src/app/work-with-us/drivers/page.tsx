import type { Metadata } from "next";
import { PartnerPage } from "@/components/site/partner-page";

export const metadata: Metadata = {
  title: "Drive with us",
  description: "Offer professional driving services as an independent driver.",
};

export default function DriversPage() {
  return (
    <PartnerPage
      eyebrow="Drivers"
      title="Make the drive matter."
      intro="Independent professional drivers register with KAIYA Rentals directly. You don't need your own car: customers choose you to drive the vehicle they rent."
      benefits={[
        "Set your service areas and working schedule",
        "Accept the trips that suit you",
        "Build your reputation through ratings and completed trips",
        "Track earnings and request payouts",
      ]}
      requirements={[
        "A valid driving license and national identity document",
        "Driving experience and any additional qualifications",
        "Profile photo and emergency contact",
        "Verification by our team before your profile goes live",
      ]}
      notice="Driver registration opens with the driver portal. Contact us to be notified when it launches."
    />
  );
}

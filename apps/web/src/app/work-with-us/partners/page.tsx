import type { Metadata } from "next";
import { PartnerPage } from "@/components/site/partner-page";

export const metadata: Metadata = {
  title: "Business partners",
  description: "Arrange car rentals for your guests and customers. Coming soon.",
};

export default function BusinessPartnersPage() {
  return (
    <PartnerPage
      eyebrow="Business partners · Coming soon"
      title="Bring your customers."
      intro="Hotels, travel agencies and other businesses will be able to arrange rentals for their guests. We're still shaping this programme."
      benefits={[
        "Arrange self-drive or with-driver rentals for guests",
        "One place to follow the bookings you arrange",
        "Programme terms will be shared before launch",
      ]}
      requirements={[
        "A registered business",
        "A contact person for guest bookings",
      ]}
      notice="The business partner programme isn't available yet. Get in touch if you'd like to hear when it opens."
    />
  );
}

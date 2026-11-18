export const siteConfig = {
  name: "KAIYA Rentals",
  tagline: "Thoughtful car hire for wherever the road takes you.",
  description:
    "Rent a car from trusted rental companies and local owners, and drive yourself or choose an independent professional driver.",
  /** Placeholder until the client confirms real support details. */
  supportEmail: "support@example.com",
} as const;

export const rentLinks = [
  {
    href: "/cars?mode=SELF_DRIVE",
    title: "Self-drive",
    description: "Pick up the keys and drive yourself.",
  },
  {
    href: "/cars?mode=WITH_DRIVER",
    title: "With a driver",
    description: "Choose an independent, verified professional driver.",
  },
  {
    href: "/cars",
    title: "Browse all cars",
    description: "Compare cars from rental companies and local owners.",
  },
] as const;

export const categoryLinks = [
  { href: "/cars?category=suv", label: "SUV", image: "/images/categories/suv-jeep.jpg" },
  { href: "/cars?category=sedan", label: "Sedan", image: "/images/categories/sedan.jpg" },
  { href: "/cars?category=luxury", label: "Luxury", image: "/images/categories/luxury-porsche.jpg", imagePosition: "30% 50%" },
  { href: "/cars?category=van&mode=WITH_DRIVER", label: "Van", image: "/images/categories/van-vw-t1.jpg" },
  { href: "/cars?category=hatchback", label: "Hatchback", image: "/images/categories/hatchback-mini.jpg", imagePosition: "15% 50%" },
  { href: "/cars?fuel=electric", label: "Electric", image: "/images/categories/electric.jpg" },
] as const;

export const partnerLinks = [
  {
    href: "/work-with-us/providers",
    title: "Vehicle providers",
    description: "Rental companies and owners: list your cars.",
  },
  {
    href: "/work-with-us/drivers",
    title: "Drivers",
    description: "Offer your driving services independently.",
  },
  {
    href: "/work-with-us/partners",
    title: "Business partners",
    description: "Arrange rentals for your guests. Coming soon.",
  },
] as const;

export const registerLinks = [
  { href: "/register?role=customer", title: "Customer", description: "Rent cars and book drivers" },
  { href: "/register?role=provider", title: "Vehicle provider", description: "Company or individual owner" },
  { href: "/register?role=driver", title: "Driver", description: "Independent professional driver" },
] as const;

export const footerColumns = [
  {
    title: "Rent",
    links: [
      { href: "/cars?mode=SELF_DRIVE", label: "Self-drive" },
      { href: "/cars?mode=WITH_DRIVER", label: "With a driver" },
      { href: "/cars", label: "All cars" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Partners",
    links: [
      { href: "/work-with-us/providers", label: "List your vehicle" },
      { href: "/work-with-us/drivers", label: "Drive with us" },
      { href: "/work-with-us/partners", label: "Business partners" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/help", label: "Help" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/credits", label: "Photo credits" },
    ],
  },
] as const;

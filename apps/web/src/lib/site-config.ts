export const siteConfig = {
  name: "KAIYA Rentals",
  tagline: "Thoughtful car hire for wherever the road takes you.",
  description:
    "Rent a car from trusted rental companies and local owners, and drive yourself or choose an independent professional driver.",
} as const;

export const mainNav = [
  { href: "/cars", label: "Browse cars" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/work-with-us", label: "Work with us" },
] as const;

export const footerNav = [
  { href: "/help", label: "Help" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "/work-with-us", label: "Rental partners" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
] as const;

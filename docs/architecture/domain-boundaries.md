# Candidate domain boundaries

These are conceptual boundaries for evaluating the existing code or designing
a new system. They are not a final schema.

- Identity & Access: users, sessions, roles, permissions, verification
- Supplier Management: rental companies, onboarding, contracts, compliance
- Vehicle Catalog: vehicles, classes, features, documents, images
- Driver Marketplace: independent drivers, qualifications, service areas, profiles
- Availability: vehicle calendars, driver calendars, holds, blackout periods
- Search & Discovery: filters, sorting, recommendations, location
- Pricing: rate plans, date-based pricing, fees, taxes, discounts, quote snapshots
- Booking: quote, hold, confirmation, lifecycle, cancellation, rescheduling
- Payments & Ledger: payment intents, captures, refunds, commissions, payouts
- Reviews & Trust: ratings, moderation, incidents, fraud signals
- Notifications: email, SMS, push, in-app
- Operations & Admin: disputes, support, audit log, reporting

Do not split these into microservices automatically. Start with clear modules
and ownership boundaries; choose deployment boundaries only when justified.

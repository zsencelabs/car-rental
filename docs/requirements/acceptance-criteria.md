# Initial acceptance criteria — draft

- Customer can clearly choose self-drive or vehicle + driver.
- Search results only show vehicles eligible for the selected mode and trip.
- Self-drive booking does not require a driver.
- With-driver booking requires a separately approved independent driver.
- Rental companies cannot create or assign drivers as if they were their staff
  unless the business model is explicitly changed and documented.
- Driver recommendations show meaningful, explainable criteria.
- Customer selection does not bypass eligibility, availability, or verification.
- Vehicle and driver availability are independently revalidated at confirmation.
- Two concurrent attempts cannot confirm overlapping use of the same resource.
- A failed or duplicate payment callback cannot create duplicate charges,
  bookings, refunds, or payouts.
- Booking and financial state transitions are auditable.
- Authorization is enforced server-side for every protected action.

# Marketplace domain rules

- Rental company, vehicle, independent driver, customer, booking, payment,
  refund, commission, and payout are distinct domain concepts.
- Rental companies do not provide drivers in this business model.
- A `WITH_DRIVER` booking needs both vehicle and driver eligibility and
  availability; `SELF_DRIVE` does not require a driver.
- Never assume vehicle and driver calendars are the same resource.
- Recommendations do not reserve resources or guarantee assignment.
- Revalidate vehicle/driver eligibility and availability at confirmation.
- Prevent overlapping reservations under concurrency, not only in the UI.
- Record booking state transitions and financial ledger adjustments.
- Clarify cancellation, no-show, rescheduling, deposits, insurance, taxes,
  platform fees, driver compensation, and payout timing in requirements.

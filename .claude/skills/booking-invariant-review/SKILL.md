---
name: booking-invariant-review
description: Review booking and availability logic for correctness, concurrency, and lifecycle edge cases.
---

# Booking invariant review

Inspect the implementation and tests; do not assume a design from names alone.

Check:
- booking modes: self-drive and with-driver
- resource eligibility and independent calendars
- time zones, pickup/drop-off boundaries, buffers, and date-only semantics
- overlapping reservations and concurrent confirmation attempts
- transaction boundaries, locks/constraints, and retry behavior
- temporary holds, expiry, payment pending/failed, cancellation, rescheduling
- duplicate requests and idempotency keys
- state machine validity and audit history
- pricing snapshots, taxes, fees, discounts, deposits, and currency precision

Return verified evidence, race scenarios, missing tests, severity, and proposed
mitigations. Do not claim a simple availability query guarantees reservation.

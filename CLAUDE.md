# Project: Hybrid Rental Marketplace — Audit Workspace

## Purpose
Evaluate the BookCars open-source car-rental platform against a hybrid
marketplace where customers book either self-drive vehicles or vehicles with
independent drivers. This repository is initially an audit and decision workspace,
not the production application.

## Business assumptions to validate
- Rental companies list and supply vehicles; they do not supply drivers.
- Drivers are independent marketplace participants.
- Booking modes: `SELF_DRIVE` and `WITH_DRIVER`.
- Vehicle and driver availability are distinct resources.
- With-driver bookings require an eligible vehicle and an independently
  onboarded, approved, available driver.
- Recommendations are advisory; eligibility and availability are rechecked
  at confirmation.
- Payments, refunds, commissions, and payouts must be traceable and auditable.

Do not silently convert assumptions into requirements. Record questions and
decisions in `docs/`.

## Working method
1. Inspect before changing. For the initial BookCars audit, work read-only.
2. Plan non-trivial work before implementation. State scope, evidence, risks,
   files to inspect/change, and acceptance criteria.
3. Prefer small, reviewable tasks over broad one-shot implementation prompts.
4. Verify claims against source code, tests, migrations, CI, and deployment files.
   README claims alone are not proof of implementation.
5. Distinguish confirmed facts, inferences, assumptions, and unknowns.
6. Cite repository-relative file paths and relevant symbols in audit findings.
7. Do not invent features, APIs, environment variables, test results, or commands.
8. Ask before destructive actions, dependency installation, migrations,
   deployment, or pushing changes.

## Architecture and engineering principles
- Favor explicit domain boundaries and clear ownership of business rules.
- Keep booking, availability, pricing, and financial invariants server-side.
- Treat money as decimal/minor-unit values with explicit currency; never use
  binary floating-point for financial calculations.
- Store timestamps consistently (normally UTC) and make the business timezone
  explicit for date-based rental rules.
- Prevent overlapping confirmed reservations under concurrent requests; a
  check-then-insert sequence without transaction-safe protection is insufficient.
- Make payment webhooks idempotent and verify signatures.
- Keep audit trails for state transitions and financial adjustments.
- Enforce authorization on the server, not only in the UI.
- Validate all untrusted input at system boundaries.
- Do not log credentials, payment secrets, or unnecessary personal data.

## Audit deliverables
- Architecture and repository map.
- Feature compatibility matrix.
- Booking lifecycle and data-model trace.
- Driver marketplace gap analysis.
- Security, testing, operations, and dependency review.
- Extend-vs-rebuild recommendation with evidence, risks, and trade-offs.
- ADR documenting the final decision.

## Communication
Be direct and precise. Explain unfamiliar concepts briefly. Flag uncertainty.
Do not claim the project is production-ready merely because it builds.

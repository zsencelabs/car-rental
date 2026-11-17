# ADR-001: Build a new platform instead of extending BookCars

- Status: **Proposed** (awaiting product owner approval)
- Date: 2026-11-18
- Decision owners: Product owner / tech lead

## Context
We need a hybrid rental marketplace: company and individual vehicle providers, plus independent drivers, with SELF_DRIVE and WITH_DRIVER bookings, separate vehicle and driver availability, and separate auditable earnings (`docs/requirements/SRS.md`, `CLAUDE.md`). BookCars (MIT, `aelassas/bookcars@45bdbbf`) is a mature open-source car rental system and was evaluated as a starting point.

## Options considered
1. **Extend BookCars.** Gets working web/admin/mobile UIs and Stripe/PayPal quickly. But it uses MongoDB/Express/MUI instead of the mandated PostgreSQL/Prisma/NestJS/Next.js. It has no independent-driver concept (`Booking.driver` is the renter), float money, no ledger, commissions or payouts, hard-deletes bookings, and puts business logic in large controllers. The core model would need invasive refactors.
2. **Build from scratch on the chosen stack.** Designs the two-resource booking, decimal money, ledger and audit history from the start. Costs more upfront for commodity features.
3. **Fork as a throwaway prototype.** Fast self-drive demo, but doesn't exercise the driver marketplace, and there's a risk it turns into production.

## Decision
Option 2. Use BookCars only as a reference for specific patterns: server-side price recomputation, payment amount verification, refund on post-payment conflict, auth cookie settings, and the pricing algorithm's rate tiers.

## Consequences
- Positive: domain model fits the SRS. Database-level guarantees (exclusion constraints, decimal money, FK integrity). Follows `CLAUDE.md` rules.
- Negative: longer time to first demo. Search, auth, payments and admin CRUD must be built.
- Operational: one TypeScript monorepo (pnpm + Turborepo) instead of BookCars' four separate npm apps.
- Security: auditability, RBAC and document privacy are designed in rather than retrofitted.
- Migration/backward compatibility: none (no existing data).

## Evidence and references
- `docs/audit/bookcars-audit.md`
- `docs/audit/compatibility-matrix.md`
- `docs/requirements/requirements-analysis.md`

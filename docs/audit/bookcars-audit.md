# BookCars audit: extend or rebuild?

- **Status:** Initial audit, complete for a recommendation; follow-up items listed in §9
- **Date:** 2026-11-18
- **Audited by:** Claude Code (read-only static inspection)
- **Upstream:** https://github.com/aelassas/bookcars
- **Commit:** `45bdbbff1e01226eba42856e0a69d0bdd3338801` (branch `main`, resolved with `git ls-remote` on 2026-11-18)
- **Version in manifests:** 9.6.0 (`package.json`, `backend/package.json`)
- **Method:** Downloaded the source tarball for that exact commit from `codeload.github.com` into a temporary scratch folder and read the files. Nothing was installed, built or run. No BookCars code was copied into this workspace.

> **Environmental limitations (read before relying on this report)**
> - Tests, builds, linting and the app itself were **not run**. Every claim below is from reading source. "Verified" means "verified in source", not "verified at runtime".
> - The GitHub REST API was rate-limited for this IP (HTTP 403, `x-ratelimit-remaining: 0`), and the `gh` CLI is not installed. So issues, PRs, CI run history and coverage numbers were **not** checked.
> - Wiki pages linked from the README were not reviewed.

Evidence links use this permalink base:
`https://github.com/aelassas/bookcars/blob/45bdbbff1e01226eba42856e0a69d0bdd3338801/<path>`

---

## 1. Executive summary

**Recommendation: build the platform from scratch on the stack already chosen in `CLAUDE.md`. Use BookCars as a reference implementation for a few specific patterns, not as a codebase to extend.**

Confidence: **High** for the direction. Medium for the effort comparison, because nothing was executed.

Why:

1. **Different platform at the foundation.** BookCars is MongoDB/Mongoose + Express 5 + React/MUI (Vite) + Expo. This project's rules require PostgreSQL + Prisma + NestJS + Next.js + Tailwind/shadcn (`CLAUDE.md` → Technology Stack, Database Rules). Extending BookCars means either dropping those rules or replacing the data layer, the API framework and the UI kit. That replacement *is* a rewrite.
2. **The core marketplace concept doesn't exist.** BookCars has no independent-driver entity, no driver calendar, no vehicle+driver booking, and no driver earnings. The field named `Booking.driver` is the **customer who drives the car**, not a hired driver (`backend/src/models/Booking.ts`, `driver: ref 'User'`). `AdditionalDriver` is a name, email, phone and birth date for a second renter. Our main feature would be new code that collides with existing names everywhere.
3. **Money handling conflicts with our financial rules.** Prices are JS `Number` floats (`Booking.price`, `Car.dailyPrice`, etc.). There is no commission, payout or ledger code anywhere in `backend/src`. Deleting a car or supplier **hard-deletes their bookings** (`carController.ts:450`, `supplierController.ts:216`). That breaks "all booking and financial changes must be auditable" and "never delete financial transactions".
4. **Overlap protection is good but opt-in and single-resource.** `saveBookingsWithAvailability` is a thoughtful design, with a transaction and a version bump on the car to force write conflicts, and it has a concurrency test. But it only applies when a car has `blockOnPay = true`. On a standalone MongoDB it falls back to an **in-process** lock that doesn't protect more than one server instance. It has no idea of a second resource (a driver) that must be reserved atomically with the car.

What BookCars does well and is worth studying: server-side price recomputation at checkout, checks that the paid amount matches the expected amount (Stripe and PayPal), automatic refund when a booking conflicts after payment, signed httpOnly SameSite=strict cookies, rate-limiting, i18n (9 languages), a large backend Jest suite (~14.6k lines), and an MIT license.

---

## 2. Repository identity and license

| Item | Finding | Label |
|---|---|---|
| License | MIT, "Copyright (c) 2023-2025 Akram El Assas" (`LICENSE`) | Verified |
| Third-party licenses | `backend/__tests__/licenses/` folder exists; per-dependency audit not done | Partially verified |
| Package manager | npm, with a separate `package-lock.json` per app (root, backend, frontend, admin, mobile). Not pnpm workspaces | Verified |
| Node engines | No `engines` field in any manifest; CI uses `lts/*` (`.github/workflows/test.yml`) | Verified |
| Default branch | `main` | Verified |
| Repo activity, open issues, stars | Not checked (API rate limit) | Unknown |

The MIT license allows commercial reuse with attribution. If any BookCars code is ever copied, keep its notice (see `LICENSE-NOTICE.md`).

---

## 3. Architecture and repository map

```
backend/    Express 5 + Mongoose 9 REST API, Jest tests (backend/__tests__)
frontend/   Customer web: React 19 + MUI 7 + Vite, Stripe/PayPal SDKs, Leaflet maps
admin/      Admin + supplier web: React 19 + MUI 7 + Vite
mobile/     Customer app: Expo 58 / React Native 0.88, expo-router, Stripe RN
packages/   bookcars-types, bookcars-helper (pricing), currency-converter,
            reactjs-social-login, disable-react-devtools
__scripts/, __services/, docker-compose*.yml, .github/workflows/ (build, test,
            containerize, releases, ...)
```

Backend layering: `routes/ → controllers/ → models/` with some `utils/` helpers. **Business logic lives in controllers**: `bookingController.ts` is 1,624 lines, `userController.ts` 2,413, `carController.ts` 1,310. There's no service or domain layer. This conflicts with "Keep business logic out of controllers" (`CLAUDE.md`).

Roles: `UserType = Admin | Supplier | User` (`packages/bookcars-types/index.ts`). No owner-vs-company split, no driver role, no support-staff role, and no permission model beyond the three types.

---

## 4. Booking lifecycle trace

| Step | Where | Notes | Label |
|---|---|---|---|
| Checkout entry | `routes/bookingRoutes.ts` → `checkout` with `verifyTokenOptional` + `rateLimiter` | Guests can check out; a temporary unverified user is created | Verified |
| Customer age check | `bookingController.ts:396-403` (`carObj.minimumAge` vs `birthDate`) | Server-side | Verified |
| Driving-license enforcement | License file upload handled at `bookingController.ts:549-569`. `licenseRequired` is stored on the supplier (`supplierController.ts:124`, `userController.ts:1317`) | **No server-side check of `licenseRequired` found in checkout** | Partially verified |
| Price | `bookcarsHelper.calculateTotalPrice(...)` recomputed server-side (`bookingController.ts:336`, assigned at `:619`) | Doesn't trust the client price. Uses floats and server-local `setHours(0,0,0,0)` (timezone risk) | Verified |
| Payment verification | Stripe: amount/currency compared to expected (`bookingController.ts:487-504`, `stripeController.ts:156-167`). PayPal: server-derived amount (`paypalController.ts:77-78`, `:131-155`) | **No webhook handler found** (no `constructEvent`/`stripe-signature` in `backend/src`). Confirmation depends on client-driven "check session" calls | Verified |
| Reservation | `utils/bookingReservationHelper.ts` → `saveBookingsWithAvailability` | See §5 | Verified |
| Temporary bookings | `Booking.expireAt` TTL index: unpaid Stripe checkout bookings are **auto-deleted** by MongoDB | Unpaid attempts leave no history | Verified |
| Statuses | `Void, Pending, Deposit, Paid, PaidInFull, Reserved, Cancelled` | Payment state and booking state are mixed into one enum. No Confirmed/Active/Completed/NoShow. No status history | Verified |
| Cancellation | `cancelBooking` sets a `cancelRequest` flag (owner/supplier/admin check at `:1585-1590`) | No fee or refund calculation, no policy engine | Verified |
| Deletion | `deleteBookings` → `booking.deleteOne()` (`bookingController.ts:~1123`). Car delete → `Booking.deleteMany({ car })` (`carController.ts:450`). Supplier delete → `Booking.deleteMany({ supplier })` (`supplierController.ts:216`) | **Hard deletes of booking records** | Verified |

---

## 5. Concurrency and availability

`backend/src/utils/bookingReservationHelper.ts`:

- Reserving statuses are `Deposit, Paid, PaidInFull, Reserved`, plus an unexpired `Void` (lines 12-33).
- In a transaction, the car's `bookingReservationVersion` is incremented (lines 104-109). This forces concurrent transactions on the same car to conflict. Then it looks for overlaps with `from < to && to > from` (lines 130-139).
- **The overlap check only runs when `car.blockOnPay` is true** (lines 117-127). With `blockOnPay = false`, overlapping bookings are allowed on purpose (the README confirms this is a feature).
- If MongoDB is a standalone server, which has no transactions, it uses `carLocks`, an in-memory `Map` (lines 39-64, 176-182). That only works within a single Node process.
- Test: `backend/__tests__/booking.test.ts:244-347` ("booking reservation concurrency"), using `Promise.allSettled`. **Not executed in this audit.**

Compared with our rules:

| Rule | Status |
|---|---|
| BR-07 no overlapping vehicle reservations | Partially (opt-in per car; safe only on a replica set or a single instance) |
| BR-08 no overlapping driver assignments | Not found (no driver resource) |
| BR-09 vehicle and driver reserved together | Not found |
| BR-17 concurrency-safe | Partially (good design for one resource; no database-level constraint) |

In PostgreSQL, the equivalent protection is an exclusion constraint on `tstzrange` per resource. That's stronger and simpler than this helper.

---

## 6. Feature compatibility summary

See the full matrix in [`compatibility-matrix.md`](compatibility-matrix.md). In short:

- **Reusable as ideas:** search and filter UX, the pricing algorithm (hourly/daily/weekly/monthly/date-based), Stripe/PayPal amount verification, refund on conflict, auth cookie handling, i18n structure.
- **Present but needs invasive change:** roles, booking model, statuses, cancellation, money types, deletion behavior, controller-centric layering.
- **Not present (driver marketplace and finance):** driver registration/verification/profile, driver calendar, service areas, recommendation/ranking, driver selection, combined booking, trip lifecycle, commission, earnings ledger, payouts, owner-vs-company providers, vehicle/provider verification workflow, reviews (only a static `Car.rating` number), disputes, maintenance, pickup/return inspections, audit log.

---

## 7. Security and quality notes

| Area | Finding | Label |
|---|---|---|
| Auth cookies | `httpOnly`, `signed`, `secure` (when HTTPS), `sameSite: 'strict'` (`config/env.config.ts:192`) | Verified |
| Password hashing | `bcrypt` dependency (`backend/package.json`) | Partially verified (usage not traced) |
| Rate limiting | `middlewares/rateLimiter.ts`, applied to signup and checkout | Verified |
| Ownership checks | Car update/delete check `car.supplier === session user` (`carController.ts:197`, `:431`). Booking get/cancel check owner/supplier/admin (`bookingController.ts:1218-1223`, `:1585-1590`) | Verified (not exhaustive across all routes) |
| Unauthenticated delete | `DELETE deleteTempBooking/:bookingId/:sessionId` has no auth middleware (`bookingRoutes.ts`). It's guarded by needing both IDs plus `status: Void` and `expireAt != null` (`bookingController.ts:1148-1163`) | Verified. Low risk by design, but worth noting |
| Payment webhooks | None found. Relies on the client calling check endpoints; no idempotency key for webhook replays | Verified (absence) |
| Money type | `Number` (IEEE float) throughout models and the helper | Verified |
| Timezones | Date math with `setHours` (server-local) in `packages/bookcars-helper/index.ts:289-312` | Verified |
| Audit trail | No audit/history collection; booking status has no history | Verified (absence) |
| Tests | ~14.6k lines of backend Jest tests (`backend/__tests__`), including booking, stripe, paypal, pricing and concurrency. No frontend/admin/mobile tests found at top level. **Not run** | Partially verified |
| CI | `test.yml` runs on push to `main` only (`pull_request` is commented out), with a Redis service | Verified |
| Dependency vulnerabilities | Not assessed (no `npm audit` run, per audit rules) | Unknown |

---

## 8. Extend vs. rebuild

| Option | Benefits | Costs / risks | Unknowns |
|---|---|---|---|
| **A. Extend BookCars** | Working customer, admin and mobile UIs. Payments, i18n and email already wired. MIT | Violates the mandated stack (Mongo, Express, MUI). The driver marketplace, ledger, commissions, payouts, audit history and provider types are all new. Booking model, statuses, money types and hard deletes need **invasive** refactors. `driver` naming collision. Ongoing upstream merges would conflict with those refactors | Real test pass rate; upstream merge cadence |
| **B. Build from scratch** (recommended) | Domain model designed for two resources (vehicle + driver) from day one. Postgres exclusion constraints, decimal money, ledger, audit log. Follows `CLAUDE.md` exactly. No inherited naming or data-model debt | More upfront work for commodity features (search UI, auth, payments, admin CRUD). No ready-made mobile app | Team velocity on the new stack |
| **C. Fork BookCars as a throwaway prototype** | Fastest clickable demo of self-drive only | Doesn't demonstrate the differentiator (independent driver). Risk the prototype becomes production | Whether a demo is needed before the SRS questions are answered |

**Decision rule applied** (from `README.md`): the important question isn't how much code could be reused, but whether the core domain model fits. Here the core model (booking, roles, money, availability) is what needs to change. So the reusable share is mostly peripheral UI and integration code, which is cheapest to rebuild.

**What would change this recommendation:** if the business drops the `CLAUDE.md` stack requirement *and* MVP drops the driver marketplace *and* a self-drive-only launch is needed in weeks, then Option C or A becomes reasonable for that limited scope.

---

## 9. Staged validation plan (if you want more certainty before committing)

1. Run the BookCars backend tests in a disposable container (no real credentials) and record pass/fail. *Follow-up: needs approval to install/run.*
2. Load-test two simultaneous checkouts for the same car with `blockOnPay = true` on a replica set and on a standalone server to confirm §5.
3. Prototype the greenfield core first: a Postgres schema spike with `tstzrange` exclusion constraints for vehicle **and** driver reservations, plus a concurrency test. This de-risks the main technical bet of Option B within days.
4. Record the decision in `docs/adr/001-extend-vs-rebuild.md` (currently **Proposed**) and mark it Accepted once you agree.

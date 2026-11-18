# BookCars compatibility matrix

Fill this using verified source evidence. Do not pre-mark a feature as present
based on marketing copy or documentation alone.

**Audited commit:** `aelassas/bookcars@45bdbbff1e01226eba42856e0a69d0bdd3338801` (2026-11-18), static source reading only, **tests not run**. Paths are relative to that repo. Details are in [`bookcars-audit.md`](bookcars-audit.md).

| Capability | Status | Evidence (path/symbol/test) | Gap / risk | Effort |
|---|---|---|---|---|
| Customer accounts/auth | Supported and tested | `backend/src/controllers/userController.ts` (signup/signIn), `config/env.config.ts:192` cookie options, `__tests__/user.test.ts` | Social login via local package; JWT in signed cookie. Stack mismatch (Express) | Rebuild (Low–Med) |
| Supplier onboarding | Implemented, incomplete | Suppliers are `User` with `type: supplier`; admin/supplier create users (`routes/userRoutes.ts:13`) | No self-registration with document verification; no owner vs. company distinction | Invasive refactor |
| Supplier roles/permissions | Implemented, incomplete | `UserType = Admin \| Supplier \| User` (`packages/bookcars-types/index.ts`); `middlewares/authJwt.ts` (`authSupplier`, `authAdmin`) | No RBAC/permissions, no support role, no driver role | Invasive refactor |
| Vehicle/fleet management | Supported and tested | `models/Car.ts`, `controllers/carController.ts`, `__tests__/car.test.ts` | No vehicle documents or admin approval workflow; float prices | Isolated extension (concept), rebuild on stack |
| Vehicle availability | Implemented, incomplete | `Car.available`, `Car.blockOnPay`, `utils/bookingReservationHelper.ts` | No calendar blocks for maintenance/personal use; overlap check opt-in | Invasive refactor |
| Pricing and quote calculation | Supported and tested | `packages/bookcars-helper/index.ts:279` `calculateTotalPrice`; `__tests__/pricing.test.ts` | Floats; server-local time; no tax/platform fee/driver charge lines; no quote snapshot | Rebuild using as reference |
| Search and filtering | Supported (tests not checked per filter) | `carController.ts` (`getFrontendCars` etc.), `Car` compound index (`models/Car.ts:228`) | No rental-type / with-driver filter | Rebuild (Low–Med) |
| Booking lifecycle | Implemented, incomplete | `models/Booking.ts` status enum; `bookingController.ts` checkout/update/cancel | Payment + booking status mixed; no history; hard deletes; cancellation is a flag only | Invasive refactor |
| Concurrent booking protection | Implemented, incomplete (test present) | `bookingReservationHelper.ts:66-183`; `__tests__/booking.test.ts:244-347` | Only when `blockOnPay`; in-process lock fallback on standalone Mongo; single resource | Invasive refactor |
| Self-drive flow | Implemented, incomplete | Checkout age check `bookingController.ts:396-403`; license upload `:549-569` | `licenseRequired` not enforced server-side at checkout (no reference found) | Isolated extension |
| Vehicle + independent driver flow | Not found | Searched `chauffeur`, `with driver`, `hire driver` in backend/frontend/admin/packages: no hits. `Booking.driver` = renter | Core differentiator absent | New build |
| Independent driver onboarding | Not found | No driver model/role | — | New build |
| Driver verification/qualification | Not found | — | — | New build |
| Driver availability calendar | Not found | — | — | New build |
| Driver recommendation/ranking | Not found | — | — | New build |
| Customer driver selection | Not found | — | — | New build |
| Driver earnings/commission | Not found | `grep commission\|payout\|ledger` in `backend/src`: no matches | — | New build |
| Driver payouts/reconciliation | Not found | `models/BankDetails.ts` is a single platform bank-details record for display, not payouts | — | New build |
| Payments/webhooks/refunds | Implemented, incomplete (tests present) | `payment/stripe.ts`, `payment/paypal.ts`, `stripeController.ts:156-167`, `paypalController.ts:131-155`; refund on conflict `stripeController.ts:254`, `paypalController.ts:248`; `__tests__/stripe.test.ts`, `paypal.test.ts` | No webhook endpoint or signature verification; no general refund/cancellation refund; no ledger | Invasive refactor |
| Admin and operations | Implemented, incomplete | `admin/` app (React + MUI) | No verification queues, disputes, maintenance, inspections, payouts, finance dashboard | Rebuild |
| Notifications | Implemented, incomplete | `models/Notification.ts`, `utils/mailHelper.ts` (nodemailer), `expo-server-sdk` push | No SMS; no driver notifications | Rebuild (Low) |
| Mobile apps | Implemented (customer only) | `mobile/app/(screens)/` — cars, checkout, bookings, sign-in, etc. | No driver or provider app | Out of MVP scope per SRS §20 Phase 8 |
| Tests/CI/deployment | Implemented, incomplete | `.github/workflows/test.yml` (push to main only), `docker-compose.yml`, Dockerfiles per app, `__scripts/bc-deploy*.sh` | Tests not run here; no frontend tests found; PR CI disabled | — |
| Security/tenant isolation | Implemented, incomplete | Ownership checks `carController.ts:197,431`, `bookingController.ts:1218-1223,1585-1590`; rate limiter | Hard deletes of bookings; no audit log; unauthenticated temp-booking delete (guarded by IDs) | Rebuild with audit log |

## Status definitions
- **Supported and tested:** implementation and relevant tests found.
- **Implemented, incomplete:** code exists but workflow or edge cases are missing.
- **Configurable:** can be achieved through documented configuration.
- **Isolated extension:** new module or bounded integration appears feasible.
- **Invasive refactor:** core model or workflow needs substantial change.
- **Not found:** searched relevant areas; no implementation found.
- **Unknown:** not enough evidence to conclude.

Note: "tested" means a relevant test file exists in source; tests were **not executed** in this audit.

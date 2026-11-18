# Requirements analysis: Hybrid Car Rental & Driver Marketplace

- **Status:** Draft for product-owner review
- **Date:** 2026-11-18
- **Source analysed:** `docs/requirements/SRS.md` v1.0 "Initial Requirements Draft" (1,747 lines, all 23 sections read). Cross-checked against `CLAUDE.md`, `.claude/rules/*`, `docs/requirements/business-model.md`, `docs/requirements/acceptance-criteria.md`, `docs/architecture/*` and the BookCars audit (`docs/audit/bookcars-audit.md`).
- **The SRS was not modified.** This document only analyses it.

## How to read this document

Each statement uses one of these labels:

| Label | Meaning |
|---|---|
| **[Confirmed]** | Stated in the SRS. The § reference is given. |
| **[Workspace rule]** | Stated in `CLAUDE.md` or `.claude/rules/`, not in the SRS. |
| **[Assumption]** | Not stated anywhere. Inferred to make analysis possible, and must be confirmed. |
| **[Recommendation]** | My suggestion. Not a requirement until you accept it. |
| **[Gap]** / **[Ambiguity]** / **[Contradiction]** | An issue that needs a decision. |

Section 11 holds the prioritized list of questions to answer before architecture is finalized.

---

## 1. Executive summary

- The SRS is **strong on business intent and feature breadth**: roles, workflows, 18 business rules, an MVP list, and its own list of open decisions (§22).
- It is **not yet sufficient for booking, pricing and finance database design**. The biggest blockers are:
  1. **How money flows.** Who collects payment, whether the platform is merchant of record, cash handling, and payout timing.
  2. **The order of approval, payment and confirmation.** When the customer is charged relative to owner and driver acceptance, and how long resources are held meanwhile.
  3. **What a driver's "service period" means for multi-day rentals.** For example, does a 3-day WITH_DRIVER rental mean the driver is booked for 72 continuous hours, or for daily working hours?
  4. **Time granularity.** Hourly vs. daily rentals, buffers between bookings, timezone.
  5. **Launch market.** This drives payment gateway, KYC, tax, currency and privacy law.
- Identity, the vehicle catalog, reviews and notifications are **close to ready** for high-level design.
- The SRS MVP (§21) is large. It is effectively Phases 1–5 plus parts of 6–7. Several MVP items depend on features the MVP list leaves out (refunds, deposits, minimal pickup/return). See §8.
- I found **9 contradictions or tensions** and **30+ gaps**. None of them invalidate the business model.

---

## 2. Business model (as understood)

**[Confirmed]** Three supply/demand components (§23):

1. **Vehicle supply** comes from rental companies (§2.1) and individual owners (§2.2). Both list, price and manage availability for vehicles. Neither supplies drivers (§2.1, §2.2, §6.2, BR-04).
2. **Driver supply** comes from independent professional drivers (§2.3). They don't need a vehicle, can drive any provider's vehicle, set or select platform-approved rates, accept or reject requests, and request payouts.
3. **Customer demand.** Customers book either SELF_DRIVE or WITH_DRIVER (§1.1, BR-03).

**[Confirmed] Revenue:** rental commissions, driver-service commissions, and "other configurable fees" (§1.2, §10.3, BR-12).

**[Confirmed] Key differentiator:** the customer rents a vehicle from any provider and **independently chooses** a driver (§23).

**[Confirmed] The platform manages:** listings, registrations, bookings, availability, payments, commissions, customer verification, rental operations and analytics (§1.1).

---

## 3. Roles

| Role | Core capabilities | SRS ref | Notes |
|---|---|---|---|
| Customer / Renter | Search, choose mode, choose driver, book, pay, cancel/modify, upload ID/license, review | §3.1 | [Ambiguity] Whether ID/license is needed for WITH_DRIVER isn't stated |
| Rental company | Company profile, docs, vehicles, pricing, availability, accept/reject, pickup/return, maintenance, earnings, reports | §2.1, §3.2 | [Gap] Multiple staff users per company isn't mentioned |
| Individual owner | Same as company minus reports; chooses instant vs. manual approval | §2.2, §3.3 | [Ambiguity] §2.2 gives owners the approval choice. §3.2 doesn't say companies get it, though §7.3 implies they do |
| Independent driver | Register, docs, profile, service areas, schedule, rates, accept/reject, trips, earnings, ratings, withdrawals | §2.3, §3.4 | |
| Platform admin | Everything, including verification, commissions, refunds, disputes, payouts, policies, promotions | §3.5 | |
| Support / operations | Complaints, booking help, cancellations, pickup coordination, disputes, escalation | §3.6 | **[Confirmed] "Optional"**. Permissions "configurable through RBAC" |

**[Gap]** Can one person hold several roles? For example, an owner who is also a driver, or a driver who rents as a customer. The SRS suggests `user_roles` (§16.1), which implies yes, but never says so. This affects identity design, conflict-of-interest rules (can a driver be booked to drive their own car?) and payouts.

---

## 4. Core workflows (confirmed)

### 4.1 Booking (§7.1, 16 steps)
Search → select vehicle → choose mode → (SELF_DRIVE: license/ID verification) or (WITH_DRIVER: recommendations → select driver) → availability check → price → review → accept T&Cs → pay → confirm per approval/payment rules → notification.

### 4.2 Approval (§7.3)
- Instant booking: confirmed once payment and validation complete.
- Owner approval: provider accepts or rejects.
- WITH_DRIVER: the driver must also accept "if the selected driver uses an acceptance-based workflow".
- **[Confirmed]** "Must not mark a booking fully confirmed until all required confirmations are obtained."

### 4.3 Modification (§7.4)
Dates, locations, driver and duration can change. Each change triggers availability re-checks and price recalculation.

### 4.4 Cancellation (§7.5)
Customer, owner, company, driver or admin can cancel. Fees, refund, provider compensation and driver compensation are computed from configurable rules. Every cancellation is recorded.

### 4.5 Driver unavailable (§5.4, §8.4, BR-18)
Notify the customer, show alternatives, recalculate, revalidate. The customer may switch vehicle or switch to self-drive (if eligible). The vehicle reservation is kept during replacement (BR-18).

### 4.6 Pickup → return → statement (§11.1–11.3)
Handover report, return inspection, late and mileage charges, final statement. For drivers: arrival → start → complete, with timestamps.

---

## 5. Confirmed requirements (consolidated)

Grouped by domain. Each line cites the SRS. This is a checklist for design; it adds nothing to the SRS.

**Identity and verification**
- R-ID-1 Registration and login for all roles (§3.x). Password hashing, RBAC, audit logging (§18.1).
- R-ID-2 Company, owner and driver registrations and documents need admin verification. Drivers stay pending until verified (§3.5, §5.1, §14.2).
- R-ID-3 Self-drive requires identity and driving-license verification, a minimum age, and T&C acceptance (§4.5A, BR-10).
- R-ID-4 Sensitive documents are never public. Driver profiles show license **category**, not the number (§5.2, §18.6).
- R-ID-5 Driver/customer information is shared only when needed for an assigned booking (§3.4, §18.6).

**Vehicle catalog and availability**
- R-VH-1 Two ownership types: company and individual (§6, BR-01).
- R-VH-2 Vehicle fields and documents as listed (§6.1). Only admin-approved vehicles are published (§6.4, BR-13).
- R-VH-3 Per-vehicle configuration: self-drive allowed, with-driver allowed, daily/weekly/monthly rates, deposit, mileage, fuel policy, min/max duration, pickup/return locations, cancellation rules (§6.2).
- R-VH-4 Calendar blocks for personal use and maintenance. Confirmed bookings block automatically (§6.3, §15.1).
- R-VH-5 No overlapping confirmed vehicle reservations (BR-07).

**Driver marketplace**
- R-DR-1 Registration fields and documents (§5.1). Public profile with performance stats (§5.2).
- R-DR-2 Availability: on/off status, weekly schedule, date-specific exceptions, leave, service areas, automatic blocking (§5.3).
- R-DR-3 No overlapping confirmed driver assignments (§5.3, BR-08).
- R-DR-4 Ranked recommendations using 10 listed factors. Recommendations are suggestions, and the customer chooses (§5.4, BR-05, BR-06).
- R-DR-5 Performance score uses configurable rules, not ratings alone. Admin can suspend and reinstate (§5.5).

**Booking**
- R-BK-1 Exactly one mode per booking (BR-03).
- R-BK-2 WITH_DRIVER is confirmed only when vehicle and driver are both available (BR-09, §8.3).
- R-BK-3 Concurrency-safe availability and creation (BR-17, §18.3).
- R-BK-4 Booking data fields as in §7.2.
- R-BK-5 Configurable approval (§7.3). Configurable cancellation policy (§7.5, BR-16).
- R-BK-6 Status changes recorded (BR-14). Cancellations recorded (§7.5).
- R-BK-7 Driver replacement keeps the vehicle reservation (BR-18).

**Pricing**
- R-PR-1 Separate vehicle and driver pricing (§9). Vehicle supports hourly (if supported), daily, weekly, monthly, seasonal, weekend, long-term discount, mileage, delivery, deposit (§9.1).
- R-PR-2 Driver pricing models: hour, day, trip, km, package, long-distance, all within platform rules (§9.2).
- R-PR-3 Total formulas as in §9.3. The deposit is shown separately and is not revenue (§9.3, `CLAUDE.md`).
- R-PR-4 Full transparency before payment, with no charges added later (§9.4).

**Payments and finance**
- R-FN-1 Configurable payment methods per market (§10.1). Full, partial and advance payment, deposit, extra charges, refunds, invoices (§10.2).
- R-FN-2 Separate commission configuration per service type and provider type, as percentage or fixed (§10.3, BR-12).
- R-FN-3 Separate financial records: vehicle revenue, provider earnings, driver revenue, driver earnings, commission, taxes, gateway fees, refunds (§10.4, BR-11, BR-15).
- R-FN-4 Payouts: provider views and requests; admin approves, rejects and processes (§10.5).
- R-FN-5 [Workspace rule] Decimal-safe money, immutable ledger, reversal entries, backend payment verification, idempotent webhooks (`CLAUDE.md`, `database.md`, `security.md`).

**Operations, reviews, notifications, admin**
- R-OP-1 Pickup and return records, digital handover report, final statement (§11). Driver trip state with timestamps (§11.3).
- R-OP-2 Reviews for vehicle, driver and provider. Only completed bookings, no duplicates, moderation, automatic aggregation (§12).
- R-OP-3 Notification events per role (§13.1–13.3). Channels: in-app, email, SMS, push, optional messaging (§13.4).
- R-OP-4 Admin dashboards and configuration (§14). Disputes (§15.2), emergency support (§15.3), GPS later and only with consent (§15.4).

**Non-functional (§18)**
Pagination, background notification processing, image optimization, backups, error logging, booking recovery, responsive and accessible UI, privacy compliance.

---

## 6. Contradictions and tensions

| # | Issue | Where | Why it matters | Suggested resolution |
|---|---|---|---|---|
| C1 | "Do not provide drivers" vs. "not **required** to supply drivers" | §2.1 and `CLAUDE.md` say companies don't provide drivers (a prohibition). BR-04 and §6.2 say they are "not required" to (permissive) | Decides whether a company's employee may register as an independent driver, and whether a company can steer bookings to its own staff | Decide explicitly. [Recommendation] Allow anyone to register as an independent driver, but forbid company-assigned drivers |
| C2 | Choose from **recommended** drivers vs. any **eligible** driver | BR-05 says from "recommended drivers". §5.4 says "freedom to choose from the available eligible drivers" | Is the recommendation a *ranking of all eligible drivers* or a *shortlist*? | [Recommendation] A ranked list of all eligible drivers, with the top N highlighted |
| C3 | Driver acceptance is per-driver optional vs. always | §7.3 says "if the selected driver uses an acceptance-based workflow". §2.3 and §3.4 say drivers accept or reject. §22 Q4 says it's undecided | Drives the booking state machine and how long the vehicle is held | Answer §22 Q4 (see Q5 below) |
| C4 | Driver unavailable **before** vs. **after** confirmation | §5.4 covers before confirmation. BR-18 and §22 Q6 cover after. §8.4 doesn't say | Different flows: pre-confirmation re-selection vs. post-confirmation replacement with a possible price change and refund | Define both flows separately |
| C5 | Switching WITH_DRIVER → SELF_DRIVE | §8.4 allows it. BR-03 says one mode per booking | Is it a modification of the same booking (mode changes) or cancel + rebook? Affects audit, pricing and deposit (self-drive may need a deposit that with-driver doesn't) | Decide. [Recommendation] Treat as a modification with full revalidation and a recorded mode change |
| C6 | Push notifications in scope vs. mobile apps deferred | §13.4 lists push. §20 Phase 8 defers mobile apps | Web push or nothing for MVP? | Decide the MVP channel set |
| C7 | Cash payments vs. platform commission and payout model | §10.1 says "Cash payments, if enabled". §10.3–10.5 assume the platform holds the funds | With cash, the provider holds the money and the platform must *collect* commission. That reverses the payout ledger | Decide whether cash is in MVP |
| C8 | Pricing granularity | §2.2 says owners set daily/weekly/monthly. §9.1 adds hourly "if supported". §4.3 filters have no hourly. §22 Q2 is open | Data model for rates and availability granularity | Answer Q7 |
| C9 | SRS §16 entity list vs. a single vehicle/driver per booking | §16.5 lists `booking_vehicles` and `booking_drivers` join tables, which implies several of each per booking. Everything else implies one vehicle and at most one driver | Schema cardinality | Confirm one vehicle and ≤ 1 driver per booking (or not). Join tables may still be useful for **history** of driver replacements |

---

## 7. Missing requirements and ambiguities

### 7.1 Booking, availability and time
- **G1. Driver service period [Gap, critical].** §8.3 says the driver must be available "for the entire required service period". §8.2 says to check "working hours". For a multi-day rental: is the driver on duty 24 hours, during set daily hours, or only for specific trips? Who pays for the driver's overnight accommodation, meals and return travel? §22 Q13 only partly asks this.
- **G2. Where the driver starts.** Does the driver meet the customer at the vehicle pickup location, go to the provider, or go to a customer address? This affects matching by service area and the trip state machine.
- **G3. Holds.** How long are the vehicle and driver held while waiting for payment, owner approval or driver acceptance? What happens when a hold expires? (Domain rule: "Recommendations do not reserve resources.")
- **G4. Buffers.** Turnaround or cleaning time between vehicle bookings, and rest time between driver assignments. Not mentioned.
- **G5. Time and timezone.** Minimum time unit (hour, day). How a "day" is counted (24h vs. calendar day). Grace period for late returns. Timezone of the operating area. (Workspace rule: store UTC.)
- **G6. Approval timeouts.** What happens if an owner or driver doesn't respond? Auto-reject, auto-accept, or escalate?
- **G7. Search for WITH_DRIVER.** §4.3 has a "car-with-driver availability" filter. Does search show only vehicles for which an eligible driver exists in that period? That's expensive. Or only vehicles that *allow* with-driver mode?
- **G8. Booking lead time and maximum advance booking window.**
- **G9. Driver suspended or document expiring mid-booking.** Do existing confirmed bookings get re-validated?
- **G10. Partial completion and early return.** Refund rules aren't defined.
- **G11. No-show.** Customer no-show, driver no-show and provider no-show are not defined (`domain.md` asks for this).

### 7.2 Money
- **G12. Merchant of record and fund flow.** Does the platform collect everything and pay providers and drivers (escrow-like)? Or do providers or drivers get paid directly (§22 Q9)? Is the platform licensed to hold funds in the launch market?
- **G13. When the charge happens.** Authorize at request and capture on acceptance, charge immediately and refund on rejection, or charge after acceptance?
- **G14. Deposit mechanics.** Pre-authorization hold or actual charge? Refund timing? Deductions after inspection, and the dispute window? Is a deposit required for WITH_DRIVER (§22 Q8)?
- **G15. Who pays fees.** Platform fee to customer, commission from provider, or both (§9.3 "Applicable Fees", §9.4 "if charged to customers")? Who absorbs gateway fees (§10.4 lists them)?
- **G16. Tax.** Which taxes, inclusive or exclusive, applied to commission or to the gross amount, and invoice legal requirements.
- **G17. Payout rules.** Schedule (on completion, after a holding period, weekly), minimum amount, payout methods, negative balances (for example, a damage deduction after a payout already went out).
- **G18. Price changes on modification.** How the extra amount is collected and how decreases are refunded.
- **G19. Currency.** One currency for MVP? Currency of driver vs. vehicle pricing?
- **G20. Promotions and discounts.** Who funds a discount (platform, provider or driver), and how it affects commission.

### 7.3 Identity, trust and safety
- **G21. Verification method.** Manual admin review, or a KYC provider? Background checks for drivers?
- **G22. When customer verification happens.** At registration, before booking, or before pickup? Is it a blocking step at checkout?
- **G23. Does a WITH_DRIVER customer need identity verification?** (Probably yes for safety; not stated.)
- **G24. Document expiry tracking** for licenses, insurance and fitness certificates, with automatic delisting.
- **G25. Insurance responsibility.** Especially when an independent driver drives a provider's car (§22 Q11). This is a legal and contractual question with data-model impact (policy records, liability attribution in damage disputes).
- **G26. Contract parties** (`business-model.md` Q2). Who contracts with the customer: the platform, the provider, the driver, or several?
- **G27. Can a customer bring their own driver?** (`business-model.md` Q5.) Would that be a third mode, or SELF_DRIVE with an additional driver?

### 7.4 Other
- **G28. Performance score formula and recommendation weights** are "configurable" (§5.5) but no initial defaults or fairness rules exist (for example, cold start for new drivers).
- **G29. Reviews.** Review window, editing, whether providers can reply, and whether drivers or providers rate customers.
- **G30. Messaging** between customer, provider and driver (§3.1 says "communicate with support"; §13.4 lists "optional messaging"). Phone number masking?
- **G31. Data retention and deletion** (privacy law vs. financial audit retention).
- **G32. Languages, accessibility level** (for example WCAG 2.1 AA), **supported browsers**.
- **G33. Measurable non-functional targets.** "Fast vehicle search" has no target (for example p95 < 500 ms), and there's no RPO/RTO for backups or uptime target.
- **G34. Company sub-accounts.** Staff users under a rental company with limited permissions.
- **G36. Business Partners role [Gap].** The client's existing site (vehicle-rental-management-system.b12sites.com) shows a "Business partners" programme: businesses that "bring your customers", "arrange bookings for guests and earn on referred reservations". This role is **not in the SRS**. The public site shows it as "coming soon" only; no data model has been designed for it.
- **G35. Branding.** The client's existing site uses the name "KAIYA Rentals". Is that the product name? See `docs/design/style-reference.md`.

---

## 8. MVP vs. future

### 8.1 MVP baseline [Confirmed, §21]
Customer: registration/login, search, details, self-drive, with-driver, driver recommendations and selection, booking, payment, history, cancellation.
Providers: company and owner registration, verification, listing, pricing, availability, booking approval, history, earnings overview.
Drivers: registration, document verification, profiles, availability, pricing, booking requests, trip management, earnings overview, ratings and reviews.
Admin: dashboard, user verification, provider management, vehicle and driver approval, booking management, payment monitoring, commission configuration, basic reporting.

### 8.2 Hidden MVP dependencies [Gap]
The MVP list implies these, but they aren't listed:

| Implied by | Needs | SRS phase |
|---|---|---|
| Cancellation | Cancellation policy and **refunds** | Phase 5 |
| Self-drive | **Security deposit** handling and license verification | Phase 5 / Phase 1 |
| Earnings overview | Commission calculation and earnings ledger. **Payouts** themselves aren't listed: how do providers and drivers get paid in MVP? | Phase 5 |
| Trip management | Minimal pickup/return records, at least start and end timestamps | Phase 6 |
| Driver ratings and reviews | Customer review submission (not listed under Customer) | — |
| Booking approval | Notifications, at least email | — |
| BR-14 (workspace audit rule) | Audit log and booking status history | — |

### 8.3 Future [Confirmed, §20 Phase 8 and §21 last line]
GPS and live location, advanced recommendation algorithms, promotional campaigns, loyalty, mobile apps, advanced/predictive analytics.

### 8.4 [Recommendation] Candidates to defer out of MVP
Not decided. These are for you to consider, to reduce MVP risk:
- Hourly rentals (keep daily/weekly/monthly).
- Per-km, package and long-distance driver pricing (keep per-day or per-hour).
- Instant booking for individual owners (keep approval-only first, or the reverse).
- Maintenance management (§15.1) beyond simple calendar blocks.
- Disputes (§15.2) as a full workflow. Use support tickets plus admin notes first.
- SMS and push. Use email plus in-app first.
- Partial or advance payments and cash.
- Support-staff role (§3.6 is already "optional").
- Multi-currency and multi-language.

---

## 9. Technical risks

| Risk | Why | Mitigation [Recommendation] |
|---|---|---|
| Double booking under concurrency (two resources) | BR-07/08/09/17. A WITH_DRIVER booking must lock the vehicle **and** the driver atomically | PostgreSQL `EXCLUDE USING gist` on `tstzrange` per vehicle and per driver, inside one transaction. Concurrency tests. Prisma needs raw SQL migrations for exclusion constraints (verify this in a spike) |
| Approval and payment sequencing | Holding funds while waiting on two independent approvers. Expiry and refunds | Explicit booking state machine and hold expiry job. Decide G13 first |
| Money correctness | Multi-party split, refunds, deductions after payout | Double-entry ledger with immutable entries and reversals. Decimal types. Reconciliation reports |
| Payment provider fit | Launch market unknown. Marketplace split payments need a capable provider (or manual payouts) | Answer Q1/Q2 before choosing a gateway |
| KYC and document privacy | IDs and licenses are highly sensitive | Private object storage, signed short-lived URLs, access logging, retention policy |
| Recommendation fairness and gaming | Ratings-based ranking disadvantages new drivers and invites manipulation | Explainable scoring, cold-start rules, reviews only from completed bookings |
| Driver legal status | Independent contractor rules, licensing for paid driving | Legal review in the launch jurisdiction |
| Scope size | The MVP covers about 5 SRS phases | Vertical slices. Build SELF_DRIVE end-to-end first, then WITH_DRIVER |
| Timezone and date math | Day counting, late fees | UTC storage, an explicit operating timezone, tested pricing functions |

---

## 10. Readiness for architecture and database design

| Area | Ready? | Blocking questions |
|---|---|---|
| Identity and roles | **Mostly** | Q10 (multi-role), Q22 (company sub-accounts) |
| Verification and documents | **Partly** | Q14 (KYC method), Q15 (when verification happens) |
| Vehicle catalog | **Yes** (high level) | Q7 (rate granularity) |
| Vehicle availability | **Partly** | Q7, Q11 (buffers, holds) |
| Driver profiles and availability | **No** | Q4 (service period model), Q8 (start point) |
| Recommendation | **Partly** | Q6 (list semantics). Scoring defaults can come later |
| Booking state machine | **No** | Q3 (payment vs. approval order), Q5 (driver acceptance), Q11 (holds/timeouts), Q12 (mode switch) |
| Pricing | **No** | Q7, Q9 (driver pricing), Q16 (fees), Q17 (tax) |
| Payments, ledger and payouts | **No** | Q1, Q2, Q3, Q13 (deposit), Q18 (payout rules), Q19 (cash) |
| Reviews | **Yes** | — |
| Notifications | **Mostly** | Q21 (MVP channels) |
| Admin and operations | **Mostly** | Depends on the above |

**Verdict:** you can start the overall architecture (modular monolith, modules from `docs/architecture/domain-boundaries.md`, tech stack) now. **Do not finalize the database schema for booking, pricing or finance** until the P0 and P1 questions below are answered.

---

## 11. Review of the workspace and Claude Code instructions

All items below are recommendations. I changed nothing except where noted.

### 11.1 Documentation hygiene
1. `docs/project.md` is a **byte-identical duplicate** of `docs/requirements/SRS.md`. Keep one source of truth. [Recommendation] Delete `docs/project.md`, or replace it with a short pointer.
2. Empty placeholder files: `docs/requirements/PRD.md`, `docs/architecture/system-architecture.md`, `docs/architecture/database-architecture.md`, `docs/database/ERD.md`, `docs/database/data-dictionary.md`. Add a one-line "TBD after Q&A" status so they don't look finished.
3. `command.txt` at the repo root holds working prompts. Move it to `docs/development/prompts.md` or gitignore it.
4. `docs/requirements/business-model.md` overlaps SRS §22 and is labelled a working draft. Once questions are answered, merge its answers into a decisions log, for example `docs/requirements/decisions.md`.
5. `README.md` still describes the workspace as an "audit starter" with the instruction to clone BookCars. Update it after ADR-001 is accepted.

### 11.2 `CLAUDE.md`
6. **Validation library conflict.** `CLAUDE.md` lists **Zod** and "reuse shared validation schemas". `.claude/rules/backend.md` says "Validate input using DTOs and **class-validator**". Pick one. [Recommendation] Zod for shared schemas (web and API), with a Zod-based NestJS validation pipe, so rules aren't duplicated.
7. **Stack fixed vs. SRS "can be finalized"** (SRS §19 says Express *or* NestJS). `CLAUDE.md` has fixed the choice. Record it in an ADR, as the `docs.md` rule requires.
8. Add **money and time conventions** explicitly: currency representation (Decimal(… , …) vs. integer minor units), rounding mode, an operating timezone separate from UTC storage.
9. Add a short **glossary**: Provider (company | owner), Driver (independent), Renter/Customer, Assignment, Hold, Reservation. This prevents the naming collision BookCars has (`driver` = renter).
10. "Use Redis" is in the stack, but `docs/architecture/initial-context.md` says "Redis only where justified". Align them by marking Redis as optional.

### 11.3 `.claude/rules/`
11. `audit.md` assumes a local checkout ("Confirm the checked-out commit"). Add: "If inspecting remotely, pin to a commit SHA and record the method."
12. `frontend.md` has no design reference. Add a pointer to `docs/design/style-reference.md` (added in this change).
13. `backend.md` (`apps/api/**`) and `database.md` (`packages/database/**`) assume a monorepo layout that doesn't exist yet. That's fine, but confirm the layout in the monorepo ADR.
14. Consider a `finance.md` rule scoped to the future payments/ledger module: ledger immutability, idempotency keys, reconciliation, no float.

### 11.4 `.claude/settings.json`
15. The deny list protects `./.env` and `./.env.*` at the **root only**. Add `Read(./**/.env)` and `Read(./**/.env.*)` for nested apps.
16. Consider `ask` rules for `Bash(git push:*)`, `Bash(git commit:*)`, `Bash(*prisma migrate reset*)` and `Bash(docker compose down -v*)`, to back up the "no commit without permission" and "never reset a database" rules with tooling.

### 11.5 Skills and agents
17. Skills and agents are good and well scoped. Consider a `requirements-review` skill so this analysis can be repeated when the SRS is revised (SRS v1.1+).
18. `booking-invariant-review` should mention **two-resource** (vehicle + driver) atomicity explicitly.

---

## 11a. UI coverage update (2026-11-18)
The public preview site (`apps/web`, sample data, UI only) now represents these SRS items:
- **§4.1:** login/registration entry points, search, categories, featured/recommended cars, popular destinations, how it works, promotional banner, sample reviews, contact info, and a footer with policies.
- **§4.2–4.3:** search by location, dates and rental type, plus filters for brand, category, transmission, fuel, seats, price and rating, and sorting by recommended, most popular, price and rating.
- **§4.4:** gallery (exterior and interior), rates, deposit, mileage, fuel, cancellation, insurance, requirements, drop-off options, indicative availability calendar, provider info and reviews.
- **§5.2:** public driver profile fields, with the license category only.

Still not built: authentication, booking, payments, provider/driver/admin portals, and every backend rule. Those wait on the P0/P1 questions below.

## 12. Prioritized questions for the product owner

**P0 blocks architecture. P1 blocks database design. P2 can be decided during build.**
References point to the SRS and to gaps above.

### P0: answer before architecture is finalized
1. **Launch market:** which country and cities, which currency and language for MVP? (§22 Q1, Q15. Drives gateway, KYC, tax, privacy law, timezone.)
2. **Money flow:** does the platform collect all customer payments and then pay providers and drivers, or are providers or drivers paid directly? Is the platform allowed to hold funds in that market? (§22 Q9, G12)
3. **Payment timing vs. approvals:** is the customer charged at request time, authorized and then captured on acceptance, or charged only after the owner (and driver) accept? (G13, §7.3)
4. **Driver service period:** for a multi-day WITH_DRIVER rental, is the driver booked for the whole time, for daily working hours, or for specific trips? Who covers driver lodging, meals and travel? (G1, §22 Q13)
5. **Driver acceptance:** must every driver accept each booking, or can a selected driver be auto-assigned? What is the response timeout? (§22 Q4, C3, G6)
6. **Driver selection scope:** can the customer pick *any* eligible available driver, or only from a recommended shortlist? (C2)
7. **Rental time unit:** hourly, daily, weekly, monthly, or all of these for MVP? Minimum and maximum durations? (§22 Q2, C8, G5)
8. **Driver meeting point:** where does the driver start the job? Vehicle pickup location, provider address, or customer address? (G2)

### P1: answer before database design
9. **Driver pricing:** do drivers set their own rates within platform limits, or is pricing platform-defined? Which pricing models are in MVP (per day, per hour, …)? (§22 Q3)
10. **Multiple roles:** can one account be customer + owner + driver? Can a driver drive their own listed vehicle? (§3)
11. **Holds and buffers:** how long are the vehicle and driver held during payment and approval? Is there turnaround time between vehicle bookings and rest time between driver jobs? (G3, G4)
12. **Mode switch and replacement:** when a driver becomes unavailable *after* confirmation, does the platform pick a replacement or does the customer choose? Is switching to self-drive a modification of the same booking? (§22 Q6, C4, C5, BR-18)
13. **Security deposit:** mandatory or configurable per vehicle and mode? Pre-authorization hold or charge? Required for WITH_DRIVER? Deduction and dispute window? (§22 Q8, G14)
14. **Verification method:** manual admin review or a KYC provider? Background checks for drivers? (G21)
15. **When customers are verified:** at signup, at checkout, or before pickup? Is it required for WITH_DRIVER customers? (G22, G23)
16. **Fees:** is there a customer-facing platform fee in addition to provider and driver commissions? Who absorbs gateway fees? (§22 Q10, G15)
17. **Tax:** which taxes apply, are prices tax-inclusive, and what must invoices contain? (G16)
18. **Payouts:** schedule, holding period, minimum, method, and handling of deductions after a payout. (G17)
19. **Cash payments:** in MVP or not? (C7)
20. **Cancellation policy shape:** time-based tiers? Set by the platform, the provider, or both? Driver compensation on late cancellation? No-show rules for customer, driver and provider? (§7.5, G11)
21. **Insurance and contract parties:** who insures the vehicle when an independent driver drives it, and who is the contracting party with the customer? (§22 Q11, G25, G26)

### P2: can be decided during build
22. Company sub-accounts and staff permissions (G34). Support-staff role in MVP? (§3.6)
23. MVP notification channels: email + in-app only, or SMS/push too? (C6, §13.4)
24. Vehicle delivery to the customer in MVP? (§22 Q12)
25. Can customers bring their own driver? (G27)
26. Initial recommendation weights and the new-driver cold-start rule. (G28)
27. Review window, provider replies, two-way ratings. (G29)
28. In-app messaging and phone masking. (G30)
29. Data retention periods. (G31)
30. Non-functional targets: search latency, uptime, RPO/RTO, accessibility level. (G32, G33)
31. Branding: is "KAIYA Rentals" the product name? Do you need dark mode? (G35) *Update 2026-11-18: "KAIYA Rentals" confirmed for the UI.*
32. **Business Partners:** is the referral/business-partner role (seen on the client site) in scope? If so: who can register, how referrals are attributed, how partner earnings are calculated and paid, and whether partners book on behalf of guests. (G36)

---
name: bookcars-audit
description: Perform an evidence-based, read-only audit of the BookCars repository for the hybrid vehicle and independent-driver marketplace.
---

# BookCars audit

Work read-only. Do not modify upstream source.

## First establish facts
- Confirm repository URL, branch, commit SHA, working-tree status, license,
  copyright notices, and third-party license information.
- Map apps, packages, languages, frameworks, runtime versions, package managers,
  lockfiles, build commands, CI, containers, and deployment configuration.

## Trace real workflows
Follow code from route/UI to API/controller/service/domain/data layer and tests:
- customer registration and authentication
- supplier onboarding and permissions
- vehicle/fleet management
- availability and pricing
- search, quote, booking, confirmation, cancellation, and rescheduling
- payment, webhook, refund, commission, and payout
- notifications, admin, reporting, and mobile clients

## Evaluate the hybrid marketplace
For each requirement, classify:
- Supported and tested
- Implemented but incomplete
- Configurable
- Requires isolated extension
- Requires invasive refactor
- Not found
- Unknown / not verified

Specifically inspect independent driver onboarding, identity/document checks,
driver availability, service areas, driver selection, recommendation/ranking,
driver assignment, driver earnings, payouts, reviews, and combined
vehicle-plus-driver booking.

## Quality and risk
Review test coverage, concurrency behavior, authorization, tenant isolation,
input validation, secrets handling, payment idempotency, logging, dependency
health, migrations, backup/restore, monitoring, and deployment repeatability.

## Output
Write a concise executive summary and detailed evidence table in the audit
workspace (not the upstream repo). Include file paths, symbols, tests, confidence,
gaps, complexity, and unknowns. Recommend extend vs rebuild with explicit
trade-offs and a staged validation plan. Never invent test results.

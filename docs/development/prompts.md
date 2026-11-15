# Reusable prompts

## 1. Plan a feature
Use `/plan-feature`. Inspect relevant files and docs, identify assumptions,
domain invariants, affected layers, risks, acceptance criteria, and tests.
Do not edit until I approve the plan.

## 2. Implement a small slice
Implement only the approved plan. Keep changes scoped. Add tests for success,
validation, authorization, and failure cases. Do not weaken existing tests.
Report changed files and commands/results accurately.

## 3. Independent review
Use `/code-review`. Review the current diff independently. Prioritize correctness,
security, data integrity, concurrency, compatibility, and missing tests.
Do not edit; report actionable findings first.

## 4. Booking race review
Use `/booking-invariant-review`. Identify two or more concurrent requests that
could reserve the same vehicle or driver. Explain the actual transaction,
constraint/locking, and retry behavior. Propose tests.

## 5. Security review
Use `/security-review`. Review the selected code and configuration for
authentication, authorization, tenant isolation, injection, secrets, uploads,
payment webhooks, and sensitive logging. Do not access secrets or production.

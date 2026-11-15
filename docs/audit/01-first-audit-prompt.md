# Claude Code — first BookCars audit prompt

You are auditing the BookCars repository in read-only mode against the hybrid
rental marketplace requirements in the audit workspace.

Do not edit, format, install dependencies, run migrations, start containers,
or execute repository scripts yet. First inspect repository status, branch,
commit, license, notices, manifests, lockfiles, and top-level structure.

Then trace actual implementation and tests for:
1. customers and authentication
2. suppliers and supplier permissions
3. vehicle/fleet management
4. vehicle availability, pricing, search, and booking lifecycle
5. payments, webhooks, refunds, commissions, and payouts
6. admin, notifications, mobile, and deployment
7. independent driver onboarding, verification, calendars, rates, matching,
   customer choice, trip lifecycle, earnings, and payouts
8. booking a vehicle and independent driver as separate resources

For each material claim, provide repository-relative path(s), symbol(s), and
test evidence. Classify as Verified, Partially verified, Not found, or Unknown.
Separate facts from inference. Do not rely on README/wiki claims without
confirming source.

Deliver:
- architecture/repository map
- technology/runtime/dependency summary
- booking lifecycle trace
- data model and key constraints
- feature compatibility matrix
- driver marketplace gap analysis
- security and test coverage review
- operational/deployment review
- high-risk refactoring areas
- extend-vs-rebuild recommendation with options and trade-offs

Do not modify the BookCars repository. Save the report in this audit workspace
only if the user has explicitly made this workspace available to you; otherwise
return the report in chat for manual recording.

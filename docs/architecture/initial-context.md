# Initial architecture context

No production architecture has been selected yet. This workspace intentionally
avoids prematurely generating an application scaffold before the BookCars audit.

## Candidate greenfield stack (if rebuild is selected)
- TypeScript monorepo managed with pnpm workspaces and Turborepo
- Next.js for customer web and admin web
- NestJS for a modular backend API
- PostgreSQL as the transactional relational database
- Prisma as ORM/migration tooling (subject to concurrency and database-feature needs)
- Redis only where justified: caching, queues, rate limits, short-lived coordination
- Object storage for documents and images
- Playwright for browser E2E; unit/integration framework selected per app
- Docker for reproducible local services; CI for lint, typecheck, tests, and builds
- Sentry or equivalent for error monitoring

## Architectural guardrails
- Modular monolith first unless scale/team boundaries justify services.
- Keep domain logic out of controllers and UI components.
- Define explicit booking and payment state machines.
- Use database transactions and appropriate constraints/locking for resource
  reservation. Validate the exact strategy under concurrent load.
- Use idempotency for external callbacks and retryable operations.
- Separate operational status from financial ledger entries.
- Do not introduce microservices, event streaming, or Kubernetes by default.

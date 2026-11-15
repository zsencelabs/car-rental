
# Hybrid Rental Platform

## Project Overview

A hybrid car rental and independent driver marketplace.

The platform supports:
1. Rental companies managing their own fleets.
2. Individual owners listing vehicles.
3. Independent professional drivers.
4. Customers booking self-drive rentals.
5. Customers booking vehicles with independently selected drivers.

## Business Rules

- Vehicle ownership and driver services are independent.
- Rental companies do not provide drivers.
- Individual vehicle owners do not provide drivers.
- Drivers register and operate independently.
- A booking must have exactly one rental mode:
  SELF_DRIVE or WITH_DRIVER.
- SELF_DRIVE requires customer driving-license eligibility.
- WITH_DRIVER requires an eligible vehicle and an assigned driver.
- Vehicle and driver availability must be checked independently.
- Never allow overlapping confirmed vehicle reservations.
- Never allow overlapping confirmed driver assignments.
- Vehicle earnings and driver earnings must be calculated separately.
- Security deposits are not rental revenue.
- All booking and financial changes must be auditable.

See docs/requirements/ for the complete requirements.
See docs/architecture/ for architectural decisions.
See docs/business-rules/ for detailed business logic.

## Technology Stack

- TypeScript
- Next.js
- NestJS
- PostgreSQL
- Prisma
- Redis
- pnpm workspaces
- Turborepo
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zod
- Vitest
- Playwright
- Docker

## Architecture Rules

- Use modular architecture.
- Keep business logic out of controllers.
- Use dependency injection in NestJS.
- Separate domain logic from infrastructure.
- Use DTOs for API boundaries.
- Validate all external input.
- Use transactions for financial and booking operations.
- Use database constraints where appropriate.
- Avoid circular dependencies.
- Avoid duplicated business logic.
- Never introduce unnecessary abstractions.

## Coding Standards

- Strict TypeScript.
- Avoid `any`.
- Prefer small, focused functions.
- Use meaningful variable and function names.
- Follow existing project conventions.
- Reuse shared validation schemas where appropriate.
- Handle errors explicitly.
- Avoid silent failures.
- Keep components modular.
- Avoid unnecessary dependencies.

## Database Rules

- PostgreSQL is the source of truth.
- Use Prisma migrations.
- Never modify the production database schema manually.
- Never reset a database containing valuable data.
- Use appropriate indexes and constraints.
- Use decimal-safe representations for monetary values.
- Store timestamps consistently in UTC.
- Keep financial records immutable where possible.
- Use explicit transaction boundaries.

## API Rules

- Follow REST conventions.
- Use consistent response structures.
- Validate request parameters, body, and query strings.
- Implement pagination for collection endpoints.
- Apply authorization to every protected operation.
- Document endpoints using OpenAPI.
- Never expose internal database models directly.

## Security Rules

- Never commit secrets.
- Never expose passwords, tokens, or private documents.
- Never trust client-side pricing calculations.
- Verify payment transactions on the backend.
- Enforce ownership and role permissions server-side.
- Use least-privilege access.
- Treat external API responses as untrusted.

## Testing Rules

- Test all critical business logic.
- Add unit tests for domain services.
- Add integration tests for API and database operations.
- Add E2E tests for critical customer journeys.
- Test booking overlap and concurrency.
- Test payment and refund calculations.
- Never claim tests passed without executing them.

## Development Workflow

Before implementing a feature:

1. Understand the requirements.
2. Inspect existing code.
3. Identify affected modules.
4. Check business rules.
5. Prepare an implementation plan.
6. Identify required tests.
7. Implement incrementally.
8. Run relevant tests.
9. Review security and edge cases.
10. Update documentation.

## Git Rules

- Never work directly on main.
- Use feature branches.
- Use conventional commits.
- Do not overwrite user changes.
- Do not force push without explicit approval.
- Do not commit without permission.
- Keep pull requests focused.

## Important

Do not make major architectural decisions without documenting them.

If requirements are unclear, ask before implementing.

Prefer correctness, security, maintainability, and testability over implementation speed.

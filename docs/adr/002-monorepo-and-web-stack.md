# ADR-002: Monorepo layout and public web stack

- Status: **Accepted**
- Date: 2026-11-18
- Decision owners: Product owner / tech lead

## Context
ADR-001 chose to build from scratch. The first slice is the public customer website (UI only, mock data), because the booking, payment and driver-time rules are still open (P0 questions in `docs/requirements/requirements-analysis.md`). The client's existing site is the visual reference (`docs/design/style-reference.md`).

## Options considered
1. **pnpm workspaces + Turborepo monorepo, Next.js App Router, Tailwind v4, shadcn/ui.** Matches `CLAUDE.md`, and leaves room for `apps/api` (NestJS) and `packages/*` later.
2. A single Next.js app without a monorepo. Simpler today, but needs restructuring when the API arrives.
3. npm workspaces. Deviates from `CLAUDE.md`.

## Decision
Option 1:
- Root `package.json` + `pnpm-workspace.yaml` (`apps/*`, `packages/*`) + `turbo.json`. pnpm is pinned at `10.20.0` via corepack. The newest pnpm (12.x) can't be launched by the corepack bundled with Node 22.21 (corepack 0.34).
- `apps/web`: Next.js 16 App Router with **Cache Components** (the `create-next-app` default). Pages that read `searchParams` are wrapped in `<Suspense>`. Car detail pages are prerendered with `generateStaticParams`.
- Tailwind v4 + shadcn/ui (Radix base). Theme tokens come from the style reference.
- **Zod** for validation: the search form (React Hook Form + Zod) and URL parsing share `src/lib/search-schema.ts`. This settles the class-validator vs. Zod note in the requirements analysis for the frontend. Backend validation is decided when the API is built.
- A **mock data layer**: `src/lib/catalog/queries.ts` is the only module that reads `mock-data.ts`, so it can be swapped for API calls (and TanStack Query) without changing pages.
- Money is a decimal string + currency, with BigInt minor-unit comparisons. There is no floating-point money anywhere.
- Tests: Vitest (unit) and Playwright (E2E, desktop and mobile Chrome).

## Consequences
- Positive: follows `CLAUDE.md`, the UI can be reviewed with the client before backend decisions, and the backend can be added as `apps/api` without restructuring.
- Negative: mock data can drift from the eventual API contract. Mitigated by keeping types in `src/lib/catalog/types.ts` and moving them into a shared package when the API exists.
- Known framework behavior: with Cache Components, an unknown `/cars/[id]` can return HTTP 200 on the first request (the shell streams before `notFound()`), with a `noindex` robots tag. Repeat requests return 404. `dynamicParams = false` isn't available with Cache Components. Revisit this when real data is used.
- Security: no auth, no forms that submit data, no secrets. The site is static or streamed, and every "book" action is disabled.

## Evidence and references
- `apps/web/`, `package.json`, `pnpm-workspace.yaml`, `turbo.json`
- Next.js 16.4 bundled docs: `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`, `.../03-file-conventions/not-found.md`

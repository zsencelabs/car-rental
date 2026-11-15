
---
paths:
  - "packages/database/**/*.prisma"
  - "packages/database/**/*.sql"
---

# Database Engineering Rules

- Use normalized relational structures.
- Define foreign keys.
- Add indexes for frequently queried columns.
- Use unique constraints for business identifiers.
- Use decimal-safe monetary fields.
- Store dates using appropriate timezone-aware types.
- Never store calculated balances as the only financial source of truth.
- Use migrations for schema changes.
- Never delete financial transactions to correct mistakes.
- Use reversal or adjustment records.
- Protect booking availability with transaction-safe logic.
- Document non-obvious database decisions.

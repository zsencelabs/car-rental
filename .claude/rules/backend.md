
---
paths:
  - "apps/api/**/*.ts"
---

# Backend Engineering Rules

- Use NestJS modules to organize business domains.
- Keep controllers thin.
- Business logic belongs in services or domain components.
- Use dependency injection.
- Validate input using DTOs and class-validator.
- Apply authentication and authorization guards.
- Never trust client-supplied prices or ownership IDs.
- Handle database transactions explicitly.
- Use consistent exception handling.
- Add tests for every critical business operation.
- Avoid direct database access from controllers.

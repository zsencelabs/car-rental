# Claude Code professional workflow

## Before a task
1. Start from the correct Git branch and check `git status`.
2. Read the relevant requirement and architecture notes.
3. Ask Claude to inspect the relevant files and propose a plan.
4. Confirm scope, acceptance criteria, risks, and test strategy.

## During a task
- Work in small vertical slices.
- Ask for one coherent change at a time.
- Keep business rules server-side.
- Ask Claude to explain non-obvious decisions and identify assumptions.
- Do not let multiple agents edit the same files concurrently.
- Use subagents for independent read-only research and reviews.

## Before completion
1. Inspect `git diff` yourself.
2. Run formatting, lint, typecheck, unit/integration tests, and relevant E2E tests.
3. Ask for an independent review using `/code-review` or the reviewer agent.
4. Verify migrations and rollback strategy separately.
5. Update requirements and ADRs.
6. Commit with a clear message; use a pull request for review.

## Context/token discipline
- Keep root CLAUDE.md concise and stable.
- Put detailed procedures in skills; invoke them when needed.
- Use path-scoped rules to avoid loading irrelevant guidance.
- Ask for targeted file reads, not full-repository dumps.
- Use `/clear` between unrelated tasks and `/compact` when a long task must continue.
- Avoid enabling MCP servers that are not needed for the current task.
- Ask Claude to summarize decisions and next steps before compacting.

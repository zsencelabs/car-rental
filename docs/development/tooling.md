# Tooling recommendations

## Use now
- Claude Code: planning, implementation assistance, code exploration, review.
- Git: branches, small commits, reviewable diffs.
- VS Code: editor and integrated terminal.
- Existing repository package manager and runtime: follow BookCars' own metadata.

## Add when justified
- Context7 MCP: retrieve current library documentation while coding.
- GitHub MCP: issues, pull requests, and repository workflows; grant least privilege.
- Figma MCP: only if the project has Figma designs to inspect.
- Playwright: browser automation and repeatable end-to-end tests.
- PostgreSQL MCP: optional, development-only, read-only access for schema/data
  inspection; never point it at production.
- Sentry: error monitoring after an application exists.

## MCP security
- Prefer official servers and verify publisher/repository.
- Review tools and scopes before connecting.
- Avoid broad write access and production credentials.
- Do not connect every service on day one.
- MCP is an integration protocol, not a substitute for tests or code review.

## Claude Code plugins
Start with native Claude Code features (CLAUDE.md, rules, skills, agents,
settings, hooks, MCP) before installing third-party plugins. Add a plugin only
when its specific workflow saves time and its permissions are understood.

---
name: code-review
description: Independently review a proposed diff for correctness, maintainability, security, and test quality.
---

# Code review

Review the diff, not just the author's summary. Prioritize actionable defects:
1. correctness and business invariants
2. security and authorization
3. data integrity, concurrency, and migrations
4. error handling and backward compatibility
5. performance and observability
6. readability and maintainability
7. tests and documentation

Report findings first, ordered by severity, with file/line references where
available. Explain impact and a concrete fix. If no findings are identified,
say what was reviewed and what was not verified; do not claim zero risk.

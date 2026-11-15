---
name: security-review
description: Conduct a focused application security review of code, configuration, APIs, or a proposed feature.
---

# Security review

Review threat boundaries and actual enforcement. Check authentication,
authorization, tenant/resource ownership, input validation, injection, XSS,
CSRF, CORS, rate limiting, file uploads, SSRF, secrets, logs, dependency risks,
session/token handling, payment webhooks, and sensitive data retention.

For each finding provide:
- severity (Critical/High/Medium/Low/Informational)
- affected path and symbol
- realistic attack or failure scenario
- impact and evidence
- practical remediation
- regression test

Do not exploit production systems or expose secrets. Distinguish confirmed
vulnerabilities from questions requiring further verification.

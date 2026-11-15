# Audit rules

- Initial BookCars audit is read-only: do not edit upstream source.
- Confirm the checked-out commit, branch, license, and repository state first.
- Every finding must include evidence: path, symbol/configuration, and test
  evidence where available.
- Use these labels: Verified, Partially verified, Not found, Unknown.
- Do not equate a README feature list with an implemented and tested feature.
- Do not run scripts, install dependencies, start containers, or connect to
  external services until their effects and prerequisites are inspected.
- Record failed commands and environmental limitations; do not imply tests passed.

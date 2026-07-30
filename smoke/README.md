# Manual smoke suites

This directory contains manually invoked checks for already running
deployments.

**MANUAL ONLY:** nothing under `smoke/` belongs to the automatic unit,
functional E2E, packaging, post-install, or CI test sets. Do not add this
directory to a generic "run all tests" target. Every suite must require an
explicit target and must return before making a network request when that
target is missing.

Available suites:

- [`deployment`](deployment/README.md): fast, read-only black-box integrity
  checks against a user-supplied deployment URL.

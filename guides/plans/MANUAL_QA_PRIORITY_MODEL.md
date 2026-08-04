# Manual QA priority model

Status: normative scoring model for the manual QA ledger  
Last updated: 2026-08-04

## Purpose

The manual QA list is cumulative: adding a fixture or automated regression test
does not remove a manual test row. Priority decides how often a row is sampled
by a person; it is not a coverage or PASS indicator.

The score emphasizes cases where an assembled-system failure would matter and
where automation cannot reliably prove the complete result. This lets broad
automated coverage coexist with limited, risk-based human testing.

## Score

Score each dimension from 0 to 5, then calculate:

```text
Manual QA priority score = 5I + 4L + 5A + 3N + 3O
```

The result is between 0 and 100.

| Dimension | Weight | 0 | 3 | 5 |
| --- | ---: | --- | --- | --- |
| `I` — impact / criticality | 25 | Cosmetic or no user/data effect | Material workflow failure with reversible data | Security/privacy breach, irreversible loss, unsafe operation, compliance issue or core outage |
| `L` — failure likelihood | 20 | Stable, simple, unchanged path | Several branches or recent change | Prior defect, frequently changing logic, complex boundary/race behavior |
| `A` — automation insufficiency | 25 | Deterministic automated E2E proves the same assembled path | Automation proves domain state but not all presentation/integration effects | No trustworthy automatic oracle, AI/visual judgment required, or test hook would change the production path |
| `N` — nondeterminism / integration | 15 | Pure synchronous calculation | Queue, cache, browser or one background worker | Scheduler plus multiple workers, time windows, external provider, race/retry or large lazy-loaded UI |
| `O` — observability / recovery | 15 | Direct result and trivial rollback | Delayed/aggregated signal or multi-step cleanup | Silent/stale result, weak telemetry, destructive side effects or difficult recovery |

Write the spreadsheet field as `<band> <score>`, for example `P0 92`.

## Bands and manual sampling

| Band | Score | Expected manual treatment |
| --- | ---: | --- |
| `P0` | 80–100 | Mandatory on every affected release candidate and before production qualification; do not substitute an API-only pass. |
| `P1` | 65–79 | Execute on every release that changes the area; otherwise include in the release's rotating high-risk sample. |
| `P2` | 45–64 | Rotate through releases and run whenever the feature, dependency or data contract changes. |
| `P3` | 25–44 | Manual smoke on direct change, reported regression or exploratory session; rely primarily on automation. |
| `P4` | 0–24 | Automation normally suffices; retain the row for discoverability and execute only when its assumptions change. |

## Guardrails

- An unresolved observability `GAP` affecting a control or worker trace cannot
  be lower than `P1`.
- Security, privacy, destructive deletion, backup/restore and production update
  paths are normally `P0`, even with strong automation.
- Cleanup that prevents one manual scenario contaminating another is `P0`.
- A new or materially changed behavior without an automated regression test is
  at least `P1` until evidence justifies rescoring.
- A visual-only defect is not automatically low priority when it hides status,
  failure, consent or destructive-action information.
- “AI generated the test” is not evidence of correctness. Score `A` from the
  oracle's reliability and equivalence to the production path.

## How automation changes priority

When a missing behavior is found, add a deterministic fixture and automated
test where practical. The fixture must use disposable data, exercise the real
production service path, and remain absent from production packages when it is
development-only. A test-only scheduler bypass or force-drain endpoint is not
an acceptable substitute for the production path.

After the test is stable:

1. update the row's **Automated coverage** evidence;
2. rescore `A`, and `L` only if regression evidence supports it;
3. keep `I`, `N` and `O` honest—automation does not reduce business impact;
4. keep the manual row and its old results;
5. use the new band to choose future sampling frequency.

For example, a universal scheduled-job telemetry contract can be tested with a
fixture rule and a deterministic assertion that start/completion/failure each
reach the Monitoring projection exactly once. A later manual sample still
proves that the assembled scheduler, Redis worker and browser display cooperate.

## Initial scoring ownership

The initial scores in
[`ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx`](ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx)
are an engineering risk assessment based on current code, historical evidence
and known gaps. Recalculate a row when its implementation, automated oracle,
failure history, external dependency or cleanup behavior changes. Record the
reason in **Evidence / notes**; do not silently lower a score merely to reduce
the manual workload.

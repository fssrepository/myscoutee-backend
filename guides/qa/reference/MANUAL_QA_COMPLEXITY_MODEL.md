# Remaining manual QA complexity model

Status: normative effort-estimation model for the manual QA ledger  
Last updated: 2026-09-03

## Purpose

`Manual QA priority` answers which risk should be sampled first. It does not
describe how long the remaining work takes. The independent
`Remaining QA complexity (min)` field estimates the clean paired tester/Codex
execution time still required for one matrix row.

Only unfinished work is estimated:

- a completed row has a blank complexity cell;
- a `PASS / PARTIAL` row estimates only its still-open tail, not the work that
  already passed;
- a not-started row estimates its complete remaining journey;
- a changed status or reduced remaining scope requires a new estimate.

The generated workbook sums these values per QA domain. This makes the first
two Core blocks and the external/optional block comparable without mixing
effort with execution priority.

## Calculation

Estimate the following components from the stable click guide. If a guide is
not prepared yet, use the bounded `Scenario`, `Next manual oracle`, explicit
source checkpoints and required environment from the matrix row.

| Component | Minutes |
| --- | ---: |
| Remaining manual action or visible assertion | 2 each |
| Additional isolated actor/device after the first | 5 each |
| Independent machine-oracle/savepoint round trip | 5 each |
| Required reload/reconnect/background-settlement boundary | 5 each |
| Destructive branch with an exact restore/recovery proof | 10 each |
| Physical device, provider, VM or other external setup boundary | 15 each |

Calculate:

```text
remaining minutes = actions/assertions
                  + actor/device coordination
                  + oracle/savepoint waits
                  + runtime/reload boundaries
                  + destructive recovery
                  + external setup
```

Round the result to the nearest five minutes. The value estimates a clean run
from a valid baseline. It excludes defect diagnosis, implementation, rebuilds,
unexpected infrastructure recovery and an optional full replay after a failed
checkpoint.

## Reading the value

The numeric minutes are the aggregation source. These bands are only a quick
reading aid and are not stored in place of the number:

| Band | Remaining clean-run estimate |
| --- | ---: |
| `C1` | up to 30 minutes |
| `C2` | 35–60 minutes |
| `C3` | 65–90 minutes |
| `C4` | 95–120 minutes |
| `C5` | more than 120 minutes |

Domain totals are planning estimates, not promises. Keep the number stable
during an unchanged run; revise it only when the remaining contract or its
required boundary changes, and record the reason in `Evidence / notes`.

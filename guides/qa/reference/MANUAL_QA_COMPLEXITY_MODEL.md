# Remaining manual QA complexity model

Status: normative effort-estimation model for the manual QA ledger  
Last updated: 2026-09-03

## Purpose

`Manual QA priority` answers which risk should be sampled first. It does not
describe how long the remaining work takes. The independent
`Remaining QA complexity (min/max)` estimates the wall-clock time still
required for one matrix row. Values use `MIN/MAX`, for example `90/215`; the
unit is declared once in the column header and is not repeated in each cell.

Only unfinished work is estimated:

- a completed row has a blank complexity cell;
- a `PASS / PARTIAL` row estimates only its still-open tail, not the work that
  already passed;
- a not-started row estimates its complete remaining journey;
- a changed status or reduced remaining scope requires a new estimate.

The generated workbook sums both bounds per QA domain. This makes the first
two Core blocks and the external/optional block comparable without mixing
effort with execution priority.

## Minimum calculation

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

Calculate the minimum:

```text
minimum minutes = actions/assertions
                + actor/device coordination
                + oracle/savepoint waits
                + runtime/reload boundaries
                + destructive recovery
                + external setup
```

Round the result to the nearest five minutes. The minimum estimates a clean,
well-prepared run with immediately available machine oracles.

## Maximum calculation

The tester also waits while Codex stages and validates the fixture, reads
independent oracles, inspects the owned watcher logs, records evidence and
performs planned reset/replay work. First calculate the normal agent-inclusive
upper bound, then add the empirically observed defect contingency:

```text
normal upper = round_up_to_5(
    minimum + max(30 minutes, minimum * 0.8)
)

maximum = round_up_to_5(max(
    normal upper * 1.30,
    minimum * 2.35
))
```

The fixed 30 minutes protects short cases from hiding setup/oracle overhead;
the proportional term accounts for additional savepoints in long journeys.
The final 30% (equivalently about `2.35 × minimum` on longer cases) is a
planning contingency for diagnosis, correction verification and the shortest
causal replay. A larger infrastructure incident or a
contaminated full replay is still recorded separately rather than silently
stretching the range.

This factor was calibrated against `ASSET-MEMBER-LIFECYCLE-001` on 2026-09-03.
Its expanded clean route was approximately 190 minutes, normal Codex
stage/oracle/replay waiting added approximately 155 minutes, and the observed
defect/fix overrun added approximately 105 minutes: `190 -> 345 -> 450`.

## Reading the value

The numeric bounds are the aggregation source. These bands are only a quick
reading aid and are not stored in place of the number:

| Band | Minimum clean-run estimate |
| --- | ---: |
| `C1` | up to 30 minutes |
| `C2` | 35–60 minutes |
| `C3` | 65–90 minutes |
| `C4` | 95–120 minutes |
| `C5` | more than 120 minutes |

Domain totals are planning ranges, not promises. Keep both bounds stable during
an unchanged run; revise them only when the remaining contract or its required
boundary changes, and record the reason in `Evidence / notes`.

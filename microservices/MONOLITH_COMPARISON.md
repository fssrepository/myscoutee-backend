# MSC-121 — monolith and microservices measurements

Measured on 2026-10-09. The microservice comparisons below reuse the stored monolith measurements. The subsequently requested current-source monolith regression run is recorded separately; it does not replace or rerun the old source baseline.

## Same test scenarios

The existing `e2e/stress/backend/run.mjs` scenario definitions and collection assertions were run against `http://localhost:18080`. `server-events-read` uses 8 virtual users, 90 seconds, an 8-second ramp and 100 ms think time plus 0–100 ms jitter. `server-read-sweep` uses 4 users, 30 seconds, a 3-second ramp and the same think time. The sweep reuses context; the events scenario resolves its DEMO user before each step. Neither profile is a saturation test.

The runner has an explicit `E2E_NATIVE_DEMO_SESSIONS=true` option for production-style authentication. It opens native DEMO sessions and revokes only its own sessions afterward. Request payloads, assertions, scenarios and thresholds remain the same. No microservice lab database reset was performed.

## Results

| Scenario | Monolith requests / failures | Microservices requests / failures | Monolith → microservices throughput | Throughput change | Monolith → microservices p95 | p95 change |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| server-events-read | 1917 / 0 | 828 / 0 | 20.60 → 8.91 req/s | -56.8% | 313.1 → 1119.4 ms | +257.5% |
| server-read-sweep | 810 / 0 | 729 / 0 | 23.92 → 21.42 req/s | -10.5% | 239.1 → 281.2 ms | +17.6% |

The event profile shows a substantial regression. The warmed read sweep is much closer, but is also slower. Both initial microservices runs pass their existing error/latency thresholds, with no skipped cases. Passing those thresholds does not mean performance parity.

The first sweep failed 56 of 756 steps because `/api/health` was missing from the gateway. The media test uses that endpoint before checking collected images, so it failed for the same reason. The exact public health route was restored, keeping other management routes private; the table contains the subsequent complete passing sweep. The failed run is retained in the raw evidence.

## Where time went

Prometheus evidence for the event run attributes approximately 556.8 cumulative request-seconds to `/auth/demo-users`. Its three group/membership transport operations total about 23.0 seconds, averaging 8.2–10.7 ms per call. DEMO-user setup is the dominant measured path; this does not support attributing the entire slowdown to network transport. The original events scenario performs this setup repeatedly, so it remains included in the comparison.

All six backends have a 2-core ceiling and share one 4-vCPU VM. The original Mongo ceiling was also 2 cores. A limit is a ceiling, not a reserved allocation.

### Controlled Mongo CPU check

The versioned `tools/measure-stress.py` runs the same scenario and captures each guest container's cgroup CPU usage/throttling before and after it. `tools/mongo_replica.py tune-cpu` uses Kubernetes in-place CPU resize, verifies that the container ID/restart count did not change, and keeps the warmed database intact.

| Mongo ceiling | Requests / failures | Throughput | p95 | Mongo mean CPU | Mongo throttled time |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2 cores, warmed repeat | 882 / 0 | 9.44 req/s | 986 ms | 1.817 cores | 11.40 s |
| 3 cores, same process | 1098 / 0 | 11.73 req/s | 787 ms | 2.128 cores | 0.194 s |

Throughput improved by 24.3% and p95 fell by 20.2% in this sequential check. None of the six backends accumulated CPU throttling in the 2-core run. This identifies Mongo's CPU ceiling as a material contributor, while leaving a substantial gap to the monolith. It does not establish that every remaining millisecond is HTTP or partitioning overhead: all processes still share four guest CPUs, and the measurements are not repeated randomized trials. The versioned Mongo ceiling is now 3 cores; memory and guest vCPU allocation were not reduced.

These controlled measurements use one Mongo process. The subsequent two-member replica-set run is recorded separately below. Primary reads are retained, so a second member does not automatically distribute read load.

## Final two-member deployment

The requested two-member `msc121` replica set retains primary reads and majority
writes. After conversion, the first event/sweep runs passed 414/324 requests but
were substantially slower (4.13/9.70 req/s). The six JVMs and primary Mongo had
restarted. A subsequent warmed repeat still showed a regression:

| Scenario | Requests / failures / skipped | Throughput | p95 | Throughput vs existing monolith | p95 vs existing monolith |
| --- | ---: | ---: | ---: | ---: | ---: |
| server-events-read | 522 / 0 / 0 | 5.41 req/s | 1884 ms | -73.7% | +501.7% |
| server-read-sweep | 432 / 0 / 0 | 12.82 req/s | 704 ms | -46.4% | +194.4% |

Both profiles pass their existing thresholds. The second Mongo **does not improve
throughput in this four-vCPU lab**; it provides replication while consuming
resources and adding replication/commit work. Default primary reads deliberately
preserve consistency. Two voting members need both for majority writes and do
not provide one-member-loss write availability. No claim is made that a larger
cluster would have these same numbers.

The first replica-set event sample recorded approximately 1.10 cores on the
primary and 0.094 on the secondary, with virtually no Mongo CPU throttling. Thus
the new regression is not explained by the original two-core quota alone. These
runs also include restarted JVM/cache state and stronger write acknowledgement,
so the difference cannot honestly be assigned entirely to the HTTP layer or
entirely to replica overhead. The controlled same-process quota experiment above
is the narrower causal evidence. Further performance work needs profiling of the
repeated DEMO-directory/database path; weakening consistency or adding read
routing merely to improve the benchmark is outside this change.

Final raw runs: `server-events-read-2026-10-09T01-42-*` and
`server-read-sweep-2026-10-09T01-43-*` under the comparison report directory; exact
run IDs and cgroup snapshots are recorded alongside the generated summaries.

## Current-source monolith regression check

After the user explicitly requested a fresh current-source check, the KVM was
fully stopped and the canonical disposable monolith E2E stack was started alone.
`tools/check-current-monolith.sh` uses the existing production-style E2E
Dockerfile and existing test runners; support images are reused. The current
backend image is `sha256:d6e9136d362a9420728df0c4f99927737c07260ae41fb0322a4244c4f080c2d4`.

The complete functional suite passed **95/95**, zero failures/skips, including
mutation flows. Initial startup exposed an eager dependency cycle between
account status recovery and chat. The canonical `ProfileStatusWork` now uses
the existing lazy API-injection pattern for `SupportMessages`; global circular
references remain disabled. This belongs to MSC-120 and is included in the image.

| Scenario | Requests / failures / skipped | Current requests/s | Stored baseline requests/s | Throughput change | Current p95 | Stored p95 | p95 change |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| server-events-read | 1440 / 0 / 0 | 15.46 | 20.60 | -25.0% | 536.8 ms | 313.1 ms | +71.4% |
| server-read-sweep | 783 / 0 / 0 | 23.65 | 23.92 | -1.1% | 259.7 ms | 239.1 ms | +8.6% |

This first current-monolith sample had a material cross-date event-profile gap;
passing functional tests or stress thresholds alone did not establish parity.
The matched pre-domain control below supersedes its interpretation as a source
regression. The warmed mixed sweep is much closer. These are sequential samples
from different dates, not randomized repeated trials, so source changes alone
cannot be assigned the entire difference. The same scenario steps, concurrency,
duration and assertions were retained. The event run resets the isolated
`e2e_db` through the runner's `stress` mode (the baseline used its equivalent
`e2e` reset mode); the sweep uses `contract` mode and reuses warmed context.
No production or microservice data was reset.

The event runs each contain 46 Docker resource samples. Mean sampled CPU was
1.29 → 1.87 cores for the monolith and 4.62 → 4.88 cores for Mongo (stored →
current). The warm sweep's monolith CPU stayed near 1.46 → 1.43 cores; Mongo was
0.48 → 0.61 cores. These are sampled percentages converted to cores, not cgroup
CPU integrals. The monolith's Mongo alone can use more CPU than the entire
four-vCPU microservice guest; this resource difference is material when judging
HTTP overhead versus partitioning. No performance fix is inferred from samples
alone.

The two-member microservices remain slower than this current monolith too:
approximately 65.0% lower event throughput / 251% higher event p95, and 45.8%
lower sweep throughput / 171% higher sweep p95. This retains the original
finding instead of hiding it behind a slower updated comparator.

Private evidence is under
`~/.local/state/myscoutee-domain-segregation/e2e/current-20261009T022859Z/`:
`functional.log`, `performance/server-events-read-2026-10-09T02-32-01-811Z/`,
`performance-warm/server-read-sweep-2026-10-09T02-33-35-948Z/`, build/image receipt
and stack-stop log. The E2E stack stopped before restoring the KVM.

## Matched pre-domain and current-source control

This supersedes the interpretation of the earlier cross-date gap as a domain
regression. The historical 20.60 requests/s comparator was already refactored;
it was not the source before the package move. The actual pre-domain source is
`5a23e829f` (parent of package-move commit `9c9411264`). Its image was built
unchanged from a Git archive with its original E2E Dockerfile, and its revision
was recorded in the image label. Both versions use the same current canonical
isolated E2E seed, support images, runner, scenario parameters and assertions.
The KVM is fully stopped. Each version runs a reset/cold event scenario, the
same event scenario again without reset/restart, then the warm read sweep.

| Scenario | Before / after requests (all pass) | Before → after requests/s | Change | Before → after p95 | Change |
| --- | ---: | ---: | ---: | ---: | ---: |
| server-events-read | 1566 / 1602 | 16.82 → 17.25 | +2.5% | 467.8 → 438.5 ms | -6.3% |
| server-read-sweep | 864 / 864 | 25.60 → 26.62 | +4.0% | 237.3 → 218.5 ms | -7.9% |

Zero failures or skipped requests in all four warm samples. This controlled
pair does **not show a material domain-refactor slowdown** in these scenarios;
the current code is slightly faster. It does not certify every feature or
production workload. The original current-source functional result remains
95/95, including mutations. No business-code performance patch was needed to
make this comparison pass.

The preceding current-source warm event control was 16.51 requests/s / 463.2 ms
p95. Its cold sample was 16.85 / 446.4 ms. Thus warming alone did not restore
20.60. The final matched current cold sample was 18.00 / 404.7 ms; the pre-domain
cold sample was 16.08 / 525.9 ms. Absolute cross-date differences cannot be
assigned to code or to browser startup without matching evidence. A user browser
launch is an external transient; retain affected evidence and use undisturbed
warm samples. The Git push overlapped part of the pre-domain cold sample, not
its warm pair. No test browser was launched during these warm samples.

Microservices also had a warmed repeat: the two-Mongo event result improved
from 4.13 to 5.41 requests/s after restart. It still lagged substantially. This
monolith control gives no evidence that JVM warmup alone explains that gap.
The four-vCPU guest/resource, seed and replication differences documented above
remain important; the 20.60 historical result is retained, not silently replaced.

One intermediate current-source run completed both event scenarios but failed
before the sweep because its shell script was edited while running. Those two
measurements are retained as partial evidence; the complete matched run below
replaces that incomplete qualification. No passing sweep was inferred from it.

Exact private evidence:

- Before: `/home/raxim/.local/state/myscoutee-domain-segregation/e2e/current-20261009T025936Z`.
- After: `/home/raxim/.local/state/myscoutee-domain-segregation/e2e/current-20261009T030527Z`.
- Before image: `sha256:0e51c83ade04dfd01c7f3cb5f0d4cd9294186d4c0e4c5ba3f0a7f06761aff39c`.
- After image: `sha256:d6e9136d362a9420728df0c4f99927737c07260ae41fb0322a4244c4f080c2d4`.

Reproduce serially with `tools/check-current-monolith.sh --source-ref 5a23e829f`
and `tools/check-current-monolith.sh --performance-only`; neither command starts
the KVM, and each stops its disposable E2E stack on exit.

## Environment and evidence

- Comparator: the previously measured refactored monolith (`performance-candidate` events and `performance-candidate-warm` sweep), documented in [BACKEND_CROSS_DOMAIN_E2E.md](../guides/plans/BACKEND_CROSS_DOMAIN_E2E.md).
- Microservices: 6 backend deployments, one replica each, a shared MongoDB (one member initially, two members in the final runs), Kubernetes/containerd in an 8 GiB / 4-vCPU KVM guest, production images and native DEMO authentication.
- The monolith used its isolated E2E seed; this lab uses the canonical DEMO/production bootstrap. This compares the deployed systems using the same scenarios; it does not isolate architecture from dataset and resource differences.
- Existing monolith evidence: `~/.local/state/myscoutee-domain-segregation/e2e/performance-*`.
- Microservices summaries, per-step timings and retained failed run: `microservices/build/reports/comparison/`. These generated local artifacts are not source files.

## Reproduce against the running microservices lab

```sh
export E2E_STRESS_BASE_URL=http://localhost:18080
export E2E_NATIVE_DEMO_SESSIONS=true
export E2E_SKIP_E2E_RESET=true
node e2e/stress/backend/run.mjs --scenario server-events-read --record --artifacts-dir microservices/build/reports/comparison
node e2e/stress/backend/run.mjs --scenario server-read-sweep --record --artifacts-dir microservices/build/reports/comparison
```

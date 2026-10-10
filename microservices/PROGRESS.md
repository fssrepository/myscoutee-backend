# MSC-121 — numbered delivery progress

Updated: 2026-10-10. The 23 backend and 9 frontend backup commits were consolidated into task-scoped commits; the rebuilt GitHub Pages bundle is committed under MSC-121. Canonical backend changes belong to MSC-120; the service shell, transport and deployment belong to MSC-121. The additional frontend-local DEMO-selection wait is tracked under MSC-120.

**Last verified lab state:** Helm revision **123**; six backend and seven supporting Deployments Ready, plus one Mongo StatefulSet **2/2 Ready**. Its original two data volumes, REAL/DEMO document counts, collection hashes and indexes were preserved. Majority-write/secondary-read and idempotent migration rerun pass. The headless VM remains **8192 MiB / 4 vCPU**, host-boot autostart disabled.

The requested source batch through **milestone 20** is implemented. Native browser/workspace checks, live contact-worker loss and the same stress profiles used for the monolith now pass. The shared two-member Mongo replica set is configured and its idempotent rerun passes. Frontend-local DEMO navigation and timing verification passed; the final 28-page guide/PDF is regenerated. The user additionally requested a new-current-code monolith E2E/performance run after these items, a review of open MSC-115+ tasks, and a separate task for tomorrow’s reusable UI/template extraction.

## MSC-122 continuation — 2026-10-10, not a new qualified lab revision

**Current continuation:** source now also separates operator/Registry into the
`network` assembly (eight Java services total). New boundaries cover bounded
measurement eligibility, the durable purge handoff and signed integration report
reads; narrow existing profile ports are reused. Eight independent JAR builds
and artifact ownership checks, 228 transport tests and 61 infrastructure checks
pass. Eight runtime images are built and locked. Network OpenAPI validation
covers 12 measurement-eligibility, 11 global-identity-privacy and 49 report
responses. Logs: `/tmp/msc122-network-assemblies.log`,
`/tmp/msc122-network-images.log`, `/tmp/msc122-network-infra.log`.

Dev is stopped; libvirt is active following interactive sudo in the opened
terminal. The separate `vm.py observe` terminal is open. After the user directed
continuation, VM startup used the existing one-shot `--host-reserve-mib 1792`
option; guest allocation/defaults are unchanged. Actual startup found 10,251 MiB
available; cloud-init and k3s API readiness pass. Initial host memory-pressure
averages are zero. Coordinated backend stop/rollout is in progress.

The results below are the preceding seven-service checkpoint.

Runtime order confirmed by the user: complete development → stop dev → KVM
qualification/CPU diagnosis and repair → stop KVM → monolith qualification.
The dev stack is stopped for this phase; do not automatically restart it while
KVM qualification is pending. October-9 CPU evidence and its limitations are
linked in the template plan.

Generic operator deployment capabilities moved to platform; release verification
uses the extracted canonical crypto/release contracts without Registry beans.
Help has a dedicated seventh assembly/image and gateway destination. Landing
content uses a narrow public-help read transport. At that seven-service checkpoint, Java network/Registry still shared identity;
the subsequent source split above supersedes that grouping.
Verification: 271 focused backend JUnit tests, 224 transport tests, 61
infrastructure tests, seven independent JAR builds and artifact ownership checks
pass. All OpenAPI schemas compile; the new public-help contract validates 24 real
HTTP responses. The complete wire inventory stops at pre-existing missing
`affinity/recompute-metrics-v1` response evidence and is not claimed complete.
The affinity HTTP fixture now supplies its required canonical database-mode runner.

Seven runtime images are built and locked in `deploy/images.lock.json` (including
help `0.1.0-b1df9a7c82f9`). Logs: `/tmp/msc122-platform-junit.log`,
`/tmp/msc122-assemblies.log`, `/tmp/msc122-images.log`. The dev stack was stopped
for serial packaging and restarted afterwards. At that historical checkpoint, the lab rollout was pending because libvirt
was stopped; the current memory gate is recorded above. No guest image
import, new Helm revision, native-flow or persistence result is claimed.
The previous revision-123 evidence remains historical. Full scope and the resume
sequence are in [the template plan](../guides/plans/MSC-122_TEMPLATE_EXTRACTION_PLAN.md).

## Administrative closeout — 2026-10-10

MSC-121 is **Closed / Project Done**, including the October-9 idle/runtime
follow-ups below. The next 12 backend backup commits and one frontend backup
commit are consolidated into their immediately preceding MSC-121 commits,
preserving their source trees and the separate MSC-122 plan. Restorable Project
snapshots and README summaries are refreshed; extraction remains Todo.

Final task accounting: **634,373,124 tokens**, **30.466665 active h** /
**30.420657 allocated h**, **$889.43 Standard API equivalent**, through
**2026-10-09T15:12:03.126Z**. Initial template/licensing/components turns and this
October-10 publication turn are excluded. The roadmap heatmap includes October 9 (**140,711,289**), revises
October 8 to **416,565,655**, and totals
**42,358,256,064**. Account lifetime **40,111,683,863** through October 9 is a
separate overlapping measure, not an additional task budget.

October-10 read-only closure check: the existing guest SSH endpoint timed out;
no VM start, rebuild or redeployment was performed. The last verified revision
123 evidence below remains the runtime boundary.

Latest implementation verification is recorded below. Earlier full-flow results
retain their original deployment/source boundary; no new full monolith/browser
E2E or settled CPU improvement is claimed for the final Redis reader.

## Blocking Redis telemetry reader — 2026-10-09

Deployed **Helm revision 123**. One canonical identity-owned reader now waits on
all eligible telemetry streams using blocking XREAD; the minute processing
trigger only checks memory and retains existing admin admission/timing rules.
Each stream buffers at most one existing-size batch, with suspended groups
excluded from more reads until their batch is processed. Other groups continue
independently. Read failures back off; shutdown interrupts the owned thread.

Durable stats/monitoring cursors are checked separately after admission to avoid
reapplying a prefetched batch committed by another instance and to resume a
partial projection commit. Startup begins at the earlier cursor. No schema,
Terraform or Helm runtime override is needed. Details and remaining timed work
are in [polling audit, section 10](DATABASE_POLLING_AUDIT.md#10-p16-blocking-multiplexed-redis-telemetry-reader--2026-10-09).

**28 focused standard JUnit tests passed**, including blocking-thread isolation,
shutdown, bounded buffering, suspension, multi-stream independence, removed
scopes, duplicate-prefetch suppression and partial commit recovery. Offline
identity bootJar build, source assembly audit and Helm lint passed. Only the
identity image changed; packaging disabled network/pulls. The existing upgrade
guard restarted all six Java workloads. Support services and volumes remained.
All 15 pods returned Ready. Live Redis inspection confirmed identity's blocked
XREAD connection separately from chat. All six mode/group passes completed and
stats/monitoring durable cursors matched on new deployment-time records. Startup
owner failures recovered automatically. No full browser/monolith E2E or
post-change settled CPU improvement is claimed.

## Admin telemetry empty-work suppression — 2026-10-09

Deployed **Helm revision 122**. The canonical telemetry worker skips unchanged
empty batches before job admission/history writes. Graph/profile projections
refresh only after source invalidation or UTC rollover; ordinary telemetry can
update its counters without a full graph rebuild. Existing admin schedules and
atomic admission remain authoritative. Self start/success telemetry is omitted;
job history, runtime publication and self-failure telemetry remain.

Queue snapshots are not saved when unchanged; background source/write failures
retain pending reconciliation instead of silently persisting zero. The existing
Mongo change-stream transport handles invalidation, mode isolation and reconnect.
See [polling audit, section 9](DATABASE_POLLING_AUDIT.md#9-p16-skip-unchanged-telemetry-projections--2026-10-09)
for semantics, remaining reads and freshness limits.

Verification: **22 focused standard JUnit tests passed**, source assembly audit,
offline identity/communication bootJar builds and Helm lint passed. Only the two
affected images were rebuilt (`--network=none --pull=false`) and transferred
locally; other images hit the guest cache. The existing coordinated upgrade
guard restarted all six backend workloads. Support services/data volumes and
Terraform settings were unchanged. All workloads returned Ready with zero new
backend restarts. Startup remote-owner failures were recorded and automatically
recovered in all six telemetry scopes on the next scheduled pass.

Live observation after startup reconciliation: the graph-refresh request counter
stayed **12** across the next full minute, and **all six** telemetry job timestamps
remained unchanged. Admin enabled/timing settings matched the pre-deploy values.
See [the CPU report](IDLE_CPU_PROFILE_2026-10-09.md#admin-telemetry-empty-pass-correction--helm-revision-122)
for measured boundaries and the transient admin-badge invalidation during recovery.

No full browser/E2E campaign or matched warmed-up CPU comparison is claimed.

## Kubernetes-owned runtime status and shared SSE — 2026-10-09

Deployed **Helm revision 121**. Kubernetes-only discovery code and packaging live
in `microservices/runtime-status`; Helm owns the namespace-scoped EndpointSlice
list/watch permission. The existing receiver is reused with a build-time state
source. Six backend heartbeat publishers are disabled only in Helm. Live guest
inspection found **zero Java runtime-status publisher threads**. Canonical
monolith / Compose / E2E pushes, credentials and twenty-second leases remain.

The browser uses the shared status SSE endpoint: initial snapshot, aggregate
changes and recovery, with transport-only pings every fifteen seconds. It no
longer fetches runtime status every ten seconds; the existing local timer only
retries safe navigation after transient UI blockers. Both sources expose the
same `ready`, `known`, `checkedAt` snapshot. Kubernetes observation loss marks
state unknown, and reconnect reconciles authoritative discovery state. Browser
connection failure / a silent 45-second stream cannot retain a stale green state.

Verification:
- Canonical receiver tests and the microservices adapter's five Go cases pass:
  leases, SSE expiry/recovery without heartbeat duplication, redundant pod loss,
  last-ready/terminating endpoint loss, unknown state, list/watch resourceVersion,
  projected-token rotation, watch error 410 and interrupted observation.
- **16 frontend tests pass**, including no periodic fetch, pushed failure and
  recovery, popup protection, disconnect and silent-stream reconnection.
- **2 packaged monolith HTTP tests pass**, including credentials, multiple
  services, real twenty-second expiration and receiver restart. This is not a
  full monolith E2E campaign.
- **61 infrastructure tests pass**, Helm lint and shell/Python syntax pass.
- Optimized Angular bundle and both receiver variants build offline from cached
  dependencies. Only one changed frontend image was transferred to the guest;
  no Java or supporting-service image was rebuilt. Six Java pods restarted once
  to apply the heartbeat-disable environment setting. All seven changed pods
  became Ready with zero restarts; support workloads and data volumes remained.
- Live HTTP/SSE through public nginx observed `ready=false, known=true` while
  backends started, then a single `ready=true` transition 30.3 seconds into the
  observation. Healthy watch renewals produced no aggregate state flapping.
  Kubernetes credentials and object details are absent from the public stream.

The first adapter packaging attempt used an overly broad Docker build context
and failed on permissions in an existing Mongo data directory. The final
version uses only the adapter directory plus the canonical receiver as a named
context; no data permissions or database files were changed. The first Python
unittest invocation used the wrong import root; the versioned script invocation
passed all 61 tests. No full browser-operated flow or new CPU improvement is
claimed; the Java processes have just restarted.

Evidence: `/tmp/myscoutee-kube-status-{package,monolith-http,infra-tests,deploy}.log`,
`/tmp/myscoutee-kube-status-ui-tests2.log`, and
`/tmp/myscoutee-kube-status-live-sse.log`. Build/deploy remain the existing
`lab.sh frontend-image` / `workloads.py lock-images` / `workloads.py up` paths.
No Terraform VM setting changes are required; RBAC/runtime changes are versioned
in their Helm owner. Parent and frontend submodule source changes remain uncommitted.

## Reduced heartbeat cadence and empty work guards — 2026-10-09

Deployed **Helm revision 120**. Backend readiness publication is **5 s** with a
**20 s** receiver lease; HTTP timeout stays 1 s. The receiver tolerates missed
publications and still expires crashed publishers; graceful shutdown sends DOWN.
Browser refresh and snapshot-age rules are unchanged. Chat's empty blocking
Redis wait is **10 s**, including dev/E2E Compose defaults; its override remains.

Four empty scheduler paths reuse `MongoChangeStreamService.watchPresence`:
moderation, event watching, promotional planning and the basket-expiry owner.
Only candidate presence is retained per database, not admin schedule/enabled
settings. Future work, moderation recovery effects and running campaign
cancellation remain eligible. Active work still uses current authoritative
admin rules and claims; the cheap minute timer remains. Basket-owner HTTP and
admin telemetry's time-derived refresh remain explicit limits. Details are in
[the polling audit](DATABASE_POLLING_AUDIT.md#8-empty-scheduled-work-suppression--2026-10-09-follow-up).

Verification passed: focused standard JUnit suites for shared stream lifecycle /
presence / database aliases, moderation including admin re-enable, event watches,
promotional planning, checkout baskets, runtime publication and owner scheduling;
Go receiver lease tests including still-ready at 15 s and expiry at 20 s; two
packaged HTTP/credential/restart tests; changed Compose configuration validation;
all six assembly/JAR ownership checks and Helm lint. Serial offline builds used
cached layers. Only six affected Java images and frontend packaging changed;
Angular and supporting images were not rebuilt. Seven locally built images were
transferred to the existing guest cache. No external image download was required.
All workloads Ready after rollout; new Java/frontend pods have zero restarts.

Actual packaged Spring/Lettuce against isolated Redis: empty wait **10,250 ms**;
concurrent SET/GET **5 ms**; XADD-to-read wakeup **5 ms**; interrupted blocking
reader exits within the two-second assertion. The client default command timeout
exceeds the chosen block duration. Test container/data were removed. This is a
client/transport proof, not a browser-to-browser chat latency claim.

Startup observation: notification-outbox emitted five remote-owner retry warnings
while the coordinated Java rollout was coming up (last at 13:42:42Z). No further
worker failures appeared in the latest two-minute check at 13:45:51Z. All new
Java/frontend pods remained Ready with zero restarts; no presence-query failures
were observed.

Live 71.7-second observation after rollout: **no new runs** for basket purge,
moderation, event watching or promotional planning in any of the six REAL/DEMO
group scopes. **Admin telemetry advanced in all six scopes** and public runtime
readiness stayed true. Redis recorded **13 total XREAD calls** in this interval
(includes admin and chat consumers), with zero command failures. This validates
empty-pass suppression; it is not a post-warm-up CPU benchmark. Before rollout,
both databases had zero watched subscriptions, withheld/pending moderation and
basket items; REAL had zero enabled campaigns and DEMO had six. Existing static
email capability gates still apply to those DEMO campaigns.
Evidence: `/tmp/myscoutee-idle-presence-live.json` and
`/tmp/myscoutee-idle-presence-before.json`. No live fixture mutation or browser
workflow was performed; admin re-enable behavior is covered by focused tests.

## Accepted idle baseline and periodic activity attribution — 2026-10-09

The user accepts the measured approximately 8% whole-host baseline. Follow-up
scope is identifying small recurring work, not eliminating every fluctuation.
Read-only job history confirms five rules running every 60–61 seconds in six
REAL/DEMO group scopes; Mongo logs confirm minute storage checkpoints. Existing
Prometheus counters identify owner admission/due checks, job telemetry and admin
queue/graph reads. Observer, health, scrape and stream timeout cadences are mapped
in the [CPU report](IDLE_CPU_PROFILE_2026-10-09.md#periodic-activity-identified-after-the-accepted-8-baseline).
No new code/runtime change, build, restart or ongoing profiler was introduced.
This establishes recurring work sources, not exact per-route CPU attribution.

## Idle CPU continuation: direct support probes — 2026-10-09

Deployed revision **119**: MCP, registry and payment simulator probes call
existing `/healthz` endpoints directly from Kubernetes, preserving 2/10/30-second
startup/readiness/liveness periods. STUN keeps its protocol check. Helm lint and
live endpoint checks pass; all workloads Ready. Only three support pods changed;
Java/frontend pod identities and images are unchanged. No build/download ran.
The configuration is persisted in Helm; no VM/Terraform setting changed.

Matched-length 60-second observations: MCP **0.452 → 0.015%**, simulator
**0.387 → 0.015%**, registry **0.828 → 0.568%** of one core. Guest pod aggregate
**21.139 → 17.751%**; QEMU **69.153 → 63.078%**. The complete host averaged
**8.09% of 12 logical CPUs** after rollout. These are live observations with
sampler overhead and changing background activity, not a claim that the entire
difference is caused by this patch. See the full
[CPU report](IDLE_CPU_PROFILE_2026-10-09.md) for attribution and limits.

No JIT flags changed. Admin telemetry's Redis conversion remains open: its
current rule-gated pass also owns time-derived refreshes and emits its own job
telemetry. Blind event-triggering would introduce self-wakeups. No rule,
counter refresh or observability was removed to claim lower CPU.

## Backend-published frontend readiness — 2026-10-09

The user required backend-to-frontend publication. The earlier gateway health
sampler implemented the opposite direction and is replaced, not retained as a
fallback. Canonical `RuntimeStatusPublisher` checks only its own in-process
Actuator health and POSTs a scoped lease to the frontend receiver. The existing
public JSON/SSI/browser contract stays in place. Missing publishers expire after
ten seconds; receiver restart starts unavailable. The small Go receiver performs
no outbound health requests, no periodic scan and no database work. Health work
runs outside the application's shared job scheduler. Local backend health
sampling and Kubernetes probes still exist; this does not claim all health
checking has disappeared.

Durable owners: canonical Java; nginx receiver/image/route; dev, prod and E2E
Compose; Helm publisher environment, private ClusterIP and scoped Secrets;
existing lab credential and image-lock owners. VM hardware and Terraform need
no change. Compose credentials use a dedicated generated volume, read-only in
the backend. Existing business volumes and browser adapters were not changed.

Verification: Go lease/auth/body-bound/old-instance/restart unit checks;
two focused Java HTTP tests; real packaged receiver HTTP/auth/expiry/restart
tests with networking disabled, including generated Compose credentials readable
by a non-root backend user and retained across receiver restart; nginx transport
policy and SSI tests; all three
Compose files validate; Helm lint passes; 61 infrastructure tests pass; all six
Java JAR ownership audits pass. Compilation/packaging was serial and offline,
using cached images; only six affected Java images and frontend packaging were
rebuilt. Angular and support images were not rebuilt. Helm revision **118** is
deployed: all six backend Deployments and frontend Ready, zero restarts in the
new containers. Live runtime status changed from false during startup to true
only after the six publishers were available. Public POST returns 403; private
unauthenticated POST returns 401. Frontend process inspection shows nginx plus
the receiver, with no shell health-probe loop.

Frontend cgroup CPU after rollout: **0.291% average / 2.480% maximum** over
30 one-second samples, working set **5.34 MiB**. The earlier 180-second sample
was **2.91% average**, working set **3.3 MiB**. These are different observation
windows; they support a narrower frontend observation, not a matched whole-VM
benchmark. JVM restart/warmup makes an immediate overall CPU comparison invalid.
Raw logs: `/tmp/myscoutee-runtime-status-{junit,http,nginx,infra-final,rollout}.log`;
CPU: `/tmp/myscoutee-runtime-status-frontend-cpu.json`. Full dev/prod/E2E stacks
and browser business flows were not launched for this change.

The earlier JIT question remains a separate tuning decision: images already
use `-XX:ActiveProcessorCount=2`, and the captured JVMs each had a C2 worker.
Limiting compilation to C1 can remove C2 compilation peaks, but may worsen
steady request throughput/CPU; no such JVM default has been changed without a
matched latency/throughput measurement. Redis administrative telemetry remains
the queued stream follow-up; total idle CPU is still an open investigation.

## Backend cache freshness / stream rollout — 2026-10-09

The complete backend cache inventory and per-owner findings are recorded as
C01–C20 in [DATABASE_POLLING_AUDIT.md](DATABASE_POLLING_AUDIT.md#7-backend-cache-freshness-audit--source-corrections-and-verification).
Confirmed defects fixed: cross-mode/workspace profile snapshots, indefinite
translation and integration-endpoint caches, alias refresh, stale scheduler
metadata, exchange-rate load/eviction races, branding fallback scope, remote
Firebase activation and S3 bucket-existence memoization. Job configuration saves
refresh before returning; other-instance changes use stream invalidation, and
actual work admission remains an authoritative Mongo operation.

Focused standard and embedded JUnit checks pass, including an isolated real
replica-set change stream, external job-rule enable/delete and delivery after
a server-killed cursor. Four focused
bootstrap HTTP suites pass (recovery commands, administrator settings, bundle
localization and message translations). All six affected Java assemblies built
serially offline and passed JAR domain-ownership checks. Docker packaging reused
cached runtimes with network disabled; frontend/support images were not rebuilt.
Helm revision **117** is deployed: six backend Deployments Ready, no backend
container restarts, Mongo StatefulSet 2/2 Ready. All six services have their two
REAL/DEMO change-stream cursors open (12 total). The affinity init gate waited
for identity/community readiness and its JVM started without crashing. Initial
remote-owner unavailability was retried during startup. Subsequent logs across
all six backends contained no repeating change-work failure or disconnect.
A later 30-second sample measured QEMU 81.97%, JVMs 19.04%, Mongo 6.00%, and
separate Prometheus/Grafana 0.45%/1.63% (100% = one core). The pre-expansion sample
was 88.17% / 24.10% / 8.16% respectively, but the later JVM total still includes
8.55% compiler-thread CPU. A subsequent 30-second window instead measured
QEMU 98.81%, JVMs 28.30% (including 9.20% compiler threads), Mongo 8.32%, and
Prometheus/Grafana 0.46%/1.72%. The windows fluctuate: **sustained total CPU
improvement is not established**. Host System Monitor itself used 8.88% of one
core in the earlier window; desktop/VS Code processes are separate from VM and
monitoring CPU. This is not full business-flow QA.

## Idle CPU investigation — 2026-10-09 (OPEN)

Latest synchronized host/guest attribution: [three-minute CPU profile,
11:11–11:14 Europe/Prague](IDLE_CPU_PROFILE_2026-10-09.md). Guest pods averaged
27.15% of one core combined. QEMU averaged 73.33% including the guest; host
monitoring containers 2.11%; other host work 59.58%. The largest host spike
was dominated by VS Code; a separate VM spike included 71.4% in Java compiler
threads. Guest k3s/container runtime and the gateway's two-second six-backend
health loop are identified separately. No runtime setting changed for this
measurement; temporary diagnostic samplers have exited.

The high idle CPU report is **not resolved**. Lower observer overhead and fewer
empty job writes are verified separately; neither proves acceptable total idle
consumption. CPU percentages below use **100% = one logical CPU core**, not the
whole twelve-thread host.

1. **Verified: empty local work gates.** Canonical webhook delivery now checks
   due `PENDING`/`RETRY` work and expired `SENDING` leases once per REAL/DEMO
   database before workspace orchestration. Affinity recompute and timed Mingle
   advancement likewise skip orchestration when no due work exists. Existing
   tick intervals, ownership, rule admission and work claims remain in place.
   The webhook due check uses `integration_webhook_delivery_due`; empty live
   queries examine zero documents/keys. All three queues had no due work in
   either database after revision 108.
2. **Verified: empty scoped jobs produce no run bookkeeping.** Encounter
   publication and event cancellation prepare their existing scoped work lists
   before claiming a scheduled job, then reuse those same lists. Empty lists
   cause no run history, progress broadcast or job telemetry. The shared
   `NotificationJobs.runScheduledGroup` extracts the existing admission/history
   implementation; no second scheduler or wire endpoint was introduced. These
   workers still poll for work; remaining scope lookups are not eliminated.
3. **Verified: observation stays at one-second CPU resolution.** The final
   terminal uses one persistent SSH connection and reads container cgroup CPU
   deltas and memory counters directly. Host monitoring uses the same counter
   method instead of launching `docker stats` each frame. Kubernetes/Docker
   inventory refresh every five seconds; VM identity metadata every 30 seconds.
   Replaced containers need fresh counter pairs. Stream waits do not hold the
   VM lifecycle lock. Temporary ten-second CPU display and kubelet-summary
   sampling were replaced after the user required the original visibility.
   The guest observer used 0.9% of one core in a bounded ten-second sample.
   The transient old-launcher/new-script permission error was corrected; the
   current guest reader starts through the existing authorized sudo path.
4. **Verified: external monitoring is separate.** A bounded Prometheus/Grafana
   ON/OFF/ON experiment left applications unchanged and restored both monitors.
   VM samples were 130.2% / 147.0% / 128.8%; turning monitoring off did not show a
   VM reduction in these windows. Steady host monitor samples were approximately
   0.3–0.5% Prometheus and 1.1–1.6% Grafana (startup can cost more). Internal
   application operational telemetry is a different source of work and is not
   included in those monitor percentages.
5. **Verified: targeted build and local transfer.** The latest source change
   built only `:identity:bootJar :community:bootJar`, with Gradle `--offline`,
   `--max-workers=1`, and the existing cache. Both selected JAR ownership audits
   passed; only those two Docker images were packaged with cached runtime
   images, `--network=none --pull=false`. The versioned lock/stop/up flow deployed
   Helm revision **108**, all six backends and nine supporting deployments Ready.
   The coordinated upgrade guard still restarts backend processes; selective
   compilation does not bypass it. Other images hit the guest cache. During the
   107-second rollout, `virbr-msc121` transmitted **412,542,995 bytes**, while
   Wi-Fi received **368,292 bytes** and transmitted **323,402 bytes**. This proves
   that rollout's large image transfer stayed on the host-to-VM path; screenshots
   alone cannot retrospectively attribute every earlier network spike.
6. **Validation and remaining work.** The worker suite passed 21 focused JUnit
   cases (webhook, affinity, timed Mingle); the subsequent scoped-job suite passed
   eight (encounter retry/acknowledgment, empty/rejected admission, cancellation
   work sources, shared orchestration). Infrastructure tests passed **54 cases**,
   including one persistent connection, disconnection handling, CPU counter
   deltas/replacement, lifecycle-lock release, and terminal cleanup. No full
   browser/business-flow campaign was run. Initial 16-second versus final
   40-second sample rates: scheduled begins **9.74 → 2.27/s**, run records
   **8.61 → 1.07/s**, operational telemetry **17.22 → 2.75/s**. Other jobs remain
   included in these counters. After the latest restart the VM still measured
   **120.3%**. A later 40-second sample with the final one-second observer was
   **102.8% VM CPU**, including approximately **39.6% across the six Java
   backends** and **10.4% across the two Mongo containers**. Host monitoring was
   **2.1% separately**. These are short, unmatched warmup windows, not proof of
   a sustained reduction or acceptable idle usage; the remaining VM CPU is not
   yet attributed to individual infrastructure/kernel/virtualization owners.

7. **Verified: communication idle work (revision 109, retained in 111).**
   Only `:communication:bootJar` was compiled offline with one worker; only its
   image was packaged with the cached runtime, `--network=none --pull=false`.
   `ChatStreamConsumer` now uses a 1000-ms blocking Redis read instead of 100 ms.
   This is an empty-read timeout, not a delivery/batching delay: six temporary,
   isolated stream probes measured write-to-wakeup 0.96–1.53 ms (100 ms timeout)
   versus 0.68–1.07 ms (1000 ms timeout); all keys were removed. No end-to-end
   browser chat latency claim follows from that probe. Redis 30-second command
   rates: XREAD **6.648 → 2.124/s**, HELLO **5.457 → 0.929/s**. Notification
   outbox scheduling skips admission when no due work exists. Reconciliation
   only writes changed pending counts/units; all six REAL/DEMO outbox rule
   states remained identical across post-deploy snapshots. Sixteen focused
   JUnit cases passed, followed by the corrected due-rule admission test.
8. **Verified: StatefulSet conversion (revisions 110/111).** One controller,
   two stable pods and two separate retained claims replace the old two
   Deployments. `mongo_replica.py statefulset` owns the private fresh backup,
   UID/location-checked PV rebinding, content/index/count comparison, replica
   probe, restart and resumable receipt. Original DNS aliases remain intact.
   The rerun verified the replica without repeating conversion or restarts.
   The chart, seed helper, lifecycle and one-second observer are versioned.
   Both replica and standalone charts render; infrastructure tests pass 60
   cases. This changes controller ownership, not Mongo replication cost.
9. **KVM/container attribution remains OPEN.** Before the Mongo migration,
   a 30-second process sample attributed 25.51% to six JVMs, 8.75% to Mongo,
   10.22% to k3s, 2.10% to containerd and 0.97% to the guest observer. Host QEMU
   used 86.66% in that sample. A different settled 40-second window after the
   communication fix measured QEMU 97.64%, Java containers 33.89%, Mongo
   containers 10.23%, and host monitoring 1.81%. These windows are not matched
   controls. Do not subtract unrelated samples or call QEMU's entire CPU
   virtualization overhead: it includes guest execution. A post-migration
   sample still included heavy JVM startup and is not an idle baseline.
   A later settled 30-second sample after StatefulSet conversion measured six
   JVMs 22.12%, Mongo 5.89%, k3s 7.03%, containerd 1.73%, observer 0.77% and Redis
   0.40%. QEMU total was 66.87%, including 54.08% guest CPU; approximate
   non-guest CPU was 12.79%. These are bounded samples, not matched controls or
   proof of a KVM tuning benefit.
10. **Affinity change streams and polling.** Historical commit `bc0334785`
    (author date 2026-05-27, consolidated committer date in September) introduced
    the stream as opt-in: base default false, replica override true. It did not
    switch an existing true default off. The KVM replica topology later omitted
    that application override. Revision 112 enabled the stream, but still had
    six live subscriptions (three workspaces × two databases) and fallback
    polling. Revision 113 deployed one stream per database and disabled periodic
    fallback in both REAL and DEMO. Revisions 114/115 completed the two-database
    index initializer and remote-admission retry handling. Only affinity was
    rebuilt offline; other image references were reused. Opening a stream precedes startup/reconnect
    reconciliation; future tasks retain timers. Actual remaining work retries,
    including transient remote admission failure; an empty queue schedules no
    repeated task query. The 30-second Mongo await timeout does not delay a new
    event. Existing 250-ms affinity coalescing is separate from Redis/chat.
    Mongo can temporarily retain idle server cursors from stopped pods; count
    active subscriptions by the current affinity pod client address rather than
    treating every old idle cursor as current application activity.
11. **Normal replica defaults and retained overrides.** Dev, prod, E2E and
    packaged Compose now inherit their existing replica override automatically.
    The override files remain. A single-node Compose deployment has one Mongo
    process, with replica/oplog support; KVM retains two members. Shared bootstrap
    handles fresh volumes and existing standalone data with authentication and
    a persisted key. Five Compose resolutions, the packaged renamed override,
    and isolated cached-Mongo conversion/stream/restart/fresh-start checks pass.
    No image was pulled. Full source-only Debian packaging was attempted but
    stopped at the pre-existing unclassified-seed ownership gate (including
    landingSlides/helpCenterGuideFields); that gate was not bypassed. No new
    Debian artifact or rebuilt E2E Mongo image is claimed.
12. **Index and remaining-polling audit.** Affinity task indexes were incomplete
    across the two lab databases: REAL had the status index and DEMO the group
    index. The existing initializer now creates the documented indexes in each
    distinct configured database. No session routing, database role or wipe
    behavior changes. Seventeen focused affinity JUnit cases pass, including
    both-database index initialization, no periodic Mongo work in stream mode,
    startup/reconnect scope and pending-work retry termination; the admission
    failure case was subsequently rechecked in the seven-case stream suite.
    [DATABASE_POLLING_AUDIT.md](DATABASE_POLLING_AUDIT.md) lists 34 numbered
    scheduled paths with owners, default cadences, data and follow-up boundaries.
    It distinguishes business deadlines, empty polling, Redis/STUN and monitoring.
    The other listed polling paths have not been blanket-disabled.
    Live revision-115 check: zero pending affinity tasks in both databases and
    two active stream `getMore` operations from the current pod. Over 30 seconds,
    task index access counters increased only by the one explicit diagnostic
    `countDocuments` per database; all other task indexes had zero increments.
    This supports the no-idle-task-read result alongside the worker guard tests;
    it does not mean the whole affinity process or Mongo is idle.
    Final rollout reached six Ready backends. Affinity restarted twice while its
    existing `UserRatesService` startup remote read returned UNAVAILABLE before
    the dependency was ready; it then started successfully. Revision 116 added
    the dependency init gate; the full revision-117 restart verified it with zero
    affinity container restarts.

13. **Final bounded CPU observation (revision 115).** The first 30-second window
    after rollout still included substantial JIT startup. A subsequent window
    measured QEMU **92.15%**, six Java processes **31.90%**, both Mongo processes
    **8.46%**, k3s **9.76%**, containerd **2.16%**, guest Python observation
    **1.07%** and Redis **0.57%**. Host Prometheus was **0.44%**, Grafana **1.52%**,
    separate from QEMU. Java compiler threads still accounted for **11.63%**
    inside Java's total, so this is not a fully quiescent baseline or a matched
    before/after claim. Process `/proc/*/stat` deltas over one shared 30-second
    guest interval supplied process CPU; host cgroup `cpu.stat` deltas supplied
    monitoring CPU. QEMU guest-time accounting differed from user-time deltas
    in this short window; do not derive virtualization overhead by subtraction
    from this final sample. The high idle-load investigation remains OPEN.

**Durable configuration ownership:** VM CPU/memory, hardware type, virtio disk
and network belong to `infra/terraform/main.tf`; guest OS configuration belongs
to the versioned `infra/guest`/cloud-init inputs; Kubernetes workloads, probes,
resource limits and PVC policy belong to `deploy/chart`; application wait and
worker behavior belongs to canonical Java/configuration. Never leave a proven
fix only in a live `virsh`, `kubectl`, sysfs or shell command. Document bounded
experiments and restore rejected settings; promote only measured improvements
to their existing configuration owner. Private backups/credentials stay out of Git.

**KVM configuration audit:** live XML matches Terraform's KVM acceleration,
`host-passthrough` CPU, four vCPUs and virtio I/O; there is no emulated VGA/display.
Host `halt_poll_ns` is 200000 ns; the guest's current cpuidle driver is `none`.
The available governor parameter alone does not prove active guest halt polling.
The subsequent bounded experiment below restored the original setting; no
permanent host/guest halt-poll change has been adopted.
[Linux KVM documentation](https://docs.kernel.org/virt/kvm/halt-polling.html)
explains the latency/CPU tradeoff and per-VM capability. A bounded comparison
must keep workload, observer, monitoring and warmup fixed, measure guest CPU
and QEMU host time separately, and also check request latency before adopting a
setting. The installed QEMU 6.2 lacks `query-stats-schemas`; this is a diagnostic
limitation, not evidence that polling caused the observed CPU usage.

**Bounded KVM halt-poll experiment (revision 117):** libvirt's cumulative
`cpu.haltpoll.success.time` / `fail.time` counters permit direct attribution.
All four guest vCPUs initially exposed `MSR_KVM_POLL_CONTROL` (`0x4b564d05`)
with value `1`. A guest-local Python process cleared only bit 0, waited 70
seconds and restored each original value in `finally`. Host-global
`halt_poll_ns`, application settings, pod counts and monitoring were untouched.
The [kernel MSR contract](https://cdn.kernel.org/doc/html/latest/virt/kvm/x86/msr.html)
defines this per-vCPU host-poll control. Thirty-second samples, with
100% representing one core:

| Phase | QEMU total CPU | Successful halt polling | Unsuccessful halt polling |
| --- | ---: | ---: | ---: |
| Original setting | 74.50% | 3.33% | 2.20% |
| Polling disabled, first window | 64.30% | 0.00% | 0.00% |
| Polling disabled, second window | 71.22% | 0.00% | 0.00% |
| Original setting restored | 70.08% | 3.48% | 2.20% |

This attributes about 5.5 percentage points of one core to active host waiting;
it does not explain the remaining VM load. Total CPU fluctuates, and application
latency was not measured in this experiment, so **no new default is justified
yet**. Readback confirmed value `1` on all four vCPUs afterwards. All pods were
Ready; the six backend containers and both Mongo members still had zero restarts.
Raw local evidence: `/tmp/myscoutee-haltpoll-ab.jsonl`. The table is the durable
record; the temporary file is not required to understand the result. No VM,
application or image rebuild/restart/download was required. Terraform was not
changed for a temporary setting that was restored.

A separate post-restoration 30-second process sample measured six JVMs at
16.27% combined, Mongo at 7.69%, k3s at 10.82% and containerd at 2.00%.
Prometheus/Grafana were 0.47%/1.67% separately on the host. QEMU measured 81.18%
over the enclosing host interval, which also includes guest process discovery;
do not subtract the narrower guest sample to label the difference as pure
virtualization overhead. Java compiler activity was still present. Local raw
evidence: `/tmp/myscoutee-idle-current.json`. The remaining idle-load work stays
open; these are attribution samples, not proof that the user's CPU problem is
resolved.

**Administrative telemetry follow-up:** P16 still reads its existing Redis
stream on a scheduled pass and refreshes graph/profile/menu projections even
when the stream is empty. An event-driven continuation must preserve durable
cursors, REAL/DEMO and group boundaries, admission rules, startup/reconnect
catch-up and time-dependent counters. It is queued, not implemented. Two REAL
admin-telemetry rules were observed with old `running` claims; the existing
two-hour stale-claim protection can delay their recovery after worker loss.
No live claims or claim-duration settings were modified. A five-minute
Prometheus window also showed approximately 1.58 scheduled-admission, 0.84 due,
0.65 group-discovery and 0.93 operational-telemetry HTTP calls per second;
cached negative DB checks do not eliminate those owner-to-owner requests.

**Continuation targets:** attribute remaining application CPU by worker/thread;
examine repeated workspace-base lookups (~4/s in the last sample), notification
outbox accounting, periodic administrative snapshots and health/probe work.
Measure Mongo primary/secondary and k3s/guest/virtualization overhead separately.
Preserve one-second CPU visibility and distinguish warmed idle samples from
builds, rollouts and JVM compilation. An assets sample had no business HTTP
requests despite nonzero CPU; health checks and local recovery scans must not
be reported as asset uploads. Do not rebuild unrelated services.

Raw interval counters, monitoring comparison, and network samples are in ignored
`build/reports/webhook-idle/`. Focused logs are `/tmp/myscoutee-idle-workers-tests.log`,
`/tmp/myscoutee-empty-job-tests.log`, `/tmp/myscoutee-selected-idle-build.log`,
`/tmp/myscoutee-selected-idle-images.log`, and `/tmp/myscoutee-empty-jobs-deploy.log`.

## Current finalization queue

**Latest matched control:** actual pre-domain source `5a23e829f` versus current code, same seed/scenarios and cold → warm sequence: events 16.82 → 17.25 req/s (p95 467.8 → 438.5 ms); sweep 25.60 → 26.62 req/s (237.3 → 218.5 ms), zero errors/skips. This supersedes the earlier cross-date regression interpretation below. The complete monolith functional suite remains 95/95. KVM and monolith run serially.

1. **DONE:** Same-scenario monolith comparison saved in `MONOLITH_COMPARISON.md`; original monolith measurements reused.
2. **DONE:** Live contact-worker termination recovery without API replay; 44 commands/intents, 20 extra cycles, owned cleanup.
3. **DONE:** Two-member shared Mongo conversion, private backup/hash/count checks, majority-write/secondary-read verification, idempotent rerun.
4. **DONE:** Controlled Mongo quota experiment: 2 → 3 cores, same process; 9.44 → 11.73 req/s. Final two-member warmed runs: events 5.41 req/s / 1884 ms p95, sweep 12.82 req/s / 704 ms p95, zero failures/skips. Replica-set performance regression explicitly retained.
5. **DONE — MSC-120 OBSERVED FLOWS + AUDIT:** DEMO selection must navigate after preparation; the internal avatar owns the existing 1.5-second profile load. Baseline measured 1.7 seconds of extra waiting in the selector; lazy JS downloads were 2–3 ms each. No new popup indicator retained. Selection-only browser verification: 515 ms navigation with the existing internal avatar ring. New timing report: profile/card work ran after the emulation; both now overlap it, with 111 focused tests PASS after aggregate-read and requested-account cache coverage. Latest production browser sample: 780 ms navigation, about 1.6 s avatar/card loading, unchanged 3 s display window; cold social-card distance CPU 1174 → 13 ms. Full frontend static audit is in `guides/plans/FRONTEND_LOCAL_DELAY_AUDIT.md`; other serial candidates are documented, not silently rewritten. Default test compilation separately reports four pre-existing missing `startAtIso` fixture errors in `community-cases.service.spec.ts`.
6. **DONE:** Regenerated the branded 28-page English guide, identical frontend copy, and root README table. Cover and comparison-page rendering checked.
   **Resolved runtime blocker:** after VM restart, both Mongo members had reported replica-set ghost/no primary and the six-backend rollout had failed. Public/write checks did not run. Headless member DNS plus startup DNS readiness fixed the bootstrap race. After another complete VM stop/start, Mongo is PRIMARY/SECONDARY without reconfiguration or data reset. Final backend rollout is Ready at revision 101; all 20 public/content checks pass. Final contact-write/replay recheck passes: 8 commands, 8 notification intents, 12 replays, sessions revoked and fixture cleaned. All seven native browser checkpoints pass, including login, event/explore, Work/Dating switching and logout. All six Prometheus targets are UP and Grafana is healthy. Logs: `/tmp/msc121-final-{restore,public,business,browser,monitoring}.log`.
7. **DONE — MATCHED DOMAIN CONTROL:** Current-source monolith functional E2E passes 95/95, including mutations. With KVM stopped, the actual pre-domain source and current code used the same cold → warm scenario sequence. Warm events: 16.82 → 17.25 req/s, p95 467.8 → 438.5 ms; warm sweep: 25.60 → 26.62 req/s, p95 237.3 → 218.5 ms. Zero failures/skips. The prior cross-date gap was not proof of a domain regression; all original and partial samples remain documented in `MONOLITH_COMPARISON.md`.
8. **DONE:** Task classification is recorded in `guides/plans/MSC120_121_TASK_REVIEW.md`. MSC-120 is closed after its sampled domain compatibility/performance acceptance; MSC-121 is closed as playground delivery. Feature tasks MSC-115/116/117/119 retain separate QA; MSC-118 was already closed. Components/template extraction is MSC-122, not implemented by this session. The frontend-local audit covers all 237 identified locations; the observed flows are fixed and verified, while other static candidates are explicitly not claimed as individually tested or rewritten.


**Accounting and Git:** both task token fields are updated from deduplicated response usage with explicit cutoffs and mixed-thread attribution limits. The roadmap heatmap retains every September-30-or-earlier value and appends available October 1–8 account rows (42,021,772,157 recorded tokens). The GitHub Pages production bundle is rebuilt; backup commits are consolidated and pushed with expected-SHA leases. Raw benchmark artifacts remain outside Git.

## What the numbers mean

- **21 domains** are assigned exactly once to **6 backend deployments** in [assemblies.json](assemblies.json); all are included.
- **183 transport bindings** are interfaces, not domains or full user flows. All **184 OpenAPI schema graphs**, including delegation, compile. HTTP evidence still does not cover every binding.
- **219 adapter cases pass** in the latest full shell run. The source-batch standard suite passed **1691** cases; **81 embedded cases** passed across the group run and focused email rerun. The subsequent CPU refinement passed **16 focused standard cases**, including one newly added owner-gate case.
- The original 96 source candidates were an investigation inventory, not missing domains. No unbound candidates remain in the implemented inventory; artifact ownership and all six real Spring contexts pass.

## Completed verification sequence

The user requested finishing source work through 20 before JUnit/deployment/PDF. That source phase is closed; verification followed it rather than restarting the earlier milestones.

- Infrastructure: **41 PASS** (`/tmp/msc121-source-batch-infra.log`). Schema compilation: **184 PASS** (`/tmp/msc121-source-batch-schemas.log`).
- Canonical standard suite: **1691 PASS** (`/tmp/msc121-source-batch-junit-final.log`). Embedded: 72 passed in the group; nine email cases passed after repairing test wiring and the real random component in the stable lifecycle task key (`/tmp/msc121-source-batch-email-recovery-2.log`).
- All six Spring contexts passed (`/tmp/msc121-source-batch-contexts.log`); temporary context containers/tunnel removed. Latest six JARs, artifact audits and all **219 adapter cases PASS** (`/tmp/msc121-cpu-assemblies.log`).
- CPU refinement: **16 focused tests PASS** (`/tmp/msc121-cpu-junit.log`). Shared scheduled orchestration now uses the existing atomic scheduled claim directly; affinity layout uses one owner call instead of find/due/claim. Cadence, scope, disabled/not-due rejection and lease exclusion are preserved. Communication CPU samples were about 0.15 cores before and 0.13 cores after warmup/checks (25 seconds each, no throttling); these short samples do not establish a sustained percentage improvement. The direct call-count improvement is 2 → 1 per due shared scheduled pass and 3 → 1 per due affinity layout pass.
- Immutable images built once using cached layers, locked, imported and deployed. Startup performs no build; support image cache hits were retained. Latest rollout: `/tmp/msc121-cpu-deploy.log`.
- **19 public/content checks PASS**, native DEMO login, seven authenticated reads across all assemblies and own-session logout PASS. Final read stress exercises that authentication/routing on the latest images.
- **Contact mutation sample PASS.** Both identity pods served writes (9 / 7); four durable commands, four notification intents and twelve approval replays passed. Sessions were revoked, the extra replica removed and the receipt-owned fixture cleaned.
- Support capabilities/private routes, STUN UDP/TCP, canonical registry seed and simulator provider configuration PASS (`/tmp/msc121-source-batch-support.log`). MinIO: **all 879 canonical files** match packaged and stored SHA-256 hashes; unique write/read/delete probe PASS (`/tmp/msc121-source-batch-minio.log`).
- **Final bounded stress PASS:** 3,790 authenticated requests in 60.04 seconds with eight clients, zero errors and 63.12 requests/second; per-route p95 137.24–323.35 ms. Both assets replicas served successful reads, without added restarts. Session revocation and replica restoration passed.
- English HTML/PDF, its frontend documentation copy and the root README guide-table entry refreshed with these results and the established M branding.

## Recovery and qualification boundaries

Implemented and tested native recovery covers durable contact commands and owner receipts; profile status/affinity/support intents; root-event membership and feedback counter work; run-bound job claim/restore/completion receipts; asset/event lifecycle journals, revision-fenced attachments and stable email occurrences. Integration imports preserve deterministic objects on unknown outcomes; accepted payment fulfillment is not automatically refunded merely because receipt persistence failed.

The contact sample does **not** qualify every checkout, role/workspace, browser or publication side effect. A live contact-worker termination now recovers accepted work without API replay; 20 additional request/reject cycles complete with 44 commands and 44 notification intents. Broader write scenarios remain unqualified. The unchanged monolith stress scenarios have now run against microservices; see [MONOLITH_COMPARISON.md](MONOLITH_COMPARISON.md). This is a same-scenario workload comparison, not a saturation-capacity measurement. External provider delivery remains at least once; automatic import-orphan garbage collection is not included. These limits do not imply missing source domains or an unfinished deployment.

## Transport scope

The shell implements actual application HTTP endpoints and clients; OpenAPI describes those implemented boundaries. This is currently existing-code-first, not a standalone contract-first specification project. Kubernetes Service/DNS provides addressing and routing, not Java method remoting. Domains in the same assembly continue to call native beans locally. The source inventory is not an instruction to expose every interface or method: reuse existing contracts and narrow only the operations that really cross an assembly boundary.

## Numbered acceptance milestones

| ID | Status | Deliverable and completion evidence |
| --- | --- | --- |
| 1 | VERIFIED — infrastructure | Explicit-start headless KVM/k3s lab; versioned Terraform/setup/cleanup/terminal scripts and host autostart controls. Existing VM lifecycle verification; scripts under `tools/` and `infra/`. |
| 2 | VERIFIED — build | All 21 domains packaged into 6 independent artifacts; no foreign business implementations. Latest `lab.sh jars` build and `build/reports/assemblies.json` ownership audit pass. |
| 3 | VERIFIED — image lifecycle | Six independent immutable backend images locked/imported; revision 90 uses them. Cached support images reused; startup never builds. |
| 4 | VERIFIED — support | 8/8 live supporting deployments ready: frontend, MongoDB, Redis, MinIO, STUN, MCP, registry, payment simulator. Checked with the existing Kubernetes helper at this snapshot. |
| 5 | VERIFIED — data imports | Canonical Mongo REAL/DEMO, MinIO media, registry and simulator initialization checked, including persistence/restart. Production landingSlides allowlist omission fixed; exact REAL/DEMO catalog migration and no-op rerun pass. Public API returns canonical slide metadata and all three image assets. |
| 6 | VERIFIED — live backend monitoring | Prometheus/Grafana and private guest metrics routing checked; all six backend up metrics equal 1. Per-pod HTTP counters prove requests reached both assets replicas during the sample. |
| 7 | VERIFIED — adapter boundary | Finish ContactPermissions: 5 HTTP tests pass; canonical NavigatorContactsService and embedded ChatOwnershipPersistence tests pass. OpenAPI response validation and images pass. Identity startup advanced to EventOwnership. The full contact workflow remains tracked separately in 16–17. |
| 8 | VERIFIED — source and Spring wiring | Zero unbound inventory candidates; all six artifact audits and real Spring contexts pass. Latest shell suite: 219 adapter cases. This is not all-business-flow qualification. |
| 9 | VERIFIED — Kubernetes startup | Identity: standalone JAR and real Spring context pass; Helm revision 90 deployment is 1/1 Ready. Public/authenticated flows remain 15–17. |
| 10 | VERIFIED — Kubernetes startup | Community: standalone JAR and real Spring context pass; Helm revision 90 deployment is 1/1 Ready. Public/authenticated flows remain 15–17. |
| 11 | VERIFIED — Kubernetes startup | Communication: standalone JAR and real Spring context pass; Helm revision 90 deployment is 1/1 Ready. Public/authenticated flows remain 15–17. |
| 12 | VERIFIED — Kubernetes startup | Assets: standalone JAR and real Spring context pass; Helm revision 90 deployment is 1/1 Ready. Public/authenticated flows remain 15–17. |
| 13 | VERIFIED — Kubernetes startup | Payments: standalone JAR and real Spring context pass; Helm revision 90 deployment is 1/1 Ready. Public/authenticated flows remain 15–17. |
| 14 | VERIFIED — Kubernetes startup | Affinity: standalone JAR and real Spring context pass; Helm revision 90 deployment is 1/1 Ready. Public/authenticated flows remain 15–17. |
| 15 | VERIFIED — public access and basic session | Canonical identity security reused; latest full shell suite has 219 passing cases. Revision 90 passes 19 public/content checks and six-route authenticated stress including owned-session cleanup. Broader role/workspace flows remain outside the sampled scope. |
| 16 | VERIFIED — implemented recovery boundaries | Native journals/receipts, optimistic versions, attachment ordering, stable email occurrences, conservative import outcome handling and accepted-payment receipt handling implemented; standard/embedded recovery and HTTP regression pass. Provider exactly-once and automatic orphan GC are excluded. |
| 17 | VERIFIED — sampled API flows; broader qualification open | 19 public/content checks; native DEMO login, seven reads, logout; disposable contact request/reject/approve/concurrent/replay checks pass. Managed browser landing, native DEMO login, event/explore popups, Work/Dating switches and logout pass. Unsampled checkout/publication/role flows are not claimed. |
| 18 | VERIFIED — sampled two-pod reads/writes | Both identity pods served writes (9 / 7); four durable commands, four notification intents and twelve approval replays passed. Sessions were revoked, the extra replica removed and the receipt-owned fixture cleaned. Both assets pods also served reads. Live owner-pod termination recovery also passes without API replay, with 44 total durable commands/notification intents across the extended check; all temporary routing, sessions and fixtures were cleaned. |
| 19 | VERIFIED — bounded stress | 3,790 authenticated requests in 60.04 seconds with eight clients, zero errors and 63.12 requests/second; per-route p95 137.24–323.35 ms. Both assets replicas served reads without additional restarts; cleanup passed. The original monolith event/read-sweep profiles also pass: 828 and 729 requests with zero failures. Observed throughput changes are −56.8% and −10.5%; the comparison is recorded separately. This is not stress-to-exhaustion or a production capacity claim. |
| 20 | VERIFIED — guide and PDF | English complete playground guide, M branding, architecture/operations/cleanup, service URLs and lab login, actual tests/limits; regenerated PDF linked from root README. |

## Deployment coverage and latest startup evidence

Current deployment snapshot: Helm revision 90, one replica per backend, all Ready after the scale check cleanup. This table supersedes the earlier startup-blocker snapshots; it is not a business-flow result.

| Deployment | Domains | Latest verified runtime state |
| --- | --- | --- |
| identity | accounts, access, administration, platform, operator, registry, integrations | 1/1 Ready on the new immutable image; full flow pending. |
| community | groups, community, events, campaigns, content, help | 1/1 Ready on the new immutable image; full flow pending. |
| communication | chat, notifications, email, localization | 1/1 Ready on the new immutable image; full flow pending. |
| assets | assets, media | 1/1 Ready on the new immutable image; full flow pending. |
| payments | payments | 1/1 Ready on the new immutable image; full flow pending. |
| affinity | affinity | 1/1 Ready on the new immutable image; full flow pending. |

## Latest runtime measurement

Versioned commands; runtime reports are ignored under `microservices/build/reports/`. This summary keeps reviewable results in Git.

```sh
python3 microservices/tools/check-public.py
python3 microservices/tools/check-session.py
python3 microservices/tools/check-business.py --two-identity
python3 microservices/tools/check-load.py --two-assets --seconds 60 --concurrency 8
```

| Native route | Requests | Errors | p50 ms | p95 ms | Maximum ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/api/activities/events` | 633 | 0 | 166.44 | 323.35 | 582.12 |
| `/api/activities/rates` | 631 | 0 | 130.62 | 240.25 | 458.78 |
| `/api/assets` | 631 | 0 | 72.54 | 137.24 | 533.94 |
| `/api/auth/me` | 631 | 0 | 108.23 | 192.07 | 285.03 |
| `/api/notifications` | 633 | 0 | 117.0 | 203.33 | 422.86 |
| `/api/payment-methods` | 631 | 0 | 108.17 | 211.14 | 350.67 |

Guest available memory: 4,703,704 KiB before / 4,252,492 KiB after. These are samples, not a peak. Latencies exclude warmup; per-pod counters include it. Only the check's own session was revoked. Final log: `/tmp/msc121-final-stress.log`.

## Historical implementation notes

The following transport inventory and incremental blocker notes are retained for traceability. Their old pending/startup statements are superseded by the current evidence and numbered milestones above.

### Earlier wiring and startup checkpoints

The earlier `injected_inventory()` read reported the following remaining injected API-type candidates. Counts are per assembly and can overlap; they are not domains, completed flows, or runtime evidence. Qualified/constructor/provider analysis still does not prove Spring-context completeness. The provider scan additionally exposed PaymentRefunds, CheckoutMemberships, ResourceAssignments and RoleAttentionEvents; their source transports are now included.

| Assembly | Remaining source candidates | Runtime status |
| --- | ---: | --- |
| identity | 0 | Assembly and real Spring context PASS; Kubernetes 1/1 Ready |
| community | 0 | Assembly and real Spring context PASS; Kubernetes 1/1 Ready |
| communication | 0 | Assembly and real Spring context PASS; Kubernetes 1/1 Ready |
| assets | 0 | Assembly and real Spring context PASS; Kubernetes 1/1 Ready |
| payments | 0 | Assembly and real Spring context PASS; Kubernetes 1/1 Ready |
| affinity | 0 | Assembly and real Spring context PASS; Kubernetes 1/1 Ready |

The conservative source inventory now has zero unbound injected API candidates in all six assemblies. All 183 bindings have draft OpenAPI documents. Client imports, ownership audits and credentials use the same declaration-aware reference rule; constant/nested-DTO imports do not grant capabilities. Accumulated verification has now passed the canonical standard JUnit suite (1686 tests) and transport HTTP suite (211 tests), with zero failures/errors/skips. The first runs exposed compilation issues and stale test adapters; these were repaired in batches, preserving business assertions. All 184 OpenAPI request/response schema graphs compile; this does not substitute for actual response evidence. All six independent JAR builds and the artifact ownership audit pass. All six real Spring contexts refresh using the rendered Helm environment and existing lab support services. Affinity requires the accounts/campaigns owners during its existing startup synchronization; the group context probe verifies those HTTP calls with the preceding owners running. The latest 37 infrastructure safety tests also pass. The six new immutable image versions are built, locked, imported and deployed by Helm revision 84; all six backends are Ready. Readiness is recorded in `build/reports/runtime/readiness.json`. The source report is generated separately in ignored `build/reports/source-dependencies.json`. Milestones 8–14 have passed their source/wiring/startup criteria. Public ingress and workflow correctness remain 15–17.

Latest verification logs (local, not deployment evidence):
- `/tmp/msc121-blocker-batch-canonical-5.log`: standard JUnit PASS, 1686/1686.
- `/tmp/msc121-blocker-batch-transport-4.log`: transport HTTP suite PASS, 211/211.
- `/tmp/msc121-blocker-schemas.log`: all 184 OpenAPI schema graphs PASS, schemas only.
- `/tmp/msc121-blocker-batch-assemblies-3.log`: six-artifact build/audit PASS.
- `/tmp/msc121-blocker-infra-3.log`: infrastructure suite PASS, 33/33.
- `/tmp/msc121-blocker-batch-contexts-3.log`: all six Spring contexts refresh; temporary containers/tunnel removed.
- `/tmp/msc121-blocker-batch-images.log`: all six backend images built with cached production base/dependency layers.
- `/tmp/msc121-blocker-batch-deploy.log`: Helm revision 84 deployed; 6/6 backends and 8/8 support Ready.

Latest public/data evidence:
- `/tmp/msc121-public-authority-build.log`: 215 adapter tests and six artifact audits pass.
- `/tmp/msc121-public-contexts.log`: all six real Spring contexts pass.
- `/tmp/msc121-public-deploy.log`: Helm revision 86, all backends Ready.
- `/tmp/msc121-public-smoke.log`: 13 public/negative checks pass.
- `/tmp/msc121-session-smoke.log`: native login, seven authenticated reads across all six assemblies and logout pass.
- `/tmp/msc121-catalog-infra.log`: 36 infrastructure safety tests pass.
- `/tmp/msc121-catalog-migration.log`: canonical landing catalog migration, idempotent rerun and bootstrap verification pass; REAL 17,800 documents / DEMO 43,813 documents at the quiesced snapshot.

## Technical appendix to milestone 8 — registered transports

`TESTED` means the adapter boundary passed the shell HTTP test suite. It does not mean the owning backend starts or a full user flow passes. See [bindings.json](transport/bindings.json), the OpenAPI files in `transport/contracts/`, and `bootstrap-tests/src/test/`.

| Owning domain | API interface | Status |
| --- | --- | --- |
| localization | `TranslationBundles` | TESTED; integrated application flow not verified |
| groups | `GroupMediaVisibility` | TESTED; integrated application flow not verified |
| community | `CommunityMediaVisibility` | TESTED; integrated application flow not verified |
| accounts | `ProfileIdentities` | TESTED; integrated application flow not verified |
| assets | `AssetMediaVisibility` | TESTED; integrated application flow not verified |
| events | `EventMediaVisibility` | TESTED; integrated application flow not verified |
| content | `ContentMediaVisibility` | TESTED; integrated application flow not verified |
| chat | `ChatMediaVisibility` | TESTED; integrated application flow not verified |
| chat | `ChatDirectory` | TESTED; integrated application flow not verified |
| notifications | `NotificationCatalog` | TESTED; integrated application flow not verified |
| affinity | `RecomputeQueue` | TESTED; integrated application flow not verified |
| community | `CaseParticipants` | TESTED; integrated application flow not verified |
| campaigns | `CampaignMediaVisibility` | TESTED; integrated application flow not verified |
| events | `MemberDirectory` | TESTED; integrated application flow not verified |
| events | `EventMembershipFacts` | TESTED; integrated application flow not verified |
| assets | `AssetMembershipFacts` | TESTED; integrated application flow not verified |
| groups | `GroupDirectory` | TESTED; integrated application flow not verified |
| events | `CommunityMembershipReads` | TESTED; integrated application flow not verified |
| affinity | `EdgeDirectory` | TESTED; integrated application flow not verified |
| affinity | `RatingDirectory` | TESTED; integrated application flow not verified |
| chat | `ChatReview` | TESTED; integrated application flow not verified |
| events | `EventHomeReads` | TESTED; integrated application flow not verified |
| events | `FeedbackDirectory` | TESTED; integrated application flow not verified |
| content | `UserFeedback` | TESTED; integrated application flow not verified |
| content | `UserReports` | TESTED; integrated application flow not verified |
| email | `UserActivityScheduling` | TESTED; integrated application flow not verified |
| affinity | `UserAffinityScores` | TESTED; integrated application flow not verified |
| accounts | `Experiences` | TESTED; integrated application flow not verified |
| accounts | `RatingProfiles` | TESTED; integrated application flow not verified |
| affinity | `UserAffinityChanges` | TESTED; integrated application flow not verified |
| assets | `TicketReads` | TESTED; integrated application flow not verified |
| affinity | `ConfigurationCatalog` | TESTED; integrated application flow not verified |
| assets | `AssetJobScopes` | TESTED; integrated application flow not verified |
| events | `EventJobScopes` | TESTED; integrated application flow not verified |
| payments | `AffiliateRegistrations` | TESTED; integrated application flow not verified |
| platform | `JobAudience` | TESTED; integrated application flow not verified |
| groups | `GroupAdministration` | TESTED; integrated application flow not verified |
| notifications | `RoleNotifications` | TESTED; integrated application flow not verified |
| notifications | `NotificationDelivery` | TESTED; integrated application flow not verified |
| groups | `ProfileWorkspaceLoads` | TESTED; integrated application flow not verified |
| email | `EmailLinks` | TESTED; integrated application flow not verified |
| localization | `MessageTranslations` | TESTED; integrated application flow not verified |
| platform | `AdministratorSettings` | TESTED; integrated application flow not verified |
| chat | `ContactPermissions` | TESTED; OpenAPI validated; injection passed startup probe |

## Milestone 8 — changes since the last test checkpoint

| Dependency | Implementation state | Verification state |
| --- | --- | --- |
| Identity integration and administration | Existing admin, help/content moderation and integration operations are typed and signed. Operator measurement uses closeable bounded NDJSON with ordered evidence and an exact terminal count. Revenue has a twelve-field DTO. Partner admission reloads its event record by ID; existing group invitation and native authorization semantics retained | IMPLEMENTED; accumulated compilation / JUnit verification in progress |
| Community owner calls | Campaign/event/case chat, support messages, scheduled messages, account consents, rating graphs and projections, notification pages and invitation resolution, asset moderation. Rating/notification reads delegate signed actor authority. Assets queries/upsert delegate native authorization; event membership sync keeps the existing owner implementation. Existing TicketReads and UserActivityScheduling remain separate interfaces | IMPLEMENTED / NOT YET TESTED; draft OpenAPI registered, HTTP evidence pending |
| Checkout and lazy-provider group | EventPayments, EventPaymentCancellations, CheckoutBaskets, CheckoutPricing, ServiceSlotPricing and PaymentRefunds wired to native owners. Payment start/refund requests verify signed actor authority. Cancellation carries eight routing fields and owner-reloaded payment ID. RoleAttentionEvents, CheckoutMemberships and ResourceAssignments cover previously missed ObjectProvider injection. Unknown checkout reply does not set failed state | IMPLEMENTED / NOT YET TESTED; remaining recovery belongs to 16 |
| Shared discovery/workspace profile group | Campaigns, community service listings, groups and feed consume DiscoveryProfiles and existing SelectedProfile; full WorkspaceProfile no longer crosses these paths. AccountWorkspaces owns admission/selection/activation and returns a two-field activity roster, avoiding per-group RPC. Existing ProfileCards extended for full native presentation. Event profiles now use the same signed selection/discovery contract. EventAffinityScores fetches account scoring facts once inside affinity and delegates both existing formulas | IMPLEMENTED / NOT YET TESTED; public ingress and cross-owner recovery remain 15–16 |
| Shared asset/event lifecycle group | Existing UserAffinityChanges transport also provides AffinityStatusChanges, avoiding duplicate beans. AttachmentLifecycle, ContentRegistration, AssetMemberships, ParticipationTickets, TicketAudit, AssetChanges, EventChanges and CheckoutResults owner transports added. Native mutation/queue behavior retained; webhook payloads narrowed, membership deletion removes a foreign document cast. AssetPayments now also wired, preserving native replacement/refund handling; unknown mutation replies do not reverse manager ownership. Durable recovery remains 16 | NOT YET TESTED; baseline affinity extensions not covered by previous run |
| accounts.api.PaymentTotals / integrations.api.ParticipantStatistics / events.api.EventCheckout | Payment owner dependencies wired with native projection/aggregation/fulfillment logic. Full PaymentView narrowed to existing 12-field fulfillment view. Signed interactive actor; payments-only gateway callback. Unknown remote fulfillment propagates as pending/HTTP 503 without refunding; known native monolith failure behavior retained. Durable delta and callback recovery remain 16 | NOT YET TESTED |
| events.api.RandomGroupAssignment / payments.api.ExchangeRateRefresh | Existing manual workers execute at their domain owner. Random-group progress uses bounded NDJSON through the shared transport on the caller thread; existing local progress heartbeat stays intact. Exchange-rate final status remains with native NotificationJobs. No retries; restart/unknown-acknowledgment coordination remains 16 | NOT YET TESTED |
| community AnnouncementDirectory/CaseFeedbackPreparation; events MemberAttention/MemberAudience/EventResourceDirectory | Communication's announcement, scheduled feedback, membership notification and chat resource dependencies call existing owners. Native snapshot/job scope and batch selection retained; resource DTO contains only existing chat view. Delta/lost-reply recovery remains open in 16 | NOT YET TESTED |
| platform.api.EmailSecrets / PaymentCredentialSecrets / DeploymentSettings | Purpose-scoped email and payment secret operations reuse the canonical AES-GCM key owner; the existing narrow deployment view is serialized. No generic secret-decryption capability or master-key distribution. Draft contracts registered | NOT YET TESTED |
| affinity.api.RecomputeMetrics | Bounded owner snapshot read; existing metrics owner retained | NOT YET TESTED |
| platform.api.DeploymentBranding | Existing resolved branding DTO; no deployment secrets exported | NOT YET TESTED |
| email.api.EmailRendering | Typed bounded template rendering request; existing renderer retained | NOT YET TESTED |
| payments.api.ExchangeRateConfiguration | Canonical URL validation with REAL/DEMO context and native rejection type | NOT YET TESTED |
| administration.api.AdminAudience | Native admin notification recipient selection; scoped read capability | NOT YET TESTED |
| accounts.api.AccountJobScopes | One bounded batch preserving included/excluded workspace selection | NOT YET TESTED |
| platform.api.CountryDirectory | Public country DTOs and canonical coordinate/partition lookup | NOT YET TESTED |
| payments.api.PaymentProviders | Native provider catalog and snapshot validation; no credentials | NOT YET TESTED |
| content.api.ContentStatistics | Native unresolved counts and feed-counter inputs for durable moderation projection | NOT YET TESTED |
| payments.api.CurrentPaymentProvider | Native cash-only precondition; existing provider-change exception moved to API and its original HTTP handler to shared canonical HTTP infrastructure to preserve the public error contract | NOT YET TESTED |
| events.api.EventWatchDirectory | Native watch ID ordering and nullable entries retained | NOT YET TESTED |
| accounts.api.ContactDirectory | Native saved-contact candidate selection and deduplication retained | NOT YET TESTED |
| events.api.OrganizerEventReads | Following now uses a narrow, read-only event contract and 11-field DTO; existing owner queries and account eligibility/count/expiry logic are retained. No event mutation capability is issued to following | NOT YET TESTED |
| accounts.api.AccountPaymentReads | Payment history reads only stored financial summary; receipt creation reads only non-deleted participant ID/name/workspace. Native account queries and payment normalization retained; three repeated summary reads combined into one per response | NOT YET TESTED |
| accounts.api.ProfileSummaries | Chat, community display, event mingle and affinity graph statistics use the existing account queries through a 17-field summary. Both affinity graph readers now use the same workspace-scoped summary; native admin classification accepts this narrower view; no classification rule changed | NOT YET TESTED |
| platform.api.AuthenticationMode | Community and communication read the live native Firebase flag without loading the full runtime configuration; errors never disable authentication | NOT YET TESTED |
| platform.api.OperatorNotificationSettings | Role notifications fetch their two configured email inputs once; no runtime secrets are serialized | NOT YET TESTED |
| accounts.api.SelectedProfile | Existing account-owned profile selection called with verified actor context; supplied user ID cannot replace signed selection. Bounded client/server and assembly wiring complete in source | NOT YET TESTED |
| content.api.AdministrativeActors | Payments, affinity and admin notifications use the existing two administrator/workspace reads, with signed A authority and native moderation checks; no moderation-write capability is included | NOT YET TESTED |
| accounts.api.ProfileReadState | Chat reuses native account menu counters under signed actor context and bounded invalidation of the existing read caches; full profile presentation is no longer injected into chat | NOT YET TESTED |
| accounts.api.EmailProfiles | Scheduled email and campaigns use the existing account selection with email, lifecycle and activity facts; push-token presence replaces token disclosure. Existing evaluator and template/audit behavior retained | NOT YET TESTED |
| accounts.api.EventCounterUpdates | Expiry sends profile IDs and three absolute counters; accounts reloads its own documents in one batch and applies the existing merge/equality/save implementation. No foreign document cast or automatic retry | NOT YET TESTED |
| accounts.api.AssetProfiles | Assets use the native account lookup through a bounded presentation/scoring view. Host-confidence inputs contain only rating/counts/evidence counts; scoring formula is unchanged. Asset takeover totals reuse AccountPaymentReads and the existing UserPaymentTotalsDto | NOT YET TESTED |
| affinity.api.AssetAffinityScores | Assets invoke only native asset affinity/boost calculations; typed asset content/capacity/request-status input and three-field owner scoring input replace full asset/profile payloads. Existing formulas and owner configuration retained | NOT YET TESTED |
| accounts.api.RatingSession | Account-owned selected identity, distance origin and game counter in one authenticated read. UserRatesService no longer injects the full ProfilePresentation; native selection and rating calculations retained | NOT YET TESTED |
| accounts.api.ProfileCards | UserRatesService calls the existing account queryUsersByIds presentation through bounded HTTP; no foreign profile document is reconstructed. Existing card mapping and ordering retained | NOT YET TESTED |
| events ActivitiesInviteCandidatesService | Full ProfileDirectory/ProfilePresentation injections replaced by existing ProfileSummaries, SelectedProfile, RatingProfiles and batched ProfileCards; payment-member roster reuses the native ordered query through a summary page. Parent invitations keep their original visibility behavior; no per-card HTTP calls | NOT YET TESTED |
| accounts.api.LocationEligibility | Landing content invokes the existing account login-region decision; the full ProfilePresentation dependency is removed from LandingContentController. Native configuration, country lookup and response DTO retained | NOT YET TESTED |
| access.api.AccessPermissions (also ConsentAuthorization) | Explicit native policy decision calls, optional verified actor context and mandatory service capability/REAL-DEMO. Absent actor is evaluated as absent, preserving native fallback rules; malformed proof is never downgraded. Scope-only resource input and shared pure authentication extraction avoid serializing Authentication or asset documents. Existing policy advice moved to common security infrastructure and explicitly imported around native/remote AccessPermissions | NOT YET TESTED |
| accounts.api.ScoringProfiles | Native affinity calculation/maintenance reads only stored scoring inputs. Immutable typed nested details/impressions retain nulls and existing formulas; auth, device, payment and integration state excluded | NOT YET TESTED |
| accounts.api.AccountAffinityProjections | Native account set/max/bulk projection writes use IDs and typed records. Job reads preserve active/inactive group context. Affinity maintenance updates its local immutable scoring value only after the owner acknowledges the write; no remote mutable Users cast or automatic retry | NOT YET TESTED |
| platform.api.SchedulingPolicy / NotificationPolicy | The single canonical parameter reader is explicitly shared configuration; native clamps, fallbacks and workspace key selection are unchanged. Existing ConfigurationCatalog transport is wired for indirect consumers, including notification-only callers; no additional policy HTTP endpoint | NOT YET TESTED |
| accounts.api.AccountDevices | Native register/remove commands with chat-only capability and signed selected-profile authority. Identity owner revalidates the stored selection before writing; bounded payload and acknowledgment, no automatic retry | NOT YET TESTED |
| assets.api.AssetOwnershipReads | Existing owner queries exposed through an explicit 32-field AssetOwnershipDto; foreign consumers no longer inject the combined AssetOwnership port. Read capability carries no projection write authority | NOT YET TESTED |
| assets.api.AssetDerivedUpdates | Affinity/platform send only stored ID/version and changed fields; owner retains its Mongo snapshot predicate. Separate command capability, no automatic retry; subsequent notification/attachment coordination under lost replies remains OPEN | NOT YET TESTED |
| accounts.api.FollowingEvents | Existing stored-organizer lookup and native counter recomputation over bounded IDs. Pure event eligibility is defined once in the canonical API and inherited locally, so per-event filtering does not create HTTP calls. Explicit native 404/409 outcomes preserved; no automatic retry | NOT YET TESTED |
| accounts.api.FriendshipReads | Native pair/adjacency queries. Existing request-local mode/viewer cache and areFriends behavior are shared by owner and remote client; repeated list authorization avoids per-item HTTP calls | NOT YET TESTED |
| accounts.api.FriendshipProjections | Separate affinity-only capability for native chronological pair upserts; bounded batches and complete input validation before first write, no automatic retries | NOT YET TESTED |
| affinity.api.MeetingEvidence | Events-only capability invokes the existing pair evidence upserts. Explicit meeting DTOs, bounded batches, no automatic retry; downstream friendship/following coordination remains part of workflow verification | NOT YET TESTED |
| notifications.api.NotificationJobs | Canonical callback orchestration runs locally; typed scoped HTTP operates on the existing owner catalog, atomic run claims, history and pending counters. Runnable is never serialized. REAL/DEMO plus active/null/selected group scope retained; no automatic retries. Pending-count/run acknowledgment recovery is OPEN | NOT YET TESTED |
| campaigns.api.CampaignCatalog | Five-field campaign summary for existing chat/rating/integration queries, batch map and ownership check. Media visibility remains its separate existing binding; no duplicate media-policy bean | NOT YET TESTED |
| events.api.EventOwnershipReads | Existing owner queries and explicit EventOwnershipDto; native SubEventItemMapper presentation travels with the read, avoiding foreign document casts and per-card RPC. Consumer selection/order retained; read capability has no projection authority | NOT YET TESTED |
| events.api.EventDerivedUpdates | Existing ID/updatedDate-qualified affinity and status writes; foreign affinity/platform callers no longer send owner documents. Command capability separate from reads; no automatic retry | NOT YET TESTED |
| platform.api.ModelStatusChanges | Native profile-driven event/asset suppression and changed-target/conflict result, preserving REAL/DEMO and job group context. Notification/attachment acknowledgment recovery remains OPEN | NOT YET TESTED |
| administration.api.OperationalTelemetry | Native enabled flag, group/mode routing, timestamp, normalization and Redis retention remain at the owner. Bounded typed HTTP; native best-effort behavior retained with logged transport failures and no retry; receipt is not durable delivery | NOT YET TESTED |

| accounts.api.ProfileModeration | Signed A actor and content-only command capability; owner reloads its own profile by ID, retaining previous-status restoration. Admin reads reuse ProfileSummaries, including public about text and native status query. Post-write affinity/support coordination remains OPEN | NOT YET TESTED |
| accounts.api.ActivityCounters | Existing account-owned counter reads, refreshes and deltas; source-ID refresh remains local API composition, feedback transition carries only event owner/creator/admin IDs. Preserve REAL/DEMO and job scope; bounded inputs, no automatic retry. Lost delta acknowledgments and eligibility coordination remain OPEN | NOT YET TESTED |

| accounts.api.FeedbackSession | Signed native selection returns public profile summary and four stored feedback counts from one account read. Feedback service batches summary reads for other participants; no complete WorkspaceProfile injection or query-time counter reconstruction | NOT YET TESTED |

### Shared blocker group 8–14 — canonical boundaries in progress

- Reused existing bindings across the profile blocker group: community cases, announcements, appointments and feedback now consume `ProfileSummaries`; event/asset workspace listeners and moderation ownership lookup consume `ProfileIdentities`; the resource controller and event watch service consume `SelectedProfile`; mingle participant display, event scheduling and supply contributor display use `ProfileSummaries`. Native owners and queries are unchanged. Email and assets no longer inject `ProfileDirectory`; chat no longer injects `ProfilePresentation`. The expiry worker no longer reads account documents: it computes values from its event/member records, and accounts resolves affected profiles before merging. Its existing order sends counters before marking the events expired, so a failed/unknown reply keeps the source due for the next native expiry pass. Community access reads signed selected identity through SelectedProfile. Affinity graph statistics uses the existing ProfileSummaries binding, including its native workspace filter; the explicitly allowed consumer domains now match the actual consumers. UserRatesService uses RatingSession, ProfileCards and ProfileReadState. Other profile consumers remain OPEN. These source changes are NOT YET TESTED.

- `EventOwnership` / `AssetOwnership`: extracted identifier + expected-version DTO entry points for their existing conditional affinity/status writes. The original Mongo predicates and local caller-object updates remain in the existing owners. These are partial source changes; broad ownership transports are still OPEN.
- The latest identity startup failure came from following's injection of the much broader `EventOwnership`. Following needs two read queries and 11 fields only. `OrganizerEventReads` exposes those existing queries through the existing owner, with a narrow DTO; the following algorithm is unchanged. This removes that source dependency without granting event writes. Readiness is recorded in `build/reports/runtime/readiness.json`.
- Payment consumers of `ProfileDirectory` now use `AccountPaymentReads` with separate summary and participant DTOs. The shared workspace comparison accepts the existing workspace identity alone; its null/presence and equality rules are unchanged. No full profile, device token or integration settings cross this boundary. Other payment dependencies remain OPEN.
- Chat consumers no longer inject the full `ProfileDirectory`: `ProfileSummaries` preserves their six existing read operations with an identity/lifecycle/display DTO (now including the existing contributor age/city fields). The existing saved-contact lookup is retained because it differs from `ContactDirectory.savedCandidateIds`; they were not substituted. Message-page/shared-message mapping now fills the existing per-page profile cache in bounded batches, including negative results, instead of making one remote request per distinct sender/reader/reactor. Chat authentication, account commands and administration ports remain OPEN.
- Event member lists now use existing ProfileSummaries, SelectedProfile, ProfileReadState and a batched ProfileCards presentation operation. The batch preserves the direct game-card mapper without adding the discovery usability filter. Feedback similarly uses summaries plus its signed selected snapshot; both services no longer inject ProfileDirectory/ProfilePresentation. Verification is pending.
- `ProfileDirectory` / `ProfilePresentation`: still OPEN. Presentation currently requires account-owned document fields beyond the read-only view; do not reconstruct fake account documents or serialize device/financial/integration data indiscriminately to satisfy it.
- Foreign consumers of `RuntimeConfiguration` have been narrowed to the live `AuthenticationMode` and `OperatorNotificationSettings`. Owner configuration activation remains canonical; no startup-only copied flag and no secret-bearing runtime snapshot are used.
- The full `AdministrativeAccess` remains OPEN for identity administration/telemetry. Payments, affinity and notifications no longer inject it: `AdministrativeActors` supplies their two existing read operations and removes the previously observed payments dependency in source. `AdminModerationService` implements both ports without duplicating its rules. Signed A authority matches the existing `/admin` route; native email/base-profile checks and owner rejection statuses are retained. Runtime readiness is still unverified.
- Shared actor transport is IMPLEMENTED / NOT YET TESTED: `AuthenticatedActor` exposes only identity/email/authorities; account-local `AccountIdentity` retains its existing full profile. Signed requests now install the verified actor around the native owner call and restore the service context on success/error. Existing signed adapters require re-verification after this change.
- Foreign assemblies derive child-call proofs through the account-owned delegation endpoint. Only the account owner receives the private key. Each foreign assembly has its own caller credential, accepted incoming audiences, and exact outgoing operations generated from its actual transport capabilities. Derivation preserves actor/workspace/roles/REAL-DEMO and the parent's expiry; it cannot renew a session or mint an actor from a service credential alone. Build and Helm source wiring is present; no live secret or deployment was changed.
- `SelectedProfile` is IMPLEMENTED / NOT YET TESTED for communication/payment/community/event consumers. The account owner reloads its canonical profile and checks the signed account/workspace selection. Missing/moved profiles return absence; requested IDs cannot substitute another account. The public ingress that obtains the initial authenticated context is still OPEN in 15.
- Verification sources added, not run: `ActorDelegationIdentityTest`, `ActorDelegationBrokerHttpTest`, native `HomeUserProfileServiceTest` delegated-selection cases, and an infrastructure regrouping/capability case. Draft contracts include `accounts/selected-profile-v1` and the separate shell-security `accounts/actor-delegation-v1`; the broker is not counted as another business API binding.

Contracts are grouped by owning domain under `transport/contracts/<domain>/`; the validator and direct source-document links use that structure.

Accumulated canonical and adapter JUnit verification now passes as recorded above. No new image-build or deployment cycle has run. Newly added draft OpenAPI files still need response evidence. The response validator includes the new contract paths and will require their HTTP evidence at that checkpoint; that evidence has not been produced yet.


### Account purge boundary group — IMPLEMENTED / NOT YET TESTED

Nine existing owner APIs (`AffinityPrivacy`, `ChatPrivacy`, `ContentPrivacy`, `EmailPrivacy`, `HelpPrivacy`, `PaymentPrivacy`, `NotificationPrivacy`, `AssetPrivacy`, `EventPrivacy`) now have explicit accounts-only HTTP commands. Existing `DeletedAccountPurgeService` owns durable stage records, persisted event/asset membership IDs, failure state and retry scheduling; transport does not retry or create another purge coordinator. Each owner retains its current removal/redaction queries, REAL/DEMO and active/inactive/null job context. No user data has been deleted during implementation.

Event discovery returns only `EventPurgeTargetDto(id, sourceId)`. Events reload their native documents by ID before media and record removal. Assets reload by asset ID, removing the invalid foreign-document casts. Media cleanup still precedes document deletion. A separate `MediaCleanup` port exposes only the existing strict deletion operation to purge consumers; its canonical best-effort default is also reused by `MediaStorage`. No media upload/storage implementation is copied into foreign artifacts.

Source-only tests added: `PurgeBoundaryHttpTest` prepares owner-capability, mode/scope, malformed input and unknown-outcome checks for all nine purge APIs plus media cleanup; `AccountMediaSessionsHttpTest` prepares cookie-hash checks and signed session rotation checks. `EventPrivacyOwnershipTest` covers discovery deduplication, failed media cleanup preserving documents, and replay after documents have already disappeared using saved membership sources. Existing account-purge tests are adjusted for owner-side reads. **Tests have not run.** HTTP negative-path/recovery evidence and the remaining media upload/reference consumers are still pending. Purge-counter acknowledgment at the final account deletion remains an item in milestone 16.

### Media boundary group — IMPLEMENTED / NOT YET TESTED

- `MediaCleanup`: canonical strict object deletion for all purge consumers plus integration rollback. The same native best-effort default is reused locally/remotely. No foreign MinIO client is packaged.
- `IdeaPostsService`: image reference/group parsing moved unchanged into existing `MediaAccessPaths`; canonical `MediaImageVariant` retains dimensions/quality/object names once for both parser and native conversion. Content keeps only the cleanup port, so HTML/image loops perform no remote classification calls. Existing content test now uses the real parser instead of mocking it.
- `MediaSessionAccess`: the existing servlet/cookie adapter is explicitly shared under `common/security/media`; servlet objects, Spring Authentication and raw Firebase credentials never cross the network. Native Firebase credential classification uses an in-process marker only. `AccountMediaSessions` preserves native mode-scoped hash checks, stored session lookup and rotation; lookup/rotation require signed selected-profile authority and native account revalidation. Canonical monolith and media-owner configurations import the same adapter.
- `ImageUploads`: integration uploads call the native media owner for existing image conversion/storage. Encoded files are bounded to the existing production 10 MiB limit; one upload per client/owner avoids allocating several large bodies in the 384 MiB heap. This adapter opts into a 60-second request ceiling. Ordinary adapters retain their original cap; the separate native manual-job transports explicitly allow a longer bounded window. No automatic retry; lost upload reply/orphan handling remains OPEN in 16.
- The deny-all security fallback now uses `LOWEST_PRECEDENCE`, so explicit service chains above order 100 are reachable. It still denies all unconfigured public routes; milestone 15 remains unverified.

All changes in this subsection are source-only. Existing canonical cookie tests were redirected to the moved implementation without changing acceptance rules. No JUnit, image build or deployment has run.

### Account notification/counter worker group — IMPLEMENTED / NOT YET TESTED

`ActivityCounters` now also provides the existing `FeedCounts` and `ServiceFeedbackCounters` interfaces through two explicit operations. Native stored feed revision/counts and absolute service-feedback pending projection remain account-owned; no extra counter service or recomputation was introduced.

`AccountNotifications` carries the existing bounded recipient/device, sender, role-recipient, account-ID, mute, unread delta and stale push-token cleanup operations. Only notifications receives its capability; push tokens and email are private service data. `ChatCounters` preserves the native single update and unordered batch separately, validates the whole batch first, and restricts context field names to those already produced by ChatService. `AccountInactivity` calls the existing status/threshold/session-history implementation and returns the existing narrow EmailProfileDto to the email worker. REAL/DEMO and job scope are preserved throughout.

No automatic command retry is added. Notification/chat delta acknowledgments and account inactivation followed by affinity enqueue remain open workflow correctness items in 16. Source and draft contracts are implemented; accumulated JUnit now passes. Context, new HTTP response evidence and deployment verification remain pending.

### Firebase runtime dependency — IMPLEMENTED / NOT YET TESTED

Notifications no longer requests a foreign `FirebaseRuntime`/SDK instance. `FirebasePushDelivery` carries immutable token/topic/data/WebPush intent and ordered per-token results. The existing SDK send and result mapping moved to platform, which already owns the activated Firebase runtime and secrets. Notification content selection, branding, timestamp, chunking, direct/multicast/topic choice and outbox orchestration remain in notifications. Provider-wide failure is sanitized; individual invalid-token error-code names are retained for existing cleanup. No credential or SDK object is serialized. Native unit/E2E fixtures are updated to the same typed port; tests have not run.

The new transport performs one attempt, at most 500 messages/8 MiB with a 30-second request window. Native DEMO prohibition remains at the Firebase owner. Existing outbox retries can encounter an unknown provider acknowledgment; this remains explicitly tracked in milestone 16, with no exactly-once claim.

### Shared canonical policy/configuration (no additional HTTP binding)

`AdministratorClassification` uses only three supplied profile fields and fixed canonical rules; it performs no I/O. Its exact existing implementation now resides in the canonical API default method, inherited by the monolith owner and used directly by a local bean in consuming assemblies. `transport/bindings.json` records this under `localBindings`; the assembly generator imports its configuration only outside the administration owner. No HTTP endpoint or credential is created. NOT YET TESTED. This is profile classification, not proof of authenticated administrative authority; `AdministrativeAccess` remains OPEN.

`SchedulingPolicy` and its `NotificationPolicy` view reuse the unchanged canonical `PlatformParametersService` in `common/config`. This reader is explicitly imported for each consuming assembly, including the platform owner; worker ownership does not move. Its existing `ConfigurationCatalog` dependency is native in affinity and remote elsewhere, with manifest-declared indirect consumers controlling both imports and credentials. No independent scheduling-policy endpoint or configuration cache is added. NOT YET TESTED.

## Technical appendix to milestone 8 — unbound API inventory

Inventory method: inspect canonical Java implementation files belonging to each assembly; select explicitly imported foreign-domain `api` types used in private/protected fields; subtract exact types registered in `transport/bindings.json`; deduplicate by fully qualified type. This deliberately excludes data-only imports. It can miss constructor-only parameters, inherited injections, aliases, factory beans and shared infrastructure. It can include types that should be narrowed or owned locally instead of remotely exposed. **Rows not listed as implemented above are OPEN / classification pending, not an instruction to create another adapter blindly.**

Each row must eventually record its disposition (existing binding reused, canonical interface narrowed, configuration wired, or explicit transport implemented) and its verification evidence. A single adapter may close several review items; new concrete dependencies must be appended by API name. This appendix is not another numbered delivery plan.

| API type | Consumer deployments | Example source |
| --- | --- | --- |
| `access.api.AccessPermissions` | community, communication, assets | [CalendarExportController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/controller/CalendarExportController.java) |
| `access.api.ConsentAuthorization` | community | [HelpCenterService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/help/service/HelpCenterService.java) |
| `accounts.api.AccountConsents` | community | [HelpCenterService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/help/service/HelpCenterService.java) |
| `accounts.api.AccountInactivity` | communication | [ScheduledMessageTaskService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskService.java) |
| `accounts.api.AccountJobScopes` | payments | [PaymentJobQueries.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/PaymentJobQueries.java) |
| `accounts.api.AccountMediaSessions` | assets | [MediaSessionAccessService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/common/security/media/MediaSessionAccessService.java) |
| `accounts.api.AccountNotifications` | communication | [UserNotificationMapper.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/mapper/UserNotificationMapper.java) |
| `accounts.api.AccountWorkspaces` | community | [CommunityAccessService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/groups/service/CommunityAccessService.java) |
| `accounts.api.ActivityCounters` | community, communication, assets | [AdminModerationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java) |
| `accounts.api.ContactDirectory` | community | [ActivitiesInviteCandidatesService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesInviteCandidatesService.java) |
| `accounts.api.CurrentProfile` | community | [CampaignsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/service/CampaignsService.java) |
| `accounts.api.FollowingEvents` | affinity | [UserRatesService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/UserRatesService.java) |
| `accounts.api.Friendships` | community, assets | [ActivitiesEventsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java) |
| `accounts.api.ProfileAuthentication` | assets | [MediaSessionAccessService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/common/security/media/MediaSessionAccessService.java) |
| `accounts.api.ProfileDirectory` | community, communication, assets, payments, affinity | [CampaignsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/service/CampaignsService.java) |
| `accounts.api.ProfilePresentation` | community, communication, affinity | [LandingContentController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/controller/LandingContentController.java) |
| `accounts.api.SelectedProfile` | communication, payments | [UserNotificationsController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/controller/UserNotificationsController.java) |
| `accounts.api.ServiceFeedbackCounters` | community | [ServiceFeedbackService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/ServiceFeedbackService.java) |
| `administration.api.AdminAudience` | affinity | [AdminParamsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AdminParamsService.java) |
| `administration.api.AdministratorClassification` | communication | [ChatService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java) |
| `administration.api.OperationalTelemetry` | community, communication, assets, affinity | [AdminModerationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java) |
| `affinity.api.AccountRatings` | community | [ServiceOfferingsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/ServiceOfferingsService.java) |
| `affinity.api.AffinityGraph` | identity | [AdminController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/controller/AdminController.java) |
| `affinity.api.AffinityParameters` | identity | [AdminController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/controller/AdminController.java) |
| `affinity.api.AffinityScores` | community, assets | [ActivitiesEventsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java) |
| `affinity.api.AffinityStatusChanges` | community, assets | [AdminModerationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java) |
| `affinity.api.CampaignGraphs` | community | [EventScheduler.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventScheduler.java) |
| `affinity.api.CampaignRatings` | community | [CampaignsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/service/CampaignsService.java) |
| `affinity.api.GraphScience` | identity | [AdminStatsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/service/AdminStatsService.java) |
| `affinity.api.RatingMeasurement` | identity | [MongoQualifiedMauEvidenceRepository.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/repository/MongoQualifiedMauEvidenceRepository.java) |
| `affinity.api.Ratings` | identity, community | [IntegrationReadController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java) |
| `affinity.api.RecomputeMetrics` | identity | [AdminController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/controller/AdminController.java) |
| `assets.api.AssetMeasurement` | identity | [MongoQualifiedMauEvidenceRepository.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/repository/MongoQualifiedMauEvidenceRepository.java) |
| `assets.api.AssetModerationDetails` | community | [ContentModerationController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/controller/ContentModerationController.java) |
| `assets.api.AssetOwnership` | identity, community, payments, affinity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `assets.api.Assets` | identity, community | [IntegrationReadController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java) |
| `campaigns.api.Campaigns` | identity | [IntegrationDomainController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationDomainController.java) |
| `chat.api.AttachmentLifecycle` | identity, community, assets | [ModelStatusPropagationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/ModelStatusPropagationService.java) |
| `chat.api.CampaignConversations` | community | [CampaignsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/campaigns/service/CampaignsService.java) |
| `chat.api.CaseConversations` | community | [CommunityCasesService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityCasesService.java) |
| `chat.api.ChatMeasurement` | identity | [MongoQualifiedMauEvidenceRepository.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/repository/MongoQualifiedMauEvidenceRepository.java) |
| `chat.api.ChatQueries` | identity | [IntegrationReadController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java) |
| `chat.api.EventConversations` | community | [ActivitiesEventsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java) |
| `chat.api.SupportMessages` | community | [AdminModerationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java) |
| `community.api.Announcements` | identity | [IntegrationDomainController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationDomainController.java) |
| `community.api.CaseFeedbackPreparation` | communication | [ScheduledMessageTaskService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/ScheduledMessageTaskService.java) |
| `community.api.Cases` | identity | [IntegrationDomainController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationDomainController.java) |
| `community.api.ScheduledCases` | identity | [IntegrationDomainController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationDomainController.java) |
| `community.api.ServiceOfferings` | identity | [IntegrationDomainController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationDomainController.java) |
| `content.api.AdministrativeAccess` | identity, communication, affinity | [AdminController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/controller/AdminController.java) |
| `content.api.ContentRegistration` | identity, assets | [HomeUserProfileService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java) |
| `content.api.IdeaPosts` | identity | [AdminController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/controller/AdminController.java) |
| `email.api.EmailRendering` | identity | [DeletedAccountWarningWorker.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountWarningWorker.java) |
| `email.api.EmailSending` | identity | [DeletedAccountWarningWorker.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountWarningWorker.java) |
| `email.api.ScheduledMessages` | community | [CommunityCasesService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CommunityCasesService.java) |
| `events.api.EventCheckout` | payments | [PaymentRestController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/controller/PaymentRestController.java) |
| `events.api.EventMeasurement` | identity | [MongoQualifiedMauEvidenceRepository.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/repository/MongoQualifiedMauEvidenceRepository.java) |
| `events.api.EventOperations` | identity | [IntegrationReadController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java) |
| `events.api.EventOwnership` | identity, payments, affinity | [UserActivityCountersService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersService.java) |
| `events.api.EventResourceDirectory` | communication | [ChatService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java) |
| `events.api.EventWatchDirectory` | identity | [UserActivityCountersService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersService.java) |
| `events.api.MemberAudience` | communication | [PromotionalEmailPlannerService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/PromotionalEmailPlannerService.java) |
| `events.api.MingleEncounters` | identity | [IntegrationEncounterPublisher.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationEncounterPublisher.java) |
| `events.api.ParticipationTickets` | identity, assets | [UserActivityCountersService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersService.java) |
| `events.api.PartnerInvitationAdmission` | identity | [IntegrationParticipantInviteService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationParticipantInviteService.java) |
| `events.api.RandomGroupAssignment` | communication | [AdminNotificationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/AdminNotificationService.java) |
| `events.api.TicketAudit` | assets | [AssetsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java) |
| `groups.api.Groups` | identity | [IntegrationReadController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java) |
| `help.api.HelpCenter` | identity | [AdminController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/controller/AdminController.java) |
| `integrations.api.AssetChanges` | assets | [AssetIntegrationChangeListener.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetIntegrationChangeListener.java) |
| `media.api.MediaSessionAccess` | identity | [FirebaseFilter.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/security/firebase/FirebaseFilter.java) |
| `media.api.MediaStorage` | identity, community, communication | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `notifications.api.NotificationAdministration` | identity | [AdminController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/administration/controller/AdminController.java) |
| `notifications.api.NotificationInbox` | identity, community | [IntegrationReadController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/controller/IntegrationReadController.java) |
| `notifications.api.NotificationJobs` | identity, community, payments, affinity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `payments.api.Affiliates` | identity | [IntegrationParticipantInviteService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationParticipantInviteService.java) |
| `payments.api.AssetPayments` | assets | [AssetsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java) |
| `payments.api.CheckoutBaskets` | community | [ActivitiesEventsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java) |
| `payments.api.CheckoutPricing` | community | [ActivitiesEventsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java) |
| `payments.api.CheckoutResults` | assets | [AssetsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java) |
| `payments.api.CurrentPaymentProvider` | community | [ActivitiesEventsController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/controller/ActivitiesEventsController.java) |
| `payments.api.EventPayments` | community | [ActivitiesEventsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/ActivitiesEventsService.java) |
| `payments.api.PaymentMethods` | identity | [HomeUserProfileService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/HomeUserProfileService.java) |
| `payments.api.PaymentProviders` | identity | [OperatorConfigurationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/service/OperatorConfigurationService.java) |
| `payments.api.PaymentRevenue` | identity | [OperatorRevenueService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorRevenueService.java) |
| `payments.api.PaymentSimulatorConfiguration` | identity | [DeploymentConfigurationController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/platform/controller/DeploymentConfigurationController.java) |
| `payments.api.ServiceSlotPricing` | community | [CaseAppointmentsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/community/service/CaseAppointmentsService.java) |
| `platform.api.CountryDirectory` | community | [LandingContentController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/controller/LandingContentController.java) |
| `platform.api.DeploymentBranding` | communication | [PublicEmailUnsubscribeController.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/controller/PublicEmailUnsubscribeController.java) |
| `platform.api.DeploymentSettings` | payments | [CurrentPaymentProviderService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/CurrentPaymentProviderService.java) |
| `platform.api.FirebaseRuntime` | communication | [DefaultFirebaseMessagingGateway.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/DefaultFirebaseMessagingGateway.java) |
| `platform.api.ModelStatusChanges` | affinity | [AffinityRecomputeWorkerService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeWorkerService.java) |
| `platform.api.NotificationPolicy` | communication | [NotificationOutboxService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/NotificationOutboxService.java) |
| `platform.api.RuntimeConfiguration` | community, communication | [AdminModerationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java) |
| `platform.api.SchedulingPolicy` | community, affinity | [EventScheduler.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventScheduler.java) |
| `platform.api.SecretEncryption` | communication, payments | [EmailUnsubscribeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/email/service/EmailUnsubscribeService.java) |

## Evidence and next action

- Latest shell build: `bash microservices/tools/lab.sh jars`; 174 tests, 0 failures/errors/skips, all 6 artifact-ownership checks pass. Local log: `/tmp/msc121-contact-build.log`. Reproducible test XML: `build/bootstrap-tests/test-results/test/`.
- Latest support checks: `/tmp/msc121-43-scopes.log`; service credential scoping and supporting routes pass. These logs are local, not durable committed evidence.
- Latest canonical contact regression logs: `/tmp/msc121-contact-canonical.log` and `/tmp/msc121-contact-persistence.log`; both pass. The embedded Mongo test and the mocked-repository HTTP test establish different boundaries.
- Historical milestone-8 startup work is complete; do not repeat it. The source freeze and deferred verification referenced in this appendix have since completed. Current authoritative runtime: revision 90; current results and remaining production-qualification limits are at the top of this file.
- Report future progress as milestone IDs closed, current Ready backend count out of six, tested full flows, and named remaining blockers. Never use growing adapter counts alone as overall completion progress.

## Source inventory supplement — constructor and qualified declarations

The original 96-name field-only inventory above is retained. The extended scan also considers constructor parameters and fully qualified declarations; its results are not a runtime bean graph. The following additional candidates are OPEN / classification pending. No startup or test was run for this inventory.

| API type | Consumer deployments | Example source |
| --- | --- | --- |
| `accounts.api.AccountAffinityProjections` | affinity | [AffinityRecomputeTaskService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/affinity/service/AffinityRecomputeTaskService.java) |
| `accounts.api.AccountDevices` | communication | [ChatService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java) |
| `accounts.api.ChatCounters` | communication | [ChatService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java) |
| `accounts.api.EventCounterUpdates` | community | [EventCounterExpiryService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventCounterExpiryService.java) |
| `accounts.api.FeedCounts` | community | [PhotoFeedService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/PhotoFeedService.java) |
| `accounts.api.PaymentTotals` | payments | [PaymentRefundService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/PaymentRefundService.java) |
| `accounts.api.ProfileModeration` | community | [AdminModerationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/AdminModerationService.java) |
| `affinity.api.AffinityPrivacy` | identity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `affinity.api.MeetingEvidence` | community | [EventFriendshipProjectionService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventFriendshipProjectionService.java) |
| `assets.api.AssetModerationProjection` | community | [ContentModerationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/content/service/ContentModerationService.java) |
| `assets.api.AssetPrivacy` | identity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `campaigns.api.CampaignCatalog` | identity, communication, affinity | [IntegrationSyncService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/integrations/service/IntegrationSyncService.java) |
| `chat.api.ChatPrivacy` | identity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `community.api.AnnouncementDirectory` | communication | [ChatService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/chat/service/ChatService.java) |
| `content.api.ContentPrivacy` | identity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `email.api.EmailPrivacy` | identity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `events.api.AssetMemberships` | assets | [AssetsService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/assets/service/AssetsService.java) |
| `events.api.EventPrivacy` | identity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `events.api.FeedbackEligibility` | identity | [UserActivityCountersService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/UserActivityCountersService.java) |
| `events.api.MemberAttention` | communication | [UserNotificationPageRepository.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/repository/UserNotificationPageRepository.java) |
| `help.api.HelpPrivacy` | identity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `integrations.api.EventChanges` | community | [EventIntegrationChangeListener.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventIntegrationChangeListener.java) |
| `integrations.api.ParticipantStatistics` | payments | [AffiliateService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/payments/service/AffiliateService.java) |
| `notifications.api.NotificationPrivacy` | identity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |
| `payments.api.EventPaymentCancellations` | community | [EventCancellationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/events/service/EventCancellationService.java) |
| `payments.api.ExchangeRateRefresh` | communication | [AdminNotificationService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/notifications/service/AdminNotificationService.java) |
| `payments.api.PaymentPrivacy` | identity | [DeletedAccountPurgeService.java](../server/projects/profile/src/main/java/com/raxim/myscoutee/domain/accounts/service/DeletedAccountPurgeService.java) |

## Final follow-up checkpoint — 2026-10-09

1. Exact historical image replay: 16.07 warm events/s versus current 17.25;
   later application source does not reproduce the historical 20.60 gap.
   Runtime/data causal shares remain unproven and are disclosed in the comparison.
2. Frontend-local audit plus historical stability failures: 134/134 Angular
   service tests; production image `d878ec931c44` CDP selection 757 ms and
   3000 ms indicator window preserved.
3. Both live Project items: all nine measurement fields updated and read back;
   aggregate ledger and current account totals published in the roadmap.
4. Historical daily rows preserved; combined heatmap extended through October 8.
5. Additional UK request: 25/25 country tests; four regional HTTP eligibility
   checks and Dublin negative control; Emma Parker native browser login/logout
   pass. No seed location change needed.

The six-service lab was restored after the serial monolith control, with the
new locked frontend image and two Mongo replica-set members. No host autostart
was enabled. Generated reports remain outside source control.

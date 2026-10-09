# Idle CPU attribution — 2026-10-09

Measured **11:11:41–11:14:41 Europe/Prague**, 180 one-second intervals.
All CPU percentages use **100% = one logical core**. The host has 12 logical
CPUs; divide by 12 for whole-host utilization. The guest has four vCPUs.
This is a live observation with the editor, terminal observer, System Monitor
and host monitoring left running; no build, deployment, setting change or
application test traffic was introduced. Normal user/editor activity was not frozen.

## Host boundary (non-overlapping totals)

| Host component | Average CPU |
| --- | ---: |
| QEMU, including the complete guest | 73.33% |
| Host Docker containers: Grafana + Prometheus | 2.11% |
| Everything else on the host | 59.58% |
| **Host total** | **135.13% = 11.26% of the host** |

The guest containers below are **inside QEMU**. Adding them to QEMU would
double-count their CPU. Process names aggregate all matching PIDs:

| Host process family | Average CPU |
| --- | ---: |
| code | 30.45% |
| gnome-shell | 9.41% |
| gnome-system-mo | 7.53% |
| polkitd | 1.44% |
| codex | 1.14% |
| git | 1.10% |
| python3 | 1.92% |

## Containers

Cgroup CPU includes short-lived child processes that a process-list snapshot
can miss. RAM is the last working-set estimate (`memory.current - inactive_file`),
not a memory limit, and cannot be added to QEMU resident memory.

| Guest container | Average CPU | p95 (1 s) | Maximum (1 s) | RAM MiB |
| --- | ---: | ---: | ---: | ---: |
| All guest pods (aggregate; do not add again) | 27.15% | 63.86% | 156.92% | 3376.4 |
| mongodb-0 | 4.05% | 10.00% | 21.03% | 372.0 |
| communication | 3.92% | 15.46% | 41.85% | 406.6 |
| frontend | 2.91% | 8.14% | 13.27% | 3.3 |
| mongodb-1 | 2.65% | 5.40% | 9.18% | 224.2 |
| identity | 2.54% | 7.74% | 37.24% | 403.0 |
| affinity | 2.48% | 6.03% | 34.48% | 590.7 |
| community | 2.41% | 6.70% | 59.30% | 359.3 |
| payments | 1.50% | 5.45% | 22.24% | 248.3 |
| assets | 1.01% | 2.48% | 8.25% | 246.6 |
| registry | 0.86% | 6.11% | 9.48% | 24.4 |
| coredns | 0.59% | 1.03% | 1.57% | 71.8 |
| redis | 0.55% | 0.72% | 0.93% | 17.2 |
| stun | 0.50% | 3.33% | 4.50% | 19.7 |
| mcp | 0.42% | 3.04% | 5.60% | 12.1 |
| payment-simulator | 0.39% | 2.95% | 5.18% | 15.8 |
| minio | 0.36% | 0.47% | 15.01% | 172.6 |
| local-path-provisioner | 0.02% | 0.10% | 0.94% | 47.9 |

| Host container | Average CPU | Maximum (1 s) | RAM MiB |
| --- | ---: | ---: | ---: |
| grafana | 1.67% | 6.22% | 237.4 |
| prometheus | 0.44% | 2.06% | 52.1 |

## Guest work outside the containers

| Process family | Average CPU |
| --- | ---: |
| k3s-server | 10.26% |
| containerd | 2.13% |
| containerd-shim | 3.73% |
| python3 | 4.51% |

The two guest Python processes were the existing terminal observer (~1.05%)
and this temporary diagnostic sampler (~3.46%). The host diagnostic sampler
used ~1.70%; the existing host terminal observer ~0.21%. Both diagnostic
samplers exited after capture. Their overhead is included in the measured totals.

Guest `/proc/stat` busy CPU averaged 46.21%; subtracting the
pod cgroup aggregate gives 19.06% outside pods by that method.
The independent persistent-process totals above are about 21%, so treat this as
approximately **19–21%**, including observation. Kernel `/proc/stat`, process
ticks and cgroup accounting do not reconcile exactly at this granularity.
The difference between QEMU host CPU and guest counters is **not** a measured
pure virtualization cost. The earlier isolated halt-poll experiment attributed
about 5.5 percentage points to host active waiting, in a different window.

## Captured spikes and actual evidence

- **11:12:03:** QEMU 201.7%, guest pods 156.9%. Community 59.3%, communication
  38.4%, payments 21.3%, Mongo primary 17.4%, secondary 9.2%. Sampled C2
  compiler threads used community 46.6%, payments 14.9%, communication 9.9%:
  **71.4% combined**. Runtime JIT compilation is directly observed; no new
  Gradle/Docker build or image download ran. It explains part, not all, of this spike.
- **11:13:04:** QEMU 178.1%. Communication 41.8%, community 30.2%, identity
  20.2%, Mongo primary 21.0%. Compiler, scheduler, HTTP and Mongo change-work
  threads were all active. No exact business job is established by thread names.
- **11:13:13:** QEMU 169.3%. Identity 37.2%, affinity 34.5%; identity compiler
  thread 21.3% and affinity HTTP worker threads at least 22.3%. The exact
  HTTP route was not traced, so this is an owner/thread attribution.
- **11:13:53:** the largest **host** spike was 529.3% (44.1% of 12 CPUs).
  VS Code processes contributed at least 295.1%, while QEMU used 89.0%.
  The preceding 11:13:52 sample also caught a Git process at 99.1%.
  Short-lived processes can finish between samples; the process list therefore
  does not fully explain the host aggregate. No extension or Git command is
  identified from executable names alone.

## Concrete recurring source outside business workers

The frontend gateway runs
[runtime-status.sh](../server/docker/images/nginx/runtime-status.sh). Its
[Helm configuration](deploy/chart/templates/frontend.yaml) supplies six backend
health URLs. Each loop starts six `wget` probes and JSON checks plus shell/file
utilities, then sleeps two seconds. This happens with no browser connected.
The nginx process itself averaged only ~0.06%, while the frontend cgroup
averaged 2.91%; many helper processes end between one-second samples.
This identifies concrete recurring work, but no ON/OFF control isolated the
health loop's exact causal CPU share. Runtime readiness semantics are unchanged.
Kubernetes also has independent readiness probes; support-service exec probes
use 10-second readiness / 30-second liveness periods. Nothing was disabled.

## Memory and swap

Host available RAM: 4.68 GiB.
Guest available RAM: 3.75 GiB.
Guest pod working sets total approximately 3.30 GiB. Host swap was almost full,
but only 62 pages (248 KiB) were swapped in and zero pages swapped out during
these three minutes. This sample does not show active swap thrashing.

## Method, provenance and limits

- Reused the versioned guest observer's API/cgroup discovery once; one persistent
  SSH connection streamed guest samples. Host and guest `/proc`/cgroup counters
  were read each second, with Java thread CPU sampled for peak attribution.
- CPU rates are cumulative-counter deltas divided by elapsed monotonic time.
  Process reuse is guarded by the start-time field. Host sampling follows each
  received guest frame; boundaries are close, not atomically synchronized.
- The pod aggregate includes all Kubernetes pod cgroups. Host Docker inventory
  contained only Grafana and Prometheus. No inventory subprocess runs each tick.
- Kernel interfaces: [proc](https://docs.kernel.org/filesystems/proc.html) and
  [cgroup v2 CPU accounting](https://docs.kernel.org/admin-guide/cgroup-v2.html#cpu-interface-files).
- Local raw counters: `/tmp/myscoutee-cpu-timeline.jsonl`; summary:
  `/tmp/myscoutee-cpu-timeline-summary.json`. No credentials or application payloads
  were collected. This document preserves the findings independently of `/tmp`.
- This is an attribution measurement, not a before/after optimization proof,
  a wattage measurement or a complete causal profile of every spike.

## Follow-up: corrected publication direction (Helm revision 118)

The frontend health-probe loop identified above was replaced after the user
reaffirmed the required backend-to-frontend direction. Each backend now POSTs
its own health lease; the frontend receiver serves the existing public snapshot
without querying backends. Details and test evidence are in
[PROGRESS.md](PROGRESS.md#backend-published-frontend-readiness--2026-10-09).
A subsequent 30-second sample measured frontend CPU 0.291% average, 2.480% max,
with a 5.34 MiB working set. It is not a matched full-VM benchmark: the earlier
sample lasted 180 seconds, and the six Java services were restarted for rollout.

## Follow-up: current full-stack sample after revision 118

Measured **14:42:43–14:43:43 Europe/Prague**, 60 one-second intervals, using
exactly the same counter reader. No build or rollout ran during the sample.

| Boundary | Average CPU (one core = 100%) |
| --- | ---: |
| Whole host | 114.31% (9.53% of 12 logical CPUs) |
| QEMU, including guest | 69.15% |
| Host monitoring containers | 2.19% |
| Other host work | 42.98% |
| Guest pod aggregate (already inside QEMU) | 21.14% |
| Guest busy CPU outside pods, including sampler | 19.44% |

| Guest container | Average CPU | Maximum (1 s) |
| --- | ---: | ---: |
| mongodb-0 | 4.52% | 21.24% |
| communication | 3.33% | 34.65% |
| mongodb-1 | 2.83% | 10.46% |
| identity | 1.76% | 17.19% |
| affinity | 1.72% | 28.09% |
| community | 1.37% | 8.47% |
| payments | 0.95% | 14.27% |
| registry | 0.83% | 7.54% |
| assets | 0.70% | 3.31% |
| redis | 0.61% | 1.14% |
| coredns | 0.49% | 0.96% |
| minio | 0.49% | 12.25% |
| mcp | 0.45% | 3.94% |
| stun | 0.43% | 4.11% |
| payment-simulator | 0.39% | 6.21% |
| frontend | 0.26% | 0.48% |
| local-path-provisioner | 0.01% | 0.10% |

Guest infrastructure: k3s 10.76%, containerd 2.38%, shims 3.63%; guest
Python observers together 4.48%. Host Code processes used 22.54%, gnome-shell
8.11%, Chrome 4.10%. The temporary sampler remains included in these numbers.
The largest host spike (259.76%) coincided with polkitd and memory compaction,
while QEMU was only 49.76%; it was not an application-only spike.
All sampled Java C2 threads together averaged approximately 1.41% of one core.
No JIT mode change is justified by this sample alone; no JVM flags were changed.

Frontend recurring CPU is consistently lower (2.91% earlier; 0.291% in the
first follow-up; 0.258% here). Pod aggregate fell from 27.15% to 21.14%, but
unequal observation windows, warm-up and concurrent desktop activity prevent
attributing the entire difference to the readiness change.
Raw counters: `/tmp/myscoutee-rev118-cpu-timeline.jsonl`.

Admin telemetry was inspected further, without changing its semantics: its
60-second pass also refreshes graph/profile and queue-derived snapshots even
when Redis is empty. Job admission/completion itself emits telemetry. Simply
running the entire existing pass on every Redis event would create more work
and could feed its own wakeups. A Redis-driven replacement must preserve
admin rule admission, time-derived refreshes and independent durable snapshot
cursors; this follow-up does not claim that conversion is implemented.

## Follow-up: native Kubernetes HTTP probes (Helm revision 119)

MCP, registry and payment simulator healthcheck CLIs each made an HTTP GET to
their own `/healthz` route and accepted status 200. The existing routes return
200 on health; registry retains its storage check and 503 on failure. Kubernetes
now calls those endpoints directly on the Pod IP, avoiding a separate binary
startup for each probe. All three existing startup/readiness/liveness periods
(2/10/30 seconds), failure thresholds and timeout defaults are preserved.
STUN retains its UDP protocol-level exec check. No business worker, metric
collection, terminal refresh or health check was disabled.

Changed durable owners: `deploy/chart/values.yaml` and
`deploy/chart/templates/support.yaml`. No VM/Terraform change is needed.
Helm lint passed; all three endpoints returned 200 from the guest before rollout.
Rendered workload comparison found only the intended three probe changes
(apart from equivalent `1024Mi`/`1Gi` serialization). Revision 119 deployed
successfully; all Deployments and Mongo 2/2 Ready. Only the three affected
support pods were replaced; Java and frontend pod identities stayed unchanged.
Every image was a guest cache hit; no build or image download was performed.

Measured **14:49:40–14:50:40 Europe/Prague**, 60 one-second intervals, with the
same sampler and observation overhead as the preceding sample:

| Boundary / process | Before (118) | After (119) |
| --- | ---: | ---: |
| MCP container | 0.452% | 0.015% |
| Payment simulator container | 0.387% | 0.015% |
| Registry container | 0.828% | 0.568% |
| Frontend container | 0.258% | 0.246% |
| Guest pod aggregate | 21.139% | 17.751% |
| Guest containerd | 2.383% | 2.032% |
| Guest containerd shims | 3.633% | 3.265% |
| Guest k3s | 10.764% | 10.578% |
| QEMU on host, including guest | 69.153% | 63.078% |
| Host monitoring containers | 2.188% | 2.387% |
| Other host work | 42.984% | 31.673% |
| Whole host | 114.306% (9.53% of host) | 97.040% (8.09% of host) |

The short samples are not a controlled whole-host benchmark. They substantiate
the small services' reduction and removal of their exec work; other backend,
Mongo and desktop activity also changed, so the total difference cannot all be
credited to HTTP probes. The remaining load is not declared solved. Mongo,
k3s, business timers, Redis consumers, monitoring and VM overhead remain.
Raw counters: `/tmp/myscoutee-rev119-cpu-timeline.jsonl`.

## Periodic activity identified after the accepted ~8% baseline

The user accepts approximately 8% whole-host utilization and requested attribution
of the remaining small periodic activity, not additional changes to drive it to
zero. This follow-up is read-only diagnosis plus documentation: no cadence,
worker, build, pod or VM configuration was changed.

### Cadence map

| Period | Owner and actual work | Evidence |
| --- | --- | --- |
| 1 s | Terminal observer reads cgroup counters and redraws; chat reissues its blocking Redis stream read after a 1 s empty timeout (+10 ms pause) | Versioned observer and ChatStreamConsumer; this is not a chat delivery delay |
| 2 s | Each Java backend checks its own health and publishes readiness to frontend | RuntimeStatusPublisher fixed-delay worker |
| 3 s | Kubernetes checks frontend `/index.html` | Deployed Helm readiness probe |
| 5 s | Terminal inventory reads nodes, Deployments, StatefulSets and pods; Kubernetes probes six backends, Mongo, Redis and MinIO readiness; chat tests STUN availability | Observer's four API reads; Helm probes; ChatCallSignalingService |
| 10 / 30 s | MCP, registry, simulator and STUN readiness/liveness; MinIO liveness every 10 s | Deployed probes; registry health includes SQLite ping and ledger-state verification, not only a socket check |
| 30 s | Prometheus collects six backend metrics endpoints; terminal refreshes VM metadata; empty Mongo change-stream waits return and are renewed | Versioned scrape configuration, vm.py metadata cache, MongoChangeStreamService maxAwaitTime |
| About 60 s | Rule-gated business/admin passes; Mongo storage checkpoints; registry checkpoint finalization | Live job history and Mongo logs; registry RunCheckpointWorker default one-minute interval |
| About 5 min | Event counter expiry processing | Live run history: 302.3–302.4 s between recent executions |

The startup probes' 2 s periods only apply during startup; they are not ongoing
idle work. Mongo replica synchronization and driver monitoring also remain, but
the exact CPU share of each is not isolated by this investigation.

### Live application evidence (~14:58–15:00 local time)

A projected read of `notificationRuleConfigs.runHistory` in `msc121_real` and
`msc121_demo` found repeated successful executions for these rules, each in all
six mode/group scopes (two database modes × three groups). The retained history
contained twelve recent executions per scope for each of these rules:

| Rule | Observed start-to-start range |
| --- | ---: |
| event-checkout-basket-purge | 60.3–60.7 s |
| content-auto-approve | 60.3–60.7 s |
| event-watchlist | 60.2–60.4 s |
| promotional-email-planning | 60.1–60.2 s |
| admin-telemetry | 60.8–61.2 s |

These are successful processing/check passes, not proof that each pass deleted
a basket, approved content or sent an email. Fixed-delay scheduling and work
execution explain periods slightly above 60 s. Separate group/database contexts
explain repeated similar-looking calls without implying they read the same data.

Existing Prometheus five-minute request rates independently showed approximately:
95/min scheduled-job admission calls, 51/min due checks, 39/min group enumeration,
23/min completion records at communication; 66/min operational telemetry events
at identity; 11/min outbox counts and 10/min affinity queue counts; 7/min graph
science refreshes. These are internal HTTP owner calls, not external downloads.
Admission/due calls are not all actual admitted job runs and cached checks need
not imply a Mongo read. The metrics do not assign an exact CPU percentage to a
route or establish which individual one-second CPU bump it caused.

Mongo logs additionally show `Checkpointer` / `WT_VERB_CHECKPOINT_PROGRESS`:
primary at 12:58:15.406Z and 12:59:15.440Z; secondary recurring around xx:xx:14Z.
This is direct evidence of periodic storage work on both replica members.

### Interpreting a 0.5% movement

The terminal's per-workload percentages use one core = 100%. Thus a pod at 0.5%
uses about 0.042% of this 12-logical-CPU host's capacity. System Monitor's
whole-host percentage has a different denominator. Mouse movement/window
redrawing can change desktop and host CPU, but does not directly consume CPU
inside an unrelated Java cgroup. The terminal's cgroup reads run in its observer;
its Kubernetes inventory requests consume k3s CPU, included in QEMU, rather than
executing application work inside every pod. A read-only counter read therefore
cannot explain away all observed application-container CPU.

The earlier measured guest terminal observer itself cost approximately 1.05%
of one core, plus about 0.21% for the host observer. The induced k3s/rendering cost
was not independently isolated. The temporary detailed profiler was more expensive
(~3.46% guest + ~1.70% host) and exited after each sample. No new continuous
profiler was left running for this attribution.

Evidence files: `/tmp/myscoutee-periodic-job-summary.json`,
`/tmp/myscoutee-periodic-job-history.json`,
`/tmp/myscoutee-periodic-http-rates.json`. Only projected operational scheduler
metadata was read; no fixture/data mutation or application action was performed.

## Follow-up: requested cadence and empty-pass changes (revision 120)

The subsequent user request changes the cadence map above: backend publication
is now **5 seconds** (receiver expiry **20 seconds**) and chat's empty blocking
Redis wait is **10 seconds**. Arrival still wakes immediately; isolated real
Spring/Lettuce checks measured 5 ms for concurrent SET/GET and 5 ms for XADD
wakeup while a read was blocked. Default command timeout is longer than the wait.
Terminal refresh, Kubernetes probes and Mongo checkpoints were not changed.

The four candidate-presence guards documented in
[the polling audit](DATABASE_POLLING_AUDIT.md#8-empty-scheduled-work-suppression--2026-10-09-follow-up)
now suppress empty moderation, event-watch, campaign-planning and basket-expiry
owner passes. A 71.7-second live window showed zero new runs in all six scopes
for each of those four jobs; admin telemetry continued in all six scopes and
runtime readiness stayed true. Redis total XREAD counter advanced by 13, with
no failures. No new CPU reduction percentage is claimed from a just-restarted
JVM; this evidence verifies actual skipped work rather than comparing warm-up
CPU to the earlier accepted baseline.

### First CPU observation after revision 120

Measured 2026-10-09 15:46:52–15:47:52 local time, using the same temporary
60-second host/guest cgroup and process sampler as revision 119. No build,
restart or application-data mutation was performed during this observation.

| Host capacity (12 logical CPUs) | Revision 119 | Revision 120 |
| --- | ---: | ---: |
| Whole host | 8.09% | 11.20% |
| QEMU, including everything in the guest | 5.26% | 5.61% |
| Host Grafana + Prometheus containers | 0.20% | 0.17% |
| Remaining host activity | 2.64% | 5.41% |

Guest container counters, using **one CPU core = 100%**, totalled 24.48%
(previously 17.75%). Per-container averages were communication 3.48%, affinity
3.48%, Mongo primary 3.43%, community 3.15%, identity 2.99%, Mongo secondary
2.44%, payments 1.84%, assets 1.21%, registry 0.56%, STUN 0.46%, Redis 0.46%,
CoreDNS 0.40%, MinIO 0.37%, frontend 0.16%; each remaining container was below
0.03%. These guest values are already included in QEMU and must not be added
to it. Guest work outside pods was 18.04% of one core, including k3s 10.15%,
containerd 1.93%, shims 3.33% and observation overhead.

The temporary sampler captured Java C2 compiler threads averaging 4.10% and
C1 compiler threads 1.93% of one core across the six backends. At 15:47:47,
the largest guest spike included compiler, HTTP request and scheduler threads;
thread names alone do not identify individual business operations. The largest
host spike at 15:46:53 included a Git process under VS Code using 255.57% of
one core. VS Code processes averaged 27.41%, GNOME Shell 10.71%, and System
Monitor 9.20%, all using the one-core denominator.

This is **not evidence of an aggregate CPU improvement**: the JVMs were more
recently restarted, compiler work was present, and desktop activity differed
between samples. Frontend CPU decreased from 0.246% to 0.157% of one core and
Redis from 0.607% to 0.458%, but these short observations do not isolate causal
savings. The earlier job-history evidence establishes skipped empty work.
The detailed profiler's own cost is included; it exited after the sample.
All application pods were Ready afterwards; the six Java pods and frontend
had zero restarts.

Evidence: `/tmp/myscoutee-rev120-cpu-timeline.jsonl`,
`/tmp/myscoutee-rev120-cpu-timeline-summary.json`, and
`/tmp/myscoutee-rev120-cpu-timeline-windows.json`.

### Requested repeat observation, revision 120 unchanged

Repeated the same 60-second sampler at 15:51:15–15:52:15 local time. Whole-host
CPU averaged **10.15%**, down from the immediately preceding 11.20% sample.
QEMU accounted for 5.39 percentage points (previously 5.61), host monitoring
0.18 (0.17), and remaining host activity 4.57 (5.41). Small rounding and
weighted/unweighted aggregation differences apply to the split totals.

All guest pods together averaged **21.54% of one core**, versus 24.48% in the
first revision-120 sample and 17.75% at revision 119. Java compiler threads
still averaged 4.87% of one core (C2 3.68%, C1 1.18%), versus 6.03% in the
preceding sample. The largest QEMU spike, at 15:51:52, coincided with C2/C1,
HTTP and scheduler thread activity. This is evidence of ongoing compilation,
not proof that all spikes are transient warm-up or that a particular scheduled
job caused them.

The largest application-container averages were affinity 3.20%, communication
2.87%, identity 2.72%, community 2.06%, payments 1.91%, and assets 1.23%, using
the one-core denominator. Mongo members averaged 3.05% and 2.20%, Redis 0.46%,
and frontend 0.17%. Host VS Code averaged 22.66% of one core, GNOME Shell 8.93%
and System Monitor 8.68%. The host sampler and guest sampler remain included
in these observations and exited afterwards. No configuration or runtime
changes were made for this repeat. The sample improved relative to the first
revision-120 observation, but remains above the accepted revision-119 baseline;
a durable aggregate CPU improvement is still unproven.

Evidence: `/tmp/myscoutee-rev120-repeat-cpu-timeline.jsonl`,
`/tmp/myscoutee-rev120-repeat-cpu-timeline-summary.json`, and
`/tmp/myscoutee-rev120-repeat-cpu-timeline-windows.json`.


## Revision 121: reuse Kubernetes readiness instead of duplicate heartbeats

The Kubernetes shell now watches EndpointSlices from the existing five-second
readiness probes. The six separate Java health/push workers are disabled in the
Helm configuration; guest thread inspection confirmed no runtime-status publisher
threads after rollout. The watch reconnects normally every thirty seconds using
resourceVersion, rather than issuing repeated health requests. Failure forces
an unknown state and a fresh discovery snapshot.

Frontend status polling was replaced with a shared SSE stream. It sends an
initial state and aggregate transitions, plus fifteen-second transport pings.
The ten-second browser timer only revisits local safe-navigation guards. These
changes remove a proven duplicate health-check path and browser HTTP polling;
no post-rollout CPU reduction is claimed without another settled measurement.
Monolith / Compose / E2E retain their existing heartbeat source and use the same
SSE contract. See PROGRESS.md and README.md for validation and failure semantics.


## Spike investigation after the timing changes (revision 121)

User observed more pronounced spikes after the timing changes. Investigated
without building, restarting, changing configuration, disabling scheduled jobs,
or operating the browser. Competing explanations were chat wait renewal,
periodic business/admin work, JVM compilation, and host desktop activity.

A previously insufficiently controlled comparison is now quantified from the
recorded `/proc` process start ticks and guest monotonic timestamps: at the
revision-119 8.09% whole-host sample, the Java processes had run **82.8–83.4
minutes**. At the first revision-120 sample they had run **4.3–4.9 minutes**;
at the first revision-121 spike sample **2.6–3.2 minutes**. Thus the earlier
8.09% figure is not a matched post-change benchmark. Both later deployments
restarted the JVMs; source changes and restart/warm-up were confounded.

| Measurement | Rev 119 | Rev 121 first | Rev 121 repeat, no intervening restart |
| --- | ---: | ---: | ---: |
| Local interval | 14:49:40–14:50:40 | 16:13:21–16:16:21 | 16:18:35–16:20:35 |
| Duration | 60 s | 180 s | 120 s |
| Whole host, 12-CPU capacity | 8.09% | 10.05% | 11.11% |
| QEMU share of whole host | 5.26% | 5.94% | 5.66% |
| All guest pods, one core = 100% | 17.75% | 25.18% | 22.22% |
| Java C1+C2 compiler threads, one core = 100% | 0.57% | 6.45% | 4.33% |
| Largest one-second guest busy sample, one core = 100% | 106.8% | 192.4% | 172.0% |

The repeated observation shows decreasing JVM compilation and VM/pod CPU without
another restart; it does not prove that the entire difference is temporary or
that all later spikes will disappear. Whole-host CPU increased during that
repeat because unrelated host activity changed. Profiler overhead remains
included. QEMU includes the guest; do not add those rows together.

### Matched periodic work

Projected `notificationRuleConfigs.runHistory` reads in REAL and DEMO, matched
against one-second thread/cgroup counters, identified:

- **Admin telemetry:** peaks around **16:13:56–57**, **16:14:58**,
  **16:15:59–16:16:00**, **16:19:04**, and **16:20:05** coincide with the
  approximately 61–62-second scheduled passes. The six database/group passes
  execute graph-statistics refresh, profile counts, and admin menu counters.
  They involve identity, affinity, community and communication owner calls.
  `AdminStatsTelemetryWorkerService` still uses the same 60,000 ms fixed delay
  as the revision-119 source; the recent chat/heartbeat changes did not lengthen
  this job's interval. Its admin scheduling configuration remains authoritative.
- **Event counter expiry:** the spikes at **16:14:49** and **16:19:51** align
  with recorded expiry passes at **16:14:48.419–49.041** and
  **16:19:50.289–50.901** for REAL community and the three DEMO scopes.
  The other two REAL scopes have a different due phase. This accounts for an
  approximately five-minute burst independently of the chat wait timeout.
- **JIT amplification:** the large guest samples include C1/C2 compiler threads
  alongside HTTP/scheduler threads. At 16:13:57 the compiler threads together
  used about **91% of one core**, within the guest's **186%** busy sample.
  Thread counters plus job histories establish overlap and the execution path;
  they are not method-level stack traces or a full causal allocation of every
  sampled CPU tick.
- **Chat:** its dedicated consumer thread averaged **0.028% of one core** over
  the first 180-second window. This excludes CPU on shared Lettuce/network
  threads, so it is not a complete chat transport cost. The measured large
  bursts align with the jobs above, not a demonstrated ten-second chat batch.
  Recent communication logs contained no repeating stream errors.

The old baseline already contained a guest spike of 106.8% of one core; the new
spikes are genuinely larger, so an average-only comparison is insufficient.
No timing rollback or removal of admin-configurable work was performed without
causal evidence. Remaining optimization should target the measured scheduled
work while retaining configuration freshness and time-dependent counters; the
current evidence does not establish a timing-induced batching defect.

Evidence: `/tmp/myscoutee-rev121-spikes-cpu-timeline{.jsonl,-summary.json,-windows.json}`,
`/tmp/myscoutee-rev121-settled-cpu-timeline{.jsonl,-summary.json,-windows.json}`,
and `/tmp/myscoutee-rev121-spikes-matched-jobs.json`. Both temporary samplers
exited. No application data or live timing settings were changed.


### Clarification: "empty" admin telemetry is not an idle no-op

Code tracing after the user's follow-up found two distinct facts:

1. Even when XREAD returns no records, `AdminStatsTelemetryWorkerService`
   explicitly invokes graph/profile statistics refresh and admin menu counter
   refresh. `AdminStatsService.refreshGraphScienceSnapshot()` reads or creates
   the scoped snapshot, recomputes the graph and profile counts, always changes
   `generatedAtIso`, then saves the snapshot. Existing documents are saved again;
   a new snapshot is created only when missing. Admin user counter documents are
   saved only when their calculated values differ. Scheduling admission and
   completion additionally update the rule document and its bounded run history.
2. The scheduler's begin/completion methods emit `jobs.run.started` and terminal
   `jobs.run.*` telemetry, including for `admin-telemetry` itself. The consumer's
   own run can therefore create stream work even without user activity. This is
   scheduled self-generated work, not evidence of an unbounded immediate loop.

The shared `NotificationJobs.runScheduledGroup` records a fixed processedCount
of zero for its Runnable callback. Thus **a zero in this run history does not
prove XREAD returned no events**. The timing correlation above identifies when
jobs ran, not whether the live consumer took the empty or nonempty branch.
Both branches perform graph/profile refresh and Mongo snapshot saves. This
clarification supersedes any inference of stream emptiness from processedCount.
No application behavior was changed during this diagnosis.


### Admin telemetry empty-pass correction — Helm revision 122

The empty-read issue above is now corrected in canonical Java, with the existing
admin rule gate and shared Mongo change stream preserved. See
[the polling audit, section 9](DATABASE_POLLING_AUDIT.md#9-p16-skip-unchanged-telemetry-projections--2026-10-09).
Only identity and communication were built offline and packaged with Docker
networking disabled; exactly two images were transferred over the local VM link.
The coordinated backend upgrade guard restarted six Java workloads.

Live evidence (UTC, 2026-10-09):

- Startup dependency unavailability at 14:36:57–14:37:00 was recorded as failed
  telemetry passes. All six scopes recovered automatically at 14:38:00–03.
- The affinity graph-refresh HTTP counter reached **6**, then **9**, then **12**
  during startup reconciliation. Oplog inspection showed DEMO admin-user document
  replacements; comparing successive documents isolated the recovery change to
  `activities.adminJobs`. These replacements conservatively invalidate the whole
  database's graph projection, including the other DEMO groups.
- Between observations at approximately **14:40:28 and 14:41:30**, the counter
  remained **12**. The last scrape was 14:41:21, after the next minute trigger.
  All **six** telemetry `lastRunAtIso` values also remained unchanged: that empty
  pass performed neither a graph refresh nor a job claim/history update.
- All **15 pods Ready**; no new backend restarts. Before/after comparison of the
  six rules' enabled/timing settings was identical. No fixture or admin setting
  was changed for validation.

This proves empty-pass suppression in the deployed split runtime, alongside
**22 passing focused JUnit tests**. It is not a matched warmed-up whole-host CPU
comparison or a full browser/E2E result. Ordinary source mutations (including
whole-user replacements) still reconcile; genuine telemetry still persists.
The cheap minute Redis reads and existing group routing remain explicit costs.

Evidence: `/tmp/myscoutee-admin-idle-{tests,build,images,import,deploy}.log`,
`/tmp/myscoutee-admin-idle-metrics.jsonl`,
`/tmp/myscoutee-admin-idle-input-deltas.json`, and
`/tmp/myscoutee-admin-idle-{before,live-5,final}.json`.


### Revision 122 settled CPU sample before blocking telemetry reads

Measured **16:53:35–16:56:35 Europe/Prague**, 180 seconds, no build or restart.
The JVMs had run for approximately 17 minutes before collection. The same
one-second host/guest process, thread and cgroup sampler was reused; its own
CPU remains included. This sample predates the subsequent Redis-reader change.

| Component | Average, whole 12-CPU host capacity |
| --- | ---: |
| Entire host | 11.68% |
| QEMU / complete VM | 5.15% |
| Host Prometheus + Grafana | 0.18% |
| Host outside VM and those monitoring containers | 6.34% |
| VS Code processes, included in the preceding host row | 3.85% |

All guest pods together averaged **17.20% of one core** (equivalent to 1.43% of
host capacity), versus 22.22% in the earlier revision-121 repeat. Guest CPU
outside pods averaged **18.60% of one core**. QEMU includes guest CPU and
virtualization work, so its row must not be added to guest/pod rows. The older
revision-119 VM share was 5.26%; this measurement is approximately at that level,
while unrelated host activity raised the whole-machine average.

Largest consumers among pods, one core = 100%: Mongo primary 3.10%, secondary
2.45%, communication 2.48%, identity 1.82%, community 1.56%, affinity 1.51%,
payments 1.12%, assets 0.77%, Redis 0.45%, frontend 0.12%.

The largest whole-host one-second sample was **41.10%**, at **16:55:17**.
Its leading processes were three VS Code processes (141.5%, 93.7%, 88.7% of one
core); QEMU used 43.8% of one core in that second. The next two largest host
samples were also led by VS Code processes. This identifies the process source,
not the exact editor/extension operation. The initial 78-second reading of
9.56% whole-host CPU was preliminary; the complete three-minute mean is above.

At the start of this sample, the graph-refresh counter was still **12**, the
same count observed at 16:41. No new CPU-improvement claim is attached to the
subsequent blocking-reader deployment without another settled measurement.

Evidence: `/tmp/myscoutee-rev122-settled-cpu-timeline{.jsonl,-summary.json,-windows.json}`.
The sampler completed and left no background collection process running.

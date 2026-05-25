# Stress Test Plan

This plan uses the existing `e2e/stress` runner as the common harness for API,
workflow, and WebSocket pressure tests. The goal is to find bottlenecks and keep
before/after optimization work measurable.

## Core Metrics

Every recorded stress run writes `.e2e-artifacts/stress/<run>/summary.json`,
`metrics.json`, `resources.json`, and `index.md`.

Use these metrics for every optimization:

| Metric | Why it matters |
| --- | --- |
| `errorRate` | Correctness under pressure. Speed wins do not count if errors rise. |
| `requestsPerSec` / `passedPerSec` | Throughput. This should rise when capacity improves. |
| `avgMs`, `p50Ms`, `p95Ms`, `p99Ms`, `maxMs` | Latency profile. `p95` and `p99` are the main bottleneck signals. |
| `byStep.*` | Isolates which application area or endpoint family is slow. |
| `statusCounts` | Shows whether failures are timeouts, 4xx, 5xx, or websocket open failures. |
| `responseBytes` | Helps explain throughput changes caused by larger/smaller payloads. |
| `resourceSummary.host` | Host memory/load pressure during the run. |
| `resourceSummary.containers` | Per-container peak CPU and memory when run with `--record`. |

For WebSocket room load, also track:

| Metric | Why it matters |
| --- | --- |
| socket open p95/max | Connection pressure and handshake bottlenecks. |
| receive p95/p99/max | Per-client live delivery latency. |
| full fanout p95/max | How long one message takes to reach the whole room. |
| duplicate/replay counts and latency | Redis replay or fanout duplication regressions. |
| Redis stream length deltas | Whether stream writes/consumer cleanup keep up. |

## Run Method

Start the normal stack for read-only contract scenarios:

```bash
cd server
docker compose up --build
```

Run a baseline and record artifacts:

```bash
node e2e/stress/run.mjs --scenario server-events-read --record
```

After a code or infrastructure change, rerun the same scenario with the same
machine, database seed, users, duration, and think time. Then compare the two
artifact directories or their `summary.json` files:

```bash
node e2e/stress/compare.mjs \
  .e2e-artifacts/stress/server-events-read-baseline \
  .e2e-artifacts/stress/server-events-read-candidate
```

For playground mutation scenarios and destructive WebSocket room load, start the
playground/stress stack instead:

```bash
cd server
MONGO_PLAYGROUND_DATABASE=playground_db \
docker compose -f docker-compose.yml -f docker-compose.playground.yml up --build
```

## Scenario Matrix

| Scenario | Purpose | Command |
| --- | --- | --- |
| `server-profile-read` | Auth/profile editor payloads, experience state, realtime counters, privacy consent state. | `node e2e/stress/run.mjs --scenario server-profile-read --record` |
| `server-events-read` | Event explore/filter/list and user event buckets. | `node e2e/stress/run.mjs --scenario server-events-read --record` |
| `server-event-editor-read` | Event editor members, invite candidates, resources, leaderboard. | `node e2e/stress/run.mjs --scenario server-event-editor-read --record` |
| `server-assets-rates-read` | Asset editor/resource picker/tickets and rates smart-list APIs. | `node e2e/stress/run.mjs --scenario server-assets-rates-read --record` |
| `server-chats-read` | Chat list/page/messages and websocket connection pressure. | `node e2e/stress/run.mjs --scenario server-chats-read --record` |
| `server-admin-content-read` | Admin dashboards, monitoring, notification state, public content/i18n. | `node e2e/stress/run.mjs --scenario server-admin-content-read --record` |
| `server-read-sweep` | Broad read regression sweep across major safe endpoints. | `node e2e/stress/run.mjs --scenario server-read-sweep --record` |
| `server-capacity-probe` | Opt-in heavier capacity probe. | `node e2e/stress/run.mjs --scenario server-capacity-probe --record` |
| `playground-flow-smoke` | Destructive mutation workflow pressure in disposable DB. | `E2E_STRESS_MODE=stress node e2e/stress/run.mjs --scenario playground-flow-smoke --record` |
| WebSocket room | Stateful chat fanout simulation with many clients in one seeded room. | `node e2e/stress/websocket-room.mjs --clients 500 --messages 20 --send-rate 2 --record` |

## Measurement Rules

Use the same scenario and environment before and after a change:

- Same branch baseline/candidate except for the intended optimization.
- Same Docker compose mode and database seed.
- Same machine load, or run when the machine is otherwise idle.
- Same scenario config: users, ramp-up, duration, think time, and thresholds.
- Run each important scenario at least 3 times and compare the median `p95Ms`,
  `p99Ms`, and `requestsPerSec`.
- Treat any higher `errorRate` as a regression unless the errors are explained
  and unrelated to the change.

Primary success signal:

- `p95Ms` and `p99Ms` decrease for the target step.
- `requestsPerSec` or `passedPerSec` increases at the same error rate.
- Container CPU/memory peaks do not grow unexpectedly.

Secondary signal:

- `maxMs` improves or becomes less spiky.
- Payload size drops without losing contract coverage.
- Bottleneck moves from one service/container to another in a way that matches
  the intended optimization.

## Latest Playground Measurement

These measurements were taken against `playground_db`. The durable Docker
index changes are applied through Mongo init/import scripts so the same access
paths are created for `playground_db`, `demo_db`, and `myscoutee_db`.

| Scenario | Baseline | After Mongo indexes | Change |
| --- | --- | --- | --- |
| `server-events-read` | 4.72 req/s, p95 5748ms, p99 6396ms | 8.75 req/s, p95 1515ms, p99 1649ms | +85.2% req/s, -73.6% p95, -74.2% p99 |
| `server-chats-read` | 7.69 req/s, p95 1227ms, p99 1524ms | 8.73 req/s, p95 960ms, p99 1118ms | +13.6% req/s, -21.8% p95, -26.6% p99 |
| `server-profile-read` | 20.33 req/s, p95 678ms, p99 769ms | 21.13 req/s, p95 641ms, p99 720ms | +3.9% req/s, -5.5% p95, -6.4% p99 |

The largest win came from indexing normalized lookup collections such as
members, chat messages, feedback states, assets, users, privacy consent, and
filter preferences. The remaining p95 in events and chat is now more likely to
come from request-time graph assembly, in-memory filtering/sorting, and payload
shape than from missing indexes alone.

Direct Mongo `explain("executionStats")` probes after the index pass showed the
main hot lookup shapes using `IXSCAN` with roughly 1 document examined per
document returned:

- Event explore, owner, source, creator, and admin lookups.
- Event member owner/user/status lookups.
- Chat owner/date, chat id, member id, channel type, message page, and message
  sender lookups.
- Asset owner/id, activity resource owner/subevent/asset-owner, user id/profile
  status, and user rate evidence lookups.

One remaining repository shape still used `COLLSCAN + SORT`:
`eventFeedbackStates.findByEventIdInOrderByEventIdAscUpdatedDateDesc`. Adding
`{ eventId: 1, updatedDate: -1 }` changed that probe to `IXSCAN` with no sort
stage.

After batching member/admin snapshots for direct owner event scopes, the same
`server-events-read` scenario improved again:

| Scenario | After Mongo indexes | After direct-scope snapshot batching | Change |
| --- | --- | --- | --- |
| `server-events-read` | 8.75 req/s, p95 1515ms, p99 1649ms | 10.17 req/s, p95 1375ms, p99 1484ms | +16.3% req/s, -9.2% p95, -10.0% p99 |
| `hosting` step | p95 1643ms | p95 824ms | -49.8% p95 |
| `trash` step | p95 861ms | p95 806ms | -6.5% p95 |
| `invitations` step | p95 879ms | p95 805ms | -8.4% p95 |

Focused JUnit coverage: `ActivitiesEventsServiceTest` verifies direct owner
scopes use batched member snapshots instead of per-record owner snapshot
queries.

## Latest Events Ramp

Command:

```bash
node e2e/stress/ramp.mjs \
  --scenario server-events-read \
  --users 4,8,16,32 \
  --duration-ms 45000 \
  --ramp-up-ms 10000 \
  --think-time-ms 100 \
  --think-time-jitter-ms 100
```

Previous direct-scope batching ramp:
`.e2e-artifacts/stress-ramp/server-events-read-2026-05-25T09-55-05-960Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 6.88 | 0.00% | 921ms | 1109ms | `event filter` p95 1137ms |
| 8 | 9.89 | 0.00% | 1341ms | 1445ms | `event list` p95 1466ms |
| 16 | 11.15 | 0.00% | 2396ms | 2807ms | `event list` p95 2805ms |
| 32 | 10.01 | 0.33% | 6662ms | 7631ms | `event list` p95 7704ms |

Clean rerun after the 1-5 fixes:
`.e2e-artifacts/stress-ramp/server-events-read-2026-05-25T11-42-27-431Z`

For this server-only measurement the playground ran with hot reload off,
MongoTemplate query logging at `WARN`, scheduler/admin/affinity background work
disabled, and `frontend-sync` stopped so the API/Mongo path was not competing
with frontend file watching.

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 8.16 | 0.00% | 694ms | 827ms | `event filter` p95 827ms |
| 8 | 11.51 | 0.00% | 1239ms | 1350ms | `event list` p95 1350ms |
| 16 | 12.93 | 0.00% | 2293ms | 2494ms | `event list` p95 2494ms |
| 32 | 11.20 | 0.15% | 6223ms | 7502ms | `event list` p95 7598ms |

After slim event list-card fast path:
`.e2e-artifacts/stress-ramp/server-events-read-2026-05-25T12-21-00-256Z`

For `slim=true`, the event-list endpoint now skips full slot occurrence
materialization, affinity/member snapshot fanout, and full event DTO graph
assembly. It projects only the fields needed by the list card and uses the
owner/source indexes before mapping the page response.

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step | `event list` p95 |
| ---: | ---: | ---: | ---: | ---: | --- | ---: |
| 4 | 8.26 | 0.00% | 843ms | 1046ms | `attending` p95 1046ms | 105ms |
| 8 | 10.99 | 0.00% | 1431ms | 1634ms | `event filter` p95 1658ms | 162ms |
| 16 | 12.12 | 0.00% | 2825ms | 3367ms | `event filter` p95 3528ms | 361ms |
| 32 | 13.11 | 0.00% | 6105ms | 6993ms | `event filter` p95 7468ms | 572ms |

`event list` p95 versus the clean 1-5 rerun:

| Virtual users | Before | After | Change |
| ---: | ---: | ---: | ---: |
| 4 | 749ms | 105ms | 7.2x faster |
| 8 | 1350ms | 162ms | 8.4x faster |
| 16 | 2494ms | 361ms | 6.9x faster |
| 32 | 7598ms | 572ms | 13.3x faster |

After event-filter and attending slim page fast paths:
`.e2e-artifacts/stress-ramp/server-events-read-2026-05-25T13-46-56-486Z`

This was a short directional 4/8-user rerun because the host still had Chrome
and VS Code activity. The playground API ran with `frontend-sync` stopped and
was shut down after the run. The production Angular Activities event smart-list
now opts into `slim: true` for `/activities/events/filter`, while the old
backend full-page/array contracts remain available.

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step | `event filter` p95 | `attending` p95 |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 4 | 9.06 | 0.00% | 758ms | 938ms | `attending` p95 938ms | 916ms | 938ms |
| 8 | 14.11 | 0.00% | 1111ms | 1266ms | `event filter` p95 1285ms | 1285ms | 1265ms |

8-user delta versus the previous list-card fast-path run:

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Scenario throughput | 10.99 req/s | 14.11 req/s | 1.28x higher |
| Scenario p95 | 1431ms | 1111ms | 1.29x faster |
| `event filter` p95 | 1658ms | 1285ms | 1.29x faster |
| `attending` p95 | 1532ms | 1265ms | 1.21x faster |
| `event filter` payload | 27.1 KiB | 10.4 KiB | 2.5x smaller |
| `attending` payload | 158.4 KiB | 11.8 KiB | 13.4x smaller |

Interpretation: this is a real deployed-path improvement for the Activities
event smart-list because the frontend now requests the slim filter page. It is
not yet a 5x latency win for `event filter` because the backend still builds a
viewer-scoped Java list and member snapshots before slicing the page. The next
5x-class candidate is to move filter/attending card reads to a narrow
event-user read model or Mongo-side page query with denormalized membership
state, so the request does not need broad member-snapshot fanout.

After moving slim filter/attending/list reads to narrow list-card query
contexts:
`.e2e-artifacts/stress-ramp/server-events-read-2026-05-25T14-29-48-364Z`

This short 4/8-user rerun was taken after the API playground settled to about
92% host CPU idle. The API still ran with `frontend-sync` stopped. The change
keeps the old full contracts intact and only changes the optional `slim` paths:
the backend now loads list-card fields and membership status directly instead
of building full member snapshots and broad event DTO graphs before paging.

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step | `event filter` p95 | `event list` p95 | `attending` p95 |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| 4 | 15.00 | 0.00% | 334ms | 483ms | `trash` p95 491ms | 109ms | 83ms | 66ms |
| 8 | 23.46 | 0.00% | 573ms | 623ms | `hosting` p95 623ms | 105ms | 95ms | 82ms |

8-user delta versus the previous slim filter/attending run:

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Scenario throughput | 14.11 req/s | 23.46 req/s | 1.66x higher |
| Scenario p95 | 1111ms | 573ms | 1.94x faster |
| `event filter` p95 | 1285ms | 105ms | 12.2x faster |
| `attending` p95 | 1265ms | 82ms | 15.4x faster |

Interpretation:

- The event-list endpoint itself reached the 5x-class target. The improvement
  comes from avoiding broad Java-side graph assembly when the screen only needs
  the first page of cards.
- The previous 5x-class candidate for `event filter` and `attending` also paid
  off. Their p95 values are now close to the cheap feedback/list-card calls, so
  the bottleneck moved away from these endpoints.
- The remaining full-scenario p95 is now dominated by the older full-list
  buckets: `hosting`, `trash`, and `invitations`. At 8 virtual users their p95
  values were 623ms, 611ms, and 596ms, while `event filter` and `attending`
  stayed near 100ms.
- This is not a direct count of real logged-in humans. One ramp virtual user
  loops through 9 event endpoints with only 100-200ms think time, so it is a
  heavy API pressure model. It is useful for bottleneck ranking, not a literal
  "8 people can use the app" conclusion.
- The main bottleneck remains request-time fanout and DTO construction for the
  remaining broad list endpoints, especially `hosting`, `trash`, and
  `invitations`.
  A live Mongo explain for owner sorted reads used
  `event_owner_start_source` with `IXSCAN`, 13 keys examined, 13 docs examined,
  and 13 docs returned.
- Post-run container snapshot before shutdown: `myscoutee` was at about 5% CPU
  and 1.75 GiB memory, `mongodb` at about 1% CPU and 153 MiB memory.
  Playground was then stopped to avoid background load.

Payload profile:

| Step | Before 1-5 fixes | After 1-5 fixes | After list-card fast path | Change |
| --- | ---: | ---: | ---: | ---: |
| `event list` | 442 KiB | 11.8 KiB | 11.8 KiB | 37x smaller |
| `hosting` | 263 KiB | 262.8 KiB | 262.8 KiB | unchanged |
| `attending` | 158 KiB | 158.4 KiB | 11.8 KiB | 13.4x smaller after slim |
| `event explore` | 44 KiB | 44 KiB | 44 KiB | unchanged |
| `event filter` | 30 KiB | 29.5 KiB | 10.4 KiB | 2.8x smaller after slim |
| `invitations` | 15 KiB | 15.3 KiB | 15.3 KiB | unchanged |
| `trash` | 5 KiB | 5.2 KiB | 5.2 KiB | unchanged |

The new fast-path payload profile was stable across all 4/8/16/32-user rows.
Older failed 32-user rows from previous runs can understate full response size
for endpoints that timed out.

5x-class improvement candidates from this ramp:

- Done for `event list`: the slim list-card path now queries only page/card
  fields and no longer assembles the full event graph before slicing.
- Done for optional slim `event filter` and `attending`: the backend now avoids
  member snapshot fanout before paging by loading list-card fields and tracked
  membership status directly. The old full contracts remain available.
- Slim and page `hosting`, `trash`, and `invitations` next. These are now the
  slowest event-read steps under the 8-user ramp, and they still use the older
  full DTO/snapshot path.
- Denormalize narrow parent/read-model fields for hot list views: viewer
  membership state, accepted/pending counters, feedback state, primary resource
  summary, ticket state, visibility/status, and sortable timestamps. Maintain
  these from write-side updates or Mongo change streams with idempotent repair
  jobs.
- Push `hosting`, `trash`, and `invitations` pagination/sort into Mongo or the
  read model before DTO construction. Avoid materializing broad Java lists and
  child collection fanout when only a page of cards is needed.
- Remove `materializeSlotOccurrences()` and similar derived calculations from
  hot read endpoints; precompute them on writes, scheduled repair, or read-model
  refresh.
- Keep `event filter` and `attending` backed by contract tests while the
  frontend opts into the slim path. These are optional backend parameters, so
  default callers still receive the previous full payloads.
- Keep load-test playgrounds close to production behavior: no dev DEBUG query
  logs, no hot reload, and no scheduler/admin/affinity background jobs on the
  same request node while measuring request capacity.

## Mongo Modeling Targets

Mongo performance work should consider both indexes and selective
denormalization. If a request always needs data from child collections to render
a parent list, copying stable or cheap-to-maintain fields onto the parent/read
model can remove per-request fanout.

Good candidates:

- Event list cards: keep participant/status counters, current user's membership
  state, pending feedback state, and primary resource summary in an event-scoped
  read model so list/filter endpoints do not repeatedly join members, feedback,
  resources, and tickets at request time.
- User profile realtime counters: materialize activity/menu counters on the user
  or a user dashboard document and update from Mongo change streams or write-side
  service events.
- Chat list: keep last message summary, unread count, participant display
  snapshot, and last activity timestamp on the chat/member document.
- Asset/resource picker: copy resource ownership/type/status fields needed for
  picker filtering onto the resource or event read model instead of resolving
  every linked asset during list reads.

Keep denormalized fields narrow and measurable:

- Only copy fields required by hot read paths.
- Update them on the write path or via change streams with idempotent repair
  jobs.
- Add drift checks in e2e/stress setup or admin diagnostics.
- Measure before/after with the same scenario, then keep the new threshold in
  the scenario JSON if the improvement is stable.

## Bottleneck Workflow

1. Run `server-read-sweep --record` to find the slowest broad area.
2. Run the matching focused scenario from the matrix.
3. Inspect `index.md` and sort by `byStep.p95Ms` / `byStep.p99Ms`.
4. Check `resources.json` for CPU, memory, and load peaks during the same run.
5. Optimize one bottleneck at a time.
6. Rerun the same scenario and compare with `e2e/stress/compare.mjs`.
7. Promote useful thresholds into the scenario JSON so future regressions fail.

## Suggested First Targets

Based on current coverage and product risk, start in this order:

1. `server-events-read`: event explore/filter/list paths are likely to expose
   query, sorting, pagination, and materialization costs.
2. `server-chats-read` plus `websocket-room.mjs`: chat combines list reads,
   message history, websocket handshakes, Redis fanout, and memory pressure.
3. `server-assets-rates-read`: asset/rates smart-list behavior already has UI
   regression notes, so read performance and payload shape are worth watching.
4. `server-admin-content-read`: admin/content endpoints are usually lower user
   volume, but dashboard and monitoring calls can hide expensive aggregations.

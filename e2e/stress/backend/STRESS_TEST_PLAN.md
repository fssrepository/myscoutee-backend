# Stress Test Plan

This plan uses `e2e/stress/backend` as the common harness for API,
workflow, and WebSocket pressure tests. The goal is to find bottlenecks and keep
before/after optimization work measurable.

## Core Metrics

Every recorded backend stress run writes `.e2e-artifacts/stress/backend/<run>/summary.json`,
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
node e2e/stress/backend/run.mjs --scenario server-events-read --record
```

For data-sensitive event runs, pin the same seeded demo user before comparing
artifacts:

```bash
E2E_STRESS_DEMO_USER_ID=bf057de7c586eede7e84bdc7 \
node e2e/stress/backend/run.mjs --scenario server-events-read --record
```

The runner fails if an explicitly pinned stress user is not returned by
`/api/auth/demo-users`; increase `E2E_STRESS_DEMO_USERS_LIMIT` if the seed user
is outside the default returned set.

After a code or infrastructure change, rerun the same scenario with the same
machine, database seed, users, duration, and think time. Then compare the two
artifact directories or their `summary.json` files:

```bash
node e2e/stress/backend/compare.mjs \
  .e2e-artifacts/stress/backend/server-events-read-baseline \
  .e2e-artifacts/stress/backend/server-events-read-candidate
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
| `server-profile-read` | Auth/profile editor payloads, experience state, realtime counters, privacy consent state. | `node e2e/stress/backend/run.mjs --scenario server-profile-read --record` |
| `server-events-read` | Event explore/filter/list and user event buckets. | `node e2e/stress/backend/run.mjs --scenario server-events-read --record` |
| `server-event-feedback-list` | Focused first-load pressure for `/api/activities/events/feedback`. | `node e2e/stress/backend/run.mjs --scenario server-event-feedback-list --record` |
| `server-event-editor-read` | Event editor members, invite candidates, resources, leaderboard. | `node e2e/stress/backend/run.mjs --scenario server-event-editor-read --record` |
| `server-assets-rates-read` | Asset editor/resource picker/tickets and rates smart-list APIs. | `node e2e/stress/backend/run.mjs --scenario server-assets-rates-read --record` |
| `server-chats-read` | Chat list/page/messages and websocket connection pressure. | `node e2e/stress/backend/run.mjs --scenario server-chats-read --record` |
| `server-admin-content-read` | Admin dashboards, monitoring, notification state, public content/i18n. | `node e2e/stress/backend/run.mjs --scenario server-admin-content-read --record` |
| `server-admin-affinity-graph-view` | Admin graph view open path and lazy graph navigation (`meta`, `forests`, `tile`, `neighborhood`). | `node e2e/stress/backend/run.mjs --scenario server-admin-affinity-graph-view --record` |
| `server-read-sweep` | Broad read regression sweep across major safe endpoints. | `node e2e/stress/backend/run.mjs --scenario server-read-sweep --record` |
| `server-capacity-probe` | Opt-in heavier capacity probe. | `node e2e/stress/backend/run.mjs --scenario server-capacity-probe --record` |
| `playground-flow-smoke` | Destructive mutation workflow pressure in disposable DB. | `E2E_STRESS_MODE=stress node e2e/stress/backend/run.mjs --scenario playground-flow-smoke --record` |
| WebSocket room | Stateful chat fanout simulation with many clients in one seeded room. | `node e2e/stress/backend/websocket-room.mjs --clients 500 --messages 20 --send-rate 2 --record` |

## Current Graph View Measurement

The admin affinity graph view scenario is ready. It mirrors the iframe's real
open path by running `meta`, `forests`, and root `tile` in parallel, then lazy
forest-level, component-tile, and neighborhood requests.

Current status on 2026-05-26:

- Contract smoke passed with `node e2e/functional/backend/run.mjs --case affinity-graph --fail-fast`.
- Baseline artifact:
  `.e2e-artifacts/stress/backend/server-admin-affinity-graph-view-2026-05-26T10-20-27-327Z`
- After duplicate edge-query removal and durable graph index import:
  `.e2e-artifacts/stress/backend/server-admin-affinity-graph-view-2026-05-26T10-27-15-378Z`

| Run | Requests | Req/s | Error rate | p95 | p99 | Slowest step |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Baseline | 1740 | 28.74 | 0.00% | 141ms | 160ms | `graph tile root` p95 154ms |
| After graph backend/index pass | 1758 | 29.16 | 0.00% | 131ms | 157ms | `graph tile root` p95 145ms |

This pass keeps all graph API response contracts unchanged. The backend tile
path now queries relevant materialized edges once and computes truncation from
that list instead of repeating the same Mongo query. The Mongo import script now
ensures the materialized graph indexes for runtime-generated graph collections,
so `playground_db`, `demo_db`, and `myscoutee_db` do not depend on Spring
auto-index creation.

The result is a modest cleanup, not a 5x-class graph lever: scenario p95
improved about 1.07x and throughput improved about 1.01x. Container peaks still
show the backend as the bottleneck (`myscoutee` about 303% CPU peak) while
Mongo stayed low (`mongodb` about 20% CPU peak). The next major graph candidate
is payload/read-model shape for root tile, component tile, and neighborhood
responses: the run returned about 249 MiB in 60 seconds, mostly from those graph
payloads.

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
node e2e/stress/backend/ramp.mjs \
  --scenario server-events-read \
  --users 4,8,16,32 \
  --duration-ms 45000 \
  --ramp-up-ms 10000 \
  --think-time-ms 100 \
  --think-time-jitter-ms 100
```

Previous direct-scope batching ramp:
`.e2e-artifacts/stress-ramp/backend/server-events-read-2026-05-25T09-55-05-960Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 6.88 | 0.00% | 921ms | 1109ms | `event filter` p95 1137ms |
| 8 | 9.89 | 0.00% | 1341ms | 1445ms | `event list` p95 1466ms |
| 16 | 11.15 | 0.00% | 2396ms | 2807ms | `event list` p95 2805ms |
| 32 | 10.01 | 0.33% | 6662ms | 7631ms | `event list` p95 7704ms |

Clean rerun after the 1-5 fixes:
`.e2e-artifacts/stress-ramp/backend/server-events-read-2026-05-25T11-42-27-431Z`

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
`.e2e-artifacts/stress-ramp/backend/server-events-read-2026-05-25T12-21-00-256Z`

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
`.e2e-artifacts/stress-ramp/backend/server-events-read-2026-05-25T13-46-56-486Z`

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
`.e2e-artifacts/stress-ramp/backend/server-events-read-2026-05-25T14-29-48-364Z`

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

After direct-bucket slim page fast paths for `hosting`, `trash`, and
`invitations`:
`.e2e-artifacts/stress-ramp/backend/server-events-read-2026-05-26T07-48-41-951Z`

This rerun keeps the legacy array contracts available and changes only callers
that opt into `limit`, `cursor`, or `slim=true`. The stress scenario now uses
the slim page contracts for the three direct buckets that were the previous
bottleneck.

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step | `hosting` p95 | `trash` p95 | `invitations` p95 |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| 4 | 23.58 | 0.00% | 175ms | 212ms | `event explore` p95 216ms | 57ms | 64ms | 58ms |
| 8 | 47.13 | 0.00% | 198ms | 261ms | `event explore` p95 274ms | 54ms | 54ms | 53ms |

8-user delta versus the previous narrow list-card run:

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Scenario throughput | 23.46 req/s | 47.13 req/s | 2.01x higher |
| Scenario p95 | 573ms | 198ms | 2.89x faster |
| `hosting` p95 | 623ms | 54ms | 11.5x faster |
| `trash` p95 | 611ms | 54ms | 11.3x faster |
| `invitations` p95 | 596ms | 53ms | 11.2x faster |

The bottleneck moved again. `event explore` is now the slowest event-read step
at 274ms p95 under 8 virtual users, while every list-card bucket is below 100ms
p95. Post-run container snapshot before shutdown: `myscoutee` was at about 6%
CPU and 1.30 GiB memory, `mongodb` at about 1% CPU and 275 MiB memory.

After the `event explore` page fast path:
`.e2e-artifacts/stress-ramp/backend/server-events-read-2026-05-26T08-08-40-069Z`

This pass keeps the response contract the same and changes only how the backend
builds the page. The hot explore page now avoids slot occurrence materialization
on request-time reads, queries only active canonical page candidates with the
fields required for list cards, and builds full DTOs only for the returned page.
Viewer edge weights are loaded only for `most-relevant` ordering.

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step | `event explore` p95 | `event filter` p95 | `event list` p95 |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| 4 | 25.84 | 0.00% | 88ms | 123ms | `event explore` p95 143ms | 143ms | 81ms | 69ms |
| 8 | 48.80 | 0.00% | 105ms | 142ms | `event explore` p95 151ms | 151ms | 112ms | 104ms |

8-user delta versus the direct-bucket run:

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Scenario throughput | 47.13 req/s | 48.80 req/s | 1.04x higher |
| Scenario p95 | 198ms | 105ms | 1.89x faster |
| `event explore` p95 | 274ms | 151ms | 1.81x faster |

8-user delta versus the last broad-list bottleneck run:

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Scenario p95 | 573ms | 105ms | 5.46x faster |
| Scenario p99 | 1328ms | 142ms | 9.35x faster |

Post-run container snapshot: `myscoutee` was at about 5.5% CPU and 1.15 GiB
memory, `mongodb` at about 1.4% CPU and 119 MiB memory. Baseline before the run
was about 95% host CPU idle, with no stress process already running.

Short capacity probe after the same explore fast path:
`.e2e-artifacts/stress-ramp/backend/server-events-read-2026-05-26T08-12-30-649Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step | `event explore` p95 | Host load |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 16 | 98.63 | 0.00% | 110ms | 134ms | `event explore` p95 144ms | 144ms | 3.23 |
| 32 | 165.63 | 0.00% | 173ms | 218ms | `event explore` p95 234ms | 234ms | 9.84 |

The 32-user row is still clean and usable for this API pressure model, but the
knee is becoming visible in host load and explore p95. One virtual user loops
through nine event endpoints with only 100-200ms think time, so this is heavier
than one normal person browsing one screen. Treat the 32-user result as roughly
`165 req/s` of sustained event-read API pressure, not as exactly 32 real users.
Post-run container snapshot: `myscoutee` was at about 6.2% CPU and 1.41 GiB
memory, `mongodb` at about 1.0% CPU and 121 MiB memory. Baseline before this
probe was about 92% host CPU idle, with VS Code still showing occasional
one-core spikes.

Historical payload profile before the direct-bucket slim endpoints:

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
After direct-bucket slim adoption, the 8-user run returned about 15 MiB across
1467 requests instead of 30 MiB across 756 requests, dropping average response
bytes from about 40 KiB/request to about 10 KiB/request.

## Latest Chats Ramp

Command:

```bash
node e2e/stress/backend/ramp.mjs \
  --scenario server-chats-read \
  --users 4,8 \
  --duration-ms 30000 \
  --ramp-up-ms 5000 \
  --think-time-ms 100 \
  --think-time-jitter-ms 100
```

Baseline before the chat backend pass:
`.e2e-artifacts/stress-ramp/backend/server-chats-read-2026-05-26T08-24-38-302Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 6.39 | 0.00% | 744ms | 767ms | `chat messages` p95 758ms |
| 8 | 10.84 | 0.00% | 912ms | 972ms | `chat messages` p95 966ms |

First backend candidate, reusing the loaded message list for read marking and
using owner-copy chat access before the broad chat lookup:
`.e2e-artifacts/stress-ramp/backend/server-chats-read-2026-05-26T08-33-48-440Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 6.32 | 0.00% | 749ms | 821ms | `chat messages` p95 821ms |
| 8 | 11.15 | 0.00% | 867ms | 939ms | `chat messages` p95 939ms |

Interpretation: this candidate was not the 5x lever. Mongo explain probes
showed the chat/message queries were already using indexes (`IXSCAN`) and
examining roughly the returned documents only. The bottleneck was Java-side
read work: repeated owner-copy repair on chat list/page reads and repeated
`users` lookups while serializing a message history.

After caching owner-copy repair per user and caching repeated user lookups while
building message-history DTOs:
`.e2e-artifacts/stress-ramp/backend/server-chats-read-2026-05-26T08-44-40-924Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step | `chat messages` p95 | `chat list` p95 | `chat page` p95 |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| 4 | 13.17 | 0.00% | 412ms | 435ms | `chat websocket connect` p95 435ms | 103ms | 72ms | 63ms |
| 8 | 26.31 | 0.00% | 409ms | 438ms | `chat websocket connect` p95 438ms | 106ms | 65ms | 65ms |

8-user delta versus baseline:

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Scenario throughput | 10.84 req/s | 26.31 req/s | 2.43x higher |
| Scenario p95 | 912ms | 409ms | 2.23x faster |
| Scenario p99 | 972ms | 438ms | 2.22x faster |
| `chat messages` p95 | 966ms | 106ms | 9.11x faster |
| `chat page` p95 | 527ms | 65ms | 8.11x faster |
| `chat list` p95 | 510ms | 65ms | 7.85x faster |

Focused contract checks after the change:

- `./gradlew :projects:profile:test` passed.
- `node e2e/functional/backend/run.mjs --case chats --fail-fast` passed.
- `node e2e/functional/backend/run.mjs --case websocket/chat-connect --fail-fast` passed.

Short capacity probe after the same chat backend pass:
`.e2e-artifacts/stress-ramp/backend/server-chats-read-2026-05-26T08-46-15-758Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step | `chat messages` p95 | Host load |
| ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| 16 | 52.50 | 0.00% | 404ms | 434ms | `chat websocket connect` p95 434ms | 118ms | 1.87 |
| 32 | 101.45 | 0.00% | 414ms | 439ms | `chat websocket connect` p95 439ms | 128ms | 4.56 |

The 32-user row stayed clean for this API pressure model. The remaining p95 is
mostly the websocket connection step, which includes a deliberate 300ms
hold-open in the test harness. The actual chat read endpoints are now below
130ms p95 at 32 virtual users.

## Latest Assets/Rates Ramp

Command:

```bash
node e2e/stress/backend/ramp.mjs \
  --scenario server-assets-rates-read \
  --users 4,8,16,32 \
  --duration-ms 30000 \
  --ramp-up-ms 5000 \
  --think-time-ms 100 \
  --think-time-jitter-ms 100
```

Artifacts:

- `.e2e-artifacts/stress-ramp/backend/server-assets-rates-read-2026-05-26T08-54-39-347Z`
- `.e2e-artifacts/stress-ramp/backend/server-assets-rates-read-2026-05-26T08-55-56-551Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 26.83 | 0.00% | 75ms | 115ms | `asset tickets` p95 98ms |
| 8 | 52.90 | 0.00% | 80ms | 117ms | `asset tickets` p95 106ms |
| 16 | 105.61 | 0.00% | 91ms | 110ms | `asset tickets` p95 107ms |
| 32 | 212.94 | 0.00% | 71ms | 94ms | `asset tickets` p95 86ms |

Interpretation: `server-assets-rates-read` is currently healthy on the seeded
playground workload. No backend change was applied because a 5x-class
optimization would not move a meaningful bottleneck here. The potential code
shapes to keep watching as data grows are asset explore bootstrapping/query
narrowing and rate-page slicing before full list materialization, but neither
showed stress pressure in this run.

## Latest Event Editor Ramp

Command:

```bash
node e2e/stress/backend/ramp.mjs \
  --scenario server-event-editor-read \
  --users 4,8,16,32 \
  --duration-ms 30000 \
  --ramp-up-ms 5000 \
  --think-time-ms 100 \
  --think-time-jitter-ms 100
```

Initial focused checks exposed a measurement problem before they exposed an app
bottleneck: the stress resolver could not always find a demo event with
subevents through the explore path, and then it re-resolved the event/subevent
inside every timed request. The fix was harness-only:

- `subEvent` setup now falls back to a bounded paged full-event read when the
  explore record does not contain a subevent.
- `server-event-editor-read` reuses one resolved context per virtual user.
- Cached event, subevent, asset, and chat requirements short-circuit repeated
  setup work.

Focused contract checks after the harness fix:

- `node e2e/functional/backend/run.mjs --case event-editor/subevent-resources --fail-fast`
  passed with HTTP 200.
- `node e2e/functional/backend/run.mjs --case event-editor/leaderboard --fail-fast` passed
  with HTTP 200.

Artifacts:

- `.e2e-artifacts/stress-ramp/backend/server-event-editor-read-2026-05-26T09-08-24-533Z`
- `.e2e-artifacts/stress-ramp/backend/server-event-editor-read-2026-05-26T09-09-42-201Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 29.18 | 0.00% | 65ms | 86ms | `subevent resources` p95 74ms |
| 8 | 57.25 | 0.00% | 64ms | 89ms | `subevent resources` p95 84ms |
| 16 | 110.76 | 0.00% | 84ms | 111ms | `subevent resources` p95 107ms |
| 32 | 209.90 | 0.00% | 79ms | 166ms | `subevent resources` p95 116ms |

Interpretation: the event-editor endpoints are healthy on the seeded workload.
The earlier high p95 was caused by the stress harness measuring setup work on
each iteration, not by a backend endpoint regression. The only remaining signal
is occasional `subevent resources` warmup outliers at p99/max, so this area is
not currently a 5x-class app bottleneck. No backend/frontend contract changed.

## Latest Admin/Content Ramp

Command:

```bash
node e2e/stress/backend/ramp.mjs \
  --scenario server-admin-content-read \
  --users 4,8,16,32 \
  --duration-ms 30000 \
  --ramp-up-ms 5000 \
  --think-time-ms 100 \
  --think-time-jitter-ms 100
```

Artifacts:

- `.e2e-artifacts/stress-ramp/backend/server-admin-content-read-2026-05-26T09-14-02-676Z`
- `.e2e-artifacts/stress-ramp/backend/server-admin-content-read-2026-05-26T09-15-18-492Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 30.38 | 0.00% | 38ms | 57ms | `landing content` p95 55ms |
| 8 | 59.84 | 0.00% | 37ms | 47ms | `landing content` p95 47ms |
| 16 | 117.90 | 0.00% | 49ms | 61ms | `landing content` p95 65ms |
| 32 | 233.24 | 0.00% | 49ms | 62ms | `landing content` p95 62ms |

Interpretation: admin/content reads are currently healthy on the seeded
playground workload. They scale nearly linearly through 32 virtual users with
no errors and sub-100ms endpoint p95, so no 5x-class backend change was applied.
The next more plausible broad-read candidate is `server-profile-read`,
especially realtime counters and profile state if they still perform repeated
request-time fanout.

## Latest Profile Ramp

Command:

```bash
node e2e/stress/backend/ramp.mjs \
  --scenario server-profile-read \
  --users 4,8,16,32 \
  --duration-ms 30000 \
  --ramp-up-ms 5000 \
  --think-time-ms 100 \
  --think-time-jitter-ms 100
```

Baseline before the profile backend cache:
`.e2e-artifacts/stress-ramp/backend/server-profile-read-2026-05-26T09-17-03-966Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 16.47 | 0.00% | 399ms | 493ms | `auth me` p95 440ms |
| 8 | 27.61 | 0.00% | 594ms | 682ms | `realtime counters` p95 663ms |

Both hot steps were doing the same request-time fanout: `auth me` and
`realtime counters` rebuilt activity counters from events, members, chats,
assets, tickets, and feedback state on every request, then merged feedback
impressions. The backend now uses a short per-user hot-read snapshot cache for
computed activity counters and merged impressions. The response contracts and
frontend requests are unchanged.

After the profile backend cache:

- `.e2e-artifacts/stress-ramp/backend/server-profile-read-2026-05-26T09-24-47-231Z`
- `.e2e-artifacts/stress-ramp/backend/server-profile-read-2026-05-26T09-25-58-489Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 29.76 | 0.00% | 43ms | 244ms | `realtime counters` p95 138ms |
| 8 | 62.02 | 0.00% | 41ms | 211ms | `realtime counters` p95 192ms |
| 16 | 120.13 | 0.00% | 47ms | 236ms | `auth me` p95 152ms |
| 32 | 235.96 | 0.00% | 58ms | 225ms | `realtime counters` p95 156ms |

8-user delta:

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Scenario throughput | 27.61 req/s | 62.02 req/s | 2.25x higher |
| Scenario p95 | 594ms | 41ms | 14.5x faster |
| Scenario p99 | 682ms | 211ms | 3.23x faster |
| `auth me` p95 | 657ms | 47ms | 14.0x faster |
| `realtime counters` p95 | 663ms | 192ms | 3.45x faster |

Interpretation: profile auth/realtime is no longer the broad-read bottleneck
for this workload. The remaining p99/max spikes are cache-miss recomputes.
The long-term modeling target is still to maintain these counters through
write-side updates or Mongo change streams, so the first poll after a cache miss
does not rebuild the graph synchronously.

## Latest Broad Read Sweep

Command:

```bash
node e2e/stress/backend/ramp.mjs \
  --scenario server-read-sweep \
  --users 4,8 \
  --duration-ms 30000 \
  --ramp-up-ms 5000 \
  --think-time-ms 100 \
  --think-time-jitter-ms 100
```

Artifact:
`.e2e-artifacts/stress-ramp/backend/server-read-sweep-2026-05-26T09-32-24-967Z`

| Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| ---: | ---: | ---: | ---: | ---: | --- |
| 4 | 27.44 | 0.00% | 88ms | 159ms | `profile/auth-me` p95 303ms |
| 8 | 54.58 | 0.00% | 88ms | 141ms | `profile/auth-me` p95 198ms |

8-user step detail:

| Step | p95 | p99 |
| --- | ---: | ---: |
| `profile/auth-me` | 198ms | 374ms |
| `events/event-filter-slim` | 116ms | 143ms |
| `assets/owned` | 105ms | 129ms |
| `chats/page` | 94ms | 111ms |
| `admin/dashboard` | 48ms | 56ms |

Interpretation: the optimized broad read path is clean after the event, chat,
and profile passes. The remaining `profile/auth-me` spikes are cache misses
from the short hot-read snapshot, while steady p50 is 17ms. The next area is
the heavier `server-capacity-probe`, because the sweep itself does not expose a
new 5x-class steady bottleneck.

## Latest Capacity Probe

Command:

```bash
node e2e/stress/backend/ramp.mjs \
  --scenario server-capacity-probe \
  --users 12 \
  --duration-ms 45000 \
  --ramp-up-ms 10000 \
  --think-time-ms 75 \
  --think-time-jitter-ms 75
```

Baseline artifact:
`.e2e-artifacts/stress-ramp/backend/server-capacity-probe-2026-05-26T09-34-29-472Z`

After game-card backend cache artifact:
`.e2e-artifacts/stress-ramp/backend/server-capacity-probe-2026-05-26T09-43-49-231Z`

| Run | Virtual users | Req/s | Error rate | p95 | p99 | Worst step |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Before game-card cache | 12 | 53.39 | 0.00% | 399ms | 459ms | `game/cards-query` p95 506ms |
| After game-card cache | 12 | 62.09 | 0.00% | 396ms | 415ms | `websocket/chat-connect` p95 434ms |

Step detail before/after:

| Step | Before p95 | After p95 | Change | After p99 |
| --- | ---: | ---: | ---: | ---: |
| `game/cards-query` | 506ms | 71ms | 7.1x faster | 271ms |
| `profile/auth-me` | 313ms | 94ms | 3.3x faster | 310ms |
| `events/event-explore` | 131ms | 173ms | 0.8x | 195ms |
| `websocket/chat-connect` | 416ms | 434ms | harness-bound | 460ms |
| `websocket/admin-notifications-connect` | 309ms | 311ms | harness-bound | 315ms |

Interpretation: the real API bottleneck from the baseline was fixed. Game-card
queries now reuse a short global game-stack snapshot for visible users, social
graph, latest activity timestamps, and affinity edges; the active user's rated
list is still read per request so a just-rated card is not kept alive by the
cache. The remaining scenario p95 is dominated by websocket connect steps that
include intentional harness hold time.

5x-class improvement candidates from this ramp:

- Done for `event list`: the slim list-card path now queries only page/card
  fields and no longer assembles the full event graph before slicing.
- Done for optional slim `event filter` and `attending`: the backend now avoids
  member snapshot fanout before paging by loading list-card fields and tracked
  membership status directly. The old full contracts remain available.
- Done for optional slim `hosting`, `trash`, and `invitations`: the GET
  endpoints now expose page/card responses when callers pass `limit`, `cursor`,
  or `slim=true`, while default callers still receive the previous arrays.
- Done for `event explore`: the page path now uses projected Mongo reads for
  canonical candidates, skips hot-read slot materialization, and constructs full
  DTOs only for the returned page. The response contract is unchanged.
- Denormalize narrow parent/read-model fields for hot list views: viewer
  membership state, accepted/pending counters, feedback state, primary resource
  summary, ticket state, visibility/status, and sortable timestamps. Maintain
  these from write-side updates or Mongo change streams with idempotent repair
  jobs.
- Push remaining broad explore/calendar pagination and sorting into Mongo or a
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
- Done for current chat reads without frontend contract changes: chat
  list/page reads no longer run repeated owner-copy repair on every request, and
  message-history serialization no longer performs repeated user lookups for the
  same sender/read receipt participants.
- Done for current profile auth/realtime reads without frontend contract
  changes: hot polling now reuses a short per-user computed activity/impression
  snapshot instead of rebuilding counters from normalized child collections on
  every request.
- Done for current game-card reads without frontend contract changes: the
  server reuses hot global game-stack inputs instead of redoing broad users,
  rates, activity-member, and affinity-edge reads on every card query.
- Done for `playground-flow-smoke` correctness under concurrent writes: help
  revision creation now retries version allocation if another writer wins the
  same `{documentType, lang, contextKey, version}` slot.
- Future chat 5x-class frontend candidate only if real production histories get
  much larger: add an optional `limit`/`cursor` chat-history contract so the UI
  can request recent messages first instead of always returning the full history.

## Latest Playground Mutation Flow

Command:

```bash
node e2e/stress/backend/run.mjs --scenario playground-flow-smoke --record
```

Initial artifact:
`.e2e-artifacts/stress/backend/playground-flow-smoke-2026-05-26T09-46-45-457Z`

After help revision retry artifact:
`.e2e-artifacts/stress/backend/playground-flow-smoke-2026-05-26T09-50-40-833Z`

| Run | Users | Requests | Error rate | p95 | p99 | Slowest step |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Before help revision retry | 2 | 14 | 7.14% | 891ms | 891ms | `event lifecycle` p95 891ms |
| After help revision retry | 2 | 14 | 0.00% | 1081ms | 1081ms | `event lifecycle` p95 1081ms |

The initial run exposed a concurrent write bug, not a latency-only issue: both
virtual users created an explanation revision for `home.game/en`, both selected
`version=2`, and the unique Mongo index rejected one insert. The backend now
retries version allocation after a duplicate-key race, so concurrent admin
revision writes complete without changing request or response contracts.

After the fix, all mutation flows pass. The largest remaining write-path latency
in this smoke is event lifecycle around 1.1s p95 with only 2 virtual users;
that is worth watching in a heavier write scenario, but it is not currently a
5x-class drain compared with the read bottlenecks fixed above.

## Latest WebSocket Room Fanout

Commands:

```bash
node e2e/stress/backend/websocket-room.mjs --clients 200 --messages 10 --send-rate 2 --record
node e2e/stress/backend/websocket-room.mjs --clients 500 --messages 20 --send-rate 2 --record
```

Artifacts:

- `.e2e-artifacts/stress/backend/websocket-room-2026-05-26T09-52-05-665Z`
- `.e2e-artifacts/stress/backend/websocket-room-2026-05-26T09-52-42-114Z`

| Clients | Messages | Opened | Delivery | Receive p95 | Fanout p95 | Duplicates | Redis write stream after | Result |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 200 | 10 | 200/200 | 2000/2000 | 106ms | 111ms | 0 | 0 | passed |
| 500 | 20 | 500/500 | 10000/10000 | 55ms | 55ms | 0 | 0 | passed |

Interpretation: room fanout is healthy in the current playground stack. The
500-client run had 100% delivery, no duplicate frames, no missing messages, and
no Redis write-stream backlog. This area did not expose a 5x-class backend
bottleneck.

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
6. Rerun the same scenario and compare with `e2e/stress/backend/compare.mjs`.
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

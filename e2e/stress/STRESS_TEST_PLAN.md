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

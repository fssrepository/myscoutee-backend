# Full Integration E2E Collections

This folder contains functional end-to-end collections and stress/performance
benchmarks for the running MyScoutee stack.

```text
e2e/functional/backend  API contract and mutation-flow checks
e2e/functional/ui       Browser UI checks
e2e/stress/backend      API/workflow/WebSocket load scenarios
e2e/stress/ui           Browser performance/stability scenarios
e2e/shared              Shared runner/assertion helpers
```

Each executable check lives in its own folder:

```text
request.json       request, variables, tags, timing, mode
response.json      expected status/body contract
assert.mjs         optional script for deeper assertions and follow-up calls
```

The runner can execute one case, one group, all safe server contracts, UI route
checks, or playground mutation/stress flows.

Server endpoint coverage and the latest local validation summary are tracked in:

```text
e2e/functional/backend/SERVER_ENDPOINT_COVERAGE.md
```

## Server Contract Mode

Contract mode is safe by default. It targets the already-running dev compose
stack on port 80 and does not run mutation cases.

```bash
cd server
docker compose up --build

cd ..
node e2e/functional/backend/run.mjs --list
node e2e/functional/backend/run.mjs
node e2e/functional/backend/run.mjs --group events
node e2e/functional/backend/run.mjs --case profile/auth-me --record
```

Default target:

```bash
E2E_SERVER_BASE_URL=http://localhost
```

## Playground Flow Mode

Playground mode is for destructive or weird end-to-end flows. It uses
`playground_db`, not `demo_db`.

```bash
cd server
MONGO_PLAYGROUND_DATABASE=playground_db \
docker compose -f docker-compose.yml -f docker-compose.playground.yml up --build

cd ..
E2E_SERVER_MODE=playground \
node e2e/functional/backend/run.mjs --group flows --include-mutations
```

The playground Mongo seed folder is:

```text
server/docker/conf/mongodb/playground_db
```

It symlinks to the default demo seed so playground starts from familiar static
data while writes land in the disposable playground database/volume.

## Gradle Playground/Stress Backend

When Mongo/Redis/MinIO are already available, the backend can also be started
directly in playground mode:

```bash
cd server
MONGO_PLAYGROUND_DATABASE=playground_db ./gradlew :projects:profile:bootRunPlayground
```

Stress backend mode:

```bash
cd server
MONGO_PLAYGROUND_DATABASE=playground_db ./gradlew :projects:profile:bootRunStress
```

Then run the stress collection driver:

```bash
E2E_SERVER_MODE=stress \
E2E_STRESS_LOOPS=10 \
E2E_STRESS_CONCURRENCY=2 \
node e2e/stress/backend/flows.mjs
```

## JMeter-Style Stress Scenarios

Top-level stress scenarios live under:

```text
e2e/stress/backend/scenarios
```

They define virtual users, ramp-up, duration or iterations, think time,
thresholds, and steps. A step can call an existing server collection case, so
the stress suite reuses the same `request.json` / `response.json` / script
checks as the API suite.

List scenarios:

```bash
node e2e/stress/backend/run.mjs --list
```

Run a short safe read smoke:

```bash
node e2e/stress/backend/run.mjs --scenario server-contract-smoke
```

Run a longer read sweep:

```bash
node e2e/stress/backend/run.mjs --scenario server-read-sweep
```

Focused benchmarks are available for profile, events, event editor, chats,
assets/rates, and admin/content areas. The detailed plan and metric definitions
live in:

```text
e2e/stress/backend/STRESS_TEST_PLAN.md
```

Record a baseline run:

```bash
node e2e/stress/backend/run.mjs --scenario server-events-read --record
```

Compare a later candidate run to the baseline:

```bash
node e2e/stress/backend/compare.mjs \
  .e2e-artifacts/stress/backend/server-events-read-baseline \
  .e2e-artifacts/stress/backend/server-events-read-candidate
```

Run a stateful WebSocket room simulation against the disposable playground
database. This opens many chat sockets into one seeded room, sends messages
round-robin from the sockets, verifies room fanout, and records host/container
metrics:

```bash
node e2e/stress/backend/websocket-room.mjs --clients 500 --messages 20 --send-rate 2 --record
```

The WebSocket room simulation expects the backend to be running against
`playground_db`; it aborts if the prepared room is not visible through the
backend. Recorded artifacts include delivery latency, duplicate/replay latency,
Redis event/write stream length samples, and host/container resource samples.

Run destructive playground flows under load:

```bash
E2E_STRESS_MODE=stress \
node e2e/stress/backend/run.mjs --scenario playground-flow-smoke
```

The playground scenario expects the stack to be started with
`docker-compose.playground.yml` or the backend to be running with
`bootRunStress`.

## UI Checks

UI checks are browser checks against the full stack through nginx on port 80.
They do not target the Angular dev server. The suite logs in/selects a demo
user once, closes the normal explanation/privacy/location overlays, and reuses
that session for internal screens such as game, profile editor, event explore,
event editor create, and admin help editor image carousel checks.

```bash
E2E_UI_BASE_URL=http://localhost node e2e/functional/ui/run.mjs
```

Record screenshots and per-step evidence:

```bash
E2E_UI_BASE_URL=http://localhost node e2e/functional/ui/run.mjs --record
```

Recorded output is written under `.e2e-artifacts/functional/ui/` and is gitignored.

## UI Stress Checks

UI stress checks use Chrome DevTools Protocol to apply mobile viewport, touch,
CPU throttling, network throttling, cold-cache loading, long-task collection,
resource/chunk transfer measurement, and screenshots.

List available UI stress scenarios:

```bash
node e2e/stress/ui/run.mjs --list
```

The first scenario measures demo bootstrap on a slow mobile profile:

```bash
E2E_UI_STRESS_BASE_URL=http://localhost \
node e2e/stress/ui/run.mjs --scenario demo-bootstrap --record
```

Useful overrides:

```bash
node e2e/stress/ui/run.mjs \
  --scenario demo-bootstrap \
  --cpu-throttle 4 \
  --network slow-4g \
  --viewport 390x844 \
  --record
```

Recorded output is written under `.e2e-artifacts/stress/ui/`.

Current UI stress matrix:

| Scenario | Purpose |
| --- | --- |
| `demo-bootstrap` | Cold entry, demo selector, demo login, and first game route. |
| `app-game-route` | Logged-in game route load and first interactive surface. |
| `app-profile-editor-open` | Navigator to profile editor popup open. |
| `app-event-editor-open` | Activities menu to event editor shell open. |
| `app-event-explore-open` | Navigator to event explore popup and list load. |
| `app-event-explore-detail` | Event explore filter/detail open path. |
| `app-activities-rates-smart-list` | Ratings smart-list filtering/views/pagination path. |
| `app-admin-route` | Admin workspace load with admin session storage. |
| `app-admin-help-editor-images` | Admin help editor seeded image load path. |
| `app-help-session-route` | Shared help-session browser route. |
| `app-privacy-location` | Entry privacy/location cancel-then-approve path. |
| `app-chat-message-lifecycle` | Chat popup message lifecycle path. |
| `app-asset-resource-lifecycle` | Owned asset and resource assignment lifecycle path. |

## Mongo Hard-Code Audit

Playground isolation depends on code using the routed Mongo database factory.
This audit lists Java code that directly names Mongo databases/collections:

```bash
node e2e/functional/backend/audit-mongo-hardcoding.mjs
```

Report:

```text
e2e/functional/backend/MONGO_HARDCODE_AUDIT.md
```

Review literal collection-string calls first. Entity `@Document(collection=...)`
mappings are expected but are listed so playground seed/reset coverage can be
checked.

## Capacity Probe

`server-capacity-probe` is intentionally not part of the default run. It is the
harder load probe and should only be run when you explicitly want to put real
pressure on the local machine:

```bash
node e2e/stress/backend/run.mjs --scenario server-capacity-probe
```

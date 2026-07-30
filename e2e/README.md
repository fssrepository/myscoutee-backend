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

## Java-to-Go QMAU/revenue/settlement qualification

The registry repository owns the opt-in, no-stack cross-language runner:

```bash
cd ../myscoutee-registry
./scripts/qualify-java-rails.sh
```

If the repositories are not siblings, set `MYSCOUTEE_BACKEND_ROOT` to this
repository root. The runner builds the standalone Go registry and executes only
`OperatorGoRegistryRailQualificationTest` against disposable SQLite, registry
keys, Java deployment keys/state, and embedded Mongo.

The gate covers accepted signed QMAU/revenue delivery, lost-receipt
idempotency, Java outbox and Go database survival across service/process
restarts, duplicate responses, correction/supersession, invalid Java
signatures, tampered Go receipt rejection, and a real Java-signed private
settlement-history query after claim approval and ordinary Go settlement
calculation. It does not start the backend application, Docker, Redis, npm, or
the frontend.

The Go registry also has its own Java-independent black-box suite. It builds
and starts only the real registry binary with a temporary SQLite database,
signing key, and loopback listener:

```bash
cd ../myscoutee-registry
go test -tags=e2e -count=1 -v ./e2e
```

Each executable check lives in its own folder:

```text
request.json       request, variables, tags, timing, mode
response.json      expected status/body contract
assert.mjs         optional script for deeper assertions and follow-up calls
```

The runner can execute one case, one group, all safe server contracts, UI route
checks, or e2e mutation/stress flows.

Server endpoint coverage and the latest local validation summary are tracked in:

```text
e2e/functional/backend/SERVER_ENDPOINT_COVERAGE.md
```

## Server Contract Mode

Contract mode is safe by default and does not run mutation cases. All backend,
UI, mutation, and stress collections use the same standalone E2E stack; they
never require the dev compose stack, Gradle `bootRun`, frontend sync, or a file
watcher.

```bash
cd server
docker compose -f docker-compose.e2e.yml up --build --wait
docker compose -f docker-compose.e2e.yml \
  cp nginx:/etc/nginx/keys/nginx.crt /tmp/myscoutee-e2e-nginx-ca.pem

cd ..
export E2E_SERVER_BASE_URL=https://127.0.0.1
export NODE_EXTRA_CA_CERTS=/tmp/myscoutee-e2e-nginx-ca.pem
node e2e/functional/backend/run.mjs --list
node e2e/functional/backend/run.mjs
node e2e/functional/backend/run.mjs --group events
node e2e/functional/backend/run.mjs --case profile/auth-me --record
```

`NODE_EXTRA_CA_CERTS` trusts only the disposable stack's short-lived localhost
certificate. Copy it again after recreating Nginx. Nginx otherwise uses the
production HTTP redirect and HSTS response policies.

Operator contracts use the seeded `operator-demo-dev` identity and exercise
the distinct `O` authority across the operator controllers, bootstrap and
request-validation boundaries, registry/configuration state, settlement
queries, managed TLS fail-closed and secret boundaries, local revenue
invariants, community providers, update visibility, and demo-isolated
Firebase capability tests:

```bash
node e2e/functional/backend/run.mjs --group operator
```

Override the seeded identity only when a matching operator exists in the
target database:

```bash
E2E_OPERATOR_USER_ID=operator-demo-dev \
node e2e/functional/backend/run.mjs --group operator
```

Default target:

```bash
E2E_SERVER_BASE_URL=https://127.0.0.1
```

## E2E Flow Mode

E2E mode is for destructive or weird end-to-end flows. It uses
`e2e_db`, not `demo_db`.

```bash
cd server
docker compose -f docker-compose.e2e.yml up --build --wait
docker compose -f docker-compose.e2e.yml \
  cp nginx:/etc/nginx/keys/nginx.crt /tmp/myscoutee-e2e-nginx-ca.pem

cd ..
export E2E_SERVER_BASE_URL=https://127.0.0.1
export NODE_EXTRA_CA_CERTS=/tmp/myscoutee-e2e-nginx-ca.pem
E2E_SERVER_MODE=e2e \
node e2e/functional/backend/run.mjs --group flows --include-mutations
```

The operator mutation flows use the same existing `mutation` and `e2eOnly`
collection metadata as the other backend flows:

`mutation: true` excludes a case unless `--include-mutations` is supplied.
`e2eOnly: true` skips execution outside `e2e`/`stress` server mode. These are
metadata fields, not newly introduced CLI flags.

```bash
E2E_SERVER_MODE=e2e \
node e2e/functional/backend/run.mjs \
  --case flows/operator \
  --include-mutations
```

They verify pre-registration fail-closed behavior, dormant report
synchronization, registry inspection/confirmation/disconnect, and the
configuration save/validation/secret-masking lifecycle. Configuration changes
are restored in `finally`, and the e2e reset clears the operator Mongo state
before reimporting the disposable seed.

Registry selection also covers URL-shape rejection, root-URL normalization,
replacement of stale inspection tokens, missing/invalid/single-use
confirmation tokens, and repeated disconnect.

The flow deliberately does not register, claim, deactivate, or install a
package. Those operations mutate the separately persisted Go registry or host
update state. The isolated Java-to-Go registration/reporting qualification
remains available through `../myscoutee-registry/scripts/qualify-java-rails.sh`.

The e2e Mongo seed folder is:

```text
server/docker/conf/mongodb/e2e_db
```

It is a dedicated, tracked E2E seed snapshot. The Mongo E2E image bakes it in,
while all runtime writes land in the disposable `e2e_db` volume.

`docker-compose.e2e.yml` is a complete, standalone, production-style stack.
Do not layer it over `docker-compose-dev.yml`. The API runs the built boot JAR
with the `prod` Spring profile, the optimized E2E Angular bundle is baked into
Nginx, the production redirect/HSTS policy is enabled on ports 80/443, and the
Mongo seed is baked into its E2E image. There are no source mounts, Gradle or
Node runtime processes, file watchers, hot reload, or seed synchronization
services.

Remove all disposable E2E databases, registry SQLite state, object storage,
and generated keys after a run:

```bash
cd server
docker compose -f docker-compose.e2e.yml down --volumes --remove-orphans
```

## Mutation Flow Stress Driver

With the standalone stack above running, execute the mutation flow driver:

```bash
NODE_EXTRA_CA_CERTS=/tmp/myscoutee-e2e-nginx-ca.pem \
E2E_SERVER_BASE_URL=https://127.0.0.1 \
E2E_SERVER_MODE=stress \
E2E_STRESS_LOOPS=10 \
E2E_STRESS_CONCURRENCY=2 \
node e2e/stress/backend/flows.mjs
```

The driver resets the disposable database once. Deployment-global
`flows/operator/*` cases then run sequentially exactly once because they mutate
singleton configuration and registry state. Loop and concurrency settings
apply only to the remaining repeatable mutation flows.

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

Run a stateful WebSocket room simulation against the disposable e2e
database. This opens many chat sockets into one seeded room, sends messages
round-robin from the sockets, verifies room fanout, and records host/container
metrics:

```bash
NODE_EXTRA_CA_CERTS=/tmp/myscoutee-e2e-nginx-ca.pem \
E2E_WS_ROOM_BASE_URL=https://127.0.0.1 \
node e2e/stress/backend/websocket-room.mjs \
  --clients 500 --messages 20 --send-rate 2 --record
```

The WebSocket room simulation expects the backend to be running against
`e2e_db`; it aborts if the prepared room is not visible through the
backend. Recorded artifacts include delivery latency, duplicate/replay latency,
Redis event/write stream length samples, and host/container resource samples.

Run destructive e2e flows under load:

```bash
E2E_STRESS_MODE=stress \
node e2e/stress/backend/run.mjs --scenario e2e-flow-smoke
```

The e2e scenario expects the standalone `docker-compose.e2e.yml` stack.

## UI Checks

UI checks are browser checks against the full stack through Nginx HTTPS on
port 443; port 80 only serves the production redirect and health exception.
They do not target the Angular dev server. The suite logs in/selects a demo
user once, closes the normal explanation/privacy/location overlays, and reuses
that session for internal screens such as game, profile editor, event explore,
event editor create, and admin help editor image carousel checks.

```bash
# Start the e2e/full-stack compose environment before running UI checks.
E2E_UI_BASE_URL=https://127.0.0.1 node e2e/functional/ui/run.mjs
```

Record screenshots and per-step evidence:

```bash
# Start the e2e/full-stack compose environment before recording UI checks.
E2E_UI_BASE_URL=https://127.0.0.1 node e2e/functional/ui/run.mjs --record
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
E2E_UI_STRESS_BASE_URL=https://127.0.0.1 \
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

E2E isolation depends on code using the routed Mongo database factory.
This audit lists Java code that directly names Mongo databases/collections:

```bash
node e2e/functional/backend/audit-mongo-hardcoding.mjs
```

Report:

```text
e2e/functional/backend/MONGO_HARDCODE_AUDIT.md
```

Review literal collection-string calls first. Entity `@Document(collection=...)`
mappings are expected but are listed so e2e seed/reset coverage can be
checked.

## Capacity Probe

`server-capacity-probe` is intentionally not part of the default run. It is the
harder load probe and should only be run when you explicitly want to put real
pressure on the local machine:

```bash
node e2e/stress/backend/run.mjs --scenario server-capacity-probe
```

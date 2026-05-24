# Full Integration E2E Collections

This folder is a Postman-like test suite for the running MyScoutee stack.

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
e2e/server/SERVER_ENDPOINT_COVERAGE.md
```

## Server Contract Mode

Contract mode is safe by default. It targets the already-running dev compose
stack on port 80 and does not run mutation cases.

```bash
cd server
docker compose up --build

cd ..
node e2e/server/run.mjs --list
node e2e/server/run.mjs
node e2e/server/run.mjs --group events
node e2e/server/run.mjs --case profile/auth-me --record
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
node e2e/server/run.mjs --group flows --include-mutations
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
node e2e/server/stress.mjs
```

## JMeter-Style Stress Scenarios

Top-level stress scenarios live under:

```text
e2e/stress/scenarios
```

They define virtual users, ramp-up, duration or iterations, think time,
thresholds, and steps. A step can call an existing server collection case, so
the stress suite reuses the same `request.json` / `response.json` / script
checks as the API suite.

List scenarios:

```bash
node e2e/stress/run.mjs --list
```

Run a short safe read smoke:

```bash
node e2e/stress/run.mjs --scenario server-contract-smoke
```

Run a longer read sweep:

```bash
node e2e/stress/run.mjs --scenario server-read-sweep
```

Run destructive playground flows under load:

```bash
E2E_STRESS_MODE=stress \
node e2e/stress/run.mjs --scenario playground-flow-smoke
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
E2E_UI_BASE_URL=http://localhost node e2e/ui/run.mjs
```

Record screenshots and per-step evidence:

```bash
E2E_UI_BASE_URL=http://localhost node e2e/ui/run.mjs --record
```

Recorded output is written to `.e2e-artifacts/ui/index.md` and is gitignored.

## Mongo Hard-Code Audit

Playground isolation depends on code using the routed Mongo database factory.
This audit lists Java code that directly names Mongo databases/collections:

```bash
node e2e/server/audit-mongo-hardcoding.mjs
```

Report:

```text
e2e/server/MONGO_HARDCODE_AUDIT.md
```

Review literal collection-string calls first. Entity `@Document(collection=...)`
mappings are expected but are listed so playground seed/reset coverage can be
checked.

## Capacity Probe

`server-capacity-probe` is intentionally not part of the default run. It is the
harder load probe and should only be run when you explicitly want to put real
pressure on the local machine:

```bash
node e2e/stress/run.mjs --scenario server-capacity-probe
```

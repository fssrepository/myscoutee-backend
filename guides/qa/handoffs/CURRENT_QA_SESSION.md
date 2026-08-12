# Current manual QA session

Updated: 2026-08-12

This is the context-saving entry point for continuing the manual QA campaign.
It stores one minimal live resume pointer plus reusable execution lessons. It
is not the transactional evidence ledger or a backup of the QA pack. Read this
file first, then open only the linked active checkpoint section.

## Authoritative files

- Test definitions, checkpoint order and expected domain effects:
  [`DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md`](../manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md)
- Overall status ledger and counts:
  [`ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx`](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx)
- Reviewable ledger source; regenerate the XLSX after every status update:
  [`ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv`](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv)
- Replayable Mongo fixture/checkpoint implementation:
  [`event-domain-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/event-domain-checkpoints.js)
- Harness entry point for the already-running MongoDB container:
  [`manual-qa-checkpoints-docker.sh`](../../../server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh)
- Browser actor/layout configuration:
  [`browser-session-checkpoints.json`](../tools/browser-session-checkpoints.json)
- Isolated Chrome launcher:
  [`open-checkpoint-browser-sessions.sh`](../tools/open-checkpoint-browser-sessions.sh)

The detailed QA pack owns checkpoint evidence. The CSV/XLSX matrix owns status,
dates, next oracle and aggregate counts. This handoff owns only the active
resume pointer and reusable working method.

## Active resume point

```yaml
checkpoint: EVENT-TICKET-005
detail: ../manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md#event-ticket-005--join-request-approval-owns-ticket-creation
scenario: event-domain
ledger_status: FAIL; clean retest required after re-Join basket-identity fix
state: first re-Join reused the cancelled basket ID; branch stopped before second Cancel
required_resume: diagnose and fix the owning re-Join basket persistence boundary; then reset/stage and replay EVENT-TICKET-005 from its clean baseline
event: QA EVENT-TICKET-005
actors:
  left: Casey Bridge
  middle: Nova Social
  right: Riley Outside
next_actor: codex
stop_phrase: megvan
```

### Efficient resume gate

Do not repeat baseline methodology when the resume pointer and persisted oracle
already identify an intact transaction boundary. Continue with its
`required_resume`. If continuity is uncertain, run one read-only `status` first
and choose exactly one route from this table:

| `status` result | Action |
| --- | --- |
| Matching expected live boundary | Continue; do not stage, reset or relaunch browsers. |
| `phase=not-staged` | Stage once with every checkpoint-required environment value, then verify with `status`. |
| Matching active checkpoint but `events=[]` | Use guarded `discard-stale`, then normal `stage`, then `status`. |
| Partial or unexpected domain state | Stop and report the exact mismatch; do not repair it through UI or ad-hoc Mongo writes. |

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status event-domain EVENT-TICKET-005
```

Known ticket-fixture lesson: do **not** use `restage`; the current harness
restricts it to feedback checkpoints. Ticket `stage` also requires the retained
managed QA image URL. The already-proven stale recovery is:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  discard-stale event-domain EVENT-TICKET-005

env MANUAL_QA_EVENT_IMAGE_URL='/media/public?key=images%2F650000000000000000000061%2Fmanual-qa-checkpoint-v1-event-domain-event%2F1785904818563-084b9c3d-2bec-4d84-86f6-fb7140562c60%2Flarge.webp' \
  bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  stage event-domain EVENT-TICKET-005

bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status event-domain EVENT-TICKET-005
```

If `status` reports `phase=not-staged`, omit `discard-stale`. An empty
`MANUAL_QA_EVENT_IMAGE_URL` fails after snapshot creation; run the
harness-requested `reset` before retrying with the URL. `discard-stale` itself
refuses to run when the event still exists or original fixture documents would
make the discard unsafe.

On a new baseline, do not launch browsers until the second `status` proves the
linked checkpoint's complete expected baseline. If any predicate differs, stop
and report it instead of asking the user to compensate in the UI.

After that proof, open or replace exactly these three managed windows with:

```bash
guides/qa/tools/open-checkpoint-browser-sessions.sh EVENT-TICKET-005
```

The launcher owns three separate ephemeral Chrome profiles, injects the exact
demo user sessions, grants the configured Austin geolocation, loads `/game`,
dismisses entry consent/guides and lays the windows out left-to-right. Do not
open extra browsers, use personal Chrome profile names, or ask the user which
profile to select. Re-running it replaces only this checkpoint's managed
windows. Riley is a control and must remain untouched until the checkpoint says
otherwise.

### Next manual action

No further manual action is allowed on this partially mutated attempt. Retain
the three managed browser windows as evidence, but do not reload, Cancel,
approve or continue. The detailed failure and clean-replay requirement are in
the linked test definition and matrix.

## QA working method

### 1. One checkpoint, one transition

Each transactional boundary has one controlled producer action and explicitly
records: before state, manual action, immediate state, worker expectation,
delayed projection, unchanged controls and independent persisted oracle. A
checkpoint row may contain a short causally continuous sequence of these
boundaries under the granularity rules below. UI evidence alone is not a PASS.

The user performs the named manual UI action. Codex owns fixture staging,
isolated browser setup, server/database oracle checks, log inspection and
status documentation. Codex gives one short instruction at a time, waits for
the user's stated stop phrase, checks the oracle, reports PASS/FAIL, and then
states the next exact manual action.

### 1.1 Checkpoint granularity and new rows

- One matrix row must remain a bounded, human-verifiable contract, not a
  half-day collection of loosely related checks.
- One producer action or a short causally continuous sequence may stay in one
  row when it shares a baseline and finishes at one decisive oracle.
- One test case/matrix row may contain two or more named, short tests or
  branches when they verify different observations of the same contract and
  share the same controlled baseline. Keep their stop points and oracle results
  distinct inside the QA-pack definition.
- A longer lifecycle becomes ordered checkpoint rows. They may carry the same
  staged state forward, but every row has its own stop point, persisted oracle
  and PASS/FAIL decision.
- When the user requests a newly discovered behavior as a separate case, give
  it a new stable checkpoint ID, a QA-pack definition and a new matrix CSV row;
  add fixture/harness/browser configuration only when that case needs it.
- Do not create a new row merely because one test case has multiple branches
  or an incidental observation occurred. A new row requires a genuinely new
  test case and the user's requested split; otherwise name the tests inside the
  existing QA-pack checkpoint.
- On a requested split, preserve execution continuity explicitly with the
  ordered chain and `advance`/`switch` semantics where supported; never force
  the user to recreate already-proven setup.

### 2. Replayable fixtures, never ad-hoc database patches

Every manual case must be independently replayable. New or changed checkpoint
setup belongs in `event-domain-checkpoints.js` (or the corresponding named
scenario file), not in a one-off Mongo edit. Its behavior and transaction
evidence belong in the QA pack; its result/status belongs in the CSV/XLSX
matrix. The resume block contains only the next live boundary.

Use the canonical harness against the already-running `mongodb` container:

```bash
# create a clean independent baseline
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  stage event-domain EVENT-TICKET-005

# inspect the current persisted oracle without mutation
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status event-domain EVENT-TICKET-005

# advance only when the checkpoint definition explicitly owns that transition
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  next event-domain EVENT-TICKET-005

# remove the checkpoint-owned fixture state
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  reset event-domain EVENT-TICKET-005
```

Use `restage` only for a checkpoint class supported by the harness; it is
currently restricted to feedback checkpoints. For a stale ticket checkpoint,
follow the guarded `discard-stale` plus image-URL-qualified `stage` recipe in
the resume gate above. Use `switch`/`advance` only when the QA pack says state
is carried into the next checkpoint. Never infer fixture state from
screenshots. First call must have Docker-socket access; a sandbox permission
error is not evidence that MongoDB is stopped and must never cause a second
stack to start.

### 3. Browser actors are checkpoint data

Before a checkpoint is run, its exact active actors, idle controls and layout
must exist in `browser-session-checkpoints.json`. Launch them through the
checkpoint browser script. Actor identity is verified by the script after
session injection; do not identify users from Google profiles, window order
alone or remembered sessions.

If a new checkpoint needs a different actor set, add a new configuration entry
instead of reusing a larger three-window setup by habit. Keep personal profile
paths and names out of Git.

### 4. Domain invariants behind ticket tests

- Membership, checkout basket, ticket, users-table counters and notification
  are separate persisted objects/projections; verify each independently.
- A pending membership or admin preapproval is not a ticket.
- A physical ticket is created only at the terminal accepted transition for an
  eligible non-admin participant.
- Admins do not receive participant tickets.
- Publish synchronizes tickets for participants already accepted; later
  approval/acceptance creates only the newly eligible user's ticket.
- Ticket reads and popup opens never create or replace a ticket.
- Counters come from physical active ticket state and must agree in both
  `tickets` and `asset.tickets` fields.
- The Riley window is an unchanged control unless a checkpoint explicitly
  makes Riley an actor.
- An action emits only its own ID-scoped delta. Normal polling reconciles
  absolute state; it must not manufacture domain writes.

### 5. Logs and running stack

The development stack and hot-deploy/watchers are already owned by existing
processes. Do not start a second server, Angular watcher, Gradle/npm build,
MongoDB or Compose stack. After a source change, let the owning watcher build
and inspect its existing logs:

```bash
docker logs --since 5m myscoutee
docker logs --since 5m frontend-sync
docker logs --since 5m nginx
```

- `myscoutee`: backend compilation/startup and request-path failures.
- `frontend-sync`: frontend hot-deploy/build result.
- `nginx`: HTTP request timing/routing when a UI action is in doubt.
- Mongo truth comes from the checkpoint `status` oracle, not from log guesses.

If a watcher is stuck, identify its owning process and restart only that one
owner. Never work around a cache lock with another cache or parallel build.

### 6. Recording and communication

After every transactional boundary, including a partial PASS inside a larger
checkpoint:

1. Run the independent `status`/named oracle.
2. Report the result in one compact message: `PASS` or `FAIL`, the decisive
   persisted facts, and what remained unchanged.
3. Append the transaction evidence to the active QA-pack test definition.
4. Update the canonical matrix CSV with the current date, evidence and next
   oracle. Keep the row `IN PROGRESS` until the checkpoint's full chain passes.
5. Run `python3 guides/qa/tools/sync-qa-matrix-xlsx.py`; the generated XLSX owns
   status coloring and aggregate counts.
6. Update only the YAML resume pointer and next manual action in this file. Do
   not copy the detailed evidence or ledger row here.
7. Give the next exact manual action. State `Következő teszt: <ID> — ...` only
   when the current checkpoint is fully closed and the ledger has been updated.

This order is the session-efficiency rule: persisted oracle first, canonical
records second, compact resume pointer last. It prevents re-deriving completed
methodology or mistaking a substep PASS for a closed checkpoint.

On FAIL, stop that branch after collecting the smallest decisive evidence.
Diagnose/fix separately, then restage the same checkpoint from its fixture and
replay it. Never accept a partially mutated baseline as the next test's setup.

## Ordered continuation

Finish `EVENT-TICKET-005` first. The next checkpoint is
`EVENT-TICKET-006` (the same active physical ticket moves from Upcoming to Past
when the event expires). The following planned chain is defined, not duplicated,
in the QA pack:

```text
EVENT-TICKET-005 -> EVENT-TICKET-006 -> EVENT-TICKET-007
-> EVENT-VISIBILITY-001
```

`EVENT-TICKET-008` (two-event ticket isolation) and `EVENT-TICKET-009`
(offline cached QR with online scanner) remain independent ticket branches.
Do not pull them into `EVENT-TICKET-005`.

# Current manual QA session

Updated: 2026-08-12

This is the context-saving entry point for continuing the manual QA campaign.
Read this file first. Do not reconstruct the campaign from chat history and do
not load the complete QA pack. Open only the linked active checkpoint section.

## Authoritative files

- Test definitions, checkpoint order and expected domain effects:
  [`DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md`](../manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md)
- Overall status ledger and counts:
  [`ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx`](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx)
- Replayable Mongo fixture/checkpoint implementation:
  [`event-domain-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/event-domain-checkpoints.js)
- Harness entry point for the already-running MongoDB container:
  [`manual-qa-checkpoints-docker.sh`](../../../server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh)
- Browser actor/layout configuration:
  [`browser-session-checkpoints.json`](../tools/browser-session-checkpoints.json)
- Isolated Chrome launcher:
  [`open-checkpoint-browser-sessions.sh`](../tools/open-checkpoint-browser-sessions.sh)

The detailed QA pack and fixture implementation are authoritative. This handoff
contains only the active resume point and the working method.

## Active resume point

```yaml
checkpoint: EVENT-TICKET-005
detail: ../manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md#event-ticket-005--join-request-approval-owns-ticket-creation
scenario: event-domain
state: clean staged baseline, before Nova's first Join
event: QA EVENT-TICKET-005
event_rules: Public, Published, Ticketing On, admin approval required
occupancy: Casey is the only accepted member, 1/8
nova: not a member; no basket; no ticket; both stored ticket counters are 0
riley: isolated unchanged control; no ticket
actors:
  left: Casey Bridge
  middle: Nova Social
  right: Riley Outside
next_actor: user
stop_phrase: megvan
```

Open or replace exactly these three managed windows with:

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

Tell the user exactly this, without adding another test branch:

1. Casey: open Notifications and leave it open.
2. Nova: open Event Explore.
3. Find `QA EVENT-TICKET-005`.
4. Choose Join/Book and submit the join request.
5. Stop as soon as the UI says approval is pending. Do not reload or cancel.
6. Reply `megvan`.

After `megvan`, Codex runs the checkpoint `status` oracle before asking for any
other click. Expected persisted state:

- exactly one Nova pending membership;
- exactly one physical approval-pending checkout basket;
- no ticket for Nova;
- Nova `users.activities.tickets=0` and
  `users.activities.asset.tickets=0`;
- exactly one new Casey admin notification from Nova with contextual `Pending`;
- Riley unchanged and ticketless.

Continue the remaining `EVENT-TICKET-005` steps only from its linked test
definition. Do not skip directly to approval and do not combine the later
invitation, expiry, offline or visibility branches with this checkpoint.

## QA working method

### 1. One checkpoint, one transition

Each checkpoint has one controlled producer action and explicitly records:
before state, manual action, immediate state, worker expectation, delayed
projection, unchanged controls and independent persisted oracle. UI evidence
alone is not a PASS.

The user performs the named manual UI action. Codex owns fixture staging,
isolated browser setup, server/database oracle checks, log inspection and
status documentation. Codex gives one short instruction at a time, waits for
the user's stated stop phrase, checks the oracle, reports PASS/FAIL, and then
states the next exact manual action.

### 2. Replayable fixtures, never ad-hoc database patches

Every manual case must be independently replayable. New or changed checkpoint
setup belongs in `event-domain-checkpoints.js` (or the corresponding named
scenario file), not in a one-off Mongo edit. Its behavior and expected evidence
belong in the QA pack; its result/status belongs in the matrix and the resume
block above.

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

Use `restage` only when the current checkpoint explicitly needs the same clean
baseline again. Use `switch`/`advance` only when the QA pack says state is
carried into the next checkpoint. Never infer fixture state from screenshots.
First call must have Docker-socket access; a sandbox permission error is not
evidence that MongoDB is stopped and must never cause a second stack to start.

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

After every checkpoint boundary:

1. Run the independent `status`/named oracle.
2. Report the result in one compact message: `PASS` or `FAIL`, the decisive
   persisted facts, and what remained unchanged.
3. Update the active test definition/evidence and the matrix status/counts.
4. Update only the resume block in this file with the next exact stop point.
5. State: `Következő teszt: <ID> — <one-line purpose>`, then give the first
   manual action. Do not ask the user to repeat already recorded setup or
   evidence.

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

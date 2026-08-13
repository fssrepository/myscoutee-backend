# Current manual QA session

Updated: 2026-08-13

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
checkpoint: EVENT-TICKET-011
detail: ../manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md#event-ticket-011--successful-check-in-projects-attendance-into-event-members
scenario: event-domain
ledger_status: IN PROGRESS / FIX HOT-DEPLOYED / BASELINE READY
state: EVENT-TICKET-011 attendance fields, authoritative first-use projection, replay recovery, member delta endpoint/popup poll and frontend-local parity are implemented. Shared SmartList was not changed. Existing frontend watcher is green; existing backend watcher reported BUILD SUCCESSFUL in 3s and Started Main at 2026-08-13T14:30:06+02:00. Fresh staged oracle at 2026-08-13T12:26:19.963Z proves QA EVENT-TICKET-011 active at 2/8 with Casey Admin and Nova accepted, no attendance, one Nova A/unused ticket manual-qa-checkpoint:v1:event-domain:ticket, zero replay audits/tasks/outbox. ADB device and tcp:8080->tcp:80 reverse are active; exactly three isolated 011 browser sessions are open
required_resume: Run only the EVENT-TICKET-011 baseline UI observation now. Casey opens QA EVENT-TICKET-011 Members from the 2/8 capacity control and keeps it open; Nova opens the one Upcoming Ticket and its QR. Prove Nova appears once as accepted/member with no Checked in label. Then scan once as Casey without closing/reloading Members, wait for its own member delta poll, and run verify-ticket-attendance-first-scan. After that replay only the same QR once and run verify-ticket-attendance-replay; do not restart the case
event: QA EVENT-TICKET-011 / manual-qa-checkpoint:v1:event-domain:event
actors:
  left: Casey Bridge
  middle: Nova Social
  right: Riley Outside
next_actor: User baseline UI observation in Casey and Nova; no scan yet
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

After that proof, open or replace exactly the checkpoint-configured managed
windows with:

```bash
guides/qa/tools/open-checkpoint-browser-sessions.sh EVENT-TICKET-005
```

The launcher owns one separate ephemeral Chrome profile per configured actor,
injects the exact demo user sessions, grants the configured Austin
geolocation, loads `/game`, dismisses entry consent/guides and lays the windows
out in the configured grid. Do not open ad-hoc browsers, use personal Chrome
profile names, or ask the user which profile to select. Re-running it replaces
only this checkpoint's managed windows. Idle controls remain untouched until
the checkpoint says otherwise.

### Next manual action

`EVENT-TICKET-011 — successful check-in projects attendance into Event Members`
is staged at its exact unused-ticket baseline. In Casey open the event's 2/8
Members list and keep it open. In Nova open Ticket -> Upcoming and the sole QR.
Confirm Nova appears once as accepted/member with no Checked in label. Do not
scan yet; reply `megvan`.

## QA working method

### 1. One checkpoint, one transition

Each transactional boundary has one controlled producer action and explicitly
records: before state, manual action, immediate state, worker expectation,
delayed projection, unchanged controls and independent persisted oracle. A
checkpoint row may contain a short causally continuous sequence of these
boundaries under the granularity rules below. UI evidence alone is not a PASS.

This campaign is a developer-AI collaborative repair session, not a two-person
QA handoff. Codex owns the complete machine-side loop: fixture staging,
isolated browser setup, server/database oracle checks, diagnosis, correctly
scoped implementation, hot-deploy/log verification, replay and status
documentation. The user performs only the genuinely manual UI observation or
producer action named by the checkpoint. Codex gives one short manual
instruction at a time, waits for the stated stop phrase, checks the oracle and
continues the repair/replay loop without handing the failure decision back to
the user.

### 1.1 Checkpoint granularity and new rows

- One matrix row must remain a bounded, human-verifiable contract, not a
  half-day collection of loosely related checks.
- One producer action or a short causally continuous sequence may stay in one
  row when it shares a baseline and finishes at one decisive oracle.
- One test case/matrix row may contain two or more named, short tests or
  branches when they verify different observations of the same contract and
  share the same controlled baseline. Keep their stop points and oracle results
  distinct inside the QA-pack definition.
- When one row contains several named steps or branches, format the relevant
  CSV cells as quoted multiline values with one short `•` item per step. The
  XLSX synchronizer wraps cell text, aligns it to the top and gives explicit
  multiline rows enough height. This is presentation inside one testcase row,
  not a reason to duplicate or split the testcase.
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
- When the user adds an expectation to the active test, place it immediately
  at the earliest causal observation boundary in the QA-pack definition,
  matrix oracle and replay checkpoint. If that boundary has already passed,
  use retained persisted evidence where it is decisive, but classify an
  omitted manual UI observation as **NOT EXECUTED**, not as a retroactive
  product FAIL. Do not replay already-proven earlier transactions solely to
  manufacture that missed observation unless the new expectation changes the
  correctness of the active boundary or the user explicitly requests it.
- On a requested split, preserve execution continuity explicitly with the
  ordered chain and `advance`/`switch` semantics where supported; never force
  the user to recreate already-proven setup.
- After a repair, scope the replay to the shortest causal path that can execute
  the changed owning code and decisive oracle. Keep prior clean evidence for
  branches untouched by that change; do not restart every subtest merely
  because they share a matrix row. Require a full checkpoint replay only when
  the failure contaminated the shared baseline/evidence or the repair changed
  an earlier shared transaction invariant. If a focused path needs prepared
  state, make it a versioned sub-checkpoint rather than asking the user to
  reproduce unrelated manual steps.
- Before issuing any lifecycle producer instruction whose control is filtered
  by Upcoming/Active/Past time, compare the event's absolute start/end against
  the current wall clock and reserve enough time for the remaining manual stops,
  worker waits and actor replacement. This applies to long continuation
  checkpoints, not only explicit time-window tests. If the retained fixture can
  expire during that round trip, do not issue the instruction: add one guarded,
  versioned preparation that proves the current transaction oracle, moves the
  whole event projection to a stable future window once and persists the old
  and new dates. Let an already-open list recover through its normal poll when
  possible. If expiry removed the action before a modifying request was sent,
  classify it as **NOT EXECUTED / fixture timing invalid**, retain prior PASS
  boundaries and continue without replaying them.
- A versioned server-side replay rearm does not by itself require a full page
  reload. First let the already-open surface reach the prepared pre-action
  boundary through its established read behavior; when that surface loads only
  on demand, close/reopen just that surface. Use a full document reload only
  when the pre-action baseline cannot otherwise be reached, and record it as
  setup. After the producer action, never reload before capturing the in-place
  result; otherwise the immediate and reload/read branches become
  indistinguishable.
- A human-observed time-window checkpoint must stage into a stable, non-expiring
  precondition. Browser preparation, oracle reads and the user round trip must
  never consume the tested interval. Start the interval only through an
  explicit versioned harness action after the user has confirmed the exact
  pre-window UI boundary; print and persist the absolute deadline and owning
  identity. A missed pre-window observation is **NOT EXECUTED / fixture timing
  invalid**, not a product FAIL, and must be repaired in the fixture before
  replay.
- A new versioned harness action is incomplete until both the scenario
  dispatcher and the outer `manual-qa-checkpoints.sh` usage/allowlist route it.
  Before treating an attempted action as executed, pair its structured success
  phase with a read-only state check; usage output or a non-zero exit leaves the
  transaction unexecuted. In particular, never infer that a time window began
  merely because the inner scenario contains the command.

### 1.2 Exact manual producer instructions

- For an offline checkpoint in a dev stack, first prove the checkpoint-specific
  service-worker switch is enabled, the worker is activated and controls the
  current page. The dev override must be ignored in production; production
  enablement belongs only to its build configuration. A one-shot CDP command
  that detaches is not an offline interval: keep the target session attached,
  apply both request blocking and `navigator.onLine=false`, and restore online
  explicitly in cleanup. Before testing cached domain data, require the
  offline shell policy itself: only the intentionally supported Ticket action
  remains enabled, while profile editing and every other menu are disabled.
- Keep offline presentation separate from profile visibility and invalid
  presentation. Profile visibility may color the ordinary page, while offline
  overrides only the page background with its own stronger gray and an explicit
  status label. Do not recolor menu palettes to represent offline; retain their
  normal palettes and express unavailability through real disabled state. Rate
  mode, filter/history controls and editable inputs follow the same rule.
- In an offline member header, hide actions whose popup cannot serve the
  checkpoint contract rather than rendering misleading disabled affordances:
  no profile pencil, notification header entry or notification attention FAB.
  Hiding launchers must not mark notifications read or change their counters.
  Override the visibility color only on the page and the profile/visibility
  part of the open menu; leave the menu content surface and item palettes alone.
- Record in-place connectivity transition and offline-cache reload as distinct
  observations when both matter. A synthetic CDP event that changes
  `navigator.onLine` but is not consumed by the application is harness evidence,
  not a product PASS or FAIL. The cache-reload branch must start the application
  with `navigator.onLine=false`, prove an activated controlling worker and read
  both the computed page state and interactive disabled states. Always release
  the held target back online in cleanup.
- For Ticket offline warming, inspect the actual DTO/cache boundary before
  asking for a detail action. The authenticated side-menu realtime response
  carries one bounded `offlineTicketSnapshot` for the first **Upcoming**
  SmartList window, including each complete `AssetTicketDTO` and `scanCode`;
  the shared user-service poll layer writes it to the user-scoped Upcoming
  offline cache even when Ticket has never been opened. Past is intentionally
  not auto-warmed. This snapshot is never an online SmartList data source:
  online continues through `/assets/tickets` and `/assets/tickets/sync`, while
  the HTTP adapter reads the snapshot cache only after an offline transport
  failure. If Ticket is already open, its own coordinated SmartList page/delta
  poll remains the cache refresher and the ordinary side-menu domain lane need
  not compete. Opening the QR online is never a separate warm requirement: the
  QR popup performs no detail read and renders locally from the cached code.
  Opening the QR offline remains the presentation assertion, not setup.
- Start every manual instruction with the active testcase ID and short name,
  then name the current subtest. In plain language state what the user should
  do, why that observation belongs at this boundary, and the exact visible
  condition that counts as PASS. Do this even when continuing the same case,
  so the user never has to reconstruct the test purpose from earlier messages.
- Treat a sudden message unrelated to the active checkpoint as a possible
  cross-window message, not as implicit authorization to change task scope.
  Stop mutations, keep the current checkpoint intact and confirm the context
  before touching the unrelated artifact. Never edit, restore or revert files
  from an inferred context switch; a read-only comparison is not permission to
  apply what it finds. Resume the QA transaction only after the user explicitly
  returns to it.
- The resume block's `required_resume` and **Next manual action** are declarative
  instructions for Codex to issue next; their presence does not prove that the
  user has already received or performed them. A stop phrase counts for a
  producer action only when Codex's latest explicit manual instruction named
  that same action and asked for that phrase. Never bind a bare `megvan` to an
  unissued resume action from the file or from remembered conversation state.
- Before handing a producer action to the user, verify the exact actionable
  surface from the implementation and, when the current UI is ambiguous, from
  the managed browser's read-only DOM. Name the complete interaction path,
  including row/menu identity and any confirmation button.
- Do not turn obvious navigation or opening an unambiguous card menu into its
  own manual stop. A stop must either produce evidence or protect against a
  real destructive ambiguity. When stable titles/IDs already distinguish the
  target, combine menu navigation and confirmation into the single producer
  instruction; spend the saved stops on meaningful in-place convergence,
  close/reopen or reload reconstruction, negative-control identity stability
  and the independent persisted oracle.
- For isolation checkpoints, prove more than the selected record's expected
  delta: retain one exact adjacent control identity byte-for-byte, observe the
  affected visible count/list without reload, reconstruct the same result on a
  fresh read, verify unrelated actors remain unchanged and prove repeated reads
  create no cross-scope object, counter, outbox or worker effect.
- Before asking the user to select a named candidate, inspect the real
  candidate service/converter and identify its eligibility source; a visible
  user who is outside the target membership is not by itself a selectable
  candidate. Make the checkpoint own every required source record (for
  example a prior `single + met=true` rate, parent membership or contact),
  expose that record in the status oracle, and preflight the authenticated
  candidate endpoint for the exact actor/owner. Require the named target and
  expected total before issuing the producer instruction. If a popup was
  already opened before fixture preparation and does not poll, replay only its
  close/reopen boundary rather than earlier proven steps.
- If an expected manual action is absent, inspect the actor-specific API
  response, authorization/write service and existing behavioral regressions
  before adding or exposing a new control. When the domain explicitly forbids
  that transition and defines a different order, classify it as a QA-sequence
  defect, correct the checkpoint/action order and continue from the current
  intact boundary. Do not implement a contradictory product shortcut merely
  to satisfy the mistaken test instruction.
- Treat Notifications as persisted evidence by default, not as a domain action
  surface. A notification menu owns a business transition only when its actual
  converter/menu implementation exposes that action.
- For an unread/New notification assertion, stop and inspect New before any
  later action that intentionally resolves or marks that row read. A later
  read row in All can prove persistence and resolution, but it is not evidence
  that the earlier New UI was manually observed.
- Before the producer instruction has actually been issued, an unchanged
  oracle is only the intact pre-action boundary. After a correctly matched stop
  phrase, pair the persisted oracle with the access log. If no expected
  modifying request left the browser because the instruction did not reach the
  real action control, the transaction is **not executed**, not a product FAIL:
  retain the checkpoint, correct the instruction and do not add false failure
  evidence to the QA pack or matrix. If the verified control was activated but
  its binding emits no request, that is a client defect and must enter the
  normal diagnose/fix/replay loop.
- `chrome-target-network.mjs inspect --user-id ... --endpoint-file ...` is the
  read-only managed-session tool for resolving an ambiguous current surface;
  it must never be used to perform the user's manual producer action.

### 1.3 Context-dependent frontend-local parity

- When a defect is owned by shared frontend code after the HTTP/local service
  adapter boundary (for example a shared store, converter, component or
  in-place mutation projection), treat both adapters as potentially affected.
  Inspect both adapter contracts before closing the repair.
- Execute the equivalent frontend-local transition when that runtime supports
  the same business route, its deterministic fixture can reach the same
  boundary, and doing so does not contaminate the active HTTP checkpoint. Keep
  the HTTP and local observations separately named inside the same testcase;
  adapter parity does not require a duplicate matrix row.
- Static inspection only proves contract compatibility, not runtime PASS. If a
  deterministic local transition is unavailable or would require unrelated
  setup, add the narrowest shared/local regression coverage available and
  record local runtime as **NOT EXECUTED**, with the exact reason. Never infer
  local PASS from an HTTP replay, or HTTP PASS from a local replay.
- For an adapter-specific defect, repair its owning adapter and inspect the
  parallel adapter for the same invariant. Do not broaden the code change when
  the parallel contract is already correct, but run its focused check when the
  affected business boundary is readily reproducible.
- In an HTTP-backed flow, the Java backend owns the durable business
  transition. The operation response may update the UI immediately, but a
  reload must reconstruct the same state from the Java read path. Verify the
  persisted status plus a fresh query/reload independently; if either is
  wrong, repair the Java write/read owner rather than preserving the result
  only in frontend state.
- In frontend-local mode, the equivalent durable owner is the local
  repository/IndexedDB path. Apply the same immediate-versus-reload contract
  there when the local fixture can execute the transition deterministically.
- Record operation-time in-place state, an immediate fresh read and a later
  reload/read as independent observations when the contract needs them. Later
  convergence does not erase an earlier in-place FAIL; an in-place PASS does
  not prove reload persistence.

### 2. Replayable fixtures, never ad-hoc database patches

Every manual case must be independently replayable. New or changed checkpoint
setup belongs in `event-domain-checkpoints.js` (or the corresponding named
scenario file), not in a one-off Mongo edit. Its behavior and transaction
evidence belong in the QA pack; its result/status belongs in the CSV/XLSX
matrix. The resume block contains only the next live boundary.

Fixture ownership must include every persisted object consulted by the tested
read path, even when that object was created by an earlier checkpoint. If a
counter/list mismatch is caused by an inconsistent persisted transaction, fix
the terminal write owner that left the state open; do not mask it in the query
or projection. Add the missed collection to the fixture selectors, reset
cleanup and status oracle. For an already-active legacy state, use one guarded,
versioned repair action that proves the untouched boundary and records a reset
snapshot; never issue an ad-hoc Mongo update or silently restage over it.

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

The checkpoint is the controlled precondition and replay is the post-fix proof.
After a defect fix, restore the canonical checkpoint and replay the affected
causal chain; do not preserve or manually massage the failed transaction into
a substitute baseline.

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
must exist in `browser-session-checkpoints.json`. A persisted server oracle
does not substitute for an actor window when that actor's in-place,
poll-driven, notification, counter or read/reload UI behavior is an explicit
expectation. Conversely, do not launch actors used only as persisted negative
controls. Actor identity is verified by the script after session injection;
do not identify users from Google profiles, window order alone or remembered
sessions.

This workstation has exactly three usable Google-account/browser slots, so QA
must never launch more than three managed actor windows concurrently. When one
checkpoint needs UI evidence from more than three identities, split it into
short causally ordered browser phases with separate configuration entries and
replace the previous phase's windows before opening the next. For example,
`EVENT-VISIBILITY-001` uses Casey/Nova/Riley for Save/Publish notification and
ticket convergence, then `EVENT-VISIBILITY-001-EXPLORE` replaces them with
Casey/Lina/Liam for friend/non-friend discovery. This is one domain checkpoint
with two named UI phases, not two simultaneous five-actor layouts and not a new
testcase row. Check memory/swap/CPU before and after every replacement. Keep
personal profile paths and names out of Git.

The managed launcher treats those three slots as exclusive: before opening a
checkpoint it closes and removes only earlier launcher-owned manifests and
temporary profiles. It must not touch personal Chrome windows or profiles.

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
- When one direct action must project across two Mongo documents but the dev
  deployment has no cross-document transaction, the first write stays the
  authoritative CAS and the second write is an ID-scoped, only-if-missing
  projection. The canonical replay path must idempotently repair a missing
  projection from the original persisted identity/time/actor without rewriting
  a completed one. Frontend-local mode performs the equivalent pair in its one
  local state write. Reads must never synthesize the projection.
- A visible domain popup must not indefinitely block global realtime menu
  counters. When popup-specific profile/impressions state must be deferred,
  apply the global counter projection separately and keep the profile cursor
  unadvanced so the deferred snapshot remains replayable after the popup
  closes. Protect counter application with a per-user revision token: a poll
  captured before a newer local/optimistic counter mutation must be rejected,
  not allowed to overwrite it.
- For a normal-poll badge checkpoint, keep the owning popup open across the
  external producer action, verify the realtime response payload independently
  from the rendered menu DOM, and require the item-level badge without reload.
  A total avatar badge is not proof that the named menu counter converged.
- Do not change shared SmartList paging merely because one surface's ordinary
  absolute poll cannot reconcile insertion/removal in a partially filled
  loaded window. First inspect whether an established SmartList extension
  contract already owns that need. For dynamic identity windows, prefer the
  existing Notification-style `pollDelta` contract (`knownItems`, revisions,
  loaded tail, `upserts`, `removedIds`, absolute total) plus `cacheable`
  identity and local sort on that domain surface. Implement the same contract
  behind both HTTP and frontend-local adapters. A shared SmartList core change
  requires proof that the invariant applies to its existing consumers and a
  regression audit proportionate to that cross-surface blast radius.
- A popup foreground task poll owns its domain list, header and corresponding
  menu bucket while that popup is visible. The side-menu realtime poll may
  keep its independent notification lane alive, but must not apply ordinary
  domain counter snapshots under the foreground owner. The foreground result
  updates its items, absolute total and menu counter together. Describe two
  simultaneous writers as a race only when ordering-dependent overwrite has
  actually been demonstrated; ownership overlap alone is not proof of a race.
- Counters come from physical active ticket state and must agree in both
  `tickets` and `asset.tickets` fields.
- The Riley window is an unchanged control unless a checkpoint explicitly
  makes Riley an actor.
- An action emits only its own ID-scoped delta. Normal polling reconciles
  absolute state; it must not manufacture domain writes.
- A successful owner-triggered Publish/Unpublish must update the same
  SmartList source DTO that owns the converted card and shared action menu.
  Require the opposite valid action immediately after confirmation, before a
  periodic poll can hide a stale source/card split. The poll is only the
  convergence proof for another actor's already-open surface; it is never the
  repair mechanism for the producer's own menu.

### 5. Logs and running stack

The running development stack is the only build path for an active QA repair.
Do not start a separate Gradle/npm build, test command that triggers its own
compilation, server, Angular watcher, MongoDB or Compose stack. After a source
change, let the owning hot-deploy watcher build and inspect its existing logs:

```bash
docker logs --since 5m myscoutee
docker logs --since 5m frontend-sync
docker logs --since 5m nginx
```

- `myscoutee`: backend compilation/startup and request-path failures.
- `frontend-sync`: frontend hot-deploy/build result.
- `nginx`: HTTP request timing/routing when a UI action is in doubt.
- Mongo truth comes from the checkpoint `status` oracle, not from log guesses.

Before triggering a source rebuild, and before deciding to restart an owner,
inspect current CPU, available memory and swap pressure (for example `free -h`,
`ps -eo ... --sort=-pcpu` and `docker stats --no-stream`). Use that evidence to
avoid overlapping expensive work and to choose whether to wait or restart.
Record the relevant resource decision when it changes execution.

If hot-deploy does not compile, is stuck or holds a stale cache lock, identify
its exact owning process. Restart only the same server/container owner and then
verify its startup plus hot-deploy log; do not launch a replacement beside it.
Never work around the lock with a different cache, `/tmp`, a second Gradle/npm
process or a standalone build/test compilation. A healthy watcher build and the
checkpoint replay are the active-session verification path.

### 5.1 Git HEAD backups during the session

The user may periodically commit the current work as a backup, moving the
working state into Git HEAD. When previously modified files disappear from
`git status` or `git diff`, do not interpret that alone as a rollback or lost
work. Re-read the current HEAD/file contents and continue from the persisted QA
resume pointer; never reconstruct or reapply already-backed-up changes merely
because the worktree became clean. Treat a backup as incorrect or reverted
only when the user explicitly says so.

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
During an active QA session, FAIL is not a user decision point: Codex
immediately diagnoses and fixes the owning domain contract at the correct
scope, uses the existing hot-deploy owner and its logs for build verification,
then resets/stages the replayable fixture and replays the same checkpoint. A
"minimum/local fix" is not a goal when it would preserve a broken invariant or
create a special-case path. Before changing persistence semantics, inspect the
parallel adapter and relevant git history so `save`, state transition, audit
and read-model meanings are preserved consistently. Ask the user only when new
authority or a materially different product decision is actually required.
Never continue from or accept a partially mutated baseline as the next test's
setup; the checkpoint and replay harness exist specifically to make this
repair-and-clean-replay loop deterministic.

## Ordered continuation

The ticket/visibility continuation through `EVENT-VISIBILITY-001` is
PASS/CLOSED and reset. The active independent checkpoint is
`EVENT-TICKET-008`; continue only from its fresh resume pointer. The completed
retained chain remains defined, not duplicated, in the QA pack:

```text
EVENT-TICKET-005 -> EVENT-TICKET-006 -> EVENT-TICKET-007
-> EVENT-VISIBILITY-001 (closed)
```

`EVENT-TICKET-008` is the active two-event ticket-isolation branch.
`EVENT-TICKET-009` (offline cached QR with online scanner) remains independent.
Do not pull either into `EVENT-TICKET-005`.

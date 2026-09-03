# Manual QA checkpoints

This directory is a manual-only QA harness. It is deliberately separate from
`admin-job-fixtures`: it does not import, modify, or execute that automated
fixture suite.

The harness creates observable checkpoints around a real persisted scheduler
configuration. It never starts another backend, frontend, database, Gradle, or
scheduler process and never calls a hidden/manual job endpoint.

## Canonical Docker entry point

When the development stack already owns the `mongodb` container, use the
versioned Docker entry point from the repository root:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status event-domain EVENT-FEEDBACK-006
```

It pins `MANUAL_QA_MONGO_MODE=container`, resolves the already-running
`mongodb` container and delegates to the same checkpoint harness. It never
starts, stops, restarts or rebuilds MongoDB or any other service. Agent/tool
invocations must grant this command access to the existing Docker socket on
the first attempt. If the socket is denied, the harness reports that condition
separately; it must not be interpreted as a stopped container and must never
trigger another stack or database process.

## Available scenarios

| Scenario | Prepared path | Automatic path under test |
| --- | --- | --- |
| `base-stat` | Captures the complete visible Statistics oracle | Statistics Refresh with no causal action |
| `stat-010` | Resets one isolated rating pair and its logical bell/outbox | Real frontend rating batch plus Statistics/Monitoring workers |
| `graph-rating` | Isolates both directions of one rating pair and reports direct versus materialized graph evidence | Two real frontend rating batches plus affinity recompute |
| `graph-layout` | Holds and snapshots the materialized graph before shortening the persisted daily rule | Real daily affinity-graph layout scheduler in the HTTP demo/production path |
| `stat-011` | Prints one unique message token for an existing chat | Real chat persistence plus Statistics/Monitoring workers |
| `stat-020` | Holds one exact event recompute task and captures graph history | Short persisted affinity schedule/normal worker plus Statistics Refresh |
| `stat-012` | Stages one deterministic event/invitee while holding the rule | Short persisted real auto-inviter schedule |
| `event-schedulers` | Stages one EVENT-SCHEDULERS-001 branch, holds the target baseline and moves all non-target persisted scheduler rules to a reversible seven-day interval | One separately armed real scheduler run with exact Metrics and domain oracles |
| `chat-domain` | Stages one selected Chat checkpoint with exact row, context, ordering and zero-write oracles | No scheduler; the selected checkpoint uses the normal paged Chat read/write paths |
| `event-domain` | Stages one selected Editor, invitation/chat, lifecycle, feedback/Impressions, ticketing, or tournament checkpoint with exact identity-level oracles | No scheduler unless the selected checkpoint explicitly continues through its named real-scheduler helper |
| `asset-domain` | Stages controlled asset invitations or one event/sub-event resource assignment with independent asset/event role oracles | No scheduler; direct resource/outbox consumers are conditional |
| `operator-domain` | Snapshots the exact deployment configuration and prints a credentials-safe Firebase capability oracle | No scheduler; QA supplies disposable provider configuration through the Operator UI |
| `role-triad` | Snapshots the exact Kai/Ava/Operator identities, two reports, one feedback item, branding, support-chat and notification boundary | No scheduler; one continuous three-session authorization and moderation journey |

Only one manual scenario may be staged at a time. The historical 2026-08-04
results were **not** rerun while these helpers were added.

The Event scheduler journey uses a separate baseline and arm boundary:

```bash
bash manual-qa-checkpoints.sh stage event-schedulers EVENT-SCHEDULERS-001 random-groups
bash manual-qa-checkpoints.sh status event-schedulers EVENT-SCHEDULERS-001
# Only after the tester records the Job Detail and Metrics baselines:
bash manual-qa-checkpoints.sh schedule event-schedulers EVENT-SCHEDULERS-001 30
bash manual-qa-checkpoints.sh status event-schedulers EVENT-SCHEDULERS-001
bash manual-qa-checkpoints.sh reset event-schedulers EVENT-SCHEDULERS-001
```

`stage` does not make the target rule due. It snapshots the target configuration
and every unrelated scheduler control, then temporarily gives the latter a
seven-day interval. `schedule` captures the persisted Metrics baseline and
arms only the target. The oracle requires exactly one history row for the
branch-specific primary and reactive rule set. `random-groups` therefore adds
`+2 / +2`: one primary run and one required notification-outbox wake-up. Any
further delta is a duplicate or unrelated-run failure. `reset` retains
legitimate target run history while restoring its original configuration and
every isolated rule's exact timing control.

## Event-domain checkpoint runner

The event-domain runner implements executable setup and machine oracles for the
checkpoint graph in
[`DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md`](../../../../guides/qa/manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md).
It does not merely print that document. `stage` creates the controlled event,
membership, feedback or ticket prerequisite and stores a complete reset
snapshot; `status` queries the resulting identities from Mongo.

Supported checkpoint IDs:

- `EVENT-EDITOR-001` through `EVENT-EDITOR-005`
- `EVENT-RUNTIME-001`
- `EVENT-PUBLISH-CHAT-001`
- `EVENT-SLOT-001` through `EVENT-SLOT-004`
- `EVENT-INV-001` through `EVENT-INV-006`
- `EVENT-ACTIVITY-REFRESH-001`
- `CHAT-AUTH-001`
- `EVENT-LIFE-001` through `EVENT-LIFE-005`
- `EVENT-FEEDBACK-001`, `EVENT-FEEDBACK-002`, `EVENT-FEEDBACK-005`, and
  `EVENT-FEEDBACK-006`
- `EVENT-IMPRESSION-001`
- `EVENT-VISIBILITY-001` (advance only from completed `EVENT-TICKET-007`)
- `EVENT-TICKET-001` through `EVENT-TICKET-008`, plus
  `EVENT-TICKET-POLL-001`
- `TOURNAMENT-001` through `TOURNAMENT-003`

`EVENT-TICKET-002` intentionally starts with a published, Ticketing Off event.
The harness must not manufacture the participant-owned ticket overlay or its
credential. Its consistent membership baseline is Casey accepted Admin plus
Nova accepted Member (`2 / 8`) and Riley as one pending join control. Casey
performs Unpublish -> Ticketing On -> Publish through the UI; that real publish
path owns Nova's credential, while Casey and Riley remain ticketless. Nova then
opens Ticket twice to prove that both reads reuse the one physical credential
created by publish.
`EVENT-TICKET-POLL-001` uses the same clean Ticketing Off write baseline,
including Casey and Nova accepted at `2 / 8` plus Riley pending and ticketless,
but keeps Nova's Upcoming Ticket popup open before Casey performs Unpublish ->
Ticketing On -> Publish. Within one 30-second SmartList interval the new ticket
row and the shared `tickets` / `asset.tickets` counter signal must converge
together without close/reopen or browser reload; the poll itself is read-only
and Riley must remain pending with no ticket or ticket counter. Its second
phase closes Nova's popup, leaves the side menu open and has Casey Unpublish:
the resumed background poll must change Events and Ticket from `1 -> 0`, while
the same physical ticket is retained as a `D` audit record and Ticketing stays
configured On in the draft.
`EVENT-TICKET-004` proves the retained `D` audit record plus a new object and
QR after Unpublish -> Publish with Ticketing still On. `EVENT-TICKET-005` starts with Casey alone and
uses the real Public Explore -> Nova Join -> Casey approval path: Join is
pending and ticketless, while the terminal approval creates Nova's ticket.
`EVENT-TICKET-006` keeps the physical ticket `A` while the ended event moves it
from Upcoming to Past. `EVENT-TICKET-007` starts with Casey and ticketed Nova
accepted; Nova invites Riley, Casey preapproves without creating Riley's
ticket, and only Riley's later terminal acceptance creates it.
Separately, `EVENT-TICKET-008` stages two similar published Ticketing On events with Casey
Admin, Nova accepted and Riley pending on both. Nova starts with two distinct
physical tickets. Unpublishing and republishing event A must revoke/reissue
only A; event B keeps the same active ticket identity and the aggregate ticket
counter follows `2 -> 1 -> 2`.
After the `EVENT-TICKET-007` terminal state, advance to
`EVENT-VISIBILITY-001` without resetting.
Casey performs Unpublish -> Friends Only -> Publish on the same event. Lina
Park is the external non-member friend control and Liam Parker the external
non-member non-friend control; Nova and Riley are ineligible as Explore
controls because they already have tracked event participation. Unpublish
retains the two old tickets as `D`; publish creates new `A` ticket IDs/codes
and restores their stored counters. Explore reads must create no membership,
invitation or ticket.

```bash
bash manual-qa-checkpoints.sh advance event-domain \
  EVENT-TICKET-007 EVENT-VISIBILITY-001
```

Direct `stage` is rejected for this checkpoint because it would lose the
completed invitation/ticket baseline that the visibility transition must
use as its before oracle.

Reset removes only the checkpoint's event/ticket artifacts and restores the
saved activity snapshot. Both `activities.tickets` and
`activities.asset.tickets` in every involved `users` row must therefore return
to baseline; the UI badge sourced from those fields must disappear on the next
ordinary poll.
Ticket checkpoints require `MANUAL_QA_EVENT_IMAGE_URL`; use the retained
managed QA image's canonical `large.webp` URL so ordinary ticket cards can be
verified against the derived `medium.webp` request instead of the remote
placeholder.

Use one checkpoint at a time:

```bash
bash manual-qa-checkpoints.sh status event-domain EVENT-FEEDBACK-002
bash manual-qa-checkpoints.sh stage event-domain EVENT-FEEDBACK-002
bash manual-qa-checkpoints.sh add-feedback-participant event-domain EVENT-FEEDBACK-002
bash manual-qa-checkpoints.sh next event-domain EVENT-FEEDBACK-002
# perform exactly the printed human UI action
bash manual-qa-checkpoints.sh status event-domain EVENT-FEEDBACK-002
bash manual-qa-checkpoints.sh reset event-domain EVENT-FEEDBACK-002
```

### Physical-phone QR check-in

`EVENT-TICKET-003` is a required physical Android phone test. The phone owns
the Casey Admin scanner session and uses its real camera; Nova's participant
session displays the ticket QR code on a separate desktop browser or other
screen. Do not replace this checkpoint with desktop camera emulation.

Enable Developer options and USB debugging on the phone, connect it by USB and
accept **Allow USB debugging**. From the repository host run:

```bash
adb devices -l
adb reverse tcp:8080 tcp:80
adb reverse --list
```

The device state must be `device`, not `unauthorized`, and the reverse list
must contain `tcp:8080 tcp:80`. Open `http://localhost:8080` in the phone
browser, sign in as Casey Admin and grant camera permission when the scanner
opens. Reapply `adb reverse tcp:8080 tcp:80` after an ADB daemon restart, USB
reconnection or phone restart. The tunnel never requires starting, rebuilding
or restarting the application stack.

Every clean Ticket checkpoint stage creates a fresh UUID-shaped `TKT-` code.
Reset followed by a new stage must therefore produce a different QR even when
the controlled event, ticket document ID and holder remain the same. The
checkpoint state retains that generated code so later status/verification
commands compare against the staged physical object instead of regenerating it.

For a feedback checkpoint transition, use one snapshot-protected command
instead of a manual reset followed by a separate stage:

```bash
bash manual-qa-checkpoints-docker.sh switch event-domain \
  EVENT-FEEDBACK-006 EVENT-FEEDBACK-002
```

`switch` verifies the currently staged source ID, restores its saved baseline,
then stages the named feedback checkpoint and records a fresh reset snapshot in
the same harness invocation. It never starts or restarts a service.

`next` always prints why the action exists, what to do, the exact visible
result and whether a named worker must run. For read-only, feedback-state and
direct ticket request checkpoints it prints `MUST NOT RUN`; no artificial
scheduler is added.

The default controlled identities are Casey Bridge as host and Nova Social as
participant. Override both together when the available isolated browser/Gmail
sessions require other seeded users:

```bash
MANUAL_QA_CREATOR_USER_ID=<host-user-id> \
MANUAL_QA_INVITEE_USER_ID=<participant-user-id> \
MANUAL_QA_EVENT_IMAGE_URL='/media/public?key=images%2F650000000000000000000061%2Fmanual-qa-checkpoint-v1-event-domain-event%2F1785904818563-084b9c3d-2bec-4d84-86f6-fb7140562c60%2Flarge.webp' \
bash manual-qa-checkpoints.sh stage event-domain EVENT-TICKET-002
```

`EVENT-EDITOR-003` keeps the manually created event and separates its three
effects. Hold the rule before editing, prepare reversible eligibility only
after the Draft Save, and never attribute the publish-time initial batch to the
periodic scheduler:

```bash
bash manual-qa-checkpoints.sh hold-auto-inviter event-domain EVENT-EDITOR-003
# Unpublish, enable Auto Inviter in Draft, Save, close and reopen.
bash manual-qa-checkpoints.sh prepare-auto-inviter event-domain EVENT-EDITOR-003
bash manual-qa-checkpoints.sh capture-auto-inviter-baseline event-domain EVENT-EDITOR-003
# CARD-PUBLISH: use Publish once from the Draft card overflow menu without
# reopening Event Editor, then capture the initial-batch recipient.
bash manual-qa-checkpoints.sh prepare-periodic-auto-inviter event-domain EVENT-EDITOR-003
# Keep Casey > Events > My Events and Riley > Events > Invitations open in
# separate authenticated sessions. Do not close or reopen either popup.
bash manual-qa-checkpoints.sh schedule-auto-inviter event-domain EVENT-EDITOR-003 30
# After the real scheduler and at most one 30-second SmartList poll:
bash manual-qa-checkpoints.sh status event-domain EVENT-EDITOR-003
```

The initial preparation command snapshots and isolates affinity edges, other
auto-inviter events and wait-list rows. It creates no member, invitation,
notification, marker or outbox record. The periodic preparation command then
introduces Riley as a distinct eligible candidate only after Nova's
publish-time invitation has been proven. It still creates no member,
notification, marker or outbox record.

The schedule command never calls the worker. It keeps the production-like
one-hour interval, backdates only the persisted `lastRunAtIso` so the rule
becomes eligible after the requested 10-120 second delay, and leaves
`manualRunEnabled=false`. The already running scheduler must claim and execute
the rule. Use the default 30 seconds only after all screenshot windows are
open; this avoids a multi-minute wait while preserving time for one baseline
screenshot. Eligibility is not the same as execution: the worker checks for a
due rule every 60 seconds, so a run may begin up to one scheduler tick after the
requested delay. A currently open event SmartList may then need up to one
additional 30-second poll to display the result.

The baseline-capture command records only the two recipient users' complete
`activities` fields for reset. Run it after both recipient sessions have been
visually checked and before Publish; it does not create an invitation or run a
worker.

`EVENT-ACTIVITY-REFRESH-001` is a cross-cutting UI-convergence checkpoint. Keep
the recipient Invitations list and host My Events list open while the owning
manual or scheduled checkpoint creates one invitation. Within one configured
30-second SmartList interval, the open recipient list, the host card projection
and their counters must converge without closing or reopening either popup.
Pending invitations increment the red pending badge; they do not increment the
accepted occupancy fraction. For the default checkpoint, the host card remains
`1 / 8` while its pending badge changes from `1` to `2`.
The poll is read-only and must not create a task, outbox item or job-history
row. Reuse the same assertion with lifecycle checkpoints for All, Active
Events, Pending, Drafts and Trash rather than inventing bucket-specific refresh
rules.

For the default identities, open Casey, Nova and Riley in three isolated
browser/Gmail sessions before Publish. Record the current Invitations and
Notifications counters, and verify the controlled event is absent for Nova and
Riley; unrelated historical items may remain. Execute the `CARD-PUBLISH`
variant from Casey's Draft card overflow menu without reopening Event Editor.
The card must leave Drafts and remain once in My Events, with a consistent
member/capacity badge. The publish-time initial batch must add the controlled
event for Nova only. Keep Riley open without a controlled-event delta until
Riley is introduced as the distinct later periodic candidate.

`TOURNAMENT-003` stages a completed, deterministic qualifier baseline: Casey
beats Nova `9-4` in Group A, while Riley wins the singleton Group B with `7`;
one member advances per group. The normal 30-minute
`event-tournament-review` rule is held until Casey performs the visible
Finalize action. After that write, arm the real worker without shortening its
configured interval:

```bash
bash manual-qa-checkpoints.sh arm-tournament-review event-domain TOURNAMENT-003
bash manual-qa-checkpoints.sh status event-domain TOURNAMENT-003
```

After the first real run has advanced Casey and Riley exactly once, the same
arm command captures that stable boundary and makes one unchanged real-worker
pass due. Verify that pass as an exact domain no-op:

```bash
bash manual-qa-checkpoints.sh arm-tournament-review event-domain TOURNAMENT-003
bash manual-qa-checkpoints.sh verify-tournament-review-noop event-domain TOURNAMENT-003
```

The immediate runner never impersonates the scheduler; both passes are owned
by the already-running development worker.

If the manual Finalize notification contract needs a focused repair replay
after those two scheduler passes are already proven, preserve the score and
advancement evidence and rewind only the Finalize producer boundary:

```bash
bash manual-qa-checkpoints.sh prepare-tournament-finalize-notification-retest event-domain TOURNAMENT-003
# Casey manually finalizes Qualifiers exactly once.
bash manual-qa-checkpoints.sh verify-tournament-finalize-notification event-domain TOURNAMENT-003
```

The rearm removes only the old `event-stage-finalized` outbox/delivery rows,
rewinds Qualifiers from `F` to `SR`, and holds the review worker. It retains the
Casey+Riley Final group, deterministic scores, plan marker and both real-worker
run proofs. The verifier requires one Nova+Riley outbox and excludes the Casey
actor, matching manual tournament Start semantics.

For the ordered notification contract, replay both real producer boundaries:

```bash
bash manual-qa-checkpoints.sh prepare-tournament-notification-sequence-retest event-domain TOURNAMENT-003
# Casey manually finalizes Qualifiers exactly once.
bash manual-qa-checkpoints.sh verify-tournament-finalize-sequence event-domain TOURNAMENT-003
# Wait for the real event-tournament-review worker.
bash manual-qa-checkpoints.sh verify-tournament-advancement-sequence event-domain TOURNAMENT-003
# Wait for the automatically armed unchanged worker replay.
bash manual-qa-checkpoints.sh verify-tournament-advancement-sequence-noop event-domain TOURNAMENT-003
```

The first write produces one translated stage-finalized intent for Nova and
Riley with Casey excluded. The already-existing Final group remains in place;
the real advancement worker then writes Casey and Riley's missing Final-group
memberships and produces a later translated, trophy-branded
advancement intent for Casey and Riley. The final unchanged worker pass must
write neither membership nor another notification.

For the corrected-score continuation, preserve the closed revision evidence
and prepare only the dependent-stage guard boundary:

```bash
bash manual-qa-checkpoints.sh prepare-score-reopen-late-guard event-domain TOURNAMENT-SCORE-REOPEN-002
# Inspect the Qualifiers menu, then send one forbidden late Reopen through Casey's existing session.
bash manual-qa-checkpoints.sh verify-score-reopen-late-guard event-domain TOURNAMENT-SCORE-REOPEN-002
```

The preparation activates the dependent Final event/runtime/current-stage
state directly without replaying any lifecycle producer, then retains a strict
snapshot of the related records and user counters. The verifier accepts only a
byte-identical rejected-action boundary.

## Asset-domain checkpoint runner

The asset runner supports `ASSET-MEMBER-001`, `ASSET-MEMBER-002` and
`ASSET-ASSIGN-001`. It creates controlled assets and, where required, an event
with one Transport sub-event. Its oracle reports asset members and event
members separately so an accidental Asset Manager to Event Admin promotion is
visible.

```bash
bash manual-qa-checkpoints.sh status asset-domain ASSET-MEMBER-001
bash manual-qa-checkpoints.sh stage asset-domain ASSET-MEMBER-001
bash manual-qa-checkpoints.sh next asset-domain ASSET-MEMBER-001
# perform exactly the printed UI action
bash manual-qa-checkpoints.sh status asset-domain ASSET-MEMBER-001
bash manual-qa-checkpoints.sh reset asset-domain ASSET-MEMBER-001
```

`ASSET-ASSIGN-001` starts with no assignment record. The human UI action must
create the resource linkage; the helper never writes the expected result in
advance.

The consolidated assignment lifecycle uses its isolated runner and one
versioned baseline containing both a normal two-Sub-event Event and a
two-group Tournament:

```bash
bash manual-qa-checkpoints.sh stage asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
bash manual-qa-checkpoints.sh status asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
# perform the normal Sub-event assignments from the stable checklist
bash manual-qa-checkpoints.sh verify-normal-assignment asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
# edit only the Group A source Asset capacity 4 -> 5
bash manual-qa-checkpoints.sh verify-group-capacity-edit asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
# unassign only that Group A Transport
bash manual-qa-checkpoints.sh verify-group-unassign asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
bash manual-qa-checkpoints.sh restore-group-removal-branch asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
# remove Riley once from the Tournament Event
bash manual-qa-checkpoints.sh verify-group-manager-removal asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
bash manual-qa-checkpoints.sh reset asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
```

`restore-group-removal-branch` is the only permitted branch rearm. It restores
the captured Tournament documents exactly while preserving the already
verified normal Event branch. The verifiers compare Group B byte-for-byte and
require persisted owner/type, runtime, stage and root values; no list query or
frontend fallback is an oracle.

## Content administration lifecycle runner

`CONTENT-ADMIN-LIFECYCLE-001` uses an isolated Content runner. It replaces
only the four controlled governed-content scopes while staged, gives Ava, Kai
and Riley exact Privacy v1/v2 consent histories, and creates one disposable
published Article plus one featured negative control. The runner snapshots and
restores the original scope records, audits, actor consents and controlled
Article IDs. It refuses to stage while another manual-QA scenario is active.

```bash
bash manual-qa-checkpoints.sh stage content-admin CONTENT-ADMIN-LIFECYCLE-001
bash manual-qa-checkpoints.sh status content-admin CONTENT-ADMIN-LIFECYCLE-001
# save the four inactive revisions from the stable checklist
bash manual-qa-checkpoints.sh verify-drafts-saved content-admin CONTENT-ADMIN-LIFECYCLE-001
# activate Privacy v3 and approve it only as Kai
bash manual-qa-checkpoints.sh verify-privacy-active content-admin CONTENT-ADMIN-LIFECYCLE-001
# delete Help v2 and active Privacy v3
bash manual-qa-checkpoints.sh verify-privacy-fallback content-admin CONTENT-ADMIN-LIFECYCLE-001
# move the controlled published Article to trash
bash manual-qa-checkpoints.sh verify-article-trashed content-admin CONTENT-ADMIN-LIFECYCLE-001
# restore it as a Draft, without publishing
bash manual-qa-checkpoints.sh verify-article-restored content-admin CONTENT-ADMIN-LIFECYCLE-001
# publish the restored Draft once
bash manual-qa-checkpoints.sh verify-article-republished content-admin CONTENT-ADMIN-LIFECYCLE-001
bash manual-qa-checkpoints.sh reset content-admin CONTENT-ADMIN-LIFECYCLE-001
```

Every savepoint reads the persisted revisions, exact audit rows, per-user
consents and Article bucket state. Unrelated revisions are compared through a
semantic normalization that permits the service's canonical empty context and
language-label normalization but no content, version, actor, timestamp or
active-state drift. Unrelated Articles and other users' consents remain exact
negative controls. The two staged Articles use distinct, already-managed
system image sets; the lifecycle verifiers require their URLs and HTML
references to remain unchanged.

## Operator-domain checkpoint runner

`OPERATOR-FIREBASE-001` snapshots the exact deployment configuration before
the QA changes it through the Operator UI. It prints only presence booleans,
revision numbers and activation state. Raw Firebase client values and service
credentials are never emitted.

```bash
bash manual-qa-checkpoints.sh status operator-domain OPERATOR-FIREBASE-001
bash manual-qa-checkpoints.sh stage operator-domain OPERATOR-FIREBASE-001
bash manual-qa-checkpoints.sh next operator-domain OPERATOR-FIREBASE-001
# save, test and activate disposable Firebase configuration through the UI
bash manual-qa-checkpoints.sh status operator-domain OPERATOR-FIREBASE-001
bash manual-qa-checkpoints.sh reset operator-domain OPERATOR-FIREBASE-001
```

Run `reset` immediately after collecting fresh-session authentication evidence.
It restores the complete prior configuration, including encrypted envelopes,
without printing them. Verify the restored login mode in another fresh browser
session.

### Previously completed Statistics scenarios

`base-stat` has no product-data setup and no scheduler mutation:

```bash
bash manual-qa-checkpoints.sh stage base-stat
# capture Statistics, make no causal action, press Refresh once
bash manual-qa-checkpoints.sh status base-stat
bash manual-qa-checkpoints.sh reset base-stat
```

`stat-010` prepares Casey Bridge → Nova Social by default. Use a fresh isolated
actor browser profile so an old IndexedDB rating outbox cannot contaminate the
run. Selection remains local; Save starts the real frontend batch path:

```bash
bash manual-qa-checkpoints.sh stage stat-010
# select 4, press Save exactly once, wait for the normal frontend/worker periods
bash manual-qa-checkpoints.sh status stat-010
bash manual-qa-checkpoints.sh reset stat-010
```

`graph-rating` implements `GRAPH-RATING-001`. It separates the first one-way
rating from the reciprocal rating and never assumes that reciprocity is the
pair's only graph evidence. In the seeded Casey/Nova pair, `met` evidence can
already create a link before the second rating. The decisive reciprocal oracle
is a positive rating in both directions, at least one `mutuallyRated` row, a
direct edge with `mutualSingleCount > 0`, and the same pair in the reopened
Admin Affinity Graph. Status also reports whether the UI is reading live edges
or an older materialized layout.

```bash
bash manual-qa-checkpoints.sh stage graph-rating
# Casey selects 4 for Nova and presses Save once; wait for the real frontend batch
bash manual-qa-checkpoints.sh status graph-rating
# Nova opens the received rating, selects a non-zero value for Casey, and saves once
bash manual-qa-checkpoints.sh status graph-rating
# reopen Admin Affinity Graph and compare the pair with the printed directEdge oracle
bash manual-qa-checkpoints.sh reset graph-rating
```

The helper only stages and restores the controlled pair. It does not rebuild a
graph layout or invoke a recompute hook. If status reports an old materialized
layout, retain that as a separate projection checkpoint.

`graph-layout` implements `GRAPH-LAYOUT-001`. It proves the separate daily
projection boundary after a direct affinity edge has changed. The helper holds
the persisted rule for one hour while screenshots are prepared, then shortens
that same rule only for the manual observation window. It never calls the
rebuild endpoint.

```bash
bash manual-qa-checkpoints.sh stage graph-layout
# open Admin Jobs > Rebuild affinity graph layout and Admin Affinity Graph
bash manual-qa-checkpoints.sh schedule graph-layout 30
# wait for the existing scheduler and reopen Admin Affinity Graph
bash manual-qa-checkpoints.sh status graph-layout
bash manual-qa-checkpoints.sh reset graph-layout
```

The machine oracle requires a new materialized `layoutVersion`, a completed
scheduled run, and exact agreement between layout totals and its stored node,
edge and forest collections. The default product interval is one day in both
`demo_db` and `myscoutee_db`.

`CHAT-LIST-001` is a supporting fixture/oracle for the list phase inside the
consolidated `CHAT-FLOW-001` journey; it is not an independently scheduled
manual testcase. It replaces only the selected Casey actor's Chat rows for the
short fixture window and snapshots the exact originals for reset. It stages
one main-event, group, service and App Support row, one unread item in each
context and no messages. The authenticated browser oracle proves date
ascending/descending order and all context totals through the real Java page
route; `status` then proves that every staged chat and activity counter stayed
byte-identical after those reads. The complete manual PASS still requires the
three-actor history/delivery/unread/read/reconnect phases owned by
`CHAT-FLOW-001`.

```bash
bash manual-qa-checkpoints.sh stage chat-domain CHAT-LIST-001
node ../../../../guides/qa/tools/verify-chat-list-read-oracle.mjs \
  --manifest /tmp/myscoutee-qa-browser-sessions/CHAT-LIST-001.json \
  --actor-user-id 650000000000000000000061
bash manual-qa-checkpoints.sh status chat-domain CHAT-LIST-001
bash manual-qa-checkpoints.sh reset chat-domain CHAT-LIST-001
```

`stat-011` prints the exact unique text a QA must send once in **Host Circle
Ops**. Stage itself does not insert a message:

```bash
bash manual-qa-checkpoints.sh stage stat-011
# send the printed uniqueMessage exactly once
bash manual-qa-checkpoints.sh status stat-011
bash manual-qa-checkpoints.sh reset stat-011
```

`stat-020` captures all historical graph points, holds one controlled event
recompute task, and holds the persisted affinity rule for one hour. After every
window and baseline is open, `schedule` moves both the task and rule into the
printed short automatic window:

```bash
bash manual-qa-checkpoints.sh stage stat-020
# open Statistics and the affinity-recompute Admin Job; capture graph baseline
bash manual-qa-checkpoints.sh schedule stat-020 30
# wait for automatic processing, press Statistics Refresh, reselect history
bash manual-qa-checkpoints.sh status stat-020
bash manual-qa-checkpoints.sh reset stat-020
```

The affinity task also has the application's normal worker wake-up path. The
helper reports the task and persisted Admin Job evidence separately instead of
claiming scheduler attribution without both checkpoints.

## STAT-012: one scheduled event invitation

Purpose: prove that one event invitation is created by the already-running real
auto-inviter scheduler and that the domain row, bell, Statistics, Monitoring,
and Admin Job projections agree.

Run commands from this directory.

### 0. Confirm a clean state

```bash
bash manual-qa-checkpoints.sh status stat-012
```

Expected phase: `not-staged`.

### 1. Stage data without making the job due

```bash
bash manual-qa-checkpoints.sh stage stat-012
bash manual-qa-checkpoints.sh status stat-012
```

`stage` inserts one visible event using seeded graph users, accepts its creator,
isolates exactly one creator-to-invitee affinity edge, temporarily quarantines
other auto-inviter/waitlist work, and stores an exact reset snapshot. It also
materializes only this event's `knownEvents`/`activeEvents` inventory entries in
the Statistics snapshot, so the post-stage baseline already contains the test
event and the later scheduler delta is not confused with direct setup. It keeps
the real rule enabled but sets its interval/last-run pair so this scenario is
not eligible for one hour.

Expected phase: `baseline-ready`; invitation, marker, outbox, and bell counts
are all zero.

If human evidence collection approaches the one-hour safety deadline, refresh
the baseline hold without arming the scheduler:

```bash
bash manual-qa-checkpoints.sh hold stat-012
```

`hold` is accepted only before `schedule`, while the rule is not running and no
invitation or scheduler marker exists. It refreshes only the synthetic timing
anchor and keeps the real job ineligible for another hour.

Capture these baseline screenshots before scheduling:

1. **Admin → Monitoring / All**, including Events and Event members.
2. **Admin → Statistics**, including Daily usage and Events & assets.
3. **Admin → Admin Jobs → event-auto-inviter**, including current status,
   pending count, schedule, and last-run area.

Also retain the exact baseline numbers. Direct staging adds the one test event,
so comparisons must always use this post-stage baseline, never the earlier demo
baseline.

For a fast human run, open every observation window before scheduling and keep
them in separate browser/Gmail sessions so active-user state and cookies cannot
cross-contaminate the evidence. A practical three-session layout is:

1. session A: Monitoring / All, with Admin Job detail in another tab;
2. session B: Statistics;
3. session C: the expected/invited user's notification center.

Finish the baseline screenshots in all open windows first. Reopen/refresh each
surface immediately before recording its baseline, then leave it open. The
`stage` output identifies both `creator` and the deterministic
`expectedInvitee`; session C must be signed in as that target before scheduling.
If the available Gmail sessions must map to particular seeded users, provide
both IDs while staging:

```bash
MANUAL_QA_CREATOR_USER_ID=<creator-id> \
MANUAL_QA_INVITEE_USER_ID=<target-id> \
bash manual-qa-checkpoints.sh stage stat-012
```

### 2. Persist a future schedule

Only after the baseline screenshots exist:

```bash
bash manual-qa-checkpoints.sh schedule stat-012 30
```

The argument is the number of seconds until eligibility (`10..120`). The rule
keeps a one-hour interval, while its persisted `lastRunAtIso` is positioned so
the next occurrence is due after the requested delay. This also prevents a
second run for roughly one hour after the first.

The default is 30 seconds because all human observation windows are already
open. The command prints `expectedRunWindow`. The backend's real scheduler
polls every 60 seconds, so the actual run should occur between the printed
earliest and approximate latest timestamps: normally about 30–90 seconds after
the command, rather than three minutes plus a poll.

Capture the scheduled checkpoint in the Admin Job detail before that window.
Do not press a Run button and do not call an endpoint.

### 3. Observe the real scheduler

```bash
bash manual-qa-checkpoints.sh status stat-012
```

Repeat after a normal scheduler poll until the phase becomes
`scheduler-completed`. The exact domain oracle is:

- exactly one pending `invite` membership;
- exactly one scheduler plan marker;
- exactly one notification outbox item;
- exactly one bell item;
- the same real seeded recipient in all four artifacts;
- `lastRunCount: 1` and `pendingCount: 0`.

Capture the post-run UI:

1. Monitoring after reopening it: member changes `+1`, invites `+1`, invite
   delivery/outbox `+1`; event writes remain unchanged.
2. Statistics after Refresh: today's Events `+1`, Activities `+1`, and Event
   participation `+1`; Active events and All events remain unchanged relative
   to the post-stage baseline.
3. Admin Job detail: completed scheduled run with processed count `1`.
4. In the already-open `expectedInvitee` session, capture the one event-invite
   bell item; it must be the same user later printed as `invitedUsers[0]`.

### 4. Restore the demo state

```bash
bash manual-qa-checkpoints.sh reset stat-012
bash manual-qa-checkpoints.sh status stat-012
```

Reset restores the exact selected documents, isolated affinity edges,
Statistics inventory entries, the creator and invitee activity-counter
projections, quarantined data, primary rule, and secondary pending counters.
It deliberately does not rewind legitimate scheduler telemetry or run history.

## Safety

- Only exact `demo_db` and `e2e_db` deployment identities are accepted.
- Only one staged STAT-012 state can exist.
- Stage, schedule, and reset refuse to race a running affected rule.
- The harness uses the already-running Mongo container or local Mongo; it never
  starts infrastructure.
- Always reset after the screenshots and oracles have been captured.

See [PROMPT.md](PROMPT.md) for the source requirements translated into English
and a reusable operator prompt.

The Statistics tests already completed in this QA session are preserved as
retrospective, non-rerun workflows under
[`completed-runs`](completed-runs/README.md).

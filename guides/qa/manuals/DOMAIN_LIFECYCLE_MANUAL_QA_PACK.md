# Domain lifecycle manual QA pack

Status: execution in progress  
Last updated: 2026-08-04  
Master ledger: [`ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx`](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx)
Executable manual helper:
[`manual-qa-checkpoints.sh`](../../../server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh)

With the already-running development stack, agents use the canonical
[`manual-qa-checkpoints-docker.sh`](../../../server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh)
entry point with Docker-socket access granted on the first invocation. It only
selects the existing `mongodb` container; a socket-access error must never
trigger a new MongoDB, server, watcher or Compose process.

For `EVENT-LIFE-*`, `EVENT-FEEDBACK-*`, `EVENT-IMPRESSION-*` and
`EVENT-TICKET-*`, run `stage`, `next`, `status` and `reset` with the
`event-domain` scenario and the exact checkpoint ID. Scheduler-producing cases
use their named scheduler helpers instead of an invented event-domain timer.

For focused Java regressions while the local dev stack owns the shared Gradle
cache, stop only the existing `myscoutee` Java container, run the selected
tests sequentially with `server/.gradle`, then restart that same container and
wait for its health status to become `healthy`. Keep MongoDB and the frontend
running. Do not start a parallel stack or create a second Gradle cache.

## Purpose

This pack maps user-created domain state to every downstream projection that
may consume it. It prevents an Event Editor, invitation, tournament, asset, or
operator configuration test from passing only because its form saved while a
dependent worker or user-facing projection remained broken.

The cases are deliberately split into independently passable checkpoints. A
continuous manual campaign may carry one created event into later cases, but
every consuming case must also have a manual-only fixture capable of staging
the same prerequisite without depending on an earlier human action.

## Causal domain map

| Producer | Persisted output | Direct UI projection | Automatic consumers | Required follow-up cases |
| --- | --- | --- | --- | --- |
| Event Editor draft save | Canonical draft event, `event.synced` telemetry, event recompute task | Hosting/Draft event card and reopened editor | Statistics worker, Monitoring projection, affinity recompute worker | `EVENT-EDITOR-001`, `GRAPH-006` |
| Event publish | Active/published event, accepted-member main chat and refreshed event counters | Hosting and Explore according to visibility; Chat only for accepted members | Statistics/Monitoring; direct chat materialization; slot/reminder consumers when configured | `EVENT-EDITOR-002`, `EVENT-PUBLISH-CHAT-001` |
| Event lifecycle mutation | Draft, active or trashed canonical state plus `statusBeforeSuppression` where applicable | Hosting, Drafts, Explore and Trash buckets | Event affinity recompute; lifecycle notification, reminders and attachments where applicable | `EVENT-LIFE-001` through `EVENT-LIFE-005` |
| Event save with Auto inviter enabled | Active event, capacity, eligible audience and auto-inviter flag | Event detail and member management | Real `event-auto-inviter` scheduler, notification outbox | `EVENT-EDITOR-003`, `JOB-AUTO`, `EVENT-INV-002` |
| Event save with Tournament mode/stages | Tournament definition, sub-event/stage definitions and runtime counts | Event editor, stage list and tournament group UI | Random grouping/start action, tournament review scheduler, reminders and notifications | `EVENT-EDITOR-004`, `TOURNAMENT-001` through `TOURNAMENT-003`, `JOB-TOURNAMENT` |
| Event save with recurring slots | Parent schedule, slot templates and sub-event definitions | Upcoming/Past Sub-event list with occurrence sections | Slot-scoped resources, members, tournament runtime and leaderboard | `EVENT-SLOT-001` through `EVENT-SLOT-004` |
| Manual or scheduled event invite | Pending event membership with `requestKind=invite`, notification intent and bell | Event Members pending row and recipient Invitations row | Notification outbox; acceptance/rejection flow | `EVENT-INV-001` through `EVENT-INV-006` |
| Invitation acceptance | Accepted membership or pending admin approval, resolved invitation notification | Event Members, Activities and invitation detail | Tickets/counters, chat eligibility, visibility-scoped acceptance notification, Statistics/Monitoring and optional outbox | `EVENT-INV-003`, `EVENT-INV-004`, `EVENT-INV-006`, `CHAT-AUTH-001` |
| Tournament grouping | Parent/stage/group membership and group runtime state | Tournament groups and member panels | Group chat/materialization and later tournament review | `TOURNAMENT-002`, `TOURNAMENT-003` |
| Asset member invite | Pending asset-scoped membership | Asset Members pending row and recipient invitation state | Asset acceptance/rejection and optional notifications | `ASSET-MEMBER-001`, `ASSET-MEMBER-002` |
| Event resource assignment | Event/sub-event/asset-owner assignment record | Event Resources and assigned asset UI | Availability/capacity projection and borrower notifications | `ASSET-ASSIGN-001` |
| Feedback eligibility boundary | Accepted non-admin membership on a non-trashed event at least two hours after its start | Pending Event Feedback item and feedback cards | None; this is a read-only eligibility projection | `EVENT-FEEDBACK-001` |
| Event feedback submit | Feedback state, per-card answers and `event.feedback.submitted` telemetry | Submitted feedback, organizer received-feedback view and recipient bell | One user recompute per changed target; first-submission notification outbox; activity counters | `EVENT-FEEDBACK-002` |
| Impression read and menu counter acknowledgement | Profile data merged with event-feedback trait evidence; stored feedback bucket count | Host and Attendee sections in the Impressions popup; Feedback tile acknowledgement and poll reconciliation | None on open; normal user-realtime polling may deliver a later snapshot | `EVENT-IMPRESSION-001`, `EVENT-IMPRESSION-002` |
| Feedback note or pending Ignore/Restore | Feedback state mutation only | Organizer note or pending feedback list bucket | Counter refresh only; no affinity recompute or notification outbox | `EVENT-FEEDBACK-005`, `EVENT-FEEDBACK-006` |
| Ticketing enablement and accepted participation | Ticket-enabled event overlay and one physical holder credential | Event checkout/ticket card and scanner | Event publish/approval owns ticket creation; list/open and check-in are direct request paths | `EVENT-TICKET-001` through `EVENT-TICKET-006` |
| Firebase configuration test and activation | Verified active deployment capability and public client configuration | Operator configuration state and entry authentication mode | Firebase authentication, notification delivery and session routing | `OPERATOR-FIREBASE-001` |

## Checkpoint graph

This pack is not a Cartesian or pairwise combination matrix. Each case is one
observable state transition with a before state, one action, an immediate
result, an explicit worker expectation and a final independent oracle. A
campaign may reuse the same event, but the result of one case is never accepted
as proof for another case.

The principal checkpoint chains are:

- `EVENT-EDITOR-001` -> `EVENT-EDITOR-002` -> `EVENT-PUBLISH-CHAT-001` -> `EVENT-LIFE-001` ->
  `EVENT-LIFE-002` -> `EVENT-LIFE-003`: draft, publish, unpublish, trash and
  restore.
- `EVENT-INV-001` -> `EVENT-INV-002` -> `EVENT-INV-003` ->
  `CHAT-AUTH-001`: pending invitation, privacy boundary, acceptance and chat.
- `EVENT-FEEDBACK-001` -> `EVENT-FEEDBACK-002` ->
  `EVENT-IMPRESSION-001`: feedback unlock, persisted feedback and target-user
  impression refresh.
- `EVENT-FEEDBACK-006` is the isolated pending remove/restore branch. Run it
  from the same zero-response baseline, prove both transitions, reset it
  through the checkpoint harness, then restage `EVENT-FEEDBACK-002`.
- `EVENT-TICKET-001` -> `EVENT-TICKET-002` -> `EVENT-TICKET-003` ->
  `EVENT-TICKET-004` -> `EVENT-TICKET-005` -> `EVENT-TICKET-006` ->
  `EVENT-TICKET-007`:
  ticket enablement, physical credential, check-in, A/D audit lifecycle,
  join approval, Past bucketing and two-step invitation acceptance.
- `EVENT-EDITOR-004` -> `TOURNAMENT-001` -> `TOURNAMENT-002` ->
  `TOURNAMENT-003`: tournament definition, grouping and advancement.
- `EVENT-SLOT-001` -> `EVENT-SLOT-002`: one saved recurring template becomes
  multiple future slot sections with role/time-gated actions.
- `EVENT-SLOT-003` -> `EVENT-SLOT-004`: one generated past occurrence owns its
  own close state, groups and leaderboard evidence.
- `ASSET-MEMBER-001` -> `ASSET-MEMBER-002` and `ASSET-ASSIGN-001`: asset
  invitation and event/sub-event assignment are separate branches.

Every checkpoint record must contain these fields:

| Field | Required evidence |
| --- | --- |
| Before | Exact source bucket, domain record and visible counter before the action |
| Action | One named user action or one real scheduler execution |
| Immediate | Synchronous persistence and UI result |
| Worker expectation | `MUST RUN`, `MUST NOT RUN`, or `CONDITIONAL`, naming the exact worker/outbox |
| Delayed | The one later Statistics, Monitoring, graph, bell or realtime projection that consumes the mutation |
| Unchanged | Explicit `X` surfaces and counts |
| Oracle | Independent API/database result with the same event, user, membership or asset identity |

### Worker expectation checkpoints

| Checkpoint | Expected background behavior |
| --- | --- |
| Event save, publish, unpublish, organizer trash or organizer restore | `MUST RUN`: one deduplicated event affinity recompute signal. Lifecycle notifications, reminders and attachment changes are conditional on the action. |
| Auto-inviter and tournament review | `MUST RUN`: the named real scheduler after its persisted timing is staged. |
| Event list open, editor reopen, popup open, refresh or unchanged read | `MUST NOT RUN`: no domain write, recompute, outbox or job-history delta. |
| First event-feedback submit | `MUST RUN`: one user recompute for each changed feedback target; one notification intent for eligible non-self targets; feedback counters refresh. |
| Re-submit already submitted feedback | `CONDITIONAL`: changed targets may be recomputed, but no duplicate first-submission bell/outbox item and no duplicate submitted counter. |
| Feedback organizer note, feedback remove or feedback restore | `MUST NOT RUN`: no affinity recompute and no notification outbox; only the documented feedback counter/state refresh is allowed. |
| Impressions popup open or realtime refresh | `MUST NOT RUN`: read-only. The normal realtime poll may retrieve new data but opening the popup must not create a task. |
| Ticket credential display/issue and check-in | `MUST NOT RUN`: direct request-path persistence only; no scheduler is required. |

## Event Editor producer cases

### `EVENT-EDITOR-001` — create, save, reopen

- Start from a staged empty event identity and an isolated host session.
- Create a casual event manually, save it once, close it, then reopen it from
  Hosting/Drafts.
- Require exact persistence of title, time, location, capacity, visibility,
  topics and every enabled editor section.
- Treat the free-text venue label and proximity coordinates as separate inputs.
  Without a venue geocoding provider, the event must retain the entered venue
  label while `locationCoordinates` must exactly equal the organizer's current
  user coordinates at the time of the save. A remote venue label is therefore
  not evidence of a coordinate defect.
- For the reproducible `EVENT-EDITOR-001` run, use capacity `2-8`, venue label
  `Austin, TX`, description `Manual QA draft persistence checkpoint.`,
  Invitation only, Open Event, topics Music and Outdoors, Auto inviter Off,
  Ticketing Off, Auto approve On, Sub Events Off, Slots Off, Pricing Off,
  Event Policies Off and a one-time local `18:00-20:00` range.
- Require exactly one canonical event write, one `event.synced` telemetry
  occurrence and one deduplicated event recompute task.
- Verify the event is not yet treated as published and is not eligible for an
  active-only scheduler.

Execution evidence on 2026-08-04:

- PASS: one canonical Casey draft was created and exactly one recompute task
  followed the Save; close, reopen and unrelated-user refresh added no task or
  notification-outbox entry.
- PASS: Nova saw no matching item in All, Active Events or Invitations.
- PASS: the saved venue label remained `Austin, TX`, while the event
  `locationCoordinates` exactly matched Casey's current user coordinates
  (`47.4939392`, `19.0676992`).
- RESOLVED `EVENT-TIMEZONE-001`: the initial local `18:00-20:00` was stored as
  `18:00Z-20:00Z` and reopened as `20:00-22:00` in Europe/Bratislava. After the
  frontend persistence-boundary fix, the focused 12-test run passed and the
  manual retest stored `16:00Z-18:00Z`; both the event card and reopened editor
  showed `18:00-20:00`. The HTTP and IndexedDB paths now share this behavior.

### `EVENT-EDITOR-002` — publish and visibility

- Publish the saved event through the visible UI.
- Verify Hosting and Explore visibility with a host, an unrelated user and the
  configured visibility boundary.
- Verify the saved/published state survives close/reopen and refresh.
- Verify Statistics and Monitoring receive only the documented delayed deltas;
  an unchanged unrelated surface is an `X` pass.

Execution evidence on 2026-08-04:

- PASS: Casey published the retained `EVENT-EDITOR-001` draft once. The same
  `h1785836388222` identity changed from draft to active, remained once in My
  Events, left Drafts and retained the local `18:00-20:00` display.
- PASS: the canonical event kept its `16:00Z-18:00Z` range and organizer
  coordinates. The one deduplicated event recompute task was refreshed to the
  publish timestamp; notification outbox remained unchanged.
- PASS: Nova received neither an invitation nor an Events counter, and the
  event was absent from Event Explore between its July 2026 and February 2027
  visible date groups.
- The first helper read incorrectly reported zero recomputes because its task
  selector knew only fixture IDs. The manual helper now includes the real
  hand-created event identity in task and outbox selectors; the corrected
  oracle reported exactly one. This was a QA-harness defect, not a product
  publish defect.

### `EVENT-PUBLISH-CHAT-001` — publish materializes the accepted Admin chat

- This checkpoint tests the Publish transition itself. It does not use an
  invitation acceptance, scheduler, worker endpoint or fixture-created chat.
- Stage the dedicated `Manual QA EVENT-PUBLISH-CHAT-001` checkpoint. It starts
  exactly once in the Admin's Drafts bucket with Casey as the only accepted
  Admin, Nova and Riley pending, and no event-chat document.
- Use three isolated authenticated sessions: Casey Bridge as the accepted
  Admin, and Nova Social plus Riley Outside as pending recipients.
- First verify that none of the three Chat > All lists contains the controlled
  event and record Casey's top-level Chats badge. Close only Casey's chat
  popup, then publish once from the Draft card.
- Reopen Casey's Chat > All list. Leave Nova and Riley's already-open chat
  lists unchanged for at most one 30-second SmartList interval.
- Require exactly one main-event chat for Casey. Nova and Riley must remain
  denied because pending membership is not chat authorization.
- Casey's top-level Chats badge and Chat > All/Event attention counters must
  remain unchanged immediately after Publish and after reload. The list gains
  exactly one new channel, but that channel is empty with unread `0`:
  Publish creates neither an automatic chat system message nor a Casey
  notification. Nova and Riley's chat counters must not change.
- Require the active event projection to show accepted occupancy `1 / 8` and
  pending badge `(2)`. Publish must not create an invitation-accepted
  notification.
- For already pending owner/admin invitations, the first Publish creates an
  `event-invite` occurrence for each pending recipient rather than a generic
  published notification. Unpublish is an event-context `under-review`
  lifecycle update with warning/amber presentation and Republish is an
  event-context `modified`/available-again update with information/blue
  presentation. Neither may surface under the Scheduled category. The actor
  receives no self-notification.
- Repeat Publish only through a new explicit unpublish/publish lifecycle run.
  The same event must still resolve to one main chat; duplicate chat documents
  are a failure.

Execution state on 2026-08-04:

- HISTORICAL FAIL: the retained event published with Casey materialized as its
  accepted Admin, but Casey's Chat list stayed empty. Nova and Riley correctly
  had no chat while pending. This was a backend lifecycle omission, not a UI
  fallback problem.
- BACKEND FIX: Publish now resolves the canonical accepted
  membership snapshot and idempotently materializes the main event chat before
  downstream invitation work. Missing accepted membership fails the publish
  transaction instead of synthesizing chat authorization from event fields;
  the mutation persists only `Users.activities` counts and returns non-zero
  operation-owned unit bucket directions (`-1`/`+1`) for immediate frontend
  cache convergence. It never derives those directions from a global
  `Users.activities` before/after diff; the periodic poll reconciles concurrent
  external changes.
- BUILD/LOCAL REGRESSION PASS: the running frontend and backend hot-deploy
  builds are green, and the two focused local frontend suites passed 12/12.
  A new backend unit run was deliberately stopped when laptop memory pressure
  became visible; no second server or watcher was left running.
- CLEAN MANUAL RETEST READY: a new isolated Draft is staged under
  `manual-qa-checkpoint:v1:event-domain:event`. Its machine baseline has zero
  event chats and zero action deltas. The next action is exactly one Casey
  Draft-card Publish with Nova and Riley as negative controls.

### `EVENT-EDITOR-003` — save feeds the real auto-inviter

- Unpublish the retained event through the organizer action and verify it
  returns to one editable Draft entry before changing its definition.
- Enable Auto inviter and Save while the event is still a draft. Capture the
  post-save event/member baseline before publishing or shortening the
  persisted scheduler window; no invitation may exist at this checkpoint.
- Treat republish-time initial auto-inviting and a later periodic
  `event-auto-inviter` run as separate checkpoints. A publish-created
  invitation is not evidence that the periodic scheduler ran.
- Execute republish as the `CARD-PUBLISH` variation: use Publish once from the
  Draft card overflow menu without reopening Event Editor. This additionally
  checks command availability, removal from Drafts, insertion/retention in My
  Events and a consistent member/capacity badge while retaining the same event
  identity.
- Prove that Save persisted every eligibility input and that any later
  scheduler-attributed invitation was created by the named real scheduler,
  not the fixture or the publish-time initial batch.
- Continue with `EVENT-INV-002` or stage its equivalent prerequisite
  independently.

Execution evidence on 2026-08-04:

- PASS: the retained event was reopened as one draft, Auto Inviter was enabled
  and Save was pressed once. MongoDB reported status `DR`, `autoInviter=true`,
  no member, no invitation/outbox record and the same time and coordinates.
- PASS: the held scheduler remained idle. Candidate preparation then isolated
  exactly one publish-time candidate, Nova Social, without creating an
  invitation artifact. Riley Outside is reserved as the distinct later
  periodic candidate.
- PASS: Casey, Nova and Riley have isolated browser sessions. The controlled
  event was absent from Nova and Riley Invitations and Notifications before
  Publish; the matching MongoDB baseline contained no member, invitation,
  marker or notification outbox artifact. Recipient activity counters were
  captured for reversible reset.
- PASS — `CARD-PUBLISH`: Casey published once from the Draft card overflow menu
  without reopening Event Editor. The same identity left Drafts, remained once
  in My Events and synchronously created exactly one pending Nova invitation,
  one matching notification and one outbox item. Riley remained unchanged and
  the persisted periodic scheduler was still idle, so the initial batch and
  later scheduler run remain independently attributable.
- FIXED BACKEND DEFECT: the first card publish found that an event with no
  existing member rows omitted its creator from the auto-inviter graph anchors,
  producing no candidate plan. The scheduler now always anchors the creator;
  the focused `generatePriorityPlansUsesCreatorAsAnchorWhenEventHasNoMembers`
  regression passed against the normal Gradle cache after briefly stopping and
  restarting only the existing backend container.
- MANUAL UI DEFECT REPRODUCED: Nova's open Notifications list converged, while
  the already-open Events > Invitations list stayed empty until the popup was
  reopened. The invitation itself was authoritative and appeared as `1 / 8`
  after reopen. This is tracked separately by
  `EVENT-ACTIVITY-REFRESH-001`; it is not an Auto Inviter functional failure.
- PASS — real periodic scheduler: the persisted rule became eligible at
  14:38:20 local time and the already-running scheduler claimed it on its next
  60-second check at 14:39:13. It completed in 140 ms with `processedCount=1`;
  no Run action, direct worker endpoint or fixture-created invitation was used.
  The exact post-run oracle contained Nova and Riley as the two pending event
  members and notification/outbox recipients, while the scheduler marker
  attributed only Riley to this periodic batch.
- Reproduction continuation: run
  `prepare-periodic-auto-inviter event-domain EVENT-EDITOR-003`, keep Casey's
  Events > My Events and Riley's Events > Invitations lists open in separate
  authenticated sessions, then run
  `schedule-auto-inviter event-domain EVENT-EDITOR-003 30`. The first command
  adds only Riley's reversible eligibility edge; the second changes only the
  persisted due time and does not invoke the worker. After the real scheduler
  and at most one SmartList interval, use `status event-domain
  EVENT-EDITOR-003` to compare member, marker, outbox and notification
  recipients.
- PASS — open-list convergence: the 14:39:22 screenshot captured a valid
  transient post-worker/pre-poll split across the three isolated sessions:
  some projections already showed `1 / 8 (2)`, while another still showed
  `1 / 8 (1)` and Riley's Invitations list was not yet populated. By 14:39:52,
  without closing or refreshing a popup, the Nova, Riley and Casey event
  projections all converged to `1 / 8 (2)`. Accepted occupancy correctly
  remained `1 / 8`; the red `(2)` is the pending-invitation count and pending
  invitations do not increment the accepted/capacity projection. The one-hour
  production-like interval remained configured after the run.
- HISTORICAL DEFECT, FIX VERIFIED: immediately after the original Unpublish,
  the locally patched My
  Events card briefly displayed `1 / 8`, while the authoritative member set
  was empty and the freshly queried Drafts card displayed `0 / 8`. Track this
  as `EVENT-CAPACITY-SYNC-001`; it was not an Auto Inviter persistence failure.
  The post-fix retest first converged every open projection to the canonical
  `0 / 8 (2)` legacy-draft baseline, then CARD-PUBLISH converged all three
  sessions to the repaired `1 / 8 (2)` state.
- HISTORICAL FAIL, FIX VERIFIED — creator/admin membership consistency: after
  Nova and Riley were both
  invited, every event card correctly converged to accepted occupancy `1 / 8`
  plus pending badge `(2)`. Event Members nevertheless reported
  `0 members · 2 pending` and listed only Nova and Riley as pending. Casey, the
  event creator whose fallback identity supplies the accepted occupancy, did
  not appear as an accepted Admin. This is tracked as
  `EVENT-MEMBER-CREATOR-001`; do not reinterpret the red `(2)` as accepted
  occupancy.

### `EVENT-ACTIVITY-REFRESH-001` — event bucket live convergence

- Use one mutation already owned by another checkpoint; do not create a second
  worker or fixture mutation merely to refresh the UI.
- Before that mutation, keep the recipient's Events > Invitations list and the
  host's Events > My Events list open in isolated sessions.
- Do not close either popup and do not refresh the browser. Observe one
  configured 30-second SmartList interval.
- Require the recipient invitation row and Invitations counter to appear in the
  open popup. Require the host event card to converge to the same authoritative
  member/capacity projection and pending red counter.
- Open All and every bucket affected by the owning lifecycle mutation. All,
  Active Events, Pending, Invitations, My Events, Drafts and Trash share this
  single refresh contract; there are no bucket-specific polling exceptions.
- Unaffected buckets are `X` controls. The poll is a read-only visible-list
  reconciliation and must not create domain writes, recompute tasks,
  notification outbox items or job-history entries.

Execution evidence on 2026-08-04:

- FAIL before fix: during `EVENT-EDITOR-003` CARD-PUBLISH, Nova's notification
  appeared through the normal realtime/notification path, but the already-open
  Invitations list remained empty until close/reopen.
- The frontend already used SmartList-owned visible-range reconciliation. Its
  polling policy was enabled for Notifications and admin support chat but
  returned `0` for event activity views.
- FIX HOT-DEPLOYED: all open, non-calendar event activity buckets now use one
  30-second SmartList poll. It is paused behind dialogs and event-chat sessions;
  Rates and ordinary Chats were not changed. Compilation passed in the existing
  `frontend-sync` hot-deploy container.
- PASS after fix: Nova Invitations, Riley Invitations and Casey My Events
  stayed open while the real scheduler created Riley's invitation at 14:39:13.
  The 14:39:22 intermediate screenshot intentionally captured mixed
  `1 / 8 (1)` and `1 / 8 (2)` projections before every open list had polled.
  At 14:39:52, without close/reopen or browser refresh, Riley's invitation row
  was visible and all three open projections agreed on `1 / 8 (2)`. The
  accepted occupancy correctly remained `1 / 8`.
- This checkpoint distinguishes accepted occupancy from pending demand: the
  capacity fraction changes only after an acceptance checkpoint, while the red
  pending badge changes when an additional invitation is created. Reuse the
  same no-reopen assertion when sampling All or another affected bucket; do not
  require unrelated historical counters to be zero.

### `EVENT-EDITOR-004` — save feeds tournament/group processing

- Create a tournament event manually with at least two stages and explicit
  group capacities.
- Reopen the editor and verify the definition did not flatten into a casual
  event or lose stage/group configuration.
- Verify runtime group counts and stage rows correspond to the saved
  definition before any automatic grouping occurs.
- Start the visible tournament action or arm only the documented persisted job
  schedule, then continue with `TOURNAMENT-001` through `TOURNAMENT-003`.

### `EVENT-EDITOR-005` — edit an active downstream definition

- Change one downstream-relevant field at a time: ticketing, capacity,
  sub-event definition or schedule.
- Verify one saved definition-change notification and one recompute signal,
  while a no-op reopen/save does not duplicate user-visible effects.
- Verify removed definitions are no longer presented as active resources,
  groups or reminders.

## Recurring slot and Sub-event list checkpoints

### `EVENT-SLOT-001` — Editor slot definition to occurrence sections

- Start with the staged draft and configure a Weekly parent schedule spanning
  at least four weeks, one enabled slot template and two named sub-events.
- Save once, then open the Sub-event list in Upcoming order.
- Verify the list materializes multiple dated occurrence sections rather than
  copying the parent event as unrelated records. Every section must retain the
  same parent and template while exposing its own slot source identity and
  occurrence timeframe.
- Every occurrence must contain the two definitions once and in the saved
  order. Reopen, paging, calendar navigation and Upcoming/Past switching are
  read-only.

### `EVENT-SLOT-002` — future occurrence operation gating

- Inspect the controlled future occurrences as host and participant.
- Verify members, transport, accommodation and supplies actions follow the
  saved definition and actor permission. Structure editing is host-only.
- A future tournament stage must not expose Close or Finalize before its time
  and status prerequisites. A casual sub-event must not expose tournament
  actions at all.
- Opening any runtime menu is an `X` write checkpoint: no task, outbox or
  stage-runtime mutation is allowed.

### `EVENT-SLOT-003` — close one past generated stage

- Use the helper's exact `recentPastSlotId`, select Past order and locate its
  Qualifier stage.
- The ended RS/A stage exposes Close Stage; future and unrelated occurrence
  sections do not.
- Close once and verify only the slot-scoped runtime row changes to SR with
  reason `stage-closed`. The parent definition and sibling occurrence runtime
  remain unchanged.
- The direct mutation may enqueue normal event recompute, but it is not proof
  that `event-tournament-review` ran.

### `EVENT-SLOT-004` — slot-scoped leaderboard

- Open the Groups/leaderboard path for the exact staged past slot and
  Qualifier stage. Verify its group contains the two staged users once.
- Change one score, save once, close and reopen. Match the persisted score by
  slot ID, stage ID, group ID and member ID.
- Verify the same definition in another weekly occurrence does not inherit the
  score or runtime state. Leaderboard reads are `X`; score save enqueues only
  its documented tournament-input recompute.
- Finalize/advance belongs to `TOURNAMENT-003`, so this checkpoint stops at the
  leaderboard boundary instead of combining the whole tournament lifecycle.

## Event lifecycle and bucket checkpoints

### `EVENT-LIFE-001` — unpublish returns an active event to draft

- Capture the event once in Hosting and Explore, then unpublish it through the
  visible organizer action.
- Verify the canonical status becomes draft, the event remains in the
  organizer's Drafts/Hosting projection and disappears from unrelated-user
  Explore.
- Require one event recompute signal. Verify lifecycle notification/reminder
  and attachment changes against their own records.
- Reopening or refreshing the draft is read-only and must not create another
  recompute, notification or job-history entry.

Execution evidence on 2026-08-04:

- PASS: Casey chose Unpublish once for the retained
  `h1785836388222` event. The card remained once in My Events, Drafts changed
  to `1`, and the saved time remained `18:00-20:00`.
- PASS: the independent database oracle reported canonical status `DR`, no
  members, no invitation/outbox record, unchanged organizer coordinates and
  the same `16:00Z-18:00Z` persisted range.
- PASS: the held `event-auto-inviter` rule remained idle and ineligible during
  the checkpoint. The event had already been proven absent from Nova's
  invitation-only Explore boundary immediately before unpublish.

### `EVENT-LIFE-002` — organizer trash moves the event to Trash only

- Trash one controlled organizer event from a known draft or active bucket.
- Verify the saved status is trashed, `statusBeforeSuppression` preserves the
  source status and `trashedAtIso` is set once.
- Verify it is absent from Hosting, Drafts and Explore and present exactly once
  in the organizer Trash bucket. Other users must not retain an active card or
  accepted-only entry path.
- Require one event recompute signal. Any auto-inviter eligibility, reminder,
  active attachment or ticket presentation must become unavailable.

### `EVENT-LIFE-003` — organizer restore returns to the preserved bucket

- Restore the same controlled event once from Trash.
- Verify `statusBeforeSuppression` and `trashedAtIso` are cleared and the event
  returns to its preserved draft or active status, not an arbitrary default.
- Verify the matching organizer bucket and Explore visibility are restored
  according to that status and visibility. No duplicate event, member,
  attachment or ticket credential may be created.
- Require one event recompute signal. Refreshing after the completed restore is
  a read-only `X` checkpoint.

### `EVENT-LIFE-004` — participant leave/restore is not organizer trash

- From an accepted participant session, leave one event without organizer
  authority.
- Verify only that viewer's participation tree becomes suppressed and the
  event remains active for the organizer and other participants. The canonical
  event must not enter the global Trash bucket.
- Restore the viewer participation through its documented UI and verify the
  membership state and personal Attending/Trash projections without changing
  the organizer lifecycle.
- Record the member mutation and its conditional recompute/counter effects
  separately from organizer lifecycle effects.

### `EVENT-LIFE-005` — bucket reads and no-op navigation

- Open Hosting, Drafts, Attending, Invitations and Trash for the staged users,
  then close/reopen and refresh each view without changing a domain object.
- Verify each event identity occurs only in its documented bucket and that no
  read action changes status, membership, counters, recompute tasks, outbox or
  job history.
- A duplicate card, a card in mutually exclusive lifecycle buckets, or a
  write caused by navigation is a failed checkpoint.

## Event invitation and membership cases

### `EVENT-MEMBER-CREATOR-001` — creator/admin canonical membership

- Create and publish an event whose creator has no pre-existing event member
  document, then create at least one pending invitation.
- Compare the host and recipient event-card capacity fraction with Event
  Members and the exact membership oracle before any recipient accepts.
- The creator must appear exactly once as an accepted Admin. Event Members
  must report `1 member · N pending`, while every event card reports accepted
  occupancy `1 / capacity` and pending badge `(N)`.
- A creator identity synthesized by a Java DTO or projection mapper is not
  sufficient. The UI must render canonical backend membership counts and must
  not invent creator occupancy. A missing creator row is a failed
  canonical-membership invariant because role, authorization, chat and
  downstream graph projections read the actual membership collection.

Execution evidence on 2026-08-04:

- HISTORICAL FAIL: the three isolated event cards converged to `1 / 8 (2)`, but Event
  Members reported `0 members · 2 pending` and displayed only Nova Social and
  Riley Outside as pending. Casey Bridge was absent.
- The read-only oracle agreed with Event Members: no accepted creator/admin
  membership document existed. The Java event mapper and materialized event
  projection synthesized Casey as accepted/admin; the frontend card only
  rendered that backend value. This is a Java source-of-truth defect rather
  than a frontend fallback, stale UI or Members filter.
- Java fix implemented on 2026-08-04: event create/save and publish now
  idempotently create or repair one `accepted + Admin` creator membership,
  preserve unrelated pending invitations, refresh the embedded event
  projection from that membership, and never synthesize creator membership in
  read mappers.
- Added focused regressions for materialization/idempotence, create/publish
  invocation, no-fallback DTO mapping and preservation of stored admin order.
  The production classes were hot-compiled by the existing dev stack. After
  stopping only its Java container, the focused profile test selection passed
  `99 / 99` against the existing `server/.gradle` cache; the same container
  was restarted and reached `running / healthy`.
- PASS — manual retest: after hot deploy, Unpublish produced the canonical
  legacy-draft baseline `0 / 8 (2)` and removed the active invitation cards.
  CARD-PUBLISH then repaired the same event identity and all three already
  open sessions converged to `1 / 8 (2)`. Event Members reported
  `1 member · 2 pending` and displayed Casey Bridge exactly once as Admin,
  with Nova Social and Riley Outside unchanged as pending invitations.
- PASS — independent oracle: the active event stored `acceptedMembers=1`,
  `pendingMembers=2`, Casey in both `acceptedMemberUserIds` and `admins`, and
  exactly three membership documents: Casey `accepted + Admin`, Nova pending
  invite and Riley pending invite. No fixture or direct database mutation was
  used during the repair or retest.

### `EVENT-INV-001` — manual invite and pending projections

- From an owner/admin session, open Event Members, select one controlled user
  and save the invitation once.
- The Event Members UI must show that exact user once as pending invitation,
  with the correct inviter and event.
- The recipient's Invitations activity must show the same event once.
- The membership oracle must be event-scoped, pending and `requestKind=invite`;
  it must not be confused with an asset invitation or a member-origin join
  request.

### `EVENT-INV-002` — pre-acceptance privacy boundary

- Open the recipient session while the invitation remains pending.
- The event may be viewed only through the invitation affordance allowed by
  policy. Accepted-member-only controls, main/group chat membership and
  participant resources must remain unavailable.
- A direct chat request or stale deep link must be rejected, not merely hidden
  by the menu.

Execution evidence on 2026-08-04:

- PARTIAL UI PASS: Riley could open the invitation card and the event's
  read-only view. The editor fields were disabled, and no event chat or
  participant-resource action was visible. Invitation-specific View, Accept
  and Reject actions were present.
- OPEN AUTHORIZATION CHECK: the event uses Open Event member preview, so the
  Members affordance is expected to be visible. The demo session bypasses the
  production authenticated access-policy gate; therefore this UI pass cannot
  prove the required direct/deep-link server denial. Repeat that half in a
  Firebase-enabled, non-demo operator configuration.
- The Members screenshot also exposed `EVENT-MEMBER-CREATOR-001`; that separate
  canonical-membership failure does not decide this privacy checkpoint.

### `EVENT-INV-003` — owner/admin invitation acceptance

- Accept an owner/admin invitation once through the recipient UI.
- The invitation must become resolved: the accepted recipient's original
  `event-invite` notification receives `readAtIso` and its unread notification
  counter decreases exactly once. Separately, the Invitations membership
  bucket changes `1 → 0`, the event membership becomes accepted with invitation
  fields cleared, and Event Members updates from pending to accepted without a
  duplicate row.
- Accepted-only chat access may appear only after that terminal membership
  state. Send one unique message to prove read/write access and exact-once
  Statistics/Monitoring chat projection.
- Keep three isolated sessions open for the accepted recipient, a still-pending
  control recipient and the event Admin. Both accepted roles must see the same
  event chat; the pending control must not see or directly read it.
- The chat member/avatar stack contains only terminal accepted chat members;
  the pending control must not appear there and must not create a hidden-avatar
  `+1`. In the Sub-events popup, the event-level `Members` action must show the
  pending control as a red `1`, sourced from the same current member signal
  rather than a stale event record.
- In the Admin session, verify exactly one acceptance notification that names
  the accepted recipient and the event. It must be distinct from the original
  invitation notification and from unrelated lifecycle notifications.
- Verify the accepted recipient does not receive their own acceptance
  notification. Every other participant who may see the event member list
  receives one: this includes a still-pending invitee for an Open Event, while
  a hidden ordinary accepted or pending member of a Blind Event receives none.
  The acceptance creates exactly one `member-joined` system row in the shared
  chat, but that system row must not create a `chat-message` notification for
  any participant. Only an actual participant-sent chat message may do that.
- For the focused positive-branch retest after a previously consumed
  acceptance, first continue the retained manual event into this checkpoint and
  re-arm only the controlled transition:

  ```bash
  bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh \
    advance event-domain EVENT-EDITOR-003 EVENT-INV-003
  bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh \
    prepare-invitation-acceptance-retest event-domain EVENT-INV-003
  ```

  The preparation command is intentionally guarded. It accepts only the exact
  Casey-accepted, Riley-accepted, Nova-pending state, retains the original
  chain snapshot for Reset, and restores Riley to pending without invoking a
  worker. It prints the three identities and the read-only baseline before any
  UI action.

Execution evidence on 2026-08-04:

- PASS — Riley accepted the controlled invitation once through the recipient
  UI. The already-open Riley Active Events, Nova Invitations and Casey My
  Events projections converged without browser refresh from accepted occupancy
  `1 / 8` with two pending invitations to `2 / 8` with one pending invitation.
- PASS — Event Members reported `2 members · 1 pending`: Casey remained the
  single accepted Admin, Riley appeared once as an accepted Member, and Nova
  remained the single pending Member. No duplicate membership row appeared.
- PASS — the independent read-only oracle stored Casey and Riley in
  `acceptedMemberUserIds`, Nova alone in `pendingMemberUserIds`, cleared
  Riley's invitation fields, and retained Nova's pending admin invitation.
- PASS — Nova, the still-pending control, had no event-chat channel in her open
  Chats list after Riley accepted.
- PASS — Casey and Riley received owner copies of the same `mainEvent` channel,
  with the same two accepted member IDs; Nova received none.
- PASS — Casey received exactly one `event-invitation-accepted` notification
  naming Riley and the controlled event, while Riley's original `event-invite`
  notification was stored with `readAtIso`.
- PASS — the retained retest produced exactly one `member-joined` system row
  and zero system-derived `chat-message` outbox or Notification Center items.
- PASS — the Open-event acceptance notification was delivered exactly once to
  Casey and still-pending Nova, while actor Riley received none. Riley's
  original invite was resolved with `readAtIso`.
- PASS — the chat avatar stack contained Casey and Riley only, without a
  pending `+1`. The Sub-events `Members` action displayed Nova as the single
  pending badge from the current members signal.
- CLOSED — the manual UI evidence and independent database oracle agree on the
  membership, chat, notification and pending-control projections.

### `EVENT-INV-004` — ordinary-member invitation approval chain

- Have an ordinary accepted member invite the recipient.
- Admin approval must leave the recipient pending until the recipient responds;
  chat and other accepted-only projections remain unavailable.
- The recipient then accepts once. Only this terminal transition may create
  the accepted projection and chat access.

### `EVENT-INV-005` — reject, cancel, capacity and idempotence

- Cover recipient rejection, inviter cancellation before response, a seat
  reserved by an existing invitation, a full event and repeated accept/save.
- No branch may create duplicate memberships, overbook capacity, leave a live
  invitation bell after resolution or grant chat access after reject/cancel.

### `EVENT-INV-006` — acceptance notification visibility boundary

- Stage the checkpoint independently. It creates two otherwise equivalent
  active events: one `Open Event` and one `Blind Event`. Casey is Admin, while
  Nova and Riley both start as pending admin invitees on both events.
- Keep isolated Casey, Nova and Riley sessions open. Riley accepts the Open
  invitation once and then the Blind invitation once.
- Open Event expected notifications: Casey and Nova each receive exactly one
  `event-invitation-accepted` item naming Riley and the Open event. Riley
  receives none because Riley performed the action.
- Blind Event expected notifications: Casey receives exactly one item. Nova
  receives none because an ordinary pending member cannot see the Blind event's
  member list; Riley again receives none as actor.
- Both event chats contain exactly one `member-joined` system row for Riley.
  Those rows create zero `chat-message` Notification Center items. This is
  independent from the acceptance event notifications above.
- Run the case and read-only oracle with:

  ```bash
  bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh \
    stage event-domain EVENT-INV-006
  bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints.sh \
    status event-domain EVENT-INV-006
  ```

  The oracle prints `blindMode` on each event and `eventId` on every acceptance
  outbox/notification row so the Open and Blind results cannot be conflated.

## Chat authorization case

### `CHAT-AUTH-001` — invitation-to-chat causal boundary

- Use the same event and recipient as `EVENT-INV-002`/`EVENT-INV-003`, or stage
  an equivalent pending invitation independently.
- Keep three isolated sessions open: event Admin, terminal accepted member and
  still-pending control member.
- At the staged baseline, require the same event-bucket counters in both the
  profile menu and the Activities dropdown: Casey has `My Events = 1`, Riley
  has `Active Events = 1`, and Nova has `Invitations = 1`. Any list/counter
  disagreement is a failed prerequisite, not chat-authorization evidence.
- Before terminal acceptance, prove both menu absence and server-side denial
  for the recipient; retain another pending identity as the negative control
  after the selected recipient accepts.
- After terminal acceptance, prove that both the Admin and accepted member see
  the same channel and history. Send one unique message from the accepted
  member, prove that the Admin receives exactly that message, and prove that
  the pending control neither sees the channel nor receives the message.
- Treat an empty channel list for either accepted role as a functional failure;
  the pending control's empty list does not compensate for a missing Admin or
  accepted-member projection.
- After leave, disqualification or restored pending state, repeat the negative
  check. Treat any readable history outside accepted membership as a P0 privacy
  failure.

## Event feedback and Impressions checkpoints

### `EVENT-FEEDBACK-001` — eligibility unlock and closed-event boundary

- Stage one accepted non-admin participant and one organizer on a non-trashed
  event with controlled start and end times.
- Before end time plus two hours, the participant must not receive a pending
  Event Feedback item. At or after that boundary, the event must appear once
  with cards for the host and eligible fellow attendees.
- Merely loading the list must not enqueue a worker or create feedback state.
- Feedback unlocks at `endAtIso + 2h`; event duration must never shorten this
  post-event delay by calculating the boundary from `startAtIso`.
- A trashed event, an organizer evaluating their own event or a merely pending
  participant must remain ineligible.

### `EVENT-FEEDBACK-002` — submit responses and follow the target projection

- Capture the participant's pending-feedback item, the host's received
  feedback baseline, the host's Impressions popup and the notification view.
- Before submission, the accepted participant's persisted main
  `activities.feedback` counter and `eventFeedback.pending` sub-bucket must
  both be exactly `1`; after a profile reload the red badge belongs to the
  main **Feedback** tile. The similarly styled **Rates** tile is an independent
  counter and is not evidence for feedback eligibility.
- Feedback-ready staging changes the event's time boundary, not its normal
  membership aggregate. Under **Activities -> My Events -> Past**, the Members
  popup must contain Casey Admin plus both accepted participants and the source
  event card must therefore show exactly `3/8`, matching persisted
  `acceptedMembers=3` and `capacityTotal=8`.
- Before any participant submits, the feedback-ready event must already appear
  once in the host's **Own Events** bucket with response count `0`. The host's
  persisted `eventFeedback.ownEvents` and main actionable
  `activities.feedback` counters must both be `0`. The list contains owned
  event cards, but the counter measures active submitted responses, not events.
  The main counter is the stored sum of `pending + ownEvents`.
- Record the zero-response host baseline through these required UI checks:
  1. Reload the host profile/menu. The main **Feedback** tile must have no red
     badge while the exact main and **Own Events** counters are both `0`.
  2. Open **Event Feedback -> Own Events**. The trigger and bucket counter must
     be `0`, and exactly one card for the controlled event must appear with its
     persisted title and image even though nobody has submitted feedback yet.
  3. Open that card with **View Feedbacks**. The detail must retain the event
     identity and show the zero-response empty state, with no response rows or
     trait evidence. The card itself must not be hidden merely because its
     response count is `0`.
  4. Treat all three steps as read-only: reload, list opening and empty-detail
     opening must not create an answer, submit a state, enqueue affinity
     recompute or create a notification/outbox item.
- Before submission, compare the source card under **Activities -> Events**
  with both the feedback-list card and the feedback form. A persisted event
  image must be identical on all three surfaces. If the event image is empty,
  all three surfaces must use their neutral empty-image presentation; a
  runtime-generated stock photo is forbidden. Apply the same assertion to the
  backend HTTP and frontend local/demo paths: neither path may manufacture a
  feedback-only image URL.
- For the backend HTTP run, stage the dedicated `EVENT-FEEDBACK-002` event
  directly with the generated
  `server/docker/scripts/manual-qa-checkpoints/assets/event-feedback-002-cover.png`
  fixture. Upload that file once through the normal HTTP media endpoint, pass
  its returned canonical URL as `MANUAL_QA_EVENT_IMAGE_URL`, and let the
  checkpoint persist that URL on the past event with the controlled accepted
  participant. This is checkpoint setup, not a repeat of the already-closed
  Event Editor save/reopen case. The feedback UI must read the event's
  `imageUrl`; it must not replace it while mapping the list or detail response.
- For the frontend local/demo run, the seed builder may choose and persist a
  demo image while it creates the event. Activities, the feedback list and the
  feedback form must all consume that same persisted event value; feedback
  mapping itself must not generate a replacement.
- On the event card's first feedback page, submit one controlled overall
  answer, improvement answer, one distinctive personality trait and one unique
  optional event opinion of at most 160 characters. The event opinion belongs
  to the structured event answer; it is not the separate organizer note.
- Verify one submitted feedback state and one persisted answer per displayed
  card. The participant item moves from pending to feedbacked and the organizer
  received-feedback/stat view shows the same event and answer evidence.
- Submit distinguishable feedback as the second accepted participant on the
  same event. The host's stored main Feedback and Own Events counters must move
  from `1` to `2`, while the Own Events list still contains exactly one event
  card and that card's response badge becomes `2`. This is the required proof
  that Own Events counts responses rather than event cards.
- Keep the participant feedback list or the organizer's **Own Events** list
  open while the counterpart changes the feedback state. On the normal
  30-second user-realtime snapshot, the existing shared feedback-counter signal
  must refresh the main menu badge, dropdown bucket counts and the currently
  visible SmartList card window together. A card must not remain stale after
  its counters changed, and the feedback popup must not create a second polling
  loop merely to achieve that refresh.
- From the submitted card, open **View my feedback**. It must show the exact
  structured answers and exact event opinion. If a separate organizer note was
  saved, it must appear under its own label rather than being merged with the
  event opinion. The organizer received-feedback view must make the same
  distinction.
- A pasted or typed event opinion longer than 160 characters must not be
  accepted; the backend owns the same limit and must not rely only on the
  browser `maxlength` attribute.
- Require `event.feedback.submitted`, one target-user recompute per changed
  target, refreshed activity counters and exactly one first-submission
  notification for each eligible non-self target.
- Continue to `EVENT-IMPRESSION-001` for the target-user popup. Do not treat the
  notification or recompute task alone as proof that Impressions refreshed.

### `EVENT-FEEDBACK-005` — participant note to organizer is separate feedback metadata

Status: **PASS** on 2026-08-05.

- Add note and Edit note remained available after the structured feedback was
  submitted. The saved value `cyxcyxcxy-t` reopened successfully.
- Nova's **View my feedback** and Casey's received-feedback view both displayed
  the organizer note separately from the structured event answer.
- The persisted answer and exact Casey/Nova counters remained unchanged; no
  affinity recompute, notification or notification-outbox row was created.

- As the participant, use **Add note** on the pending or already-feedbacked
  event card and save one unique note to the organizer through the dedicated
  note mutation. After the main feedback submission, the action must remain
  available as **Add note** or **Edit note**; it must not disappear.
- Reopen **View my feedback** and verify the exact note under its own
  **Note to organizer** label. If the event answer also contains an event
  opinion, both values must remain visible as separate fields.
- As the organizer, open the received-feedback detail and verify the same exact
  note separately from the participant's event opinion.
- Verify exact persistence only in the feedback state. No participant answer,
  Impression trait, affinity task, notification or unrelated event bucket may
  change.

### `EVENT-FEEDBACK-006` — remove and restore a pending item before submission

Status: **PASS** on 2026-08-05.

- Start from the staged zero-response state: the participant has exactly one
  pending, eligible and counter-tracked item; `feedback/pending/feedbacked/removed`
  is exactly `1/1/0/0`, while Casey has `ownEvents=0`.
- Choose **Remove** once. Open the **Removed** bucket and verify the same event
  title and persisted image appear exactly once while **Pending** is empty.
- The exact participant counters become `0/0/0/1`; the state has
  `removed=true` and no `submittedAtIso`. Casey's `ownEvents` remains exactly
  `0`.
- Choose **Restore** once. The Removed bucket becomes empty and the same title
  and persisted image return to Pending exactly once. The state returns to
  `removed=false` and the exact participant counters return to `1/1/0/0`;
  Casey's `ownEvents` remains `0`.
- No structured answer, event opinion, organizer note, affinity recompute,
  notification or notification-outbox row may be created by either transition.
  **Add organizer note** may remain visible in both buckets, but belongs to the
  separate `EVENT-FEEDBACK-005` checkpoint and is not invoked here.
- Finish through the checkpoint harness reset, then restage
  `EVENT-FEEDBACK-002` before continuing the submission checkpoint. The
  canonical transition is one snapshot-protected command:

  ```bash
  bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
    switch event-domain EVENT-FEEDBACK-006 EVENT-FEEDBACK-002
  ```

### `EVENT-IMPRESSION-001` — feedback evidence reaches the target profile

- Open the target user's Impressions popup before `EVENT-FEEDBACK-002` and
  record Host and Attendee trait evidence separately.
- Capture the second accepted participant's Impressions popup as an independent
  control. In the retained run Nova saw an empty Member/organizer side and the
  existing community/participant profile presentation with `0 signals`; this
  second-user baseline must not be mistaken for evidence created on Casey by
  Nova's later host-target feedback.
- After the feedback save, wait only for the ordinary user-realtime delivery
  path and reopen or keep the popup visible. The backend read cache is bounded
  to five seconds; the browser still updates on its normal realtime poll.
- A host-target card must affect the Host section and an attendee-target card
  must affect the Attendee section. The distinctive trait's evidence count,
  percentage or last-rated date must change in the documented direction; the
  unrelated section is `X`.
- Opening, closing or refreshing the popup must never enqueue a worker. If the
  feedback is persisted and recompute finishes but the popup remains stale
  after the documented realtime window and a fresh profile read, retain both
  oracles and report a propagation defect.
- Retained 2026-08-05 evidence is a failure despite the correct target-side
  update. Nova submitted only `creative-soul` toward Casey Host; the debounced
  recompute completed and Casey Host gained Creative Soul at 18% while Casey
  Attendee remained unchanged. Nova's independent control did not remain
  unchanged: its prior community/participant presentation (Social Charmer 56%,
  Adventurous 24%, Empathetic 15%, `0 signals`) was replaced by the whole-popup
  empty state `Még nincs elérhető adat`. The empty state remained through a
  normal realtime poll and one close/reopen, confirming a persistent rather
  than transient control-user regression.
- Root cause was the backend member-presentation gate still reading legacy
  `activities.feedback`: submit changed that aggregate from pending `1` to
  `0`, although the stable lifecycle bucket became
  `activities.eventFeedback.feedbacked=1`. The fix makes `impressions`
  mandatory on every realtime snapshot and uses pending, feedbacked or removed
  event-feedback lifecycle evidence for attendee presentation eligibility.
  The frontend must reject a payload that omits the field; it must not retain a
  stale value to repair an incomplete response.
- Post-fix retest passed on the retained fixture. At 16:15:13 Nova's full reload
  restored the exact Social Charmer 56%, Adventurous 24%, Empathetic 15%
  control with `0 signals`; at 16:16:25 it remained identical after a normal
  realtime poll plus close/reopen. Casey simultaneously retained the intended
  Host-only Creative Soul 18% result. Record this run as PASS-after-fix.

### `EVENT-IMPRESSION-002` — Feedback tile acknowledgement and poll reconciliation

- Start with a non-zero Feedback badge in the Impressions section and retain
  the corresponding server-side activity-counter oracle.
- Open the Feedback tile once, then close or leave the resulting popup open
  through at least one ordinary realtime poll without changing any feedback.
- The tile open may acknowledge the badge in the UI immediately. The next
  authoritative realtime snapshot may restore the stored value while the
  underlying feedback bucket remains unchanged; neither transition is a
  persisted `-1` mutation.
- Retained 2026-08-05 evidence passed this contract: Nova's stored badge showed
  `1`, vanished immediately after opening the tile, then returned as `1` on the
  next poll. No feedback was submitted, removed or otherwise mutated. Keep this
  as a separate checkpoint from `EVENT-IMPRESSION-001`.

## Event ticketing checkpoints

### `EVENT-TICKET-001` — enable ticketing and preserve the event definition

- On a controlled active event with one accepted participant, enable ticketing
  in Event Editor and save once.
- Verify ticketing survives reopen and no unrelated membership role changes.
  A participant ticket overlay is not expected while the event remains an
  unpublished draft; publish-to-overlay is owned by `EVENT-TICKET-002`.
- The editor save requires its normal event recompute. Merely opening the
  participant ticket surface after the save must not start a scheduler.

Execution evidence on 2026-08-06:

- PASS: after correcting the fixture's missing shared event-counter projection,
  Casey's My Events badge was `1` and the same event remained visible through
  repeated realtime/list polls.
- PASS: Casey unpublished the event for editing, enabled Ticketing, saved once
  and reopened it with Ticketing still On. The preferred canonical state was
  `DR` with `ticketing=true`; Casey remained accepted Admin and Nova accepted
  Member, and exactly one event recompute followed the save. Credential issue
  and participant ticket reuse remain isolated in `EVENT-TICKET-002`.

### `EVENT-TICKET-002` — accepted participant receives one usable credential

- Start from the controlled published, Ticketing Off event. The fixture must
  not insert a participant-owned ticket overlay or credential. Fixture reset
  must also restore both `activities.tickets` and `activities.asset.tickets`;
  after the next normal poll the Ticket menu badge must be absent.
- As Casey, perform the real UI sequence **Unpublish -> Ticketing On ->
  Publish**. Require the publish mutation to create/update Nova's eligible
  participant-owned projection and create one physical `EventTicket` with
  `status=A`. Ticket list/open is read-only and must never manufacture it.
- Only after publish succeeds, switch to Nova and open the Ticket affordance
  twice.
- Verify one event/holder credential with a stable code is read twice;
  repeated opens must not create a second ticket. Casey Admin must have no
  physical ticket, participant overlay or Ticket counter.
- The canonical fixture image is the retained managed `large.webp` URL. The
  ordinary ticket card must derive and request its 640 x 317 `medium.webp`;
  the remote Picsum fallback is not valid checkpoint data.
- A pending, rejected, removed or organizer-only identity must not receive a
  participant credential. The credential event ID and holder ID must agree
  with Event Members and the visible ticket card.
- The publish mutation owns its normal event recompute and ticket projection.
  The two Nova Ticket reads are direct request-path operations and must not
  start a scheduler or an additional event recompute.

### `EVENT-TICKET-003` — authorized check-in is exact-once

- This is a required physical-phone test. Use an Android phone connected by
  USB/ADB for the authorized Casey Admin scanner session; desktop camera
  emulation is not sufficient for PASS. The Nova participant session displays
  the issued ticket QR code on a separate desktop browser or other screen.
- Enable Developer options and USB debugging on the phone, connect it by USB,
  accept the **Allow USB debugging** prompt, then verify and configure the
  local tunnel from the repository host:

  ```bash
  adb devices -l
  adb reverse tcp:8080 tcp:80
  adb reverse --list
  ```

- `adb devices -l` must report the phone as `device`, not `unauthorized`.
  `adb reverse --list` must contain `tcp:8080 tcp:80`. Open
  `http://localhost:8080` in the phone browser, sign in as Casey Admin, open
  the ticket scanner and grant camera permission. Reapply the reverse command
  after an ADB daemon restart, USB reconnection or device restart; do not
  restart the application stack merely to recreate the tunnel.
- Display Nova's controlled active credential QR code on the separate screen
  and scan it once with Casey's physical phone camera.
- Verify one used timestamp and a successful visible result. A second scan of
  the same code must return already used and must not mutate the timestamp.
- An ordinary participant scanner and an invalid code must be rejected with no
  ticket, membership, counter, notification or worker change.

### `EVENT-TICKET-004` — Ticketing Off/On preserves an auditable A/D history

- Start with Nova's physical `status=A` ticket from the preceding publish.
- Disable Ticketing and save once. The existing ticket object must remain in
  `eventTickets` with `status=D`; Nova's active Ticket counter/list entry must
  disappear without changing membership.
- Enable Ticketing and publish again. This must create a new physical ticket
  object with a new ID, QR code and `issuedAtIso`; it must not reactivate or
  overwrite the prior `D` audit record.
- Exactly one `A` ticket may exist for an event/holder pair. Ticket reads never
  change `D` to `A` and never create another object.

### `EVENT-TICKET-005` — join-request approval owns ticket creation

- Stage a published Ticketing On event where Nova joined from the event and is
  pending admin approval (`requestKind=join`), with no Nova ticket, overlay or
  Ticket counter.
- As Casey, approve Nova once. This is the terminal transition directly to
  accepted; there is no second participant-acceptance step. The approval write
  creates exactly one Nova participant overlay and one physical `status=A`
  ticket.
- Nova's normal poll exposes Ticket counter `1`; opening Ticket twice reads the
  same ID/code. Before approval and during both reads, no credential may be
  created.
- Casey and every other Admin remain without a participant ticket.

### `EVENT-TICKET-006` — expiry moves the active ticket to Past

- Start shortly before the event end with Nova's physical `status=A` ticket
  visible once under Upcoming; retain its ID and code.
- After the ordinary end-time/expiry convergence, the same ticket disappears
  from Upcoming and appears once under Past. Event expiry does not change the
  ticket to `D` and does not create a replacement.
- Scanning the retained code returns expired without consuming or mutating the
  ticket. `A`/`D` is owned by Ticketing On/Off, while Upcoming/Past is derived
  from the event time boundary.

### `EVENT-TICKET-007` — invitation preapproval stays ticketless until recipient acceptance

- Stage a published Ticketing On event where an ordinary accepted member has
  invited Nova. There must initially be no Nova ticket and both stored
  `users.activities.tickets` and `users.activities.asset.tickets` remain `0`.
- Approve the invitation as Casey Admin. Nova remains pending until she accepts;
  this admin preapproval must not create a physical ticket or increment either
  stored user counter.
- Nova accepts the invitation once. Only this terminal transition to accepted
  creates exactly one physical Nova `status=A` ticket and changes both stored
  user counters to `1`; the next normal profile poll exposes the Ticket red
  badge `1`.
- Repeating the acceptance request or opening Ticket twice must preserve the
  same ticket ID/code and counters. Casey, the ordinary inviter and every other
  pending identity remain ticketless unless they independently become accepted
  non-admin participants.

## Tournament cases

### `TOURNAMENT-001` — manual definition and initial UI

- Consume the manual output of `EVENT-EDITOR-004` or an equivalent staged
  tournament definition.
- Verify parent event, stages, capacities, sequence, status and zero/initial
  group counts in Event Editor, stage list and tournament group popup.

### `TOURNAMENT-002` — automatic group membership projection

- Provide accepted parent participants and run the real grouping path.
- Verify every selected user is represented exactly once in the correct group,
  Event Members remains parent-scoped, the tournament group member screen is
  group-scoped, and group chat access matches group membership.
- Pending invitation rows must not be counted as accepted group members unless
  the documented transition explicitly promotes them.

### `TOURNAMENT-003` — review and advancement

- Finalize one stage with deterministic winners/losers, then let the real
  tournament-review scheduler process it.
- Verify next-stage group membership, removed stale losers, stage status,
  score/advancement UI and notification exactly once.
- A second unchanged review must be a domain and UI no-op.

## Asset cases

### `ASSET-MEMBER-001` — asset invite and pending linkage

- Invite one controlled user from the Asset Members UI.
- Verify the row is pending and linked to the exact asset owner/type/id, not to
  the current event or an unrelated asset.
- Verify the recipient projection names the same asset and inviter once.

### `ASSET-MEMBER-002` — accept/reject and role isolation

- Accept one asset invitation and reject another independently.
- Verify accepted asset membership/role, resolved notification and rejected
  cleanup. Asset Manager must not silently promote the user to Event Admin or
  change an existing event membership role.

### `ASSET-ASSIGN-001` — event/sub-event asset assignment

- Assign an eligible accepted user's asset to one event sub-event.
- Verify event ID, sub-event ID, asset owner, asset ID, capacity/settings and
  Event Resources UI agree.
- Verify assignment visibility and availability/capacity effects without
  changing the user's event role or creating a second asset membership.

## Operator authentication case

### `OPERATOR-FIREBASE-001` — activate, observe login mode, roll back

- In a disposable deployment, save and test valid Firebase configuration, then
  activate only the verified revision.
- In a fresh browser session, verify that the normal entry action opens the
  Firebase authentication surface instead of the demo user selector.
- Verify failed/unverified activation never changes the login mode and that
  bootstrap/operator recovery remains available only through its documented
  boundary.
- Restore the original deployment capability and verify the original login
  mode. Record credentials only as masked/absent evidence.

## Execution and evidence rules

1. Begin every human action with why the step exists, what it tests and the
   exact visible result expected.
2. Record a shared campaign lineage ID when one manually created event feeds
   later cases. This is evidence linkage, not a prerequisite for independent
   reproducibility.
3. At every boundary capture the producer UI, the consuming UI and an
   independent domain/API/database oracle. A bell alone does not prove a
   membership transition.
4. Keep separate browser sessions for inviter/host, recipient/participant and
   admin/observer. Do not switch active users inside one session during a
   privacy assertion.
5. Use the real scheduler and persisted timing only for cases that genuinely
   have a scheduler consumer. Immediate saves, invitations and chat actions
   must not receive an invented scheduler hook.
6. Preserve `X` expectations. An unrelated unchanged surface is a pass, not a
   missing delta.
7. Reset every staged identity, scheduler timing change and provider
   configuration after evidence is captured.

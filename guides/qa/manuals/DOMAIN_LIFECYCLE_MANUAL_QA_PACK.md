# Domain lifecycle manual QA pack

Status: execution in progress  
Last updated: 2026-08-06
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
| Ticketing enablement, accepted participation and attendance | Ticket-enabled event overlay, one physical holder credential and event-scoped member attendance | Event checkout/ticket card, scanner and Event Members | Event publish/terminal acceptance owns ticket creation; first valid check-in owns ticket use plus attendance projection; list/open and rejected revoked QR scans are non-producers | `EVENT-TICKET-001` through `EVENT-TICKET-012` |
| Firebase configuration test and activation | Verified active deployment capability and public client configuration | Operator configuration state and entry authentication mode | Firebase authentication, notification delivery and session routing | `OPERATOR-FIREBASE-001` |
| Operator payment credential and network access policy | Server-held payment token revision plus trusted-client-IP allowlist | Masked payment configuration state and explicit access denial | Payment provider calls and immutable operator security audit | `OPERATOR-PAYMENT-001`, `OPERATOR-PAYMENT-IP-001` |

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
- `EVENT-VISIBILITY-001` continues only after `EVENT-TICKET-007` has completed:
  Casey changes the same event to Friends Only, then one external non-member
  friend and one external non-member non-friend compare Explore. The ticket
  identities remain a retained no-change oracle.
- `EVENT-INV-001` -> `EVENT-INV-002` -> `EVENT-INV-003` ->
  `CHAT-AUTH-001`: pending invitation, privacy boundary, acceptance and chat.
- `EVENT-FEEDBACK-001` -> `EVENT-FEEDBACK-002` ->
  `EVENT-IMPRESSION-001`: feedback unlock, persisted feedback and target-user
  impression refresh.
- `EVENT-FEEDBACK-006` is the isolated pending remove/restore branch. Run it
  from the same zero-response baseline, prove both transitions, reset it
  through the checkpoint harness, then restage `EVENT-FEEDBACK-002`.
- `EVENT-TICKET-001` -> `EVENT-TICKET-002` -> `EVENT-TICKET-POLL-001` ->
  `EVENT-TICKET-003` -> `EVENT-TICKET-011` -> `EVENT-TICKET-009` ->
  `EVENT-TICKET-004` (Unpublish midpoint) -> `EVENT-TICKET-012` ->
  `EVENT-TICKET-004` (Republish completion) -> `EVENT-CHAT-LIFECYCLE-001` ->
  `EVENT-TICKET-005` -> `EVENT-TICKET-006` ->
  `EVENT-TICKET-007` -> `EVENT-VISIBILITY-001`:
  ticket enablement, physical credential, check-in, A/D audit lifecycle,
  join approval, Past bucketing, two-step invitation acceptance and finally
  the same event's Friends Only discovery boundary.
- `EVENT-EDITOR-004` -> `TOURNAMENT-001` -> `TOURNAMENT-002` ->
  `TOURNAMENT-003`: tournament definition, grouping and advancement.
- `EVENT-SLOT-001` -> `EVENT-SLOT-002`: one saved recurring template becomes
  multiple future slot sections with role/time-gated actions.
- `EVENT-SLOT-003` -> `EVENT-SLOT-004`: one generated past occurrence owns its
  own close state, groups and leaderboard evidence.
- `ASSET-MEMBER-001` -> `ASSET-MEMBER-002` and `ASSET-ASSIGN-001`: asset
  invitation and event/sub-event assignment are separate branches.
- `OPERATOR-PAYMENT-001` and `OPERATOR-PAYMENT-IP-001` are separate future
  operator-security branches: first prove secret lifecycle, then enforce a
  trusted resolved-client-IP allowlist without relying on frontend hiding.

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

### `EVENT-VISIBILITY-001` — Friends Only Explore discovery boundary

- Run only after `EVENT-TICKET-007` has fully completed. Retain the same event,
  Casey/Nova/Riley memberships, Nova and Riley physical ticket IDs/codes and
  all stored ticket counters as the before oracle.
- Nova and Riley cannot serve as Explore visibility controls: Explore excludes
  every identity with tracked participation, independently of how that person
  was originally invited. Use two external identities that have never been a
  member, pending request or invitee on this event. The harness pins Lina Park
  as Casey's friend control and Liam Parker as Casey's non-friend control.
- As Casey, perform **Unpublish -> Friends Only -> Publish** on the same event.
  Unpublish must retain both former active tickets as `D`; republish must
  create one new `A` ticket with a new ID/code for Nova and Riley. Membership
  remains unchanged and their stored ticket counters return to their original
  values after publish.
- With Lina's and Liam's sessions already on Event Explore and configured to
  include the event's location/date, require Lina to see the event exactly once
  after the normal list poll and require Liam not to see it. A direct detail
  request by Liam must also be denied by the server; hiding only the card is
  insufficient.
- Opening, polling or searching Explore is read-only and must not create an
  event, membership, invitation, ticket, counter mutation or worker task.
- This continuation is a visibility checkpoint. Do not add Join, approval,
  slot or tournament mutations to it; those remain separate checkpoints.

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
- The baseline and every pre-acceptance projection must show `2 / 8`: Casey is
  the accepted Admin and Nova the accepted Member. Riley is one pending join
  control, so the pending indicator is `1`; Riley must have no physical ticket
  and both of Riley's stored `users` ticket counters remain `0`.
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
  participant credential. In this checkpoint Riley proves the pending branch:
  publish must leave Riley ticketless and at stored user counters `0 / 0`.
  The credential event ID and holder ID must agree with Event Members and the
  visible ticket card.
- The publish mutation owns its normal event recompute and ticket projection.
  The two Nova Ticket reads are direct request-path operations and must not
  start a scheduler or an additional event recompute.

Execution evidence on 2026-08-06:

- PASS: the real UI sequence preserved the intended membership projection:
  Casey and Nova remained accepted at `2 / 8`, Riley remained the single
  pending control, and the editor persisted Ticketing On before publish.
- FAIL: before Nova opened Ticket, the independent oracle found no physical
  ticket and Nova's two stored `users` ticket counters remained `0 / 0`.
  Casey and Riley correctly remained ticketless. Runtime logs showed the
  publish save, chat materialization, recompute and counter refresh, but no
  event-level ticket synchronization.
- Root cause: the canonical save/sync path invoked accepted-participant ticket
  synchronization, but the separate lifecycle `publish()` path did not. The
  owning backend write path now synchronizes physical tickets before refreshing
  the stored user counters. The existing hot-deploy compiled successfully and
  restarted the same server; no read-side issuance or frontend workaround was
  added.
- The failed state was reset. A clean baseline was staged at
  `2026-08-06T05:01:50.062Z` with the retained managed image, Ticketing Off,
  Casey and Nova accepted, Riley pending, `2 / 8`, no physical tickets and all
  three users at stored ticket counters `0 / 0`.
- PASS after fix: the repeated real publish created exactly one Nova
  `status=A` physical ticket and updated Nova's two stored `users` ticket
  counters to `1 / 1`. Casey Admin and pending Riley remained at `0 / 0` with
  no ticket; membership stayed `2 / 8` plus one pending control and the publish
  produced one normal recompute.
- Ticket list/reload reads preserved ticket ID
  `6a7415d366fe4ab1cd12e373`, code and `issuedAtIso`, and produced no new ticket
  or recompute. Nginx recorded HTTP 200 for the canonical managed
  `medium.webp` request. On the first open the UI retained the earlier
  **Previous** filter and therefore showed an empty list; a full reload reset
  the surface to **Upcoming**, where the ticket appeared. Retain this as a
  filter/reload observation, not a ticket-lifecycle failure.
- FOLLOW-UP HOT-DEPLOYED: Ticket already had the shared SmartList-owned
  30-second poll. Its completed list snapshot now publishes the Ticket count
  through the same `ActivityStore` counter signal used by Activity/Event,
  mirroring both `tickets` and `asset.tickets`. The popup dropdown no longer
  substitutes a separate popup-only red counter. The separate
  `EVENT-TICKET-POLL-001` checkpoint must prove live list/counter convergence
  while Upcoming stays open, without close/reopen or browser reload.

### `EVENT-TICKET-POLL-001` — open Ticket popup shares one live counter signal

- Start from a clean published, Ticketing Off event with Casey accepted Admin,
  Nova accepted Member at `2 / 8`, and Riley pending as the ticketless control.
  There is no physical ticket and all three users' stored
  `activities.tickets` plus `activities.asset.tickets` are `0 / 0`.
- As Nova, open **Ticket -> Upcoming** and leave the empty popup open. Do not
  close it and do not reload the browser.
- In the isolated Casey session perform **Unpublish -> Ticketing On ->
  Publish** once.
- Within one 30-second SmartList poll interval, require Nova's already-open
  Upcoming list to gain exactly one ticket row and the Ticket dropdown/menu red
  counter to change `0 -> 1` from the same shared `ActivityStore` signal.
- While that popup is open, the shared `UiPollCoordinator` gives its SmartList
  poll foreground ownership. The side-menu realtime long poll must not execute
  concurrently or overwrite the foreground snapshot; after the popup closes,
  background polling resumes. Apply the same ownership rule to Activity/Event
  SmartLists rather than adding a Ticket-specific timer or component gate.
- The persisted oracle must independently prove exactly one Nova `status=A`
  ticket, Nova's two stored `users` counters at `1 / 1`, no Casey ticket, and
  Riley still pending and ticketless with counters at `0 / 0`, plus exactly one
  normal publish recompute. The poll itself must create no ticket, recompute,
  notification or outbox item.
- Phase 1 is PASS when the already-open list and shared counter converge from
  `0 -> 1` without popup close/reopen, reload or oscillation.
- Phase 2 then closes Nova's Ticket popup but leaves the profile side menu
  open. Casey performs **Unpublish** once. Do not reopen a popup and do not
  reload Nova.
- Within one 30-second background realtime poll, require both Nova's Events
  and Ticket red counters to change `1 -> 0`. Unpublish preserves the draft's
  Ticketing On setting but revokes the event credential: the one physical
  ticket changes `A -> D`, while Casey and pending Riley remain ticketless.
- Run `bash manual-qa-checkpoints.sh verify-ticket-poll-resume event-domain
  EVENT-TICKET-POLL-001`. The persisted oracle must prove canonical `DR`,
  Ticketing On, membership `2 / 8` plus Riley pending, exactly one Nova `D`
  audit ticket, and Nova's stored Events/Ticket counters at zero.
- If the background side-menu poll and persisted oracle agree, close this
  checkpoint. A later republish must create a new active physical ticket and
  QR before `EVENT-TICKET-003` can run.

Execution evidence on 2026-08-06:

- PASS: phase 1 kept Nova's Upcoming Ticket popup open while Casey published;
  the list and shared Ticket counter converged `0 -> 1` without reload or
  oscillation.
- PASS: after closing the popup, Casey Unpublish let the resumed background
  side-menu poll change Nova's Events and Ticket counters `1 -> 0` without
  reopening or reload.
- Persisted oracle at `2026-08-06T06:08:58.365Z` proved canonical `DR` with
  Ticketing On, membership `2 / 8` plus Riley pending, Nova ticket
  `6a741f2e66fe4ab1cd12e39b` retained as `D`, and Casey/Nova/Riley stored ticket
  counters all `0 / 0`. The checkpoint was reset cleanly.

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
- On scanner open, require one shared `app-menu` camera toggle instead of a
  custom retry button. **Kamera be** is the live/read state and also starts the
  next scan; **Kamera ki** stops the detection loop and every MediaStream track.
  While manually off, the camera target is white with a corner-to-corner red X.
- **QR-kód keresése...** and **Jegy ellenőrzése...** render as a centered
  top overlay badge inside the camera target. They consume no layout row; the
  camera toggle remains mounted at the same position through reading,
  validating and result states, becoming disabled rather than disappearing
  while validation is in flight.
- After any completed validation the stream must be off automatically. A valid
  result retains exactly the camera frame on which the QR was recognized in
  place of a black target; rejected/error results must not present that frame as
  accepted evidence. Turning **Kamera be** on starts a fresh scanner session,
  so no separate **Újabb beolvasás** button is present.
- Canonical roles `Manager`, `Admin` and `Member` appear verbatim on Casey's
  scanner as contextual badges beneath the avatar; the scanner does not
  localize `Member` to `Tag`. Nova's own QR surface may retain its localized
  contextual badge. The event title remains its own unprefixed line.
- Before the first scan, display Nova's controlled active credential QR code
  on the separate screen and save a screenshot containing the complete QR.
  Keep that screenshot until every scan branch is complete: after a successful
  check-in the current UI has no surface that displays the consumed ticket QR
  again, so the repeat-scan branch must reuse this captured image rather than
  depend on reopening the live Ticket surface.
- Scan the live QR once with Casey's physical phone camera.
- Verify one used timestamp and a successful visible result. A second scan of
  the same code must return already used and must not mutate the timestamp.
- An ordinary participant scanner and an invalid code must be rejected with no
  ticket, membership, counter, notification or worker change.

Current staged baseline on 2026-08-06:

- Post-fix clean retest staged at `2026-08-06T10:12:01.825Z` with Casey
  accepted Admin and Nova accepted Member at `2 / 8`. Nova's fresh physical
  ticket is `status=A`, unused, and has code
  `TKT-1a7df4b6-c8a6-44bd-b859-dac4cd412d15`; replay audit, replay outbox and
  aggregated warning collections are all empty. Retain the new complete QR;
  the earlier screenshot belongs to the reset credential and is invalid.
- Restaged at `2026-08-06T09:29:57.060Z` with Casey accepted Admin and Nova
  accepted Member at `2 / 8`; the event is active, Ticketing On and uses the
  retained managed MinIO image.
- Nova owns one active physical ticket with a freshly generated UUID-shaped
  `TKT-` code; every reset plus new stage must produce a different code/QR.
  Casey has no participant ticket.
- The complete QR was retained before scanning. Casey's first scan on the
  current baseline persisted exactly one canonical use at
  `2026-08-06T09:54:28.300791752Z`; the ticket remains `status=A`, and the
  replay audit/warning collections were still empty immediately afterward.
- The Android device `aer8vgcmyd9lzxv8` is authorized and `adb reverse --list`
  reports `tcp:8080 tcp:80`.

Restart evidence on 2026-08-06:

- Post-fix PASS evidence through first replay: Casey's first scan used the
  freshly staged ticket exactly once at
  `2026-08-06T10:16:50.744525385Z`. A saved-QR replay at
  `2026-08-06T10:18:11.470491618Z` returned **already used**, retained that
  canonical use, and wrote one immutable Casey audit, one sanitized pending
  outbox row and one unread Nova warning with `occurrenceCount=1`. Nova's open
  UI received both the warning and red-counter change. The persisted
  `users.activities.notifications=2` equals the unread check-in row plus the
  unread replay warning, proving row creation and users-table counter increment
  occurred together after the aggregate-upsert fix.
- Final PASS/CLOSED evidence: Nova marked the first warning read, then Casey
  replayed the same saved QR again at
  `2026-08-06T10:24:44.951720573Z`. The ticket retained its original
  `usedAtIso`/Casey actor; exactly two immutable replay audits exist and the
  single Nova warning advanced to `occurrenceCount=2`, `revision=3`, with
  `readAtIso` cleared. Persisted `users.activities.notifications=2` again
  represents the unread check-in row plus the reactivated warning. The user
  accepted the physical check-in/replay checkpoint as complete; the further
  already-unread occurrence/no-inflation branch remains in automated aggregate
  coverage.
- The first saved-QR replay on the `09:29:57.060Z` baseline returned **already
  used** and preserved `status=A`, canonical `usedAtIso` and Casey
  `usedByUserId`. The persisted oracle found one immutable Casey replay audit
  at `2026-08-06T10:01:10.053713457Z` and one sanitized pending replay-warning
  outbox row, but zero Nova warning rows. Nova's notification list and
  users-table unread/red counter consequently remained unchanged even after
  reload. Root cause was a conflicting Mongo aggregate upsert that addressed
  `revision` in both `$setOnInsert` and `$inc`. The repository now lets `$inc`
  initialize/increment `revision` atomically. Reset/restage is required before
  repeating this checkpoint; do not patch the partially executed documents.
- Current rerun: Nova's notification baseline was opened and the complete
  fresh QR was retained before use. Casey's authorized physical-phone scan
  succeeded once; the persisted oracle records
  `usedAtIso=2026-08-06T09:54:28.300791752Z`, Casey as `usedByUserId`, unchanged
  `status=A`, and zero replay audits/warnings before the saved-QR replay phase.

- The first authorized physical-phone scan succeeded and persisted exactly one
  use at `2026-08-06T06:18:07.529719781Z`, performed by Casey. The checkpoint
  was not closed because no pre-scan QR screenshot had been retained and the
  consumed credential could not be displayed again for the repeat-scan branch.
- Reset and restage the checkpoint, capture the QR before scanning, then repeat
  the complete success/already-used/invalid/unauthorized sequence.
- A second clean online scan persisted exactly one use at
  `2026-08-06T06:32:04.164092685Z` by Casey. It remains partial evidence: the
  scanner preview/control was then changed to the shared camera toggle with
  accepted-frame retention. That used fixture was reset at
  `2026-08-06T06:44:21.033Z`; the current unused baseline above owns the full
  UI plus exact-once rerun.
- PASS partial evidence on the current baseline: the revised physical-phone
  scanner UI worked end to end and the first authorized scan persisted exactly
  one use at `2026-08-06T06:59:21.130578868Z`, performed by Casey. The ticket
  remains `status=A`; the remaining closure sequence is the saved-QR repeat,
  invalid-code and unauthorized-participant scans. Each must leave that exact
  `usedAtIso` and `usedByUserId` unchanged.
- PASS partial evidence: the user repeated the saved QR before replay-warning
  implementation and received **already used**. The persisted oracle remained
  `status=A`, `usedAtIso=2026-08-06T06:59:21.130578868Z` and
  `usedByUserId=Casey`, proving the original exact-once no-op. Invalid-code and
  unauthorized-participant scans still remain for closure.

### `EVENT-TICKET-004` — Unpublish/republish preserves an auditable A/D history

- Start with Nova's physical `status=A` ticket from the preceding publish.
- Unpublish once while Ticketing remains configured On in the draft. The
  existing ticket object must remain in `eventTickets` with `status=D`;
  Nova's active Ticket counter/list entry must disappear without changing
  membership.
- Publish again with Ticketing still On. This must create a new physical ticket
  object with a new ID, QR code and `issuedAtIso`; it must not reactivate or
  overwrite the prior `D` audit record.
- Exactly one `A` ticket may exist for an event/holder pair. Ticket reads never
  change `D` to `A` and never create another object.
- PASS/CLOSED evidence: Republish retained the original used ticket as
  `status=D` with code
  `TKT-1a7df4b6-c8a6-44bd-b859-dac4cd412d15` and created exactly one new,
  unused `status=A` object `6a74645b7c85995dcf3955eb` with code
  `TKT-942126c0-4c90-44b0-8017-baf5c0810a82` and
  `issuedAtIso=2026-08-06T10:39:23.880809028Z`. Nova's stored Ticket counters
  returned to `1 / 1`; Casey/Nova membership remained accepted at `2 / 8`.
  The missing participant-facing republish notification is intentionally
  separated into `EVENT-NOTIFICATION-001`; it does not invalidate the physical
  ticket lifecycle proof.

### `EVENT-TICKET-005` — join-request approval owns ticket creation

- Stage a **Public**, published, Ticketing On event that requires admin
  approval. Casey is the only accepted Admin; Nova is not yet a member and has
  no ticket or stored ticket counter.
- As Nova, find the event through Event Explore and choose Join. Require one
  pending membership with `requestKind=join` and `pendingSource=member`, while
  both `users.activities.tickets` and
  `users.activities.asset.tickets` remain `0` and no physical ticket exists.
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
  ticket. Event time owns Upcoming/Past; Unpublish or loss of ticket
  eligibility owns `A -> D`.

### `EVENT-TICKET-007` — invitation preapproval stays ticketless until recipient acceptance

- Stage a published Ticketing On event with Casey accepted Admin and Nova
  accepted Member. Nova already owns one physical `status=A` ticket and both
  of Nova's stored users-table ticket counters are `1`; Riley is not yet a
  member and has no ticket/counter.
- As Nova, invite Riley through the ordinary member UI. Riley becomes pending,
  but no Riley ticket is created and both Riley stored ticket counters remain
  `0`.
- Approve Riley as Casey Admin. Because the invitation originated from an
  ordinary member, Riley remains pending until Riley accepts; this
  preapproval must still create no Riley ticket and increment no Riley ticket
  counter.
- Riley accepts the invitation once. Only this terminal transition to accepted
  creates exactly one physical Riley `status=A` ticket and changes both Riley
  stored ticket counters to `1`; the next normal profile poll exposes Riley's
  Ticket red badge `1`.
- Nova's original ticket ID/code and counters remain unchanged throughout.
  Repeating Riley's acceptance or opening Riley Ticket twice must preserve the
  same Riley ticket ID/code and counters. Casey remains ticketless.

### `EVENT-TICKET-008` — two similar events keep physical tickets isolated

- Stage two structurally similar published, Ticketing On events. Casey is
  accepted Admin, Nova accepted Member, and Riley pending on both events.
  Casey and Riley have no ticket; Nova has two distinct physical `status=A`
  tickets, each bound to exactly one event ID.
- Capture both event IDs and both ticket IDs, QR codes and `issuedAtIso`
  values. Nova's Ticket list contains both cards once and both users-table
  ticket counters equal `2`.
- Unpublish only event A. Its ticket changes `A -> D`; event B stays active,
  its ticket remains `A` with the same ID/code, the list contains only B, and
  Nova's counters change `2 -> 1`.
- Run `verify-ticket-isolation-unpublish event-domain EVENT-TICKET-008` and
  retain its exact event-B identity oracle.
- Publish event A again with Ticketing still On. A new event-A ticket with a
  new ID/code is created while event B remains byte-for-byte stable; Nova's
  counters return `1 -> 2` and each event appears once.
- Run `verify-ticket-isolation-republish event-domain EVENT-TICKET-008` before
  closing the checkpoint.
- Repeated Ticket reads are no-ops. No physical ticket, QR, participant
  overlay or counter contribution may cross an `eventId` boundary.

### `EVENT-TICKET-009` — holder can present a cached QR while offline

- Run this as a separate physical-phone checkpoint after the online check-in
  contract is closed. Start with a fresh active Nova ticket. The backend and
  Casey Admin's physical-phone scanner remain online throughout this case.
- In Nova's desktop browser, open the Ticket card and QR while online so the
  application shell, ticket record and QR presentation are warmed. Record the
  ticket ID/code and the online QR. A cold client that has never loaded the
  ticket is not equivalent.
- This checkpoint owns offline session restoration as well as the cached QR.
  A persisted, warmed member session must survive reload and route from `/`
  back into the cached application; it must not be treated as logout merely
  because Firebase/profile revalidation cannot reach the network. Firebase
  local persistence may resume the existing user while its cached credential
  remains usable, but a new login or token refresh is not an offline promise.
  An anonymous client may still display the cached landing page with **No
  network**.
- Isolate only Nova's browser client with DevTools **Network -> Offline** (or a
  target-scoped CDP network override), then reload that browser. Do not stop the
  shared backend, proxy or frontend, and do not affect Casey's phone session.
- Preferred assisted execution: Codex attaches CDP only to the already-open
  Nova page target, records its target ID/title/URL without cookies or tokens,
  enables the Network domain, applies an offline network override, and reloads
  that same target. It must prove Casey's phone/backend path is still online
  and must restore Nova's target to online in a finally-style cleanup even when
  the checkpoint fails. A browser-wide or host-wide network change is invalid.
- Manual execution for another tester: in Nova's tab press **F12**, open
  **Network**, leave **Disable cache** unchecked, change the throttling selector
  from **No throttling** to **Offline**, keep DevTools open and reload that same
  tab. After the scans, change the selector back to **No throttling** and reload
  once online. Do not enable Offline in Casey's phone browser.
- Require Nova's reloaded offline application to open from cache and display
  the same physical ticket and complete QR without a server response.
- With Casey's phone still online through the ADB reverse, scan the QR displayed
  by Nova's offline browser. Require one successful server-side check-in with
  exactly one canonical `usedAtIso` and `usedByUserId=Casey` on the original
  ticket. Scan the still-visible cached QR again and require already-used with
  no second mutation.
- Restore Nova's browser network and reload. Require ordinary reconciliation:
  no replacement/duplicate ticket and no counter, notification or worker side
  effect. Capture Nova's offline reload/network evidence and the persisted
  before/after ticket oracle. Evidence must also state whether Codex CDP or the
  manual DevTools procedure controlled Nova's network and when online mode was
  restored.

### `EVENT-TICKET-010` — audit replay actors and aggregate the holder warning

- Run this security extension on the currently used `EVENT-TICKET-003` ticket;
  no restage is required. The backend and frontend implementation is
  hot-deployed. The pre-test persisted baseline has zero replay audits, zero
  replay-warning outbox rows and zero aggregated holder-warning rows.
- Prepare three isolated sessions before continuing. Run
  `guides/qa/tools/open-three-chrome-sessions.sh`; for each prompt the tester
  manually chooses a different existing Google profile and confirms the named
  Casey, Nova or Riley MyScoutee session. The helper deliberately contains no
  Chrome profile-directory names and never selects a Google profile itself.
  Chrome permits only one active profile picker at a time, so the helper opens
  the three pickers sequentially with a seven-second selection window. The
  tester clicks a different existing Google profile after every popup; after
  the third selection, the resulting Casey, Nova and Riley profile windows
  remain open concurrently. Keep the helper process running for the whole QA
  checkpoint because it owns the launched Chrome process; press its final
  Enter only when all three sessions may close. Override the selection delay
  with `PROFILE_PICK_DELAY_SECONDS` only when another tester needs more time.
  The script itself still contains no profile-directory selection or mapping.
  Three windows of one Google profile are invalid because their MyScoutee
  session storage is shared and a later user selection overwrites the earlier
  one. Riley is the idle independent control for this checkpoint.
- Keep Nova online throughout this checkpoint so the notification row, read
  transition and bell contribution can be observed through normal realtime
  synchronization. Asymmetric offline holder behavior belongs exclusively to
  `EVENT-TICKET-009` and must not be mixed into this warning test.
- Capture Nova's pre-warning total unread count as `B`; unrelated retained
  notifications remain part of that baseline. Assertions below concern the
  warning row's one unread contribution, not an absolute zero/one bell value.
- Start with a Nova ticket that Casey has already checked in successfully.
  Scan the same saved QR through the authorized Casey server-side scanner path.
- The replay must still return **already used** and must not change ticket
  `status`, `usedAtIso`, `usedByUserId`, membership, event counters or create a
  replacement credential.
- Persist one immutable `eventTicketAudit` record per replay, including ticket,
  event, holder, authenticated scanner actor, attempt time and the original
  canonical `usedAtIso`/`usedByUserId`. The raw ticket code/QR must not be
  stored in the audit.
- Deliver the warning to holder Nova. Its sender is the authenticated scanner
  actor, Casey, and its payload uses warning tone without the raw ticket
  code/QR. Casey must not receive the holder warning merely because Casey made
  the request.
- After the first replay, Nova has one unread warning row with occurrence count
  `1` and total unread becomes `B+1`. Nova marks that warning read: the same row
  remains at count `1`, gains `readAtIso`, and total unread returns to `B`.
  Casey then scans the same saved QR again. The existing row must become unread
  again, move to occurrence count `2`, refresh its last actor/time and restore
  total unread to `B+1`.
- While Nova's Notification popup is already open, the first replay warning is
  prepended above the existing check-in notification. The normal SmartList poll
  sends every cached page's server-issued `{id, revision}` pairs and the loaded
  tail boundary to the notification delta endpoint. Equal pairs are discarded
  server-side; only changed/new rows return as upserts and bucket exits return
  as removed IDs. Previously cached unchanged rows and their object identities
  remain untouched, so the insertion must not recreate every rendered row or
  require close/reopen. The revision is created and incremented by notification
  write-side persistence and merely stored by the frontend page cache.
- Scan once more while that row is already unread. The row becomes count `3`
  but total unread remains `B+1`; no second/third inbox row is allowed. The outbox may
  collapse equivalent pending delivery intents, so immutable replay audits and
  the aggregated inbox occurrence count—not raw outbox document count—are the
  exact attempt oracles.
- HTTP persists the immutable audit and aggregates the inbox row. Frontend
  local mode mirrors both semantics in its ticket repository and shared
  notification repository; the UI converter displays the repeat count only
  when it exceeds one. The atomic aggregate upsert clears `readAtIso` on a new
  occurrence and increments the unread users-table counter only when the row
  was newly inserted or had previously been read.
- Invalid, revoked, expired and unauthorized codes remain separate rejection
  paths and must not create replay audits or masquerade as this warning.

### `EVENT-TICKET-011` — successful check-in projects attendance into Event Members

- This is a newly captured GAP checkpoint. The current implementation consumes
  the physical ticket but leaves Nova's `activityMembers.status=accepted` and
  has no separate event-scoped attendance field or Members-row check-in badge.
- Membership eligibility and attendance are independent dimensions. A valid
  check-in must **not** replace `status=accepted`; it must persist a separate
  attendance projection such as `attendanceStatus=checked-in`, together with
  `checkedInAtIso`, `checkedInByUserId` and the physical `checkedInTicketId`.
  Global user/profile status must remain untouched.
- Stage Casey as accepted Admin and Nova as accepted Member with one unused
  physical ticket. Open Casey's Event Members popup before scanning. Nova's row
  begins accepted and not checked in, with no false attendance badge.
- Casey performs the first authorized QR scan. The same owning server write
  path that atomically consumes the ticket must project Nova as **Checked in /
  Beléptetve** for this event. The already-open Members list must converge by
  its normal shared member signal/poll without close/reopen or full-list
  replacement.
- Persisted oracle: ticket `usedAtIso` equals member `checkedInAtIso`, scanner
  Casey equals `checkedInByUserId`, and the member references the exact ticket
  ID. Casey's Admin membership, accepted-member count and capacity remain
  unchanged.
- Replaying the same QR may create the separate `EVENT-TICKET-010` security
  audit/warning, but it must not rewrite attendance time/actor/ticket, add a
  second Members row or increment any attendance count. Invalid, unauthorized,
  revoked and expired scans leave attendance absent and the Members UI
  unchanged.
- Event-end attendance/no-show classification is a later lifecycle concern.
  This checkpoint proves only the first successful entry projection and its
  exact-once identity; it must not infer no-show merely from an unused ticket
  before the event is closed.

### `EVENT-TICKET-012` — a saved QR is revoked immediately after Unpublish

- Run this between the Unpublish and Republish halves of `EVENT-TICKET-004`.
  Retain Nova's previously saved complete QR and its old physical ticket
  identity. Casey Unpublishes the event once while Ticketing remains configured
  On in the draft.
- First prove the lifecycle midpoint independently: canonical event is `DR`,
  the same physical ticket object is retained with `status=D`, Nova's active
  Ticket list/counter contribution is gone, and Casey/Nova membership remains
  accepted at `2 / 8`.
- Without republishing, Casey scans that saved QR through the normal authorized
  physical-phone scanner. The backend must reject it as **revoked/inactive**.
  Revocation takes precedence over its earlier `usedAtIso`; the result must not
  masquerade as another **already used** replay.
- The rejection is a strict no-op: the D ticket retains its original ID, code,
  `issuedAtIso`, `usedAtIso` and `usedByUserId`; event and membership remain
  unchanged; no replacement credential is issued.
- Capture replay-security counts immediately before and after the scan. A
  revoked credential must not add an `eventTicketAudit` replay row, increment
  the existing aggregated warning occurrence, create replay outbox work or
  change Nova's unread/red counter. The raw QR remains absent from all audit and
  notification documents.
- After this checkpoint passes, return to `EVENT-TICKET-004` and Publish once.
  The later active ticket must be a new physical object/code; the saved revoked
  QR must remain rejected and must never address the replacement credential.
- PASS/CLOSED evidence: Unpublish first produced its own normal unread Nova
  `event-under-review` notification at
  `2026-08-06T10:30:47.791763232Z`, changing persisted
  `users.activities.notifications` from `2` to `3`. Casey then scanned the
  retained QR and received the revoked/inactive result. The scan itself created
  no notification: the D ticket retained its identity and original use, replay
  audits stayed `2`, replay-warning outbox stayed `2`, the single warning stayed
  `occurrenceCount=2`, and the users-table counter stayed `3`.

### `EVENT-NOTIFICATION-001` — lifecycle notifications poll independently of popup ownership

- This is a separate follow-up to the closed physical-ticket lifecycle case.
  The first observed Republish correctly created the replacement ticket but
  produced no Nova **available again** row. Persisted evidence contained only
  the earlier Unpublish `event-under-review` task/notification: the Publish
  branch treated a recreated actor chat as mutually exclusive with lifecycle
  notification scheduling.
- The event Publish write must always schedule the lifecycle notification for
  accepted non-actor participants even when main-chat owner copies are created
  or restored. Pending invitees retain their separate invitation path. The
  expected Nova row is `kind=event-modified` with the existing event title and
  a message stating that the event is available again; the frontend must never
  synthesize this row.
- Keep Nova authenticated with a non-notification popup such as Ticket open.
  Casey Unpublishes the active event once. Without closing or reloading Nova,
  the independent notification lane must expose the new under-review unread
  count/attention within one configured poll interval, while ordinary
  side-menu activity reconciliation remains paused behind popup ownership.
- Casey then Publishes with Ticketing still On. Without closing/reloading Nova,
  the same notification lane must expose exactly one new available-again
  unread contribution. Opening or already having Notification Center open must
  show the new row through its keyed delta SmartList without replacing stable
  rows.
- Notification polling owns a separate serialized lane in the shared
  `UiPollCoordinator`: it is never cancelled by popup presence and is not
  blocked behind a foreground SmartList poll. Background side-menu polling
  retains the original popup suppression rule. While a popup is open, the
  bundled realtime snapshot applies only the notification counter; it does not
  advance the normal profile cursor, so closing the popup lets the next normal
  snapshot reconcile all deferred side-menu counters.
- Persisted oracle: one completed lifecycle scheduled task and one Nova inbox
  row for each Unpublish/Republish mutation, no notification for Casey as the
  actor, and the users-table unread counter changes once per inserted row.
  Polling is read-only and creates no task, outbox, notification, event, ticket
  or counter write.

### `EVENT-CHAT-LIFECYCLE-001` — Unpublish/republish keeps physical event chats and history

- Run this on an event that has already been published and has at least a main
  event chat plus one optional, group or event-service chat. Capture each
  physical `chats` owner-copy `_id`, public `id`, `eventId`, `channelType`,
  `memberIds`, `lastMessage`, unread value and representative persisted message
  IDs before changing the event. Pending Riley remains the negative control and
  must have no unauthorized owner copy or history access.
- Casey Unpublishes once. The event lifecycle write performs one indexed Mongo
  batch over physical `chats` documents with the same `eventId` and sets only
  their denormalized `ownerStatus=DR`. It covers `mainEvent`,
  `optionalSubEvent`, `groupSubEvent` and event-bound `serviceEvent` documents;
  chat list/query code must not join or project the Event collection to derive
  this value.
- Every accepted participant can still open, read and send in the same chat.
  The chat row and opened popup title show one compact contextual
  **Under review** badge. The badge is inline beside the title rather than in
  the right-side control/badge area. Chat IDs, owner-copy IDs, members, message
  history, last message, unread state and authorization remain unchanged.
- Casey Publishes again. The same write path sets all event-bound physical chat
  documents back to `ownerStatus=A`; the **Under review** badge disappears on
  the normal chat refresh. No chat or message is deleted/recreated, no system
  message or unread increment is manufactured, and no cross-event chat is
  touched.
- Compare HTTP/Mongo and frontend-local behavior. Local repository and
  SeedBuilder records must persist `eventId` plus `ownerStatus` on the physical
  chat object and perform the same write-side transition; component-only state
  or read-side event projection is a FAIL.
- This checkpoint may share the same real Unpublish/Publish mutations as
  `EVENT-NOTIFICATION-001`, but its chat-document/history oracle and the
  notification task/inbox oracle are recorded independently.

### `AUTH-SESSION-001` — two-session limit, new-login warning and audit

- Run this as a separate security checkpoint after the active Ticket campaign;
  it must not reuse the Casey/Nova/Riley role-isolation windows as evidence.
  Use three isolated browser profiles to authenticate the **same** controlled
  user from client A, B and C.
- Enforce a maximum of two active server-authoritative sessions per user. This
  is an authentication/session write-side rule, not a frontend counter, query
  projection or local-storage restriction. A reload or token refresh in an
  already registered client must keep the same session slot.
- Login from client A creates the first active session and no remote-login
  warning because no other active session exists. Login from distinct client B
  creates the second active session and exactly one security-warning
  notification for the account. Both A and B remain usable.
- The warning text identifies the normalized client, for example **Chrome on
  Linux desktop**. The notification's own persisted/displayed timestamp is the
  event time; do not duplicate relative wording such as "12 seconds ago" in
  its message. Do not expose a raw user-agent, IP address, token, cookie or
  browser fingerprint in the notification.
- Attempt login from distinct client C while A and B are active. The server
  rejects the third active session, keeps A and B valid, and writes another
  security warning describing the attempted client. After explicitly logging
  out or revoking one existing slot, retry C: it becomes the second active
  session and creates one further new-login warning.
- Persist active-session state separately from an immutable login audit. Each
  explicit login attempt records a new audit row with user ID, opaque
  session/device identifier, normalized device/browser/OS label, provider,
  outcome (`ACCEPTED` or `BLOCKED_LIMIT`), attempt time and the server-known
  source metadata required for investigation. Never persist credentials or
  raw authentication tokens. Refreshes may have their own audit event type but
  must not masquerade as a new-device login or create a warning.
- Verify exact audit cardinality and ordering, no third active session, warning
  delivery/realtime counter convergence in both permitted clients, stable A/B
  sessions after the rejected attempt, and successful C admission only after
  one slot is released. Notifications may be read independently from the
  immutable audit history.

### `LANDING-ELIGIBILITY-001` — browser-coordinate login eligibility

- Run this later in a fresh, unauthenticated browser profile against a
  Firebase-login-enabled environment. An already restored member session skips
  the landing login gate and is not valid evidence. Keep this checkpoint
  separate from offline cached-session behavior.
- The browser Geolocation API supplies the coordinates, but the backend
  `/auth/eligibility` write-free decision is authoritative. For assisted QA,
  use a target-scoped CDP geolocation override and geolocation permission; for
  manual QA use DevTools **More tools -> Sensors -> Location**. Do not change a
  country partition or user record to manufacture the result.
- Eligible branch: override the browser to Budapest (`47.4979, 19.0402`),
  allow location, and reload the landing page. Require
  `eligible=true`, `partitionKey=country:hu`, the security gate enabled and the
  normal login action available. Completing login must retain the resolved
  partition through the ordinary authentication/profile path.
- Not-yet-enabled branch: use a clearly external control outside Hungary's demo
  bounds, London (`51.5074, -0.1278`), in a fresh anonymous context. This is
  not a banned region: it has no enabled `countryPartition` yet. Require
  `eligible=false`, no partition key, the configured country-not-available
  message and an unavailable login path. No user session may be created.
- Permission-denied branch: reset the site's location permission, choose
  **Block**, and reload. The landing page must keep the explicit **Allow
  location** gate and must not silently assume Hungary, submit invented
  coordinates or start authentication. Granting permission afterward must
  retry normally without clearing unrelated landing content.
- Between branches reset only that target's geolocation override, permission
  and landing eligibility/session storage, then prove the next result is not a
  stale prior coordinate. Record the browser-supplied coordinates and the
  server response but no precise location in screenshots beyond the controlled
  QA values.
- Treat browser coordinates as untrusted client input: reject non-finite and
  out-of-range latitude/longitude and do not claim this functional client-side
  gate alone prevents deliberate geolocation spoofing. If eligibility is a
  security boundary, a separately specified server-trusted corroborating
  signal is required.

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

## Operator configuration and security cases

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

### `OPERATOR-PAYMENT-001` — configure and rotate the payment token

Status: **DESIGN CAPTURED / NOT IMPLEMENTED**.

- In a disposable operator deployment, save a valid payment-provider token,
  validate it through the named server-side provider check and activate only
  the verified revision.
- The raw token must never be returned in a row DTO, stored in frontend/local
  cache, written to logs, notifications or audit payloads, or redisplayed after
  save. The UI may expose only masked metadata such as provider, state,
  fingerprint/last characters and updated time.
- Prove invalid-token rejection leaves the prior active revision unchanged.
  Rotate to a second valid token and prove new payment operations use only the
  new revision; then revoke it and prove payment operations fail closed while
  operator recovery remains available through its documented boundary.
- Record an immutable actor/configuration audit for save, validation,
  activation, rotation and revocation without recording either raw token.

### `OPERATOR-PAYMENT-IP-001` — restrict payment access by client IP

Status: **DESIGN CAPTURED / NOT IMPLEMENTED**.

- Configure an explicit server-side IP/CIDR allowlist for payment-token
  management and payment operations. `127.0.0.1` is the required loopback-only
  checkpoint: the same host is accepted and a request whose trusted resolved
  client IP does not match is denied before token access or provider traffic.
- Resolve client IP only through the deployment's trusted proxy chain. A raw or
  spoofed `X-Forwarded-For` value from an untrusted source must not bypass the
  policy; malformed addresses and an empty effective allowlist fail closed.
- Prove the denial is enforced by the backend even when the operator UI/action
  is called directly. Frontend hiding is neither enforcement nor PASS evidence.
- Audit allowed and denied attempts with actor, resolved client IP, policy
  revision and outcome, but never the raw payment token. After restoring the
  prior policy, prove access changes exactly once and no stale browser state
  overrides the authoritative server decision.

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

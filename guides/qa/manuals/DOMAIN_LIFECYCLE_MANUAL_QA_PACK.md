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
- Retained continuation baseline (2026-08-12): **READY**. Guarded `advance`
  moved the active harness pointer from completed `EVENT-TICKET-007` at
  `22:42:44+02:00` without resetting its event or original snapshots. The
  independent follow-up status retained one active Ticketing On event with
  Casey, Nova and Riley accepted, occupancy `3 / 8`, no pending/invited
  members, Nova A ticket `manual-qa-checkpoint:v1:event-domain:ticket` / code
  `TKT-d6bd7582-1849-46bb-ba09-24dd7fb92b44` and Riley A ticket
  `6a7cd3aff8a7d3829acd805a` / code
  `TKT-d05cdd81-86da-430d-b166-b508cccb42c6`; both members retain ticket
  counters `1/1` and Casey remains ticketless. Lina Park resolves as Casey's
  deterministic friend, Liam Parker as the deterministic non-friend, and
  neither has tracked participation on the event. The checkpoint now owns
  their activity snapshots. The previous three browser processes were closed
  before the resource-conscious replacement; isolated Casey-Lina-Liam windows
  are identity-verified with the configured Austin geolocation.
- Unpublish boundary (2026-08-12): **PASS**. Casey selected **Unpublish** once.
  The canonical event retained the same identity and became `status=DR` with
  `visibility=public` and Ticketing still configured On. Casey, Nova and Riley
  stayed accepted at `3 / 8`, with no pending, invited or request membership.
  Nova's exact ticket
  `manual-qa-checkpoint:v1:event-domain:ticket` /
  `TKT-d6bd7582-1849-46bb-ba09-24dd7fb92b44` and Riley's exact ticket
  `6a7cd3aff8a7d3829acd805a` /
  `TKT-d05cdd81-86da-430d-b166-b508cccb42c6` were retained and changed only
  `A -> D`; no replacement ticket appeared. Their ticket counters changed
  `1 -> 0`, Casey remained ticketless, and Lina/Liam retained no participation
  or ticket artifact. Casey's already-open My Events list showed the same one
  draft card without reload. The owning event recompute task completed at
  `2026-08-12T20:55:46.902953153Z`, `attemptCount=2`, with empty `lastError`;
  the affinity worker returned to `pendingCount=0`. The next producer boundary
  is draft **Edit -> Visibility: Friends only -> Save** only. Stop before
  Publish and prove that Save changes only the draft definition plus its normal
  event task while both D tickets, counters and memberships remain unchanged.
- Friends Only draft-Save boundary (2026-08-12): **DOMAIN PASS / NOTIFICATION
  FAIL**. Casey changed only
  visibility from Public to Friends only and pressed Save once. The canonical
  event remained the same `DR` identity with Ticketing configured On and now
  persisted `visibility=Friends only`. Casey, Nova and Riley remained accepted
  at `3 / 8` with no pending/invited/request row. Nova's and Riley's two exact
  tickets above remained `D` with their original ID, code and issue time; no
  replacement appeared, their ticket counters stayed `0/0`, Casey stayed
  ticketless, and Lina/Liam retained neither participation nor ticket artifact.
  Casey's already-open My Events card switched from the Public icon to the
  Friends icon without reload. The Save refreshed the normal deduplicated
  event recompute task, due at `2026-08-12T21:04:44.684364061Z`, with empty
  `lastError`. The existing worker completed it normally at
  `2026-08-12T21:04:50.578245727Z`, `attemptCount=3`, and returned to
  `pendingCount=0`; no manual worker or second process was invoked. The first
  oracle did not yet expose generic definition-change artifacts and therefore
  incorrectly recorded the Save as a full PASS. The strengthened oracle later
  proved that the visibility-only Save also created one completed
  `event-definition-changed:<eventId>` task with false reasons
  `schedule,sub-events`, one unread `event-details-changed` notification for
  Nova and one for Riley, plus their two pending outbox intents. Both rows said
  **The event schedule changed.** This is a real backend write-side
  classification defect; Nova/Riley had no open windows at this boundary, so
  their in-place notification behavior was **NOT EXECUTED**, not UI PASS.
- First Publish boundary (2026-08-12): **SERVER/CASEY PASS; NOVA/RILEY UI NOT
  EXECUTED**. The same event became active with `visibility=Friends only`,
  Ticketing On and unchanged Casey/Nova/Riley accepted membership `3 / 8`.
  Both original D tickets remained. Nova received new A ticket
  `6a7ce077f8a7d3829acd807b` /
  `TKT-f9c24f1f-6b83-4d66-b0db-2bcb1ef2280b`; Riley received new A ticket
  `6a7ce077f8a7d3829acd807d` /
  `TKT-cf9ab939-5da5-4d42-8b13-e5402bf047af`; counters returned to `1/1` and
  Casey remained ticketless. The lifecycle task completed for exactly Nova and
  Riley with reason `modified`, materializing one unread **The event is
  available again.** row per recipient. Casey's already-open My Events card
  stayed in place. Because Nova and Riley were not open, their notification and
  ticket UI convergence is retained only as server evidence and must be
  replayed with Casey/Nova/Riley open.
- Defect fix/replay plan (2026-08-13): Java definition-change comparison now
  canonicalizes legacy/missing frequency to `One-time`, missing slots-enabled
  to `false`, sub-event defaults/lists and event mode before deciding whether a
  schedule/sub-event change occurred. A regression covers a visibility-only
  Save across those legacy-equivalent defaults. Existing backend hot deploy
  compiled successfully and restarted the same server owner; no parallel build
  or server was used. The guarded `prepare-visibility-save-retest` action
  preserves the completed join/approval/membership history, retains every
  physical ticket as D audit history, reconciles ticket/unread counters, removes
  only the failed Save-owned generic task/outbox/notification occurrence and
  re-arms the same draft as Public with the legacy-equivalent defaults. Replay
  with at most three windows at once: Casey/Nova/Riley prove no notification or
  ticket delta on Save and the normal in-place notification/ticket delta on
  Publish; then replace them with Casey/Lina/Liam for Explore friend/non-friend
  reads. Never run five actor windows concurrently on this workstation.
- Guarded repair-replay baseline (2026-08-13): **READY**. The versioned
  `prepare-visibility-save-retest` action completed, and a separate read-only
  status proved the same event at `DR`, Public, Ticketing On with unchanged
  Casey/Nova/Riley accepted membership `3 / 8`, no pending/invited/request
  member, and all four retained Nova/Riley physical ticket records at `D`.
  Nova's and Riley's stored ticket counters are both `0/0`. The failed Save's
  `event-definition-changed` task plus its two `event-details-changed` outbox
  intents and unread notifications are absent, while the earlier real
  under-review/modified lifecycle audit remains. The old browser manifest has
  no live processes; launch exactly Casey/Nova/Riley for the Save/Publish phase,
  and close that trio before launching Casey/Lina/Liam for Explore.
  The replacement launch then identity-verified exactly those three live
  sessions; no fourth QA browser was opened.
- Repair-replay pre-Save UI baseline (2026-08-13): **PASS**. Nova's open
  Notifications > New list shows exactly two unread retained real lifecycle
  rows for the event: **The event is available again.** and **The event is
  under review.** Riley's open New list shows exactly those two plus the prior
  **Your request to join ... was approved.** row, for a total of three. Neither
  list contains the removed false **The event schedule changed.** occurrence.
  Both recipient lists remain open while Casey repeats only the visibility Save.
- Fixed visibility-only Save replay, immediate boundary (2026-08-13): **PASS**.
  Casey issued exactly one `POST /api/activities/events/sync` at
  `01:13:16+02:00`. The same event is `DR`, Friends only and Ticketing On with
  unchanged accepted membership `3 / 8`; all four retained physical tickets
  remain `D`, and Nova/Riley ticket counters remain `0/0`. No new
  `event-definition-changed` task, `event-details-changed` outbox intent or
  notification was created. Nova's already-open New list stayed at the exact
  same two rows, and Riley's stayed at the exact same three rows without reload
  or reopen. Casey's My Events list retained the one `3 / 8` draft card. The
  normal Save-owned event recompute task completed `done` at
  `01:16:46+02:00`, attempt `5`, with empty `lastError`; the post-worker oracle
  retained the exact same tickets, counters and lifecycle artifacts. The fixed
  visibility-only Save replay is therefore full **PASS**.
- First repair-replay Publish instruction (2026-08-13): **NOT EXECUTED /
  FIXTURE TIMING INVALID**. The retained event's original end was `01:18` local.
  Casey's already-open Upcoming/My Events poll returned the one card through
  `01:17:55`, then changed to the empty response exactly at `01:18:25`; the
  `01:19:17` screenshot shows the resulting empty list. Access logs contain no
  Publish mutation, and the persisted oracle remained `DR`, Friends only with
  four D tickets, counters `0/0` and unchanged lifecycle notifications. This is
  not a product failure and the proven Save is not replayed.
- Stable Publish/Explore fixture repair (2026-08-13): **READY**. The guarded,
  one-shot `prepare-visibility-publish-window` action first required the exact
  clean post-Save transaction boundary, including terminal recompute and absent
  false notification artifacts. It then moved all three event projections to
  `2026-08-13T11:22:23.404Z` through `2026-08-14T11:22:23.404Z`, retaining
  every membership, ticket, counter and lifecycle artifact. Independent status
  proved that state. Casey's same open Upcoming/My Events list regained exactly
  one `3 / 8` card on its normal poll without reload; Nova remained at New `2`
  and Riley at New `3`. Publish may now be executed once from this card.
- Clean Publish replay, immediate boundary (2026-08-13): **PASS**. Casey sent
  exactly one `POST /api/activities/events/publish` at `01:25:27+02:00`. The
  same event became A/Friends only/Ticketing On with unchanged accepted
  membership `3 / 8`. All four D audit tickets remain. Nova received new A
  ticket `6a7d00e7f8a7d3829acd8084` /
  `TKT-98fa21bc-abd4-4240-873d-09b83c4f3b3c`; Riley received new A ticket
  `6a7d00e7f8a7d3829acd8085` /
  `TKT-0cbd5e00-4694-4408-95bf-d21018128526`; their stored ticket counters are
  `1/1` and Casey remains ticketless. Lifecycle task
  `6a7d00e7f8a7d3829acd8082` completed for exactly Nova/Riley with reason
  `modified`, producing one new unread **The event is available again.** row
  per recipient. Nova's already-open New list changed `2 -> 3` and Riley's
  `3 -> 4` in-place, while each top Ticket counter changed `0 -> 1`, all without
  reload. Casey retained one active `3 / 8` My Events card. Nova and Riley then
  closed only Notifications and opened Ticket without reload; each Upcoming
  list showed exactly one `QA EVENT-TICKET-007` ticket card. The normal event
  recompute completed `done` at `01:28:52+02:00`, attempt `6`, with empty
  `lastError`; its terminal oracle retained the exact six-ticket audit,
  counters and lifecycle notifications. The Casey/Nova/Riley Save/Publish
  replay is full **PASS**. Close that entire managed trio before opening the
  separate Casey/Lina/Liam Explore phase.
- Explore phase replacement/baseline (2026-08-13): **READY**. The exact
  manifest PIDs for Casey/Nova/Riley were validated, terminated and proven
  absent before any replacement launch. Resources were checked, then exactly
  three new configured sessions were started and identity-verified as Casey,
  Lina and Liam; no fourth QA window runs. The pre-read oracle retains the
  active Friends-only Ticketing On event at `3 / 8`. Lina is the deterministic
  Casey-friend and Liam the deterministic non-friend; neither has membership,
  tracked participation or a ticket on this event. Lina begins at Events `6`,
  tickets `0`, event buckets all `10` / active `6` / pending `1` / invitations
  `2` / hosting `1`. Liam begins at Events `9`, tickets `0`, event buckets all
  `12` / active `9` / pending `2` / invitations `0` / hosting `1`. The normal
  event recompute remains terminal `done`. Lina and Liam may now open Event
  Explore without changing filters or selecting a card.
- Explore list boundary (2026-08-13): **PASS**. In the two already-open Event
  Explore lists, Lina saw `QA EVENT-TICKET-007` exactly once with Friends-only
  presentation and Liam did not see the event at all. Neither actor changed a
  filter or opened a card. The immediate read-only oracle retained Lina and
  Liam as external controls with no membership, invitation, ticket or counter
  delta, and retained Casey/Nova/Riley membership `3 / 8`, the six-ticket
  audit and the terminal recompute task unchanged.
- Direct-detail boundary and repair (2026-08-13): **FAIL -> FIXED -> FOCUSED
  REPLAY PASS**. Before the repair, Liam's direct
  `/api/activities/events/detail` request returned the complete Friends-only
  event DTO even though the Explore list correctly excluded him. The first
  wrong boundary was the Java detail read: it selected and mapped the canonical
  record without enforcing the same external-viewer visibility rule used by
  Explore. `ActivitiesEventsService` now authorizes detail reads for an Admin
  or tracked participant, and otherwise reuses the canonical published
  Public/Friends-only/Invitation-only boundary used for untracked Explore
  viewers. Regression sources cover Lina/Liam Friends-only parity and retained
  participant access to an Invitation-only event. The existing backend owner
  compiled the source with `BUILD SUCCESSFUL` and performed one healthy Spring
  restart; no parallel Gradle, test or server process was started. Focused HTTP
  replay returned `200 / 0 bytes` for Liam and the complete same-event DTO for
  Lina as friend, Nova as accepted participant and Casey as Admin. The terminal
  Docker-backed status oracle again proved no read-side write: memberships,
  tickets, counters, lifecycle artifacts and recompute state remained exactly
  unchanged. `EVENT-VISIBILITY-001` is therefore **PASS / CLOSED**.

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
- Clean retest restaged on 2026-08-13 at `2026-08-13T13:03:40.831Z` and matched
  by a second read-only status: exactly one `DR` draft `QA
  EVENT-PUBLISH-CHAT-001`; Casey is the sole accepted Admin, Nova and Riley are
  pending invitees, occupancy is 1/8 plus pending 2. Event chats, messages,
  chat notifications/outbox/tasks are empty. For every actor, `chats`,
  `chat.all` and `chat.event` are zero and every captured action delta is zero.
  Three isolated sessions are open.
- Pre-Publish baseline **PASS** on 2026-08-13: Casey, Nova and Riley each opened
  Activities -> Chats -> All and the controlled event was absent from every
  list. Read-only DOM inspection also found zero occurrences of the title in
  all three sessions. Casey then closed only the Chats popup while Nova and
  Riley left Chat All open. The immediate persisted oracle still reported the
  event as `DR`, with zero event chats, messages, chat notification outbox and
  chat notifications; all three users retained `chats=0`, `chat.all=0` and
  `chat.event=0`, with zero action delta. No Publish has yet been issued.
- Publish counter branch **FAIL** on 2026-08-13: the user sampled Publish both
  from My Events and from Drafts. From My Events the counters appeared correct.
  From Drafts the row and Drafts count decreased immediately, but the
  draft-inclusive My Events counter disappeared and returned only after My
  Events was clicked and its list loaded. The invariant is: Publish changes
  `Drafts 1 -> 0`, while My Events remains `1` from either producer surface.
  The repeated lifecycle sampling means this fixture is no longer admissible
  as the final clean oracle, but the UI failure is decisive.
- The immediate persisted inspection after those samples retained one active
  event and exactly one Casey main-event chat with unread `0`, no chat message,
  no chat notification outbox and no chat notification. It also showed the
  expected extra lifecycle artifacts caused by the repeated Unpublish/Publish
  samples, so a clean restage is required before the final chat proof.
- ROOT CAUSE / FRONTEND FIX: removing the published row from Drafts can emit a
  SmartList state whose query still names the previous `my-events` scope. The
  Activities popup accepted that stale `total=0` as the My Events bucket count;
  the later operation-owned `drafts=-1` delta correctly changed only Drafts and
  therefore could not restore My Events. The popup now accepts a list total
  only when its query primary filter and event scope exactly match the current
  selection. The shared SmartList is unchanged. Matching, stale-scope and
  loading/calendar policy regressions were added. The existing Angular watcher
  rebuilt successfully in 6.6 seconds and hot-synced the new bundle; no second
  build or test process ran.
- FRONTEND CAUSAL REPLAY **PASS**: with My Events loaded at `1`, switching to
  Invitations and back produced the SmartList's normal transient reset totals,
  but neither reset changed the stored Invitations `3` or My Events `1` bucket.
  Each completed matching load then retained its authoritative server total.
  This used the hot-deployed bundle and changed no domain data.
- CHECKPOINT BASELINE DEFECT / HARNESS FIX: the earlier stage helper recomputed
  only Casey Hosting and Drafts while preserving stale global Invitations and
  All values. A correct Publish-side Java recompute therefore looked like an
  unrelated `+3` action delta. Direct authenticated list loads proved those
  three invitations were legitimate pre-existing events. The fixture now
  mirrors the complete Java event-counter projection for every controlled
  actor before capturing the action baseline; production Java was not changed.
- CLEAN FIX REPLAY BASELINE: the contaminated fixture was reset, independently
  verified `not-staged`, then staged again at `2026-08-13T14:02:06.075Z`.
  Persisted state is exactly one `DR` event. Casey is All `4`, Invitations `3`,
  My Events/Hosting `1` and Drafts `1`; Nova and Riley are pending fixture
  invitees but correctly remain at zero active-event invitation counters until
  Publish. Chats/messages/chat notifications, lifecycle artifacts and every
  captured action delta are zero. Only the short Draft Publish counter branch
  is next; the already-proven Chat All baseline is not repeated.
- CLEAN DRAFT PUBLISH COUNTER REPLAY **PASS**: Casey published exactly once at
  `2026-08-13T14:12:42Z`. Without reload or a My Events click, Drafts changed
  `1 -> 0` while My Events remained `1`; later switching among event buckets
  retained the correct menu counts. Read-only client state and MongoDB agree:
  Casey is All `4`, Invitations `3`, Hosting/My Events `1`, Drafts `0`, and the
  only Casey action delta is `eventDrafts=-1`.
- EXPECTED IN-PLACE INVITATION CONVERGENCE: after Publish, Nova and Riley each
  changed from Invitations `0 -> 1` and received exactly one `event-invite`
  notification for the controlled event. Those two later-visible entries are
  the staged draft invitees becoming active-event invitations through normal
  client polling; Casey stayed at his three unrelated pre-existing invitations
  and no duplicate invitation was persisted.
- The same immediate oracle contains exactly one Casey-owned main-event chat
  with unread `0`, no chat message/outbox/notification, and zero chat-counter
  delta for all three actors. The normal recompute completed `done` at
  `2026-08-13T14:16:28.796916646Z`, attempt `1`, empty `lastError`, without
  changing that oracle. The remaining manual step is the three-client
  post-Publish chat-list visibility check; do not repeat Publish or the counter
  branch.
- THREE-CLIENT CHAT VISIBILITY **PASS** at 16:19 local: Casey Chats > All
  displayed `QA EVENT-PUBLISH-CHAT-001` exactly once, while Nova and Riley
  Chats > All both displayed no items. The immediate persisted oracle remained
  one Casey-only main-event chat with unread `0`, no messages, chat outbox or
  chat notifications, and zero chat attention/action deltas for every actor.
  Opening the Casey row and observing the empty channel is the only remaining
  pre-reload UI check.
- EMPTY CHANNEL **PASS**: Casey opened the single event-chat row and the UI
  displayed `No messages yet` / `Start the conversation`. Read-only browser
  state and MongoDB agreed on one member (Casey), unread `0`, no messages,
  chat outbox or chat notifications, and zero Chats/All/Event attention delta
  for Casey, Nova and Riley. Only Casey reload parity remains for this Publish
  branch.
- RELOAD PARITY **PASS / CHECKPOINT CLOSED**: after one Casey-only reload, the
  client restored Chats `0`, Invitations `3`, My Events `1` and Drafts `0`,
  and retained the same single empty event chat. The terminal database oracle
  remained bit-for-bit equivalent for the controlled event, chat, message,
  notification and counter identities. Keep the fixture only for the guarded
  `EVENT-INV-003` continuation; do not repeat Publish or reconstruct this
  baseline.

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

Baseline evidence on 2026-08-13:

- The versioned fixture staged at `2026-08-13T19:44:57.209Z` with canonical
  event/source ID `manual-qa-checkpoint:v1:event-domain:event`, title
  `QA EVENT-LIFE-002`, status `A`, `published=true`, public/Open visibility and
  no suppression fields. Casey is the accepted Admin/owner and Nova is the
  single accepted Member; capacity is `2/8` including Casey's canonical admin
  membership.
- No ticket, payment, lifecycle task/outbox/notification, recompute task or
  event chat existed at baseline. The affinity worker was completed with
  pending count `0`; notification-outbox was also at pending count `0` for this
  fixture boundary. Two managed browser sessions, Casey and Nova, replaced the
  prior consent session.
- FAIL before the producer action: after reload Casey's main menu showed no red
  My Events counter; it appeared only after the popup loaded. Direct
  `/api/auth/me` evidence agreed, returning top-level `hosting=0` and an all-zero
  nested event counter. The event and membership were present, so this was a
  fixture write/projection omission rather than a SmartList race or Trash
  defect.
- The lifecycle stage now snapshots Casey/Nova activities and invokes the
  existing canonical event-counter projection after inserting its controlled
  event. A guarded repair captured the two missing reset snapshots and applied
  that same projection to the live untouched baseline without changing the
  event or SmartList. The post-repair reload source returns Casey
  `hosting=1`, `event.all=1`, `event.hosting=1`; Nova returns `events=1`,
  `event.all=1`, `event.active=1`, with identical `counterOverrides`.
- Focused reload/list replay: **PASS**. Before either popup query could repair a
  display value, Casey's main My Events and Nova's main Events controls each
  showed red counter `1`. The subsequently opened My Events and Active Events
  lists contained the same `QA EVENT-LIFE-002` identity exactly once.
- The first card oracle exposed a second fixture inconsistency: the fixture had
  inserted Casey's accepted Admin membership but omitted Casey from the
  event's embedded `acceptedMemberUserIds`, so both cards initially showed
  `1 / 8`. The shared fixture event builder now always includes the canonical
  creator/Admin in its accepted projection. Guarded repair changed only the
  staged embedded occupancy to Casey+Nova `2 / 8`; both already-open lists
  converged to `2 / 8` through their normal popup poll without reload, while
  the two membership records and SmartList implementation stayed unchanged.
- Pre-action code review found a real backend projection defect: a globally
  trashed organizer event would have incremented every accepted participant's
  personal Trash counter although participant Trash is reserved for an
  explicitly deleted membership and its list would remain empty. The common
  `UserActivityCountersService` projector now gives global-event Trash only to
  an organizer/admin and continues to count explicit deleted memberships for
  participants. A focused regression source covers the accepted-participant
  exclusion; the existing dev owner compiled the Java change with `BUILD
  SUCCESSFUL` and Spring restarted healthy without a parallel build.
- The exact producer attribution boundary was captured at
  `2026-08-13T20:16:21.233Z`: active/public `A`, no suppression, Casey+Nova
  `2 / 8`, two unchanged accepted memberships, Casey counters Hosting/All
  `1/1`, Nova Active/All `1/1`, and zero lifecycle task/outbox/notification.
  One already-completed pre-action recompute from the earlier read/location
  boundary is retained in the baseline and must not be attributed to Trash.
  Casey's one **Delete Event** action is next; Nova must not interact.
- **NOT EXECUTED / AI runtime failure before the producer:** neither the user
  nor Codex activated Delete Event, and the persisted oracle remained the
  exact active/public action baseline. During the preceding Java hot deploy,
  Gradle's existing continuous `classes` owner temporarily removed compiled
  classes and Spring DevTools restarted before the build had recreated the
  controller set. Consequently `/api/activities/events/filter` returned `404`;
  the open Casey and Nova popup polls then showed an empty page and zeroed the
  visible bucket badges. This disappearance is not a user Trash action and
  contributes no product-transition evidence.
- The runtime owner is repaired without changing SmartList: DevTools now uses
  a `.reloadtrigger` that the existing `classes` task touches only after a
  successful owner build. The event HTTP adapter now preserves transport/server
  failure as an error, while a successful `200` empty page remains a real empty
  result, so the SmartList scheduler can retain its last good snapshot and
  retry. The frontend owner build completed successfully; only the existing
  backend container was restarted after a RAM/swap/CPU check.
- Focused pre-action recovery **PASS without reload or user interaction**:
  both authenticated list endpoints returned the same active/public event at
  `2 / 8`, then the already-open Casey My Events and Nova Active Events lists
  recovered through their normal poll. Casey again showed My Events `1`; Nova
  showed Events/Active Events `1`. The saved action baseline remains the sole
  producer attribution boundary, and Delete Event is still the next action.
- Producer and foreground removal **PASS** at
  `2026-08-13T20:40:43.192579877Z`: the user activated Casey's card
  **Delete Event** confirmation exactly once. Without reload, Casey My Events
  removed the card through the producer response and Nova Active Events removed
  it through the already-open popup's normal foreground poll; their visible
  active/hosting counters became zero. Casey's organizer Trash `+1` timing was
  not watched at the action boundary, so action-delta versus later-poll
  presentation is explicitly **NOT EXECUTED**, not retroactive PASS; the whole
  checkpoint is not replayed solely for this missed observation.
- The versioned terminal verifier passed at
  `2026-08-13T20:46:09.146Z` against the retained action baseline: canonical
  status `T`, `statusBeforeSuppression=A`, one post-baseline `trashedAtIso`,
  unchanged Casey Admin plus Nova Member audit rows and `2 / 8` occupancy.
  Casey finished Hosting/All/Hosting-bucket `0/0/0` and organizer Trash `1`;
  Nova finished Events/Active/All/Trash `0/0/0/0`, proving organizer Trash did
  not become personal participant Trash.
- Exactly one completed `deleted` lifecycle task targeted Nova and created one
  unread `event-deleted` Notification Center row. Dev mode retained exactly one
  matching `pending` Firebase outbox record because Firebase delivery is
  disabled; Casey received neither. The pre-action recompute identity gained
  the sole `EVENT_CHANGED` reason and completed `done` on attempt `2` with no
  error. The reusable oracle now exposes canonical `isTrashed/published` from
  status, `trashedAtIso`, `event-deleted` notification/outbox and a guarded
  `verify-lifecycle-trash` command.
- Organizer Trash UI read **PASS**: Casey switched the still-open Events popup
  to Trash and saw exactly one `QA EVENT-LIFE-002` card. This proves the later
  authoritative Trash read only; the unobserved immediate Trash `+1` timing
  remains **NOT EXECUTED**.
- Participant foreground poll scope **FAIL, FIX COMPILED / RUNTIME REPLAY
  PENDING**: Nova's already-open Active Events list removed the card and set
  Active/Events to zero, but the inclusive All menu counter incorrectly stayed
  at `1`. Switching to All returned an empty list and only that All query then
  corrected the menu counter to `0`. The persisted Java oracle had already
  stored Active/All `0/0`, so the defect was the frontend applying only the
  currently queried bucket total.
- Correct-scope repair keeps SmartList unchanged and does not project counters
  from query results. Every Java event-list page now carries the complete
  `users.activities.event` snapshot already materialized by the owning write;
  both HTTP and frontend-local adapters transport the same contract, and the
  foreground popup applies the snapshot atomically to Events, Invitations,
  My Events and all nested event buckets. Legacy responses without a snapshot
  retain the current-bucket fallback. The existing backend runtime returns Nova
  All `total=0` plus the full all-zero snapshot and Casey Trash `total=1` plus
  `trash=1`; the existing frontend watcher compiled and synced the new bundle.
  Regression sources cover HTTP mapping and the Active-zero/All-stale store
  transition. No separate build or SmartList-core change was made.
- Remaining UI proof before closing this checkpoint: Nova opens Notifications
  **New** and sees the one unread deletion row without opening/marking it read.
  A later fresh-bundle/read branch must reconstruct the same bucket ownership;
  `EVENT-LIFE-003` Restore provides the focused inverse runtime replay that an
  open event bucket receives the complete counter snapshot without repeating
  this Delete producer.

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

- Prepare the required isolated browser actors with
  `guides/qa/tools/open-checkpoint-browser-sessions.sh EVENT-TICKET-005`. The
  checkpoint configuration opens Casey, Nova and the isolated Riley control,
  uses separate ephemeral
  Chrome user-data directories, installs the exact demo sessions through the
  browser debugging endpoint and loads `/game`. No Google profile name or
  directory is stored in the repository. Re-running the command replaces only
  this checkpoint's previous managed windows; stale sessions and Chrome's
  Restore prompt cannot select a different MyScoutee actor.
- Stage a **Public**, published, Ticketing On event that requires admin
  approval. Casey is the only accepted Admin; Nova is not yet a member and has
  no ticket or stored ticket counter.
- As Nova, find the event through Event Explore and choose Join. Require one
  pending membership with `requestKind=approval` and `pendingSource=member`, while
  both `users.activities.tickets` and
  `users.activities.asset.tickets` remain `0` and no physical ticket exists.
  Within one notification poll Casey receives one new event-admin row for this
  action, with Nova as sender and the contextual **Pending** badge. Nova does
  not receive her own admin-facing row.
- Before cancelling, leave Nova's approval-pending checkout basket visible and
  reload Explore once. The Public event card must remain present because the
  basket is still displayable; its menu must still show the orange warning-tone
  **Continue booking** action together with the other contextual actions. This retention is owned by the
  visible basket state, not by the physical member's `pending` status. The
  Explore response obtains all matching basket result states in one indexed,
  field-limited batch query and must not load one basket or a full member
  snapshot per card.
- Before admin approval, Nova opens the pending participation and chooses
  **Cancel request**. The visible pending projection is removed and occupancy
  returns from `1 pending / 8` to `0 pending / 8`; the physical membership is
  retained only as a `suppressed` audit record with its previous pending state,
  and Nova's own event overlay is retained as `status=T`. Nova's pending
  activity counter/list entry disappears and both ticket counters remain `0`.
  Without closing Explore or reloading, the same card menu changes from
  **Continue booking** to the fresh **Join/Book** action. The next server
  Explore response exposes `currentUserMembershipStatus=none` for Nova and no
  checkout basket/session; a clean reload must preserve that fresh action.
  No ticket, active participant overlay, chat owner copy or acceptance
  notification may be created by cancellation. Casey instead receives a
  separate new event-admin notification row with Nova as sender and the
  contextual **Cancelled** badge. The Public event remains discoverable.
  Treat the resulting UI behavior as two separate tests inside this same
  checkpoint, not as two new checkpoint rows:
  1. **In-place signal test:** without reload, the same Explore card changes
     from **Continue booking** to fresh **Request Join**, and only that event's
     pending Activity row is removed.
  2. **Reload reconstruction test:** after the in-place result is observed, one
     clean Explore reload reconstructs the same visible card and fresh
     **Request Join** action from `currentUserMembershipStatus=none` plus no
     active/displayable basket; it creates no membership, basket, notification
     or ticket write.
- Nova chooses Join again. This creates exactly one new pending member-origin
  request by reopening the suppressed pending audit record and its activity
  projection, never resurrects it as accepted and does not reuse an old basket,
  checkout session or policy selection. It creates another new **Pending**
  notification occurrence for Casey and still creates no ticket. Continue the
  approval proof from this second request.
- As Casey, approve Nova once through **My Events** ->
  `QA EVENT-TICKET-005` -> the capacity/Members badge -> **Nova Social** row ->
  **Open actions for Nova Social** -> **Approve** -> the **Approve request?**
  confirmation's **Approve** button. Notifications are evidence only; their
  row menu does not own membership approval. This is the terminal transition
  directly to accepted; there is no second participant-acceptance step. The
  approval write creates exactly one Nova participant overlay and one physical
  `status=A` ticket. Treat basket finalization as a separately named, short
  test inside this same approval transaction:
  3. **Terminal approval basket-closure test:** the approval boundary must make
     the current attempt non-active/non-displayable while retaining its
     physical audit identity; the earlier Cancel audits remain byte-for-byte
     unchanged. An accepted member with an issued ticket must never retain an
     active `approval-pending` reservation.
- Nova's normal poll exposes Ticket counter `1`; opening Ticket twice reads the
  same ID/code. Before approval and during both reads, no credential may be
  created.
- Casey and every other Admin remain without a participant ticket.
- Active clean-chain evidence (2026-08-12, **IN PROGRESS**): the replayable
  Casey-only baseline was independently staged and verified before browser
  launch. Nova's first Join created exactly one member-origin approval-pending
  membership, one physical `approval-pending` basket, one Casey **Pending**
  notification, pending activity `1`, ticket counters `0/0` and no physical
  ticket. The required pending Explore reload, plus one repeated operator
  reload, retained the same card/basket/notification identities and created no
  write. The first Cancel changed Nova's membership to `suppressed`, retained
  her overlay as `status=T`, changed pending activity `1 -> 0` and trash
  `0 -> 1`, returned occupancy to `1 accepted + 0 pending / 8`, created exactly
  one separate Casey **Cancelled** notification and left every ticket/counter
  at zero. The old physical basket row remains under the same ID only as
  `status=cancelled`, `resultState=deleted`; "no basket" in the Explore
  contract means no active/displayable/continuable basket, not deletion of its
  audit row. Both Cancel UI tests passed independently: the same card first
  changed in place to fresh **Request Join** without reload, then the
  post-Cancel Explore reload reconstructed that same state. The reload retained
  the same suppressed membership, cancelled/deleted basket audit and two Casey
  notifications and created no ticket or counter. Still required before
  closing this checkpoint: the remaining
  re-Join/Cancel/re-Join identity and ID-scoped removal checks, terminal Casey
  approval and repeated ticket-read purity.
- First re-Join basket-identity evidence (2026-08-12): **FAIL**. The re-Join
  correctly reopened Nova's suppressed membership as one member-origin
  approval-pending request, restored pending activity `0 -> 1`, returned
  occupancy to `1 accepted + 1 pending / 8`, created a second distinct Casey
  **Pending** notification and kept every ticket plus both ticket counters at
  zero. However, it changed the previously cancelled/deleted basket with ID
  `6a7c8b74d0e43ceb2c03f170` back to
  `status=approval-pending`, `resultState=pending` instead of creating a new
  basket identity. This violates the explicit re-Join contract even though the
  reopened popup correctly showed **Continue booking** and **Cancel waiting**.
  Stop before the second Cancel or approval. Diagnose/fix the owning re-Join
  basket persistence boundary, then replay the complete checkpoint from a
  clean staged baseline; do not accept this partially mutated attempt.
- Owning-contract diagnosis (2026-08-12): the backend `saveBasket` stale-marked
  the active row, then upserted by `(userId, sourceId, itemId)`, while the same
  tuple also had a globally unique index. This necessarily reactivated the
  cancelled audit row. The original local adapter establishes the intended
  contract: every `saveBasket` turns prior display items into `deleted` audit
  versions and appends fresh incoming records; only `updateBasketState` mutates
  the current active record. The server fix therefore makes every save create
  a fresh physical `_id`, retains state changes on the active record, migrates
  existing rows to an explicit `reservationActive` lifecycle field and replaces
  the global tuple uniqueness with a partial unique index applying only while
  `reservationActive=true`. The checkpoint oracle now exposes that field.
  Existing hot-deploy compilation and restart passed, and the live database
  exposes only the new partial unique index. A source regression records the
  every-save-new-identity and Cancel-closes-active-slot contracts; per the
  active-session resource rule no separate build is used. Clean checkpoint
  replay remains required before the defect can be marked fixed.
- Repair-replay baseline (2026-08-12): the versioned reset restored the failed
  transaction, a fresh image-qualified stage completed, and a second read-only
  oracle independently proved the Casey-only baseline: one accepted Admin,
  Nova outside membership, no basket, notification or ticket, and Nova
  event/ticket counters all zero. The three canonical managed actor windows
  were replaced and identity-verified. Begin again at the first Nova Join.
- Repair replay — first Join (2026-08-12): **PASS**. Nova created one
  member-origin approval-pending membership and the new physical basket
  `6a7c9690f8a7d3829acd7ffa` with `status=approval-pending`,
  `resultState=pending` and `reservationActive=true`. Occupancy is exactly
  `1 accepted + 1 pending / 8`, Nova pending activity is `1`, Casey has one
  distinct Pending notification, and no ticket or ticket counter exists. Stop
  before reload; the pending Explore reload is the next separate read test.
- Repair replay — pending Explore reload (2026-08-12): **PASS**. The card
  retained **Continue booking** and its contextual actions, while the persisted
  basket remained exactly `6a7c9690f8a7d3829acd7ffa` with unchanged create and
  update timestamps. The single pending membership, Casey Pending notification,
  Nova counters and zero ticket/counters were also byte-for-byte equivalent at
  the oracle boundary. First Cancel in-place is next.
- Repair replay — first Cancel in-place (2026-08-12): **PASS**. Without reload,
  the same card changed **Continue booking -> Request Join**. The persisted
  basket kept ID `6a7c9690f8a7d3829acd7ffa` only as a `cancelled/deleted`
  audit with `reservationActive=false`; Nova became suppressed, occupancy
  returned to `1 + 0 / 8`, pending changed to `0`, trash to `1`, and Casey now
  has exactly the original Pending plus one distinct Cancelled notification.
  Tickets and both ticket counters remain zero. Post-Cancel reload is next.
- Repair replay — first post-Cancel reload (2026-08-12): **PASS**. The card
  reconstructed fresh **Request Join** and the read-only oracle was identical
  to the first Cancel boundary: audit `6a7c9690f8a7d3829acd7ffa` retained its
  exact timestamps and `reservationActive=false`; membership stayed suppressed,
  counters stayed pending `0` / trash `1`, Casey retained exactly Pending plus
  Cancelled, and tickets/counters remained zero. First re-Join is next and must
  append a distinct physical basket while leaving this audit closed.
- Repair replay — first re-Join identity (2026-08-12): **PASS / FIX VERIFIED**.
  The closed audit `6a7c9690f8a7d3829acd7ffa` and its timestamps remained
  unchanged, while re-Join appended the distinct physical basket
  `6a7c9847f8a7d3829acd8002` as `approval-pending/pending` with
  `reservationActive=true`. Nova again has exactly one pending member-origin
  approval membership and pending counter `1`; Casey's ordered notifications
  are Pending, Cancelled, Pending. Occupancy is `1 accepted + 1 pending / 8`
  and all tickets/counters remain zero. This closes the historical basket-ID
  defect proof; the full checkpoint remains in progress at second Cancel.
- Repair replay — second Cancel in-place (2026-08-12): **PASS**. The same card
  changed **Continue booking -> Request Join** without reload. Both physical
  basket attempts remain present as distinct closed audits: the first
  `6a7c9690f8a7d3829acd7ffa` stayed unchanged, while the second
  `6a7c9847f8a7d3829acd8002` transitioned to `cancelled/deleted` with
  `reservationActive=false`. Nova is suppressed with pending `0` / trash `1`,
  Casey's ordered notification sequence is Pending, Cancelled, Pending,
  Cancelled, and tickets/counters remain zero. The second post-Cancel reload is
  next as its separate reconstruction/read-purity test.
- Repair replay — second post-Cancel reload (2026-08-12): **PASS**. The card
  reconstructed **Request Join** while both closed audit IDs and all their
  timestamps remained unchanged. Nova stayed suppressed with pending `0` /
  trash `1`; Casey retained exactly four ordered Pending/Cancelled
  notifications; tickets and ticket counters stayed zero. The final Join is
  next and must append the third distinct physical basket before approval.
- Repair replay — final Join (2026-08-12): **PASS**. A third distinct physical
  basket `6a7c996af8a7d3829acd8007` was appended as
  `approval-pending/pending`, `reservationActive=true`; both older basket IDs
  remained immutable closed audits. Nova again has exactly one pending
  member-origin approval and occupancy is `1 accepted + 1 pending / 8`.
  Casey's five ordered notifications are Pending, Cancelled, Pending,
  Cancelled, Pending. No Join produced a physical ticket or either ticket
  counter. Casey's single terminal approval is next.
- Repair replay — terminal Casey approval (2026-08-12): **FAIL / PARTIAL DOMAIN
  SUCCESS**. The owning `POST /api/activities/events/members/action` returned
  `200`; Nova transitioned directly to accepted, occupancy became exactly
  `2 accepted + 0 pending / 8`, her activity counters became active `1` /
  pending `0`, and exactly one physical `status=A` ticket
  `6a7c9b3ff8a7d3829acd8013` with code
  `TKT-7b0475a4-136d-427c-beb8-b99bccb66fa6` was created. Nova's stored ticket
  counters are `1 / 1`; Casey remains `0 / 0`, no second controlled ticket
  exists and Riley was untouched. However, the current basket
  `6a7c996af8a7d3829acd8007` incorrectly remained
  `approval-pending/pending`, `reservationActive=true`; the first two Cancel
  audits remained correctly closed. This fails the separately named
  **Terminal approval basket-closure test** and leaves the full checkpoint
  open. Diagnose and fix basket finalization at the approval-owning domain
  boundary, then replay the complete checkpoint from its canonical baseline;
  do not continue to Ticket reads from this inconsistent state.
- Terminal basket-closure repair (2026-08-12): **IMPLEMENTATION UPDATED / CLEAN
  REPLAY REQUIRED**. The owning `ActivitiesMembersService` now finalizes active
  checkout reservations for every newly accepted event member before ticket
  synchronization, including direct joins, member actions, replace flows and
  creator-membership repair. `EventCheckoutBasketService` targets only
  `reservationActive=true` records and transitions them to
  `approved/succeeded`, clears reservation/pending tracking and leaves every
  already-closed audit untouched. The HTTP join orchestrator delegates to the
  same idempotent finalizer. Local-mode member acceptance now enforces the same
  invariant using a reservation-only repository update. Backend main-source
  hot deploy finished `BUILD SUCCESSFUL` and restarted healthy; the frontend
  watcher generated the complete bundle successfully. Source regressions cover
  active-slot-only finalization and basket-finalization-before-ticket ordering.
  Per the dev-stack resource rule no separate build/test process was started.
  This evidence does not replace a clean full checkpoint replay.
- Terminal basket-closure repair replay baseline (2026-08-12): the versioned
  reset removed the inconsistent approval attempt, `status` proved
  `phase=not-staged`, and a fresh image-qualified stage plus an independent
  second status read proved the canonical Casey-only baseline. Casey is the
  sole accepted Admin at `1 + 0 / 8`; Nova has no membership, basket,
  notification, ticket or activity/ticket counter; the ticket collection is
  empty. The launcher replaced only this checkpoint's managed Casey, Nova and
  Riley windows and verified all three identities. Begin the complete replay
  again at Nova's first Join; no prior boundary may be skipped.
- Terminal basket-closure repair replay — first Join (2026-08-12): **PASS**.
  Nova created exactly one member-origin approval-pending membership and one
  new physical basket `6a7c9fdbf8a7d3829acd8028` with
  `status=approval-pending`, `resultState=pending` and
  `reservationActive=true`. Occupancy is `1 accepted + 1 pending / 8`, Nova's
  pending activity is `1`, Casey has exactly one action-owned Pending
  notification, and no ticket or ticket counter exists. The pending Explore
  reload is next and must retain this exact basket identity and timestamps
  without writes.
- Terminal basket-closure repair replay — pending Explore reload (2026-08-12):
  **PASS**. The UI retained the event card and orange **Continue booking** with
  its other contextual actions. The read oracle retained basket
  `6a7c9fdbf8a7d3829acd8028` with exact original
  `createdAtIso=2026-08-12T16:31:14.482Z` and
  `updatedAtIso=2026-08-12T16:31:23.092826959Z`; the pending membership and
  Casey notification identities also remained unchanged. No ticket or counter
  appeared. First Cancel in-place is next.
- Terminal basket-closure repair replay — first Cancel in-place (2026-08-12):
  **PASS**. Without reload, the same Explore card changed from **Continue
  booking** to fresh **Request Join**. Basket
  `6a7c9fdbf8a7d3829acd8028` retained its original identity and
  `createdAtIso=2026-08-12T16:31:14.482Z`, then closed as
  `status=cancelled`, `resultState=deleted`, `reservationActive=false` at
  `updatedAtIso=2026-08-12T16:35:47.888144723Z`. Nova's physical membership
  is suppressed, occupancy returned to `1 accepted + 0 pending / 8`, and her
  activity counters are pending `0` / trash `1`. Casey has exactly the
  original Pending notification plus one Cancelled notification created at
  `2026-08-12T16:35:47.863869161Z`. No ticket or ticket counter exists. The
  first post-Cancel reload is next and must reconstruct **Request Join**
  without mutating this boundary.
- Terminal basket-closure repair replay — first post-Cancel reload
  (2026-08-12): **PASS**. The card reconstructed fresh **Request Join** and the
  read-only oracle remained identical to the first Cancel boundary. Basket
  `6a7c9fdbf8a7d3829acd8028` retained its exact create/update timestamps and
  `cancelled/deleted`, `reservationActive=false` state; Nova's membership
  stayed suppressed at pending `0` / trash `1`; Casey retained exactly the
  original Pending and Cancelled notifications with unchanged timestamps; no
  ticket or ticket counter appeared. First re-Join is next and must append a
  distinct physical basket without mutating this closed audit.
- Terminal basket-closure repair replay — first re-Join identity (2026-08-12):
  **PASS / HISTORICAL FIX REVERIFIED**. Re-Join appended the distinct physical
  basket `6a7ca1dcf8a7d3829acd8030` as `approval-pending/pending`,
  `reservationActive=true`, created at `2026-08-12T16:39:54.779Z` and updated
  at `2026-08-12T16:39:56.656300024Z`. The first closed audit
  `6a7c9fdbf8a7d3829acd8028` and both of its timestamps remained unchanged.
  Nova again has one member-origin pending approval, occupancy is
  `1 accepted + 1 pending / 8`, and her pending activity is `1`. Casey's exact
  notification order is Pending, Cancelled, Pending; the new Pending row was
  created at `2026-08-12T16:39:56.783714158Z`. No ticket or ticket counter
  exists. Second Cancel in-place is next.
- Terminal basket-closure repair replay — second Cancel in-place (2026-08-12):
  **PASS**. Without reload, the same card again changed from **Continue
  booking** to fresh **Request Join**. Both physical basket attempts remain as
  distinct closed audits: `6a7c9fdbf8a7d3829acd8028` stayed byte-for-byte
  unchanged, while `6a7ca1dcf8a7d3829acd8030` transitioned to
  `cancelled/deleted`, `reservationActive=false` at
  `updatedAtIso=2026-08-12T16:41:18.371454648Z`. Nova is suppressed at pending
  `0` / trash `1`, occupancy is `1 accepted + 0 pending / 8`, and Casey has
  exactly four ordered Pending, Cancelled, Pending, Cancelled notifications;
  the final Cancelled row was created at
  `2026-08-12T16:41:18.346680104Z`. Tickets and both ticket counters remain
  zero. The second post-Cancel reload is next.
- Terminal basket-closure repair replay — second post-Cancel reload
  (2026-08-12): **PASS**. The card reconstructed fresh **Request Join** while
  both closed basket IDs, every create/update timestamp and their
  `cancelled/deleted`, `reservationActive=false` states remained unchanged.
  Nova stayed suppressed at pending `0` / trash `1`; Casey retained exactly
  four ordered Pending/Cancelled/Pending/Cancelled notifications with
  unchanged identities and timestamps; tickets and both ticket counters
  stayed zero. The final Join is next and must append a third distinct active
  basket before Casey's terminal approval.
- Terminal basket-closure repair replay — final Join (2026-08-12): **PASS**.
  The final Join appended the third distinct physical basket
  `6a7ca61cf8a7d3829acd8035` as `approval-pending/pending`,
  `reservationActive=true`, created at `2026-08-12T16:58:00.800Z` and updated
  at `2026-08-12T16:58:04.003015578Z`. Both prior Cancel audit IDs and all
  their timestamps remained unchanged. Nova again has exactly one
  member-origin pending approval, occupancy is `1 accepted + 1 pending / 8`,
  and her pending activity is `1`. Casey has exactly five ordered Pending,
  Cancelled, Pending, Cancelled, Pending notifications; the fifth was created
  at `2026-08-12T16:58:04.128038718Z`. No Join produced a ticket or ticket
  counter. Read-only inspection verified Casey is at the open main menu and
  source inspection verified that approval is owned by **My Events** -> event
  **Members** -> **Open actions for Nova Social** -> **Approve** -> **Approve
  request?** confirmation, not by Notifications. Casey's single terminal
  approval is next.
- Terminal basket-closure repair replay — Casey approval (2026-08-12): **PASS /
  REPAIR VERIFIED**. The owning
  `POST /api/activities/events/members/action` returned `200` at
  `2026-08-12T19:01:17+02:00`. Nova transitioned directly to accepted,
  occupancy became exactly `2 accepted + 0 pending / 8`, and exactly one
  active physical ticket `6a7ca6ddf8a7d3829acd8038` with code
  `TKT-be2fc931-af92-47f8-83ad-0cefc4c1d416` was issued at
  `2026-08-12T17:01:17.343122715Z`. Nova's stored ticket counters are `1 / 1`;
  Casey remains `0 / 0`, and no second ticket exists. The formerly failing
  third basket `6a7ca61cf8a7d3829acd8035` now correctly closed as
  `status=approved`, `resultState=succeeded`, `reservationActive=false` at
  `updatedAtIso=2026-08-12T17:01:17.327197050Z`; both older Cancel audits and
  all their timestamps remained immutable. This clean full replay verifies the
  terminal basket-closure implementation. Ticket UI polling and two read-only
  popup opens remain before the full checkpoint can close.
- Terminal basket-closure repair replay — normal Ticket poll (2026-08-12):
  **FAIL**. Nova's persisted `activities.tickets` and
  `activities.asset.tickets` were both `1`, and an independent demo-session
  read proved the ordinary realtime payload also carried `tickets=1` plus
  `asset.tickets=1`. Nginx recorded repeated successful Nova long polls after
  approval, including `19:02:21`, `19:02:51`, `19:03:21` and `19:03:51`
  local time. Nevertheless, read-only DOM inspection showed no `1` badge on
  the **Ticket** menu item. The avatar's total `1` belonged to Nova's existing
  Rates counter and is not Ticket evidence. Root cause: `SideMenuComponent`
  discarded the complete non-notification realtime snapshot whenever any
  popup was visible; Nova's intentionally retained Explore popup therefore
  blocked all global counters indefinitely.
- Popup-safe realtime counter repair (2026-08-12): **IMPLEMENTATION UPDATED /
  CLEAN REPLAY REQUIRED**. Popup-visible polls now apply their global activity
  counter projection immediately while continuing to defer impressions and
  cursor advancement. `ActivityStore` now owns a per-user revision token so a
  poll captured before a newer local/optimistic counter mutation or counter
  clear cannot overwrite that newer state. Source regressions cover popup-safe
  ticket plus nested asset-ticket convergence, stale response rejection and
  clear/reset invalidation. The existing frontend watcher generated the
  complete bundle successfully; no separate build or test process was
  started. Reloading the already-approved state would only hydrate the answer
  and would not prove the broken transition. The backend Cancel/re-Join and
  terminal basket-closure branches already have clean replay evidence and the
  new change touches only frontend realtime counter synchronization, so replay
  only its affected path from a canonical baseline: one Join, one Casey
  approval while Nova Explore stays open, normal poll, then two Ticket reads.
- Popup-safe counter repair replay baseline (2026-08-12): the versioned reset
  restored the failed poll attempt and `status` proved `phase=not-staged`. A
  fresh image-qualified stage plus an independent second status read proved
  the canonical Casey-only baseline: Casey is the sole accepted Admin at
  `1 + 0 / 8`; Nova has no membership, basket, notification, ticket or
  activity/ticket counter; the ticket collection is empty. The launcher
  replaced only this checkpoint's managed Casey, Nova and Riley windows after
  the watcher build and verified all identities. Replay only the focused
  popup-counter path, retaining Nova's Explore popup through terminal approval
  so the formerly failing normal poll is exercised rather than bypassed by
  hydration. Do not repeat the already-proven Cancel/reload/re-Join branches.
- Popup-safe counter repair focused replay — Join (2026-08-12): **PASS**. The
  owning `POST /api/activities/events/join` returned `200` at
  `2026-08-12T19:13:38+02:00`. Nova has exactly one member-origin pending
  approval and one new active physical basket
  `6a7ca9c2f8a7d3829acd8039`, created at
  `2026-08-12T17:13:35.424Z` and finalized to
  `approval-pending/pending` at `2026-08-12T17:13:38.784686437Z`. Casey has
  exactly one Pending notification for this attempt, created at
  `2026-08-12T17:13:38.870402615Z`; occupancy is
  `1 accepted + 1 pending / 8`, while the ticket collection and both Nova
  ticket counters remain zero. Do not repeat this Join. Keep Nova Explore open
  and perform Casey's one terminal approval next so the popup-visible realtime
  counter transition is exercised.
- Popup-safe counter repair focused replay — Casey approval and normal poll
  (2026-08-12): **PASS / REPAIR VERIFIED**. The owning
  `POST /api/activities/events/members/action` returned `200` at
  `2026-08-12T19:20:14+02:00`. Nova became accepted at
  `2 accepted + 0 pending / 8`; basket `6a7ca9c2f8a7d3829acd8039`
  closed as `approved/succeeded`, `reservationActive=false`, and exactly one
  physical `status=A` ticket `6a7cab4ef8a7d3829acd803f` with code
  `TKT-970b4c17-dd7c-4d93-88c9-d42a1dfde12b` was issued at
  `2026-08-12T17:20:14.659872091Z`. Nova's counters are `1/1`; Casey remains
  `0/0`. Successful normal long polls followed at `19:20:26`, `19:20:56`,
  `19:21:26` and `19:21:56`. Read-only DOM inspection while both Nova Explore
  and its join-review popup were still visible showed the item-level
  **Ticket 1** badge. This directly closes the popup-gating defect; the two
  read-only Ticket popup opens remain before closing the checkpoint.
- Popup-safe counter repair focused replay — first Ticket read (2026-08-12):
  **PASS**. Nova's first manual open issued
  `GET /api/assets/tickets?userId=650000000000000000000062&page=0&pageSize=6&order=upcoming`
  and returned `200` at `2026-08-12T19:24:09+02:00`. The following persisted
  oracle retained exactly the pre-read ticket `6a7cab4ef8a7d3829acd803f`
  with code `TKT-970b4c17-dd7c-4d93-88c9-d42a1dfde12b`, unchanged issue/use
  state, counters `1/1`, and no second credential or domain write. The Ticket
  surface was closed by the later read-only DOM observation; its next manual
  open is therefore the second read, not a replay of the first.
- Popup-safe counter repair focused replay — second Ticket read and checkpoint
  closure (2026-08-12): **PASS / CLOSED**. Nova's second manual open issued
  the same `GET /api/assets/tickets` read and returned `200` at
  `2026-08-12T19:29:16+02:00`. Read-only DOM showed **Assets · Ticket** with
  exactly **1 ticketed event** and one `QA EVENT-TICKET-005` card. The final
  persisted oracle retained the sole physical ticket
  `6a7cab4ef8a7d3829acd803f`, code
  `TKT-970b4c17-dd7c-4d93-88c9-d42a1dfde12b`, original
  `issuedAtIso=2026-08-12T17:20:14.659872091Z`, `status=A` and unused state;
  Nova stayed at counters `1/1`, Casey at `0/0`, and no second credential or
  read-owned write appeared. Combined with the retained clean
  Cancel/reload/re-Join evidence, verified terminal basket closure and the
  popup-visible normal-poll proof, this closes `EVENT-TICKET-005`.
- First-join pre-cancel evidence (2026-08-06): the persisted event was `1/8`
  accepted plus `1` pending; Nova had exactly one `pendingSource=member`,
  `requestKind=approval` membership, pending activity `1`, both stored ticket
  counters `0`, and `eventTickets` remained empty. The first implementation
  omitted both admin notification writes; the first Cancel observation proved
  the domain transition but exposed the same omission. The write-side fix and
  cancel-after-rejoin handling are hot-deployed; repeat this whole sequence
  from a clean stage before closing the checkpoint.
- Clean notification retest evidence (2026-08-06): Join delivered exactly one
  Casey `Pending` row and retained `1 accepted + 1 pending / 8` with zero
  tickets. Cancel delivered a separate Casey `Cancelled` row, changed Nova's
  physical membership to `suppressed` with
  `statusBeforeSuppression=pending`, retained Nova's own overlay as `status=T`,
  changed pending activity `1 -> 0` and trash `0 -> 1`, and left every ticket
  object and both controlled ticket counters at zero.
- Cancel fresh-flow regression (2026-08-06): the persisted server state already
  had no basket/session and returned Nova-specific
  `currentUserMembershipStatus=none`; a stale Explore row nevertheless retained
  **Continue booking**. The contract now carries this request-specific status
  from the physical membership snapshot and the Cancel action signal updates
  the visible row directly. It is not an event-global field: simultaneous users
  can receive different statuses for the same event.
- Pending-basket reload regression (2026-08-06): Explore previously removed
  Nova's card during reload because tracked participation was filtered before
  the query considered her displayable checkout basket. Explore filtering now
  retains tracked participation only while that user's basket is visible and
  carries the same basket result state into the row DTO/menu. Cancel removes
  the basket authority; the Public event then remains discoverable as a fresh
  Join/Book candidate because Nova no longer has active tracked participation.
- First physical-basket reload retest (2026-08-06): FAIL. Join persisted Nova's
  pending membership but `eventCheckoutBasketItems` remained empty, so reload
  correctly had no basket authority with which to retain the card. The popup
  treated its local runtime basket as already persisted and omitted
  `basketItems` from the Join payload; nginx showed only the successful Join
  request and no independent basket write. The Join write now always carries
  the physical basket payload for pending checkout, allowing the backend to
  upsert it at the same authoritative boundary. Cancel the old basketless
  attempt and repeat Join before accepting this regression as fixed.
- Repeated Cancel/Join signal regression (2026-08-06): FAIL. Both checkout
  Cancel entry points emitted the viewer-membership removal but then merely
  cleared the shared event-sync value. They must publish the existing
  ID-scoped `remove` message so the matching pending Activity row underneath
  cannot survive and consume a later Join/approval upsert. Both paths now emit
  `remove(eventId)`. Repeat at least two Cancel/Join cycles and prove every
  Cancel removes only that event's pending Activity row while adjacent Explore
  cards remain unchanged.

### `EVENT-TICKET-006` — expiry moves the active ticket to Past

- Stage a stable pre-expiry event rather than starting the deadline during
  fixture/browser preparation. Open Nova's physical `status=A` ticket once
  under Upcoming and retain its ID and code. Only after this manual boundary is
  proved, run the versioned `arm-ticket-expiry` harness action; it updates the
  host event plus Nova overlay to one printed end time two minutes later and
  records the arm time, deadline and ticket identity in checkpoint state.
- After the ordinary end-time/expiry convergence, the same ticket disappears
  from Upcoming and appears once under Past. Event expiry does not change the
  ticket to `D` and does not create a replacement.
- Scanning the retained code returns expired without consuming or mutating the
  ticket. Event time owns Upcoming/Past; Unpublish or loss of ticket
  eligibility owns `A -> D`.
- Invalid timing attempt retained (2026-08-12): the first fixture started its
  two-minute window during `stage`, so browser setup plus the human round trip
  consumed the pre-expiry observation boundary. At `19:37:27+02:00`, after the
  `19:35:19+02:00` deadline, Nova correctly showed zero Upcoming tickets. The
  independent post-expiry oracle retained the same active physical ticket
  `manual-qa-checkpoint:v1:event-domain:ticket`, code
  `TKT-441625f4-88ee-4f4b-8984-f38486c72218`, counters `1/1` and no mutation.
  This is **NOT EXECUTED / FIXTURE TIMING INVALID**, not a product FAIL. The
  stable-baseline plus explicit-arm fixture replaces this race.
- Stable pre-expiry repair replay baseline (2026-08-12): **READY**. The invalid
  attempt reset cleanly to `not-staged`; the repaired stage completed at
  `2026-08-12T17:41:04.039Z` with the host event and Nova overlay both ending
  at `2026-08-13T17:41:04.079Z`. Two independent oracles retained one active
  ticket `manual-qa-checkpoint:v1:event-domain:ticket`, code
  `TKT-ba6bfa5c-b14d-48e6-bb62-3af1e245b0c6`, Nova counters `1/1`, no
  outbox/recompute delta and `ticketExpiryArm=null`. The existing Nova Upcoming
  surface first retained the invalid attempt's empty result, then its normal
  foreground poll returned the new ticket at `19:41:25+02:00`; read-only DOM
  showed exactly one `QA EVENT-TICKET-006` card. Manual visual confirmation is
  still required before running `arm-ticket-expiry`.
- Controlled expiry replay — Upcoming transition (2026-08-12): **PASS**. Nova
  manually confirmed the single pre-expiry Upcoming card. The first attempted
  arm was rejected by the outer harness allowlist and a read-only status proved
  `ticketExpiryArm=null`, so no false window was counted. After wiring both
  harness layers, `arm-ticket-expiry` succeeded at
  `2026-08-12T17:45:25.759Z`, persisted the exact ticket identity and set both
  event projections to `endAtIso=2026-08-12T17:47:25.759Z`. The last
  pre-expiry foreground GET at `19:47:17+02:00` returned the ticket; the first
  post-expiry GET at `19:47:47+02:00` returned an empty Upcoming page, and the
  already-open DOM converged to **0 ticketed events** without reload. The
  physical ticket remained the same unused `status=A` object
  `manual-qa-checkpoint:v1:event-domain:ticket`, code
  `TKT-ba6bfa5c-b14d-48e6-bb62-3af1e245b0c6`, with counters `1/1` and no
  replacement. Past classification is next; scanning must wait until that
  identity is proved.
- Controlled expiry replay — Past classification (2026-08-12): **PASS**. Nova
  changed the already-open Ticket date-order selector from Upcoming to Past
  exactly once. Read-only DOM inspection showed `Past`, `1 ticketed event` and
  exactly one `QA EVENT-TICKET-006` card. The paired persisted oracle retained
  the same unused physical `status=A` ticket
  `manual-qa-checkpoint:v1:event-domain:ticket`, code
  `TKT-ba6bfa5c-b14d-48e6-bb62-3af1e245b0c6`, with Nova counters `1/1`, no
  replacement and no replay/audit side effects. Only the distinct expired-scan
  rejection remains; active success/replay and revoked scans are already
  closed by `EVENT-TICKET-003` and `EVENT-TICKET-012` and must not be repeated.
- Controlled expiry replay — expired scan (2026-08-12): **PASS / CLOSED**.
  Casey's authorized Android scanner reached the existing stack through the
  verified ADB reverse `tcp:8080 -> tcp:80`. The phone sent exactly one
  `POST /api/assets/tickets/validate` at `20:14:06+02:00`; nginx returned
  `200`, and the user observed the exact Hungarian result **"Ez a jegy
  lejárt."** The paired final oracle retained the same ticket ID/code as
  unused `status=A`, Nova counters `1/1`, and zero replacement, replay audit,
  replay outbox or replay notification. This proves expired rejection is a
  strict no-op and is distinct from the already-closed active and revoked scan
  branches. The fixture reset completed at
  `2026-08-12T18:16:56.416Z`; follow-up status returned `phase=not-staged`.

### `EVENT-TICKET-007` — ordinary-member invitation stays ticketless until Admin approval

- Stage a published Ticketing On event with Casey accepted Admin and Nova
  accepted Member. Nova already owns one physical `status=A` ticket and both
  of Nova's stored users-table ticket counters are `1`; Riley is not yet a
  member and has no ticket/counter.
- As Nova, invite Riley through the ordinary member UI. Riley becomes pending,
  but no Riley ticket is created and both Riley stored ticket counters remain
  `0`. Before Riley responds, the one persisted `event-invite` notification
  must be unread and visible in Riley's **Notifications > New** list.
- Riley accepts the invitation once. Because the inviter was an ordinary
  member, the same membership remains pending but changes from
  `requestKind=invite`, `pendingSource=admin` to `requestKind=approval`,
  `pendingSource=member`. This invitee response must still create no Riley
  ticket and both Riley ticket counters remain `0`.
- Approve Riley as Casey Admin only after that response. This is the terminal
  transition to accepted: it creates exactly one physical Riley `status=A`
  ticket and changes both Riley stored ticket counters to `1`; the next normal
  profile poll exposes Riley's Ticket red badge `1`. The same approval must
  create exactly one unread `event-member-approved` notification for Riley,
  visible through the normal notification poll in **Notifications > New**
  before Riley opens or marks it read.
- Nova's original ticket ID/code and counters remain unchanged throughout.
  Repeating Riley's acceptance or opening Riley Ticket twice must preserve the
  same Riley ticket ID/code and counters. Casey remains ticketless.
- Staged baseline (2026-08-12): **READY** at
  `2026-08-12T18:18:45.088Z`. Stage plus an independent status oracle prove
  Casey accepted Admin with ticket counters `0/0`; Nova accepted Member with
  sole unused `status=A` ticket
  `manual-qa-checkpoint:v1:event-domain:ticket`, code
  `TKT-d6bd7582-1849-46bb-ba09-24dd7fb92b44`, and counters `1/1`; Riley is
  outside membership with ticket counters `0/0`. No invitation/outbox or other
  side effect exists. The configured isolated Casey-Nova-Riley windows are
  identity-verified; Nova's ordinary-member invite is the next producer.
- Pre-invite Active Events list branch (2026-08-12): initial observation
  **FAIL**, repaired and focused replay **PASS**. At `20:23:14+02:00`, Nova's
  Events and Active Events controls both showed count `1`, but the list showed
  `No items`; the matching authenticated browser request returned HTTP `200`
  with an empty 81-byte page while the membership/ticket/counter oracle stayed
  at the untouched accepted baseline. The expanded payment oracle exposed
  three legacy records for the reserved QA event: one older `joined` record
  followed by two later `initiated` records, so the latest-open-payment rule
  incorrectly classified Nova as pending. The defect was not repaired in the
  list projection. Terminal event acceptance now finalizes the latest open
  payment to `joined` in the owning write path, after basket finalization and
  before ticket synchronization; regression tests cover that ordering and
  idempotence. The fixture now snapshots, clears and reports `payments`, and
  the guarded `repair-ticket-payment-fixture` action removed the three legacy
  reserved-event records at `2026-08-12T18:44:01.807Z` without changing the
  event, members, ticket, counters, outbox or tasks. The existing continuous
  compiler reported `BUILD SUCCESSFUL`, and Spring DevTools restarted the
  application successfully. The authenticated read then returned exactly one
  Active Events record, and Nova's already-open popup converged in place on its
  normal poll—without reload—to the `QA EVENT-TICKET-007` card with counts `1`
  and the `2 / 8` members action. Nova has not invited Riley yet.
- Pre-invite candidate branch (2026-08-12): initial observation **QA FIXTURE
  FAIL**, guarded preparation plus authenticated API preflight **PASS**. At
  `20:49:08+02:00`, Nova opened Invite members and saw `No invite candidates
  right now`; the disabled confirmation button emitted no invite request, and
  the read oracle retained the untouched two accepted members, Nova's sole A
  ticket/counters `1/1`, Riley's zero ticket/counters, empty payments and zero
  invitation side effects. The event candidate implementation does not select
  every public non-member: it derives candidates from prior `mode=single`,
  `met=true` user-rate records. Riley existed and was public/outside the event,
  but the fixture had not staged the required Nova-Riley rate. The versioned
  checkpoint now owns, resets and reports that source record. Guarded
  `prepare-ticket-invite-candidate` created exactly one reset-owned rate at
  `2026-08-12T18:54:03.858Z`; an independent status retained every other
  baseline invariant. Nova's authenticated `POST
  /api/activities/events/invite-candidates` then returned `total=1` with Riley
  as the sole item. Read-only DOM inspection proved the popup that was already
  open retained its earlier empty response, so the focused replay begins only
  by closing and reopening Invite members. No invitation has been sent.
- Nova invitation boundary (2026-08-12): **PASS**. Nova's reopened candidate
  popup showed Riley and emitted exactly one `POST
  /api/activities/events/members/invite` at `20:57:41+02:00`, returning HTTP
  `200`. The independent oracle found exactly one Riley membership with
  `status=pending`, `requestKind=invite`, `pendingSource=admin` and Nova as
  `invitedByUserId`; event projection became two accepted plus one pending.
  Riley still had no physical ticket and ticket counters `0/0`; Nova retained
  the same sole A ticket ID/code and counters `1/1`; payments stayed empty.
  In-place read-only DOM evidence agreed: Nova Members showed `2 members · 1
  pending` and Riley `Invitation Pending`, Casey My Events showed `2 / 8` plus
  pending `1`, and Riley's untouched window showed Invitations `1` with no
  Ticket badge.
- Sequence correction (2026-08-12): the original checkpoint text incorrectly
  placed Casey preapproval before Riley's response. This is not a missing
  product control. The backend explicitly rejects Admin acceptance while a
  row is still an invitation, the event-member UI deliberately exposes
  **Approve** only for a join/approval request, and existing regressions cover
  both `adminCannotAcceptInvitationBeforeInvitedMemberResponds` and the later
  ordinary-inviter approval requirement. The checkpoint now follows the
  implemented domain contract: Riley accepts first and stays pending/ticketless
  as `requestKind=approval`; Casey then performs the terminal approval that
  creates Riley's ticket. The live boundary was not reset or replayed.
- Riley invitation-response branches (2026-08-12): initial in-place
  observation **FAIL**; persisted/read boundary **PASS**; owning repairs plus
  focused replay **PASS** both in-place and after a fresh document read. On the
  first response, Riley's Invitations list emptied and the Java write correctly
  persisted the row as pending `requestKind=approval`, `pendingSource=member`,
  moved stored counters from Invitations `1` / Pending `0` to Invitations `0` /
  Pending `1`, resolved the invite notification, created exactly one Casey
  Admin join-request notification and created no Riley ticket; however the
  already-open Activities menu still showed no Pending count. A later reload
  reconstructed Pending `1` and the same `Waiting for approval` row, so the
  durable transition was intact and the defect was operation-time projection.
  Diagnosis found that `ActivitiesMembersService.requestJoin` saved the
  invitation response but returned its post-write snapshot without
  `mutationApplied=true`; `ActivitiesEventsService` therefore omitted the
  Invitations-to-Pending counter directions from the response. The Java write
  service now reports its own applied mutation, with focused member-service and
  event-response regressions. The shared `ActivityStore` operation-delta path
  now also advances its per-user counter revision so an older realtime result
  cannot overwrite a newer operation-owned delta; the focused shared-store
  regression covers that ordering for both HTTP and frontend-local adapters.
  Existing backend and frontend hot-deploy owners compiled the changes and the
  backend restarted successfully; no second Gradle/npm build or test process
  was started. Guarded `prepare-ticket-invitee-response-retest` restored only
  the Riley response boundary while preserving Nova's exact ticket and every
  already-proven step. At `21:40:46+02:00`, the replayed join returned HTTP
  `200` with `changed=true`, scalar Invitations `-1`, event Pending `+1` and
  event Invitations `-1`. Before any user reload, Riley observed Pending `1`;
  read-only DOM then showed `QA EVENT-TICKET-007` and `Waiting for approval`.
  The independent oracle agreed: exactly one Riley pending-approval row,
  stored event Pending `1` / Invitations `0`, ticket counters `0/0`, no Riley
  ticket, one resolved Riley invite notification and one Casey join-request
  notification. A subsequent full Riley document request plus fresh event
  filter also reconstructed the same Pending `1` row. Nova's original ticket
  ID/code/status and counters remain unchanged. The frontend-local runtime
  branch was not executed because the active deterministic checkpoint is the
  HTTP adapter; local contract inspection plus the shared regression is
  evidence of compatibility, not a claimed local runtime PASS.
- Invitation notification observation clarification (2026-08-12): the
  persisted `event-invite` row was created unread at Nova's invite boundary
  and Riley's later response resolved it to read exactly once. The manual New
  list was not inspected in the interval before that response, so that UI
  observation is **NOT EXECUTED**, not a retroactive FAIL; the current read row
  in All is consistent with the response contract. Future execution now stops
  before Riley's response and requires that unread row in Notifications > New.
- Casey terminal approval branch (2026-08-12): first durable transition
  **PASS**, target notification **FAIL**, owning repair plus focused replay
  prepared. Casey's one approval at `21:49:11+02:00` accepted Riley, created
  Riley's sole A ticket `6a7cce37f8a7d3829acd8053` / code
  `TKT-3d3eddd0-221f-453e-b8f2-1b40fe29d795`, changed Riley ticket counters to
  `1/1`, added exactly one Riley participation overlay and one three-member
  main event chat with the single `Riley Outside joined the event.` system
  message, while Nova's original ticket remained byte-for-byte unchanged.
  The independent oracle found zero `event-member-approved` outbox rows and
  zero Riley approval notifications, so the approval feedback contract failed.
  Casey's apparent Invitations `0 -> 3` / All `1 -> 4` change was separately
  traced to three real demo invitations that the staged fixture baseline had
  not counted; the terminal full recompute corrected that stale fixture
  projection and no query-side masking was added. The Java terminal approval
  path now emits one target-only `event-member-approved` intent after the
  accepted membership, ticket synchronization and embedded event refresh; the
  materialized row is explicitly categorized `event-admin`, starts unread and
  carries Casey as sender. The equivalent frontend-local terminal transition
  appends the same unread notification. Focused service/category regressions
  were added, and the existing backend/frontend hot-deploy owners compiled and
  restarted successfully without a second build process. Guarded
  `prepare-ticket-admin-approval-retest` at `22:08:27+02:00` restored only the
  pre-approval boundary: Riley is again the sole pending approval request with
  counters Pending `1`, Tickets `0/0`, no Riley overlay/ticket/chat or active
  event recompute task; Nova's exact original ticket, Riley's resolved invite,
  Casey's join-request notification and every earlier PASS remain retained.
  The focused replay now requires one Casey approval followed by the persisted
  accepted/ticket/chat/task oracle and one unread Riley approval row visible in
  Notifications > New before it is opened.
- Focused Casey approval replay (2026-08-12): durable transition and
  notification oracle **PASS** at `22:12:31+02:00`; Notifications New UI
  observation pending. Casey's one replayed approval accepted Riley and
  recreated exactly one Riley participation overlay, one A ticket
  `6a7cd3aff8a7d3829acd805a` / code
  `TKT-d05cdd81-86da-430d-b166-b508cccb42c6`, stored ticket counters `1/1`,
  and one three-member main chat with one `Riley Outside joined the event.`
  system message. Nova retained the original ticket
  `manual-qa-checkpoint:v1:event-domain:ticket` / code
  `TKT-d6bd7582-1849-46bb-ba09-24dd7fb92b44`, status A and counters `1/1`.
  The repaired write created exactly one `event-member-approved` outbox intent
  for Riley and exactly one materialized notification with category
  `event-admin`, Casey as sender, `membershipAction=approved`, the checkpoint
  event identity and empty `readAtIso`. One event recompute task was pending at
  the immediate oracle. Riley must now open Notifications > New through the
  normal UI poll without opening the row and confirm that one unread item;
  after that observation the outbox/task terminal state and repeated Ticket
  reads remain to be checked before checkpoint closure.
- Riley approval-notification UI and delayed worker branch (2026-08-12):
  **PASS**. Riley opened Notifications > New without opening the row; the
  tester confirmed the item and a read-only managed-browser DOM oracle proved
  `1 new notification`, New counter `1`, title `QA EVENT-TICKET-007`, status
  `Approved`, sender/category text `Casey Bridge · Event admin` and the expected
  approval message. The persisted row retained empty `readAtIso`, so merely
  opening New did not mark it read. The approval-owned affinity task became
  `done` at `22:18:31+02:00` on attempt `1` with no error, after its configured
  event-members debounce and the enabled 60-second worker rule; the worker's
  next run reported pending count `0`. The notification-outbox rule also ran
  and reported that Firebase delivery is inactive in the current dev profile,
  so retaining the push outbox row as `pending` is the configured result, not
  an in-app notification failure. Riley's exact in-app row already exists and
  stays unread. Only the repeated Ticket read/idempotence observation remains
  before checkpoint closure.
- Repeated Riley Ticket read and checkpoint closure (2026-08-12): **PASS /
  CLOSED**. Riley opened Ticket > Upcoming, closed only that popup and opened
  Ticket > Upcoming again without reload or scan. The second-open read-only DOM
  showed exactly one ticketed event, filter count `1` and the single
  `QA EVENT-TICKET-007` Upcoming card. The final persisted oracle retained
  Riley ticket `6a7cd3aff8a7d3829acd805a` / code
  `TKT-d05cdd81-86da-430d-b166-b508cccb42c6`, status A, original issued time,
  unused state and counters `1/1`; Nova's original ticket ID/code/status and
  counters `1/1` remained unchanged; Casey remained ticketless. The Riley
  approval notification stayed unread, the approval outbox remained the same
  configured Firebase-disabled dev record, the one affinity task stayed done,
  and no additional outbox, task, ticket, chat or membership record appeared.
  The historical invite notification's pre-response New UI check remains
  explicitly **NOT EXECUTED** for this run, with its unread creation and later
  expected resolution proven persistently; it is now an enforced stop in the
  reusable definition. Continue by advancing without reset to
  `EVENT-VISIBILITY-001`, retaining both active ticket identities as its before
  oracle.

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
- Baseline on 2026-08-13: **READY**. `EVENT-VISIBILITY-001` was first recorded
  PASS/CLOSED, its exact Casey/Lina/Liam managed processes were terminated and
  proven absent, and the versioned reset returned that fixture to `not-staged`.
  A fresh `EVENT-TICKET-008` stage plus independent status then proved two
  active, Public, Ticketing On events: A is
  `manual-qa-checkpoint:v1:event-domain:event` and B is
  `manual-qa-checkpoint:v1:event-domain:ticket-isolation-control`. Each retains
  Casey and Nova accepted, Riley pending, occupancy `2 / 8 (1)`. Nova owns
  exactly two distinct A tickets: event A ticket
  `manual-qa-checkpoint:v1:event-domain:ticket:isolation:a` /
  `TKT-f7fe4c90-de37-46e2-973e-ce51695454c3` and event B control ticket
  `manual-qa-checkpoint:v1:event-domain:ticket:isolation:b` /
  `TKT-a0046ee8-d818-49de-8b4c-84714b31e8ec`; both were issued at
  `2026-08-12T23:46:59.940Z`, are unused, and Nova's stored ticket counters are
  `2/2`. Casey and Riley are ticketless. Stage created no outbox or recompute
  task. Resources were checked before exactly three identity-verified managed
  Casey/Nova/Riley sessions launched; no fourth QA window runs. The first
  manual boundary is Nova's read-only Upcoming Ticket list with both cards
  visible exactly once.
- Nova pre-mutation Ticket boundary (2026-08-13): **PASS**. The already-open
  Nova **Ticket > Upcoming** surface reported `2 ticketed events` and showed
  `Manual QA EVENT-TICKET-008 A` and `Manual QA EVENT-TICKET-008 B` exactly
  once each, with no card or QR opened. The immediate Docker-backed oracle
  retained both canonical events active with Ticketing On; ticket A and
  control ticket B kept their exact staged IDs/codes, `status=A` and unused
  state. Nova's stored counters remained `2/2`, Casey and Riley remained
  `0/0`, and stage-relative outbox/recompute counts remained zero. Prepare
  Casey's two-card My Events view next, but do not mutate until A and B are
  distinguished on that owning surface.
- Casey pre-Unpublish owning-surface boundary (2026-08-13): **PASS**. Casey's
  open **Events > My Events** list shows A and B exactly once, both with
  occupancy `2 / 8` and pending badge `1`. Nova keeps the unchanged two-ticket
  Upcoming surface open while Riley remains idle. A second immediate status
  retained both canonical events active/Ticketing On, both exact active ticket
  IDs/codes, Nova counters `2/2` and zero stage-relative outbox/recompute. The
  stable A/B titles make a separate menu-only stop unnecessary: execute A's
  card-menu Unpublish plus its confirmation as one producer action, then spend
  the next stop on Nova's no-reload `2 -> 1` / B-only convergence.
- Event-A Unpublish immediate boundary (2026-08-13): **PASS**. Casey executed
  exactly one `POST /api/activities/events/unpublish` for A at
  `02:01:34+02:00`. Nova's already-open Ticket > Upcoming list converged by its
  normal poll from two cards/count `2` to exactly one B card/count `1` without
  reload or reopen. The dedicated isolation oracle proved A alone changed to
  `DR`, its exact original ticket
  `manual-qa-checkpoint:v1:event-domain:ticket:isolation:a` /
  `TKT-f7fe4c90-de37-46e2-973e-ce51695454c3` changed only `A -> D`, and Nova's
  stored counters became `1/1`. Control B remained active/Ticketing On with the
  byte-stable ticket
  `manual-qa-checkpoint:v1:event-domain:ticket:isolation:b` /
  `TKT-a0046ee8-d818-49de-8b4c-84714b31e8ec`, `status=A`; Casey and Riley
  remained ticketless. Casey's open My Events retained both cards because the
  owning My Events scope includes active and draft records; the A card is
  patched to draft in-place while B remains published.
- Unpublish notification boundary (2026-08-13): **SERVER + IN-PLACE COUNTER +
  ROW UI PASS**. The lifecycle task
  `6a7d095ef8a7d3829acd808f` completed once for exactly Nova and Riley with
  reason `under-review` and count `2`. It created one unread
  `event-under-review` / **The event is under review.** occurrence and one
  retained Firebase-disabled outbox intent for each recipient, all bound only
  to event A. Nova and Riley each changed to one New notification in-place.
  Casey was correctly excluded as actor, and event B received no lifecycle
  task, notification or outbox. The current backend contract deliberately
  includes accepted, pending, invited and pending-request identities in an
  Unpublish audience while removing the acting user; the existing regression
  explicitly covers accepted plus pending recipients. Nova's and Riley's open
  **Notifications > New** lists each showed exactly one `Manual QA
  EVENT-TICKET-008 A` row with **The event is under review.** and no B row.
  Neither row was clicked, and the post-UI oracle retained both `readAtIso`
  values empty, proving list open is read-only. The normal A recompute also
  completed `done` at `02:05:08+02:00` on attempt `1` with empty `lastError`,
  while tickets and counters retained the exact A-D/B-A isolation boundary.
  Close Nova's notification surface and reopen Ticket > Upcoming next to prove
  the same B-only result from a fresh read, not only the previous in-place list.
- Post-Unpublish fresh Ticket-read boundary (2026-08-13): **PASS**. Nova closed
  only Notifications and newly opened **Ticket > Upcoming**. The new request at
  `02:09:54+02:00` returned exactly one ticket and the reconstructed popup
  showed `1 ticketed event`, only control B, without opening its card or QR.
  A later normal poll retained the same one-row response. Re-running the
  dedicated isolation oracle after those reads retained A=`DR` with its exact
  D ticket, B=`A` with its byte-stable A ticket and Nova counters `1/1`.
  Therefore both the no-reload and fresh-read branches pass, and repeated
  Ticket reads remain non-producers.
- Republish observation contract (2026-08-13): keep Nova's B-only Ticket popup
  and Riley's one-row New list open while Casey publishes only A. Nova is an
  accepted non-actor, so the existing lifecycle contract requires one new
  `event-modified` / **The event is available again.** occurrence even when
  Publish materializes the missing accepted-member main chat. Nova's
  notification count must change `1 -> 2` independently while its Ticket list
  changes `1 -> 2`. Riley is a pending join-request control, not an invited
  pending recipient; it receives neither an event-invite nor this
  accepted-participant lifecycle row, so its already-open New list must remain
  exactly the one A under-review row. Casey actor and control event B receive
  no Republish notification or ticket delta.
- First Republish producer/server boundary (2026-08-13): **SERVER PASS / LIVE
  SMARTLIST POLL FAIL**. Casey published only A once. The dedicated persisted
  oracle proved A active with one new active ticket
  `6a7d0c43f8a7d3829acd809b` /
  `TKT-888bb042-3d3f-45cb-9baf-15ae9d2e565a` beside the original D audit
  ticket; control B remained active with the exact unchanged ticket
  `manual-qa-checkpoint:v1:event-domain:ticket:isolation:b` /
  `TKT-a0046ee8-d818-49de-8b4c-84714b31e8ec`, and Nova's stored counters
  returned to `2/2`. Nova's notification counter changed `1 -> 2`; Riley's
  already-open New list remained the one under-review row/count `1`. The open
  Ticket surface changed its total/filter count `1 -> 2`, but rendered only
  the newly returned A card and lost the previously visible B card. HTTP
  evidence showed the normal poll had collapsed to `pageSize=1`; once A sorted
  ahead of B, that one-row result replaced the whole visible window. This is a
  frontend SmartList current-window reconciliation failure, not a ticket
  write/read or event-isolation failure.
- Repair boundary (2026-08-13): the shared normal-poll query now requests at
  least the configured current page while still preserving a larger already
  loaded window. Focused regressions cover a partially filled 1-of-18 window
  and a loaded two-page window. The existing `frontend-sync` owner rebuilt and
  deployed the change successfully at `02:21:31+02:00`; no parallel build or
  test process ran. Restore the canonical fixture and replay only the
  Unpublish -> B-only -> Republish -> A+B live-poll causal path before closure;
  retain the earlier notification and fresh-read PASS evidence without
  repeating it.
- Focused replay baseline (2026-08-13): **READY**. The versioned reset restored
  the previous snapshot, a new image-qualified stage produced two active
  Ticketing On events with stable future window
  `03:24:48 -> 05:24:48+02:00`, and an independent status retained the exact
  four canonical/overlay rows, Nova counters `2/2`, Casey/Riley `0/0` and zero
  stage-relative outbox/recompute. Nova's new A/B ticket codes are
  `TKT-2b136618-7f8f-424f-b931-1e6a4af24c16` and
  `TKT-a6d1861a-746d-4609-8493-c054eb9a3b89`. Only the three existing managed
  Casey/Nova/Riley pages were reloaded onto the deployed bundle; read-only DOM
  identity checks proved all three actors and the closed-menu Ticket counters
  Casey `0`, Nova `2`, Riley `0`. Open Nova Ticket > Upcoming and Casey My
  Events, then execute only A Unpublish and retain the popup for the normal
  poll `A+B -> B-only` midpoint.
- Focused replay pre-producer menu boundary (2026-08-13): **FAIL / REPAIR
  BUILT**. Before any replay mutation, the persisted oracle retained A and B
  active/Ticketing On with Nova counters `2/2`; Nova's open Ticket list also
  showed A+B/count `2`. Casey's A action menu nevertheless rendered **Publish**
  in the `02:28:02+02:00` screenshot while A was still published, then changed
  to the correct **Unpublish** only after the later Activities poll. The user
  also observed the inverse stale action after the opposite lifecycle
  transition. The first wrong boundary was the July on-the-fly publication
  patch: it replaced only the converted `InfoCardData` row, while the shared
  menu derives publication status from SmartList's retained source DTO. The
  two representations could therefore disagree until a poll reconverted the
  source. The repair now resolves the row's exact source DTO and emits the
  established Activity Event sync with the deterministic new status, so the
  SmartList source, converted card, card revision and menu are reconciled by
  one path. A focused regression covers both `DR -> A` and `A -> DR`, asserts
  the source sync and forbids the old converted-row-only patch. The existing
  `frontend-sync` owner built and deployed it successfully at
  `02:33:44+02:00`. Replay must prove each owning action menu flips immediately
  before waiting for Nova's external normal poll.
- Interrupted replay and restart boundary (2026-08-13): **REQUIRED UI
  OBSERVATIONS NOT EXECUTED**. Nginx retained four successful lifecycle writes
  on the old replay fixture—Unpublish/Publish at `02:27:16/02:27:50+02:00` and
  again at `02:37:40/02:37:44+02:00`—but no stop phrase was matched to the
  required immediate Casey menu and complete Nova list observations. The
  resulting A audit-ticket sequence was D, D, A while B retained its active
  ticket. By the later full-stack restart the old event window had expired;
  read-only status returned `events=[]` and zero live counters. Therefore the
  old UI replay is neither PASS nor a product FAIL. Preserve the earlier
  server/isolation evidence, discard only the stale fixture through the
  guarded harness route and replay the two repaired UI paths on a clean
  baseline.
- Post-restart focused replay baseline (2026-08-13): **READY**. The restarted
  backend is healthy and the existing `frontend-sync` owner built and synced
  the current repaired bundle at `11:25:20/11:25:23+02:00`. Resource preflight
  showed `7.3 GiB` available RAM and zero swap use. Guarded `discard-stale`, an
  image-qualified stage and independent status proved future A+B events active,
  Public and Ticketing On until `16:37:19+02:00`; Nova owns exact active tickets
  `TKT-66b31ab7-75f9-4929-b0e3-1ec3fb546093` and
  `TKT-1624f5d2-9181-49bf-b467-7859e21d3726`, counters `2/2`, Casey/Riley
  `0/0`, and stage-relative outbox/recompute counts zero. The expired managed
  browsers were absent before exactly three new Casey/Nova/Riley sessions
  launched and identity-verified. Closed-menu DOM preflight shows Casey My
  Events `2`, Nova Ticket `2` and Riley Ticket `0`. Replay only the named
  Unpublish immediate-menu plus B-only normal-poll boundary next.
- Post-restart Unpublish replay (2026-08-13): **SERVER PASS / OPEN TICKET UI
  FAIL**. Casey sent exactly one A Unpublish at `11:43:46+02:00`. The dedicated
  isolation oracle proved A=`DR`, its exact original ticket
  `TKT-66b31ab7-75f9-4929-b0e3-1ec3fb546093` changed to D, B remained active
  with exact ticket `TKT-1624f5d2-9181-49bf-b467-7859e21d3726`, and Nova's
  stored counters became `1/1`. Nova's Ticket GET at `11:44:14+02:00` returned
  B-only/total `1`, and the visible red Ticket badge also became `1`, but the
  open popup screenshot still showed header `2 ticketed events` and both A+B.
  Later ordinary polls converged, so this captured boundary remains FAIL.
  There is no demonstrated race: the defect is a split ownership/reconciliation
  path. The foreground Ticket list used an ordinary absolute page poll, while
  the side-menu notification-lane realtime response still applied domain
  counters under an open popup.
- Ticket delta repair boundary (2026-08-13): **BUILT / CLEAN REPLAY PENDING**.
  The earlier shared SmartList page-size change and its added core regressions
  were restored exactly to the parent of `9f03d9bf`; no shared SmartList
  behavior remains changed. Ticket now uses the established Notification-style
  `pollDelta` contract with stable ticket identity/revision, loaded tail,
  upserts, removed IDs and absolute total. Java owns authenticated
  `POST /assets/tickets/sync`; the frontend-local ticket repository implements
  the same service contract. While any foreground popup is visible, the
  side-menu realtime lane retains notification handling but does not apply its
  non-notification domain snapshot; the Ticket poll result alone updates its
  list/header/red counter. Existing backend `compileJava` + restart and
  frontend watcher build/sync passed. An authenticated read-only endpoint
  preflight against the failed midpoint returned removed A, B upsert and total
  `1`. Reset/stage and replay only removal plus insertion before closure.
- Ticket delta clean replay baseline (2026-08-13): **READY**. The first reset
  attempt exposed that the versioned checkpoint selected lifecycle tasks for
  its oracle but did not own `scheduledMessageTasks` in reset cleanup. The
  harness now selects and removes only tasks for its controlled event IDs; a
  second reset plus image-qualified stage and independent status proved no
  retained lifecycle task, outbox, notification, recompute task or stage
  effect. A and B are active/Ticketing On through
  `2026-08-13T15:07:37.047Z`; Nova owns exact active tickets
  `TKT-cc7f973d-f97b-471a-9559-7dde22e12086` and
  `TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5`, counters `2/2`, while
  Casey/Riley remain `0/0`. Only the same three managed pages were reloaded;
  read-only DOM proved Casey/Nova/Riley identities and Ticket counters `0/2/0`.
  Replay A removal through `POST /api/assets/tickets/sync` before the insertion
  direction.
- Ticket delta removal replay (2026-08-13): **PASS**. Casey sent exactly one A
  Unpublish at `12:14:59+02:00`; the matched manual stop confirmed A's menu
  changed immediately to **Publish**. Nova's already-open Upcoming popup made
  `POST /api/assets/tickets/sync` at `12:15:24+02:00` and converged without
  reload/reopen to B-only, header `1`, red Ticket `1`; a later no-op sync
  retained it. The dedicated persisted oracle proved A=`DR`, exact staged A
  ticket `TKT-cc7f973d-f97b-471a-9559-7dde22e12086` changed to D, control B
  retained exact active ticket `TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5`,
  and Nova counters became `1/1`. Notification polling remained independent:
  Nova and idle Riley each visibly reached unread `1`. Replay only the inverse
  insertion plus immediate Publish-menu flip next.
- Ticket delta insertion replay (2026-08-13): **PASS / CLOSED**. Casey
  Published only A at `12:18:36+02:00`; the matched manual stop confirmed A's
  immediately reopened menu showed **Unpublish**. Nova's already-open popup
  called `POST /api/assets/tickets/sync` at `12:18:54+02:00` and reached A+B,
  header `2`, red Ticket `2` without reload/reopen and without losing B. The
  persisted oracle proved a distinct new active A ticket
  `6a7d99fce90c0afb4dd44fdb` /
  `TKT-d5034907-9acd-42b3-bfec-4707fb2e700a`; original A remained D, and
  control B retained exact active code
  `TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5`. Nova counters returned to
  `2/2`. Nova notification visibly became `2`, while idle Riley stayed `1`.
  Both removal and insertion now pass through the scoped Java HTTP delta owner;
  the shared SmartList remains unchanged and the frontend-local adapter has
  the equivalent contract.

### `EVENT-TICKET-009` — holder can present a cached QR while offline

- Preflight on 2026-08-13: **NOT EXECUTED / ADB DEVICE ABSENT**. The existing
  ADB daemon started, but `adb devices -l` returned no connected device and
  `adb reverse --list` could not run. Nova was deliberately left online and no
  QR was warmed or scanned. Reconnect/unlock and authorize the phone, then
  prove the device and required reverse path before starting this checkpoint;
  this environmental precondition is not a product FAIL.
- ADB recovery on 2026-08-13: **READY / PRODUCT ACTION NOT EXECUTED**. Device
  `aer8vgcmyd9lzxv8` / `22126RN91Y` is authorized as `device`; the required
  `UsbFfs tcp:8080 tcp:80` reverse was restored and listed. ADB launched
  `http://localhost:8080/game` in the phone browser. Nova remains online and no
  QR or scanner action has run. Confirm Casey's phone session and warm the
  exact active A QR next.
- First warm attempt on 2026-08-13: **OFFLINE BOUNDARY NOT EXECUTED / TARGET
  SWITCHED TO B**. Before any Nova offline override, Casey's phone sent
  `POST /api/assets/tickets/validate` at `12:25:40+02:00`. Persisted ticket A
  `6a7d99fce90c0afb4dd44fdb` /
  `TKT-d5034907-9acd-42b3-bfec-4707fb2e700a` now has exact `usedAtIso`
  `2026-08-13T10:25:40.200998988Z` and `usedByUserId=Casey`. An online scan
  cannot satisfy or fail the offline checkpoint. Do not reset the closed
  isolation case: ticket B
  `manual-qa-checkpoint:v1:event-domain:ticket:isolation:b` /
  `TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5` remains active and unused, so B
  becomes the fresh offline target. Nova is still online and no offline
  override has run.
- B warm and first offline attempt on 2026-08-13: **DEV QA CONFIG FAIL / PRIOR
  APP-SHELL PASS RETRACTED**. The matched stop and read-only DOM
  captured the online QR dialog for `Manual QA EVENT-TICKET-008 B`; independent
  status retained exact B code `TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5`
  active and unused. The first CDP helper detached immediately, so its apparent
  app-shell result was not a sustained offline interval and is NOT EXECUTED.
  A corrected held session then produced the `12:35:39+02:00` screenshot with
  Chrome `ERR_INTERNET_DISCONNECTED`: the dev environment had
  `serviceWorkerEnabled=false`, and `PwaService` had unregistered the worker and
  runtime caches. No application shell loaded, so the Ticket/profile policy and
  cached QR were not executed.
- Dev PWA repair boundary on 2026-08-13: **BUILT / REPLAY REQUIRED**.
  `EVENT-TICKET-009` now owns `http://localhost/game?pwa=on`; the existing
  query switch is explicitly ignored whenever `environment.production=true`,
  where service-worker enablement remains build-config owned. A focused pure
  regression covers dev on/off and production ignore. The CDP helper keeps the
  Nova target attached, uses Chrome 151 `Network.overrideNetworkState` plus
  `emulateNetworkConditionsByRule`, and restores online on release. The existing
  watcher built/synced at `12:40:22+02:00`; read-only DOM proves Nova online on
  the checkpoint URL with one activated controlling worker. Rewarm exact unused
  B, then require offline authenticated shell, only Ticket enabled, profile
  editor and every other menu disabled, cached B QR complete.
- Offline shell-policy repair and replay on 2026-08-13: **PASS / QR AND SCANS
  PENDING**. The page now gives offline its own stronger dark-gray background
  and explicit **Offline** status instead of retaining Nova's mint Public
  visibility color. This is separate from the lighter inactive/invalid visual
  state. The normal menu palettes remain unchanged; Preferences/rate mode,
  filter, history, profile edit and every member domain item except Ticket use
  real disabled state, while Ticket remains active. The existing watcher built
  and synced `home.component-C6E5CT7Q.js` and
  `side-menu.component-T5MI6DGP.js` at `12:55:38+02:00`; no parallel build ran.
  After an online hard reload loaded those exact chunks, a normal online reload
  restored service-worker control. The authoritative held Offline+reload oracle
  then proved `navigator.onLine=false`, activated controlling worker,
  `game-page-status-offline`, computed background `#cbd0d7 -> #aeb5bf`, visible
  **Offline**, disabled Preferences/filter/history/profile edit and all member
  domain actions except active Ticket. A pre-action persisted read retained B
  exact A/unused with code `TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5`.
  Nova remains held offline. Open cached B and its complete QR next without a
  scan; then run Casey's one successful and one already-used phone scan before
  restoring Nova online.
- Offline header refinement replay on 2026-08-13: **PASS**. The final existing
  watcher build synced `side-menu.component-NWMCSRZB.js` at `13:04:29+02:00`.
  Offline now overrides only the visibility-carrying profile header to the same
  `#cbd0d7 -> #aeb5bf` gray and places a compact **Offline** badge at its right;
  the menu content background and item palettes remain ordinary. The profile
  pencil, notification header entry and notification attention FAB are absent,
  not disabled. Read oracle found no notification attention launcher and no
  edit/notification interactive entries; retained notification data was not
  read or mutated. The information note remains. All prior offline policy
  assertions and active Ticket remained unchanged.
- Automatic Upcoming cache warm repair/replay on 2026-08-13: **PASS**. The
  authenticated Java side-menu realtime response now includes one bounded
  18-row `offlineTicketSnapshot` for Upcoming. It obtains active credentials in
  one holder query and pairs them with ticket event records without a
  credential query per row. The HTTP and frontend-local realtime contracts are
  equivalent, and the shared user-service poll layer writes the snapshot to
  Nova's user-scoped Upcoming offline cache. The online Ticket SmartList remains
  unchanged and continues to use `/assets/tickets` plus
  `/assets/tickets/sync`; only its existing offline transport fallback reads
  the cache. Past is deliberately not auto-warmed. The existing watchers built,
  restarted and synced `users.service-3VAB3CS6.js` by `13:20:03+02:00`; no
  parallel build ran. After one online reload, Ticket remained closed and was
  never opened. The next normal side-menu realtime cycle advanced the cache
  timestamp from `2026-08-13T10:46:45.096Z` to
  `2026-08-13T11:22:56.950Z` and retained exactly A used once plus B active and
  unused, both with complete `scanCode`. This proves automatic warming without
  using the list as a hidden setup action.
- Offline source-integrity attempt and repair on 2026-08-13: **PASS AFTER FIRST
  RESULT RETRACTED AND PRODUCT FIX**. Nova visually
  opened exact B and its complete QR while the page reported offline, and the
  persisted oracle retained B active and unused. However, opening Ticket moved
  the user-scoped cache timestamp to `2026-08-13T11:33:33.668Z`. Nginx proved
  no backend request: the active service worker's separate cached
  `GET /api/assets/tickets` response had satisfied the online adapter as HTTP
  success, so this did not prove the required `offlineTicketSnapshot` fallback.
  `app-sw.js` now excludes `/api/assets/tickets` from its API cache; online
  SmartList still uses the page/delta APIs, while their failed offline request
  reaches the user-scoped snapshot cache. The existing frontend watcher built
  and synced at `13:37:19+02:00`; no parallel build ran. The QA helper then
  activated the installed waiting worker in Nova's existing isolated browser.
  With Ticket closed, the normal side-menu cycle rewarmed exact A+B with full
  codes. Nova is held offline again with active/no-waiting worker and stable
  pre-open timestamp `2026-08-13T11:40:47.443Z`. The corrected shortest replay
  opened only Ticket -> Upcoming -> B -> full QR. DOM retained
  `navigator.onLine=false`, complete B member/event/time QR content and the
  exact unchanged cache timestamp. Nginx logged no `/api/assets/tickets`
  request; the persisted oracle retained exact B code
  `TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5`, status A, null use and null actor.
  The common A/B `medium.webp` card background was also a CacheStorage hit, so
  an already-cached card image serves offline. This does not prove that the
  realtime snapshot automatically fetches a previously unseen image:
  `offlineTicketSnapshot` currently prewarms ticket data/code, while image
  bytes remain owned independently by the service-worker media cache. Keep
  Nova's B QR visible and let Casey perform the first physical scan next.
- First physical B scan on 2026-08-13: **PASS**. Casey's authorized ADB phone
  sent exactly one `POST /api/assets/tickets/validate` at `13:54:29+02:00` and
  received HTTP 200. The persisted oracle proves the original B credential
  `TKT-e5230543-0bd6-4c03-9375-b271e32bd9a5` has canonical `usedAtIso`
  `2026-08-13T11:54:29.767918052Z` and
  `usedByUserId=650000000000000000000061` (Casey). Nova remained offline with
  the same complete QR visible and its intentionally stale snapshot unchanged;
  no replay audit existed before the replay action. Scan that same QR once more
  next. Require already-used and byte-for-byte unchanged canonical ticket use;
  record separately owned replay audit/warning effects without calling them a
  second ticket-use mutation.
- Physical replay scan on 2026-08-13: **PASS**. Casey sent the second and only
  replay `POST /api/assets/tickets/validate` at `13:57:04+02:00`; its compact
  HTTP 200 response was already-used. B retained canonical `usedAtIso`
  `2026-08-13T11:54:29.767918052Z` and Casey actor byte-for-byte. The replay
  created exactly one immutable `check-in-replay` / `already_used` audit at
  `2026-08-13T11:57:04.092881795Z`, one pending warning outbox row and one Nova
  warning with `occurrenceCount=1`. All record the original ticket identity and
  actor while `rawCodePresent=false`; they are separately owned security
  evidence, not a second canonical ticket-use mutation. Nova remained held
  offline with the same QR and stale snapshot. Restore Nova online and prove
  two-row/no-duplicate reconciliation next.
- Online restoration and reconciliation on 2026-08-13: **PASS / CHECKPOINT
  CLOSED**. The held CDP process was released in finally and reported its
  explicit online restoration, then Nova's same isolated page reloaded once.
  After one normal side-menu realtime cycle the authenticated Upcoming snapshot
  advanced to `2026-08-13T12:00:05.116Z`. Read oracle proved
  `navigator.onLine=true`, active controlling worker with no waiting worker,
  ordinary Public shell, Ticket counter/snapshot total exactly 2 and only the
  original A/B row IDs. Both rows carry their original checked-in times; B is
  exactly `2026-08-13T11:54:29.767918052Z`. Persisted oracle retained the same
  B credential and Casey actor, exactly one replay audit/warning occurrence and
  no replacement, duplicate or reconnect-created mutation. `EVENT-TICKET-009`
  is complete.
- Run this as a separate physical-phone checkpoint after the online check-in
  contract is closed. Start with a fresh active Nova ticket. The backend and
  Casey Admin's physical-phone scanner remain online throughout this case.
- Keep Nova online with Ticket closed and let one normal side-menu realtime
  cycle return the authenticated Upcoming `offlineTicketSnapshot`. Prove its
  cache timestamp advances and the exact target row includes `scanCode`; do not
  open Ticket or its QR as a hidden warm step. The snapshot covers the first
  18-row Upcoming window, matching the Ticket SmartList page size. Past is out
  of scope. Online SmartList loads continue to use their own ticket page/delta
  APIs and may also refresh the same cache, but never read the side-menu
  snapshot while transport is available. After Offline+reload the HTTP
  adapter's existing fallback reads the cache, and the QR renders locally from
  the cached code without a detail request. Opening the target QR offline is
  the presentation assertion itself.
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
- Prepare three isolated sessions before continuing with
  `guides/qa/tools/open-checkpoint-browser-sessions.sh EVENT-TICKET-010`.
  The checkpoint configuration opens independent ephemeral Chrome profiles,
  installs the exact Casey, Nova and Riley demo sessions, accepts only the
  normal setup gates, dismisses the one-time explanation and leaves all three
  `/game` windows untouched for manual QA. Re-running the command replaces
  only its own prior `EVENT-TICKET-010` windows. No Google account profile or
  local profile-directory mapping is stored in the repository. Riley is the
  idle independent control for this checkpoint.
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

- This checkpoint was captured from the original GAP where physical ticket use
  left Nova's `activityMembers.status=accepted` without any separate attendance
  field or Members-row check-in badge. The write-side repair is now hot-deployed
  and its focused manual replay is in progress.
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

Execution 2026-08-13 (in progress):

- Backend first-use ticket CAS now writes the accepted event member's separate
  attendance identity. An authorized already-used replay runs the same
  only-if-missing member projection from the ticket's original persisted
  `usedAtIso`/`usedByUserId`, closing the cross-document interruption window
  without rewriting completed attendance. Rejected paths remain non-producers.
- The Event Members surface owns a revision-based delta endpoint and a
  foreground popup poll in both HTTP and frontend-local adapters. It patches
  only changed member rows; shared SmartList code was not modified. The local
  ticket repository updates ticket use and member attendance in one state
  write.
- Existing watchers only: frontend build was green; backend hot-deploy reported
  `BUILD SUCCESSFUL in 3s` and `Started Main` at 14:30:06 local time. No second
  Gradle/npm/test/server process was started.
- Fresh staged baseline `2026-08-13T12:26:19.963Z`: one active `QA
  EVENT-TICKET-011`, Casey Admin + Nova accepted at exact 2/8, no attendance,
  one Nova A/unused ticket `manual-qa-checkpoint:v1:event-domain:ticket`, zero
  replay audit/outbox/task effects. A second read-only status matched. ADB and
  `tcp:8080 -> tcp:80` reverse are active; three isolated actor sessions are
  open.
- Manual pre-scan baseline PASS at 14:34 local: Casey's already-open Members
  popup showed exactly Casey Admin and Nova Member once, with no false Checked
  in label; Nova's Upcoming Ticket showed exactly one matching ticket. The
  immediate read oracle still had Nova `status=accepted`, all four attendance
  fields empty, ticket `A` with `usedAtIso=null`, exact 2/8, unchanged counters
  and zero replay artifacts. First-scan in-place poll and replay remain pending.
- First authorized scan + in-place member delta PASS at 14:51-14:52 local.
  Scanner returned Checked in. Persisted ticket and Nova member share exact
  `2026-08-13T12:51:48.620332085Z`; actor is Casey and member ticket reference
  is `manual-qa-checkpoint:v1:event-domain:ticket`. Nova remains `accepted`,
  `actionAtIso` remains the staged value, Casey remains Admin, member/ticket
  cardinality stays 2/1, event stays active 2/8, profile state and all captured
  activity/ticket counters are unchanged, and replay audit count is still zero.
  The never-reopened Casey Members popup converged to exactly one Nova row with
  green Checked in chip and localized `8/13/2026, 2:51:48 PM` detail; the scan
  result showed the same time.
- Same-QR replay PASS/CLOSED. Because the success state correctly hides a used
  QR and the original instruction omitted retaining it, an ephemeral labeled
  Nova QA tab reproduced the exact in-memory server-issued `scanCode` using the
  application's own QR settings; the raw code was not logged and the tab was
  closed after the oracle. Casey's one replay returned Already used. The named
  verifier proved the complete first-scan snapshot unchanged: member/ticket
  time stayed `2026-08-13T12:51:48.620332085Z`, accepted membership,
  `actionAtIso`, Casey Admin, 2/8, profiles, all counters and one-ticket/two-member
  cardinality remained exact. Exactly one immutable replay audit references
  the original ticket, Nova holder, Casey actor and original use. Read-only DOM
  on the never-reopened Members popup proved `2 members`, one Nova occurrence,
  Checked in and the same `2:51:48 PM` text after replay. Previously proven
  invalid/unauthorized/revoked/expired rejection evidence remains applicable:
  the new projection is reachable only after those guards, so those unrelated
  branches were not replayed.

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
  expected Nova row is `kind=event-modified` with only the existing event title
  (no `changed` suffix), success tone and the short bundle-resolved message **The event is available
  again.** The under-review row uses **The event is under review.** The frontend
  must never synthesize either row or hard-code either translated sentence:
  transport payloads carry `notification_message_key`, and frontend plus Mongo
  `en`/`hu` i18n bundles contain the same keys.
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
- First manual retest result: the concise notification row and its independent
  poll passed, but the already-open Activities -> Chats channel list did not
  show the lifecycle badge. The write oracle was correct (`DR` and an advanced
  revision on both physical owner copies); the frontend had attached the
  versioned header poll only to the inner chat popup. The fix adds one shared
  foreground `UiTaskScheduler` job to the open ordinary chat list. It sends
  each visible row's known revision through the existing indexed header-delta
  service and patches only changed rows; it does not reload or rerender the
  stable page and does not add a component timer.
- The current logical notification checkpoint reuses the physical
  `EVENT-TICKET-003` fixture, whose compact title is `QA EVENT-TICKET-003`.
  The notification title therefore fits the mobile row without a fixture-only
  `Manual` prefix.
- PASS/CLOSED retest evidence: Nova left the ordinary Activities -> Chats list
  open without entering the inner chat. Casey's Unpublish made the same visible
  row show the compact **Under review** badge within one 30-second foreground
  poll and no reload/close; Republish removed it through the same list poll.
  The independently serialized notification lane continued to deliver the
  concise lifecycle notification during the open list. This closes the earlier
  list-only failure without changing the already-proven write-side oracle.

### `EVENT-CHAT-LIFECYCLE-001` — Unpublish/republish keeps physical event chats and history

- Run this on an event that has already been published and has at least a main
  event chat plus one optional, group or event-service chat. Capture each
  physical `chats` owner-copy `_id`, public `id`, `eventId`, `channelType`,
  `memberIds`, `lastMessage`, unread value and representative persisted message
  IDs before changing the event. Pending Riley remains the negative control and
  must have no unauthorized owner copy or history access.
- Casey Unpublishes once. The event lifecycle write performs one indexed Mongo
  batch over physical `chats` documents with the same `eventId` and sets their
  denormalized `ownerStatus=DR` plus the chat `revision` sync marker. It covers `mainEvent`,
  `optionalSubEvent`, `groupSubEvent` and event-bound `serviceEvent` documents;
  chat list/query code must not join or project the Event collection to derive
  this value.
- Every accepted participant can still open, read and send in the same chat.
  The chat row and opened popup title show one compact contextual
  **Under review** badge. The badge is inline beside the title rather than in
  the right-side control/badge area. Chat IDs, owner-copy IDs, members, message
  history, last message, unread state and authorization remain unchanged.
- Leave Nova's chat popup open before Casey changes the event. Without closing
  or reloading Nova, the popup's 30-second versioned header poll must read the
  indexed owner-copy by `(ownerUserId, chatId)` and show **Under review**. The
  response contains only `revision`, `changed` and `ownerStatus`; it must not
  reload the Event, full chat list or message history. The task uses the shared
  `UiPollCoordinator` foreground lane, so ordinary side-menu polling remains
  paused while the popup is open, while the independent notification lane
  continues to run.
- Casey Publishes again. The same write path sets all event-bound physical chat
  documents back to `ownerStatus=A` and advances `revision`; the **Under review**
  badge disappears through the same open-popup poll. No chat or message is deleted/recreated, no system
  message or unread increment is manufactured, and no cross-event chat is
  touched.
- Compare HTTP/Mongo and frontend-local behavior. Local repository and
  SeedBuilder records must persist `eventId`, `ownerStatus` and `revision` on the physical
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

## Coverage-expansion checkpoints appended after the original 106-case spine

The 106 testcases that existed at the start of the 2026-08-13 coverage audit
remain the immutable workflow spine. The following 82 cases are new rows, not
splits or rewrites of that spine. They are deliberately grouped into resumable
checkpoint sequences, while every row still owns one bounded producer action
and one decisive persisted oracle. Runtime execution must use at most three
browser identities at once; mobile observations replace, rather than add to,
one desktop phase when three desktop accounts are already active.

The XLSX uses the teal `EXT` scope marker for cases whose stable ID starts with
`OPERATOR-`, `PAYMENT-` or `DEPLOY-`. These cover operator control-plane,
payment-provider, Registry/network and deployment boundaries outside the core
application workflow. Scope and execution status remain independent: an `EXT`
row is still counted by the normal Done/Pending/Not-started/Failed formulas,
and the overview reports separate Core and External totals.

```text
QA-EXPANSION-CP01 -> QA-EXPANSION-CP02 -> QA-EXPANSION-CP03
-> QA-EXPANSION-CP04 -> QA-EXPANSION-CP05 -> QA-EXPANSION-CP06
-> QA-EXPANSION-CP07 -> QA-EXPANSION-CP08 -> QA-EXPANSION-CP09
-> QA-EXPANSION-CP10 -> QA-EXPANSION-CP11
```

### `QA-EXPANSION-CP01` — payment authorization and provider callbacks

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `PAYMENT-STRIPE-001` | Select Stripe and press the existing Checkout action once. | One stable internal payment creates one manual-capture Checkout/PaymentIntent and redirects to the simulator; basket is `pay/pending`, membership/ticket/counters remain unchanged. |
| `PAYMENT-STRIPE-002` | Choose the 3DS route and approve it once. | Signed `requires_capture` webhook produces one `authorized` payment and one membership fulfillment; the amount is held but not captured and a duplicate callback is a no-op. |
| `PAYMENT-STRIPE-003` | Run decline, customer-cancel and timeout from independent clean sessions. | Each payment reaches its exact failed/expired terminal state without membership, ticket, counter, capture or leaked provider data. |
| `PAYMENT-STRIPE-WEBHOOK-001` | Send valid, invalid-signature, wrong-provider, wrong-amount and wrong-currency callback variants. | Only the correctly signed, scope-matching PaymentIntent mutates the payment; every rejected request leaves payment, booking and gateway-operation collections unchanged. |
| `PAYMENT-STRIPE-WEBHOOK-002` | Replay one accepted callback and then deliver older/later states out of order. | Processed event identity and legal transition guards prevent repeated join, regression from a terminal state or duplicate release/capture work. |
| `PAYMENT-BARION-001` | Select Barion, start DelayedCapture and authorize once; separately call the public callback with a malformed `PaymentId`. | Valid callback contains only a GUID `PaymentId`; MyScoutee reads v4 PaymentState, persists `Authorized`, fulfills once and retains provider-local transaction IDs without capture. Malformed IDs fail before credential resolution or provider traffic. |
| `PAYMENT-BARION-002` | Exercise direct approval plus bank-challenge approve, decline, cancel and timeout independently. | Each branch maps to the provider-neutral state once; unsuccessful branches create no membership/ticket/capture and callback replay is idempotent. |

### `QA-EXPANSION-CP02` — payment settlement, compensation and isolation

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `PAYMENT-CAPTURE-001` | Move one fulfilled authorized booking across its event end and run the real settlement worker; retry with the same payload and probe the same key with a changed amount. | One durable operation captures the exact authorized amount once; retry/restart reuses its operation/idempotency key, while changed content under that key fails closed and cannot charge. |
| `PAYMENT-RELEASE-001` | Cancel one joined booking before capture. | Booking becomes cancelled while payment remains authorized until one queued provider release completes; no refund record pretends that uncaptured money was charged. |
| `PAYMENT-COMPENSATE-001` | Fill/remove the last place after authorization but before membership fulfillment. | Fulfillment persists failed and one durable release is queued; callback replay repairs missing queue work without retrying the membership write. |
| `PAYMENT-REPLACEMENT-001` | Authorize a successor with the other provider, transfer one place, then release the predecessor. | Successor authorization must exist before ownership changes; after exact one seat transfer, each provider operates only on its own ID and predecessor release is durable. **BLOCKED / DESIGN GAP:** provider fields exist, but the replacement saga/seat-transfer writer is not implemented. |
| `PAYMENT-EXPIRY-001` | Place an event outside the provider hold window, then cross authorization expiry. | The system must never claim an indefinite hold; it stores a payment method or requests fresh authorization before fulfillment and an expired hold cannot capture. **BLOCKED / DESIGN GAP:** setup/reauthorization scheduling is not implemented. |
| `PAYMENT-PARTIAL-001` | Capture a controlled smaller amount, then retry and attempt over-capture. | Provider and MyScoutee agree on the partial amount/currency; retry is exact-once and zero/negative/over-authorized or currency-mismatched capture fails closed. |
| `PAYMENT-SIMULATOR-001` | Restart only the future simulator container between authorization and callback replay. | SQLite restores sessions, intents, Barion payments, event order and delivery audit; the same idempotency key returns the same resource and a changed request conflicts. |
| `PAYMENT-SIMULATOR-SEC-001` | Inspect dev and production-resolved payment configuration and call test controls without capabilities. | Simulator accepts only test credentials, protects outcome/audit controls, binds only as configured in dev, is absent from production topology and production rejects custom API bases. |
| `PAYMENT-PROVIDER-ROUTING-001` | Repeat equivalent checkout once with Stripe and once with Barion through operator selection. | The user action remains provider-neutral while provider resource IDs, callbacks and operations remain separate; changing selection never reuses the other provider's authorization. |

### `QA-EXPANSION-CP03` — entry, registration and operator configuration

`ENTRY-DEMO-REG-001` completed execution checkpoint (2026-08-13): the existing
dev stack was healthy and resolved `FIREBASE_ENABLED=false`. The final
versioned `entry-domain` baseline staged at `2026-08-13T17:51:52.005Z` with 56
total users, zero pre-existing `demo-profile-*` users and no event/payment
fixture mutation. Opening Member > New profile, advancing Basics to Photos,
selecting three separate images and reaching Review each retained zero
post-baseline registration users; no upload/media error appeared. The Review
showed the required profile values, `3 / 8` photos and unchanged optional
Lifestyle before one Save.

The first Review observation also exposed a bounded frontend defect: after
pasting `170`, the browser number input displayed `170`, but the Angular draft
and Review both contained `"0170"`; manual typing did not reproduce it because
the value was rebound after each key. Read-only CDP inspection proved the three
separate values before any Save. The shared `FormFlow` number control was
repaired to keep an empty numeric control empty and normalize each non-empty
numeric input event before writing the draft. The existing `frontend-sync`
watcher compiled and deployed the change successfully. The in-flight draft was
corrected by typing once so the registration transaction could finish without
reload. A fresh managed browser then replayed only the failing paste boundary
against the new bundle: input `170`, numeric draft `170`, Review summary `170`,
and no second registration write.

The single Save persisted
`demo-profile-7e3c471d-d5fb-4175-ba07-885db86856fe`. The terminal oracle passed
at `2026-08-13T18:11:30.900Z`: exactly one post-baseline user and one experience
profile, `public` / `A`, profile form v2, one language, three images, no
Firebase/Google/Facebook provider identity, and one owner of the stable unique
development email
`member+f715483d1fb835fa838a28f288a804e6@myscoutee.local`. The retained
registration is transaction evidence. `ENTRY-FIREBASE-REG-001` must instead
prove that a Firebase registration persists the real verified identity email
and reuses the same user on login.

`ENTRY-CONSENT-001` completed execution checkpoint (2026-08-13): the
versioned `entry-consent` fixture staged at `2026-08-13T18:25:11.953Z` with
one pre-existing disposable registration user, 25 privacy consents and zero
ownerless consent records. It made
`manual-qa-entry-consent-001-20260813182511953` v2 the sole active English
privacy revision, with one required section, selected target
`qa-analytics`, and deliberately unselected `qa-marketing`. The anonymous
browser accepted that exact revision at `2026-08-13T18:42:17.656Z` with only
`qa-analytics`; read-only browser evidence showed one accepted `entry` audit,
the exact revision key and no session. The server still had zero post-baseline
users and no consent delta before Save.

One Save created
`demo-profile-5b569629-0a7b-46c8-b7e3-044f8f8f80dd` (`QA Consent Transfer`),
active/public with profile form v2 and three images. The terminal oracle passed
at `2026-08-13T18:52:00.070Z`: that user owns exactly one consent,
`6a7e11b267960971c52a31b5`, for the controlled revision/version; its optional
IDs are exactly `[qa-analytics]`, its source is `entry`, total consent delta is
`+1`, and ownerless consent delta is `0`. The authenticated `/game` session
did not reopen the privacy popup. Event fixtures and payment runtime remained
untouched. The disposable profile, inactive QA revision and consent remain
transaction evidence after the original active English privacy revision is
restored. Reset completed at `2026-08-13T18:54:01.813Z`; the follow-up status
was `not-staged`, with `privacy-default-v1` again the sole active English
revision, 2 retained disposable registration users and 26 total consents.

`ENTRY-CONSENT-002` in-progress execution checkpoint (2026-08-13): the
versioned `entry-consent` fixture staged at `2026-08-13T19:03:26.065Z` for
Nova (`650000000000000000000062`). The controlled previous revision
`manual-qa-entry-consent-002-20260813190326065-previous` v3 is the sole active
English revision; the newer controlled v4 exists but is inactive. The baseline
has 2 pre-existing Nova consents, 26 total consents, zero ownerless consents,
and no consent for either controlled revision. A fresh anonymous managed
browser loaded `/entry` with the exact v3 required section and
`qa-previous-analytics`, no selected optional IDs, consent, audit or session,
and a visible Cancel/Accept boundary. One Cancel at
`2026-08-13T19:05:46.050Z` produced exactly one local `rejected` audit for the
controlled v3 while leaving browser consent and session absent. The independent
server oracle still showed zero controlled-revision consents, target and total
consent deltas `0`, and ownerless delta `0`. The next boundary proves that a
Member/login request reopens the same v3 gate. That boundary passed: the popup
again showed v3 with no selected optional IDs, while the sole rejection audit
remained unchanged and browser consent/session stayed absent; all server
consent deltas remained `0`. Selecting only `qa-previous-analytics` and
accepting at `2026-08-13T19:10:22.951Z` then stored the exact v3 consent and
optional revision key locally. The accepted audit was prepended without
altering the earlier rejected audit; the popup closed, no session appeared,
and all server consent deltas remained `0`. No login or revision activation
had occurred at that boundary. Login as Nova then opened `/game` with the same
local v3 acceptance/audit history and no privacy popup. Server consent
`6a7e170d67960971c52a31b6` was created once at
`2026-08-13T19:12:13.224610973Z`, source `entry`, exact v3 and only
`qa-previous-analytics`. Nova and total consent deltas became `+1`, ownerless
delta remained `0`, and no v4 consent existed. The v3 document is the immutable
snapshot for the newer-revision branch. The harness activated only the
controlled v4 at `2026-08-13T19:13:40.771Z`; its post-transition status kept
the v3 consent byte-for-byte unchanged, still showed target/total deltas `+1`
and ownerless delta `0`, and showed no v4 consent. The next boundary is a reload
of the same Nova session, which must force the newer-revision privacy popup
before v4 can be accepted. That reload passed: Nova's session remained active
and the non-backdrop-dismissible v4 popup opened with required v4 plus
`qa-current-analytics` and `qa-current-marketing`, empty selection and only the
Approve privacy action. The local v3 consent/approval and accepted-then-rejected
audit history remained intact, while the server still had no v4 consent and
kept the v3 record and `+1/+1/0` cardinality unchanged. Selecting only
`qa-current-analytics` and approving closed the popup. The terminal oracle
passed at `2026-08-13T19:19:53.689Z`: settings-source v4 consent
`6a7e188067960971c52a31b8` contains only `qa-current-analytics`; the v3 consent
remains byte-identical, `qa-current-marketing` is absent, Nova and total consent
deltas are exactly `+2`, and ownerless delta is `0`. Event fixtures and payment
runtime remained untouched. This closes `ENTRY-CONSENT-002`; the requested v5
header preview after closure is a temporary visual aid inside the same harness,
not another testcase or acceptance oracle.

`ENTRY-CONSENT-003` is a separate bounded contract discovered during the v5
header observation. Unlike the visual preview, its v5 must be a new immutable
revision record. It retains the stable optional section IDs
`qa-current-analytics` and `qa-current-marketing` from v4 and adds the new
`qa-product-research` rubric. On the mandatory v5 popup, only the analytics
choice previously approved in Nova's exact retained v4 consent may be
preselected; the previously unselected marketing choice and newly introduced
product-research choice must both start unselected. After explicitly selecting
Product research and approving, one new settings-source v5 consent must contain
exactly analytics plus product research, while the v4 revision and consent
remain byte-identical and no optional choice is silently broadened.

The `ENTRY-CONSENT-003` baseline staged at `2026-08-13T19:34:55.567Z` from
Nova's retained v4 settings consent `6a7e188067960971c52a31b8`. That source
contains only `qa-current-analytics`; Nova had 4 consents, the database had 28
consents and zero were ownerless. The new distinct revision
`manual-qa-entry-consent-003-20260813193455567` became the sole active English
v5 while its own consent and every delta remained zero. A fresh Nova browser
with consent bootstrap disabled opened the mandatory v5 popup with exactly
`qa-current-analytics` selected. `qa-current-marketing` and the newly added
`qa-product-research` were both unselected; there was no browser-local entry
consent or audit that could have manufactured the selection. This proves the
display-inheritance branch. Nova then retained Current analytics, explicitly
selected Product research, left Current marketing unselected and approved.
The browser oracle showed the mandatory popup closed with the Nova demo session
still active. The first terminal verification exposed a checkpoint-stage defect:
the fixture had updated metadata on every English privacy revision while
deactivating the prior active revision. The stage query was corrected to mutate
only the active revision, and the versioned `repair-stage` command restored all
three originally inactive revision snapshots without changing any consent.
The repeated terminal oracle passed at `2026-08-13T19:40:23.017Z`. Separate
settings-source v5 consent `6a7e1ce567960971c52a31b9` contains exactly
`qa-current-analytics` plus `qa-product-research`; `qa-current-marketing` is
absent. The retained v4 revision and consent are byte-identical, Nova and total
consent cardinalities are each exactly `+1`, ownerless consent delta is `0`, and
event fixtures/payment runtime remain untouched. This closes
`ENTRY-CONSENT-003`. The guarded reset completed at
`2026-08-13T19:41:32.631Z`: `privacy-default-v1` is again the sole active
English privacy revision, checkpoint state is absent, and the inactive v5
revision plus v5 consent and immutable v4 consent remain as evidence.

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `ENTRY-DEMO-REG-001` | Register/onboard a fresh disposable identity with Firebase inactive. | Demo/bootstrap authentication reaches the same required profile/onboarding boundary once, persists one user and never manufactures Firebase identity/token state. |
| `ENTRY-FIREBASE-REG-001` | Register/onboard a new Firebase identity after a verified revision is activated. | One verified Firebase subject and its real identity email link to one user/profile; the development member-default email is never saved for this branch, and reload/login reuses the identity without colliding with an existing demo or global identity. |
| `ENTRY-CONSENT-001` | Accept required privacy plus a controlled optional section before registration. | Exact active revision/version and selected optional IDs persist; anonymous entry evidence transfers once to the authenticated user without broadening consent. |
| `ENTRY-CONSENT-002` | Reject once, then activate a newer privacy revision and revisit. | Rejection creates no session; an old acceptance cannot satisfy the newer revision, while reacceptance creates one current immutable consent and leaves old audit history intact. |
| `ENTRY-CONSENT-003` | Create a new privacy revision that retains existing optional rubrics and adds one new rubric. | The latest consent preselects only matching stable IDs; every new or previously unselected optional rubric starts unselected, and approval creates a separate v5 consent without rewriting v4. |
| `OPERATOR-BOOTSTRAP-001` | Use a disposable bootstrap credential once, then retry and recover through the documented boundary. | First use creates the operator session and consumes/rotates bootstrap authority; replay and ordinary user access fail closed without exposing the secret. |
| `OPERATOR-CONFIG-001` | Add/reorder one admin email, save, reopen and restore. | Server-normalized unique admin list persists once; role access follows the active configuration and invalid/empty/duplicate inputs preserve the prior revision. |
| `OPERATOR-BRANDING-001` | Change product name, logo character/image, home label and theme, then observe open and fresh clients. | Public configuration revision changes once; header/entry/PWA branding converges without stale cross-revision cache and rollback restores the prior revision exactly. |
| `OPERATOR-PRIVACY-001` | Save valid controller/contact values, test invalid partial/email input and restore. | Public deployment config exposes only the valid pair; invalid save is atomic and neither operator secrets nor unrelated branding changes. |
| `OPERATOR-SOCIAL-001` | Add, reorder and remove one HTTPS social link while trying an invalid scheme. | Valid normalized links appear in declared order; unsafe/malformed URL is rejected server-side and restore returns the exact prior list. |

### `QA-EXPANSION-CP04` — Firebase activation and real mobile push

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `OPERATOR-FIREBASE-002` | Save a new Firebase revision, fail one capability test and attempt activation. | Any configuration change clears prior tested revisions; unverified activation fails and the currently active login/messaging runtime remains untouched. |
| `OPERATOR-FIREBASE-003` | Run the messaging capability test with a real disposable browser/device token. | Token/readiness inputs are write-only and absent from DTO/log/audit; one test message reaches only the target and records the tested revision/time. |
| `MOBILE-PUSH-001` | Keep the phone app visible and produce one target notification from a desktop actor. | Foreground listener shows one in-app notification/counter, no duplicate system notification and the backend inbox/outbox/token identities agree. |
| `MOBILE-PUSH-002` | Background, then fully close the phone app and produce one target notification. | FCM displays one system notification while the app is not open; no desktop actor receives it and the persisted unread count stays one. |
| `MOBILE-PUSH-003` | Tap the closed-app notification and let the WebView cold-start. | The authenticated target route opens once, matching inbox row becomes read only after the intentional open, and back/relaunch does not repeat the action. |
| `MOBILE-PUSH-004` | Deny permission, rotate/revoke the token and later grant permission. | Denial is non-blocking, stale token failure is safely retired/replaced, and a later message reaches only the new token without leaking token text. |

### `QA-EXPANSION-CP05` — registry, claims and operator network

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `OPERATOR-REGISTRY-001` | Inspect a candidate registry endpoint and confirm its identity once. | Inspection is read-only; confirmation pins the expected endpoint/key/semantic version and a changed candidate requires a new explicit decision. |
| `OPERATOR-REGISTRY-002` | Register the deployment with the local Go registry. | One signed deployment membership is created; backend/operator UI and registry state agree without copying private keys into DTOs or logs. |
| `OPERATOR-REGISTRY-003` | Make registration delivery fail, then use Retry once. | Failure retains a resumable receipt; retry reuses logical identity/idempotency and creates no duplicate deployment/group membership. |
| `OPERATOR-REGISTRY-004` | Replace or disconnect an existing binding and simulate replacement failure. | Replacement disconnects only under the documented guarded order; failure reports the retained/disconnected state honestly and never invents a local success. |
| `OPERATOR-CLAIM-001` | Create a claim and withdraw it before redemption. | Claim state, expiry and audit change exactly once; withdrawn/expired claim cannot be redeemed. |
| `OPERATOR-CLAIM-002` | Issue, use and revoke one client token. | Raw token is shown only at issuance, stored only as verifier/commitment, grants only declared scope and stops authorizing immediately after revoke. |
| `OPERATOR-CLAIM-003` | Redeem a valid claim into a group, then revoke the group link. | Deployment/group membership and registry receipt agree; replay is idempotent and unlink does not delete unrelated deployment identity. |
| `OPERATOR-DEPLOYMENT-STATE-001` | Deactivate and reactivate the registered deployment. | Consumer/admin routes fail closed while operator recovery stays reachable; registry and local state converge once on reactivation. |
| `OPERATOR-LEADERBOARD-001` | Load groups and one group deployment page after controlled measurement/revenue inputs. | Ranking, membership state and paging agree with registry data; repeated reads are side-effect free and do not leak private deployment details. |
| `OPERATOR-ANNOUNCEMENT-001` | Publish/receive one controlled registry announcement. | Eligible deployment receives it once in order; acknowledgement/cursor does not hide it from another deployment or create a local notification duplicate. |
| `OPERATOR-COMMUNITY-001` | Load available community/payment providers with one unavailable control. | Only registry-advertised compatible providers appear; unavailable/malformed metadata cannot become active configuration. |

### `QA-EXPANSION-CP06` — TLS, updates and deployment emulation

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `OPERATOR-TLS-001` | Save an emulated domain/contact/challenge configuration and run validation. | Normalized config persists without private key exposure; invalid host/contact/challenge preserves the prior active revision. |
| `OPERATOR-TLS-002` | Run the real TLS worker through issue and renewal against the local/emulated challenge boundary. | Job events progress once to a valid cert/key pair, nginx uses the new generation, permissions are restricted and renewal is idempotent. |
| `OPERATOR-TLS-003` | Fail issuance/renewal after staging new material. | Current valid certificate remains active, partial files are not promoted and retry resumes from durable job state without exposing ACME/account secrets. |
| `OPERATOR-UPDATE-001` | Offer and apply one correctly signed compatible release. | Signature/content fingerprint/version are verified before replacement; job events survive restart and active version changes once. |
| `OPERATOR-UPDATE-002` | Offer invalid-signature, corrupted and downgrade releases. | Every variant fails before activation, current services/data remain intact and audit/log contains no release private key or credentials. |
| `OPERATOR-UPDATE-003` | Interrupt the update worker and reconnect to job events. | Durable phase and event sequence resume without double extraction/restart; operator UI reconstructs terminal truth after reload. |
| `DEPLOY-EMU-001` | Render dev and production Compose/config with simulator and registry settings without starting them. | Dev topology resolves named services/health dependencies; production contains neither simulator nor dev endpoint switches and no secret value is baked into config. |
| `DEPLOY-INSTALL-001` | Install the versioned package on a disposable local VM/container-host analogue. | Prerequisites, numeric ownership, systemd unit, env/secrets split, deployment identity and health qualification pass from a clean host. |
| `DEPLOY-UPGRADE-001` | Upgrade the disposable install with a signed next release. | Backup/preflight precede mutation; version/data/identity advance once and an injected failure rolls binaries/config back coherently. |
| `DEPLOY-BACKUP-001` | Back up Mongo/media/config identity and restore into an isolated target. | Counts, selected hashes, ownership and registry/deployment identity match; secrets remain permission-restricted and restore never touches the live source. |
| `DEPLOY-TLS-001` | Exercise HTTP-to-HTTPS, hostname, certificate chain and renewal presentation on the disposable deployment. | Only intended public ports/routes are reachable, redirects preserve safe paths and renewed certificate is served without mixed old/new material. |
| `DEPLOY-RESTART-001` | Reboot/restart the disposable host and services in dependency order. | Mongo/Redis/object store/backend/nginx become healthy once, no duplicate worker ownership appears and persisted sessions/tasks recover according to policy. |
| `DEPLOY-RESOURCE-001` | Inject bounded low-disk, low-memory and unavailable dependency conditions one at a time. | Health and diagnostics identify the owner, writes fail safely, no retry storm/second build appears and recovery clears only the induced condition. |
| `DEPLOY-SECURITY-001` | Scan resolved listeners, headers, CORS, images/artifacts and filesystem permissions. | Only declared ports are public; security headers/origin policy hold and live/test credentials, private keys and simulator capabilities are absent from images/logs/public files. |

### `QA-EXPANSION-CP07` — operator revenue and measurement

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `OPERATOR-REVENUE-001` | Synchronize one known captured payment set. | Provider, period, currency and payment counts aggregate once; authorized/released/dummy/audit-revision records do not become revenue. |
| `OPERATOR-REVENUE-002` | Produce one failed report then requeue it. | Failure is durable and secret-safe; requeue creates one controlled new attempt and the terminal report is reconstructible after reload. |
| `OPERATOR-REVENUE-003` | Open settlements around one capture and one release. | Settlement rows reconcile provider operation/payment/booking identities and amounts without combining different providers or currencies. |
| `OPERATOR-MEASUREMENT-001` | Synchronize one controlled deployment measurement period. | Exact source period, counts and valuation inputs persist once; leaderboard reads consume it without rewriting the report. |
| `OPERATOR-MEASUREMENT-002` | Fail and requeue one measurement report. | Attempt history remains ordered, duplicate work is prevented and the successful replacement leaves the failed record immutable. |

### `QA-EXPANSION-CP08` — admin access and moderation

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `ADMIN-ACCESS-001` | Call each admin route as admin, operator and member in separate sessions. | Admin succeeds within policy; operator/member receive backend denial even for direct HTTP calls and no denied read/mutation leaks data. |
| `ADMIN-REPORT-001` | Resolve one user/content report once and replay. | Exact report becomes resolved with actor/time/reason, target policy effect occurs once and adjacent report/control remains unchanged. |
| `ADMIN-FEEDBACK-001` | Resolve one pending feedback item once. | Feedback moderation state changes once, creator-facing effect matches policy and no unrelated impression/rating/report changes. |
| `ADMIN-USER-WARN-001` | Warn one controlled member. | One warning/audit/target notification is created; admin receives no self-notification and replay does not duplicate or increment unrelated counters. |
| `ADMIN-USER-BLOCK-001` | Block, test active access, then unblock one member. | New and existing protected requests fail according to session policy, public visibility follows block state, operator/admin controls remain usable and unblock restores only authorized access. |

### `QA-EXPANSION-CP09` — admin notification and content revisions

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `ADMIN-NOTIFICATION-RULE-001` | Save/reopen one safe notification rule change, test invalid input, then restore. | Version/history and runtime config agree; invalid save is atomic and unrelated rules/outbox rows stay unchanged. |
| `ADMIN-NOTIFICATION-RUN-001` | Manually run one armed rule with one eligible target. | One named task/outbox/inbox delivery occurs with exact attribution; second unchanged run respects dedupe/idempotency. |
| `ADMIN-CONTENT-REV-001` | Create and reopen one draft revision for Help/Privacy/Terms/Explanation. | Body, language, version and author persist once while active public content remains unchanged. |
| `ADMIN-CONTENT-REV-002` | Activate the draft revision once. | Public/landing/settings clients receive exactly the new active revision; Privacy activation invalidates only stale consent and keeps historical consents immutable. |
| `ADMIN-CONTENT-REV-003` | Delete an inactive revision and attempt to delete the active one. | Inactive revision is removed once; active/bound revision fails closed and public content never disappears. |
| `ADMIN-IDEA-LIFECYCLE-001` | Trash and restore one idea/article while a public control remains open. | Admin buckets and fresh public inclusion change once per transition; identity/media stay stable and an already-open non-live surface is recorded honestly. |
| `ADMIN-SUPPORT-SESSION-001` | Open and close one scoped admin support session. | Capability is time/actor/scope bound, sensitive actions remain separately authorized, audit is immutable and expiry/revoke immediately denies reuse. |

### `QA-EXPANSION-CP10` — Android WebView cache and ADB recovery

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `MOBILE-WEBVIEW-001` | Cold-start after a frontend version change with the previous shell/cache installed. | Service worker/WebView serves a coherent single build, promotes the new cache only after success and never mixes old HTML with new chunk names. |
| `MOBILE-WEBVIEW-002` | Background during a server-side mutation, then resume without manual refresh. | App-state/resume path reconciles user, counters and the open surface once; a stale WebView snapshot cannot overwrite the newer server revision. |
| `MOBILE-WEBVIEW-003` | Logout/account-switch with populated ticket, image and notification caches. | User-scoped data/QR/counters disappear before the next identity renders; shared public assets may remain, but no authenticated cache crosses users. |
| `MOBILE-ADB-001` | Use ADB to inspect connectivity, reverse tunnel, WebView console/network and one deliberate offline/online cycle. | Device route and certificate state are explicit, errors identify cache versus transport, offline mode exposes only its supported contract and reconnect converges without app-data clearing. |

### `QA-EXPANSION-CP11` — three-role compound workflows

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `ROLE-TRIAD-001` | Keep member, admin and operator sessions open and probe each other's route families. | Each role sees only its own capabilities; direct cross-role calls are denied and activity/admin/operator counters remain independently scoped. |
| `ROLE-TRIAD-002` | Operator changes branding while member home and admin workspace are already open. | Public revision converges on both consumers without logging out, losing admin state or allowing either consumer to edit operator config. |
| `ROLE-TRIAD-003` | Operator activates verified Firebase while admin stays in moderation and member starts a new login. | New login uses Firebase, existing authorized admin work remains stable, and activation creates no member/admin notification or role mutation. |
| `ROLE-TRIAD-004` | Admin blocks the member while the operator monitors deployment state. | Member protected access closes according to policy; operator session/network remains intact and admin action cannot alter deployment/operator authority. |
| `ROLE-TRIAD-005` | Operator deactivates the deployment while member and admin have open authenticated screens, then reactivates. | Both consumer/admin paths fail closed without stale cached writes; operator recovery remains usable and all three reconstruct correct roles after reactivation. |

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

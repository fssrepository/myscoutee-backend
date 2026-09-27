# Domain lifecycle manual QA pack

Status: execution in progress  
Last updated: 2026-09-24
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
| Event MAIN_EVENT runtime materialization | One persisted root `MAIN_EVENT` when Slots are Off; one scoped MAIN_EVENT view per Slot when Slots are On without child definitions; no synthetic `:default` identity | Manage Event for the admin and View Event for participants show the same runtime state instead of an empty Sub-events list | None on open/reload; only the owning Event save or explicit runtime/resource mutation may write | `EVENT-RUNTIME-001` |
| Event publish | Active/published event, accepted-member main chat and refreshed event counters | Hosting and Explore according to visibility; Chat only for accepted members | Statistics/Monitoring; direct chat materialization; slot/reminder consumers when configured | `EVENT-EDITOR-002`, `EVENT-PUBLISH-CHAT-001` |
| Event lifecycle mutation | Draft, active or trashed canonical state plus `statusBeforeSuppression` where applicable | Hosting, Drafts, Explore and Trash buckets | Event affinity recompute; lifecycle notification, reminders and attachments where applicable | `EVENT-LIFE-001` through `EVENT-LIFE-005` |
| Event save with Auto inviter enabled | Active event, capacity, eligible audience and auto-inviter flag | Event detail and member management | Real `event-auto-inviter` scheduler, notification outbox | `EVENT-EDITOR-003`, `JOB-AUTO`, `EVENT-INV-002` |
| Event save with Tournament mode/stages | Tournament definition, sub-event/stage definitions and runtime counts | Event editor, stage list and tournament group UI | Random grouping/start action, tournament review scheduler, reminders and notifications | `EVENT-EDITOR-004`, `TOURNAMENT-001` through `TOURNAMENT-004`, `JOB-TOURNAMENT` |
| Event save with recurring slots | Parent schedule, slot templates and sub-event definitions | Upcoming/Past Sub-event list with occurrence sections | Slot-scoped resources, members, tournament runtime and leaderboard | `EVENT-SLOT-001` through `EVENT-SLOT-004` |
| Manual or scheduled event invite | Pending event membership with `requestKind=invite`, notification intent and bell | Event Members pending row and recipient Invitations row | Notification outbox; acceptance/rejection flow | `EVENT-INV-001` through `EVENT-INV-006` |
| Invitation acceptance | Accepted membership or pending admin approval, resolved invitation notification | Event Members, Activities and invitation detail | Tickets/counters, chat eligibility, visibility-scoped acceptance notification, Statistics/Monitoring and optional outbox | `EVENT-INV-003`, `EVENT-INV-004`, `EVENT-INV-006`, `CHAT-AUTH-001` |
| Event Explore payment checkout | Two terminal Stripe payments, two inactive succeeded baskets and two accepted event memberships filling the two Slots; separate Cash-only control remains unsubmitted | Event Explore checkout, active-card assignment and expired-card guard, then Activities Events Active/All and per-user read-only Payment summaries | Normal membership/chat/counter/recompute plus the selected demo-provider callbacks; Cash only has no card selector | `EVENT-CHECKOUT-001` |
| Tournament grouping and participant eligibility | Parent/stage/group membership, DQ/removal state and group runtime state | Tournament groups, member panels and standings | Group chat/materialization and later tournament review | `TOURNAMENT-002`, `TOURNAMENT-MEMBER-001`, `TOURNAMENT-MEMBER-002`, `TOURNAMENT-MEMBER-003`, `TOURNAMENT-DQ-001`, `TOURNAMENT-003` |
| Asset member invite or Join request | Pending asset-scoped membership plus one recipient notification | Asset Members pending row, full parent pending-counter chain and recipient bell | Asset acceptance/rejection and Asset-role notification | `ASSET-MEMBER-001`, `ASSET-MEMBER-002` |
| Asset Explore payment checkout | One scoped Barion payment, borrow request, inventory reservation and later owner decision; isolated 3DS decline/timeout create no entitlement | Resource/Asset Explore basket, provider-owned 3DS wait/result and Payment summary; owner request row; exact Event/Sub-event resource projection | Normal asset request/availability/outbox plus selected simulator callback work | `ASSET-CHECKOUT-001` |
| Member side-menu Payment surfaces | Payment records remain immutable; one Stripe and one Barion registration create tokenized cards; expired-card cleanup changes only that card | Payment History filters/totals/summaries, Cards, provider registration, translated expiry notification | No Event/Asset producer; expiry job generation is proven separately by the scheduler integration smoke | `PAYMENT-METHODS-HISTORY-001` |
| Event resource assignment | Event/sub-event/asset-owner assignment record | Event Resources, sub-event badges and assigned asset UI | Availability/capacity projection and borrower notifications | `ASSET-ASSIGN-001` through `ASSET-ASSIGN-003` |
| Tournament group resource assignment | Generated-group resource record and persisted group-runtime metrics | Group, stage/View Event and root-event aggregate counters | Parent tournament counter synchronization | `TOURNAMENT-RESOURCE-001` |
| Feedback eligibility boundary | Accepted non-admin membership on a non-trashed event at least two hours after its start | Pending Event Feedback item and feedback cards | None; this is a read-only eligibility projection | `EVENT-FEEDBACK-001` |
| Event feedback submit | Feedback state, per-card answers and `event.feedback.submitted` telemetry | Submitted feedback, organizer received-feedback view and recipient bell | One user recompute per changed target; first-submission notification outbox; activity counters | `EVENT-FEEDBACK-002` |
| Impression read and menu counter acknowledgement | Profile data merged with event-feedback trait evidence; stored feedback bucket count | Host and Attendee sections in the Impressions popup; Feedback tile acknowledgement and poll reconciliation | None on open; normal user-realtime polling may deliver a later snapshot | `EVENT-IMPRESSION-001`, `EVENT-IMPRESSION-002` |
| Feedback note or pending Ignore/Restore | Feedback state mutation only | Organizer note or pending feedback list bucket | Counter refresh only; no affinity recompute or notification outbox | `EVENT-FEEDBACK-005`, `EVENT-FEEDBACK-006` |
| Ticketing enablement, accepted participation and attendance | Ticket-enabled event overlay, one physical holder credential and event-scoped member attendance | Event checkout/ticket card, scanner and Event Members | Event publish/terminal acceptance owns ticket creation; first valid check-in owns ticket use plus attendance projection; list/open and rejected revoked QR scans are non-producers | `EVENT-TICKET-001` through `EVENT-TICKET-012` |
| Governed Content revision save/activation/delete | One scoped inactive revision, later one active revision, privacy-consent boundary and immutable content audit | Admin Content revision cards plus Help/Privacy/Terms/Explanation public viewers | Public content cache/read state; Privacy activation makes only older-revision consent stale; active deletion selects the newest remaining fallback | `CONTENT-ADMIN-LIFECYCLE-001` |
| Article trash/restore/republish | One soft-deleted then restored Draft article with stable identity/media, followed by explicit Publish | Admin Article All/Published/Drafts/Trashed buckets and fresh landing Articles | Public landing inclusion only for published non-trashed state; already-open lists remain honestly non-live | `CONTENT-ADMIN-LIFECYCLE-001` |
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
- `EVENT-RUNTIME-001` is an isolated zero-child Event contract. It proves the
  write-owned main-event runtime item and its read-only View Event projection;
  it does not reuse or reopen the already-closed `EVENT-EDITOR-001` evidence.
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
- `EVENT-CHECKOUT-001` is an isolated direct paid-entry journey. It proves the
  Event Explore review, resumable basket, two-user Stripe payment across both
  Slots and accepted Activity Events destination without reusing the
  approval-before-payment or physical-ticket branches in `EVENT-TICKET-005`.
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
  `TOURNAMENT-MEMBER-001` -> `TOURNAMENT-MEMBER-002` -> `TOURNAMENT-MEMBER-003` ->
  `TOURNAMENT-DQ-001` -> `TOURNAMENT-RESOURCE-001` -> `TOURNAMENT-003`:
  tournament definition, grouping, participant-state boundaries, generated-
  group resources and advancement. Each new row uses an isolated fixture and
  retains the already-closed Start/Finalize producers as immutable controls.
- `EVENT-SLOT-001` -> `EVENT-SLOT-002`: one saved recurring template becomes
  multiple future slot sections with role/time-gated actions.
- `EVENT-SLOT-003` -> `EVENT-SLOT-004`: one generated past occurrence owns its
  own close state, groups and leaderboard evidence.
- `ASSET-LIFE-001` -> `ASSET-VIS-001` -> `ASSET-MEMBER-001` ->
  `ASSET-MEMBER-002` -> `ASSET-ASSIGN-001` -> `ASSET-ASSIGN-002` ->
  `ASSET-ASSIGN-003` -> `ASSET-BORROW-001` ->
  `ASSET-CHECKOUT-001` -> `ASSET-AVAIL-001`: canonical
  asset lifecycle, discovery, manager membership, borrowing, availability and
  normal sub-event assignment/cleanup are separate bounded branches.
- `CONTENT-ADMIN-LIFECYCLE-001` is one isolated Content transaction: create
  inactive Help/Privacy/Terms/Explanation revisions, activate Privacy and
  prove per-user consent, delete one inactive revision, delete the active
  Privacy revision with newest-remaining fallback, then move one separate
  published Article through Trashed -> Draft -> Published while preserving
  identity and managed media. The already-PASS `ARTICLE-EDITOR-001` and
  `LANDING-ARTICLE-001` records are immutable controls, not fixture inputs.
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
  definition before any automatic grouping occurs. Because real stage
  definitions exist, the runtime list must not add a duplicate `MAIN_EVENT`
  card or synthetic `:default` child.
- Start the visible tournament action or arm only the documented persisted job
  schedule, then continue with `TOURNAMENT-001` through `TOURNAMENT-004`.

Repair replay evidence (2026-09-01, PASS):

- Casey's first manual producer saved one DR Tournament event with Qualifier
  and Final definitions. The independent persisted oracle proved the submitted
  definition order and settings, zero generated rooms/groups, zero stage
  runtime/leaderboard state and exactly one pending `EVENT_CHANGED` recompute
  task. Grouping/review remained unarmed as required.
- The pre-Save visual boundary failed: accepting a stage form with its green
  check updated only the editor model; the already-open Sub Events SmartList
  did not receive a draft update. The repair publishes the complete normalized
  definition snapshot through `EventSubeventsPopupStore`, updates the existing
  SmartList through `syncVisibleItems`, preserves matching runtime metrics,
  removes deleted stage cards through the same full-snapshot path, discards the
  preview on an unsaved close and retains the existing full-save signal as the
  sole server-confirmation reload. No polling was added.
- Save diagnosis measured the backend `/activities/events/sync` request at
  approximately 170 ms. Runtime Mongo explain used `event_source_lookup` and
  `activity_member_owner_user`, each examining one key and one document, so no
  new index was justified. The frontend nevertheless issued an unconditional
  Event Detail GET immediately after the acknowledged POST. Interactive Save
  now merges the compact server response into the complete submitted detail
  DTO and removes that redundant critical-path read; independent QA readback
  remains unchanged.
- The running Angular watcher compiled and deployed the repair without errors.
  The controlled fixture was reset, proved `not-staged`, and restaged at
  `2026-09-01T03:11:23.190Z`. Because the fixture and bundle changed behind the
  retained Casey window, the shortest visual replay begins with one explicit
  reload and must inspect the Sub Events cards after each stage check before
  the single parent Save.
- Casey reported the shortest visual replay complete. The final independent
  oracle proved the exact `Qualifier -> Final` definition order, group capacity
  `2..4`, Score leaderboards, advancement `1 -> 0`, one unchanged accepted
  Admin and zero generated group/room/runtime/leaderboard state. Exactly one
  pending `EVENT_CHANGED` recompute task exists. The Save trace contained no
  immediate Event Detail GET; the next Detail GET occurred 46 seconds later
  for the explicit reopen. The owning database request trace narrowed from
  approximately 170 ms before repair to 123 ms after repair. Source checkpoint
  `EVENT-EDITOR-004` is **PASS**; the consolidated journey continues with
  `EVENT-SLOT-001`.

### `EVENT-EDITOR-005` — edit an active downstream definition

- Change one downstream-relevant field at a time: ticketing, capacity,
  sub-event definition or schedule.
- Verify one saved definition-change notification and one recompute signal,
  while a no-op reopen/save does not duplicate user-visible effects.
- Verify removed definitions are no longer presented as active resources,
  groups or reminders.

Execution evidence (2026-09-01, PASS):

- The isolated active baseline contained Casey and Nova as the two accepted
  members, maximum/total capacity `8 / 8`, and no lifecycle notification,
  outbox or recompute artifact.
- Casey opened `Manage Event`, changed only maximum capacity from `8` to `7`
  and saved once. The Activities SmartList patched the visible card on the fly
  from the returned Save DTO; it did not reload the list.
- The independent persisted oracle retained status `A`, publication, both
  accepted identities, minimum capacity `1`, the empty legacy
  frequency/timeframe/location values, null coordinates, Slots Off and Sub
  Events Off. Only maximum/total capacity changed to `7 / 7`.
- Exactly one completed `event-definition-changed` task targeted Nova with
  reason `details`, produced one `event-details-changed` notification/outbox,
  and exactly one `EVENT_CHANGED` recompute completed on attempt 1 with an
  empty error. Reopen plus a second Save without changes added no write, task,
  notification or recompute.
- The accepted-member count is the published capacity floor; an outstanding
  invitation does not reserve capacity. Frontend and backend regression
  sources cover a decrease to the accepted count and the no-op boundary. The
  running frontend/backend owner builds passed. A capacity-only Manage Save
  was also narrowed so ticket synchronization, full event-counter projection
  and stage-reminder reconciliation stay off its response-critical path;
  ticketing enablement retains those consumers.

### `EVENT-RUNTIME-001` — childless Event materializes its main runtime card

The stable user-facing click guide is
[`EVENT-EDIT-RUNTIME-001`](../checklists/event/EVENT-EDIT-RUNTIME-001.md). Its
complete journey and focused regression remain one testcase transaction. The
guide never stores live status or machine evidence.

- Campaign correction on 2026-09-02: the 2026-08-04 `EVENT-EDITOR-001`
  create/save/reopen PASS predates persisted MAIN_EVENT support, which entered
  in commit `2f42d464` on 2026-09-01. Neither that historical create run nor
  `EVENT-EDITOR-005` therefore proves the current create -> MAIN_EVENT
  contract. The initial `EVENT-RUNTIME-001` harness also modeled the wrong
  transaction boundary: it staged an already-created Event with no runtime and
  allowed a capacity edit to materialize MAIN_EVENT. That made the later tail
  testable but did not prove creation semantics. The retained evidence below
  remains valid for the mutations it actually exercised; it is not retroactive
  create evidence.
- Corrected complete-run contract: normal `stage` now produces an exact empty
  `pre-create` Event/runtime boundary plus three active, unassigned Casey-owned
  fixtures: one Transport, one Accommodation and one Supplies asset. Casey
  creates and Saves the Draft through the UI with Slots Off/Sub Events Off and
  proves one root MAIN_EVENT, then assigns the Transport at that root scope.
  The same Draft is saved with exactly two Slot definitions. The runtime view
  must then show exactly one slot-scoped MAIN_EVENT card in each Slot; the root
  runtime remains persisted once with status `D` and must not appear as a third
  card. Casey assigns Accommodation only to the first Slot and Supplies only to
  the second and proves that the scopes do not leak. Removing both Slots and
  turning Slots Off must reactivate the original root runtime document,
  `recordId` and `syncKey`, restore its Transport, and expose neither Slot
  assignment. Publish preserves it. Only after those human-visible transitions
  does Codex prepare Nova as accepted and capture the replayable `post-create`
  boundary at `2 / 8`. This Slot round trip and the later runtime/resource tail
  remain one `EVENT-EDIT-RUNTIME-001` transaction.
- Historical preparation on 2026-09-01: the versioned fixture was staged with one active
  canonical `QA EVENT-RUNTIME-001`, Casey and Nova accepted, capacity `2 / 8`,
  Slots Off, Sub Events Off, zero definitions/slots and zero runtime items.
  The two managed Casey/Nova browser sessions are open. The first bounded
  mutation is Casey's Max capacity `8 -> 9` Manage Save. Its Activities card
  must update on the fly from the returned Save DTO; only the subsequently
  opened View Event/Sub Events surface loads the persisted runtime from the
  server. This run exposed that the generic three-minute event-change debounce
  was still inherited in dev. Manual QA must not wait through that production
  window when debounce timing is not under test, so `application-dev` now uses
  a `15s` event-change override while production retains `3m`; the already
  queued task was not patched by the fixture.
- Casey completed the owning Max capacity `8 -> 9` Save. The persisted oracle
  contains one unchanged canonical Event identity, accepted Casey/Nova, capacity
  `2 / 9`, zero definitions/slots and exactly one active runtime with
  `runtimeKind=MAIN_EVENT`, canonical `eventId=ownerId`, `subEventId=null` and
  no duplicate Event. The backend request thread ran from its first auth/query
  at approximately `07:34:39.952 CEST` to its last observed database read at
  `07:34:40.174 CEST` (about `222ms`), so the perceived Save did not materially
  improve over the prior roughly `231ms` trace. The removed ticket sync, full
  counter projection and stage-reminder reconciliation are absent; the
  remaining synchronous work includes Event/runtime persistence, affinity-task
  enqueue/admin pending counters and definition-change task scheduling. Actual
  notification delivery ran on `task-controller`, outside the response thread.
- A read-only wiring audit of the main runtime card's **Transport**,
  **Accommodation** and **Supplies** menus found that the list sent the canonical
  Event as `ownerId` and the persisted `main-event:<eventId>` runtime record ID
  as a stable physical resource-scope key, but the popup request dropped
  `runtimeKind/eventId`, reconstructed the target as `optional=true` and derived
  sub-event member/chat identity. The repair now carries both fields across the
  popup boundary, reconstructs `MAIN_EVENT` with `optional=false`, keeps the
  non-null physical scope ID required by the existing resource API, and derives
  logical `ownerType=event` plus `mainEvent` chat identity. The focused
  `EVENT-RUNTIME-001` regression and ordinary-subevent negative control passed
  with the full `activity-resource.builder.spec.ts` source at `8/8`; the running
  frontend owner build also passed and deployed. Manual popup/reload confirmation
  remains, and this implementation step did not mutate the retained fixture.
- Casey reloaded the deployed frontend and manually confirmed the bounded
  MAIN_EVENT card/resource checklist. The post-read versioned oracle returned
  `activityResources=[]`, no runtime-scoped member or chat artifact, unchanged
  Casey Admin plus Nova Member at `2 / 9`, and the same single MAIN_EVENT
  `recordId`, `syncKey`, created/updated timestamps and canonical owner/event
  identity. Thus Casey's Transport/Accommodation/Supplies and Event Members
  inspection is read-only PASS; the terminal real assignment remains.
- Campaign scope correction: the duplicate Nova popup replay is dropped as
  low-value microtesting. Casey instead performs one real Transport assignment
  from the MAIN_EVENT card. The mutation oracle requires exactly one resource
  record with canonical Event `ownerId`, physical
  `subEventId=main-event:<eventId>`, Casey as asset owner and exactly one
  Transport asset ID; the corresponding Asset request is accepted and scoped
  to the same runtime. Reopen plus full reload must return that same assignment
  without a synthetic sub-event/member/chat or unrelated lifecycle work.
- The first Assign popup correctly rendered its empty state because Casey had
  no Transport asset. The versioned harness command
  `prepare-runtime-transport` snapshots the deterministic asset selector before
  inserting Casey's `QA Main Event Transport`; normal checkpoint reset therefore
  removes/restores it exactly. Since this preparation happened behind an open
  client, one explicit reload is required before the selector is reopened.
- Casey assigned the deterministic Transport once. The persisted oracle proved
  one canonical resource record at `main-event:<eventId>` and one accepted
  owner Asset request, with the MAIN_EVENT runtime unchanged. The open card menu
  nevertheless remained `0 / 0 - 0`: the Asset selector first omitted
  `publishSubEventResourceMetrics`. After signal publication was restored, Casey
  proved that the client still recomputed accepted occupancy as `0` instead of
  consuming the successful save DTO's canonical `accepted=1` metric. A full
  reload independently returned `0 / 0 - 0` because the synthetic list-shaped
  MAIN_EVENT DTO was initialized with zero resource fields and did not hydrate
  its stable `eventId + main-event:<eventId>` resource scope. The follow-up
  repair applies the save DTO before signal publication and loads that same
  indexed runtime resource scope on MAIN_EVENT reload; no definition identity is
  involved. It also removes a redundant Asset-detail GET before background
  request persistence. The measured blocking resource POST itself was about
  `275ms`, with indexed lookups and normal projection refresh rather than a
  multi-second query. Both frontend/backend hot-deploy owners compiled and
  restarted successfully. The subsequent terminal retest proved reload
  persistence at `1 / 0 - 4` and one remove/reassign cycle with immediate
  `1 -> 0 -> 1` convergence from successful save-response signals. That full
  tail is retained accepted evidence. The user later selected a fresh complete
  replay, so the current run includes it after the corrected create/Slot
  boundary.
- The assigned Transport's **Members -> Invite** integration then exposed a
  separate scope handoff defect inside this same MAIN_EVENT journey. The Save
  persisted Nova as a global Asset member and mirrored an unscoped `borrow`
  request, so the immediate client signal briefly showed a red badge but the
  scoped Members query correctly returned neither row after reopen/reload. The
  repair forwards canonical Event plus `main-event:<eventId>` into the Asset
  member replacement and preserves admin `invite` separately from a member's
  `borrow`. A guarded versioned cleanup removed exactly the leaked Casey/Nova
  global Asset-member rows and Nova's one unscoped request/projection while
  retaining the assigned Transport, its accepted manual scoped request and its
  resource record. The bounded replay begins with one Nova invite, close/reopen
  and one reload: Nova must remain once as pending, the red Transport pending
  badge must be `1`, and accepted occupancy must remain `1 / 0 - 4`. The
  assigned/open resource contributes to occupancy, never to the red pending
  badge. It now also owns the
  causally adjacent **Delete invitation** reversal: delete Nova once, require
  her row and pending header count to disappear immediately, and require the
  Transport badge to return `1 -> 0` and disappear without a list reload.
  Close/reopen Members and reload once; Nova must remain absent, the red badge
  must remain absent, occupancy must remain `1 / 0 - 4`, and persisted resource metrics must
  be exactly `accepted=1/pending=0`. The Asset keeps only the accepted manual
  owner request in the same Event/MAIN_EVENT scope, its request projection
  stays exactly one, and no global Asset-member row, duplicate affinity enqueue
  or unchanged Event participation rewrite is allowed. This is the MAIN_EVENT
  integration assertion; the later `ASSET-MEMBER-001/002` cases still own the
  full generic Asset invitation lifecycle.
- Casey accepted the scoped invite/reload branch and then confirmed that
  **Delete invitation** is functionally correct but feels slightly slow. The
  second complete pre-optimization delete request ran from its first observed
  backend read at `11:24:10.512 CEST` to its last at `11:24:10.600 CEST`
  (about `88ms`) and crossed Mongo 52 times: 42 reads/counts, four saves, one
  remove, three updates and two aggregations. The independent checkpoint status
  after that delete proves one unchanged MAIN_EVENT runtime, one Transport
  assignment with persisted `accepted=1/pending=0`, exactly one accepted manual
  owner request/projection, and no Nova request or global Asset-member row. The
  trace also proved two avoidable write-path effects: the scoped Asset action
  enqueued `ASSET_REQUESTS_CHANGED` again after the owning Asset sync had already
  done so, and resource-only refresh rewrote unchanged Event participation.
  The performance repair removes only those redundant paths and skips the
  meaningless childless-MAIN_EVENT sub-event participation lookup. The existing
  backend hot-deploy owner compiled in 2s and restarted successfully. A shortest
  invite-as-precondition -> Delete replay remains available for focused future
  latency checks; the current user-selected run is the complete journey.
- **Complete replay PASS/CLOSED on 2026-09-02.** Casey created the canonical
  Draft through the UI and proved the persisted root MAIN_EVENT before any
  Publish. Two Slot definitions then produced exactly two Slot sections with
  one slot-scoped MAIN_EVENT card each; first-Slot Accommodation and second-Slot
  Supplies stayed isolated while the original root runtime remained once at
  status `D`. Removing both Slots exposed an empty-enabled-toggle defect. The
  repaired Save canonicalized zero Slot/Sub Event definitions to Off,
  reactivated the original root runtime and restored only its Transport; the
  user accepted the corrected presentation and Publish. The captured
  post-create fixture added Nova as the already-covered Event-membership
  prerequisite at `2 / 8`; `EVENT-INV-001/003` remain the owners of manual
  Event invite/accept behavior.
- The capacity-only Save changed the Event to `2 / 9` without replacing runtime
  document `6a9790503071603425ae103d`, recordId
  `main-event:h1788317751991` or syncKey
  `0e21c605-865c-4e49-bd89-b5288cf3df82`. Event Members showed Casey Admin and
  Nova Member once each. Root Transport remained `1 / 0 - 4`; Accommodation
  and Supplies were empty with no red counter. The scoped Nova Transport invite
  produced exactly pending `0 -> 1`, and Delete removed the pending request,
  projection, header and red counter immediately and after reopen/reload while
  preserving accepted occupancy. The final Remove/Reassign round trip passed
  through the UI and the terminal oracle retained exactly one accepted Casey
  manual request/projection, zero pending/member rows and the same root
  resource at accepted `1`, pending `0`, capacityMax `4`.
- The final Asset recompute completed at
  `2026-09-02T03:39:01.795480583Z` with empty `lastError`. Manual QA also exposed
  that the shared dev platform parameters still carried production-length
  Event/Asset debounce values. The versioned `demo_db` platform seed now uses
  `15s` for Event changed, Event members changed, Asset changed and Asset
  requests changed. This changes only dev timing configuration; the Java path
  and production behavior remain identical.
- Start from the versioned empty `pre-create` boundary. Casey creates one exact
  normal Casual Draft at capacity `1 / 8`, with Slots Off and Sub Events Off.
  Before the first Save, require no Event or runtime for the reserved title.
- Save once through the normal Event create path. The write must persist exactly
  one runtime item with `runtimeKind=MAIN_EVENT`, the canonical `eventId` and
  runtime owner, and `subEventId=null`. It must not insert a fake sub-event
  definition, copy the full Event into a second canonical Event document or
  create a synthetic `:default` child identity.
- Open **Manage Event** as the host. The runtime query must return that persisted
  item and the UI must show exactly one card using the main Event title,
  timeframe and location. The Sub-events surface must not show `No items`, an
  empty child section or a second copy of the same Event.
- Assign `QA Main Event Transport` to the root MAIN_EVENT. Use the runtime
  header's **Edit** action to edit that same Draft, enable Slots and add exactly
  two distinct Slot definitions. After Save, each Slot must contain exactly one
  MAIN_EVENT card. The root card must not coexist as a third card; its persisted
  runtime remains one document with status `D`. Assign `QA Slot Accommodation`
  only to the first Slot and `QA Slot Supplies` only to the second and prove
  both scopes remain isolated. Edit again, remove both Slots and turn Slots
  Off. After Save, Manage Event must show the original root MAIN_EVENT again
  with its original document ID, `recordId`, `syncKey` and Transport assignment,
  while neither Slot assignment is visible. Publish once; it must preserve that
  identity. Codex then captures this state as the `post-create` replay boundary
  and prepares Nova accepted at `2 / 8` without treating that fixture
  prerequisite as create evidence.
- Share that Event into one accepted Event/Group chat, then open the shared
  Event card as a participant. It must enter the same canonical **View Event ->
  Sub Events** runtime surface, not a chat-specific read-only form. The same
  persisted `MAIN_EVENT` card, title, timeframe, location, member boundary and
  available Event actions must be visible; opening, closing and reopening the
  shared card must remain read-only and must not create a second runtime item.
- The card is main-Event scoped: the Event-level Members action remains
  available and shows the canonical creator/Admin once with matching accepted,
  pending and capacity counts. Other normal Event-level actions and configured
  resources must remain available under the real Event/runtime owner identity.
  The repaired popup handoff preserves that identity; the retained run still
  needs the bounded manual Transport/Accommodation/Supplies open/close check.
  Tournament-only Groups, stage, Finalize and leaderboard actions are absent.
- Every badge is state-driven. With the clean baseline there is no red counter;
  a pending member or resource may add only its documented counter and must not
  manufacture a generic Sub-events count.
- Close and reopen View Event, switch Upcoming/Past where applicable and reload
  once. All reads are `X`: the same one runtime item/card remains, and no Event,
  runtime, member, resource, task, outbox, chat or notification write is added.
- Independent persisted oracle: at the root boundary there is one canonical
  Event and one active root `MAIN_EVENT`. At the two-Slot boundary there are
  exactly two active Slot templates and exactly one derived MAIN_EVENT view per
  Slot, backed by isolated resource owner/subEvent scopes, while the persisted
  root runtime exists once with status `D`. After Slot removal the same root
  runtime is active again and only its Transport assignment is visible. Query
  and UI identities/counts must match those records exactly.
- Control coverage stays in the existing cases: `EVENT-EDITOR-004` proves that
  real stage definitions do not also receive a `MAIN_EVENT` duplicate, while
  `EVENT-SLOT-001` proves occurrence materialization for real child
  definitions. Those controls do not replace this testcase's explicit root
  MAIN_EVENT -> two independently scoped Slot MAIN_EVENT cards -> restored root
  MAIN_EVENT transition.

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
  order. No occurrence may contain an additional `MAIN_EVENT` card or a
  synthetic `:default` child. Reopen, paging, calendar navigation and
  Upcoming/Past switching are read-only.

First producer and repair evidence (2026-09-01, repair replay pending):

- Casey correctly entered a Weekly parent range from September 2 at 10:00 to
  October 7 at 12:00 PM, enabled Slots and saved one Wednesday 10:00 template
  while retaining the exact Tournament Qualifier/Final definitions. Upcoming
  omitted the October 7 occurrence.
- The independent oracle ruled out an AM/PM entry error. The parent bounds were
  stored as `2026-09-02T08:00:00Z` and `2026-10-07T10:00:00Z`, but the template
  remained timezone-less `2026-09-02T10:00`. The server therefore compared a
  10:00-12:00 local-looking final slot to a 10:00 UTC-normalized parent end and
  excluded it. A later raw Mongo read proved the template identity was stable
  as embedded `_id=slot-1`; the harness had falsely projected only `item.id`
  and was repaired to accept Mongo's embedded `_id` representation.
- The save trace showed `/events/sync` followed by `/sub-events` only about five
  seconds later. The list-owned save effect previously invalidated its query;
  it did not imperatively invoke the already-mounted SmartList loader.
- The frontend persistence boundary now converts non-closed template starts to
  ISO instants together with the parent bounds, without mutating the editor
  model. The matching save effect now clears its canonical load keys and calls
  the Sub Events SmartList `reload()` directly, falling back to a query revision
  only when the list is not mounted. The save still produces one canonical
  Sub Events GET rather than a duplicate request.
- The running frontend watcher compiled and deployed the repair without errors
  in 9.339 seconds at `2026-09-01T03:31:16.836Z`. The repair replay must retain
  the already-open list, Save once without changing the verified values, and
  show six unique Wednesday sections from September 2 through October 7, each
  containing Qualifier then Final exactly once. Persisted/read-side evidence is
  still required before PASS.
- First reload repair retest: Saves at 05:34:39, 05:35:44 and 05:36:24 were not
  followed by a list-owned `/sub-events` request; the only 05:35:17 load came
  from Casey's manual browser reload. The parent Activities effect consumed and
  cleared the shared save message before the nested Sub Events effect observed
  it. Event Editor now emits a dedicated durable, monotonically revisioned
  event-save reload request through the Sub Events store. The matching open
  list observes that request directly and invokes its own SmartList loader; no
  unrelated Activities consumer clears it. The watcher compiled this repair in
  5.748 seconds and synced it at `2026-09-01T03:38:01Z`.
- PASS after the dedicated reload repair: Casey extended the parent end to
  October 14 and saved once. The matching `/events/sync` completed at
  05:40:24.211 and the already-open Sub Events owner began `/sub-events` at
  05:40:24.228, 17 ms later, without a browser reload. Casey then restored the
  required October 7 12:00 PM boundary; the 05:41:29.590 Save was followed by
  the list load at 05:41:29.605, 15 ms later, and the October 14 section was
  removed without reopen.
- The final persisted oracle contains one DR Weekly Tournament parent ending
  `2026-10-07T10:00:00Z`, one open `slot-1` template at
  `2026-09-02T08:00:00.000Z`, the exact Qualifier/Final definitions, one
  accepted Casey Admin and no generated rooms, tournament groups, stage runtime
  or leaderboard state. The read endpoint returns exactly six unique weekly
  sections from September 2 through October 7, all under `slot-1`; each section
  contains Qualifier then Final once with occurrence-scoped times and no
  `MAIN_EVENT` or `:default` child. Source checkpoint `EVENT-SLOT-001` is
  **PASS**.

### `EVENT-SLOT-002` — future occurrence operation gating

- Clean verdict baseline (`2026-09-01T04:07:16.244Z`): independently staged active
  Public Weekly Tournament `QA EVENT-SLOT-002` with accepted Casey Admin and
  accepted Nova Member. The read-only harness/API oracle returns future sections
  September 8 and 15, each with `Qualifiers` then `Final` in
  `RS`/`awaiting-tournament-start`, and no stage runtime, generated group,
  leaderboard, recompute-task, outbox or notification state.
- Exact visible expectation: Casey's event-card menu includes `Manage Event`
  and `View`; Nova's includes `View` but no `Manage Event` or `Edit Event`.
  Across both future sections, the Qualifiers and Final runtime menus expose
  only `Groups` to both actors. `Start Stage`, `Close Stage`,
  `Finalize Stage`, `Reopen Scores`, `Suspend Tournament` and
  `Resume Tournament` must all be absent.
- Retained repair evidence: the first manual inspection left the read-only path
  by performing Unpublish -> Publish. The local Event Editor sync exposed
  `Multislot`, but a subsequent list poll could replace it because `EventDto`
  and the narrow list-card projection omitted `slotsEnabled`. The same local
  sync also rendered organizer initials when its detail DTO lacked the enriched
  avatar. The repair adds `mode`/`slotsEnabled` to the backend list contract and
  projection, preserves organizer/avatar fields in HTTP cloning, and applies
  one organizer enrichment helper to Create/Save and Publish/Unpublish display
  sync. Backend and frontend hot-deploy both compiled successfully. The
  hard-reload publication replay visually passed with the real Casey avatar and
  structural `Multislot` badge stable in Draft, Active and after polling. That
  contaminated run was reset; the clean verdict baseline above was restaged and
  its read-only status confirms zero lifecycle/recompute tasks, outbox,
  notifications, runtime, generated groups or leaderboard rows.
- Inspect the controlled future occurrences as host and participant.
- Verify members, transport, accommodation and supplies actions follow the
  saved definition and actor permission. Structure editing is host-only.
- A future tournament stage must not expose Close or Finalize before its time
  and status prerequisites. A casual sub-event must not expose tournament
  actions at all.
- Opening any runtime menu is an `X` write checkpoint: no task, outbox or
  stage-runtime mutation is allowed.
- Final verdict (`2026-09-01`): **PASS**. Casey and Nova confirmed the expected
  future-occurrence presentation and operation gating. The post-inspection
  Docker-backed oracle remained identical to the clean baseline: both accepted
  memberships and both RS definitions were unchanged, while lifecycle tasks,
  recompute tasks, outbox, notifications, stage runtime, generated groups and
  leaderboard rows all remained empty. Source checkpoint `EVENT-SLOT-002` is
  **PASS**.

### `EVENT-SLOT-003` — close one past generated stage

- Corrected clean baseline (`2026-09-01T04:19:57.213Z`): active Public Weekly Tournament
  `QA EVENT-SLOT-003`; recent-past slot start `2026-09-01T01:19:57Z`;
  only that slot's Qualifiers has an RS `awaiting-tournament-start` runtime,
  one active Group A with Nova/Riley and leaderboard scores 7/4. The parent
  definitions and September 8 occurrence are controls. Lifecycle/recompute
  tasks and outbox are empty before the direct action.
- Retained fixture-repair evidence: the first Close attempt exposed that the
  raw Mongo fixture wrote the embedded template key as `id`, while the real
  Java persistence shape uses `_id`. The sub-events API therefore produced a
  malformed `:slot::2026-09-01...` owner and the action created a second SR
  runtime beside the intended RS runtime. This run is ineligible for a product
  verdict. The fixture now uses `_id`; reset/restage and API identity parity are
  required before replaying Close. The corrected restage passed that gate: the
  API returns the full stable template-bearing owner ID, one RS Qualifiers
  runtime, and zero pre-action task/outbox rows.
- The corrected UI replay then targeted that one runtime successfully, but
  exposed a second count mismatch. The first fixture stored only its manual
  Group A as `groupsCount=1`; an interim fixture matched the then-current
  production sum at `3`. The following leaderboard checkpoint proved that the
  generated Group A and persisted manual Group A share the same group ID and
  are one logical group, so appending and counting both was a product merge
  defect rather than a canonical third group. The backend now overlays the
  persisted group by ID and both runtime-count paths count unique IDs. The
  fixture therefore derives the canonical two groups.
- Use the helper's exact `recentPastSlotId`, select Past order and locate its
  Qualifier stage.
- The ended RS/A stage exposes Close Stage; future and unrelated occurrence
  sections do not.
- Close once and verify only the slot-scoped runtime row changes to SR with
  reason `stage-closed`. The parent definition and sibling occurrence runtime
  remain unchanged.
- The direct mutation may enqueue normal event recompute, but it is not proof
  that `event-tournament-review` ran.
- Final verdict (`2026-09-01`): **PASS**. Casey's clean UI route and the final
  authenticated HTTP regression replay both targeted the same full
  template-bearing slot owner. The clean post-fix replay staged at
  `2026-09-01T04:39:43.360Z`; exactly one runtime changed `RS` -> `SR` with
  reason `stage-closed`, canonical `groupsCount` remained `2 -> 2`, parent
  definitions stayed RS, Group A and Nova/Riley scores 7/4 were byte-stable,
  and no room, generated group or tournament-review state appeared. The direct
  producer created exactly one pending `EVENT_CHANGED` recompute and two
  participant notification outbox rows. The fixture was reset and proved
  `not-staged`. Source checkpoint `EVENT-SLOT-003` is **PASS**.

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

Execution and repair evidence (`2026-09-01`):

- The clean baseline staged at `2026-09-01T04:34:10.060Z` as active Public
  Weekly Tournament `QA EVENT-SLOT-004`. Its recent-past occurrence was
  `2026-09-01T01:34:10Z`; Qualifiers was `SR`/`stage-closed` with canonical
  `groupsCount=2`, one persisted Group A membership for Nova/Riley and exact
  slot-scoped score entries 7/4. The September 8 occurrence, parent
  definitions, recompute tasks, outbox, rooms and generated groups were clean
  controls.
- Read-only preflight found two product defects before the user action. The
  frontend stage snapshot loaded groups with the slot ID but loaded leaderboard
  data with the parent event ID. The backend also appended a persisted manual
  override after the generated group with the same ID, producing duplicate
  Group A and an inflated runtime count. The frontend now uses the selected
  slot owner for both snapshot requests; the backend overlays same-ID persisted
  groups and both runtime-count paths count unique IDs. Focused regression
  sources cover slot-owner selection and same-ID overlay. The already-running
  Angular and Java hot-deploy owners compiled and deployed the changes
  successfully without a parallel build or test process.
- The clean post-repair API baseline returned exactly Group A once with Nova
  and Riley, generated empty Group B once, Nova/Riley totals 7/4, and no score
  entries in the September 8 control occurrence. Casey then completed the
  manual Groups/Standings/History flow and reported the presentation correct.
- The single Save at `2026-09-01T04:36:27.142609152Z` inserted exactly one
  score row under the September 1 slot, Qualifiers, Group A and Nova identity:
  value `+3`, note `EVENT-SLOT-004`. The reopened API state was Nova total 10
  with two updates and Riley total 4 with one update; the September 8 control
  retained zero entries and zero non-zero totals. Runtime status/count, Group
  A membership, parent definitions and unrelated domain state were unchanged.
- The producer inserted one slot-targeted tournament-input affinity recompute
  task immediately after Save. The existing worker processed it at
  `2026-09-01T04:36:51Z`; no review, lifecycle, notification, room or generated
  group side effect was attributed to the read or Save. Final verdict:
  **PASS**. The fixture was reset. Source checkpoint `EVENT-SLOT-004` and the
  consolidated `EVENT-SLOT-TOURNAMENT-001` journey are **PASS/CLOSED**.

## Event scheduler checkpoint

### `EVENT-SCHEDULERS-001` — isolated Event background-worker lifecycle

Execution evidence (`2026-09-02`):

- `Automatic room assignment` completed through the real scheduler with six
  affected users. Its required notification-outbox wake-up also ran exactly
  once; the persisted oracle proved two 3/3 rooms, unique membership, two Event
  and Chat projections, two main Event runtime cards, welcome messages and
  exact user-counter deltas. The repaired runtime card was confirmed in the UI.
- `Close past events` completed once with one affected Event and once with zero
  work. The second pass preserved the first-pass domain fingerprint. The user
  confirmed the retained Past card, `1 / 8` badge, main Event runtime and the
  exact counter transition.
- `Delete expired baskets` was replayed in isolation. The real scheduler ran
  once at `2026-09-02T08:18:21.059040243Z`, completed with one affected item
  and moved Metrics from `1186/1186` to `1187/1187`. The expired basket became
  `deleted` with reservation/counter tracking cleared; the future-control
  basket and Event remained byte-identical. Without reloading Explore, the
  user confirmed the Basket disappeared and the Event menu returned to
  `Book Event`.
- No UI `Run`, direct worker endpoint, fabricated runtime/history value or
  duplicate process was used. The fixture reset restored every target and
  isolated rule configuration; final status is `phase=not-staged` and
  `prepared=false`. **PASS/CLOSED.**

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
  active/hosting counters became zero. The user completed the final deletion
  check and classified the deletion/counter branch as executed: Casey's
  organizer Trash counter was `1` and the exact event appeared there once.
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
  to Trash and saw exactly one `QA EVENT-LIFE-002` card. The final fresh-bundle
  organizer reconstruction also showed Trash `1` and the same card exactly
  once; the user accepted this deletion-counter branch as fully executed.
- Participant foreground poll scope **INITIAL FAIL, FIX VERIFIED / PASS**:
  Nova's already-open Active Events list removed the card and set
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
  transition. No separate build or SmartList-core change was made. Final
  fresh-bundle reads passed for both roles: Nova All was empty with no
  Events/All badge, while Casey Trash was `1` with exactly one event. The user
  explicitly closed the Activity Events counter fix as executed/PASS; no
  Restore replay remains as a condition of this checkpoint.
- Notification Center UI read **PASS**: Nova opened Notifications **New** and
  saw the exact unread `QA EVENT-LIFE-002` / `The event was deleted.` row without
  opening it. The guarded terminal verifier was repeated at
  `2026-08-13T21:05:00.659Z` and still found exactly that one row with an empty
  `readAtIso`, one matching pending dev-mode outbox and no duplicate lifecycle
  effect.
- Fresh-bundle participant reconstruction **PASS**: after one Nova reload,
  Events > All was empty and neither the main Events control nor the All bucket
  showed a red counter. This loaded the synced frontend fix and agreed with the
  persisted Active/All `0/0` oracle without a corrective second bucket load.
- Fresh-bundle organizer reconstruction **PASS**: after one Casey reload,
  Events > Trash showed counter `1` and exactly one `QA EVENT-LIFE-002` card.
  `EVENT-LIFE-002` is **PASS/CLOSED**. Its Delete producer must never be replayed;
  the retained trashed state continues independently into `EVENT-LIFE-003` on
  the next QA session.

### `EVENT-LIFE-003` — organizer restore returns to the preserved bucket

- Resume baseline (2026-08-14): a deliberate full dev-stack seed reset removed
  the retained `EVENT-LIFE-002` transaction. Its already-PASS Delete was not
  replayed. The guarded stale checkpoint was discarded and this checkpoint was
  staged directly at `T`, `statusBeforeSuppression=A`, Casey Admin + Nova
  accepted Member `2 / 8`, Casey Trash `1`, Nova Active/All/Trash `0`, with no
  lifecycle or recompute artifacts. The first direct stage incorrectly gave
  Nova a personal Trash counter; the harness reconstruction was corrected so
  organizer Trash is host/admin-only while participant membership Trash remains
  a distinct branch.
- Restore the same controlled event once from Trash.
- Verify `statusBeforeSuppression` and `trashedAtIso` are cleared and the event
  returns to its preserved draft or active status, not an arbitrary default.
- Verify the matching organizer bucket and Explore visibility are restored
  according to that status and visibility. No duplicate event, member,
  attachment or ticket credential may be created.
- Require one event recompute signal. Refreshing after the completed restore is
  a read-only `X` checkpoint.
- Executed **PASS/CLOSED** on 2026-08-14. Casey saw Trash `1` and the single
  staged card, then restored it exactly once. The card/counter disappeared
  in-place and Nova's normal foreground poll exposed the restored event without
  reload. The persisted oracle retained exactly one event identity and the
  exact Casey Admin + Nova Member `2 / 8`; status returned to `A`, published was
  true, suppression fields cleared, and member/resource/basket/payment/ticket/
  chat/lifecycle-notification cardinality stayed unchanged (`1/2/0/0/0/0/0`).
  Casey counters changed Hosting/My Events `+1`, Trash `-1`; Nova changed
  Events/Active/All `+1` with Trash unchanged at `0`. Fresh reloads reproduced
  the same single card for Casey My Events and Nova Active/All without creating
  another task. The guarded terminal verifier passed at
  `2026-08-14T11:23:42.462Z` with one completed coalesced recompute record
  containing `EVENT_CHANGED`. Organizer Restore must not be replayed.

### `EVENT-LIFE-004` — participant leave/restore is not organizer trash

- Branch A — participant Leave:
  - From Nova's accepted participant session, leave the retained event without
    organizer authority. Casey remains an untouched organizer control.
  - In place, Nova loses Active/All and gains exactly one personal Trash card;
    the canonical Casey event remains active and never enters global Trash.
  - Persisted state must contain the active Casey canonical record with Casey
    occupancy `1 / 8`, the same Nova-owned `T` overlay with
    `statusBeforeSuppression=A`, and Nova's same root membership as
    `suppressed/statusBeforeSuppression=accepted`. Casey remains Hosting/All/
    Trash `1/1/0`; Nova is Active/All/Trash `0/0/1`.
  - The retained main-event chat removes only Nova and appends exactly one
    `member-left` system message. Resource, basket, payment, ticket, lifecycle
    notification/outbox/task collections remain unchanged; one coalesced
    `EVENT_MEMBERS_CHANGED` recompute is conditional.
- Branch B — participant Restore:
  - Restore through Nova's documented personal Trash UI. The same overlay and
    membership identities return to active/accepted with all suppression
    fields cleared; Casey remains the canonical organizer and occupancy returns
    to `2 / 8`.
  - Casey remains Hosting/All/Trash `1/1/0`; Nova returns to Active/All/Trash
    `1/1/0`. The same chat adds Nova back and appends exactly one
    `member-joined` system message, without organizer lifecycle artifacts.
- After a write-side repair, replay only Branch B → Branch A → fresh Nova read
  → Branch B. Do not repeat organizer Delete/Restore checkpoints.

Execution evidence on 2026-08-14 — PASS/CLOSED:

- Baseline captured at `2026-08-14T11:27:35.272Z`: one active public retained
  source, Casey accepted Admin + Nova accepted Member `2 / 8`, Casey counters
  `1/1/0`, Nova counters `1/1/0`, and no resource/ticket/lifecycle/recompute
  artifacts after advance.
- Original Branch A UI PASS at `11:30:37.368Z`: Nova disappeared from
  Active/All and appeared once in personal Trash without reload; Casey was
  untouched. Canonical/member/chat/recompute identity behavior also matched.
- FAIL retained as exact transaction evidence at `11:40:21.600Z`: Java stored
  Nova Active/All/Trash as `0/0/0`. The UI's Trash1 came only from the immediate
  response delta. After the backend hot-restart/poll, Nova's Trash `+1` did in
  fact disappear, independently proving that the result was not reload-safe;
  the unbadged Trash query is checked separately before Restore.
- Root cause: the stored counter projector recognized only legacy `deleted`
  membership, not the current restorable suppressed-membership + personal
  Trash-overlay invariant. The backend projector and focused regressions were
  updated without changing SmartList or query behavior; hot-deploy compile and
  same-process restart passed. Corrected Branch A/B replay remains required
  before this row can close.
- First corrected Branch B PASS: Nova restored once at
  `2026-08-14T11:46:51.871Z`; the verifier passed at `11:48:20.510Z`. Both
  retained event records returned to `A`, Nova's membership returned to
  accepted with suppression fields cleared, occupancy was `2 / 8`, Casey
  remained `Hosting/All/Trash=1/1/0`, Nova persisted
  `Active/All/Trash=1/1/0`, and exactly one `member-joined` system message was
  appended. Casey and Nova received per-user projections of the same logical
  main-event `chatId`; no lifecycle artifact was created. This exact active
  result is the saved boundary for one corrected Leave replay.
- Corrected Branch A write and poll PASS: Nova left once at
  `2026-08-14T11:49:59.492Z`; the persisted verifier passed at
  `11:50:43.614Z`. Casey remained active/Hosting with occupancy `1 / 8`; the
  same Nova overlay/member identities became restorable Trash/suppressed;
  Nova stored `Active/All/Trash=0/0/1`; exactly one additional `member-left`
  message was appended and no organizer lifecycle artifact appeared.
  `/activities/events/filter` and realtime polls continued repeatedly after
  the action. A read-only Nova DOM observation at `11:51:56.515Z`, after
  several of those polls, still showed Trash badge `1` and the single retained
  card. The earlier poll-to-zero defect is fixed.
- Corrected Branch A fresh-read PASS: after Nova reloaded, read-only DOM at
  `2026-08-14T11:57:00.024Z` still showed Trash badge `1` and exactly one
  `QA EVENT-LIFE-003` card. Java identity/counters were unchanged. The one
  coalesced `EVENT_MEMBERS_CHANGED` task completed at
  `11:55:18.567932813Z` with no error. Only final Restore verification remains.
- Final corrected Branch B write PASS: Nova restored once at
  `2026-08-14T11:58:15.854Z`; verifier passed at `11:58:43.059Z`. The same
  canonical/overlay/member identities returned to active/accepted with all
  suppression fields cleared, occupancy returned to `2 / 8`, Casey persisted
  `Hosting/All/Trash=1/1/0`, Nova persisted `Active/All/Trash=1/1/0`, and
  exactly one further `member-joined` message restored Nova's per-user chat
  projection. Resource, basket, payment, ticket and organizer lifecycle
  collections remained unchanged.
- Final fresh-read PASS: at `12:02:04.080Z` Casey's reloaded My Events DOM and
  at `12:02:16.892Z` Nova's reloaded Active Events DOM each contained exactly
  one `QA EVENT-LIFE-003` card at `2 / 8`; neither DOM contained Trash. The
  Java oracle remained identical.
- Final worker PASS: the single coalesced `EVENT_MEMBERS_CHANGED` task finished
  `done` at `12:03:21.935803588Z`, attempt `5`, with empty `lastError`; no
  organizer lifecycle task/outbox/notification was created.
- Frontend-local parity was inspected because this defect can affect offline
  execution: local Leave persists a viewer-owned `T` record, recomputes and
  persists the user Trash counter, and flushes both event and user state to
  IndexedDB; local Restore reverses that path. No analogous missing local
  write was found, so no frontend-local production change was made.
- PASS/CLOSED. Continue once with `EVENT-LIFE-005`; never replay either
  participant Leave or Restore producer from this checkpoint.

### `EVENT-LIFE-005` — bucket reads and no-op navigation

- Open Hosting, Drafts, Attending, Invitations and Trash for the staged users,
  then close/reopen and refresh each view without changing a domain object.
- Verify each event identity occurs only in its documented bucket and that no
  read action changes status, membership, counters, recompute tasks, outbox or
  job history.
- A duplicate card, a card in mutually exclusive lifecycle buckets, or a
  write caused by navigation is a failed checkpoint.

Execution evidence on 2026-08-14:

- Retained active state advanced once from closed `EVENT-LIFE-004` at
  `2026-08-14T12:06:16.837Z`; no lifecycle producer was replayed.
- Read-only baseline captured at `12:08:10.833Z`: same Casey canonical + Nova
  overlay, Casey Admin + Nova Member `2 / 8`, Casey My Events/All/Trash
  `1/1/0`, Nova Active/All/Invitations/Trash `1/1/0/0`, and no post-advance
  recompute delta.
- The saved oracle covers event, member, resource, basket, payment, ticket,
  chat, notification, outbox, lifecycle, recompute, feedback, runtime,
  tournament, leaderboard and both users' complete event-counter snapshots.
  Global worker heartbeat timestamps are intentionally excluded; the final
  verifier requires every event-scoped persisted value to remain byte-logically
  identical.
- Organizer read/refresh branch PASS: Casey observed exactly one retained
  `QA EVENT-LIFE-003` card in My Events at `2 / 8`, Drafts empty before and
  after reload, Trash empty before and after reload, then the same single My
  Events card after the final reload. No action menu was opened and Nova was
  untouched. The independent Casey DOM read at
  `2026-08-14T12:16:03.252Z` confirmed My Events count `1`, the same card at
  `2 / 8`, and no Trash label/card.
- Participant read/refresh branch PASS: Nova observed exactly one retained
  `QA EVENT-LIFE-003` card in Active Events at `2 / 8`, Invitations empty
  before and after reload, Trash empty before and after reload, then the same
  single Active Events card after the final reload. No action menu was opened
  and Casey was untouched. The independent Nova DOM read at
  `2026-08-14T12:18:28.571Z` confirmed Active Events count `1`, the same card
  at `2 / 8`, and no Trash label/card.
- The first terminal comparison correctly stopped on an `events` mismatch,
  but the new field-level diagnostic proved both event records had the same
  absent `statusBeforeSuppression` value: the saved BSON snapshot represented
  it as `null`, while the fresh in-memory object used `undefined`. The harness
  now recursively canonicalizes absent snapshot values before persistence and
  comparison and exposes a separate read-only field-diff command. No product,
  fixture or browser state was changed and no manual branch was replayed.
- Corrected terminal verifier PASS at `2026-08-14T12:22:09.765Z`: the exact
  Casey canonical and Nova overlay remain active at `2 / 8`; Casey
  My Events/All/Drafts/Trash are `1/1/0/0`; Nova
  Active/All/Invitations/Trash are `1/1/0/0`. No event-scoped event, member,
  resource, basket, payment, ticket, audit, chat, notification, outbox,
  lifecycle, recompute, feedback, runtime, tournament, leaderboard or user
  counter value changed.
- PASS/CLOSED. Do not replay either read/refresh branch; continue with the
  independently staged `EVENT-INV-001` invitation transaction.

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
- While that invitation is still pending, it must create neither an event-chat
  owner copy nor any flat/nested chat counter increment. Chat materialization
  and its channel counter belong only to terminal acceptance.
- The membership oracle must be event-scoped, pending and `requestKind=invite`;
  it must not be confused with an asset invitation or a member-origin join
  request.

Execution evidence in progress on 2026-08-14:

- `EVENT-LIFE-005` was closed and reset through its versioned snapshots; the
  independent invitation fixture was staged at
  `2026-08-14T12:28:35.835Z` with event identity
  `manual-qa-checkpoint:v1:event-domain:event`, title `QA EVENT-INV-001`, one
  Casey Admin membership, accepted/pending `1 / 0`, capacity `8`, and no Nova
  membership, invitation, notification, outbox or recompute record.
- The first untouched invitation stage exposed a fixture projection omission:
  unlike a normal owning write it did not synchronize persisted event menu
  counters. No manual action had run. The harness now snapshots the relevant
  users, invokes the shared event-counter projector for every invitation
  stage, restores those snapshots on reset and includes counters in its
  oracle. The defective untouched stage was reset and staged cleanly again.
- Corrected persisted baseline: Casey Hosting/All/My Events is `1/1/1` with
  Drafts/Trash `0/0`; Nova Events/All/Invitations/Trash is `0/0/0/0`. The
  fixture delta relative to the pre-stage user snapshots is Casey Hosting+1
  and All+1 only; Nova remains unchanged.
- Versioned invitation action baseline captured at
  `2026-08-14T12:32:13.618Z`. The terminal verifier now requires the one
  Casey-authored Nova membership (`pending`, `pendingSource=admin`,
  `requestKind=invite`), accepted/pending `1/1`, Nova Invitations/All `1/1`,
  exactly one unread Nova `event-invite` inbox record plus its Casey-to-Nova
  outbox identity, stable Casey counters and no unrelated lifecycle, chat,
  resource, payment, ticket or recompute change.
- Owner list baseline PASS at `2026-08-14T12:36:43.730Z`: Casey's reloaded
  My Events DOM shows counter `1` and exactly one `QA EVENT-INV-001` card at
  `1 / 8`. The DOM remained on My Events, so the separate Members identity
  view has not yet been observed and is not inferred from the card.
- Owner Members baseline PASS at `2026-08-14T12:39:59.759Z`: the exact event
  Members DOM shows `1 members`, one `Casey Bridge, 32` row with
  `Admin · Austin`, and no pending member row. Invite is available but no
  candidate was selected and Save has not run.
- Single Invite+Save producer executed by Casey at
  `2026-08-14T12:42:53.087Z`. Casey's still-open Members DOM at
  `12:43:14.933Z` converged in place to `1 members · 1 pending`, with Nova
  exactly once as `Invitation Pending`, Casey exactly once as Admin, accepted
  occupancy still `1 / 8` and pending badge `1`.
- Terminal persisted verifier PASS at `12:43:33.363Z`: the one canonical event
  stores accepted/pending `1/1`, Casey accepted Admin and Nova pending Member;
  Nova has `pendingSource=admin`, `requestKind=invite` and
  `invitedByUserId=Casey`. Casey counters remained Hosting/All `1/1`; Nova
  persisted Invitations/All became `1/1`, with Active/Pending/Trash `0/0/0`.
  Exactly one Casey-to-Nova `event-invite` outbox row and one unread Nova inbox
  notification exist. Resources, baskets, payments, tickets, chats, member
  approval, lifecycle and recompute records remained unchanged.
- Recipient pre-list DOM PASS at `12:43:48.899Z`: Nova shows Invitations badge
  `1` and notification badge `1`; Notifications contains exactly
  `1 new notification` for `QA EVENT-INV-001`, attributed to
  `Casey Bridge · Event`, while Active Events remains empty. The user also
  confirmed the single notification. The notification item has not been
  clicked/read.
- Recipient Invitations-list DOM PASS at `12:48:54.554Z`: Nova shows exactly
  one `QA EVENT-INV-001` card at accepted occupancy `1 / 8`, pending badge `1`
  and Invitations counter `1`.
- A preliminary `Chats 1` observation was isolated as a checkpoint-transition
  browser baseline defect, not a product write. Nova's document was loaded at
  `12:18:04.822Z`, before the independent invitation fixture was staged at
  `12:28:35.835Z`; its retained frontend snapshot still contained the prior
  event-chat count. The active chat-list poll scope was empty. Persisted Mongo
  state and an authenticated Nova realtime response both proved `chats=0`,
  `chat.all=0`, `chat.event=0`, with no event-chat document or message.
- Focused convergence replay PASS: closing Activities allowed the existing
  popup-zoned realtime poll to replace the stale snapshot with chat zero while
  retaining Invitations `1`. Reopening Invitations without reload still
  showed the same single pending card and no Chats badge or chat channel.
- **PASS / CLOSED** — the manual pending projections, notification identity,
  pre-acceptance chat isolation and terminal persisted oracle agree. Do not
  repeat Invite+Save for later invitation checkpoints.

### `EVENT-INV-002` — pre-acceptance privacy boundary

- Open the recipient session while the invitation remains pending.
- The event may be viewed only through the invitation affordance allowed by
  policy. Accepted-member-only controls, main/group chat membership and
  participant resources must remain unavailable.
- A direct chat request or stale deep link must be rejected, not merely hidden
  by the menu.

Execution evidence on 2026-08-04:

- LOCAL UI PASS / CLOSED: Riley could open the invitation card and the event's
  read-only view. The editor fields were disabled, and no event chat or
  participant-resource action was visible. Invitation-specific View, Accept
  and Reject actions were present.
- The event uses Open Event member preview, so the
  Members affordance is expected to be visible. The demo session bypasses the
  production authenticated access-policy gate. The Firebase-authenticated
  direct/deep-link denial is therefore migrated as an explicit assertion into
  `DEPLOY-FIREBASE-LIFECYCLE-001`, where it can be exercised with a verified
  non-demo identity. It no longer blocks the local Event pass and must not be
  replayed as an Event microcheck in the demo stack.
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

Execution evidence in progress on 2026-08-14:

- Independent fixture staged at `2026-08-14T13:04:52.610Z`; a second status
  oracle confirmed one active Open Event `QA EVENT-INV-004`, capacity `8`,
  accepted/pending `2/1`: Casey accepted Admin, Nova accepted ordinary Member,
  and Riley pending Member with `pendingSource=member`, `requestKind=invite`
  and `invitedByUserId=Nova`.
- Baseline isolation PASS: no event chat, chat message or chat notification
  exists, and Casey, Nova and Riley all have flat/nested chat counters zero.
  Riley has Invitations/All `1/1`, Nova has Active/All `1/1`, and Casey has
  Hosting `1`.
- Browser baseline PASS at `2026-08-14T13:07Z`: three fresh post-stage managed
  sessions show Casey `My Events 1 / Chats 0`, Nova `Events 1 / Chats 0`, and
  Riley `Invitations 1 / Chats 0`. No recipient Accept or Admin Approve action
  has run.
- Recipient list/action baseline PASS at `13:13:08.957Z`: Riley's untouched
  Invitations list contains exactly one `QA EVENT-INV-004` card at accepted
  occupancy `2 / 8`, pending badge `1` and Invitations counter `1`; Chats has
  no badge. The second persisted status oracle is the retained pre-Accept
  comparison boundary.
- Riley Accept executed once at `2026-08-14T13:24:05.641Z`. Persisted
  transition PASS: the same Riley membership remains `pending`, accepted/pending
  remains `2/1`, `requestKind` changes `invite -> approval`, Riley moves from
  invited IDs to pending-request IDs, Invitations changes `1 -> 0` and Pending
  changes `0 -> 1`. No duplicate membership was created.
- Pre-Admin chat isolation PASS: no event chat, message or chat notification
  exists and all three actors retain flat/nested chat zero. Casey received
  exactly one unread `event-admin-join-request` notification naming Riley; the
  Admin approval notification/outbox is still absent.
- In-place control DOM PASS at `13:25:28Z`: Riley has no Invitations or Chats
  badge, Nova remains Events `1` with Chats `0`, and Casey's already-open My
  Events card remains `2 / 8` with pending badge `1`; Casey notification count
  changed `3 -> 4`. Admin approval has not run.
- Admin Members/action baseline PASS at `13:28:29.242Z`: Casey sees
  `2 members · 1 pending`, Riley exactly once as `Member · Austin / Waiting
  For Admin Approval`, Casey exactly once as Admin and Nova exactly once as an
  accepted Member. A repeated read-only status retained the same membership,
  zero-chat and exact-one join-request boundary; opening Members wrote nothing.
- First Admin Approve executed once at `13:31:14.869Z`. The terminal Java
  write/read oracle PASSed at accepted/pending `3/0`: Riley became accepted
  exactly once, one owner projection of the same `mainEvent` chat exists for
  Casey, Nova and Riley, one `member-joined` system row exists, every actor has
  flat/nested Chats `1`, and Riley alone received one unread
  `event-member-approved` notification plus one outbox row. No system-derived
  chat notification exists.
- Terminal Members read branches PASS: the user observed the accepted member
  state through the normal Members poll, after close/reopen and after the
  refreshed read. The Admin action-owning document nevertheless retained
  Casey Chats `0` while Members stayed open. This is a focused UI FAIL: popup
  ownership correctly suppressed the side-menu domain poll, while the action
  response returned only the member list and omitted the already-persisted
  canonical actor counters.
- Repair deployed through the existing dev watchers: the Java member-action
  response now returns the completed actor counter snapshot; the base frontend
  applies it atomically with a pre-request revision token. The HTTP adapter
  tolerates the old array during hot-deploy overlap. Frontend-local parity now
  synchronizes the event member projection, event chat/system message and
  stored user counters, and rebases later local realtime reads from that stored
  state.
- Focused replay prepared at `2026-08-14T13:56:35.748Z` by a guarded versioned
  command. It removed only approval-owned chat/message, approval notification,
  approval outbox and recompute artifacts, restored the same Riley row to
  pending `requestKind=approval`, and retained Riley's earlier Accept evidence
  and Casey's exact-one join-request. The proven replay baseline is
  accepted/pending `2/1`, every Chats counter `0`, zero approval artifacts and
  no chat. Casey's already-open Members surface converged by its own poll to
  `2 members · 1 pending` with Riley once Waiting For Admin Approval.
- Incidental Riley Impressions observation was separated from event attendance
  evidence before the approval replay continued. The read oracle found only
  Riley's current pending `EVENT-INV-004` membership, no check-in, no feedback
  state and no feedback answer. Realtime attendance metrics were all empty
  (`totalEvents`, `peopleMet` and average rating), while the visible statistics
  were profile-derived personality percentages with `evidenceCount=0`. Riley's
  briefly observed red Impressions change badge therefore does **not** prove a
  prior attended event and is not attributed to this checkpoint transaction.
  After opening the surface the current realtime change flags were both false.
- The first repair replay attempts were not valid evidence against the new
  frontend: Casey's document had loaded `main.js` at `13:06:33Z`, before the
  repair bundle was generated at `13:53Z`. The Java action endpoint itself was
  diagnosed without a write and returned the new object shape with three
  members plus canonical Casey `Chats/All/Event = 1/1/1`. A later screenshot
  also exposed Nova's retained terminal `Chats 1` after the database had been
  re-armed to zero. These were stale client generations, not a new product
  failure. Casey was reloaded at `14:40:35Z`; Nova and Riley were reloaded at
  `14:57:00Z`. The shared pre-approval UI baseline then proved `Chats 0` in all
  three documents and the persisted oracle still proved accepted/pending
  `2/1`, no chat and no approval artifacts.
- Fixed terminal replay PASS at `2026-08-14T15:13:47Z`: Casey approved Riley
  exactly once from the freshly loaded document while Members remained open.
  The same document changed from no Chats badge to `Chats 1` through the action
  response and showed `3 members`, Riley once accepted and no remaining
  Approve control. The user's `17:14` screenshot independently shows the same
  `3 members` list plus Nova and Riley both at `Chats 1`, with Riley's approval
  notification badge present.
- Terminal persisted oracle PASS: accepted/pending is `3/0`; Casey, Nova and
  Riley own the same `mainEvent` channel with the same three member IDs and
  `unread=1`; exactly one `Riley Outside joined the event.` system row exists.
  All three stored flat/nested Chats counters are `1/1/1`. Riley alone has one
  unread `event-member-approved` notification and one matching outbox intent;
  the system row creates no `chat-message` notification or outbox artifact.
  The intended simple rule is deliberately shared: the join system event is
  unread for all current channel members, including the joining member; no
  actor exception or special WebSocket/channel/aside-poll branch is required.
- Terminal worker PASS: the single `EVENT_MEMBERS_CHANGED` recompute became
  eligible at `15:18:47Z` and the normal worker completed it at
  `15:19:45.623Z` on attempt `1`, with empty `lastError`. The post-worker read
  retained accepted/pending `3/0`, all three unread owner copies, the exact-one
  join row and the target-only approval notification. `EVENT-INV-004` is
  **PASS / CLOSED; FIX VERIFIED**. Do not repeat Riley Accept or Admin Approve.

### `EVENT-INV-005` — reject, cancel, capacity and idempotence

- Cover recipient rejection, inviter cancellation before response, a seat
  reserved by an existing invitation, a full event and repeated accept/save.
- No branch may create duplicate memberships, overbook capacity, leave a live
  invitation bell after resolution or grant chat access after reject/cancel.
- Branch A — recipient rejection is a separate short lineage. Stage Casey and
  Nova as the two accepted occupants and Riley as the one pending invitation
  that reserves the third and final seat (`2 accepted + 1 reserved / 3`). Riley
  rejects once. In place, Riley's invitation card and `Invitations` counter
  disappear while `Chats` stays zero. The persisted oracle must retain Casey
  and Nova accepted, suppress only Riley's invitation, clear every live
  pending/invited projection and resolve the invitation notification without
  creating chat, acceptance/approval notification or duplicate work.
- The first 2026-08-14 branch-A attempt is **NOT EXECUTED — fixture defect**.
  The old fixture incorrectly staged capacity `1` while Casey and Nova were
  already accepted and Riley held another reserved invitation. Reject itself
  removed Riley in place and kept chats/artifacts at zero, but the first normal
  embedded-member refresh necessarily normalized the impossible `1` to the two
  accepted occupants. This was not accepted as product evidence. The fixture
  now stages the coherent full/reserved boundary at capacity `3`; replay only
  Riley Reject after reset, not any earlier checkpoint producer.
- Repaired branch-A replay, manual/UI and immediate persisted boundary
  **PASS** at `2026-08-14T15:40:50.696Z`: the user confirmed the predeclared
  in-place Invitations `1 -> 0` removal with Chats still `0`. The independent
  oracle retained capacity `3`, accepted/pending `2/0`, exact Casey Admin and
  Nova Member accepted identities, and one Riley membership suppressed from
  `pending` under the same event root. Every live pending/invited list is empty;
  chat/message and invitation/acceptance/approval notification/outbox counts
  are all zero. Riley's later fresh document reconstructed Invitations `0`,
  Chats `0` and exactly one personal Trash card for the rejected event. The
  normal `EVENT_MEMBERS_CHANGED` affinity task is intentionally still pending
  until its `15:45:50Z` availability boundary; branch A remains open only for
  that worker exact-once oracle.
- Branch A terminal worker **PASS/CLOSED**: the one retained recompute completed
  at `2026-08-14T15:45:57.345Z`, attempt `1`, with empty `lastError`; the normal
  rule reports `pendingCount=0`. The post-worker oracle remained capacity `3`,
  accepted/pending `2/0`, Casey+Nova accepted and Riley suppressed, with every
  chat/message and invitation/acceptance/approval notification/outbox control
  still zero. Never repeat Riley Reject. Reset before branch B, where Casey
  independently cancels the still-pending invitation from a fresh baseline.
- Branch B — inviter cancellation is a separate fresh lineage with the same
  coherent `2 accepted + 1 reserved / 3` baseline. Casey opens the event's
  Members list and deletes Riley's pending invitation exactly once; Riley does
  not respond. Casey's Members header/card must change `2 members · 1 pending`
  to `2 members` in place, while Riley's `Invitations` card/counter disappears
  through its normal live route. Capacity stays `3`; Casey and Nova remain the
  only accepted members; Riley has no chat access. Persisted invitation
  resolution may update the existing invite signal but must create no join,
  chat, acceptance/approval notification, duplicate membership or overbooking.
- First branch-B execution is **FAIL / REPAIR REPLAY REQUIRED**. Casey confirmed
  Delete invitation once at `2026-08-14T15:51:50.195674866Z`; the still-open
  Members surface changed in place from `2 members · 1 pending` to `2 members`,
  Riley disappeared once, Riley Invitations changed `1 -> 0` through the normal
  live route and Nova remained unchanged. The persisted write retained
  capacity `3`, Casey+Nova accepted, Riley `deleted`, cleared every live
  pending/invited projection and left chat/message plus invitation/acceptance/
  approval notification/outbox artifacts at zero.
- The same persisted oracle exposed the write-side defect: the cancellation
  produced zero `EVENT_MEMBERS_CHANGED` tasks. The pending invitation had
  reserved the final seat, so cancelling it must run the normal released-seat
  path even though it must not create a ticket or chat. The old Java branch
  explicitly used `refreshEmbeddedEventMembers(..., false)` and skipped the
  waitlist. It was corrected to promote the oldest waitlist member first and,
  when no promotion exists, still refresh the dependent event/slot read model
  and enqueue the recompute. Regression coverage now asserts both no-waitlist
  projection and waitlist promotion; the existing dev watcher compiled the
  main change successfully at `15:57:51Z`. Because swap was effectively full,
  no second Gradle/test process was started. Replay only Casey's branch-B
  Delete invitation from a fresh fixture; branch A remains closed.
- Repair replay baseline **READY** at `2026-08-14T16:01:33.676Z`: reset
  completed first, stage and the required second read-only status both prove
  capacity `3`, accepted/pending `2/1`, Casey+Nova accepted, Riley's final-seat
  invite from Casey, Chats `0` and zero task/artifact controls. The same three
  managed documents were reloaded rather than relaunched; Casey shows My
  Events `1`/Chats `0`, Nova Events `1`/Chats `0`, and Riley Invitations
  `1`/Chats `0`. Replay only Casey Delete invitation once.
- First repair replay at `2026-08-14T16:06:13.505868724Z` proves the Java
  repair **PASS**: capacity stayed `3`, accepted/pending became `2/0`, only
  Riley became `deleted`, all live pending/invited lists cleared, and chats,
  messages plus invitation/acceptance/approval notification/outbox controls
  stayed zero. Exactly one `EVENT_MEMBERS_CHANGED` task was created; the normal
  worker completed it at `16:12:08.607775317Z`, attempt `1`, with empty
  `lastError` and `pendingCount=0`.
- The same replay remains **UI FAIL / FRONTEND REPLAY REQUIRED** because the
  user observed that the underlying event-card pending badge did not change
  from the membership action signal; a later poll repaired it. The common
  Activities membership-sync consumer was discarding every sync while the
  Event Editor state was open, even though the payload is an absolute,
  idempotent member summary. The gate was removed so stacked Editor/Members
  surfaces update the underlying card immediately. No Delete-specific branch
  and no Smart List/poll modification was added. The existing `frontend-sync`
  watcher rebuilt successfully in `7.612s` at `16:11:29Z`. Reset and replay
  only Casey Delete invitation once more to prove the badge before any poll.
- The `2026-08-14T16:13:41.562Z` frontend replay lineage is **NOT EXECUTED —
  reload boundary not yet proven**. The user requested a clean restart before
  performing Delete invitation, so no product transition from that lineage is
  evidence. It was reset rather than continued.
- Current final frontend replay baseline **READY** at
  `2026-08-14T16:18:50.026Z`: stage, the required second status and another
  later read-only status all prove capacity `3`, accepted/pending `2/1`,
  Riley's pending admin invitation from Casey, Chats `0` and zero tasks or
  chat/notification artifacts. The same three managed documents were hard
  reloaded with browser cache and service-worker bypass; their new document
  origins are Casey `16:19:57.407Z`, Nova `16:19:55.167Z` and Riley
  `16:19:53.108Z`. The reconstructed counters are Casey My Events `1`/Chats
  `0`, Nova Events `1`/Chats `0` and Riley Invitations `1`/Chats `0`. Replay
  only Casey Delete invitation once and observe the event-card pending badge
  from the same response before any periodic poll.
- Hard-reloaded frontend replay at `2026-08-14T16:54:18.515456561Z` is
  **UI FAIL / REPAIR REPLAY REQUIRED**. The write and Members surface were
  correct, but the user captured the underlying card still showing pending
  badge `1` about ten seconds after Delete. The independent terminal oracle is
  otherwise PASS: capacity `3`, accepted/pending `2/0`, only Riley `deleted`,
  all chat/notification controls zero, and exactly one
  `EVENT_MEMBERS_CHANGED` task completed at `16:59:28.940091047Z`, attempt
  `1`, with empty error.
- Live Angular inspection isolated the remaining frontend cause without
  projecting a query: the shared membership signal already contained
  `pendingMembers: 0`, but the Activities consumer rebuilt the card only from
  `EventsService.peekKnownItemById(...)`. That cache legitimately had no DTO
  for this server-backed Smart List row, while the Smart List's own source
  snapshot retained the complete event (`capacityTotal/capacityMax: 3`). The
  consumer therefore returned the old row unchanged and a later poll repaired
  it. The common resolver now uses the Smart List source before the optional
  EventsService cache, patches and re-caches the converted row immediately,
  preserves the known capacity, and has a direct InfoCard fallback when no DTO
  exists. No Delete-specific branch and no poll/query behavior changed. The
  existing frontend watcher built and synced the repair successfully at
  `17:06:56Z`; focused source-resolution/capacity regression tests were
  authored but not run in a second process because swap remains full.
- Source-fallback repair replay baseline **READY** at
  `2026-08-14T17:09:30.775Z`: reset completed, stage and the required second
  status both prove capacity `3`, accepted/pending `2/1`, Riley's pending
  admin invitation from Casey, Chats `0` and zero tasks/artifacts. The same
  three existing documents were hard reloaded with the repaired bundle; new
  time origins are Casey `17:10:01.546Z`, Nova `17:10:01.160Z` and Riley
  `17:10:01.022Z`. Reconstructed controls are Casey My Events `1`, Nova Events
  `1`, Riley Invitations `1`, all Chats `0`. Replay only Casey Delete once and
  capture the event-card pending badge from the action signal before poll.
- Final source-fallback replay immediate boundary **PASS** at
  `2026-08-14T17:17:47.400237969Z`. Casey's document was created at
  `17:17:39.954Z`, before the action, and was not reloaded afterward. The live
  membership signal timestamp matches the action and carries pending `0`; the
  Activities row and its re-cached Smart List source both hold pending `0`,
  capacity `3`, and the card DOM shows `2 / 3` with no red pending number.
  Riley's unchanged document reconstructed Invitations `0`; Nova's unchanged
  document retained Events `1`. The independent write oracle is capacity `3`,
  accepted/pending `2/0`, only Riley `deleted`, no chats/messages or invitation/
  acceptance/approval artifacts, and exactly one `EVENT_MEMBERS_CHANGED` task.
  The task remains normally pending until `17:22:47.432117404Z`; perform no
  further UI action and close Branch B only after its terminal exact-once read.
- Branch B terminal worker **PASS/CLOSED**: its single
  `EVENT_MEMBERS_CHANGED` task completed at
  `2026-08-14T17:23:40.030663919Z`, attempt `1`, with empty `lastError`; the
  worker reports `pendingCount=0`. Capacity `3`, accepted/pending `2/0`, exact
  Casey+Nova accepted identities, Riley deleted, and all chat/message plus
  invitation/acceptance/approval notification/outbox controls remained
  unchanged. Never repeat Casey Delete invitation. Reset before the independent
  capacity-block branch; keep repeated/no-op acceptance in another lineage.
- Branch C reserved-seat capacity baseline **READY**: Branch B was reset and
  `EVENT-INV-005` was independently staged at `2026-08-14T17:27:14.493Z`.
  Post-stage hard-reload origins are Casey `17:27:43.532Z`, Nova
  `17:27:41.743Z` and Riley `17:27:39.456Z`. A later read-only oracle remains
  capacity `3`, accepted/pending `2/1`, with exact Casey+Nova accepted and
  Riley's admin invitation reserving the final seat; chats, notifications,
  outbox and recompute tasks are all zero. Casey's authenticated read-only
  candidate query returned multiple selectable non-members and a repeated
  oracle proved that query created no write. The actual Invite members UI then
  showed Riley selected as the existing pending reservation and Farkas Anna as
  the visible selectable non-member. Casey must next attempt exactly one
  Farkas Anna invite. The decisive result is unchanged accepted/pending `2/1`,
  no Farkas Anna membership and zero new task, notification or outbox; do not
  combine the later repeat-acceptance branch.
- Branch C first write at `2026-08-14T19:48:43+02:00` is **SERVER/WRITE PASS,
  UX FAIL — REPAIR REPLAY REQUIRED**. The endpoint returned `200`, capacity
  stayed `3`, accepted/pending stayed `2/1` with exact Casey+Nova accepted and
  Riley reserving the final seat, Farkas Anna was not persisted, and task,
  chat, notification plus outbox controls all stayed zero. The picker closed
  without explaining that the invitation was rejected. The common invite
  result must expose the capacity rejection to both HTTP and frontend-local
  flows, and the existing confirmation dialog must support an actionless
  information presentation with matching versioned English/Hungarian local
  assets and Mongo seed messages. Reset and replay only this one Farkas Anna
  attempt after the repaired bundle is loaded; branches A/B remain closed.
- Branch C UX repair is **HOT-DEPLOYED / REPLAY REQUIRED**. The Java endpoint
  now returns the committed member list, exact invited identities and typed
  `capacity-full`/`already-member` rejections; notifications remain restricted
  to actual new invitations. The shared frontend path consumes that outcome,
  and frontend-local applies the same reserved-seat capacity partition before
  persisting. The existing confirmation dialog gained an actionless notice
  mode, so no parallel popup system or confirmation buttons were introduced.
  Local assets and all Mongo seed databases contain matching English/Hungarian
  capacity plus generic failure messages at bundle version `.55`. The existing
  backend watcher compiled/restarted successfully; the frontend watcher built
  at `20:05:23+02:00` and synced at `20:05:26`; the live API returned both
  `2026.08.14.en.55` and `2026.08.14.hu.55` with the expected keys. Focused Java
  and frontend regression tests are authored, but no duplicate build/test
  process was started because the dev watchers own compilation and swap is
  full. Reset/stage and replay only the Farkas Anna attempt next.
- Branch C repair replay baseline is **READY** at
  `2026-08-14T18:11:43.640Z`. Reset completed first and reported
  `not-staged`; one new stage plus repeated status reads all proved capacity
  `3`, accepted/pending `2/1`, exact Casey+Nova accepted identities, Riley's
  pending admin invitation reserving the final place and zero chat/task/
  notification/outbox artifacts. After the repaired frontend and Mongo bundle
  sync, the same documents were hard-reloaded with cache/service-worker bypass
  at Casey `18:13:10.693Z`, Nova `18:13:13.525Z` and Riley
  `18:13:16.460Z`. Their initial visible counters agree: Casey My Events `1`
  and Chats `0`, Nova Events `1` and Chats `0`, Riley Invitations `1` and
  Chats `0`. Casey must attempt exactly one Farkas Anna invite and leave the
  resulting notice open for DOM plus persisted-oracle verification.
- Branch C first repaired display is **CONTENT/WRITE PASS, CLOSE CONTROL FAIL**.
  The screenshot showed the correct `No available places` title and reserved-
  capacity explanation without confirmation actions; a post-action oracle
  retained capacity `3`, accepted/pending `2/1`, exact Casey+Nova accepted and
  Riley pending, with zero chats/messages/invite notifications/outbox/tasks.
  The notice incorrectly omitted the standard top-right popup close control.
  The shared dialog now reuses the existing `.popup-close` button/icon only in
  actionless notice mode; there is no custom footer button and ordinary
  confirmations are unchanged. The watcher built at `20:21:31+02:00`, synced
  at `20:21:33`, and Casey alone was hard-reloaded at
  `18:22:14.622Z` with My Events `1` and Chats `0`. Since the attempt wrote
  nothing, retain this lineage and replay only the notice display; do not reset
  or repeat other branches.
- Branch C standard-close replay remains **WRITE PASS / VISUAL PROOF PENDING**.
  The post-action oracle again retained capacity `3`, accepted/pending `2/1`,
  exact Casey+Nova accepted and Riley pending, with every chat/message/task/
  notification/outbox control at zero. At the CDP inspection boundary the
  dialog was already closed and Casey's document origin was
  `18:23:40.879Z`; therefore the new top-right close must not be inferred.
  Accept an explicit user report that the visible X was used, or repeat only
  this no-write notice display and leave it open. Do not reset/restage.
- Branch C terminal **PASS/CLOSED**. The user explicitly confirmed that the
  corrected notice displayed its standard top-right X and that clicking it
  closed the popup. Combined with the earlier screenshot proving the exact
  capacity title/message and absent footer actions, and the post-replay oracle
  proving unchanged capacity `3`, accepted/pending `2/1` and every artifact
  control `0`, this closes both UX and write sides. Never repeat Branch C.
- Branch D — repeated acceptance idempotence is a separate short lineage.
  Reset/stage the same coherent full baseline, then Riley accepts the pending
  admin invitation once through the real Invitations UI. First snapshot the
  terminal accepted membership and exact chat/system-message, recompute task,
  acceptance notification and outbox effects. Next, replay the identical
  authenticated `/activities/events/join` request exactly once from Riley's
  existing managed document. The repeated response must report `changed=false`;
  capacity stays `3`, Riley has exactly one accepted membership, and every
  first-write task/chat/system-message/notification/outbox count remains
  unchanged. This API replay is the server no-op boundary after the only manual
  accept; it does not open a fourth browser or duplicate the broader
  Open/Blind visibility assertions owned by `EVENT-INV-006`.
- Branch D baseline is **READY** at `2026-08-14T18:31:33.042Z`. Reset first
  reached `not-staged`; one stage and two consecutive status reads prove
  capacity `3`, exact Casey+Nova accepted plus Riley's pending admin invite on
  the final seat, and zero chats/messages/tasks/acceptance notifications/
  outbox/payments. The same documents were hard-reloaded at Casey
  `18:32:11.813Z`, Nova `18:32:15.329Z` and Riley `18:32:19.418Z`. Initial UI
  agrees: Casey My Events `1`/Chats `0`, Nova Events `1`/Chats `0`, Riley
  Invitations `1`/Chats `0`. Riley performs exactly one UI Accept next; do not
  issue the repeated server request until the complete first-write oracle is
  captured.
- Branch D first UI Accept is **FIRST-WRITE PASS** at
  `2026-08-14T18:35:47.091901466Z`. The user loaded the Invitations list,
  accepted once and observed `3 / 3`. Persisted membership is exactly
  Casey+Nova+Riley accepted with pending/invited empty; Riley UI has Events `1`
  and Chats `1`, while Casey and Nova's original documents each converged to
  Chats `1` without reload and retained My Events/Events `1`. The comparison
  fingerprint is three event-chat member projections, one `member-joined`
  system message, one pending recompute task
  `6a7f6003ae56910e99a48529` available at
  `18:40:47.213748207Z`, two acceptance notifications for Casey/Nova, one
  pending acceptance outbox and zero payments/checkout basket. Replay the
  identical authenticated join exactly once next; no further manual click.
- Branch D raw replay at `2026-08-14T18:38:34.950Z` is **NOT AN IDEMPOTENCE
  EXECUTION — ORCHESTRATION ERROR**. The direct browser `fetch` copied the body
  but omitted Angular's `X-App-Session-Kind: demo` and actor-specific
  `X-Demo-User-Id` headers. The non-Firebase dev fallback therefore
  authenticated configured default member `bf057de7c586eede7e84bdc7`, not
  Riley, and correctly added that different actor as a pending waitlist member.
  This contaminates only the post-first-write lineage; it does not invalidate
  the preceding manual UI/fingerprint PASS and is not a product idempotence
  FAIL. Do not ad hoc delete the row. Reset/stage fresh, then perform the server
  pair with Riley's exact demo headers: first request recreates the known
  fingerprint, second request must be `changed=false` with all counts unchanged.
  No repeated user action is required.
- Branch D clean server pair exposed **DATA IDEMPOTENCE PASS / RESPONSE CONTRACT
  FAIL**. After reset/stage at `18:42:18.724Z`, a read-only `/auth/me` request
  with the exact demo headers resolved Riley `650000000000000000000063`.
  The first join at `18:43:38.889Z` returned accepted/`changed=true` and
  recreated the manual fingerprint. The identical second at
  `18:44:10.885Z` changed no persisted field: Riley's membership timestamps,
  accepted/pending `3/0`, chat projections `3`, system messages `1`, task `1`
  with id `6a7f61daae56910e99a48530` and the same
  `18:48:38.821670247Z` availability, acceptance notifications/outbox `2/1`
  and payments/basket `0/0` all remained exact. Its response nevertheless
  returned `changed=true` with `counterDelta=null`. Java's common participation
  mapper had hard-coded `true`; it now derives the flag from
  `OwnerMembersSnapshot.mutationApplied`. Positive and accepted-no-op
  regressions are authored. The existing watcher built successfully and the
  app restarted at `20:45:47.587+02:00`; replay only this no-op response without
  reset, then retain the original task for its terminal exact-once oracle.
- Branch D post-fix no-op response replay is **RESPONSE/DATA PASS** at
  `2026-08-14T18:47:37.568Z`: HTTP `200`, membership `accepted`,
  `changed=false` and `counterDelta=null`. The following oracle retained the
  same accepted `3`/pending `0`, Riley membership/action timestamp
  `18:43:38.772815972Z`, chat projections `3`, system messages `1`, task `1`
  with id `6a7f61daae56910e99a48530` and unchanged
  `18:48:38.821670247Z` availability, acceptance notifications/outbox `2/1`
  and payments/basket `0/0`. Never send another join. Close Branch D only after
  that original task completes exactly once with empty error and every domain
  fingerprint remains unchanged.
- Branch D terminal worker **PASS/CLOSED**. Task
  `6a7f61daae56910e99a48530` completed at
  `2026-08-14T18:49:15.677199764Z`, attempt `1`, with empty `lastError`; the
  affinity rule reports `pendingCount=0`. Final membership timestamps and
  accepted/pending `3/0`, chat projections/system messages `3/1`, acceptance
  notifications/outbox `2/1`, payments/basket `0/0` all remained exact.
  Together with branches A-C, `EVENT-INV-005` is **PASS/CLOSED**. Never repeat
  any producer or replay from this checkpoint.

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

- Execution 2026-08-14 — PASS / CLOSED:
  - `EVENT-INV-005` was reset and proved not staged before this independent
    checkpoint was staged once at `2026-08-14T18:51:06Z`.
  - Two consecutive read-only oracles agreed. Open event
    `manual-qa-checkpoint:v1:event-domain:event` and Blind event
    `manual-qa-checkpoint:v1:event-domain:feedback-locked` each have capacity
    `8`, Casey accepted, and Nova plus Riley pending through admin invitations:
    `accepted=1`, `pending=2`.
  - Baseline artifact counts are chat `0`, system-message `0`, acceptance
    notification `0`, acceptance outbox `0` and recompute task `0`. Riley's
    current menu exposes exactly the two staged invitations.
  - A subsequently reported `3/3` was identified as an observation from the
    already-closed `EVENT-INV-005`; the persisted `EVENT-INV-006` baseline did
    not change. The next transition is Riley accepting only the Open event.
    Capture its complete recipient and chat oracle before touching Blind.
  - Open transition executed once at `2026-08-14T19:04:11.943737458Z`:
    Riley became accepted while Nova remained pending (`accepted=2`,
    `pending=1`, capacity `8`); Blind remained unchanged at `1/2/8`.
    The Open event has exactly one `member-joined` system message and zero
    chat-message notification/outbox rows. One acceptance outbox targets only
    Casey and Nova, and the two materialized notification rows name Riley and
    `QA EVENT-INV-006 OPEN`; Riley has no acceptance notification.
  - The three live clients converged without reload: Casey's bell is `4` after
    one new row, Nova's bell is exactly `1`, and Riley's bell remains `0`.
    Riley simultaneously shows Open `2/8`, Invitations `1` and Active Events
    `1`. The user then opened both Notification Centers and visually confirmed
    the same Riley accepted `QA EVENT-INV-006 OPEN` row for Casey and Nova.
    Together with Riley's zero bell and zero persisted recipient row, the Open
    visibility branch is PASS.
  - The transition created the one expected `EVENT_MEMBERS_CHANGED` follow-up
    task `6a7f66abae56910e99a48536`, initially pending for
    `2026-08-14T19:09:12.048281308Z`; verify its terminal state without
    replaying the already-proven Open mutation.
  - Open follow-up task `6a7f66abae56910e99a48536` completed exactly once at
    `2026-08-14T19:09:24.118478178Z`, `attemptCount=1`, with empty error and an
    unchanged Open fingerprint.
  - Blind transition was executed at `2026-08-14T19:09:18.685469928Z` from
    Nova's browser rather than Riley's. Nova therefore became the actor and
    Riley remained the ordinary hidden pending control. Both identities had
    the same staged Member role and public profile status, so this is a valid
    role-equivalent substitution for the visibility rule; do not replay the
    producer merely to restore the originally named person.
  - Blind now has Casey/Nova accepted and Riley pending (`accepted=2`,
    `pending=1`, capacity `8`). Exactly one acceptance outbox and notification
    target Casey. Casey's rendered Notification Center shows “Nova Social
    accepted the invitation to QA EVENT-INV-006 BLIND”; Nova's existing Open
    unread count did not increase and Riley remains at zero. Blind contains
    exactly one `Nova Social joined the event.` system row and zero
    chat-message notification/outbox artifacts. The immediate Blind privacy
    boundary is PASS.
  - Blind's one normal follow-up task is
    `6a7f67deae56910e99a4853a`, available at
    `2026-08-14T19:14:18.753678136Z`. Close the checkpoint only after it is
    terminal once with empty error and the final fingerprint remains stable.
  - Final terminal proof: Blind task `6a7f67deae56910e99a4853a` completed once
    at `2026-08-14T19:14:26.173185876Z`, `attemptCount=1`, with empty error.
    The final fingerprint remained Open and Blind `accepted=2/pending=1`, three
    visibility-authorized acceptance notifications total, two event-scoped
    `member-joined` messages, zero chat-message notifications, and zero
    payment/basket artifacts. Both branches are PASS and the checkpoint is
    CLOSED; do not replay either acceptance.
  - QA efficiency repair after closure: the dev profile now binds
    `affinity.recompute.event-members-changed-debounce` to
    `${AFFINITY_RECOMPUTE_EVENT_MEMBERS_CHANGED_DEBOUNCE:15s}`. This retains an
    observable real worker path while removing the five-minute manual wait.
    Production continues to use the five-minute property default.

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

## Chat functional coverage

Chat is executed as six user journeys, not as one-row microtests. Each journey
is presented to the user in one block: purpose, complete click sequence, every
visible counter/state assertion, and one independent persisted final oracle.
The former list/history/send/counter/read/reconnect/typing and individual
message-action rows below are retained only as mapped assertions inside these
owners; they are not independently scheduled checkpoints.

- `CHAT-AUTH-001` — access and privacy boundary (PASS/CLOSED).
- `CHAT-FLOW-001` — everyday conversation, history, unread/read and recovery.
- `CHAT-ACTIONS-001` — reply, reaction, pin, edit and unsend lifecycle.
- `CHAT-CONTENT-001` — image, voice, poll and shared-card conversation.
- `CHAT-GOVERNANCE-001` — canonical members and moderation intake.
- `CHAT-PUSH-001` — background device delivery and deep-link reconciliation.

### `CHAT-FLOW-001` — everyday conversation and recovery

Purpose: prove in one three-actor conversation that discovery, history,
realtime delivery, unread/read ownership and transport recovery form one
consistent lifecycle.

- Start with Casey, Nova and Riley accepted in one controlled Event/Group chat,
  plus known Event, Group, Service and App Support list rows. The group thread
  contains 18 deterministic historical messages spanning two day markers.
- Before opening a thread, inspect All and every context once. Exact rows,
  counters and descending order must survive popup close/reopen, and list reads
  must write nothing. Then open the Group thread, load the older page once and
  prove all 18 IDs appear exactly once in chronological thread order.
- Keep Nova's thread open, keep Riley's Chat closed, and let Casey type then
  send one unique message. Nova sees transient typing and one live message with
  no unread or notification increment; Riley receives exactly one
  Chats/All/Group/row increment and one notification. If Riley's Chat list is
  already open while the Group thread is closed, its existing list poll must,
  without closing or reopening the popup, replace that Group row with the same
  current state a fresh list query returns: unread `1`, Casey as last sender,
  the exact message summary and timestamp, and the resulting date/relevance
  order. Polling or opening only Riley's list does not clear the unread state.
- Open Riley's thread: the same message is acknowledged exactly once, all four
  Riley counters return to zero and Casey sees one Riley reader identity.
- Close Riley's thread and hard-reload the isolated browsers, leave Riley's
  Chat list open with its Group thread closed, then send the second Casey
  message. The recreated transport and existing list poll expose that persisted
  ID once without a popup reopen; opening the Group thread clears the unread
  once. Counters and history contain neither a gap nor a duplicate. Close/reopen
  all three views and repeat the exact row/history/counter comparison.
- Final oracle owns the former `CHAT-LIST-001`, `CHAT-HISTORY-001`,
  `CHAT-SEND-001`, `CHAT-COUNTER-001`, `CHAT-READ-001`,
  `CHAT-RECONNECT-001` and `CHAT-TYPING-001` assertions together: exact
  message IDs/client IDs, per-user unread/read state, reader identities,
  context totals, history cursors, active-reader notification suppression and
  zero undocumented notifications.
- Retained partial evidence from 2026-08-30: the isolated list phase already
  proved All=4, Event=1, Sub-event=0, Group=1, Service=1 and App Support=1,
  exact ascending/descending IDs, stable ownerStatus/revision and a
  byte-identical no-write close/reopen. It is not a standalone test PASS.
- **PASS/CLOSED on 2026-08-30:** the consolidated terminal oracle found the 18
  deterministic history rows plus exactly two Casey messages, with Nova and
  Riley recorded once as readers of both. All three Group owner copies retained
  the second message summary and zero unread; their write-side revisions were
  Casey `2`, Nova `3`, Riley `3`. Chat counters were zero for every actor.
  Notification persistence contained exactly two Riley-only outboxes and two
  Riley inbox rows, Casey/Nova notification deltas were zero and Riley was
  exactly `+2`. The user also confirmed the already-open Riley list converged
  without reopen. During this journey the owning defects were corrected for
  live read publication, active-viewer notification suppression and complete
  poll-driven row-state reconciliation through the Signal Store.
- **Counter-source regression replay on 2026-08-30:** after separating the
  active Activities tab's list-owned aggregate from the two inactive tabs'
  side-menu snapshot, the user accepted the three-window UI behavior and the
  repeated terminal oracle again passed all eight sections: exactly 20 messages,
  the two new Casey messages once each, exact final row summaries, all Chat
  counters cleared, exact Riley-only outbox/inbox and notification counters,
  and unchanged fixture membership. The fixture was reset after capture. The
  persisted oracle does not independently reconstruct the transient unchanged
  Rates/Events badges; that assertion remains the user's live UI observation.

### `CHAT-ACTIONS-001` — one message's complete action lifecycle

Purpose: prove every ordinary message mutation against the same identities and
surrounding history instead of replaying five independent fixtures.

- In one existing three-user thread, Casey replies to an older message; the
  immutable source preview and source jump work even when the older page must
  load. Nova and Riley each react, Nova changes reaction and Riley removes it.
- Casey pins the reply, opens Pinned and navigates back to the source. Casey
  edits the same message once; Nova's non-owner edit is server-denied without a
  new message, unread or notification.
- Casey unpins and unsends the message; Nova's non-owner unsend is denied. The
  same message ID becomes one tombstone and clears text, attachment, reply,
  reactions, readers and pin while surrounding history remains intact.
- Reopen all clients and compare the single persisted message history plus
  mutation audit. This journey owns the former `CHAT-REPLY-001`,
  `CHAT-EDIT-001`, `CHAT-DELETE-001`, `CHAT-REACTION-001` and
  `CHAT-PIN-001` assertions.
- **PASS/CLOSED on 2026-08-30:** the user completed the consolidated
  three-window journey. The terminal oracle retained exactly the original 18
  surrounding messages plus one Casey message whose same ID became a single
  tombstone; text, reply, edit marker, pin, reactions, attachments and search
  fields were cleared, and memberships were unchanged. Nova's authenticated
  non-owner Edit and Unsend both returned HTTP `403`. The observed one-reader
  reopen exposed a real lost-update window: the older/live receipt path saved
  stale whole message documents, and deleted tombstones could acquire readers
  again. The write path now uses guarded atomic Mongo `$addToSet` updates and
  excludes deleted messages. A simultaneous Nova/Riley websocket replay
  persisted both reader IDs, reopen retained both, and the tombstone reader
  list remained empty. A final three-window UI replay also exposed that the
  live read receipt omitted the reader image URL and therefore rendered
  initials until reopen. The receipt contract now carries the canonical
  profile image through backend HTTP/websocket and frontend HTTP/local paths;
  the user confirmed both real profile images immediately and after reopen,
  while a read-only Mongo check retained both reader IDs and zero unread/chat
  counters for every actor. This domain has no separate mutation-audit collection;
  transient reply/reaction/pin/edit transitions are the accepted three-client
  UI evidence, while the final document and denial requests are persisted/API
  evidence.

### `CHAT-CONTENT-001` — rich-content conversation

Purpose: prove that all supported content travels through the same canonical
chat/message lifecycle and remains usable by another participant.

- In one accepted Group thread, Casey sends one controlled image, one
  few-second voice clip, one two-option poll, one Event card and one Asset/link
  card. Nova observes every message live exactly once.
- Nova opens the image preview, plays the voice clip, votes once, changes that
  vote, and opens both available cards. The Event attachment must route to the
  canonical **View Event -> Sub Events** surface rather than a chat-specific
  form; this Chat checkpoint proves navigation and target identity, while
  `EVENT-RUNTIME-001` owns the runtime-card content and persistence oracle.
  Riley casts the second poll vote. Totals move 0 -> 1 -> 2 and stay 2 after
  Nova changes option. Every visible voter pill must use the voter's canonical
  profile image; initials are allowed only when that user truly has no image.
  The poll attachment write must persist the canonical voter name, initials,
  gender and image URL so reopen/local persistence cannot regress to initials.
- In Asset Explore, select the highlighted whole-type option (`All Transport`),
  require the controlled Sedan fixture to appear, select `Sedan` and require
  the same fixture to remain as the category-filtered result, then select the
  `SUV` subtype and require it to disappear. Return to `All Transport` and
  share the same card. The same whole-type selector contract applies to
  Accommodation and Supplies.
- Open the controlled Asset card on both the mobile and desktop layouts. It
  must open the canonical read-only Asset Editor used by Asset Explore, not
  the legacy nested resource-asset form or a chat-specific popup. The editor
  must fully cover the popup beneath it so only its own close action is
  visible. Its hydrated fields must show subtitle
  `Controlled rich-content Chat asset`, category `Sedan`, total capacity `4`
  and quantity `1`. Because the fixture has no image, the editor's shared image
  carousel must show its normal empty state without requesting or rendering a
  broken image URL. No entry-point-specific inset panel, carousel override or
  popup geometry is allowed.
- Open the poll vote dialog on both layouts and require every answer row to
  remain geometrically stable under hover, press and selection; poll answer
  buttons opt out of shared scale motion so the click target never moves.
- One denied/removed card target becomes unavailable without leaking detail.
  One recorder-permission denial/cancel branch creates no message or orphan
  media. Reopen the thread and require canonical attachment/target IDs, working
  media URLs and no duplicate upload/render.
- This journey owns the former `CHAT-IMAGE-001`, `CHAT-VOICE-001`,
  `CHAT-POLL-001` and `CHAT-CARD-001` assertions.

Result on 2026-08-30: **PASS / CLOSED**. Casey, Nova and Riley completed the
single consolidated journey. The terminal Mongo oracle retained exactly five
canonical content messages (image, voice, poll, Event and Asset), both Nova
and Riley as readers, two exact South votes and canonical voter
name/initials/gender/image presentation. The authenticated three-browser
oracle returned identical content for every actor, HTTP 200 image/preview,
voice and both voter-avatar media, exact All Transport/Sedan/SUV filtering,
the unavailable-target control and zero terminal Chat/Group unread counters.
Available Event and Asset cards opened their canonical read-only surfaces on
the tested layouts; denied/cancelled media created no extra message, orphan or
counter. Changing an existing poll vote is a message mutation, like a
reaction, and intentionally does not create a new unread Chat item.

### `CHAT-GOVERNANCE-001` — members and moderation intake

Purpose: prove that the visible room population, access control and a reported
message share the same canonical membership boundary.

- Open Members for controlled Event and Group chats. Accepted IDs, roles and
  avatars match the owning event/group membership; pending, left and
  other-group users are absent and direct access is server-denied.
- Report one accepted participant message and repeat the same submission once.
  The reporter sees one acknowledgement; Admin sees exactly one review item
  with reporter/chat/message/event/group context and no unrelated history.
- Member inspection remains read-only. The report is idempotent and produces
  only its documented review/notification writes. Admin resolution stays in
  the Administration domain.
- This journey owns the former `CHAT-MEMBERS-001` and
  `CHAT-REPORT-001` assertions while `CHAT-AUTH-001` retains its already
  closed base authorization evidence.

Execution evidence (2026-08-30, PASS/CLOSED):

- The replayable three-actor fixture exposed the canonical Event and Group A
  chats to Casey, Nova and Riley. All three authenticated terminal reads
  returned the exact four-person Event membership and three-person Group A
  membership with persisted profile images; Lina remained pending-only,
  Sophia remained left/denied, and Olivia was accepted only in the Event and
  Group B controls. Every direct negative-control read returned `404`.
- Nova submitted the same Riley message report twice. The write-side
  deterministic identity retained exactly one unresolved report with the
  exact Nova reporter, Riley target, Harassment reason, details, Event,
  Group A chat and source-message identity. The three-message controlled
  history remained unchanged and the fixture oracle found no unrelated write.
- Casey opened the resulting Admin review and the user confirmed its reporter,
  reason, source context, shared-source navigation and member presentation.
  The shared `app-image-card` now owns compact portrait sizing and contain-fit
  rendering; the same configuration fixes portrait rendering in the Event
  Members list without a page-specific style override.
- The independent Mongo status returned `terminal-pass` for all eight
  persisted invariants. The authenticated browser oracle passed all twelve
  membership, access, avatar, report-context and history assertions for all
  three actors. Backend and frontend hot-deploy owners compiled successfully;
  the frontend-local membership/report adapters carry the same contract but
  were not separately executed in this run.

### `CHAT-PUSH-001` — background device delivery

Purpose: prove one real background delivery boundary, not general messaging
again.

- Background/close one accepted physical-device recipient, send one
  participant message and tap the resulting push.
- Exactly one target-only push opens the exact chat/message and reconciles the
  in-app unread/read state. Sender self-notification, a foreground recipient
  and one system message are explicit no-push controls.
- Compare device UI, push tag/deep link, persisted message, notification
  inbox/outbox and terminal counters. Physical-device evidence remains
  mandatory.
- Physical-device registration preflight, 2026-08-30: **permission flow PASS /
  delivery NOT RUN**. A clean local WebAPK launch as Riley displayed the native
  Android notification permission prompt without sending the user to Settings;
  the user selected **Allow**, and Android retained `POST_NOTIFICATIONS` as
  granted. No Chat fixture or message was produced. The independent post-Allow
  oracle still found zero Riley devices/tokens. The public Firebase client
  configuration endpoint returned `404` with the deployment-not-activated
  reason, and the persisted deployment configuration had no active/tested
  Firebase revision or populated public client fields. Do not manufacture a
  frontend token fallback: activate a verified deployment Firebase revision,
  then repeat the read-only device preflight before staging the message.
- Execution decision, 2026-08-30: this remains the Chat-specific producer and
  control block inside `MOBILE-PUSH-LIFECYCLE-001`. Run it in the QA
  environment with an Operator-tested active Firebase revision and the
  physical phone; neither prerequisite turns it into Deployment QA.

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

## Member side-menu payment checkpoint

### `PAYMENT-METHODS-HISTORY-001` — Payment history, saved cards and provider recovery

Status: **PASS / CLOSED** (2026-09-06).

Stable user guide:
[`PAYMENT-METHODS-HISTORY-001.md`](../checklists/event/PAYMENT-METHODS-HISTORY-001.md).

- The user completed the 39-step Ava/Alex journey. The Stripe and Barion
  registration savepoints, Barion replacement, Stripe reconnect, expired-card
  cleanup and terminal history/idempotence oracles passed. Payment documents
  and Alex's stored payment totals remained unchanged.
- The independent Stripe 3DS cancellation branch returned without saving a
  card or creating a payment. Its original run exposed only incorrect generic
  failure copy. The provider terminal state is now the existing `cancelled`
  state, with a dedicated user-cancelled message; generic technical failures
  retain `payment.registration.error.failed`. The focused simulator regression
  and the running frontend watcher build passed. The user accepted this
  bounded correction without another manual replay.
- Final cleanup removed only the standalone branch's exact terminal
  registration artifact. Exact reset restored three saved cards, nine prior
  registration audit records and five prior payment records, then returned the
  simulator to connected Cash only with 3DS Off and `phase=not-staged`.

## Event checkout checkpoint

### `EVENT-CHECKOUT-001` — Event Explore Stripe payment reaches accepted participation

Status: **IN PROGRESS — VERIFIED THROUGH STEP 74** (2026-09-06).

Stable user guide:
[`EVENT-CHECKOUT-001.md`](../checklists/event/EVENT-CHECKOUT-001.md).

This is the direct paid-entry contract. It does not reuse
`EVENT-TICKET-005`, whose staged Event deliberately requires Admin approval
before payment and therefore never proves a manual click on the Payment
action.

- Stage one published Public paid Event with Ticketing Off, no approval gate,
  two selectable Slots with one participant place each in addition to Casey,
  one paid optional item and one required policy. Nova and Riley start outside
  membership with no target basket, payment, Activity Events row, chat or
  counter contribution. Casey is the sole accepted Admin.
- Stage three read-only controls for the same Nova actor: one free Event, one
  paid approval-required Event and one full paid Event that enters the
  waitlist. The adjacent paid Event is an immutable negative control; Riley
  remains unchanged through the cancellation branch, then owns only the
  declared Morning payment.
- The state-dependent action contract is:

  | State | Required visible actions/status | Forbidden action |
  | --- | --- | --- |
  | Fresh paid direct Event | Event Explore `Book Event`; checkout review `Join` | `Continue booking`, `Payment summary` |
  | Paid basket confirmed, before payment | Event Explore `Continue booking`; payment step `Back`, `Cancel payment`, `Payment`; provider panel `Stripe` | a second active basket/session |
  | Paid Event awaiting Admin approval | `Waiting for approval`, `Cancel request`; orange `Continue booking` from Explore | `Payment` before approval |
  | Full direct paid Event | `Join Waiting List`, then `Waiting List`/`Leave waitlist` | `Payment` while no place exists |
  | Full multi-Slot paid Event, outside viewer | Event remains in Explore with `Add to Watchlist` | `Book Event`, `Continue booking`, `Join Waiting List`, new basket/payment |
  | Accepted Event member | normal Event-level notifications; no Watchlist action | `Add to Watchlist`, `Remove from Watchlist` |
  | Free Event | `Join Event`/`Join` | payment step or payment record |
  | Successful direct Stripe payment | Activity Events `Active`/`All`: `View Event`, `Payment summary`, `Leave Event` | `Book Event`, `Continue booking`, another `Payment` |

- On the fresh paid Event, Slot selection and every required policy gate the
  first review action. A paid optional item changes the displayed total once.
  `Join` confirms the basket, persists a pending membership and opens the
  Stripe payment phase; it is not yet accepted membership or payment success.
- Close the payment phase once without paying. The basket icon and Event
  Explore card must expose `Continue booking`. Reopen in place and once after
  a clean reload; both reconstructions must use the same active basket/session
  identity and amount without duplicating membership, payment or counters.
- Exercise `Cancel payment` from that pre-payment boundary. The current basket
  becomes one closed audit, the pending membership is suppressed, its Pending
  counter contribution is removed, the card returns to `Book Event`, and no
  current participation, chat, ticket or approved payment exists.
- Start one fresh Nova attempt for Evening, return to the payment phase and
  click `Payment` exactly once. While the request is active the action changes
  to `Paying...` and is disabled; the rest of the application remains
  responsive. After it succeeds, `Continue booking` is correct while Morning
  remains open. Reuse Casey's browser for Riley, pay Morning once, then require
  both Slots to be full and the fresh-booking/Continue action to disappear for
  both participants. Accepted members do not receive a redundant Watchlist
  action because they already receive the Event-level member notifications.
- The assign surface keeps expired and provider-mismatched cards visible but
  unselectable, ordered after selectable cards as `selectable -> Reconnect ->
  Expired`. Both retain their artwork beneath the same white overlay. The
  provider-mismatched card exposes `Retokenize >` with Retokenize/Delete while
  keeping the checkout open. Provider authority is checked before a new
  payment starts; an already identified in-flight payment/3DS session stays
  pinned to its original provider, while any later new or periodic use of that
  provider token fails with the short retokenization message.
- Immediate write oracle: exactly two `provider=stripe`, terminal authorized
  payments with immutable price/currency and `bookingStatus=joined`: Nova owns
  Evening and Riley owns Morning. Require two succeeded inactive baskets,
  accepted Nova and Riley memberships, root occupancy `1 -> 3`, both Slots at
  `2 / 2`, and the normal accepted-member chat/counter effects exactly once.
  Ticketing Off keeps physical tickets and both ticket counters at zero. The
  Stripe simulator authorizations belong to this branch; capture/settlement
  and Registry work are outside this checkpoint.
- Immediate UI oracle: the paid target is present exactly once under both
  participants' Activity Events `Active` and `All` buckets and remains exactly
  once in Event Explore as a full multi-Slot Event. Each Active/All menu
  exposes `View Event`, read-only `Payment summary` and `Leave Event`; Nova's
  summary returns Evening and Riley's returns Morning with their own payment
  method and authorized/joined result. Explore exposes the Event-level
  outside viewer's Watchlist action, never another booking/payment action.
  The accepted participants do not expose a Watchlist action. Merely opening
  either summary cannot write.
- One clean reload must reconstruct the same accepted membership, bucket
  counters, menu actions and Payment summary from persisted state. The target
  remains visible in Event Explore without becoming a fresh payment candidate.
  Reopening the
  summaries and replaying the captured request identities through the machine
  oracle must retain exactly two payments, baskets and participant joins with
  one shared three-member chat projection.
- Inspect the free, approval-required and waitlist controls without converting
  them to successful payments. The Waitlist control is pending membership with
  no basket, so `Continue booking` is forbidden. The plain non-slot Cash-only
  checkout has no Basket/Slot panel and is explicitly cancelled; Free,
  Approval, Waitlist and the adjacent paid control retain their declared
  contracts.
- A versioned fixture must provide guarded `stage`, read-only `status`, named
  `payment-ready`, `cancelled` and `paid` captures, plus exact `reset`. Do not
  execute this row until that harness and the isolated Casey/Nova/Ava browser
  sessions exist; Riley reuses Casey's session slot only at the declared step.
- The versioned fixture retains exact rollback points for the cancelled block-4
  boundary, the persisted step-66 destination boundary and the exact step-74
  pre-Watchlist boundary. The target and
  controls, Nova's Stripe/Barion/expired cards, Riley's separate Stripe card,
  the exact-reset snapshot and three isolated Casey/Nova/Ava windows remain
  owned by this checkpoint.
- Payment-ready savepoint (2026-09-06 06:12 CEST): after the user-controlled
  steps through 21, the versioned `capture-payment-ready` oracle passed with
  one active `4900 HUF` basket containing two items, exactly zero payments and
  Nova's target membership persisted as `pending`.
- Cancelled savepoint (2026-09-06 06:17 CEST): the preserved payment-ready
  snapshot proved Event counters `all=3`, `pending=3`, the two-item basket,
  pending membership and zero payment at step 21. The current step-32 oracle
  then passed with those two basket items closed, the former pending membership
  suppressed, zero payments and zero tickets. The next boundary is the fresh
  successful Stripe attempt beginning at step 33.
- Block-4 extension (2026-09-06): each active Slot is now `1 / 2`; Nova pays
  Evening and Riley pays Morning. The write oracle expects two payments, both
  Slots full and no stale fresh-booking/Continue action for either user.
- Destination/control evidence (2026-09-06 09:42 CEST): steps through 74 are
  verified at `phase=destination-verified`. The persisted target has Casey,
  Nova and Riley at `3 / 6`; Morning is Casey/Riley `2 / 2`, Evening is
  Casey/Nova `2 / 2`; exactly two `stripe/authorized/joined` payments and two
  succeeded inactive baskets remain, with zero active target baskets. Repeated
  exploratory leave/rejoin attempts contributed only deleted inactive basket
  audit rows and matching main-Event join/leave messages, not duplicate payment
  writes.
- The background audit found that an active participant-owned Slot overlay
  could duplicate its canonical Slot in the parent `upcomingSlots` write. The
  source-side refresh now selects one canonical document per Slot `sourceId`;
  the retained fixture is normalized to exactly Morning plus Evening once, and
  the harness rejects any future duplicate occurrence at the paid oracle.
- The Waitlist control is now one pending `requestKind=waitlist` membership
  with zero baskets. The Cash-only control has zero Nova membership, basket and
  payment after explicit cancellation. Free and Adjacent remain untouched;
  Approval retains exactly one pending approval basket. The current step-66
  rollback snapshot and step-74 control oracle both passed after these repairs.
- The three bounded post-step-74 UI regressions passed: the Waitlist control
  has no `Continue booking`, the plain Cash-only checkout has no Basket/Slot
  panel, and the paid Payment summary retains its selected Slot item. Block 7
  first proves the Watchlist action absent for accepted Riley and Nova. Nova
  then leaves the paid target and becomes the outside Watchlist subscriber;
  the exact full pre-Nova-leave state was captured as the `block7-ready`
  rollback boundary. Riley's later leave opens one additional Slot place. This
  distinguishes Nova's one
  Watchlist availability notification from the normal Event-level member
  notification and proves that accepted members have no Watchlist action.
- Final Watchlist/leave evidence (2026-09-06 10:41 CEST): the complete
  block-7 oracle passed after the user-controlled steps through 81. Casey is
  the sole accepted root and Slot member, each Slot has one available place,
  the two authorized joined Stripe payments are unchanged, and neither Nova
  nor Riley has an active basket. Nova has no retained Watchlist subscription
  or counter contribution; the availability notification, Riley member
  notification and their outbox intents are each exactly once, while the Event
  chat contains exactly the Nova and Riley voluntary-leave messages. A later
  extra Add-to-watchlist click was classified from the HTTP write audit and
  removed by the bounded fixture cleanup before the final oracle. Voluntary
  self-leave notifications now use `left`; organizer removal continues to use
  `removed`.
- Accepted post-close Watchlist refinement (2026-09-06): availability copy is
  now neutral (`A new spot is available`) because following an Event does not
  imply that it was full at subscription time. An outside watcher also gets a
  generic update when a followed Event becomes public again or its public
  title/location, schedule or program changes, but only while the
  same Explore visibility policy still permits that user to view it.
  Accepted/pending/invited participants are excluded from this watcher intent,
  and draft, invitation-only or otherwise inaccessible Events disappear from
  Watchlist without disclosing their internal changes. The Watchlist write and
  new-spot scheduler recheck that same visibility boundary, so a retained
  subscription cannot expose a newly private Event. Backend and frontend local
  implementations carry the same boundary; regression specifications cover
  outsider/member recipient separation, hidden Watchlist records and hidden
  Event write/notification rejection.

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

Configuration note (2026-09-18): the concurrent-session cap now defaults to
disabled (`AUTH_MAX_ACTIVE_SESSIONS=-1`) in every profile. The two-session
admission assertions below apply only when the checkpoint explicitly enables
`AUTH_MAX_ACTIVE_SESSIONS=2`. With the default, A, B and C must all be accepted;
session registration, revocation, audit and new-login warnings still apply.
Earlier evidence below records the policy that was enabled at the time.

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
- Manual result — **PASS / CLOSED** (2026-08-14):
  - Guarded baseline at `2026-08-14T19:43:56.436Z` proved zero active sessions,
    audits, security notifications and outbox rows for Nova Social.
  - Client A created one `ACCEPTED` audit/session and no warning. Its reload was
    captured at `2026-08-14T19:50:16.665Z` with the same one slot/audit and no
    new warning.
  - Client B created the second `ACCEPTED` session/audit and the first
    normalized `Chrome on Linux desktop` warning. A and B remained usable.
  - Client C was denied while A/B were active. The first correct
    `BLOCKED_LIMIT` server decision exposed two frontend defects: the tracked
    demo session was published before Java accepted it, racing the demo i18n
    bundle, and the selector replaced the specific session-limit message with
    a generic error. The frontend now publishes/persists only after
    `ACCEPTED` and carries the translated failure key into the selector.
  - The repair replay preserved the first immutable audit rather than deleting
    it. C remained on Entry and rendered “Two sessions are already active.
    Sign out from one of them, then try again.” with no raw key. The run's exact
    audit order therefore became `ACCEPTED`, `ACCEPTED`, `BLOCKED_LIMIT`,
    `BLOCKED_LIMIT`, `ACCEPTED`.
  - Explicit A logout removed only A's server slot. C then entered as the
    second active session beside B. Final state contained exactly two active
    opaque sessions, five immutable explicit-attempt audits and four matching
    security notification/outbox rows.
  - B and C both converged in-place to unread counter 4. C loaded
    `demo.en` bundle `2026.08.14.en.56` with `got.it` rendered as **Got it**.
    The final Notification Center screenshot at
    `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-14 22-21-30.png`
    shows two New login and two Blocked login attempt rows, all normalized and
    with no raw user-agent, IP, token or session identifier. Opening the list
    did not mark the rows read; the immutable audits remained independent.

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
- Eligible Budapest branch: override the browser to Budapest (`47.4979,
  19.0402`), allow location, and reload the landing page. Require
  `eligible=true`, `partitionKey=country:hu`, the security gate enabled and the
  normal login action available.
- Eligible London branch: in a separate fresh anonymous context override the
  browser to London (`51.5074, -0.1278`) and allow location. The versioned OSM
  United Kingdom partition must resolve `eligible=true`,
  `partitionKey=country:gb`, with the same normal login path. The fixture must
  prove both HU and GB exist rather than assuming the database contains only
  one country. Completing a real Firebase login must retain the resolved
  partition through the ordinary authentication/profile path; do not mark
  that substep PASS while the deployment Firebase configuration is inactive.
- Not-yet-enabled branch: use Paris (`48.8566, 2.3522`) in a third fresh
  anonymous context. At stage time the fixture must prove `country:fr` is
  absent; if it is later imported, choose and document another absent-country
  control rather than forcing a false result. Absence means not yet available,
  not banned. Require `eligible=false`, no partition key, the configured
  country-not-available message and an unavailable login path. No user session
  may be created.
- Permission-denied branch: after the Paris result, reset only that target's
  landing state and location permission, choose **Block**, and reload. The
  landing page must keep the explicit **Allow location** gate and must not
  silently assume Hungary, submit invented coordinates or start
  authentication. Granting permission afterward must retry normally without
  clearing unrelated landing content.
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
- Execution evidence, 2026-08-14/15 (functional branches PASS; real Firebase
  authentication retention remains pending):
  - Guarded stage recorded a write-free baseline of 56 users, zero user
    sessions and zero login audits with OSM `country:hu` and `country:gb`
    present and `country:fr` absent.
  - Budapest branch **PASS**: the managed anonymous target requested
    `/auth/eligibility?latitude=47.4979&longitude=19.0402`, resolved
    `eligible=true`, `partitionKey=country:hu`, displayed the ordinary enabled
    **Login** action, and left all three domain counts unchanged.
  - London branch **PASS**: the middle anonymous target requested the exact
    `51.5074/-0.1278` values, resolved `eligible=true`,
    `partitionKey=country:gb`, and displayed the enabled login action.
  - Paris granted-location branch **PASS**: the right target requested the
    exact `48.8566/2.3522` values, resolved `eligible=false` with no partition
    key, and displayed disabled **Unavailable in your country**. Screenshot
    `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-14 23-05-56.png`
    captures Budapest/Login, London/Login and Paris/Unavailable together.
  - Permission-denied branch **PASS**: only the Paris target was restarted with
    its isolated profile at browser permission `prompt`; before the explicit
    action it had no eligibility request, no session and showed **Allow
    location**. Chrome's native permission grant then changed the effective
    permission from `prompt` to `granted`, issued exactly one Paris eligibility
    request and returned to **Unavailable in your country** with no session.
    Screenshot
    `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 00-44-26.png`
    captures the resulting unavailable-country dialog.
  - Public/demo control **PASS after repair**: unavailable-country status does
    not disable **Start exploring**. A demo selection entered `/game` without
    trying to persist the browser coordinates into the seeded demo member. The
    ordinary Logout path revoked the exact tracked backend demo session and
    returned to `/entry`; the replay left the selected user's active-session
    array empty.
  - Two defects found by this branch were repaired and replayed against the
    watcher-owned fresh bundle: silent location resolution no longer opens the
    native browser prompt, and demo sessions no longer queue profile-coordinate
    persistence. Logout now revokes the current tracked demo/Firebase backend
    session before completing local sign-out.
  - The versioned `cleanup-demo-control` oracle proved ownership and removed
    only the checkpoint's 2 session-state documents, 3 accepted demo audits, 1
    security outbox and 1 materialized notification. It also reversed the
    exact Nova unread delta and notification-outbox pending delta (`31 -> 30`).
    Final `status -> verify -> reset -> status` proved the original `56/0/0`
    domain baseline, unchanged HU/GB partitions and `phase=not-staged`.
  - Completing a real Firebase login and proving that its resolved country
    partition survives the ordinary authentication/profile path is **PENDING**
    until a verified deployment Firebase client configuration is active. This
    substep is not simulated with demo authentication and prevents the matrix
    row from being marked fully Done.

## Tournament cases

### `TOURNAMENT-001` — manual definition and initial UI

- Consume the manual output of `EVENT-EDITOR-004` or an equivalent staged
  tournament definition.
- Verify parent event, stages, capacities, sequence, status and zero/initial
  group counts in Event Editor, stage list and tournament group popup.
- Published event details are intentionally locked. Therefore this read-only
  checkpoint uses two explicit fixture phases: an unpublished/draft identity
  for the editable Event Editor surface and an equivalent published identity
  for the runtime stage list/group popup. Do not ask the tester to Unpublish as
  a workaround just to reach the editor; that would turn a read checkpoint into
  an unrelated lifecycle mutation.

Execution evidence (2026-08-15, runtime branch):

- The guarded fixture contains one active/published Tournament event with
  Casey, Nova and Riley accepted (`3/8`), Qualifiers capacity `2..4` with group
  capacity `1..2` and advance `1`, and Final capacity `1..2` with group
  capacity `1..2` and advance `0`. Runtime groups, leaderboard, lifecycle
  tasks, outbox and recompute records are all zero.
- Initial runtime inspection **FAIL**: Qualifiers projected four groups and
  Final projected two because the duplicated group-count calculation used the
  incoming parent capacity without capping it by the current stage capacity.
  The standalone `Group capacity 1 - 2` label was also ambiguous.
- The calculation is now one shared policy on the Java paths and one matching
  frontend-local policy: effective incoming capacity is capped by the stage
  maximum before deriving its group count. The obsolete fixture-only
  `tournamentGroupCount` field was removed. The runtime card uses the compact
  localized form `Groups: 2 × 1–2 members` / `Csoportok: 2 × 1–2 fő`.
- Repair replay **PASS**: Qualifiers showed `Groups: 2 × 1–2 members` and only
  groups A–B; Final showed `Groups: 1 × 1–2 members` and only group A. The
  post-view read oracle still showed expected counts `2/1`, the same three
  accepted identities and zero runtime group/leaderboard/task/outbox writes.
- The fixture was corrected to stage the final editor branch explicitly as a
  draft while retaining the already-proven published runtime evidence. Editor
  screenshots
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 13-16-22.png`,
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 13-16-05.png`
  and
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 13-16-10.png`
  prove Tournament mode, parent capacity `1..8`, Qualifiers duration/offset
  `60/0`, group capacity `1..2`, Score, advance `1`, and Final duration/offset
  `45/0`, group capacity `1..2`, Score, advance `0` without Save or Publish.
- The editor's **Estimated Group Count** is deliberately a feasible range from
  stage capacity and per-group min/max: Qualifiers `1 - 4`, Final `1 - 2`.
  This is distinct from the published runtime's concrete generated counts
  `2/1`. The checkpoint oracle now names and checks both concepts separately.
- Final draft read oracle **PASS**: status remained `DR/published=false`, the
  exact three accepted identities and every definition field stayed unchanged,
  and runtime groups, leaderboard, tasks, outbox and recompute stayed zero.
  `TOURNAMENT-001` is **PASS/CLOSED**.

### `TOURNAMENT-002` — automatic group membership projection

- Provide accepted parent participants and run the real grouping path.
- Stage the first round in `RS` with its start instant a few minutes in the
  past and its end still in the future. This makes the real **Start Stage**
  action immediately available without waiting, changing the workstation clock
  or using a database write outside the versioned fixture.
- Before opening browsers, synchronize and snapshot the three actors' normal
  Activities event counters. Casey must have `All=1` and `My Events=1`; Nova
  and Riley must each have `All=1` and `Active Events=1`. The matching red
  counters must already be visible after initial page load, not only after a
  SmartList query or popup open.
- Verify every selected user is represented exactly once in the correct group,
  Event Members remains parent-scoped, the tournament group member screen is
  group-scoped, and group chat access matches group membership.
- Pending invitation rows must not be counted as accepted group members unless
  the documented transition explicitly promotes them.

Execution evidence (2026-08-15, first Start attempt):

- Baseline UI found two fixture defects before/at the first write. The initial
  actor activity counters were not synchronized, so the event card existed at
  `3/8` but the top Events/My Events red counters were absent. The fixture now
  snapshots and writes Casey `All/Hosting=1` and Nova/Riley `All/Active=1`
  before browser launch, and the oracle exposes the three exact counter maps.
- **Start Stage FAIL**: Casey's Qualifiers confirmation returned `200` but the
  response retained `RS`, so the frontend correctly showed **Stage action was
  not applied.** Screenshot
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 13-25-05.png`.
  The post-action oracle proved a complete no-op: no runtime group, group
  membership, chat, leaderboard, task or outbox document was written.
- Root cause was fixture shape, not a relaxed backend guard: the runtime DTO
  derived visible stage times from the parent, while the persisted fixture's
  `subEvents[]` omitted physical `startAt/endAt`. The backend Start guard checks
  the saved stage instant. The fixture now materializes both stage instants in
  the same production save shape before staging; replay is required.

Execution evidence (2026-08-15, second Start attempt):

- **Start Stage FAIL / false success**: the repaired fixture allowed the real
  action and the saved Qualifiers stage became `A` with runtime
  `groupsCount=2`, but the independent oracle found zero generated room event,
  zero room membership and zero group chat. The parent membership stayed at
  the exact three accepted users and its counters stayed stable, so this was
  not a read-side counter projection defect.
- Request tracing found a separate performance boundary in the same write
  path: targeted Start called an unbounded `ActivityEvent find {}` and filtered
  the requested source ID in memory. The targeted random, priority and score
  entry points now query only their requested event documents.
- The grouping failure came from treating the normal scheduled random-room
  generator's partial result as a successful explicit tournament Start. The
  Start-specific path now requires exact configured-group coverage, falls back
  deterministically when the affinity graph cannot populate disconnected
  targets, and includes every explicitly accepted event participant regardless
  of public discovery-profile visibility. The scheduled global random-room
  behavior and its public discovery pool remain unchanged.
- The versioned oracle now discovers generated `random-room:<parent>:...`
  events before reading their membership/chat identities and removes those
  artifacts during a clean reset. Replay this single Start boundary; do not
  repeat `TOURNAMENT-001` or the earlier definition checks.

Execution evidence (2026-08-15, first identity-complete Start replay):

- **Persisted identity contract PASS**: Qualifiers became `A/groupsCount=2`;
  two canonical Random Room events partitioned Casey+Nova and Riley exactly
  once; three accepted room memberships, two physical chat identities (three
  owner-scoped read documents), two welcome messages, three action outbox
  records and one recompute task agreed. Each actor received exactly `+1`
  Active/All event and `+1` event-chat counter while the parent counters stayed
  stable.
- The correct materializing request took about `494 ms` from its first event
  read through the parent counter write. The earlier roughly `250 ms` response
  is not a valid speed baseline because that false-success path created no
  rooms, memberships, chats or notifications. The user still found the real
  action only marginally faster, so the checkpoint remains open for one
  performance replay before the group/member/chat UI inspection.
- Write-path inspection found avoidable work after the grouping algorithm:
  each fresh room was saved twice, its already batch-loaded memberships were
  queried again, each affected user's complete event inventory/tickets were
  reprojected, and chat persistence was reread immediately after `saveAll`.
  The Start-owned path now consumes the batch membership snapshot, saves each
  room once with its embedded accepted projection, applies one atomic bulk
  Active/All membership delta, and trusts acknowledged chat writes without a
  read-after-write query. This is a write-side optimization; SmartList and read
  query semantics remain unchanged. Replay only Start to measure and prove the
  same identity/counter result.

Execution evidence (2026-08-15, write-roundtrip performance replay):

- **Persisted identity/counter contract PASS again** with the same two rooms,
  Casey+Nova and Riley exact partition, three accepted membership records, two
  chat identities/three owner copies, two welcome messages, `A/groupsCount=2`,
  three outbox records, one recompute task and exact `+1` Event/Chat deltas for
  every actor.
- The comparable request fell from about `494 ms` to `284 ms`, a reduction of
  roughly `43%`; the user's UI observation also found it somewhat faster.
- The terminal request trace still showed one independent generic parent-event
  counter refresh after the exact room deltas. A stage status transition does
  not move the parent event between Activities buckets, so this refresh only
  reread each actor's complete membership/event/ticket inventory and rewrote
  the same values. It has been removed from parent and generated-slot stage
  actions; Random Room membership and chat writes remain the owners of their
  exact counter deltas.

Execution evidence (2026-08-15, final Start performance replay and group-read repair):

- **Final Start replay PASS**: the persisted result stayed identical: two
  generated rooms, exact Casey+Nova/Riley partition, three accepted room
  memberships, two physical chats/three owner copies, two welcome messages,
  `A/groupsCount=2`, three action-outbox records, one recompute and exact `+1`
  Event/Chat deltas for all three actors. The request took about `435 ms`; the
  variance from `284 ms` was in the remaining writes. Trace showed zero full
  user event reprojections and zero unbounded event reads. The Start producer
  is therefore accepted and must not be replayed again.
- The first post-Start group GET exposed a separate **read-model FAIL**: the
  persisted room memberships were correct, but Group A and Group B were shown
  as `0/0`. The group DTO and Members action addressed the definition group's
  normal `ownerType=group` identity, while Start deliberately materializes
  membership under the generated Random Room event identity
  `ownerType=event`, `random-room:<parent>:<stage>:<group>`.
- The proper repair keeps the Start write model intact. The backend now
  batch-loads both membership scopes, returns the selected `memberOwnerType`
  and `memberOwnerId` with each group, and authorizes the parent event manager
  to read only a real matching `eventType=random-room`. The frontend and its
  local repository consume the explicit owner identity; materialized room
  membership remains view-only rather than routing normal group mutations to
  an event owner.
- Post-hot-deploy read-only proof **PASS**: the same running transaction now
  returns Group A `2` accepted with Casey Bridge and Nova Social, and Group B
  `1` accepted with Riley Outside. No fixture, Start action or persisted state
  was changed. The versioned oracle now reports manual definition-group rows
  separately from derived generated tournament groups so an empty manual
  collection cannot be mistaken for absent runtime grouping.
- Remaining bounded UI proof: after one Casey reload for the new frontend
  bundle, verify the Groups list shows `2 / 1–2` and `1 / 1–2`, then inspect
  the two exact member lists and the group-scoped chats. Nova and Riley remain
  untouched until their group/chat projections are requested.
- **Generated-group UI and embedded standings PASS**: after the required Casey
  reload, Qualifiers showed Group A `2 / 1–2` with Casey Bridge and Nova Social
  exactly once, and Group B `1 / 1–2` with Riley Outside exactly once. This
  matches both the persisted oracle and the repaired GET response. Evidence:
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 14-40-56.png`
  and
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 14-40-59.png`.
  Remaining proof is the explicit Group Members navigation/view-only boundary
  and then each actor's group-scoped chat projection; no Start replay is
  required.
- **Explicit Group Members identity PASS**: Group A -> Members opened
  `Random Room R1`, showed `2 members`, and contained only Casey Bridge and
  Nova Social. The header has no Invite action. The remaining `Pending only`
  control is a read filter, not a mutation. Member-card overflow may remain for
  non-mutating Participation/Report actions; the view-only route must suppress
  Approve, Remove/Delete, Promote, Step down, Leave, Disqualify and Reinstate.
  Evidence:
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 14-43-12.png`.
- **View-only member action boundary PASS**: Casey opened Nova's card overflow
  and confirmed the membership mutations were absent. The remaining actions
  are the permitted non-mutating Participation/Report controls. No action was
  selected and no member state changed. The remaining checkpoint branch is
  the three actors' exact group-chat projection.
- **Tournament chat presentation FAIL, then guarded repair ready**: Casey's
  first Chats -> All inspection found the correct single physical group chat,
  but it was visibly rendered as `Random Room R1` with a sparkle avatar and
  the affinity/leave/visibility welcome intended only for the standalone
  random matcher. Evidence:
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 14-47-46.png`.
  The persisted room membership and chat identity were correct; this was a
  semantic write/presentation defect, not a read projection or missing chat.
- The production path now distinguishes an explicit tournament Start from the
  scheduled random matcher. Tournament materialization writes
  `eventType=tournament-room`, `Tournament Group R<n>`, a parent-event
  subtitle, tournament topics/mode, tournament notification copy and a
  tournament-specific initial chat message. The stable internal
  `random-room:<parent>:<stage>:<group>` assignment identity is deliberately
  retained so proven memberships and chat authorization are not migrated or
  duplicated. The frontend consumes the backend welcome text and renders the
  managed trophy avatar; ordinary random rooms retain their existing copy and
  sparkle treatment.
- A generated trophy asset is versioned under
  `server/docker/conf/minio/media/images/system/tournament-room/v1/` as
  `small.webp` (`128x72`), `medium.webp` (`640x360`) and `large.webp`
  (`1280x720`). All three were seeded into the running `myscoutee-media`
  MinIO bucket and returned HTTP `200 image/webp`. The normal managed-image
  pipeline resolves the stored large URL to medium for event cards and small
  for avatars.
- The versioned `repair-tournament-room-presentation` checkpoint action
  guarded the exact live boundary and updated only two room documents, three
  owner-scoped chat copies and two initial system messages. It did not replay
  Start, change a membership, alter unread counts or create a task/outbox row.
  The post-repair read oracle proves Tournament Group R1/R2 at accepted
  `2/1`, three unchanged memberships, three chat copies, two
  `system:tournament-room-welcome` messages, unread total `3`, unchanged actor
  Activity counters and the same single completed parent recompute task.
- **Tournament chat row presentation replay PASS**: after one frontend reload,
  Casey's Chats -> All list contained exactly one `Tournament Group R1` row
  with the trophy avatar and tournament-specific preview. The repaired bundle
  therefore consumes the repaired backend presentation without a second
  Start, poll wait or projection workaround. The generated Active Events card
  also shows `Tournament Group R1`, the tournament subtitle and trophy image.
  Evidence:
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 15-17-51.png`
  and
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 15-17-38.png`.
- **Generated-room notification semantic FAIL, then guarded repair ready**:
  Casey's notification list still showed `Random Room R1 is ready`, the
  system-generated-room body and sparkle icon. Evidence:
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 15-17-34.png`.
  This was a separately persisted outbox/inbox presentation boundary, not a
  frontend projection issue. The production write path already emits the
  tournament title/body, `eventScope=tournament-room` and trophy image for new
  Starts; a dedicated versioned checkpoint repair updated only the current two
  pending outbox and three materialized inbox records.
- The expanded post-repair oracle proves exact R1 recipients Casey+Nova and R2
  recipient Riley, two pending outbox and three unread inbox records with
  tournament titles/body/scope/trophy. It also re-proves the unchanged three
  memberships, three chat copies, chat unread total `3`, Activity counters and
  the original single completed recompute. No Start, notification creation,
  counter delta or read transition was replayed.
- **Tournament card owner-avatar first implementation exposed an ownership
  conflict**: the large card image
  remains the managed tournament trophy, but the small overlay now uses the
  card's existing creator-avatar configuration and standard clickable profile
  action. No tournament-specific avatar component or custom click path was
  added. The production materialization copies the parent tournament host into
  the existing creator presentation fields while retaining the generated
  room's empty domain `ownerUserId`. The same shared converter and creator
  hydration path covers Java-backed and frontend-local event cards.
- A separate guarded repair copied Casey's creator presentation to exactly the
  two live room records and its immediate oracle proved the other transaction
  state unchanged. The subsequent Casey replay found **Active Events
  counter/list FAIL**: the stored counter remained `1`, but opening Active
  Events returned no item. The independent oracle still showed Casey's exact
  accepted `Member` row in R1. Root cause is that `creatorUserId` is not merely
  presentation: the Activities query treats it as room ownership/admin and
  therefore excludes Casey from the membership bucket. This is not a missing
  counter write and must not be hidden by frontend projection.
- The corrected production shape separates the concerns. Generated tournament
  rooms keep `creatorUserId` and domain `ownerUserId` empty, persist the parent
  host as optional `organizerUserId`, and use that field only through the
  existing shared profile-avatar/card action. Java hydration and frontend-local
  use the same contract. Targeted backend and frontend-local regressions prove
  that organizer presentation does not promote an accepted host to room admin
  or remove the room from Active Events. Both existing dev watchers compiled
  successfully; no parallel build or test process was started.
- The initially prepared two-record migration was rejected and then removed.
  A one-time database edit would make only the current transaction look right;
  it would not prove that reset -> stage -> real Start reproduces the fixed
  shape. The authoritative repair is therefore the production Start writer,
  the Java/local read contract and the versioned pre-Start fixture/oracle.
- Replay only this checkpoint from a clean harness reset and stage. After Casey
  runs Start once, the independent oracle must prove fresh R1/R2 with empty
  `creatorUserId/ownerUserId`, `organizerUserId=Casey`, the same exact
  membership/chat/notification/counter contract, and no retained repair marker.
  Earlier tournament-definition/group-read work is not repeated.
- **Clean replay baseline PASS / Start pending**: the versioned harness reset
  only TOURNAMENT-002, proved `phase=not-staged`, then staged and read back a
  fresh pre-Start fixture. The parent is active/published, Qualifiers is `RS`
  with persisted start/end, Casey/Nova/Riley are the exact accepted parent
  members, initial actor counters match the card buckets, and rooms, chats,
  messages, notifications, tasks, recomputes and action deltas are all zero.
  Exactly three managed browser sessions were replaced after this oracle. The
  next producer is one Casey **Start Stage** action; no earlier checkpoint is
  replayed.
- **Clean Start write-path replay PASS**: Casey ran Start once and the
  independent oracle proved the fixed record shape without any live repair.
  Fresh R1/R2 have empty `creatorUserId/ownerUserId`,
  `organizerUserId=Casey`, tournament titles/trophy, exact Casey+Nova/Riley
  partition and three accepted room `Member` rows. Two physical chats/three
  owner copies, two tournament welcome messages, two outbox/three unread inbox
  notifications, `A/groupsCount=2`, three action-outbox records, one recompute
  task and each actor's exact `+1` Active/All and `+1` Chat deltas all agree.
  Casey remains R1 Member with Active Events `1` and My Events `1`. The normal
  recompute may still be pending; it is not required for the list read. Next is
  the Casey in-place Active Events counter/list/card observation before reload.
- **Casey Active Events/card PASS in-place and after reload**: without reload,
  Casey saw counter `1`, exactly `Tournament Group R1`, the tournament trophy
  and Casey's small profile avatar. Clicking only the avatar opened the
  standard profile menu. Reload retained the same presentation, and the group
  Members view still contained the expected members. The follow-up persisted
  oracle was byte-for-identity stable across rooms, memberships, chats,
  notifications and counters; the one recompute completed exactly once without
  error. The visible `Leave event` action was not selected. It belongs to the
  new independent `TOURNAMENT-ROOM-LIFE-001` checkpoint.
- **Exceptional manual-recovery notification write/order PASS**: the normal
  automatic stage-start path remains unchanged. From a clean deliberately
  overdue `RS` fixture, Casey invoked manual **Start Stage** once. The repaired
  path first materialized the two rooms and exact three memberships, then
  persisted `Tournament started` exactly once for Nova and Riley only at
  `14:32:05.163Z`, followed by the personal R1/R2 ready rows at
  `14:32:05.192Z` or later for Casey/Nova/Riley. The independent oracle proves
  Casey is excluded only from the redundant started acknowledgement, remains
  included in R1 ready, all recipient sets are exact and there are no
  duplicates. Room, chat and Activity counter invariants also remain exact.
- Remaining TOURNAMENT-002 UI replay: Casey must see no unread `Tournament
  started` row and exactly one unread R1-ready row; Nova must see one started
  row followed causally by one R1-ready row; Riley must see one started row
  followed causally by one R2-ready row. Since New is newest-first, each
  participant's ready row must render above its started row. Do not open rows
  or action menus during this comparison. Earlier list/card/profile/member and
  persisted Start evidence is retained and must not be repeated.
- **Manual-recovery initiating-actor notification UI PASS**: Casey's New list
  contained no `Tournament started` row and exactly one unread `Tournament
  Group R1 is ready` row with the tournament trophy and expected body. The row
  and its action menu remained unopened. Nova and Riley recipient ordering is
  still pending.
- **Manual-recovery R1 recipient notification UI PASS**: Nova's New list
  contained exactly one unread `Tournament Group R1 is ready` row above
  exactly one unread `Tournament started` row. The trophy and both expected
  bodies agreed with the persisted oracle, and neither row was opened. Both
  rows visibly carry the same minute (`16:32`) because the UI displays minute
  precision; the persisted timestamps prove started at `.163` and ready at
  `.192+`, so both were produced immediately by the one manual Start and their
  causal order does not depend on a later periodic task. Riley's R2 recipient
  ordering remains pending.
- **Riley R2 participant projection PASS**: Riley saw the generated R2 card at
  `1 / 2`, and its Members view contained exactly one member. This agrees with
  the persisted singleton R2 membership; Riley's unread notification ordering
  remains a separate pending observation.
- **Manual-recovery R2 recipient notification UI PASS**: Riley's New list
  contained exactly one unread `Tournament Group R2 is ready` row above
  exactly one unread `Tournament started` row, with the expected trophy and
  bodies. The rows remained unopened. A final read-only oracle re-proved the
  exact started audience Nova+Riley, ready audience Casey+Nova+Riley, strict
  persisted order and empty `readAtIso` for all five rows. The notification UI
  branch is complete without mutation.
- Remaining bounded TOURNAMENT-002 proof is Nova's R1 card/member/chat and
  Riley's R2 chat. Nova's R1 chat observation covers the shared R1 initial
  welcome, so Casey's already-proven R1 row need not be reopened. Start,
  notification lists and earlier Casey projections must not be replayed.
- **Nova R1 participant membership UI PASS**: Nova saw `Tournament Group R1`
  at `2 / 2`; its Members view contained exactly Casey Bridge and Nova Social.
  No member action was selected. Only Nova's R1 chat content and Riley's R2
  chat remain.
- **Nova R1 participant chat UI PASS**: Nova's Chats -> All contained the
  single `Tournament Group R1` chat. Opening it showed the exact initial
  MyScoutee System tournament welcome stored by the oracle. Nova sent no
  message. Only Riley's R2 chat projection remains before checkpoint closure.
- **Riley R2 participant chat UI PASS**: Riley's Chats -> All contained the
  single `Tournament Group R2` chat. Opening it showed the exact same
  tournament-specific MyScoutee System welcome for the correct R2 identity.
  Riley sent no message.
- **Final read oracle PASS / checkpoint CLOSED**: the two generated rooms,
  exact Casey+Nova/Riley partition, stage `A/groupsCount=2`, three chat owner
  copies, welcome content and notification recipient/order contract remained
  unchanged. Opening the chats performed only the expected owner-scoped read
  transition: Nova R1 and Riley R2 became `unread=0` with Chat counters `0`,
  while untouched Casey R1 remained `unread=1` with Chat counter `1`. All five
  inspected notification rows remained unread. `TOURNAMENT-002` is
  **PASS/CLOSED**; none of its Start, list, member, notification or chat steps
  need replay before `TOURNAMENT-003`.

### `TOURNAMENT-003` — review and advancement

- Finalize one stage with deterministic winners/losers, then let the real
  tournament-review scheduler process it.
- Verify next-stage group membership, removed stale losers, stage status,
  score/advancement UI and notification exactly once.
- A second unchanged review must be a domain and UI no-op.
- **Baseline ready — 2026-08-15**: the replayable fixture holds Qualifiers in
  `SR / stage-ended` with two exact groups. Group A contains Casey `9` and Nova
  `4`; Group B contains Riley `7`; `tournamentAdvancePerGroup=1`, so the
  independently derived expected Final membership is Casey+Riley. Final is
  still `RS / awaiting-prior-stage` with no room/member/chat materialization.
  Casey has Hosting/All `1`; Nova and Riley each have Active/All `1`; all Chat
  counters are `0`. The real `event-tournament-review` rule remains enabled at
  its production `1800s` interval but is held idle beyond the manual boundary.
  Final now has a stable three-to-five-hour window so the manual Finalize, the
  first exact-once worker pass and the unchanged no-op pass cannot be consumed
  by fixture expiry.
- **Ordered execution**: first prove the deterministic qualifier standings in
  Casey's UI and use the visible Finalize Stage action once. Only after its
  persisted `F` oracle may the harness arm the already-running real review
  worker. After Casey+Riley advance exactly once, capture that stable state,
  re-arm the same real rule once and require `lastRunCount=0` plus a byte-exact
  domain snapshot before closing.
- **Manual Finalize PASS — 2026-08-15**: Casey verified the remaining Group B
  Riley score `7` and used **Finalize Stage -> Finalize** exactly once. The
  immediate persisted oracle recorded Qualifiers `F / stage-finalized` at
  `2026-08-15T15:29:07.835364258Z`, retained both qualifier groups and all
  three exact scores, and still had zero Final rooms. The real review rule was
  still idle with `armCount=0` and `lastRunCount=0`, proving that the manual
  Finalize write did not project or prematurely execute advancement.
- **Real review advancement and unchanged replay PASS — 2026-08-15**: the
  existing `event-tournament-review` scheduler consumed the first explicit arm
  at `15:31:02.524Z` with `lastRunCount=1`. It persisted one Final stage-group
  with exactly Casey+Riley accepted, excluded Nova, wrote one matching
  `score / group-members` plan marker and retained all qualifier scores. No
  separate tournament-room event or chat is expected from score review; those
  artifacts belong to the random/start grouping path. The first oracle version
  incorrectly required such a room, and was corrected to inspect the owning
  group membership and plan marker instead of changing the valid backend
  write. The unchanged second real scheduler pass completed at
  `15:38:02.969Z` with `lastRunCount=0`; the strict saved domain snapshot was
  identical, including stage state, Final membership, leaderboard, marker,
  outbox and all three users' counters.
- **Manual Finalize notification recipient FAIL / repair replay pending —
  2026-08-15**: the first Finalize persisted one outbox for Casey, Nova and
  Riley, and all three untouched browser DOMs converged to counter `1`. This is
  not valid delivery evidence: Casey manually performed Finalize and must be
  excluded from the recipient set, matching the already-proven manual Start
  contract. The shared backend stage-notification write path now excludes the
  actor for both non-final and final-stage Finalize, with a regression that
  requires only Nova+Riley. The existing watcher compiled successfully and the
  backend restarted healthy. The guarded
  `prepare-tournament-finalize-notification-retest` action rewinds only
  Qualifiers `F -> SR`, removes only the old Finalize outbox/deliveries and
  holds review; it preserves the deterministic scores, one Casey+Riley Final
  group, plan marker and both real-worker proofs. Replay only Casey's one
  Finalize action, then require one Nova+Riley outbox and no Casey delivery.
- **Focused notification replay baseline READY — 2026-08-15 17:54 CEST**:
  the guarded rearm removed exactly one old three-recipient outbox and three
  delivered notification rows, then persisted Qualifiers `SR / stage-ended`.
  Its immediate read oracle retained Casey `9`, Nova `4`, Riley `7`, one Final
  group with exactly Casey+Riley, Nova absent, `armCount=2`, the prior
  `lastRunCount=0` no-op and zero Finalize outbox. The real review rule is held
  idle. Do not execute the rearm again; reload only Casey's event detail and
  replay the visible Finalize once.
- **Focused corrected Finalize write and in-place counter PASS — 2026-08-15**:
  Casey replayed the visible Finalize exactly once. The immediate verifier
  found one `event-stage-finalized` outbox with only Nova+Riley, no Casey, and
  exactly one unread delivered row for each recipient. Both rows persist
  `Tournament stage finalized / Qualifiers has been finalized.` The preserved
  stage/group oracle retained the one Casey+Riley Final group and excluded
  Nova. Without touching or reloading Nova/Riley, read-only CDP observed no
  Casey notification badge and badge `1` for both Nova and Riley. The backend
  recipient repair and in-place delivery counters are PASS; only the visible
  New-list content comparison remains before closing the checkpoint.
- **Notification meaning/causality FAIL found; ordered repair replay staged —
  2026-08-15**: the recipient repair was correct, but a single generic
  `Tournament stage finalized` row cannot also communicate who actually
  advanced. Finalize and advancement are different producer boundaries. The
  manual Finalize write must first persist one translated generic notification
  for Nova+Riley and exclude Casey as the actor. The existing Final group stays
  in place. Only after the real tournament-review worker has written Casey and
  Riley's missing memberships into that group may it persist a later,
  trophy-branded `Advanced to Final` notification for Casey+Riley. Thus the
  final visible split is Casey advancement only, Nova finalized only and Riley
  both. Automatic execution uses the same ordering, but has no manual actor to
  exclude from the finalized audience. Backend, frontend-local, frontend EN/HU
  and all Mongo EN/HU seed paths now share these keys. The guarded sequence
  replay independently proves the immediate Finalize boundary, changed worker
  boundary, notification timestamps/recipients, and a final unchanged-worker
  no-op before visual closure.
- **Ordered notification replay PREPARED — 2026-08-15 18:34 CEST**: the guarded
  prepare action retained Qualifiers `SR` with exact Casey `9`, Nova `4` and
  Riley `7`, removed only Casey/Riley memberships from the already-existing
  Final group, removed its single review plan marker and held the real worker
  idle. It did not recreate or delete the Final group. Run Casey's one visible
  Qualifiers Finalize next; do not run prepare again.
- **Separated automatic outcomes and unchanged replay PASS — 2026-08-15**:
  after Casey's already-persisted manual Finalize, the real review worker ran
  once with affected count `1`. It retained Casey's human-sender
  `event-stage-finalized` intent for Nova+Riley, then persisted one independent
  automatic `event-stage-advanced` intent for Casey+Riley and one independent
  automatic `event-stage-not-advanced` intent for Nova. Both automatic rows
  carry source `Qualifiers` and destination `Final`; the advancing avatar uses
  Final's stage position `2/2`, while the non-advancing avatar uses Qualifiers
  position `1/2`. Final membership is exactly Casey+Riley. A second real worker
  pass completed with affected count `0`, and the saved domain plus all three
  notification intents remained byte-identical. The frontend-local path and
  EN/HU frontend plus all three Mongo seed sets mirror the same contract. The
  only open branch is the unread three-browser rendering comparison; no
  Finalize or worker replay remains.
- **Three-browser notification rendering PASS / CLOSED — 2026-08-15**:
  screenshot `2026-08-15 19-50-31` proved the final split without another
  write. Casey showed one automatic `Advanced to Final` row. Nova showed
  Casey's separate human-avatar `Qualifiers finalized` row plus one automatic
  `Did not advance from Qualifiers` row. Riley showed Casey's separate
  Finalize row plus one automatic advancement row. The two advancing users are
  Casey (Group A) and Riley (Group B); Nova is the sole non-advancer. Counts,
  source/destination stage names, Casey avatar and stage-colored trophy avatars
  agree with the persisted oracle. `TOURNAMENT-003` is PASS/CLOSED; retain its
  exact Final group as the `TOURNAMENT-004` starting boundary.
- **Later Start boundary remains independent**: assignment to Final does not
  mean Final has started. When Final actually starts, the existing tournament
  Start path writes a new `Final started / Final has started. Groups are
  ready.` row. Manual Start excludes the initiating actor from that redundant
  acknowledgement, as already proven in `TOURNAMENT-002`; an automatic Start
  has no manual actor to exclude. The ordered Finalize/advancement replay stops
  before this later transaction so closure, assignment and Start cannot be
  mistaken for one write.
- **Final group UI PASS — 2026-08-15**: without reload, Casey opened Final ->
  Groups and observed exactly one group with `2 members`, Casey Bridge and
  Riley Outside; Nova Social was absent. The immediate independent oracle
  retained the same two accepted Final group members and the second review
  result remained `lastRunCount=0`. This closes the advancement presentation;
  only the focused corrected notification comparison remains.
- **Qualifier history UI PASS after repair — 2026-08-15**: screenshot
  `17-11-48` showed the selected Casey score history as a three-line card
  (`+9`, note and date) below the existing Standings/History tabs. This was a
  presentation defect, not a missing-Nova write: clicking Casey had correctly
  selected Casey's History tab, while the persisted qualifier oracle still
  retained Casey `9`, Nova `4` and Riley `7`. The shared tournament-groups
  component now renders score history as `Score | Note | Date` and FIFA history
  as `Match | Result | Date`, without another back/detail arrow because the
  existing tabs own navigation. The History table has no forced desktop/mobile
  minimum width: fixed compact value/date columns and a single-line ellipsized
  middle column keep each record on one row without horizontal overflow on a
  narrow viewport. The running frontend watcher compiled and synced the first
  repair at `17:13:50` and the final responsive repair at `17:15:59`. Casey
  reloaded that bundle and passed the focused narrow-window replay: the `+9`
  update remained one compact `Score | Note | Date` row, the note stayed on one
  ellipsized line, there was no redundant back/detail arrow and no horizontal
  overflow. A read-only post-replay oracle retained Qualifiers `SR`, exact
  Casey `9` / Nova `4` / Riley `7`, zero Final rooms and review `armCount=0`;
  opening History therefore caused no domain write or premature worker run.

### `TOURNAMENT-004` — Final Start and whole-tournament completion

- Continue only from the exact Casey+Riley Final membership proved by
  `TOURNAMENT-003`; Nova remains the non-advancing control.
- Guarded carry-forward evidence at `2026-08-15T18:02:10.035Z`: the saved T003
  domain and notification no-op baselines were byte-identical; Qualifiers was
  still `F / stage-finalized`, Final was `RS / awaiting-prior-stage`, the one
  Final group contained exactly Casey+Riley, Nova was absent, and Final Start
  plus terminal Finalize both had zero outbox/inbox rows. The harness changed
  only the active checkpoint metadata from T003 to T004 and retained the same
  event identity/title; no fixture reset or lifecycle repair ran.
- **First Final Start attempt FAIL / complete no-op**: Casey's confirmation
  returned the unchanged `RS` result and the UI correctly showed **Stage action
  was not applied.** The Java Start path and its earlier targeted-read/batched
  write optimization were still present. The persisted fixture was wrong: at
  `2026-08-15T18:08:57.268Z` the materialized Final `startAt` was
  `2026-08-15T20:31:24.087Z`, so the backend's real start guard correctly
  refused the early transaction. No Final runtime, room, chat, outbox or inbox
  write occurred. Evidence:
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-15 20-04-41.png`.
- The versioned `repair-tournament-final-start-window` action then guarded the
  exact closed T003/T004 boundary and changed only Final's materialized
  interval to `2026-08-15T18:09:03.807Z`–`2026-08-15T20:11:03.807Z`. Its
  post-write oracle retained Qualifiers `F`, Final `RS`, exact Casey+Riley
  Final membership, Nova exclusion and byte-identical prior notification and
  domain evidence. Replay only the single Final Start click; do not reset or
  replay Qualifiers.
- **Second Final Start domain PASS / recipient FAIL**: after the repaired
  window, Casey's Start persisted Final `A / tournament-started`, kept
  Qualifiers `F`, retained exactly Casey+Riley in Final and kept Nova excluded.
  The notification producer nevertheless over-broadcast one translated
  `Final started` intent and inbox row to both Nova and Riley. Casey was
  correctly excluded. This was a write-side audience defect, not a Smart List
  projection or polling race.
- The repaired Java producer now resolves a later stage's accepted audience
  from its materialized group memberships and then excludes the manual actor.
  If an initial stage has no group membership rows yet, it keeps the previously
  proven parent-event audience fallback. Frontend-local now applies the same
  rule and stage avatar payload. Existing Start targeted-read, batched-write
  and scheduler-scope optimizations were retained unchanged. Backend and
  frontend live watchers both completed successfully.
- **Clean Final Start replay PASS / CLOSED at
  `2026-08-16T11:42:24.876Z`**: Casey applied Start exactly once at
  `2026-08-16T11:40:07Z`. Final became `A / tournament-started`, Qualifiers
  stayed `F`, the Final group remained exactly Casey+Riley and Nova remained
  excluded. Exactly one Final room, two owner chat copies and one welcome
  message were persisted. Casey's human `Final started / Final has started.
  Groups are ready.` intent targeted Riley only; 31 ms later the independent
  system `Tournament Group R1 is ready` intent targeted Casey+Riley. The two
  records keep their own actor, type, recipients and avatar semantics and must
  never be merged, relabelled or deduplicated into one another. Riley's live
  list showed room-ready above Final-start, Casey's showed room-ready only and
  Nova's showed neither. This Start branch is PASS and must not be replayed
  while preparing terminal Final completion.
- **Terminal boundary prepared at `2026-08-16T11:54:16.529Z`**: the guarded
  fixture preserved the byte-identical PASS Start/room/chat/membership/counter
  and room-ready evidence, moved only Final to `SR / stage-ended` with its end
  instant one minute in the past, and added deterministic Final scores Casey
  `9` / Riley `7`. The tournament-review worker is held during this terminal
  action.
- Casey visually confirmed the prepared Final standings as Casey `9` / Riley
  `7`, then applied Finalize exactly once. The resulting notification UI is a
  **terminal product FAIL**: one Casey-authored `Tournament finalized` record
  also carried the automatic winner result (`Final is complete... Winner:
  Casey Bridge`). The write therefore merged two different producers and
  meanings. Evidence:
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-16 13-57-31.png`.
- Required correction and terminal-only replay contract: the manual action
  keeps a separate Casey-authored `Final finalized` audit for the other Final
  participant. After it, MyScoutee System sends one short personal result to
  each finalist using the already-PASS advancement presentation (stage accent
  plus trophy avatar): Casey receives the non-winner result and Riley the
  winner result. Nova receives neither terminal row because she was eliminated
  before Final. The replay fixture reverses only the Final scores to Casey `7`
  / Riley `9`; it must not replay or rewrite the PASS Final Start transaction.
- **Corrected terminal replay machine PASS / UI oracle pending**: the guarded
  terminal-only replay at `2026-08-16T12:19:47.518Z` changed only Final to
  `SR / stage-ended`, set Casey `7` / Riley `9`, removed only the failed merged
  terminal transaction and preserved the PASS Final Start and room-ready
  snapshots byte-identically. After one Casey Finalize, the persisted verifier
  passed at `2026-08-16T12:23:48.589Z`. It proved three separate records in
  causal order: Riley received Casey's human `Final finalized` audit, then
  Riley received the MyScoutee System `Won the tournament` result, and Casey
  received the MyScoutee System `Did not win the tournament` result. Nova
  received none. The two system outcomes use short Final-stage trophy payloads
  and never inherit Casey's actor identity. Keep the ledger row open until the
  same separation and presentation pass in Riley, Casey and Nova UI lists.
- **Casey/Riley terminal UI recipient PASS at 2026-08-16 14:31 CEST**:
  `/home/raxim/Pictures/Screenshots/Screenshot from 2026-08-16 14-31-26.png`
  shows Casey with only the system `Did not win the tournament` terminal row,
  while Riley has the system `Won the tournament` row plus Casey's separate
  `Final finalized` audit. Producer avatars and short messages are not merged.
  A presentation follow-up adds a stage-coloured glow only to positive
  `advanced`/`won` trophy avatars and a diagonal strike only to negative
  `not-advanced`/`not-won` trophy avatars. The running frontend watcher built
  and synced that narrow CSS/converter change successfully at 14:33 CEST; one
  reload of the existing Casey/Riley lists is required to qualify the new
  bundle. Nova exclusion remains the final recipient UI check.
- **Winner-avatar presentation PASS at 2026-08-16 14:37 CEST**: after exactly
  one Riley reload, the system `Won the tournament` trophy showed its
  stage-coloured glow and Casey's separate `Final finalized` portrait remained
  unchanged. No lifecycle producer was repeated.
- **Non-winner-avatar presentation PASS at 2026-08-16 14:43 CEST**: Casey's
  already-persisted `Did not win the tournament` row showed the diagonal trophy
  strike after the required reload loaded the new frontend bundle. No
  lifecycle producer was repeated. Nova's terminal exclusion remains the only
  open UI assertion.
- **Nova exclusion PASS / checkpoint CLOSED at 2026-08-16 14:43 CEST**: after
  one Nova reload, her New list contained none of `Final finalized`, `Won the
  tournament` or `Did not win the tournament`. Together with the persisted
  oracle and Casey/Riley UI evidence, this closes `TOURNAMENT-004` as PASS.
  Final Start, room-ready, human Finalize audit, system winner/non-winner
  outcomes, EN/HU keys and positive/negative stage-avatar presentation are all
  qualified. Do not replay this checkpoint when preparing the independent
  generated-room leave test.
- **Focused recipient replay prepared at
  `2026-08-15T18:22:44.221Z`**: the versioned harness guarded the exact
  successful-domain/failed-recipient boundary, rewound only Final event/runtime
  to `RS / awaiting-prior-stage`, and removed exactly one defective Nova+Riley
  outbox plus two delivered inbox rows. It preserved the closed Qualifiers,
  exact Casey+Riley Final group, Nova exclusion, plan marker and all prior T003
  evidence. Because the earlier time repair happened behind an already-open
  browser, Casey had to reload exactly once. The resulting **Blocked** badge is
  the correct recovery boundary: Final remains `RS`, its start instant has
  passed, and only then may the manual **Start Stage** action be applied.
- Starting Final is a new transaction after advancement. Its system
  notification title and body must both identify **Final**, and its left
  stage-icon must use the same shared accent hue as the Final stage card. The
  notification row background remains owned by the normal notification-tone
  rules. Manual Start excludes the initiating actor only from the redundant
  Start acknowledgement; an automatic Start has no manual actor to exclude.
- The same stage-context rule applies to every tournament lifecycle
  notification, but producer identity remains separate. A manual action keeps
  Casey as its human actor and excludes only Casey from that acknowledgement;
  a subsequent automatic room/advancement/result record stays a distinct
  MyScoutee System record with its own recipients and message. Closure names
  the completed stage, advancement names both source and destination stages,
  and terminal finalization states that the whole tournament ended. Never
  merge a Casey record with an automatic record or replace one with the other.
- Finalize only through its valid ended/review boundary. A manual terminal
  action first produces the ordinary human `{stageTitle} finalized` audit,
  excluding only its actor. The system then produces separate, short
  winner/non-winner outcomes for the exact Final participants. Those system
  outcomes reuse the advancement trophy/avatar styling and Final stage context;
  they never inherit Casey's sender identity or merge the human audit text into
  their result text.
- Compare EN/HU rendering against both frontend-local bundles and live Mongo
  keys. A second unchanged Start/Finalize attempt or worker pass must not add
  membership, result, outbox, inbox or counter deltas.
- Keep this checkpoint separate from `TOURNAMENT-003`: Qualifiers closure,
  Final assignment, Final Start and whole-tournament completion are four
  causally ordered producer boundaries, not one projected UI transition.

### `TOURNAMENT-ROOM-LIFE-001` — nested tournament-room visibility

- **NOT RUN.** The first fixture staged at `2026-08-16T13:10:53.035Z` was
  invalid for this domain rule: it exposed materialized tournament rooms as
  independent root Activity event cards and therefore suggested an unrelated
  Leave test. No modifying UI action was executed. The guarded reset at
  `2026-08-16T13:31:51.209Z` removed only that fixture and preserved the closed
  `TOURNAMENT-004` evidence.
- The corrected hierarchy fixture staged at `2026-08-16T13:53:23.200Z`.
  Independent reads proved one root parent plus two parent-linked/generated
  rooms. Casey's root list contained only the parent; **View Event →
  Qualifiers → Groups** exposed the two nested groups, while their accepted
  room chats remained member scoped. This visibility/navigation branch is
  **PASS/CLOSED**.
- The fixture also injected a Group A event-owner pending invitation and its
  aggregate counter. Code tracing proved that state is not produced by the
  tournament flow: Start consumes only already-accepted parent members,
  `syncMaterializedSystemEventMembers` persists them directly as accepted with
  `pending=0`, and materialized event-owner groups are read-only in the Groups
  UI. No pending-resolution action was executed. The synthetic branch was
  classified **NOT EXECUTED / invalid fixture** and guard-reset at
  `2026-08-16T14:07:44.250Z`, preserving `TOURNAMENT-004`.
- Future replay stages accepted-only Group A/Group B membership and requires
  zero pending counters. A tournament room remains a nested sub-event/group;
  it never becomes a standalone Activity event or independent Leave target.
  Chat and notification projections remain member scoped.

### `TOURNAMENT-ADMISSION-001` — first-stage admission boundary

- The selected product contract is a strict lock at the first tournament-stage
  Start. That write freezes the accepted parent-member snapshot, disables the
  auto inviter and changes the existing main-event visibility to `Invitation
  only`. The ordinary Explore read therefore omits the closed tournament
  without reconstructing stage state, adding a tournament-only projection or
  presenting a waitlist. Accepted participants and Admins retain their normal
  tracked-event views.
- Exercise the backend—not only the UI—for late join, existing-invitation
  acceptance and Admin approval. Explore absence is the primary new-Join UI
  result; the direct Java and frontend-local guards remain defense in depth for
  stale links and already-existing pending rows. Every rejected late acceptance
  must change no parent/group membership, capacity, chat, leaderboard, counter,
  checkout, ticket, payment or notification record.
- Parent-event pending admission is not part of the nested `Groups` counter.
  That counter aggregates only group-scoped pending member operations and
  group resource requests. Materialized event-owner tournament groups are
  read-only for member invitation and receive accepted members directly, so
  their member-pending contribution remains zero; only a genuinely pending
  group resource request may produce a counter there. The parent event may
  still expose its own pending admission indicator separately.
- Exercise HTTP and frontend-local with the same parent membership states and
  prove scheduler reruns remain idempotent. This checkpoint is separate from
  the already-passed Start notifications and must not rewrite or replay them.
- Join branch PASS on `2026-08-17`: the first replay exposed a visible closed
  tournament in Explore. The corrected first-stage Start write reuses the
  existing `visibility=Invitation only` state; after one required browser
  reload Riley no longer saw the event. The independent rejection oracle
  verified events, membership/runtime, leaderboard, chats/messages, checkout,
  payments, tickets, notification/outbox, tasks and user counters unchanged.
- The next isolated branch retains the same closed parent and exactly one
  pre-existing Riley Admin invitation (`pendingSource=admin`,
  `requestKind=invite`). Its one Accept attempt must be rejected while that
  invitation remains pending and every downstream oracle section remains
  unchanged.
- The first invitation baseline visual check exposed a fixture-only omission
  before Accept: the pending list item existed but its Invitations counter and
  event-invite notification had not been materialized. The guarded repair
  preserved the event/member baseline and added exactly one Invitations
  counter delta, one unread notification delta, one terminal outbox audit row
  and one unread inbox row. Require a fresh Riley document to show both red
  counters and the single invite row before executing the rejection branch.
- Invitation acceptance PASS on `2026-08-17`: Riley saw the corrected red
  Invitations and notification counters, then one Accept attempt was blocked.
  The independent oracle retained the exact pending Admin invitation, one
  outbox/inbox pair and zero chat, checkout, payment, ticket or worker effects.
- The following Admin-approval baseline uses a separate pre-existing pending
  request (`pendingSource=member`, `requestKind=approval`), Riley Pending
  counters and exactly one unread Casey join-request notification. Verify this
  baseline visually before Casey attempts Approve once.
- Its first visual check exposed a second fixture-only omission: Casey and Nova
  were present in their lists but the root hosted/active activity counters were
  zero. The guarded write-side repair materialized Casey My Events `1` and
  Nova Active Events `1`, retained Riley Pending `1`, and made these counters
  part of the branch oracle without executing approval.
- Admin approval PASS on `2026-08-17`: after the corrected reload-owned
  baseline, Casey attempted Approve exactly once and saw the registration-closed
  result. The independent oracle retained `Qualifiers` in active status `A`,
  Casey+Nova accepted, Riley as the same single pending member approval, one
  join-request outbox/inbox pair and zero chat, checkout, payment, ticket or
  worker effects. All fourteen persisted oracle sections were unchanged.
- Checkpoint PASS/CLOSED on `2026-08-17` for the executed HTTP/Java contract.
  Frontend-local runtime is **NOT EXECUTED** by explicit user decision and is
  not counted as PASS evidence. Static inspection confirms that the local
  repository derives the lock from first-stage status and places guards before
  all three mutations. The ledger records `Dev = X` and `Local = -`. Preserve
  the completed HTTP evidence and do not replay its producers.

### `TOURNAMENT-SCORE-REOPEN-001` — corrected scores and result revision

- Let the normal time boundary close one active stage into `Score review`;
  this automatic closure ends scoring time but does **not** approve the result.
  The Event Admin then finalizes the reviewed scores once and the independent
  tournament-review worker produces the stage advancement or terminal result.
- From that stable finalized boundary, choose **Reopen scores**, change one
  deterministic score so that at least one participant outcome changes, and
  finalize again. Preserve the first finalized result and its notifications as
  immutable audit evidence; the correction is a new result revision, not an
  overwrite of the earlier notification.
- Require exactly one new human Finalize audit (excluding its actor) and then
  exactly one new automatic result per affected participant. The new automatic
  rows must use the corrected winner/advancer split and explicitly belong to
  the later result revision. An unchanged worker replay and a repeated action
  against the already-finalized revision must remain no-ops.
- Verify the same persisted result revision, recipients, ordering and localized
  rendering through Java and frontend-local. Keep this case separate from the
  already-closed Start and initial Finalize/advancement checkpoints.
- The dedicated versioned fixture staged the already-finalized revision 1
  boundary directly, including the immutable human Finalize audit, automatic
  participant outcomes, result marker and initial Final group membership. The
  guarded Reopen replay is **PASS**: Qualifiers moved from `F` to `SR` while
  revision 1, scores `9/4/7`, Final membership `Casey + Riley` and all earlier
  evidence remained unchanged. Exactly one under-review outbox produced two
  inbox rows for Nova and Riley; Casey remained the human sender and was
  excluded as a recipient. The exact score correction is also **PASS** at
  `Casey=9, Nova=14, Riley=7`, with the stage still in `SR`/revision 1 and all
  earlier evidence unchanged. Corrected Finalize and the real revision-2
  worker result are also **PASS** at `Casey=9, Nova=14, Riley=7`: the human
  Finalize audit remained separate, the Final membership changed from the
  immutable revision-1 `Casey + Riley` result to revision-2 `Nova + Riley`,
  revision 2 produced three outcome outbox and three inbox rows, and all
  revision-1 evidence remained unchanged. The three-actor notification UI
  inspection is **PASS**: Casey showed old advance/new reject, Nova old
  reject/new advance, and Riley two separate advance results; both human
  Finalize audits remained separate and no `Final starts soon` row returned.
  The unchanged-worker replay is also **PASS** with `lastRunCount=0`, identical
  membership, scores, markers and revision-specific notification evidence.
  The final no-second-Finalize UI guard is **PASS**: finalized Qualifiers no
  longer exposed `Finalize Stage` (while the separate Reopen action remained
  untouched). The checkpoint is **PASS / CLOSED**. No Start or initial Finalize
  producer was replayed.
- During the correction boundary, the generic scheduled stage-reminder exposed
  a separate FAIL: the waiting tournament Final emitted redundant `Final starts
  soon` rows twice. Tournament stages now bypass that generic reminder and use
  only their dedicated lifecycle notifications; non-tournament stage reminders
  remain unchanged. The existing backend watcher compiled and restarted the
  change. A guarded cleanup removed the exact defect shape (one task, two runs,
  six deliveries, six outbox and six inbox rows) without changing revision 1,
  the corrected `9/14/7` scores or Final membership. The corrected Finalize
  gate proved that the producer did not return: task, run, delivery, outbox and
  inbox counts for that generic reminder all remained zero.
- The no-op replay also corrected two fixture-only oracle defects without
  changing product state: capped `runHistory` length cannot prove that a zero-
  work run completed, so completion now uses a later `lastRunAtIso` plus
  `lastRunCount=0`; BSON document field order is normalized before snapshot
  equality, while array order and every leaf value remain strict.

### `TOURNAMENT-SCORE-REOPEN-002` — correction safety after progression

- From a finalized earlier stage, compare Reopen availability before and after
  the next stage starts. Reopening is allowed while downstream play has not
  begun; once a dependent next stage is active or closed, the ordinary Reopen
  action must be unavailable or rejected atomically.
- A rejected late correction must leave stage statuses, scores, group
  membership, current-stage summary, chats, outbox/inbox rows and counters
  byte-identical. Correcting an already-used result requires a separate
  explicit rollback/correction workflow; it must not silently rewrite a live
  downstream bracket.
- The implementation now persists a result-revision identity through Java,
  HTTP and frontend-local state. Its lifecycle guard permits Reopen only while
  every later tournament stage is still waiting or pristine/unstarted. The
  running dev watchers compiled this foundation. `TOURNAMENT-SCORE-REOPEN-001`
  is PASS/CLOSED with revision-specific notifications and an exact no-op replay.
- The guarded `TOURNAMENT-SCORE-REOPEN-002` continuation is prepared from that
  immutable predecessor without replaying Start, Finalize or result producers:
  Qualifiers remains `F`/revision 2 with exact `9/14/7` scores, Final membership
  remains Nova+Riley, while the dependent Final event/runtime/current-stage
  state is now active with one persisted start boundary. A normalized snapshot
  of every related event, member, runtime, leaderboard, group, chat, message,
  notification, marker, task and user-counter record is retained for the
  rejected-action oracle.
- Execution on `2026-08-17` is **PASS / CLOSED**. After the required reload,
  Casey's Qualifiers action menu omitted `Reopen Scores`. One deliberately
  forbidden request then used Casey's existing authenticated browser session
  against the real Java `/activities/events/stage-action` route. The response
  remained `F`/revision 2 with the original Finalize identity. The strict
  post-request oracle retained exact `9/14/7` scores, Nova+Riley Final
  membership, active dependent Final/current-stage state and byte-identical
  event, member, runtime, leaderboard, group, chat, message, notification,
  marker, task and user-counter records. No lifecycle producer was replayed.
  Frontend-local runtime is recorded as `-`/not executed; its guard remains
  statically aligned with Java and UI.

### `TOURNAMENT-CARD-001` — persisted current-stage summary on the parent card

- Materialize a compact current-stage wire value on the parent tournament
  event whenever the lifecycle starts, advances or completes a stage. The
  authoritative write must keep stage ID, localized/display name and lifecycle
  state consistent with the stage runtime; the event-list query must not
  reconstruct it from nested runtime records.
- Render the wire value on the root parent event card as a separate compact
  row below the event name, for example `Current stage: Qualifiers`. Do not
  place generated tournament-room cards into the root list and do not perform
  a nested read merely to paint this row. Frontend-local uses the same stored
  parent-event shape.
- Verify in-place lifecycle updates and reload persistence for Start, advance,
  Final and tournament completion. Long event/stage names must remain readable
  on mobile without turning the card header into an ambiguous combined title.
- This is a separate follow-up checkpoint. It must not modify or invalidate the
  `TOURNAMENT-ROOM-LIFE-001` pending-counter replay or the closed tournament
  lifecycle checkpoints.

Execution evidence on 2026-08-16 (PASS / CLOSED):

- Backend write boundaries now materialize `{id, name, stageNumber,
  totalStages, status}` on the parent event; the event-list projection includes
  only `currentStage`, not nested `subEvents`. Frontend-local persists the same
  shape. The established backend and frontend dev watchers compiled the change
  successfully; no parallel build/test process was started.
- A separate guarded `TOURNAMENT-CARD-001` fixture staged one active parent
  tournament with Qualifiers in `SR`, Final in `RS`, three accepted parent
  members and zero generated root-room records. Its baseline oracle at
  `2026-08-16T14:52:56.420Z` proved persisted `Qualifiers · 1/2`.
- The Casey HTTP `My Events` oracle returned exactly that `currentStage` wire
  value and no `subEvents` field. Casey then verified the separate
  `Current stage: Qualifiers · 1/2` row on the root parent card.
- Finalizing Qualifiers changed that same row immediately, without waiting for
  a poll, to `Current stage: Final · 2/2`; one explicit browser reload retained
  the exact value and still showed no generated room card in the root list.
- The terminal transition oracle proved persisted
  `{final, Final, 2/2, RS}`, finalized Qualifiers, three accepted parent
  members, two authoritative Qualifiers runtime groups and zero generated root
  records. The shell harness dispatch omission discovered by this terminal
  check was fixed so its documented verifier now reaches the existing guarded
  JavaScript oracle.

### `TOURNAMENT-MEMBER-001` — first-stage materialization admission cutoff

- Use the real parent-event invitation path to make one controlled invitation
  terminally accepted while a scheduled first-stage Start is still in flight,
  while a second controlled invitation remains pending.
- The successful first-stage materialization is the admission cutoff. The
  accepted identity must appear exactly once in one generated room, its
  leaderboard and group chat. The pending identity remains parent-scoped and
  must not enter any generated room, standings row or chat.
- Reuse the generic invitation UI evidence from `EVENT-INV-*`; this checkpoint
  owns only the Tournament-specific cutoff between terminal parent membership
  and the participant set materialized by Start.

Execution evidence on 2026-08-25 (PASS / CLOSED):

- A scheduled Start was already in flight but stuck; Nova accepted before its
  materialization committed. Casey's visible assistance completed that one
  materialization, so Nova was validly included at the commit boundary.
- Start materialized exactly two parent-linked rooms: R1 for Casey and R2 for
  Nova. Riley entered neither room, group chat nor standings. The R2
  `Standings` UI showed only Nova at zero points.
- The parent-only Activities counter contract was repaired at the write
  boundary: a materialized event with `parentEventId` retains its membership
  diff but does not increment user event counters. Nova consequently saw one
  root parent card and `Events = Active Events = 1`; Casey saw the parent once
  under `My Events`.
- Casey saw Nova's acceptance and R1-ready notifications; Nova saw the
  R2-ready notification. Empty `eventLeaderboardEntries` is expected before a
  score is submitted: the visible zero-point standings are derived from the
  generated group membership.
- Riley then attempted `Accept` after the successful materialization. The UI
  rejected it; the independent persisted oracle retained Riley pending and
  proved parent membership, rooms, chats, standings, counters and
  notifications unchanged. The fixture was reset after this proof.

### `TOURNAMENT-MEMBER-002` — active participant removal

- From an isolated already-started, non-blocked tournament whose persisted
  parent `currentStage` and Qualifiers runtime are both `A`, with generated
  rooms and one retained score row, Remove one accepted
  participant from the parent event. This is explicitly after Start; no Start
  or stuck/blocked recovery belongs to this checkpoint.
- Verify parent and generated-room active membership, room-chat authorization
  and exact actor counters are revoked once. The parent record becomes
  `deleted`; the generated Group member record becomes `removed`. The
  leaderboard query sorts the group-member state `A`, `DQ`, `R` first and the
  normal score/FIFA ordering second; any generated vacant slot is `V` and
  follows `R`. Its existing `#` cell shows the normal number for `A`, and
  `DQ`, `R` or `V` for terminal/vacant rows; it is not a new column or a
  UI-side re-sort. Any retained historical score identity remains
  auditable and cannot become a live participant again by a read or poll.
- Remove is a membership exit, not DQ and not an event-level Block state. The
  remaining room membership and every unrelated resource owner/type are
  unchanged in place and after reload.
- Nova receives exactly one self-removal notification. Casey receives none as
  the action actor. Riley receives exactly one event-participant notification
  even though Riley is in Group B: membership-change notifications belong to
  the parent event and go to every remaining accepted non-actor participant.
  Riley's Group B membership, room chat and counters remain unchanged, so this
  checkpoint proves cross-room delivery together with group-state isolation.
  The parent Event channel is shared by Casey and Riley and receives exactly
  one removal message. Only the affected Group A channel receives the matching
  tournament-group removal message; Group B must retain zero messages, zero
  unread delta and an empty last-message summary.

Execution evidence on 2026-08-30 (PASS / CLOSED):

- From the clean already-started baseline, Casey removed Nova exactly once.
  The UI retained parent status Active and Qualifiers `A`, removed Nova from
  active Members and Group A access, kept Riley active in unchanged Group B,
  and rendered Group A Standings as active Casey, `R / Nova Social / 7`, then
  `V / -----`. The retained row never exposed Nova's database ID.
- The parent event channel rendered `Nova Social was removed from the event.`;
  it did not misclassify the admin action as a voluntary `left` transition.
  Group A rendered exactly one `Nova Social was removed from the tournament
  group.` system message. Riley's unrelated Group B retained no message, no
  unread delta and no last-message change.
  Nova saw the exact self-removal notification, Riley saw the exact parent-
  event participant notification despite belonging to Group B, and Casey saw
  none as actor.
- The independent persisted oracle passed: parent Nova=`deleted`, Group A
  Nova=`removed`, Nova absent from every room-chat owner/member projection,
  score identity/value `Nova/7` unchanged, exactly two outbox intents and two
  inbox rows with roles `removed-member` and `event-participant`, Casey absent
  from all recipients, Nova event counters `1/1 -> 0/0`, and Casey/Riley event
  counters unchanged. The widened oracle also proved one canonical parent
  Event message, one canonical affected-Group-A message, and byte-for-byte
  message/unread isolation for Group B. The fixture was reset; do not repeat this case
  unless removal, standings identity/order, chat wording, participant fan-out
  or write-side event counters change.

### `TOURNAMENT-MEMBER-003` — four-person removal recipient fan-out

- Stage one isolated active Tournament with a single four-person Qualifiers
  group: Casey, Nova, Riley and Lina. Casey removes one scored non-host member
  once from the parent; the verifier derives the actual target from the paired
  parent=`deleted` and generated-room=`removed` writes,
  this is deliberately separate from the `TOURNAMENT-MEMBER-002` 2+1 control.
- The persisted parent membership becomes `deleted`, while the target's
  Group A membership becomes `removed`. Group A Standings retains the exact
  score identity, sorts all active rows first, then the target as `R`, and
  finally `V` / `-----` in the existing `#`
  column. The component does not
  sort or reconstruct the name; server and frontend-local repositories read
  the stored group membership state.
- Recipient pass boundary: the removed member receives exactly one self-removal
  notification; both other non-actor participants each receive exactly one
  event-participant notification naming the target; Casey receives none because
  Casey performed the action. Recipient
  selection comes from accepted parent-event membership, not generated-room
  membership; `TOURNAMENT-MEMBER-002` independently proves that this delivery
  crosses group boundaries without mutating the other group.
- Run `verify-tournament-member-notification event-domain
  TOURNAMENT-MEMBER-003` immediately after the one visible Remove action. It
  proves parent/group state, immutable four-row score history, chat revocation,
  exact outbox/inbox recipient sets and actor exclusion before visual closure.
- Fixture boundary: a real started Tournament may already have a materialized
  parent event channel with earlier lifecycle messages. This isolated fixture
  does not own that channel-creation/history contract and may materialize the
  parent channel at Remove time. Do not classify that as a failure here. This
  row owns only the target's room-chat revocation, the new removal effects, exact
  recipient fan-out and leaderboard persistence; initial event-channel history
  remains in the Tournament/Chat lifecycle coverage.
- Fixture counter boundary: Casey is the parent owner, so staging must write
  the event into `My Events` through `activities.hosting` and
  `activities.event.hosting`, while Nova/Riley/Lina use participant
  `Events/Active Events` counters. Do not stage Casey through the participant
  counter path merely to make all four setup calls uniform.

Execution evidence on 2026-08-30 (PASS / CLOSED):

- Casey removed Lina from the clean four-person room. Standings retained Lina
  as `R / Lina Park / 5`; Riley, Nova and Casey stayed active and the four
  stored score identities/values remained unchanged.
- Lina received the self-removal notification. Nova and Riley each received
  the participant notification naming Lina; Casey was excluded as actor.
- The parent Event channel contained exactly one `Lina Park was removed from
  the event.` message and Group A exactly one `Lina Park was removed from the
  tournament group.` message. Both channels retained only Casey, Nova and
  Riley; Lina lost both projections. Lina's event counters decreased once and
  all remaining event counters stayed unchanged. The fixture was reset.

### `TOURNAMENT-DQ-001` — disqualification and reinstatement

- Disqualify one already-scored accepted participant without deleting its
  event membership. Members and standings must show a distinct DQ state; the
  score/history stays visible, the row sorts behind eligible participants and
  the DQ identity cannot advance.
- Run the review boundary once and verify eligible next-stage membership plus
  the same short system outcome style already proven by Tournament
  advancement. DQ does not create a Block state or silently perform Remove.
- In a separately reset pre-Finalize branch, Reinstate the same identity and
  prove eligibility returns without a duplicate membership or score row.
  Finalize/review replay must be exact-once in both branches.
- Treat the DQ/Reinstate Event and Group system messages as chat activity, not
  new Impression evidence. On Riley's unchanged participant control, the
  ordinary realtime poll may expose the profile-derived Attendee presentation,
  but the server poll must not add an Impressions red counter merely because
  that projection first became available: the change flag is owned by an
  actual persisted `Users.impressions` write, not by a projected payload diff.
  Opening the popup must show
  unchanged empty metrics and `0 signals`; the controlled event must still
  have zero feedback states, feedback answers and affinity recompute tasks,
  while Riley's stored Impressions and event-feedback counters remain exactly
  at baseline. A later evidence-backed Event Feedback change remains owned by
  `EVENT-IMPRESSION-001` and must still produce its normal change signal.

Partial execution evidence (2026-08-30): the controlled four-person DQ branch
is persisted at `dq-verified`. Casey disqualified scored Nova once; the oracle
proved one retained parent and room membership row with `disqualified` status,
the unchanged score row, exact Event and Group system-chat delivery, and the
affected-member plus remaining-participant notification fan-out. Riley's
ordinary realtime poll did not show an Impressions red counter. Its persisted
`Users.impressions` stayed `null`, all four event-feedback counters stayed at
zero, and the controlled event retained zero feedback states, feedback answers
and affinity-recompute tasks. The first verifier run exposed only a harness
false negative: a Mongo-returned checkpoint subdocument and the fresh evidence
object had identical values but different JSON key order. The DQ harness now
compares stored Impressions semantically and every numeric evidence field
explicitly; the unchanged persisted state then passed without replaying the UI
action.

Reinstate continuation evidence (2026-08-30): Casey reinstated Nova once and
the persisted oracle advanced to `reinstate-verified` with one completed cycle.
Nova has exactly one accepted parent membership and one accepted room
membership; all four original score rows remain unchanged. The Event and Group
channels each contain exactly the DQ message followed by one Reinstate message,
and every chat copy has the Reinstate message as its latest entry. Nova received
the affected-member notification while Riley and Lina received the participant
notification, exactly once for Reinstate. Riley again showed no Impressions red
counter; stored Impressions remained `null`, all event-feedback counters
remained zero and the fixture still has zero feedback states, answers and
affinity-recompute tasks.

Review/finalize closure evidence (2026-08-30): after a named reset, the
separate pre-Finalize fixture retained Nova as the highest-score row (`DQ 10`)
behind active Riley `9`, Lina `5` and Casey `1`. Casey finalized Qualifiers
once; the direct-write oracle recorded stage and runtime `F / stage-finalized`,
result revision `1`, no premature Final membership and one Finalize intent for
Riley+Lina only. The first real `event-tournament-review` pass recorded count
`2`, explicitly representing one Final group-membership write plus one outcome
revision. Final membership and its score-plan marker contain exactly Riley and
Lina; Nova is excluded despite its leading score and Casey is the active
non-advancer. Notification intents are exactly Riley+Lina finalized,
Riley+Lina advanced and Casey not advanced, with no Nova outcome. A second
unchanged real-worker pass recorded count `0`; the complete domain and
notification snapshot remained identical. The final browser comparison was
accepted. No red Groups counter is expected merely because one group exists:
the established counter is `groupsPending`, while the group accordion itself
shows the materialized group and members. No Impression badge appeared and all
write-side Impression/feedback evidence stayed unchanged. `TOURNAMENT-DQ-001`
is **PASS / CLOSED**.

### `TOURNAMENT-RESOURCE-001` — generated-group resource aggregation

- From one already materialized Tournament group, assign controlled Transport,
  Accommodation and Supplies using the existing Event Resource flows. Keep
  generic asset ownership and borrow eligibility pre-staged; those contracts
  remain in the Asset domain.
- Verify exact `ownerId`, `subEventId`, generated `groupId`, asset-owner and
  per-type settings/contributions. Persisted group-runtime metrics must agree
  with the group three-dot badge, Groups counter, stage/View Event navigation
  and root event action badge.
- The exact delta must appear in place and survive reload. No generated room
  card may leak into the root Activities list, and no asset action may change
  an event role or create another membership.
- Resource badges are per viewer and per type. Immediately after the three
  assignments, each write-side metric is `1` for the created Transport,
  Accommodation or Supplies item. This fixture does not pre-seed Explore
  borrow requests: a later join/invite/request would be another independent
  pending write. Casey therefore sees Accommodation `1` plus Supplies `1`,
  Nova sees Transport `1` plus Supplies `1`, and Riley sees Transport `1` plus
  Accommodation `1`; each assignment actor has already read the type they
  wrote. After each participant reads every remaining unread type,
  those exact receipts must persist across reload without changing the raw
  Transport/Accommodation pending totals or any assignment.
- **PASS/CLOSED — 2026-08-30**: Casey assigned `Casey Group Shuttle`, Nova
  assigned `Nova Group Lodge` and Riley assigned `Riley Group Supplies` to the
  same generated Group A. All three viewers subsequently saw all three cards;
  the editable state remained owner-scoped. The independent oracle proved
  exactly three owner writes, exact Group A/runtime/type metrics, root activity
  `3`, stage `groupsPending=3`, no generated root-room leak, unchanged event and
  room roles, unchanged user counters and zero undocumented notifications.
  Every viewer's per-type read receipt then persisted across reload while the
  raw write-side pending metrics remained unchanged.
- Assigned-resource Join/Invite and Resource Explore are separate pending-write
  boundaries and were not appended to this closed aggregation transaction.
  They are routed into the existing Asset membership and borrow checkpoints:
  at least one replay must originate from this generated-group resource
  surface and assert the exact event, stage/sub-event and group runtime owner
  scope plus an unchanged other-group control. No additional Tournament row is
  needed for the same generic Asset lifecycle.

### `JOB-TOURNAMENT` — real tournament review scheduler

- **CORE PASS/CLOSED — 2026-08-30**: the real
  `event-tournament-review` scheduler was already exercised through two
  retained Tournament branches. The deterministic advancement replay produced
  the exact next-stage membership and score-plan write with `lastRunCount=1`,
  followed by a byte-identical unchanged replay with `lastRunCount=0`. The
  later DQ branch independently produced the exact eligible Final membership
  and notification outcomes, then another unchanged `count=0` replay. Browser
  evidence matched the persisted stage, leaderboard and advancement state.
- The only former remainder was the generic Monitoring/Job Detail screen.
  It is now an assertion inside the Administration journey
  `ADMIN-MONITORING-001`; it must not keep the already-proven Tournament Core
  row partial or trigger another lifecycle replay.

## Asset cases

### `ASSET-LIFE-001` — shared type schemas and lifecycle

- Create one Transport, one Accommodation and one Supplies asset with their
  type-specific required fields and managed media. Edit one shared field on the
  Transport, then delete it through the normal UI.
- Verify exact IDs, type fields, immediate Create/Delete counters and reload
  persistence. The deleted backend record may remain internally retained but
  Asset Trash/Restore is not a product UI contract. Accommodation and Supplies
  remain unchanged controls. This is one bounded shared-form lifecycle, not
  three duplicate end-to-end afternoons.
- Executed **PASS / CLOSED** on 2026-09-03. Casey completed the normal
  Create/Edit/Delete UI journey and reported no remaining material Asset UI
  issue after one reload. The square shared image was maximally contained in
  both the editor carousel and the owned-Asset list card without cropping or
  stretching. Create and Delete reconciled the Asset selector and side-menu
  counters in place; no Asset list polling was added.
- The terminal persisted oracle retained three distinct target identities:
  Transport `asset-1788401138449` was `T` with Subtitle
  `Edited shared-field value`, Sedan `4/2`, no Location and its managed
  `large.webp`; Accommodation `asset-1788401224102` remained active with the
  initial Subtitle, Apartment `6/3`, identical `city/routes=Austin` and its own
  managed `large.webp`; Supplies `asset-1788401283920` remained active with
  the initial Subtitle, Safety `12/8`, no Location and no optional duplicate
  image upload. The shared media path was already proven on Transport and
  Accommodation.
- Final authoritative and stored legacy/nested counts matched exactly:
  Transport `0/0/0`, Accommodation `2/2/2`, Supplies `1/1/1`; internal retained
  Delete count was `1`. The second active Accommodation was the explicitly
  out-of-scope test record `asset-1788401751580` / `ddd`; it was neither
  attributed to this checkpoint nor removed. The versioned reset preserves
  such external records and recomputes retained counters after deleting only
  the three QA-title targets.
- During the run, the shared compact carousel and owned-Asset InfoCard media
  paths were corrected to `contain`, and successful owned-Asset Create/Delete
  now publish an absolute type count through `ActivityStore` to both legacy
  and nested counter shapes. The existing frontend watcher compiled and synced
  the final bundle successfully; no duplicate build/test process was started.
- The originally drafted Asset Trash/Restore and replacement-Create steps were
  removed: neither is a current user-facing Asset contract, and repeating
  Create after terminal Delete would add no independent coverage.

### `ASSET-VIS-001` — discovery visibility

- Stage one Public, Friends only and Invitation only asset and compare the
  exact Explore and owned/managed ID sets as owner, friend and unrelated user.
- In Explore, verify the existing Transport category filter against the exact
  target set and verify each owner avatar uses the owner's profile image and
  opens the same profile/impressions surface as Event Explore.
- After the read-only baseline, change only the Public control to Invitation
  only through Casey's normal Asset editor, then reload all three clients. The
  owner set remains stable, Lina falls back to the Friends-only control, and
  Liam sees no target Asset.
- Direct denied detail reads must expose no hidden Asset data before or after
  the Edit. List/detail/filter reads stay side-effect free; the single Save may
  create only its normal collapsed Asset affinity task. Borrow, membership and
  assignment writes remain outside this checkpoint.
- Executed **PASS / CLOSED** on 2026-09-03. The user exercised the three-role
  discovery journey with representative rather than mechanically repeated card
  openings, independently confirmed the Sedan/Van/All Transport category
  filter, and confirmed that the final Asset Explore owner avatar showed
  Casey's real profile image instead of `CB`. That interactive avatar uses the
  same existing profile/impressions store path as Event Explore.
- The authenticated baseline matrix returned Public plus Friends to Lina,
  Public only to Liam and no owned controls through Casey's Explore; every
  forbidden direct detail read was denied. Casey then changed only
  `QA ASSET-VIS-001 Public Transport` from Public to Invitation only. After the
  reload boundary, the authenticated terminal matrix returned Friends only to
  Lina and no controlled Asset to Liam, while Casey retained all three owned
  controls and no owned control leaked into Casey's Explore.
- The terminal Mongo oracle at `2026-09-03T03:20:18.902Z` proved that the
  single Save changed only the target Asset domain plus one collapsed
  `ASSET_CHANGED` affinity task, which completed without error. The edited
  Asset retained every stable field except Visibility and update audit; both
  sibling Assets were byte-identical. Authoritative and stored Transport
  counts remained `3/3/3`, and no target borrow request, Asset membership,
  assignment, outbox item or notification was created.
- The run exposed and corrected a fixture-schema defect rather than accepting
  it as product normalization: directly inserted control Assets had omitted
  the normal Asset `_class`, empty `imageUrl` and disabled default `pricing`
  object. The versioned fixture now stages the real persisted schema, and the
  in-flight baseline was repaired under a guarded schema-version migration
  before the strict edit oracle was rerun. The oracle was not weakened.
- During the checkpoint, hidden Asset detail authorization was aligned with
  discovery visibility, local/server viewer identity propagation was aligned,
  and Asset Explore owner resolution was routed through the existing public
  contact profile plus `UserProfileStore`/impressions flow. The existing
  backend and frontend watchers compiled the fixes successfully; no duplicate
  build or test process was started.

### `ASSET-MEMBER-001` — asset invite and pending linkage

Status: **PASS / CLOSED (2026-09-03)** together with
`ASSET-MEMBER-002` as the single `ASSET-MEMBER-LIFECYCLE-001` matrix journey.

- From one asset already assigned through a generated Tournament-group
  resource surface, create one manager Invite and one participant Join request.
- Verify the two pending rows keep distinct request kinds and are linked to the
  exact asset owner/type/id plus event, stage/sub-event and generated-group
  booking scope. The other generated group and the parent event membership
  remain unchanged.
- Without reload, verify the owner's Invite delta reaches the target Asset card,
  Group action, stage selector and parent Activity/Event card exactly once.
  Reload the owner and prove the same pending chain is reconstructed from the
  persisted resource runtime instead of being cleared by the Invite write.
  The red chain and the Asset card badge are both projections of the unresolved
  request total: opening or closing the exact Transport branch must not consume
  either, and only request resolution may reduce them.
- Verify the invitee sees the assigned target Asset card itself exactly once,
  not only parent counters. Verify recipient/requester projections name the
  same asset and actor once.
- The Invite must create exactly one Asset invitation notification for its
  recipient. The Join request must create exactly one Asset join-request
  notification for the owner/responsible managers, excluding the requester.
  Neither producer may duplicate its outbox or inbox occurrence.
- Before joining, the requester can open `Ask Organizer` and send one
  controlled message through the standard Asset Service chat. The same one
  owner-copy per participant and one canonical controlled message must survive
  reload without duplication. While the request is pending, the requester's
  own member-row action is labelled `Cancel join request`, not `Leave asset`.

### `ASSET-MEMBER-002` — accept/reject and role isolation

- Accept the group-scoped Invite, then have the Asset owner accept the
  independent Join request. The unresolved red Event/stage/Group/Asset chain
  drops `2 -> 1 -> 0`; it exists only for pending work and must not be retained
  or recreated for resolved membership changes.
- An accepted ordinary Asset Member has no member-card management menu and
  cannot leave/remove itself. The member contacts the owner through `Ask
  Organizer`; only the owner or an explicit Asset Manager/Admin can remove an
  accepted ordinary member. A still-pending requester may cancel only its own
  request.
- Explicitly promote the accepted invitee to Asset Manager, then prove the
  delegated role by having that new Manager promote the accepted requester.
  The promotion action disappears from a Manager card and is replaced for
  the granting Manager by `Revoke Manager`; a non-owner Manager cannot revoke a
  Manager appointed by somebody else and cannot remove any Manager, while the
  Asset owner can revoke or remove every non-owner Manager. Have the new Manager
  revoke the requester's Manager role back to plain Member, then have the owner
  remove that requester. The invite acceptance notifies the responsible owner;
  Join acceptance and later removal each notify the affected requester; each
  promotion and revocation notifies its target, and delegated role changes also
  notify the responsible owner. Each transition adds only its relevant
  Notifications unread delta; no resolved transition adds an Asset-card pending
  counter. Event `Admin` and Asset `Manager` remain separate scoped roles.
- In the independent reset branch where the invitee rejects instead of accepts
  the Invite, the request disappears, the unresolved pending chain decreases
  once, no Asset membership is created, and the Asset owner/responsible manager
  receives exactly one `asset-invitation-declined` notification naming the
  invitee and request. This is a Notifications unread event, not a retained red
  Event/stage/Group/Asset pending counter.
- The final Asset contains the owner plus the promoted invitee and no requester
  row. Asset Manager must not silently promote the user to Event Admin, change
  an existing Event membership role or affect another group.
- The retained flexible branch also covers owner handover. The current owner
  may leave the Asset once; that removes the former owner's Asset membership,
  leaves the Asset `Under review`, preserves pending counts, and notifies every
  other accepted participant exactly once that a new owner is required. Only
  an already accepted Asset Manager sees `Take over`; the first successful
  takeover atomically becomes the actual Asset owner, restores the previous
  active status and gains owner-level removal authority without changing any
  Event or Group role. The former owner is not banned: after the takeover they
  may submit a fresh Join request or accept a fresh Invite, return as a plain
  Member, and later receive a delegated Manager role. That later promotion is
  not a second takeover and must not grant owner/super-manager authority.
- `Participation` remains a role-independent, read-only involvement list. It
  is visible to every viewer only when the selected member has at least one
  involvement row; an empty list hides the item for Members and Managers alike.
- Flexible user-driven execution on `2026-09-03` exposed a frontend reconciliation
  defect after Casey removed the previously accepted Riley: Mongo and the
  resource-scope API both retained the target Transport at `1 / 4` with Nova's
  one pending Invite, but the open card could temporarily retain the earlier
  pending value while the Group Transport row became `0 / 0 - 0`. The resource
  popup now prefers its freshly queried scoped Asset over an older own-Asset
  copy and aggregates the authoritative metrics of every visible resource
  owner for every resource type. This prevents Riley's Join signal from
  recalculating Casey's visible Transport from Riley's empty own-assignment
  maps, and a pending delta can no longer synthesize an absent zero-capacity
  metric. The Asset Members callback also publishes the full backend member
  list through the existing absolute member-sync signal before scope hydration;
  after Casey rejects Riley, the card therefore changes from stale pending `2`
  to canonical pending `1` just as the Group row applies its `-1` delta.
  Read-only CDP observed Group A pending `1`, Transport `1 / 4` with red `1`,
  and Asset Members with Casey plus Nova and one pending request. The frontend
  watcher compiled and synced the changes; the focused resource builder,
  tournament group converter and activity runtime sync specs passed `26/26`.
  A subsequent manual close/reopen sequence found that the Join request's
  signed `+1` remained in the resource signal and a newly mounted Sub Events
  popup forwarded the same revision to the Activity Event card again, even
  though the subevent counter itself stayed unchanged. The signed delta remains
  part of the on-the-fly signal chain, but the store now permits its parent
  propagation exactly once per resource-metrics revision. The frontend watcher
  and focused store spec pass; the precise human close/reopen replay remains
  covered by the user's later repeated popup close/reopen observations.
- The same flexible run covered the distinct Invite and Join paths, pending
  red-counter propagation and resolution, Invite rejection, Invite/Join
  acceptance notifications, ordinary-member menus, owner and delegated
  Manager promotion/revocation authority, role/icon/menu refresh, member
  removal, Event-role isolation, Service chat/Ask Organizer continuity and
  owner Leave/Take Over behavior. The user explicitly accepted closure from
  the accumulated observations instead of repeating the complete deterministic
  46-step route in one order.
- A final focused real-route replay started from the versioned three-member
  checkpoint and proved the formerly failing owner-removal sequence as
  `3 / 0 · 4 -> 2 / 0 · 4 -> 2 / 0 · 4 -> 1 / 0 · 4` for Casey Leave, Nova
  Take Over and Nova removing Riley. HTTP responses were successful; the Asset
  write retained Nova's accepted scoped membership, and both the persisted
  `activityResources` snapshot and generated-group runtime ended at `1 / 0 ·
  4`. Fresh Nova and Riley scope reads returned that same value. The replay
  produced one owner-left notification for the two no-manager candidates, one
  takeover-completion notification for the remaining candidate and one
  removal notification for Riley. The existing backend watcher compiled and
  restarted successfully. A focused regression now preserves the successor
  owner's scoped row when a later member-list write omits the owner. The
  checkpoint fixture was reset and verified `not-staged` after evidence was
  recorded.
- A later final-member replay reopened the checkpoint. After Nova took over and
  removed Riley, Riley disappeared from the scoped Asset request list but his
  canonical Asset `activityMembers` row remained `accepted`. When Nova then
  left as the last visible member, the server incorrectly selected removed
  Riley as a successor, sent him an owner-handover notification and retained an
  empty `0 / 4` Transport assignment in both the resource popup and Group menu;
  reload preserved the mismatch. The write path now marks any stored scoped
  Asset member row `deleted` when that member is removed, so it cannot be a
  later Take Over candidate or notification recipient. The empty persisted
  resource scope is also forwarded through the existing resource-metrics
  signal as exact zero buckets, allowing both the card and parent Group row to
  disappear without reload. The running backend and frontend watchers built
  these corrections successfully. The versioned `3 / 0 · 4` owner-leave
  savepoint was restored at `2026-09-03T12:06:57.196Z`; the user then replayed
  Casey Leave, Nova Take Over, Nova removing Riley and Nova's final Leave as
  `3 -> 2 -> 2 -> 1 -> absent` and confirmed the resource disappeared through
  the live UI. The terminal read-only Mongo oracle proved Riley's canonical
  Asset member row is `deleted`, `activityResources` is `D` with no Asset
  assignment, the generated-group runtime resource map is empty, and no
  notification was created after Nova's final Leave. This closes the final
  member-removal regression without a read projection or a frontend-only hide.

### `ASSET-BORROW-001` — scoped borrow lifecycle

Status: **PASS / CLOSED — 2026-09-17 (user-accepted final-state variation)**.

The user explicitly accepted closure without switching Organizer only back on.
The reviewed final state remains accepted Manager with organizerOnly false:
two independent accepted one-item Paid requests, two captured HUF 6400 payments,
Paid participants two and Group A Transport accepted three/pending zero.
Earlier Organizer-only-on and participant transitions retain their recorded
checks; free branches and Group B are unchanged. This is manual acceptance
with the documented variation, not a claim that `verify-borrow-terminal` passed
its Organizer-only-on assertion. No application, fixture, harness assertion or
stable checklist was changed for this acceptance. Retain the live fixture and
evidence; no reset or replay is required for this closure.

Stable user guide:
[`ASSET-BORROW-001.md`](../checklists/asset/ASSET-BORROW-001.md).

After Pricing closure, its normal reset restored the pre-fixture baseline and
verified zero scoped artifacts. The existing Borrow stage and independent
status then passed all ten baseline checks: four Public Transport controls,
Lina's accepted Quantity-2 Group B reservation, exact Event/Stage/Group roles,
Nova's saved Barion Mastercard 4444, and no Group A checkout, payment or early
notification. The overlap range is September 17 09:32 to September 24 10:32;
non-overlap is September 25 10:32 to September 26 10:32, Europe/Bratislava.
The old September 8 preparation is superseded by this fresh baseline.

The user additionally reported that Payment history's Payment summary showed
only the generic started-days label. The shared payment basket now displays
the saved duration multiplier with the existing translated day/days unit;
amounts and stored snapshots are unchanged. The existing frontend watcher build
passed. The paid Borrow steps use September 18 10:32 to September 20 10:32,
HUF 3200/day and HUF 6400 total, so the user can compare **2 days** on Borrow,
Payment and Payment summary. This visual follow-up remains pending.
The saved-data oracle's former flat HUF 3200 expectation was corrected to the
existing daily-price contract; date comparisons for the accepted request now
use the UI's minute precision. No fixture-generation or product-pricing rule
was changed. User controls every checklist action after managed startup.

Its versioned stage/status commands are:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  stage asset-domain ASSET-BORROW-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status asset-domain ASSET-BORROW-001
```

The initial preparation above is historical. The user requested a fresh restart
at Block 4 after reviewing the mixed earlier attempts; the current preparation
and evidence are recorded below.

- **2026-09-17 step 12 and Blocks 1–3 review before reset:** all four Nova
  Cancel requests and their projections were `D`. No active Group A assignment
  or Group A runtime resource metric remained; Event activity and Stage
  groupsPending were zero. Fresh authenticated Casey and Nova HTTP reads each
  returned zero visible Group A resources and zero Cancel members. Lina's two
  independent accepted Quantity-1 requests in Group B remained. No checkout or
  payment existed. This verifies the persisted step-12 removal; it does not
  independently verify the browser's no-reload rendering. Block 1 retains the
  previously accepted main-Event observation and the pre-fix Organizer-only
  qualification. Block 2's control bookings remain consistent, but its date
  selection interactions cannot be reconstructed from storage. The four
  attempts prevent an exactly-once clean-run claim for Block 3. No repeat of
  Blocks 1–3 is required for the requested continuation.
  Evidence: `/tmp/asset-borrow-block4/step12-http.json`,
  `/tmp/asset-borrow-block4.QIP5RR/previous-run.json` (full scoped archive).
- **Block 4 restage at 2026-09-17 12:36 CEST:**
  [`restage-asset-borrow-block-4.sh`](../tools/restage-asset-borrow-block-4.sh)
  archived the previous run, performed the normal snapshot-backed reset and
  stage, and prepared `borrow-reject-ready` with `startBlock=4`. Independent
  status passed all ten baseline checks. Group A is empty, Cancel/Reject/Paid
  have no requests, and Group B has two accepted one-item controls. No earlier
  successful lifecycle or notification was fabricated. Casey/Nova/Riley
  windows were relaunched through the versioned launcher; the user starts
  **Block 4, step 13 as Riley**. Current local ranges: overlap September 17
  11:36–September 24 12:36; non-overlap September 25 12:36–September 26 12:36;
  paid September 18 12:36–September 20 12:36 (HUF 6400 for two days).
  Reset/stage/status evidence: `/tmp/asset-borrow-block4.QIP5RR/`.
  Subsequent oracles require Cancel to remain unused for this restart and
  count notifications from Block 4 onward. Paid notifications are checked by
  their paid branch and excluded from the retained free-branch totals.
  Ten in-memory checks of the harness guards passed, covering the new restart,
  stale Cancel data, missing Reject action, phase guards, free/paid notification
  separation and preservation of the full-run path. These are harness checks,
  not manual lifecycle evidence. Syntax and diff checks passed.
  No application code changed during this review/restage.

- **Block 4 Reject failure and fix — 2026-09-17 12:50 CEST:** Casey's
  `/assets/upsert` returned HTTP 200 with an empty body. Riley's single request
  remained pending. The service preserves removed requests as `D` audits before
  policy evaluation, but its update-policy branch omitted pending-to-deleted.
  Added that transition using the existing removal policy (Reject or Cancel
  permission); full Asset edit alone remains insufficient. No fixture or date
  validation change. Before the fix, three focused authorization cases failed;
  after the existing watcher build/restart, all 25 focused policy, cancellation,
  window and assignment regressions passed. The broader AssetsServiceTest could
  not compile because of existing assetReadService helper signature mismatches;
  it is not claimed as passing. Local adapter source review found no equivalent
  Java policy gate; local execution was not repeated.
  Fresh authenticated owner HTTP read returned the same pending Riley request
  ending `c0f142c6-9f63-41de-9d20-28ec5dc193e4`. Its user-selected range is the
  full Stage (September 17–October 17), valid for this rejection check; the
  later Capacity check still uses its documented overlap range. No reset,
  request submission or rejection was performed by Codex. User retries step 14
  on the existing confirmation. Evidence: `/tmp/borrow-reject-before.log`,
  `/tmp/borrow-reject-after.log`, `/tmp/borrow-reject-read-after.json`.

- **Block 4 PASS — 2026-09-17:** user reported the rejection working.
  `verify-borrow-reject` passed and saved `borrow-reject-verified`. Exactly one
  Riley Reject request and projection remain as deleted audits, with no active
  Group A resource or Group A runtime resource metric. Outbox contains exactly
  the original request notification to Casey and one rejection notification to
  Riley. Lina's two accepted Quantity-1 Group B controls, Event/Stage/Group
  memberships, unused Cancel/Paid controls and zero-payment state are unchanged.
  The selected full-Stage range is retained as rejection evidence; the next
  capacity branch uses the documented overlap range. No reset or browser action
  by Codex. Evidence: `/tmp/borrow-reject-verification.log` and
  `/tmp/borrow-reject-verified-state.json`. Continue Block 5, steps 17–21;
  next oracle is `verify-borrow-accepted`.

- **Block 5 PASS — 2026-09-17:** user reported the free-accept/capacity
  block working. `verify-borrow-accepted` passed and saved
  `borrow-accepted-verified`. Capacity retains three distinct accepted
  Quantity-1 requests: Nova Group A one, Lina Group B two, occupied quantity
  three. Nova's September 17 11:36–September 24 12:36 booking matches the
  overlap baseline at the UI's minute precision. Group A assignment/runtime
  accepted is one and pending zero; Group B remains accepted two/pending zero.
  Nova's assignment is scoped to Group A, with no Event/Stage/Group membership
  changes. Exactly one Capacity request notification to Casey and one acceptance
  notification to Nova exist; Reject remains deleted, Cancel/Paid unused, and
  no payment exists. Evidence: `/tmp/borrow-accepted-verification.log` and
  `/tmp/borrow-accepted-verified-state.json`. No reset or code change.
  Continue Block 6, steps 22–25; Casey must not approve Paid Transport yet.
  Next oracle: `verify-borrow-paid-pending-organizer`.

- **Block 6 PASS — 2026-09-17:** user reported the block working.
  The first oracle failed because its retained free-branch check incorrectly
  expected the aggregate Group A Transport metric to stay accepted 1/pending 0
  after a Paid request. The harness now checks the exact additional paid
  contribution for each phase: pending Organizer-only adds 0/1, accepted
  participant adds 1/0, terminal Organizer-only adds 0/0. Both resource and
  runtime totals remain strictly checked; nine in-memory guard cases passed,
  including incorrect/mismatched counts and preservation of the free branch.
  No application or fixture data changed. The corrected
  `verify-borrow-paid-pending-organizer` passed and saved
  `borrow-paid-pending-organizer-verified`: exactly one pending Quantity-1 Paid
  request/projection, one captured and fulfilled Barion HUF 6400 payment, one
  owner request notification, and Nova pending Manager with organizerOnly true.
  Free branches and Event/Stage/Group memberships remain unchanged.
  The actual user-selected paid range is September 17 11:36–September 18 12:36
  local, 25 hours and two billable started days, rather than the guide's exact
  48-hour range. Preserve this qualification and reuse the actual first-booking
  range for Block 8's overlap check. Payment-history visual confirmation is
  covered by the user's block report, not an independent browser inspection.
  Evidence: `/tmp/borrow-paid-pending-verification.log` (old harness failure),
  `/tmp/borrow-paid-pending-state.json`,
  `/tmp/borrow-paid-pending-verification-after.log` (PASS).
  Continue steps 26–27, then `verify-borrow-paid-accepted-participant`.

- **Block 7 steps 26–27 PASS — 2026-09-17:** user reported success;
  `verify-borrow-paid-accepted-participant` passed and saved
  `borrow-paid-accepted-participant-verified`. The existing one-item Paid request
  is accepted, Nova remains Manager and organizerOnly is false. The single
  captured HUF 6400 payment is unchanged. Shared Group A Transport is accepted
  two/pending zero; earlier free branches and Group B controls remain intact.
  Evidence: `/tmp/borrow-paid-accepted-verification.log` and
  `/tmp/borrow-paid-accepted-state.json`. Step 28 is next, then Block 8 using
  the actual first-request range September 17 11:36–September 18 12:36.
  No reset or manual checklist action by Codex.
- **Button-ring presentation follow-up:** user reported that resized loading
  outlines stretch away from the button curve. The shared Indicator component
  used rounded transformed getBoundingClientRect dimensions with a minimum of
  24px. It now uses fractional layout dimensions from ResizeObserver (computed
  layout size for initial measurement), ignores hidden zero-size measurements,
  and caps arc radius by both width and height. The existing frontend watcher
  built and synced successfully at 2026-09-17T11:15:40Z. Source/diff checks passed;
  no separate build or automated QA clicks. Actual visual confirmation remains
  pending after user refresh. Borrow state and backend behavior were unchanged.

- **Block 8 review after extra Organizer-only toggles — 2026-09-17:**
  the user reported experimenting with the toggle in both directions. Read-only
  review verifies two distinct accepted one-item Paid requests and projections,
  two independent captured/fulfilled HUF 6400 payments, and identical booking
  ranges (September 17 11:36–September 18 12:36). Nova remains accepted Manager
  and currently has organizerOnly false: Paid participants two, shared Group A
  Transport accepted three/pending zero, consistently in resource and runtime.
  The three free Asset controls, Group B resource and Event/Stage/Group member
  oracle entries are unchanged from the saved Block 5 snapshot. Exactly two
  Paid request notifications to Casey and two acceptance notifications to Nova
  exist; no extra notification/payment/request from the toggle experiments.
  Evidence: `/tmp/borrow-terminal-review.json` and
  `/tmp/borrow-terminal-review-result.json`. This is a consistent current-state
  review, not the strict terminal Organizer-only-on checkpoint. No application,
  fixture or acceptance-rule change. Only switch the existing Paid membership
  back to Organizer only, then run `verify-borrow-terminal`; do not repeat
  borrowing, payment or approval.

- This checkpoint owns the free cancel/reject/accept and overlap-capacity
  branches plus one narrow paid parity branch. Every free and paid Borrow form
  exposes read-only Quantity `1`; requesting another item means submitting a
  new independent request with its own ID, approval, assigned card and, for
  paid Borrow, its own payment. It does not replay checkout's 3DS, refund,
  Take Over, Leave or Remove lifecycle.
- Source Explore shows every Asset exactly once and never exposes Payment
  summary. Separate assigned request cards remain visible on the fly and after
  reload, use `#1`/`#2` for repeated same-Asset requests, show their date range
  and retain Payment summary only when paid.
- Block 1 read-only review on 2026-09-17 initially found a baseline mismatch. The versioned
  `status asset-domain ASSET-BORROW-001` check fails only
  `exactEventAndGeneratedGroupRoles`: Casey still has `organizerOnly: true`
  in the Event and Group A, saved before the menu fix. Event count is 3,
  Stage count is 4; Group A retains the reported 2-count/3-standings mismatch.
  No Group A Borrow request, basket or payment exists. No reset or repair was
  performed by this review. Block 2 now names both actors' exact entry paths.
  Subsequent user decision: **main Event check accepted**; do not repeat the
  removed Group `Organizer only` action. Continue at Block 2. The retained
  pre-fix flags remain an evidence qualification, not a newly verified clean
  baseline or a reason to replay Block 1.
- 2026-09-17 Group B fixture/badge correction: Lina's single quantity-2
  reservation was replaced by two independent quantity-1 requests/projections;
  the versioned fixture and its count assertions now generate the same model.
  Group A Borrow incorrectly saved the authorization Event ID as its booking
  owner. The writer now saves the exact Group owner; server group filters no
  longer include unrelated main-Event bookings. The existing Nova request was
  repaired to its persisted Group A assignment without resubmission; unrelated
  user state was retained. Backup/evidence: `/tmp/asset-borrow-badge-review/`.
  Cold HTTP responses and the actual frontend card mapper verify Group A one
  pending card and Group B two accepted cards with zero pending. Both existing
  watchers built successfully. Browser confirmation remains pending.
  User proceeds to Block 3 without replay. Retained Capacity request means the
  aggregate pending total changes 1 → 2 → 1 during Cancel; inspect the Cancel
  request's own lifecycle separately. This is a qualified run, not a clean
  baseline or a strict harness PASS.
- 2026-09-17 post-revert Borrow review: a clean worktree still contained the
  committed exact-Group booking change. Focused tests reproduced Group window
  lookup failure and empty Group/slot assignment persistence (3 failures;
  ordinary Event assignment and invalid-date rejection passed). The narrow
  backend correction keeps booking scope exact and resolves the runtime Event
  only for existing Stage date bounds. Last-pending cancellation removes only
  that borrower's assignment when no live request remains in the same scope.
  Eighteen focused JVM tests pass against watcher-built production classes:
  Event/Group/slot windows, invalid dates, assignment persistence, membership
  denial, cancellation, retained pending/accepted requests, other borrowers,
  other scopes, unrelated Assets, approval and accepted-manager leave guard.
  Existing backend watcher passed. No frontend edits or browser actions.
  The attempted broader existing resource-test compilation was blocked by four
  pre-existing OwnerMembersSnapshot constructor mismatches; that suite is not
  claimed as passing. Focused tests compile separately without rebuilding the
  running application or starting another Gradle/compiler watcher.
  The user's Cancel request ending e2bd5a34-53bd-464a-90a9-f51d265c86e8 had
  persisted before assignment failed. Its empty resource was backed up and
  restored via the normal resource write; no new Borrow request was created.
  Fresh HTTP reads prove Group A one pending and Group B two accepted requests;
  persisted Event/Stage pending is 1. Evidence: `/tmp/borrow-review-before.log`,
  `/tmp/borrow-review-after.log`, `/tmp/asset-borrow-badge-review/`.
  User continues with the existing request after closing the failed dialog and
  reloading once. Its full-Stage September 17–October 17 range and deleted prior
  requests remain qualifications; do not mark Block 3 or the full flow PASS.
- `Organizer only` is exact-scope fine tuning on Event, Sub-event/Stage, Group
  and Asset memberships, including pending or accepted Asset requests. It
  changes only that scope's counted-participant state and live counter. It does
  not cascade, alter the role, delete/reassign a member or block an already
  materialized tournament participant from later-stage progression. The
  reverse menu action is `Count as participant`. User clarification on
  2026-09-17: after a tournament Stage starts, both participation toggles are
  hidden for that Stage and its Groups, and the write path rejects the toggle.
  Withdrawal uses `Leave group` so tournament participation is updated through
  its lifecycle. This restriction does not affect the main Event's own toggle
  or scoped Asset memberships.
- The accepted borrower becomes the scoped Manager represented by
  `addedByUserId` only for the exact generated-group resource assignment. This
  does not change their global Asset ownership, Event role or sibling group.
  Six guarded commands verify cancel, reject, free acceptance, paid pending
  Organizer-only, paid accepted participant and terminal two-request state.

### `ASSET-CHECKOUT-001` — Asset Explore Barion payment reaches the scoped borrow destination

Status: **PASS / CLOSED**.

Stable user guide:
[`ASSET-CHECKOUT-001.md`](../checklists/asset/ASSET-CHECKOUT-001.md).

The versioned fixture was restaged at `2026-09-07T02:24:00.578Z` after the
dev-stack restart left only its stale state marker while every scoped fixture
record was absent. All saved collection snapshots were empty and the current
Casey/Nova/Riley reset-owned fields exactly matched their saved values, so the
versioned reset restored zero artifacts. The normal stage and its second
read-only `status` then reached `phase=baseline-ready`. The persisted baseline is
exact: connected Barion with 3DS Off; Casey Admin plus Nova Member on the one
Event; the target paid Asset at quantity `3`; all five named controls; and zero
scoped payment, request projection, activity resource, server basket or stored
Asset membership. `EVENT-CHECKOUT-001` was first restored through its own
snapshot-protected reset with zero remaining scoped artifacts. No Asset
checkout checklist action was operated by Codex.

The first configured browser launch at `2026-09-07 04:39 CEST` stopped before
handoff when Nova's tracked login returned `BLOCKED_LIMIT`; the pre-existing
Casey/Nova/Ava active-session counts were `1/2/2`. The versioned fixture now
owns a `prepare-browser` boundary that preserves the first pre-QA
`userSessionStates` documents, clears only those three configured actors, and
restores the preserved documents on reset. Its first live run cleared the
counts to `0/0/0`, after which the versioned launcher prepared all three
isolated identities successfully at `2026-09-07 04:44 CEST`. The user then
reached the first confirmed payment-review boundary and reported one concrete
mismatch: the target card menu remained green `Borrow` instead of changing to
orange `Continue borrow`. That attempt is repair evidence, not accepted
checkpoint evidence, and was replayed from the exact baseline after repair.

Diagnosis against the completed Event checkout reference found the underlying
contract mismatch. The pre-Pay Asset draft changed only an in-memory signal
plus namespaced local storage; it never saved the common checkout repository,
and the card menu projected only its static `Borrow` action. The deployed
repair now makes initial `Confirm borrow` and changed `Update borrow` save the
shared checkout repository before changing UI state. That repository is
IndexedDB in local mode and the backend `eventCheckoutBasketItems` repository
through HTTP. Only a successful save sets the local confirmed selection
baseline and immediately projects orange `Continue borrow` in both the target
card menu and Borrow Basket. Back/review uses the Event palettes and labels:
unchanged is green `Continue borrow`, changed is orange `Update borrow`, and
the initial action remains blue `Confirm borrow`. Review has a red `Cancel`;
payment has neutral `Back`, red `Cancel` and the primary payment action. Online providers use `Pay`;
the no-provider variant uses `Confirm cash payment`. Successful Asset
fulfillment closes the basket reservation as `succeeded`, while provider
decline/timeout retains an isolated `failed` checkout audit without creating a
borrow request or inventory change. Event and Asset basket writers use the
same 10-minute expiry contract; the previous 20-minute frontend/backend
fallbacks were invalid and are now corrected. Asset Explore also receives a
batch `checkoutResultStates` projection from the common backend basket
repository. On the next successful page load it removes a matching local draft
when the server basket is absent or succeeded, and after the 10-minute boundary
when an expiry is represented by a deleted audit, so a local-only ghost
`Continue borrow` cannot survive. The equivalent local-data path reads the
shared IndexedDB basket repository. The running frontend and backend watchers
compiled and deployed these changes successfully.

During the completed user-controlled run, the menu, Borrow Basket, Back,
Continue and Update states behaved as required through the pre-Pay boundary.
The later one-unit simplification supersedes the run's former editable-quantity
subcase: current free and paid Borrow forms expose read-only Quantity `1`, and
Back/Continue cannot create a quantity revision. The guarded
`capture-revised-payment-ready` oracle now requires one unchanged Quantity-`1`
basket generation with a 10-minute creation-to-expiry delta and zero
payment/session, borrow request, inventory delta, resource assignment or
stored Asset role.

The sole remaining visual observation was raw `asset.borrow.continue` text in
the otherwise-correct orange menu and corresponding payment surface. Root
cause was the HTTP-mode backend bundle: the new EN/HU JSON keys had not been
regenerated into the Mongo seeds and the version remained `.77`. The generated
seeds and live demo bundle now use `2026.09.07.en.78` and
`2026.09.07.hu.78`; direct no-store HTTP reads return localized Continue,
Update, Review, Continuing and Updating labels in both languages. The i18n
source/seed audit passed for 2 bundles, 6470 messages and all 3 seed databases,
and the existing frontend watcher rebuilt and synced successfully. Per the
user's explicit verdict this cosmetic repair does not require another manual
label-only replay.

The Borrow editor's own lazy Asset-detail response now also returns the
authoritative parent Event/Sub-event start and end. The date control and
forward action remain fail-closed until that response arrives, and both the
minute-precision UI and backend request guard reject ranges outside the parent
window. Parent timestamps can contain sub-minute fixture precision, so both
guards compare the displayed minute rather than falsely rejecting it because
of hidden milliseconds. Persisted borrow bookings are sent as absolute ISO
instants. The initial disabled-button report was traced to the already-open tab
still running the preceding frontend bundle after the watcher had synced the
corrected build.

The first step-31 Pay attempt reached Nova's provider-owned waiting surface,
but Ava's nested Barion confirmation showed `localhost refused to connect`.
Read-only frame inspection and a direct HTTP response proved that the simulator
served the valid challenge with `X-Frame-Options: DENY` and
`frame-ancestors 'none'`: its trusted embedded-UI list omitted the Stripe and
Barion bank-auth result surface. Those two UI route families now use the same
local-frame policy as the temporary-access authorization surface; non-UI
simulator endpoints retain default frame denial. The failed Pay attempt is not
accepted evidence.

The replacement attempt proved a second boundary defect in the nested simulator flow.
Approval itself completed and the backend produced exactly one authorized
Barion payment, one succeeded client fulfillment, one pending borrow request,
one quantity reservation and one scoped resource projection, but the nested
dialog rendered `This content is blocked` after approval. The first diagnosis
incorrectly attributed that page to the POST route's default frame header.
Code-path diagnosis proved that the POST had completed and then redirected the
simulator-owned inner iframe to MyScoutee's payment return URL; MyScoutee
correctly refuses to render there as a nested document. Stripe and Barion
approve/decline now redirect that small frame to a simulator-owned terminal
result page, which reports the outcome and auto-closes through the outer
simulator. The action POSTs and unrelated non-UI routes remain denied as
frames. The complete simulator owning-package suite passed, the one service
was serially replaced, and live headers prove embedded UI allowed plus non-UI
default denial. Because the visual completion contract failed, the otherwise-
successful payment was not accepted as QA evidence. The guarded rollback
restored `revised-payment-ready` with one fresh confirmed basket from
`2026-09-07T04:59:31.870Z` through `2026-09-07T05:09:31.870Z` and zero scoped
payment/request/inventory/resource side effects.

The same repair pass closed two payment-lifecycle gaps before replay. A basket
is now changed to non-purgeable `pay/pending` before external authorization,
so a three-minute customer-action window may cross the original 10-minute
basket deadline without losing its reservation. Once authorization returns a
session, Asset Explore also saves that identity immediately through its live
dialog signal and scoped browser-local draft. After materialization it
publishes the exact pending-resource signal delta; the Borrow Stage and main
Event red counters therefore update immediately instead of appearing only
after reload.

The next user-controlled approval completed the payment itself and clarified
the two distinct counters. While Nova is still awaiting Casey's decision, the
target Transport card must show accepted occupancy `0/3` plus a separate red
pending counter `1`; only Casey's later Approve changes that accepted occupancy
to `1/3` and removes the red counter. The successful authorized payment also
reached the write model, but the finance total reader did not yet include the
authorized state. The resource completion path now patches the visible card
from the returned scoped resource state before publishing its parent deltas,
and authorized payments contribute to the persisted finance totals. Focused
regressions cover both paths.

The owner destination is now complete as well. Materializing the paid pending
borrow enqueues exactly one `asset-admin-join-request` for Casey with the Asset,
Event, Sub-event, request and Nova identities. Casey's user write model stores
the pending non-manual Asset-request counts separately for Transport,
Accommodation and Supplies. The side-menu realtime poll carries those stored
values before the Asset popup opens; the frontend local user repository mirrors
them, while approve/reject publishes the immediate signed delta. The Assets
toolbar shows the rose `Pending` counter toggle immediately before `+` for all
three categories. The Asset list read derives per-card metrics from the Asset
documents already loaded and no longer performs a separate `AssetRequest`
projection query. The checkpoint oracle now requires Casey's `1/0/0` stored
pending counters and exact notification at paid-pending, then `0/0/0` after
approval.

The scoped membership contract is also explicit. Casey remains the lender and
is omitted from the borrowed Asset's scoped Members list. Nova is its only
pending Member before approval. Approve makes that same Nova row an accepted
scoped `Manager` immediately because the resource assignment already names Nova
as `addedByUserId`; it does not create a global Asset-manager role. Therefore
the accepted Borrow row and scoped Members card expose neither Promote/Revoke
Manager actions. Nova's own scoped Members card keeps its three-dot menu for
the self-service `Leave` action, while the borrowed resource card separately
exposes `Remove` for deleting only that runtime association. The unrelated
generic Asset-manager feature remains available outside this scoped Borrow
surface.

The user-controlled run subsequently completed steps 31-56. The accepted
oracle proves exactly one authorized Barion payment, the same paid request now
accepted once, one accepted scoped resource contribution, Nova as the scoped
Manager without a stored global Asset role, selected-range availability `2`,
physical quantity `3`, non-overlapping availability `3`, and Casey's stored
Asset pending counters returned to `0/0/0`. A disclosed Free-Asset request and
temporary Nova service chats were created after the intended boundary while
diagnosing the UI. The versioned `repair-step-56-boundary` command removed only
those probe artifacts, restored the Free control from its exact staged
fingerprint, restored its resource/counter effects and then required the full
accepted oracle before capture. `rollback-accepted` was executed immediately
after capture and restored the same oracle successfully. This was the retained
historical boundary before the already-completed terminal branches.

The user-controlled run then completed steps 57-68 and the final core oracle
passed. The Free request, zero-quantity unavailable control, isolated Adjacent
Cancel, Barion decline and Barion timeout branches left the accepted target,
its physical quantity `3`, dated availability `2`, sibling scope and Riley
control unchanged. The exact accepted savepoint was restored and the isolated
two-borrower Take Over extension was prepared without replaying the core flow.

Nova's manager `Leave` initially failed because the service-owned settlement
write to Riley's already-accepted request was incorrectly evaluated as an
ordinary user edit. The repaired transition authorizes Nova's own cancellation,
stores Riley's predecessor amount and leaves the runtime assignment in place.
The `manager-left` oracle now passes: Nova is deleted from the scoped borrow,
Riley is the sole accepted borrower, Nova's HUF 3,200 authorization is not yet
refunded, selected-window availability is `2`, and exactly one Take Over-required
notification targets Riley. Its compact replacement copy puts `Take Over` in
the bold title. The Riley menu repair resolves runtime manager settings by the
exact assigned Asset ID when the physical Asset owner and runtime contributor
are different. This intermediate boundary was subsequently completed.

The first Riley Take Over review exposed an inconsistent submit gate. The
shared policy input intentionally renders acknowledgement checkboxes only for
optional policies; required policies are implicit and do not add a checkbox.
Normal Borrow already followed that rule, but Take Over incorrectly waited for
an impossible required-policy checkbox and kept `Continue to payment`
disabled. Local and HTTP Take Over now follow the same rule while still carrying
any explicitly selected optional policy IDs through the replacement action.
The canonical fixture stores the nested Spring record identity as `_id`. The guarded
`repair-manager-left-required-policy` command normalized the retained paid
Asset to `qa-borrow-policy`, kept Riley's optional-policy acceptance list empty
and recaptured the exact `manager-left` savepoint. Reload Riley once, then
resume step 74 without replaying Nova's Leave.

The user-controlled journey is complete through step 98 and all guarded core,
request-destination, acceptance, manager-left, paid Take Over, refund,
last-Leave and mixed-status Remove oracles passed. The terminal mixed-status
Remove retired Nova's accepted and Riley's pending requests/projections,
removed the runtime metrics, preserved Casey's global Asset and all payment
histories, restored availability to `3`, and created neither an automatic
refund nor a Take Over notification. The scoped Members repair also prevents
fabricating Casey as Manager after the runtime assignment is gone. Required
policies remain implicit/read-only in Borrow/Join/Take Over; optional policies
remain selectable. `ASSET-CHECKOUT-001` is PASS/CLOSED and is not the active
fixture. Its saved replay commands remain maintenance-only; do not invoke them
while the staged `ASSET-BORROW-001` transaction is active.

This row owns the paid browser flow and its state-dependent actions. The
generic `ASSET-BORROW-001` branches continue to own independent free/request,
reject and post-request owner/borrower cancel decisions; they must not replay
this row's pre-payment basket Cancel or successful Barion payment.

- Stage one Public paid Transport owned by Casey and discoverable by Nova
  through Resource/Asset Explore under one exact Event/Sub-event runtime. Give
  it quantity `3`, one required lending policy and a deterministic price for
  quantity `1`. Nova starts with no request, payment/session, borrow draft,
  assignment, availability reservation, Asset activity contribution or role
  change.
- Stage one free Asset, one zero-availability control, one adjacent paid Asset
  and two isolated paid terminal controls named `Decline Control` and
  `Timeout Control`. A sibling Event/Sub-event using the same type and Riley's
  state are immutable scope controls.
- The state-dependent action contract is:

  | State | Required visible actions/status | Forbidden action |
  | --- | --- | --- |
  | Fresh paid Asset with availability | `Borrow`; review red `Cancel` and blue `Confirm borrow` | `Payment summary`, `Pay` before review |
  | Confirmed unchanged review | green `Continue borrow`; card menu and Borrow Basket orange `Continue borrow` | another basket generation, request/payment write |
  | Confirmed changed review | orange `Update borrow` | stale confirmed payload |
  | Payment-ready paid Asset | payment panel `Barion`/`Ready to redirect`; footer neutral `Back`, red `Cancel` and `Pay` | editable price/time/quantity/policies in payment phase |
  | Free Asset | `Borrow`; `Send borrow request` | payment phase/session/record |
  | Unavailable Asset/window | no enabled `Borrow`, or the card is filtered from Explore | checkout or reservation write |
  | Paid request pending owner decision | `Payment summary`; owner request row `Pending` | another `Pay` for the same scope |
  | Owner-accepted paid borrow | read-only `Payment summary`; member-card `Leave`; current primary manager's resource-card `Remove`; `Ask Asset Owner` | another manager's `Remove`, Promote/Revoke or global Asset delete |
  | Manager left with accepted successor | `Take Over`; exact predecessor price; replacement payment flow | plain confirm-only transfer or early predecessor refund |
  | Runtime association removed | retained Payment history with `Ask Asset Owner` and `Request refund` | global Asset deletion or erased payment record |
  | Refund pending/approved | separate financially neutral `Refund requested` audit row; owner Payment counter/filter delta; `Approve refund`; the same row becomes contextual `Refunded` while the original Captured row stays unchanged | pending badge on the original payment, query projection counter, second refund row or duplicate refund |

- The Borrow popup's own lazy Asset-detail response supplies the authoritative
  parent Event/Sub-event window. The date control immediately normalizes an
  attempted End-before/equal-Start value and either endpoint outside that
  parent window, so an invalid range cannot remain in the review. Quantity outside
  current availability is clamped/rejected. Lending policies expose their
  acknowledgement controls in the review. Every required policy must be
  accepted before the forward action enables; optional acknowledgements do not
  block it. These input gates create no server write. A valid
  quantity/time/policy set produces one deterministic line item and total.
- Select `Confirm borrow` once. This moves to the locked payment phase but does
  not call the provider and creates no server payment/session, request,
  assignment or inventory delta. It creates exactly one synchronized confirmed
  Borrow Basket across the Angular signal, scoped local draft and shared
  local/HTTP repository. The basket expiry is exactly 10 minutes after its
  creation. Orange `Continue borrow`, in-place reopen and one clean reload must
  reconstruct its amount, timeframe, quantity and policy set and open the
  payment phase directly for an unchanged confirmed selection. If the canonical
  server basket is later absent or expires, the following successful Explore
  load clears the scoped local draft and restores the fresh `Borrow` action.
- Use `Back` once. The unchanged review is green `Continue borrow`, and that
  action returns to payment without a repository rewrite. Change quantity to
  `2`: the action becomes orange `Update borrow` and saves the revised confirmed
  basket before payment. Back, restore quantity `1`, then Update again. The
  canonical pre-Pay oracle is exactly three audit generations (initial Confirm
  plus two Updates), one active final confirmed basket and no generation from
  the unchanged Continue action. A disclosed exploratory run may retain extra
  Updates only when every adjacent saved selection is materially different and
  the final basket returns to quantity `1`; the current accepted history is
  `1/1/1/2/1`.
- Click `Pay` exactly once. While active it changes to `Paying...` and is
  disabled; the application remains responsive. Success closes the checkout
  instead of leaving a frozen editor, spinner or duplicate payment surface.
- Immediate write oracle: one terminal `provider=barion` authorized payment for
  the final session/payload; one exact Event/Sub-event-scoped Nova borrow
  request with payment-session reference and `Pending` owner decision; one
  date-window reservation for quantity `1`; and one pending resource
  projection. The final checkout basket is one `pay/succeeded` audit with its
  reservation closed. The physical Asset quantity remains `3`; the request
  remains `inventoryApplied=false`, and overlapping request windows are the
  authoritative availability reservations.
- Immediate UI oracle: the Asset remains once in Explore with availability
  reduced `3 -> 2` for the selected date range while a non-overlapping range
  remains `3`; its same-scope menu exposes read-only `Payment summary`, and
  Casey sees Nova once as the pending borrower on the exact Asset/request.
  Before approval the scoped card shows accepted occupancy `0/3` plus red
  pending `1`. The summary contains the immutable timeframe, quantity, accepted
  policy, amount/currency and recorded Barion/payment-method result. Opening it
  twice is a pure read.
- Casey accepts that same pending request once through the normal Asset member
  action. Nova becomes that exact scope's accepted `Manager`; the dark badge
  changes `0/3 -> 1/3`, red pending changes `1 -> 0`, and no Promote/Revoke
  Manager action remains on this Borrow row. Availability stays `2` because the
  payment already created the dated reservation, not because physical quantity
  was decremented. Nova gains no Event, Tournament-group or global Asset
  Manager role. The sibling Event/Sub-event, adjacent paid Asset and Riley stay
  unchanged.
- One clean reload must reconstruct Casey's accepted request, Nova's scoped
  resource/Payment summary and the final availability from persisted state.
  Replaying the final action identity or reopening the summary cannot create a
  second payment, request, assignment, availability decrement, notification
  or counter delta.
- Inspect the free and unavailable controls without submitting them. Their
  labels and forbidden-payment states must match the table and no control may
  inherit the target's payment/session identity.
- On the adjacent paid control, enter payment-ready once and exercise the red
  `Cancel` blocker: first choose its `Back` action and prove the basket remains,
  then confirm `Cancel borrow` once. The control returns to fresh `Borrow`, its
  scoped local draft disappears, and the backend retains exactly one
  `cancelled/deleted` ten-minute basket audit with no active basket, payment,
  request, inventory or resource side effect. `verify-cancelled` captures this
  isolated savepoint before decline/timeout, so those later controls can roll
  back without repeating the Cancel branch.
- Run one normal quantity-`1` checkout on `Decline Control` and one on
  `Timeout Control`, keeping Barion 3DS enabled. The first must yield exactly
  one declined/failed terminal payment and the second exactly one expired
  terminal payment. Neither control may create a borrow request, inventory
  delta, resource assignment or entitlement. Each retains only its isolated
  `pay/failed` checkout audit so the failed attempt remains recoverable.
- After the core terminal oracle, roll back to `accepted` and prepare one
  accepted Riley scoped borrower without a payment. Nova's own member-card
  action is `Leave`; as runtime Manager Nova can `Remove member` from Riley's
  card, while the resource-card `Remove` remains a separate convenience action.
  Do not exercise the Riley removal in the paid-takeover branch.
- Nova leaving while Riley remains keeps the runtime association at accepted
  occupancy `1/3` and gives Riley one Take Over-required notification. Riley
  reuses Nova's browser after logout/login. Take Over must open the replacement
  Barion payment flow for the predecessor's exact `HUF 3,200`; Riley must accept
  the required lending policy, and transfer occurs only after successful
  authorization. Completion links both payments, releases and fully refunds
  Nova's predecessor authorization, keeps Casey's net income at one payment,
  and makes Riley the scoped Manager. Immediately afterward the reused browser
  switches to Nova to prove the refund-result notification and contextual
  `Refunded` history, then switches back to Riley. Nova receives the refund
  result only, not a generic manager-change notification.
- Riley then uses resource-card `Remove`. This status-deletes only the exact
  runtime scope and retains Casey's global Asset plus both payment histories.
  The Asset payment expense menu uses `Ask Asset Owner`, resolves Casey rather
  than the departed runtime Manager or Event organizer, and creates the Asset
  service chat only on the first sent message. The normal Chat channel and
  unread red counter own delivery after creation.
- Riley requests a refund from the retained history row. Casey's backend Users
  write model increments `paymentRefundsPending`; the side-menu poll exposes it
  before Payment history opens, and the popup filter shows the same value.
  Casey approves from the income row. Both finance signals update immediately,
  the persisted counter returns to zero, and both history and Payment summary
  show a contextually distinct `Refunded` result.
- Finally roll back to `accepted` once more. With no accepted successor, Nova's
  member-card `Leave` removes only the runtime association immediately. The
  global Asset and payment history remain, no Take Over notification or
  automatic refund is created, and the retained expense row still offers
  `Ask Asset Owner` and `Request refund`.
- The versioned `asset-checkout` fixture provides guarded `stage`, read-only
  `status`, `payment-ready`, revised-payment-ready, `paid-pending`,
  request-destination, `accepted`, `cancelled-control`, paid Take Over, runtime
  Remove/refund and last-manager Leave captures, exact persisted rollback
  savepoints, terminal verifiers and exact `reset`. It mirrors Nova and Riley's
  active Barion cards plus Nova's expired control into the running payment simulator.
  The payment-ready rollback restores the server boundary only; if the browser
  draft was already cleared, the user repeats steps 1-18 because the harness
  never writes browser-local storage.

Core browser evidence recorded on 2026-09-07: steps 1-68 reached `PASS` with
exactly one approved target payment, one isolated declined payment, one isolated
expired payment and one cancelled Adjacent basket audit. The target Asset kept
stored quantity `3` and selected-window availability `2`; the sibling scope and
Riley remained unchanged. The unavailable control exposed an explicit-zero
backend parity defect during this run: explicit quantity `0` is now preserved,
the temporary reservation workaround was removed, and the dated Explore query
excludes that control. The accepted and cancelled-control rollback savepoints
remain available for the lifecycle extension.

The 2026-09-08 continuation closed steps 69-98. The paid Take Over branch kept
exactly one live payer while retaining Nova's predecessor and separate refund
audit; Riley's scoped `Remove` removed only the runtime association, resolved
`Ask Asset Owner` to Casey and retained both payment histories. The separate
50% refund request/approval branch changed the persisted pending counter
`0 -> 1 -> 0` and updated both open histories and summaries through their
signals. The guarded last-manager `Leave` oracle passed at
`2026-09-08T03:42:02.224Z`: the runtime association disappeared, Casey's global
Asset and Nova's payment history remained, and no Take Over notification or
automatic refund appeared. The final mixed-status resource `Remove` oracle
passed at `2026-09-08T03:48:22.239Z`: Nova's accepted and Riley's pending
requests/projections became deleted, the resource and all scoped Transport
metrics disappeared, Casey's pending counter returned to zero, availability
returned to `3`, and every actor's payment history stayed byte-identical.

The missing `Request refund` action observed while preparing the final replay
was fixture drift: both the staged Asset and retained payment carried a disabled
cancellation policy and the booking was inside the cutoff. Future guarded
last-Leave and mixed-status Remove preparation now restores the explicit
one-day/50% policy in both documents and moves the booking to a safe future
window. The completed run was not restaged to manufacture evidence; its final
persisted `last-remove-verified` oracle is the closing result.

### `ASSET-PRICING-001` — interactive Asset pricing journey

Status: **PASS / CLOSED — 2026-09-17**.

Closure: the user reported the repaired UI looked correct and authorized closing
Pricing after the saved-data review. The final fresh run contains two independent
Cutoff payments of USD 900 and one Variable payment of USD 1800 at a fixed daily
rate of USD 900. All three are captured/fulfilled with separate request and
payment-session identities. Variable retains the 26-hour range and a two-day
duration row; Cutoff has one charged day. Native request-scoped HTTP queries
return one pending Nova row per rental, while stage queries and persisted
resource counters agree on Cutoff 2 and Variable 1. Request projections match
the three embedded requests; no duplicate request/payment was found.

This accepted pair-QA verdict combines the earlier Hybrid/rule/editor/history
observations below with the final duration and repeated-Borrow regression. It
is not a claim that the original 2300/800/900 phase-by-phase fixture oracle ran
unchanged: the user intentionally varied the sequence and confirmed Variable
was initially view-only. Active refund-request/approval coverage is reused from
closed ASSET-CHECKOUT-001 block 8; no full replay was requested. Final captured
payment IDs: `6aaba4fd392b9933eba0514d`, `6aaba512392b9933eba05153`,
`6aaba52a392b9933eba05157`. Continue with ASSET-BORROW-001.

The dated notes below retain the investigation and superseded preparation history.

Focused review, 2026-09-17: the user clarified that Variable was a view-only
check; the Hybrid payment was USD 1150 on the one-day Cutoff range. Persisted
payments USD 1150, 900 and 800 are all captured/fulfilled, with distinct Borrow
request IDs. Their saved rows sum to their respective amounts. The first two
retain the enabled one-day/50% policy; USD 800 retains its disabled policy.
These records support the observed one-day pricing and saved-term cases; they
do not prove a two-day captured payment or an active refund window. No full
Pricing PASS is claimed, and the user does not need to repeat the full test.

Duplicate-member defect: each rental card used the whole Asset's synchronized
count and opened Members without its request ID. Cards now retain counts from
their own persisted request. The Members query matches Asset, Event, stage and
embedded request ID together in Mongo; local query, action responses and popup
cache scope carry the same request ID. No user-based deduplication was added.
Existing dev watchers compiled both sides successfully. Read-only HTTP checks
returned one exact Nova row for each of the three requests (also pending-only
and sync), three rows for the stage aggregate, and no rows for unknown request
or mismatched stage. Retained requests, payment snapshots and request projections
were identical before and after this verification.

Preparation correction, 2026-09-17: the user explicitly clarified that
restage means normal reset followed by stage, with all prior fixture effects
removed. The initially prepared offer-only resume was incorrect. Its custom
harness additions were withdrawn; use the existing versioned reset/stage and
browser launcher. Reset verified zero scoped artifacts; normal stage at
2026-09-17T08:28:14.933Z and independent status verified `baseline-ready`,
Pricing Off, zero requests and zero payment documents.
The earlier payment observations above remain historical
evidence, not retained live fixture data. The focused counter check now uses
the original Pricing Off baseline and one free Borrow: total pending 0 -> 1,
one rental card with badge 1, and one Nova row in Members. That new write/UI
observation remains pending with the user. Refund-request menu and approval
coverage remains in ASSET-CHECKOUT-001 block 8.

Preparation2026-09-17: the user explicitly clarified that fixture staging and
managed browser launch are required now; the pre-stage development gate must
not prevent this requested startup. Outstanding audience/refund implementation
findings remain unproven and are not a manual PASS. Trust standard; no product
code changed. Existing dev Compose images started through the versioned dev
configuration, without rebuilding images or touching the VMware deployment.
After the initial seed import completed, versioned Borrow and Pricing status
both reported `not-staged`; no Borrow reset was necessary. Pricing stage and
its independent status reached `baseline-ready` at2026-09-17T06:09:10.357Z:
one Public Transport Asset, quantity3, Pricing Off, Casey owner, Nova accepted
Event member, Riley public control; request/resource/basket/payment counts0.
Barion connected, 3DS Off. Cutoff start2026-09-17T18:09:10.357Z. The versioned launcher completed snapshot-protected session cleanup
(Casey2→0, Nova2→0, Riley1→0) and handed off three identity-verified ready
windows in one horizontal row. Backend/frontend healthy; localhost/game
HTTP200. No checklist actions have been performed.

Mobile Pricing defect2026-09-17: user reported a clipped desktop-style Time
Rules row in the narrow Pricing popup. Read-only inspection of the reported
Casey popup confirmed that its host has `display: contents` with
`container-type: inline-size` but no box, while the Time Rules grid retains
four columns. The shared Pricing stylesheet now places inline-size containment
on the actual wizard body and gives the narrow non-slot Time Rules selector
the same specificity as its desktop rule. Fixture and browser state were not
changed; visual replay remains user-controlled.

Preparation2026-09-16: user selected Pricing for tomorrow, ahead of parked Borrow.
The stable guide now has7 blocks with the same14 steps and report markers.
Existing fixture oracle commands and the three-role managed launcher are mapped
in the handoff. No data staged or browser actions performed; stage on test day
on the test day because the Cutoff stage starts staging+12h. The old Asset
VIP development gate below was subsequently withdrawn.

Original development note, 2026-09-16 — **retained verbatim as history,
superseded by the 2026-09-17 correction below; not a current execution gate**:

> Hard development gate: another session must not stage this checkpoint first.
> It starts by exposing and wiring Asset audience/member/VIP/invite/promo pricing
> through the Borrow calculation and promo entry point, with an explicit VIP
> identity contract rather than a fixture-only role. It then adds the Refund
> policy block to Confirm borrow, locked Payment and Payment summary, including
> active, no-policy and passed-cutoff states rendered from the immutable
> payment-time calculation/policy snapshot. Only a passing dev-pipeline boundary
> unlocks fixture staging and the interactive journey.

| Original requirement | 2026-09-17 correction | Reason |
| --- | --- | --- |
| Implement Asset member/VIP/invite/promo pricing and expose its controls. | Withdraw the Asset requirement; implement organizer-invitation VIP pricing for Event separately. | User confirmed Asset has no VIP; its editor already deliberately hid the shared audience section. |
| Compare quantities 1 and 2; Hybrid payment HUF 4600, refund HUF 2300. | Keep one-item Borrow; use threshold 1/33%, payment HUF 2300, refund HUF 1150. | The earlier Borrow contract already fixed one item per request. |
| Add the refund-policy block to Confirm borrow, Payment and Payment summary using payment-time snapshots. | Retained; user requested reuse of the existing history presentation on Payment. | This was a separate development item and was not withdrawn with Asset VIP. |
| Require completed implementation before staging or launching browsers. | Withdrawn for this explicitly requested startup. | User authorized fixture preparation and window launch despite unfinished implementation. |

Scope correction, 2026-09-17 (user-confirmed): Asset has never exposed a VIP
field. `showAudienceSection: false` is intentional; the common pricing DTO is
not an Asset feature contract. The earlier requirement to implement Asset
member/VIP/invitation/promo pricing was wrong and is withdrawn. Borrow remains
one item per request, as recorded in `ASSET-BORROW-001`; borrowing an Asset from
the Event organizer remains allowed.

Stable guide: [`ASSET-PRICING-001.md`](../checklists/asset/ASSET-PRICING-001.md).
Casey edits one Public Transport Asset; Nova checks its price and makes all
three payments. Riley remains a non-member and checks that the stage's
three-dot menu is absent. Hybrid uses quantity threshold 1 and demand threshold 33%,
retaining the USD 999 base, USD 49 reduction, two 10% adjustments and whole-number
rounding: USD 1150 per day, USD 2300 for two charged days and one item. The
active-policy refund is USD 1150. This replaces the incompatible old two-item
HUF 4600/HUF 2300 assertions. `verify-audience` keeps its command name but now
checks the unchanged Asset configuration; Nova's price and Riley's missing
internal menu remain user-observed results, not proof supplied by the database check.

Currency correction, 2026-09-17: the existing Pricing selector supports USD,
EUR, GBP and CZK, not HUF. The checklist and versioned fixture now use USD
with the same numeric amounts. Application currency options were not changed.
The retained live fixture was not restaged; Casey selects USD in step 1.

Access correction, 2026-09-17: the user's Riley session could see a Transport
entry that the backend correctly refused. Stage menu visibility now uses the
existing server resource-access policy. The user explicitly requested the same
hidden three-dot menu for non-members on both Casual and Tournament stages,
without a Groups/results exception. Read-only HTTP on the retained fixture
returned access true for Casey and Nova and false for Riley. Browser verification
is pending; no membership was added and no fixture was restaged for this fix.

The other recorded development item remains: disclose the saved cancellation
policy on Confirm borrow, Payment and Payment summary. Cover an active one-day/
50% rule, explicit no policy and a passed deadline. Historical summaries must
use the payment-time rows and policy, not later Asset edits. These are pair-QA
checks; repair concrete discrepancies as observed and do not mark them passed
from compilation or automated tests.

Date defect, 2026-09-17: the fixture stored correct absolute stage windows but
all relative stage-definition offsets were zero. Explore derived the wrong
range; Borrow then clamped it to the real window plus one hour. The versioned
`repair-stage-timing` command sorted definitions and wrote only their relative
offsets. It verified that Asset pricing, memberships, requests, resources,
baskets, cards and payments were unchanged. Read-only HTTP comparison then
matched stage start/end with the Asset borrow window for all three stages.
Variable is 2026-09-20T06:09:10.357Z–2026-09-21T08:09:10.357Z (26 hours). The user
must reload once to replace the stale stage data; no browser actions were
automated. The current fixture includes the user's fixed-price edit and one
request/resource; it is no longer the pristine baseline. Do not reset it or
claim the old baseline status still describes the live data.

Event VIP extension (manual verification pending, separate from Asset pricing).
The user clarified that organizer invitation pricing is a write-side,
idempotent audit, not a role join during reads. Capture the pricing form values
when the organizer sends the invitation; opening/closing it and subsequent
Event edits must not replace the offered VIP amount. On acceptance, record the
then-current Event pricing separately without rewriting the original offer.
Retry must not append another offered/accepted audit entry. Payment uses the
original offer. The current implementation stores the offer and audit with the
membership; the server and checkout preview read that stored offer. Asset
pricing and organizer-to-borrower ownership rules are unchanged. No new browser
flow or automated behavior test has been executed; the rules and observations
are being established in pair QA.

### `ASSET-AVAIL-001` — overlap and finite capacity

- Stage two overlapping booking requests against one finite-capacity asset,
  then move one request outside the overlap without waiting for wall-clock
  time.
- Use a multi-day Event/Sub-event window and change the Resource Explore date
  range between the overlapping and released windows. A Public Asset that has
  no remaining capacity for the selected window must become unavailable or
  disappear from the availability-filtered result; Public visibility alone
  must never override timeframe availability.
- Verify half-open timeframe boundaries, pending/accepted quantities,
  available capacity, date-filter reconstruction and Explore order. Moving one
  request restores exactly its released capacity in place and after reload.

### `ASSET-ASSIGN-001` — event/sub-event asset assignment

Consolidated execution row: `ASSET-ASSIGNMENT-LIFECYCLE-001`.
Stable user guide:
[`ASSET-ASSIGNMENT-LIFECYCLE-001.md`](../checklists/asset/ASSET-ASSIGNMENT-LIFECYCLE-001.md).

Status: **PASS / CLOSED**.

The first manual steps 1-9 exposed persistence, shared-counter and remaining-
quantity defects and were not accepted as evidence. The checkpoint's guarded
reset restored its snapshots, then the fixture was freshly staged at
`2026-09-04T03:19:45.794Z`. Its subsequent read-only `status` passed all eleven
baseline predicates: three zero-valued normal Event viewer documents, no
normal resource, unchanged second Sub-event, exact normal/Asset memberships,
exact Tournament/room memberships, Group A owner/type metrics, Group B control
metric and document snapshot, stage/root pending `2`, and zero controlled
notifications. The three managed browsers were freshly relaunched after the
restage. The user then replayed steps 1-9. `verify-normal-assignment` initially
exposed a harness-only false negative: it compared the complete bell counter
with the pre-notification baseline even though the expected Supplies-open
notification legitimately changes it. The corrected oracle verifies the
fixture's exact inbox/outbox rows separately and keeps every other activity
counter byte-identical. Its rerun reached `normal-verified` with all checks
true: exact Nova and Riley owner records, `1/4` Transport, `1/3`
Accommodation, shared `5/6` Supplies, common values for all three viewers,
unchanged control Sub-event, memberships, Tournament branch and non-bell
counters.

After that replay, a generic contribution-added notification was implemented
for server and frontend-local writes. Every newly persisted Supplies row sends
exactly once to all other accepted participants in the relevant Event or
generated Group, regardless of whether Nova, Riley or another participant is
the contributor; the contributor and outside/control users are excluded. This
new notification was deliberately not replayed manually in the already
verified 1-9 transaction. It is recorded in the stable checklist and the
future `verify-normal-assignment` oracle, which expects Nova `2` to reach Casey
and Riley and Riley `3` to reach Casey and Nova.

The subsequent exploratory Supplies-row deletion exposed two additional
defects. The paged shared list could render Nova as `Unknown member, 0` because
the row response did not carry its display-safe contributor fields, and Riley's
own delete was rejected as no longer available because the popup built the
outgoing write from a shared display cache instead of Riley's stored
owner-scoped state. The list endpoint now batch-enriches the current page with
name/initials/gender/age/city; the popup mutates only the active user's stored
row. Successful deletion emits one
`event-supplies-contribution-removed` notification to every other accepted
participant under the same recipient rule as addition. A separate row directly
below the popup header actions shows the stored minimum and
`capacityMax - accepted` as a compact `Required · Remaining` badge. These
corrections were covered by the accumulated user-driven run and the exact
stored-state checks. The user additionally confirmed that deleting the owned
Supplies item works after the correction. At the user's direction, the
complete 1-9 interaction sequence was not replayed again after these focused
corrections.

A later close/reopen check exposed that popup hydration itself emitted a
common-counter update from the already-open sub-event context. If that context
was stale, closing the popup merely revealed the zero values it had already
sent to the parent menu. The hydration-time counter emission has been removed:
only a successful resource write may publish a common counter change. The
normal sub-event reload endpoint now returns the counters already stored on
the ActivityEvent documents; a read-only Riley request returned Transport
`1/4`, Accommodation `1/3` and Supplies `4/6` for the current exploratory
branch while the control sub-event remained zero. The frontend watcher built
and synced this correction at `2026-09-04T05:59:42+02:00`. The accumulated
1-9 run, the exact `normal-verified` savepoint, the user's successful owned-row
delete, the persisted reload response and successful running watcher builds
are accepted together as the normal-branch evidence. The guarded normal
restore then recovered Nova `2` plus Riley `3` and common Supplies `5/6`
exactly.

The isolated `asset-assignment` fixture stages the normal and Tournament
branches together. It is independent from Borrow and Checkout and must start
only after the active Asset checkpoint has been reset:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  stage asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status asset-assignment ASSET-ASSIGNMENT-LIFECYCLE-001
```

Its named savepoint oracles are `verify-normal-assignment`,
`verify-supply-contribution-delete`, the guarded
`restore-normal-assignment-branch`, `repair-tournament-group-ids`,
`stage-step-10-boundary`,
`rollback-step-10-boundary`, `verify-group-capacity-edit`,
`stage-step-16-boundary`, `rollback-step-16-boundary`,
`verify-group-unassign`, `stage-step-22-boundary`,
`rollback-step-22-boundary`, `verify-group-reassign`, and
`verify-group-manager-removal`. The normal restore puts back the exact verified
Nova `2` plus Riley `3` contribution state and removes only temporary delete or
exploratory contribution notifications. At
`2026-09-04T04:10:02.153Z`, `stage-step-10-boundary` accepted the exact normal
savepoint and byte-identical Tournament baseline. Its immediate rollback proof
restored the Tournament documents, scoped inbox/outbox, related queued work and
notification counters exactly while preserving the normal branch. Phase is
`step-10-ready`; checklist step 10 can now be replayed without repeating 1-9.
At `2026-09-04T04:31:12.888Z`, the guarded Group-ID repair replaced the
incorrect fixture-only `group:a/b` IDs with the server-generated `group:1/2`
IDs, removed all legacy Group documents, restored the accepted normal branch
after the extra Supplies delete check, and recaptured the step-10 boundary.
Exact checks passed for Group A's three members and pending `2`, Group B's one
member and pending `0`, all four leaderboard rows, the unchanged normal branch
and the new savepoint.
At `2026-09-04T06:50:00+02:00`, `verify-group-capacity-edit` passed all eight
checks after Nova changed only `QA Group A Nova Transport` from capacity `4`
to `5`. The oracle now reads the durable `groupsCount` from the stage runtime,
compares embedded membership snapshots independent of BSON field order, and
normalizes Spring's `_class` metadata out of the otherwise unchanged Group B
runtime metrics. Group A retained both pending requests, Riley Accommodation
remained `1 accepted / 1 pending / 0-3`, Group B and the normal branch remained
unchanged, and the phase advanced to `group-capacity-verified`.
The guarded `stage-step-16-boundary` then captured that exact capacity-5
Tournament state, its scoped inbox/outbox and related queued work. An immediate
`rollback-step-16-boundary` proof restored all five domains exactly while
preserving the verified normal Event branch, so the live phase is
`step-16-ready` and steps 1-15 do not need to be replayed.
After the exploratory unassign observations, the same guarded rollback ran
again at `2026-09-04T05:50:17.360Z`; all five exact-restore checks passed and
the live fixture is again `step-16-ready` for the user's step-16 replay.

Unassign now emits one neutral `event-asset-assignment-removed` notification.
Recipients are resolved by the existing assignment scope: active members of
the relevant generated Group or Event/Sub-event, the Asset owner, and every
scope-matching accepted or pending Asset member. The actor is excluded and
duplicate recipients are merged. A main-Event assignment uses the Event
membership; every Sub-event assignment is identified by its exact
`subEventId`, independently of whether the UI displays that Sub-event inside a
slot. The Asset request may carry the concrete generated-Group owner ID or its
base Event ID. The notification says only `Asset assignment removed` /
`Assignment ended · <Asset title>`.

The unassign write never physically deletes the resource or its scoped Asset
member rows. The resource and every accepted/pending request in the removed
scope change to `D` and disappear from active reads while remaining audit
history. Reassigning the same source Asset creates a new resource generation
and new member/request IDs; no `D` ID can be restored or reused. The step-16
oracle verifies the status changes, exact `2 -> 1` counter reversal and Casey
plus Riley notification. After step 20, `stage-step-22-boundary` captures the
post-unassign state. The reassign oracle requires a fresh Nova resource, a
fresh Nova owner request, a fresh Casey pending request, `1 / 1 · 0-5`, and
the exact `1 -> 2` pending return while all prior `D` rows remain hidden. The
same lifecycle and recipient rules apply when manager removal later clears
Riley's Accommodation assignment.

At `2026-09-04T08:46:00+02:00`, the guarded step-29 rollback restored the
exact accepted steps 1-28 state. The real authenticated Event-member removal
HTTP route then removed Riley from the complete Tournament tree once. The
terminal `verify-group-manager-removal` oracle passed all thirteen checks:
Riley left only the Tournament and Group A tree; the removed Accommodation
resource and every affected active request became hidden `D` audit history;
Nova's Transport generation retained its IDs/settings/routes and converged to
`1 / 0 · 0-5`; the stage/root pending chain converged to `0`; Group B and the
normal Event branch remained unchanged; and the scoped removal notification
was emitted exactly once to Nova and Riley while excluding Casey and Lina.
The server document model now preserves the generated room's
`parentSubEventId` and `groupId` during membership-counter saves, and the
member-removal write discovers assigned resources throughout the complete
Event hierarchy before updating request statuses and affected resource
metrics. The running backend watcher compiled and restarted successfully.
Together with the accepted user-driven UI journey through step 29, this closes
`ASSET-ASSIGNMENT-LIFECYCLE-001` as **PASS / CLOSED** without replaying steps
1-28.

- Assign an eligible accepted user's Transport to one normal event sub-event.
- Verify event ID, sub-event ID, asset owner, asset ID, route,
  capacity/settings and Event Resources UI agree.
- Verify assignment visibility and availability/capacity effects without
  changing the user's event role or creating a second asset membership.

### `ASSET-ASSIGN-002` — multi-type and multi-owner aggregation

- Assign Transport and Accommodation from one eligible owner plus Supplies
  contributions from two accepted users to the same normal sub-event.
- Keep the shared Supplies assignment and its capacity only on Nova's resource
  record; Riley persists only Riley's contribution row for that same Asset.
- Treat every newly persisted Supplies contribution row identically regardless
  of contributor: notify every other accepted participant in the relevant
  Event or generated Group exactly once, exclude the contributor and all
  outside/control participants, and do not resend for the same row. The first
  Supplies assignment still emits its separate contribution-open notification.
- List every shared contribution with the contributor's real display identity.
  Only the contributor can delete that contributor's row. A successful delete
  immediately and durably subtracts its exact quantity, retains the shared
  Asset assignment/capacity, and notifies all other accepted participants once
  while excluding the actor and outsiders.
- Show `Required <capacityMin> · Remaining <capacityMax-accepted>` in a
  separate row directly below the contribution popup header actions and update
  it with the same persisted common quantity as the card/menu counter.
- Compare every per-owner record with aggregate accepted/pending/capacity
  min/max values in Event Resources, the sub-event badges and parent
  navigation, both in place and after reload.
- Opening, hydrating or closing a resource popup must not emit a common
  resource-counter mutation. Closing clears only popup-local transient state;
  parent menu counters remain at the last saved values.
- The unrelated sub-event and all membership roles remain unchanged. Generated
  Tournament-group aggregation belongs to `TOURNAMENT-RESOURCE-001`.

### `ASSET-ASSIGN-003` — mutation, unassign, reassign and removed-manager cleanup

- Start from two generated Tournament groups. Group A contains at least two
  owner-scoped resource assignments; Group B is the unchanged negative
  control. Edit the capacity of one Group A asset and require the owning save
  to refresh only that exact event/stage/group/owner/type materialization. Do
  not reconstruct the answer in the list query.
- Unassign that resource, verify the old resource and its scoped accepted and
  pending requests changed to hidden `D` audit rows, then reassign the same
  source Asset as a new generation with fresh resource/member/request IDs.
  After that, remove one separate Group A asset manager from the event. The
  writes must subtract the
  exact removed owner/type contribution from Group A runtime metrics, the
  stage `groupsPending` aggregate and the root Event activity aggregate. Only
  settings/contributions owned by the removed manager are cleaned up;
  unrelated Group A owners/types and every Group B domain record/counter remain
  unchanged; server-maintained normalization fields are validated separately.
- Verify the source asset, assignment/settings/contributions, materialized
  group/stage/root counters, Event and Tournament-group roles after each write,
  after popup close/reopen, after browser reload and after an idempotent
  terminal replay. No read projection or frontend counter fallback may repair
  the persisted result.
- The consolidated fixture makes Group B an unchanged Lina domain control and
  starts Group A/root pending at `2`. The source-Asset capacity mutation keeps
  it at `2`; Nova's unassign reverses it to `1`; the fresh assignment plus new
  Casey request returns it to `2`. Riley's later Tournament removal requires
  the same exact `2 -> 1` write-side reversal while the normal Event still
  retains Riley and its previously verified assignment state.

## Content cases

### `CONTENT-ADMIN-LIFECYCLE-001` — governed revisions, consent and Article lifecycle

Status: **PASS / CLOSED**.

Stable user guide:
[`CONTENT-ADMIN-LIFECYCLE-001.md`](../checklists/content/CONTENT-ADMIN-LIFECYCLE-001.md).

Prepared runner sequence (do not stage while another checkpoint is active):

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  stage content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-drafts-saved content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-privacy-active content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  restage-step-32-boundary content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  rollback-step-32-boundary content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-privacy-fallback content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-article-trashed content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-article-restored content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  rollback-step-59-boundary content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  verify-article-republished content-admin CONTENT-ADMIN-LIFECYCLE-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  reset content-admin CONTENT-ADMIN-LIFECYCLE-001
```

The runner and Ava/Kai/Riley browser definition were prepared on 2026-09-03.
After the user completed the governed-revision and Privacy activation branch,
extra exploratory clicks left additional revisions and activation audits. The
versioned `restage-step-32-boundary` command normalized only fixture-owned
records at `2026-09-04T08:19:45.713Z` and captured the exact post-step-31
boundary: nine controlled revisions, six controlled consents, four create
audits plus one Privacy `v3` activation audit, sole active Privacy `v3`, one
Kai `v3` consent, zero Riley `v3` consent, and unchanged Article buckets
`7 / 5 / 7 / 0 / 0`. `rollback-step-32-boundary` then replayed the captured
boundary successfully at `2026-09-04T08:19:54.721Z`. This replay fixture is a
continuation boundary, not replacement evidence for the preceding user-driven
UI observations. The explicit manual-browser-control rule remains in force.
The step-41 persisted oracle passed at `2026-09-04T08:26:17.445Z`: Help `v2`
and active Privacy `v3` were deleted exactly once, Privacy `v2` became the
sole active fallback, Kai's historical `v3` consent remained intact, Riley
still had no `v3` consent, the five `v1`/`v2` consent records were unchanged,
and the audit sequence contained exactly four creates, one activation and two
deletes. Terms, Explanation, the controlled Article pair and Article buckets
remained unchanged. Ava's own additional consent records are outside the
Kai/Riley isolation assertion and do not invalidate this boundary.
The guarded `rollback-step-59-boundary` completed at
`2026-09-04T11:03:14.489Z`. It restored the five Article records moved during
the user's exploratory checks from the captured fixture baseline, retained the
already-proven governed-content, seven-audit and consent branches, and placed
only the lifecycle target in Draft. The read-only status oracle then proved
exact Article buckets `7 / 5 / 6 / 1 / 0` and stable controls. Continue with
one user-driven Publish at step 59; do not replay steps 1-58.
The terminal republish oracle passed at `2026-09-04T11:05:31.941Z` after the
user's single final Publish. Article buckets returned exactly to
`7 / 5 / 7 / 0 / 0`; the lifecycle Article retained its exact identity,
`contentKey`, `contentHtml` and managed-image references; the adjacent and
unrelated controls remained unchanged. The governed branch retained exactly
seven audits, Kai's `v3` consent and Riley's absent `v3` consent. Final HTTP
media checks returned the original `200 image/webp` values: 98012 bytes /
`8fe226b45db5c299ca10c71fa1be3b766ff0ff5bd67d125f957ca207479f9fae`
for the lifecycle image and 82400 bytes /
`159043edf1734fdea38e1a348284dca4ae0d39db1425137e227998c67cca9fa1`
for the featured control. The accumulated user-driven Restore confirmations,
persisted Draft evidence and final stable-field oracle close the three
regressions discovered during this run; steps 1-66 are accepted without
another replay.
After recording that verdict, the versioned reset completed at
`2026-09-04T11:08:01.897Z`; the following read-only status returned
`phase=not-staged`, `activeScenario=null` and no retained fixture artifacts.
The two distinct managed-image controls were read-only verified over the
running HTTP stack before staging:

- `idea-register-value/v1/large.webp`: HTTP 200, `image/webp`, 98012 bytes,
  SHA-256 `8fe226b45db5c299ca10c71fa1be3b766ff0ff5bd67d125f957ca207479f9fae`;
- `idea-why-priority-matching/v1/large.webp`: HTTP 200, `image/webp`, 82400
  bytes, SHA-256
  `159043edf1734fdea38e1a348284dca4ae0d39db1425137e227998c67cca9fa1`.

Recheck those values at the Article savepoints; a Mongo URL match alone is not
the media-retention oracle.

This consolidated journey replaces four unexecuted microtest rows. It
does not reopen or rewrite the already-PASS Article Editor and landing
publication evidence.

- Stage isolated Ava Admin, Kai retained-client and Riley fresh-client
  sessions. Governed baselines are Help HU `v1`, Terms EN `v1`, Home cards
  Explanation EN `v1`, Privacy EN `v2`, and inactive Privacy EN `v1` as the
  fallback. Kai and Riley each retain immutable valid consent for both Privacy
  `v1` and current `v2`.
- Stage one separate English published, non-featured disposable Article with a
  managed image set, plus a featured adjacent control. Preserve
  `ARTICLE-SRC-002` and every previously passed row as byte-identical controls.
- The state-dependent action contract is:

  | State | Required actions/status | Forbidden or unchanged state |
  | --- | --- | --- |
  | Active governed revision | `Active`, `Edit revision`, `Delete revision`; activation disabled | no second active revision in the same type/language/context |
  | Inactive governed revision | `Edit revision`, `Activate revision`, `Delete revision` | no public change before activation |
  | Revision mutation in flight | action-ring; competing Save/Activate/Delete disabled | duplicate revision/audit mutation |
  | Newly active Privacy revision | fresh clients show the new revision; stale consents require `Approve privacy` | historical consents rewritten or another actor approved |
  | Active revision deleted | newest remaining revision automatically becomes the one Active fallback | empty public document or silent cross-scope activation |
  | Published Article | `Read more`, `Edit`, `Unpublish`, `Feature`/`Unfeature`, `Delete` | `Restore`, `Publish` |
  | Trashed Article | `Restore` only | public inclusion, edit/publish/feature/delete |
  | Restored Draft Article | `Read more`, `Edit`, `Publish`, `Delete` | public inclusion, `Feature`, `Unpublish`, `Restore` |

- Edit the four active governed controls once, creating inactive Help HU `v2`,
  Terms EN `v2`, Home cards Explanation EN `v2`, and Privacy EN `v3` with the
  exact base revision, author, language and context. Save/reopen/reload must
  retain the new values while all public active content and consents remain
  unchanged.
- Privacy `v3` contains one mandatory and one optional section plus a bounded
  unsafe-HTML probe. Persisted and rendered content must omit scripts and event
  handler attributes. No preview/open/read operation creates another revision,
  audit row or consent.
- Activate Privacy `v3` once. It becomes the only active Privacy EN revision.
  An already-open separate browser may retain its honest `v2` snapshot; a
  fresh/reloaded client must show `v3`. Kai approves `v3` exactly once, Riley
  remains stale, and every `v1`/`v2` historical consent remains immutable.
- Delete inactive Help `v2` once and prove Help `v1` remains active. Then
  delete active Privacy `v3` once. The implemented Java and frontend-local
  contract automatically activates newest remaining Privacy `v2`; public
  Privacy never becomes empty. Kai and Riley's retained `v2` consents become
  current again without a new write, while Kai's historical `v3` consent is
  preserved.
- This active-delete fallback is the current implemented and administrator-
  manual contract. It supersedes the earlier unexecuted source assertion that
  active deletion should fail closed; no production behavior changes in this
  documentation checkpoint.
- In the Article branch, move the disposable published record to trash once.
  The Admin SmartList reconciles the returned record and All/Published/
  Trashed counts in place; a fresh public landing excludes it. The open landing
  surface's stale/non-live presentation is recorded instead of being treated
  as persisted truth.
- Restore once. The same record becomes an unpublished, unfeatured Draft;
  All/Drafts/Trashed change once and fresh public clients still exclude it.
  Publish separately once to return it to Published/public state. Restore is
  never treated as Publish.
- Across trash, restore and republish, require the same article/contentKey,
  creator, canonical managed image URL, image variants and sanitized HTML.
  Soft lifecycle operations must not delete media. The adjacent featured
  control, Riley's consent state and every unrelated language/context remain
  unchanged.
- Immediate machine oracles compare exact revision/article IDs, active flags,
  base revision, actor/time, content audit/telemetry counts, consent histories,
  bucket counts, public query membership and managed-media object hashes.
  Reload and idempotence probes must not duplicate any mutation.
- The versioned fixture provides guarded `stage`, read-only `status`, named
  `drafts-saved`, `privacy-active`, `privacy-fallback`, `article-trashed`,
  `article-restored` and `article-republished` captures, plus exact `reset`.
  Its Mongo savepoints prove the revision, audit, consent and Article-bucket
  contract. Capture the existing admin telemetry stream separately at the
  matching UI savepoints; do not infer Redis telemetry from Mongo state.

## Current Operator Pair-QA journeys

### `OPERATOR-CONFIGURATION-LIFECYCLE-001` — configuration workspace

Stable click guide and shared-coverage map:
[`OPERATOR-CONFIGURATION-LIFECYCLE-001.md`](../checklists/operator/OPERATOR-CONFIGURATION-LIFECYCLE-001.md).
The current guide has C01 Firebase changed save/tests, C02 activation/entry
mode and C03 exact restoration. Public configuration and payment evidence are
retained from their completed runs. Actual Firebase sign-in/logout/re-login
reuses [physical WebView evidence](#firebase-registration-and-desktop-login-footer--2026-09-14).
Managed HTTPS is owned by Operator Update. Do not replay completed flows.

#### Shared Firebase revision and entry repairs — 2026-09-14

User clarified that Firebase-related Operator Save/save-reopen remains in the
WebView run. Operator restore and other configuration workflows are deferred
to the separate Operator journey; retained fixture cleanup is not a restore-test
PASS.

User subsequently parked the broader Operator journey. Retain this partial
evidence and the guide as a draft; continue only the WebView-specific Firebase
branches with active revision 1. Public configuration, TLS and payment are not
next actions in the current run. Phone candidate lifecycle-26
(`mobile-webview-lifecycle-1789413268062`) is now served, retaining its existing
cache and original build snapshots. Updated-device replay is not yet proven.

- Current read-only `status operator-domain OPERATOR-FIREBASE-001` confirms
  revision 1 active, Authentication tested revision 1, Messaging tested revision
  1, both private credential envelopes present and all public client fields
  present. The original deployment snapshot remains retained.
- Earlier in this shared run, configuration save and Authentication capability
  testing used the real Operator API. Desktop Message Test used the normal UI;
  the user confirmed the native notification Allow action. These facts do not
  substitute for an unobserved manual save/reopen or consumer registration.
- C05/C06 are partial shared evidence, not closure of the Operator parent.
  Fresh Firebase registration/repeat identity, C02 public configuration, C03 TLS,
  C04 payment and C08 exact restoration still require their own evidence.
- The phone's reported Paris layout defect was inspected read-only: CSS viewport
  360px; unavailable button width 201.59px, label width 151.69px and height
  29.02px (two lines), icon width 14.95px. The current source shortens the label
  to localized “Unavailable here”, prevents icon shrink and reduces its gap.
- Entry had no browser online/offline listeners. The repair updates the gate
  on both events, invalidates pre-disconnection eligibility/content requests,
  and retries the ordinary entry/Firebase/location path on reconnect. Browser
  connection transitions remain distinct from a backend-only outage.
- Focused regression cases cover repeated transitions and a late eligibility
  response after disconnection. They are added but not executed: the current
  Angular test command would start an additional compilation path during the
  owned dev watcher. Do not record them as PASS.
- The existing frontend watcher compiled the repair successfully at
  19:09:49.421Z. The English/Hungarian .102 bundles and all three generated
  Mongo seeds pass `audit-i18n-mongo-seed.js`. Actual updated-phone layout and
  native event recovery remain pending on the new candidate; no page APIs,
  browser state or production test parameters were replaced to prove them.
- Stable C01–C08 actions and the cross-guide coverage table are in the linked
  Operator checklist. Keep detailed outcomes here and the parent row partial.

### `OPERATOR-REGISTRY-LIFECYCLE-001` — registry and community

- Register one disposable local binding, complete one claim/link path, inspect
  its leaderboard/community projection and synchronize one measurement period.
- Disconnect and reconnect through a new enrollment, preserving local data and
  local member/Admin access. Resynchronize retained sources, then restore the
  disposable QA baseline.
- Protocol abuse, retry storms, token-security probes, announcement fan-out and
  worker failures belong to automated regression coverage.

#### Registry execution — 2026-09-16

Block 1 steps 1–4 PASS: normal UI registration reached the actual Go Registry,
retained its signed registration and zero-count installation receipt (ledger 45),
and reopened as REGISTERED without a second registration. Baseline Go counts:
4 deployments / 44 ledger entries. Paired Go/local/Mongo snapshot remains retained.
Two initial attempts failed before key creation because the dev runtime directory
was root-owned. Compose now owns directory provisioning (application UID, 0700);
the temporary fixture permission workaround was removed. Prod/E2E image demo
folder modes were corrected to 0700; packaged real directories already use API
UID10001/0700. No production deployment qualification is claimed.
The popup previously displayed success even for ERROR; it now requires enabled
REGISTERED. Native failure and success replay passed. Focused directory tests
and Registry packaging tests passed. Detailed evidence:
`guides/qa/evidence/OPERATOR-REGISTRY-LIFECYCLE-001-2026-09-16.json`.
Block 2 steps 5–9 PASS: company claim observed pending, then approved through
the normal Go reviewer CLI. Signed group projection and reopened UI agree on
one approved owner deployment. Latest deployment-view reopen retained ledger45,
audit7 and review3. Community was reopened; catalog links do not prove external
Discord/Discourse participation. Claim percentage uses the shared popup header;
creation link is inside the Client code title row. The mobile Claim action uses
shared app-menu content sizing (390px viewport, no horizontal overflow).
Block 3 steps 10–13 PASS: six completed periods March–August produced QMAU
counts 5/1/3/0/4/0 and action counts 15/9/7/0/11/0. All six reports were
accepted on their first delivery with signed receipts at ledger46–51. The
source fingerprint was unchanged and reopening created no additional reports.
Fixed a real Mongo aggregation failure by converting the activity membership
ObjectId to string before concatenation. Raw synchronization exceptions now
map to an existing translated error key; technical detail stays in server logs.
The new service regression test was added but not separately run during the
active watcher. No fresh failure UI replay is claimed.
User corrected block4: reconnect creates a new connection; local data persists
and is resynchronized, including additional qualifying records if present.
The former full local access denial/old-binding restoration assertions were
incorrect QA expectations. Next: block4 disconnect/reconnect and exact cleanup.

Block 4 steps 14–18 PASS: fresh registration retains the deployment identity but
uses a new enrollment and explicit signed reactivation; withdrawn claims remain
archived. Initial claim/lifecycle idempotency generations now include the fresh
registration key. A verified historical WITHDRAWN/inactive claim does not restore
an active claim. The final targeted Java/Go replay used deployment
`dep_57dfbce131b26640ca56aa9399ce6587`, reactivation receipt
`opa_b350ad5dedf21adbb007674a90858bd4`, and two distinct disconnect archives.
All six report identities/receipts and source totals were identical across
reconnect/synchronize. Casey opened three retained Events and Ava opened two
Reports while disconnected. Final paired reset verified exact Go archive bytes,
local state, Mongo records and all three actors' pre-launch sessions.
Mobile registration uses shared fullscreen/default-scroll configuration. At
390x350, native scrolling reached the bottom action (scrollTop100), header/X
stayed fixed and horizontal overflow was absent. Short translated disconnect
errors retain their icon size. Existing dev watchers compiled successfully.
The focused reconnect/security regression was added but not separately run;
live happy-path Java/Go replay passed. Full checkpoint: PASS.

### `OPERATOR-UPDATE-LIFECYCLE-001` — signed update and recovery

The stable checklist owns six blocks: release verification (1–3), Apply and
progress (4–7), reconnect (8–11), QA2 → QA1 UI rollback with a missing cached
installer (12–17), controlled failure/recovery (18–20), and managed HTTPS
(21–24). The user explicitly added rollback and controlled failure coverage;
the earlier exclusion of those branches no longer applies. Disabled controls
while work runs are the oracle; do not bypass them to simulate repeat clicks.

**2026-09-16 — PASS/CLOSED after migration and managed HTTPS qualification.**
Native QA1 r6→QA2 r7 job `upd_bd07f08979361e1206785f1c95e7b5c7`
completed16:58:47Z and automatically reloaded. Migration004 produced the exact
predeclared configuration hash; other retained Mongo/MinIO and five file controls
matched. Configuration now loads normally. The HTTPS worker then exposed a real
permission defect: preparation changed its runtime mount0750 to0700, so the API
could not read the successful job. Fixed in the worker with a persistent API-group
read/traverse policy; TLS-worker and numeric-ownership regressions passed.

Normal signed QA2 r8 installation/host qualification passed. Native HTTPS Apply
`tls_95a2fb42967d1ca619fbcc7c2e8220d9` completed17:11:06Z; API returned200/100%,
the popup retained Manual/qa.localhost on reopen and cleared private inputs.
The actual browser loaded that HTTPS origin; curl/openssl independently verified
its QA-CA chain and hostname. Original TLS/settings and Operator access were
restored with the versioned fixture; data checks passed before removing only
QA-owned Mongo/MinIO controls. Local release overrides were reset, the fixture
server stopped and the API recreated; all services healthy. Final VM is QA2 r8.
Earlier r5/r6 rollback evidence stands; no extra replay per user instruction.

Scope: local signed release emulation and Manual TLS with explicit QA CA.
Public GitHub/ACME, final security/smoke/performance and populated Event/Asset
migration are not claimed. The green/orange badge correction remains source-only.
Source QA1 accepts schema4; a new post-migration rollback was not executed.

**2026-09-16 — r5/r6 recovery and automatic reload PASS; HTTPS still pending.**
Voluntary rollback after successful installation was exercised through the UI in
r5, including re-download of the exact missing QA1 installer. In r6, a controlled
truncated download produced one localized error and enabled recovery actions;
the explicit healthy retry completed as `upd_8296003875315dd91f7120bc34064418`.
The subsequent voluntary rollback completed as
`upd_a7e82b8179934136ba1cc9a8557729b3`. Both r6 operations reached verified100%
and automatically refreshed/reloaded the frontend, without a reload loop.
Retained Mongo/MinIO/configuration controls passed; Event/Asset collections were
empty, so populated domain-record preservation is not claimed. QA1 has no older
recovery point after this rollback; its absent Rollback button is correct.
The user explicitly requested no further rollback replay. Current-version green
and available-version orange badge styling is corrected in source only.

The remaining Configuration/HTTPS block exposed an existing schema3 singleton
against a schema4 API. Normal QA2 r7 packaging adds declared migration004, preserving
all settings while advancing schemaVersion and optimistic version. Its isolated
Mongo and restart-order tests passed. Native UI installation and exact planned
post-migration hashes are being checked before the managed HTTPS flow. This row
remains IN PROGRESS until HTTPS and fixture cleanup are proven.

**2026-09-16 — Independent progress and exact-image upgrade PASS.**
Normal monitor QA1/QA2 r4: job `upd_d1194357f035a4a47afcd280169e1995`
completed16:00:12Z. The original popup reached100% without reload, with209
monitor responses and real installer phase feedback while the API was down.
Actual QA2 image identities/health and retained Mongo/MinIO/configuration controls
passed. Reopening the popup made no release request; only explicit Check fetched
again and Update stayed hidden with no newer version. Prior r3 failed exact-image
verification because the worker inherited pre-install image variables; the restart
helper now reads the installed selection, with upgrade/rollback regression proof.
User clarified that Rollback must remain available after successful installation,
for later-discovered functional defects. That UI correction and removal of the
lower duplicate success notice pass76 focused tests; QA2 r5 is being packaged.
Voluntary success rollback is a distinct pending branch, not a failed-install test.

**2026-09-16 — Local signed-source replay; popup recovery PASS.**
The normal current-source QA1/QA2 packages in `local-rollback-qa{1,2}-20260916-r2`
replaced the historical candidate for this run. Native Apply created exactly one
job, `upd_e706a97a8ab99457775c37903b5cadab`, completed at14:42:46Z. The original
popup recovered through API restart to100% without reload; both controls were
locked while running. Update remained disabled after success and a new Check
with no newer release. Signed installation, exact image health and retained
Mongo/MinIO/configuration controls passed. Reopened QA2 exposes its exact QA1
recovery point; rollback has not yet been invoked. The user then requested a
host progress reader that remains available while the API is down. Source tests
pass; corrected `monitor-qa{1,2}-20260916-r2` packages are being prepared and
installed for that new live round. Earlier failure evidence below is historical.
Rollback, controlled failure/retry and managed HTTPS remain unproven.

**2026-09-16 — Actual QA1 r2 → QA2 Apply; restart tracking defect.**
Full current-source QA1 r2 (SHA-256
`6e693064bd2e08c5638cabaf9b87de7b4a560f171619dbf8d11aa71e91bdbcff`)
resolved the missing actions. Block1 discovery and verification passed without
Registry enrollment. One native Update deployment click started
`upd_ec17edbf732bdebb08d37b9b3e55dd6a` at13:53:44Z; the worker completed at13:57:20Z
with verified QA2 installed and healthy. Both controls were disabled during
installation and after popup reopening. No second Apply or automatic backup.
The API restart caused the UI to stop polling at85% and show a raw HTTP error:
block2 tracking FAIL despite successful installation. Source now retains the
job/cursor across transient read failures, never repeats Apply, localizes actual
errors, disables both controls while running and releases them after terminal
failure. No automatic page reload. The two focused spec files yielded45/46 PASS;
all eight new regression cases passed. The unrelated failure concerns an obsolete
claimed-group popup header expectation. Source fixes are not installed on old QA2.
Retained users/configuration and owned Mongo/MinIO controls, plus five configuration,
key and certificate hashes, all match after Apply. Event/Asset collections are
empty; populated domain preservation is not proven. Fixture controls remain staged.
Block3: retained Operator access works, but historical QA2 discovery calls Registry
announcements and fails409. Block4: Rollback is absent; no CLI substitute executed.
Current-source QA1 r2 is not published and differs from the old published QA1;
exact previous-artifact identity must be preserved for recovery. The full row
remains IN PROGRESS; controlled failure and managed HTTPS are also outstanding.

**2026-09-16 — Current-source QA1 baseline and first live defect.**
The user replaced the historical-backport plan with a complete normal production
build of the current source as `1.0.0-qa.1`. That full package was signed,
installed and passed its packaged qualification. All seven application
containers are healthy; five retained configuration/key/TLS hashes match.
Actual installed build: `qa1-current-20260916`; package SHA-256
`dccb73a9f62f56e533ffb58577776cd826dc399fbcd49f0a955a6fb0cd8be9d1`.
The existing managed Operator browser shows QA1 and discovers GitHub QA2 with
Registry uninitialized. No Apply request or update job was created.
Live FAIL: the Updates popup omitted both action buttons because inline
`app-menu` was configured as `list`, an unsupported inline layout. Corrected to
`row`; a full current-source QA1 r2 package is being prepared for replay.
The compact version badges and dim backdrop requested by the user accompany
this build; no separate cosmetic test campaign is scheduled.
The full update/rollback/failure/managed-HTTPS chain remains IN PROGRESS.
Earlier preparation evidence below retains its original artifact identities.

**2026-09-16 — Preparation only; functional steps NOT RUN.**
Evidence: `../evidence/OPERATOR-UPDATE-LIFECYCLE-001-2026-09-16.json`.
Dev is stopped. VMware SSH and authenticated guest sudo work. The versioned
forwarder exposes workstation localhost ports 80/443 to the same VM ports;
HTTPS health returns UP with the exported public bootstrap certificate trusted.
VM baseline snapshot operator-update-baseline-20260916 completed at11:34:12Z.
The root LV was expanded10→18.22GiB from existing free extents;8.8GiB free.
Before baseline installation, the installed image-manifest bytes matched the
published QA2 artifact's manifest.

The published QA1 baseline was downloaded and its digest verified. Both QA1 and
QA2 DEBs internally declare version 1.0.0. The actual worker requires a newer
version, plus signed release metadata matching the DEB; database version edits
cannot replace that contract. Published assets lack signed manifests, and the
VM lacks a pinned release key. The user explicitly requested installing the downloaded historical QA1
baseline: digest-verified installation and package-provided qualification
passed. The installed image manifest matches QA1 and certificate-verified
HTTPS health is UP. No signed-release verification or UI Apply PASS is claimed. Source inspection finds phase/percentage UI, but no UI rollback
action; live disabled/progress/error/recovery checks remain pending. Resolve
release prerequisites and missing recovery capability before claiming the
requested QA1 → QA2 → QA1 chain. Preserve all completed Operator evidence.

**Block 1, step 1 — QA1 UI observations; fixes deferred as requested.**
The existing deployment-local Operator credential successfully opened the real
Operator workspace through `https://localhost`. The Updates popup is open.
This is access/UI evidence, not a completed release-verification block.
The user subsequently authorized fixing UPDATE-UI-01/02 in source while QA
continues. Other findings remain queued; the published QA1 VM is unchanged.

| Finding | Observed behavior | Required correction / retest | Status |
| --- | --- | --- | --- |
| UPDATE-UI-01 | On the narrow QA1 viewport, the two actions share one row and `Deployment is current` is truncated. The popup also reserves a large empty body below them. User screenshot: `Screenshot from 2026-09-16 13-43-55.png`. | Use two action rows when needed and/or size the popup body to its content, using shared component configuration. Verify readable action labels and proportionate empty-state height on the reported narrow viewport and desktop. | SOURCE FIXED — shared menu list layout and content-sized Updates body; live candidate retest pending. |
| UPDATE-UI-02 | Block1 step2 Refresh returned409 on the unregistered QA1 deployment. The UI exposes a long raw HTTP error with the internal URL and `409 OK`; the user reports that the icon is covered. `Deployment is current` remains visible after the failed lookup. | Show a short localized registration prerequisite message without internal URL/raw diagnostics. Keep the icon unobscured and text within the popup; do not imply that release currency was verified after a failed lookup. | SOURCE FIXED — translated discovery errors, non-shrinking icon, bounded wrapping, and no current-release claim after a failed lookup; live candidate retest pending. |

Source verification:22/22 Operator HTTP-service tests PASS; Angular template/type
compilation (`ngc --noEmit`) PASS. EN/HU seeds regenerated. The full i18n audit
remains blocked by the pre-existing landing `loading` key reference (line383);
the initial broad spec compilation also encountered unrelated existing spec
type errors, before the focused test compilation passed. No live UI retest of
these source fixes has been claimed.

Block1 step2 is blocked on Registry/release fixture preparation, not PASS. One
visible Refresh was executed; the signed-release lookup and upgrade remain unproven.
### `OPERATOR-REVENUE-LIFECYCLE-001` — revenue

- Open Revenue for one controlled captured/released payment set, synchronize
  once, compare totals and one settlement, then reopen the persisted result.
- Failure injection, retry/idempotency and exclusion rules belong to automated
  regression coverage.

**2026-09-16 — Revenue full-flow PASS, exact paired cleanup complete.**

Evidence: `../evidence/OPERATOR-REVENUE-LIFECYCLE-001-2026-09-16.json`.
The versioned Revenue fixture prepared nine payments and retained the original
controls. One visible Synchronize accepted 16 completed-day reports, each at
revision 1, with signed receipts and no pending/blocked delivery. Both eligible
providers were included exactly once; authorized, released, dummy and non-payment
audit controls were excluded. EUR overview: 4850 minor / four payments; USD:
4000 / one. Completed daily reports: August 31 EUR3000/count2, September14
EUR750/count1, September15 USD4000/count1; other completed days were empty.
Current-day EUR1100 remained in the overview and was not delivered early.

For block3, normal backend claim/measurement APIs and the Go review CLI prepared
the already-tested eligibility prerequisite. The Go monthly calculation produced
August EUR basis3000, pool150 and a signed revision2 settlement including this
operator group. Its small share legitimately rounded to zero minor units; the UI
matched the signed allocation. Revision1 had been calculated before eligibility
setup; daily revenue report revisions remained1. Native close/reopen preserved
the displayed totals/settlement, and exact pre/post report/source oracle bytes
matched. Source payments and excluded controls remained unchanged.

Checklist terminology was corrected to the existing contract: daily durable
Revenue outbox delivery, not a separate Admin Jobs row; monthly signed network
settlement, not per-booking settlement; local source identities stay local.
No application behavior was changed for Revenue. Paired reset restored Go bytes,
local node state, Mongo/session baseline; final status had no staged fixture,
owned payments or Revenue reports. Managed browser closed.

**Queued next:** Operator Update on the user's VMware target, after they open it.
Read-only gate currently reports zero running VMs. Deployment, real-account UI
image smoke, repeatable external security and measured infrastructure efficiency
use the separate deployment qualification tables, not extra pair-QA rows.

## Consolidated executable journeys and source-oracle archive

The matrix contains 103 executable journeys after provider behavior was moved
into its owning Event/Asset rows and the five obsolete standalone Payment rows
were replaced by one Event-owned side-menu Payment checkpoint, and the
six non-Pair-QA Deployment rows were removed. Nine planned Operator rows were
consolidated into four screen-level journeys. All 88 passed rows remain
individually immutable, including their owning `QA domain`, ID, status,
contract and evidence. Non-PASS microcases from the earlier 190/212-row planning stages
were consolidated into complete lifecycle parents. Assertions below belong
either to automated coverage or bounded parent subassertions; an old source ID is
not an independently scheduled test unless it remains a current CSV/XLSX row.
The consolidated parent rows in the matrix and the handoff's resume pointer
are authoritative.

The tables below are therefore a source-oracle archive for the consolidated
parents, not an instruction to recreate microtests. Runtime execution uses at
most three browser identities at once; mobile observations replace, rather
than add to, one desktop phase when three desktop accounts are already active.

All current rows belong to one Pair-QA queue. Operator is a normal domain.
Local Admin work is distributed to its actual capability owner, and the
overview reports one total across every current Pair-QA row without a separate
scope branch, legend or total.

The four current Operator parents are
`OPERATOR-CONFIGURATION-LIFECYCLE-001`,
`OPERATOR-REGISTRY-LIFECYCLE-001`,
`OPERATOR-UPDATE-LIFECYCLE-001` and
`OPERATOR-REVENUE-LIFECYCLE-001`. The detailed Operator tables below are
source assertions for those parents, not additional scheduled Pair-QA rows.

```text
QA-EXPANSION-CP01 -> QA-EXPANSION-CP02 -> QA-EXPANSION-CP03
-> QA-EXPANSION-CP04 -> QA-EXPANSION-CP05 -> QA-EXPANSION-CP06
-> QA-EXPANSION-CP07 -> QA-EXPANSION-CP08 -> QA-EXPANSION-CP09
-> QA-EXPANSION-CP10 -> QA-EXPANSION-CP11
```

### Retired source archive — payment authorization and provider callbacks

These former standalone Payment cases are not current matrix rows or separately
scheduled pair-QA tests. Their product-visible requirements moved to
`EVENT-CHECKOUT-001` (Stripe), `ASSET-CHECKOUT-001` (Barion/3DS)
and `PAYMENT-METHODS-HISTORY-001` (side-menu history/cards). The obsolete
standalone checkpoint guides were removed; the table below retains their
implementation-oracle history.

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `PAYMENT-STRIPE-001` | Select Stripe and press the existing Checkout action once. | One stable internal payment creates one manual-capture Checkout/PaymentIntent and redirects to the simulator; basket is `pay/pending`, membership/ticket/counters remain unchanged. |
| `PAYMENT-STRIPE-002` | Choose the 3DS route and approve it once. | Signed `requires_capture` webhook produces one `authorized` payment and one membership fulfillment; the amount is held but not captured and a duplicate callback is a no-op. |
| `PAYMENT-STRIPE-003` | Run decline, customer-cancel and timeout from independent clean sessions. | Each payment reaches its exact failed/expired terminal state without membership, ticket, counter, capture or leaked provider data. |
| `PAYMENT-STRIPE-WEBHOOK-001` | Send valid, invalid-signature, wrong-provider, wrong-amount and wrong-currency callback variants. | Only the correctly signed, scope-matching PaymentIntent mutates the payment; every rejected request leaves payment, booking and gateway-operation collections unchanged. |
| `PAYMENT-STRIPE-WEBHOOK-002` | Replay one accepted callback and then deliver older/later states out of order. | Processed event identity and legal transition guards prevent repeated join, regression from a terminal state or duplicate release/capture work. |
| `PAYMENT-BARION-001` | Select Barion, start DelayedCapture and authorize once; separately call the public callback with a malformed `PaymentId`. | Valid callback contains only a GUID `PaymentId`; MyScoutee reads v4 PaymentState, persists `Authorized`, fulfills once and retains provider-local transaction IDs without capture. Malformed IDs fail before credential resolution or provider traffic. |
| `PAYMENT-BARION-002` | Exercise direct approval plus bank-challenge approve, decline, cancel and timeout independently. | Each branch maps to the provider-neutral state once; unsuccessful branches create no membership/ticket/capture and callback replay is idempotent. |

### Retired source archive — payment settlement, compensation and isolation

These obsolete standalone checkpoint guides likewise have no current
executable row and were removed. The table remains source-oracle history and
must not be run as a second payment suite.

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

The current free/no-payment control is `ASSET-BORROW-001`; the
Cash-only paid control is part of `EVENT-CHECKOUT-001`. Provider
registration, expired-card notification/cleanup and Payment History are one
checkpoint:
[`PAYMENT-METHODS-HISTORY-001.md`](../checklists/event/PAYMENT-METHODS-HISTORY-001.md).

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
| `OPERATOR-BRANDING-001` | Change product name, logo character/image, home label and theme, save, explicitly reload one consumer and verify one fresh client, then restore. | Public configuration revision changes once; header/entry/PWA branding matches the persisted revision after explicit reload/fresh load and rollback restores the prior revision exactly. Automatic refresh in an already-open client is not required. |
| `OPERATOR-PRIVACY-001` | Save valid controller/contact values, test invalid partial/email input and restore. | Public deployment config exposes only the valid pair; invalid save is atomic and neither operator secrets nor unrelated branding changes. |
| `OPERATOR-SOCIAL-001` | Add, reorder and remove one HTTPS social link while trying an invalid scheme. | Valid normalized links appear in declared order; unsafe/malformed URL is rejected server-side and restore returns the exact prior list. |

### `QA-EXPANSION-CP04` — Operator Firebase and Notifications push

The stable tester guides for the open Notifications domain are collected under
[`checklists/notifications`](../checklists/notifications/). Execution status
and evidence remain in this pack and the matrix rather than those guides.

This is QA-environment Pair QA, not a live-system deployment test. Operator
owns configuration, verification, activation, one fresh sign-in and rollback.
Notifications owns device registration and the deferred `CHAT-PUSH-001`
producer/control flow: Casey sends one ordinary participant message, Nova stays
foreground as the no-system-push control, and Riley is the background/closed-
app target.

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `OPERATOR-FIREBASE-001` | Save, verify and activate one Firebase configuration, then restore the prior configuration after the login check. | Tested/active state changes once, the existing Operator session stays usable and restoration returns the prior login mode. |
| `ENTRY-FIREBASE-REG-001` | After activation, complete one eligible fresh sign-in and repeat login. | One subject/email links to one application user/profile, reload reuses it, the Operator recovery control stays valid and no demo/global collision occurs. This assertion is a block inside `OPERATOR-CONFIGURATION-LIFECYCLE-001`. |
| `MOBILE-PUSH-001` | Keep the phone app visible and produce one target notification from a desktop actor. | Foreground listener shows one in-app notification/counter, no duplicate system notification and the backend inbox/outbox/token identities agree. |
| `MOBILE-PUSH-002` | Background, then fully close the phone app and produce one target notification. | FCM displays one system notification while the app is not open; no desktop actor receives it and the persisted unread count stays one. |
| `MOBILE-PUSH-003` | Tap the closed-app notification and let the WebView cold-start. | The authenticated target route opens once, matching inbox row becomes read only after the intentional open, and back/relaunch does not repeat the action. |
| `MOBILE-PUSH-004` | Deny permission, rotate/revoke the token and later grant permission. | Denial is non-blocking, stale token failure is safely retired/replaced, and a later message reaches only the new token without leaking token text. |

#### Mobile Push device preflight — 2026-09-15

User explicitly delegated the entire `MOBILE-PUSH-LIFECYCLE-001` flow to Codex,
including physical-device and browser actions. This authority persists for this
checkpoint. Shared WebView evidence remains PASS/CLOSED and was not replayed.

Read-only resume gate at approximately 09:02 UTC: **BLOCKED / DELIVERY NOT RUN**.
The current runtime differs from the saved closure boundary:

- Existing dev containers are running; backend and frontend watcher are healthy.
  No build, restart, fixture mutation or browser launch was performed. Available
  memory was 6.3 GiB with zero swap use.
- Physical Android `22126RN91Y` is ADB-connected. Original localhost WebAPK
  `org.chromium.webapk.af8b7eef107d7742f_v2`, version 1, remains installed and its
  native `POST_NOTIFICATIONS` permission is granted. Phone page/session/build
  and browser-origin permission have not yet been inspected.
- ADB reverse and forward mappings are empty. The versioned build-route status
  reports `phoneRouteActive=false`; current server `/app-version.json` reports
  `4be4a1c596e2-20260905140310`. Do not infer this is the phone's cached build.
- Direct, masked `demo_db.deploymentConfigurations` projection: Firebase
  revision **0**, **inactive**, both tested revisions null, both tested timestamps
  absent, both credential envelopes absent, and all checked public client fields
  absent (`apiKey`, `authDomain`, `storageBucket`, `messagingSenderId`, `appId`,
  `vapidKey`). Public `/api/deployment/configuration` returns 200; the exact
  `/api/deployment/configuration/firebase-config` endpoint returns 404.
- Casey, Nova and Riley exist (ObjectId identities); each has zero device
  records and zero provider tokens. No raw credentials or tokens were printed.
- Versioned `status mobile-webview MOBILE-WEBVIEW-LIFECYCLE-001` is `not-staged`.
  Both common checkpoint and browser-session snapshot collections are empty.
  `chatMessages.text` and legacy `chats.messages.text` contain zero messages
  with this checkpoint's exact prefix. No controlled Chat was staged or sent.

Next dependency: locate the user's prior disposable QA Firebase configuration
or backup, then restore it through the supported configuration workflow and
verify its real Authentication/Messaging activation gate. User was asked only
for its local path, never for secret contents in chat. Afterwards restore the
versioned phone transport/build route, establish Riley's authenticated single
real-device registration and controlled Chat baseline, and use the configured
managed launcher before the first ordinary message. No product failure or FCM
PASS is claimed; no other Notifications checkpoint was started.

Continuation supersedes the initial missing-configuration blocker. Ignored local
project Firebase service-account/public-config files were present and restored
through versioned setup. The Push fixture adopts the retained configuration
snapshot and prepares active revision 1 from prior provider evidence; its
capability markers are prepared prerequisites, not newly observed Operator
tests. A genuine disposable Firebase Riley identity and normal browser-issued
FCM registration were established. Raw credentials/tokens remain local only.
Baseline captured at 09:22:20.836Z: Casey/Nova/Riley unread 0/0/1, exactly one
Riley web-pwa registration and zero controlled messages. Managed Casey/Nova
sessions and original Android localhost WebAPK are retained; versioned ADB
transport and reversible keep-awake preparation are active.

The first attempted marker and user extra `ggg` never persisted: demo WebSocket
callbacks lost request mode/authentication context and returned 403. The scoped
mode/security-context repair compiled through the existing backend owner at
09:30 UTC; no standalone test build was run. At 09:35:25Z the user's `haha`
message persisted as `c0f060ab-c088-4e53-a538-63bb97bc5ce4`; this is the foreground
phase's actual message, replacing its suggested marker. Codex detected the
user's send and did not send a duplicate. Nova/Riley each gained one unread
inbox row; Casey remained excluded, counters 0/1/2. The phone remained visible,
Chat/Notifications closed, with zero Android QA system notifications.
Real provider delivery is currently FAIL/unproven: Firebase Admin 7.1.1 batch
send receives HTTP404; the same outbox remains pending for retry. SDK/gateway
migration is underway; preserve this transaction for its normal retry.

User-reported menu regression was repaired without reopening the WebView
journey: the avatar Install/Permissions action is always present, its label
uses actual install availability, and both entry paths leave the menu open.
On lifecycle38 (`mobile-webview-lifecycle-1789464566357`) the original physical
installed PWA shows `Engedélyek`; popup has permission controls without the
install section. After real popup open and close, the menu remains open.
Frontend owner's existing build succeeded at 09:28:29Z. Foreground FCM and all
later Push phases remain open. Provider-account cleanup, exact fixture/session
reset and saved screen-setting restoration are required at closure.

Foreground continuation at 09:42 UTC: user also sent `proba`, ID
`7dad4235-7427-42a8-ad15-1bf20356c094`; both messages were explicitly adopted
into the foreground fixture evidence/cleanup manifest. User clarified clicking
the Chat channel badge, rather than the Notifications New row. Nova's two rows
became read through that ordinary Chat path (09:36:06Z and 09:40:32Z); Riley's
rows stayed unread. Phone Notifications New list visually showed both Chat
rows once plus the pre-existing security row; unread total 3.

Firebase Admin 9.10.0 / sendEach migration compiled through the existing owner
at 09:38:43Z. The backend was restarted alone to load the new dependency and
was ready at 09:40:15Z (public configuration HTTP200). The previous runtime's
NoSuchMethodError left one outbox lease/rule running; the guarded fixture
`recover-foreground-worker` captured and released only that stopped worker's
state without changing message/inbox IDs, retry history or delivery outcomes.
Both actual outboxes became sent at 09:41:53Z, each tokenSuccessCount=1 and
tokenFailureCount=0; no duplicate inbox rows. This proves provider acceptance.

Foreground native result is **FAIL**, despite persisted delivery savepoint
`foreground`: the visible phone displayed a system notification for `proba`.
The custom app-sw push handler unconditionally called showNotification and
ignored visible clients. Scoped repair adds a visibility/scope guard and
preserves the supplied notification tag. Four direct Node worker tests PASS
(visible/background/closed/out-of-scope); no compiler was started for them.
Existing frontend watcher synchronized at 09:43:16Z. Candidate lifecycle39
`mobile-webview-lifecycle-1789465435253` is served; activation and one focused
foreground replay remain next. The previous QA system notification was closed
without marking its inbox row read. No background phase PASS is claimed.

Foreground replay **PASS** at 09:46 UTC on active lifecycle39. User clicked
Send after Codex prepared the exact marker; duplicate-send guard prevented a
second action. Message `5e9f8221-f05e-4f7f-80e9-dd4b15f7b355`, outbox
`6aa913b2f59d38d912af4208`, sent09:45:24.516Z, retry0, tokenSuccess1/failure0.
Exactly one new unread inbox each Nova/Riley; Casey excluded. Counters 0/1/4,
including the retained earlier messages and Riley security baseline. Phone
visible, controlled Chat closed, worker getNotifications empty and Android
notification records zero. Notifications New list shows marker exactly once,
still unread. Nova visible with Chat closed and one new badge, no registered
provider device. `foreground-replay` savepoint09:46:03.267Z retains the exact
post-fix transaction. Next: section2 Home background; earlier failed native
foreground evidence is superseded only by this focused replay.

Home background PASS09:48Z: message5dfaba47-9347-4396-9429-e6f9945b66a9, outbox6aa9141df59d38d912af420b sent09:47:09.912Z retry0/success1/failure0. Phone hidden received exactly one worker notification with exact Chat tag/url; Android record1 before resume. Recents card return preserved timeOrigin1789465508440.1. New list row exactly once unread; counters Casey0/Nova2/Riley5. Background savepoint09:48:15.943Z. Settings variant next.

Settings background PASS09:49Z: message6e4df2b0-9c9e-45cc-9125-e5fa721256e8, outbox6aa91489f59d38d912af420e sent09:49:00.318Z success1/failure0. Android Settings activity foreground, app hidden; one native/worker notification with exact background-settings body and Chat tag. Recents return preserved timeOrigin1789465508440.1; New list exact row once unread, counters Casey0/Nova3/Riley6. background-settings savepoint captured. Chrome variant next.

Chrome background remains NOT PASSED: marker957517eb-0600-4055-81a0-06eb3f205257 outbox6aa914e9f59d38d912af4211 sent09:50:36.165Z success1/failure0, two unread inbox rows, but native shade retained previous Settings notification. With Chrome example.com foreground, PWA Notification.permission and Permissions API both denied while old UI signal still granted. Returning to installed PWA restores native granted. Native WebAPK permission granted; Chrome host permission denied USER_FIXED. No OS permission toggle was changed. User requires enabling through shared popup and backend device data through users poll -> shared signal, no lazy popup read. Backend users.devices already owns registration writes; added token-free notificationDevices projection to existing realtime response and signal propagation through side menu, HTTP/local adapters and popup with draft preservation. Native visibility/permission onchange observers added. Existing backend build passed09:58:40Z; frontend local mapper union fixed, final owner build passed10:01:47Z. Lifecycle41 1789466529464 now being activated. Direct live popup signal oracle and native replay remain pending; earlier foreground/Home/Settings passes retained.

Users-poll signal oracle PASS on lifecycle41: original real Riley device remains unchanged. Guarded popup-registration-off wrote only notificationsEnabled=false while preserving token/device; normal poll2 projected false and popup displayed off with native permission still granted. popup-registration-restore restored exact enabled=true. While the same popup stayed open and unedited, normal poll3 changed its switch from false to true. No popup fetch, reload or native permission mutation; both fixture operations retained exact identity and restore evidence. Backend DTO exposes only deviceId/notificationsEnabled. Remaining native Chrome permission-state observation and Chrome delivery are still open.

Permission repair continuation: lifecycle42 confirmed the real shared popup request returns denied under Chrome Android app-level USER_FIXED denial, keeps the popup open and displays the translated blocked message. Native permission observation now agrees with the popup signal. The user explicitly authorized temporarily enabling Chrome system notifications and restoring the saved original denial after QA. Native Settings Show notifications was enabled; Android subsequently confirmed granted=true. This is recorded environment preparation, not a popup ability to override an OS denial. Original snapshot retained in the ignored device runtime folder.

Chrome background replay PASS, section2 steps5–8: message65fe8c07-e273-4d42-87a8-d56f82e80e09, outbox6aa91b0af59d38d912af4216 sent10:16:44.547Z retry0/success1/failure0. Chrome non-QA page foreground; PWA hidden with permissiongranted. Worker and native shade displayed exactly the new background-chrome-replay body and Chat tag before resume. Recents return retained timeOrigin1789467344102.6; Notifications New list contains the exact row once and unread. Casey0/Nova5/Riley8; one Riley registration, restored platform web-pwa, other actors zero. Failed Chrome diagnostic retained separately; background-chrome-replay capture advances only the affected phase. Next section2 step9, closed-app branch.

Cold-start section2 steps9–11 NOT PASSED: swiping only MyScoutee out of Recents left zero localhost QA pages and no QA WebAPK activity. Message660828b8-0eab-4f49-8579-90160b314511, outbox6aa91ba9f59d38d912af4219 sent10:19:25.005Z success1/failure0, exact two unread inbox rows. Native shade retained the preceding Chrome replay. Android ActivityManager records Chrome12687 launched by Google Play Services FirebaseInstanceIdReceiver12:19:24.619 local time, then lowmemorykiller killed it12:19:26.969; exit-info reasonLOW_MEMORY. Thus provider acceptance is not system-delivery PASS.

Targeted route-only diagnostic with the QA app closed and the separate Chrome host resident: message9590b1f9-804b-4a17-803a-2ff37dbd353c, outbox6aa91c65f59d38d912af421c sent10:22:31.062Z success1/failure0. Exact native cold-start-route notification appeared. Tapping it launched original standalone Riley app timeOrigin1789467774147 but left /game?chatId=manual-qa-checkpoint:v1:mobile-push:group-chat on Home with zero Chat popups and zero read transitions. Section2 step12 FAIL, step13 not yet exercised. This resident-host diagnostic does not supersede the stopped-host LOW_MEMORY failure. Nine messages retained, Casey0/Nova7/Riley10; fixture phase remains background-chrome. Next required repair is missing notification deep-link consumption plus target-only message/read context; no frontend route edit has been made yet.

Correction and rollback at user request: the queue/inbox redesign exceeded the intended scope. The direct-inbox branch, NotificationContent type, changed dispatch return contract, worker scheduling gates, repository lookup and associated tests were all removed. The incomplete Chat/message deep-link edits were also rolled back. Application source is back to the pre-investigation committed state; earlier Firebase SDK, foreground worker, menu and users-poll fixes remain intact. The35 passing tests applied only to the withdrawn design and are not evidence of current behavior. The original worker already returns before Firebase delivery when isFirebaseEnabled is false; the existing queue/inbox/WebSocket sequence is unchanged. Section2 step12 remains an observed unresolved defect, not PASS. No additional device action or message followed the rollback request. Retain the approved temporary Chrome notification grant and original-state snapshot with the active fixture for continuation/cleanup.

Cold-start focused replay, section2 steps9–13 PASS on lifecycle43 (1789469081349): message1f0959d0-22cc-4a21-8d82-23c8e03f06c3, outbox6aa9220df59d38d912af422b sent10:46:39.426Z retry0/success1/failure0. QA PWA swiped from Recents, zero QA pages/activity before send; exact native notification observed before tap. Tap created one standalone Riley document (timeOrigin1789469234143.1), one correct Chat popup, matching target/highlight ID, and consumed the URL to /game. Exactly Riley inbox6aa9220df59d38d912af422d became read at10:47:19.228555542Z; earlier background rows remained unread. Android Back followed by normal launch produced /game, zero Chat popups and timeOrigin1789469575318.8; persisted inbox unchanged. Counters Casey0/Nova8/Riley10. cold-start-replay savepoint captured10:53:33.737Z. This proves the closed QA PWA path; it does not prove delivery with a stopped Chrome host, whose earlier LOW_MEMORY failure remains recorded. Focused ChatService target-only-read and ordinary-first-page regressions both passed (2 tests); owning backend/frontend watcher builds passed for that candidate.

Current user-authorized extension before section3: snapshot Firebase enabled/disabled and each recipient's eligible device registrations in the existing outbox message. Worker follows that saved decision; retries retain its identity and decision. Device revocation/rotation must not retarget old messages. Preserve inbox/queue/WebSocket ordering. Menu notificationPreferences.muted currently suppresses in-app attention, while persisted inbox/counter remain; device notificationsEnabled is separate. Snapshot implementation and focused checks are in progress; permission/token physical steps have not yet run.

Saved Firebase/device decision verification PASS: eight new decision tests plus six existing worker tests (14 tests, zero skipped/failures). The real already-running Mongo instance verified save/read and atomic pending-recipient merge using an isolated temporary collection, removed in finally; an older per-user deny decision survived two stale-reader recipient additions without a duplicate outbox item. Earlier attempts failed on test-harness Mongo authentication, corrected to the existing scoped QA account; no application change was made for those failures. No duplicate main compiler was started. Current decision tests cover config-off, absent/denied devices, unchanged inbox audience, stable identity/decision on retry, changed runtime config, and exclusion of new/revoked/rotated devices.

Section3 step14 physical denial reproduced a synchronization defect: QA WebAPK POST_NOTIFICATIONS=false and Notification.permission=denied, while backend device4efd1d0e-caac-4f72-9566-2212a6f2759b stayed notificationsEnabled=true. Personal menu preference remained muted=false; effective in-app attention muted=true from native denial. No denial-marker message was sent. Fix in progress: persist the observed native denial on the existing registration via its normal write route, then existing users poll/shared signal; retain device/token identity for step18. Candidate44 built; initial-load users-poll dependency requires a focused correction before replay.

Permission denial section3 steps14–17 PASS on lifecycle46 (1789470707679): native deny persisted as notificationsEnabled=false on the same device before Casey sent messagebb4ef0ae-622a-4871-b151-3abe0f3cf4cf. Outbox6aa92738f59d38d912af4230 saved Firebase=true with explicit empty Nova/Riley device maps; sent11:08:41.237Z retry0/success0/failure0. Native shade had no new denial notification. Inbox audience unchanged: one new unread row each; Casey0/Nova9/Riley11. The first attempt to open Notifications exposed an unrelated native-permission gate on the list button. Focused repair removed native permission/registration actions from the list and personal mute controls; device permissions remain in the shared setup popup. After the owning watcher build and candidate46 activation, the same denial row appeared exactly once in New without resending. Personal mute true then false persisted through normal UI confirmations while the device stayed denied and unread11 remained. permission-denied savepoint captured. Step18 shared popup off/Update removed the old registration (zero devices); guarded old-registration capture retained its opaque identity/fingerprint. Step19 popup re-enable returned native denied, leaving the popup open; restoring the deliberately denied Android app permission is now in progress before completing registration from the popup.

Replacement delivery and route, section4 steps18/20–22 PASS: popup off/Update removed the old provider registration; popup on/Update after restoring the deliberately denied OS permission registered exactly one new provider-token fingerprint, keeping physical device4efd1d0e-caac-4f72-9566-2212a6f2759b. Message869b435c-b8c1-4028-bf12-a52a7a32c2eb, outbox6aa92aa3f59d38d912af4233 sent11:23:18.547Z retry0/success1/failure0. Saved Firebase=true; Nova device map empty and Riley map contains exactly the replacement fingerprint, verified against the old-registration capture. Exact native replacement-token notification observed before tap. Tap opened one Chat with matching message target and read only Riley inbox6aa92aa3f59d38d912af4235 at11:24:04.082675091Z. Back/normal launch returned /game, zero Chat popups, timeOrigin1789471463153.3; inbox unchanged. Twelve messages retained; Casey0/Nova10/Riley11. replacement-token savepoint captured. The source bundles and all three Mongo i18n seeds now publish version2026.09.15.{en,hu}.103; i18n audit PASS. Live translated Hungarian denial message was verified on the phone and no longer mentions browser/site settings. Before the versioned seed update, all6826 live QA translation rows matched the seed; only two translated values and bundle metadata changed.

Section4 step19 native re-prompt remains NOT PROVEN after the deliberate OS-level denial: popup Notification.requestPermission returned denied with no native dialog; it stayed open with a blocked message and performed no redirect. Clearing the QA WebAPK user-set/user-fixed test flags did not restore an ask state. The WebAPK permission-history boundary is separate from browser JavaScript. Original granted OS permission was restored as fixture preparation via ADB; the subsequent popup registration and provider-token delivery passes above do not count as native-dialog proof. No WebAPK reinstall, app-data wipe, fake token or browser permission override was used. This observation did not close the checkpoint; the subsequent user-accepted closure below retains this qualification and the earlier stopped-Chrome LOW_MEMORY observation.

- **Push closure — 2026-09-15, section 4 step 23: PASS/CLOSED.** User explicitly
  requested PASS and continuation after rollback. The recorded native re-prompt
  after deliberate OS denial and stopped-Chrome LOW_MEMORY qualifications remain;
  no successful native re-prompt or stopped-host delivery is asserted.
  `rollback-mobile-push.py --apply` passed, then passed again without mutation.
  Seven retained Mongo snapshot collections compared equal after restoration;
  common managed-session snapshots were restored. Provider lookup verified the
  owned Riley Firebase account absent. Chrome's original denied USER_SET/USER_FIXED
  state and screen timeout 60000 / stay-on 2 were restored and read back.
  Independent Mongo counts: zero checkpoint/browser snapshots, controlled chats,
  messages, outbox, inbox, devices and new actor login audits/security outbox.
  The older snapshot lacked session/audit baselines: only this run's dated actor
  audits and exact login-attempt notifications were removed; historical sessions
  and audit rows were preserved. Future stages now snapshot those scopes too.
  The application and installed PWA were retained.

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

### `QA-EXPANSION-CP06` — Operator TLS and updates

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `OPERATOR-TLS-001` | Save an emulated domain/contact/challenge configuration and run validation. | Normalized config persists without private key exposure; invalid host/contact/challenge preserves the prior active revision. |
| `OPERATOR-TLS-002` | Run the real TLS worker through issue and renewal against the local/emulated challenge boundary. | Job events progress once to a valid cert/key pair, nginx uses the new generation, permissions are restricted and renewal is idempotent. |
| `OPERATOR-TLS-003` | Fail issuance/renewal after staging new material. | Current valid certificate remains active, partial files are not promoted and retry resumes from durable job state without exposing ACME/account secrets. |
| `OPERATOR-UPDATE-001` | Offer and apply one correctly signed compatible release. | Signature/content fingerprint/version are verified before replacement; job events survive restart and active version changes once. |
| `OPERATOR-UPDATE-002` | Offer invalid-signature, corrupted and downgrade releases. | Every variant fails before activation, current services/data remain intact and audit/log contains no release private key or credentials. |
| `OPERATOR-UPDATE-003` | Interrupt the update worker and reconnect to job events. | Durable phase and event sequence resume without double extraction/restart; operator UI reconstructs terminal truth after reload. |

### `QA-EXPANSION-CP07` — operator revenue and measurement

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `OPERATOR-REVENUE-001` | Synchronize one known captured payment set. | Provider, period, currency and payment counts aggregate once; authorized/released/dummy/audit-revision records do not become revenue. |
| `OPERATOR-REVENUE-002` | Produce one failed report then requeue it. | Failure is durable and secret-safe; requeue creates one controlled new attempt and the terminal report is reconstructible after reload. |
| `OPERATOR-REVENUE-003` | Open settlements around one capture and one release. | Settlement rows reconcile provider operation/payment/booking identities and amounts without combining different providers or currencies. |
| `OPERATOR-MEASUREMENT-001` | Synchronize one controlled deployment measurement period. | Exact source period, counts and valuation inputs persist once; leaderboard reads consume it without rewriting the report. |
| `OPERATOR-MEASUREMENT-002` | Fail and requeue one measurement report. | Attempt history remains ordered, duplicate work is prevented and the successful replacement leaves the failed record immutable. |

### Administration ownership and journey consolidation

The route that exposes a control does not define its capability owner. Local
Admin journeys stay in Pair QA and follow the state they read or mutate:

- `ROLE-TRIAD-CORE-001` owns authorization plus warn/report/feedback/support/
  block/unblock in `Identity & access`.
- `CONTENT-ADMIN-LIFECYCLE-001` owns revisions and idea lifecycle in `Content`.
- `BELL-RATING-LIFECYCLE-001` and
  `NOTIFICATION-ADMIN-LIFECYCLE-001` own rating/bell/rule/outbox effects in
  `Notifications`.
- `ADMIN-MONITORING-001`, `ADMIN-AFFINITY-GRAPH-001` and
  `ADMIN-PARAMETERS-001` own the remaining Administration surfaces.
- Event, Tournament, Chat and other workers remain with their actual member
  domain. Operator and Registry/network behavior remains in the Operator
  domain; provider availability is a test prerequisite, not a separate scope.
  Deployment-host qualification is not Pair QA.

The already-PASS `BASE-STAT`, `STAT-011` and `STAT-012` rows moved only to
Administration, Chat and Event respectively; their content and evidence were
not rewritten. The tables below retain the retired non-PASS source IDs as
assertion references for their consolidated parents, not as microtests.

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
| `ADMIN-CONTENT-REV-003` | Delete one inactive revision, then delete the isolated active Privacy revision. | Inactive deletion leaves its active control unchanged; active deletion automatically activates the newest remaining same-scope revision and public content never disappears. |
| `ADMIN-IDEA-LIFECYCLE-001` | Trash and restore one idea/article while a public control remains open. | Admin buckets and fresh public inclusion change once per transition; identity/media stay stable and an already-open non-live surface is recorded honestly. |
| `ADMIN-SUPPORT-SESSION-001` | Open and close one scoped admin support session. | Capability is time/actor/scope bound, sensitive actions remain separately authorized, audit is immutable and expiry/revoke immediately denies reuse. |

### `QA-EXPANSION-CP10` — Android WebView cache and ADB recovery

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `MOBILE-WEBVIEW-001` | Cold-start after a frontend version change with the previous shell/cache installed; open, close and reopen the Location popup, then exercise the Asset Source link `Paste link` button and reopen Location plus another available popup. | Service worker/WebView serves a coherent single build, promotes the new cache only after success and never mixes old HTML with new chunk names; each popup keeps its normal dimensions, content, scrolling and close behavior, and the Asset clipboard action cannot stretch, clip, blank or leak overlay state into later popups. |
| `MOBILE-WEBVIEW-002` | Background during a server-side mutation, then resume without manual refresh. | App-state/resume path reconciles user, counters and the open surface once; a stale WebView snapshot cannot overwrite the newer server revision. |
| `MOBILE-WEBVIEW-003` | Logout/account-switch with populated ticket, image and notification caches. | User-scoped data/QR/counters disappear before the next identity renders; shared public assets may remain, but no authenticated cache crosses users. |
| `MOBILE-ADB-001` | Use ADB to inspect connectivity, reverse tunnel, WebView console/network and one deliberate offline/online cycle. | Device route and certificate state are explicit, errors identify cache versus transport, offline mode exposes only its supported contract and reconnect converges without app-data clearing. |

### `QA-EXPANSION-CP11` — three-role compound workflows

The stable user-facing click guide for the local journey is
[`ROLE-TRIAD-CORE-001.md`](../checklists/identity-access/ROLE-TRIAD-CORE-001.md). Its 22
top-level sections preserve the repeatable human journey without checkmarks or
live status; this pack and the ledger remain authoritative for persisted
evidence and status.

| Testcase | Controlled action | Decisive oracle |
| --- | --- | --- |
| `ROLE-TRIAD-CORE-001` | Keep exactly one member, admin and operator session open; prove route boundaries, persist one branding revision, then execute warn/report/feedback/scoped-support/block/unblock as one continuous lifecycle. | Role UI and direct denials cause no unauthorized mutation; the authorized branding revision persists, while already-open clients may require an explicit reload; exact moderation/audit/recipient-notification records persist once; support scope revokes; block isolates only the member and unblock restores only authorized access. Automatic branding refresh is not required. |

- **`ROLE-TRIAD-CORE-001` clean replay baseline READY — 2026-08-31**:
  the versioned harness reset the reviewed partial transaction, an independent
  `status` proved `not-staged`, and a fresh stage completed at
  `2026-08-31T08:52:06.310Z`. A second read-only status proved
  `baseline-ready`: Kai is unblocked with `profileStatus=host only` and no
  previous status; both controlled reports are unresolved and unwarned; the
  controlled feedback is unresolved; branding is revision `0`; controlled
  support chat/message/notification/outbox and affinity-task counts are all
  zero; Ava's support-case status buckets are all zero; operator authority is
  intact. The managed launcher replaced the three old browser profiles at
  `2026-08-31T08:56:31.679Z` and confirmed fresh isolated Kai, Ava and
  Deployment Operator sessions on the baseline route. Use those windows
  without another reload before capturing the visual baseline.

- **`ROLE-TRIAD-CORE-001` superseded partial transaction — 2026-08-31 11:14
  CEST**: a read-only oracle observed the user's replay after it had begun.
  Branding is `MyScoutee A`, revision `1`; controlled report
  `690000000000000000000102` is warned and unresolved; the other report and
  controlled feedback remain unresolved; Kai remains unblocked as
  `host only`; stored admin support buckets are All `1` / Warned `1` with all
  other statuses `0`; controlled support chat/message/notification/outbox
  counts are `2/1/1/1`; affinity-task count is `0`. This persisted state is
  consistent with the write boundaries in checklist steps 4–6, but it does
  not mark or prove any human visual checkbox. Do not repeat Save branding or
  Warn and do not restage. The user found that the open report detail retained
  its pre-Warn report object and therefore did not change its action to
  `View chat`. The frontend now refreshes the selected report from the Warn
  response and resolves warned state from the live workspace dashboard; the
  owner watcher compiled and hot-synced that scoped fix at
  `2026-08-31 11:24:24 CEST`. No unread or menu-counter behavior changed.
  This attempt was later reset for the focused replay recorded below; do not
  reconstruct or continue it.

- **`ROLE-TRIAD-CORE-001` second replay baseline — 2026-08-31 11:32
  CEST**: the first post-fix targeted attempt persisted the warned report,
  Ava All `1` / Warned `1`, and exactly one support message at
  `2026-08-31T09:29:21.162285526Z`, but the immediate oracle found zero support
  notifications and zero outbox rows; the user observed no visible warning
  message. That failed attempt was reset. An independent status proved
  `not-staged`, a new stage completed at `2026-08-31T09:31:32.395Z`, and the
  final status proved a clean `baseline-ready` boundary with both reports
  unwarned and support chat/message/notification/outbox all `0`. Fresh isolated
  Kai, Ava and Operator browser sessions replaced the prior profiles. Ava now
  performs exactly one Warn on `No-show / unsafe event behavior`, closes the
  Warn popup, verifies the immediate `View chat` action, and stops so Codex can
  run the persisted oracle before any resend or support reply.

- **`ROLE-TRIAD-CORE-001` step-11 live bucket defect and fix — 2026-08-31
  11:42 CEST**: the replay progressed through the controlled Warn and Kai reply.
  The read-only oracle then reported support chat/message/notification/outbox
  `2/2/2/2` and, after the user's Pick then Unpick, canonical support buckets
  All `1`, Pending `1`, Warned `0`, Picked `0`, Solved `0`, Blocked `0`. The
  user's still-open dropdown instead retained Picked `1`, proving a frontend
  reconciliation failure rather than a backend transition failure. The status
  signal had attempted to recover the previous chat status from the SmartList
  source cache after the request; a normal poll may replace that cached source
  with a converted row, yielding no previous status and therefore a no-op
  delta. The frontend now passes the known pre-mutation status directly through
  the successful request boundary. The owner watcher compiled and hot-synced
  the fix at `2026-08-31 11:41:35 CEST`; it adds no list iteration, reload or
  counter query. Do not replay Warn, Kai's reply, Pick or Unpick. Reload Ava
  once for the code revision, wait one normal poll cycle at canonical Pending
  `1`, perform only the remaining final Pick, and inspect the open bucket menu
  before the persisted oracle.

- **`ROLE-TRIAD-CORE-001` feedback-delivery and filtered-row defects —
  2026-08-31 12:03 CEST**: the replay continued through one report resolution,
  one feedback resolution and further support-case actions. The versioned
  read-only oracle proved the controlled report warned/resolved, the controlled
  feedback resolved, support chat/message/notification/outbox counts `4/4/4/4`
  and two stored cases currently Picked/Pending. A direct persisted read then
  proved that the feedback-resolved text was the fourth message and
  `lastMessage` of Kai's `c-support-admin-*` moderation thread; there was no
  separate feedback chat. The feedback resolver had reused the generic support
  writer with status Solved, coupling an independent feedback notification to
  the warn case. An intermediate repair moved the text into
  `c-feedback-admin-<userId>`; subsequent review rejected that model too,
  because feedback is not a chat domain at all. That intermediate channel is
  retained here only as failed-attempt evidence and must not be recreated.

  Separately, the successful support-case response already used the SmartList
  `removeVisibleItemByIdentity` method when the updated row no longer matched
  the active filter, but its match check read a lagging component mirror. It
  now reads the current `activitiesSupportCaseFilter` store signal, so a final
  Pick performed while Pending is selected removes the row from that filtered
  SmartList immediately. It adds no component-owned array mutation, list
  iteration, refetch or reload. The running
  backend owner pipeline completed `compileJava/classes` successfully and
  restarted at 11:56 CEST; the frontend watcher completed its final build and
  hot-sync at 11:57:33 CEST. Tests were not launched in a second Gradle or
  frontend process because the running dev pipeline owns compilation.

- **`ROLE-TRIAD-CORE-001` third clean full-replay baseline — 2026-08-31
  12:05 CEST**: the failed transaction above was restored by the versioned
  reset at `2026-08-31T10:03:44.997Z`. An independent status proved
  `not-staged`; a new stage completed at `2026-08-31T10:04:15.133Z`; and the
  final read-only status proved `baseline-ready`. Both reports are unresolved
  and unwarned, feedback is unresolved, branding is revision `0`, controlled
  chat/message/notification/outbox counts are all `0`, all Ava support buckets
  are `0`, and Kai is unblocked as `host only`. The launcher replaced the old
  profiles and opened fresh isolated Kai, Ava and Deployment Operator windows.
  At that recorded boundary, execution resumed from section 1 of the English
  user guide without restaging. This dated evidence does not alter the stable
  guide.

- **`ROLE-TRIAD-CORE-001` support-row identity and notification-poll ownership
  fix — 2026-08-31 12:22 CEST**: during the third replay the user selected the
  final Pick while the Pending support bucket was active. The persisted oracle
  proved canonical All `1` / Picked `1` / Pending `0`, but the already-open
  Pending SmartList still displayed the row as Pending. The successful update
  path was calling shared `removeVisibleItemByIdentity`, but supplied
  `chats:<chatId>` while the activity-chat converter assigns support rows the
  canonical key `chats:supportCase:<chatId>`. The component now obtains that
  exact identity from `ActivityChatSingleRowConverter.smartListKeyForIdentity`
  and retains the shared SmartList removal path; no component array mutation,
  row iteration, list refetch or SmartList-core exception was added.

  A follow-up All-bucket check exposed a second predicate error: admin-service
  mode fixes `chatContextFilter` to `service` to select the support-case data
  source, while each returned moderation row still has the semantic
  `appSupport` context. Live reconciliation had incorrectly treated that route
  marker as row membership and therefore removed a status-updated row even
  under All. Admin-service matching now evaluates only the support-status
  filter: All patches the converted row, and only a row leaving a concrete
  status bucket is removed. The focused regression spec covers both branches.

  The same replay showed a separate timing conflict when opening a chat: the
  chat response immediately copied its `notificationUnread` context into
  `NotificationCenterStore`, while the notification row remained in New until
  its own poll, allowing later reconciliation to appear to restore the count.
  Chat loading no longer writes the notification counter. Its own chat unread
  and activity-row read receipt still update immediately; the related
  notification row and bell count now converge together through the normal
  notification poll from persisted read state. The frontend owner watcher
  rebuilt the affected lazy chunks successfully; the final All-bucket revision
  synced to nginx at `2026-08-31 12:27:27 CEST`. Do not restage: reload only
  Ava, confirm Unpick retains and patches the row under All, then select Pending
  and Pick exactly once so removal occurs only from that concrete bucket.

- **`ROLE-TRIAD-CORE-001` notification-only feedback and History guard —
  2026-08-31 12:36 CEST**: feedback resolution now enqueues exactly one normal
  `feedback-resolved` bell notification keyed by the feedback ID and addressed
  only to its submitter. Java uses the notification outbox directly;
  frontend-local writes the equivalent notification record. Neither path
  creates a chat, chat message, support case, chat unread delta or Chats badge
  delta. The checkpoint snapshot owns both the canonical feedback
  notification/outbox records and the rejected legacy `c-feedback-admin-*`
  artifacts, so reset removes an earlier bad replay and future status makes
  any recurrence visible.

  The App-support chat History action now derives availability and its external
  alert badge from the already-loaded admin dashboard `reportCount`. A zero
  count disables the action and the defensive click path returns silently,
  instead of opening the `Unable to open history` dialog. A positive count is
  shown as the standard red counter badge and continues to open the shared
  Reports/History SmartList above the mounted chat.

  The earlier replay was then restored through the versioned reset at
  `2026-08-31T10:51:11.225Z`; independent status returned `not-staged`; and a
  new stage at `2026-08-31T10:51:20.623Z` proved a clean baseline. Canonical
  feedback notification/outbox, rejected legacy feedback chat artifacts and
  moderation chat artifacts are all zero. Three fresh isolated browser
  profiles replaced the previous sessions. This focused replay tests only the
  disabled no-history action and notification-only controlled feedback before
  the next persisted oracle.

- **`ROLE-TRIAD-CORE-001` PASS / CLOSED — 2026-08-31 13:16 CEST**:
  the user accepted the complete 22-step visual and interaction journey after
  the original run and the focused correction replays recorded above. Those
  replays supplied persisted boundary evidence for branding save/restore,
  warning delivery, the shared support thread, live support-status bucket
  transitions, report/feedback resolution, block/unblock and final access
  restoration. The versioned broad status oracle was run once more against
  the final focused fixture. It proved that Kai, Ava and the Deployment
  Operator retained their intended identities and authorities; Kai was
  unblocked as `host only` with no previous profile status; branding exactly
  matched the revision-`0` baseline; both report controls were restored and
  unchanged by the focused replay; and all Ava support buckets plus the
  affinity residue were `0`.

  Kai's controlled feedback was resolved exactly by `admin-demo-ava` at
  `2026-08-31T11:07:11.199156350Z`. Its canonical feedback notification and
  outbox counts were exactly `1/1`, while moderation chat, message,
  notification, outbox, support-case and feedback-text counts were all `0`.
  The rejected legacy feedback channel had the same all-zero boundary, and
  Ava plus the Operator had zero self-notifications. Earlier transaction
  artifacts are intentionally absent from this terminal focused state because
  each failed or completed attempt was restored through the versioned
  snapshot reset after its evidence was recorded; closure therefore uses the
  cumulative persisted boundary oracles together with the user's frontend
  verdict, not a claim that one post-reset document still contains every
  historical transition.

## Mobile WebView physical-device execution — 2026-09-14

`MOBILE-WEBVIEW-LIFECYCLE-001`: **PARTIAL / OPEN**, executed through explicitly
user-delegated ADB/CDP on Android 14, local Chrome-installed PWA. Evidence is
retained locally at `~/.local/share/myscoutee-qa-evidence/MOBILE-WEBVIEW-LIFECYCLE-001/2026-09-14/`.

- Old `4be4a1c596e2-20260905140310` automatically upgraded to
  `mobile-webview-20260914-icon-fix`; candidate fonts loaded, no failed
  resource requests observed. Closure used force-stop of the owned WebAPK,
  not Chrome. No app-data clear or reinstall was used in the measured journey.
- Preparation initially mixed an unstamped dev page with the old production
  route: font URLs returned HTML. Activating the installed old worker and
  loading its coherent shell resolved this; screenshots retained. Candidate
  Preview badge is hidden offline too. The reported No network header wrap
  was not reproduced on the candidate.
- Riley and Nova each displayed their own controlled Ticket/QR. Ordinary Riley
  logout hid identity and revoked the client session; Nova Notifications was
  empty, with no Riley rows. **User-scope purge failed:** Riley offline Ticket
  and profile entries remained in localStorage after logout.
- Chrome background/resume retained the same page and open Notifications;
  its single mutation appeared once, counter 2 -> 3, stable after reopening.
  Settings return recreated the page; the launcher return path confounds the
  resident observation. Its row and counter were correct after reopening,
  but retained-open-list reconciliation is not proven.
- Source-link Paste produced the exact fixture URL after native clipboard
  permission. The final clipboard fixture used `clipboard.writeText` because
  Android key-combination copy did not replace the clipboard. Editor width
  stayed 360 CSS px and Cancel saved nothing. The floating notification
  trigger covered Remove link at one scroll position; record as a layout
  finding, without inventing a visibility-policy change.
- Removing ADB reverse alone retained an existing HTTP socket. Reconnecting
  the device transport closed it; a unique health request then failed. Nova
  cached Ticket/QR remained usable offline and after transport restoration.
  Uncached Game showed No matching profiles instead of explicit unavailable.
  Native Chrome SIGTRAP occurred during inspection (local crash log retained);
  cold-start opened Entry, with explicit `/game` navigation needed for the
  cached-ticket observation. Do not count this as seamless offline cold-start.
- Checklist gaps: candidate has no standalone Location side-menu entry;
  managed images use public `/media/public`, so authenticated-image isolation
  was not proven. FCM remains unconfigured and was not exercised here.

The fixture was corrected to include holder-owned participation records, not
only ticket credentials, and its status now checks both. The device login
helper now uses the canonical demo-active-user storage key. Offline local-demo
switching was initially investigated only; the later authorized development
trial below implements a narrow opt-in route.

### Opt-in demo fallback trial — 2026-09-14

The user authorized a small implementation and delegated its phone execution.
The final agreed behavior keeps an offline local demo session on reconnect:
only connectivity indicators change. A later explicit reload/reopen prefers
HTTP. A real HTTP session never switches to seed data or reloads on reconnect.
`?qaOfflineDemo=1` enables the localhost/dev trial for 50 canonical demo members;
Firebase, operator, support and synthetic QA actors are excluded.

- **PASS, physical phone:** API-only outage moved idle HTTP Anna to local `u1`.
  Canonical identity mapping was checked for all 50 members. The HTTP session
  remained separate from `myscoutee_demo_db`; name/city matched, while seeded
  counters differed. A local About marker survived save/reopen and another
  outage; the cancelled draft did not. A read-only Mongo oracle confirmed
  neither marker reached the server user. Earlier automatic live-return
  behavior was superseded by the user's no-reload rule.
- **PASS, final local reconnect rule:** restoring API connectivity left the
  local pair and time origin `1789379125506.1` unchanged beyond the next
  health-check interval, including idle. The zero-count floating offline icon
  disappeared online without reloading the local page.
- **PASS, physical phone, HTTP control with trial disabled:** blocking only
  `/api/*` made the floating and menu icons `cloud_off` while the phone still
  reported online. Existing long-poll failed, then succeeded after transport
  restoration; icons recovered without reload or identity change. Time origin
  stayed `1789378928446.2`; successful poll transfer sizes changed from 1373
  to 1371 bytes around the blocked request. No manual refresh or health call
  was used to clear the live indicator.
- **PASS, physical phone:** CDP target network emulation produced
  `navigator.onLine === false` and the same offline icons. The notification
  list still opened; its mute toggle showed `cloud_off` and was disabled.
  Reconnect restored `notifications_active` and enabled the toggle with the
  previous unmuted state, in the same page (`1789378928446.2`). This is target
  network emulation, not a radio/airplane-mode or offline cold-start test.
- **PASS, physical phone:** the offline floating control appeared when its
  unread count was zero, opened Notifications, moved by `(-90, -100)` CSS px,
  and was dragged into the existing dismiss target. It stayed dismissed during
  that outage. The initial screenshot used a small cloud marker; the final
  requested design replaces the bell glyph with `cloud_off` on all three
  controls, using one shared dark blue-grey offline palette; normal
  bell/muted-bell meaning and colors return online. The final single-cloud
  glyph was also moved/dismissed at zero unread (`1789379125506.1`).
  Final screenshot `offline-icons-grey-final.png` confirms both menu/floating
  backgrounds are exactly `#64748b -> #475569`, with white icons, distinct
  from adjacent menu buttons. Watcher build: `2026-09-14T09:50:03.791Z`.
- **PASS, compiled-code checks:** opt-in/production/Firebase/operator/support/
  unmapped-identity gates, transport versus auth/business status, independent
  session storage, prior local-session restoration, editor/in-flight-write
  guards, reconnect without reload, cold-start flag persistence, logout loop
  prevention and account re-pairing. `check-demo-failover.mjs` consumes the
  existing watcher's output; no second compiler/test server was started.
- Two early transport attempts lost their Chrome/CDP target before the
  reconnect oracle and were excluded. Later runs retained a single transport
  attachment with stdin `online`/`offline` controls. The notification permission
  sheet on the QA PWA was accepted during the delegated run.

Cleanup completed: API/network emulation stopped, trial flag and pair removed,
ordinary HTTP logout completed, and the common harness restored Anna's pre-launch
server-session snapshot before resetting the fixture. Phone is online at Entry;
local demo data remains in its separate database.

This does not prove a full internet-offline cold start or availability of all
external portraits/assets. Local changes never synchronize to HTTP. FCM remains
unconfigured, and the original Mobile WebView findings/overall PARTIAL status
remain open. Evidence is in the same local directory as the physical run above.

### Mobile cache/media continuation and relationship analysis — 2026-09-14

Overall **PARTIAL / OPEN**. The full `mobile-webview` fixture remains staged;
common session restoration and the temporary nginx route still require cleanup.

- Riley's ordinary logout removed own profile/Ticket storage and private runtime
  cache entries; public demo images remained. Nova's subsequent login showed
  only Nova's controlled ticket. This is demo-session cache evidence.
- On retained `lifecycle-3` build `mobile-webview-lifecycle-1789383083341`, a real
  transport-disconnected cold start at `/game` displayed a loaded cached avatar.
  Its enabled button opened Nova's saved Ticket and rendered its QR (1024 px).
  Restoring the recorded ADB reverse removed both offline indicators with the
  same page time origin `1789383192275`. No page reload was required.
- `verify-media-boundary mobile-webview MOBILE-WEBVIEW-LIFECYCLE-001` through the
  existing Docker fixture harness passed public image bytes/cache, anonymous,
  invalid-cookie and spoofed-demo private rejection, legacy public-to-private
  routing and public-prefix traversal rejection. The standalone Java QA client
  and its compiler launcher were removed at the user's request. Real Firebase
  image success/revocation and fine-grained visibility remain **NOT PROVEN**.
- User clarified that friendship comes from participation when an event expires.
  Code inspection finds expiry due at event end; the extra two hours belongs to
  feedback unlock. Existing Friends only checks instead hash user IDs; Asset
  Explore loads all users for this decision. This cannot prove the clarified
  rule. `userAffinityEdges` is rating evidence, not an interchangeable friendship
  source. No change to its scoring is justified by this finding.
- Member surface analysis: Event Members carries live role/status, invitation,
  check-in, organizer-only state, avatar/profile and scoped involvements. Its
  DTO mapper performs one user lookup per member; its revision currently tracks
  membership timestamps only. Participation popup reuses received involvements
  without another request. Chat Members already batches profiles per page;
  Contacts list already reads an embedded document. A completed-event friendship
  snapshot cannot replace pending/live management state. Any embedded avatar URL
  must follow profile writes and advance the member read revision.
- At the user's request, unfinished friendship model/wiring was removed pending
  this screen/contract analysis; runtime `userFriendships` row count was zero.
  Existing member/affinity functions were restored. Backend watcher compilation
  and restart succeeded; no separate application build or test server ran.

- Subsequent environment isolation correction: shared `spring.conf` restored;
  dev nginx renders a writable container-local copy from read-only templates.
  QA build/state files moved outside the web root to `server/docker/.qa-mobile-runtime`;
  only dev mounts them. The launcher rejects production/E2E and shared config
  mounts before mutation. Production packaging excludes manual QA fixtures and
  dev watcher/launcher scripts; both Docker build contexts exclude QA state.
  `node packaging/tests/mobile-qa-isolation-test.mjs` passed seven runtime-gate
  cases plus production source/context/package-selection checks. Dev `nginx -t`,
  route restore/reactivation and HTTP build identity checks passed. No production
  image/package was built or release-qualified by these checks.

- Performance continuation: Event Members now batches live profiles; home network
  reads consume minimal stored `userFriendships` pairs. Event-pair generation is
  owned by the expiry job, and indexes are initialized in both session databases.
  Affinity scoring and activity-rating reads are unchanged. The watcher compiled
  and restarted successfully. Seventeen focused tests passed (home graph 4,
  member reads 3, expiry 7, friendship projection 3). Broader test compilation
  encountered 67 errors; the three selected suites subsequently ran 120 tests
  with six failures, one corrected batch-stub mismatch and five failures outside
  the selected paths. This is not a whole-suite PASS.
- Replayable read-only timing: `profile-batch-timing mobile-webview
  MOBILE-WEBVIEW-LIFECYCLE-001` in the existing Docker harness compares identical
  full Mongo documents, warm cache, 20 alternating-order rounds. For 10 profiles:
  10 individual reads median 10.803 ms versus one batch 1.783 ms (6.06×); for 50:
  31.630 versus 3.027 ms (10.45×). This measures Mongo reads from mongosh, not Java
  mapper, transport, rendering, or total page latency.
- Phone home HTTP medians, before→after (expired application cache / warm cache):
  single 58.0→73.5 / 45.3→39.2 ms; friends-in-common 73.6→67.0 / 40.1→32.7;
  separated-friends 77.3→52.2 / 41.3→34.3; outside-network 73.3→68.8 / 41.3→38.6.
  Three cold and nine warm requests per mode. **Not a valid speedup claim:**
  the current demo's events are future events, so the corrected completed-event
  rule changes candidate totals (29→30, 1→0, 0→0, 231→496 respectively).
  Persistent completed-event/retry fixture proof and comparable populated-graph
  performance remain pending. JSON and focused-test output are retained in the
  local 2026-09-14 Mobile WebView evidence directory.

Further continuation (same checkpoint, still **PARTIAL / OPEN**):

- Actual HTTP testing exposed an unenforced `@RequiresPolicy` advisor. A Spring
  method-security registration test reproduced the bypass; marking the advisor
  as infrastructure fixed registration. Seventeen focused unit tests passed.
- One opt-in `MediaFriendshipQualificationTest` passed against the existing dev
  Mongo/MinIO/nginx/API. Its disposable namespace was removed in `finally`.
  It proved event-end-only accepted/non-organizer friendship, atomic pair upsert,
  retry idempotence, retained first-event and updated last-event metadata,
  profile/asset/event/chat visibility, friendship/chat-membership revocation,
  session revocation, public demo bytes and private `no-store` responses.
  This fixture issues its own valid media-session cookie; it does **not** prove
  external Firebase sign-in. Pair writes are atomic; this standalone Mongo
  does not provide an event-wide multi-document transaction.
- HTTP Asset/Event list filtering now uses one request-scoped indexed friendship
  adjacency read. A 100-candidate regression test verifies one read and fresh
  decisions on the next request. Direct private image checks retain their own
  current resource/session guard. Frontend-local deterministic friendship remains
  separate; the HTTP proof cannot be claimed for that adapter.
- Settings resident return passed on `lifecycle-4`, same page time origin
  `1789388858798.2`, retained open New list and Riley identity, exact count 2→3,
  one new `background-settings-resident` row. The earlier launcher-based replay
  reopened the WebAPK; its owned mutation was reset before the resident replay.
  Returning with Android Back from Settings preserved the existing page.
- On Nova's already-loaded page, disconnected QA transport left Privacy v1
  enabled/readable after close/reopen; reconnect retained time origin
  `1789386434642.6`. This proves resident cached content, not persistent policy
  content after a disconnected cold start.
- Clipboard permission was overridden only for the QA origin while its CDP
  connection stayed attached. Denied Paste showed Hungarian inline guidance;
  detaching restored the original grant, and a fresh tap pasted the exact
  fixture URL with no alert, reload or horizontal overflow. The editor was
  cancelled. The native prompt itself was not repeated by this override test.
  EN/HU offline and clipboard messages now match all three Mongo seed profiles.
- Notification-title overlap was reproduced on the phone: title right edge
  262.3 px crossed the timestamp's left edge 222.4 px. A mobile-only title-row
  reserve restores ellipsis; subtitle/detail rectangles and card heights remain
  identical. The `Tag` subtitle is retained. Built snapshot validation follows.

The remaining oracles are real Firebase entry/location, physical authenticated
image/logout/cache and final fixture/route cleanup. Dev currently opens the demo
selector; this is not the protected entry flow. The user supplied Firebase
client/VAPID settings and an Admin SDK file outside git; its permitted dev/prod
use is being clarified. No credential was imported or activated. Evidence is in
`2026-09-14` local Mobile WebView evidence files, including the qualification
summary, Settings resident before/after, clipboard denied/retry and offline
policy result. The unrelated shared install-prompt UX fix is queued after full
checkpoint closure as requested.


Shared setup continuation, 2026-09-14 (same checkpoint, **PARTIAL / OPEN**):

- The user's subsequent desktop/physical-phone delegation brought the shared
  install/permission correction into this run. It uses the existing Popup header
  and X, with a compact body: permissions first, optional installation second,
  short EN/HU copy, equal-width original sliding switches, and separate
  right-aligned Update/Install actions. Fixed blue location and notification
  violet rows are independent from each switch's permission-status palette.
- Required location controls Firebase entry. Notification selection is optional
  and remains editable both ways; after login the popup locks location. Update
  performs native decisions before background work. X/rejection never approves
  entry. Device push opt-out persists and unregisters separately from bell mute;
  background auto-registration observes it. The bell keeps its direct native
  request path and native-wait/background-ring phases.
- Managed Casey desktop plus physical Riley PWA were exercised. The versioned
  `check-entry-prompts.browser.js` runs the actual compiled store prototypes with
  deferred native/provider doubles: native sequence, required-location rejection,
  X/reopen and late-result cancellation, optional notification rejection,
  signed-in device update, bell deduplication/account switch, persisted device
  opt-out/strict unregister and startup-registration guard. These are controlled
  contracts, **not real permission prompts or FCM delivery evidence**.
- Native desktop installability exposed a blob-manifest relative `start_url`
  error. Deriving absolute scope/start URL from the document base removed
  `start-url-not-valid`; Chrome returned no installability errors. The native
  install event is consumed once; dismissal retains a still-unused event for
  reopening, and installation is reoffered once after first login.
- Only the existing frontend-sync watcher compiled. The dev i18n importer had
  cached a new revision with old/empty messages during collection replacement.
  Avoiding unchanged generator writes and republishing the bundle revision after
  message import restored the live EN/HU bundles (revision .100, 3410 per language).
  This does not claim a general fix for the dev import ordering race.
- Final layout on `lifecycle-16` (`mobile-webview-lifecycle-1789393814593`):
  physical PWA viewport 360 px/panel 341 px; full desktop viewport 1850 px/panel
  340 px. Both switch rows measured 224 px on both devices, no horizontal
  overflow, Update aligned to the block's right edge. Actual UI clicks changed
  notifications both ways and restored the starting selection; location stayed
  disabled. Common content-sized action configuration keeps phone Update at
  97.74 px and Explore at 161.18 px in a 342.42 px block. The shared dim backdrop
  retains the page behind a 3 px blur. Common X closed and the existing install offer reopened on desktop.
  Seven compiled contract groups passed on both devices. Final screenshots and
  `shared-setup-results.json` are in the existing local evidence directory.
- Current Firebase runtime/provider activation remains unproven. No private key
  was imported, logged or committed; production Firebase settings were untouched.
  The earlier credential-scope question was answered, then dev/prod separation
  was requested. Continue with the existing Operator encrypted test/activation
  workflow and exact public VAPID; do not infer real push from the mocked checks.
  Fixture/actor snapshots and the isolated dev phone route remain staged.

## Execution and evidence rules

**KÖTELEZŐ QA-SZABÁLY: CODEX SOHA TÖBBÉ NEM ELLENŐRZI A FRONTENDET. A FRONTEND KÉZI, VIZUÁLIS ÉS INTERAKCIÓS ELLENŐRZÉSÉT KIZÁRÓLAG A FELHASZNÁLÓ VÉGZI. CODEX KIZÁRÓLAG A FELHASZNÁLÓI LÉPÉS UTÁNI BACKEND/API/PERZISZTÁLT ORACLE-T VALIDÁLJA.**

0. The user exclusively performs and evaluates frontend manual, visual and
   interaction checks. Codex never performs frontend validation, including
   browser automation, screenshots or a second frontend walkthrough. Codex
   guides the requested frontend step and validates only its backend/API/
   persisted oracle after the user's action.
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

### Mobile WebView correction and rerun — 2026-09-14 16:14

#### Paired continuation and measured logout delay — 2026-09-14

- Recovered the missing phone USB reverse route (`8080 -> 80`) after the
  reported network interruption. The retained mobile-webview fixture was
  checked without restaging. The user explicitly delegated normal desktop
  and physical-phone actions again; no window resize or application test
  override was used.
- Desktop Casey: privacy Cancel left `/entry` without a session; Login
  reopened privacy. After acceptance, the next Login opened the ordinary
  demo selector and Casey entered `/game`. This is demo login evidence,
  not Firebase or revised-consent fixture coverage.
- Desktop shared setup: centered 340px popup at the unchanged 1136x763
  viewport; both switches measured 224px. Location was selected and disabled
  for the signed-in user. Notifications could be selected and deselected;
  native permission remained `default` before submission. Submitting the
  deselected notification preference closed the popup. Screenshot:
  `/tmp/myscoutee-desktop-permissions-resume.png`. Native permission decisions
  and device registration are not proven by this observation.
- Phone Riley: the controlled QR loaded at 1024px natural width, remained
  available after closing/reopening during external page-and-worker network
  emulation, and had no horizontal overflow. Restoration returned ticket
  sync to HTTP 200 and removed the notification offline indicator. This
  Riley control does not replace the checklist's Nova account-isolation
  offline branch. The shaping process restored transport and exited.
- A normal Nova logout reproduced the reported loading delay: HTTP success
  took 26ms, session storage was already cleared by the 527ms sample, but
  entry with the Login button was first observed at 8133ms. Actual ADB
  screenshots were started at 500, 1500 and 3200ms; transfer completed later,
  so these labels are capture-start times, not exact image frame timestamps.
  Evidence: `/tmp/myscoutee-logout-before.json` and
  `/tmp/myscoutee-logout-500ms.png`, `/tmp/myscoutee-logout-3200ms.png`.
- The bottleneck was reproduced independently with read-only Cache Storage
  enumeration: 7651ms total, including 3726ms for 1028 old app-cache requests
  and 3632ms for 1026 current app-cache requests. Logout was scanning static
  build caches despite only deleting private API/media entries.
- Product fix: `OfflineCacheService.clearUser` now enumerates only the
  existing runtime API/media cache families. The private-entry deletion
  predicate and synchronous user revocation remain unchanged. The existing
  frontend watcher compiled successfully at 16:39:19 UTC; no second build
  process was started. Physical candidate `lifecycle-22`, build
  `mobile-webview-lifecycle-1789403969808`, activated through normal cold
  reopening with retained cache/data. Its corrected chunk was observed loaded.
- Same-phone Nova retest: entry appeared at 971ms and the Login button at
  1121ms; first logout HTTP success took 16ms. Nova private cache keys and
  session storage were absent afterward; current and previous app caches
  remained. Evidence: `/tmp/myscoutee-logout-after-measurement.json` and
  `/tmp/myscoutee-logout-after-1500ms.png`. This is one before/after observation,
  not a latency percentile. A separate redundant logout request still
  returns 401: the side-menu submits logout before `SessionService.logout`
  invokes the session registry again. It was not the multi-second bottleneck
  and is not repaired by this cache change.
- Desktop retest after ordinary reload loaded the corrected chunk and
  completed Casey's confirmed logout to visible Login in 266ms; first HTTP
  logout took 15ms. Viewport remained 1136x763. Evidence:
  `/tmp/myscoutee-desktop-logout-after.json`. The duplicate registry request
  remains observable here as well (401 in 8ms).

The full checklist remains PARTIAL/OPEN, including Firebase activation,
native permission decisions, fresh background variants and complete
Riley/Nova private-media isolation. No prior PASS replaces those observations.

#### Ticket organizer avatar defect — 2026-09-14

- Reported on the physical phone: the Nova Ticket showed `QM`, derived from
  its event title, instead of the organizer avatar. Read-only inspection of
  the active lifecycle-22 card confirmed the monogram. Evidence:
  `/tmp/myscoutee-ticket-avatar-current.png`.
- Root cause: the Ticket DTO and converter omitted the organizer image. The
  server now resolves distinct organizer IDs in one existing user-summary
  batch; the local repository passes its existing in-memory users to the
  mapper. Both paths provide `creatorName` and `creatorAvatarUrl`. The shared
  card receives the image and uses the organizer name for the monogram
  fallback. The ticket revision includes both fields so synchronization can
  update an existing card. No fixture-specific production branch was added.
- Existing frontend watcher compilation passed at 16:55:56 UTC; the backend
  continuous compiler reported `BUILD SUCCESSFUL` and restarted the app.
  Direct Vitest run of `asset-ticket-info-card.converter.spec.ts` with
  `--globals --maxWorkers=1`: **4/4 passed**, including image/fallback cases.
  Both worktree `git diff --check` checks passed.
- An authenticated read-only GET of `/api/assets/tickets`, using the phone's
  existing Nova session, returned HTTP 200 and organizer `Casey Bridge` with
  `/media/public?key=images/demo-profiles/650000000000000000000061/photo-01/large.webp`.
  Sanitized evidence: `/tmp/myscoutee-ticket-avatar-response.json`.
- Backend regression test added for batched organizer lookup and an avatar
  change appearing in ticket synchronization. Its attempted command was
  `docker exec myscoutee ./gradlew :projects:profile:test --tests
  'com.raxim.myscoutee.profile.service.AssetsServiceTest.ticketSync*'
  -x :projects:profile:compileJava -x :projects:profile:processResources
  --max-workers=1`. The test did **not run**: test-source compilation failed
  with 76 existing errors outside this patch, including outdated
  `OwnerMembersSnapshot` constructors, a missing `Instant` import and removed
  `NotificationIntent.notificationType()` references. No application compiler
  was duplicated. Only the additional idle daemon created by this test attempt
  was stopped; the existing dev owners remain running.
- Retained watcher-output snapshot `lifecycle-23`, build
  `mobile-webview-lifecycle-1789405049656`, is served through the existing
  phone-only fixture route. The phone still had lifecycle-22 loaded when last
  inspected. **Visual retest on the new build is pending**; no browser clicks,
  navigation or app-state mutation were performed for this defect diagnosis.
  The overall WebView checkpoint remains **PARTIAL / OPEN**.

#### Candidate 23 paired cache continuation — 2026-09-14

- User reauthorized ordinary desktop and physical-phone actions after the
  explicit browser-boundary question. No application state was injected.
- Phone retained lifecycle-22 during candidate-23 worker installation. Once
  the worker reached `installed`/waiting, normal app cold reopen activated
  `mobile-webview-lifecycle-1789405049656`. No app data or caches were cleared.
- Physical Nova and desktop Riley each opened their own Ticket normally.
  Both organizer avatar images loaded successfully through the shared image
  renderer. Phone screenshot: `/tmp/myscoutee-ticket-avatar-phone-fixed.png`.
  Desktop retained viewport **1136 x 763**.
- Both normal QR actions showed their respective owners. Candidate-23 phone
  Nova QR was warmed, then external `network-offline` shaped the page and its
  service worker. Closing/reopening the QR through actual phone taps returned
  the loaded 1024-pixel QR and retained avatar. No Riley Ticket appeared and
  no Riley-scoped offline storage keys remained. No horizontal page overflow.
  Evidence: `/tmp/myscoutee-lifecycle23-nova-offline-qr.png`.
- Transport restored through `online`, then `stop`; helper confirmed page and
  worker restoration. Phone radios/tethering unchanged. Nova logged out
  normally. Desktop Riley opened New notifications at the one-row baseline.
  Background mutation variants remain to be executed; the full checkpoint
  is still **PARTIAL / OPEN**.

#### Candidate 23 background observations — 2026-09-14

- Baseline after normal phone Riley login: **2 unread** on both phone and
  desktop (the retained fixture baseline plus the real new-device login
  security notification). The extra login row was not a fixture mutation.
- The first Settings attempt was reset with the versioned
  `reset-background-settings-resident` command because hidden-page state had
  not been confirmed before its mutation. It is not counted as evidence.
- Repeated Settings setup confirmed Android Settings foreground and PWA
  `visibilityState=hidden`, time origin `1789406030472.8`, with 2 rows.
  One versioned `background-settings-resident` mutation was applied. Returning
  by actual Recents tile tap recreated the document (new time origin
  `1789406104714.8`, navigation `back_forward`). Riley identity remained;
  reopening Notifications returned 3 rows. Desktop reconciled the same 3.
  This is recreated-document recovery evidence, **not resident-list PASS**.
- Chrome branch: external Chrome displayed `https://example.com/`, with PWA
  confirmed hidden at time origin `1789406104714.8`. One `background-chrome`
  mutation was applied. Actual Recents tile return retained the same document
  time origin and already-open Notifications; 3 became **4**, with exactly one
  `QA Mobile background-chrome` row. Desktop independently showed the same 4.
  Screenshots: `/tmp/myscoutee-recents-chrome.png` and
  `/tmp/myscoutee-chrome-resume-immediate.png`.
- A second Settings branch used the separate versioned `background-settings`
  mutation after confirmed hidden state at time origin `1789406104714.8` and
  a four-row baseline. Actual Recents return again reconstructed the document
  (`1789406293653.3`, navigation `back_forward`, `document.wasDiscarded=false`)
  and closed the previously open list. Identity persisted; normal reopening
  reconciled five notifications, matching the desktop. Android's
  `always_finish_activities` setting was read as `0`; it was not changed.
  Resident Settings retention is **not proven** and the reconstruction cause
  is under diagnosis. Do not label this as an application-triggered reload
  or an Android memory kill without evidence.
- No app data was cleared and no application lifecycle methods were invoked
  by a test hook. Screenshot: `/tmp/myscoutee-settings-resident-restored.png`.
  All three fixture mutation variants are now retained; do not reapply them.

#### Settings restore returned an obsolete document — diagnosis in progress

- After the Settings/Recents path, Nova's normal login displayed an empty
  notification list and no Riley rows. Two Riley offline keys remained:
  its user snapshot and upcoming Ticket snapshot. Do not count this storage
  boundary as PASS.
- Subsequent read-only inspection identified the actual document as old build
  `4be4a1c596e2-20260905140310`, loading `main-57AMUGJO.js` and
  `chunk-SC5LCGOC.js`; these files belong to retained `old`, not candidate 23.
  The new worker caches still contained candidate-22/23 index documents with
  `main.js`. A normal read of `/index.html` returned candidate 23. Therefore
  the retained-key observation is not evidence that the current cache-clear
  implementation failed. No speculative cache-clear change was made.
- The old restored document had time origin `1789406404238.6` and the target
  had changed to `31743`. The earlier new-build/avatar screenshots remain
  valid for the point before this restoration; build metadata must be captured
  together with script URLs at each resume boundary.
- The phone then moved to a non-QA application and Chrome stopped; USB device
  and both ADB mappings remained healthy. Do not inspect that other app or
  overwrite its state. Desktop QA continues independently. The obsolete
  document restoration cause and the complete WebView result remain open.

#### Current-build cache retest — 2026-09-14 17:34–17:43 UTC

- The user returned the phone to the QA PWA. The actual standalone document
  was candidate 23 (`mobile-webview-lifecycle-1789405049656`, `main.js`).
  A read-only browser-level observer recorded Settings/Recents returning a
  navigation served by the service worker (HTTP 200, `fromServiceWorker=true`).
  The resulting document retained candidate 23; time origin changed from
  `1789406956856.3` to `1789407290248.4`. This is a recreated-document result,
  not proof of resident resume. The earlier obsolete-document cause remains
  unconfirmed; no application workaround was added.
- Normal Nova logout, Riley login, Riley Ticket/QR open and Riley logout on
  candidate 23 removed both previously retained Riley offline keys. Both
  static app generations remained. Normal Nova login then displayed only
  Nova's controlled Ticket and loaded QR; Riley offline keys remained absent.
  The desktop Riley notification count changed from five to six after the
  real second-device login. This was not an extra background-fixture mutation.
- Closing/reopening the QA WebAPK produced a new document time origin
  `1789407529122.2`, the same candidate build, Nova identity and no Riley keys.
  With the versioned page/worker network fixture offline, Nova's QR reopened
  at 1024 pixels with the avatar loaded and no horizontal overflow. Nova's
  Notifications remained empty; its mute control was disabled with the
  offline icon. Restoring transport retained the same document, empty list
  and absent Riley keys; notification controls returned online. The shaping
  process and passive observer were stopped. Phone radios/data were untouched.
- Evidence: `/tmp/myscoutee-phone-cache-observer.jsonl`,
  `/tmp/myscoutee-riley-current-logout-cache.json`,
  `/tmp/myscoutee-nova-current-isolation.json`,
  `/tmp/myscoutee-nova-current-isolation.png`,
  `/tmp/myscoutee-nova-offline-current.png` and
  `/tmp/myscoutee-nova-offline-notifications.png`.
- Desktop Transport Source: typed the exact controlled URL, selected/copied
  it using normal keyboard input, cleared the field and pressed Paste link.
  The native permission was denied. The field remained empty; retry remained
  available and showed browser-site-settings guidance. Successful allowed
  paste is pending. The user requested shorter guidance; both language bundles
  and generated Mongo seeds now use one short sentence. i18n seed audit passed;
  the existing frontend watcher and Mongo seed watcher applied the change.
- Full checkpoint stays PARTIAL/OPEN. This retest proves current account cache
  cleanup and the above warm-cache recovery; Firebase login, authenticated
  private-image access/revocation, complete entry regression and frontend-local
  fallback still require their own evidence.

#### Clipboard continuation and candidate 24 — 2026-09-14

- Candidate 24 is a stamped snapshot of the existing watcher output, build
  `mobile-webview-lifecycle-1789407847999`. No second compiler ran. After
  installation completed, closing/reopening Chrome and the local QA WebAPK
  activated candidate 24 without clearing application data.
- Desktop ordinary reload and reopening the controlled Transport editor showed
  the shortened denial guidance: "Allow clipboard access in site settings,
  then retry." Native clipboard permission remains denied; an allowed desktop
  Paste result is still pending the site-setting change. No Asset was saved.
- On physical Android, the complete exact fixture URL was selected
  (`selectionStart=0`, `selectionEnd=44`) and copied with Android's native
  text-selection Copy menu. After clearing the field with ordinary keyboard
  input and closing the keyboard, Paste link inserted exactly
  `https://example.com/qa/mobile-webview-source`. Existing clipboard permission
  was already granted: no new Allow dialog appeared. The early keyboard-open
  coordinate attempt was discarded and its unsaved stray character cleared;
  it is not evidence of clipboard behavior.
- A versioned external browser permission override to denied preserved the
  existing URL and showed the short Hungarian guidance without horizontal
  overflow; a fresh Paste click remained retryable. Removing the override
  restored the native granted setting; Paste succeeded and cleared the error.
  The fixture helper now explicitly removes debugger permission overrides on
  exit. Syntax check passed; this is fixture cleanup, not application logic.
- Setting the external override to prompt did NOT display a native permission
  popup: Paste returned the error instead. The override was removed, native
  permission was verified granted again and a final ordinary Paste succeeded.
  Do not report this attempt as a native Allow/Block test. The mobile native
  first-permission branch remains NOT PROVEN, as explicitly clarified to the
  user. No synthetic grant or fake browser API is counted as that proof.
- Evidence: `/tmp/myscoutee-short-clipboard-error.png`,
  `/tmp/myscoutee-phone-copy-menu.png`,
  `/tmp/myscoutee-phone-paste-result.png`,
  `/tmp/myscoutee-phone-clipboard-denied.png` and
  `/tmp/myscoutee-phone-clipboard-prompt.png` (no popup).

#### Native clipboard observation and demo replay — 2026-09-14

- After the user removed only the QA origin's native Clipboard exception,
  physical Android Paste displayed the real Block/Allow permission dialog.
  Actual Block left the Source empty and displayed the short Hungarian
  guidance; retry remained available. Evidence:
  `/tmp/myscoutee-phone-real-clipboard-prompt.png` and
  `/tmp/myscoutee-phone-native-block-result.png`.
- This supersedes the earlier NOT PROVEN statement for popup appearance and
  native Block only. Native Allow after a fresh prompt remains unproven;
  already-granted exact URL paste was independently successful. The user
  requested moving on. Neither platform saved the Transport editor.
- Normal logout reached `/entry` on both devices. The versioned mobile fixture
  reset restored its snapshots, then `stage-demo` and common session preparation
  established canonical Anna. Both devices signed in through the ordinary demo
  selector as HTTP `bf057de7c586eede7e84bdc7`. Phone remains candidate 24.
  The current replay now targets real API transport loss and local persistence.

#### Local demo offline controls defect — 2026-09-14

- Candidate 24 replay: API-only outage switched canonical HTTP Anna to local
  `u1` in a separate IndexedDB database. About marker
  `[QA-local-20260914-2010]` survived save/reopen; an unsaved draft survived
  reconnect without navigation (`timeOrigin=1789409129753.6`). Cancelling the
  draft retained only the saved marker. Desktop HTTP About remained unchanged.
  Full target network emulation returned `navigator.onLine=false`; reconnect
  retained the local identity/document. Explicit app reopening preferred HTTP.
- The user identified an incorrect acceptance assumption: local demo actions
  must remain usable without internet, including local Chat and notifications.
  The earlier disabled-mute observation is not a PASS for the local adapter.
  Root cause: Home controls and side-menu guards used physical connectivity;
  several list progress/poll predicates did the same. The full local adapter
  can execute those operations offline.
- Shared runtime data-source availability now allows the existing local adapter
  offline. Home, menu, local notification preferences and existing list consumers
  use it. Physical connectivity still drives notification offline indicators;
  real HTTP actions retain connectivity restrictions. Removed the unrelated grey
  avatar-header treatment. No test URL, runtime override or fake API was added.
- Existing watcher compiled the repair in 7.384 seconds at
  `2026-09-14T18:12:30.328Z`. Candidate 25:
  `mobile-webview-lifecycle-1789409560944`. Existing compiled failover regression
  passed; actual repaired phone UI replay is in progress. Desktop retains its
  real `1136x763` viewport and enabled online header controls.
- Evidence: `/tmp/myscoutee-anna-local-reconnect-draft.png` and
  `/tmp/myscoutee-anna-local-network-reconnect.png` (candidate 24 observations).

#### Candidate 25 local offline verification — 2026-09-14

- Physical standalone PWA candidate 25 switched from canonical HTTP Anna to
  local `u1` through API-only transport loss. A subsequent full page/worker
  network outage reported `navigator.onLine=false`. Mode, filters and history
  were enabled; ordinary touches opened all three. The side-menu profile,
  Chat, Event, Asset and contact actions were enabled under the same outage.
- Local Chat list loaded its seeded conversations. Opening Driver Split —
  Alpine Weekend loaded messages and enabled the composer while still offline.
  No message was sent. Local notification mute changed to true, remained true
  after closing/reopening, and was restored to false with the ordinary
  confirmation. Pending-save disabling ended after the local operation.
- Two missing Rating portraits were external URLs, not invalid application
  routes: randomuser.me `men/12.jpg` and `women/84.jpg`. Both returned HTTP 200
  JPEG outside the device. The PWA had no service-worker cache entries for
  them. After transport restoration and ordinary list reopen, both image
  directives completed without errors on the phone. A cross-origin fetch
  diagnostic failed (the server exposes no CORS header); actual image rendering
  succeeded. Do not confuse fetch CORS restrictions with image unreachability.
  User accepted uncached external images being absent during full network loss.
- Desktop online header controls remained enabled at the original 1136x763
  viewport. A brief desktop offline control triggered canonical-demo failover
  before inspection; discard it as an HTTP-disabled-state oracle. Transport
  was restored in `finally` and ordinary reload requested to return to HTTP.
- All page/worker shaping processes stopped with restoration confirmed.
  Public image limitation and unexecuted real Firebase branches remain explicit;
  the full checkpoint is still PARTIAL/OPEN.
- Evidence: `/tmp/myscoutee-local-offline-filter-fixed.png`,
  `/tmp/myscoutee-local-offline-chat-fixed.png`,
  `/tmp/myscoutee-local-offline-rating-images.png`, and
  `/tmp/myscoutee-local-offline-preference-fixed.png` (main-screen enabled header).

#### Demo cleanup and Firebase bootstrap correction — 2026-09-14

- Restored the local About text and notification mute through ordinary UI actions;
  both devices logged out normally. The versioned WebView fixture reset restored
  its retained pre-launch server-session snapshot. Candidate 25 remains installed,
  caches preserved, and all transport/permission overrides stopped.
- Distinguish API-only server loss from full network loss: external image hosts
  can remain reachable during the former. The accepted missing-portrait observation
  belongs only to the latter, with no cached bytes available.
- Before cleanup, the public Firebase client-config request returned 401 with
  "App session is not active." After fixture reset it returned the controller's
  404 "Firebase client configuration has not been activated." Source diagnosis
  found that WebSecurityConfig permitted the two exact public config paths, but
  FirebaseFilter omitted them from its entry-bootstrap exemptions. Added those
  exact paths; no wildcard or protected configuration access was added.
- Existing backend watcher compiled successfully in 1 second and restarted at
  20:29:46 local time. Anonymous HTTP recheck reaches the intended config handler
  (404, no active revision); Operator configuration remains 403 and private media
  remains 401. A nonexistent child path returns 404, not configuration content.
- Added a regression for both public paths with an expired authenticated app
  session, plus adjacent-path rejection. The JUnit regression was not executed:
  the existing test-source compilation blocker (76 unrelated errors, documented
  above) remains unresolved. No second application compiler was started.
- Actual Firebase entry/location and positive protected-image tests remain open
  pending an Operator-tested active application configuration. This repair is not
  evidence of successful real-provider login. Overall status remains PARTIAL/OPEN.

#### Test-hook audit and full entry regression — 2026-09-14

Scope: current frontend application source/environments and backend main
sources, the frontend changes since `6d04ac06`, backend changes since
`44fab031`, and the historical implementations of the entry/PWA overrides.
This is a targeted source/history audit, not a claim that every historical QA
checkpoint used an unmodified application.

| Finding | Historical behavior | Current working-tree status |
| --- | --- | --- |
| `qaAuth=firebase` | `479ecfa1` (2026-08-14) added a query-based Firebase login override in application code. It was gated against production and required the QA opt-in. The old eligibility launcher used it. | Runtime parser and environment opt-in removed. Removed the two remaining obsolete eligibility launcher URL references. Real Firebase configuration is required. |
| `qaOfflineDemo=1/0` | `fdb865d7` added a dev/loopback test switch and `myscoutee.qa.offline-demo` storage gate in application bootstrap. | Query/storage gate removed. The retained demo failover is application behavior driven by a canonical demo identity and actual transport loss, not a test condition. Its whole UI lifecycle still needs fresh evidence. |
| `qaConnectivity` | Added a timestamp query to the fallback health request. | Removed; the request uses the ordinary configuration endpoint with `cache: no-store`. |
| `pwa=on/off` and `myscoutee.dev.service-worker` | Application code could override the worker's configured state. The old March implementation had no production guard on query parsing; the later implementation did. | Query parser and storage override removed. The existing build environment's service-worker configuration owns capability. |
| Browser helpers using live internals | `check-entry-prompts.browser.js` used compiled store prototypes/doubles; an earlier block replaced live `Storage.prototype.setItem`. `check-local-device-registrations.browser.js` invoked a live local adapter/database from the HTTP page. | Both helpers retained: their deletion during this audit was reversed after the user's clarification. Necessary fixture-only internal setup is allowed if there is no practical external alternative, with exact scope, cleanup and evidence limits recorded. Historical contract results are not normal UI lifecycle evidence. The earlier live `Storage.prototype` replacement remains removed. |

No additional QA query switch, hard-coded fixture identity or test-only route
was found in the inspected current application sources. Normal `redirect`,
`onboarding` and media-key parameters are not QA switches. The private media
endpoint is a product authorization change, not a test endpoint. The isolated
VM contract fixture, database fixtures, browser Sensors and page/worker network
emulation remain valid external test tools; they do not establish a real native
permission decision or end-to-end login by themselves.

Mobile label follow-up: removed the mobile-only icon compression from the
existing entry button. The watcher completed at 15:00:22 UTC. After normal
cold launch activated candidate `lifecycle-21`
(`mobile-webview-lifecycle-1789398081228`), the physical 360x753 PWA displayed
**Bejelentkezés** beside the brand without horizontal overflow. Screenshot:
`/tmp/myscoutee-mobile-login-label.png`. No permission/login branch is implied
by this layout observation.

Fresh full-entry coverage is now listed at the start of
`MOBILE-WEBVIEW-LIFECYCLE-001.md`: Budapest/London/absent Paris, location
allow/deny/retry, unavailable-country label and public exploration control,
offline entry/recovery, `ENTRY-CONSENT-001/002/003`, demo/Firebase registration,
returning identity, session limits and logout. Existing results remain
historical; this rerun is OPEN. Public Firebase configuration currently returns
HTTP 404, so the real Firebase/location-label branches cannot yet be counted.

Separate observed product defect and repair: a server-revoked Riley session
received HTTP 401 on ordinary Logout and previously remained signed in behind
an error dialog. The narrow HTTP adapter fix lets local sign-out finish when
the server already rejects that session. On physical candidate `lifecycle-20`
(`mobile-webview-lifecycle-1789397341066`), the same fixture revocation followed
by normal Logout/confirmation cleared the local session and reached `/entry`.
This proves that transition; complete private-cache isolation remains a
separate pending check. The existing watcher compiled the fix; no duplicate
build was started.

The device opt-out block in `check-entry-prompts.browser.js` that temporarily
replaced live-page `Storage.prototype.setItem` has been removed. Its previous
controlled result is not normal-UI persistence evidence. Syntax validation
passed; the script was not executed against either open application for this
correction. Device opt-out persistence still requires the ordinary UI journey
or an isolated unit-test environment. No application source or runtime state
was changed by this correction.

Continuation diagnostic: read-only desktop inspection at viewport 1136×763
found the shared setup dialog with `aria-modal=true`. A hit test at the
Settings button returned `ui-popup__backdrop ui-popup__backdrop--dim`, not the
button. The earlier programmatic `.click()` sequence bypassed ordinary pointer
hit testing; it is not manual-user evidence and must not count as a PASS or
justify a product workaround. No application code or browser state was changed
for this diagnosis. Full rerun remains OPEN. Independent fixture status remains
`fixture-ready`, with two distinct Upcoming Tickets, Riley's single unread
baseline notification, the public Transport Asset and no background variants.

- Removed application URL/storage test switches for demo fallback, PWA and
  Firebase login. Dev uses its ordinary serviceWorkerEnabled and
  firebaseLoginEnabled configuration; an active Firebase runtime is still
  required. Demo fallback now follows eligible demo session + actual backend
  transport loss, including deployed builds. Firebase/operator/support actors
  are never converted to local demo actors. Earlier switch-based observations
  do not prove this corrected path.
- Existing watcher compiled successfully at 14:14:13 UTC; no duplicate build.
  check-demo-failover.mjs passed five exclusion cases, deployed-demo fallback,
  authorization errors, independent storage, editor/write guards, reconnect
  without reload, cold start, logout and account switch using compiled code
  with controlled transport. This is a contract check, not whole-device proof.
- Desktop + physical PWA lifecycle-17: seven shared-popup workflow groups passed
  with native/provider doubles. Six local-device cases passed through the real
  local service/repository with fresh IndexedDB reads and disposable-user
  cleanup. The running deployment was HTTP (delay 0); a separate controlled
  RouteDelayService check resolved local configuration to 1500 ms and measured
  1501 ms. Full frontend-local UI/reload remains to be run.
- Enhanced only the versioned phone transport fixture to include same-origin
  workers. On lifecycle-17, retained CDP session: navigator.onLine=false, API
  network error, worker still controlling cache, both cloud_off controls,
  clickable avatar and cached Riley ticket list. Restoring transport produced
  navigator.onLine=true, API 200 and zero cloud_off buttons with unchanged
  page timeOrigin 1789394928600.1. Fixture restored and detached; phone radios
  and tethering unchanged. Separate debugger clients can reset Chrome's network
  state: use the fixture's retained eval connection for inspection/actions.
- Removed unsolicited home/header/menu offline badges and menu offline note.
  Only the agreed notification icons indicate connectivity. Candidate
  lifecycle-19: mobile-webview-lifecycle-1789395283443.
- Keep PARTIAL/OPEN: ordinary full frontend-local UI, real Firebase activation,
  native delivery/background/lost-connection reconciliation, authenticated
  media/logout and physical whole-device offline behavior are not established
  by the above checks. No private key imported or committed.

Final physical label regression on lifecycle-19: actual fixture offline state,
zero extra offline labels/notes, zero visible "Offline" text, two `cloud_off`
notification controls, usable avatar and no horizontal overflow. Screenshot:
`~/.local/share/myscoutee-qa-evidence/MOBILE-WEBVIEW-LIFECYCLE-001/2026-09-14/offline-icons-only-phone.png`.
Transport restored online and fixture detached.


#### Firebase registration and desktop login footer — 2026-09-14

Continuation evidence supersedes the earlier unexecuted Firebase and updated
country-label notes, without closing the full WebView journey.

- Physical phone: real Google account selection reached required registration.
  The tester supplied three logo images; ordinary profile Save and privacy
  acceptance reached the game. Normal logout returned to entry and cleared the
  app session; repeat Google login reused the same identity without onboarding.
  A fresh read-only Mongo oracle confirms exactly one matching user, three
  images, Budapest, profile form version 2 and one device registration. No
  account email, provider subject or credential is copied into this ledger.
- The authenticated avatar rendered through protected media. The prior logout
  observation showed no private image in the DOM and an anonymous direct media
  request returned 401. Private-media cache entries were already zero before
  logout: this does not prove purge of a previously populated private cache.
  Invalid/revoked-credential and cross-account checks retain separate oracles.
- The short country label fits one line on the physical 360px viewport; the
  tester accepted the repaired button. External page/worker transport replay
  proved offline -> online -> offline on the same page time origin, with fresh
  eligibility on recovery and retained landing content. The first replay was
  invalid because worker transport recovered after the page online event.
  The fixture now restores workers first; corrected replay passed and transport
  was restored. No phone radio or application API was replaced.
- Shared Operator scope: ordinary no-change Firebase Save displayed success;
  close/reopen preserved active configuration with credential inputs masked.
  Fresh harness status confirms active revision 1 and both Authentication and
  Messaging tested revision 1. This proves preservation/readback, not changed
  credential rotation or the broader Operator restore journey.
- Desktop Login footer: retained screenshot at 1136x763 shows all three provider
  buttons and the complete provider-terms notice below them, inside the popup.
  Facebook is visibly Coming soon. Screenshot:
  `/tmp/myscoutee-desktop-login-footer.png`. The tester confirmed completion.
  This is a layout PASS, not a legal-compliance determination.
- Candidate lifecycle-26 is served, but the previous live shell still reported
  lifecycle-25 with a waiting worker. Do not infer coherent candidate activation
  from updated button code alone. Normal reload/cold-resume with the retained
  Firebase identity remains the next check; do not clear app data.

The full row remains PARTIAL/OPEN. Continue retained-session reload/resume,
shared permission/device opt-out persistence and the remaining protected-media
isolation checks. Real push delivery belongs to MOBILE-PUSH-LIFECYCLE-001.


#### Firebase resume, outage and media revocation — 2026-09-14

- User explicitly reauthorized Codex to execute ordinary phone/browser actions.
  Physical WebAPK force-stop/relaunch preserved the Firebase session, loaded
  avatar and completed profile without onboarding. Mongo still has one matching
  user, three images and one device. Screenshot:
  `/tmp/myscoutee-phone-firebase-reopen.png`.
- API-only outage on the existing Firebase page kept `/game`, Firebase session
  and time origin 1789414680958.9. Two notification controls indicated offline;
  `navigator.onLine` stayed true. Restoring worker/page transport removed both
  markers without reload or demo conversion. Fixture stopped and restored.
  User reiterated that this signed-in Firebase flow cannot switch to demo;
  demo selection belongs to entry.
- Real private image read with the current media cookie: 200 image/webp,
  8758 bytes, `Cache-Control: no-store, private`. Anonymous and malformed-cookie
  reads: 401 JSON, no-store. The old public route redirects a private key to the
  protected route (307), whose anonymous read is 401.
- After normal Logout and confirmation, replaying that previously successful
  cookie returns 401. `/entry` has no app session, private DOM image or private
  service-worker cache entry. The restricted temporary cookie snapshot is
  solely a read-oracle credential, not an injected browser login or app change.
  Immediate screenshot: `/tmp/myscoutee-phone-private-logout-immediate.png`.
- Normal Google login afterward reused the same account. WebAPK restart alone
  retained a service-worker client; closing only the local QA page before
  relaunch allowed candidate 26 to activate naturally, preserving the Firebase
  identity and avatar. No cache clearing or injected SKIP_WAITING was used.
  Candidate 27 began installing afterward; that repair replay remains pending.
- Defect: installed PWA had no normal way to reopen the shared permission popup;
  the sole signed-in entry point was gated on install availability. Added
  `Settings -> Permissions` for ordinary member workspaces, opening the existing
  AppSetupStore/popup. No new permission/storage mechanism. Existing watcher
  compilation passed at 19:43:32.765Z. Candidate 27 is served with build ID
  mobile-webview-lifecycle-1789415030969. Next: actual device off/reload/on and
  bell-mute separation using that control.


#### Installed-PWA permission replay — 2026-09-14

- Candidate 27 activated naturally after closing only the QA origin's retained
  page and reopening its WebAPK. Effective document build
  `mobile-webview-lifecycle-1789415030969`; active worker, no waiting worker,
  no failed script resources, Firebase identity and private avatar retained.
- Ordinary `Settings -> Permissions` opens the existing shared popup on the
  installed PWA. There is no redundant Install block. Location is checked and
  disabled; Notifications stays editable. Both rows are 224px; Update is
  content-sized (97.742px); no horizontal overflow. Screenshot:
  `/tmp/myscoutee-phone-permissions-installed.png`.
- Notifications off -> Update removes the only server device (1 -> 0), while
  native notification permission remains granted. WebAPK reopen preserves the
  false device preference and zero server devices.
- Normal notification-list Mute and Unmute confirmations both work with device
  opt-out retained. Unmute does not recreate the device (still zero). This
  proves separation of alert preference from device registration.
- Settings -> Permissions reopens with Notifications off and Location locked.
  On -> Update restores exactly one device. Another WebAPK reopen retains true
  and one device. Reopening and pressing Update again with on unchanged still
  leaves one distinct enabled device: no duplicate registration.
- No native notification prompt was claimed: permission was already granted.
  The user explicitly deferred actual Firebase message delivery to the separate
  Push row. No test message was sent during this continuation.
- Current fixture transport is online. The phone is signed into its real QA
  Firebase profile on `/game`; desktop dimensions remain 1136x763. Broader
  Operator tests remain parked. The temporary private-media read credential
  was removed after the revoked-cookie negative check.

Closure audit: these results complete the current physical Firebase resume,
API-outage, private-media revocation and device preference block. The expanded
entry table still explicitly requests fresh ENTRY-CONSENT-001/002/003,
ENTRY-DEMO-REG-001 and AUTH-SESSION-001 replays; their prior closed rows are not
fresh evidence for this run. Do not silently mark those replays executed.


### Entry login and footer corrections — 2026-09-14

- User simplified the unresolved-location action to ordinary Login. Removed the presentation-only Allow location / Checking location inputs and deferred label timers. Silent granted-permission eligibility resolution and the actual login permission/region checks remain; confirmed unavailable-country and network states remain distinct.
- Landing social glyphs use Instagram pink, YouTube red and Facebook blue while retaining the shared neutral background. Facebook renders the Facebook glyph instead of the configured generic globe.
- Removed the Preview badge from the landing template. The existing Bug report popup no longer uses the test-version title or introductory warning; its reporting action remains available.
- Existing frontend-sync watcher compiled successfully at 20:05:37.893 UTC; no additional compiler or test runner was started. Frontend diff whitespace check passed.
- Served candidate lifecycle-28, build mobile-webview-lifecycle-1789416355389, through the existing mobile fixture route. Read-only desktop inspection still found the prior loaded document (generic globe, no provider attributes); this is not a rendered PASS for the new candidate. Native permission, new-candidate visual checks and the remaining entry lifecycle replays are not claimed complete.


### Entry consent and demo registration replay — 2026-09-14

- ENTRY-CONSENT-001 persisted oracle passed at 20:40:54.998Z: acceptance selected qa-analytics only; one new registered-user consent and no anonymous consent. The user completed three image uploads and saved the profile through the normal form.
- Registered profile: demo-profile-51978303-f163-49a3-a581-e32cb5771315, WebView Consent Replay, London, active/public, profile form version 2, three images, one experience profile and no external-provider identity.
- Anonymous demo draft uploads previously used private media and their previews returned 401. The session-mode interceptor now routes anonymous selector-mode demo draft image/profile writes through the existing demo request contract without inventing a logged-in user. Existing frontend watcher compilation passed at 20:39:07.222Z; candidate lifecycle-29 was served. Read-only diagnosis after the user's save confirms the rendered avatar loads successfully from public/demo media.
- Registration verification first failed because the newly saved demo profile lacked its established per-profile development email. HomeUserProfileService now reuses DevelopmentIdentityEmail when saving a demo-profile with no principal/fallback email. The existing backend watcher compiled successfully and restarted at 20:42:34.497Z.
- Persisted registration verification passed at 20:45:30.236Z, including unique development email ownership. This is not yet proof of initial-save email generation: the existing startup initializer can normalize the same record during restart. Fresh initial-save and ordinary registration-return evidence remain pending; do not close the full WebView row from this database result alone.
- Next remaining entry checkpoints: ENTRY-CONSENT-002, ENTRY-CONSENT-003 and AUTH-SESSION-001. Keep physical-phone versus desktop replay evidence distinct. Existing completed cache/media/device-preference evidence is retained; only affected regressions need replay after the entry block.


### Desktop installation, native progress and mixed dev media — 2026-09-14

- Actual desktop Install opened Chrome's native installer for `http://localhost`.
  Acceptance created the managed profile's MyScoutee desktop launcher and moved
  the QA page into an installed app window. Standalone display, `/game`, active
  service-worker control and the same WebView Consent Replay identity were
  observed. Native screenshot: `/tmp/myscoutee-desktop-native-install.png`;
  installed window: `/tmp/myscoutee-desktop-installed.png`.
- Closed the installed app using its normal window close control. A shell
  shortcut launch did not establish a reopened app and is not counted as proof.
  Opening MyScoutee through Chrome's visible Apps page then created a new
  standalone `/game` document (`timeOrigin=1789420173953.4`) with the same
  identity, controlled worker and no Install action. Screenshot:
  `/tmp/myscoutee-desktop-installed-reopen.png`. The registration oracle at
  21:07:45.496Z still had exactly one new user, three images, one experience
  profile and one email owner. This proves installed-app return, not fresh
  initial-save email creation or logout/sign-in return.
- User identified an early loading ring under the native install dialog and
  required the same rule on desktop and physical WebView/PWA: disable during
  the native decision without a ring; show progress only after acceptance,
  ending at `appinstalled`. The common PwaService now separates native waiting
  from accepted installation; AppSetupPopup uses combined pending state for
  disabling and installation-only state for progress. Early appinstalled
  ordering cannot restart a completed ring. Dismissal/error releases the action.
- Existing frontend-sync owner compiled and synced the fix at
  21:05:04.433Z / 21:05:06Z. An isolated Node VM executed its compiled PwaService
  and passed native-wait/no-ring, duplicate suppression, dismissal, accepted
  progress/completion, early-completion ordering and native-error checks. No
  compiler or live browser API replacement was used. Matching unit tests were
  authored; the Angular test runner was not started. At that point actual native
  replay was pending; the subsequent desktop result is recorded below.
- User reported the missing game-card picture. Read-only diagnosis found the
  own demo avatar loaded successfully (1280x674), while the earlier real
  Firebase QA profile's three private image requests returned 401. The dev
  Compose intentionally maps both real and demo Mongo routes to `demo_db`;
  a real Firebase trial profile is therefore visible in that demo dataset.
  Private media correctly requires an active Firebase media session. This is
  mixed QA data, not proof of an install/cache image regression. No image was
  made public, no credential was injected and no profile was hidden/deleted.
- Subsequent actual desktop native replay passed: Install was disabled without
  a ring during Chrome's decision dialog; Cancel released it without a ring.
  On the second attempt, native acceptance preceded the ring, then
  `appinstalled` removed the action. A read-only DOM/event observation recorded
  ring at 184122.3 ms, `appinstalled` at 184122.6 ms, action absent at 184123.4 ms
  on one document clock. No browser API was replaced. Screenshots:
  `/tmp/myscoutee-native-install-no-ring.png` and
  `/tmp/myscoutee-native-reinstall-prompt.png`. The previous QA installation was
  removed through native UI with app-data removal unchecked before this replay;
  the QA app is installed again. Physical-phone post-fix replay remains open.
- Original WebView Consent Replay ordinary Logout -> Start exploring -> profile
  selection returned to `/game` without onboarding and with a loaded avatar.
  Registration verify at 21:19:09.027Z retained one user/three images/one email;
  consent verify at 21:19:09.625Z retained the single unchanged acceptance and
  no anonymous consent.
- Entry-domain tracking reset at 21:19:42.150Z retained the original profile;
  entry-consent reset at 21:19:43.150Z restored `privacy-default-v1`, retaining
  the inactive QA revision/audit. Fresh entry-domain stage at 21:19:43.757Z had
  59 users including one existing demo registration. The tester completed the
  WebView Email Replay uploads/save while the agent prepared the Photos step;
  no agent upload succeeded. Verify at 21:24:16.469Z passed for
  `demo-profile-cd150570-785f-4ecd-a628-a4d73ec6c14f`: one new active/public user,
  form version 2, three images, one experience profile, no Firebase linkage,
  one unique development-email owner. No backend restart occurred between
  baseline and verification. Fresh first-save email proof is complete.
- The tester's screenshot `Screenshot from 2026-09-14 23-20-52.png` confirms the
  Peter Szabo card still shows No image. Read-only inspection after the fresh
  save again found its three private image requests returning 401, while the
  new demo profile's own public avatar loaded at natural width 1280. The card
  defect remains OPEN and has not been repaired. Avatar/registration success
  is not card-image success. The identified inconsistent boundary is dev
  candidate visibility versus private-media access; canonical dev uses
  `demo_db`. No eligibility rule, data migration, profile removal or auth
  relaxation was introduced.
- Overall remains PARTIAL/OPEN. Current entry-domain fixture is verified and
  retained; entry-consent fixture is reset. Pending: missing-card resolution,
  consent 002/003, AUTH-SESSION-001, physical-phone native replay and existing
  explicit coverage gaps. Push delivery remains separate.

### Profile visibility and demo media session repair — 2026-09-14

- User corrected the interpretation: there is no separate private-image
  setting; private profiles do not appear as game cards. `isPublicGameUser`
  already filters cards by public profile status, and `MediaPolicyFacts`
  already derives image visibility from the profile. The earlier statement
  that private-media 401 was justified by the shared dev dataset was incorrect.
- Two code defects caused this case. `MediaSessionAccessService` issued its
  credential only for Firebase-authenticated sessions and private reads always
  routed to REAL. In addition, `onOnboardingCompleted` used untracked
  `startDemoSession` even for HTTP onboarding. The browser-held WebView Email
  Replay session ID has no `userSessionStates` record; its `/auth/me` succeeds
  but cannot receive a credential backed by an active server session.
- Registered demo sessions now obtain a media-only cookie scoped to DEMO. Its
  full hash includes the realm prefix; changing/removing that prefix cannot
  reuse the token in REAL, even when dev shares one physical database. Existing
  Firebase credentials retain their REAL format. Authentication, active-session
  revocation and the existing resource/profile policy still apply. No profile
  was hidden, no image was made anonymously readable and no database migrated.
- New HTTP onboarding now awaits `startTrackedDemoSession`, then loads the
  profile under that session before navigating, matching ordinary demo sign-in.
  Local onboarding stays local. Registration denial prevents navigation.
- Existing backend compiler completed in 2 seconds and DevTools restarted at
  23:32:41.573 local time. Existing frontend-sync compiled at 21:37:07.560Z and
  synced at 23:37:09 local (`entry-page.component-SXKTCUCG.js`). No parallel main
  compiler, server or Gradle process was started.
- Focused validation: 11 JUnit tests passed for media credential issuance,
  active/revoked/malformed state, REAL/DEMO routing, tamper rejection and
  public/private/Friends-only profile policy. Only test sources were compiled
  against the existing watcher's compiled application classes; tests ran via
  JUnit Platform with a bounded 256 MiB JVM. Log:
  `/tmp/myscoutee-media-session-tests/result.log`.
- One scoped versioned HTTP qualification method passed on the existing
  dev Mongo/MinIO/API: legacy REAL credential reads image bytes; `/auth/me`
  issues a DEMO cookie for a fixture-backed active demo session; public profile
  image returns 200 with exact bytes/no-store, private profile returns 403,
  restored public status returns 200, anonymous/invalid/altered-realm/revoked
  credentials return 401. Its exact temporary users/session/objects were
  cleaned up. Method:
  `MediaFriendshipQualificationTest#demoMediaSessionUsesProfileVisibilityAndRejectsRevokedOrAlteredCredentials`;
  log `/tmp/myscoutee-media-session-tests/http-result.log`.
- Four checks executed the watcher's compiled onboarding method in an isolated
  Node VM: HTTP registration -> profile read -> navigation; local-only path;
  rejected registration; unavailable profile prevents navigation and logs out.
  All passed. Matching frontend specs were added; the Angular spec runner was
  not run. This is code-path evidence, not a browser onboarding PASS.
- UI replay remains pending. The user owns normal Logout -> Start exploring ->
  WebView Email Replay selection and then inspecting Peter Szabo's card. The
  agent did not inject a credential or register the user's old untracked
  session through a test request. No new demo profile is required for this
  image replay. Keep the original screenshot failure and PARTIAL/OPEN status
  until the screen result is confirmed. The already-proven unique email/three
  images on first save remain valid, separately from tracked-session behavior.

### Desktop card and first-save session replay — 2026-09-14/15

- User explicitly delegated the full affected UI replay after rejecting a
  handoff of the remaining clicks. The agent used ordinary visible controls;
  no browser cookie/session injection or application-state override was used.
- WebView Email Replay: normal Logout/confirmation -> entry consent -> Start
  exploring -> existing profile selection returned to `/game`. Peter Szabo's
  card image appeared. All three image selectors were exercised and the
  profile detail also rendered its photo. Screenshots:
  `/tmp/myscoutee-card-after-demo-relogin.png`,
  `/tmp/myscoutee-card-image-2.png`, `/tmp/myscoutee-card-image-3.png`,
  `/tmp/myscoutee-peter-profile-images.png`.
- Closed the installed app using its native window close control and reopened
  MyScoutee through Chrome Apps. New standalone document
  `timeOrigin=1789423078579.3` retained the same Email Replay identity. All
  three Peter Szabo large image requests returned 200. Screenshot:
  `/tmp/myscoutee-card-installed-reopen.png`. Registration oracle at
  21:58:23.101Z retained one profile, three images, one experience and email.
- Reset entry-domain tracking at 21:58:41.945Z without deleting the profile;
  staged a fresh baseline at 21:58:42.562Z with 60 users/two prior demo
  registrations. The agent opened New profile and filled WebView Session
  Replay, London, 1995-06-15, 180 cm, Athletic, Man, English. The tester then
  completed uploads/save concurrently and explicitly confirmed the save.
  The agent's attempted upload found the form already closed and did not
  upload a file; do not attribute those final UI actions to the agent.
- The actual loaded entry chunk was `entry-page.component-SXKTCUCG.js`.
  Verify at 21:59:58.349Z passed for
  `demo-profile-23436aab-ed5f-466a-a037-90c9ab40c2b7`: exactly one new
  active/public version-2 profile, three images, one experience profile, one
  unique development email and no Firebase linkage. A separate read-only
  persistence check found one active server session with a media credential
  hash and exactly one login audit. Thus the new first-save tracked-session
  path is now proved through ordinary UI, not only compiled-code tests.
- Peter Szabo's three images returned 200 under this newly created demo
  session. Ordinary page reload created document `timeOrigin=1789423227219.3`
  on `/game`, retained Session Replay, showed no onboarding form, and all
  three image requests again returned 200. Session and audit counts remained
  one. Screenshots: `/tmp/myscoutee-new-registration-card-pass.png` and
  `/tmp/myscoutee-new-registration-reload-pass.png`.
- During entry the UI displayed the prior QA privacy v2 and after fresh save
  displayed default privacy v1 approval. The tester completed that approval.
  Preserve this observed sequence for the queued consent revision checks;
  this image/session replay does not count as consent 002/003 completion.
- Desktop missing-card and first-save session regressions are PASS. The
  broader MOBILE-WEBVIEW-LIFECYCLE-001 row remains PARTIAL/OPEN: consent
  002/003, AUTH-SESSION-001, physical-phone post-fix evidence and the other
  explicit coverage gaps remain. Current entry-domain fixture is verified;
  retain all three transaction profiles. Reset only its tracking before the
  next checkpoint's baseline, not their saved domain data.

### Help/Guide media repair and consent resume — 2026-09-15

- Reset only entry-domain tracking at 2026-09-14T22:03:51.139Z, retaining
  Consent Replay, Email Replay and Session Replay. Staged ENTRY-CONSENT-002
  at 22:03:52.319Z for Nova Social. Earlier UI observations recorded Cancel
  with no session/server consent, then acceptance of only Previous analytics.
- The anonymous checkpoint launcher originally omitted Nova from its common
  actor-session preparation, so two retained sessions blocked login. Added
  Nova to `additionalDemoUserIds` in the versioned browser configuration;
  centralized startup snapshots/clears those sessions and reset restores them.
- The read-only status oracle reconfirmed phase `previous-active`: v3 consent
  `6aa87045fce30caf4117d0b3`, accepted 22:08:05.423005288Z, source `entry`,
  only `qa-previous-analytics`. Target/total consent deltas are both +1;
  anonymous delta is zero, v4 consent is absent, newer activation is absent.
  Do not stage/reset/replay the completed v3 steps to resume.
- User clarified that the failing images belong to Help / Guide. Read-only
  inspection of the open Home cards guide found five `seeded-help/*.svg`
  requests ending in 403 and a displayed No image fallback. A cookie-free
  HTTP request independently showed the first wrong boundary: `/media/public`
  redirected the bundled guide key to `/api/media/private` (307).
- These images are server-seeded MinIO objects, not external image links.
  The same 77 distinct keys appear in demo/e2e/real help revision seeds and
  all exist under `server/docker/conf/minio/media/seeded-help/`.
  `MediaAccessPaths` omitted this public namespace. Added only `seeded-help/`;
  normal user uploads cannot select this namespace.
- Existing backend watcher compiled successfully and restarted at
  22:13:11.206Z. No separate main build/server was started. Two focused
  `MediaAccessPathsTest` tests passed against the watcher-built main classes
  using the retained test-only javac/JUnit runner (128 MiB heap). They cover
  public guides, protected uploads, lookalike prefixes and malformed/traversal
  keys. Available memory was 4.4 GiB; the existing watcher owns main compilation.
- Cookie-free HTTP verification passed for all 77 distinct guide images:
  HTTP 200, `image/svg+xml`, byte-for-byte equality with the seeded SVG,
  public cache headers. A private upload key still redirects to the protected
  route; `seeded-help/../private/image.svg` returns 400.
- User-requested social glyph colors were removed from the landing footer;
  Facebook markup/icon remains. Existing frontend watcher compiled/synced
  at 22:07:15/17Z. Post-change visual replay remains unproven.
- No Guide navigation, close/reopen or reload was performed during this
  defect diagnosis, following the current AGENTS.md manual-browser boundary.
  Guide rendering therefore awaits the tester's close/reopen. Do not record
  HTTP checks as a browser-rendering PASS. After that, resume the v4 activation
  boundary, then consent 003 and AUTH-SESSION-001. Overall WebView remains
  PARTIAL/OPEN; physical-phone and previously listed evidence gaps remain.

### Consent v4 desktop replay — 2026-09-15

- User explicitly delegated the remaining UI actions and continued tests in
  the current turn. Ordinary visible controls were used; no application state
  or credential injection. The tester separately reported that Guide images
  worked on another surface; this is tester evidence, not an agent Home cards
  reopen claim.
- ENTRY-CONSENT-002 v4 activated at 2026-09-14T22:29:01.527Z. Ordinary reload
  forced privacy v4 over the authenticated Nova game. Clicking Close privacy
  popup did not dismiss it. Selected only Current analytics and approved.
- Versioned verify PASS at 22:29:18.948Z: v4 consent
  `6aa8753efce30caf4117d0b6`, source settings, accepted 22:29:18.186037099Z,
  only `qa-current-analytics`; marketing unselected. v3 consent unchanged
  byte-for-byte. Target/total +2, anonymous 0. Desktop consent 002 replay PASS.
  Next reset retains evidence, then consent 003 baseline. Phone remains pending.

### Consent v5 desktop replay — 2026-09-15

- Consent 002 reset at 22:30:01.969Z retained both consents/revisions; consent
  003 staged at 22:30:02.550Z. The versioned launcher prepared a fresh Nova
  browser. Mandatory v5 showed analytics selected, marketing and new research
  unselected. Screenshot: `/tmp/myscoutee-consent-v5-inherited.png`.
- Execution deviation: the agent initially approved before selecting research.
  Verify correctly rejected analytics-only terminal state. This was an agent
  sequence error, not a product defect. Through Settings -> Privacy, explicitly
  selected Product research and clicked Save choices. No database correction,
  fixture relaxation or product change was used.
- Verify passed at 22:31:29.822Z: consent `6aa8758cfce30caf4117d0b8` contains
  analytics/research, marketing absent; target/total +1, anonymous 0; source v4
  revision and consent byte-identical. v5 accepted 22:30:36.287625781Z and its
  explicit choice update saved 22:31:28.978556542Z. Inheritance, required v5
  acceptance and terminal persistence are proved; research was added through
  the existing choice-update UI after initial approval, not in the first save.

### Per-profile session limit desktop replay — 2026-09-15

- All three isolated clients used the SAME profile: Maya Stone,
  `1b1c70be2349b3359a8f6f94`. The contract is at most two active sessions per
  profile. This was not a test of a global two-user or two-browser limit.
  The user reiterated this scope after the run.
- Used the harness's existing MANUAL_QA_INVITEE_USER_ID override because Nova
  retained 51 login audits and prior session/security records. Those records
  were left intact. Maya's read-only preflight was clean; stage at
  22:32:53.105Z confirmed zero sessions/audits/security warnings/outbox. Its
  unrelated existing notifications (11 unread) and domain data were retained.
- A actual selector login 22:33:59.776Z: 1 session/1 audit/0 warnings. Normal
  reload retained the same slot; capture-reload PASS at 22:34:21.260Z.
- B same-profile login 22:34:32.059Z: 2 sessions/2 audits/1 warning. C
  same-profile attempt 22:34:57.037Z stayed on Entry with the explicit
  two-sessions-active message: 2 sessions/3 audits/2 warnings. A and B stayed
  authenticated; A's unread count converged from 11 to 13.
- A ordinary Logout/confirmation released only its slot (one session, three
  audit records retained). C Try again/selector login at 22:35:33.227Z then
  succeeded: terminal phase complete, 2 sessions, exact audit order ACCEPTED,
  ACCEPTED, BLOCKED_LIMIT, ACCEPTED; 3 security notifications and outbox rows.
- B and C both showed unread 14 (11 preexisting +3 test warnings). B's actual
  notification list displayed two new-login and one blocked-login messages,
  normalized Chrome on Linux desktop, separate event timestamps and no raw
  credentials/source metadata. Screenshot:
  `/tmp/myscoutee-auth-session-warnings-pass.png`; terminal oracle retained in
  `/tmp/myscoutee-auth-session-final.json`. Desktop AUTH-SESSION-001 PASS.
- The same run also visually confirmed the repaired Home cards guide images:
  `/tmp/myscoutee-guide-rendered-clear.png`. All five image resource reads
  returned 200 and the screenshot shows the actual rating/graph illustrations.

### Session scope clarification and cross-profile control — 2026-09-15

- User clarified that Maya's per-profile limit test was valid: rejecting Maya
  must not prevent choosing another profile from the list. The agent had
  mistakenly interpreted an earlier remark as a demo exemption and briefly
  changed admission/maxActiveSessions. Those exact changes and their temporary
  test were fully reverted. Both source files match HEAD again; existing
  backend watcher restarted the restored implementation at 22:42:23.645Z.
  No unlimited-demo behavior is retained and the original Maya PASS stands.
- Supplemental baseline staged 22:43:42.726Z after a failed launcher startup
  was reset. The versioned launcher prepared two Maya sessions as saturation
  prerequisites and an anonymous C window. No manual-login PASS is inferred
  from these prepared sessions.
- In C, selecting Maya produced the two-sessions message. Try again restored
  the selector; selecting Kiss Balázs (`b29df68956f3fe15e04558de`) opened
  `/game` as Balázs in the SAME browser. Independent persisted read proved
  Maya still has two active sessions with ACCEPTED/ACCEPTED/BLOCKED_LIMIT;
  Balázs has one active session and one ACCEPTED audit. The whole selector is
  not globally locked: its error view requires Try again to show the list.
- Candidate lifecycle-31 copied only existing frontend watcher output, with
  buildId `mobile-webview-lifecycle-1789425829732`, git `880ba00ff9cf`,
  index SHA256 `5c3ff07ca8b5e7cdc2e8a1eac843d706d13cddf33d5a637ca8fe061c899c8dd2`,
  worker SHA256 `09a91b1802894f115f8bfee2df54f4dbc4855a2b23ceec481315546bd058e161`.
  Served only on the phone localhost:8080 route. Phone still had the earlier
  loaded build before the upcoming normal close/reopen; do not infer activation.

### Candidate 31 phone entry and resident Settings resume — 2026-09-15

- Auth supplemental fixture reset 22:45:33.243Z. Normal local QA WebAPK close
  and launcher reopen activated lifecycle-31 (`1789425829732`) on
  `http://localhost:8080/`, standalone, without clearing storage or uninstall.
  Phone UI remained Hungarian. Footer screenshot
  `/tmp/myscoutee-phone-footer-neutral.png` proves neutral social glyphs with
  Facebook retained; computed colors match their button text colors.
- Mobile fixture staged at 22:47:11.399Z. Actual phone selector login as Riley
  succeeded, and all three Peter large image URLs returned 200 after the
  tracked session was established. A startup small image request returned 401;
  this does not invalidate the subsequent large-photo reads and is retained
  as a timing observation rather than claimed as an all-request PASS.
- Opened Notifications/New: baseline unread 4, including one controlled
  baseline row. Document timeOrigin `1789425983526.4`. Pressed Android Home,
  opened native Settings (`com.android.settings/.MiuiSettings` confirmed),
  and verified app visibility hidden with the same timeOrigin.
- Versioned background-settings-resident mutation created exactly one Riley
  notification at 22:48:32.550Z. Used Android Recents and tapped the measured
  MyScoutee card. No page reload: same timeOrigin, visibility visible, same
  Riley identity, unread 5, new controlled row once. After normal polling and
  Notifications close/reopen, the count stayed 5 and the row remained single.
  This closes the previously unproven resident Settings variant.
- User then requested proportional fitting of the main rating photo on mobile.
  The measured fullscreen background used cover (312.8 x 523.5 CSS px), which
  cropped the image. Mobile home deck now sets contain through a scoped card
  image-fit property, covering both single/pair cards. The completed watcher
  and physical-phone verification follows below; Help/Guide layout is unchanged.


### Mobile home rating photo fit — 2026-09-15

- User clarified that the requested proportional fit applies to the main
  Home rating card. Its mobile deck now supplies `--rate-card-image-fit:
  contain`; single/pair photo backgrounds consume that property. The full
  image fits by whichever dimension constrains it, centered with unused space
  where necessary. Other consumers retain their existing default.
- Existing frontend-sync watcher compiled successfully at 22:51:09.164Z and
  synced at 22:51:11. No separate compiler or test process was started.
- Candidate lifecycle-32, build `mobile-webview-lifecycle-1789426314950`, was
  activated on the physical phone without clearing application storage.
  Read-only inspection of `/game` confirms all three profile photo layers use
  `background-size: contain` within 312.8125 x 523.5234375 CSS px frames.
- Before/after captures: `/tmp/myscoutee-phone-rating-before-contain.png` and
  `/tmp/myscoutee-phone-rating-contain.png`. The latter shows the complete
  uploaded logo with preserved proportions and space above/below. Main mobile
  rating-photo regression PASS; no separate pair-card visual replay claimed.
- The overall WebView checkpoint remains PARTIAL/OPEN. Physical native install
  timing and ordinary frontend-local device-preference UI/reload remain open;
  clipboard branches previously deferred by the tester remain deferred.


### Native install continuation preparation — 2026-09-15

- Read-only mobile fixture status matches the retained resident Settings
  boundary; both tickets, Riley-only notifications and public asset checks
  pass. Phone `aer8vgcmyd9lzxv8` and reverse `tcp:8080 tcp:80` remain available;
  existing frontend/backend containers are healthy.
- Versioned `open-checkpoint-browser-sessions.mjs
  MOBILE-WEBVIEW-LIFECYCLE-001` completed standardized startup for Casey Bridge.
  Common startup retained the pre-launch session snapshot and prepared only
  the configured Casey identity. No subsequent manual checklist action ran.
- The next phone step uses Chrome at `http://127.0.0.1:8080/`, a separate origin
  from the retained installed `http://localhost:8080/` QA PWA. Host-side reads
  confirm the existing server supplies its page and relative app manifest.
  Native install eligibility on the phone is not yet proven. The user performs
  the native dialog sequence under the current AGENTS.md manual-QA boundary;
  do not uninstall or clear the existing localhost application.


### Physical native installation replay — 2026-09-15

- User explicitly reauthorized agent execution of the entire remaining test,
  including ordinary browser/device actions. This overrides the default
  user-only manual browser boundary for this continuation.
- Opened Chrome at the separate QA origin `http://127.0.0.1:8080/`, accepted
  ordinary entry consent, then used the visible application Install action.
  Native UI showed Install app / MyScoutee / the exact QA origin.
- Native decision pending: application Install button disabled and no ring.
  Native Cancel: action released, no ring. A newly offered installer was then
  opened through the application action, with the same pending state.
- Read-only DOM/event observation around actual native acceptance recorded:
  1789427458667 pending without ring; 1789427458837 loading ring;
  1789427458840 real `appinstalled`; 1789427458864 Install action removed.
  Raw observation: `/tmp/myscoutee-phone-native-install-observation.json`.
  No browser API replacement or synthetic install event was used.
- Android package `org.chromium.webapk.a15bb28bd0ec620cc_v2` appeared;
  package inspection identifies `127.0.0.1`. Both pre-existing WebAPKs remain
  installed. Physical native waiting/cancel/accept/completion timing PASS.
- Local-device UI qualification now temporarily uses the normal local data
  source configuration through the existing watcher, with worker enabled and
  Firebase login disabled. The exact dev configuration is retained at
  `/tmp/myscoutee-webview-environment.dev.before-local.ts`, SHA256
  `bd938c8438d6baf591628f779b0dc08a0b7181f3d0c690b7e3aa70df0e15b54b`.
  Restore those exact bytes after this branch. No second compiler was started;
  existing watcher compiled at 23:12:01.182Z. Original localhost:8080 phone
  snapshot still serves lifecycle-32 unchanged.


### Local device UI persistence replay — 2026-09-15

- Used the physical localhost:8080 QA PWA with normal local deployment
  candidate 33 (`1789427667878`), existing native notification grant and
  ordinary Farkas Anna (`u1`) entry. Read IndexedDB directly, without service
  invocation, for each persistence observation. The separate 127.0.0.1 probe
  did not establish permission-enabled persistence; it is not counted as PASS.
- Baseline retained one pre-existing Anna registration for browser device
  `94416021-6b84-47a2-b1cd-2ea8b10054c1`. Settings -> Permissions -> off ->
  Update removed it (23:16:57.937Z). Popup reopen showed off; ordinary page
  reload kept off and zero devices (23:17:50.366Z).
- On -> Update restored one registration at 23:18:43.716Z. Popup reopen showed
  on; repeated Update kept one record and preserved registeredAt while updating
  lastSeenAt (23:19:14.762Z). Reload retained on and exactly one record
  (23:19:37.214Z). No Firebase token was fabricated.
- Profile About edit/save/reopen retained the device unchanged
  (23:20:01.271Z); ordinary UI restored the original About text immediately.
- An early reload interrupted the first attempted logout before completion;
  no logout PASS was inferred. The normal logout was repeated and allowed to
  finish: /entry, no active local user at 23:21:19.160Z. Cross-account
  registration transfer is the next oracle.


### Seed progress order correction — 2026-09-15

- User reported the loading percentage jumping backwards near completion.
  Union bootstrap ran common collections to 94%, admin users to 97%, then
  operator users through the old shared `users` step at 34%, before 98/100.
- Added a distinct `operatorUsers` progress stage at 97% and used it at the
  actual late operator-seeding boundary. Seed execution/dependencies remain
  unchanged. Extended the existing union bootstrap regression to require a
  non-decreasing 0-to-100 trace; no separate Vitest compiler was launched.
- Existing watcher produced local candidate 34 (`1789427977519`). Physical
  phone normal selector entry, with read-only DOM observation, recorded
  0,0,11,22,34,40,43,52,64,82,94,97,97,98,100. Runtime assertion confirmed
  non-decreasing progress and terminal 100. Screenshot/state was not injected.
  Trace: `/tmp/myscoutee-phone-seed-progress-pass.json`. Physical regression PASS.

### Local account registration initialization repair — 2026-09-15

- Before fix, ordinary local switch to Balázs (`u2`) left the registration on
  Anna (`u1`). PWA startup gates external Firebase registration to HTTP mode;
  the local messaging service's account-change effect therefore never started.
- Local messaging construction now starts its existing local registration
  effect. HTTP initialization remains under its existing gate. The local branch
  also avoids reading the external Firebase runtime. This registers no token
  and requests no native permission automatically.
- Existing watcher built local candidate 35 (`1789428253622`). Physical normal
  close/reopen activated it; 23:25:13.523Z direct IndexedDB read confirms Anna
  devices empty and Balázs owns exactly the same browser device. Native grant
  and both HTTP preference/device keys remain unchanged. Further off/reload
  and reverse account-switch checks follow before closure.


### Physical consent revision and inheritance replay — 2026-09-15

- The phone prefers Hungarian content. The revision fixture now accepts
  `MANUAL_QA_PRIVACY_LANG=en|hu` (default en), persists the selected language,
  and refuses status/mutation/reset with a mismatched language. The common
  Docker/local wrapper forwards the setting. The inheritance fixture selects
  the latest exact matching source consent in that language and requires that
  source to be the latest revision before creating the next immutable version.
  Stable optional IDs, exact counts and immutable-source checks are unchanged.
  JS syntax and shell syntax checks passed; actual hu stage/verify/reset passed.
  Legacy result-property names containing V4/V5 remain compatible; numeric
  revisionVersion fields are authoritative for repeated/localized runs.
- Initial en v6/v7 preparation was reset without consent transactions after
  identifying the language mismatch. Those inactive fixture revisions are
  retained by the normal harness; no prior evidence was deleted.
- Phone hu ENTRY-CONSENT-002 baseline 23:30:11.460Z: v2/v3, target 5 consents,
  total 33, anonymous 0. Ordinary Reject left no HTTP user or entry consent and
  all server deltas zero. Selected only Previous analytics, then real Nova
  selector login. v2 consent `6aa88418fce30caf4117d0d9` accepted
  23:32:40.657767710Z, source entry.
- Newer v3 activation 23:33:01.230Z forced the authenticated phone popup after
  reload; Close left it open. Selected only Current analytics and approved.
  Verify 23:33:31.933Z: v3 consent `6aa88442fce30caf4117d0da`, target/total +2,
  anonymous +0, earlier v2 unchanged. Reset 23:33:32.965Z retained both audits
  and restored hu default v1. `/tmp/myscoutee-phone-consent-002-pass.json`.
- Phone hu ENTRY-CONSENT-003 staged 23:33:33.491Z: source hu v3, new hu v4.
  After normal Nova sign-in, required popup showed Current analytics selected,
  Current marketing and new Product research unselected. Screenshot:
  `/tmp/myscoutee-phone-consent-inherited.png`. Selected Product research BEFORE
  the first approval. Verify 23:35:36.690Z: one new consent
  `6aa884c1fce30caf4117d0dc`, analytics+research, no marketing, source settings;
  accepted/updated 23:35:29.557310663Z; source revision/consent unchanged,
  target/total +1, anonymous +0. Exact first-approval sequence PASS on phone.
  Reset 23:35:37.707Z restored hu default v1 and retained evidence.
  `/tmp/myscoutee-phone-consent-003-pass.json`.


### WebView final physical replay and cleanup — 2026-09-15

Times below are UTC on 2026-09-14 (local date 2026-09-15). This section
supersedes the pending follow-up and temporary deployment notes above.

- Local candidate 35 post-fix continuation: Balázs off/Update left both u1/u2
  device lists empty at 23:25:55.516Z; reload retained off/empty at
  23:26:10.168Z. On/Update restored exactly one Balázs device at
  23:26:14.857Z. Normal completed Logout followed by real Anna selection
  automatically transferred the same browser device to Anna: u1 one, u2 zero
  at 23:27:18.105Z. Popup off/on, persistence after reload, repeated Update,
  unrelated profile save and both account-transfer directions are now observed
  through ordinary physical-phone controls. Other-device preservation retains
  the earlier adapter coverage; this run did not add a second local device.
  Original About text was restored through UI; Anna then logged out normally.
  HTTP preference/device keys were preserved. No Firebase token was invented.
- Supplemental AUTH-SESSION-001 used Maya Stone
  `1b1c70be2349b3359a8f6f94`. Fixture staged 23:36:25.973Z; versioned launcher
  prepared desktop A/B with two accepted sessions. Those prepared logins are
  prerequisites, not new manual login evidence (the actual earlier desktop
  A/B/C run remains authoritative). Physical C selected Maya normally and was
  blocked on entry: two active sessions, third audit BLOCKED_LIMIT, Android
  client label. Desktop A normal Logout released one slot. Phone Try again
  restored the selector; actual Maya selection entered /game successfully.
  Final two active sessions, four audits (ACCEPTED, ACCEPTED, BLOCKED_LIMIT,
  ACCEPTED), three warning notifications/outbox records. Last two audits are
  Android. `/tmp/myscoutee-phone-session-limit-final.json`.
  Phone Maya logged out normally before fixture reset at 23:40:18.108Z.
  Per-profile enforcement remains unchanged; the earlier same-browser
  Maya-blocked -> Balázs-accepted proof is retained. The selector is not blocked
  globally, and there is no newly introduced demo exemption.
- Physical entry footer visual and computed-style verification passed: all
  three contact icons are 28 CSS px, neutral/light, with Facebook retained and
  no clipped glyph. `/tmp/myscoutee-phone-footer-large-icons.png`.
- Normal HTTP dev configuration restored byte-for-byte (SHA256
  `bd938c8438d6baf591628f779b0dc08a0b7181f3d0c690b7e3aa70df0e15b54b`). Existing
  frontend watcher generated lifecycle-36, build
  `mobile-webview-lifecycle-1789428466369`, at 23:27:46.395Z. Index SHA256
  `bfc630a6e417096a0b62338a1409e4c8e9c55c210b750b52fd5c91c2cd0aa56e`;
  worker SHA256 `598f4fb9762bf950a2121d04933ce2b16479a56d61d5d02873f322c6301c6176`.
  Closing only the localhost QA client and reopening the original installed
  app activated this build normally: /game, standalone, activated worker and
  no waiting worker. No app data/cache clearing or reinstall was used.
- Cleanup verified: mobile, auth and both consent checkpoints report
  not-staged. Maya's auth/session/audit/notification/outbox residue is zero;
  retained Nova consent evidence is intentionally preserved (8 target, 37
  total), with `privacy-default-hu-v1` restored active. Earlier en fixture
  preparation also reset without acceptance. AUTH managed desktop windows
  closed through the versioned launcher. The owned 127.0.0.1 probe tabs and
  temporary WebAPK `org.chromium.webapk.a15bb28bd0ec620cc_v2` were removed after
  verifying its origin. Original localhost and GitHub WebAPKs remain installed;
  `tcp:8080 -> tcp:80` reverse transport remains available.
- Active WebView execution is complete for the non-deferred work. Status stays
  PARTIAL because fresh phone native clipboard Allow and desktop allowed paste
  were explicitly deferred by the tester. Already-granted phone paste and
  native Block remain proven. The desktop consent-003 sequence caveat remains
  recorded; the exact initial-approval sequence now passes on physical phone.
  Real FCM delivery remains owned by MOBILE-PUSH-LIFECYCLE-001.


### WebView clipboard closure — 2026-09-15

The user requested finishing the remaining WebView work, superseding the
clipboard deferral. Both remaining observations now PASS; no application code
or build was changed for this closure.

- Resumed from the retained lifecycle-36 phone build
  `mobile-webview-lifecycle-1789428466369`. Read-only preflight confirmed the
  running stack, USB reverse route and no staged mobile fixture. Versioned
  mobile fixture staged at 2026-09-14T23:56:01Z. Versioned browser launcher
  prepared one isolated desktop Riley control through a temporary checkpoint
  actor override; common session preparation snapshotted Riley's original
  session. This preparation is not new login evidence.
- Desktop: opened My Assets -> Transport -> QA Mobile Public Transport ->
  Edit. Typed the exact 44-character URL
  `https://example.com/qa/mobile-webview-source`, copied via real Ctrl+A/C,
  cleared the field, then clicked the application's Paste link button. The
  actual Chrome prompt appeared; screenshot-verified native Allow inserted
  exactly the URL and changed native permission to granted. Viewport
  1136x763, document scrollWidth 1136; no horizontal expansion. Screenshots:
  `/tmp/myscoutee-desktop-clipboard-prompt.png` and
  `/tmp/myscoutee-desktop-clipboard-allowed.png`.
- Cancelled the desktop Asset editor without Save. Opened Settings ->
  Permissions: 340 px dialog/client/scroll width, zero Asset editor instances,
  normal content and controls. Closed the popup normally.
- Phone: the user removed the retained native clipboard exception. After
  returning to the original installed localhost PWA, a read-only browser query
  confirmed prompt. Completed ordinary entry consent/real Riley selection to
  reach the fixture; no session injection or clipboard API override was used.
  Opened the same Transport editor, entered the exact URL, selected all 44
  characters and tapped Android's actual Copy action. Cleared the source field
  and dismissed the keyboard before the application's Paste link click.
- The fresh native Block/Allow dialog identified `http://localhost:8080`.
  Screenshot `/tmp/myscoutee-phone-fresh-clipboard-allow-prompt.png`. Native
  Allow was tapped. At 2026-09-15T00:04:21.759Z the field equalled the complete
  URL, permission was granted, and the app remained standalone on lifecycle-36.
  Viewport 360x753, document width 360; both Asset dialogs had
  clientWidth=scrollWidth=360. The one-line URL scrolls within its input; the
  popup does not stretch. Screenshot:
  `/tmp/myscoutee-phone-fresh-clipboard-allowed.png`.
- Cancelled the phone editor without Save and opened Settings -> Permissions.
  At 00:05:06.002Z there were zero Asset editor instances, document width 360,
  permission dialog width 340.796875 with clientWidth=scrollWidth=341. Normal
  controls remained available; popup then closed normally. Earlier native
  Block/denied retry evidence remains valid and was not replayed.
- Read-only Mongo oracle after both cancellations: controlled sourceLink still
  empty; createdDate and updatedDate both `2026-09-14T23:56:01.260Z`. No Asset
  edit persisted. Both clients completed normal Logout confirmation and
  reached /entry. Versioned reset restored common session state and fixture
  snapshots; final status is not-staged. Owned desktop session and temporary
  phone Chrome QA tab closed. Original two WebAPKs/cache and reverse route
  remain; the accepted native clipboard grant is retained.
- MOBILE-WEBVIEW-LIFECYCLE-001: PASS/CLOSED. These observations close both
  previously deferred clipboard gaps. Retain the earlier platform-specific
  evidence and consent-sequence caveat without rewriting their history.
  Campaign now 91/104 passed, Notifications 2/6. Next queued journey is
  MOBILE-PUSH-LIFECYCLE-001; actual FCM delivery has not been exercised here.


### Notification Admin rule-edit baseline — 2026-09-15

`NOTIFICATION-ADMIN-LIFECYCLE-001`, section 1 steps 1–2: the versioned
`notification-admin` scenario captured the original rule, actor data/session
baselines, target row selectors and read-only unrelated-rule/Monitoring controls.
Original Send notifications interval: 1 minute (60 seconds), enabled true.
Firebase is inactive after Push rollback; target outbox/inbox 0/0 and all three
actor notification counters 0. No rule edit or producer action was performed.
The stable guide now describes the user-approved saved Firebase decision
contract: new explicit false decisions complete with zero provider calls, while
legacy null-decision messages retain their older behavior.

- **Notification Admin section1 PASS, 2026-09-15.** Runtime preflight exposed a
  Push-fixture cleanup gap: direct Mongo rollback left the Java Firebase flag
  active. Existing DevTools reload refreshed it; `/api/admin/dashboard` then
  returned exact Ava identity. The rollback helper now reloads the running
  backend after direct configuration restoration and retains a retry marker.
  No application authentication code changed.
  Timing Save originally submitted the old list copy instead of the edited
  detail object. One call now passes `[rule]` to the existing save path.
  Existing frontend watcher build succeeded11:52:18Z; focused UI replay persisted
  Every2 minutes and reopen matched Mongo, enabled true, same Runner history,
  no inbox/outbox. The versioned invalid-rule request sends a nonnumeric interval
  amount: HTTP400, entire rules/outbox/inbox collection digests unchanged.
  This proves malformed-field rejection, not validation of every numeric range.
  Nova and Casey Notifications/New both visibly showed0 before the producer.

- **Section2 steps10–14 PASS.** Exactly one controlled Chat API message
  `18c4030e-ced6-491c-84e3-6678f2e5c7de` produced outbox
  `6aa932a6f59d38d912af4243` and Nova inbox `6aa932a6f59d38d912af4244`.
  Normal scheduler run `d66911ba-1a2f-4efc-aeed-1bd017e30e4c` completed
  2026-09-15T11:59:04.588750821Z,52ms,processed1. Saved Firebase decisionfalse,
  provider success/failure/retry0. Nova New1, Casey0; normal row-menu Mark as
  read persisted12:00:15.762233394Z, Nova New0/AlloneRead, source Chat unread1.
  Versioned delivery/read savepoints verified exact identities and counters.
- **Step15 partial.** Monitoring showed stale seeded queue values: one controlled sent item among308 global sent rows, displayed sent0. Backend telemetry persistence throws MappingException for
  dotted map keys before updating Monitoring. Diagnosis remains open.
  Responsive cards now use4columns at596px and2columns at360px; all node/badge
  scroll widths and badge bounding rectangles remain contained. Long badge
  labels wrap and numeric counts stay visible. Existing watcher build passed
  12:04:39Z. Screenshots: `/tmp/myscoutee-qa-browser-sessions/evidence/notification-admin-cdp/monitoring-badges-four-columns.png`
  and `monitoring-badges-mobile.png`. Ava restored to the596px view.

- **Step15 PASS after focused Mongo initialization fix.** Runtime logs named
  `projectingArgumentResolverBeanPostProcessor` as the eager creator of
  `mappingMongoConverter`/`mongoTemplate`, before the existing dotted-key
  post-processor was registered. Read-only JDWP inspection confirmed the actual
  converter had a null dot replacement. The same existing post-processor now
  implements PriorityOrdered and its bean declares that concrete type, so it
  runs before eager repository initialization. No queue/delivery logic changed.
  Existing compiler/DevTools build succeeded12:13:31Z; fresh Monitoring snapshot
  at12:13:32Z matched Mongo: pending0,running0,failed0,sent308. Reopened UI showed
  those values and Healthy. The controlled outbox is exactlyone of308; its
  saved Firebasefalse and provider0/0 remain unchanged. No native push is claimed.
  Three focused MongoConverterConfigTest cases passed, including early converter
  creation by another post-processor, dotted-key writing and embedded pricing-id
  roundtrip. Command used existing compiled main classes, one worker,256MiB test
  heap, and excluded compileJava/processResources/touchDevtoolsReloadTrigger.
  Screenshot: `/tmp/myscoutee-qa-browser-sessions/evidence/notification-admin-cdp/monitoring-delivery-pass.png`.

- **Section3 steps17–20 and cleanup PASS.** Second attributed scheduler run
  `df6b70e7-9cbf-4e47-b08e-6b4f8d26f421` completed12:16:03.109732335Z,
  35ms,processed0. Exact persisted outbox/inbox documents and read timestamp
  unchanged; Nova UI AlloneRead/New0, Casey New0, Chat unread1. The harness first
  compared a Mongo object wrapper with a JS wrapper of different key order;
  comparing the two persisted documents individually removed that false failure.
  UI Timing restored1minute and reopen matched enabledtrue; unused calendar
  fields normalize during interval edits, so this oracle compares interval
  fields. The full original timing, including null calendar fields, was restored
  by exact fixture reset. The unrelated scheduled-messages rule retained30minute
  timing/enabled state; its unused calendar defaults had normalized during the
  original pre-fix all-rule save and normal scheduler history advanced. It was
  deliberately not rolled back with unrelated scheduler writes.
  The versioned launcher closed all3 owned browsers; common session reset and
  scenario reset succeeded. Final controlled chats/messages/outbox/inbox/member
  rows and scenario snapshots all0; all3 actor notification counters0. Every
  scenario-owned snapshot was compared after restoration. Monitoring retains
  ordinary telemetry history; no global telemetry rollback was performed.
  **NOTIFICATION-ADMIN-LIFECYCLE-001 PASS/CLOSED; campaign93/104, Notifications4/6.**

### Scheduled messages baseline — 2026-09-15

`JOB-MESSAGES`, section1 before step1: reused the versioned Admin
`scheduled-messages` inactive-user fixture and bound its managed startup to
`job-messages` checkpoint stage/ready/arm/status/reset. Original rule enabledtrue,
interval1800seconds; startup holds its scheduler timestamp until explicit arm.
At12:22:53Z the fixture created exactlyone Scheduled action task for
`admin-job-fixture:v1:scheduled-messages:user`; user statusA/profileStatuspublic,
no runs or deliveries, no preexisting due tasks to quarantine. First launcher
attempt waited for an absent explanation guide and cleaned up its windows;
per-checkpoint guide dismissal disabled. A subsequent readiness check exposed
a fixture-only onboarding redirect because profileFormVersion was missing.
The ready fixture now supplies version2, without changing onboarding code.
After versioned relaunch both Ava and **Admin fixture scheduled-message user**
passed the final authentication/realtime readiness gate; the task was still
Scheduled with no run or delivery. No manual checklist action or worker result claimed.
Inactive-user arm ages only disposable startup activity before scheduler release;
this is baseline preparation, not proof of an inactivity action. Current point:
section1 step1. Notification Admin remains PASS/CLOSED; campaign93/104,
Notifications4/6. User requests an introductory explanation for each testcase,
plus continuing exact block/step/action commentary during execution.

### Scheduled messages full-flow execution — 2026-09-15

The user explicitly delegated both JOB-MESSAGES variations and cleanup to Codex.
Current result: **PASS / CLOSED**. Both business branches and the step12 display fix are verified; see the focused closure evidence below.

- Section1 steps1–2: existing Ava Job Detail showed Eligible1, enabledtrue,
  disabled Run, old Runner history. The future Last run timestamp was the
  documented fixture hold, not a real run. Initial Monitoring Jobs690/689.
- The existing operational poll was1800000ms, so the initial one-minute wait
  yielded no worker result. `job-messages-runtime.py enable` retained its exact
  compiled dev property and temporarily selected60000ms through existing
  DevTools. No main compilation, second worker, hidden Run, new endpoint or
  worker implementation was used. The normal scheduler ran on application
  startup after this configuration reload; this is an environmental timing
  qualification, not an on-schedule minute-poll timing PASS for the first run.
- Section1 action PASS: dispatcher `2b2d6a97-0544-4ac7-8577-8d910dcb9b4c`
  completed12:33:01.958482791Z,31ms,one scheduled task. The separate task audit
  `312012cc-bfbb-4d7d-8c3f-820d0c0e67a9` completed12:33:02.040979439Z,
  affected1, notification0/email0/failure0. Task completed/lastRunCount1;
  exactlyone completed action delivery and one ADMIN_STATUS_CHANGED USER
  affinity task. Profile statusI/profileStatusinactive. The existing browser
  showed Your profile is inactive and no rating controls; no reload was used
  to manufacture this transition. No bell was created.
- Section1 Monitoring was Healthy and advanced706/705, including unrelated
  job activity. Target attribution comes from the exact dispatcher/task audit;
  do not treat the whole+16 aggregate as this task. Its transient Redis events
  had been consumed before the probe captured them. This narrower attribution
  evidence is retained explicitly. Exact first-variation reset succeeded.
- Section2 baseline: newly prepared recent-user, Eligible1, enabledtrue,
  Run disabled, original history. Monitoring before720/719. Normal minute poll
  dispatcher `d93e9054-4db7-4b8e-8870-326ff5a13f0d` completed12:38:02.005848283Z,
  19ms,one scheduled task. Task audit `29ae84a5-5730-4f23-b7d5-711dab7c2fa0`
  ended12:38:02.023001114Z with User active; rescheduled, affected0.
  Exactlyone rescheduled action delivery; no affinity task/notification/email.
  DueAt moved to2026-10-15T12:35:27.643Z, exactly30days after recorded device
  activity. Profile remained A/public, no inactive banner, rating controls
  remained present. Versioned read-only oracle assertions passed for both
  task/user/audit/delivery/affinity cases.
- Section2 Monitoring PASS: target Redis events1789475882001-0 (started) and
  1789475882009-0 (completed) both name scheduled-messages, scheduled trigger,
  amount1; completion19ms/processedCount1 matches the dispatcher. Monitoring
  watermark1789475942188-0 at12:39:04Z passed both IDs; UI Healthy727/726.
  Other jobs account for the remainder of the global+7/+7 change.
- **Initial step12 UI expectation NOT MET; resolved below.** The public Job Detail records the
  scheduler's dispatch operation, with generic Scheduled due message tasks for
  local execution. User active; rescheduled exists in the persisted task audit,
  which this surface does not expose. The stable requirement was not weakened,
  no task result was injected into dispatcher history, and the existing worker
  scheduling was not refactored. Thus the complete checklist is not marked PASS.
- User-requested Monitoring presentation fix: card content aligns to the top;
  compact badges stay on one line and within cards, with full native titles
  for clipped text. Narrower connectors leave more room for card titles.
  Existing frontend watcher succeeded12:36:48Z. Actual916px,596px/four-column,
  and360px/two-column views had zero node/badge overflow; all nodes top-aligned,
  no multiline badges. Screenshots are under
  `/tmp/myscoutee-qa-browser-sessions/evidence/job-messages-cdp/`:
  inactive-banner, inactive-worker-complete, inactive-monitoring-after,
  recent-profile-active, recent-worker-complete, recent-monitoring-after,
  monitoring-top-alignment, monitoring-top-four-columns, monitoring-top-mobile.
  Exact original task artifacts: inactive-user-oracle.json and recent-user-business-oracle.json (retained before the focused display retest).
- Cleanup PASS: owned browsers closed; both variation resets restored retained
  documents, primary rule and secondary counters. Final user/task/run/delivery/
  affinity/session/session-action/inbox and both fixture snapshot counts0.
  Rule remains enabled with original30minute Timing. Runtime helper restored
  `${SCHEDULED_MESSAGES_TASK_POLL_DELAY_MS:1800000}` and verified existing
  DevTools reload; its retained override marker is removed. Campaign remains
  93/104 passed, Notifications4/6. Remaining scope is the step12 UI audit gap;
  earlier successful branch execution does not need to restart.


### Scheduled messages step12 display closure — 2026-09-15

**JOB-MESSAGES PASS / CLOSED.** The already-proven inactive and recent-user
business cases remain valid. The focused retest exercised only the new task-result
display through one real recent-user scheduler pass.

- Job Detail now reads the 12 most recently executed tasks through the existing
  authorized Jobs response and SmartList poll. Each item shows that task's latest
  stored result, affected count and next due time if it is still Scheduled.
  This is a bounded latest-results list, not every historical run of each task.
  The existing task audit and separate dispatcher Runner history are preserved.
  No worker, queue, inactivity rule or production Timing behavior changed.
- Normal scheduler dispatcher `cafd7fe0-676f-4d99-9873-de06cf88e20c` completed at
  12:54:16.964220821Z, 34ms, processed1. The exact task audit
  `506eea79-8b65-4724-9a6c-27b0b3916f4e` completed at12:54:17.019435337Z:
  Scheduled/affected0, one rescheduled action delivery, no affinity/bell/email/failure,
  user A/public. DueAt2026-10-15T12:52:04.201Z equals recorded activity plus30days.
  The read-only versioned task/user/audit/delivery/affinity oracle passed.
- Ava's already-open **Latest task results** changed from No runs yet to
  Scheduled / 0 affected / User active; rescheduled. / Next task due:15Oct14:52.
  It required no reload or manual job action. Reopening Job Detail retained the
  same result. Timing stayed Every30minutes. At916px and360px the result and
  identifier stayed inside the card. The user saw the managed browser surface.
- Evidence under `/tmp/myscoutee-qa-browser-sessions/evidence/job-messages-cdp/`:
  `recent-user-oracle.json` is the focused retest; `recent-user-business-oracle.json`
  retains the original business/Monitoring evidence. Screenshots:
  `step12-task-result-live.png`, `step12-task-result-mobile.png`,
  `step12-task-result-reopened.png`.
- Existing main backend/frontend watchers compiled the changes successfully.
  Focused AdminNotificationServiceTest:5 passed,0 failures/errors/skips. It covers
  the reschedule due date, absence of a next due date for a completed task,
  unchanged dispatcher history and no task query for unrelated jobs. The focused
  test excluded main compile/resource/DevTools tasks. English/Hungarian i18n audit
  passed for both source bundles and all three Mongo seeds.
- Cleanup PASS: versioned launcher closed its windows, Admin fixture restored
  exact documents/rule/counters, checkpoint restored actor sessions and reports
  not-staged/tasknull. Original1800000ms operational poll restored through the
  existing DevTools process; override marker removed. Campaign94/104,
  Notifications5/6. Next checkpoint: BELL-RATING-LIFECYCLE-001.


### Scheduled messages final table presentation — 2026-09-15

User-requested presentation, verified after the step12 business/UI closure:

- Runner history and Latest task results share the compact table style. Status
  uses a Completed check icon or Scheduled clock with its full accessible label.
  Internal task identifiers are no longer rendered.
- A borderless, transparent info control stays20x20px inside an unchanged28px
  hit area. Closed uses info_outline; open uses the filled info glyph, with no
  filled rectangular background or hover/press scaling. The row stays visible;
  the full detail appears beneath it like an accordion and toggles closed again.
- Live916px and360px verification passed for both tables. At360px each table's
  clientWidth and scrollWidth are282px: no horizontal scrollbar. Info toggles
  keep aria-pressed/aria-expanded in sync, and the unchanged result appears
  below its source row. Existing frontend watcher completed13:12:16Z.
- Final screenshots in the existing job-messages-cdp evidence directory:
  step12-icon-only-desktop.png and step12-icon-only-mobile.png.
  This presentation-only fixture loaded the already-proven12:54 task result;
  it did not run another worker or supply new business-behavior evidence.
  The earlier real scheduler, audit and Monitoring proofs remain authoritative.


### Rating bell consolidated baseline — 2026-09-15

BELL-RATING-LIFECYCLE-001 section1 step1: user authorized continuing the full
Notifications testing after accepting the JOB-MESSAGES presentation. Its final
presentation fixture/session reset passed. Existing graph-rating fixture was
bound to the consolidated checkpoint and staged13:13:43.700Z. Casey061/Nova062
forward rating072 has scoreGiven0/scoreReceived0/Mettrue; reverse row and direct
pair edge absent. Snapshot retains actor sessions, original ratings, affected
affinity edges, notifications/outbox and Statistics/Monitoring/control/layout
baselines. Existing materialized layout08:59 is older and has no pair edge;
this is a captured prerequisite, not proof of the forthcoming graph update.
Managed Casey/Nova/Ava startup initiated; no rating action or new PASS yet.

### Rating bell and reciprocal delivery — 2026-09-15

`BELL-RATING-LIFECYCLE-001` remains IN PROGRESS. Section1 steps1–8 passed:
Casey selected4 without a write, saved once, normal batch persisted one rating
and one Nova inbox/outbox; Mark as read set readAt once and reopening All kept
the same row and zero New count. Section2 steps9–10: Nova saved3 once, Casey
received one row and marked it read; both target unread projections are zero,
no self notification or duplicate. Evidence: `/tmp/myscoutee-qa-browser-sessions/
evidence/bell-rating-cdp/` labels `score-four-not-saved`, `forward-saved`,
`first-mark-read`, `first-reopened`, `reciprocal-saved`, `reciprocal-read`,
`before-fixture-correction`. Persisted one paired row currently stores3/4 and
mutuallyRated=true; its owner switched to Nova. Separate directional-row
assumptions need checking; no application change or reciprocal persistence PASS
was inferred from that alone.

Step11 Ava Stats shows today's Ratings2 (baseline0) and Matching/Rating
activity344 (baseline342). Captured unrelated Events/assets, Communication
and Moderation counters are unchanged. Both recompute targets are now done;
Monitoring and graph UI checks remain.

The pair was already `met:true` in the versioned seed, eventName
`Seeded Coffee Bridge`, dated2026-03-22. The user clarified mutual ratings
versus completed-event Met semantics, then explicitly cancelled the proposed
fixture correction. No fixture change/reset occurred. The current test proves
rating notifications on a prepared Met pair, not the event-completion-to-Met
transition. Existing event-counter-expiry invokes EventFriendshipProjectionService
after event end and writes userFriendships; it does not directly set userRates.met.

### Rating investigation and Graph loading — 2026-09-15 (ownership diagnosis superseded)

Step12 Monitoring Matching/Notifications Healthy; pending/running/failed0.
Step13 reproduced Graph iframe showing admin shell: service worker intercepted
all navigations. Static assets HTML now uses existing static-asset network/cache
path. Seven focused navigation/push tests pass; existing frontend watcher
deployed13:32:10, real Graph title/canvas verified (`graph-loaded.png`).
The graph still uses the old08:59 materialization; real Rebuild is pending.

Step9 reciprocal persistence FAIL confirmed by reopening Casey Rates/Met:
Nova card showed RATE instead of Casey's4. Java sync reused another owner's
sync-key record when no own natural-key row existed. Narrow identity guard
keeps the original row and gives the reciprocal row an independent key;
retry resolves that same own row. UserRatesServiceTest12/12 PASS, including
equal-score reciprocal notification and retry idempotence; existing backend
watcher compiled/reloaded successfully13:36:28. HTTP browser replay pending.
Local adapter constructs participant-specific received IDs; local replay not run.

Exact originalfixture reset passed and fresh original Met fixture staged
13:38:02.382Z. Only affected4/3 saves are replayed; earlier no-save/read evidence
is retained. The proposed Met-removal fixture change was cancelled and never
implemented. New stage captures graph layouts/nodes/edges/forests and layout
rule configuration solely for exact restoration after the existing Admin Run
job. First4 saved in replay (`retest-first-save-oracle.json`), Nova3 just saved.

### Rating model correction — 2026-09-15

The preceding claim that the original paired-row persistence was faulty was
incorrect. The original single row already retained both scores3/4. The actual
UI defect was that participant mapping always returned scoreGiven0. The
assistant mistakenly introduced a second record and then a duplicate-card
filter. User rejected these changes. Both were removed, including the changes
backed up in commit66bb5eaf, by restoring precisely those two rating files to
66bb5eaf's parent (no commit-history rewrite). The rejected tests were removed.

The final candidate keeps original writes/model and reads a single record from
the viewer's perspective: participant given=stored received, participant
received=stored given. Non-Met single direction follows those scores; Met and
pair branches retain their existing priority/behavior. A one-record test covers
both viewers and Met/Mutual/Received. Initial assertions passed but the test
failed an unused shared-helper stub; switched first check to the actual paged
query and rerunning. This is not yet final PASS.

Bad replayfixture reset completed exactly after both workers drained. Current
original Met baseline staged13:48:17.058Z; two affected real UI saves are being
retested. Old read/bell/Statistics evidence remains historical, not proof of the
rejected two-record implementation. Graph service-worker fix remains independent.

Final shared-record repair verification: existing watcher build PASS13:47:37;
UserRatesServiceTest12/12 PASS after test-helper correction. Actual UI replay
`shared-model-first-save-oracle.json` then `shared-model-reciprocal-oracle.json`
at13:51:26 shows exactly one original row072, ownerNova, scores3/4, mutualtrue,
affinity0.46644592907179067, two recipient outboxes. Both views reopened:
Casey has exactly one Nova card4; Nova exactly one Casey card3. Screenshots
`shared-model-casey-reopened.png` and `shared-model-nova-reopened.png`.
Original normalizeRecord persistence method verified byte-for-byte equal to
66bb5eaf parent. Actual diff versus original: viewer score mapping and single
participant direction only, plus one focused regression test. The versioned
graph-rating status now reads both scores from the shared record rather than
requiring a second directional record. Further graph/feedback checks remain.

### Reciprocal graph closure — 2026-09-15

BELL-RATING-LIFECYCLE-001 section2 steps13–15 PASS. Both recompute targets done13:57Z; the fixture scheduled the existing affinity-graph-layout rule (manual Run is disabled) and the real scheduler published layout-1789480922331 at14:02:02.331286021Z. The sole Casey/Nova materialized edge weight .501429373752175 and affinity .46644592907179067 match the recompute oracle; mutualSingleCount1. In Ava’s graph, real cluster expansion and Casey selection showed Casey Bridge, direct depth1,2 members,1 visible link, Nova Social50% (rounded weight). The subsequent expanded-panel screenshot captured the cluster overview, so it is not evidence of the selected pair; the observed selected-member DOM is the UI evidence. `rebuilt-graph-oracle.json` proves unrelated control and older layouts unchanged. Managed rating windows closed and graph-rating reset completed with exact snapshot verification, including graph materializations and original rule configuration. Feedback16–20 remains pending; no checkpoint-wide PASS yet.

### Feedback bell and read — 2026-09-15

BELL-RATING-LIFECYCLE-001 section3 steps16–20 observed through the ordinary Lucas Lane Event Feedback UI: Harbor Warehouse Percussion Lab, three required cards, one Submit at14:09:25.081Z. Exactly one logical outbox fanout, three target rows for Nagy Eszter/Maya Stone/Kiss Balázs, no actor row; persisted source/payload/projections all PASS. UI New counts35→36,11→12,13→14 respectively, with the exact event title and Lucas as sender. Maya Mark as read at14:10:56.528793428Z removed only her row from New and restored11; All/reopen retained the single Read row and first timestamp. Feedback answers/states and other target rows were unchanged by reading. All userRates documents matched the baseline immediately after submission and reading. Evidence `feedback-unread`, `feedback-read`, `feedback-reopened` oracles and three target screenshots.

The later worker-completion full-document equality check failed after the five-minute debounce. The first oracle had not retained individual changed fields, so it cannot classify that difference. The completed branch was exactly restored (Admin fixture + common browser sessions + wrapper all snapshot comparisons passed); a focused replay prepared14:17:09.167Z now retains full before/after rate documents. No application code was modified. Full checkpoint closure awaits classification of this worker boundary; earlier read/delivery proof remains valid.

### Administration guides prepared — 2026-09-15

Per user request, all three remaining Administration journeys now have stable numbered guides under `checklists/administration`: ADMIN-MONITORING-001, ADMIN-AFFINITY-GRAPH-001 and ADMIN-PARAMETERS-001. BASE-STAT remains previously PASS, so Monitoring is the domain’s second test. Only Monitoring receives new startup/capture/reset scripts and a managed Ava browser configuration now; Graph/Parameters are documentation preparation only. No Administration checklist action is authorized for this handoff: after Bell closure, prepare Monitoring baseline and open Admin home, then hand control to the user before step1.

### Final Bell closure — 2026-09-15

BELL-RATING-LIFECYCLE-001 is PASS/CLOSED, all steps1–20. The earlier worker
comparison required a fixture correction, not an application/model change:
a full saved diff showed10 scoreReceived and7 mutuallyRated changes resolving
pre-existing seeded opposite-direction scores. The initial claim that only
calculated fields changed was incomplete and is superseded here.

The versioned feedback wrapper now settles the three target users through the
normal worker before capturing the test baseline. It retains the original
snapshot for exact rollback. The final real UI submission, three-recipient
fanout and Maya read/reopen replay used that consistent baseline. The fixture
made only those three pending recompute tasks due, avoiding the five-minute
wait while retaining real worker execution. At14:32:21.553Z all three were
done and untracked; all465 rating identities and every input/score/Met/mutual
field remained unchanged, with exactly one computed affinityScore update.
Evidence: `feedback-consistent-submission-oracle.json`,
`feedback-consistent-read-oracle.json`, `feedback-consistent-final-oracle.json`,
and `feedback-consistent-read-reopened.png`, under the retained local
`/tmp/myscoutee-qa-browser-sessions/evidence/bell-rating-cdp/` directory.
Earlier first/reciprocal rating, Statistics, Monitoring and graph evidence
remains valid as corrected above. Final reset readiness, browser closure,
Admin feedback fixture reset and wrapper exact snapshot comparison all passed.
No application code changed during this continuation.

### Admin handoff and Operator guides — 2026-09-15

ADMIN-MONITORING-001 baseline staged with zero test parameter versions/tasks;
managed Ava Admin window ready. First startup timed out waiting for the home
guide absent on Admin; checkpoint guide dismissal disabled and standardized
startup retried successfully. No Admin checklist action was performed.

All three Administration and four Operator guides are written. Only Monitoring
has new dedicated scripts now; the remaining fixture orchestration is deferred
until its checkpoint. User clarified that repeated actions belong in one owning
test, with fixtures replacing them elsewhere: Monitoring owns the parameter
save/history/revert sequence; Parameters keeps distinct section effects and
validation, using fixtures for the prior Jobs save and cleanup. Proven Jobs UI
and Bell rating/materialization actions are removed from the other Admin click
lists. No separate common testcase was introduced. Operator guides preserve
existing partial evidence and do not claim execution.

Final preparation review: all three Administration guides and all four Operator
guides plus their Operator index are now English. Monitoring has11 steps,
Graph8 and Parameters14. The parameter lifecycle remains only in Monitoring
block3; other journeys use fixtures for already tested prerequisites, with no
separate common testcase. Dedicated Monitoring/feedback/graph fixture syntax,
Python oracle syntax, guide links and whitespace checks pass. The managed
Monitoring Ava session passed the final existing-session authentication/realtime
readiness gate. Ledger/workbook agree at95/104 complete, Notifications6/6.
No Admin/Operator checklist was executed by this preparation review.

### Administration coverage repair against the original matrix — 2026-09-15

Compared the three Administration journeys with matrix commit334d4787, including
all cross-surface columns and consolidated source IDs, rather than only the
Scenario summary or top-level step count. Earlier compact guide claims are
superseded by this documentation review; no new manual PASS is implied.

- Monitoring now has20 explicit steps covering BASE-MON, MON-011, MON-013 and
  MON-014. Per-job history/audit/domain evidence remains required; existing
  business runs are reused only for exact recorded assertions. Missing job
  correlations require a scoped normal run from its existing fixture, not a
  replay of its originating user journey or synthetic audit evidence.
- Graph now has23 steps covering overview/component/member data, depths1/2/3,
  ranges, controls, isolated members, large/disconnected loading limits and
  stored/header/reopened materialization counts. Bell and STAT-020 evidence
  covers its actual changed-pair/scheduler/control/history assertions; it does
  not silently pass untested loading or count comparisons.
- Parameters now has25 steps covering all seven section consumers, real
  section-specific persistence and side effects, numeric/strategy validation,
  cancellation and baseline consumer restoration. Per user, shared editor/
  History/revert interaction stays in Monitoring only; repeated preparation,
  Jobs save and branch cleanup use fixtures. Section-specific version, task,
  notification/projection and causal output checks remain requirements.

Every guide is English and includes an Original matrix coverage table. The
step numbers are navigation/reporting points, not an estimate of total clicks.
Existing remaining-time estimates and test statuses are unchanged. Monitoring
startup/capture/reset scripts already exist; other dedicated fixture orchestration
remains deferred. The active boundary stays Monitoring block1 step1, preparation
only. No browser action, fixture mutation or application-code change occurred.

The requested Operator comparison was read-only in this revision. Its guides
also omit some original matrix detail: per-changed-block Configuration revisions;
Registry signed membership/claim receipts, provider availability and exact-once
measurement totals; Updates one verified release/job and no duplicate work;
Revenue authorized/dummy exclusions plus report revision/sync-job correlation.
These gaps were reported and are not claimed fixed by the Administration edits.

### Operator coverage repair against the original matrix — 2026-09-15

User requested the same detailed coverage repair for all four Operator guides.
The omissions identified in the preceding read-only comparison are now addressed
in documentation against matrix334d4787, not claimed as newly tested behavior.

- Configuration retains C01–C08 and adds exact changed-block revision/result
  correlations, conditional real operation results, distinction between no-change
  and changed-value Save, unique Firebase identity and full restoration. Proven
  device/entry paths are fixture prerequisites linked to their owning evidence.
- Registry18 steps explicitly cover signed membership and claim/group receipts,
  provider availability, exact accepted measurement totals/receipt, no duplicate
  binding/identity/group/report, member/Admin fail-closed checks and recovery.
- Updates11 steps correlate one verified release and one durable job through
  honest progress, controlled restart/reconnection, installed version and no
  duplicate work from reopening.
- Revenue11 steps include captured-once aggregation and authorized-only/released/
  dummy exclusions, provider/currency/period boundaries, one job/report revision/
  reconciliation and exact settlement/payment/booking identity.

Each English guide includes an Original matrix coverage table. Existing source
requirements, statuses and effort estimates remain unchanged; only documentation
notes are added to the ledger and the workbook is regenerated. No fixture,
browser, Registry, provider or update operation was executed. Dedicated Operator
fixture orchestration is still prepared when its own checkpoint starts. The
active preparation-only handoff remains ADMIN-MONITORING-001 block1 step1.

### Monitoring delegated execution and closure — 2026-09-16

**ADMIN-MONITORING-001: PASS / CLOSED.** User delegated the full visible Ava
journey and in-scope repairs. All20 numbered checks are covered by the new
observations below and assertion-specific retained evidence. The original
MON-013 scope names10 jobs; the additional payment-method-expiry row is outside
that source list and is not claimed as a new payment lifecycle test.
Machine evidence: [Monitoring evidence](../evidence/ADMIN-MONITORING-001-2026-09-16.json).

- Block1: All8, Watch1 (pre-existing Users alert), Domains5, Notifications1,
  Background2. Exact names/counts matched persisted health. Read/filter caused
  no task/outbox/config mutation; unrelated scheduled runs were identified.
  The popup loads on opening/filter changes, not an automatic interval. The
  guide's earlier assumed passive polling wording was corrected without adding
  a product polling feature.
- Block2: isolated USER task completed first attempt; affinity0→53402,
  no rate/edge rows for the isolated user. Run
  `56224d3f-a124-4c38-8a24-1e6e1bfbcd60` at05:45:49Z completed125ms/count1.
  Ava's Runner history showed the same run. The short processing state was
  established from retained task/history; the real CONFIG work in block3
  additionally proved pending/running/terminal queues and Watch→Healthy.
  Existing Bell changed-pair, discovery/graph and unaffected-control proof is
  reused for those previously proven output assertions.

| MON-013 job | Exact new or retained scheduler/history/domain proof |
| --- | --- |
| event-random-groups | New `5664c68a-ca9e-42ae-81d4-a0252650fe12`,06:04:08.942–09.296Z,354ms/count6; exact start/completed telemetry; two3/3 rooms, six unique memberships/chat projections, two welcome messages, two logical outbox records with exact room recipients and six inbox rows. Ava Job Detail matched. |
| event-auto-inviter | Retained JOB-AUTO2026-08-04,08:49: one Nova invitation; Job Detail, invitation/marker/outbox/bell, Monitoring and Statistics all agreed; guarded reset. No originating invite journey repeated. |
| event-tournament-review | New `9903f1ef-8e41-4b7c-b7af-1487c090a3f0`,06:02:08.754–08.858Z,104ms/count1; exact telemetry and Ava detail; stageSR/reasonstage-ended. Existing advancement/DQ business branches remain retained. |
| event-counter-expiry | New `08ff98ab-fecc-4592-a243-b9a70409f305`,06:00:08.606–08.658Z,52ms/count1; exact telemetry/detail; expired target, byte-identical future control and exact owner counters. |
| event-checkout-basket-purge | Retained EVENT-SCHEDULERS2026-09-02,08:18:21Z,count1; Monitoring1186/1186→1187/1187, deleted basket with tracking cleared, future basket/Event controls unchanged and live Basket disappearance. |
| notification-outbox | Retained Notification Admin2026-09-15 run `d66911ba-1a2f-4efc-aeed-1bd017e30e4c`,11:59:04Z,52ms/count1, corrected Monitoring/read/reset evidence; today's parameter outbox records also all reached sent. |
| affinity-recompute | Today's isolated run above plus real CONFIG tasks; retained Bell changed/control projection evidence. |
| affinity-graph-layout | Retained Bell2026-09-15 run `1c41e279-7e5e-4cdd-8ced-178dfafd38bf`,14:02:02Z,202ms,1131links/54members; real materialization, stored layout/header, selected Casey/Nova pair and unchanged historical/control proof. |
| scheduled-messages | Retained JOB-MESSAGES run `d93e9054-4db7-4b8e-8870-326ff5a13f0d`,12:38:02Z,count1/19ms, Redis1789475882001-0 and1789475882009-0; exact rescheduled task/delivery and unchanged active user; both full-flow branches and final display closure retained. |
| account-purge | New `0f3bf35c-1c60-4847-a6c1-03c0e4bd4044`,06:01:10.342–10.688Z,346ms/count1; exact telemetry/detail; target user/reference gone, completed purge record with cleared userId,retry0,errornull. |

- Block3: one visible Save300→301 createdv2; reopen/History author/time/value
  matched. Real History revert producedv3/300. Initial same-active-version HTTP
  probe exposed unwantedv4; repaired probe returned200 with activev4 unchanged
  and byte-identical config/version count/CONFIG tasks/parameter outbox. All
  seven sections' current HTTP fields equalv1. Retained versions2/3/4 correspond
  to exactlythree `admin.params.changed` events; Jobs config24→27. The extra
  version4 is retained failure evidence, not a legitimate no-op result.
- Repairs were limited to the proven boundaries: Params notifications exclude
  the actor (v2 before fix Ava+Noel; v3/v4 after fix Noel only, exact inbox/outbox
  recipients); the config listener uses the same stable key as the Params
  producer, so a real revert queues one CONFIG task; a saved Firebase=false
  decision can finish outside the Firebase delivery window; reverting the
  active section version exits before persistence/side effects. All corrected
  behaviors were checked against the running HTTP/worker flow.
- The versioned `make-recompute-due` preparation shortens only captured CONFIG
  waits; it does not manufacture execution. All resulting tasks became done,
  all parameter outboxes sent, and live queue counts returned0/0/0.
- Existing Random Rooms fixture assertions were stale: old welcome copy and
  two outbox records per room. Updated assertions retain canonical message
  identity/sender/avatar, current welcome copy, exact one logical outbox per
  room with exactly its accepted members, and artifact ordering. The same
  already-completed run then passed; no extra grouping replay was needed.
- User-requested Jobs leading icons now use the existing application menu
  palette colors/backgrounds; status failure/suspension overrides remain.
  The existing frontend watcher compiled and the live screenshot/computed
  colors were verified. No table layout or worker architecture was refactored.
- Existing backend hot-deploy builds passed. Updated regression test source
  covers actor exclusion and same active section across a later unrelated
  section version. No separate Gradle/unit process was launched alongside the
  running compiler; verification here is live HTTP/UI/worker plus syntax and
  diff checks, not a claim that those unit tests were executed.
- Block4: all four additional Admin job fixtures and the initial affinity
  fixture reset exactly. Managed Ava closed after the visible checks; common
  browser-session snapshot restored, Monitoring wrapper reset verified original
  Jobs values/terminal work/exact retained startup snapshots and reported
  `not-staged`. Real versions/audit/delivery records remain as specified.
  Existing stopped containers were restarted, with no duplicate dev stack;
  `mongodb-sync` remains stopped because its startup replaces seed collections.
  The read-only temporary telemetry collector completed and exited.

The user then authorized the next test in the same delegated mode:
**ADMIN-AFFINITY-GRAPH-001**, beginning with versioned fixture preparation.

### Graph delegated execution and closure — 2026-09-16

**ADMIN-AFFINITY-GRAPH-001: PASS / CLOSED.** All23 steps are covered by
new scoped observations and the explicitly reused Bell/STAT-020 assertions.
[Machine evidence](../evidence/ADMIN-AFFINITY-GRAPH-001-2026-09-16.json).

- Block1: original materialized header and stored counts54/1129/5/4 agreed.
  Component/member identity, visible/collapsed counts and strongest weights
  matched their data; isolated Riley remained reachable with zero connections.
- Block2: controlled chain depths1/2/3 returned exact2/3/4 member IDs and1/2/3
  links in UI and HTTP. Returning to depth1 produced no duplicate. Weight0.4
  is inclusive: min0.4 includes, min0.41 excludes; max0.39 excludes, max0.4
  includes. Restored bounds recovered the edge. Filters did not rewrite graph
  Statistics or prior dates.
- Block3: native left-pan, right-rotation, wheel, arrow-pan, Reset and panel
  controls exercised. The reported click jump was reproduced: pan projection
  reset before camera animation moved the clicked target outside the viewport.
  Camera/pan now animate together; the panned-click, other-member, rotated,
  distant and isolated checks passed. Compact2–4-member layouts reuse the
  existing component layout; direction is relative to the layout center.
  Camera fitting now considers projected node bounds including badge sizes.
- User-requested presentation: symmetric, equal-depth Forest overview uses
  available space; default framing does not lock rotation/zoom/pan. Desktop
  graph fits beside its panel. Small member graphs, including the initial
  five-member component, are larger and fit at360x800 and390x800. Mobile
  Expand/Collapse overlays the graph and preserves **exact** camera and node
  screen coordinates; the panel may cover nodes until closed. Actual viewport
  resizing may refit. The implementation-facing “Mongo members” label is now
  “members”. Latest existing frontend watcher build passed07:07:10Z and synced.
- Block4: fixture supplied100public profiles and80edges in20disconnected chains.
  A first materialization exposed private-profile fixture eligibility, corrected
  in the fixture without changing product eligibility. Real scheduled run
  `e179db42-fcf6-43ec-8f53-e257c40f7d0b`,06:34:50.208612998–50.347938024Z,
 139ms/count1173, produced `layout-1789540490226`:154nodes/1173edges/23forests/
  2isolated. Stored/header/reopened totals agreed. Forest pages20+3 contained
  23unique IDs; tile/node/edge limits and depth bounds passed. Final visible
  zoom progression7→14→23 and counters agreed. Disconnected component20 and
  member`manual-qa-graph:19:4` were reachable, with the expected85% connection;
  loading settled without a duplicate/request loop.
- Block5: reused the exact Bell changed Casey/Nova edge, upstream recompute,
  real layout and unaffected-control assertions from the reciprocal graph
  closure2026-09-15; no rating journey repeated. New larger-run correlation
  independently proves this fixture materialization. Statistics' normal refresh
  changed connected users52→152, edges1227→1307, communities2→22, exactly the
  fixture's100/80/20 delta. Statistics combines affinity/rating/event evidence,
  while layout counts eligible profiles/affinity edges including isolates; their
  different-scope absolute counts are not asserted equal. Historical dates stayed
  unchanged.
- Cleanup: restored original54/1129/5/4 materialization, removed100owned users
  and80owned edges, then used real Stats Refresh. Every graph metric returned
  exactly to its pre-fixture value and earlier dates remained unchanged. Closed
  the managed browser before versioned reset. Common session baseline restored;
  reset compared every snapshotted selector/document and restored original rule
  configuration. Final status`not-staged`; owned users/edges and checkpoint/
  browser-session snapshots all zero. Real job audit remains attributable.

Qualifications: viewport emulation and mouse/keyboard input, not physical phone
 or pinch.154nodes/23components prove bounded loading here, not a1000-forest
stress test. No separate build/unit runner duplicated the active watchers.
Next **ADMIN-PARAMETERS-001** is explicitly delegated by the user.

### Parameters delegated execution — 2026-09-16

**ADMIN-PARAMETERS-001: IN PROGRESS.** Block1:15collection rollback snapshots
retained separately to avoid a historical-graph snapshot exceeding Mongo's
per-document limit. Original active configv4 and graph rule retained; normal
CONFIG queue was empty. Versioned launcher opened Ava. All seven sections
appeared. Planned fields: Matching met0.5→1, Profile age17→18, Events accepted
members19→20, Assets quantity11→12, Discovery max distance50000→25000,
Notifications multicast3→2, Jobs fixture debounce300→12seconds. Consumer
fixtures and boundary assertions remain section-specific, not implied passed.

Block2 step3: visible Matching save/reopen gave met1, exactly one newv5 with
Ava/Matching author/section, other configuration sections unchanged. Correlated
Admin notification reached sent for Noel only. CONFIG task was captured and
made due through the versioned harness, preserving normal worker execution.
Step4 consumer and control checks remain pending; expected existing met-only
Casey/Nova edge0.29501735764321924→0.5900347152864385 with unchanged affinity.

Block2 follow-up: Matching CONFIG completed07:22:06Z; Casey/Nova edge changed
0.29501735764321924→0.5900347152864385 with unchanged base affinity. The no-met
control remained unchanged. Real materialization `layout-1789543451816` and
normal Statistics refresh were inspected. Original config/edge restored; the
fixture now also restores the four original graph materialization collections
between branches so the next branch does not inherit the changed layout.

Profile steps6–8: visible save/reopen age17→18 producedv6. Normal CONFIG
completed07:27:07Z. All55 profiles with an existing stored affinity changed by
exactly their age contribution; Casey+32, Nova+27. Pair affinity/evidence/edge
unchanged. Ava had no stored affinity in the fixture baseline, so its newly
materialized value is not claimed as a verified delta. Correlated notification
sent to Noel only. Fixture restoration verified Casey/Nova original scores,
activev4/age17 and zero pending recompute. Original graph collection counts
restored17/918/19193/85. Evidence: `ADMIN-PARAMETERS-001-2026-09-16.json`.
Block3 Events consumer checks are next; checkpoint remains IN PROGRESS.

Block3 Events steps9–10: Accepted members19→20 saved/reopenedv7. Pour-Over
Roastery Lab (6members) boost23233.25→23239.25; Handmade Pasta Table
(1member)19777.25→19778.25; affinity unchanged. Consumer HTTP boost matches
persistence; CONFIG done and correlated notification sent to Noel only.
Explore had overwritten the query order using an absent affinity field.
Fixed by retaining the query's actual sort tuples in HTTP/local query results
and the Explore presentation, including retained reinsertion positions.
Existing watcher builds passed; all10 API sort/view combinations agree with
their tuples; browser20→36rows across pages match HTTP order exactly, including
both targets. Local adapter source updated; runtime local replay not executed.
Configuration, target scores and fixture-only published flags restored.
Next: Assets steps11–12. No unrelated Asset lifecycle was replayed.

Assets steps11–12: quantity11→12 saved/reopenedv8. Community Equipment Pickup
(quantity3) boost86→89; Dinner District Electric Taxi(quantity4)97→101.
Affinity unchanged. Normal CONFIG completed07:48:07Z. All12 public Transport
records from the affinity-based non-paged consumer endpoint match the expected
boost-minus-affinity-gap order. Paged Explorer uses separate availability/price/
policy ordering; this is not a claim of a UI relevance selector or an Asset
lifecycle replay. Original configuration and derived outputs restored.
Next: Discovery13–14. Four fixture-only profiles supply a distance-only signal
at12.5/25/37.5km; saved/reopened maxMeters25000. CONFIG pending.

Discovery steps13–14 PASS: v9 saved/reopened maxMeters50000→25000. Normal
CONFIG completed07:52:06Z; distance-only12.5/25/37.5km probes yielded affinity
0.5/0/0 and only the inside edge0.25. Normal materialization
`layout-1789545171154` confirmed the four nodes and the one eligible edge.
Fixture restoredv4, original derived/graph snapshots and removed the owned
Distance probes. Notifications15–17 fixture prepared with two chat recipients;
no threshold save or chat message performed yet. Landing Supported countries
feature requested during this branch uses the existing landing payload.

Notifications15–17 PASS: v10 saved/reopened threshold3→2. Real Casey chat message
with two recipients selected multicast and completed without retry; each recipient
chat projection incremented unread. A second, prematurely sent message remains a
multicast control and is excluded from restoration proof. After CONFIG completed
08:10:08Z and fixture restoredv4/threshold3, the third message selected direct,
completed and incremented the same two recipient projections. Firebase disabled
in the immutable delivery plan because recipients have no devices; physical FCM
is not claimed. Missing Event activityMembers were repaired in the fixture only.
Cleanup removed owned chat/event/members/users; outbox audit remains attributable.
Jobs18–19: fixture supplied12s debounce; actual Casey profile height181→182 save
created a USER task08:15:09Z, due08:15:21Z. Normal worker result pending.

Jobs18–19 PASS: real USER task had due time exactly12s after enqueue and
completed08:16:00Z on the normal worker, one attempt, pendingCounterTracked=false.
12s is the debounce boundary;60s polling can make completion later. Original
profile fields and300s configuration restored. Block5 bounds verified in UI:
-1→0 and1000001→1000000. Invalid strategy returned200: production validation
repaired to reject unknown text before persistence; live400 replay pending.

Parameters closure24–25 PASS/CLOSED2026-09-16: bounds normalize0/1000000;
invalid strategy initially createdv13 (retained defect evidence), corrected
request returns400 with unchanged configuration/version/task/outbox counts.
Cancellation12345→close→reopen1000000 produced no save. The supported three
strategies now use the shared app-menu pill without a custom select wrapper.
Originalv4,50km,threshold3,300s debounce and all15 snapshots restored/compared;
zero retained snapshots or fixture probes. Post-reset status formatting repaired
and independently verified. Watcher build/live HTTP checks passed; added unit
regression is not claimed as executed. Administration4/4; total98/104.
Next: Operator Configuration C01–C08, with exact previous Firebase/WebView/Push
assertions reused; missing TLS/provider prerequisites must remain explicit.

### 2026-09-16 — Parameters Discovery select visual follow-up

Shared `app-menu` configuration uses contextual standard tinted radio items.
The previous pill configuration underlined labels and shifted the selected
first item one pixel above the mobile scroll container. At 390×800 the
standard items have no underline/translation and fit the native shared sheet
without scrolling. At 916×813 the panel automatically opens down without
scrolling. The form reserves the unit column consistently: input, trigger
and desktop panel right edges match (831.5px desktop; input/trigger321.5px
mobile). Native Exponential selection updates the purple trigger and closes
the menu; Cancel discards the draft and reopening shows Linear. No parameter
configuration was saved. Existing frontend-sync build passed08:34:54Z;
evidence is appended to `ADMIN-PARAMETERS-001-2026-09-16.json`.

### 2026-09-16 — Operator Configuration C01/C02/C04

C01 baseline snapshot and managed Operator/public sessions verified. C02 PASS:
branding MyScoutee → MyScoutee QA → MyScoutee via native saves/reopen/public
reload, branding revisions0→1→2, unrelated block fields unchanged. C04
configuration registration/masking/restoration PASS against the existing local
payment simulator: Stripe and loopback URL normalized on save, encrypted
credential retained, empty password input with masked suffix on reopen; Cash
only/Remove payment restored no provider or credential. No external payment
transaction is claimed. C03 BLOCKED_ENVIRONMENT: HTTPS controls unavailable
and disabled. C05/C06 not executed: managed demo sessions cannot perform live
Firebase capability tests. Parent remains open; see the dated Configuration
evidence JSON. Social-site removal UI unchanged after user withdrew the request.

Operator clarification: no actual Stripe account is currently registered.
Configuration registration and prior simulator checks are proven at their
respective boundaries; actual Stripe API/webhook integration remains NOT
EXECUTED and requires an owned Stripe test-mode account. Do not infer it from
simulator PASS. Cash-only token visibility and the requested Configuration
layout follow-ups passed through the existing frontend watcher and browser.

Stripe/Barion routing source review: real sessions use the Stripe SDK default
endpoint / https://api.barion.com; DEMO sessions use the guarded local
simulator. Production Explore remains demo. Neither provider has live
credential/actual-provider acceptance proof from this QA execution.

### Operator Configuration closure — 2026-09-16

Renumbered C01–C03 PASS. Normal Operator bootstrap session saved revision1
through the UI; public values persisted and private fields returned blank with
Registered indicators. Actual Authentication and browser Messaging tests both
passed revision1; notification permission was granted natively. Activation
preserved Operator access, and ordinary public Login opened the Firebase
provider chooser from the eligible Budapest fixture location. No new actual
Firebase-user login was performed: Google registration/logout/re-login and
same-profile evidence is reused from September14 above.

Branding/public/payment values stayed unchanged. The existing shared-save
contract advanced the Branding revision0→1 despite unchanged values; no
application behavior was altered for that observation. Exact fixture reset
restored original revision0/inactive configuration, removed all temporary
bootstrap user/session/audit/device records, and restored the private runtime
override byte-for-byte. The existing backend was restarted to reload that
configuration; health returned200 and fresh public Login opened the original
demo selector. Managed browsers were closed. Evidence:
`../evidence/OPERATOR-CONFIGURATION-LIFECYCLE-001-2026-09-16.json`,
`firebaseContinuation` (older top-level block labels remain historical).

Next is Operator Update with managed HTTPS on VMware; do not start it alongside
the dev stack. Separate deployment/smoke/security/efficiency qualification is
queued. No VMware update or deployment has run.


## Event activity rating preparation — 2026-09-22

`EVENT-ACTIVITY-RATING-001`: fixture preparation verified; manual step 1 pending.
Two dedicated actors, all three event sources and real-worker Met 0/0 baseline
are prepared. The standardized managed browser launcher has handed control to
the user. No rating/feedback checklist action was performed automatically.
See the [numbered guide](../checklists/event/EVENT-ACTIVITY-RATING-001.md),
[dated execution log](../checklists/event/EVENT-ACTIVITY-RATING-001-20260922-progress.md)
and [persisted preparation evidence](../evidence/EVENT-ACTIVITY-RATING-001-2026-09-22.json).
Prior Event Mode/API closure is retained; this is a separate manual journey.

Follow-up: user accepted combined-source exploration. Persisted Casey/Nova
scores9/4, friendship1, feedback0 were archived before authorized fixture reset.
Standard-only 0/0 Met baseline now ready; next user action is step1 for
QA RATING · Standard. See the same dated execution log for exact evidence.

Correction: the accepted previous case proves meeting before first rating,
not Standard/Tournament with prior rates. Corrected Standard fixture now seeds
only prior9/4 scores with Met=false. The real worker preserves identity/date/
scores and adds Met plus one friendship. Manual observation of this corrected
baseline remains pending; see the existing-rate before/after evidence linked
from the dated log. Tournament still requires its isolated replay.

Latest user clarification supersedes the Standard handoff: the active baseline
is now **before-meeting**, only Casey has rated9, Nova0, Met=false, no events,
rounds or friendship. The user inspects all buckets before reciprocating;
without meeting evidence that later reciprocal state is Mutual. See the dated
log and before-meeting evidence. Automatic later room creation is not verified.


### Activity rating corrected closure — 2026-09-22

**EVENT-ACTIVITY-RATING-001 PASS / CLOSED after numbered coverage review.**
The earlier core-only closure was premature. The user requested expectations
updated from the discussion and automatic completion of remaining checklist
steps. Existing manual acceptance and core replay evidence remain valid.

The [dated log](../checklists/event/EVENT-ACTIVITY-RATING-001-20260922-progress.md)
now records all ten numbered dispositions. New continuation verified normal UI
Saves to 4/9, reopen and full reload in both windows, one stored friendship with
zero feedback answers, and one event/host feedback flow for two completed rounds.
The host is not duplicated as a separate attendee. Prior Standard score/identity
preservation evidence was reviewed; a fresh isolated Tournament run is not
claimed. The nonexistent All/Friends Rates-list expectations were corrected,
while the four actual buckets and total side-menu badge retain their semantics.

Evidence was saved before the versioned launcher closed the two managed windows
and the versioned fixture reset restored its snapshots; final status not-staged.
No production-code change, extra app build, viewport override, feedback
submission or release occurred. Future room creation remains outside this QA.
See [closure evidence](../evidence/EVENT-ACTIVITY-RATING-001-closure-2026-09-22.json).

## EVENT-FOLLOWING-002 — 2026-09-22 follow-up

PASS / CLOSED in delegated dev HTTP scope. See the separate
[numbered checklist](../checklists/event/EVENT-FOLLOWING-002.md) and
[execution evidence](../evidence/EVENT-FOLLOWING-002-20260922-progress.md)
for all eight checks, saved-state oracles, transport failure/retry, and scoped cleanup.
Historical PASS records remain unchanged.

## Community Group QA — 2026-09-24 additions

Three independent journeys are prepared; all are NOT RUN. Existing closed
Event/Asset/API rows remain closed and are not evidence for group isolation.

| ID | Domain | Stable checklist | Scope |
| --- | --- | --- | --- |
| GROUP-LIFECYCLE-001 | Group | [Lifecycle](../checklists/group/GROUP-LIFECYCLE-001.md) | Editor, rules, membership, workspace selector, reporting and group-admin moderation |
| GROUP-ISOLATION-001 | Group | [Isolation](../checklists/group/GROUP-ISOLATION-001.md) | Base/A/B boundary; Asset and Event samples plus ratings, chat, Feed, counters and notification exceptions |
| INTEGRATION-API-GROUP-001 | API test | [Participant links](../checklists/integration/INTEGRATION-API-GROUP-001.md) | Shared Event invite mechanism, registration/admission, active group, replay and authority |

Group is placed directly after Asset in the domain priority table. The
checklists define the required fixture baseline; no new fixture, managed
browser session or full-flow execution is claimed by this planning update.
Before launch, prepare the scenario through the versioned checkpoint harness
and common managed-browser launcher. Local and HTTP lifecycle/isolation
evidence remain distinct; integration invitation links are server-owned.

2026-09-25 implementation review: group moderation has independent settings,
write-side persisted pending counts and group-admin authority. App-admin's
Group category and configurable creation review remain separate. Red queue
badges propagate through the signal store into the SmartList card, dropdown
and Groups aggregate without a reload. Group support uses a separate chat
channel/filter and unread counter. These are explicit checklist oracles, not
manual PASS claims. Supporting verification: 31 focused backend moderation,
chat and counter tests passed; existing dev watchers compiled frontend/backend.
The earlier 15 filter/invitation tests remain supporting evidence only.


2026-09-26 Group resume: retained ten-group/27-membership baseline verified with
the versioned `community-group status` command. Only lifecycle block 1/25 is
prepared for read-only manual checks; blocks 2–25 need their exact write fixtures.
No manual PASS is claimed. [Numbered progress and evidence](../evidence/GROUP-LIFECYCLE-001-20260926.md).
The location interruption does not close the Group journey; see blocks 19–20.

2026-09-26 pending entry extension: GROUP-LIFECYCLE-001 block 19.1 covers the
complete real demo selection/entry/retry/reload/logout flow. INTEGRATION-API-GROUP-001
blocks 2–3 cover real registration and demo-existing-account invitation return.
Injected Group fixture sessions cannot prove these entry branches. Both remain
NOT RUN; closed ENTRY/AUTH PASS rows and their evidence are unchanged.

2026-09-26 Group extension: [GROUP-LIFECYCLE-001 block 26](../checklists/group/GROUP-LIFECYCLE-001.md#26-group-administrators-responsibility-transfer-and-last-member-deletion)
checks contextual Asset Manager parity for Admin grants/revocations, creator
departure and takeover, final-member deletion, action styling/confirmations and
notifications. Dev HTTP and local execution are NOT RUN; closed PASS cases remain
unchanged. See the dated Group evidence log for source-audit gaps and the retained
`after-invitation-checks` resume boundary.

2026-09-26 22:14 follow-up: the earlier block-26 NOT RUN source audit is historical.
Admin lifecycle implementation now has partial actual HTTP/browser evidence and
52 focused frontend checks; whole-case status remains IN PROGRESS, Local browser
NOT RUN. The isolated Admin control was restored. Latest verified replay boundary
is `after-workspace-selection` (block 5 remaining checks), following observed
profile-selection timeout, rollback, retry and late-response isolation. Detailed
evidence remains in the dated Group log; closed PASS rows are unchanged.


2026-09-27 resumed Group HTTP block19: real demo selector/admission, denied and unsupported browser location, snapshot-owned missing/invalid coordinate Setup cancel/retry, first profile persistence and reload have partial PASS evidence. The observed false Location required panel was fixed and replayed against the real stale realtime response. Block19 remains IN PROGRESS; HTTP15/48, Lifecycle15/29 closed. Detailed results and remaining branches are in [block19 evidence](../evidence/GROUP-LIFECYCLE-001-block19-entry-20260927.json). One managed ENTRY-BLOCK19 window is active; Zoe's snapshot remains retained.

2026-09-27 18:22 Group continuation:19.1 HTTP entry/invitation branch complete, with real claim/profile order, persistence/replay, denied-GPS relogin and exact scoped cleanup. User-reported avatar flash and Setup disabled action repaired/verified.19.2 active:53/53 selector seed points accepted; runtime Firebase configuration404 blocks real Firebase sign-in. Pending-coordinate controls and Local remain. Counts unchanged; see block19 evidence.

### DEPLOY-EXTERNAL-CONFIG-001 — deferred by user2026-09-27

[Dedicated checklist](../checklists/deployment/DEPLOY-EXTERNAL-CONFIG-001.md).
Real Firebase entry/location and externally configured MCP OAuth/client callbacks
moved out of the Group campaign. DEFERRED / NOT RUN; configure later. The existing
DEPLOY-FIREBASE-LIFECYCLE-001 pending-invitation-policy assertion is retained in
section1. Group19 continues with demo admission/pending coordinates; it is not
blocked by Firebase. No earlier PASS is reopened or external PASS inferred.

2026-09-27 Group19 HTTP PASS/CLOSED after user scope separation. Real selector pending-sample controls proved stored-point admission, unsupported pending delivery only through profile-ext, successful saved-point response and account-scoped acknowledgement. HTTP16/48, Lifecycle16/29 closed;20 tracking active. Local remains NOT RUN. Older partial fixtures preserved.


2026-09-27 block20 HTTP PASS/CLOSED: stored point with denied GPS and same-session reload; tracking OFF/save/reopen/ON; <5km zero writes, >=5km POST200; unsupported Paris POST403 retains accepted profile/cache/baseline/session and no popup; later eligible movement POST200. Independent Mongo point47.6747/19.0354 verified, normal logout then exact original47.5147/19.0354 restore, location snapshot removed. Evidence: GROUP-LIFECYCLE-001-block20-tracking-20260927.json. HTTP17/48 (35.42%), Lifecycle17/29 closed (1–13,17–20);21 active. Local NOT RUN; older contact/badge snapshots retained.

User clarification 2026-09-27: testcases are independent closed execution units. Transferred checks are CLOSED BY SCOPE TRANSFER in the source, not pending dependencies. DEPLOY-EXTERNAL-CONFIG-001 requires its own fixture, restaging, entry checkpoints, execution and cleanup; prior/cross-case evidence cannot substitute. Transfer provenance stays in the ledger, not executable cross-case references. Audit the remaining NOT RUN cases only at the current testcase boundary, before advancing to another testcase.

2026-09-27 block21 HTTP partial: seven audited menu surfaces, profile multiselect, pricing scope and card menus exercised; HU320/EN360/desktop1100 representative checks. Notification launcher overlap and forced-sheet desktop X repaired and replayed through existing frontend-sync. Assignment basket restaged with own Group fixture and exactly restored, no assignment/share/checkout commit. Checkout optional-item menu remains NOT RUN because selected real event/date combinations returned no available slots; suitable own checkpoint required. Do not mark full21 closed. Evidence GROUP-LIFECYCLE-001-block21-menus-20260927.json. HTTP17/48 and Lifecycle17/29 unchanged.

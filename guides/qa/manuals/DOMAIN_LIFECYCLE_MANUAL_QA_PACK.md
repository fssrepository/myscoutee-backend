# Domain lifecycle manual QA pack

Status: execution in progress  
Last updated: 2026-09-02
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

Status: **PREPARED / DEFERRED / NOT STAGED**.

Stable user guide:
[`ASSET-BORROW-001.md`](../checklists/asset/ASSET-BORROW-001.md).

The versioned fixture was staged at `2026-09-03T12:34:59.706Z`; two read-only
checks proved its complete baseline and no browser/manual action occurred. It
was then reset from its own snapshot at `2026-09-03T12:56:47.217Z` because the
payment-facing interface will be rewritten and Assignment is the selected
next testcase. The old date windows are intentionally not a resumable
boundary.

When Borrow becomes active again, stage a fresh baseline and then run its
read-only status before opening a browser:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  stage asset-domain ASSET-BORROW-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status asset-domain ASSET-BORROW-001
```

Never reuse the prior timestamps or edit fixture documents ad hoc.

- From Resource Explore under one generated Tournament group, request one
  controlled asset for the exact event/stage/group timeframe and accept it. In
  two independent reset branches, reject and cancel controlled requests.
- Requester and owner must see the same request identity/status. Only an owned
  asset or a pending/accepted borrow for the exact booking scope becomes
  assignment-eligible. Availability, notification and optional payment intent
  effects occur exactly once.
- Borrow permission is not Asset Manager membership and never changes an Event
  role. The accepted asset becomes assignment-eligible only for the exact
  generated-group booking scope; a sibling group remains unchanged.

### `ASSET-CHECKOUT-001` — Asset Explore Barion payment reaches the scoped borrow destination

Status: **IN PROGRESS — STEPS 1-30 ACCEPTED**.

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

During the fresh user-controlled replay, the menu, Borrow Basket, Back,
Continue and Update states behaved as required through step 30. The user also
performed disclosed date Updates before the quantity Updates. The guarded
`capture-revised-payment-ready` oracle therefore accepted the exact materially
changing quantity history `1 → 1 → 1 → 2 → 1`, rather than misclassifying those
real edits as an unchanged Continue rewrite. It proved one active final
quantity-`1` confirmed basket with a 10-minute creation-to-expiry delta, four
deleted predecessors, and zero payment/session, borrow request, inventory
delta, resource assignment or stored Asset role. It saved the exact
`revised-payment-ready` server boundary immediately before step 31.

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
`frame-ancestors 'none'`: its narrow trusted-browser list included the waiting
and admin surfaces but omitted `/bank-auth/` and `/barion/bank-auth/`. The
sibling payment-simulator now permits only those two additional challenge
routes in same-origin or local MyScoutee frames; other simulator routes remain
frame-denied. The focused regression and complete Go owning-package suite
passed, the single existing simulator service was serially rebuilt/replaced,
and live headers matched both the positive and negative contracts. The failed
Pay attempt is not accepted evidence. `rollback-revised-payment-ready` removed
it and most recently restored the exact zero-payment pre-step-31 boundary with
a fresh active-basket expiry of `2026-09-07T04:46:26.134Z`.

The replacement attempt proved a second, separate simulator boundary defect.
Approval itself completed and the backend produced exactly one authorized
Barion payment, one succeeded client fulfillment, one pending borrow request,
one quantity reservation and one scoped resource projection, but the nested
dialog rendered `This content is blocked` after the approval POST. The POST
targets `/test/bank-auth/.../approve` and
`/test/barion/bank-auth/.../approve` were still receiving the simulator's
default frame denial. Those two exact authorization-action route families now
share the same local-frame policy as their GET challenge; unrelated `/test`
routes remain `X-Frame-Options: DENY` with `frame-ancestors 'none'`. The full
simulator owning-package suite passed, the one running simulator was serially
replaced, and live POST/negative response headers prove both sides. Because
the visual completion contract failed, this otherwise-successful payment was
not accepted as QA evidence and was rolled back to `revised-payment-ready`.

The same repair pass closed two payment-lifecycle gaps before replay. A basket
is now changed to non-purgeable `pay/pending` before external authorization,
so a three-minute customer-action window may cross the original 10-minute
basket deadline without losing its reservation. Once authorization returns a
session, Asset Explore also saves that identity immediately through its live
dialog signal and scoped browser-local draft. After materialization it
publishes the exact pending-resource signal delta; the Borrow Stage and main
Event red counters therefore update immediately instead of appearing only
after reload.

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status asset-checkout ASSET-CHECKOUT-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  prepare-browser asset-checkout ASSET-CHECKOUT-001
```

Immediately before every configured browser launch or relaunch,
`prepare-browser` snapshot-protects and clears Casey, Nova and Ava's active
demo-session slots. The checkpoint reset restores the pre-QA session-state
documents exactly. The first user boundary is checklist step 1 through step 18. On the exact
`payment ready` phrase, run `capture-payment-ready`; do not enable 3DS or Pay
before that oracle. The current retained run is already at
`revised-payment-ready`; continue at step 31. Replay boundaries are available
as `rollback-payment-ready`, `rollback-revised-payment-ready`,
`rollback-paid-pending`, `rollback-accepted` and, after the isolated Cancel
branch, `rollback-cancelled-control`. The revised boundary is the
pre-step-31 transaction checkpoint and avoids replaying steps 1-30 after a
later failure.

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
  | Owner-accepted paid borrow | read-only `Payment summary`; exact scoped resource/accepted projection | fresh same-scope payment or Event-role change |

- The Borrow popup's own lazy Asset-detail response supplies the authoritative
  parent Event/Sub-event window. The date control immediately normalizes an
  attempted End-before/equal-Start value and either endpoint outside that
  parent window, so an invalid range cannot remain in the review. Quantity outside
  current availability is clamped/rejected. The required lending policy is a
  mandatory read-only term, matching Event checkout; only optional policies
  expose acknowledgement controls. These input gates create no server write. A
  valid quantity/time/policy set produces one deterministic line item and total.
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
  reservation/availability decrement for quantity `1`; and one pending
  resource projection. The final checkout basket is one `pay/succeeded` audit
  with its reservation closed; the request's `inventoryApplied=true` plus the
  exact quantity decrement own the inventory-reservation proof.
- Immediate UI oracle: the Asset remains once in Explore with availability
  reduced `3 -> 2`, its same-scope menu exposes read-only `Payment summary`,
  and Casey sees Nova once as the pending borrower on the exact Asset/request.
  The summary contains the immutable timeframe, quantity, accepted policy,
  amount/currency and recorded Barion/payment-method result. Opening it twice is a
  pure read.
- Casey accepts that same pending request once through the normal Asset member
  action. The accepted projection and exact Event/Sub-event resource scope
  update once; availability stays `2` because payment already reserved the
  quantity. Nova gains no Event, Tournament-group or global Asset Manager role.
  The sibling Event/Sub-event, adjacent paid Asset and Riley stay unchanged.
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
- The versioned `asset-checkout` fixture provides guarded `stage`, read-only
  `status`, `payment-ready`, revised-payment-ready, `paid-pending`,
  request-destination, `accepted` and `cancelled-control` captures, five exact
  persisted rollback savepoints, terminal `verify` and exact `reset`. It also mirrors Nova's
  active and expired Barion card controls into the running payment simulator.
  The payment-ready rollback restores the server boundary only; if the browser
  draft was already cleared, the user repeats steps 1-18 because the harness
  never writes browser-local storage.

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

- Open Configuration once and use one reversible happy-path value in the
  public configuration, TLS, payment and Firebase blocks.
- After each Save/Test action, reopen the same block and compare the normalized
  visible value; credentials may return only as configured/masked state.
- After Firebase activation, complete one eligible fresh sign-in and verify
  that reload/login reuses the same application identity.
- Restore every changed block to its exact baseline before closing the row.
- Invalid-input, callback-security, secret-leak, TLS-worker failure and other
  fault-injection branches belong to automated regression coverage. Checkout and real-device push
  effects stay in Event/Asset and Notifications.

### `OPERATOR-REGISTRY-LIFECYCLE-001` — registry and community

- Register one disposable local binding, complete one claim/link path, inspect
  its leaderboard/community projection and synchronize one measurement period.
- Deactivate/reactivate once to verify member/admin fail-closed behavior and
  retained Operator recovery, then restore the disposable binding.
- Protocol abuse, retry storms, token-security probes, announcement fan-out and
  worker failures belong to automated regression coverage.

### `OPERATOR-UPDATE-LIFECYCLE-001` — signed update

- Apply one prepared compatible QA release from Updates, observe honest
  progress, then reopen the Operator screen and verify the resulting version.
- Invalid signatures, corrupt archives, downgrade rejection, interrupted-worker
  recovery and rollback belong to packaging/update automation, not extra manual
  branches.

### `OPERATOR-REVENUE-LIFECYCLE-001` — revenue

- Open Revenue for one controlled captured/released payment set, synchronize
  once, compare totals and one settlement, then reopen the persisted result.
- Failure injection, retry/idempotency and exclusion rules belong to automated
  regression coverage.

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

The current free/no-payment control is `ASSET-BORROW-LIFECYCLE-001`; the
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

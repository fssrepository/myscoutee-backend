# Admin Job fixture toolkit

This folder creates small, repeatable demo/e2e data states for manually checking every Admin Job and the rating/feedback bell flow. It is deliberately separate from the application seeds and production behavior.

The cross-surface test contract, historical manual status, Statistics/Monitoring/Affinity Graph expectations, parameter tests, and XLSX execution tracker are in the [Admin dynamic surfaces manual QA plan](../../../../guides/plans/ADMIN_DYNAMIC_SURFACES_QA_PLAN.md).

The toolkit:

- accepts only a database named exactly `demo_db` or `e2e_db`;
- also verifies the seeded schema-v3 deployment identity (`MyScoutee Demo Operator` or `MyScoutee E2E Operator`) before doing anything;
- never starts, stops, or restarts Mongo, the backend, npm, or any other process;
- calls the already-running loopback backend only for the isolated `notification-read-path`
  and prepared `bell-rating-feedback` API projections;
- uses the already-running `mongodb` container when available, otherwise an already-installed local `mongosh`;
- snapshots the exact documents selected by a scenario, its primary Admin Job rule,
  and the stored pending fields of every rule it can indirectly change;
- allows only one prepared scenario at a time;
- restores that scenario's snapshotted selectors and primary rule, then restores
  only the pending fields of indirectly affected graph, affinity, and outbox rules
  so fixture counters do not leak without rewinding legitimate scheduler history.

It must not be used as a production migration or a production test tool. All application jobs should still be enabled by their normal defaults in every deployment; this fixture tool rejects trusted/production databases so manual experiments cannot modify them.

Reset returns the scenario's primary Admin Job registry document, including its run
history, and each indirectly affected rule's three pending fields to their
pre-`prepare` state. It refuses to prepare or start restoring while one of those
rules is running, and it guards every rule write against a scheduler starting
concurrently. Wait for the rule to finish and repeat the command if that guard
fires.

The entire `admin-job-fixtures` directory is excluded from both production Docker build contexts and from `package-production.sh`; the production Compose stack does not mount the development scripts directory; it is not installed by the Debian package and is never exposed as an application endpoint. `packaging/tests/package-content-test.sh` fails if any path from this directory enters a production package or if production Compose exposes the development scripts directory.

## Admin Job inventory and controls

All nine seeded jobs are enabled by default in production, development, demo, and e2e. The interval below is the seed default; an admin can change it.

| Job | Seed interval | Manual Run | Fixture execution |
| --- | ---: | --- | --- |
| `event-random-groups` | 24 hours | Yes | Existing scheduler after `prepare`; the Run button remains available |
| `event-auto-inviter` | 2 hours | No | Existing scheduler |
| `event-tournament-review` | 30 minutes | No | Existing scheduler |
| `event-counter-expiry` | 5 minutes | No | Existing scheduler |
| `event-checkout-basket-purge` | 1 minute | No | Existing scheduler |
| `notification-outbox` | 1 minute | No | Existing scheduler |
| `affinity-recompute` | 1 minute | No | Existing scheduler/change worker |
| `scheduled-messages` | 30 minutes | No | Existing scheduler/local delayed worker |
| `account-purge` | 24 hours | No | Existing scheduler |

The pause control changes `enabled`. Resuming a non-manual job only makes it eligible for a later configured scheduler slot; it does not run immediately. Its Run button remains disabled because `manualRunEnabled:false`, and the backend also rejects a direct manual-run request. Graph grouping remains both scheduled and manually runnable.

The application scheduler runs each configured pass in the real and demo database contexts when those are different databases. This is why an enabled graph rule in `demo_db` now starts according to its own schedule rather than being invisible to a scheduler thread that defaulted to the real database.

## What the pre-run number means

The Admin Job detail reads `runState.pendingCount`; it does not count, project, or aggregate the source collection when the screen opens.

- Queue jobs atomically mark a work document as tracked and add one. A terminal worker transition removes one.
- Event jobs receive dirty-work signals from the existing deduplicated affinity/outbox-style change path. Repeated signals still merge their reasons into the active worker task, but only a newly tracked task increments the displayed count. For random room assignment, only newly tracked users whose current `profileStatus` is `public` increment the user count; non-public user signals are discarded for this counter update, while their affinity worker task still runs. Event and config tasks do not pretend to be one affected user. A run atomically claims the number accumulated before it started; changes arriving during the run remain for the next run. Failure restores the claimed number.
- The value is an informational work-item/signal count, not a promise that every item will still be eligible or that the final affected-row count will be identical. Deduplication, retries, and eligibility checks can make those numbers differ.
- Existing legacy queue rows are not scanned or backfilled. They become tracked when a normal application transition touches them. This avoids introducing the expensive projection the field is intended to replace.
- Updating one work document and updating the rule counter are separate Mongo documents. Their transitions are race-safe and the displayed value cannot go below zero, but exact crash consistency would require a cross-document transaction or a durable delta ledger.

## Quick start

From this folder:

```bash
bash admin-job-fixtures.sh list
bash admin-job-fixtures.sh prepare event-counter-expiry event
bash admin-job-fixtures.sh status event-counter-expiry
bash admin-job-fixtures.sh trigger event-counter-expiry
bash admin-job-fixtures.sh status event-counter-expiry
bash admin-job-fixtures.sh reset event-counter-expiry
```

`prepare` already makes a non-manual job's registry rule due. `trigger` only re-arms that timestamp if another scheduler pass is wanted. It does not call a hidden endpoint and does not start an application.

For the graph job:

1. Prepare `event-random-groups`.
2. Open **Admin → Admin Jobs → event-random-groups**.
3. Leave the already-running backend alone and wait for its next configured
   scheduler poll. `prepare` temporarily changes the rule interval to one minute,
   makes it due, and scopes this pass to the fixture source event.
4. Run `status event-random-groups`.
5. Press **Run** once more only when checking idempotence through the visible
   manual control.
6. Run `status` again and then `reset`.

For other jobs, leave the already-running backend alone and wait for its next configured scheduler poll. If it has already polled, run `trigger <job>` to clear only that rule's last-run timestamp, then wait again. Long application-level worker delays are not shortened by this toolkit.

To use e2e:

```bash
ADMIN_FIXTURE_DB=e2e_db bash admin-job-fixtures.sh prepare affinity-recompute isolated-user
```

Connection overrides:

```text
ADMIN_FIXTURE_MONGO_MODE=auto|container|local
ADMIN_FIXTURE_MONGO_CONTAINER=mongodb
ADMIN_FIXTURE_MONGO_HOST=127.0.0.1
ADMIN_FIXTURE_MONGO_PORT=27017
ADMIN_FIXTURE_MONGO_USERNAME=guest
ADMIN_FIXTURE_MONGO_PASSWORD=guest
ADMIN_FIXTURE_API_BASE_URL=http://localhost/api
```

`auto` prefers an already-running container. If neither that container nor local `mongosh` exists, the command stops and tells you; it never runs Docker Compose.
The API override accepts only an HTTP loopback root (`localhost` or `127.0.0.1`), never a remote or production URL.

## Commands

```text
list
prepare <job> <variation>
status <job>
trigger <job>
reset <job|all>
```

Snapshots are stored in `adminJobFixtureSnapshots` under IDs beginning with `admin-job-fixture:v1:`. Fixture records use the same namespace. If preparation fails after the snapshot is written, the snapshot is intentionally retained so `reset` can recover the original documents.

Always reset a scenario when done. `reset all` is safe to use when you are not sure which scenario remains prepared.

## Manual test matrix

### `event-random-groups`

Variations:

- `balanced`: six connected seeded demo users and two generated rooms of exactly three.
- `anchored`: the same data, with one user already accepted in each canonical room.
- `anchored-full-and-empty`: one room starts with three anchored users while the
  other is empty; only the three unassigned users may move.
- `five-rooms`: fifteen connected seeded demo users and five generated rooms of exactly three.
- `twenty-rooms`: sixty generated users arranged into twenty known-affinity cohorts of three.
- `one-leftover`: sixty-one generated users with exact room size three; one known under-minimum user tests the exclusion/remainder policy.
- `partial-room`: sixty-two generated users with room minimum two and maximum three; the final known pair is a valid partial room.
- `flexible-redistribution`: eleven generated users with room minimum three and
  maximum five; three affinity cohorts of 5, 3, and 3 prove that the one-user
  max-capacity remainder is redistributed instead of excluded.
- `disconnected-forest`: one six-user tree with a deliberately weak middle bridge, one separate three-user tree, and two fully isolated overflow users; the weak bridge must become the room boundary and only the isolates may remain unassigned.
- `under-min-connected-component`: one weakly joined six-user tree plus a separate
  connected pair; the tree must split into two valid triples, while the two-person
  component is the exact excluded set below the configured minimum.
- `below-minimum-total`: the whole graph contains only two connected users while
  the room minimum is three; no room membership, marker, outbox, or bell may be
  created.
- `quality-200`: two hundred generated users arranged into forty known-affinity cohorts of five.
- `quality-1000`: one thousand generated users arranged into two hundred known-affinity cohorts of five.

Preparation does not change or quarantine any unrelated event. It temporarily
sets the random-room rule's `jobs.process.randomGroups.sourceEventIds` parameter
to the fixture source event ID and its interval to one minute, so the real
scheduler pass processes only that input event promptly. Reset restores the
complete original rule document, including its original interval.

Expected after the scheduler pass:

- group definitions are derived at runtime from the stage capacities and are intentionally not persisted into `subEvents[].groups`;
- each derived room is a standalone `random-room` event with exactly the
  configured number of accepted event members and a shared chat materialized
  for those members;
- every selected participant has a `public` profile; non-public accepted source
  members are excluded from both the room plans and the affected-user result;
- the system stores exactly one `random-room-welcome` message in every generated
  chat before membership and notification fanout, and increments each member's
  chat unread counters exactly once;
- every fixture event member appears in exactly one room;
- anchors stay in their original rooms for `anchored` and
  `anchored-full-and-empty`;
- `schedulerPlanMarkers` exist;
- one outbox intent and in-app bell items exist for changed assignments;
- a second identical run makes no new assignment changes.

The `status` output includes the derived room IDs, exact room owner/member mapping, marker/outbox/bell counts, and a `validation.assignmentValid` result. Validation also lists room sizes, missing users, duplicate assignments, unexpected users, and the anchored-user check.

The generated `twenty-rooms`, remainder, and `quality-*` variations also have an objective grouping-quality oracle. Members of one expected cohort have strong `0.95` edges; consecutive cohorts are connected only by a weak `0.05` ring edge. `validation.quality` reports mixed rooms, split cohorts, misplaced users, actual versus optimal in-room affinity weight, and `affinityQualityRatio`. It also distinguishes the expected under-minimum user from any wrongly excluded user through `correctlyUnassignedUnderMinimumUserIds`, `wronglyUnassignedUserIds`, and `unassignedSelectionValid`.

`validation.capacityPolicy` reports empty, below-minimum, partial, and above-maximum room indexes plus the observed remainder policy. For `partial-room`, a valid result assigns everyone and keeps one room of two. For `flexible-redistribution`, it must report three rooms sized 5, 3, and 3, no missing user, and an affinity quality ratio of `1`. For `one-leftover`, inspect this together with `unassignedSelectionValid` to see whether the exact low-value remainder was excluded instead of a valid cohort member. For `disconnected-forest`, `assignmentValid`, `cohortIntegrityValid`, `unassignedSelectionValid`, and an affinity quality ratio of `1` together prove that the six-user tree was cut only at its weak bridge, the three-user tree stayed intact, and only the two isolates were excluded.

For `under-min-connected-component`, the same oracle proves that connectivity
alone cannot override the room minimum. For `below-minimum-total`,
`expectedNoOutputArtifacts` and `noOutputArtifacts` must both be true. After a
successful first pass, `status` stores a fixture-only fingerprint of chat
messages, memberships, markers, outbox, and bell rows. A second Admin **Run** must report zero affected
users and `repeatedPassChangedZeroGroups:true` plus
`assignmentFingerprintUnchanged:true`.

`quality-1000` is intentionally a load-oriented fixture. It inserts roughly one thousand temporary users, two thousand strong edges, two hundred weak edges, one thousand event memberships, and the resulting assignment notifications. Run it only on a disposable demo/e2e stack with explicit CPU/memory limits, then reset it before testing another scenario.

### `event-auto-inviter`

Variations:

- `open-spots`: one accepted admin and capacity for two invitations.
- `full`: accepted capacity is already full; this is the zero-change control.
- `weighted`: one accepted creator, one already-pending highest-weight invitee, and four available candidates with deterministic weights. Exactly the next two candidates must be invited.
- `weighted-tie`: four available candidates all have weight `0.50`; exactly the
  first two IDs in the production comparator order must be invited, while the
  existing reserved `0.99` invite remains untouched.
- `waitlist-capacity`: capacity four with one accepted creator, one already-reserved invitation, and four waitlisted users inserted newest-first. Only the two oldest waitlisted users fit.
- `waitlist-timestamp-tie`: the same capacity shape, but every waitlist timestamp
  is equal, legacy `syncKey` values are absent, record IDs are deliberately not
  correlated with user IDs, and insertion order is descending. The record ID is
  the deterministic final comparator.
- `pending-join-does-not-reserve`: capacity two with one accepted creator, one
  member-origin pending join request, and two affinity candidates. The join
  requester stays locked out of candidacy but does not consume the one available
  invitation slot.

Preparation temporarily disables `autoInviter` on every other currently enabled demo event and quarantines existing pending waitlist rows. This prevents the two global passes from inviting a very large candidate set.

Expected:

- `open-spots`: two connected users become pending event members with `requestKind:"invite"`; a priority plan marker and invite outbox/bell records appear.
- `full`: no new membership, marker, outbox, or bell record.
- `weighted`: the existing pending user with weight `0.99` remains reserved and is not invited again; the candidates weighted `0.95` and `0.80` are the exact new invitees; the `0.40` and `0.10` candidates remain outside. Marker, outbox recipients, and bell recipients must contain exactly the same two IDs.
- `weighted-tie`: the exact two lexicographically first candidate IDs are invited;
  marker, outbox, and bell recipients must match those IDs exactly.
- `waitlist-capacity`: exactly the two oldest rows change from `requestKind:"waitlist"`/`pendingSource:"member"` to `requestKind:"waitlist-invite"`/`pendingSource:"admin"`; the two newer rows stay waitlisted, the existing invite remains unchanged, no priority marker appears, and outbox/bell recipients are exactly the two promoted IDs.
- `waitlist-timestamp-tie`: the users belonging to the two lexicographically
  smallest membership record IDs are promoted; the other two remain waitlisted,
  regardless of reverse insertion order.
- `pending-join-does-not-reserve`: the member-origin `join` row remains unchanged
  byte-for-byte, the strongest eligible candidate is the only new `invite`, and
  marker/outbox/bell recipients contain exactly that candidate.

The `waitlist-capacity` event intentionally has `autoInviter:false`. The waitlist sweep discovers it from its pending membership rows independently; disabling graph-based priority invitations keeps this variation's two changed rows and notifications exact.

Pending invitations reduce open capacity; member-origin join requests do not.
After the first successful `weighted`, `weighted-tie`, `waitlist-capacity`,
`waitlist-timestamp-tie`, or
`pending-join-does-not-reserve` pass, run `status` once to capture its
fixture fingerprint, then `trigger event-auto-inviter`, wait for the existing
scheduler, and run `status` again. For `weighted` and `weighted-tie`,
`validation.repeatedPassChangedZeroRecords` and
`validation.membershipMarkerAndNotificationSetUnchanged` must be true. For
`waitlist-capacity` and `waitlist-timestamp-tie`,
`validation.repeatedPassChangedZeroRecords` and
`validation.membershipAndNotificationSetUnchanged` must be true. The pending-join
variation uses `validation.pendingJoinDocumentUnchanged`,
`validation.pendingJoinDidNotReserveOnlyInviteSlot`, and
`validation.membershipMarkerAndNotificationSetUnchanged`.

### `event-tournament-review`

Variations:

- `ended`: an active tournament stage ended in the past.
- `future`: an active first stage starts in the future.
- `advancement`: six synthetic accepted users in two finalized Score groups, with one exact winner per group and a two-person final preloaded with a loser.
- `advancement-score-tie`: the top two scores in each qualifier group are equal;
  the production comparator must choose the expected winner by member name and
  then user ID.
- `advancement-top-two-cutoff-tie`: two users advance from each group; every
  member has two score rows, and ranks two and three have equal aggregate scores
  and equal display names so the final user-ID comparator decides the cutoff.
- `no-advancers-clears-stale`: qualifier score rows exist, but every qualifier
  membership is disqualified. No scored user may advance and a stale accepted
  final member must be deleted.

Preparation quarantines other published tournament-capable demo events. The fixture uses the exact backend field names:

```text
tournamentLeaderboardType
tournamentGroupCapacityMin
tournamentGroupCapacityMax
tournamentAdvancePerGroup
stageStatus
stageStatusReason
stageStatusUpdatedAt
stageFinalizedAt
```

Expected:

- `ended`: `stageStatus:"SR"` and `stageStatusReason:"stage-ended"`.
- `future`: `stageStatus:"RS"` and `stageStatusReason:"awaiting-tournament-start"`.
- both: a new `stageStatusUpdatedAt` and the event's scheduler update metadata.
- `advancement`: the scheduled rule calculates the exact winners (`user-2` and `user-5`), synchronizes only those two into the generated final group, and marks the preloaded loser deleted. The synthetic users intentionally have no affinity edges: ranking determines who advances, while affinity is allowed to influence only how valid winners are grouped.
- `advancement-score-tie`: the exact deterministic tie winners (`user-1` and
  `user-4`) enter the final, the preloaded loser is deleted, and marker/member
  state remains unchanged on the repeated pass.
- `advancement-top-two-cutoff-tie`: all twelve score rows are summed by member;
  users `1`, `2`, `4`, and `5` enter the four-person final, while users `3` and
  `6` lose the equal-score/equal-name cutoff by user ID.
- `no-advancers-clears-stale`: the accepted final set becomes empty, the stale
  final row becomes `deleted`, and the score marker contains an empty user list.
  Its first `lastRunCount` is `2`: one final-stage start-review transition plus
  one final-group membership synchronization.

For `advancement`, `advancement-score-tie`,
`advancement-top-two-cutoff-tie`, or
`no-advancers-clears-stale`, run `status` after the first scheduler pass. It
captures the successful membership/marker fingerprint inside the fixture
snapshot. Then run `trigger event-tournament-review`, wait for the existing
scheduler, and run `status` again.
`validation.repeatedPassChangedZeroGroups` and
`validation.membershipAndMarkerUnchanged` must both be true. This proves
scheduled repair and idempotence without calling a private endpoint or moving
graph work into the stage-finalize request.

### `event-counter-expiry`

Variations:

- `event`: one active event whose end is in the past.
- `ticket-only`: one due ticket record that is not an active event.
- `start-fallback-future-control`: one active event has no `endAtIso` and a past
  `startAtIso`; a second active control has `endAtIso:null` and a future start.

Expected:

- `event`: `expired:true`, `updatedUser:"event-counter-expiry"`, the isolated owner's event counters are recomputed, and the rule reports one source.
- `ticket-only`: the document becomes expired but the exposed source count is zero. Ticket rows are marked separately from the distinct active-event source count.
- `start-fallback-future-control`: only the past start-only event expires, the
  future control remains byte-for-byte stable, the rule reports one source, and
  the owner's top-level and nested event counters expose only the future hosted
  event.
- Repeating any variation produces no additional due row.

Any pre-existing due event/ticket rows are snapshotted and temporarily marked expired so the pass remains fixture-only; reset restores them exactly.

### `event-checkout-basket-purge`

Variations:

- `mixed`: one expired draft plus one future draft.
- `expired`: two expired drafts.

Expected:

- only expired purgeable rows change to `resultState:"deleted"`;
- the future row remains `active`;
- the first processed count is one or two, matching the variation;
- the repeated count is zero.

The job marks basket rows deleted; it does not physically delete them.

Any pre-existing due basket rows are snapshotted and temporarily assigned a non-worker quarantine result state.

### `notification-outbox`

Variations:

- `due`: pending direct notification, due now, addressed to an isolated user with no device token.
- `future`: pending direct notification whose `nextRetryAt` is in the future.

The stock demo/e2e deployment marker has Firebase inactive. In that normal state the scheduled rule records a `completed` zero-count safe no-op with the detail `Firebase delivery is inactive; pending notification outbox work was retained.` The worker does not lease or send the due item, so it remains `pending` with its retry fields unchanged. This is the expected safe result, not a delivery failure. If messaging has been explicitly configured and enabled on a disposable environment, the due/no-token row should become `sent` with zero successful tokens. The future row must remain pending in either case.

Directly inserting an outbox fixture does not create a bell item. Bell materialization occurs when application code calls the outbox enqueue service, which is tested by the graph and interaction scenarios.

Existing due pending outbox rows are snapshotted and temporarily moved to a future retry time so an enabled delivery worker cannot consume unrelated demo messages.

### `notification-read-path`

Variations:

- `group-chat`: creates two isolated fixture users plus one group chat carrying explicit event, sub-event, and group context.
- `group-chat-audience`: creates a sender and three recipients. One recipient is
  muted and has a device with push notifications disabled. All three recipients
  must still receive the pulled in-app bell and chat projection; the sender must
  receive neither.
- `preexisting-unread`: starts the primary recipient with one unrelated unread
  control bell, then creates the normal chat notification through the real HTTP
  endpoint.

This scenario uses the already-running local backend but does not start it:

```bash
bash admin-job-fixtures.sh prepare notification-read-path group-chat
bash admin-job-fixtures.sh status notification-read-path
bash admin-job-fixtures.sh trigger notification-read-path
bash admin-job-fixtures.sh status notification-read-path
bash admin-job-fixtures.sh trigger notification-read-path
bash admin-job-fixtures.sh status notification-read-path
bash admin-job-fixtures.sh reset notification-read-path
```

`prepare` snapshots the selected Mongo documents, inserts the isolated context, then posts exactly one chat message through the real HTTP endpoint. That application call exercises chat persistence, recipient selection, `NotificationOutboxService.enqueue`, and immediate in-app inbox materialization.

Before `trigger`, `status` is read-only and checks both Mongo and the real API
unread models:

- exactly one outbox item and one `userNotifications` row exist;
- the recipient is exactly the other participant and the sender is excluded;
- the inbox `syncKey` is the outbox `syncKey` plus the recipient ID, so repeated materialization cannot create a duplicate;
- `GET /notifications?bucket=new` returns one unread bell row with `unreadCount:1`, `readAtIso:null`, chat source/action/payload fields, and `muted:false`;
- `GET /auth/me` exposes matching stored notification and chat counters;
- `GET /activities/chats` exposes `unread:1`, `channelType:"groupSubEvent"`, and matching event/sub-event/group IDs and navigation context;
- a second `status` remains unchanged, proving the poll itself has no write side effects.

`trigger notification-read-path` calls the real
`POST /notifications/{id}/read` endpoint for the isolated bell. It then proves:

- the response contains the same notification ID and exact chat source;
- `readAtIso` is non-empty and `unreadCount` is zero;
- the `new` bucket is empty while the `all` bucket contains exactly the read row;
- both `/auth/me` notification projections are zero;
- the independent group-chat unread flag and chat counters remain one, because reading
  the bell must not silently read the chat;
- a repeated `trigger` preserves the first `readAtIso`, proving read idempotency.

For `preexisting-unread`, the initial API/profile unread count must be `2`.
Reading the chat bell must leave the unrelated control bell in the new bucket,
with API/profile count `1`; the chat's own unread projection remains `1`. This
checks a selective `2 → 1` decrement instead of only the simple `1 → 0` path.

After the trigger, repeated `status` calls remain read-only and report
`readState:"read"`, the stable `readAtIso`, zero bell/profile unread count, and the
unchanged event/sub-event/group chat context.

The bell is intentionally materialized during enqueue, before Firebase push delivery. With stock Firebase disabled, the outbox staying `pending` is expected. If Firebase is enabled in a disposable local stack, the no-token item may become `sent` with zero token successes without changing the bell assertion.

The audience variation validates the persisted push-disabled flag and the
pull-based in-app notification audience. It deliberately does not claim that an
external Firebase delivery was suppressed, because stock demo/e2e has Firebase
disabled and the fixture never calls a real push gateway.

The generic chat bell payload currently carries the chat/message/sender IDs. Event, sub-event, and group IDs belong to the chat read model, so `status` verifies them through `GET /activities/chats` rather than inventing fields in production notification code.

If the local HTTP request fails after the snapshot was created, run `reset notification-read-path`; the snapshot is deliberately retained for recovery.

### `affinity-recompute`

Variation:

- `isolated-user`: one due `USER` task for a namespaced user with no event, asset, rate, or graph dependants.

Expected:

- `pending → running → done`;
- `attemptCount:1`;
- lease/worker fields are cleared at completion;
- `completedAtIso` is set;
- no seeded user is changed.

This validates worker leasing and the user recompute path without asking the full graph to recompute.

Existing due affinity tasks are snapshotted and moved to a future availability time for the duration of the scenario.

### `scheduled-messages`

Variations:

- `inactive-user`: a due 30-day inactivity task and no recent device activity.
- `recent-user`: the same task with recent device activity.

Expected:

- `inactive-user`: task `completed`, `lastRunCount:1`, user `status:"I"` and `profileStatus:"inactive"`, plus one audit run/delivery and a user affinity task.
- `recent-user`: task remains `scheduled`, its due time moves approximately 30 days after the recorded activity, and the audit result says it was rescheduled.

The scheduled-message service can maintain a local delayed worker in addition to its database poll. Reset snapshots its task, user, audit, and derived affinity selectors.

Other tasks due within the worker lookahead are snapshotted and temporarily suspended.

### `account-purge`

Variations:

- `isolated`: expired deleted fixture user.
- `with-reference`: the same user plus one `userRates` reference.

Expected:

- the fixture user is physically removed;
- `with-reference` also removes the rate;
- the fixed purge job ends `completed`, clears `userId`, and records `completedAtIso`;
- reset removes the fixture purge result and restores the pre-prepare state.

No seeded person's account is selected.

Existing deleted/onboarding users and resumable purge jobs are snapshotted and temporarily moved outside the purge window/lease so the destructive pass remains fixture-only.

### `bell-rating-feedback`

Variations:

- `rating`: finds a seeded pending/single rating pair, resets the actor's score to zero, and prints actor/target IDs and names.
- `feedback`: finds a seeded accepted attendee submission, removes that actor/event state and answers, and prints the event plus other-party targets.

This is an application interaction check, not a scheduled job:

1. Prepare the variation.
2. Use the existing demo app's user switch/impersonation flow for the printed actor.
3. Submit the rating or event feedback.
4. Switch to the printed target and open the bell.
5. Run `status bell-rating-feedback`.

Before the action, the fixture temporarily removes only the selected rating/event's matching historical bell/outbox documents behind the exact reset snapshot. It refuses to continue if one of those outbox items is still tracked by the running worker. This makes the oracle independent of unrelated target notifications.

`status` reports the persisted action and validates the exact notification contract.
Once the Mongo oracle passes, the wrapper also queries the already-running loopback
backend for the actor and every submitted target:

- `PASS`: one logical outbox has exactly the submitted recipients; every target has exactly one unread bell with the expected kind, source, sender, action path, and payload; the actor has none; the stored unread projection matches the notification collection.
- The API sub-oracle requires the exact persisted notification ID and DTO fields in
  `GET /notifications?bucket=new`, requires its `unreadCount` to equal the Mongo
  collection count, and requires both `/auth/me` notification counter projections to
  equal that same count. The actor API result must not contain the logical
  rating/feedback notification.
- `FAIL/GAP`: persistence worked but at least one exact outbox, bell fanout, duplicate, actor-exclusion, or unread-projection assertion failed.
- `WAITING`: the manual action has not been submitted.

All selected user, notification, outbox, affinity, rating/feedback, and affected Admin Job rule documents are snapshotted exactly for reset.

## Current integration checks and useful failures

The scripts prepare valid data; they do not hide scheduler wiring problems.

- The graph job is intentionally run only through the visible Admin Jobs **Run** action.
- A non-manual rule remaining `idle` with old data after `trigger` means the running backend did not poll it, its worker feature is disabled, or that worker is not wired to the registry rule.
- A rule changing run state while fixture data remains unchanged points to an eligibility/worker defect.
- A rating/feedback `FAIL/GAP` means persistence worked but the action did not enqueue/materialize the other party's in-app notification.
- Notification outbox staying pending while Firebase is inactive is expected; the enabled job must still record a completed zero-count safe no-op.

Older code paths may expose only the random job through manual Admin Run and may run auto-inviter/tournament from independent in-memory cadence switches. The expected end state is that all stored job rules are enabled by default on production, dev, demo, and e2e, and scheduled workers honor their stored timing. These fixtures make that integration observable without changing production defaults.

## Persisted pending counters in Admin detail

Admin pending work is a persisted delta counter, never a live count, aggregation, projection, estimate, or refresh operation.

Every job fixture writes the known number of work items it creates to:

```text
runState.pendingCount
runState.pendingCountUnit
runState.pendingCountUpdatedAtIso
```

Queue-backed fixture documents also set their job-specific `pendingCounterTracked` flag (or `accountPurgePendingCounterTracked` on a purge user). A successful worker completion decrements that persisted delta; event-pass workers atomically claim it at run start and restore it on failure. `reset` restores the complete prior rule document, including its original pending counter.

Admin detail should display this stored pending delta and the previous run's stored `lastRunCount`. It must not scan work collections or execute graph logic to derive either value.

## Limitations

- Reset is exact for the selectors captured at prepare time, but this is still a disposable-environment tool. Do not edit the same selected demo records concurrently.
- The global event jobs are quarantined rather than backend-scoped because their scheduled entry points do not accept fixture IDs. Their targeted internal graph methods exist, but the Admin API does not expose a safe fixture filter.
- A hard application crash between a worker mutation and reset can leave the snapshot intact; run `reset <job>` after the app is back.
- Redis wakeup stream records are not modified or cleared. Mongo status remains the source of truth for these fixtures.
- `notification-read-path` and the API sub-oracle of a prepared
  `bell-rating-feedback` status only call an explicitly loopback API root and require
  the matching already-running demo/e2e backend.
- The scripts do not run a browser, visual confirmation, npm, Gradle, Docker Compose, or a full seed reset.

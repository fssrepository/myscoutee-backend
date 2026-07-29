# Admin job manual fixture toolkit

This folder creates small, repeatable demo/e2e data states for manually checking every Admin Job and the rating/feedback bell flow. It is deliberately separate from the application seeds and production behavior.

The toolkit:

- accepts only a database named exactly `demo_db` or `e2e_db`;
- also verifies the seeded schema-v3 deployment identity (`MyScoutee Demo Operator` or `MyScoutee E2E Operator`) before doing anything;
- never starts, stops, or restarts Mongo, the backend, npm, or any other process;
- uses the already-running `mongodb` container when available, otherwise an already-installed local `mongosh`;
- snapshots the exact documents selected by a scenario before changing them;
- allows only one prepared scenario at a time;
- restores only that scenario's snapshotted selectors on reset.

It must not be used as a production migration or a production test tool. All application jobs should still be enabled by their normal defaults in every deployment; this fixture tool rejects trusted/production databases so manual experiments cannot modify them.

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

For the graph job, use the visible Admin UI:

1. Prepare `event-random-groups`.
2. Open **Admin → Admin Jobs → event-random-groups**.
3. Press **Run**.
4. Run `status event-random-groups`.
5. Press **Run** once more to check idempotence.
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
```

`auto` prefers an already-running container. If neither that container nor local `mongosh` exists, the command stops and tells you; it never runs Docker Compose.

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

Preparation temporarily sets every other currently published demo event to `published:false`, after snapshotting those exact event IDs. This quarantine is important: the graph worker is global and parallel, and the regular demo seed contains many eligible events and hundreds of accepted memberships. Without quarantine it can be expensive and can change unrelated demo assignments.

Expected after **Admin Jobs → Run**:

- the fixture event contains two materialized group definitions;
- two canonical group owners each contain three accepted `activityMembers`;
- every fixture event member appears in exactly one room;
- anchors stay in their original rooms for `anchored`;
- `schedulerPlanMarkers` exist;
- one outbox intent and in-app bell items exist for changed assignments;
- a second identical run makes no new assignment changes.

The `status` output includes the exact room owner IDs, member IDs, marker count, outbox count, bell count, and how many existing events are quarantined.

### `event-auto-inviter`

Variations:

- `open-spots`: one accepted admin and capacity for two invitations.
- `full`: accepted capacity is already full; this is the zero-change control.

Preparation temporarily disables `autoInviter` on every other currently enabled demo event and quarantines existing pending waitlist rows. This prevents the two global passes from inviting a very large candidate set.

Expected:

- `open-spots`: two connected users become pending event members with `requestKind:"invite"`; a priority plan marker and invite outbox/bell records appear.
- `full`: no new membership, marker, outbox, or bell record.

Repeated priority runs can otherwise invite more users because pending invitations are locked but do not reduce the worker's accepted-member open-spot calculation. Keep this fixture isolated and reset it.

### `event-tournament-review`

Variations:

- `ended`: an active tournament stage ended in the past.
- `future`: an active first stage starts in the future.

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

### `event-counter-expiry`

Variations:

- `event`: one active event whose end is in the past.
- `ticket-only`: one due ticket record that is not an active event.

Expected:

- `event`: `expired:true`, `updatedUser:"event-counter-expiry"`, the isolated owner's event counters are recomputed, and the rule reports one source.
- `ticket-only`: the document becomes expired but the exposed source count is zero. Ticket rows are marked separately from the distinct active-event source count.
- repeating either job produces no additional due row.

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

The stock demo/e2e deployment marker has Firebase inactive. In that normal state the worker deliberately does nothing and the due item remains `pending`. This is the expected safe result, not a delivery failure. If messaging has been explicitly configured and enabled on a disposable environment, the due/no-token row should become `sent` with zero successful tokens. The future row must remain pending in either case.

Directly inserting an outbox fixture does not create a bell item. Bell materialization occurs when application code calls the outbox enqueue service, which is tested by the graph and interaction scenarios.

Existing due pending outbox rows are snapshotted and temporarily moved to a future retry time so an enabled delivery worker cannot consume unrelated demo messages.

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

`status` reports both persisted action data and bell/outbox deltas:

- `PASS`: the action was saved and another party received a new in-app bell item.
- `FAIL/GAP`: the action was saved but no new bell item exists.
- `WAITING`: the manual action has not been submitted.

The baseline target notifications and outbox documents are snapshotted exactly so reset can restore them even if enqueue collapse/merge updates an existing row instead of inserting a new one.

## Current integration checks and useful failures

The scripts prepare valid data; they do not hide scheduler wiring problems.

- The graph job is intentionally run only through the visible Admin Jobs **Run** action.
- A non-manual rule remaining `idle` with old data after `trigger` means the running backend did not poll it, its worker feature is disabled, or that worker is not wired to the registry rule.
- A rule changing run state while fixture data remains unchanged points to an eligibility/worker defect.
- A rating/feedback `FAIL/GAP` means persistence worked but the action did not enqueue/materialize the other party's in-app notification.
- Notification outbox staying pending while Firebase is inactive is expected.

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
- The scripts do not run a browser, visual confirmation, npm, Gradle, Docker Compose, or a full seed reset.

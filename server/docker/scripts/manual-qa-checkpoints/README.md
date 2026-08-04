# Manual QA checkpoints

This directory is a manual-only QA harness. It is deliberately separate from
`admin-job-fixtures`: it does not import, modify, or execute that automated
fixture suite.

The harness creates observable checkpoints around a real persisted scheduler
configuration. It never starts another backend, frontend, database, Gradle, or
scheduler process and never calls a hidden/manual job endpoint.

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
| `event-domain` | Stages one selected Editor, invitation/chat, lifecycle, feedback/Impressions, ticketing, or tournament checkpoint with exact identity-level oracles | No scheduler unless the selected checkpoint explicitly continues through its named real-scheduler helper |
| `asset-domain` | Stages controlled asset invitations or one event/sub-event resource assignment with independent asset/event role oracles | No scheduler; direct resource/outbox consumers are conditional |
| `operator-domain` | Snapshots the exact deployment configuration and prints a credentials-safe Firebase capability oracle | No scheduler; QA supplies disposable provider configuration through the Operator UI |

Only one manual scenario may be staged at a time. The historical 2026-08-04
results were **not** rerun while these helpers were added.

## Event-domain checkpoint runner

The event-domain runner implements executable setup and machine oracles for the
checkpoint graph in
[`DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md`](../../../../guides/plans/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md).
It does not merely print that document. `stage` creates the controlled event,
membership, feedback or ticket prerequisite and stores a complete reset
snapshot; `status` queries the resulting identities from Mongo.

Supported checkpoint IDs:

- `EVENT-EDITOR-001` through `EVENT-EDITOR-005`
- `EVENT-SLOT-001` through `EVENT-SLOT-004`
- `EVENT-INV-001` through `EVENT-INV-005`
- `CHAT-AUTH-001`
- `EVENT-LIFE-001` through `EVENT-LIFE-005`
- `EVENT-FEEDBACK-001` through `EVENT-FEEDBACK-005`
- `EVENT-IMPRESSION-001`
- `EVENT-TICKET-001` through `EVENT-TICKET-004`
- `TOURNAMENT-001` through `TOURNAMENT-003`

Use one checkpoint at a time:

```bash
bash manual-qa-checkpoints.sh status event-domain EVENT-FEEDBACK-002
bash manual-qa-checkpoints.sh stage event-domain EVENT-FEEDBACK-002
bash manual-qa-checkpoints.sh next event-domain EVENT-FEEDBACK-002
# perform exactly the printed human UI action
bash manual-qa-checkpoints.sh status event-domain EVENT-FEEDBACK-002
bash manual-qa-checkpoints.sh reset event-domain EVENT-FEEDBACK-002
```

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
bash manual-qa-checkpoints.sh stage event-domain EVENT-TICKET-002
```

`EVENT-EDITOR-003` continues through the existing `stat-012` real auto-inviter
helper. `TOURNAMENT-003` continues through the named real tournament-review
scheduler workflow. The immediate runner does not impersonate either worker.

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

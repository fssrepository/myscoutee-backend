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
| `stat-011` | Prints one unique message token for an existing chat | Real chat persistence plus Statistics/Monitoring workers |
| `stat-020` | Holds one exact event recompute task and captures graph history | Short persisted affinity schedule/normal worker plus Statistics Refresh |
| `stat-012` | Stages one deterministic event/invitee while holding the rule | Short persisted real auto-inviter schedule |

Only one manual scenario may be staged at a time. The historical 2026-08-04
results were **not** rerun while these helpers were added.

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
Statistics inventory entries, quarantined data, primary rule, and secondary
pending counters. It deliberately does not rewind legitimate scheduler
telemetry or run history.

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

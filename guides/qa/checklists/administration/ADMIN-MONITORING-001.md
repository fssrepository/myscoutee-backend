# ADMIN-MONITORING-001 — Monitoring, task lifecycle and configuration counters

## Purpose

Verify the Monitoring dashboard against real queue, scheduler, audit and
configuration records. This is the second Administration test after BASE-STAT.
**Actor:** Ava Moderation. Startup opens Admin home; step 1 begins the test.

## Fixture prerequisites and previously tested work

Codex snapshots the baseline and names the isolated recompute task, expected
output and unaffected controls. Fixture setup replaces the rating or other
user journey that would enqueue it. A real worker must still process the task.

JOB-MESSAGES owns the Jobs table/detail/mobile presentation. Reuse that evidence;
do not retest its layout. A job's own run history and business result are separate
assertions: a working table does not prove every job's audit. Codex maps MON-013
jobs to their existing domain evidence before block 2. Only missing assertions
need a fixture-backed run, without repeating the originating user journey.

The shared Params editor/History/revert interaction is tested once in block 3.
Parameters uses that evidence and fixtures for repeated setup/cleanup, while
retaining its distinct section-specific persistence and consumer checks.

## 1. Baseline, filters and read-only reload

1. Open **Metrics**. In **All**, record category names, counts, health labels
   and timestamps. Codex captures the corresponding persisted baseline.
2. Select **Watch**, **Domains**, **Notifications** (Delivery) and
   **Background** (Workers) in turn.
   Each filter contains the correct categories and shows their category count.
3. Verify Watch against actual category health. An empty Watch requires all
   categories to be OK; unrelated existing failures must remain identifiable.
4. Return to **All**, which reloads the current snapshot. The popup loads on
   opening/filter change, not an automatic interval. Reading/filtering creates
   no work or processing increments. Codex attributes genuine background changes
   to their source instead of requiring a globally idle database.

Report: `ADMIN-MONITORING-001 block 1 done`.

## 2. Recompute, scheduler audit and domain result

5. Select **Background / Matching**. Codex stages the named task with the existing
   `affinity-recompute / isolated-user` fixture and records its starting state.
6. Observe pending/running and terminal states. Codex compares the task identity,
   queue counts, pending tracking and timestamps. A short running state may be
   established from retained history rather than an extra run.
7. At completion, the task is no longer pending/running; failed state and health
   agree with the actual result. Live counts settle while cumulative totals remain.
8. Inspect the named **Jobs → Refresh affinities → View process** result solely
   for this run's data: start/end, outcome and affected count. Codex correlates
   `runState`, history and scheduler/audit telemetry with that same real run.
9. Codex independently verifies the changed affinity output, named control and
   relevant discovery projection. Use a prepared graph and retained Bell evidence
   for already proven graph presentation; a terminal task alone is not output proof.
10. Codex checks the MON-013 evidence mapping for each applicable Admin Job:
    job/run identity, scheduler start/terminal trace, history and its domain oracle.
    Reuse complete prior evidence. For an uncovered job, prepare only its existing
    non-empty fixture, process it through its normal execution path, and inspect
    that run's missing result/telemetry. Record each covered or missing job by name;
    do not infer all-job coverage from Refresh affinities or a zero-work run.

Report: `ADMIN-MONITORING-001 block 2 done`.

## 3. One parameter save, History and revert

11. Codex restores the task fixture and captures the active Jobs version, values,
    counters, tasks, outbox and expected Admin recipients. Open **Params → Jobs**.
12. Under **Edit**, increase **User debounce** by one second and save once,
    for example `300 s → 301 s`. Codex states the actual value pair beforehand.
13. Close and reopen Params. The new value persists. **History** shows one new
    version with the correct section, value, author, time and change summary.
14. In Monitoring **Background / Jobs**, verify one configuration-change increment
    for that version. Codex correlates the recompute task and Admin notification
    outbox with this save, including expected recipient records and projections.
    Other Admins receive the notification; the Admin who made the change does not.
    Do not replay the previously tested bell/read or push journey.
15. Let the real related work complete. Compare pending/running/terminal counters,
    job/audit result and unaffected controls. Distinguish cumulative events from
    live queue counts; do not accept a successful Save as worker/delivery proof.
16. In **History**, restore the baseline version's values. Reopen and verify the
    original values, a new retained history entry and one further config increment.
    Codex checks the corresponding task/outbox and their completed results.
17. Revert the already active version again. No new version, configuration event,
    recompute task or Admin notification is produced by this no-op.
    The active version's UI action is disabled; Codex also verifies the same-version
    request through the authenticated HTTP route without changing browser state.
18. Confirm the changed and restored versions remain in History. Unrelated
    parameter sections retain their baseline values; original Jobs values are active.

Report: `ADMIN-MONITORING-001 block 3 done`.

## 4. Closure

19. Codex records exact source-to-counter correlations, named job coverage and
    every retained cross-domain proof. Any missing MON-013 job assertion remains
    explicitly open; it cannot be replaced with synthetic history or a blanket PASS.
20. Once fixture-owned work is terminal, Codex restores the retained fixture and
    session state. Preserve real audit/version evidence as defined by the harness.

Report: `ADMIN-MONITORING-001 done`.

## Original matrix coverage

| Source | Owning checks |
| --- | --- |
| BASE-MON | Block 1: categories, filter totals, health and read-only reload |
| MON-011 | Block 2, steps 5–9: task lifecycle, correct output and controls |
| MON-013 | Block 2, steps 8–10: per-job scheduler/history/domain proof, reused where complete |
| MON-014 | Block 3: exact save/revert/no-op events, queue, audit and Admin notification |

## Preparation commands

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh stage admin-monitoring ADMIN-MONITORING-001
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh status admin-monitoring ADMIN-MONITORING-001
node guides/qa/tools/open-checkpoint-browser-sessions.mjs ADMIN-MONITORING-001
```

The baseline neither arms a task nor saves a parameter. The
[Monitoring script](../../../../server/docker/scripts/manual-qa-checkpoints/scenarios/admin-monitoring-checkpoints.js)
provides startup, evidence capture and cleanup.

Block 2 uses the existing job fixture:

```bash
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh prepare affinity-recompute isolated-user
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh status affinity-recompute
# Only after completion and evidence capture:
bash server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh reset affinity-recompute
```

Block 3 capture commands are `capture-before-params`, `capture-after-save` and
`capture-after-revert`, with `admin-monitoring ADMIN-MONITORING-001` as the
Docker harness arguments. These commands do not perform the UI actions.
`reset` verifies original Jobs values and terminal work, then restores the
retained browser-startup state. Real parameter versions, history and audit
remain as evidence.

After capturing the real parameter mutation and observing its pending state,
`make-recompute-due` shortens only those captured CONFIG tasks' wait. Processing
and terminal results still come from the normal worker. The guarded
`guides/qa/tools/admin-monitoring-noop.py` oracle requires terminal work before
issuing the same-version request and compares versions, configuration, tasks
and notification outbox before and after.

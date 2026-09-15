# ADMIN-MONITORING-001 — Monitoring, queues and configuration counters

## Purpose

Check Monitoring filters and counters against one real task and one parameter
save/revert. This is the second Administration test after BASE-STAT.
**Actor:** Ava Moderation. Startup opens Admin home; step 1 begins the test.

## Fixture prerequisites

The JOB-MESSAGES test owns the Jobs table, detail and mobile presentation.
Use a fixture for the task baseline here; do not repeat those UI checks.
The parameter save/history/revert sequence is tested once in block 3 below.
ADMIN-PARAMETERS uses fixtures instead of repeating that sequence.

## 1. Baseline and filters

1. Open **Metrics** from Ava’s menu. Read the categories and status indicators
   in **All**. Codex records the baseline.
2. Select **Watch**, **Domains**, **Delivery** and **Workers** in turn.
   Each filter count matches its categories; Watch may be empty when healthy.
3. Return to **All**. Filter changes create no work or counter increments;
   Codex identifies any real background activity separately.

Report: `ADMIN-MONITORING-001 block 1 done`.

## 2. One task’s counters

4. Stay on **Domains / Matching**. Codex prepares one named recompute task
   with the existing fixture; do not repeat its originating user journey.
5. Observe pending/running state and completion. Retained run history may
   prove a short running transition. Codex correlates the same task.
6. After completion, the test task is no longer pending/running; cumulative
   processing history remains. Control changes require identified background work.

Report: `ADMIN-MONITORING-001 block 2 done`.

## 3. Exact configuration-change counts

7. Codex resets the task fixture and captures the parameter baseline. Open
   **Params → Jobs → Edit**, increase **User debounce** by one second and
   save once, for example `300 s → 301 s`.
8. Reopen Params: the new value persists. **History** shows one new version
   with the correct author/time; Monitoring **Workers / Jobs** shows one
   configuration change. Codex correlates the records.
9. Restore the baseline values through **History**. The original value returns;
   one further history entry and configuration-change increment appear.
10. Reverting the already active version causes no further change. After the
    related work completes, pending counters settle.

Report: `ADMIN-MONITORING-001 block 3 done`.

## 4. Closure

11. Codex compares exact counts and controls, retains the parameter lifecycle
    evidence for Parameters, and restores the fixture.

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

# BASE-STAT — Statistics baseline refresh

Status: `MANUAL UI PASS` on 2026-08-04; historical reconstruction, not rerun.

## Why and what

Prove that the persisted Statistics dashboard renders every section and that a
refresh without a causal user/domain action does not fabricate deltas.

## Preconditions and isolation

- Use the already-running demo stack; do not start a second process.
- Make sure no other QA operator is deliberately producing telemetry during
  the short comparison window.
- Record any Admin Job already running or due soon; its proven result is the
  only acceptable background explanation for a delta.

## Reproduction helper

From `server/docker/scripts/manual-qa-checkpoints`:

```bash
bash manual-qa-checkpoints.sh stage base-stat
# perform the UI checkpoints below
bash manual-qa-checkpoints.sh status base-stat
bash manual-qa-checkpoints.sh reset base-stat
```

`stage` records only a QA checkpoint row. It does not change product data or a
scheduler. `status` compares every field that contributes to the visible
Statistics dashboard while excluding technical timestamp/stream metadata.

## Reproduction checkpoints

1. Open **Admin → Statistics** and capture the header timestamp, KPI cards,
   graph summary/timeline, Daily usage, segments, event types, cities, and
   topics.
2. Do not perform any user or admin action.
3. Press the Statistics Refresh button once and capture the same surfaces.
4. Compare exact values. The snapshot timestamp may advance; values must remain
   stable unless a separately observed background job legitimately completed.

## Pass criteria and cleanup

- Every required panel renders without an error/blank-state regression.
- With no causal action, all exact values remain stable; the snapshot timestamp
  may advance.
- No test data is created, so no database cleanup is required. Close the
  Statistics view after saving both screenshots and the value comparison.

## Historical evidence

- 06:05 initial and 06:06 refresh screenshots rendered all required panels.
- The visible values stayed stable and only the header timestamp advanced.
- A later API sample contained one independently restored user and was excluded
  from this no-action oracle.
- Mixed Hungarian/English labels were recorded as a nonblocking i18n issue.

## Reusable prompt

```text
Run BASE-STAT manually. First explain that we are testing no-action refresh
stability. Record the full Statistics state, make no product action, refresh
once, and compare exact values. Treat only independently proven background-job
changes as legitimate; do not call every change a pass. Preserve screenshots
and append a dated result without replacing the 2026-08-04 evidence.
```

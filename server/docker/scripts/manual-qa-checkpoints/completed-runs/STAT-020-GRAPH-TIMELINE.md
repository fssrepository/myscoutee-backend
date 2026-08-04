# STAT-020 — graph timeline historical immutability

Status: defect fixed; hot-deploy runtime + manual Statistics UI `PASS` on
2026-08-04. Direct Affinity Graph comparison remains pending. Historical
reconstruction, not rerun.

## Why and what

Prove that a graph recompute may replace today's graph point, but refreshing the
Statistics projection must never rewrite prior dates.

## Preconditions and isolation

- Export/read all 14 persisted graph points before the trigger and record the
  selected historical UI point.
- Use one controlled action known to queue a real affinity recompute, or arm the
  persisted real recompute schedule only after all baseline windows are open.
- Keep the Statistics and Affinity Graph views in isolated tabs/sessions; do not
  replace the scheduler with a hidden recompute endpoint.

## Reproduction helper

From `server/docker/scripts/manual-qa-checkpoints`:

```bash
bash manual-qa-checkpoints.sh stage stat-020
# open Statistics and affinity-recompute Admin Job; capture/export baseline
bash manual-qa-checkpoints.sh schedule stat-020 30
# wait for automatic processing, press Statistics Refresh, reselect history
bash manual-qa-checkpoints.sh status stat-020
bash manual-qa-checkpoints.sh reset stat-020
```

`stage` stores all historical points, stages one exact event recompute task but
holds it in 2099, and moves the persisted Admin Job occurrence one hour away.
Only after the observation windows are ready does `schedule` give both a short
future eligibility timestamp. `status` reports task-worker and Admin Job
evidence separately, because the application also has a normal affinity worker
wake-up path and trigger attribution must be proved rather than assumed.

## Reproduction checkpoints

1. Capture the full 14-day graph timeline and current graph summary before a
   controlled edge-affecting action/recompute.
2. Complete the real recompute and refresh Statistics.
3. Compare every historical point exactly; only today's point may reflect the
   new graph.
4. Select a historical point in the browser, refresh again, reselect it, and
   verify all visible series are unchanged.
5. Separately compare current graph totals/edges with the interactive Affinity
   Graph explorer. This final comparison was not completed in the historical
   run.

## Pass criteria and cleanup

- Every pre-today point is byte-for-byte unchanged after recompute and refresh;
  today's point may be replaced with the newly computed state.
- The historical UI point still exposes the same series values after Refresh.
- Restore any temporarily shortened persisted schedule after capture. Preserve
  the before/after exports and any failed evidence; do not rewrite corrupted
  history to make the test pass.

## Historical defect and fix evidence

- The first refresh incorrectly rewrote every Jul 22–Aug 3 point from two
  bridge users/two communities/7% cluster quality to zero/one/3%.
- The fix merges newly calculated graph values into today and preserves stored
  prior dates.
- Runtime snapshots at 04:51:23 and 04:58:42 proved today's active edges
  `309→313` and recurring edges `274→278`, while all 13 prior points remained
  byte-for-byte unchanged.
- The 07:05 browser screenshot reselected Jul 22 after another real Refresh and
  retained Active edges `16`, New edges `0`, Recurring `13`, Weak ties `16`,
  Network quality `67%`, and Cluster quality `3%`.
- The original failure remains part of the evidence; the already-corrupted demo
  history was not presented as reconstructed truth.

## Reusable prompt

```text
Run STAT-020 to prove graph-history immutability. First explain that today's
point may change but all earlier dates are immutable. Capture all 14 API points
and a selected historical UI point, perform one controlled real recompute,
refresh, and compare every date. Retain any failed historical evidence. Then
compare current totals and edges with Affinity Graph as a separate oracle.
Append a dated run without replacing the 2026-08-04 defect/fix record.
```

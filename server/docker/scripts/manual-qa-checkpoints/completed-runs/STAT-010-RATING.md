# STAT-010 — staged rating, frontend batch, bell, and Statistics

Status: Statistics/bell/manual functional `PASS` on 2026-08-04; Monitoring and
dedicated Graph comparison remain partial. Historical reconstruction, not
rerun.

## Why and what

Prove the whole controlled rating path: selecting a value only stages it,
**Save** queues it once, the frontend sends its periodic batch, the backend
persists one rating and one target notification, and Statistics materializes
the exact rating delta.

## Preconditions and isolation

- Use separate signed-in source and target browser/Gmail sessions.
- Choose a visible source→target rating card with no pending local rating for
  this pair, and record their IDs/names plus a unique run timestamp.
- Open the target notification center and Statistics before saving. Capture
  database/API counts only as read-only oracles; do not call a rating endpoint.

## Reproduction helper

From `server/docker/scripts/manual-qa-checkpoints`:

```bash
bash manual-qa-checkpoints.sh stage stat-010
# perform selection/Save and wait for the real frontend batch
bash manual-qa-checkpoints.sh status stat-010
bash manual-qa-checkpoints.sh reset stat-010
```

The default controlled pair is Casey Bridge → Nova Social. `stage` snapshots
and isolates only that pair's rating, logical bell/outbox, related affinity
rows/tasks, and unread projection. It does not submit a rating. There is no
backend scheduler override here: Save must reach the normal frontend outbox
batch and the existing Statistics/Monitoring workers.

## Reproduction checkpoints

1. Establish an isolated rating baseline and record Statistics Ratings and
   Matching/Rating activity plus the target/source bell counters.
2. Open the target card's rating editor. Select `4`; verify that selection alone
   does not submit anything.
3. Press **Save** exactly once. The card remains under **Met** and displays `4`.
4. Wait for the frontend's normal 30-second, maximum-50-item rating outbox
   batch. Do not call a backend rating hook.
5. Verify exactly one stored rating, one outbox row, one unread target bell, no
   source bell, and matching unread projection.
6. Open the target user's notification center in an isolated browser session.
7. After the normal Statistics worker, refresh Statistics and compare exact
   deltas.

## Pass criteria and cleanup

- Selection alone creates no persisted rating/notification; Save plus the real
  frontend batch creates exactly one of each.
- The source has no self-notification, the target has exactly one matching bell,
  and Statistics Ratings plus Matching/Rating activity each rise by one.
- Record unrelated scheduled deltas separately. If a disposable test pair was
  staged, restore only that pair's selected documents after evidence capture;
  never rewind legitimate telemetry/run history.

## Historical evidence

- Casey Bridge rated Nova Social `4` and pressed Save once.
- The Met card remained and displayed `4`.
- API/fixture oracles proved one stored rating, one outbox row, one unread Nova
  bell, no Casey bell, and a matching projection.
- Nova's 06:31 notification screenshot showed exactly one **New rating** item
  from Casey.
- Statistics at 06:37/06:38 showed today's Ratings `0→1` and Matching/Rating
  activity `342→343`; Events/assets `1495`, Communication `426`, and Moderation
  `14` stayed stable.
- English notification copy on a Hungarian page was recorded as i18n debt.

## Reusable prompt

```text
Run STAT-010 as a controlled manual rating test. Explain each checkpoint first.
Use isolated source and target sessions. Prove selection is local, Save queues
once, and the real 30-second frontend batch performs delivery. Capture exact
database/API, target bell, and Statistics before/after oracles. Never attribute
unrelated scheduled changes to the rating. Preserve the 2026-08-04 evidence and
append the new dated run.
```

# STAT-012 — completed auto-inviter manual run, 2026-08-04

Status: `MANUAL UI + FUNCTIONAL PASS / CLEANUP VERIFIED`.

## Why and what

Prove that the already-running `event-auto-inviter` scheduler creates exactly
one Casey Bridge → Nova Social event invitation and that Admin Job, Monitoring,
Statistics, domain artifacts, and Nova's bell agree.

## Controlled state

- Event: `Manual QA STAT-012 scheduled invite`
- Creator: Casey Bridge (`650000000000000000000061`)
- Expected invitee: Nova Social (`650000000000000000000062`)
- Stage timestamp: `2026-08-04T05:48:17.055Z`
- Baseline hold refreshed at `2026-08-04T06:42:38.561Z`; the job remains
  ineligible until `2026-08-04T07:42:38.561Z` unless `schedule stat-012` is
  deliberately issued first.
- Baseline oracle: zero invite membership, marker, logical outbox, and bell.
- The one-hour timing and pending count `1` are manual stage values. The Job
  detail's apparent `4 Aug, 7:48` last-run timestamp is therefore a synthetic
  scheduling anchor, not a scheduler execution; the run-history table still
  shows the real latest completed run at `4 Aug, 6:36`.
- The hold refresh moved that synthetic anchor after the captured screenshot;
  it did not add run history or create any scheduler/domain artifact. The
  scheduled checkpoint will capture the current anchor before the real run.

## Baseline screenshots

- `Screenshot from 2026-08-04 08-21-10.png`: **Fill available places** Job
  detail, held at every hour, pending/affected `1`, progress `0%`, Run disabled.
- `Screenshot from 2026-08-04 08-21-16.png`: Monitoring All; Events and Event
  members visible. The existing live recompute pending count is `1` and must
  not be attributed to the invitation.
- `Screenshot from 2026-08-04 08-21-21.png`: Statistics graph/Daily usage
  rendered, but selected points are Jul 22 and Aug 1; today's Aug 4 event
  activity and the Events & assets segment still need a pre-run screenshot.
- `Screenshot from 2026-08-04 08-21-25.png`: Nova notification center shows
  zero new notifications and an empty list.
- `Screenshot from 2026-08-04 08-46-04.png`: refreshed Monitoring baseline.
  Events show writes/model `59`, recompute pending `0`, and outbox `228`.
  Event members show member changes `1359`, capacity gate/invites `1322`, and
  outbox `228`. These are pre-scheduler counters.
- `Screenshot from 2026-08-04 08-46-16.png`: Statistics Daily usage correctly
  selects `Aug 4`: Active `16`, New `0`, Ratings `1`, Events/assets `1322`,
  Messages `1`, and Moderation `0`. The same screenshot records today's graph
  readout: Active edges `313`, New edges `19`, Recurring `278`, Weak ties `312`,
  Network quality `77%`, and Cluster quality `3%`.
- `Screenshot from 2026-08-04 08-48-04.png`: Statistics Events & assets
  baseline completes the pre-scheduler set: section total `1502`, Active events
  `69`, Total events `79`, Active assets `12`, Total assets `39`, Event
  participation `1370`, and Borrow requests `14`. Communication remains `427`
  with Messages `418`; Trust & moderation remains `14`.

The required pre-scheduler Statistics and Monitoring UI baseline is complete.

## Scheduler arming

- Schedule command issued at `2026-08-04T06:48:47.125Z` with a 30-second
  eligibility delay.
- Persisted due time: `2026-08-04T06:49:17.125Z`.
- Expected real scheduler pickup window: `2026-08-04T06:49:17.125Z` through
  approximately `2026-08-04T06:50:17.125Z`.
- No Run button or direct job endpoint was used.
- `image-1.png` (`2026-08-04`, captured after the scheduler window): Admin Job
  shows a real completed run at `4 Aug, 8:49`, processed count `1`, pending
  count `0`, duration `131 ms`, progress `100%`, and a new completed history
  row. The earlier real rows at `6:36` and `4:36` remain visible.

## First post-run machine checkpoint

The first helper status after the Admin Job completed proved exactly one Nova
Social invitation, one scheduler marker, and one logical notification outbox
item. `lastRunCount` is `1` and `pendingCount` is `0`. It incorrectly reported
bell `0`: direct read-only inspection proved the exact Nova bell already
existed with the same timestamp and occurrence ID. The bell stores its type as
`payload.type = event-invite`, while the helper required a top-level
`notificationType`. The manual oracle was widened to accept both valid shapes;
this was a QA-helper defect, not a product or worker delay.

The corrected read-only status reports `phase: scheduler-completed` and an
exact outcome: invitation `1`, marker `1`, outbox `1`, bell `1`; all four
recipient sets contain only Nova Social (`650000000000000000000062`). The real
job reports `lastRunCount: 1`, `pendingCount: 0`, and completed at
`2026-08-04T06:49:26.101983080Z`.

- `Screenshot from 2026-08-04 08-53-05.png`: Nova Social's notification UI
  shows exactly one new item, title `Manual QA STAT-012 scheduled invite`,
  sender `Casey Bridge`, type `Event`, timestamp `4 Aug, 8:49`, and body
  `You were invited to Manual QA STAT-012 scheduled invite.` This matches the
  machine oracle and is a manual user-facing notification PASS.
- `Screenshot from 2026-08-04 08-54-20.png`: post-run Monitoring proves the
  exact operational delta. Events writes/model remain `59`; Events outbox rises
  `228 -> 229`; membership writes rise `1359 -> 1360`; capacity gate/invites
  rise `1322 -> 1323`; invite delivery and Event-members outbox rise
  `228 -> 229`; recompute remains `0`. The Assets flow also displays the shared
  outbox value `229`, but its writes/model remain `14` and recompute remains
  `0`; this is the shared notification endpoint, not an asset-domain change.
  Monitoring manual causal checkpoint: PASS.
- `Screenshot from 2026-08-04 08-55-37.png`: refreshed Statistics snapshot at
  `4 Aug, 8:55` selects `Aug 4`. Daily Events/assets rises `1322 -> 1323` while
  Active `16`, New `0`, Ratings `1`, Messages `1`, and Moderation `0` remain
  unchanged. Active/New/Recurring graph edges remain `313/19/278`; Weak ties
  rises `312 -> 313`, consistent with the new pending event-member relation.
- `Screenshot from 2026-08-04 08-55-29.png`: Events & assets rises
  `1502 -> 1503` and Event participation rises `1370 -> 1371`; Active events
  remains `69`, Total events remains `79`, Active/Total assets remain `12/39`,
  and Borrow requests remains `14`. Communication stays `427` with Messages
  `418`; Trust & moderation remains `14`. Statistics manual causal checkpoint:
  PASS.

All required pre/post UI and independent machine oracles now agree.

## Cleanup

The guarded `reset stat-012` completed and the subsequent read-only status
reported `phase: not-staged`, `prepared: false`. It restored the controlled
event data, isolated affinity edges, Statistics inventory fields, quarantined
rows, primary rule configuration, and secondary pending counters. Legitimate
scheduler telemetry/history was retained. The restored original auto-inviter
rule uses a two-hour interval, has its original pending count `38`, and was
already eligible at cleanup time; any later normal dev-scheduler work is
post-test activity and must not be attributed to STAT-012.

## Separate UX observation

`UI-POLL-JANK-001` / Job checkpoint: the human observer reports that pointer movement
stutters while the Admin Job detail popup is open. A still image cannot prove
frame pacing or identify the cause. Record as `MANUAL OBSERVED / NOT YET
REPRODUCED WITH TRACE`. A future
targeted run should use a short screen recording plus browser Performance trace
and compare pointer movement with the popup closed. This observation does not
invalidate the scheduler baseline.

Code inspection makes the periodic-refresh hypothesis strong, but does not yet
replace the browser trace:

- `PROCESS_LIST_POLL_INTERVAL_MS` is `5000` in the Admin Job popup.
- While the admin process center is open, the poll reloads the whole notification
  center and `mergeRuntimeState()` replaces the shared `state` signal.
- The configured `detailOpen()` scheduler state does not gate execution because
  `pollProcessList()` ignores the task context's `state`; polling therefore also
  runs when only the process list is open.
- With the detail popup open, both the underlying process list and the detail
  subtree consume the replaced state. The component does not declare
  `ChangeDetectionStrategy.OnPush`, so applying the async result can create a
  main-thread rendering/change-detection hitch.
- `UiTaskScheduler` prevents overlapping poll executions with `inFlight`; this is
  not evidence of parallel request accumulation. Live job events can still cause
  additional state replacements between polls.

Chat checkpoint: the human observer also reports similar stutter in Chat. Treat
this as `REPORTED / TRACE PENDING`, not as proof of the same root cause. Chat
uses `ChangeDetectionStrategy.OnPush` and receives live thread changes through
a WebSocket, while the global user realtime scheduler long-polls every 30
seconds (10 seconds in demo mode). The later trace must therefore distinguish
Job's 5-second full-state poll from Chat WebSocket events, global realtime
long-poll completion, Smart List updates, and ordinary graphics/layout cost.

Working classification: `OPEN — JOB MANUAL OBSERVED / CODE PATH CORROBORATED;
CHAT REPORTED / ROOT CAUSE UNCONFIRMED; PERFORMANCE TRACE PENDING`. Cross-surface
manual QA priority: `P1 65` (`I2 L3 A5 N4 O2`). Keep both checkpoints under the
single stable issue ID `UI-POLL-JANK-001` and do not close the issue after fixing
only one surface.

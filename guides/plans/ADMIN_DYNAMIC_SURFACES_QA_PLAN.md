# Admin dynamic surfaces manual QA plan

Status: living manual execution plan and evidence index  
Last updated: 2026-08-04  
Companion tracker: [`ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx`](ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx)  
Reviewable spreadsheet source: [`ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv`](ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv)
Priority model: [`MANUAL_QA_PRIORITY_MODEL.md`](MANUAL_QA_PRIORITY_MODEL.md)

## Purpose and scope

This plan explains what an administrator should see on the dynamic admin
surfaces and how to prove that an input caused the displayed result. It covers:

- **Statistics**, including its network-health graph summary;
- **Monitoring / Metrics**;
- the separate interactive **Affinity Graph** explorer;
- **Parameters**, including every section outside Jobs;
- all nine **Admin Jobs**, their domain effects, and their cross-surface effects;
- the rating/feedback notification flow already exercised with the job fixtures;
- a small smoke boundary for otherwise static input screens.

The Markdown document is the test contract. The XLSX file is the execution
ledger. Update the spreadsheet after every manual run; update the historical
summary in this document when a whole test pack changes status.

This is the first pack of the wider manual QA ledger, not a closed Admin Jobs
document. Future manual testing of authentication, profiles, activities,
assets, chat, notifications, moderation, operator functions, installation or
other product areas must be appended to the same ledger (or linked from it when
the evidence is too large), using the extension rules below.

## Extending the ledger with future manual tests

- Assign a stable area prefix and ID, for example `AUTH-`, `PROFILE-`,
  `EVENT-`, `ASSET-`, `CHAT-`, `OPERATOR-` or `INSTALL-`.
- Add one spreadsheet row per independently passable behavior. Do not combine
  several failures behind one broad feature row.
- Use `X` in every cross-surface cell where no effect is expected; use `DELTA`,
  `INDIRECT` or `GAP` only as defined in this plan.
- Record preconditions, action, exact oracle, cleanup, environment/date,
  result and evidence. Link a separate detailed pack when steps would make the
  spreadsheet cell unreadable.
- Preserve historical results. A retest adds new evidence and a new last-run
  date; it does not erase the fact that an older build was partial or failed.
- Keep manual and automated status separate. Adding an automated test does not
  convert an unexecuted manual row into a manual pass.
- Recalculate the `Manual QA priority` field with the separate priority model
  when automation or risk changes. Never delete a row merely because its score
  becomes lower.
- Add discovered defects as their own retest rows or issue links, then close
  them only with evidence from the affected assembled environment.

The workbook can gain area-specific sheets later, but its first/master sheet
must remain an index of every manual pack and its current status so the next
session can resume without reconstructing prior conversations.

## Domain lifecycle and downstream chains

The wider ledger is grouped by producer domain as well as by observed admin
surface. An Event Editor save is therefore not classified as a static form
test: it produces canonical event state, telemetry, recompute work and, when
configured, input for invitation, tournament, reminder and notification
consumers. Likewise, an invitation is not complete when a bell appears; Event
Members, recipient Activities, acceptance state, chat authorization and every
linked asset/group projection have separate checkpoints.

The detailed checkpoint graph and independently passable cases are maintained
in [`DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md`](DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md).
It covers Event Editor producers, lifecycle bucket mutations, manual and
scheduled invitation origins, pre/post-acceptance chat access, feedback into
Impressions, ticket issue/check-in, tournament group membership, asset
membership versus event-resource assignment, and the operator
Firebase-to-login-mode transition.

A continuous campaign may carry a manually created event forward and record a
shared lineage ID. This reduces duplicate human setup while preserving causal
evidence. It does not make later cases dependent on the earlier run: every
consumer case must still have a manual-only fixture capable of staging its
documented prerequisite for another QA operator.

## Manual scheduler checkpoints

Scheduler-focused manual tests must separate direct setup from scheduler-created
results. Use the dedicated
[`manual-qa-checkpoints`](../../server/docker/scripts/manual-qa-checkpoints/README.md)
harness; do not alter the automated `admin-job-fixtures` suite to create human
observation pauses.

For a reproducible fast run, stage the controlled data first while the persisted
job schedule is held safely in the future. Open Monitoring, Statistics, Admin
Job detail, and the target notification view before scheduling. Keep them in
three separate Gmail/browser sessions so active-user state and cookies do not
mix. Capture every post-stage baseline, then persist a short scheduler delay
(normally 30 seconds) and wait for the already-running scheduler's normal
60-second poll. The expected run window is therefore roughly 30–90 seconds,
not a fixed three-minute wait. No Run button, hidden hook, direct job endpoint,
or second application process may replace this path.

The manual harness includes the original Hungarian requests and a reusable
operator prompt in
[`PROMPT.md`](../../server/docker/scripts/manual-qa-checkpoints/PROMPT.md).
Every comparison must use the post-stage baseline; direct setup effects must
never be attributed to the scheduler.

For `STAT-012`, staging prints the exact deterministic `expectedInvitee` before
the schedule is armed. The harness temporarily isolates one seeded affinity
edge and materializes the test event in only the Statistics event-inventory
baseline; reset restores those selected fields and edges. This lets session C
open the correct notification center in advance and keeps Active/All event
inventory changes out of the later scheduler-only delta.

The completed 2026-08-04 Statistics workflows also have retrospective,
non-rerun reproduction guides in
[`completed-runs`](../../server/docker/scripts/manual-qa-checkpoints/completed-runs/README.md):
BASE-STAT, STAT-010 rating/batch/bell, STAT-011 ordinary chat, and STAT-020
graph-history immutability. These documents preserve the old checkpoints and
prompts; their creation is not a new manual execution and does not change the
matrix dates or results.

Those four historical workflows now also have callable helpers through
`manual-qa-checkpoints.sh`: `stage/status/reset` for all four, plus
`schedule stat-020` for the affinity scheduler checkpoint. `STAT-010` keeps the
real frontend rating batch and `STAT-011` keeps immediate chat persistence plus
the normal projection workers; neither receives an artificial scheduler hook.
The helper files were statically validated only when added. Historical manual
PASS/PARTIAL statuses remain dated 2026-08-04 and were not rerun.

## Three different meanings of “graph”

These must not be treated as the same feature:

1. **Statistics graph summary** is a persisted network-science projection. It
   shows health, edge/community/bridge metrics, quality signals, ranked bridge
   users and communities, and an evolution timeline.
2. **Affinity Graph** is an interactive explorer over users and affinity edges.
   It shows components/forests, isolated users, neighborhoods, link weights and
   lazy-loaded graph tiles.
3. **`event-random-groups`** is an Admin Job that creates matched event rooms,
   memberships, chats and system messages. A successful random-room run does
   not by itself qualify either graph surface.

## Evidence and status vocabulary

| Status | Meaning |
| --- | --- |
| `MANUAL UI PASS` | A person operated and observed the intended browser flow. |
| `MANUAL FUNCTIONAL PASS` | A person initiated the live-stack scenario and its domain/database/API oracle was checked; every browser presentation detail was not necessarily observed. |
| `PARTIAL` | Some required oracles passed, but at least one named UI or causal oracle remains. |
| `NOT RUN` | No durable evidence of a manual execution was found. |
| `AUTO COVERAGE` | A deterministic unit/controller/E2E test exists. This is supporting evidence, not a manual pass. |
| `GAP` | Code inspection shows that the intended observable is not wired consistently; execute the test to confirm and then triage rather than silently passing it. |
| `X` | No direct effect is expected on that surface. An unchanged value is the pass condition. |

An unchanged surface is not a failure when the matrix contains `X`. Conversely,
a changed value is not automatically a pass: the direction and count must match
the test oracle.

## Historical execution baseline

The baseline below was reconstructed from the archived Codex sessions and the
fixture status/oracle output. It intentionally distinguishes a live manual run
from a human-visible UI confirmation.

| Area | Last evidence | Status | What was proved | What remains |
| --- | --- | --- | --- | --- |
| All nine Admin Jobs | 2026-07-29 | `MANUAL FUNCTIONAL PASS` | Each job was made due in `demo_db`, picked up by the real running scheduler, and its primary domain oracle passed. | Cross-surface Statistics/Monitoring/Affinity Graph effects were not qualified. Most job detail pages were not separately visually signed off. |
| `event-random-groups` variations | 2026-07-29 | `MANUAL FUNCTIONAL PASS` | Balanced, anchored, room-count, leftover, partial, large, disconnected and idempotence fixture oracles passed. | Dedicated Affinity Graph and Statistics graph remain separate tests. |
| `event-random-groups` visible outcome | 2026-07-31 | `MANUAL FUNCTIONAL PASS`, UI `PARTIAL` | Two source events produced two shared rooms/chats and two real system messages; all 6/6 public users were assigned; all three chat counters rose by one. | Record screenshots of room, chat and counter presentation in one future execution. The later system-message text/icon edit was stylistic, not a functional retest blocker. |
| `event-auto-inviter` notification | 2026-08-04 | `MANUAL UI + FUNCTIONAL PASS` | A controlled 30-second eligibility window was picked up by the real scheduler at 08:49 without a Run button. It processed exactly one Nova invitation in 131 ms; invitation, marker, logical outbox and bell recipient sets matched. Job Detail, Nova notification, Monitoring and Statistics screenshots all showed the exact once-only result. | Retain as a release-change sample; execute the separate `UI-POLL-JANK-001` performance retest later. |
| Notification read path and rating/feedback | 2026-08-04 | `MANUAL FUNCTIONAL PASS`; rating bell `MANUAL UI PASS`; read/feedback UI `PARTIAL` | Historical read/rating/feedback API/database oracles passed. In the current controlled rating run, Nova's notification center showed exactly one unread **New rating** item from Casey after the frontend batch. | Click/read the controlled rating item and confirm its counter transition; repeat event-feedback notification presentation visually. |
| Statistics baseline / causal behavior | 2026-08-04 | `STAT-001`, `STAT-010`, `STAT-011`, `STAT-012` `MANUAL UI + FUNCTIONAL PASS`; `STAT-020` defect fixed, runtime + Statistics UI `PASS` | Baseline refresh stayed stable. Rating, ordinary chat and one real scheduled event invitation produced their exact once-only deltas. STAT-012 changed Daily Events/assets 1322→1323, section total 1502→1503 and Event participation 1370→1371 while event inventory stayed 69/79. The rating-induced graph refresh defect was fixed and all 13 past points remained immutable. | Continue with `STAT-013` onward and complete the Affinity Graph comparisons. |
| Monitoring / Metrics causal behavior | 2026-08-04 | `AUTOMATED CONTRACT PASS`; STAT-012 manual causal checkpoint `PASS`; full pack `PARTIAL` | Service tests prove eight unique flows and exact config/start/terminal projection. STAT-012 manually proved membership writes 1359→1360, capacity/invites 1322→1323 and shared outbox 228→229 while event writes/model stayed 59 and recompute stayed zero. | Complete live queue/failure-recovery states and one fixture-backed run for the remaining jobs. |
| Interactive Affinity Graph | — | `NOT RUN` | Controller/service tests cover full/meta/forest/tile/neighborhood/rebuild contracts. | Run visual interaction, lazy-loading and causal edge-change tests. |
| Parameters UI | — | `NOT RUN` | Service tests cover versioning and exact-once save/revert telemetry; an HTTP E2E test proves notification threshold save, recompute enqueue, delivery-strategy change, history and revert. | Manually test UI save/reopen/history/revert and one causal scenario per parameter section. |
| Other static input screens | — | `NOT RUN / not recorded` | Existing automated/UI work is not a durable manual execution record. | Use the compact static-form smoke pack only; these screens are not the focus of this dynamic plan. |

Archived evidence sources:

- `rollout-2026-07-29T07-04-45-019fac42-c6fe-7971-9435-e6c731bdbd45.jsonl`
- `rollout-2026-07-31T05-12-00-019fb628-46ea-7a41-a28b-9dab563da772.jsonl`
- [`server/docker/scripts/admin-job-fixtures/README.md`](../../server/docker/scripts/admin-job-fixtures/README.md)

### Current continuation state

A read-only `demo_db` audit on 2026-08-04 found all nine rules enabled and no
rule running. The random-room fixture's source events and generated fixture
rooms were absent, but a stale `admin-job-fixture:v1:event-random-groups`
snapshot from the 2026-07-31 `balanced` preparation remained. Before
`STAT-001`, the snapshot and its exact documents were restored with the
toolkit's guarded `reset`; no direct database deletion was used. The Statistics
worker materialized the restored user later, which explains a separate API
sample's community/tried-user `+1` and is not counted as a no-action refresh
delta. Treat the prior random-room functional result and its cleanup as
complete.

## How the dynamic surfaces update

### Statistics

Statistics is not a live query over every Mongo collection. The page loads a
persisted `adminStats` snapshot. Application actions write telemetry to the
`admin:telemetry` Redis stream; the statistics telemetry worker normally drains
that stream on a roughly 60-second window, updates the snapshot and refreshes
network science. The page refresh action only reloads the persisted snapshot;
it does not force the worker to drain telemetry.

For a causal manual test:

1. record `generatedAt`, the target value and today's timeline point;
2. perform exactly one controlled action;
3. allow up to 75 seconds for the telemetry worker;
4. use the page refresh action;
5. compare the exact target value and confirm unrelated series did not move.

The page should contain:

- an overall 0–100 health score, label and summary;
- primary KPIs for profiles/users/events/assets and moderation pressure;
- a 14-day activity timeline for active users, registrations, ratings,
  event+asset activity, chat messages and moderation;
- Community, Matching, Activities, Communication and Moderation segments;
- event-type distribution, top cities and top topics;
- attention items;
- the network graph summary: health, edges, average degree, communities,
  bridges, network/cluster quality, reach/weak-tie/bridge/recurrence signals,
  bridge and community rankings, and a graph timeline.

### Monitoring / Metrics

Monitoring combines accumulated telemetry with refreshed live queue counts. It
shows eight flows: Users, Events, Members, Assets, Matching, Chat,
Notifications and Jobs. Each flow has nodes, directed edges, counts and an
`ok`, `watch` or `alert` state.

The filters must show:

- **All**: every category;
- **Watch**: only non-OK categories;
- **Domains**: Users, Events, Members, Assets and Chat;
- **Delivery**: Notifications;
- **Workers**: Matching and Jobs.

Pending recompute or notification work should normally produce `watch`; failed
queue work should produce `alert`; after successful processing the live queue
counts should return to zero. Accumulated event totals do not return to zero,
so test deltas rather than assuming a clean database.

### Interactive Affinity Graph

On open, the explorer should show an overview with Members, Links, Components
and Isolated totals. It must support:

- forest/component selection and lazy component loading;
- member selection, profile/strongest-connection detail and link depth 1–3;
- minimum/maximum link-weight filtering;
- mouse pan/rotate/zoom and arrow-key pan;
- semantic zoom/tile loading without duplicate or disappearing nodes;
- reset back to the overview;
- stable totals and a consistent selected-member neighborhood.

Women and men use the documented legend colors. A profile without an edge
remains represented in the overview as isolated. The graph can use a
materialized layout or a live fallback; `source` and `layoutVersion` determine
which was returned. A parameter or rating change is qualified only after the
affinity recompute queue finishes and the graph is reopened/reloaded.

### Parameters

There are seven independently editable sections: Matching, Profile, Events,
Assets, Discovery, Notifications and Jobs. Every successful save must:

- persist the exact edited value and display it after close/reopen;
- create a new active configuration version;
- retain previous versions in descending history order;
- record changed date, actor, section and summary;
- enqueue a `CONFIG_CHANGED` affinity recompute task;
- enqueue the administrator parameter-change notification;
- allow a history switch/revert, which creates another new active version
  containing the selected section's older values.

Revert is version creation, not destructive deletion. After each parameter
test, revert to the recorded starting values and wait for the revert's recompute
task to finish.

## Closed observability gaps that still need manual confirmation

Code inspection on 2026-08-04 found two explicit gaps; both now have automated
regression coverage:

1. `NotificationRuleRegistryService` emits `jobs.run.started` only after a
   successful atomic start claim, then emits one normalized
   `jobs.run.completed`, `jobs.run.failed` or `jobs.run.skipped` only after the
   matching terminal update. The event amount is always one; processed count,
   duration and manual/scheduled trigger are tags. The former random-room-only
   calls were removed so that path is not double counted.
2. `AdminParamsService` emits `admin.params.changed` once immediately after a
   new save or revert version is persisted. Invalid/no-op revert paths emit
   nothing. Section, version and save/revert kind are tags.

The Monitoring Jobs projection now counts configuration changes from exact
config event keys, scheduler triggers from `jobs.run.started`, and audit events
from terminal run keys. A failed terminal event makes Jobs alert. Automated
service tests cover successful, failed, zero/no-op and rejected atomic paths.
After hot deploy on 2026-08-04, the real dev scheduler and telemetry worker
persisted four `jobs.run.started` plus four `jobs.run.completed` events for
`affinity-recompute`, `event-checkout-basket-purge`, `event-counter-expiry` and
`notification-outbox`; every corresponding run processed zero rows, proving
that trigger totals count runs rather than affected records.

This closes the code gap, not the manual rows. Keep `MON-013` and `MON-014` in
the execution ledger and record their browser-visible deltas when run. A domain
PASS must still not hide a future Monitoring regression.

Also note that a random-room system message emits `chat.message.system`, while
the Statistics message timeline counts `chat.message.sent`. No Statistics
message delta is expected from that system message under the current contract.

### Automated follow-up for discovered gaps

Finding a manual/observability gap authorizes a deterministic fixture and
automated regression test where the production path can be preserved. This
does not remove or rewrite the corresponding manual ledger row. It only adds
automated evidence and may lower the row's automation-insufficiency component
when the new oracle is demonstrably reliable.

Implemented regression coverage now proves:

- emit and project `admin.params.changed` exactly once for a successful save
  and once for a successful revert, with no event on cancel/rejected save;
- emit a common scheduled-job start/completion/failure trace for all nine jobs,
  including a zero-work completion, without double counting the random-room and
  event-counter paths that already emit selected telemetry;
- prove the Monitoring Jobs counters consume those events once and preserve
  terminal status/failure semantics.

The relevant automated evidence is in `AdminParamsServiceTest`,
`NotificationRuleRegistryServiceTest` and `AdminMonitoringServiceTest`. The
existing `BackendAdminParamsRealtimeE2ETest` supplies disposable HTTP fixture
coverage for version creation, recompute/outbox effects, history and revert.

Prefer service/projection tests with fixed data and an HTTP E2E test in a
disposable database. Add a development fixture only when realistic source data
is otherwise expensive to arrange. Do not add a hidden scheduler bypass or
telemetry force-drain endpoint merely to make a browser test deterministic.

## Test environment and safety

- Use only `demo_db` or a disposable `e2e_db`; never use a trusted or
  production database.
- Keep the normal application and its real scheduler running.
- Prepare one fixture scenario at a time and reset it before starting another.
- Record database identity, backend commit, frontend commit, browser, timezone,
  start/end timestamps and the active parameter versions.
- Capture before/after screenshots plus the fixture `status` output or a small
  API/database oracle. Do not rely on screenshots alone for counts.
- Wait for the Admin Job to become terminal, then wait up to 75 seconds for
  telemetry-derived pages. Queue tests also need their pending → running →
  terminal transition captured before a fast worker consumes the row.
- A zero-work run must update the Job detail but must not invent a domain count.
- Reset every fixture and revert every changed parameter at the end. Confirm no
  fixture remains prepared.

## Why this remains primarily manual

A browser E2E suite should not receive a hidden endpoint or production code
hook that rewrites scheduler periods, bypasses due checks or force-drains
telemetry. Such a hook would test a different execution path and create an
unsafe control surface.

The existing development fixture approach is acceptable for manual QA because
it is excluded from production builds, refuses non-demo/non-e2e databases,
temporarily edits only stored test data/rule timing, and then lets the real
scheduler and workers execute. Automated coverage should remain focused on:

- deterministic service/controller contracts;
- projection calculations with fixed clocks/data;
- parameter save/history/revert and consumer behavior in disposable databases;
- queue state machines and scheduler due calculations;
- production-package checks proving the fixture tooling is absent.

The manual test is what proves the assembled UI, scheduler, Redis telemetry,
Mongo projections and background workers cooperate.

## Statistics manual pack

| ID | Action | Expected Statistics result | Cross-check |
| --- | --- | --- | --- |
| `STAT-001` | Open, record `generatedAt`, refresh without any action. | All sections render; values remain stable; refresh does not fabricate a new snapshot. | No browser errors; response schema complete. |
| `STAT-010` | Stage one controlled non-zero rating, then press **Save** exactly once. Selection alone changes only the editor value; **Save** queues the local outbox. The **Met** card remains and shows the score. | After the frontend batch and Statistics worker run, today's Ratings +1; Matching `rates.synced` rises by the saved row count; active-user data reflects the actor. | Within 35 seconds the frontend's 30-second/max-50 batch persists the rating once; exact target notification created; recompute task created/processed. |
| `STAT-011` | Send one ordinary chat message. | Today's Messages +1; Communication chat count +1. | Message exists once; system messages are excluded from this oracle. |
| `STAT-012` | Invite or join one event member. | Today's event activity and the relevant Activities interaction change by the emitted amount. | Member status and Monitoring Members/Event flows agree. |
| `STAT-013` | Change one asset request. | Today's asset activity and Activities asset-request count change. | Asset request state and Monitoring Assets flow agree. |
| `STAT-014` | Submit one feedback/report or perform one isolated moderation action. | Today's Moderation and the matching Moderation item change; attention/health direction is explainable. | Bell/moderation record exists exactly once. |
| `STAT-020` | Complete an affinity recompute after a controlled edge-affecting input. | Graph summary values correspond to the recomputed edge set; graph timeline's latest point changes only where the data changed. | Compare with Affinity Graph totals and a direct edge oracle. |
| `STAT-021` | Drag/focus both timelines and select graph communities/bridges; open help. | Readouts follow the selected point/item, keyboard focus works, help defines every displayed graph signal. | Reset/reopen selects the latest point without corrupting data. |

Execution note, 2026-08-04: `STAT-001` passed manually. Screenshots at 06:05
and 06:06 show the same visible KPI and section values before and after one
no-action refresh; all dynamic panels rendered without an error or stuck
loading state. The graph-evolution readout briefly showing Aug 1 is the hovered
point, while the latest daily point remains Aug 4. `Simple`, `Board games`,
`Fitness`, `Community 1/2` and `Cluster quality` remain mixed-language labels;
this is recorded as a cosmetic i18n observation and did not fail the functional
baseline.

`STAT-010` progress, 2026-08-04: Casey staged score 4 for Nova and pressed
**Save**. The slider change alone did not submit anything: **Save** enqueued the
rating in the frontend outbox, then the normal 30-second, maximum-50-item batch
sync pushed it to the backend. The UI correctly kept Nova's card under **Met**
and displayed 4; disappearance is not an expected result. After the delayed
sync, the fixture/database/API oracle passed with one stored rating, one target
outbox and unread bell, no actor bell and a matching unread projection. The
normal Statistics worker then materialized Ratings 0→1 and `rates.synced`
342→343. Nova's 06:31 notification-center screenshot passed the bell
presentation oracle: exactly one unread **New
rating** item from Casey, timestamped 06:22. The English notification title and
message on the Hungarian page remain a cosmetic i18n observation. Only the
browser Statistics refresh remained for this row. Screenshots at 06:37 and
06:38 then confirmed today's Ratings 0→1 and Matching / Rating activity
342→343. Events/assets 1495, Communication 426 and Moderation 14 stayed stable.
`STAT-010` is therefore closed as a Statistics and rating/bell functional/UI
PASS; its indirect Monitoring and Graph cells remain in their separate packs.

`STAT-011`, 2026-08-04: Farkas Anna sent the unique ordinary message `QA
STAT-011 ordinary message 2026-08-04 06:48` once in **Host Circle Ops**. The UI
showed one new bubble; the API showed total 41→42 and exactly one matching
non-system row. The normal Statistics worker and 06:53 browser screenshots
confirmed today's Messages 0→1, Communication/Messages 417→418 and
Communication total 426→427. This row passed.

`STAT-020` defect found during the same refresh: the current graph legitimately
changed after the earlier rating/recompute, but the materializer also rewrote
all Jul 22–Aug 3 points from two bridge users/two communities/7% cluster quality
to zero/one/3%. Historical timeline points must remain immutable; only Aug 4
may absorb the new graph state. The original FAIL remains recorded as evidence.
The fix now merges newly calculated values into today only and preserves every
stored prior date; a focused regression unit source covers first materialization,
past-point preservation and today's replacement. The existing dev stack
compiled the changed class one second after the source write. Runtime snapshots
at 04:51:23 and 04:58:42 then proved the contract: today's active edges changed
309→313 and recurring edges 274→278, while all 13 earlier points remained
exactly unchanged. A standalone Gradle test process was intentionally not
started. The post-fix 07:05 browser screenshot, using the 07:03 admin snapshot
after another real Refresh, reselected Jul 22 and retained Active edges 16, New
edges 0, Recurring 13, Weak ties 16, Network quality 67%, and Cluster quality
3%. The manual Statistics UI retest therefore passed; only the direct Affinity
Graph comparison remains.

## Monitoring / Metrics manual pack

| ID | Action | Expected Monitoring result | Cross-check |
| --- | --- | --- | --- |
| `MON-001` | Open all five filters and record their counters. | Categories match the filter contract and counters equal the returned category count. | `Watch` is empty only when every category is OK. |
| `MON-010` | Perform one event member mutation. | Events/Members source, model and downstream flow counts rise consistently. | Statistics event activity and member record agree. |
| `MON-011` | Enqueue one affinity recompute task and let it finish. | Matching queue is observed pending/running, then zero terminal; failed remains zero; health returns from watch to OK. | Admin Job run and changed affinity output agree. |
| `MON-012` | Enqueue one notification and let outbox process it with the configured Firebase mode. | Pending/running/sent or failed counts reflect the real path; failed produces alert; disabled Firebase uses the documented terminal behavior. | Outbox row and recipient/bell result agree. |
| `MON-013` | Run each Admin Job with a non-empty fixture. | Jobs scheduler/audit trace should change once per real run, in addition to any domain flow. | The common lifecycle contract is automatically covered; still capture the browser delta and the independent domain oracle. |
| `MON-014` | Save and then revert one parameter section. | Jobs config change once per new version, Matching recompute queue and Notifications outbox show the expected transitions. | Exact-once save/revert telemetry is automatically covered; still verify the assembled UI and worker window. |
| `MON-015` | Exercise one controlled failed queue item, then recover it. | `watch`/`alert` filter contains the category while failed; recovery clears live failure state without decrementing accumulated history. | Failure and recovery evidence retained. |

## Affinity Graph manual pack

| ID | Action | Expected result |
| --- | --- | --- |
| `GRAPH-001` | Open the graph on a known fixture. | Overview totals match members, edges, components and isolated-user oracle; no blank canvas or duplicate badges. |
| `GRAPH-002` | Select a forest/component. | Loading indicator is bounded; selected component expands; component totals and members are consistent. |
| `GRAPH-003` | Select a member and change link depth 1 → 2 → 3. | Member panel and strongest connections match; each depth is a superset within budget; returning does not duplicate nodes/edges. |
| `GRAPH-004` | Change min/max link weight. | Only edges inside the range remain; overview keeps isolated members; visible/total labels remain meaningful. |
| `GRAPH-005` | Pan, rotate, wheel/pinch zoom, arrow-pan and reset. | Controls work, progress follows zoom/loading, panel does not clip, reset returns to overview. |
| `GRAPH-006` | Create/change one controlled affinity edge, run recompute, reopen. | Expected edge weight/neighborhood/component changes; unrelated fixture edge remains stable. Statistics graph summary is directionally consistent after its refresh window. |
| `GRAPH-007` | Use a large/disconnected graph fixture. | Forest paging, semantic tiles and neighborhoods load within their budgets; disconnected users remain visible; no unbounded request loop. |

## Parameters manual pack

Run `PARAM-001` for every section. Run one causal representative from
`PARAM-010`–`PARAM-016`; do not attempt to prove a weighting parameter with a
save/reopen-only check.

| ID | Section | Representative change | Required consumer oracle |
| --- | --- | --- | --- |
| `PARAM-001` | Every section | Change one safe value, save, close/reopen, inspect history, revert to the starting version. | Exact persistence, new version, actor/date/summary, recompute task, admin notification and non-destructive revert. |
| `PARAM-010` | Matching | Change one rating/evidence multiplier with a fixture pair where only that signal differs. | Recomputed user affinity/edge changes by the predicted direction; Affinity Graph and Statistics graph agree after refresh. |
| `PARAM-011` | Profile | Change one profile/trait field rule or absolute-user multiplier for two controlled profiles. | User absolute/affinity ordering changes only for the matching fixture; graph change is explainable. |
| `PARAM-012` | Events | Change one event content or boost multiplier with two otherwise controlled events. | Event recommendation/rank order or score changes in the predicted direction; Affinity Graph is `X`. |
| `PARAM-013` | Assets | Change one asset content/owner/capacity/quantity/request/freshness boost. | Asset recommendation/rank order or score changes in the predicted direction; Affinity Graph is `X`. |
| `PARAM-014` | Discovery | Change distance multiplier/max distance/strategy for profiles on opposite sides of the threshold. | Discovery/affinity score and edge visibility change as predicted; boundary at max distance is checked. |
| `PARAM-015` | Notifications | Change multicast threshold using a known recipient count, then revert. | Delivery strategy changes direct ↔ multicast; history/revert restores it. Existing HTTP E2E is supporting evidence. |
| `PARAM-016` | Jobs | Change one debounce/batch/lease value in an isolated environment; process cadence only through the documented dev fixture. | Stored value and affected worker behavior match; no hidden scheduler hook; restore before leaving. |
| `PARAM-017` | Validation | Try below-minimum, above-maximum, invalid text strategy and cancel-without-save. | Invalid values are rejected or normalized per server contract; no version/task/notification on cancel or failed save. |

Parameter field groups:

- **Matching:** rating modes, evidence modes, met evidence and owner context.
- **Profile:** profile/experience/trait rules and absolute user/impression signals.
- **Events:** content/participant affinity plus rating, membership, capacity,
  freshness and host-confidence boosts.
- **Assets:** content/owner affinity plus capacity, quantity, request, freshness
  and owner-confidence boosts.
- **Discovery:** distance multiplier, maximum metres and strategy.
- **Notifications:** Firebase window, workers, retries/backoff, collapse window,
  multicast threshold and topic threshold.
- **Jobs:** change debounces, worker poll/batch/lease, process poll/cadence/window,
  plus the read-only tournament/auto-inviter policy descriptions.

## Admin Job cross-surface impact

`Δ` is a required direct effect, `→` is conditional/indirect, `GAP` is an
unresolved intended trace, and `X` means no direct effect is
expected. The spreadsheet contains the same rows in execution-ledger form.

| Job | Statistics | Monitoring / Metrics | Affinity Graph | Admin Job detail | Domain / user-facing oracle |
| --- | --- | --- | --- | --- | --- |
| `event-random-groups` | `X` for system-message timeline | `Δ` scheduler/audit; `→` Chat/outbox | `X` | `Δ` status, count, duration, history | `Δ` rooms, memberships, shared chats, initial system messages, counters |
| `event-auto-inviter` | `Δ` event/member activity when invites are created | `Δ` scheduler/audit and Events/Members/outbox | `→` only after resulting affinity evidence/recompute | `Δ` | `Δ` invitations, member state and bell notification |
| `event-tournament-review` | `X` under current direct telemetry | `Δ` scheduler/audit; `→` domain/outbox | `X` direct | `Δ` | `Δ` stage review/advancement/score-plan state and notifications |
| `event-counter-expiry` | `X` direct | `Δ` scheduler/audit for zero, success and failure; `→` domain event when non-empty | `X` | `Δ` | `Δ` expired counters/tickets and refreshed user counters |
| `event-checkout-basket-purge` | `X` | `Δ` scheduler/audit | `X` | `Δ` | `Δ` expired basket items marked deleted |
| `notification-outbox` | `X` | `Δ` scheduler/audit plus pending/running/sent/failed | `X` | `Δ` | `Δ` terminal outbox state, Firebase/no-op result, token cleanup if applicable |
| `affinity-recompute` | `Δ` graph summary after projection refresh | `Δ` scheduler/audit and recompute queue | `Δ` edges/neighborhood/components where inputs changed | `Δ` | `Δ` recompute tasks terminal and discovery/affinity projections updated |
| `scheduled-messages` | `X` | `Δ` scheduler/audit; `→` Notifications/outbox | `X` | `Δ` | `Δ` task audit plus notification/email result |
| `account-purge` | `→` network graph after deleted user removal; ordinary deletion was counted earlier | `Δ` scheduler/audit; `X` for a new profile-deleted event at purge time | `→` member/edge totals after removal | `Δ` | `Δ` deleted/anonymized user data and purge job completion |

## Static input smoke pack

For the remaining mostly static admin input screens, use one compact reusable
check rather than manufacturing scheduler-style E2E scenarios:

1. open the screen and verify loading, empty and populated states;
2. edit every input type once, including its boundary values;
3. cancel and prove no persistence;
4. save and prove close/reopen persistence;
5. verify validation, disabled/read-only controls and backend error display;
6. check keyboard focus, narrow viewport and translation fallback;
7. restore the original value.

These checks are manual UI smoke tests. A static form pass must not be reported
as proof of its downstream scheduled or projection behavior.

## Queued cross-surface performance defect

`UI-POLL-JANK-001` is an `OPEN`, `P1 65` (`I2 L3 A5 N4 O2`) manual retest and
must remain in the master spreadsheet until **both** checkpoints pass:

Detailed code-path evidence and the reproducible trace procedure are in
[`UI_POLL_JANK_DIAGNOSIS.md`](UI_POLL_JANK_DIAGNOSIS.md).

1. **Admin Job checkpoint — observed, code path corroborated, trace pending.**
   Pointer movement visibly stutters with Job Detail open. The Admin process
   center polls its whole state every five seconds, replaces the shared state
   signal, and does not use `OnPush`. The configured `detailOpen()` task state
   does not currently gate the poll, although overlapping requests are blocked.
2. **Chat checkpoint — reported, root cause unconfirmed, trace pending.** Similar
   stutter was reported in an open chat. Chat itself uses `OnPush` and WebSocket
   events; a separate global user realtime long-poll runs every 30 seconds, or
   10 seconds in demo mode. Do not assume this is the same five-second Job path.

Run this pack as a separate dedicated performance session; the completed
`STAT-012` scheduler evidence remains valid. Record 20–30 second browser
Performance and Network traces for idle UI, Admin process list, Job Detail and
Chat while continuously moving the pointer and, in Chat, scrolling/typing. Mark
the exact hitch timestamps and correlate them with the five-second Job request,
WebSocket messages, user realtime long-poll completion, scripting, layout and
paint. A fix is accepted only when the affected trace no longer has the periodic
hitch and both UI checkpoints remain functionally correct.

## Execution order for the next manual session

1. Complete `STAT-001`, `MON-001` and `GRAPH-001` as a read-only baseline.
2. Run `PARAM-001` + `PARAM-010` so one input is followed through recompute,
   Monitoring, Affinity Graph and Statistics.
3. Run `MON-011` and `GRAPH-006` on the same controlled pair.
4. Re-run the nine Admin Jobs, concentrating on the impact-matrix cells rather
   than repeating already-passed domain permutations.
5. Run `PARAM-011`–`PARAM-016`, reverting after each section.
6. Finish the Statistics action deltas, Monitoring failure/recovery and graph
   interaction/large-data packs.
7. Run `UI-POLL-JANK-001` for both Admin Job and Chat with browser traces.
8. Run the static-form smoke pack and record only newly found failures.

## Completion rule

This plan is complete only when every non-`X` spreadsheet cell has dated
evidence and every test row is PASS, or has a separately accepted issue with an
owner. A Job's domain PASS and a Monitoring GAP are two different results; one
must never cancel the other. The final reset/revert and database-cleanliness
check are mandatory.

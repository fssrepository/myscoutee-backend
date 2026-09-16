# Current manual QA session

Updated: 2026-09-16

This is the context-saving entry point for continuing the manual QA campaign.
It stores one minimal live resume pointer plus reusable pair-QA execution lessons. It
is not the transactional evidence ledger or a backup of the QA pack. Read this
file first, then open only the linked active checkpoint section.

## Authoritative files

- Test definitions, checkpoint order and expected domain effects:
  [`DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md`](../manuals/DOMAIN_LIFECYCLE_MANUAL_QA_PACK.md)
- Consolidated Event scheduler journey and its execution contract:
  [`ADMIN_DYNAMIC_SURFACES_QA_PLAN.md`](../manuals/ADMIN_DYNAMIC_SURFACES_QA_PLAN.md#manual-scheduler-checkpoints)
- Stable user-facing click guide for the completed Asset membership testcase;
  execution status or machine evidence never belong in a checklist:
  [`ASSET-MEMBER-001.md`](../checklists/asset/ASSET-MEMBER-001.md).
- Stable user-facing click guide for the completed Assignment lifecycle;
  execution status and machine evidence remain in the pack/handoff:
  [`ASSET-ASSIGNMENT-LIFECYCLE-001.md`](../checklists/asset/ASSET-ASSIGNMENT-LIFECYCLE-001.md).
- Stable user-facing click guide for the prepared, queued Content lifecycle:
  [`CONTENT-ADMIN-LIFECYCLE-001.md`](../checklists/content/CONTENT-ADMIN-LIFECYCLE-001.md).
- Stable user-facing click guide for the prepared side-menu Payment journey:
  [`PAYMENT-METHODS-HISTORY-001.md`](../checklists/event/PAYMENT-METHODS-HISTORY-001.md).
- Stable user-facing click guide for the parked Asset Borrow journey:
  [`ASSET-BORROW-001.md`](../checklists/asset/ASSET-BORROW-001.md).
- Stable user-facing guides for the six Notifications rows (UI poll is closed):
  [`UI-POLL-JANK-001.md`](../checklists/notifications/UI-POLL-JANK-001.md),
  [`MOBILE-PUSH-LIFECYCLE-001.md`](../checklists/notifications/MOBILE-PUSH-LIFECYCLE-001.md),
  [`MOBILE-WEBVIEW-LIFECYCLE-001.md`](../checklists/notifications/MOBILE-WEBVIEW-LIFECYCLE-001.md),
  [`NOTIFICATION-ADMIN-LIFECYCLE-001.md`](../checklists/notifications/NOTIFICATION-ADMIN-LIFECYCLE-001.md),
  [`JOB-MESSAGES.md`](../checklists/notifications/JOB-MESSAGES.md), and
  [`BELL-RATING-LIFECYCLE-001.md`](../checklists/notifications/BELL-RATING-LIFECYCLE-001.md).
- Overall status ledger and counts:
  [`ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx`](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.xlsx)
- Reviewable ledger source; regenerate the XLSX after every status update:
  [`ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv`](../matrices/ADMIN_DYNAMIC_SURFACES_QA_MATRIX.csv)
- Public repository QA pointer and concise current totals; synchronize it after
  every CSV/XLSX status change:
  [`README.md`](../../../README.md#manual-qa-status)
- Replayable Mongo fixture/checkpoint implementation:
  [`asset-domain-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/asset-domain-checkpoints.js)
- Isolated normal/Tournament Asset assignment fixture and exact branch
  oracles:
  [`asset-assignment-lifecycle-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/asset-assignment-lifecycle-checkpoints.js)
- Isolated governed-content, consent and Article lifecycle fixture:
  [`content-admin-lifecycle-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/content-admin-lifecycle-checkpoints.js)
- Isolated generated-group Asset membership fixture and exact savepoint
  oracles:
  [`asset-member-lifecycle-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/asset-member-lifecycle-checkpoints.js)
- Isolated side-menu Payment history, registration and expired-card fixture:
  [`payment-ui-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/payment-ui-checkpoints.js)
- Isolated Event checkout, control and provider-card fixture:
  [`event-checkout-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/event-checkout-checkpoints.js)
- Isolated Asset checkout, Barion/3DS control and rollback fixture:
  [`asset-checkout-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/asset-checkout-checkpoints.js)
- Three-role authorization/moderation fixture:
  [`role-triad-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/role-triad-checkpoints.js)
- Admin Job fixture toolkit and account-purge scenario:
  [`admin-job-fixtures.sh`](../../../server/docker/scripts/admin-job-fixtures/admin-job-fixtures.sh),
  [`account-purge.js`](../../../server/docker/scripts/admin-job-fixtures/scenarios/account-purge.js)
- Isolated first-stage admission fixture:
  [`tournament-admission-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/tournament-admission-checkpoints.js)
- Isolated corrected-score revision fixture:
  [`tournament-score-reopen-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/tournament-score-reopen-checkpoints.js)
- Isolated four-person room-removal notification fixture:
  [`tournament-member-notification-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/tournament-member-notification-checkpoints.js)
- Isolated generated-group resource aggregation fixture:
  [`tournament-resource-checkpoints.js`](../../../server/docker/scripts/manual-qa-checkpoints/scenarios/tournament-resource-checkpoints.js)
- Harness entry point for the already-running MongoDB container:
  [`manual-qa-checkpoints-docker.sh`](../../../server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh)
- Browser actor/layout configuration:
  [`browser-session-checkpoints.json`](../tools/browser-session-checkpoints.json)
- Authenticated Asset visibility/detail read oracle:
  [`verify-asset-visibility-http.sh`](../tools/verify-asset-visibility-http.sh)
- Isolated Chrome launcher:
  [`open-checkpoint-browser-sessions.sh`](../tools/open-checkpoint-browser-sessions.sh)

The detailed QA pack owns checkpoint evidence. The CSV/XLSX matrix owns status,
dates, next oracle and aggregate counts. This handoff owns only the active
resume pointer and reusable working method.

## Active resume point

Campaign scheduling, confirmed 2026-09-16: finish Operator Update today, then
prepare the two Asset journeys for user-controlled pair QA tomorrow. External
security, UI/image smoke and other deployment qualification are deferred to the
final stable application and Registry release campaign, including GitHub publication.
Do not execute those deferred checks as part of today's Update work.

Testing boundary confirmed by the user: use versioned fixtures for test data
and external tunnels/proxies/network emulation for transport conditions. Do not
add application test parameters or test-only production branches. Fixture-only
internal setup is allowed when no practical external setup exists, with exact
scope and cleanup; it cannot replace the behavior being tested or manufacture
its successful result. Do not replace live browser APIs to prove native behavior.
User clarification: fixture storage/database/session preparation is allowed
to start or resume directly at a block's defined baseline, without replaying
all earlier clicks. Prefer the closest practical emulation of the real
environment. Record prepared state separately from observed results. When
login itself is under test, perform real login; for another block, a prepared
authenticated session is a valid prerequisite, not a login PASS.
Keep authorized standardized fixture startup separate from the behavior under
test. Manual lifecycle evidence must follow ordinary user-accessible actions;
isolated test doubles are not proof of that lifecycle. Application changes must
repair an established product defect. Preserve the phone's tethering connection
when shaping only its route to the QA application.

```yaml
checkpoint: OPERATOR-UPDATE-LIFECYCLE-001
checklist: ../checklists/operator/OPERATOR-UPDATE-LIFECYCLE-001.md
substage: Local-source QA1 → QA2 native Apply PASS, including original-popup recovery to100% without reload; job upd_e706a97a8ab99457775c37903b5cadab completed14:42:46Z. User requested independent progress during API downtime; source implementation/tests PASS and normal monitor-qa1/qa2 packages building. Rollback not yet started.
fixture_phase: Preservation fixture and local release-source override remain STAGED; all retained Mongo/MinIO/configuration controls match after QA2. VM runs local-rollback-qa2-20260916-r2; managed Operator popup shows recovery action but cached i18n109 displays its key.
browser_control: Operator full-flow delegation remains active. Asset journeys remain user-controlled pair QA.
required_resume: Finish build pipeline /tmp/operator-monitor-qa{1,2}-{frontend,images,package,sign}.log. Signed packages target packaging/dist/monitor-qa{1,2}-20260916. Swap only local release fixture server to new signed catalog, then normal signed QA1 baseline install and native UI QA1 → QA2 → QA1. Independent socket status reader/retained-nginx restart are source-tested but NOT deployed. Ring removal and i18n110 are bundled. Reuse vmware.local.env, preservation/source fixtures and localhost HTTPS; no GitHub changes, binary patches, fake versions or dataset backups. After Update prepare Borrow/Pricing for tomorrow; security/smoke/final app+Registry release deferred.
queued_work: Update includes managed HTTPS. Separate deployment UI image smoke, repeatable external security probes and measured memory/startup efficiency qualification; no routine dependency upgrades. Two Asset journeys remain pair QA.
last_completed: Configuration C01–C03 PASS, including actual Auth/Message tests and activation/entry-mode proof; real Firebase-user sign-in reuses physical WebView evidence2026-09-14 and was not repeated. Registry/Revenue and Administration complete.
runtime: VMware runs installed QA2 after actual UI upgrade; local dev Docker containers stopped. Host about9.5GiB available. No duplicate build/test process left. Managed Operator session retained. Production build output remains separate from dev nginx output.
ledger_status: 101/104 PASS; Operator3/4; Update IN PROGRESS. Forward installation/data controls PASS; restart UI tracking FAIL with source repair verified; rollback, controlled failure and managed HTTPS remain incomplete.
```

### Current delegation boundary — 2026-09-16

The user explicitly delegates the remaining Administration test and then all four
Operator journeys to Codex, with visible numbered progress and in-scope repairs.
VMware deployment UI smoke is a separate automated, non-demo registration/profile/Event/Asset image journey, outside the QA matrix; see guides/releases/PRERELEASE_DEPLOYMENT_QUALIFICATION.md. Firebase prerequisites belong to its deploy smoke fixture. No deployment is started by this note.

The two remaining Asset tests are explicitly reserved for pair QA: prepare their
versioned fixtures/managed startup, then the user controls all checklist actions.
A defect report permits diagnosis and repair, not takeover of those Asset actions.

### Notifications takeover notes

Before each new testcase, briefly explain its purpose and expected outcomes in
Hungarian. Throughout execution, announce the exact checklist block and step
number and the immediate action; this lets the user follow and assist.

`UI-POLL-JANK-001` is closed. Its detailed evidence is in the linked diagnosis
and CSV/XLSX ledger. Mobile WebView is also PASS/CLOSED after both remaining
clipboard observations and cleanup. Do not replay completed work.

Existing support for the later Notifications guides must be reused before new
harness code is created:

- `BELL-RATING-LIFECYCLE-001`: `bell-rating-feedback`, `stat-010` and
  `graph-rating` fixtures exist; a consolidated wrapper/browser setup is not
  yet bound.
- `JOB-MESSAGES`: the existing `scheduled-messages` inactive-user/recent-user fixture
  is now bound to `job-messages` stage/ready/arm/status/reset and the versioned
  two-window launcher. Prepare Admin fixture between checkpoint stage and ready;
  release only after the baseline is visible. No application worker path changed.
- `NOTIFICATION-ADMIN-LIFECYCLE-001`: versioned `notification-admin` stage/status/reset
  and Ava/Nova/Casey browser setup now own the rule-edit baseline. Reuse existing
  `notification-read-path` / `notification-outbox` helpers for later phases;
  `notification-admin-http.py` binds invalid-field rejection and the real Chat
  producer; capture savepoints bind scheduler/read/dedupe boundaries. Do not run
  those phases during startup.
- `MOBILE-PUSH-LIFECYCLE-001`: execution remains gated on an Operator-tested
  active Firebase revision and a disposable physical Android device. Never
  manufacture a local token fallback.
- `MOBILE-WEBVIEW-LIFECYCLE-001`: execution needs a physical Android device,
  recorded old/candidate build identities and a versioned ADB/cache fixture.
  Never clear app data before capturing the old-cache and account-isolation
  boundaries.

Mobile WebView has no remaining estimate because it is closed. Remaining:
Notification Admin `80/190`, Scheduled Messages `20/65`, Bell/Rating `55/130`
minutes. The completed UI poll estimate is excluded from the remaining total.

Resolved admission decision: first-stage admission locks on the successful
materialization commit, not when a scheduled Start is merely queued or stuck.
An invitation accepted during that in-flight window participates exactly once
in the committed materialization. After the commit, Join, invitation Accept
and Admin approval are rejected and leave parent membership, nested Groups,
capacity, chat, leaderboard, counters, checkout and notifications unchanged.
Parent admission remains outside the nested `Groups` counter; event-owner
materialized rooms keep member-pending at zero. Never alter the already-passed
Start notification producers for this checkpoint.

Separate captured score-correction follow-ups:
`TOURNAMENT-SCORE-REOPEN-001` owns `Score review -> Finalize -> Reopen scores ->
corrected Finalize` as a new durable result revision with new exact-once
participant outcomes, while `TOURNAMENT-SCORE-REOPEN-002` owns the guard that
forbids an ordinary correction after a dependent stage has started. Java,
HTTP and frontend-local carry the revision and Reopen guards. Both
score-correction checkpoints are PASS/CLOSED; the late guard was exercised
through the real Java route and its retained fixture was reset. Do not replay
their closed Start/Finalize/result producers when preparing another domain.

Separate captured Event follow-up: `EVENT-RUNTIME-001` owns the normal-Event
runtime contract. Slots Off with Sub Events Off renders the one persisted root
`MAIN_EVENT`. With two Slot definitions and no child definitions, the runtime
surface renders one `MAIN_EVENT` card inside each Slot; those are independent
resource scopes while the root runtime is retained inactive. Removing all
Slots restores that same root runtime. The host enters the whole runtime state
with `Manage Event`; the runtime header's `Edit` action edits the Event
definition, while a participant enters the same runtime surface with `View
Event`.

Separate captured Asset follow-up: Tournament-origin asset behavior remains
owned by the Asset block instead of duplicating closed Tournament cases.
`ASSET-MEMBER-001/002` own generated-group Join/Invite transitions,
`ASSET-BORROW-001` owns generated-group Resource Explore/borrow, and
`ASSET-AVAIL-001` owns the multi-day Explore date-range boundary where a
Public Asset can still be unavailable for an overlapping full-capacity window,
while a released non-overlapping window restores it in place and after reload;
`ASSET-ASSIGN-003` now explicitly owns generated-group edit, unassign and
removed-manager cleanup with exact write-side Group/stage/root counter reversal
and a byte-identical sibling-group negative control. This is required coverage,
not a later optional reminder.
The parked Borrow lifecycle covers its free controls plus the narrow paid
repeat-request parity branch and exact-scope Organizer-only counters.

The three existing Event/Asset cases divide checkout coverage without a
separate External Payment row: `EVENT-CHECKOUT-001` owns Stripe plus the
Cash-only paid control and card assignment; `ASSET-CHECKOUT-001` owns
Barion plus 3DS approve/decline/timeout and expired-card selection blocking;
`ASSET-BORROW-001` retains the genuinely free/no-payment controls and adds one
narrow paid parity branch without replaying checkout's 3DS/refund lifecycle.
Their stable guides carry those separate combinations. Event and Asset
checkout are PASS/CLOSED; Asset Borrow is parked while Notifications owns the
active cursor.

`PAYMENT-METHODS-HISTORY-001` and `EVENT-CHECKOUT-001` are PASS/CLOSED. The
Event and Asset checkout are PASS/CLOSED. Their completed transactions must not
be replayed for the selected Notifications work.

Separate captured Content follow-up: `CONTENT-ADMIN-LIFECYCLE-001` is the one
open consolidated Content row and now has a stable click guide. It creates
inactive Help/Privacy/Terms/Explanation revisions, activates Privacy with
per-user consent isolation, deletes one inactive revision, exercises the
implemented newest-remaining fallback after active Privacy deletion, then
moves a separate managed-media Article through Published -> Trashed -> Draft
-> Published while comparing admin buckets, fresh public clients and an
honestly non-live open client. The older unexecuted active-delete-denial
assertion was corrected to match Java, frontend-local and the administrator
manual. Its versioned fixture, six savepoint oracles, exact reset and
Ava/Kai/Riley browser-session definition are prepared. It remains explicitly
not staged while Notifications owns the selected cursor. Stage Content only
after the canonical matrix selects it, require
`baseline-ready`, and only then let the user open its configured browsers. The
Mongo harness proves revision, audit, consent and Article-bucket state; the
existing admin telemetry stream is a separate savepoint oracle.
Both distinct managed-image controls returned HTTP 200 and their pre-stage
sizes/SHA-256 values are recorded in the Content pack section for tomorrow's
retention comparison.

### Efficient resume gate

Do not repeat baseline methodology when the resume pointer and persisted oracle
already identify an intact transaction boundary. Continue with its
`required_resume`. If continuity is uncertain, run one read-only `status` first
and choose exactly one route from this table:

| `status` result | Action |
| --- | --- |
| Matching expected live boundary | Continue; do not stage, reset or relaunch browsers. |
| `phase=not-staged` | Stage once with every checkpoint-required environment value, then verify with `status`. |
| Matching active checkpoint but `events=[]` | Use guarded `discard-stale`, then normal `stage`, then `status`. |
| Partial or unexpected domain state | Stop and report the exact mismatch; do not repair it through UI or ad-hoc Mongo writes. |

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status event-domain EVENT-TICKET-005
```

Known ticket-fixture lesson: do **not** use `restage`; the current harness
restricts it to feedback checkpoints. Ticket `stage` also requires the retained
managed QA image URL. The already-proven stale recovery is:

```bash
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  discard-stale event-domain EVENT-TICKET-005

env MANUAL_QA_EVENT_IMAGE_URL='/media/public?key=images%2F650000000000000000000061%2Fmanual-qa-checkpoint-v1-event-domain-event%2F1785904818563-084b9c3d-2bec-4d84-86f6-fb7140562c60%2Flarge.webp' \
  bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  stage event-domain EVENT-TICKET-005

bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status event-domain EVENT-TICKET-005
```

If `status` reports `phase=not-staged`, omit `discard-stale`. An empty
`MANUAL_QA_EVENT_IMAGE_URL` fails after snapshot creation; run the
harness-requested `reset` before retrying with the URL. `discard-stale` itself
refuses to run when the event still exists or original fixture documents would
make the discard unsafe.

On a new baseline, do not launch browsers until the second `status` proves the
linked checkpoint's complete expected baseline. If any predicate differs, stop
and report it instead of asking the user to compensate in the UI.

After that proof, open or replace exactly the checkpoint-configured managed
windows with:

```bash
guides/qa/tools/open-checkpoint-browser-sessions.sh EVENT-TICKET-005
```

The launcher owns one separate ephemeral Chrome profile per configured actor,
injects the exact demo user sessions, grants the configured Austin
geolocation, loads `/game`, dismisses entry consent/guides and lays the windows
out in the configured grid. Do not open ad-hoc browsers, use personal Chrome
profile names, or ask the user which profile to select. Re-running it replaces
only this checkpoint's managed windows. Idle controls remain untouched until
the checkpoint says otherwise.

### Next manual action

`NOTIFICATION-ADMIN-LIFECYCLE-001` — **section 1, steps 1–2**: in Ava, open
`Configuration -> Jobs -> Send notifications`. Record the original **1 minute**
Timing, enabled state, Last run and newest Runner history. Then follow steps
3–5: save **2 minutes**, close/reopen and report the persisted value.


Group-size audit: retain `TOURNAMENT-MEMBER-002` as 2+1 because Riley's Group B
proves parent-event notification delivery across room boundaries while Group B
state remains unchanged. Use `TOURNAMENT-MEMBER-003` as one four-person room
because two independent participant recipients are needed beside the actor and
removed member. Run `TOURNAMENT-DQ-001` with a
four-person group as well, so active score ordering and the terminal DQ row can
be compared in one leaderboard. Existing closed grouping, room-lifecycle and
score-revision fixtures keep their proven 2+1/2+2 layouts.

When a guarded fixture repair changes time or state behind an already-open
browser, its old projection is not valid visual evidence. Require one explicit
reload at that boundary, record why it is required, and do not misclassify the
stale view as a backend state or silently reload during an in-place assertion.

For a lifecycle transition that closes discovery or admission, first reuse an
existing main-record write-side state whose normal read path already enforces
the desired visibility. Do not add a tournament-only read projection or make
Explore walk stage state. In the current tournament contract, first-stage Start
changes the main event visibility to `Invitation only`; Explore therefore omits
the event, while the direct Java/local admission guards remain defense in depth
for stale links, invitations and Admin approval.

Performance comparison rule for transactional QA: compare only two executions
that persisted the same complete domain result. A fast false-success/no-op is
not a valid latency baseline. Trace the request from its first owning read to
its last owning write, count the materialized records, and optimize redundant
write-path round trips (already batch-loaded reads, duplicate saves, immediate
read-after-acknowledged-write, or full counter reprojection when the mutation
has an exact idempotent delta). Keep the independent post-request oracle strict;
removing an in-request readback must never remove the separate QA read oracle.

## QA working method

### Manual frontend ownership

**The user exclusively performs and judges every manual, visual and
interaction check. Codex validates the backend/API/persisted oracle after the
user action and never substitutes a browser-derived verdict for the user's
frontend PASS/FAIL.**

Codex owns fixture preparation, explicitly requested isolated browser startup
and machine-side diagnosis. During a manual run, CDP may be used only after the
user reports a concrete observed defect, and only to diagnose that defect. It
must never prepare or position the test, inspect ahead, navigate, click,
reposition, submit, manufacture evidence or perform any part of the user's
manual sequence. Prefer source, logs, API and persisted state. CDP-dependent
versioned infrastructure may run only when the stable checklist explicitly
requires it and the user has started that checkpoint; it never performs or
replaces a manual action.

Codex must not invent eligibility, role, menu, counter, notification or
lifecycle rules while executing a checkpoint. The only acceptance rules are
the stable checklist and explicit user corrections. If implementation evidence
conflicts with them, record the mismatch and repair the owning code or fixture;
do not silently redefine the expected behavior or expand the current test.

### Pair-QA execution and replay contract

User clarification (2026-09-15): execute one visible, ordered chain with brief
savepoint results and next actions. Preparation belongs in fixtures, with only
the real browser/device registration needed for the active test. Never replay
completed WebView/Operator journeys as Push preparation. After a fix, resume
from the nearest valid savepoint and repeat only the affected causal tail;
revisit passed work only when its baseline or proved behavior was invalidated,
and state the reason. Time matters: avoid redundant checks and adjacent work.

1. Select the next testcase from the canonical CSV/XLSX Pair-QA order and open
   its stable file under `guides/qa/checklists/`.
2. Before asking for a user action, Codex provides or reuses a versioned
   harness with guarded `stage`, read-only `status` and exact `reset`. A complex
   testcase also gets named replay substages at meaningful causal recovery
   boundaries. Substages remain inside the same testcase ID; they are not new
   matrix rows and are not created for every click.
3. Codex stages the selected baseline, proves it with `status`, prepares any
   required substage snapshots, and opens the configured isolated actor
   browsers. The user never has to create fixtures, sessions or windows.
4. The user follows the unchanged checklist and reports its stop phrase. Codex
   then runs the independent API/backend/persisted oracle and records the
   result outside the checklist.
5. On a reported defect, freeze the current boundary, diagnose the smallest
   owning scope from source, logs, API and persisted state, repair it through the
   existing dev pipeline, restore the nearest valid named substage and replay
   only the shortest causal tail. Do not restart the full testcase unless the
   failure contaminated its earlier shared baseline.
6. The handoff must always name the active testcase, checklist section,
   current substage, persisted fixture phase, live actor/browser state, exact
   next user action, stop phrase and pending machine oracle. A later session
   starts with one read-only status gate and resumes from that pointer instead
   of reconstructing the journey from conversation history.

### 1. One checkpoint, one transition

The physical CSV/XLSX row order is the manual execution order, not merely a
visual grouping. The main testcase table has one normalized, domain-colored
`QA domain` column; its other cells retain the existing status/effect-marker
colors.
The workbook's separate `QA domain | Priority | Progress` overview is generated
from the same rows, begins at row 8 as two side-by-side three-field blocks above
the main table, orders whole domains by numeric `Priority DESC`, and shows `passed
/ total (percentage)` plus summed unfinished `MIN/MAX` ranges per domain. The
generator owns compact A-T widths: all 20 primary columns remain visible
without a default horizontal scroll, long
content shows as much as the compact cell and its existing line breaks allow,
and only the three formula-helper columns remain hidden. Summary count cells are
right-aligned. Priority-table Progress cells use completion bands independently
from domain colors: 0% not-started blue, 1–49% low orange, 50–74% yellow,
75–99% light green and 100% green. Keep every domain in one contiguous block
and order them by priority. The top-level taxonomy is intentionally coarse:
10 Pair-QA capability/operations domains, including Operator. Their numeric priorities preserve the
authoritative execution order.
A generated priority overview places the first five domains in its first
block and the remaining five domains in its second block. Operator is a normal
Pair-QA domain and has no separate scope marker or summary total.
A browser surface, device type, test technique or one-off checkpoint name is
not a domain. Put details such as registration, public landing eligibility,
mobile WebView, Statistics, Monitoring and background jobs in the owning
domain's `Area` instead of manufacturing singleton domains. Create a new
top-level domain only for an independently executable capability with a
material workflow set; otherwise classify the row under its real owner.
The same ownership rule applies to the configurable Admin shell. Local Admin
work stays in Pair QA and is distributed by the state it reads or mutates: authorization
and moderation belong to Identity & access, revisions to Content, notification
rules to Notifications, statistics and monitoring to Administration, and so
on. The route or shell does not manufacture a separate Admin domain.
Operator and Registry behavior remains in the Operator domain. Deployment
qualification is not Pair QA.
Member payment history and saved-card behavior belongs to Event; provider checkout
variants are owned by the Event and Asset journeys. Row-level Manual QA
priority orders risk inside the queue; it does
not change capability ownership.
Preserve the intentional checkpoint order inside each block. Once execution
enters a domain, finish that block before selecting another. After the
currently active domain closes, choose the highest-priority domain whose
Progress is below 100%, then close its Pending/Not started rows in physical
order. Status colors never select the next test. More generally, whenever
fixture dependencies and the active transactional checkpoint allow a choice,
execute the higher numeric priority first; choosing a lower-priority open case
requires an explicit dependency reason or user reprioritization. Newly
discovered foreign-domain coverage may be recorded beside its own rows, but
must not become the live checkpoint, trigger fixture/browser setup, or load
that foreign-domain pack. The resume pointer records the current row; it must
not hard-code a domain-specific methodology rule.

Each transactional boundary has one controlled producer action and explicitly
records: before state, manual action, immediate state, worker expectation,
delayed projection, unchanged controls and independent persisted oracle. A
checkpoint row may contain a short causally continuous sequence of these
boundaries under the granularity rules below. UI evidence alone is not a PASS.

When an active checkpoint has already reached one prepared surface, bundle its
causally ready visual assertions into one directed observation: the positive
state, named negative control, relevant counter/badge and any notification
created by that same boundary. Codex prepares the navigation and names the
exact expected text/state; the user should not be asked to discover menus or
invent assertions. A persisted oracle supports, but never replaces, the
user-visible notification/content check. If opening that notification marks it
read, record the acknowledgement as its own expected side effect and prove it
did not change the checkpoint's membership, lifecycle or other negative
controls.

For tournament lifecycle notifications, manual and automatic producers share
one semantic contract. Every Start/close/finalize message identifies the stage;
advancement identifies both the completed and destination stages; terminal
finalization explicitly says that the whole tournament ended and carries the
result context. Manual producers alone exclude their actor from redundant
acknowledgements. Persist the stage index/total and use the shared stage-card
accent only on the notification avatar; normal notification rules continue to
own the row background. Verify frontend-local and persisted EN/HU keys together.

Before declaring a worker FAIL, resolve the original production write contract
and its existing regression coverage. Tournament score review, for example,
synchronizes advancing users into next-stage `group` memberships; a separate
tournament-room event/chat belongs to the random/start grouping path. The
checkpoint oracle must inspect the owning records and plan marker for the path
under test, rather than requiring an artifact produced by a neighbouring
workflow.

This campaign is a developer-AI collaborative repair session, not a two-person
QA handoff. Codex owns the complete machine-side loop: fixture staging,
isolated browser setup, server/database oracle checks, diagnosis, correctly
scoped implementation, hot-deploy/log verification, replay and status
documentation. The user performs only the genuinely manual UI observation or
producer action named by the checkpoint. Codex gives one short manual
instruction at a time, waits for the stated stop phrase, checks the oracle and
continues the repair/replay loop without handing the failure decision back to
the user.

### Functional authenticity gate

Manual QA validates real product functionality, never a fixture-authored copy
of the expected result. Fixtures may prepare only production-reachable source
data and ordinary persisted development configuration. They must not fabricate
or backdate runtime state, `lastRunAtIso`, Runner history, counters, Metrics or
audit events, completion state, notifications, projections, or user-visible
outcomes. A setup that does so is **NOT EXECUTED / invalid fixture** regardless
of whether the final screen looks correct; reset it and redesign the same
checkpoint before accepting evidence.

For scheduler QA, preserve the genuine last-run state, set the real persisted
target frequency to the documented short development interval (normally one
minute), and wait for the already-running scheduler and production worker.
Never make a rule due by rewriting its last-run timestamp, call the worker
directly, fabricate history/telemetry, or use the manual `Run` action. The
machine oracle may read persisted state after the user action, but it may not
perform the business transition being tested.

A deliberate dev-stack restart may run the repository's full seed reset. That
reset is authoritative and is allowed to remove live manual-QA transactions;
do not diagnose or change `mongodb-sync` merely because retained checkpoint
data disappeared after such a restart. Detect the lost boundary with the
read-only resume gate, preserve already-closed ledger evidence, discard only a
guarded stale zero-snapshot checkpoint, and stage the next independent
checkpoint directly when its definition provides the required state. Never
make the user replay an already-PASS producer only to reconstruct reset data.

Historical checkpoint evidence and a live replay fixture are different data
classes. Keep closed-branch notifications in the saved oracle; do not reinsert
them into the live inbox/outbox when a later checkpoint uses a new time window.
Clean generated-child cleanup must also discover orphaned artifacts through
their persisted parent identity (for example `payload.parentEventId` plus
`eventScope`), not only through a child event that may already have disappeared.
Otherwise polling can resurrect stale notifications after the visible child
record has been removed.

### 1.1 Checkpoint granularity and new rows

- Treat every PASS/CLOSED testcase as immutable evidence: its `QA domain`, ID,
  status, contract, evidence and every other cell remain unchanged. Non-PASS source rows may instead be consolidated
  into one complete domain journey when they are only micro-oracles of the same
  lifecycle; preserve every source assertion inside the parent contract and do
  not count the retired source IDs as independently scheduled tests. Count
  logical CSV records rather than physical lines because quoted multiline
  cells span several file lines; ignore `LEGEND-*` records when quoting the
  testcase total. Capture a canonical serialized hash keyed by every
  PASS testcase ID and prove the same ID/content hashes after CSV and XLSX
  synchronization. Insert new coverage beside its owning domain rows instead
  of appending it merely because it was discovered later. Preserve the relative
  order and contents of all PASS testcase rows while doing so. Consolidated or
  new journeys receive stable IDs and ordered checkpoint groups. The target count is an
  audit result, not a quota: record all materially distinct bounded contracts,
  but never manufacture row splits only to reach an estimate.
- A feature-rich domain must be represented by executable user journeys, not
  one umbrella row and not one independently scheduled row per button or
  assertion. Keep causally continuous actions in one case and list their exact
  UI/persisted checkpoints inside it. Split only at a materially different
  authority, fixture reset, external device or runtime boundary. The corrected
  Chat model is the reference: authorization, everyday conversation/recovery,
  message actions, rich content, governance and physical-device push are six
  journeys; list/history/send/read/reaction/media details are assertions owned
  by those journeys rather than standalone microtests.
- After appending matrix rows, run the repository's versioned
  `guides/qa/tools/sync-qa-matrix-xlsx.py` automation instead of hand-editing
  workbook totals. Verify the CSV has 20 columns per logical record, including
  the normalized `QA domain`, unique
  testcase IDs, the locked pre-existing logical-row prefix/hash, and the
  expected non-`LEGEND-*` testcase count. The generator writes a hidden
  per-test `IF(...)` status formula and visible `COUNTA`/`COUNTIF(S)` overview
  formulas into the XLSX, with automatic recalculation on open. The overview
  order is `Done`, `Pending`, `Not started`, `Failed`, `Total`. The four status
  rows partition all current Pair-QA tests, and the Done percentage uses that
  same total. Stable IDs beginning `OPERATOR-` remain unchanged and are counted
  exactly like every other Pair-QA domain; there is no separate scope branch,
  helper or legend. Read the generated formulas and cached totals back after
  synchronization and prove they match the CSV classifiers.
  This summary synchronization is part of every append/status update, not a
  later cleanup step.
- `Remaining QA complexity (min/max)` estimates only unfinished work.
  Completed rows are blank; partial rows contain only their open tail. The
  minimum is the clean prepared run; the maximum adds normal Codex
  stage/oracle/reset waiting and the calibrated defect/replay contingency.
  Recalculate both bounds with
  `guides/qa/reference/MANUAL_QA_COMPLEXITY_MODEL.md` whenever the remaining
  contract changes. The XLSX domain overview sums both bounds beside
  progress; never substitute the risk-based `Manual QA priority` score for an
  effort estimate. Record any overrun beyond the range separately.
- After every CSV/XLSX status change, also update the root README's **Manual QA
  status** block. Keep that public summary deliberately compact: show only
  the passed count and total case count for the single Pair-QA queue. Derive
  those values from the same classifiers as the generated
  workbook, and keep its active-checkpoint sentence aligned with this handoff's
  sole resume pointer. Detailed Pending/Not started/Failed counts belong only
  in the QA matrix. Treat a stale README summary as an incomplete ledger update.
- One matrix row must remain a bounded, human-verifiable contract, not a
  half-day collection of loosely related checks.
- Files under `guides/qa/checklists/` are stable user-facing click guides, not
  Codex execution checklists. They contain actors, navigation, actions, visible
  expectations and stop phrases. Never add live status, checked boxes, dated
  evidence, backend oracles or working notes to them, and never modify them
  merely because a run advanced or completed. The handoff points to the current
  guide and step; the QA pack and ledger own results and machine evidence.
- Testcase identity and fixture transaction identity are one-to-one. A complex
  journey may have named internal replay substages when they provide a useful
  recovery boundary, but those substages remain implementation details of the
  same testcase and do not become separate matrix rows. Do not create one for
  every click. Retained PASS evidence stays immutable, and a repair replays
  only the shortest causal tail from the nearest guarded substage. For example,
  `EVENT-EDIT-RUNTIME-001` remains one transaction with a
  `runtime-member-clean` replay boundary, while `EVENT-SCHEDULERS-001` is a
  separate transaction.
- One producer action or a short causally continuous sequence may stay in one
  row when it shares a baseline and finishes at one decisive oracle.
- One test case/matrix row may contain two or more named, short tests or
  branches when they verify different observations of the same contract and
  share the same controlled baseline. Keep their stop points and oracle results
  distinct inside the QA-pack definition.
- When one row contains several named steps or branches, format the relevant
  CSV cells as quoted multiline values with one short `•` item per step. The
  XLSX synchronizer wraps cell text, aligns it to the top and gives explicit
  multiline rows enough height. This is presentation inside one testcase row,
  not a reason to duplicate or split the testcase.
- A longer lifecycle becomes ordered checkpoint rows. They may carry the same
  staged state forward, but every row has its own stop point, persisted oracle
  and PASS/FAIL decision.
- When the user requests a newly discovered behavior as a separate case, give
  it a new stable checkpoint ID, a QA-pack definition and a new matrix CSV row;
  add fixture/harness/browser configuration only when that case needs it.
- For revisioned policy/content workflows, a new version used as transaction
  evidence must be a new revision record with its own identity; changing the
  version field on the active record is only suitable for an explicitly named
  temporary visual preview. Stable optional-section IDs define which prior
  choices may be prefilled. Filter the latest prior consent through the new
  revision's IDs, default every newly introduced ID to unselected, and require
  Save to create a separate new-revision consent without rewriting history.
- A fixture that activates a new revision may mutate only the currently active
  record required by that transition; never bulk-update already inactive
  historical revisions merely to make the new one sole active. Snapshot
  immutability checks start immediately after stage so a setup defect is not
  misattributed to the later application write. If such a stage defect is
  found after the manual action, use a guarded versioned repair command to
  restore exact inactive snapshots without touching transaction records, then
  repeat the terminal oracle instead of replaying unrelated UI steps.
- A fixture that inserts a canonical event/member/payment record must also
  stage every persisted projection that a normal owning write would have
  produced, while snapshotting those fields for reset. Validate reload-owned
  menu counters before opening the popup. A popup SmartList correcting a badge
  after its own query does not prove the reload contract and must not be used
  to conceal a missing stored write-side projection. Reuse the existing
  canonical counter projector; do not add a SmartList special case.
- A newly staged independent fixture does not rewrite counter snapshots already
  held by browser documents opened before the stage. Before issuing the first
  producer action, compare the loaded document's `performance.timeOrigin` (or
  recorded reload time) with `stagedAtIso` and require a UI baseline for every
  counter used by the checkpoint, including unchanged negative controls. If
  the document predates the fixture, first use the product's normal ownership
  boundary: close the foreground popup so the aside realtime poll can converge,
  or reload only when the checkpoint explicitly requires it. Then reopen the
  intended popup and capture the baseline. A stale pre-stage browser snapshot
  is **NOT EXECUTED / invalid UI baseline**, not a product FAIL; distinguish it
  with the authenticated realtime response and persisted oracle before editing
  Java or frontend code.
- An event fixture that inserts the creator's accepted Admin membership must
  include that same creator in `acceptedMemberUserIds` and `acceptedMembers`;
  validate card occupancy against the canonical membership rows. A list poll
  correcting fixture data in place is useful replay evidence only after the
  persisted projection itself has been repaired.
- Global organizer Trash and personal participant Trash are different
  projections. A globally trashed canonical event belongs in the
  organizer/admin Trash counter and list only. The current participant Leave
  write persists a restorable suppressed root membership plus a viewer-owned
  `T` overlay while the canonical event remains active; that complete invariant
  belongs in the participant's personal Trash. Legacy explicit `deleted`
  memberships remain supported. Never classify a bare suppressed member or a
  global organizer Trash as personal Trash. Keep the stored counter projector
  and list query aligned on the same persisted invariant.
- When a foreground popup bucket poll returns a persisted full counter snapshot,
  apply that snapshot atomically to every related menu and nested bucket counter.
  Updating only the selected bucket can leave inclusive or sibling counters stale
  until the user opens them. Do not derive inclusive counts from the page total,
  do not use the aside-menu poll while the popup owns polling, and do not modify
  SmartList to repair a transport omission. HTTP and frontend-local routes must
  expose the same snapshot contract; local parity is checked when the affected
  flow can run in local mode.
- When a mutation changes a counter outside the foreground popup's own list
  domain, its response must carry the actor's canonical full counter snapshot
  from the completed write. Apply it atomically with a pre-request revision
  token. This is required when popup ownership intentionally suppresses the
  side-menu domain poll: never guess `+1`, reopen the popup to conceal the
  omission, enable a competing poll, or add a SmartList exception. The
  frontend-local write must persist the equivalent projections, and a later
  local realtime poll must rebase from that stored state instead of restoring
  its pre-action snapshot.
- If read/setup activity creates a completed task after staging but before the
  producer, retain it as evidence and capture a versioned action baseline only
  after it is terminal. Attribute the producer by exact post-minus-action
  baseline identities instead of deleting the earlier task or restaging.
- Do not create a new row merely because one test case has multiple branches
  or an incidental observation occurred. A new row requires a genuinely new
  test case and the user's requested split; otherwise name the tests inside the
  existing QA-pack checkpoint.
- When the user adds an expectation to the active test, place it immediately
  at the earliest causal observation boundary in the QA-pack definition,
  matrix oracle and replay checkpoint. If that boundary has already passed,
  use retained persisted evidence where it is decisive, but classify an
  omitted manual UI observation as **NOT EXECUTED**, not as a retroactive
  product FAIL. Do not replay already-proven earlier transactions solely to
  manufacture that missed observation unless the new expectation changes the
  correctness of the active boundary or the user explicitly requests it.
- On a requested split, preserve execution continuity explicitly with the
  ordered chain and `advance`/`switch` semantics where supported; never force
  the user to recreate already-proven setup.
- After a repair, scope the replay to the shortest causal path that can execute
  the changed owning code and decisive oracle. Keep prior clean evidence for
  branches untouched by that change; do not restart every subtest merely
  because they share a matrix row. Require a full checkpoint replay only when
  the failure contaminated the shared baseline/evidence or the repair changed
  an earlier shared transaction invariant. If a focused path needs prepared
  state, make it a versioned sub-checkpoint rather than asking the user to
  reproduce unrelated manual steps.
- Do not leave an active QA defect in `fix compiled / replay pending` state and
  move to the next independent test. Before closing or pausing the current
  session, give the affected branch a decisive runtime **PASS** or **FAIL** using
  the shortest valid replay/read oracle in the current checkpoint. A later test
  may add coverage, but it must not be made a hidden prerequisite for closing
  today's fix. When the user explicitly performs the decisive check and accepts
  the branch, record it as executed/PASS consistently in the QA pack, ledger and
  resume pointer; remove stale pending or NOT EXECUTED wording for that branch.
- Before issuing any lifecycle producer instruction whose control is filtered
  by Upcoming/Active/Past time, compare the event's absolute start/end against
  the current wall clock and reserve enough time for the remaining manual stops,
  worker waits and actor replacement. This applies to long continuation
  checkpoints, not only explicit time-window tests. If the retained fixture can
  expire during that round trip, do not issue the instruction: add one guarded,
  versioned preparation that proves the current transaction oracle, moves the
  whole event projection to a stable future window once and persists the old
  and new dates. Let an already-open list recover through its normal poll when
  possible. If expiry removed the action before a modifying request was sent,
  classify it as **NOT EXECUTED / fixture timing invalid**, retain prior PASS
  boundaries and continue without replaying them.
- A versioned server-side replay rearm does not by itself require a full page
  reload. First let the already-open surface reach the prepared pre-action
  boundary through its established read behavior; when that surface loads only
  on demand, close/reopen just that surface. Use a full document reload only
  when the pre-action baseline cannot otherwise be reached, and record it as
  setup. After the producer action, never reload before capturing the in-place
  result; otherwise the immediate and reload/read branches become
  indistinguishable.
- For notifications caused by a manual action, derive the recipient set from
  the owning producer and explicitly compare it with analogous manual actions
  before asking the user to inspect delivery. The actor normally must not
  receive a self-notification; for tournament stage actions, manual Finalize
  follows the already-proven manual Start exclusion rule. Persist and inspect
  the outbox recipients first, then use browser counters/content as delivery
  evidence. A three-client counter convergence is not PASS if the actor should
  have been excluded.
- Before a one-time credential action whose success state intentionally hides
  the original code, explicitly retain the complete QR in a controlled QA
  screenshot/tab before issuing the producer instruction. This is required
  setup for an exact same-credential replay and avoids restaging or repeating
  the already-proven first-use branch. Never print the raw code into QA logs.
- A human-observed time-window checkpoint must stage into a stable, non-expiring
  precondition. Browser preparation, oracle reads and the user round trip must
  never consume the tested interval. Start the interval only through an
  explicit versioned harness action after the user has confirmed the exact
  pre-window UI boundary; print and persist the absolute deadline and owning
  identity. A missed pre-window observation is **NOT EXECUTED / fixture timing
  invalid**, not a product FAIL, and must be repaired in the fixture before
  replay.
- A new versioned harness action is incomplete until both the scenario
  dispatcher and the outer `manual-qa-checkpoints.sh` usage/allowlist route it.
  Before treating an attempted action as executed, pair its structured success
  phase with a read-only state check; usage output or a non-zero exit leaves the
  transaction unexecuted. In particular, never infer that a time window began
  merely because the inner scenario contains the command.

### 1.2 Exact manual producer instructions

- For an offline checkpoint in a dev stack, first prove the checkpoint-specific
  service-worker switch is enabled, the worker is activated and controls the
  current page. The dev override must be ignored in production; production
  enablement belongs only to its build configuration. A one-shot CDP command
  that detaches is not an offline interval: keep the target session attached,
  apply both request blocking and `navigator.onLine=false`, and restore online
  explicitly in cleanup. Before testing cached domain data, require the
  offline shell policy itself: only the intentionally supported Ticket action
  remains enabled, while profile editing and every other menu are disabled.
- Keep offline presentation separate from profile visibility and invalid
  presentation. Profile visibility may color the ordinary page, while offline
  overrides only the page background with its own stronger gray and an explicit
  status label. Do not recolor menu palettes to represent offline; retain their
  normal palettes and express unavailability through real disabled state. Rate
  mode, filter/history controls and editable inputs follow the same rule.
- In an offline member header, hide actions whose popup cannot serve the
  checkpoint contract rather than rendering misleading disabled affordances:
  no profile pencil, notification header entry or notification attention FAB.
  Hiding launchers must not mark notifications read or change their counters.
  Override the visibility color only on the page and the profile/visibility
  part of the open menu; leave the menu content surface and item palettes alone.
- Record in-place connectivity transition and offline-cache reload as distinct
  observations when both matter. A synthetic CDP event that changes
  `navigator.onLine` but is not consumed by the application is harness evidence,
  not a product PASS or FAIL. The cache-reload branch must start the application
  with `navigator.onLine=false`, prove an activated controlling worker and read
  both the computed page state and interactive disabled states. Always release
  the held target back online in cleanup.
- For Ticket offline warming, inspect the actual DTO/cache boundary before
  asking for a detail action. The authenticated side-menu realtime response
  carries one bounded `offlineTicketSnapshot` for the first **Upcoming**
  SmartList window, including each complete `AssetTicketDTO` and `scanCode`;
  the shared user-service poll layer writes it to the user-scoped Upcoming
  offline cache even when Ticket has never been opened. Past is intentionally
  not auto-warmed. This snapshot is never an online SmartList data source:
  online continues through `/assets/tickets` and `/assets/tickets/sync`, while
  the HTTP adapter reads the snapshot cache only after an offline transport
  failure. If Ticket is already open, its own coordinated SmartList page/delta
  poll remains the cache refresher and the ordinary side-menu domain lane need
  not compete. Opening the QR online is never a separate warm requirement: the
  QR popup performs no detail read and renders locally from the cached code.
  Opening the QR offline remains the presentation assertion, not setup.
- Start every manual instruction with the active testcase ID and short name,
  then name the current subtest. In plain language state what the user should
  do, why that observation belongs at this boundary, and the exact visible
  condition that counts as PASS. Do this even when continuing the same case,
  so the user never has to reconstruct the test purpose from earlier messages.
- Treat a sudden message unrelated to the active checkpoint as a possible
  cross-window message, not as implicit authorization to change task scope.
  Stop mutations, keep the current checkpoint intact and confirm the context
  before touching the unrelated artifact. Never edit, restore or revert files
  from an inferred context switch; a read-only comparison is not permission to
  apply what it finds. Resume the QA transaction only after the user explicitly
  returns to it.
- The resume block's `required_resume` and **Next manual action** are declarative
  instructions for Codex to issue next; their presence does not prove that the
  user has already received or performed them. A stop phrase counts for a
  producer action only when Codex's latest explicit manual instruction named
  that same action and asked for that phrase. Never bind a bare `megvan` to an
  unissued resume action from the file or from remembered conversation state.
- Before handing a producer action to the user, verify the expected actionable
  surface from the stable checklist and implementation. When the current UI is
  ambiguous, use the user's screenshot or description; do not inspect the live
  browser. Name only the interaction path already defined by the checklist or
  explicitly corrected by the user.
- When an editable input and its later Review/summary disagree, do not infer
  which display is wrong. Capture the live DOM `value`/typed value, the owning
  component draft/store value and the summary formatter output separately.
  Copy/paste is its own input-event branch: a browser number input may display
  a normalized number while the raw pasted string remains different in the
  application draft. Diagnose and replay that exact event path before Save.
- Ad-hoc CDP inspection is forbidden until the user reports a concrete defect.
  After that report it may inspect only the failing state, must remain
  diagnostic/read-only, and must close only its temporary WebSocket
  connection. Never call a browser-level close command against a managed QA
  Chrome merely to detach an inspector.
- In the Chrome build used by this campaign, CDP
  `Emulation.setGeolocationOverride` and `Browser.setPermission` must both be
  treated as session-scoped: closing their connections can silently restore
  the host geolocation or profile-default permission even though the commands
  returned success. A coordinate-controlled checkpoint must keep its
  launcher-owned target and browser connections alive, record the holder PID
  in the runtime manifest, and terminate that holder with its managed Chrome.
  Prove the application request URL, effective permission and resolved
  partition from a separate read-only inspector before asking for manual
  evidence; differently labelled windows or a successful one-shot command are
  not proof that different coordinates/permissions remain applied.
- `Browser.setPermission(..., setting=prompt)` is not a reliable way to
  reconstruct Chrome's native location prompt. For a real prompt-recovery
  branch, restart only the named launcher-owned actor with that isolated
  profile's geolocation content setting at `prompt`, then use
  `Browser.resetPermissions` while the coordinate holder remains attached.
  Prove `prompt -> granted` from a separate inspector and require exactly one
  application eligibility request from the user's explicit Allow action.
  Never relaunch the other coordinate controls merely to change this actor.
- Public country eligibility gates authentication, not the rest of a public
  landing/demo surface. When an unavailable-country user enters an explicitly
  supported demo, the browser location may drive UI eligibility but must not be
  persisted into a seeded demo profile. The ordinary Logout action must revoke
  the exact tracked backend session as well as clearing local/Firebase state;
  an empty local store alone is not a logout PASS.
- A synthetic browser API replay must reproduce the application's identity
  transport, not merely its JSON body or cookies. In demo mode every API call
  that stands in for Angular `HttpClient` must include
  `X-App-Session-Kind: demo` and the actor-specific `X-Demo-User-Id`; Firebase
  mode must use the current bearer token. Validate the effective actor through
  a read-only identity boundary before the first synthetic mutation. A raw
  `fetch(..., credentials: 'include')` without these headers is not an
  authenticated replay: the non-Firebase dev fallback may select its configured
  default member. If that creates a foreign write, classify it as an
  orchestration error, retain the product evidence that predates it, reset the
  contaminated checkpoint and never hide it with an ad hoc delete.
- A successful static frontend hot-deploy does not replace JavaScript already
  loaded in an open page. Preserve an uncontaminated in-flight transaction and
  finish it without reload when a safe manual correction exists, then replace
  only the checkpoint-managed browser and replay the shortest failing branch
  against the fresh bundle. The watcher build alone is not behavioral proof.
- Before a post-fix replay, compare every participating document's
  `performance.timeOrigin` with the frontend bundle sync time, not only the
  producer's document. If any control still carries terminal counters from a
  prior replay, reload that same managed document and recapture the shared
  pre-action baseline. Mixed client generations are **NOT EXECUTED**, and a
  later poll correcting one stale badge is not evidence for the action-owning
  in-place branch.
- Do not turn obvious navigation or opening an unambiguous card menu into its
  own manual stop. A stop must either produce evidence or protect against a
  real destructive ambiguity. When stable titles/IDs already distinguish the
  target, combine menu navigation and confirmation into the single producer
  instruction; spend the saved stops on meaningful in-place convergence,
  close/reopen or reload reconstruction, negative-control identity stability
  and the independent persisted oracle.
- For isolation checkpoints, prove more than the selected record's expected
  delta: retain one exact adjacent control identity byte-for-byte, observe the
  affected visible count/list without reload, reconstruct the same result on a
  fresh read, verify unrelated actors remain unchanged and prove repeated reads
  create no cross-scope object, counter, outbox or worker effect.
- Before asking the user to select a named candidate, inspect the real
  candidate service/converter and identify its eligibility source; a visible
  user who is outside the target membership is not by itself a selectable
  candidate. Make the checkpoint own every required source record (for
  example a prior `single + met=true` rate, parent membership or contact),
  expose that record in the status oracle, and preflight the authenticated
  candidate endpoint for the exact actor/owner. Require the named target and
  expected total before issuing the producer instruction. If a popup was
  already opened before fixture preparation and does not poll, replay only its
  close/reopen boundary rather than earlier proven steps.
- If an expected manual action is absent, inspect the actor-specific API
  response, authorization/write service and existing behavioral regressions
  before adding or exposing a new control. When the domain explicitly forbids
  that transition and defines a different order, classify it as a QA-sequence
  defect, correct the checkpoint/action order and continue from the current
  intact boundary. Do not implement a contradictory product shortcut merely
  to satisfy the mistaken test instruction.
- Treat Notifications as persisted evidence by default, not as a domain action
  surface. A notification menu owns a business transition only when its actual
  converter/menu implementation exposes that action.
- For a manual recovery action that substitutes for a normally automatic
  producer, preserve the normal scheduler path and test the recovery path
  separately. Persist the recovered domain objects before emitting success
  notifications; order the shared transition notification before derived
  per-object notifications; exclude the initiating actor only from a
  redundant action acknowledgement, not from a derived notification that is
  also relevant to that actor. Prove recipient sets, exact cardinality and
  persisted timestamps before comparing the unread UI ordering.
- Tournament lifecycle notifications must identify their exact semantic
  boundary in persisted payload and visible copy: `{stageTitle} started`,
  `{stageTitle} finalized`, `Advanced to {nextStageTitle}`, or the distinct
  whole-`Tournament finalized` terminal state. Carry stage index/total with
  every system stage row. Render only the left system avatar/icon from the
  shared stage accent-hue calculation; keep the notification row background
  under the independent notification-tone rules. Verify frontend-local and
  live Mongo EN/HU keys together so a fallback-only English row cannot pass.
- For an unread/New notification assertion, stop and inspect New before any
  later action that intentionally resolves or marks that row read. A later
  read row in All can prove persistence and resolution, but it is not evidence
  that the earlier New UI was manually observed.
- Before the producer instruction has actually been issued, an unchanged
  oracle is only the intact pre-action boundary. After a correctly matched stop
  phrase, pair the persisted oracle with the access log. If no expected
  modifying request left the browser because the instruction did not reach the
  real action control, the transaction is **not executed**, not a product FAIL:
  retain the checkpoint, correct the instruction and do not add false failure
  evidence to the QA pack or matrix. If the verified control was activated but
  its binding emits no request, that is a client defect and must enter the
  normal diagnose/fix/replay loop.
- A visible card disappearance does not identify its producer. Before
  attributing it to the user or advancing a lifecycle checkpoint, compare the
  persisted event/membership/counter oracle and the access log with the saved
  action baseline. If no modifying request exists and the persisted boundary
  is unchanged, classify the observation as **NOT EXECUTED**. In particular,
  an AI-triggered restart or setup failure belongs to Codex's repair evidence,
  never to the user's manual action.
- `chrome-target-network.mjs inspect --user-id ... --endpoint-file ...` may be
  used only after the user reports a concrete defect, and only to diagnose
  that defect. It must never resolve a test rule, prepare or navigate the UI,
  or perform a manual producer action.

### 1.3 Context-dependent frontend-local parity

- When a defect is owned by shared frontend code after the HTTP/local service
  adapter boundary (for example a shared store, converter, component or
  in-place mutation projection), treat both adapters as potentially affected.
  Inspect both adapter contracts before closing the repair.
- Execute the equivalent frontend-local transition when that runtime supports
  the same business route, its deterministic fixture can reach the same
  boundary, and doing so does not contaminate the active HTTP checkpoint. Keep
  the HTTP and local observations separately named inside the same testcase;
  adapter parity does not require a duplicate matrix row.
- Static inspection only proves contract compatibility, not runtime PASS. If a
  deterministic local transition is unavailable or would require unrelated
  setup, add the narrowest shared/local regression coverage available and
  record local runtime as **NOT EXECUTED**, with the exact reason. Never infer
  local PASS from an HTTP replay, or HTTP PASS from a local replay.
- The ledger keeps this distinction in the adjacent `Dev` and `Local` columns
  under the workbook's `ENVIRONMENTS` header. Put `X` only where that runtime
  was actually executed, `-` where the session explicitly chose not to execute
  it, and leave the cell empty while the environment decision is still open.
  These markers describe execution coverage; they never change the testcase's
  independent Result.
- For an adapter-specific defect, repair its owning adapter and inspect the
  parallel adapter for the same invariant. Do not broaden the code change when
  the parallel contract is already correct, but run its focused check when the
  affected business boundary is readily reproducible.
- In an HTTP-backed flow, the Java backend owns the durable business
  transition. The operation response may update the UI immediately, but a
  reload must reconstruct the same state from the Java read path. Verify the
  persisted status plus a fresh query/reload independently; if either is
  wrong, repair the Java write/read owner rather than preserving the result
  only in frontend state.
- In frontend-local mode, the equivalent durable owner is the local
  repository/IndexedDB path. Apply the same immediate-versus-reload contract
  there when the local fixture can execute the transition deterministically.
- Record operation-time in-place state, an immediate fresh read and a later
  reload/read as independent observations when the contract needs them. Later
  convergence does not erase an earlier in-place FAIL; an in-place PASS does
  not prove reload persistence.

### 2. Replayable fixtures, never ad-hoc database patches

Every manual case must be independently replayable. New or changed checkpoint
setup belongs in `event-domain-checkpoints.js` (or the corresponding named
scenario file), not in a one-off Mongo edit. Its behavior and transaction
evidence belong in the QA pack; its result/status belongs in the CSV/XLSX
matrix. The resume block contains only the next live boundary.

Fixture ownership must include every persisted object consulted by the tested
read path, even when that object was created by an earlier checkpoint. If a
counter/list mismatch is caused by an inconsistent persisted transaction, fix
the terminal write owner that left the state open; do not mask it in the query
or projection. Add the missed collection to the fixture selectors, reset
cleanup and status oracle. For an already-active legacy state, use one guarded,
versioned repair action that proves the untouched boundary and records a reset
snapshot; never issue an ad-hoc Mongo update or silently restage over it.

A fixture must preserve the production entity hierarchy and the causal UI
route being tested. Do not turn a nested stage, tournament group/room or slot
into a root Activity entity merely to isolate a later action. Before staging,
trace the existing aggregation from the parent counter through every nested
menu to the terminal row, and seed one pending unit at its real write owner.
Member-scoped child chat/notification records may remain independent while the
child itself stays hidden from root event lists. If the first visual read
reveals the wrong hierarchy, classify it as **NOT EXECUTED / invalid fixture**,
reset it guard-first and redesign that same checkpoint; do not convert the
accidental UI into a new workflow test.

Hierarchy alone is insufficient: fixture membership status must also be
reachable from the canonical producer. If a scheduler materializes accepted
members directly and clears pending fields, do not inject a pending child
membership merely to exercise an existing counter. Trace the producer's exact
status transition and UI mutability before staging; an unreachable synthetic
status is **NOT EXECUTED / invalid fixture**, even when its counters render
correctly.

Use the canonical harness against the already-running `mongodb` container:

```bash
# create a clean independent baseline
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  stage event-domain EVENT-TICKET-005

# inspect the current persisted oracle without mutation
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  status event-domain EVENT-TICKET-005

# advance only when the checkpoint definition explicitly owns that transition
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  next event-domain EVENT-TICKET-005

# remove the checkpoint-owned fixture state
bash server/docker/scripts/manual-qa-checkpoints/manual-qa-checkpoints-docker.sh \
  reset event-domain EVENT-TICKET-005
```

The checkpoint is the controlled precondition and replay is the post-fix proof.
After a defect fix, restore the canonical checkpoint and replay the affected
causal chain; do not preserve or manually massage the failed transaction into
a substitute baseline.

Use `restage` only for a checkpoint class supported by the harness; it is
currently restricted to feedback checkpoints. For a stale ticket checkpoint,
follow the guarded `discard-stale` plus image-URL-qualified `stage` recipe in
the resume gate above. Use `switch`/`advance` only when the QA pack says state
is carried into the next checkpoint. Never infer fixture state from
screenshots. First call must have Docker-socket access; a sandbox permission
error is not evidence that MongoDB is stopped and must never cause a second
stack to start.

A read-only landing checkpoint can intentionally exercise public demo login as
a control and therefore create otherwise valid session/audit side effects. Its
cleanup must be a named, guard-first harness command, not an ad-hoc Mongo
delete. Prove every post-stage audit/session belongs to the demo provider and
checkpoint time window; follow audit attempt IDs into security outbox and inbox
rows; reverse unread user counters and `notification-outbox` pendingCount only
for still-tracked owned rows; then delete exact IDs and prove the original
domain counts and country partitions before verify/reset.

### 3. Browser actors are checkpoint data

Before a checkpoint is run, its exact active actors, idle controls and layout
must exist in `browser-session-checkpoints.json`. A persisted server oracle
does not substitute for an actor window when that actor's in-place,
poll-driven, notification, counter or read/reload UI behavior is an explicit
expectation. Conversely, do not launch actors used only as persisted negative
controls. Actor identity is verified by the script after session injection;
do not identify users from Google profiles, window order alone or remembered
sessions.

A managed demo actor must use the same tracked-login contract as the real demo
entry: register `/api/auth/session/login`, persist the exact `sessionId` beside
the demo `userId`, and require an authenticated actor-specific `/api/auth/me`
read before reporting the window ready. URL plus localStorage identity is not a
readiness check: an enrolled actor without `X-App-Session-Id` receives `401`,
which the shell may misleadingly present as `No network`. Replacement revokes
only the launcher's own session IDs and never touches a personal browser or an
unrelated active backend session.

This workstation has exactly three usable Google-account/browser slots, so QA
must never launch more than three managed actor windows concurrently. When one
checkpoint needs UI evidence from more than three identities, split it into
short causally ordered browser phases with separate configuration entries and
replace the previous phase's windows before opening the next. For example,
`EVENT-VISIBILITY-001` uses Casey/Nova/Riley for Save/Publish notification and
ticket convergence, then `EVENT-VISIBILITY-001-EXPLORE` replaces them with
Casey/Lina/Liam for friend/non-friend discovery. This is one domain checkpoint
with two named UI phases, not two simultaneous five-actor layouts and not a new
testcase row. Check memory/swap/CPU before and after every replacement. Keep
personal profile paths and names out of Git.

The application is calibrated for narrow portrait/mobile actor windows. When
a checkpoint uses exactly three managed sessions, always place all three in a
single horizontal row (`columns: 3`) so they remain simultaneously visible
side by side. Do not use a 2+1 layout with the third window below the first two.
Only use fewer columns when the checkpoint actually opens fewer than three
windows or the user explicitly requests a different comparison layout.

The managed launcher treats those three slots as exclusive: before opening a
checkpoint it closes and removes only earlier launcher-owned manifests and
temporary profiles. It must not touch personal Chrome windows or profiles.

### 4. Domain invariants behind ticket tests

- Membership, checkout basket, ticket, users-table counters and notification
  are separate persisted objects/projections; verify each independently.
- A pending membership or admin preapproval is not a ticket.
- A physical ticket is created only at the terminal accepted transition for an
  eligible non-admin participant.
- Admins do not receive participant tickets.
- Publish synchronizes tickets for participants already accepted; later
  approval/acceptance creates only the newly eligible user's ticket.
- Ticket reads and popup opens never create or replace a ticket.
- When one direct action must project across two Mongo documents but the dev
  deployment has no cross-document transaction, the first write stays the
  authoritative CAS and the second write is an ID-scoped, only-if-missing
  projection. The canonical replay path must idempotently repair a missing
  projection from the original persisted identity/time/actor without rewriting
  a completed one. Frontend-local mode performs the equivalent pair in its one
  local state write. Reads must never synthesize the projection.
- A visible domain popup must not indefinitely block global realtime menu
  counters. When popup-specific profile/impressions state must be deferred,
  apply the global counter projection separately and keep the profile cursor
  unadvanced so the deferred snapshot remains replayable after the popup
  closes. Protect counter application with a per-user revision token: a poll
  captured before a newer local/optimistic counter mutation must be rejected,
  not allowed to overwrite it.
- For a normal-poll badge checkpoint, keep the owning popup open across the
  external producer action, verify the realtime response payload independently
  from the rendered menu DOM, and require the item-level badge without reload.
  A total avatar badge is not proof that the named menu counter converged.
- Do not change shared SmartList paging merely because one surface's ordinary
  absolute poll cannot reconcile insertion/removal in a partially filled
  loaded window. First inspect whether an established SmartList extension
  contract already owns that need. For dynamic identity windows, prefer the
  existing Notification-style `pollDelta` contract (`knownItems`, revisions,
  loaded tail, `upserts`, `removedIds`, absolute total) plus `cacheable`
  identity and local sort on that domain surface. Implement the same contract
  behind both HTTP and frontend-local adapters. A shared SmartList core change
  requires proof that the invariant applies to its existing consumers and a
  regression audit proportionate to that cross-surface blast radius.
- A popup foreground task poll owns its domain list, header and corresponding
  menu bucket while that popup is visible. The side-menu realtime poll may
  keep its independent notification lane alive, but must not apply ordinary
  domain counter snapshots under the foreground owner. The foreground result
  updates its items, absolute total and menu counter together. Describe two
  simultaneous writers as a race only when ordering-dependent overwrite has
  actually been demonstrated; ownership overlap alone is not proof of a race.
- Counters come from physical active ticket state and must agree in both
  `tickets` and `asset.tickets` fields.
- The Riley window is an unchanged control unless a checkpoint explicitly
  makes Riley an actor.
- An action emits only its own ID-scoped delta. Normal polling reconciles
  absolute state; it must not manufacture domain writes.
- A successful owner-triggered Publish/Unpublish must update the same
  SmartList source DTO that owns the converted card and shared action menu.
  Require the opposite valid action immediately after confirmation, before a
  periodic poll can hide a stale source/card split. The poll is only the
  convergence proof for another actor's already-open surface; it is never the
  repair mechanism for the producer's own menu.

### 5. Logs and running stack

The running development stack is the only build path for an active QA repair.
Do not start a separate Gradle/npm build, test command that triggers its own
compilation, server, Angular watcher, MongoDB or Compose stack. After a source
change, let the owning hot-deploy watcher build and inspect its existing logs:

```bash
docker logs --since 5m myscoutee
docker logs --since 5m frontend-sync
docker logs --since 5m nginx
```

- `myscoutee`: backend compilation/startup and request-path failures.
- `frontend-sync`: frontend hot-deploy/build result.
- `nginx`: HTTP request timing/routing when a UI action is in doubt.
- Mongo truth comes from the checkpoint `status` oracle, not from log guesses.

Before triggering a source rebuild, and before deciding to restart an owner,
inspect current CPU, available memory and swap pressure (for example `free -h`,
`ps -eo ... --sort=-pcpu` and `docker stats --no-stream`). Use that evidence to
avoid overlapping expensive work and to choose whether to wait or restart.
Record the relevant resource decision when it changes execution.

If hot-deploy does not compile, is stuck or holds a stale cache lock, identify
its exact owning process. Restart only the same server/container owner and then
verify its startup plus hot-deploy log; do not launch a replacement beside it.
Never work around the lock with a different cache, `/tmp`, a second Gradle/npm
process or a standalone build/test compilation. A healthy watcher build and the
checkpoint replay are the active-session verification path.

Do not wait through production debounce windows merely because a manual QA
fixture runs against the dev stack. When the delay itself is not the contract
under test, expose a dev-only configuration override and keep the real worker
path: the event-change and event-member recompute defaults are both `15s` in
`application-dev`; they remain `3m` and `5m` respectively in production.
Record the override in the checkpoint, verify the existing watcher reload, and
never patch an individual task ad hoc. Cases whose purpose is timing/debounce
must override this explicitly and retain their own controlled boundary.

For the profile backend, Gradle continuous `classes` may temporarily remove
compiled outputs before recreating them. Spring DevTools must therefore use a
classpath `.reloadtrigger`, and the existing owner build must touch that marker
only after its successful `classes` completion. A deletion wave is not a safe
restart boundary: if DevTools restarts during it, component scanning can omit
controllers even though the process later reports healthy. Verify at least one
checkpoint-relevant mapped endpoint after the restart, not only container
health or `Started Main`.

Background list adapters must keep transport/server failure distinct from a
successful empty response. Do not catch a `404`, restart disconnect or other
failed request and return `[]`/`total=0`; propagate the failure to the existing
popup task scheduler so it retains the last successful snapshot and retries.
A real successful empty response remains authoritative. Apply this invariant
at the owning HTTP/local adapter boundary and leave the shared SmartList core
unchanged unless cross-consumer evidence proves a shared defect.

Treat watched Mongo seed files as runtime-mutating inputs, not passive test
sources. Before editing one during an active checkpoint, inspect the running
`mongodb-sync` import mode. A replace-collection import can delete every live
manual-QA transaction in that collection before reimporting the seed and can
leave dependent runtime documents orphaned. Do not edit a watched seed while
transaction evidence is live unless the checkpoint has an explicit export and
replay boundary or the sync service is proven to use a non-destructive
preserve/upsert mode. A Git backup does not protect Mongo runtime state.

### 5.1 Git HEAD backups during the session

The user may periodically commit the current work as a backup, moving the
working state into Git HEAD. When previously modified files disappear from
`git status` or `git diff`, do not interpret that alone as a rollback or lost
work. Re-read the current HEAD/file contents and continue from the persisted QA
resume pointer; never reconstruct or reapply already-backed-up changes merely
because the worktree became clean. Treat a backup as incorrect or reverted
only when the user explicitly says so.

### 6. Recording and communication

During the active manual-QA campaign, keep the hot-deploy output directory
`server/docker/conf/nginx/app/myscoutee/` locally excluded from ordinary Git
status and commits. Its hashed bundles are generated verification artifacts,
not source changes to recommit after every frontend edit. Use the repository-
local `.git/info/exclude` for new bundle names and local `skip-worktree` flags
for already tracked bundle files; never add personal transient rules to the
versioned `.gitignore`. Before a deliberate release/package commit, remove
both local exclusions, regenerate once through the owning frontend watcher,
review the complete output delta, and include it only when that release
workflow explicitly owns the built assets.

After every transactional boundary, including a partial PASS inside a larger
checkpoint:

1. Run the independent `status`/named oracle.
2. Report the result in one compact message: `PASS` or `FAIL`, the decisive
   persisted facts, and what remained unchanged.
3. Append the transaction evidence to the active QA-pack test definition.
4. Update the canonical matrix CSV with the current date, evidence and next
   oracle. Keep the row `IN PROGRESS` until the checkpoint's full chain passes.
5. Run `python3 guides/qa/tools/sync-qa-matrix-xlsx.py`; the generated XLSX owns
   status coloring and aggregate counts. Its top summary and every domain
   `passed / total (%)` value must remain worksheet formulas over the hidden
   status/scope helpers with full recalculation on open; never hand-count or
   hard-code those aggregate values during a checkpoint close.
6. Update only the YAML resume pointer and next manual action in this file. Do
   not copy the detailed evidence or ledger row here.
7. Give the next exact manual action. State `Next test: <ID> — ...` only
   when the current checkpoint is fully closed and the ledger has been updated.

This order is the session-efficiency rule: persisted oracle first, canonical
records second, compact resume pointer last. It prevents re-deriving completed
methodology or mistaking a substep PASS for a closed checkpoint.

On FAIL, stop that branch after collecting the smallest decisive evidence.
During an active QA session, FAIL is not a user decision point: Codex
immediately diagnoses and fixes the owning domain contract at the correct
scope, uses the existing hot-deploy owner and its logs for build verification,
then resets/stages the replayable fixture and replays the same checkpoint. A
"minimum/local fix" is not a goal when it would preserve a broken invariant or
create a special-case path. Before changing persistence semantics, inspect the
parallel adapter and relevant git history so `save`, state transition, audit
and read-model meanings are preserved consistently. Ask the user only when new
authority or a materially different product decision is actually required.
Never continue from or accept a partially mutated baseline as the next test's
setup; the checkpoint and replay harness exist specifically to make this
repair-and-clean-replay loop deterministic.

## Ordered continuation

The completed ticket, visibility, invitation, chat, demo-registration,
consent, lifecycle and functional landing checkpoints retain their evidence.
The current Tournament block order is:

```text
TOURNAMENT-001 through TOURNAMENT-004 (closed)
-> TOURNAMENT-ROOM-LIFE-001 (closed)
-> TOURNAMENT-CARD-001 (closed)
-> TOURNAMENT-ADMISSION-001 (closed; HTTP/Java PASS, frontend-local NOT EXECUTED)
-> TOURNAMENT-SCORE-REOPEN-001 (closed)
-> TOURNAMENT-SCORE-REOPEN-002 (closed; fixture reset)
-> TOURNAMENT-MEMBER-001 (closed)
-> TOURNAMENT-MEMBER-002 (closed; widened cross-group chat isolation replay PASS)
-> TOURNAMENT-MEMBER-003 (closed; four-person participant fan-out PASS)
-> TOURNAMENT-DQ-001 (closed; DQ/Reinstate, Impression and advancement PASS)
-> TOURNAMENT-RESOURCE-001 (closed; generated-group resource aggregation PASS)
-> JOB-TOURNAMENT (Core closed; generic Monitoring covered by ADMIN-MONITORING-001)
-> CHAT-FLOW-001 (closed; consolidated everyday conversation and recovery)
-> CHAT-ACTIONS-001 (closed; consolidated message action lifecycle)
-> CHAT-CONTENT-001 (closed; consolidated rich-content conversation)
-> CHAT-GOVERNANCE-001 (closed; consolidated members and moderation intake)
-> CLEANUP (closed; exact no-fixture/no-snapshot gate PASS)
-> QA-RESET-001 (closed; Nova reload/UI plus persisted zero-state PASS)
-> LANDING-ELIGIBILITY-001 (closed; local regional eligibility branches PASS)
-> ROLE-TRIAD-CORE-001 (closed; complete three-role journey PASS)
-> JOB-PURGE (closed; final Identity & access checkpoint)
```

Tournament is 15/15 complete, QA infrastructure is 2/2 complete and Identity &
access is 8/8 complete. Select the next checkpoint from the canonical
matrix; do not replay
the closed role-triad, consent/session/landing cases, closed Chat desktop journeys or
closed Tournament fixtures unless their owning code or contract changes. The
physical-device Chat boundary is retained in `MOBILE-PUSH-LIFECYCLE-001` and
uses an Operator-tested Firebase revision in the QA environment.

Configuration, including the Firebase activation and fresh-sign-in checkpoint,
is owned by `OPERATOR-CONFIGURATION-LIFECYCLE-001`; physical Chat push is owned
by `MOBILE-PUSH-LIFECYCLE-001`; registry activation/deactivation is owned by
`OPERATOR-REGISTRY-LIFECYCLE-001`. No Deployment testcase remains in Pair QA.
The Operator sequence follows the same priority ordering as every other Pair-QA
domain. Member payment history and saved cards are behavior owned by Event; Payment is
not a separate QA domain.

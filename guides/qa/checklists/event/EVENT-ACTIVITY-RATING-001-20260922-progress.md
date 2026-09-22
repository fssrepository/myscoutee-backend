# EVENT-ACTIVITY-RATING-001 — execution log, 2026-09-22

**PASS / CLOSED — corrected expectations and numbered coverage completed.**

The earlier closure after only two core replays was premature. The user asked
to update the checklist from the conversation and automatically check its
remaining steps. Accepted manual observations and existing proof were retained;
the continuation did not reset or repeat the accepted rating transitions.
No application code was changed.

## Numbered coverage

| Step | Result | Evidence and boundary |
| --- | --- | --- |
| 1 | PASS | Both dedicated actors; all four actual Preferences buckets and each side-menu total 1 checked in the two core run records. There is no separate Rates All bucket. |
| 2 | PASS | No-meeting input 9/0, Given/Received, Met=false, no events/friendship. Existing Standard score/identity preservation is separately retained under step 9. |
| 3 | PASS | Speed meeting worker-created 0/0 Met, then UI Save 9/0 and Given/Received. |
| 4 | PASS | One-sided bucket observations recorded before Nova's reciprocal Save; user's prior manual exploration retained. |
| 5 | PASS | No meeting: 9/6 Mutual with no friendship; meeting: 9/6 Met with one friendship. Both viewer buckets and persisted score orientation checked. |
| 6 | PASS — new automatic continuation | Normal UI changes to Casey 4 / Nova 9 persisted. Both sliders reopened and checked, then both pages reloaded normally and sliders checked again: own scores 4 and 9. Shared stored row proves reciprocal perspectives 4/9 and 9/4. |
| 7 | PASS — new automatic continuation | Independent stored friendship count 1, submitted feedback count 0 after rating changes. No nonexistent Friends menu or unrelated Contacts list is required. |
| 8 | PASS — corrected two-user expectation | Nova opened the normal event feedback entry. One pending event/host card for Casey, one event step plus Overview, no per-table flow and no submission. Casey is the host, so no duplicate attendee card is expected. Independent non-host peer deduplication remains covered by Event Mode regression, not newly claimed here. |
| 9 | PASS — retained evidence reviewed | Historical Standard projection preserved prior 9/4 scores, record ID, sync key, creation time and actors while adding Met. This is prior projection evidence, not a fresh 9/0 or isolated Tournament UI replay. Separate Standard/Tournament bucket systems are not required by the agreed expectations. |
| 10 | PASS | Evidence saved; versioned launcher closed only the two managed sessions and restored session snapshots; versioned reset restored scoped fixture snapshots. Status is now not-staged. |

## Evidence

- [No-meeting core run](../../evidence/EVENT-ACTIVITY-RATING-001-auto-before-meeting-2026-09-22.json)
- [Meeting core run](../../evidence/EVENT-ACTIVITY-RATING-001-auto-speed-meeting-2026-09-22.json)
- [Step 6 persisted Saves before runner selector correction](../../evidence/EVENT-ACTIVITY-RATING-001-step6-saved-before-runner-selector-fix-2026-09-22.json)
- [Step 6 reopen and reload continuation](../../evidence/EVENT-ACTIVITY-RATING-001-auto-speed-meeting-remaining-2026-09-22.json)
- [Steps 7–9 outcome checks](../../evidence/EVENT-ACTIVITY-RATING-001-auto-speed-meeting-outcomes-2026-09-22.json)
- [Pre-cleanup state](../../evidence/EVENT-ACTIVITY-RATING-001-before-cleanup-2026-09-22.json)
- [Cleanup status](../../evidence/EVENT-ACTIVITY-RATING-001-cleanup-2026-09-22.json)
- [Closure record](../../evidence/EVENT-ACTIVITY-RATING-001-closure-2026-09-22.json)

Runner-only corrections: rating is an anchored menu with Escape dismissal,
not a Cancel-button dialog; reload must wait for the menu launcher; feedback
close must wait for the previous popup transition. The 4/9 Saves already
succeeded, so verification resumed from that stored state without re-rating.
These runner issues were not application failures. Evidence of the initial
selector failure is retained, with the successful continuation separate.

No viewport override, application build/server, feedback submission or release
was performed. Worker timing was restored before continuation. Future automatic
room creation and a fresh isolated Tournament rating run are not claimed.
Earlier pending/closure notes below are historical and superseded by this table.

## Historical execution and corrections

## Prepared and independently read

- Two dedicated actors: Casey Rating QA (`6a00000000000000000000a1`),
  Nova Rating QA (`6a00000000000000000000a2`). Original demo identities retained.
- `all` fixture: Standard, Tournament and Speed meeting events coexist, each
  with both actors accepted. Completed history is seeded prerequisite data.
- Real event-counter-expiry worker projected Standard/Tournament once and
  both completed Speed meeting rounds. A single shared Met relationship exists
  at 0/0; zero friendship and zero submitted feedback records.
- The worker schedule was restored after projection. `ready` captured the
  evidence baseline. Stage/ready/reset/restage/ready was exercised; no user
  checklist action was replayed.
- Standardized launcher created and authenticated both isolated Chrome profiles
  at 01:16:22–25 UTC. Native windows are 900×900, positioned side by side;
  no viewport emulation. Manifest and both live Chrome processes were checked.
- Follow-up read-only fixture status retained that same zero-score baseline.

Evidence: [machine-readable preparation](../../evidence/EVENT-ACTIVITY-RATING-001-2026-09-22.json).

## Pending manual observations

1. Counterpart card, initial buckets and event context.
2. One-way 8/0 save, Given/Received and persisted shared row.
3. Reciprocal 8/6, viewer orientation and Met mapping.
4. Changes to 4/9, reopen/reload and free exploration.
5. Friendship/feedback separation and one distinct Speed meeting peer.
6. Explicitly requested per-format replays and eventual scoped cleanup.

These are pending observations, not successful test results. The fixture tests
rating input from prepared completed history; it does not re-prove Tournament
scoring or Speed meeting runtime transitions. Browser actions now belong to the
user. Do not automatically reset or relaunch while they are exploring.

## Combined-source acceptance and Standard handoff

The user reported “jó lett” and requested a different event type. The previous
fixture was `all`, not Speed meeting alone. Before reset, independent status
showed one Met row with Casey given **9**, Nova given **4**, **one friendship**
and **zero submitted feedback**. This proves persisted reciprocal scores and
friendship, alongside the user's acceptance; it does not individually prove
every numbered observation or the unsubmitted feedback sequence.
Evidence: [combined final state](../../evidence/EVENT-ACTIVITY-RATING-001-all-final-2026-09-22.json).

At the user's request, only these managed sessions were closed and the fixture
reset through the versioned harness. `stage ... standard` and the real worker
produced a fresh Standard-only Met source, **0/0**, no friendship or answers.
Tournament and Speed meeting remain future events; no completed rounds exist.
`ready` restored the worker schedule. Initial readiness correctly refused before
the worker ran; the subsequent check passed without seeding its result.
Evidence: [Standard baseline](../../evidence/EVENT-ACTIVITY-RATING-001-standard-ready-2026-09-22.json).

Next manual action: step 1 with **QA RATING · Standard** in both windows.
No Standard rating action has been performed by Codex. Separate Tournament and
Speed meeting observations remain pending.

## User correction: distinguish the two rating prerequisites

The user clarified that the accepted previous case was **no prior rate, but a
meeting already occurred**. It is not evidence for Standard/Tournament's
pre-existing-rate path. The short-lived Standard 0/0 preparation above is
superseded; its recorded read remains in
[the superseded baseline](../../evidence/EVENT-ACTIVITY-RATING-001-standard-empty-superseded-2026-09-22.json).

The versioned fixture now supplies a pre-existing single reciprocal rate for
Standard/Tournament, Casey9/Nova4, `met:false`, created before the event, ID
`qa-rating-001-existing-rate`. These scores are **input**, not claimed manual
rating results. No friendship or Met output is seeded. Readiness checks the real
worker preserves ID, sync key, creation date, participants and scores and adds
Met, without duplication. Speed meeting retains the separate no-prior-rate case.

Corrected Standard readiness PASS: the real worker retained the prior record
ID/sync key/creation date and9/4 scores, added `met:true` and Standard context,
and projected one friendship. Zero feedback answers. Job timing restored.
[Before/after evidence](../../evidence/EVENT-ACTIVITY-RATING-001-standard-existing-rate-2026-09-22.json).
Two managed sessions prepared for manual replay. Next: guide steps1–2, Casey9/4
and Nova4/9 in Met. Tournament's existing-rate variant remains unexecuted.

## One-sided prerequisite correction

The user explicitly requires only one actor pre-rated, so they can inspect the
bucket lists before reciprocating. The previous9/4 preparation bypassed that
observation and is superseded. It is not a manual pass. The fixture now starts
**Casey9 / Nova0**, mutuallyRated=false, Met=false before the worker. No prior
friendship is seeded. Readiness requires preserved9/0 plus real meeting evidence
and zero friendships. The user owns the later reciprocal rating.

Next: inspect **all rate buckets in both windows before any save**. Given should
contain Nova for Casey; Received should contain Casey for Nova. Record All,
Mutual and Met too. Do not automatically progress to reciprocal rating.

## Current correction: no event has occurred

The user clarified the intended chain: one-sided rate, then mutual rate, then a
possible later system-arranged meeting. Event formats are not the distinction
for this initial bucket inspection. The previous meeting-bearing baseline is
superseded. Added the versioned `before-meeting` variant and reset/restaged only
the isolated fixture. Readiness verified Casey9/Nova0, Met=false, exactly one
rate, **zero events/rounds/friendships/feedback answers**. No worker timing change.
[Persisted baseline](../../evidence/EVENT-ACTIVITY-RATING-001-before-meeting-2026-09-22.json).

The user accepted earlier meeting/rating visibility; neither this nor fixture
preparation proves later automatic room/event creation. No reciprocal rating or
bucket navigation was performed by Codex. Managed launcher prepares the two
windows; the user inspects Given/Received/All/Mutual/Met and decides when to rate.

## Mutual accepted; side-menu fixture count repaired

User observed and accepted the transition to Mutual. Independent read retained
one row with Nova as owner, given8/received9, Met=false, zero events and
friendships. Owner orientation reflects the last rating writer; it is the same
shared record. The side-menu badge was discussed separately. Final instruction:
retain total-rate count semantics; populate the fixture baseline accordingly.

`stage` now supplies activities.game=1 to both profiles for a pre-existing rate.
`ready` supplies1 after the real worker creates the meeting row. The versioned
`repair-rate-counters` command repaired the live fixture without reset or browser
relaunch. Before/after comparison preserved rates, events, rounds, friendships,
feedback and prior input. Both counters are1. JS/shell syntax and diff checks
passed. No application code or bucket calculation was changed for this repair.
[Scoped evidence](../../evidence/EVENT-ACTIVITY-RATING-001-badge-fixture-2026-09-22.json).

## Requested quick reset for badge inspection

Versioned close/reset/stage-before-meeting/ready/launcher sequence completed.
Readiness verified one rate9/0, Met=false, no events/rounds/friendship, and both
activities.game counters1. [Reset evidence](../../evidence/EVENT-ACTIVITY-RATING-001-badge-reset-2026-09-22.json).
Next user observation: side-menu Rates1 on both profiles; Given for Casey,
Received for Nova. Prior Mutual test acceptance is retained, not replayed by Codex.

## Delegated automatic confirmation

After manual acceptance the user authorized a quick automatic replay of the
same two core cases. The detailed QA guide has been restored; no actors,
fixture commands or extra checks were deleted. Additional steps remain clearly
separated from this delegated replay. Versioned runner:
`guides/qa/tools/run-event-activity-rating.mjs`, requiring `--delegated`.
Use only with explicit browser-flow authorization and a verified baseline.
Execution results will be recorded separately from the prior manual PASS.

The before-meeting automated core replay passed through normal browser actions:
initial Casey Given/Nova Received, other single-rate buckets empty; Nova saved6;
normal sync persisted Casey9/Nova6 with Met=false; both then showed Mutual and
side-menu badge1. Evidence:
[automatic before-meeting replay](../../evidence/EVENT-ACTIVITY-RATING-001-auto-before-meeting-2026-09-22.json).
Initial runner-only selector/guide-dismissal issues were corrected before the
successful run; they required no application changes or rating-data injection.

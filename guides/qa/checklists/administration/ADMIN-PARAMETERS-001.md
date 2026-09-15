# ADMIN-PARAMETERS-001 — Section-specific persistence, effects and validation

## Purpose

Verify one controlled value in each of Matching, Profile, Events, Assets,
Discovery, Notifications and Jobs, including its real consumer effect,
section-specific records, invalid-input behavior and restoration.
**Actor:** Ava Moderation; Codex prepares the named consumer identities/data.

## Fixture prerequisites and previously tested work

Monitoring block 3 owns the editor/History/revert/no-op interaction once.
Do not repeat that UI sequence seven times. Fixtures prepare each branch and
restore its baseline; the Jobs branch also receives its previously tested
saved value through a fixture. The other six sections each retain one real
field save because their persistence and downstream consumers differ.

Codex checks each actual section save against the records below without
reopening History or clicking through another notification lifecycle:

| Record | Required section-specific check |
| --- | --- |
| Configuration | Exact normalized value, correct section, one new version, author/time/summary; other sections unchanged |
| Recompute | Expected generic enqueue and target scope, pending/running/terminal state and result, according to the field's existing behavior |
| Admin notification | Correlated logical outbox, expected recipients/projections and actual terminal delivery; no self-invented recipient rules |
| Monitoring/audit | Version-to-config-event correlation, task/delivery transitions and identified background controls |
| Consumer | The causal result listed below; a successful save or completed task alone is insufficient |
| Restoration | Fixture restores original values and data; consumer output returns to its baseline where this branch changes it |

A fixture write is preparation, not evidence of a real save or History revert.
The common History interaction is linked to Monitoring; the section records
above remain independent requirements. Previously proved graph controls,
checkout, rating and bell/read journeys are fixture prerequisites, not reruns.

## 1. Baseline and expected changes

1. Open **Params** and confirm all seven sections are available. Codex records
   their versions/values, related tasks/outbox, consumer outputs and controls.
2. Codex declares one exact old → test value per section, the predicted effect,
   relevant bounds and restoration scope. Change only one section at a time;
   fixture-owned work must finish before that branch is restored.

Report: `ADMIN-PARAMETERS-001 block 1 done`.

## 2. Matching and Profile

3. In **Matching → Edit**, change the prepared rating/evidence multiplier and
   save once. Reopen that section: the exact value persists.
4. Let the normal recompute finish. Compare the controlled pair's affinity/edge
   change with the predicted signal; unrelated input/control data stays stable.
   The fresh Graph and Statistics summary agree with the resulting graph data.
5. Codex checks this save's section records, then restores the fixture and
   verifies original configuration and consumer result. No repeated History clicks.
6. With the Profile fixture ready, save the named **Profile** rule or absolute
   multiplier once and reopen the section to check its normalized value.
7. Compare the prepared profiles' absolute/affinity scores or ordering with
   the predicted trait/profile effect. Any graph change must follow that signal;
   verify unaffected controls and the corresponding task/audit/notification.
8. Codex restores Profile and verifies its baseline before continuing.

Report: `ADMIN-PARAMETERS-001 block 2 done`.

## 3. Events and Assets

9. In **Events**, save the prepared content/boost multiplier once and reopen
   to verify it. Events and participants are supplied by fixture, not created again.
10. Compare the two prepared events' recommendation order/scores in the consumer
    UI and stored output. Check this save's records and controls, then restore.
    A generic user recompute enqueue does not by itself prove Event ranking.
11. In **Assets**, save the named content/capacity/quantity/boost field once and
    reopen. Codex supplies the resources and relevant usage data through fixture.
12. Compare resource scores/order with the predicted effect. Check section records
    and controls, then restore. User graph edges are not proof of Asset ranking;
    the Event and Asset branches use their own consumer outputs.

Report: `ADMIN-PARAMETERS-001 block 3 done`.

## 4. Discovery, Notifications and Jobs

13. In **Discovery**, save the prepared distance multiplier/boundary/strategy
    field once and reopen. Fixture profiles cover either side and the exact boundary.
14. Verify ranking/affinity and relevant edge visibility against the documented
    distance rule. Check section records and controls, then restore the fixture.
15. In **Notifications**, save **Multicast threshold** for the prepared recipient
    set once and reopen. Codex states which direct/multicast outcome is expected.
16. Process the controlled delivery through the real path. Compare selected strategy,
    target count, outbox/task outcome and recipient projections. Fixtures supply
    device/permission state; do not repeat registration, permission or bell/read tests.
17. Codex restores the threshold through the fixture and verifies the baseline
    delivery strategy on the controlled input. Keep the configuration-change
    Admin notification separate from the notification used to test the threshold.
18. For **Jobs**, Codex supplies the debounce configuration and isolated task by
    fixture, reusing Monitoring's save/reopen evidence. Observe the actual due time
    and worker execution against the configured debounce.
19. Compare task timing, pending/terminal tracking and output with that value;
    do not shorten the interval whose timing is under test. Codex restores the
    original Jobs configuration and task baseline without repeating History.

Report: `ADMIN-PARAMETERS-001 block 4 done`.

## 5. Validation and cancellation

20. In the prepared numeric field, attempt a value below the documented minimum.
    Verify the defined rejection/normalization and resulting displayed/stored value.
21. Attempt a value above the maximum. Check the same contract independently;
    rejected saves must not partially change configuration.
22. Check the supported strategy choices. Codex verifies invalid server-side text
    is rejected; do not insert a nonexistent option into the UI selector.
23. Change a valid value, then close without saving. Reopen: the original value
    remains. Codex verifies no new version, task, config event or notification
    from cancellation or either rejected save.

Report: `ADMIN-PARAMETERS-001 block 5 done`.

## 6. Closure

24. Codex compares every section's exact baseline values, controls, terminal work
    and notification projections. Real version/audit records remain attributable;
    cleanup must not be confused with a successful application History operation.
25. Record each section's persistence, consumer, side-effect and restoration proof,
    plus the referenced Monitoring History evidence. A pass for one section does
    not close another. Restore the complete fixture/session baseline.

Report: `ADMIN-PARAMETERS-001 done`.

## Original matrix coverage

| Source | Owning checks |
| --- | --- |
| PARAM-001 | Section records and real saves in blocks 2–4; editor/History/revert UI owned once by Monitoring block 3, repeated preparation/cleanup by fixture |
| PARAM-010 | Block 2 Matching signal, recompute, graph/Statistics and controls |
| PARAM-011 | Block 2 Profile score/order and attributable graph effect |
| PARAM-012 | Block 3 Event ranking and generic save side effects |
| PARAM-013 | Block 3 Asset ranking and generic save side effects |
| PARAM-014 | Block 4 distance boundary, ranking/affinity/edge effects |
| PARAM-015 | Block 4 direct/multicast choice, exact targets and restored strategy |
| PARAM-016 | Block 4 persisted Jobs value reused; real worker timing checked here |
| PARAM-017 | Block 5 lower/upper bounds, invalid strategy and cancellation atomicity |
| STATIC-SMOKE | Section rendering/normalized values on reopen; no extra repeat of common forms |

## Execution boundary

Dedicated per-section fixture scripts are prepared when this checkpoint starts.
Do not mark unexecuted section effects as passed because the shared editor works.
Waiting windows unrelated to the behavior under test may be shortened by scoped
fixture preparation while preserving normal worker execution.

# ADMIN-PARAMETERS-001 — Parameter effects and validation

## Purpose

Check the specific effect of a parameter in each of the seven sections,
invalid values and cancellation. **Actor:** Ava Moderation. Codex prepares
consumer data and any required member sessions through fixtures.

## Fixture prerequisites

Monitoring block 3 owns the shared save/reopen/History/revert checks. Do not
repeat them here. Fixtures provide the Jobs test value and restore every
branch. Do not replay Graph controls, Monitoring filters or notification
lifecycles. The other six sections still require their own field save because
they handle different data; their consumer effects are distinct checks.

## 1. Procedure for each section

1. Open **Params**. Codex states the exact old → test value and expected
   effect for the section, and snapshots the baseline through the fixture.
2. Change the named field under **Edit** and save once. Reopen to confirm
   that section’s persisted value. For Jobs, the fixture supplies the value
   instead of repeating the save already tested in Monitoring.
3. Check the section-specific effect below. Codex compares stored results,
   waits for the required work, then restores the baseline through the fixture.

## 2. Matching and Profile

4. **Matching:** apply steps 1–3 to one rating/evidence multiplier. Codex
   prepares a pair with an isolated signal. The recalculated weight changes
   as predicted; the fresh Graph and Statistics graph data agree.
5. **Profile:** use one profile/trait rule or absolute profile multiplier.
   The named score or ordering changes; interpret control-profile differences
   against the selected field.

Report: `ADMIN-PARAMETERS-001 block 2 done`.

## 3. Events and Assets

6. **Events:** apply steps 1–3 to one content/boost multiplier. The two
   prepared events’ scores or recommendation order change as predicted;
   compare the event UI and persisted scores.
7. **Assets:** use one resource content, capacity, quantity or boost field.
   Prepared resource scores/order match expectations. User graphs do not
   measure Event or Asset ranking effects.

Report: `ADMIN-PARAMETERS-001 block 3 done`.

## 4. Discovery, Notifications and Jobs

8. **Discovery:** use one distance multiplier, boundary or strategy field.
   Fixture profiles on either side of the boundary verify ranking and the
   exact boundary behavior.
9. **Notifications:** apply steps 1–3 to **Multicast threshold** with a known
   recipient count. Codex checks the direct/multicast transition in real
   delivery items, using fixture recipients instead of replaying their journeys.
10. **Jobs:** the fixture sets the debounce value whose save was tested in
    Monitoring. Verify that one isolated task actually uses that value.
    This checks runtime timing, not the previously verified editor/history.

Report: `ADMIN-PARAMETERS-001 block 4 done`.

## 5. Invalid values, cancellation and closure

11. Try values below and above the documented bounds of the prepared numeric
    field. UI/server follow its validation or normalization contract;
    a rejected save must not partially persist.
12. Check supported values in the selected strategy field. Codex separately
    verifies rejection of an invalid server-side value; do not inject a
    nonexistent option into the UI selector.
13. Edit a value and close without saving. Reopen: the original value remains,
    with no new version, task or notification.
14. Codex verifies restored values across all seven sections, terminal work
    and controls, then restores the full fixture baseline.

Report: `ADMIN-PARAMETERS-001 done`.

## Execution boundary

Exact values and consumer data come from each section’s fixture, never from
arbitrary live configuration edits. Dedicated fixture scripts and browser
startup are prepared when this checkpoint starts.

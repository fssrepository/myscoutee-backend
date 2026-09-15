# ADMIN-AFFINITY-GRAPH-001 — Graph controls and larger datasets

## Purpose

Check relationship depth, weight filtering, viewport controls, isolated members
and loading a larger graph. **Actor:** Ava Moderation.

## Fixture prerequisites

BELL-RATING steps 13–15 and the retained Statistics evidence own rating input,
the direct control-pair link, real graph materialization and historical-data
preservation. Do not repeat those actions here. Codex prepares the completed
graph, control edge and isolated member through fixtures and records the
source evidence separately from the prepared state.

## 1. Depth and weight

1. Open **Graph** and select the named fixture member. This positions the
   view for testing; do not repeat the earlier group/member-selection checks.
   Overview totals must match the fixture.
2. Change **Link depth** from **Direct / 1** to the next supported level and
   back. Added and removed members belong to the corresponding neighborhood.
3. Move the **Link range** lower and upper bounds across the control edge’s
   weight. Edge visibility and visible-link counts follow the selected range.

Report: `ADMIN-AFFINITY-GRAPH-001 block 1 done`.

## 2. Viewport controls and isolated member

4. Restore the range. Pan, rotate and zoom using the displayed controls;
   selection and filter values remain understandable.
5. Use **Reset**, then **Expand / Collapse**. The graph and details fit the
   window and the controls remain usable.
6. Select the fixture’s isolated member. Their profile remains accessible
   and shows zero connections.

Report: `ADMIN-AFFINITY-GRAPH-001 block 2 done`.

## 3. Larger graph and closure

7. Codex prepares a larger graph with multiple components through a fixture.
   Open it and zoom into the named group. Further members load progressively
   while the view remains usable. Codex checks loading bounds and repeated requests.
8. Codex records the results and restores the fixture exactly.

Report: `ADMIN-AFFINITY-GRAPH-001 done`.

## Execution boundary

The dedicated fixture script is prepared when this checkpoint starts.
Prepared data is not PASS: the controls above require actual verification.
Previously tested paths retain their original evidence.

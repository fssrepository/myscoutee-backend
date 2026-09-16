# ADMIN-AFFINITY-GRAPH-001 — Graph exploration, loading and materialization

## Purpose

Verify graph totals, component/member navigation, neighborhood depths, weight
filters, viewport controls and bounded loading. Correlate the displayed graph
with its actual materialized version and preserve historical/control evidence.
**Actor:** Ava Moderation.

## Fixture prerequisites and previously tested work

Codex prepares a known graph, component, member, control edge, isolated member
and larger/disconnected dataset. Record exact expected IDs, counts, weights,
loading budgets and layout versions from the existing contract before testing.

Reuse BELL-RATING steps 13–15 for its actual Casey/Nova edge, normal layout
scheduler and preserved controls, and the recorded STAT-020 historical checks.
Do not replay rating saves or a proved scheduler run. Fixtures provide their
resulting state here. These proofs do not automatically cover overview totals,
all depths, bounded loading or every stored/header count; those remain below.

## 1. Overview and component loading

1. Open **Graph** on the prepared layout. The canvas loads without duplicate
   badges or a blank view. Record its active layout version.
2. Compare Members, Links, Components and Isolated totals with the fixture oracle.
   Codex checks stored node/edge/forest counts against the layout header.
3. Select the named component. Observe bounded loading and its expanded members;
   visible/collapsed counts agree with the component data. This verifies loading
   and counts rather than repeating the previously proven selection gesture.
4. Select the named member. Profile identity, member details and strongest
   connections match the stored neighborhood and displayed rounded weights.

Report: `ADMIN-AFFINITY-GRAPH-001 block 1 done`.

## 2. Neighborhood depth and weight filters

5. At **Link depth 1**, record the visible member/edge IDs. Reuse the already
   proven direct-pair result where applicable; the fixture supplies its baseline.
6. Change depth to **2**. Added members/edges belong to the second neighborhood
   and respect the configured bounds.
7. Change depth to **3**, then return to **1**. Neighborhoods are bounded supersets
   where the contract permits; returning creates no duplicate nodes or edges.
8. Move the **Link range** minimum across the control edge's weight. Only edges
   within the range remain; visible and total labels describe the correct counts.
9. Move the maximum across the control weight, then restore both bounds. Verify
   the boundary behavior against the defined filter contract and retained controls.
10. Verify isolated members remain available when edges are filtered. Changing
    the live filter does not rewrite the persisted Statistics graph summary.

Report: `ADMIN-AFFINITY-GRAPH-001 block 2 done`.

## 3. Viewport and isolated-member controls

11. Pan and rotate using the displayed controls. Selection and filter state remain
    consistent with the supported interaction.
12. Exercise wheel/pinch zoom and arrow-pan on their supported input surfaces.
    Progress and visible detail follow zoom/loading; record the tested input mode.
13. Use **Reset**. The view returns to its defined overview state.
14. Use **Expand / Collapse**. The graph and member panel fit the popup/window;
    controls and profile details remain accessible. At mobile viewport sizes,
    the panel may overlay the graph: opening/closing it must preserve camera,
    zoom and node positions. At desktop sizes, the graph fits beside the panel.
    Verify the initial small component is readable and fits at 360/390px widths;
    actual viewport resizing may refit the default view without locking controls.
15. Select the named isolated member. The correct profile and zero connections
    appear; the member is not lost because it has no edge.

Report: `ADMIN-AFFINITY-GRAPH-001 block 3 done`.

## 4. Larger/disconnected graph

16. Codex supplies the larger fixture directly. Open it and expand the named
    components, without repeating their data-creation journeys.
17. Follow component paging and zoom-driven detail loading. Codex compares forest,
    tile and neighborhood requests with their defined limits and returned counts.
18. Select the prepared distant/disconnected member. It stays reachable; loading
    completes without a request loop, duplicate results or a blank canvas.

Report: `ADMIN-AFFINITY-GRAPH-001 block 4 done`.

## 5. Version, changed output and historical controls

19. Codex correlates the retained real layout run with its newer `layoutVersion`,
    start/terminal audit and completed upstream recompute. Reuse complete Bell
    evidence; only an unproven correlation needs another scoped normal run.
20. Reopen Graph and compare the active version, header and stored node/edge/forest
    totals. No rating journey is repeated to prepare this state.
21. Verify the changed pair's weight/neighborhood/component and the unaffected
    control against the materialized data. Reuse the exact Bell assertions already
    proved; retain any still-missing affinity/discovery output assertion separately.
22. Compare the fresh graph summary with Statistics after its normal refresh.
    Reuse the proved historical immutability result; check any missing current
    count/version correlation without redoing the old-date test.
23. Codex retains all new and reused evidence, waits for fixture-owned work to
    finish and restores original graph/configuration/session state exactly.

Report: `ADMIN-AFFINITY-GRAPH-001 done`.

## Original matrix coverage

| Source | Owning checks |
| --- | --- |
| BASE-GRAPH | Block 1 overview and stored/header totals |
| GRAPH-002 | Block 1 component loading/counts |
| GRAPH-003 | Blocks 1–2 member panel, strongest links and depths 1/2/3 |
| GRAPH-004 | Block 2 range bounds, visible totals and isolated members |
| GRAPH-005 | Block 3 viewport, progress, reset and panel fit |
| GRAPH-007 | Block 4 paging/tiles/neighborhood bounds and disconnected members |
| GRAPH-006 | Block 5 changed/control outputs, with exact Bell evidence reused |
| JOB-GRAPH-LAYOUT | Block 5 real run, version and stored/header/reopened totals |
| STAT-020 | Block 5 current comparison; retained historical proof reused |

## Execution boundary

Dedicated fixture orchestration is prepared when this checkpoint starts.
Fixtures prepare inputs and previous outcomes; they cannot fabricate evidence
of an untested loading, scheduler or materialization behavior.

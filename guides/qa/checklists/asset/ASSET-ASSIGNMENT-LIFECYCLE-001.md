# ASSET-ASSIGNMENT-LIFECYCLE-001 user test guide

This is the stable, repeatable guide for the consolidated Asset assignment
testcase. It is not an execution log: do not add current status, timestamps or
machine evidence to this file.

The normal Sub-event, generated-group mutation/unassign and independent
removed-manager cleanup branches are one testcase. The report phrases are
transaction savepoints, not separate matrix rows.

## Actors and startup

- **Casey** is Admin of both controlled Events. Casey performs only the Event
  administration action explicitly assigned to Casey.
- **Nova** is an accepted member of both Events and Group A. Nova owns the
  normal Transport and Accommodation Assets and the separate Group A
  Transport.
- **Riley** is an accepted member of both Events and Group A. Riley owns the
  shared normal Supplies Asset and the separate Group A Accommodation.
- **Lina** is the sole Group B member and owns its preconfigured Transport
  control. Lina is browserless; every Group B document and counter is an
  immutable negative control.
- Nova already has one accepted **Member** relation to Riley's shared Supplies
  Asset. Assignment must not create a duplicate Asset membership or change an
  Event/Group role.
- Use only the isolated Casey/Nova/Riley browser sessions configured for this
  checkpoint. Do not reuse Borrow, Checkout or Asset-member windows as
  evidence.
- This testcase performs no Borrow, checkout or payment action. Stop at the
  first mismatch; do not compensate with a second click, an ad-hoc API/Mongo
  write or repeated reload.

To start a complete replay, tell Codex:

`Continue ASSET-ASSIGNMENT-LIFECYCLE-001 from the staged baseline.`

Begin only after Codex runs the read-only status and confirms:

- phase `baseline-ready`;
- `QA ASSET-ASSIGNMENT-LIFECYCLE-001 Event` has `QA Assignment Stage` and the
  empty `QA Unchanged Control Stage`;
- the normal target has no resource record or resource counter yet;
- `QA ASSET-ASSIGNMENT-LIFECYCLE-001 Tournament → QA Assignment Groups`
  contains Group A (Casey, Nova, Riley) and Group B (Lina);
- Group A has Nova Transport `1 accepted / 1 pending / capacity 4` and Riley
  Accommodation `1 accepted / 1 pending / capacity 3`;
- Group B has Lina Transport `1 accepted / 0 pending / capacity 2`;
- the Tournament stage/root pending chain is exactly `2`, and no controlled
  notification was fabricated by staging.

## 1. Normal Sub-event: multi-type and multi-owner assignment

1. In each named actor's own browser, open:

   `Activities → Events → Active Events → QA ASSET-ASSIGNMENT-LIFECYCLE-001 Event → View Event → QA Assignment Stage → Resources`

2. Confirm the target identifies the exact Event and Sub-event. Confirm the
   adjacent `QA Unchanged Control Stage` remains empty. The control is not
   application-locked and may expose the same Assign action; do not use it.
   Its only purpose is to prove that Assignment Stage writes do not leak into
   a sibling Sub-event.
3. In **Nova's** owner-scoped resource editor, assign exactly once:

   - `QA Assignment Nova Shuttle`, Transport, route `Austin`, capacity `4`;
   - `QA Assignment Nova Lodge`, Accommodation, location `Austin`, capacity
     `3`;
   - `QA Assignment Shared Supplies`, Supplies contribution quantity `2` for
     Nova.

4. In **Riley's** owner-scoped resource editor, add exactly one Supplies
   contribution of quantity `3` to the same `QA Assignment Shared Supplies`
   Asset. Do not create another Asset.
5. Confirm the visible owner/type cards and badges show:

   | Viewer/owner scope | Transport | Accommodation | Supplies |
   | --- | --- | --- | --- |
   | Nova | `1 / 0 · 0-4` | `1 / 0 · 0-3` | `2 / 0 · 0-6` |
   | Riley | `0 / 0 · 0-0` | `0 / 0 · 0-0` | `3 / 0 · 0-6` |
   | Casey | `0 / 0 · 0-0` | `0 / 0 · 0-0` | `0 / 0 · 0-0` |

   These are persisted viewer values. Do not accept a result that appears
   only after opening a list, recomputing it in the frontend or copying
   another viewer's aggregate.
6. Close and reopen the resource popup once, then reload Casey, Nova and Riley
   once each. The same identities, routes, settings and quantities must
   reconstruct.
7. Confirm all three normal Event roles are unchanged, Nova's existing shared
   Supplies membership still exists exactly once, and no second Asset member
   record appeared.
8. Confirm `QA Unchanged Control Stage` remains all-zero and no Tournament
   Asset, resource, Group B row or Tournament counter changed.
9. Report and wait:

   `ASSET-ASSIGNMENT-LIFECYCLE-001 normal assignment complete: Nova T+A+2 Supplies, Riley 3 Supplies`

Codex must run `verify-normal-assignment` before the next branch.

## 2. Group A source-Asset capacity mutation

10. After Codex confirms `normal-verified`, in **Nova** open the ordinary Asset
    editor for `QA Group A Nova Transport`.
11. Change only its source Asset capacity from `4` to `5` and select **Save**
    exactly once. Do not edit the normal Nova Shuttle.
12. Without opening Group B, confirm Group A Nova Transport updates in place
    to `1 accepted / 1 pending / capacity 5`.
13. Close/reopen the Group A resource popup and reload Nova once. Confirm the
    persisted owner-scoped resource and Group A runtime still show capacity
    `5`.
14. Confirm Riley's Group A Accommodation remains `1 / 1 · 0-3`, the
    stage/root pending chain remains exactly `2`, the completed normal branch
    is unchanged, and all Group B state remains byte-identical.
15. Report and wait:

    `ASSET-ASSIGNMENT-LIFECYCLE-001 Group A capacity complete: Nova Transport 4 to 5 only`

Codex must run `verify-group-capacity-edit` before unassigning.

## 3. Group A unassign and exact counter reversal

16. After Codex confirms `group-capacity-verified`, open Group A's Transport
    resource editor and unassign only `QA Group A Nova Transport`. Confirm the
    destructive prompt exactly once.
17. Without reload, confirm Nova's Transport card/assignment disappears from
    Group A and its owner/type runtime value is zero. The source Asset itself
    remains active with capacity `5`.
18. Confirm the Tournament stage/root pending chain changes exactly `2 → 1`.
    It must not become `0`, because Riley's Group A Accommodation is still
    pending.
19. Confirm Riley's Group A resource, every Group B document/counter, the
    normal Event branch, all memberships and user activity counters remain
    unchanged.
20. Close/reopen and reload once. The removed assignment must not return and
    no read path may repair the persisted counter.
21. Report and wait:

    `ASSET-ASSIGNMENT-LIFECYCLE-001 Group A unassign complete: pending 2 to 1`

Codex must run `verify-group-unassign`, then the versioned
`restore-group-removal-branch` command. That command restores only the
Tournament branch to its exact staged state; it does not erase or fabricate
the completed normal branch.

## 4. Independent removed-manager cleanup

22. Continue only after Codex reports phase `group-removal-ready`, Group A
    pending `2`, and the normal branch preserved.
23. In **Casey**, open the **Tournament Event** Members surface and remove
    Riley exactly once. Do not remove Riley from the normal Event and do not
    use an Asset-member menu.
24. Confirm Riley leaves the Tournament parent and generated Group A member
    tree. Casey and Nova remain in Group A; Lina remains alone in Group B.
25. Confirm Riley's manager-owned Group A Accommodation assignment/settings
    are cleared and its runtime metric is zero. The source Accommodation Asset
    remains active.
26. Confirm Nova's restored Group A Transport remains exactly
    `1 / 1 · 0-4`. The stage/root pending chain changes exactly `2 → 1`.
27. Confirm all Group B records/counters are byte-identical and the normal
    Event still contains Casey, Nova and Riley with the previously verified
    assignments.
28. Confirm Riley receives at most the documented Event-removal notification;
    Assignment cleanup must not notify Casey, Nova, Lina or a former/outside
    participant as an unrelated recipient.
29. Close/reopen the Tournament and reload all three sessions once. Confirm
    the terminal state persists without duplicate removal, notification,
    resource, membership or counter deltas.
30. Report the terminal phrase:

    `ASSET-ASSIGNMENT-LIFECYCLE-001 UI complete: normal aggregation, Group A mutation, unassign and manager cleanup persist`

Wait for Codex's final exact persisted oracle. Do not reset or start another
checkpoint until its matrix result and next resume boundary are saved.

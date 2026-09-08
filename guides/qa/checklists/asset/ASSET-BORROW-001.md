# ASSET-BORROW-001 user test guide

This file is the tester's stable, repeatable guide. It is not an execution
log: do not add current status, timestamps or machine evidence to it.

The cancel, reject and accept/capacity branches are one consolidated testcase.
The report phrases below are savepoints inside that testcase, not separate
matrix rows.

This is the third Event/Asset payment-control combination: all three staged
Assets are genuinely free, so no Payment block, provider badge, Cash-only
recording action or card selector may appear. Cash-only paid behavior is owned
by `EVENT-CHECKOUT-001`; Barion is owned by
`ASSET-CHECKOUT-001`; Stripe is owned by the Event checkout journey.

This guide intentionally does not replay already-closed Asset coverage:

- `ASSET-ASSIGNMENT-LIFECYCLE-001` owns direct Assign/Edit/Unassign, resource
  generation replacement and contribution management. Do not use those actions
  here.
- `ASSET-CHECKOUT-001` owns generic Borrow-form bounds, paid request approval,
  persisted Payment summary, scoped Manager lifecycle, Take Over, Remove,
  Leave and refund. Do not repeat those actions here.
- `ASSET-MEMBER-LIFECYCLE-001` owns Invite/Join, promotion/revocation and
  general Asset-member permission rules. This case checks notifications and
  live counters only where the free Borrow transition itself creates them.

The remaining unique evidence is the zero-payment free request path, requester
Cancel, owner Reject, cross-group overlapping availability, a single free
approval without a second reservation, and its Asset Statistics delta.
Refund-policy disclosure and immutable payment-time policy snapshots belong to
the separate short
[`ASSET-REFUND-POLICY-SNAPSHOT-001`](ASSET-REFUND-POLICY-SNAPSHOT-001.md)
regression and are not executed in this free fixture.

## Actors and startup

- **Casey** owns all three controlled Public/free Transport Assets and is the
  Event Admin in generated Group A.
- **Nova** is the Group A requester for the cancel and accepted-capacity
  branches.
- **Riley** is the Group A requester for the owner-reject branch.
- **Lina** is the sole Group B control. Her already-accepted quantity `2`
  reservation on the Capacity Asset must remain unchanged; no fourth browser
  is required.
- The user exclusively opens and controls the configured isolated
  Casey/Nova/Riley browser sessions. Do not reuse old ASSET-MEMBER windows as
  evidence and do not create replacement data or profiles.
- This checkpoint exercises free Borrow only. It must not create a checkout
  session, payment, payment summary or inventory-applied reservation. The paid
  flow belongs to `ASSET-CHECKOUT-001`.
- Select each Send, Cancel, Reject and Approve confirmation exactly once. Stop
  at the first mismatch; do not compensate with a second action, an ad-hoc
  reload or an API/Mongo write.

To start a complete replay, tell Codex:

`Continue ASSET-BORROW-001 from the staged baseline.`

Begin only after Codex runs the read-only checkpoint status and confirms:

- phase `baseline-ready`, with the browser still unopened for this checkpoint;
- `QA ASSET-BORROW-001 Tournament → QA Borrow Stage` contains Group A
  (Casey, Nova, Riley) and Group B (Lina);
- Group A has no Transport resource assignment or pending request;
- Group B has exactly one accepted quantity `2` reservation for Lina on
  `QA ASSET-BORROW-001 Capacity Transport`;
- these three Casey-owned Public/free Sedan controls exist exactly once:

  | Asset | Stored quantity | Initial request state |
  | --- | ---: | --- |
  | `QA ASSET-BORROW-001 Capacity Transport` | `3` | Lina accepted `2` in the overlapping window |
  | `QA ASSET-BORROW-001 Reject Transport` | `2` | none |
  | `QA ASSET-BORROW-001 Cancel Transport` | `2` | none |

- the machine oracle provides the exact overlapping and non-overlapping ISO
  windows; use those values rather than inventing dates;
- no controlled notification/outbox effect exists after fixture staging.

## 1. Confirm Explore scope and overlap capacity

1. In **Nova**, open:

   `Activities → Events → Active Events → QA ASSET-BORROW-001 Tournament → View Event → QA Borrow Stage → Groups → Group A → Assets → Transport → + / Explore`

2. Confirm the Explore header identifies Group A and Transport. The three
   controlled Assets appear exactly once and belong to Casey.
3. Select the oracle's overlapping window. Confirm Capacity Transport shows
   exactly `1` available: stored quantity `3` minus Lina's overlapping
   quantity `2`.
4. Open its Borrow dialog only far enough to confirm the free action is
   `Send borrow request` and that no Payment/provider/card block appears. Close
   without sending. Do not repeat the generic date/quantity input-boundary
   checks already closed by `ASSET-CHECKOUT-001`.
5. Select the oracle's later non-overlapping window. Confirm Capacity
   Transport shows exactly `3` available. Return to the overlapping window.
6. Confirm Reject Transport and Cancel Transport each show `2` available and
   no payment action. Group B's resource state must not change merely because
   Group A reads or changes an Explore date filter.

## 2. Nova sends and cancels one free request

7. In **Nova**, open `QA ASSET-BORROW-001 Cancel Transport → Borrow` for the
   overlapping window, keep quantity `1`, and select `Send borrow request`
   exactly once.
8. Confirm the dialog closes normally. In Group A, the Transport resource and
   its pending chain appear exactly once; the Asset shows one pending request.
   Nova cannot send a duplicate request for the same Asset/scope.
9. In **Casey**, confirm exactly one new Borrow-request notification and one
   pending Nova row on Cancel Transport with the same Event, stage, generated
   Group A owner scope, timeframe and quantity `1`.
10. In **Nova**, open that own pending row and select `Cancel join request`,
    then confirm exactly once. The wording must not say `Leave asset`.
11. Without reload, confirm the pending row, Group A resource entry and entire
    pending red-counter chain disappear exactly once. Cancel Transport returns
    to availability `2`; Group B remains byte-for-byte unchanged.
12. Reload Nova and Casey once each and confirm no pending/accepted request,
    Asset membership, assignment or payment state reconstructs for this
    branch.
13. Report and wait:

    `ASSET-BORROW-001 cancel complete: Nova request removed once`

Codex must run `verify-borrow-cancel` before the Reject branch.

## 3. Riley sends and Casey rejects one free request

14. After Codex confirms the cancel boundary, in **Riley** send one quantity
    `1` request for `QA ASSET-BORROW-001 Reject Transport` in the overlapping
    window.
15. Confirm Group A and Casey receive exactly one pending delta. Group B and
    the other two Assets remain unchanged.
16. In **Casey**, open Reject Transport's pending Riley row, select `Reject
    request`, and confirm exactly once.
17. Confirm Riley's row and the scoped Group A resource/pending chain disappear
    in place. Reject Transport returns to availability `2`.
18. In **Riley**, confirm exactly one rejection notification. Riley gains no
    Asset Manager, Event Admin or generated-group role.
19. Reload Casey and Riley once each and confirm the rejected request does not
    return and no duplicate notification exists.
20. Report and wait:

    `ASSET-BORROW-001 reject complete: Riley rejected once and scope cleared`

Codex must run `verify-borrow-reject` before the accepted Capacity branch.

## 4. Nova requests the overlapping Capacity item and Casey accepts

21. After Codex confirms the reject boundary, record Capacity Transport's
    Asset Statistics. The fixture control contributes exactly one accepted
    borrowed item before this branch; record every displayed total used by the
    Statistics surface.
22. In **Nova**, select the overlapping window and send one quantity `1`
    request for Capacity Transport. Confirm its availability becomes `0` for
    this window, while the later non-overlapping window remains `3`.
23. In **Casey**, confirm one pending Nova row with the exact Asset, Group A
    owner scope, stage, timeframe and quantity. Select `Approve`, then confirm
    exactly once.
24. Without reload, confirm the row changes from pending to accepted exactly
    once and the pending red-counter chain clears. Availability remains `0`
    in the overlapping window; approval must not reserve the same quantity
    again.
25. In Group A, confirm the accepted Transport resource identifies Capacity
    Transport once with Nova's quantity `1`. In Group B, Lina's accepted
    quantity `2` control remains unchanged.
26. Confirm Nova is the scoped `Manager` of this exact generated-group Asset
    assignment, because she is its current responsible borrower. This does not
    make her the global Asset owner, Event Admin, generated-group Admin or a
    member of another Tournament group. Do not exercise Manager lifecycle
    actions; those are already closed by `ASSET-CHECKOUT-001` and
    `ASSET-MEMBER-LIFECYCLE-001`.
27. Reopen Capacity Transport Statistics. Accepted borrowed-item count changes
    exactly `1 → 2`; occupied quantity changes exactly `2 → 3`; assigned and
    pending counts do not gain an unrelated delta.
28. Confirm Nova receives exactly one acceptance notification. No checkout,
    payment session, payment summary or `inventoryApplied=true` record exists.
29. Report and wait:

    `ASSET-BORROW-001 accepted: Group A quantity 1, Group B quantity 2, occupied 3`

Codex must run `verify-borrow-accepted` before the terminal reload.

## 5. Reload and terminal isolation

30. After Codex confirms the accepted boundary, reload Casey and Nova exactly
    once each. Riley's rejected branch was already reloaded at step 19; do not
    reload it again merely to duplicate persistence coverage.
31. Reopen the same Event/stage/groups. Confirm Group A retains Nova's exact
    accepted Capacity resource and Group B retains Lina's control; Reject and
    Cancel branches remain absent.
32. Recheck the overlapping and later windows: Capacity Transport is `0`
    versus `3`, respectively. No quantity, request or member row is duplicated.
33. Confirm Event roles and both generated-group member lists match the
    baseline exactly. Nova remains only the exact Asset assignment's scoped
    Manager; Borrow created no global ownership or Event/group role.
34. Confirm Statistics still reports the exact accepted delta and all
    controlled notifications occur once.
35. Report the terminal phrase:

    `ASSET-BORROW-001 UI complete: cancel, reject, accept, capacity and Statistics persist`

Wait for Codex's final persisted and exact-scope oracle. Do not reset or begin
another testcase until the matrix result and next resume boundary are saved.
Codex runs `verify-borrow-terminal` only after the terminal phrase.
